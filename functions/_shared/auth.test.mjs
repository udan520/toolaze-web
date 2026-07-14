import test from 'node:test';
import assert from 'node:assert/strict';
import { getSafeReturnTo } from './http.mjs';
import {
  base64UrlEncodeBytes,
  base64UrlEncodeText,
  createSignedState,
  readSignedState,
  sha256Hex,
} from './crypto.mjs';
import {
  OAUTH_STATE_COOKIE_NAME,
  createClearSessionCookie,
  createClearOAuthStateCookie,
  createGoogleAuthRedirectUrl,
  createOAuthStateCookie,
  createSession,
  createSessionCookie,
  deleteCurrentSession,
  exchangeGoogleCode,
  getCurrentUser,
  parseCookies,
  readOAuthState,
  upsertUser,
  verifyGoogleIdToken,
} from './auth.mjs';
import {
  getTodayDate,
  getUsageSummary,
  releaseFreeGeneration,
  reserveFreeGeneration,
} from './quota.mjs';
import {
  consumeCredits,
  expireCredits,
  getCreditSummary,
  grantCredits,
  grantNewUserCredits,
  refundCredits,
} from './credits.mjs';
import {
  createGenerationHistoryItem,
  deleteGenerationHistoryItem,
  listGenerationHistory,
} from './generation-history.mjs';

class FakeD1 {
  constructor() {
    this.users = [];
    this.sessions = [];
    this.usageDaily = [];
    this.creditAccounts = [];
    this.creditTransactions = [];
    this.creditGrants = [];
    this.creditConsumptions = [];
    this.creditConsumptionGrants = [];
    this.generationHistory = [];
  }

  prepare(sql) {
    return new FakeD1Statement(this, sql);
  }
}

class FakeD1Statement {
  constructor(db, sql) {
    this.db = db;
    this.sql = sql;
    this.values = [];
  }

  bind(...values) {
    this.values = values;
    return this;
  }

  async first() {
    const normalized = normalizeSql(this.sql);

    if (normalized.includes('from users') && normalized.includes('where google_sub = ?')) {
      return this.db.users.find((user) => user.google_sub === this.values[0]) || null;
    }

    if (normalized.includes('from sessions') && normalized.includes('join users')) {
      const session = this.db.sessions.find((item) => item.token_hash === this.values[0]);
      if (!session) return null;

      const user = this.db.users.find((item) => item.id === session.user_id);
      if (!user) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
        session_id: session.id,
        expires_at: session.expires_at,
      };
    }

    if (normalized.includes('select image_count') && normalized.includes('from usage_daily')) {
      const [userId, usageDate] = this.values;
      const row = this.db.usageDaily.find((item) => (
        item.user_id === userId && item.usage_date === usageDate
      ));
      return row ? { image_count: row.image_count } : null;
    }

    if (normalized.includes('from credit_transactions') && normalized.includes("reason = 'new_user_bonus'")) {
      const [userId] = this.values;
      const row = this.db.creditTransactions.find((item) => (
        item.user_id === userId && item.type === 'grant' && item.reason === 'new_user_bonus'
      ));
      return row ? { id: row.id } : null;
    }

    if (normalized.includes('select balance') && normalized.includes('from credit_accounts')) {
      const [userId] = this.values;
      const row = this.db.creditAccounts.find((item) => item.user_id === userId);
      return row ? { balance: row.balance } : null;
    }

    if (normalized.includes('from credit_grants') && normalized.includes('where request_id = ?')) {
      const [requestId] = this.values;
      const row = this.db.creditGrants.find((item) => item.request_id === requestId);
      return row ? {
        id: row.id,
        user_id: row.user_id,
        original_amount: row.original_amount,
        expires_at: row.expires_at,
      } : null;
    }

    if (normalized.includes('from credit_consumptions') && normalized.includes('where id = ? and user_id = ?')) {
      const [id, userId] = this.values;
      const row = this.db.creditConsumptions.find((item) => (
        item.id === id && item.user_id === userId
      ));
      return row ? {
        id: row.id,
        total_amount: row.total_amount,
        permanent_amount: row.permanent_amount,
        refunded_permanent_amount: row.refunded_permanent_amount,
      } : null;
    }

