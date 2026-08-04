'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { getImageUploadUrl } from '@/lib/upload-url'
import type {
  MediaAsset,
  MediaAssetReviewStatus,
  MediaAssetSource,
  MediaAssetStats,
  MediaAssetType,
} from '@/lib/admin/media-library'
import type {
  OnlineMediaResource,
  OnlineMediaResourceType,
} from '@/lib/admin/media-library-online-assets'

type MediaLibraryAdminClientProps = {
  initialAssets: MediaAsset[]
  initialStats: MediaAssetStats
  storagePath: string
  mode?: 'local' | 'online'
}

type ApiPayload = {
  assets?: MediaAsset[]
  asset?: MediaAsset
  stats?: MediaAssetStats
  importedCount?: number
  skippedCount?: number
  message?: string
  error?: string
  url?: string
  resources?: OnlineMediaResource[]
  total?: number
  nextCursor?: string
  configMissing?: boolean
  prefix?: string
  bucket?: string
}

type Filters = {
  query: string
  type: MediaAssetType | 'all'
  source: MediaAssetSource | 'all'
  reviewStatus: MediaAssetReviewStatus | 'all'
  tags: string
}

type OnlineResourceFilters = {
  query: string
  type: OnlineMediaResourceType | 'all'
  prefix: string
}

const emptyFilters: Filters = {
  query: '',
  type: 'all',
  source: 'all',
  reviewStatus: 'all',
  tags: '',
}

const emptyOnlineFilters: OnlineResourceFilters = {
  query: '',
  type: 'all',
  prefix: 'uploads/',
}

const statusLabels: Record<MediaAssetReviewStatus, string> = {
  candidate: '待整理',
  needs_review: '需审核',
  approved: '已批准',
  rejected: '已拒绝',
}

const sourceLabels: Record<MediaAssetSource, string> = {
  history: 'History',
  upload: '上传',
  generated: '生成',
}

const quickTagSets = [
  ['female_presenting', 'adult_likely', 'single_person', 'full_body', 'standing'],
  ['male_presenting', 'adult_likely', 'single_person', 'full_body', 'standing'],
  ['clothing_reference', 'full_body', 'readable_outfit'],
  ['portrait_reference', 'close_up', 'simple_background'],
]

