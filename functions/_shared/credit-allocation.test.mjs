import assert from 'node:assert/strict';
import test from 'node:test';
import { allocateCreditConsumption } from './credit-allocation.mjs';

test('uses earliest expiring credits before permanent credits', () => {
  const allocation = allocateCreditConsumption([
    { id: 'permanent', remainingAmount: 100, expiresAt: null },
    { id: 'later', remainingAmount: 30, expiresAt: '2026-09-01T00:00:00.000Z' },
    { id: 'earlier', remainingAmount: 20, expiresAt: '2026-08-01T00:00:00.000Z' },
  ], 60);

  assert.deepEqual(allocation, {
    grants: [
      { grantId: 'earlier', amount: 20 },
      { grantId: 'later', amount: 30 },
      { grantId: 'permanent', amount: 10 },
    ],
    permanentAmount: 0,
  });
});

test('uses historical permanent balance after tracked grants', () => {
  const allocation = allocateCreditConsumption([
    { id: 'grant', remainingAmount: 10, expiresAt: null },
  ], 25);

  assert.deepEqual(allocation, {
    grants: [{ grantId: 'grant', amount: 10 }],
    permanentAmount: 15,
  });
});

test('ignores empty batches and does not mutate input', () => {
  const grants = [
    { id: 'empty', remainingAmount: 0, expiresAt: '2026-08-01T00:00:00.000Z' },
    { id: 'usable', remainingAmount: 5, expiresAt: null },
  ];

  assert.deepEqual(allocateCreditConsumption(grants, 3), {
    grants: [{ grantId: 'usable', amount: 3 }],
    permanentAmount: 0,
  });
  assert.equal(grants[1].remainingAmount, 5);
});

test('rejects non-positive and fractional amounts', () => {
  assert.throws(() => allocateCreditConsumption([], 0), /positive integer/);
  assert.throws(() => allocateCreditConsumption([], 1.5), /positive integer/);
});
