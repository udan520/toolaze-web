import type { Dirent } from 'node:fs'
import { existsSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import {
  normalizePageDemoUrlToSlug,
  type PageDemoTarget,
} from './page-demo-url'

type PageDemoTargetsOptions = {
  appDir?: string
  dataDir?: string
  tasksDir?: string
  externalAppDirs?: string[]
  externalDataDirs?: string[]
  externalTasksDirs?: string[]
}

type SeoTaskIndex = {
  publishDates: Map<string, string>
  canonicalSlugsByDataSlug: Map<string, string>
}

const EXCLUDED_FIRST_SEGMENTS = new Set(['admin', 'api', 'auth', 'prompts'])
const EXCLUDED_STATIC_ROUTES = new Set([
  '',
  'about',
  'acceptable-use',
  'ai-tools',
  'contact',
  'credits',
  'earn-credits',
  'history',
  'model',
  'pricing',
  'privacy',
  'prompts',
  'qwen-demo',
  'qwen-text-to-image',
  'r2-upload-demo',
  'refund-policy',
  'terms',
])
const IGNORED_DATA_FILES = new Set(['common', 'prompts'])

export async function getPageDemoTargets({
  appDir = path.join(process.cwd(), 'src', 'app'),
  dataDir = path.join(process.cwd(), 'src', 'data', 'en'),
  tasksDir = path.join(process.cwd(), '_codex', 'seo-pipeline', 'tasks'),
  externalAppDirs = getDefaultExternalAppDirs(),
  externalDataDirs = getDefaultExternalDataDirs(),
  externalTasksDirs = getDefaultExternalTasksDirs(),
}: PageDemoTargetsOptions = {}): Promise<PageDemoTarget[]> {
  const targets = new Map<string, PageDemoTarget>()
  const taskIndex = await loadSeoTaskIndex([tasksDir, ...externalTasksDirs])

  for (const dir of [appDir, ...externalAppDirs]) {
    await addAppRouteTargets(targets, dir, taskIndex.publishDates)
  }
  for (const dir of [dataDir, ...externalDataDirs]) {
    await addDataFileTargets(targets, dir, taskIndex)
  }

  return [...targets.values()].sort((left, right) => {
    const publishedDiff = getDateSortValue(right.publishedAt) - getDateSortValue(left.publishedAt)
    if (publishedDiff !== 0) return publishedDiff

    const titleDiff = left.title.localeCompare(right.title)
    if (titleDiff !== 0) return titleDiff
    return left.url.localeCompare(right.url)
  })
}

async function loadSeoTaskIndex(tasksDirs: string[]): Promise<SeoTaskIndex> {
  const taskFiles = (await Promise.all(tasksDirs.map((directory) => findTaskFiles(directory)))).flat()
  const publishDates = new Map<string, string>()
  const canonicalSlugsByDataSlug = new Map<string, string>()

  for (const filePath of taskFiles) {
    const task = await readJson(filePath)
    if (!task) continue
    const publishedAt = readTaskPublishedAt(task)
    const canonicalSlug = normalizePageDemoUrlToSlug(
      readString(task.canonicalPath) || readString(task.targetUrl),
    )
    const sourceDataSlug = readSourceDataSlug(task)

    if (publishedAt) {
      addTaskDate(publishDates, normalizePageDemoUrlToSlug(readString(task.slug)), publishedAt)
      addTaskDate(publishDates, canonicalSlug, publishedAt)
      addTaskDate(publishDates, normalizePageDemoUrlToSlug(readString(task.targetUrl)), publishedAt)
      addTaskDate(publishDates, sourceDataSlug, publishedAt)
    }
    if (sourceDataSlug && canonicalSlug) {
      canonicalSlugsByDataSlug.set(sourceDataSlug, canonicalSlug)
    }
  }

  return { publishDates, canonicalSlugsByDataSlug }
}

function getDefaultExternalAppDirs(): string[] {
  return collectExistingDirectories([
    path.resolve(process.cwd(), '..', 'toolaze-worktrees', 'lp', 'p0-model-pages', 'src', 'app'),
  ])
}

function getDefaultExternalDataDirs(): string[] {
  return collectExistingDirectories([
    path.resolve(process.cwd(), '..', 'toolaze-worktrees', 'lp', 'p0-model-pages', 'src', 'data', 'en'),
  ])
}

function getDefaultExternalTasksDirs(): string[] {
  return collectExistingDirectories([
    path.resolve(process.cwd(), '..', 'toolaze-worktrees', 'lp', 'p0-model-pages', '_codex', 'seo-pipeline', 'tasks'),
  ])
}

async function findTaskFiles(directory: string): Promise<string[]> {
  let entries: Array<Dirent<string>>
  try {
    entries = await readdir(directory, { withFileTypes: true })
  } catch {
    return []
  }

  const files: string[] = []
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...await findTaskFiles(entryPath))
    } else if (entry.isFile() && entry.name === 'task.json') {
      files.push(entryPath)
    }
  }
  return files
}