export function MediaLibraryAdminClient({
  initialAssets,
  initialStats,
  storagePath,
  mode = 'local',
}: MediaLibraryAdminClientProps) {
  const isOnlineMode = mode === 'online'
  const [assets, setAssets] = useState(initialAssets)
  const [stats, setStats] = useState(initialStats)
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const [selectedId, setSelectedId] = useState(initialAssets[0]?.id || '')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [busyAction, setBusyAction] = useState('')
  const [urlDraft, setUrlDraft] = useState('')
  const [titleDraft, setTitleDraft] = useState('')
  const [tagDraft, setTagDraft] = useState('')
  const [onlineFilters, setOnlineFilters] = useState<OnlineResourceFilters>(emptyOnlineFilters)
  const [onlineResources, setOnlineResources] = useState<OnlineMediaResource[]>([])
  const [selectedOnlineKeys, setSelectedOnlineKeys] = useState<string[]>([])
  const [onlineNextCursor, setOnlineNextCursor] = useState('')
  const [onlineBucket, setOnlineBucket] = useState('')
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const filteredAssets = useMemo(() => {
    const requiredTags = parseTags(filters.tags)
    const query = filters.query.trim().toLowerCase()
    return assets.filter((asset) => {
      if (filters.type !== 'all' && asset.type !== filters.type) return false
      if (filters.source !== 'all' && asset.source !== filters.source) return false
      if (filters.reviewStatus !== 'all' && asset.reviewStatus !== filters.reviewStatus) return false
      if (requiredTags.length > 0) {
        const tagSet = new Set([...asset.manualTags, ...asset.aiTags, ...asset.safetyTags])
        if (!requiredTags.every((tag) => tagSet.has(tag))) return false
      }
      if (!query) return true
      return [
        asset.id,
        asset.url,
        asset.title,
        asset.sourceToolSlug,
        asset.sourceToolLabel,
        asset.sourcePath,
        asset.sourceModel,
        asset.sourcePrompt,
        asset.notes,
        ...asset.manualTags,
        ...asset.aiTags,
        ...asset.safetyTags,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query)
    })
  }, [assets, filters])

  const selectedAsset = assets.find((asset) => asset.id === selectedId) || filteredAssets[0] || assets[0]

  useEffect(() => {
    if (selectedAsset && selectedAsset.id !== selectedId) {
      setSelectedId(selectedAsset.id)
    }
  }, [selectedAsset, selectedId])

  useEffect(() => {
    if (isOnlineMode) void refreshAssets()
  }, [isOnlineMode])

  return (
    <div className={`grid gap-6 ${selectedAsset ? 'xl:grid-cols-[minmax(0,1fr)_420px]' : ''}`}>
      <div className="min-w-0 space-y-6">
        <StatsRow stats={stats} />

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-950">素材操作</h2>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {isOnlineMode ? '线上模式直接读取 Cloudflare D1 中的 media_library_assets，适合查看 History 卡片导入后的资源。' : '上传会先走现有 R2 上传接口，再把返回 URL 写入素材库；History 导入读取最近 200 条生成记录。'}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={refreshAssets}
                disabled={Boolean(busyAction)}
                className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                重新读取
              </button>
              {!isOnlineMode ? (
                <>
                  <button
                    type="button"
                    onClick={importRecentHistory}
                    disabled={Boolean(busyAction)}
                    className="inline-flex h-10 items-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    导入最近 History
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={Boolean(busyAction)}
                    className="inline-flex h-10 items-center rounded-lg border border-indigo-200 bg-indigo-50 px-4 text-sm font-semibold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    上传素材
                  </button>
                </>
              ) : null}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0]
                  event.currentTarget.value = ''
                  if (file) void uploadAsset(file)
                }}
              />
            </div>
          </div>

          {!isOnlineMode ? (
            <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_180px]">
            <input
              value={urlDraft}
              onChange={(event) => setUrlDraft(event.target.value)}
              placeholder="粘贴 R2 图片 / 视频 URL"
              className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
            <input
              value={titleDraft}
              onChange={(event) => setTitleDraft(event.target.value)}
              placeholder="标题，可选"
              className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
            <button
              type="button"
              onClick={createUrlAsset}
              disabled={Boolean(busyAction) || !urlDraft.trim()}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              URL 入库
            </button>
          </div>
          ) : null}

          {!isOnlineMode ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {quickTagSets.map((tags) => (
              <button
                key={tags.join('|')}
                type="button"
                onClick={() => setTagDraft(tags.join(', '))}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-700"
              >
                {tags.join(' + ')}
              </button>
              ))}
            </div>
          ) : null}

          {notice ? (
            <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{notice}</p>
          ) : null}
          {error ? (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}
        </section>

        {!isOnlineMode ? (
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/80 px-5 py-4">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-950">线上资源池</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  从线上 R2 资源里筛选图片 / 视频，勾选后导入素材库；已入库资源会自动标记。
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void loadOnlineResources()}
                  disabled={Boolean(busyAction)}
                  className="inline-flex h-10 items-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  读取线上资源
                </button>
                <button
                  type="button"
                  onClick={() => void importSelectedOnlineResources()}
                  disabled={Boolean(busyAction) || selectedOnlineKeys.length === 0}
                  className="inline-flex h-10 items-center rounded-lg border border-indigo-200 bg-indigo-50 px-4 text-sm font-semibold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  导入所选
                </button>
                <button
                  type="button"
                  onClick={() => void loadOnlineResources(onlineNextCursor)}
                  disabled={Boolean(busyAction) || !onlineNextCursor}
                  className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  下一页
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-2 md:grid-cols-[180px_140px_minmax(0,1fr)]">
              <input
                value={onlineFilters.prefix}
                onChange={(event) => setOnlineFilters({ ...onlineFilters, prefix: event.target.value })}
                placeholder="R2 前缀，如 uploads/"
                className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-indigo-400"
              />
              <Select value={onlineFilters.type} onChange={(type) => setOnlineFilters({ ...onlineFilters, type: type as OnlineResourceFilters['type'] })}>
                <option value="all">全部类型</option>
                <option value="image">图片</option>
                <option value="video">视频</option>
              </Select>
              <input
                value={onlineFilters.query}
                onChange={(event) => setOnlineFilters({ ...onlineFilters, query: event.target.value })}
                placeholder="搜索 key / URL，例如 full body、clothes、demo"
                className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-indigo-400"
              />
            </div>

            <p className="mt-3 text-xs text-slate-500">
              当前线上结果 {onlineResources.length.toLocaleString('zh-CN')} 个
              {onlineBucket ? ` · bucket: ${onlineBucket}` : ''}
              {onlineNextCursor ? ' · 还有下一页' : ''}
              {selectedOnlineKeys.length > 0 ? ` · 已选择 ${selectedOnlineKeys.length.toLocaleString('zh-CN')} 个` : ''}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-white text-xs font-semibold text-slate-500">
                  <th className="px-5 py-3">选择</th>
                  <th className="px-4 py-3">预览</th>
                  <th className="px-4 py-3">线上资源</th>
                  <th className="px-4 py-3">类型</th>
                  <th className="px-5 py-3">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {onlineResources.length > 0 ? onlineResources.map((resource) => (
                  <tr key={resource.key} className="text-sm transition hover:bg-indigo-50/30">
                    <td className="px-5 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOnlineKeys.includes(resource.key)}
                        disabled={resource.alreadyInLibrary || Boolean(busyAction)}
                        onChange={() => toggleOnlineResource(resource.key)}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <OnlineResourceThumb resource={resource} />
                    </td>
                    <td className="px-4 py-4">
                      <a href={resource.url} target="_blank" rel="noreferrer" className="max-w-xl truncate font-semibold text-slate-950 transition hover:text-indigo-700">
                        {resource.key}
                      </a>
                      <p className="mt-1 max-w-xl truncate font-mono text-[11px] text-slate-400">{resource.url}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {formatBytes(resource.sizeBytes)}{resource.uploadedAt ? ` · ${formatDate(resource.uploadedAt)}` : ''}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-xs font-semibold text-slate-600">{resource.type}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${resource.alreadyInLibrary ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-slate-100 text-slate-600 ring-slate-200'}`}>
                        {resource.alreadyInLibrary ? '已在库' : '可导入'}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500">
                      点击“读取线上资源”后，这里会显示可导入的 R2 图片和视频。
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          </section>
        ) : null}

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50/80 px-5 py-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-950">素材列表</h2>
                <p className="mt-1 text-xs text-slate-500">
                  当前显示 {filteredAssets.length.toLocaleString('zh-CN')} / {assets.length.toLocaleString('zh-CN')} 个素材。
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                <input
                  value={filters.query}
                  onChange={(event) => setFilters({ ...filters, query: event.target.value })}
                  placeholder="搜索"
                  className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-indigo-400"
                />
                <Select value={filters.type} onChange={(type) => setFilters({ ...filters, type: type as Filters['type'] })}>
                  <option value="all">全部类型</option>
                  <option value="image">图片</option>
                  <option value="video">视频</option>
                </Select>
                <Select value={filters.source} onChange={(source) => setFilters({ ...filters, source: source as Filters['source'] })}>
                  <option value="all">全部来源</option>
                  <option value="history">History</option>
                  <option value="upload">上传</option>
                  <option value="generated">生成</option>
                </Select>
                <Select value={filters.reviewStatus} onChange={(reviewStatus) => setFilters({ ...filters, reviewStatus: reviewStatus as Filters['reviewStatus'] })}>
                  <option value="all">全部状态</option>
                  <option value="candidate">待整理</option>
                  <option value="needs_review">需审核</option>
                  <option value="approved">已批准</option>
                  <option value="rejected">已拒绝</option>
                </Select>
                <input
                  value={filters.tags}
                  onChange={(event) => setFilters({ ...filters, tags: event.target.value })}
                  placeholder="标签，逗号分隔"
                  className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-indigo-400"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1120px] w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-white text-xs font-semibold text-slate-500">
                  <th className="px-5 py-3">预览</th>
                  <th className="px-4 py-3">素材</th>
                  <th className="px-4 py-3">标签</th>
                  <th className="px-4 py-3">来源</th>
                  <th className="px-5 py-3">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAssets.length > 0 ? filteredAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    onClick={() => setSelectedId(asset.id)}
                    className={`cursor-pointer text-sm transition ${asset.id === selectedAsset?.id ? 'bg-indigo-50/70' : 'hover:bg-indigo-50/30'}`}
                  >
                    <td className="px-5 py-4">
                      <AssetThumb asset={asset} />
                    </td>
                    <td className="px-4 py-4">
                      <p className="max-w-72 truncate font-semibold text-slate-950">{asset.title || asset.id}</p>
                      <p className="mt-1 max-w-72 truncate font-mono text-[11px] text-slate-400">{asset.url}</p>
                      <p className="mt-1 text-xs text-slate-500">{asset.type} · 使用 {asset.usageCount}</p>
                    </td>
                    <td className="px-4 py-4">
                      <TagList tags={[...asset.manualTags, ...asset.aiTags, ...asset.safetyTags]} />
                    </td>
                    <td className="px-4 py-4 text-xs leading-5 text-slate-500">
                      <p className="font-semibold text-slate-700">{sourceLabels[asset.source]}</p>
                      <p>{asset.sourceToolLabel || asset.sourceToolSlug || asset.sourceRole || '—'}</p>
                      <p className="max-w-52 truncate font-mono text-[11px] text-slate-400">{asset.sourceHistoryId || '—'}</p>
                    </td>
                    <td className="px-5 py-4">
                      <StatusPill status={asset.reviewStatus} />
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-14 text-center text-sm text-slate-500">
                      暂无匹配素材。
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {selectedAsset ? (
        <AssetDetailPanel
          asset={selectedAsset}
          storagePath={storagePath}
          busyAction={busyAction}
          onTagWithAi={tagSelectedAssetWithAi}
          onSave={saveAssetPatch}
          readOnly={isOnlineMode}
        />
      ) : null}
    </div>
  )

  async function refreshAssets() {
    setBusyAction('refresh')
    clearMessages()
    try {
      const payload = await requestJson(isOnlineMode ? '/api/media-library/assets' : '/api/admin/media-library')
      replaceAssets(payload)
      setNotice(isOnlineMode ? '线上素材库已重新读取。' : '素材库已重新读取。')
    } catch (requestError) {
      setError(readErrorMessage(requestError))
    } finally {
      setBusyAction('')
    }
  }

  async function createUrlAsset() {
    setBusyAction('create-url')
    clearMessages()
    try {
      const payload = await requestJson('/api/admin/media-library', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          action: 'create_url',
          url: urlDraft,
          title: titleDraft,
          manualTags: tagDraft,
        }),
      })
      mergeAsset(payload.asset)
      if (payload.stats) setStats(payload.stats)
      if (payload.asset) setSelectedId(payload.asset.id)
      setUrlDraft('')
      setTitleDraft('')
      setNotice('URL 素材已入库。')
    } catch (requestError) {
      setError(readErrorMessage(requestError))
    } finally {
      setBusyAction('')
    }
  }

  async function uploadAsset(file: File) {
    setBusyAction('upload')
    clearMessages()
    try {
      const formData = new FormData()
      formData.append('file', file)
      const uploadPayload = await requestJson(getImageUploadUrl(), {
        method: 'POST',
        body: formData,
      })
      if (!uploadPayload.url) throw new Error('上传接口没有返回 URL。')
      const payload = await requestJson('/api/admin/media-library', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          action: 'create_url',
          url: uploadPayload.url,
          type: file.type.startsWith('video/') ? 'video' : 'image',
          title: file.name,
          source: 'upload',
          manualTags: tagDraft,
        }),
      })
      mergeAsset(payload.asset)
      if (payload.stats) setStats(payload.stats)
      if (payload.asset) setSelectedId(payload.asset.id)
      setNotice('上传素材已入库。')
    } catch (requestError) {
      setError(readErrorMessage(requestError))
    } finally {
      setBusyAction('')
    }
  }

  async function loadOnlineResources(cursor?: string) {
    setBusyAction('load-online')
    clearMessages()
    try {
      const params = new URLSearchParams()
      params.set('prefix', onlineFilters.prefix)
      params.set('type', onlineFilters.type)
      params.set('limit', '200')
      if (onlineFilters.query.trim()) params.set('q', onlineFilters.query.trim())
      if (cursor) params.set('cursor', cursor)

      const payload = await requestJson(`/api/admin/media-library/online-resources?${params.toString()}`)
      setOnlineResources(payload.resources || [])
      setSelectedOnlineKeys([])
      setOnlineNextCursor(payload.nextCursor || '')
      setOnlineBucket(payload.bucket || '')
      if (payload.configMissing) {
        setError(payload.message || '未配置 R2 列表权限。')
      } else {
        setNotice(`已读取 ${Number(payload.total || 0).toLocaleString('zh-CN')} 个线上资源。`)
      }
    } catch (requestError) {
      setError(readErrorMessage(requestError))
    } finally {
      setBusyAction('')
    }
  }

  async function importSelectedOnlineResources() {
    const selectedResources = onlineResources.filter((resource) => (
      selectedOnlineKeys.includes(resource.key) && !resource.alreadyInLibrary
    ))
    if (selectedResources.length === 0) {
      setError('请选择可导入的线上资源。')
      return
    }

    setBusyAction('import-online')
    clearMessages()
    try {
      let importedCount = 0
      let latestStats: MediaAssetStats | undefined
      for (const resource of selectedResources) {
        const payload = await requestJson('/api/admin/media-library', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            action: 'create_url',
            url: resource.url,
            type: resource.type,
            title: resource.key.split('/').pop() || resource.key,
            source: 'generated',
            manualTags: tagDraft,
            notes: `从线上资源池导入：${resource.key}`,
          }),
        })
        mergeAsset(payload.asset)
        if (payload.stats) latestStats = payload.stats
        if (payload.asset) setSelectedId(payload.asset.id)
        importedCount += 1
      }
      if (latestStats) setStats(latestStats)
      setOnlineResources((current) => current.map((resource) => (
        selectedOnlineKeys.includes(resource.key)
          ? { ...resource, alreadyInLibrary: true }
          : resource
      )))
      setSelectedOnlineKeys([])
      setNotice(`已导入 ${importedCount.toLocaleString('zh-CN')} 个线上资源到素材库。`)
    } catch (requestError) {
      setError(readErrorMessage(requestError))
    } finally {
      setBusyAction('')
    }
  }

  function toggleOnlineResource(key: string) {
    setSelectedOnlineKeys((current) => (
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key]
    ))
  }

  async function importRecentHistory() {
    setBusyAction('import-history')
    clearMessages()
    try {
      const payload = await requestJson('/api/admin/media-library', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action: 'import_recent_history' }),
      })
      replaceAssets(payload)
      setNotice(`History 导入完成：新增 ${payload.importedCount || 0} 个，跳过 ${payload.skippedCount || 0} 个。`)
    } catch (requestError) {
      setError(readErrorMessage(requestError))
    } finally {
      setBusyAction('')
    }
  }

  async function tagSelectedAssetWithAi(assetId: string) {
    if (isOnlineMode) {
      setError('线上 D1 素材库当前先提供只读查看，编辑和 AI 打标下一步接入。')
      return
    }

    setBusyAction(`ai-${assetId}`)
    clearMessages()
    try {
      const payload = await requestJson('/api/admin/media-library', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action: 'ai_tag', assetId }),
      })
      mergeAsset(payload.asset)
      if (payload.stats) setStats(payload.stats)
      setNotice(payload.message || 'AI 标签已更新。')
    } catch (requestError) {
      setError(readErrorMessage(requestError))
    } finally {
      setBusyAction('')
    }
  }

  async function saveAssetPatch(assetId: string, patch: {
    title?: string
    manualTags?: string
    safetyTags?: string
    reviewStatus?: MediaAssetReviewStatus
    notes?: string
  }) {
    if (isOnlineMode) {
      setError('线上 D1 素材库当前先提供只读查看，编辑和审核下一步接入。')
      return
    }

    setBusyAction(`save-${assetId}`)
    clearMessages()
    try {
      const payload = await requestJson('/api/admin/media-library', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          assetId,
          ...patch,
        }),
      })
      mergeAsset(payload.asset)
      if (payload.stats) setStats(payload.stats)
      setNotice('素材已保存。')
    } catch (requestError) {
      setError(readErrorMessage(requestError))
    } finally {
      setBusyAction('')
    }
  }

  function replaceAssets(payload: ApiPayload) {
    if (payload.assets) setAssets(payload.assets)
    if (payload.stats) setStats(payload.stats)
  }

  function mergeAsset(asset: MediaAsset | undefined) {
    if (!asset) return
    setAssets((current) => {
      const index = current.findIndex((item) => item.id === asset.id)
      if (index < 0) return [asset, ...current]
      return current.map((item) => (item.id === asset.id ? asset : item))
    })
  }

  function clearMessages() {
    setNotice('')
    setError('')
  }
}

