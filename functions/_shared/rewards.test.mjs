import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CHECK_IN_REWARDS,
  approveXPostReward,
  claimDailyCheckIn,
  getDailyCheckInStatus,
  listXPostRewardReviews,
  rejectXPostReward,
  submitXPostReward,
} from './rewards.mjs';

class FakeD1 {
  constructor() {
    this.rewardCheckins = [];
    this.rewardXPosts = [];
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

    if (normalized.includes('from reward_checkins')) {
      return this.db.rewardCheckins.find((row) => row.user_id === this.values[0]) || null;
    }

    if (normalized.includes('from reward_x_posts')) {
      if (normalized.includes('where reward_x_posts.id = ?') || normalized.includes('where id = ?')) {
        return this.decorateXPost(this.db.rewardXPosts.find((row) => row.id === this.values[0]) || null);
      }

      const [userId, postUrl] = this.values;
      return this.decorateXPost(this.db.rewardXPosts.find((row) => row.user_id === userId && row.post_url === postUrl) || null);
    }

    return null;
  }

  async all() {
    const normalized = normalizeSql(this.sql);

    if (normalized.includes('from reward_x_posts')) {
      const hasStatusFilter = normalized.includes('where reward_x_posts.status = ?');
      const status = hasStatusFilter ? this.values[0] : null;
      const rows = this.db.rewardXPosts
        .filter((row) => !status || row.status === status)
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .map((row) => this.decorateXPost(row));

      return { results: rows };
    }

    return { results: [] };
  }

  async run() {
    const normalized = normalizeSql(this.sql);

    if (normalized.startsWith('create table')) return { meta: { changes: 0 } };
    if (normalized.startsWith('alter table')) return { meta: { changes: 0 } };

    if (normalized.startsWith('insert into reward_checkins')) {
      const [userId, streakDay, lastCheckinDate, createdAt, updatedAt, updateStreakDay, updateLastDate, updateUpdatedAt] = this.values;
      const existing = this.db.rewardCheckins.find((row) => row.user_id === userId);
      if (existing) {
        existing.streak_day = updateStreakDay;
        existing.last_checkin_date = updateLastDate;
        existing.updated_at = updateUpdatedAt;
      } else {
        this.db.rewardCheckins.push({
          user_id: userId,
          streak_day: streakDay,
          last_checkin_date: lastCheckinDate,
          created_at: createdAt,
          updated_at: updatedAt,
        });
      }
      return { meta: { changes: 1 } };
    }

    if (normalized.startsWith('insert into reward_x_posts')) {
      const [id, userId, postUrl, rewardCredits, status, createdAt, updatedAt] = this.values;
      const exists = this.db.rewardXPosts.some((row) => row.user_id === userId && row.post_url === postUrl);
      if (exists) return { meta: { changes: 0 } };
      this.db.rewardXPosts.push({
        id,
        user_id: userId,
        post_url: postUrl,
        reward_credits: rewardCredits,
        status,
        reviewed_by: null,
        reviewed_at: null,
        rejection_reason: null,
        created_at: createdAt,
        updated_at: updatedAt,
      });
      return { meta: { changes: 1 } };
    }

    if (normalized.startsWith('update reward_x_posts') && normalized.includes("set status = 'approved'")) {
      const [reviewedBy, reviewedAt, updatedAt, id] = this.values;
      const row = this.db.rewardXPosts.find((item) => item.id === id && item.status === 'pending');
      if (!row) return { meta: { changes: 0 } };
      Object.assign(row, {
        status: 'approved',
        reviewed_by: reviewedBy,
        reviewed_at: reviewedAt,
        rejection_reason: null,
        updated_at: updatedAt,
      });
      return { meta: { changes: 1 } };
    }

    if (normalized.startsWith('update reward_x_posts') && normalized.includes("set status = 'rejected'")) {
      const [reviewedBy, reviewedAt, rejectionReason, updatedAt, id] = this.values;
      const row = this.db.rewardXPosts.find((item) => item.id === id && item.status === 'pending');
      if (!row) return { meta: { changes: 0 } };
      Object.assign(row, {
        status: 'rejected',
        reviewed_by: reviewedBy,
        reviewed_at: reviewedAt,
        rejection_reason: rejectionReason,
        updated_at: updatedAt,
      });
      return { meta: { changes: 1 } };
    }

    throw new Error(`Unhandled SQL: ${this.sql}`);
  }

  decorateXPost(row) {
    if (!row) return null;
    return {
      user_email: null,
      user_name: null,
      reviewed_by: null,
      reviewed_at: null,
      rejection_reason: null,
      ...row,
    };
  }
}

function normalizeSql(sql) {
  return sql.replace(/\s+/g, ' ').trim().toLowerCase();
}

function createEnv() {
  return { DB: new FakeD1() };
}