    throw new Error(`Unhandled first SQL: ${this.sql}`);
  }

  async all() {
    const normalized = normalizeSql(this.sql);

    if (normalized.includes('from credit_transactions')) {
      const [userId, limit] = this.values;
      const rows = this.db.creditTransactions
        .filter((item) => item.user_id === userId)
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .slice(0, limit)
        .map((row) => ({
          id: row.id,
          type: row.type,
          amount: row.amount,
          balance_after: row.balance_after,
          reason: row.reason,
          description: row.description,
          created_at: row.created_at,
        }));
      return { results: rows };
    }

    if (normalized.includes('from credit_consumption_grants ccg')) {
      const [consumptionId] = this.values;
      const rows = this.db.creditConsumptionGrants
        .filter((item) => item.consumption_id === consumptionId)
        .map((item) => {
          const grant = this.db.creditGrants.find((candidate) => candidate.id === item.grant_id);
          return {
            grant_id: item.grant_id,
            amount: item.amount,
            refunded_amount: item.refunded_amount,
            expires_at: grant?.expires_at ?? null,
            created_at: grant?.created_at ?? '',
          };
        })
        .sort((left, right) => {
          if (left.expires_at && right.expires_at) {
            return left.expires_at.localeCompare(right.expires_at);
          }
          if (left.expires_at) return -1;
          if (right.expires_at) return 1;
          return left.created_at.localeCompare(right.created_at);
        });
      return { results: rows };
    }

    if (normalized.includes('from credit_grants') && normalized.includes('expires_at <= ?')) {
      const [userId, now] = this.values;
      const rows = this.db.creditGrants
        .filter((item) => (
          item.user_id === userId
          && item.remaining_amount > 0
          && item.expires_at
          && item.expires_at <= now
        ))
        .sort((left, right) => (
          left.expires_at.localeCompare(right.expires_at)
          || left.created_at.localeCompare(right.created_at)
        ))
        .map((row) => ({
          id: row.id,
          remaining_amount: row.remaining_amount,
        }));
      return { results: rows };
    }

    if (normalized.includes('from credit_grants') && normalized.includes('(expires_at is null or expires_at > ?)')) {
      const [userId, now] = this.values;
      const rows = this.db.creditGrants
        .filter((item) => (
          item.user_id === userId
          && item.remaining_amount > 0
          && (!item.expires_at || item.expires_at > now)
        ))
        .sort((left, right) => {
          if (left.expires_at && right.expires_at) {
            return left.expires_at.localeCompare(right.expires_at)
              || left.created_at.localeCompare(right.created_at);
          }
          if (left.expires_at) return -1;
          if (right.expires_at) return 1;
          return left.created_at.localeCompare(right.created_at);
        })
        .map((row) => ({
          id: row.id,
          remaining_amount: row.remaining_amount,
          expires_at: row.expires_at,
        }));
      return { results: rows };
    }

    if (normalized.includes('from generation_history')) {
      const [userId, limit] = this.values;
      const rows = this.db.generationHistory
        .filter((item) => item.user_id === userId)
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .slice(0, limit)
        .map((row) => ({
          id: row.id,
          media_type: row.media_type,
          model: row.model,
          prompt: row.prompt,
          output_url: row.output_url,
          input_urls: row.input_urls,
          aspect_ratio: row.aspect_ratio,
          resolution: row.resolution,
          output_format: row.output_format,
          tool_slug: row.tool_slug,
          tool_label: row.tool_label,
          source_path: row.source_path,
          created_at: row.created_at,
        }));
      return { results: rows };
    }

    throw new Error(`Unhandled all SQL: ${this.sql}`);
  }

  async run() {
    const normalized = normalizeSql(this.sql);

    if (normalized.startsWith('insert into users')) {
      assert.equal(this.values.length, 7);
      const [id, googleSub, email, name, avatarUrl, createdAt, updatedAt] = this.values;
      if (this.db.users.some((user) => user.google_sub === googleSub)) {
        throw new Error(`Unique constraint failed: users.google_sub ${googleSub}`);
      }
      this.db.users.push({
        id,
        google_sub: googleSub,
        email,
        name,
        avatar_url: avatarUrl,
        created_at: createdAt,
        updated_at: updatedAt,
      });
      return { success: true };
    }

    if (normalized.startsWith('update users')) {
      const [email, name, avatarUrl, updatedAt, googleSub] = this.values;
      const user = this.db.users.find((item) => item.google_sub === googleSub);
      if (user) Object.assign(user, { email, name, avatar_url: avatarUrl, updated_at: updatedAt });
      return { success: true };
    }

    if (normalized.startsWith('insert into sessions')) {
      const [id, userId, tokenHash, expiresAt, now] = this.values;
      this.db.sessions.push({
        id,
        user_id: userId,
        token_hash: tokenHash,
        expires_at: expiresAt,
        created_at: now,
      });
      return { success: true };
    }

    if (normalized.startsWith('delete from sessions')) {
      const [tokenHash] = this.values;
      this.db.sessions = this.db.sessions.filter((session) => session.token_hash !== tokenHash);
      return { success: true };
    }

    if (normalized.startsWith('insert into usage_daily')) {
      assert.equal(this.values.length, 5);
      const [id, userId, usageDate, createdAt, updatedAt] = this.values;
      assert.match(id, /^usage_[a-f0-9]{32}$/);
      assert.match(createdAt, /^\d{4}-\d{2}-\d{2}T/);
      assert.equal(updatedAt, createdAt);
      const exists = this.db.usageDaily.some((row) => (
        row.user_id === userId && row.usage_date === usageDate
      ));
      if (!exists) {
        this.db.usageDaily.push({
          id,
          user_id: userId,
          usage_date: usageDate,
          image_count: 0,
          created_at: createdAt,
          updated_at: updatedAt,
        });
      }
      return { success: true, meta: { changes: exists ? 0 : 1 } };
    }

    if (normalized.startsWith('insert into credit_accounts')) {
      assert.equal(this.values.length, 3);
      const [userId, createdAt, updatedAt] = this.values;
      const exists = this.db.creditAccounts.some((row) => row.user_id === userId);
      if (!exists) {
        this.db.creditAccounts.push({
          user_id: userId,
          balance: 0,
          created_at: createdAt,
          updated_at: updatedAt,
        });
      }
      return { success: true, meta: { changes: exists ? 0 : 1 } };
    }

    if (normalized.startsWith('update credit_accounts')) {
      assert.ok(this.values.length === 3 || this.values.length === 4);
      const [amount, updatedAt, userId] = this.values;
      const row = this.db.creditAccounts.find((item) => item.user_id === userId);
      if (this.values.length === 4 && (!row || row.balance < this.values[3])) {
        return { success: true, meta: { changes: 0 } };
      }
      if (row) {
        if (normalized.includes('balance = max(balance - ?, 0)')) {
          row.balance = Math.max(row.balance - amount, 0);
        } else if (normalized.includes('balance = balance - ?')) {
          row.balance -= amount;
        } else {
          row.balance += amount;
        }
        row.updated_at = updatedAt;
      }
      return { success: true, meta: { changes: row ? 1 : 0 } };
    }

    if (normalized.startsWith('insert into credit_grants')) {
      assert.equal(this.values.length, 11);
      const [
        id,
        requestId,
        userId,
        originalAmount,
        remainingAmount,
        expiresAt,
        reason,
        description,
        metadata,
        createdAt,
        updatedAt,
      ] = this.values;
      const exists = this.db.creditGrants.some((item) => item.request_id === requestId);
      if (exists) return { success: true, meta: { changes: 0 } };
      this.db.creditGrants.push({
        id,
        request_id: requestId,
        user_id: userId,
        original_amount: originalAmount,
        remaining_amount: remainingAmount,
        expires_at: expiresAt,
        reason,
        description,
        metadata,
        created_at: createdAt,
        updated_at: updatedAt,
      });
      return { success: true, meta: { changes: 1 } };
    }

    if (normalized.startsWith('update credit_grants')) {
      if (normalized.includes('set remaining_amount = 0')) {
        const [updatedAt, id, userId, expectedAmount] = this.values;
        const row = this.db.creditGrants.find((item) => (
          item.id === id
          && item.user_id === userId
          && item.remaining_amount === expectedAmount
        ));
        if (!row) return { success: true, meta: { changes: 0 } };
        row.remaining_amount = 0;
        row.updated_at = updatedAt;
        return { success: true, meta: { changes: 1 } };
      }

      if (normalized.includes('remaining_amount = remaining_amount - ?')) {
        const [amount, updatedAt, id, userId, requiredAmount] = this.values;
        const row = this.db.creditGrants.find((item) => (
          item.id === id
          && item.user_id === userId
          && item.remaining_amount >= requiredAmount
        ));
        if (!row) return { success: true, meta: { changes: 0 } };
        row.remaining_amount -= amount;
        row.updated_at = updatedAt;
        return { success: true, meta: { changes: 1 } };
      }

      if (normalized.includes('remaining_amount = remaining_amount + ?')) {
        const [amount, updatedAt, id, userId] = this.values;
        const row = this.db.creditGrants.find((item) => (
          item.id === id && item.user_id === userId
        ));
        if (!row) return { success: true, meta: { changes: 0 } };
        row.remaining_amount += amount;
        row.updated_at = updatedAt;
        return { success: true, meta: { changes: 1 } };
      }
    }

    if (normalized.startsWith('insert into credit_transactions')) {
      assert.ok(this.values.length === 7 || this.values.length === 8);
      const [id, userId, amount] = this.values;
      assert.match(id, /^credit_txn_[a-f0-9]{32}$/);
      const isNewUserBonus = normalized.includes('select ?, ?,');
      const accountUserId = isNewUserBonus ? this.values[6] : userId;
      assert.equal(accountUserId, userId);
      const account = this.db.creditAccounts.find((item) => item.user_id === accountUserId);
      if (!account) return { success: true, meta: { changes: 0 } };
      if (!isNewUserBonus) {
        const isExpiration = normalized.includes("'credit_expired'");
        const balanceAfter = this.values[3];
        const reason = isExpiration ? 'credit_expired' : this.values[4];
        const description = isExpiration ? this.values[4] : this.values[5];
        const metadata = isExpiration ? this.values[5] : this.values[6];
        const createdAt = isExpiration ? this.values[6] : this.values[7];
        const type = normalized.includes("'refund'")
          ? 'refund'
          : normalized.includes("'adjustment'")
            ? 'adjustment'
            : normalized.includes("'grant'")
              ? 'grant'
              : 'use';
        this.db.creditTransactions.push({
          id,
          user_id: userId,
          type,
          amount,
          balance_after: balanceAfter,
          reason,
          description,
          metadata,
          created_at: createdAt,
        });
        return { success: true, meta: { changes: 1 } };
      }
      const [, , , balanceDelta, description, createdAt] = this.values;
      const exists = this.db.creditTransactions.some((item) => (
        item.user_id === userId && item.reason === 'new_user_bonus'
      ));
      if (exists) return { success: true, meta: { changes: 0 } };
      this.db.creditTransactions.push({
        id,
        user_id: userId,
        type: 'grant',
        amount,
        balance_after: account.balance + balanceDelta,
        reason: 'new_user_bonus',
        description,
        created_at: createdAt,
      });
      return { success: true, meta: { changes: 1 } };
    }

    if (normalized.startsWith('insert into credit_consumptions')) {
      assert.equal(this.values.length, 7);
      const [
        id,
        userId,
        transactionId,
        totalAmount,
        permanentAmount,
        createdAt,
        updatedAt,
      ] = this.values;
      this.db.creditConsumptions.push({
        id,
        user_id: userId,
        transaction_id: transactionId,
        total_amount: totalAmount,
        permanent_amount: permanentAmount,
        refunded_permanent_amount: 0,
        created_at: createdAt,
        updated_at: updatedAt,
      });
      return { success: true, meta: { changes: 1 } };
    }

    if (normalized.startsWith('insert into credit_consumption_grants')) {
      assert.equal(this.values.length, 3);
      const [consumptionId, grantId, amount] = this.values;
      this.db.creditConsumptionGrants.push({
        consumption_id: consumptionId,
        grant_id: grantId,
        amount,
        refunded_amount: 0,
      });
      return { success: true, meta: { changes: 1 } };
    }

    if (normalized.startsWith('update credit_consumption_grants')) {
      const [amount, consumptionId, grantId, guardAmount] = this.values;
      const row = this.db.creditConsumptionGrants.find((item) => (
        item.consumption_id === consumptionId
        && item.grant_id === grantId
        && item.refunded_amount + guardAmount <= item.amount
      ));
      if (!row) return { success: true, meta: { changes: 0 } };
      row.refunded_amount += amount;
      return { success: true, meta: { changes: 1 } };
    }

    if (normalized.startsWith('update credit_consumptions')) {
      const [amount, updatedAt, id, userId, guardAmount] = this.values;
      const row = this.db.creditConsumptions.find((item) => (
        item.id === id
        && item.user_id === userId
        && item.refunded_permanent_amount + guardAmount <= item.permanent_amount
      ));
      if (!row) return { success: true, meta: { changes: 0 } };
      row.refunded_permanent_amount += amount;
      row.updated_at = updatedAt;
      return { success: true, meta: { changes: 1 } };
    }

    if (normalized.startsWith('insert into generation_history')) {
      assert.equal(this.values.length, 14);
      const [
        id,
        userId,
        mediaType,
        model,
        prompt,
        outputUrl,
        inputUrls,
        aspectRatio,
        resolution,
        outputFormat,
        toolSlug,
        toolLabel,
        sourcePath,
        createdAt,
      ] = this.values;
      assert.match(id, /^gen_[a-f0-9]{32}$/);
      assert.match(createdAt, /^\d{4}-\d{2}-\d{2}T/);
      this.db.generationHistory.push({
        id,
        user_id: userId,
        media_type: mediaType,
        model,
        prompt,
        output_url: outputUrl,
        input_urls: inputUrls,
        aspect_ratio: aspectRatio,
        resolution,
        output_format: outputFormat,
        tool_slug: toolSlug,
        tool_label: toolLabel,
        source_path: sourcePath,
        created_at: createdAt,
      });
      return { success: true, meta: { changes: 1 } };
    }

    if (normalized.startsWith('delete from generation_history')) {
      assert.equal(this.values.length, 2);
      const [id, userId] = this.values;
      const previousLength = this.db.generationHistory.length;
      this.db.generationHistory = this.db.generationHistory.filter((item) => (
        item.id !== id || item.user_id !== userId
      ));
      return { success: true, meta: { changes: previousLength - this.db.generationHistory.length } };
    }

    if (normalized.startsWith('update usage_daily') && normalized.includes('image_count = image_count + 1')) {
      assert.ok(normalized.includes('updated_at = ?'));
      assert.equal(this.values.length, 3);
      const [updatedAt, userId, usageDate] = this.values;
      assert.match(updatedAt, /^\d{4}-\d{2}-\d{2}T/);
      const row = this.db.usageDaily.find((item) => (
        item.user_id === userId && item.usage_date === usageDate
      ));
      if (!row || row.image_count >= 1) {
        return { success: true, meta: { changes: 0 } };
      }
      row.image_count += 1;
      row.updated_at = updatedAt;
      return { success: true, meta: { changes: 1 } };
    }

    if (normalized.startsWith('update usage_daily') && normalized.includes('max(0, image_count - 1)')) {
      assert.ok(normalized.includes('updated_at = ?'));
      assert.equal(this.values.length, 3);
      const [updatedAt, userId, usageDate] = this.values;
      assert.match(updatedAt, /^\d{4}-\d{2}-\d{2}T/);
      const row = this.db.usageDaily.find((item) => (
        item.user_id === userId && item.usage_date === usageDate
      ));
      if (row) {
        row.image_count = Math.max(0, row.image_count - 1);
        row.updated_at = updatedAt;
      }
      return { success: true, meta: { changes: row ? 1 : 0 } };
    }

    throw new Error(`Unhandled run SQL: ${this.sql}`);
  }
}

