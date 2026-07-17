import type { AdminUser } from './users'

export type UserSessionFilter = 'all' | 'active' | 'inactive'
export type UserSort = 'newest' | 'lastLogin' | 'lastGeneration' | 'credits'

export type UserViewOptions = {
  query: string
  session: UserSessionFilter
  sort: UserSort
}

export function filterAndSortUsers(
  users: AdminUser[],
  options: UserViewOptions,
): AdminUser[] {
  const query = options.query.trim().toLocaleLowerCase()

  return users
    .filter((user) => {
      if (options.session === 'active' && !user.hasActiveSession) return false
      if (options.session === 'inactive' && user.hasActiveSession) return false
      if (!query) return true

      return (
        user.email.toLocaleLowerCase().includes(query) ||
        (user.name?.toLocaleLowerCase().includes(query) ?? false)
      )
    })
    .slice()
    .sort((left, right) => compareUsers(left, right, options.sort))
}

function compareUsers(left: AdminUser, right: AdminUser, sort: UserSort): number {
  if (sort === 'credits') {
    const creditDifference = right.creditBalance - left.creditBalance
    if (creditDifference !== 0) return creditDifference
    return compareIsoDescending(left.createdAt, right.createdAt)
  }

  if (sort === 'lastLogin') {
    if (!left.lastLoginAt && !right.lastLoginAt) {
      return compareIsoDescending(left.createdAt, right.createdAt)
    }
    if (!left.lastLoginAt) return 1
    if (!right.lastLoginAt) return -1
    return compareIsoDescending(left.lastLoginAt, right.lastLoginAt)
  }

  if (sort === 'lastGeneration') {
    if (!left.lastGenerationAt && !right.lastGenerationAt) {
      return compareIsoDescending(left.createdAt, right.createdAt)
    }
    if (!left.lastGenerationAt) return 1
    if (!right.lastGenerationAt) return -1
    return compareIsoDescending(left.lastGenerationAt, right.lastGenerationAt)
  }

  return compareIsoDescending(left.createdAt, right.createdAt)
}

function compareIsoDescending(left: string, right: string): number {
  return right.localeCompare(left)
}
