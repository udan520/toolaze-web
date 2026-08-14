'use client'

import type { ReactNode, SVGProps } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  ADMIN_NAV_ITEMS,
  isAdminNavigationItemActive,
  type AdminNavigationIcon,
} from '@/lib/admin/navigation'

const SIDEBAR_STORAGE_KEY = 'toolaze-admin-sidebar-collapsed'

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true')
    } catch {
      // 浏览器禁用本地存储时保持默认展开，不影响后台使用。
    }
  }, [])

  function toggleSidebar() {
    setCollapsed((current) => {
      const next = !current

      try {
        window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next))
      } catch {
        // 本地存储不可用时，仍保留当前页面内的折叠状态。
      }

      return next
    })
  }

  return (
    <div className="min-h-screen w-full bg-[#f6f7fb] lg:flex lg:items-start">
      <aside
        className={`sticky top-0 z-40 w-full shrink-0 border-b border-slate-200 bg-[#f8f9fc] transition-[width] duration-200 lg:h-screen lg:border-b-0 lg:border-r ${
          collapsed ? 'lg:w-[64px]' : 'lg:w-[184px]'
        }`}
      >
        <div className={`flex h-14 items-center gap-2.5 border-b border-slate-200 px-3 lg:h-16 ${collapsed ? 'lg:justify-center lg:px-2' : ''}`}>
          <span className={`h-8 w-8 shrink-0 place-items-center rounded-lg bg-indigo-600 text-sm font-bold text-white shadow-sm ${collapsed ? 'hidden' : 'grid'}`}>
            A
          </span>
          <span className={`whitespace-nowrap text-sm font-semibold text-slate-900 ${collapsed ? 'lg:hidden' : ''}`}>
            Admin
          </span>
          <button
            type="button"
            onClick={toggleSidebar}
            className={`hidden shrink-0 items-center justify-center shadow-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-500/30 lg:inline-flex ${
              collapsed
                ? 'relative h-8 w-8 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700'
                : 'ml-auto h-7 w-7 rounded-md border border-slate-200 bg-white text-slate-500 hover:border-indigo-300 hover:text-indigo-700'
            }`}
            aria-label={collapsed ? '展开侧栏' : '收起侧栏'}
            title={collapsed ? '展开侧栏' : '收起侧栏'}
          >
            {collapsed ? (
              <>
                <span className="text-sm font-bold">A</span>
                <span className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full border border-indigo-200 bg-white text-indigo-700">
                  <ChevronIcon direction="right" className="h-2.5 w-2.5" />
                </span>
              </>
            ) : (
              <ChevronIcon direction="left" />
            )}
          </button>
        </div>

        <nav
          aria-label="后台管理导航"
          className="flex gap-1 overflow-x-auto px-3 py-2 lg:block lg:space-y-1 lg:overflow-visible lg:px-2 lg:py-3"
        >
          {ADMIN_NAV_ITEMS.map((item) => {
            const active = isAdminNavigationItemActive(pathname, item.href)

            return (
              <Link
                key={item.href}
                prefetch={false}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                aria-label={collapsed ? item.label : undefined}
                title={collapsed ? item.label : undefined}
                className={`group flex h-10 shrink-0 items-center gap-2.5 rounded-lg px-3 text-sm font-medium transition lg:w-full ${
                  collapsed ? 'lg:justify-center lg:px-0' : ''
                } ${
                  active
                    ? 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-100'
                    : 'text-slate-600 hover:bg-white hover:text-slate-950'
                }`}
              >
                <AdminNavIcon icon={item.icon} />
                <span className={`whitespace-nowrap ${collapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

function AdminNavIcon({ icon }: { icon: AdminNavigationIcon }) {
  const commonProps: SVGProps<SVGSVGElement> = {
    className: 'h-[18px] w-[18px] shrink-0',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }

  if (icon === 'chart') return <svg {...commonProps}><path d="M4 19V9M10 19V5M16 19v-7M22 19H2" /></svg>
  if (icon === 'users') return <svg {...commonProps}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  if (icon === 'generations') return <svg {...commonProps}><rect x="3" y="3" width="18" height="18" rx="3" /><path d="m8 15 2.5-3 2 2 2.5-3 2 4M8 8h.01" /></svg>
  if (icon === 'releases') return <svg {...commonProps}><rect x="3" y="4" width="18" height="17" rx="3" /><path d="M8 2v4M16 2v4M3 9h18M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01" /></svg>
  return <svg {...commonProps}><path d="M12 3 4.5 7v5c0 4.6 3.2 7.7 7.5 9 4.3-1.3 7.5-4.4 7.5-9V7L12 3Z" /><path d="m9 12 2 2 4-4" /></svg>
}

function ChevronIcon({ direction, className = 'h-4 w-4' }: { direction: 'left' | 'right'; className?: string }) {
  return (
    <svg className={`shrink-0 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d={direction === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