function normalizeSql(sql) {
  return sql.replace(/\s+/g, ' ').trim().toLowerCase();
}

function createAuthEnv(overrides = {}) {
  return {
    AUTH_COOKIE_SECRET: 'unit-test-auth-secret',
    GOOGLE_CLIENT_ID: 'google-client-id',
    GOOGLE_CLIENT_SECRET: 'google-client-secret',
    SITE_URL: 'https://toolaze.test',
    DB: new FakeD1(),
    ...overrides,
  };
}

async function withMockFetch(fetchImpl, callback) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = fetchImpl;
  try {
    return await callback();
  } finally {
    globalThis.fetch = originalFetch;
  }
}

async function createGoogleJwt(payloadOverrides = {}) {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['sign', 'verify']
  );
  const publicJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
  publicJwk.kid = 'test-key-id';
  publicJwk.alg = 'RS256';
  publicJwk.use = 'sig';

  const nowSeconds = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', kid: 'test-key-id', typ: 'JWT' };
  const payload = {
    iss: 'https://accounts.google.com',
    aud: 'google-client-id',
    exp: nowSeconds + 600,
    email_verified: true,
    sub: 'google-sub-1',
    email: 'person@example.com',
    name: 'Person',
    picture: 'https://example.com/avatar.png',
    ...payloadOverrides,
  };
  const signingInput = `${base64UrlEncodeText(JSON.stringify(header))}.${base64UrlEncodeText(JSON.stringify(payload))}`;
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    keyPair.privateKey,
    new TextEncoder().encode(signingInput)
  );

  return {
    jwt: `${signingInput}.${base64UrlEncodeBytes(new Uint8Array(signature))}`,
    publicJwk,
  };
}