function AssetDetailPanel({
  asset,
  storagePath,
  busyAction,
  onTagWithAi,
  onSave,
  readOnly = false,
}: {
  asset?: MediaAsset
  storagePath: string
  busyAction: string
  onTagWithAi: (assetId: string) => Promise<void>
  onSave: (assetId: string, patch: {
    title?: string
    manualTags?: string
    safetyTags?: string
    reviewStatus?: MediaAssetReviewStatus
    notes?: string
  }) => Promise<void>
  readOnly?: boolean
}) {
  const [title, setTitle] = useState('')
  const [manualTags, setManualTags] = useState('')
  const [safetyTags, setSafetyTags] = useState('')
  const [reviewStatus, setReviewStatus] = useState<MediaAssetReviewStatus>('candidate')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    setTitle(asset?.title || '')
    setManualTags(asset?.manualTags.join(', ') || '')
    setSafetyTags(asset?.safetyTags.join(', ') || '')
    setReviewStatus(asset?.reviewStatus || 'candidate')
    setNotes(asset?.notes || '')
  }, [asset?.id])

  if (!asset) {
    return (
      <aside className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">选择一个素材后可以编辑标签和审核状态。</p>
      </aside>
    )
  }

  const isBusy = Boolean(busyAction)

  return (
    <aside className="xl:sticky xl:top-6 xl:self-start">
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/80 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-950">素材详情</h2>
          <p className="mt-1 truncate font-mono text-[11px] text-slate-400">{asset.id}</p>
        </div>

        <div className="p-5">
          <a href={asset.url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
            {asset.type === 'video' ? (
              <video src={asset.url} poster={asset.posterUrl} controls muted preload="metadata" className="aspect-video w-full bg-slate-950 object-contain" />
            ) : (
              <img src={asset.url} alt={asset.title || '素材预览'} className="aspect-square w-full bg-slate-100 object-contain" loading="lazy" referrerPolicy="no-referrer" />
            )}
          </a>

          <div className="mt-5 space-y-4">
            <Field label="标题">
              <input value={title} onChange={(event) => setTitle(event.target.value)} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-indigo-400" />
            </Field>

            <Field label="人工标签">
              <textarea value={manualTags} onChange={(event) => setManualTags(event.target.value)} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" />
            </Field>

            <Field label="安全标签">
              <textarea value={safetyTags} onChange={(event) => setSafetyTags(event.target.value)} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" />
            </Field>

            <Field label="审核状态">
              <Select value={reviewStatus} onChange={(value) => setReviewStatus(value as MediaAssetReviewStatus)}>
                <option value="candidate">待整理</option>
                <option value="needs_review">需审核</option>
                <option value="approved">已批准</option>
                <option value="rejected">已拒绝</option>
              </Select>
            </Field>

            <Field label="备注">
              <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" />
            </Field>
          </div>

          {asset.aiTags.length > 0 || asset.analysisSummary ? (
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">AI 标签</p>
              <div className="mt-2">
                <TagList tags={asset.aiTags} />
              </div>
              {asset.analysisSummary ? <p className="mt-3 text-xs leading-5 text-slate-600">{asset.analysisSummary}</p> : null}
            </div>
          ) : null}

          {readOnly ? (
            <p className="mt-5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500">线上 D1 素材库当前为只读查看，标签编辑会在下一步接入。</p>
          ) : (
            <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onSave(asset.id, { title, manualTags, safetyTags, reviewStatus, notes })}
              disabled={isBusy}
              className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              保存
            </button>
            <button
              type="button"
              onClick={() => onTagWithAi(asset.id)}
              disabled={isBusy}
              className="inline-flex h-10 flex-1 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 px-4 text-sm font-semibold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              AI 打标签
            </button>
          </div>
          )}

          {!readOnly ? (
            <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onSave(asset.id, { title, manualTags, safetyTags, reviewStatus: 'approved', notes })}
              disabled={isBusy}
              className="h-9 rounded-lg border border-emerald-200 bg-emerald-50 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              批准复用
            </button>
            <button
              type="button"
              onClick={() => onSave(asset.id, { title, manualTags, safetyTags, reviewStatus: 'rejected', notes })}
              disabled={isBusy}
              className="h-9 rounded-lg border border-red-200 bg-red-50 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              拒绝
            </button>
            </div>
          ) : null}

          <dl className="mt-5 grid gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
            <Meta label="来源" value={`${sourceLabels[asset.source]} / ${asset.sourceRole || '—'}`} />
            <Meta label="模型" value={asset.sourceModel || '—'} />
            <Meta label="路径" value={asset.sourcePath || '—'} />
            <Meta label="存储" value={storagePath} />
          </dl>
        </div>
      </section>
    </aside>
  )
}