test('daily check-in rewards advance only on consecutive days', async () => {
  const env = createEnv();
  const grants = [];
  const grantCreditsFn = async (_env, userId, amount, options) => {
    grants.push({ userId, amount, options });
    return { ok: true, balance: grants.reduce((sum, item) => sum + item.amount, 0), amount };
  };

  const day1 = await claimDailyCheckIn(env, 'user-1', {
    now: new Date('2026-07-01T12:00:00.000Z'),
    grantCreditsFn,
  });
  const day2 = await claimDailyCheckIn(env, 'user-1', {
    now: new Date('2026-07-02T12:00:00.000Z'),
    grantCreditsFn,
  });
  const reset = await claimDailyCheckIn(env, 'user-1', {
    now: new Date('2026-07-04T12:00:00.000Z'),
    grantCreditsFn,
  });

  assert.equal(day1.checkIn.day, 1);
  assert.equal(day1.rewardCredits, CHECK_IN_REWARDS[0]);
  assert.equal(day2.checkIn.day, 2);
  assert.equal(day2.rewardCredits, CHECK_IN_REWARDS[1]);
  assert.equal(reset.checkIn.day, 1);
  assert.equal(reset.rewardCredits, CHECK_IN_REWARDS[0]);
  assert.deepEqual(grants.map((grant) => grant.amount), [5, 10, 5]);
  assert.equal(grants[0].options.requestId, 'daily_checkin:user-1:2026-07-01');
});

test('daily check-in is idempotent for the same UTC day', async () => {
  const env = createEnv();
  let grantCalls = 0;
  const grantCreditsFn = async () => {
    grantCalls += 1;
    return { ok: true, balance: 5, amount: 5 };
  };

  await claimDailyCheckIn(env, 'user-1', {
    now: new Date('2026-07-01T00:30:00.000Z'),
    grantCreditsFn,
  });
  const duplicate = await claimDailyCheckIn(env, 'user-1', {
    now: new Date('2026-07-01T23:30:00.000Z'),
    grantCreditsFn,
  });

  assert.equal(duplicate.alreadyCheckedIn, true);
  assert.equal(duplicate.rewardCredits, 0);
  assert.equal(grantCalls, 1);
});

test('status shows day one when the streak has expired', async () => {
  const env = createEnv();
  await claimDailyCheckIn(env, 'user-1', {
    now: new Date('2026-07-01T12:00:00.000Z'),
    grantCreditsFn: async () => ({ ok: true, balance: 5, amount: 5 }),
  });

  const status = await getDailyCheckInStatus(env, 'user-1', new Date('2026-07-03T12:00:00.000Z'));

  assert.equal(status.checkedInToday, false);
  assert.equal(status.streakDay, 0);
  assert.equal(status.nextDay, 1);
  assert.equal(status.nextRewardCredits, 5);
});

test('x post reward submissions are pending and duplicate-safe', async () => {
  const env = createEnv();
  const first = await submitXPostReward(env, 'user-1', 'https://x.com/toolaze/status/123');
  const duplicate = await submitXPostReward(env, 'user-1', 'https://x.com/toolaze/status/123');

  assert.equal(first.xPost.status, 'pending');
  assert.equal(first.xPost.rewardCredits, 10);
  assert.equal(first.duplicate, false);
  assert.equal(duplicate.duplicate, true);
  assert.equal(env.DB.rewardXPosts.length, 1);
});

test('x post reward reviews list pending submissions first', async () => {
  const env = createEnv();
  const first = await submitXPostReward(env, 'user-1', 'https://x.com/toolaze/status/100');
  const second = await submitXPostReward(env, 'user-2', 'https://x.com/toolaze/status/200');
  env.DB.rewardXPosts.find((row) => row.id === first.xPost.id).status = 'approved';

  const reviews = await listXPostRewardReviews(env, { status: 'pending' });

  assert.equal(reviews.items.length, 1);
  assert.equal(reviews.items[0].id, second.xPost.id);
  assert.equal(reviews.items[0].userId, 'user-2');
  assert.equal(reviews.items[0].postUrl, 'https://x.com/toolaze/status/200');
  assert.equal(reviews.items[0].status, 'pending');
});

test('approving an x post review grants credits once and stores reviewer metadata', async () => {
  const env = createEnv();
  const submission = await submitXPostReward(env, 'user-1', 'https://x.com/toolaze/status/123');
  const grants = [];
  const grantCreditsFn = async (_env, userId, amount, options) => {
    grants.push({ userId, amount, options });
    return { ok: true, balance: 1010, amount };
  };

  const approved = await approveXPostReward(env, submission.xPost.id, {
    reviewer: 'admin@example.com',
    grantCreditsFn,
    now: new Date('2026-07-17T10:00:00.000Z'),
  });
  const duplicate = await approveXPostReward(env, submission.xPost.id, {
    reviewer: 'admin@example.com',
    grantCreditsFn,
    now: new Date('2026-07-17T10:01:00.000Z'),
  });

  assert.equal(approved.ok, true);
  assert.equal(approved.xPost.status, 'approved');
  assert.equal(approved.xPost.reviewedBy, 'admin@example.com');
  assert.equal(duplicate.alreadyReviewed, true);
  assert.equal(grants.length, 1);
  assert.equal(grants[0].userId, 'user-1');
  assert.equal(grants[0].amount, 10);
  assert.equal(grants[0].options.requestId, `x_post_reward:${submission.xPost.id}`);
});

test('rejecting an x post review stores a reason without granting credits', async () => {
  const env = createEnv();
  const submission = await submitXPostReward(env, 'user-1', 'https://x.com/toolaze/status/456');
  let grantCalls = 0;

  const rejected = await rejectXPostReward(env, submission.xPost.id, {
    reviewer: 'admin@example.com',
    reason: 'missing Toolaze mention',
    grantCreditsFn: async () => {
      grantCalls += 1;
    },
    now: new Date('2026-07-17T10:00:00.000Z'),
  });

  assert.equal(rejected.ok, true);
  assert.equal(rejected.xPost.status, 'rejected');
  assert.equal(rejected.xPost.rejectionReason, 'missing Toolaze mention');
  assert.equal(grantCalls, 0);
});