test('getSafeReturnTo accepts same-origin relative paths', () => {
  assert.equal(getSafeReturnTo('/nano-banana-2'), '/nano-banana-2');
  assert.equal(getSafeReturnTo('/zh-TW/nano-banana-2?x=1'), '/zh-TW/nano-banana-2?x=1');
});

test('getSafeReturnTo rejects unsafe return paths', () => {
  assert.equal(getSafeReturnTo('https://evil.example'), '/');
  assert.equal(getSafeReturnTo('//evil.example/path'), '/');
  assert.equal(getSafeReturnTo('/foo\\bar'), '/');
  assert.equal(getSafeReturnTo(''), '/');
});

test('signed state can be read before expiry', async () => {
  const secret = 'unit-test-secret';
  const state = await createSignedState({ returnTo: '/model/nano-banana-2', exp: 2000 }, secret);
  const payload = await readSignedState(state, secret, 1000);
  assert.deepEqual(payload, { returnTo: '/model/nano-banana-2', exp: 2000 });
});

test('signed state rejects tampering and expiry', async () => {
  const secret = 'unit-test-secret';
  const state = await createSignedState({ returnTo: '/', exp: 1000 }, secret);
  assert.equal(await readSignedState(`${state}x`, secret, 500), null);
  assert.equal(await readSignedState(state, secret, 1500), null);
});

test('signed state rejects malformed state segments', async () => {
  const secret = 'unit-test-secret';
  const state = await createSignedState({ returnTo: '/', exp: 1000 }, secret);
  assert.equal(await readSignedState(`${state}.extra`, secret, 500), null);
});

test('signed state rejects non-finite expiry', async () => {
  const secret = 'unit-test-secret';
  const state = await createSignedState({ returnTo: '/', exp: 'later' }, secret);
  assert.equal(await readSignedState(state, secret, 500), null);
});

test('sha256Hex is stable and does not reveal input token', async () => {
  const hash = await sha256Hex('session-token');
  assert.equal(hash.length, 64);
  assert.notEqual(hash, 'session-token');
  assert.equal(hash, await sha256Hex('session-token'));
});

test('parseCookies parses session and other cookies', () => {
  const request = new Request('https://toolaze.test', {
    headers: { Cookie: 'toolaze_session=abc; theme=dark' },
  });

  assert.deepEqual(parseCookies(request), {
    toolaze_session: 'abc',
    theme: 'dark',
  });
});

test('createSessionCookie creates secure production cookie for https site', () => {
  const cookie = createSessionCookie('session-token', createAuthEnv());

  assert.match(cookie, /^toolaze_session=session-token;/);
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /Secure/);
  assert.match(cookie, /SameSite=Lax/);
  assert.match(cookie, /Path=\//);
  assert.match(cookie, /Max-Age=2592000/);
});

