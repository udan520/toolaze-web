import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

export type GitChangedFile = {
  status: string
  path: string
}

export type GitReleaseCommit = {
  hash: string
  date: string
  subject: string
  files: string[]
  changedFiles: GitChangedFile[]
}

export type AdminReleaseItem = {
  id: string
  date: string
  commitHash: string
  title: string
  label: string
  summary: string
  details: string[]
  kind: 'new-landing-page' | 'landing-page-update' | 'pricing-update' | 'admin-feature-update' | 'release-optimization' | 'tool-experience-update'
  href: string | null
  files: string[]
  fileCount: number
}

export type AdminReleaseDay = {
  date: string
  weekday: string
  landingPages: AdminReleaseItem[]
  majorUpdates: AdminReleaseItem[]
  changeCount: number
  commitCount: number
}

export type AdminReleaseCalendar = {
  startDate: string
  endDate: string
  days: AdminReleaseDay[]
  totals: {
    landingPages: number
    majorUpdates: number
    activeDays: number
    commits: number
  }
  fetchedAt: string
  sourceLabel: string
}

type CommandRunner = (file: string, args: string[]) => Promise<string>
type BuildReleaseCalendarOptions = {
  today?: string | Date
  days?: number
}

const execFileAsync = promisify(execFile)
const DEFAULT_RELEASE_DAYS = 30
const RELEASE_COMMIT_MARKER = '__TOOLAZE_RELEASE_COMMIT__'
const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
const LOCALES = new Set(['en', 'de', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'zh-TW'])
const TRACKED_LANDING_UPDATE_HREFS = new Set([
  '/ai-breast-expansion',
  '/ai-bikini-generator',
  '/ai-clothes-changer',
  '/ai-hairstyle-changer',
  '/ai-photo-abstract-poster-generator',
  '/ai-zine-poster-generator',
  '/buzz-cut-filter',
  '/happyhorse-ai-video-generator',
  '/pixverse-v6-ai-video-generator',
  '/seedance-2-5',
  '/seedance-2',
  '/unrestricted-ai-image-generator',
  '/wan-2-5-ai-video-generator',
  '/wan-2-6-ai-video-generator',
  '/wan-2-7-ai-video-generator',
])
const RELEASE_LABEL_OVERRIDES: Record<string, string> = {
  '/seedance-2': 'Seedance 2.0 旧链接优化',
}
const RESERVED_APP_SEGMENTS = new Set([
  'admin',
  'api',
  'ai-tools',
  'earn-credits',
  'credits',
  'common',
  'about',
  'acceptable-use',
  'contact',
  'history',
  'model',
  'pricing',
  'privacy',
  'prompts',
  'refund-policy',
  'r2-upload-demo',
  'sitemap.ts',
  'terms',
  'videos',
  'layout.tsx',
  'globals.css',
  'not-found.tsx',
])
const PRICING_KEYWORD_PATTERN = /(?:price|pricing|payment|checkout|billing|subscription|paid|付费|支付|价格|套餐|充值)/i
const RELEASE_OPTIMIZATION_KEYWORD_PATTERN = /(?:sitemap|lastmod|url coverage|ai url coverage|收录|发布链路)/i
const TOOL_EXPERIENCE_KEYWORD_PATTERN = /(?:reference ratios|mobile downloads|download|reference|ratio|参考图|比例|下载)/i
const WORKING_TREE_COMMIT_HASH = 'working-tree'
const ADMIN_FEATURE_RELEASES = [
  {
    key: 'generations-media-preview',
    label: '任务生成记录缩略图',
    href: '/admin/generations',
    patterns: [
      /^src\/components\/admin\/GenerationMediaPreview\.tsx$/,
      /^src\/lib\/admin\/media-preview\.(?:ts|test\.ts)$/,
      /^src\/app\/api\/admin\/media-preview\//,
    ],
  },
  {
    key: 'reward-reviews',
    label: '奖励审核后台',
    href: '/admin/reward-reviews',
    patterns: [
      /^src\/app\/admin\/reward-reviews\//,
      /^src\/lib\/admin\/reward-reviews\.(?:ts|test\.ts)$/,
    ],
  },
  {
    key: 'data-dashboard',
    label: '每日数据看板',
    href: '/admin/data-dashboard',
    patterns: [
      /^src\/app\/admin\/data-dashboard\//,
      /^src\/lib\/admin\/daily-metrics\.(?:ts|test\.ts)$/,
    ],
  },
] as const

