export type AdminNavigationIcon = 'chart' | 'users' | 'generations' | 'rewards' | 'releases'

export type AdminNavigationItem = {
  label: string
  href: string
  icon: AdminNavigationIcon
}

export const ADMIN_NAV_ITEMS: readonly AdminNavigationItem[] = [
  { label: '每日数据', href: '/admin/data-dashboard', icon: 'chart' },
  { label: '用户管理', href: '/admin/users', icon: 'users' },
  { label: '生成记录', href: '/admin/generations', icon: 'generations' },
  { label: '奖励审核', href: '/admin/reward-reviews', icon: 'rewards' },
  { label: '发版记录', href: '/admin/releases', icon: 'releases' },
]

export function isAdminNavigationItemActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`)
}
