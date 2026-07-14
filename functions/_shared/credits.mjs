import { allocateCreditConsumption } from './credit-allocation.mjs';

const NEW_USER_CREDITS = 10;

function nowIso(now = new Date()) {
  return now.toISOString();
}

function createId(prefix) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, '')}`;
}

function serializeMetadata(metadata) {
  return metadata ? JSON.stringify(metadata) : null;
}

async function ensureCreditAccount(env, userId, now) {
  await env.DB.prepare(`
    insert into credit_accounts (user_id, balance, created_at, updated_at)
    values (?, 0, ?, ?)
    on conflict(user_id) do nothing
  `).bind(userId, now, now).run();
}

async function readBalance(env, userId) {
  const account = await env.DB.prepare(`
    select balance
    from credit_accounts
    where user_id = ?
  `).bind(userId).first();

  return account?.balance ?? 0;
}

export async function grantNewUserCredits(env, userId) {
  const now = nowIso();

  await ensureCreditAccount(env, userId, now);

  const transaction = await env.DB.prepare(`
    insert into credit_transactions (id, user_id, type, amount, balance_after, reason, description, created_at)
    select ?, ?, 'grant', ?, balance + ?, 'new_user_bonus', ?, ?
    from credit_accounts
    where user_id = ?
    on conflict do nothing
  `).bind(
    createId('credit_txn'),
    userId,
    NEW_USER_CREDITS,
    NEW_USER_CREDITS,
    'New user bonus',
    now,
    userId
  ).run();

  if (transaction?.meta?.changes !== 1) return false;

  await env.DB.prepare(`
    update credit_accounts
    set balance = balance + ?, updated_at = ?
    where user_id = ?
  `).bind(NEW_USER_CREDITS, now, userId).run();

  return true;
}

export async function grantCredits(env, userId, amount, options = {}) {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error('Credit amount must be a positive integer');
  }

  const requestId = String(options.requestId || '').trim();
  if (!requestId) {
    throw new Error('Credit grant requestId is required');
  }

  const expiresAt = options.expiresAt == null ? null : String(options.expiresAt);
  if (expiresAt && !Number.isFinite(Date.parse(expiresAt))) {
    throw new Error('Credit grant expiresAt must be a valid ISO date');
  }

  const now = nowIso();
  const reason = options.reason || 'admin_grant';
  const description = options.description || 'Admin credit grant';
  const metadata = serializeMetadata(options.metadata);

  await ensureCreditAccount(env, userId, now);

  const existing = await env.DB.prepare(`
    select id, user_id, original_amount, expires_at
    from credit_grants
    where request_id = ?
  `).bind(requestId).first();

  if (existing) {
    if (existing.user_id !== userId) {
      throw new Error('Credit grant requestId already belongs to another user');
    }

    return {
      ok: true,
      grantId: existing.id,
      balance: await readBalance(env, userId),
      amount: existing.original_amount,
      expiresAt: existing.expires_at,
      duplicate: true,
    };
  }

  const grantId = createId('credit_grant');
  const insertResult = await env.DB.prepare(`
    insert into credit_grants (
      id, request_id, user_id, original_amount, remaining_amount,
      expires_at, reason, description, metadata, created_at, updated_at
    )
    values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    on conflict(request_id) do nothing
  `).bind(
    grantId,
    requestId,
    userId,
    amount,
    amount,
    expiresAt,
    reason,
    description,
    metadata,
    now,
    now
  ).run();

  if (insertResult?.meta?.changes !== 1) {
    return grantCredits(env, userId, amount, options);
  }

  await env.DB.prepare(`
    update credit_accounts
    set balance = balance + ?, updated_at = ?
    where user_id = ?
  `).bind(amount, now, userId).run();

  const balance = await readBalance(env, userId);
  await env.DB.prepare(`
    insert into credit_transactions (
      id, user_id, type, amount, balance_after,
      reason, description, metadata, created_at
    )
    values (?, ?, 'grant', ?, ?, ?, ?, ?, ?)
  `).bind(
    createId('credit_txn'),
    userId,
    amount,
    balance,
    reason,
    description,
    serializeMetadata({
      ...(options.metadata || {}),
      requestId,
      grantId,
      expiresAt,
    }),
    now
  ).run();

  return {
    ok: true,
    grantId,
    balance,
    amount,
    expiresAt,
    duplicate: false,
  };
}

export async function expireCredits(env, userId, currentTime = new Date()) {
  const now = nowIso(currentTime);
  await ensureCreditAccount(env, userId, now);

  const result = await env.DB.prepare(`
    select id, remaining_amount
    from credit_grants
    where user_id = ?
      and remaining_amount > 0
      and expires_at is not null
      and expires_at <= ?
    order by expires_at asc, created_at asc
  `).bind(userId, now).all();

  let expired = 0;
  const grantIds = [];

  for (const grant of result?.results || []) {
    const amount = Number(grant.remaining_amount) || 0;
    if (amount <= 0) continue;

    const update = await env.DB.prepare(`
      update credit_grants
      set remaining_amount = 0, updated_at = ?
      where id = ? and user_id = ? and remaining_amount = ?
    `).bind(now, grant.id, userId, amount).run();

    if (update?.meta?.changes !== 1) continue;
    expired += amount;
    grantIds.push(grant.id);
  }

  if (expired === 0) {
    return {
      ok: true,
      expired: 0,
      balance: await readBalance(env, userId),
    };
  }

  await env.DB.prepare(`
    update credit_accounts
    set balance = max(balance - ?, 0), updated_at = ?
    where user_id = ?
  `).bind(expired, now, userId).run();

  const balance = await readBalance(env, userId);
  await env.DB.prepare(`
    insert into credit_transactions (
      id, user_id, type, amount, balance_after,
      reason, description, metadata, created_at
    )
    values (?, ?, 'adjustment', ?, ?, 'credit_expired', ?, ?, ?)
  `).bind(
    createId('credit_txn'),
    userId,
    -expired,
    balance,
    'Credit grant expired',
    serializeMetadata({ grantIds }),
    now
  ).run();

  return {
    ok: true,
    expired,
    balance,
  };
}

export async function getCreditSummary(env, userId, limit = 10) {
  await expireCredits(env, userId);

  const balance = await readBalance(env, userId);
  const result = await env.DB.prepare(`
    select id, type, amount, balance_after, reason, description, created_at
    from credit_transactions
    where user_id = ?
    order by created_at desc
    limit ?
  `).bind(userId, limit).all();

  return {
    balance,
    transactions: (result?.results || []).map((row) => ({
      id: row.id,
      type: row.type,
      amount: row.amount,
      balanceAfter: row.balance_after,
      reason: row.reason,
      description: row.description,
      createdAt: row.created_at,
    })),
  };
}

export async function consumeCredits(env, userId, amount, options = {}) {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error('Credit amount must be a positive integer');
  }

  await expireCredits(env, userId);

  const now = nowIso();
  const reason = options.reason || 'image_generation';
  const description = options.description || 'Image generation';
  const metadata = serializeMetadata(options.metadata);

  await ensureCreditAccount(env, userId, now);

  const updateResult = await env.DB.prepare(`
    update credit_accounts
    set balance = balance - ?, updated_at = ?
    where user_id = ? and balance >= ?
  `).bind(amount, now, userId, amount).run();

  if (updateResult?.meta?.changes !== 1) {
    return {
      ok: false,
      balance: await readBalance(env, userId),
      required: amount,
    };
  }

  const grantsResult = await env.DB.prepare(`
    select id, remaining_amount, expires_at
    from credit_grants
    where user_id = ?
      and remaining_amount > 0
      and (expires_at is null or expires_at > ?)
    order by
      case when expires_at is null then 1 else 0 end,
      expires_at asc,
      created_at asc
  `).bind(userId, now).all();

  const allocation = allocateCreditConsumption(
    (grantsResult?.results || []).map((grant) => ({
      id: grant.id,
      remainingAmount: grant.remaining_amount,
      expiresAt: grant.expires_at,
    })),
    amount
  );

  const appliedGrants = [];
  let permanentAmount = allocation.permanentAmount;

  for (const grant of allocation.grants) {
    const update = await env.DB.prepare(`
      update credit_grants
      set remaining_amount = remaining_amount - ?, updated_at = ?
      where id = ? and user_id = ? and remaining_amount >= ?
    `).bind(grant.amount, now, grant.grantId, userId, grant.amount).run();

    if (update?.meta?.changes !== 1) {
      permanentAmount += grant.amount;
      continue;
    }

    appliedGrants.push(grant);
  }

  const balance = await readBalance(env, userId);
  const transactionId = createId('credit_txn');
  const consumptionId = createId('credit_cons');

  await env.DB.prepare(`
    insert into credit_transactions (
      id, user_id, type, amount, balance_after,
      reason, description, metadata, created_at
    )
    values (?, ?, 'use', ?, ?, ?, ?, ?, ?)
  `).bind(
    transactionId,
    userId,
    -amount,
    balance,
    reason,
    description,
    metadata,
    now
  ).run();

  await env.DB.prepare(`
    insert into credit_consumptions (
      id, user_id, transaction_id, total_amount,
      permanent_amount, refunded_permanent_amount,
      created_at, updated_at
    )
    values (?, ?, ?, ?, ?, 0, ?, ?)
  `).bind(
    consumptionId,
    userId,
    transactionId,
    amount,
    permanentAmount,
    now,
    now
  ).run();

  for (const grant of appliedGrants) {
    await env.DB.prepare(`
      insert into credit_consumption_grants (
        consumption_id, grant_id, amount, refunded_amount
      )
      values (?, ?, ?, 0)
    `).bind(consumptionId, grant.grantId, grant.amount).run();
  }

  return {
    ok: true,
    balance,
    required: amount,
    consumptionId,
  };
}

async function refundTrackedConsumption(env, userId, amount, options, now) {
  const consumption = await env.DB.prepare(`
    select id, total_amount, permanent_amount, refunded_permanent_amount
    from credit_consumptions
    where id = ? and user_id = ?
  `).bind(options.consumptionId, userId).first();

  if (!consumption) {
    return {
      ok: true,
      balance: await readBalance(env, userId),
      refunded: 0,
    };
  }

  const allocations = await env.DB.prepare(`
    select
      ccg.grant_id,
      ccg.amount,
      ccg.refunded_amount,
      cg.expires_at
    from credit_consumption_grants ccg
    join credit_grants cg on cg.id = ccg.grant_id
    where ccg.consumption_id = ?
    order by
      case when cg.expires_at is null then 1 else 0 end,
      cg.expires_at asc,
      cg.created_at asc
  `).bind(consumption.id).all();

  let remaining = amount;
  let restored = 0;
  let expired = 0;

  for (const allocation of allocations?.results || []) {
    if (remaining === 0) break;

    const refundable = Math.max(
      0,
      Number(allocation.amount) - Number(allocation.refunded_amount || 0)
    );
    const refundAmount = Math.min(refundable, remaining);
    if (refundAmount <= 0) continue;

    await env.DB.prepare(`
      update credit_consumption_grants
      set refunded_amount = refunded_amount + ?
      where consumption_id = ? and grant_id = ?
        and refunded_amount + ? <= amount
    `).bind(
      refundAmount,
      consumption.id,
      allocation.grant_id,
      refundAmount
    ).run();

    const isExpired = allocation.expires_at
      && Date.parse(allocation.expires_at) <= Date.parse(now);

    if (isExpired) {
      expired += refundAmount;
    } else {
      await env.DB.prepare(`
        update credit_grants
        set remaining_amount = remaining_amount + ?, updated_at = ?
        where id = ? and user_id = ?
      `).bind(refundAmount, now, allocation.grant_id, userId).run();
      restored += refundAmount;
    }

    remaining -= refundAmount;
  }

  const permanentAvailable = Math.max(
    0,
    Number(consumption.permanent_amount)
      - Number(consumption.refunded_permanent_amount || 0)
  );
  const permanentRefund = Math.min(permanentAvailable, remaining);

  if (permanentRefund > 0) {
    await env.DB.prepare(`
      update credit_consumptions
      set refunded_permanent_amount = refunded_permanent_amount + ?,
          updated_at = ?
      where id = ? and user_id = ?
        and refunded_permanent_amount + ? <= permanent_amount
    `).bind(
      permanentRefund,
      now,
      consumption.id,
      userId,
      permanentRefund
    ).run();
    restored += permanentRefund;
  }

  if (restored > 0) {
    await env.DB.prepare(`
      update credit_accounts
      set balance = balance + ?, updated_at = ?
      where user_id = ?
    `).bind(restored, now, userId).run();
  }

  const balance = await readBalance(env, userId);
  if (restored === 0 && expired === 0) {
    return {
      ok: true,
      balance,
      refunded: 0,
    };
  }

  const reason = options.reason || 'image_generation_refund';
  const description = options.description || 'Image generation refund';

  await env.DB.prepare(`
    insert into credit_transactions (
      id, user_id, type, amount, balance_after,
      reason, description, metadata, created_at
    )
    values (?, ?, 'refund', ?, ?, ?, ?, ?, ?)
  `).bind(
    createId('credit_txn'),
    userId,
    restored,
    balance,
    reason,
    description,
    serializeMetadata({
      ...(options.metadata || {}),
      consumptionId: consumption.id,
      expiredAmount: expired,
    }),
    now
  ).run();

  return {
    ok: true,
    balance,
    refunded: restored,
  };
}

export async function refundCredits(env, userId, amount, options = {}) {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error('Credit amount must be a positive integer');
  }

  const now = nowIso();
  await ensureCreditAccount(env, userId, now);

  if (options.consumptionId) {
    return refundTrackedConsumption(env, userId, amount, options, now);
  }

  const reason = options.reason || 'image_generation_refund';
  const description = options.description || 'Image generation refund';
  const metadata = serializeMetadata(options.metadata);

  await env.DB.prepare(`
    update credit_accounts
    set balance = balance + ?, updated_at = ?
    where user_id = ?
  `).bind(amount, now, userId).run();

  const balance = await readBalance(env, userId);

  await env.DB.prepare(`
    insert into credit_transactions (
      id, user_id, type, amount, balance_after,
      reason, description, metadata, created_at
    )
    values (?, ?, 'refund', ?, ?, ?, ?, ?, ?)
  `).bind(
    createId('credit_txn'),
    userId,
    amount,
    balance,
    reason,
    description,
    metadata,
    now
  ).run();

  return {
    ok: true,
    balance,
    refunded: amount,
  };
}