test('createClearSessionCookie clears session cookie immediately', () => {
  const cookie = createClearSessionCookie(createAuthEnv());

  assert.match(cookie, /^toolaze_session=;/);
  assert.match(cookie, /Max-Age=0/);
});

test('createGoogleAuthRedirectUrl creates Google auth URL with readable signed state', async () => {
  const env = createAuthEnv();
  const before = Date.now();
  const authUrl = await createGoogleAuthRedirectUrl(
    env,
    'https://toolaze.test/api/auth/google?returnTo=%2Ftools%3Ftab%3Ddaily'
  );
  const after = Date.now();
  const url = new URL(authUrl);

  assert.equal(url.origin + url.pathname, 'https://accounts.google.com/o/oauth2/v2/auth');
  assert.equal(url.searchParams.get('client_id'), 'google-client-id');
  assert.equal(url.searchParams.get('scope'), 'openid email profile');
  assert.equal(url.searchParams.get('response_type'), 'code');
  assert.equal(url.searchParams.get('prompt'), 'select_account');
  assert.equal(url.searchParams.get('redirect_uri'), 'https://toolaze.test/api/auth/google/callback');
  assert.ok(url.searchParams.get('state'));

  const state = await readSignedState(url.searchParams.get('state'), env.AUTH_COOKIE_SECRET);
  assert.equal(state.returnTo, '/tools?tab=daily');
  assert.ok(state.exp >= before + 10 * 60 * 1000);
  assert.ok(state.exp <= after + 10 * 60 * 1000 + 100);
});

test('createGoogleAuthRedirectUrl reports missing local OAuth configuration clearly', async () => {
  const env = createAuthEnv({ AUTH_COOKIE_SECRET: '' });

  await assert.rejects(
    () => createGoogleAuthRedirectUrl(env, 'https://toolaze.test/api/auth/google'),
    /Missing required environment variable: AUTH_COOKIE_SECRET/
  );
});

test('OAuth state cookie is temporary http only callback cookie', async () => {
  const env = createAuthEnv();
  const authUrl = await createGoogleAuthRedirectUrl(env, 'https://toolaze.test/api/auth/google');
  const state = new URL(authUrl).searchParams.get('state');
  const cookie = createOAuthStateCookie(state, env);

  assert.match(cookie, new RegExp(`^${OAUTH_STATE_COOKIE_NAME}=`));
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /Secure/);
  assert.match(cookie, /SameSite=Lax/);
  assert.match(cookie, /Path=\/api\/auth\/google\/callback/);
  assert.match(cookie, /Max-Age=600/);
});

test('clear OAuth state cookie uses callback path and zero max age', () => {
  const cookie = createClearOAuthStateCookie(createAuthEnv());

  assert.match(cookie, new RegExp(`^${OAUTH_STATE_COOKIE_NAME}=;`));
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /Secure/);
  assert.match(cookie, /SameSite=Lax/);
  assert.match(cookie, /Path=\/api\/auth\/google\/callback/);
  assert.match(cookie, /Max-Age=0/);
});

test('readOAuthState requires matching OAuth state cookie when request is provided', async () => {
  const env = createAuthEnv();
  const authUrl = await createGoogleAuthRedirectUrl(
    env,
    'https://toolaze.test/api/auth/google?returnTo=%2Ftools'
  );
  const state = new URL(authUrl).searchParams.get('state');
  const cookie = createOAuthStateCookie(state, env);
  const request = new Request('https://toolaze.test/api/auth/google/callback', {
    headers: { Cookie: cookie },
  });

  const payload = await readOAuthState(env, state, request);

  assert.equal(payload.returnTo, '/tools');
});

test('readOAuthState rejects missing or mismatched OAuth state cookie', async () => {
  const env = createAuthEnv();
  const authUrl = await createGoogleAuthRedirectUrl(env, 'https://toolaze.test/api/auth/google');
  const state = new URL(authUrl).searchParams.get('state');
  const missingCookieRequest = new Request('https://toolaze.test/api/auth/google/callback');
  const mismatchedCookieRequest = new Request('https://toolaze.test/api/auth/google/callback', {
    headers: { Cookie: createOAuthStateCookie('different-state', env) },
  });

  assert.equal(await readOAuthState(env, state, missingCookieRequest), null);
  assert.equal(await readOAuthState(env, state, mismatchedCookieRequest), null);
});

test('readOAuthState rejects calls without callback request', async () => {
  const env = createAuthEnv();
  const authUrl = await createGoogleAuthRedirectUrl(env, 'https://toolaze.test/api/auth/google');
  const state = new URL(authUrl).searchParams.get('state');

  assert.equal(await readOAuthState(env, state), null);
});

test('exchangeGoogleCode posts form body and returns token response with id_token', async () => {
  const env = createAuthEnv();
  let capturedUrl;
  let capturedInit;

  const result = await withMockFetch(
    async (url, init) => {
      capturedUrl = url;
      capturedInit = init;
      return Response.json({ id_token: 'id-token', access_token: 'access-token' });
    },
    () => exchangeGoogleCode(env, 'auth-code')
  );

  const body = new URLSearchParams(capturedInit.body);
  assert.equal(capturedUrl, 'https://oauth2.googleapis.com/token');
  assert.equal(capturedInit.method, 'POST');
  assert.equal(capturedInit.headers['Content-Type'], 'application/x-www-form-urlencoded');
  assert.equal(body.get('code'), 'auth-code');
  assert.equal(body.get('client_id'), 'google-client-id');
  assert.equal(body.get('client_secret'), 'google-client-secret');
  assert.equal(body.get('redirect_uri'), 'https://toolaze.test/api/auth/google/callback');
  assert.equal(body.get('grant_type'), 'authorization_code');
  assert.deepEqual(result, { id_token: 'id-token', access_token: 'access-token' });
});

test('exchangeGoogleCode uses configured token URL override for local development', async () => {
  const env = createAuthEnv({ GOOGLE_TOKEN_URL: 'http://127.0.0.1:8799/token' });
  let capturedUrl;

  await withMockFetch(
    async (url) => {
      capturedUrl = url;
      return Response.json({ id_token: 'id-token' });
    },
    () => exchangeGoogleCode(env, 'auth-code')
  );

  assert.equal(capturedUrl, 'http://127.0.0.1:8799/token');
});

