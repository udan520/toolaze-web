import {
  findPublishedPageDemoAssignment,
  loadPageDemoAssignments,
  PAGE_DEMO_ALL_LOCALES,
  type PageDemoAssignment,
  type PageDemoPlacement,
  sortPageDemoAssignmentsForReview,
} from './admin/page-demo-assignments'
import { normalizePageDemoUrlToSlug } from './admin/page-demo-url'

type PageDemoContent = Record<string, any>

type ApplyPublishedPageDemoAssignmentsOptions = {
  pageSlug: string
  locale?: string
  filePath?: string
  includeDrafts?: boolean
}

export async function applyPublishedPageDemoAssignments<T extends PageDemoContent>(
  content: T,
  options: ApplyPublishedPageDemoAssignmentsOptions,
): Promise<T> {
  const data = await loadPageDemoAssignments(options.filePath)
  if (data.assignments.length === 0) return content

  const pageSlugs = getPageSlugCandidates(options.pageSlug)
  let nextContent: T = content

  const heroDemo = findFirstPageDemoAssignment(data.assignments, pageSlugs, options.locale, 'hero_demo', options.includeDrafts)
  if (heroDemo) {
    nextContent = applyHeroDemoAssignment(nextContent, heroDemo)
    if (heroDemo.applyMode === 'demo_with_parameters') {
      nextContent = applyTopToolDefaults(nextContent, heroDemo)
    }
  }

  const defaultReference = findFirstPageDemoAssignment(
    data.assignments,
    pageSlugs,
    options.locale,
    'default_reference',
    options.includeDrafts,
  )
  if (defaultReference?.applyMode === 'demo_with_parameters') {
    nextContent = applyTopToolDefaults(nextContent, defaultReference)
  }

  return nextContent
}

function findFirstPageDemoAssignment(
  assignments: PageDemoAssignment[],
  pageSlugs: string[],
  locale: string | undefined,
  placement: PageDemoPlacement,
  includeDrafts = false,
): PageDemoAssignment | undefined {
  for (const pageSlug of pageSlugs) {
    const assignment = includeDrafts
      ? findDraftOrPublishedPageDemoAssignment(assignments, { pageSlug, locale, placement })
      : findPublishedPageDemoAssignment(assignments, { pageSlug, locale, placement })
    if (assignment) return assignment
  }
  return undefined
}

function findDraftOrPublishedPageDemoAssignment(
  assignments: PageDemoAssignment[],
  input: {
    pageSlug: string
    locale?: string
    placement: PageDemoPlacement
  },
): PageDemoAssignment | undefined {
  const locale = input.locale || PAGE_DEMO_ALL_LOCALES
  const activeAssignments = sortPageDemoAssignmentsForReview(assignments).filter((assignment) => (
    (assignment.status === 'draft' || assignment.status === 'published')
    && assignment.pageSlug === input.pageSlug
    && assignment.placement === input.placement
  ))

  return activeAssignments.find((assignment) => assignment.locale === locale)
    || activeAssignments.find((assignment) => assignment.locale === PAGE_DEMO_ALL_LOCALES)
}

function applyHeroDemoAssignment<T extends PageDemoContent>(content: T, assignment: PageDemoAssignment): T {
  const duration = assignment.asset.duration || (
    assignment.asset.durationSeconds ? formatIsoDuration(assignment.asset.durationSeconds) : undefined
  )
  const uploadDate = assignment.asset.uploadDate

  return {
    ...content,
    heroDemoVideo: {
      src: assignment.asset.url,
      ...(assignment.asset.posterUrl ? { poster: assignment.asset.posterUrl } : {}),
      ...(duration ? { duration } : {}),
      ...(uploadDate ? { uploadDate } : {}),
      ariaLabel: assignment.title || assignment.asset.title || content.heroDemoVideo?.ariaLabel || 'Published page demo',
      type: assignment.asset.type,
      mediaType: assignment.asset.type,
    },
  }
}

function applyTopToolDefaults<T extends PageDemoContent>(content: T, assignment: PageDemoAssignment): T {
  const topTool = isRecord(content.topTool) ? { ...content.topTool } : {}
  const imageUrls = assignment.inputAssets
    .filter((asset) => asset.type === 'image')
    .map((asset) => asset.url)
  const videoUrls = assignment.inputAssets
    .filter((asset) => asset.type === 'video')
    .map((asset) => asset.url)

  if (assignment.prompt) {
    topTool.defaultPrompt = assignment.prompt
    topTool.initialPrompt = assignment.prompt
  }
  if (assignment.model) {
    topTool.modelId = assignment.model
  }
  if (imageUrls.length > 0) {
    topTool.defaultImageUrls = imageUrls
    topTool.initialImageUrls = imageUrls
  }
  if (videoUrls.length > 0) {
    topTool.initialMotionVideoUrls = videoUrls
  }

  const defaultVideoDurationSeconds = readNumberParam(assignment.params, [
    'defaultVideoDurationSeconds',
    'videoDurationSeconds',
    'durationSeconds',
    'duration',
  ])
  if (defaultVideoDurationSeconds !== undefined) {
    topTool.defaultVideoDurationSeconds = defaultVideoDurationSeconds
  }

  return {
    ...content,
    topTool,
  }
}

function getPageSlugCandidates(value: string): string[] {
  const slug = normalizePageDemoUrlToSlug(value)
  const candidates = [slug]
  if (slug && !slug.startsWith('model/')) candidates.push(`model/${slug}`)
  if (slug.startsWith('model/')) candidates.push(slug.replace(/^model\//, ''))
  return Array.from(new Set(candidates.filter(Boolean)))
}

function readNumberParam(params: Record<string, unknown>, keys: string[]): number | undefined {
  for (const key of keys) {
    const value = params[key]
    const numberValue = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN
    if (Number.isFinite(numberValue) && numberValue > 0) return numberValue
  }
  return undefined
}

function formatIsoDuration(seconds: number): string {
  const wholeSeconds = Math.max(1, Math.round(seconds))
  return `PT${wholeSeconds}S`
}

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