function readTaskPublishedAt(task: Record<string, any>): string {
  return (
    normalizeDateString(readString(task.createdAt))
    || normalizeDateString(readString(task.updatedAt))
    || normalizeDateString(readString(task.taskId))
  )
}

function readSourceDataSlug(task: Record<string, any>): string {
  const sourceData = readString(task.sourceData)
  if (!sourceData.startsWith('src/data/en/') || !sourceData.endsWith('.json')) return ''
  return sourceData.replace(/^src\/data\/en\//, '').replace(/\.json$/, '')
}

function addTaskDate(dates: Map<string, string>, slug: string, publishedAt: string): void {
  if (!slug || !publishedAt) return
  dates.set(slug, pickNewerDate(dates.get(slug), publishedAt) || publishedAt)
}

async function addAppRouteTargets(
  targets: Map<string, PageDemoTarget>,
  appDir: string,
  publishDates: Map<string, string>,
): Promise<void> {
  const pageFiles = await findPageFiles(appDir)

  for (const filePath of pageFiles) {
    const route = routeFromAppPage(filePath, appDir)
    if (!route) continue
    const slug = normalizePageDemoUrlToSlug(route)
    addTarget(targets, {
      url: route,
      slug,
      title: titleFromSlug(route.split('/').filter(Boolean).at(-1) || route),
      keywords: keywordsFromValues(route),
      source: route.startsWith('/model/') ? 'model_route' : 'app_route',
      publishedAt: publishDates.get(slug),
    })
  }
}

async function addDataFileTargets(
  targets: Map<string, PageDemoTarget>,
  dataDir: string,
  taskIndex: SeoTaskIndex,
): Promise<void> {
  const dataFiles = await findDataFiles(dataDir)

  for (const filePath of dataFiles) {
    const dataSlug = path
      .relative(dataDir, filePath)
      .replace(/\\/g, '/')
      .replace(/\.json$/, '')
    if (isIgnoredDataSlug(dataSlug)) continue

    const data = await readJson(filePath)
    if (!data) continue

    const pageGroup = readString(data.pageGroup)
    const canonicalSlug = taskIndex.canonicalSlugsByDataSlug.get(dataSlug)
    const isModelPage = pageGroup === 'model' && !dataSlug.includes('/')
    const url = canonicalSlug ? `/${canonicalSlug}` : isModelPage ? `/model/${dataSlug}` : `/${dataSlug}`
    const normalizedSlug = normalizePageDemoUrlToSlug(url)
    if (!isConfigurableDemoTarget(normalizedSlug)) continue

    addTarget(targets, {
      url,
      slug: normalizedSlug,
      title: readPageTitle(data, dataSlug),
      keywords: keywordsFromValues(
        dataSlug,
        pageGroup,
        readString(data.visiblePageType),
        readString(data.topComponent),
        readString(data.topTool?.displayName),
        readString(data.topTool?.modelId),
        readString(data.metadata?.title),
      ),
      source: canonicalSlug?.startsWith('model/') || isModelPage ? 'model_route' : 'data_file',
      publishedAt: taskIndex.publishDates.get(normalizedSlug) || taskIndex.publishDates.get(dataSlug) || readDataPublishedAt(data),
    })
  }
}

async function findPageFiles(directory: string): Promise<string[]> {
  let entries: Array<Dirent<string>>
  try {
    entries = await readdir(directory, { withFileTypes: true })
  } catch {
    return []
  }

  const files: string[] = []
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...await findPageFiles(entryPath))
    } else if (entry.isFile() && entry.name === 'page.tsx') {
      files.push(entryPath)
    }
  }
  return files
}

async function findDataFiles(directory: string): Promise<string[]> {
  let entries: Array<Dirent<string>>
  try {
    entries = await readdir(directory, { withFileTypes: true })
  } catch {
    return []
  }

  const files: string[] = []
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...await findDataFiles(entryPath))
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(entryPath)
    }
  }
  return files
}

function isIgnoredDataSlug(slug: string): boolean {
  const firstSegment = slug.split('/')[0] || slug
  return IGNORED_DATA_FILES.has(slug) || firstSegment === 'prompts'
}

