import { grantCredits } from './credits.mjs';

export const CHECK_IN_REWARDS = [5, 10, 15, 20, 25, 30, 50];
export const X_POST_REWARD_CREDITS = 10;

function createId(prefix) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, '')}`;
}

function nowIso(now = new Date()) {
  return now.toISOString();
}

function toUtcDateKey(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

function addUtcDays(dateKey, days) {
  const date = new Date(`${dateKey}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return toUtcDateKey(date);
}

function normalizeStreakDay(value) {
  const day = Number(value);
  return Number.isInteger(day) && day >= 1 && day <= CHECK_IN_REWARDS.length ? day : 0;
}

function getNextCheckInDay(row, today) {
  if (!row?.last_checkin_date) return 1;
  if (row.last_checkin_date === today) return normalizeStreakDay(row.streak_day) || 1;
  if (addUtcDays(row.last_checkin_date, 1) === today) {
    const currentDay = normalizeStreakDay(row.streak_day);
    return currentDay >= CHECK_IN_REWARDS.length ? 1 : currentDay + 1;
  }
  return 1;
}

function getActiveStreakDay(row, today) {
  if (!row?.last_checkin_date) return 0;
  if (row.last_checkin_date === today || addUtcDays(row.last_checkin_date, 1) === today) {
    return normalizeStreakDay(row.streak_day);
  }
  return 0;
}

async function ensureRewardTables(env) {
  await env.DB.prepare(`
    create table if not exists reward_checkins (
      user_id text primary key,
      streak_day integer not null default 0,
      last_checkin_date text,
      created_at text not null,
      updated_at text not null
    )
  `).run();

  await env.DB.prepare(`
    create table if not exists reward_x_posts (
      id text primary key,
      user_id text not null,
      post_url text not null,
      reward_credits integer not null default 10,
      status text not null default 'pending',
      reviewed_by text,
      reviewed_at text,
      rejection_reason text,
      created_at text not null,
      updated_at text not null,
      unique(user_id, post_url)
    )
  `).run();

  for (const column of [
    ['reviewed_by', 'text'],
    ['reviewed_at', 'text'],
    ['rejection_reason', 'text'],
  ]) {
    try {
      await env.DB.prepare(`alter table reward_x_posts add column ${column[0]} ${column[1]}`).run();
    } catch (error) {
      if (!String(error?.message || '').toLowerCase().includes('duplicate column')) {
        throw error;
      }
    }
  }
}

async function readCheckInRow(env, userId) {
  await ensureRewardTables(env);
  return env.DB.prepare(`
    select user_id, streak_day, last_checkin_date, created_at, updated_at
    from reward_checkins
    where user_id = ?
  `).bind(userId).first();
}

export async function getDailyCheckInStatus(env, userId, now = new Date()) {
  const today = toUtcDateKey(now);
  const row = await readCheckInRow(env, userId);
  const checkedInToday = row?.last_checkin_date === today;
  const streakDay = getActiveStreakDay(row, today);
  const nextDay = checkedInToday ? getNextCheckInDay(row, addUtcDays(today, 1)) : getNextCheckInDay(row, today);

  return {
    checkedInToday,
    streakDay,
    lastCheckInDate: row?.last_checkin_date || null,
    nextDay,
    nextRewardCredits: CHECK_IN_REWARDS[nextDay - 1],
    rewards: CHECK_IN_REWARDS.map((credits, index) => ({
      day: index + 1,
      credits,
      current: checkedInToday ? index + 1 === streakDay : index + 1 === nextDay,
      claimed: streakDay > 0 && index + 1 <= streakDay,
    })),
  };
}