test('exchangeGoogleCode throws when successful response omits id_token', async () => {
  await withMockFetch(
    async () => Response.json({ access_token: 'access-token' }),
    async () => {
      await assert.rejects(
        () => exchangeGoogleCode(createAuthEnv(), 'auth-code'),
        /id_token/
      );
    }
  );
});

test('exchangeGoogleCode throws on non-2xx response', async () => {
  await withMockFetch(
    async () => Response.json({ error: 'invalid_grant' }, { status: 400 }),
    async () => {
      await assert.rejects(
        () => exchangeGoogleCode(createAuthEnv(), 'auth-code'),
        /failed/i
      );
    }
  );
});

test('exchangeGoogleCode throws stable error when non-2xx response is not JSON', async () => {
  await withMockFetch(
    async () => new Response('not json', { status: 502 }),
    async () => {
      await assert.rejects(
        () => exchangeGoogleCode(createAuthEnv(), 'auth-code'),
        /failed: 502/
      );
    }
  );
});

test('verifyGoogleIdToken verifies RS256 JWT and returns normalized profile', async () => {
  const { jwt, publicJwk } = await createGoogleJwt();

  const profile = await withMockFetch(
    async (url) => {
      assert.equal(url, 'https://www.googleapis.com/oauth2/v3/certs');
      return Response.json({ keys: [publicJwk] });
    },
    () => verifyGoogleIdToken(createAuthEnv(), jwt)
  );

  assert.deepEqual(profile, {
    googleSub: 'google-sub-1',
    email: 'person@example.com',
    name: 'Person',
    avatarUrl: 'https://example.com/avatar.png',
  });
});

test('verifyGoogleIdToken uses configured JWKS URL override for local development', async () => {
  const { jwt, publicJwk } = await createGoogleJwt();
  const env = createAuthEnv({ GOOGLE_JWKS_URL: 'http://127.0.0.1:8799/certs' });
  let capturedUrl;

  await withMockFetch(
    async (url) => {
      capturedUrl = url;
      return Response.json({ keys: [publicJwk] });
    },
    () => verifyGoogleIdToken(env, jwt)
  );

  assert.equal(capturedUrl, 'http://127.0.0.1:8799/certs');
});

test('verifyGoogleIdToken rejects invalid exp values', async () => {
  const invalidExpValues = [undefined, 'soon', Number.POSITIVE_INFINITY, Math.floor(Date.now() / 1000) - 1];

  for (const exp of invalidExpValues) {
    const { jwt, publicJwk } = await createGoogleJwt({ exp });
    await withMockFetch(
      async () => Response.json({ keys: [publicJwk] }),
      async () => {
        await assert.rejects(
          () => verifyGoogleIdToken(createAuthEnv(), jwt),
          /exp|expired/i
        );
      }
    );
  }
});

test('verifyGoogleIdToken rejects invalid issuer audience and unverified email', async () => {
  const cases = [
    {
      payload: { iss: 'https://evil.example' },
      message: /issuer/i,
    },
    {
      payload: { aud: 'wrong-client-id' },
      message: /audience/i,
    },
    {
      payload: { email_verified: false },
      message: /verified/i,
    },
  ];

  for (const testCase of cases) {
    const { jwt, publicJwk } = await createGoogleJwt(testCase.payload);
    await withMockFetch(
      async () => Response.json({ keys: [publicJwk] }),
      async () => {
        await assert.rejects(
          () => verifyGoogleIdToken(createAuthEnv(), jwt),
          testCase.message
        );
      }
    );
  }
});

test('upsertUser inserts first Google user then updates the same google_sub', async () => {
  const env = createAuthEnv();

  const inserted = await upsertUser(env, {
    googleSub: 'google-sub-1',
    email: 'first@example.com',
    name: 'First Name',
    avatarUrl: 'https://example.com/first.png',
  });
  const updated = await upsertUser(env, {
    googleSub: 'google-sub-1',
    email: 'second@example.com',
    name: 'Second Name',
    avatarUrl: 'https://example.com/second.png',
  });

  assert.match(inserted.id, /^user_[a-f0-9]{32}$/);
  assert.equal(inserted.isNew, true);
  assert.equal(updated.id, inserted.id);
  assert.equal(updated.isNew, false);
  assert.equal(env.DB.users.length, 1);
  assert.equal(env.DB.users[0].email, 'second@example.com');
  assert.equal(env.DB.users[0].name, 'Second Name');
  assert.equal(env.DB.users[0].avatar_url, 'https://example.com/second.png');
});

test('createSession and getCurrentUser find user by cookie token without storing raw token', async () => {
  const env = createAuthEnv();
  const user = await upsertUser(env, {
    googleSub: 'google-sub-1',
    email: 'person@example.com',
    name: 'Person',
    avatarUrl: 'https://example.com/avatar.png',
  });

  const session = await createSession(env, user.id);
  const cookie = createSessionCookie(session.token, env);
  const currentUser = await getCurrentUser(env, new Request('https://toolaze.test', {
    headers: { Cookie: cookie },
  }));

  assert.match(session.id, /^sess_[a-f0-9]{32}$/);
  assert.notEqual(env.DB.sessions[0].token_hash, session.token);
  assert.equal(env.DB.sessions[0].token_hash, await sha256Hex(session.token));
  assert.deepEqual(currentUser, {
    id: user.id,
    email: 'person@example.com',
    name: 'Person',
    avatarUrl: 'https://example.com/avatar.png',
    sessionId: session.id,
  });
});

test('getCurrentUser returns null for expired session', async () => {
  const env = createAuthEnv();
  const user = await upsertUser(env, {
    googleSub: 'google-sub-1',
    email: 'person@example.com',
    name: 'Person',
    avatarUrl: 'https://example.com/avatar.png',
  });
  const session = await createSession(env, user.id);
  env.DB.sessions[0].expires_at = new Date(Date.now() - 1000).toISOString();
  const cookie = createSessionCookie(session.token, env);

  const currentUser = await getCurrentUser(env, new Request('https://toolaze.test', {
    headers: { Cookie: cookie },
  }));

  assert.equal(currentUser, null);
});