function routeFromAppPage(filePath: string, appDir: string): string | undefined {
  const routeSegments = path
    .relative(appDir, path.dirname(filePath))
    .split(path.sep)
    .filter(Boolean)
    .filter((segment) => !segment.startsWith('(') && !segment.endsWith(')'))

  if (routeSegments.length === 0) return undefined
  if (routeSegments.some((segment) => segment.startsWith('['))) return undefined

  const slug = normalizePageDemoUrlToSlug(`/${routeSegments.join('/')}`)
  if (!isConfigurableDemoTarget(slug)) return undefined

  return `/${slug}`
}

function isConfigurableDemoTarget(slug: string): boolean {
  if (!slug) return false
  const firstSegment = slug.split('/')[0] || ''
  if (EXCLUDED_FIRST_SEGMENTS.has(firstSegment)) return false
  if (EXCLUDED_STATIC_ROUTES.has(slug)) return false
  if (slug.includes('/all-tools')) return false
  return !slug.includes('[')
}

function addTarget(targets: Map<string, PageDemoTarget>, target: PageDemoTarget): void {
  if (!target.slug || !isConfigurableDemoTarget(target.slug)) return

  const existing = targets.get(target.url)
  if (!existing) {
    targets.set(target.url, {
      ...target,
      keywords: uniqueStrings(target.keywords),
    })
    return
  }

  targets.set(target.url, {
    ...existing,
    title: target.source === 'data_file' || target.source === 'model_route'
      ? target.title
      : existing.title,
    keywords: uniqueStrings([...existing.keywords, ...target.keywords]),
    source: existing.source === 'app_route' ? target.source : existing.source,
    publishedAt: pickNewerDate(existing.publishedAt, target.publishedAt),
  })
}

async function readJson(filePath: string): Promise<Record<string, any> | undefined> {
  try {
    return JSON.parse(await readFile(filePath, 'utf8')) as Record<string, any>
  } catch {
    return undefined
  }
}

function readPageTitle(data: Record<string, any>, slug: string): string {
  return (
    readString(data.topTool?.displayName)
    || cleanTitle(readString(data.hero?.h1))
    || cleanTitle(readString(data.metadata?.title))
    || titleFromSlug(slug)
  )
}

function cleanTitle(value: string): string {
  return value
    .replace(/<[^>]+>/g, '')
    .replace(/\s*\|\s*Toolaze.*$/i, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function titleFromSlug(value: string): string {
  return value
    .replace(/^\/+|\/+$/g, '')
    .split('/')
    .at(-1)
    ?.split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word.length <= 3 ? word.toUpperCase() : `${word[0]?.toUpperCase() || ''}${word.slice(1)}`)
    .join(' ') || 'Untitled Page'
}

function readDataPublishedAt(data: Record<string, any>): string {
  return (
    normalizeDateString(readString(data.metadata?.publishedAt))
    || normalizeDateString(readString(data.metadata?.publishedDate))
    || normalizeDateString(readString(data.metadata?.date))
    || normalizeDateString(readString(data.publishedAt))
    || normalizeDateString(readString(data.seoFactoryTaskId))
    || normalizeDateString(readString(data.createdAt))
    || normalizeDateString(readString(data.updatedAt))
  )
}

function pickNewerDate(left: string | undefined, right: string | undefined): string | undefined {
  if (!left) return right
  if (!right) return left
  return getDateSortValue(right) > getDateSortValue(left) ? right : left
}

function getDateSortValue(value: string | undefined): number {
  if (!value) return 0
  const time = Date.parse(value)
  return Number.isFinite(time) ? time : 0
}

function normalizeDateString(value: string): string {
  if (!value) return ''
  const time = Date.parse(value)
  if (Number.isFinite(time)) return new Date(time).toISOString()

  const compactMatch = value.match(/(\d{4})[-_](\d{2})[-_](\d{2})|((?:19|20)\d{2})(\d{2})(\d{2})/)
  if (!compactMatch) return ''

  const year = compactMatch[1] || compactMatch[4]
  const month = compactMatch[2] || compactMatch[5]
  const day = compactMatch[3] || compactMatch[6]
  return `${year}-${month}-${day}`
}

function keywordsFromValues(...values: Array<string | undefined>): string[] {
  return uniqueStrings(values.flatMap((value) => {
    if (!value) return []
    return [value, ...value.split(/[\s/_-]+/)]
  }))
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)))
}

function readString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function collectExistingDirectories(directories: string[]): string[] {
  return directories.filter((directory) => {
    try {
      return Boolean(directory) && existsSync(directory)
    } catch {
      return false
    }
  })
}
