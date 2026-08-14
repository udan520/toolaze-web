'use client'

import { useEffect, useMemo, useState } from 'react'
import type { DragEvent as ReactDragEvent, FormEvent } from 'react'
import type {
  AdminReleaseCalendar,
  AdminReleaseDay,
  AdminReleaseItem,
} from '@/lib/admin/release-calendar'

type ManualCalendarItem = {
  id: string
  date: string
  title: string
  createdAt: string
}

type ReleaseItemOverride = {
  itemId: string
  date: string | null
  hidden: boolean
  updatedAt: string
}

type CalendarItemKind = 'release' | 'manual'

type CalendarDragItem = {
  kind: CalendarItemKind
  itemId: string
  title: string
}

type CalendarReleaseTone = 'landing' | 'major'

type CalendarReleaseItem = {
  item: AdminReleaseItem
  tone: CalendarReleaseTone
  date: string
  originalDate: string
}

const WEEKDAY_HEADERS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const MANUAL_STORAGE_KEY = 'toolaze.admin.release-calendar.items.v2'
const RELEASE_OVERRIDE_STORAGE_KEY = 'toolaze.admin.release-calendar.release-overrides.v1'
const CALENDAR_DRAG_MIME_TYPE = 'application/x-toolaze-calendar-item'

export function ReleaseCalendarPlanner({ data }: { data: AdminReleaseCalendar }) {
  const [manualItems, setManualItems] = useState<ManualCalendarItem[]>([])
  const [releaseItemOverrides, setReleaseItemOverrides] = useState<ReleaseItemOverride[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedReleaseItem, setSelectedReleaseItem] = useState<AdminReleaseItem | null>(null)
  const [draftTitle, setDraftTitle] = useState('')
  const [calendarDragItem, setCalendarDragItem] = useState<CalendarDragItem | null>(null)
  const [dragOverDate, setDragOverDate] = useState<string | null>(null)
  const [hasLoadedStoredItems, setHasLoadedStoredItems] = useState(false)
  const weeks = useMemo(() => buildCalendarWeeks(data.days), [data.days])
  const dateOptions = useMemo(() => data.days.map((day) => day.date), [data.days])
  const releaseItemsByDate = useMemo(
    () => groupReleaseItemsByDate(data.days, releaseItemOverrides, dateOptions),
    [data.days, dateOptions, releaseItemOverrides],
  )
  const manualItemsByDate = useMemo(() => groupManualItemsByDate(manualItems), [manualItems])
  const activeDayCount = useMemo(() => {
    const activeDates = new Set<string>()

    for (const day of data.days) {
      if ((releaseItemsByDate.get(day.date) || []).length > 0) activeDates.add(day.date)
    }

    for (const item of manualItems) activeDates.add(item.date)
    return activeDates.size
  }, [data.days, manualItems, releaseItemsByDate])
  const activeDropDate = calendarDragItem ? dragOverDate : null
  const statItems = [
    { label: '新落地页', value: data.totals.landingPages, detail: '根据新增页面、文案和多语言数据归类' },
    { label: '重要优化', value: data.totals.majorUpdates, detail: '价格、付费、后台大功能、发布优化和工具体验优化' },
    { label: '手动事项', value: manualItems.length, detail: '点击日期添加事项；拖动任务卡片可移动日期，悬停右上角可删除。' },
    { label: '有记录天数', value: activeDayCount, detail: '近 30 天中存在发版记录或手动事项的日期' },
  ]

  useEffect(() => {
    try {
      const storedManualItems = window.localStorage.getItem(MANUAL_STORAGE_KEY)
      if (storedManualItems) {
        setManualItems(normalizeManualItems(JSON.parse(storedManualItems)))
      }

      const storedReleaseOverrides = window.localStorage.getItem(RELEASE_OVERRIDE_STORAGE_KEY)
      if (storedReleaseOverrides) {
        setReleaseItemOverrides(normalizeReleaseItemOverrides(JSON.parse(storedReleaseOverrides)))
      }
    } catch {
      setManualItems([])
      setReleaseItemOverrides([])
    } finally {
      setHasLoadedStoredItems(true)
    }
  }, [])

  useEffect(() => {
    if (!hasLoadedStoredItems) return
    window.localStorage.setItem(MANUAL_STORAGE_KEY, JSON.stringify(manualItems))
    window.localStorage.setItem(RELEASE_OVERRIDE_STORAGE_KEY, JSON.stringify(releaseItemOverrides))
  }, [hasLoadedStoredItems, manualItems, releaseItemOverrides])

  function openAddDialog(date: string) {
    setSelectedDate(date)
    setDraftTitle('')
  }

  function closeAddDialog() {
    setSelectedDate(null)
    setDraftTitle('')
  }

  function addManualItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = draftTitle.trim()
    if (!selectedDate || !title) return

    setManualItems((items) => [
      ...items,
      {
        id: createManualItemId(),
        date: selectedDate,
        title,
        createdAt: new Date().toISOString(),
      },
    ])
    closeAddDialog()
  }

  function moveCalendarItem(kind: CalendarItemKind, itemId: string, nextDate: string) {
    if (kind === 'release') {
      moveReleaseItem(itemId, nextDate)
    } else {
      moveManualItem(itemId, nextDate)
    }
  }

  function moveManualItem(itemId: string, nextDate: string) {
    setManualItems((items) => items.map((item) => (
      item.id === itemId ? { ...item, date: nextDate } : item
    )))
  }

  function moveReleaseItem(itemId: string, nextDate: string) {
    setReleaseItemOverrides((items) => upsertReleaseItemOverride(items, {
      itemId,
      date: nextDate,
      hidden: false,
      updatedAt: new Date().toISOString(),
    }))
  }

  function deleteCalendarItem(kind: CalendarItemKind, itemId: string) {
    if (kind === 'release') {
      deleteReleaseItem(itemId)
    } else {
      deleteManualItem(itemId)
    }
  }

  function deleteManualItem(itemId: string) {
    setManualItems((items) => items.filter((item) => item.id !== itemId))
  }

  function deleteReleaseItem(itemId: string) {
    setReleaseItemOverrides((items) => upsertReleaseItemOverride(items, {
      itemId,
      date: null,
      hidden: true,
      updatedAt: new Date().toISOString(),
    }))
  }

  function resetReleaseItemOverrides() {
    setReleaseItemOverrides([])
  }

  function startCalendarDrag(event: ReactDragEvent<HTMLDivElement>, item: CalendarDragItem) {
    event.stopPropagation()
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData(CALENDAR_DRAG_MIME_TYPE, JSON.stringify(item))
    event.dataTransfer.setData('text/plain', item.title)
    setCalendarDragItem(item)
  }

  function finishCalendarDrag() {
    setCalendarDragItem(null)
    setDragOverDate(null)
  }

  function handleCalendarDragOver(event: ReactDragEvent<HTMLElement>, date: string) {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    setDragOverDate(date)
  }

  function handleCalendarDragLeave(event: ReactDragEvent<HTMLElement>, date: string) {
    const nextTarget = event.relatedTarget
    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) return
    setDragOverDate((currentDate) => (currentDate === date ? null : currentDate))
  }

  function handleCalendarDrop(event: ReactDragEvent<HTMLElement>, date: string) {
    event.preventDefault()
    event.stopPropagation()

    const item = calendarDragItem || parseCalendarDragItem(event.dataTransfer.getData(CALENDAR_DRAG_MIME_TYPE))
    if (item) {
      moveCalendarItem(item.kind, item.itemId, date)
    }
    finishCalendarDrag()
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statItems.map((item) => (
          <article key={item.label} className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {item.value.toLocaleString('zh-CN')}
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-500">{item.detail}</p>
          </article>
        ))}
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/80 px-5 py-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-950">近 30 天发版日历</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              蓝色为新落地页；灰色为价格、套餐、支付、订阅或后台大功能更新；绿色为你手动添加的个人事项。
              所有事项都可拖动、移动或删除；发版项的移动和删除只保存在当前浏览器。
            </p>
          </div>
          <div className="space-y-2 text-xs text-slate-400 lg:text-right">
            <div>
              <p>来源：{data.sourceLabel}</p>
              <p>本地调整保存在当前浏览器。</p>
            </div>
            {releaseItemOverrides.length > 0 ? (
              <button
                type="button"
                className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-700"
                onClick={resetReleaseItemOverrides}
              >
                重置本地调整
              </button>
            ) : null}
          </div>
        </div>

        <div className="overflow-x-auto p-4">
          <div className="min-w-[1540px]">
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500">
              {WEEKDAY_HEADERS.map((weekday) => (
                <div key={weekday} className="rounded-lg bg-slate-100 px-3 py-2">{weekday}</div>
              ))}
            </div>

            <div className="mt-2 space-y-2">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-2">
                  {week.map((day, dayIndex) => (
                    day ? (
                      <ReleaseDayCard
                        key={day.date}
                        day={day}
                        releaseItems={releaseItemsByDate.get(day.date) || []}
                        manualItems={manualItemsByDate.get(day.date) || []}
                        onOpenAddDialog={openAddDialog}
                        onOpenReleaseDetails={setSelectedReleaseItem}
                        onDeleteCalendarItem={deleteCalendarItem}
                        onCalendarDragStart={startCalendarDrag}
                        onCalendarDragEnd={finishCalendarDrag}
                        onCalendarDragOver={handleCalendarDragOver}
                        onCalendarDragLeave={handleCalendarDragLeave}
                        onCalendarDrop={handleCalendarDrop}
                        isDropTarget={activeDropDate === day.date}
                      />
                    ) : (
                      <div key={`empty-${weekIndex}-${dayIndex}`} className="min-h-[220px] rounded-xl border border-dashed border-slate-100 bg-slate-50/60" />
                    )
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {selectedReleaseItem ? (
        <ReleaseDetailDrawer
          item={selectedReleaseItem}
          onClose={() => setSelectedReleaseItem(null)}
        />
      ) : null}

      {selectedDate ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="添加事项"
          onClick={closeAddDialog}
        >
          <form
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
            onSubmit={addManualItem}
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-sm font-semibold text-indigo-600">{selectedDate}</p>
            <h3 className="mt-1 text-xl font-semibold text-slate-950">添加事项</h3>
            <label htmlFor="release-calendar-manual-title" className="mt-5 block text-sm font-medium text-slate-700">
              事项名称
            </label>
            <input
              id="release-calendar-manual-title"
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              autoFocus
              className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="例如：上线 Wan 2.5 落地页"
            />
            <p className="mt-2 text-xs text-slate-500">保存后可拖拽调整日期，也可以随时删除。</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-slate-300"
                onClick={closeAddDialog}
              >
                取消
              </button>
              <button
                type="submit"
                className="inline-flex h-10 items-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!draftTitle.trim()}
              >
                保存事项
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  )
}

function ReleaseDayCard({
  day,
  releaseItems,
  manualItems,
  onOpenAddDialog,
  onOpenReleaseDetails,
  onDeleteCalendarItem,
  onCalendarDragStart,
  onCalendarDragEnd,
  onCalendarDragOver,
  onCalendarDragLeave,
  onCalendarDrop,
  isDropTarget,
}: {
  day: AdminReleaseDay
  releaseItems: CalendarReleaseItem[]
  manualItems: ManualCalendarItem[]
  onOpenAddDialog: (date: string) => void
  onOpenReleaseDetails: (item: AdminReleaseItem) => void
  onDeleteCalendarItem: (kind: CalendarItemKind, itemId: string) => void
  onCalendarDragStart: (event: ReactDragEvent<HTMLDivElement>, item: CalendarDragItem) => void
  onCalendarDragEnd: () => void
  onCalendarDragOver: (event: ReactDragEvent<HTMLElement>, date: string) => void
  onCalendarDragLeave: (event: ReactDragEvent<HTMLElement>, date: string) => void
  onCalendarDrop: (event: ReactDragEvent<HTMLElement>, date: string) => void
  isDropTarget: boolean
}) {
  const changeCount = releaseItems.length + manualItems.length
  const isActive = changeCount > 0
  const cardClassName = [
    'min-h-[220px] rounded-xl border p-3 text-left transition',
    isDropTarget
      ? 'border-emerald-400 bg-emerald-50 ring-2 ring-emerald-200'
      : isActive
        ? 'border-indigo-200 bg-indigo-50/40'
        : 'border-slate-100 bg-white',
    'hover:border-indigo-300 hover:bg-indigo-50/30',
  ].filter(Boolean).join(' ')

  return (
    <article
      data-calendar-date={day.date}
      data-drop-active={isDropTarget ? 'true' : undefined}
      className={cardClassName}
      onClick={() => onOpenAddDialog(day.date)}
      onDragOver={(event) => onCalendarDragOver(event, day.date)}
      onDragLeave={(event) => onCalendarDragLeave(event, day.date)}
      onDrop={(event) => onCalendarDrop(event, day.date)}
      title="点击添加事项，或把事项拖动到这一天"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-xs font-semibold text-slate-950">{day.date.slice(5)}</p>
          <p className="mt-0.5 text-[11px] text-slate-400">{day.weekday}</p>
        </div>
        <div className="flex items-center gap-1">
          {isActive ? (
            <span className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-indigo-700 shadow-sm">
              {changeCount} 项
            </span>
          ) : null}
          <button
            type="button"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-600 hover:text-white"
            aria-label={`给 ${day.date} 添加事项`}
            onClick={(event) => {
              event.stopPropagation()
              onOpenAddDialog(day.date)
            }}
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {releaseItems.map((releaseItem) => (
          <ReleaseItemBadge
            key={`${releaseItem.item.id}:${releaseItem.date}`}
            releaseItem={releaseItem}
            onOpenReleaseDetails={onOpenReleaseDetails}
            onDeleteCalendarItem={onDeleteCalendarItem}
            onCalendarDragStart={onCalendarDragStart}
            onCalendarDragEnd={onCalendarDragEnd}
          />
        ))}
        {manualItems.map((item) => (
          <ManualItemBadge
            key={item.id}
            item={item}
            onDeleteCalendarItem={onDeleteCalendarItem}
            onCalendarDragStart={onCalendarDragStart}
            onCalendarDragEnd={onCalendarDragEnd}
          />
        ))}
        {!isActive ? (
          <p className="rounded-lg bg-slate-50 px-3 py-6 text-center text-xs text-slate-400">点击添加事项</p>
        ) : null}
      </div>
    </article>
  )
}

function ReleaseItemBadge({
  releaseItem,
  onOpenReleaseDetails,
  onDeleteCalendarItem,
  onCalendarDragStart,
  onCalendarDragEnd,
}: {
  releaseItem: CalendarReleaseItem
  onOpenReleaseDetails: (item: AdminReleaseItem) => void
  onDeleteCalendarItem: (kind: CalendarItemKind, itemId: string) => void
  onCalendarDragStart: (event: ReactDragEvent<HTMLDivElement>, item: CalendarDragItem) => void
  onCalendarDragEnd: () => void
}) {
  const { item, tone } = releaseItem
  const typeMeta = getReleaseItemTypeMeta(item.kind)
  const dragItem = { kind: 'release' as const, itemId: item.id, title: item.label }
  const className = [
    'group relative cursor-grab select-none rounded-lg border bg-white px-3 py-2 pr-8 text-xs shadow-sm transition active:cursor-grabbing',
    getReleaseItemCardClass(item.kind, tone),
  ].filter(Boolean).join(' ')

  return (
    <div
      data-release-item-id={item.id}
      draggable
      className={className}
      title={`${typeMeta.label}：${item.summary}`}
      onClick={(event) => event.stopPropagation()}
      onDragStart={(event) => onCalendarDragStart(event, dragItem)}
      onDragEnd={onCalendarDragEnd}
    >
      <button
        type="button"
        className="block w-full text-left"
        draggable={false}
        onClick={() => onOpenReleaseDetails(item)}
      >
        <span className={`mb-1 inline-flex h-5 items-center rounded-full border px-2 text-[10px] font-semibold leading-none ${typeMeta.className}`}>
          {typeMeta.label}
        </span>
        <span className="block break-words pr-2 font-semibold leading-5">{item.summary}</span>
      </button>
      <button
        type="button"
        className="absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-red-200 bg-red-50 text-[11px] font-semibold leading-none text-red-700 opacity-0 shadow-sm transition hover:border-red-300 hover:bg-red-100 focus:opacity-100 group-hover:opacity-100"
        aria-label={`删除事项：${item.label}`}
        draggable={false}
        onClick={(event) => {
          event.stopPropagation()
          onDeleteCalendarItem('release', item.id)
        }}
      >
        ×
      </button>
    </div>
  )
}

function ReleaseDetailDrawer({ item, onClose }: { item: AdminReleaseItem; onClose: () => void }) {
  const typeMeta = getReleaseItemTypeMeta(item.kind)

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[60] flex justify-end bg-slate-950/35"
      role="dialog"
      aria-modal="true"
      aria-label="发布详情"
      onClick={onClose}
    >
      <aside
        className="flex h-full w-full max-w-xl flex-col overflow-hidden bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="border-b border-slate-200 px-6 py-5 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex h-6 items-center rounded-full border px-2.5 text-[11px] font-semibold ${typeMeta.className}`}>
                  {typeMeta.label}
                </span>
                <span className="font-mono text-xs text-slate-400">{item.date}</span>
              </div>
              <p className="mt-4 text-sm font-medium text-indigo-600">{item.label}</p>
              <h3 className="mt-1 text-2xl font-semibold leading-8 text-slate-950">{item.summary}</h3>
            </div>
            <button
              type="button"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-xl text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              aria-label="关闭发布详情"
              onClick={onClose}
            >
              ×
            </button>
          </div>
        </header>

        <div className="flex-1 space-y-7 overflow-y-auto px-6 py-6 sm:px-8">
          <section>
            <h4 className="text-sm font-semibold text-slate-950">具体发布内容</h4>
            <ul className="mt-3 space-y-3">
              {item.details.map((detail) => (
                <li key={detail} className="flex gap-3 text-sm leading-6 text-slate-600">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">影响页面</h4>
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block break-all text-sm font-semibold text-indigo-700 hover:text-indigo-900 hover:underline"
                >
                  {item.href}
                </a>
              ) : (
                <p className="mt-2 text-sm font-medium text-slate-700">全局功能</p>
              )}
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">变更规模</h4>
              <p className="mt-2 text-sm font-semibold text-slate-800">{item.fileCount} 个文件</p>
            </div>
          </section>

          <section>
            <h4 className="text-sm font-semibold text-slate-950">提交信息</h4>
            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-950 p-4 text-slate-200">
              <p className="font-mono text-xs text-indigo-300">{item.commitHash}</p>
              <p className="mt-2 text-sm leading-6">{item.title}</p>
            </div>
          </section>

          <section>
            <h4 className="text-sm font-semibold text-slate-950">涉及文件</h4>
            <div className="mt-3 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4">
              <ul className="space-y-2">
                {item.files.map((file) => (
                  <li key={file} className="break-all font-mono text-xs leading-5 text-slate-600">{file}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </aside>
    </div>
  )
}

function getReleaseItemCardClass(kind: AdminReleaseItem['kind'], tone: CalendarReleaseTone): string {
  if (kind === 'new-landing-page') return 'border-indigo-200 text-indigo-700 hover:border-indigo-300'
  if (kind === 'landing-page-update') return 'border-amber-200 text-slate-800 hover:border-amber-300'
  if (tone === 'landing') return 'border-indigo-200 text-indigo-700 hover:border-indigo-300'
  return 'border-slate-200 text-slate-700 hover:border-slate-300'
}

function getReleaseItemTypeMeta(kind: AdminReleaseItem['kind']): { label: string; className: string } {
  switch (kind) {
    case 'new-landing-page':
      return { label: '新增页', className: 'border-indigo-200 bg-indigo-50 text-indigo-700' }
    case 'landing-page-update':
      return { label: '优化页', className: 'border-amber-200 bg-amber-50 text-amber-700' }
    case 'pricing-update':
      return { label: '付费更新', className: 'border-rose-200 bg-rose-50 text-rose-700' }
    case 'admin-feature-update':
      return { label: '后台功能', className: 'border-slate-200 bg-slate-100 text-slate-700' }
    case 'release-optimization':
      return { label: '发布优化', className: 'border-cyan-200 bg-cyan-50 text-cyan-700' }
    case 'tool-experience-update':
      return { label: '工具优化', className: 'border-violet-200 bg-violet-50 text-violet-700' }
  }
}

function ManualItemBadge({
  item,
  onDeleteCalendarItem,
  onCalendarDragStart,
  onCalendarDragEnd,
}: {
  item: ManualCalendarItem
  onDeleteCalendarItem: (kind: CalendarItemKind, itemId: string) => void
  onCalendarDragStart: (event: ReactDragEvent<HTMLDivElement>, item: CalendarDragItem) => void
  onCalendarDragEnd: () => void
}) {
  const dragItem = { kind: 'manual' as const, itemId: item.id, title: item.title }
  const className = [
    'group relative cursor-grab select-none rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 pr-8 text-xs text-emerald-900 shadow-sm transition active:cursor-grabbing',
  ].filter(Boolean).join(' ')

  return (
    <div
      className={className}
      draggable
      onClick={(event) => event.stopPropagation()}
      onDragStart={(event) => onCalendarDragStart(event, dragItem)}
      onDragEnd={onCalendarDragEnd}
      title={item.title}
    >
      <button
        type="button"
        className="absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-red-200 bg-red-50 text-[11px] font-semibold leading-none text-red-700 opacity-0 shadow-sm transition hover:border-red-300 hover:bg-red-100 focus:opacity-100 group-hover:opacity-100"
        aria-label={`删除事项：${item.title}`}
        draggable={false}
        onClick={(event) => {
          event.stopPropagation()
          onDeleteCalendarItem('manual', item.id)
        }}
      >
        ×
      </button>
      <span className="block break-words pr-2 font-semibold leading-5">{item.title}</span>
    </div>
  )
}

export function buildCalendarWeeks(days: AdminReleaseDay[]): Array<Array<AdminReleaseDay | null>> {
  const weeks: Array<Array<AdminReleaseDay | null>> = []
  let currentWeek: Array<AdminReleaseDay | null> = []

  for (const day of days) {
    if (weeks.length === 0 && currentWeek.length === 0) {
      currentWeek = Array.from({ length: getMondayBasedOffset(day.date) }, () => null)
    }

    currentWeek.push(day)

    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null)
    weeks.push(currentWeek)
  }

  return weeks.reverse()
}

function getMondayBasedOffset(dateKey: string): number {
  const [year, month, day] = dateKey.split('-').map(Number)
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay()
  return weekday === 0 ? 6 : weekday - 1
}

function parseCalendarDragItem(value: string): CalendarDragItem | null {
  try {
    const item = JSON.parse(value)
    if (
      item
      && (item.kind === 'release' || item.kind === 'manual')
      && typeof item.itemId === 'string'
      && typeof item.title === 'string'
    ) {
      return item
    }
  } catch {
    return null
  }

  return null
}

function groupReleaseItemsByDate(
  days: AdminReleaseDay[],
  releaseItemOverrides: ReleaseItemOverride[],
  dateOptions: string[],
): Map<string, CalendarReleaseItem[]> {
  const result = new Map<string, CalendarReleaseItem[]>()
  const validDates = new Set(dateOptions)
  const overridesById = new Map(releaseItemOverrides.map((item) => [item.itemId, item]))

  for (const day of days) {
    for (const item of day.landingPages) {
      addReleaseItemToDateMap(result, item, 'landing', day.date, overridesById, validDates)
    }

    for (const item of day.majorUpdates) {
      addReleaseItemToDateMap(result, item, 'major', day.date, overridesById, validDates)
    }
  }

  return result
}

function addReleaseItemToDateMap(
  result: Map<string, CalendarReleaseItem[]>,
  item: AdminReleaseItem,
  tone: CalendarReleaseTone,
  originalDate: string,
  overridesById: Map<string, ReleaseItemOverride>,
  validDates: Set<string>,
) {
  const override = overridesById.get(item.id)
  if (override?.hidden) return

  const date = override?.date && validDates.has(override.date) ? override.date : originalDate
  const existingItems = result.get(date) || []
  result.set(date, [...existingItems, { item, tone, date, originalDate }])
}

function groupManualItemsByDate(items: ManualCalendarItem[]): Map<string, ManualCalendarItem[]> {
  const result = new Map<string, ManualCalendarItem[]>()

  for (const item of items) {
    const existingItems = result.get(item.date) || []
    result.set(item.date, [...existingItems, item])
  }

  return result
}

function upsertReleaseItemOverride(
  items: ReleaseItemOverride[],
  nextItem: ReleaseItemOverride,
): ReleaseItemOverride[] {
  const nextItems = items.filter((item) => item.itemId !== nextItem.itemId)
  return [...nextItems, nextItem]
}

function normalizeManualItems(value: unknown): ManualCalendarItem[] {
  if (!Array.isArray(value)) return []

  return value.filter((item): item is ManualCalendarItem => (
    Boolean(item)
    && typeof item.id === 'string'
    && typeof item.date === 'string'
    && typeof item.title === 'string'
    && typeof item.createdAt === 'string'
  ))
}

function normalizeReleaseItemOverrides(value: unknown): ReleaseItemOverride[] {
  if (!Array.isArray(value)) return []

  return value.filter((item): item is ReleaseItemOverride => (
    Boolean(item)
    && typeof item.itemId === 'string'
    && (typeof item.date === 'string' || item.date === null)
    && typeof item.hidden === 'boolean'
    && typeof item.updatedAt === 'string'
  ))
}

function createManualItemId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `manual-${Date.now()}-${Math.random().toString(16).slice(2)}`
}
