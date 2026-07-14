export function allocateCreditConsumption(grants, amount) {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error('Credit amount must be a positive integer');
  }

  const sorted = grants
    .filter((grant) => Number(grant.remainingAmount) > 0)
    .slice()
    .sort((left, right) => {
      if (left.expiresAt && right.expiresAt) {
        return left.expiresAt.localeCompare(right.expiresAt);
      }
      if (left.expiresAt) return -1;
      if (right.expiresAt) return 1;
      return String(left.id).localeCompare(String(right.id));
    });

  let remaining = amount;
  const allocations = [];

  for (const grant of sorted) {
    if (remaining === 0) break;

    const used = Math.min(Number(grant.remainingAmount), remaining);
    if (used <= 0) continue;

    allocations.push({
      grantId: grant.id,
      amount: used,
    });
    remaining -= used;
  }

  return {
    grants: allocations,
    permanentAmount: remaining,
  };
}