test('getCurrentUser returns null for invalid session expiry', async () => {
  const env = createAuthEnv();
  const user = await upsertUser(env, {
    googleSub: 'google-sub-1',
    email: 'person@example.com',
    name: 'Person',
    avatarUrl: 'https://example.com/avatar.png',
  });
  const session = await createSession(env, user.id);
  env.DB.sessions[0].expires_at = 'not-a-date';
  const cookie = createSessionCookie(session.token, env);

  const currentUser = await getCurrentUser(env, new Request('https://toolaze.test', {
    headers: { Cookie: cookie },
  }));

  assert.equal(currentUser, null);
});

test('deleteCurrentSession removes session matching cookie token hash', async () => {
  const env = createAuthEnv();
  const user = await upsertUser(env, {
    googleSub: 'google-sub-1',
    email: 'person@example.com',
    name: 'Person',
    avatarUrl: 'https://example.com/avatar.png',
  });
  const session = await createSession(env, user.id);
  const cookie = createSessionCookie(session.token, env);

  await deleteCurrentSession(env, new Request('https://toolaze.test', {
    headers: { Cookie: cookie },
  }));

  assert.equal(env.DB.sessions.length, 0);
});

test('grantNewUserCredits adds the signup bonus once and records a transaction', async () => {
  const env = createAuthEnv();

  assert.equal(await grantNewUserCredits(env, 'user_1'), true);
  assert.equal(await grantNewUserCredits(env, 'user_1'), false);

  assert.deepEqual(await getCreditSummary(env, 'user_1'), {
    balance: 10,
    transactions: [
      {
        id: env.DB.creditTransactions[0].id,
        type: 'grant',
        amount: 10,
        balanceAfter: 10,
        reason: 'new_user_bonus',
        description: 'New user bonus',
        createdAt: env.DB.creditTransactions[0].created_at,
      },
    ],
  });
});

test('consumeCredits deducts balance and records usage activity', async () => {
  const env = createAuthEnv();
  await grantNewUserCredits(env, 'user_1');

  const result = await consumeCredits(env, 'user_1', 10, {
    reason: 'image_generation',
    description: 'Nano Banana 2 image generation',
    metadata: { model: 'nano-banana-2', resolution: '1K' },
  });

  assert.equal(result.ok, true);
  assert.equal(result.balance, 0);
  assert.equal(result.required, 10);
  assert.match(result.consumptionId, /^credit_cons_[a-f0-9]{32}$/);

  const summary = await getCreditSummary(env, 'user_1');
  assert.equal(summary.balance, 0);
  assert.equal(summary.transactions.length, 2);
  const usageTransaction = summary.transactions.find((transaction) => transaction.type === 'use');
  assert.deepEqual(usageTransaction, {
    id: env.DB.creditTransactions[1].id,
    type: 'use',
    amount: -10,
    balanceAfter: 0,
    reason: 'image_generation',
    description: 'Nano Banana 2 image generation',
    createdAt: env.DB.creditTransactions[1].created_at,
  });
});

test('consumeCredits rejects usage when balance is too low', async () => {
  const env = createAuthEnv();

  const result = await consumeCredits(env, 'user_1', 20);

  assert.deepEqual(result, {
    ok: false,
    balance: 0,
    required: 20,
  });
  assert.deepEqual(await getCreditSummary(env, 'user_1'), {
    balance: 0,
    transactions: [],
  });
});

test('refundCredits restores balance and records refund activity', async () => {
  const env = createAuthEnv();
  await grantNewUserCredits(env, 'user_1');
  await consumeCredits(env, 'user_1', 10);

  const result = await refundCredits(env, 'user_1', 10, {
    reason: 'image_generation_refund',
    description: 'Image generation refund',
    metadata: { taskId: 'task_1' },
  });

  assert.deepEqual(result, {
    ok: true,
    balance: 10,
    refunded: 10,
  });
  const summary = await getCreditSummary(env, 'user_1');
  assert.equal(summary.balance, 10);
  const refundTransaction = summary.transactions.find((transaction) => transaction.type === 'refund');
  assert.deepEqual(refundTransaction, {
    id: env.DB.creditTransactions[2].id,
    type: 'refund',
    amount: 10,
    balanceAfter: 10,
    reason: 'image_generation_refund',
    description: 'Image generation refund',
    createdAt: env.DB.creditTransactions[2].created_at,
  });
});

test('admin grant is idempotent and creates an expiring batch', async () => {
  const env = createAuthEnv();
  const options = {
    requestId: 'admin_grant_12345678',
    expiresAt: '2099-08-01T00:00:00.000Z',
    description: 'Support grant',
  };

  const first = await grantCredits(env, 'user_1', 100, options);
  const second = await grantCredits(env, 'user_1', 100, options);

  assert.equal(first.balance, 100);
  assert.equal(first.duplicate, false);
  assert.equal(second.balance, 100);
  assert.equal(second.duplicate, true);
  assert.equal(env.DB.creditGrants.length, 1);
  assert.equal(
    env.DB.creditTransactions.filter((transaction) => transaction.reason === 'admin_grant').length,
    1,
  );
});

test('expired grants reduce available balance once', async () => {
  const env = createAuthEnv();
  await grantCredits(env, 'user_1', 40, {
    requestId: 'admin_grant_expired1',
    expiresAt: '2099-01-01T00:00:00.000Z',
  });
  env.DB.creditGrants[0].expires_at = '2020-01-01T00:00:00.000Z';

  await expireCredits(env, 'user_1');
  await expireCredits(env, 'user_1');

  assert.equal((await getCreditSummary(env, 'user_1')).balance, 0);
  assert.equal(
    env.DB.creditTransactions.filter((transaction) => transaction.reason === 'credit_expired').length,
    1,
  );
});