export async function claimDailyCheckIn(env, userId, options = {}) {
  const now = options.now || new Date();
  const today = toUtcDateKey(now);
  const nowText = nowIso(now);
  const row = await readCheckInRow(env, userId);

  if (row?.last_checkin_date === today) {
    const currentDay = normalizeStreakDay(row.streak_day) || 1;
    return {
      ok: true,
      alreadyCheckedIn: true,
      rewardCredits: 0,
      checkIn: {
        ...(await getDailyCheckInStatus(env, userId, now)),
        day: currentDay,
      },
    };
  }

  const day = getNextCheckInDay(row, today);
  const rewardCredits = CHECK_IN_REWARDS[day - 1];
  const grantCreditsFn = options.grantCreditsFn || grantCredits;
  const grant = await grantCreditsFn(env, userId, rewardCredits, {
    requestId: `daily_checkin:${userId}:${today}`,
    reason: 'daily_checkin',
    description: `Daily check-in reward (Day ${day})`,
    metadata: {
      reward: 'daily_checkin',
      day,
      date: today,
    },
  });

  await env.DB.prepare(`
    insert into reward_checkins (user_id, streak_day, last_checkin_date, created_at, updated_at)
    values (?, ?, ?, ?, ?)
    on conflict(user_id) do update set
      streak_day = ?,
      last_checkin_date = ?,
      updated_at = ?
  `).bind(
    userId,
    day,
    today,
    nowText,
    nowText,
    day,
    today,
    nowText
  ).run();

  return {
    ok: true,
    alreadyCheckedIn: false,
    rewardCredits,
    balance: grant.balance,
    checkIn: {
      ...(await getDailyCheckInStatus(env, userId, now)),
      day,
    },
  };
}

function normalizeXPostUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';

  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return '';
    if (host !== 'x.com' && host !== 'twitter.com') return '';
    url.hash = '';
    return url.toString();
  } catch {
    return '';
  }
}

async function readXPostSubmission(env, userId, postUrl) {
  await ensureRewardTables(env);
  return env.DB.prepare(`
    select id, user_id, post_url, reward_credits, status, reviewed_by, reviewed_at, rejection_reason, created_at, updated_at
    from reward_x_posts
    where user_id = ? and post_url = ?
  `).bind(userId, postUrl).first();
}