function StatsRow({ stats }: { stats: MediaAssetStats }) {
  const items = [
    ['总素材', stats.total],
    ['图片', stats.images],
    ['视频', stats.videos],
    ['已批准', stats.approved],
    ['需审核', stats.needsReview],
    ['History', stats.history],
  ] as const

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
      {items.map(([label, value]) => (
        <article key={label} className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">{value.toLocaleString('zh-CN')}</p>
        </article>
      ))}
    </section>
  )
}

function AssetThumb({ asset }: { asset: MediaAsset }) {
  return (
    <div className="h-20 w-28 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
      {asset.type === 'video' ? (
        <video src={asset.url} poster={asset.posterUrl} muted preload="metadata" className="h-full w-full bg-slate-950 object-cover" />
      ) : (
        <img src={asset.url} alt={asset.title || '素材缩略图'} loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
      )}
    </div>
  )
}

function OnlineResourceThumb({ resource }: { resource: OnlineMediaResource }) {
  return (
    <div className="h-20 w-28 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
      {resource.type === 'video' ? (
        <video src={resource.url} muted preload="metadata" className="h-full w-full bg-slate-950 object-cover" />
      ) : (
        <img src={resource.url} alt={resource.key} loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
      )}
    </div>
  )
}

function TagList({ tags }: { tags: string[] }) {
  const visible = Array.from(new Set(tags)).slice(0, 10)
  if (visible.length === 0) return <span className="text-xs text-slate-400">未打标签</span>

  return (
    <div className="flex max-w-xl flex-wrap gap-1.5">
      {visible.map((tag) => (
        <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200">
          {tag}
        </span>
      ))}
    </div>
  )
}

