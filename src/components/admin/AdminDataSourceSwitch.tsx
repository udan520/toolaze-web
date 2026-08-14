import Link from 'next/link'
import {
  adminDataSourceOptions,
  buildAdminDataSourceHref,
  getAdminDataSourceDescription,
  getAdminDataSourceLabel,
  type AdminDataSource,
} from '@/lib/admin/data-source'

type AdminDataSourceSwitchProps = {
  dataSource: AdminDataSource
  currentPath: string
  title?: string
}

export default function AdminDataSourceSwitch({
  dataSource,
  currentPath,
  title = '当前数据源',
}: AdminDataSourceSwitchProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>
          <p className="mt-1 text-sm font-semibold text-slate-950">
            {getAdminDataSourceLabel(dataSource)}
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {getAdminDataSourceDescription(dataSource)}
          </p>
        </div>

        <div className="inline-flex w-fit overflow-hidden rounded-lg border border-slate-200 bg-slate-100 p-1">
          {adminDataSourceOptions.map((option) => {
            const isActive = option === dataSource
            return (
              <Link
                key={option}
                href={buildAdminDataSourceHref(currentPath, option)}
                className={
                  isActive
                    ? 'inline-flex h-8 items-center justify-center rounded-md bg-slate-950 px-3 text-xs font-semibold text-white shadow-sm'
                    : 'inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-semibold text-slate-600 transition hover:bg-white hover:text-indigo-700'
                }
                aria-current={isActive ? 'page' : undefined}
              >
                {getAdminDataSourceLabel(option)}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