export function parseGitReleaseLog(stdout: string): GitReleaseCommit[] {
  const commits: GitReleaseCommit[] = []
  let current: GitReleaseCommit | null = null

  for (const rawLine of stdout.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line) continue

    if (line.startsWith(RELEASE_COMMIT_MARKER)) {
      const [, hash, date, ...subjectParts] = line.split('\t')
      if (hash && date) {
        current = {
          hash,
          date,
          subject: subjectParts.join('\t').trim() || 'Untitled release change',
          files: [],
          changedFiles: [],
        }
        commits.push(current)
      } else {
        current = null
      }
      continue
    }

    if (!current) continue

    const changedFile = normalizeGitFileLine(line)
    if (changedFile) {
      current.files.push(changedFile.path)
      current.changedFiles.push(changedFile)
    }
  }

  return commits
}

export function buildReleaseCalendar(
  commits: GitReleaseCommit[],
  options: BuildReleaseCalendarOptions = {},
): AdminReleaseCalendar {
  const dayCount = options.days || DEFAULT_RELEASE_DAYS
  const endDate = toDateKey(options.today || new Date())
  const startDate = addDays(endDate, -(dayCount - 1))
  const dateKeys = listDateKeys(startDate, endDate)
  const dayMap = new Map<string, AdminReleaseDay>()

  for (const date of dateKeys) {
    dayMap.set(date, {
      date,
      weekday: getWeekday(date),
      landingPages: [],
      majorUpdates: [],
      changeCount: 0,
      commitCount: 0,
    })
  }

  for (const commit of dedupeCommits(commits)) {
    const day = dayMap.get(commit.date)
    if (!day) continue

    const landingPages = classifyLandingPages(commit)
    const majorUpdates = classifyMajorUpdates(commit, landingPages.length)
    if (isNoisyCommit(commit) && landingPages.length === 0 && majorUpdates.length === 0) continue
    if (landingPages.length === 0 && majorUpdates.length === 0) continue

    day.landingPages.push(...landingPages)
    day.majorUpdates.push(...majorUpdates)
    day.commitCount += 1
    day.changeCount = day.landingPages.length + day.majorUpdates.length
  }

  for (const day of dayMap.values()) {
    day.landingPages = dedupeReleaseItems(day.landingPages)
    day.majorUpdates = dedupeReleaseItems(day.majorUpdates)
    day.changeCount = day.landingPages.length + day.majorUpdates.length
  }

  const days = Array.from(dayMap.values())
  const totals = days.reduce((result, day) => ({
    landingPages: result.landingPages + day.landingPages.length,
    majorUpdates: result.majorUpdates + day.majorUpdates.length,
    activeDays: result.activeDays + (day.changeCount > 0 ? 1 : 0),
    commits: result.commits + day.commitCount,
  }), {
    landingPages: 0,
    majorUpdates: 0,
    activeDays: 0,
    commits: 0,
  })

  return {
    startDate,
    endDate,
    days,
    totals,
    fetchedAt: new Date().toISOString(),
    sourceLabel: '本地分支、远程 Git 和本地工作树近 30 天业务记录',
  }
}

