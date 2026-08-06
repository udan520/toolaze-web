import { createHash } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { MediaAssetType } from './media-library'

export const PAGE_DEMO_ASSIGNMENTS_SCHEMA_VERSION = 1
export const PAGE_DEMO_ALL_LOCALES = 'all'
export const DEFAULT_PAGE_DEMO_ASSIGNMENTS_PATH = path.join(
  process.cwd(),
  '_codex',
  'media-library',
  'page-demo-assignments.json',
)

export type PageDemoPlacement = 'hero_demo' | 'default_reference' | 'prompt_example'
export type PageDemoAssignmentStatus = 'draft' | 'published' | 'archived'
export type PageDemoApplyMode = 'demo_only' | 'demo_with_parameters'

export type PageDemoAssetSnapshot = {
  id: string
  type: MediaAssetType
  url: string
  posterUrl?: string
  title?: string
  durationSeconds?: number
  duration?: string
  uploadDate?: string
}

export type PageDemoAssignment = {
  id: string
  pageSlug: string
  locale: string
  placement: PageDemoPlacement
  applyMode: PageDemoApplyMode
  title?: string
  asset: PageDemoAssetSnapshot
  inputAssets: PageDemoAssetSnapshot[]
  prompt?: string
  model?: string
  params: Record<string, unknown>
  sourceHistoryId?: string
  status: PageDemoAssignmentStatus
  version: number
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export type PageDemoAssignmentsData = {
  version: typeof PAGE_DEMO_ASSIGNMENTS_SCHEMA_VERSION
  assignments: PageDemoAssignment[]
}

export type SaveDraftPageDemoAssignmentInput = {
  pageSlug: string
  locale?: string
  placement: PageDemoPlacement
  applyMode?: PageDemoApplyMode
  title?: string
  asset: PageDemoAssetSnapshot
  inputAssets?: PageDemoAssetSnapshot[]
  prompt?: string
  model?: string
  params?: Record<string, unknown>
  sourceHistoryId?: string
}

export type UpdateDraftPageDemoAssignmentInput = Partial<SaveDraftPageDemoAssignmentInput> & {
  assignmentId: string
}

export type PageDemoAssignmentMutationResult = {
  assignment: PageDemoAssignment
  assignments: PageDemoAssignment[]
}

export type FindPublishedPageDemoAssignmentInput = {
  pageSlug: string
  locale?: string
  placement: PageDemoPlacement
}

export async function loadPageDemoAssignments(
  filePath = DEFAULT_PAGE_DEMO_ASSIGNMENTS_PATH,
): Promise<PageDemoAssignmentsData> {
  try {
    const text = await readFile(filePath, 'utf8')
    const parsed = JSON.parse(text) as Partial<PageDemoAssignmentsData>
    if (!Array.isArray(parsed.assignments)) return createEmptyPageDemoAssignments()

    return {
      version: PAGE_DEMO_ASSIGNMENTS_SCHEMA_VERSION,
      assignments: sortPageDemoAssignmentsForReview(parsed.assignments.map(normalizePersistedAssignment)),
    }
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') return createEmptyPageDemoAssignments()
    throw error
  }
}

export async function saveDraftPageDemoAssignment(
  input: SaveDraftPageDemoAssignmentInput,
  filePath = DEFAULT_PAGE_DEMO_ASSIGNMENTS_PATH,
  now = new Date().toISOString(),
): Promise<PageDemoAssignmentsData> {
  const data = await loadPageDemoAssignments(filePath)
  const pageSlug = normalizePageSlug(input.pageSlug)
  const locale = normalizeLocale(input.locale)
  const placement = normalizePlacement(input.placement)
  const applyMode = normalizeApplyMode(input.applyMode)
  const shouldCarryGenerationParameters = applyMode === 'demo_with_parameters'
  const existingIndex = data.assignments.findIndex((assignment) => (
    assignment.status === 'draft'
    && assignment.pageSlug === pageSlug
    && assignment.locale === locale
    && assignment.placement === placement
  ))
  const previous = existingIndex >= 0 ? data.assignments[existingIndex] : undefined
  const assignment = normalizePersistedAssignment({
    id: previous?.id || createAssignmentId(pageSlug, locale, placement, input.asset.id),
    pageSlug,
    locale,
    placement,
    applyMode,
    title: normalizeOptionalString(input.title),
    asset: normalizeAssetSnapshot(input.asset, 'asset'),
    inputAssets: shouldCarryGenerationParameters
      ? (input.inputAssets || []).map((asset, index) => normalizeAssetSnapshot(asset, `inputAssets[${index}]`))
      : [],
    prompt: shouldCarryGenerationParameters ? normalizeOptionalString(input.prompt) : undefined,
    model: shouldCarryGenerationParameters ? normalizeOptionalString(input.model) : undefined,
    params: shouldCarryGenerationParameters ? normalizeParams(input.params) : {},
    sourceHistoryId: normalizeOptionalString(input.sourceHistoryId),
    status: 'draft',
    version: (previous?.version || 0) + 1,
    createdAt: previous?.createdAt || now,
    updatedAt: now,
  })

  if (existingIndex >= 0) {
    data.assignments[existingIndex] = assignment
  } else {
    data.assignments.unshift(assignment)
  }

  await savePageDemoAssignments(data, filePath)
  return data
}

export function sortPageDemoAssignmentsForReview(
  assignments: PageDemoAssignment[],
): PageDemoAssignment[] {
  return [...assignments].sort((left, right) => {
    const statusDiff = getStatusSortRank(left.status) - getStatusSortRank(right.status)
    if (statusDiff !== 0) return statusDiff

    const updatedDiff = getTimeValue(right.updatedAt) - getTimeValue(left.updatedAt)
    if (updatedDiff !== 0) return updatedDiff

    return `${left.pageSlug}|${left.locale}|${left.placement}|${left.id}`.localeCompare(
      `${right.pageSlug}|${right.locale}|${right.placement}|${right.id}`,
    )
  })
}

export function findPublishedPageDemoAssignment(
  assignments: PageDemoAssignment[],
  input: FindPublishedPageDemoAssignmentInput,
): PageDemoAssignment | undefined {
  const pageSlug = normalizePageSlug(input.pageSlug)
  const locale = normalizeLocale(input.locale)
  const placement = normalizePlacement(input.placement)
  const active = sortPageDemoAssignmentsForReview(assignments)

  return active.find((assignment) => (
    assignment.status === 'published'
    && assignment.pageSlug === pageSlug
    && assignment.locale === locale
    && assignment.placement === placement
  )) || active.find((assignment) => (
    assignment.status === 'published'
    && assignment.pageSlug === pageSlug
    && assignment.locale === PAGE_DEMO_ALL_LOCALES
    && assignment.placement === placement
  ))
}

export async function publishPageDemoAssignment(
  assignmentId: string,
  filePath = DEFAULT_PAGE_DEMO_ASSIGNMENTS_PATH,
  now = new Date().toISOString(),
): Promise<PageDemoAssignmentMutationResult> {
  const data = await loadPageDemoAssignments(filePath)
  const index = data.assignments.findIndex((assignment) => assignment.id === assignmentId)
  if (index < 0) throw new Error('页面 Demo 配置不存在。')

  const current = data.assignments[index]
  const next = normalizePersistedAssignment({
    ...current,
    status: 'published',
    publishedAt: now,
    updatedAt: now,
  })

  data.assignments = data.assignments.map((assignment, assignmentIndex) => {
    if (assignmentIndex === index) return next
    if (
      assignment.status === 'published'
      && assignment.pageSlug === current.pageSlug
      && assignment.locale === current.locale
      && assignment.placement === current.placement
    ) {
      return normalizePersistedAssignment({
        ...assignment,
        status: 'archived',
        updatedAt: now,
      })
    }
    return assignment
  })

  await savePageDemoAssignments(data, filePath)
  return { assignment: next, assignments: data.assignments }
}

export async function archivePageDemoAssignment(
  assignmentId: string,
  filePath = DEFAULT_PAGE_DEMO_ASSIGNMENTS_PATH,
  now = new Date().toISOString(),
): Promise<PageDemoAssignmentMutationResult> {
  const data = await loadPageDemoAssignments(filePath)
  const index = data.assignments.findIndex((assignment) => assignment.id === assignmentId)
  if (index < 0) throw new Error('页面 Demo 配置不存在。')

  const assignment = normalizePersistedAssignment({
    ...data.assignments[index],
    status: 'archived',
    updatedAt: now,
  })
  data.assignments[index] = assignment

  await savePageDemoAssignments(data, filePath)
  return { assignment, assignments: data.assignments }
}

export async function updateDraftPageDemoAssignment(
  input: UpdateDraftPageDemoAssignmentInput,
  filePath = DEFAULT_PAGE_DEMO_ASSIGNMENTS_PATH,
  now = new Date().toISOString(),
): Promise<PageDemoAssignmentMutationResult> {
  const data = await loadPageDemoAssignments(filePath)
  const index = data.assignments.findIndex((assignment) => assignment.id === input.assignmentId)
  if (index < 0) throw new Error('页面 Demo 配置不存在。')

  const current = data.assignments[index]
  if (current.status === 'archived') throw new Error('归档配置不能编辑。')

  const applyMode = normalizeApplyMode(input.applyMode || current.applyMode)
  const shouldCarryGenerationParameters = applyMode === 'demo_with_parameters'
  const assignment = normalizePersistedAssignment({
    ...current,
    pageSlug: input.pageSlug === undefined ? current.pageSlug : input.pageSlug,
    locale: input.locale === undefined ? current.locale : input.locale,
    placement: input.placement === undefined ? current.placement : input.placement,
    applyMode,
    title: Object.prototype.hasOwnProperty.call(input, 'title') ? normalizeOptionalString(input.title) : current.title,
    asset: input.asset || current.asset,
    inputAssets: shouldCarryGenerationParameters
      ? (input.inputAssets || current.inputAssets)
      : [],
    prompt: shouldCarryGenerationParameters
      ? (Object.prototype.hasOwnProperty.call(input, 'prompt') ? normalizeOptionalString(input.prompt) : current.prompt)
      : undefined,
    model: shouldCarryGenerationParameters
      ? (Object.prototype.hasOwnProperty.call(input, 'model') ? normalizeOptionalString(input.model) : current.model)
      : undefined,
    params: shouldCarryGenerationParameters
      ? (Object.prototype.hasOwnProperty.call(input, 'params') ? normalizeParams(input.params) : current.params)
      : {},
    sourceHistoryId: Object.prototype.hasOwnProperty.call(input, 'sourceHistoryId')
      ? normalizeOptionalString(input.sourceHistoryId)
      : current.sourceHistoryId,
    version: current.version + 1,
    createdAt: current.createdAt,
    updatedAt: now,
  })

  data.assignments = data.assignments.map((item, itemIndex) => {
    if (itemIndex === index) return assignment
    if (
      assignment.status === 'published'
      && item.status === 'published'
      && item.pageSlug === assignment.pageSlug
      && item.locale === assignment.locale
      && item.placement === assignment.placement
    ) {
      return normalizePersistedAssignment({
        ...item,
        status: 'archived',
        updatedAt: now,
      })
    }
    return item
  })

  await savePageDemoAssignments(data, filePath)
  return { assignment, assignments: data.assignments }
}

async function savePageDemoAssignments(
  data: PageDemoAssignmentsData,
  filePath = DEFAULT_PAGE_DEMO_ASSIGNMENTS_PATH,
): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true })
  const assignments = sortPageDemoAssignmentsForReview(data.assignments.map(normalizePersistedAssignment))
  data.assignments = assignments
  const payload: PageDemoAssignmentsData = {
    version: PAGE_DEMO_ASSIGNMENTS_SCHEMA_VERSION,
    assignments,
  }
  const tempPath = `${filePath}.${process.pid}.tmp`
  await writeFile(tempPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
  await rename(tempPath, filePath)
}

