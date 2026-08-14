export type AdminDataSource = 'local' | 'production'

type SearchParamValue = string | string[] | undefined
type AdminDataSourceSearchParams = Record<string, SearchParamValue>

const productionSources = new Set(['production', 'online', 'd1'])

export const adminDataSourceOptions: AdminDataSource[] = ['production', 'local']

export function resolveAdminDataSource(
  searchParams: AdminDataSourceSearchParams = {},
  _host: string | null = null,
): AdminDataSource {
  const source = readSearchParam(searchParams.source).toLowerCase()
  if (productionSources.has(source)) return 'production'
  if (source === 'local') return 'local'
  return 'production'
}

export function getAdminDataSourceLabel(dataSource: AdminDataSource): string {
  return dataSource === 'production' ? '线上数据' : '本地数据'
}

export function getAdminDataSourceDescription(dataSource: AdminDataSource): string {
  return dataSource === 'production'
    ? 'Cloudflare D1 / R2，真实用户与线上生成记录'
    : '本机 local-dev 状态，只包含当前本地账号与本地生成记录；媒体链接可能仍指向线上 R2 或第三方临时地址'
}

export function buildAdminDataSourceHref(path: string, dataSource: AdminDataSource): string {
  const [pathname, query = ''] = path.split('?')
  const params = new URLSearchParams(query)
  params.set('source', dataSource)
  return `${pathname}?${params.toString()}`
}

function readSearchParam(value: SearchParamValue): string {
  if (Array.isArray(value)) return String(value[0] || '').trim()
  return String(value || '').trim()
}