export async function fetchLocalReleaseCalendar(
  runner: CommandRunner = runCommand,
  options: BuildReleaseCalendarOptions = {},
): Promise<AdminReleaseCalendar> {
  const endDate = toDateKey(options.today || new Date())
  const startDate = addDays(endDate, -((options.days || DEFAULT_RELEASE_DAYS) - 1))
  const stdout = await runner('git', buildGitLogArgs(startDate))
  const statusStdout = await runner('git', buildGitStatusArgs())
  const commits = [
    ...parseGitReleaseLog(stdout),
    ...buildWorkingTreeReleaseCommits(statusStdout, endDate),
  ]

  return buildReleaseCalendar(commits, {
    ...options,
    today: endDate,
  })
}

function buildGitLogArgs(startDate: string): string[] {
  return [
    'log',
    '--exclude=backup/*',
    '--branches',
    '--remotes',
    `--since=${startDate}`,
    '--date=short',
    `--pretty=format:${RELEASE_COMMIT_MARKER}%x09%h%x09%ad%x09%s`,
    '--name-status',
    '--',
    'src',
    'public',
    'docs',
    'migrations',
  ]
}

function buildGitStatusArgs(): string[] {
  return [
    'status',
    '--short',
    '--untracked-files=all',
    '--',
    'src/app/admin',
    'src/lib/admin',
    'src/components/admin',
  ]
}

async function runCommand(file: string, args: string[]): Promise<string> {
  const { stdout } = await execFileAsync(file, args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    maxBuffer: 8 * 1024 * 1024,
  })

  return stdout
}

function buildWorkingTreeReleaseCommits(stdout: string, date: string): GitReleaseCommit[] {
  const changedFiles = parseGitStatusReleaseFiles(stdout)
  if (changedFiles.length === 0) return []

  return [{
    hash: WORKING_TREE_COMMIT_HASH,
    date,
    subject: '本地后台大功能更新',
    files: changedFiles.map((changedFile) => changedFile.path),
    changedFiles,
  }]
}

function parseGitStatusReleaseFiles(stdout: string): GitChangedFile[] {
  const changedFiles: GitChangedFile[] = []

  for (const rawLine of stdout.split(/\r?\n/)) {
    const line = rawLine.trimEnd()
    if (!line.trim()) continue

    const status = line.slice(0, 2).trim() || 'M'
    const path = line
      .slice(3)
      .trim()
      .split(' -> ')
      .pop()

    if (!path) continue
    changedFiles.push({ status, path })
  }

  return changedFiles
}

function classifyLandingPages(commit: GitReleaseCommit): AdminReleaseItem[] {
  if (isPublicationWideOptimization(commit)) return []

  const landingHrefs = new Map<string, AdminReleaseItem['kind']>()

  for (const changedFile of commit.changedFiles) {
    if (!isLandingSourceFile(changedFile.path)) continue

    const href = detectLandingHref(changedFile.path)
    if (!href) continue

    if (isAdded(changedFile)) {
      landingHrefs.set(href, 'new-landing-page')
    } else if (!landingHrefs.has(href) && TRACKED_LANDING_UPDATE_HREFS.has(href)) {
      landingHrefs.set(href, 'landing-page-update')
    }
  }

  return Array.from(landingHrefs.entries()).map(([href, kind]) => {
    const files = commit.changedFiles
      .filter((changedFile) => detectLandingHref(changedFile.path) === href)
      .map((changedFile) => changedFile.path)

    const label = releaseLabelFromHref(href)
    const resolvedKind = href === '/seedance-2-5' && /publish seedance 2\.5 model experience/i.test(commit.subject)
      ? 'new-landing-page'
      : kind
    const copy = buildReleaseItemCopy(commit, resolvedKind, label, href, files)

    return {
      id: `${commit.hash}:${resolvedKind === 'new-landing-page' ? 'new-landing' : 'landing-update'}:${href}`,
      date: commit.date,
      commitHash: commit.hash,
      title: commit.subject,
      label,
      ...copy,
      kind: resolvedKind,
      href,
      files,
      fileCount: files.length,
    }
  })
}