test('consumption uses expiring grant and refund restores original batch', async () => {
  const env = createAuthEnv();
  await grantCredits(env, 'user_1', 50, {
    requestId: 'admin_grant_refund1',
    expiresAt: '2099-01-01T00:00:00.000Z',
  });

  const charge = await consumeCredits(env, 'user_1', 20);
  assert.equal(env.DB.creditGrants[0].remaining_amount, 30);

  await refundCredits(env, 'user_1', 20, {
    consumptionId: charge.consumptionId,
  });

  assert.equal(env.DB.creditGrants[0].remaining_amount, 50);
  assert.equal((await getCreditSummary(env, 'user_1')).balance, 50);
});

test('refund does not revive a grant that expired after consumption', async () => {
  const env = createAuthEnv();
  await grantCredits(env, 'user_1', 20, {
    requestId: 'admin_grant_refund2',
    expiresAt: '2099-01-01T00:00:00.000Z',
  });

  const charge = await consumeCredits(env, 'user_1', 20);
  env.DB.creditGrants[0].expires_at = '2020-01-01T00:00:00.000Z';

  const refund = await refundCredits(env, 'user_1', 20, {
    consumptionId: charge.consumptionId,
  });

  assert.equal(refund.refunded, 0);
  assert.equal(env.DB.creditGrants[0].remaining_amount, 0);
  assert.equal((await getCreditSummary(env, 'user_1')).balance, 0);
});

test('generation history stores and lists successful generated media', async () => {
  const env = createAuthEnv();

  const item = await createGenerationHistoryItem(env, 'user_1', {
    mediaType: 'image',
    model: 'nano-banana-pro',
    prompt: 'A product photo',
    outputUrl: 'https://example.com/output.png',
    inputUrls: ['https://example.com/input.png'],
    aspectRatio: '1:1',
    resolution: '1K',
    outputFormat: 'PNG',
    toolSlug: 'ai-image-generator',
    toolLabel: 'AI Image Generator',
    sourcePath: '/ai-image-generator',
  });

  assert.match(item.id, /^gen_[a-f0-9]{32}$/);
  assert.deepEqual(await listGenerationHistory(env, 'user_1'), [{
    id: item.id,
    mediaType: 'image',
    model: 'nano-banana-pro',
    prompt: 'A product photo',
    outputUrl: 'https://example.com/output.png',
    inputUrls: ['https://example.com/input.png'],
    aspectRatio: '1:1',
    resolution: '1K',
    outputFormat: 'PNG',
    toolSlug: 'ai-image-generator',
    toolLabel: 'AI Image Generator',
    sourcePath: '/ai-image-generator',
    createdAt: item.createdAt,
  }]);
});

test('generation history deletes only the current user item', async () => {
  const env = createAuthEnv();

  const item = await createGenerationHistoryItem(env, 'user_1', {
    mediaType: 'image',
    model: 'nano-banana-pro',
    prompt: 'A product photo',
    outputUrl: 'https://example.com/output.png',
  });
  const otherUserItem = await createGenerationHistoryItem(env, 'user_2', {
    mediaType: 'image',
    model: 'gpt-image-2',
    prompt: 'A portrait',
    outputUrl: 'https://example.com/other.png',
  });

  assert.deepEqual(await deleteGenerationHistoryItem(env, 'user_2', item.id), {
    ok: false,
    deleted: 0,
  });
  assert.deepEqual(await deleteGenerationHistoryItem(env, 'user_1', item.id), {
    ok: true,
    deleted: 1,
  });

  assert.deepEqual(await listGenerationHistory(env, 'user_1'), []);
  assert.deepEqual((await listGenerationHistory(env, 'user_2')).map((historyItem) => historyItem.id), [otherUserItem.id]);
});

test('getTodayDate returns YYYY-MM-DD', () => {
  assert.match(getTodayDate(), /^\d{4}-\d{2}-\d{2}$/);
});

test('getUsageSummary returns empty daily usage summary', async () => {
  const env = createAuthEnv();

  const summary = await getUsageSummary(env, 'user_1', '2026-06-21');

  assert.deepEqual(summary, {
    date: '2026-06-21',
    freeLimit: 1,
    used: 0,
    remaining: 1,
  });
});

test('reserveFreeGeneration reserves the first free daily generation', async () => {
  const env = createAuthEnv();

  assert.equal(await reserveFreeGeneration(env, 'user_1', '2026-06-21'), true);
  assert.deepEqual(await getUsageSummary(env, 'user_1', '2026-06-21'), {
    date: '2026-06-21',
    freeLimit: 1,
    used: 1,
    remaining: 0,
  });
});

test('reserveFreeGeneration rejects a second free generation on the same day', async () => {
  const env = createAuthEnv();

  assert.equal(await reserveFreeGeneration(env, 'user_1', '2026-06-21'), true);
  assert.equal(await reserveFreeGeneration(env, 'user_1', '2026-06-21'), false);
  assert.deepEqual(await getUsageSummary(env, 'user_1', '2026-06-21'), {
    date: '2026-06-21',
    freeLimit: 1,
    used: 1,
    remaining: 0,
  });
});

test('releaseFreeGeneration decrements daily usage without going below zero', async () => {
  const env = createAuthEnv();

  await reserveFreeGeneration(env, 'user_1', '2026-06-21');
  await releaseFreeGeneration(env, 'user_1', '2026-06-21');
  assert.deepEqual(await getUsageSummary(env, 'user_1', '2026-06-21'), {
    date: '2026-06-21',
    freeLimit: 1,
    used: 0,
    remaining: 1,
  });

  await releaseFreeGeneration(env, 'user_1', '2026-06-21');
  assert.deepEqual(await getUsageSummary(env, 'user_1', '2026-06-21'), {
    date: '2026-06-21',
    freeLimit: 1,
    used: 0,
    remaining: 1,
  });
});

test('daily usage is isolated by date', async () => {
  const env = createAuthEnv();

  assert.equal(await reserveFreeGeneration(env, 'user_1', '2026-06-21'), true);

  assert.deepEqual(await getUsageSummary(env, 'user_1', '2026-06-22'), {
    date: '2026-06-22',
    freeLimit: 1,
    used: 0,
    remaining: 1,
  });
  assert.equal(await reserveFreeGeneration(env, 'user_1', '2026-06-22'), true);
  assert.deepEqual(await getUsageSummary(env, 'user_1', '2026-06-21'), {
    date: '2026-06-21',
    freeLimit: 1,
    used: 1,
    remaining: 0,
  });
});