function StatusPill({ status }: { status: MediaAssetReviewStatus }) {
  const className = status === 'approved'
    ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
    : status === 'rejected'
      ? 'bg-red-50 text-red-700 ring-red-200'
      : status === 'needs_review'
        ? 'bg-amber-50 text-amber-700 ring-amber-200'
        : 'bg-slate-100 text-slate-600 ring-slate-200'

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${className}`}>
      {statusLabels[status]}
    </span>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-500">{label}</span>
      {children}
    </label>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[64px_minmax(0,1fr)] gap-2">
      <dt className="font-semibold text-slate-400">{label}</dt>
      <dd className="truncate font-mono text-slate-500">{value}</dd>
    </div>
  )
}

function Select({
  value,
  onChange,
  children,
}: {
  value: string
  onChange: (value: string) => void
  children: ReactNode
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 outline-none transition focus:border-indigo-400"
    >
      {children}
    </select>
  )
}

async function requestJson(url: string, init?: RequestInit): Promise<ApiPayload> {
  const response = await fetch(url, { credentials: 'include', ...init })
  const payload = await response.json().catch(() => ({})) as ApiPayload
  if (!response.ok) throw new Error(payload.error || `请求失败：${response.status}`)
  return payload
}

function formatBytes(value: number | undefined): string {
  const bytes = Number(value)
  if (!Number.isFinite(bytes) || bytes <= 0) return '大小未知'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function parseTags(value: string): string[] {
  return value
    .split(/[,，\n]/)
    .map((tag) => tag.trim().toLowerCase().replace(/[\s-]+/g, '_'))
    .filter(Boolean)
}

function readErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '操作失败。'
}