function classifyMajorUpdates(commit: GitReleaseCommit, landingPageCount = 0): AdminReleaseItem[] {
  const items: AdminReleaseItem[] = []

  if (isPricingUpdate(commit)) {
    const label = '价格 / 付费更新'
    items.push({
      id: `${commit.hash}:pricing`,
      date: commit.date,
      commitHash: commit.hash,
      title: commit.subject,
      label,
      ...buildReleaseItemCopy(commit, 'pricing-update', label, null, commit.files),
      kind: 'pricing-update',
      href: null,
      files: commit.files,
      fileCount: commit.files.length,
    })
  }

  const releaseOptimizationLabel = releaseOptimizationLabelForCommit(commit)
  if (releaseOptimizationLabel) {
    items.push({
      id: `${commit.hash}:release-optimization`,
      date: commit.date,
      commitHash: commit.hash,
      title: commit.subject,
      label: releaseOptimizationLabel,
      ...buildReleaseItemCopy(commit, 'release-optimization', releaseOptimizationLabel, null, commit.files),
      kind: 'release-optimization',
      href: null,
      files: commit.files,
      fileCount: commit.files.length,
    })
  }

  const toolExperienceLabel = toolExperienceLabelForCommit(commit)
  if (landingPageCount === 0 && toolExperienceLabel && isToolExperienceUpdate(commit)) {
    items.push({
      id: `${commit.hash}:tool-experience`,
      date: commit.date,
      commitHash: commit.hash,
      title: commit.subject,
      label: toolExperienceLabel,
      ...buildReleaseItemCopy(commit, 'tool-experience-update', toolExperienceLabel, null, commit.files),
      kind: 'tool-experience-update',
      href: null,
      files: commit.files,
      fileCount: commit.files.length,
    })
  }

  items.push(...classifyAdminFeatureUpdates(commit))

  return items
}

function classifyAdminFeatureUpdates(commit: GitReleaseCommit): AdminReleaseItem[] {
  const items: AdminReleaseItem[] = []

  for (const release of ADMIN_FEATURE_RELEASES) {
    const files = commit.files.filter((file) => release.patterns.some((pattern) => pattern.test(file)))
    if (files.length === 0) continue

    items.push({
      id: `${commit.hash}:admin-feature:${release.key}`,
      date: commit.date,
      commitHash: commit.hash,
      title: commit.subject,
      label: release.label,
      ...buildReleaseItemCopy(commit, 'admin-feature-update', release.label, release.href, files),
      kind: 'admin-feature-update',
      href: release.href,
      files,
      fileCount: files.length,
    })
  }

  return items
}

function buildReleaseItemCopy(
  commit: GitReleaseCommit,
  kind: AdminReleaseItem['kind'],
  label: string,
  href: string | null,
  files: string[],
): Pick<AdminReleaseItem, 'summary' | 'details'> {
  const subject = commit.subject.toLowerCase()

  if (href === '/seedance-2-5' && subject.includes('publish seedance 2.5')) {
    return {
      summary: '新增 Seedance 2.5 生成功能',
      details: [
        '上线 Seedance 2.5 模型生成入口与完整工具页',
        '支持多参考资源，并可在 Prompt 中引用',
        '补齐任务历史复用、积分配置和多语言内容',
      ],
    }
  }

  if (subject.includes('default portrait ratios for outfit tools')) {
    const featureName = href === '/ai-clothes-changer' ? 'AI 换衣' : href === '/ai-bikini-generator' ? 'AI Bikini' : label
    const separator = /[\u4e00-\u9fff]$/.test(featureName) ? '' : ' '
    return {
      summary: `${featureName}${separator}默认比例改为 9:16`,
      details: [
        `${featureName}${separator}页面默认生图比例从 16:9 改为 9:16`,
        `同步更新 ${countChangedLocales(files)} 个语言版本的页面配置`,
        '用户进入页面后可直接按竖版比例开始生成',
      ],
    }
  }

  const concreteChange = describeKnownCommit(subject, label)
  const action = kind === 'new-landing-page' ? '新增' : '更新'

  return {
    summary: concreteChange || `${action}${label}：${stripCommitPrefix(commit.subject)}`,
    details: [
      concreteChange || `${action}${label}相关功能`,
      `本次共涉及 ${files.length} 个文件`,
    ],
  }
}