function normalizePersistedAssignment(value: Partial<PageDemoAssignment>): PageDemoAssignment {
  const now = new Date().toISOString()
  const applyMode = normalizeApplyMode(value.applyMode)
  const shouldCarryGenerationParameters = applyMode === 'demo_with_parameters'

  return {
    id: normalizeRequiredString(value.id, 'id'),
    pageSlug: normalizePageSlug(value.pageSlug),
    locale: normalizeLocale(value.locale),
    placement: normalizePlacement(value.placement),
    applyMode,
    ...(normalizeOptionalString(value.title) ? { title: normalizeOptionalString(value.title) } : {}),
    asset: normalizeAssetSnapshot(value.asset, 'asset'),
    inputAssets: shouldCarryGenerationParameters && Array.isArray(value.inputAssets)
      ? value.inputAssets.map((asset, index) => normalizeAssetSnapshot(asset, `inputAssets[${index}]`))
      : [],
    ...(shouldCarryGenerationParameters && normalizeOptionalString(value.prompt) ? { prompt: normalizeOptionalString(value.prompt) } : {}),
    ...(shouldCarryGenerationParameters && normalizeOptionalString(value.model) ? { model: normalizeOptionalString(value.model) } : {}),
    params: shouldCarryGenerationParameters ? normalizeParams(value.params) : {},
    ...(normalizeOptionalString(value.sourceHistoryId) ? { sourceHistoryId: normalizeOptionalString(value.sourceHistoryId) } : {}),
    status: normalizeStatus(value.status),
    version: Math.max(1, Number(value.version) || 1),
    createdAt: normalizeOptionalString(value.createdAt) || now,
    updatedAt: normalizeOptionalString(value.updatedAt) || normalizeOptionalString(value.createdAt) || now,
    ...(normalizeOptionalString(value.publishedAt) ? { publishedAt: normalizeOptionalString(value.publishedAt) } : {}),
  }
}

