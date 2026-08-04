import type { Metadata } from 'next'
import Link from 'next/link'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import {
  getAdminEmailFromHeaders,
  isAdminRequestAllowed,
} from '@/lib/admin/access'
import {
  buildMediaAssetStats,
  DEFAULT_MEDIA_LIBRARY_PATH,
  loadMediaLibrary,
} from '@/lib/admin/media-library'
import { MediaLibraryAdminClient } from './MediaLibraryAdminClient'

export const metadata: Metadata = {
  title: '素材库 | Toolaze Admin',
  robots: 'noindex, nofollow',
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export default async function AdminMediaLibraryPage() {
  const requestHeaders = await headers()
  const host = requestHeaders.get('x-forwarded-host') || requestHeaders.get('host')

  if (!isMediaLibraryAdminHost(host) || !isAdminRequestAllowed({
    host,
    adminEmail: getAdminEmailFromHeaders(requestHeaders),
  })) {
    notFound()
  }

  const storagePath = process.env.TOOLAZE_MEDIA_LIBRARY_FILE || DEFAULT_MEDIA_LIBRARY_PATH
  const data = await loadMediaLibrary(storagePath)

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-slate-900">
      <AdminHeader storagePath={storagePath} />
      <section className="mx-auto max-w-[1480px] px-5 py-7 lg:px-8">
        <MediaLibraryAdminClient
          initialAssets={data.assets}
          initialStats={buildMediaAssetStats(data.assets)}
          storagePath={storagePath}
        />
      </section>
    </main>
  )
}

function isMediaLibraryAdminHost(host: string | null): boolean {
  if (!host) return false
  const normalized = host.trim().toLowerCase()
  const hostname = normalized.startsWith('[')
    ? normalized.slice(0, normalized.indexOf(']') + 1)
    : normalized.split(':')[0]
  const port = normalized.startsWith('[')
    ? normalized.slice(normalized.indexOf(']') + 1).replace(/^:/, '')
    : normalized.split(':')[1]

  return (
    (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]')
    && port === '3010'
  )
}

function AdminHeader({ storagePath }: { storagePath: string }) {
  return (
    <header className="border-b border-slate-200 bg-[#fbfcff]">
      <div className="mx-auto flex max-w-[1480px] flex-col gap-5 px-5 py-7 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-indigo-600">
            <Link href="/admin/users" className="transition hover:text-indigo-800">
              Google 用户管理
            </Link>
            <span className="text-slate-300">/</span>
            <Link href="/admin/generations" className="transition hover:text-indigo-800">
              任务生成记录
            </Link>
            <span className="text-slate-300">/</span>
            <span>素材库</span>
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">素材库</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            用于沉淀可复用图片、视频、参考图和 Demo 资产；当前 MVP 支持本地文件存储、History 导入、上传入库、标签编辑和 AI 打标入口。
          </p>
          <p className="mt-2 max-w-3xl truncate font-mono text-xs text-slate-400">
            存储文件：{storagePath}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/generations" className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700">
            History
          </Link>
          <a href="/admin/media-library" className="inline-flex h-10 items-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700">
            刷新素材库
          </a>
        </div>
      </div>
    </header>
  )
}