function describeKnownCommit(subject: string, label: string): string | null {
  if (subject.includes('restore') && subject.includes('abstract') && subject.includes('controls')) {
    return `${label}恢复生成控制项`
  }
  if (subject.includes('clothes') && subject.includes('hairstyle') && subject.includes('generation flows')) {
    return `${label}修复生成流程`
  }
  if (subject.includes('compact image settings')) return '图片生成设置与历史记录优化'
  if (subject.includes('request ip metadata')) return `${label}新增国家与 IP 信息`
  if (subject.includes('sitemap') && subject.includes('lastmod')) return `${label}更新日期改为真实变更时间`
  return null
}

function stripCommitPrefix(subject: string): string {
  return subject.replace(/^(?:feat|fix|refactor|chore|docs|test)(?:\([^)]*\))?:\s*/i, '')
}

function countChangedLocales(files: string[]): number {
  const locales = new Set(files.map((file) => file.match(/^src\/data\/([^/]+)\//)?.[1]).filter(Boolean))
  return locales.size || 1
}

function detectLandingHref(file: string): string | null {
  const modelPage = file.match(/^src\/app\/model\/([^/[\]]+)\/page\.tsx$/)
  if (modelPage) return `/model/${modelPage[1]}`

  const localizedPage = file.match(/^src\/app\/\[locale\]\/([^/[\]]+)\/(?:page|copy)\.tsx$/)
  if (localizedPage && !RESERVED_APP_SEGMENTS.has(localizedPage[1])) return `/${localizedPage[1]}`

  const appPage = file.match(/^src\/app\/([^/[\]]+)\/(?:page|copy)\.tsx$/)
  if (appPage && !RESERVED_APP_SEGMENTS.has(appPage[1])) return `/${appPage[1]}`

  const localizedData = file.match(/^src\/data\/([^/]+)\/([^/]+)(?:\/([^/]+))?\.json$/)
  if (localizedData && LOCALES.has(localizedData[1]) && !RESERVED_APP_SEGMENTS.has(localizedData[2])) {
    const nestedSlug = localizedData[3]?.replace(/\.json$/, '')
    return nestedSlug ? `/${localizedData[2]}/${nestedSlug}` : `/${localizedData[2]}`
  }

  const publicModelAsset = file.match(/^public\/model-assets\/([^/]+)\//)
  if (publicModelAsset) return `/model/${publicModelAsset[1]}`

  const publicToolAsset = file.match(/^public\/([^/.]+)\//)
  if (publicToolAsset && !['assets', 'images', 'icons'].includes(publicToolAsset[1])) {
    return `/${publicToolAsset[1]}`
  }

  const landingCopy = file.match(/^src\/lib\/(.+)-landing-copy\.ts$/)
  if (landingCopy) return `/${landingCopy[1]}`

  return null
}

function isPricingUpdate(commit: GitReleaseCommit): boolean {
  if (PRICING_KEYWORD_PATTERN.test(commit.subject)) return true

  return commit.files.some(isPricingContentFile)
}

function isPricingContentFile(file: string): boolean {
  return (
    /^src\/app\/pricing\/(?:page\.tsx|pricing-copy\.(?:ts|tsx)|PricingPageContent\.tsx)$/i.test(file)
    || (/^migrations\//i.test(file) && /price|pricing|payment|checkout|billing/i.test(file))
  )
}

function releaseOptimizationLabelForCommit(commit: GitReleaseCommit): string | null {
  if (/bikini flow|canonical English routes/i.test(commit.subject)) {
    return 'AI Bikini Generator 流程与英文 canonical 路由优化'
  }

  if (/page-specific social metadata/i.test(commit.subject)) {
    return '页面社交分享 Metadata 优化'
  }

  if (!RELEASE_OPTIMIZATION_KEYWORD_PATTERN.test(commit.subject)) return null

  if (commit.files.every((file) => (
    file === 'src/app/sitemap.ts'
    || file === 'src/lib/localized-route-fallbacks.test.ts'
  ))) {
    return 'Sitemap / AI URL 收录优化'
  }

  return null
}

function isPublicationWideOptimization(commit: GitReleaseCommit): boolean {
  return /(?:canonical English routes|page-specific social metadata)/i.test(commit.subject)
}

function toolExperienceLabelForCommit(commit: GitReleaseCommit): string | null {
  if (/persist generation task lifecycle/i.test(commit.subject)) {
    return '生成历史任务生命周期持久化'
  }

  if (/compact image settings|history fixes/i.test(commit.subject)) {
    return '图片生成紧凑设置与历史修复'
  }

  if (/reference ratios|mobile downloads/i.test(commit.subject)) {
    return '生成工具参考图比例与移动端下载优化'
  }

  return null
}

function isToolExperienceUpdate(commit: GitReleaseCommit): boolean {
  if (!toolExperienceLabelForCommit(commit) && !TOOL_EXPERIENCE_KEYWORD_PATTERN.test(commit.subject)) return false

  return commit.files.some((file) => (
    /^src\/components\/Ai(?:Image|Video)GenerationTool\.(?:tsx|.+test\.(?:mjs|ts))$/.test(file)
    || /^src\/lib\/(?:ai-(?:image|video)-generator-config|browser-image-download)\.(?:ts|test\.ts)$/.test(file)
    || /^src\/lib\/image-aspect-ratio-policy\.(?:ts|test\.ts)$/.test(file)
    || /^migrations\/00\d+_generation_attempt/.test(file)
    || file === 'src/lib/mobile-generator-source-contract.test.ts'
  ))
}

function isLandingSourceFile(file: string): boolean {
  return (
    /^src\/app\/.+\/(?:page|copy)\.tsx$/.test(file)
    || /^src\/data\/[^/]+\/.+\.json$/.test(file)
    || /^src\/lib\/.+-landing-copy\.ts$/.test(file)
  )
}

function isAdded(changedFile: GitChangedFile): boolean {
  return changedFile.status.toUpperCase().startsWith('A')
}

function isNoisyCommit(commit: GitReleaseCommit): boolean {
  return /^(?:merge|backup|on .*dirty-backup|untracked files on )/i.test(commit.subject.trim())
}

function dedupeCommits(commits: GitReleaseCommit[]): GitReleaseCommit[] {
  const seen = new Set<string>()
  const result: GitReleaseCommit[] = []

  for (const commit of commits) {
    const signature = [
      commit.date,
      commit.subject,
      ...commit.files.slice().sort(),
    ].join('\u0000')

    if (seen.has(signature)) continue
    seen.add(signature)
    result.push(commit)
  }

  return result
}

function dedupeReleaseItems(items: AdminReleaseItem[]): AdminReleaseItem[] {
  const byKey = new Map<string, AdminReleaseItem>()

  for (const item of items) {
    const key = releaseItemDedupeKey(item)
    const existing = byKey.get(key)

    if (!existing || releaseItemRank(item) > releaseItemRank(existing)) {
      byKey.set(key, item)
    }
  }

  return Array.from(byKey.values())
}

function releaseItemDedupeKey(item: AdminReleaseItem): string {
  if (item.kind === 'new-landing-page' || item.kind === 'landing-page-update') {
    return `landing:${canonicalReleaseSlug(item.href || item.label)}`
  }

  if (item.kind === 'admin-feature-update') {
    return `admin-feature:${(item.href || item.label).toLowerCase()}`
  }

  if (item.kind === 'release-optimization') {
    return `release-optimization:${item.label.toLowerCase()}`
  }

  if (item.kind === 'tool-experience-update') {
    return `tool-experience:${item.label.toLowerCase()}`
  }

  return `${item.kind}:${item.title}`
}

function canonicalReleaseSlug(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/^\/model\//, '')
    .replace(/^\//, '')
    .replace(/\s+/g, '-')

  if (slug === 'happyhorse' || slug === 'happyhorse-1-1' || slug === 'happyhorse-ai-video-generator') {
    return 'happyhorse-ai-video-generator'
  }

  if (slug === 'pixverse-v6' || slug === 'pixverse-v6-ai-video-generator') {
    return 'pixverse-v6-ai-video-generator'
  }

  return slug
}

function releaseItemRank(item: AdminReleaseItem): number {
  let rank = 0

  if (item.kind === 'new-landing-page') rank += 20
  if (item.files.some((file) => /^src\/app\/[^/]+\/page\.tsx$/.test(file))) rank += 5
  if (item.files.some((file) => /^src\/app\/model\/[^/]+\/page\.tsx$/.test(file))) rank += 6
  if (item.files.some((file) => /^src\/app\/\[locale\]\/[^/]+\/page\.tsx$/.test(file))) rank += 3
  if (item.files.some((file) => /^src\/data\//.test(file))) rank += 1
  if (item.href?.includes('-ai-video-generator')) rank += 2
  if (item.href?.startsWith('/model/')) rank += 1

  return rank
}

function normalizeGitFileLine(line: string): GitChangedFile | null {
  const parts = line.split('\t').map((part) => part.trim()).filter(Boolean)
  if (parts.length === 0) return null

  if (parts.length === 1) {
    return { status: 'M', path: parts[0] }
  }

  return {
    status: parts[0],
    path: parts[parts.length - 1],
  }
}

function slugToLabel(slug: string): string {
  const label = slug
    .split('-')
    .filter(Boolean)
    .map((part) => {
      const lower = part.toLowerCase()
      if (lower === 'ai') return 'AI'
      if (lower === 'api') return 'API'
      if (lower === 'gpt') return 'GPT'
      if (lower === 'happyhorse') return 'HappyHorse'
      if (lower === 'pixverse') return 'PixVerse'
      if (lower === 'seo') return 'SEO'
      if (lower === 'r2') return 'R2'
      return lower.charAt(0).toUpperCase() + lower.slice(1)
    })
    .join(' ')

  return label.replace(/\b(GPT|HappyHorse|Kling|Seedance|Seedream|Veo|Wan) (\d+) (\d+)\b/g, '$1 $2.$3')
}

function releaseLabelFromHref(href: string): string {
  const overriddenLabel = RELEASE_LABEL_OVERRIDES[href]
  if (overriddenLabel) return overriddenLabel

  const slug = href.startsWith('/model/') ? href.slice('/model/'.length) : href.replace(/^\//, '')
  return slugToLabel(slug)
}

function isModelSlug(slug: string): boolean {
  if (/(?:generator|changer|creator|maker|remover)$/i.test(slug)) return false
  return /^(?:gpt|nano|seed|seedance|seedream|wan|kling|grok|flux|pixverse|happyhorse)[a-z0-9-]*$/i.test(slug)
}

function toDateKey(value: string | Date): string {
  if (typeof value === 'string') return value.slice(0, 10)

  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addDays(dateKey: string, amount: number): string {
  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  date.setUTCDate(date.getUTCDate() + amount)
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, '0'),
    String(date.getUTCDate()).padStart(2, '0'),
  ].join('-')
}

function listDateKeys(startDate: string, endDate: string): string[] {
  const dates: string[] = []
  let cursor = startDate

  while (cursor <= endDate) {
    dates.push(cursor)
    cursor = addDays(cursor, 1)
  }

  return dates
}

function getWeekday(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number)
  return WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()]
}