function normalizeAssetSnapshot(value: unknown, field: string): PageDemoAssetSnapshot {
  if (!isRecord(value)) throw new Error(`页面 Demo 配置缺少 ${field}。`)
  const durationSeconds = readPositiveNumber(value.durationSeconds)
  const duration = normalizeOptionalString(value.duration) || (durationSeconds ? formatIsoDuration(durationSeconds) : undefined)
  const uploadDate = normalizeOptionalString(value.uploadDate)

  return {
    id: normalizeRequiredString(value.id, `${field}.id`),
    type: value.type === 'video' ? 'video' : 'image',
    url: normalizeRequiredString(value.url, `${field}.url`),
    ...(normalizeOptionalString(value.posterUrl) ? { posterUrl: normalizeOptionalString(value.posterUrl) } : {}),
    ...(normalizeOptionalString(value.title) ? { title: normalizeOptionalString(value.title) } : {}),
    ...(durationSeconds ? { durationSeconds } : {}),
    ...(duration ? { duration } : {}),
    ...(uploadDate ? { uploadDate } : {}),
  }
}

function createEmptyPageDemoAssignments(): PageDemoAssignmentsData {
  return {
    version: PAGE_DEMO_ASSIGNMENTS_SCHEMA_VERSION,
    assignments: [],
  }
}