function serializeXPost(row) {
  return {
    id: row.id,
    userId: row.user_id,
    userEmail: row.user_email || null,
    userName: row.user_name || null,
    postUrl: row.post_url,
    rewardCredits: row.reward_credits,
    status: row.status,
    reviewedBy: row.reviewed_by || null,
    reviewedAt: row.reviewed_at || null,
    rejectionReason: row.rejection_reason || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function readXPostSubmissionById(env, id) {
  await ensureRewardTables(env);
  return env.DB.prepare(`
    select
      reward_x_posts.id,
      reward_x_posts.user_id,
      users.email as user_email,
      users.name as user_name,
      reward_x_posts.post_url,
      reward_x_posts.reward_credits,
      reward_x_posts.status,
      reward_x_posts.reviewed_by,
      reward_x_posts.reviewed_at,
      reward_x_posts.rejection_reason,
      reward_x_posts.created_at,
      reward_x_posts.updated_at
    from reward_x_posts
    left join users on users.id = reward_x_posts.user_id
    where reward_x_posts.id = ?
  `).bind(id).first();
}

function normalizeReviewStatus(value) {
  const status = String(value || 'pending').trim().toLowerCase();
  return ['pending', 'approved', 'rejected', 'all'].includes(status) ? status : 'pending';
}

export async function listXPostRewardReviews(env, options = {}) {
  await ensureRewardTables(env);

  const status = normalizeReviewStatus(options.status);
  const limit = Math.min(Math.max(Number(options.limit) || 50, 1), 100);
  const statusFilter = status === 'all' ? '' : 'where reward_x_posts.status = ?';
  const statement = env.DB.prepare(`
    select
      reward_x_posts.id,
      reward_x_posts.user_id,
      users.email as user_email,
      users.name as user_name,
      reward_x_posts.post_url,
      reward_x_posts.reward_credits,
      reward_x_posts.status,
      reward_x_posts.reviewed_by,
      reward_x_posts.reviewed_at,
      reward_x_posts.rejection_reason,
      reward_x_posts.created_at,
      reward_x_posts.updated_at
    from reward_x_posts
    left join users on users.id = reward_x_posts.user_id
    ${statusFilter}
    order by reward_x_posts.created_at desc
    limit ?
  `);
  const result = status === 'all'
    ? await statement.bind(limit).all()
    : await statement.bind(status, limit).all();

  return {
    ok: true,
    status,
    items: (result?.results || []).map(serializeXPost),
  };
}

export async function approveXPostReward(env, id, options = {}) {
  const row = await readXPostSubmissionById(env, id);
  if (!row) return { ok: false, status: 404, error: 'X post review not found.' };
  if (row.status !== 'pending') {
    return { ok: true, alreadyReviewed: true, xPost: serializeXPost(row) };
  }

  const nowText = nowIso(options.now || new Date());
  const reviewer = String(options.reviewer || 'admin').trim() || 'admin';
  const rewardCredits = Number(row.reward_credits) || X_POST_REWARD_CREDITS;
  const grantCreditsFn = options.grantCreditsFn || grantCredits;
  await grantCreditsFn(env, row.user_id, rewardCredits, {
    requestId: `x_post_reward:${row.id}`,
    reason: 'x_post_reward',
    description: 'Approved X post reward',
    metadata: {
      reward: 'x_post',
      xPostId: row.id,
      postUrl: row.post_url,
      reviewedBy: reviewer,
    },
  });

  const update = await env.DB.prepare(`
    update reward_x_posts
    set status = 'approved',
      reviewed_by = ?,
      reviewed_at = ?,
      rejection_reason = null,
      updated_at = ?
    where id = ? and status = 'pending'
  `).bind(reviewer, nowText, nowText, row.id).run();

  const nextRow = await readXPostSubmissionById(env, id);
  return {
    ok: true,
    alreadyReviewed: update?.meta?.changes !== 1,
    xPost: serializeXPost(nextRow),
  };
}

export async function rejectXPostReward(env, id, options = {}) {
  const row = await readXPostSubmissionById(env, id);
  if (!row) return { ok: false, status: 404, error: 'X post review not found.' };
  if (row.status !== 'pending') {
    return { ok: true, alreadyReviewed: true, xPost: serializeXPost(row) };
  }

  const nowText = nowIso(options.now || new Date());
  const reviewer = String(options.reviewer || 'admin').trim() || 'admin';
  const reason = String(options.reason || '').trim() || 'Does not meet reward requirements.';
  const update = await env.DB.prepare(`
    update reward_x_posts
    set status = 'rejected',
      reviewed_by = ?,
      reviewed_at = ?,
      rejection_reason = ?,
      updated_at = ?
    where id = ? and status = 'pending'
  `).bind(reviewer, nowText, reason, nowText, row.id).run();

  const nextRow = await readXPostSubmissionById(env, id);
  return {
    ok: true,
    alreadyReviewed: update?.meta?.changes !== 1,
    xPost: serializeXPost(nextRow),
  };
}

export async function submitXPostReward(env, userId, postUrl, now = new Date()) {
  const normalizedUrl = normalizeXPostUrl(postUrl);
  if (!normalizedUrl) {
    return {
      ok: false,
      status: 400,
      error: 'Please submit a valid X post URL.',
    };
  }

  const existing = await readXPostSubmission(env, userId, normalizedUrl);
  if (existing) {
    return {
      ok: true,
      duplicate: true,
      xPost: serializeXPost(existing),
    };
  }

  const nowText = nowIso(now);
  const id = createId('reward_x_post');
  const insert = await env.DB.prepare(`
    insert into reward_x_posts (id, user_id, post_url, reward_credits, status, created_at, updated_at)
    values (?, ?, ?, ?, ?, ?, ?)
    on conflict(user_id, post_url) do nothing
  `).bind(
    id,
    userId,
    normalizedUrl,
    X_POST_REWARD_CREDITS,
    'pending',
    nowText,
    nowText
  ).run();

  if (insert?.meta?.changes !== 1) {
    const duplicate = await readXPostSubmission(env, userId, normalizedUrl);
    return {
      ok: true,
      duplicate: true,
      xPost: serializeXPost(duplicate),
    };
  }

  return {
    ok: true,
    duplicate: false,
    xPost: {
      id,
      postUrl: normalizedUrl,
      rewardCredits: X_POST_REWARD_CREDITS,
      status: 'pending',
      createdAt: nowText,
      updatedAt: nowText,
    },
  };
}