function createAssignmentId(
  pageSlug: string,
  locale: string,
  placement: PageDemoPlacement,
  assetId: string,
): string {
  return `demo_${createHash('sha256')
    .update(`${pageSlug}|${locale}|${placement}|${assetId}|${Date.now()}`)
    .digest('hex')
    .slice(0, 18)}`
}

function normalizePageSlug(value: unknown): string {
  const text = normalizeRequiredString(value, 'pageSlug')
    .replace(/^\/+|\/+$/g, '')
    .trim()
    .toLowerCase()
  if (!/^[a-z0-9][a-z0-9/_-]*$/.test(text)) throw new Error('页面 slug 格式不正确。')
  return text
}

function normalizeLocale(value: unknown): string {
  const text = normalizeOptionalString(value) || PAGE_DEMO_ALL_LOCALES
  if (text.toLowerCase() === PAGE_DEMO_ALL_LOCALES) return PAGE_DEMO_ALL_LOCALES
  if (!/^[a-z]{2}(?:-[A-Z]{2})?$/.test(text)) throw new Error('locale 格式不正确。')
  return text
}

function normalizePlacement(value: unknown): PageDemoPlacement {
  if (value === 'hero_demo' || value === 'default_reference' || value === 'prompt_example') return value
  throw new Error('页面 Demo 位置不正确。')
}

function normalizeApplyMode(value: unknown): PageDemoApplyMode {
  if (value === 'demo_with_parameters') return 'demo_with_parameters'
  return 'demo_only'
}

function normalizeStatus(value: unknown): PageDemoAssignmentStatus {
  if (value === 'published' || value === 'archived' || value === 'draft') return value
  return 'draft'
}

function getStatusSortRank(status: PageDemoAssignmentStatus): number {
  if (status === 'draft') return 0
  if (status === 'published') return 1
  return 2
}

function getTimeValue(value: string): number {
  const time = new Date(value).getTime()
  return Number.isFinite(time) ? time : 0
}

function normalizeParams(value: unknown): Record<string, unknown> {
  if (!isRecord(value)) return {}
  return Object.fromEntries(
    Object.entries(value).filter(([key, entry]) => (
      key.trim() && entry !== null && entry !== undefined && entry !== ''
    )),
  )
}

function readPositiveNumber(value: unknown): number | undefined {
  const numberValue = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN
  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : undefined
}

function formatIsoDuration(seconds: number): string {
  const wholeSeconds = Math.max(1, Math.round(seconds))
  return `PT${wholeSeconds}S`
}

function normalizeRequiredString(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`页面 Demo 配置缺少 ${field}。`)
  return value.trim()
}

function normalizeOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && 'code' in error
}
