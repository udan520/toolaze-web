import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'
import {
  buildReleaseCalendar,
  fetchLocalReleaseCalendar,
  parseGitReleaseLog,
} from './release-calendar'
import { buildCalendarWeeks } from '@/components/admin/ReleaseCalendarPlanner'

const sampleGitLog = [
  '__TOOLAZE_RELEASE_COMMIT__\tabc1234\t2026-07-20\tAdd Seedream landing page',
  'A\tsrc/app/seedream-4-5/page.tsx',
  'A\tsrc/app/seedream-4-5/copy.ts',
  'A\tpublic/model-assets/seedream-4-5/hero.webp',
  'M\tsrc/app/sitemap.ts',
  '__TOOLAZE_RELEASE_COMMIT__\tbbb2222\t2026-07-20\tLocalize pricing page',
  'M\tsrc/app/pricing/pricing-copy.ts',
  'M\tsrc/app/pricing/PricingPageContent.tsx',
  '__TOOLAZE_RELEASE_COMMIT__\tccc3333\t2026-07-19\tRefresh Wan 2.5 landing page copy',
  'M\tsrc/data/en/wan-2-5-ai-video-generator.json',
  'M\tsrc/data/fr/wan-2-5-ai-video-generator.json',
  '__TOOLAZE_RELEASE_COMMIT__\tddd4444\t2026-07-19\tFix video credit preflight before generation',
  'M\tsrc/lib/generation-credits.ts',
  '__TOOLAZE_RELEASE_COMMIT__\teee5555\t2026-07-19\tAdd analytics tracking for credit and history actions',
  'M\tsrc/app/pricing/PricingCheckoutButton.tsx',
  '__TOOLAZE_RELEASE_COMMIT__\tdef5678\t2026-07-19\tfix: enable vercel runtime routes',
  'M\tsrc/app/api/image-to-image/route.js',
  'M\tscripts/vercel-runtime-config.test.mjs',
].join('\n')

test('release calendar displays the latest week first without reversing weekdays', () => {
  const calendar = buildReleaseCalendar([], {
    today: '2026-08-12',
    days: 10,
  })
  const weeks = buildCalendarWeeks(calendar.days)

  assert.equal(weeks[0].find((day) => day)?.date, '2026-08-10')
  assert.equal(weeks[0].filter(Boolean).at(-1)?.date, '2026-08-12')
  assert.equal(weeks.at(-1)?.find((day) => day)?.date, '2026-08-03')
})

test('tracks the August 11 Seedance 2.5 release', () => {
  const calendar = buildReleaseCalendar(parseGitReleaseLog([
    '__TOOLAZE_RELEASE_COMMIT__\t454cb323\t2026-08-11\tfeat: publish Seedance 2.5 model experience',
    'M\tsrc/data/en/seedance-2-5.json',
    'M\tsrc/data/zh-TW/seedance-2-5.json',
    'M\tsrc/components/blocks/ToolL2PageContent.tsx',
  ].join('\n')), {
    today: '2026-08-12',
  })
  const day = calendar.days.find((item) => item.date === '2026-08-11')

  assert.ok(day)
  assert.deepEqual(day.landingPages.map((item) => item.href), ['/seedance-2-5'])
  assert.equal(day.landingPages[0].label, 'Seedance 2.5')
  assert.equal(day.landingPages[0].kind, 'new-landing-page')
  assert.equal(day.landingPages[0].summary, '新增 Seedance 2.5 生成功能')
  assert.deepEqual(day.landingPages[0].details, [
    '上线 Seedance 2.5 模型生成入口与完整工具页',
    '支持多参考资源，并可在 Prompt 中引用',
    '补齐任务历史复用、积分配置和多语言内容',
  ])
})

test('describes AI outfit portrait ratio releases with concrete summaries', () => {
  const calendar = buildReleaseCalendar(parseGitReleaseLog([
    '__TOOLAZE_RELEASE_COMMIT__\te7756a02\t2026-08-12\tfix: default portrait ratios for outfit tools',
    'M\tsrc/data/en/ai-clothes-changer.json',
    'M\tsrc/data/zh-TW/ai-clothes-changer.json',
    'M\tsrc/data/en/ai-bikini-generator.json',
  ].join('\n')), {
    today: '2026-08-12',
  })
  const day = calendar.days.find((item) => item.date === '2026-08-12')

  assert.ok(day)
  const clothes = day.landingPages.find((item) => item.href === '/ai-clothes-changer')
  const bikini = day.landingPages.find((item) => item.href === '/ai-bikini-generator')
  assert.ok(clothes)
  assert.ok(bikini)
  assert.equal(clothes.summary, 'AI 换衣默认比例改为 9:16')
  assert.equal(bikini.summary, 'AI Bikini 默认比例改为 9:16')
  assert.match(clothes.details.join('\n'), /默认生图比例从 16:9 改为 9:16/)
})

test('parses git release log commits with changed files', () => {
  const commits = parseGitReleaseLog(sampleGitLog)

  assert.equal(commits.length, 6)
  assert.deepEqual(commits[0], {
    hash: 'abc1234',
    date: '2026-07-20',
    subject: 'Add Seedream landing page',
    files: [
      'src/app/seedream-4-5/page.tsx',
      'src/app/seedream-4-5/copy.ts',
      'public/model-assets/seedream-4-5/hero.webp',
      'src/app/sitemap.ts',
    ],
    changedFiles: [
      { status: 'A', path: 'src/app/seedream-4-5/page.tsx' },
      { status: 'A', path: 'src/app/seedream-4-5/copy.ts' },
      { status: 'A', path: 'public/model-assets/seedream-4-5/hero.webp' },
      { status: 'M', path: 'src/app/sitemap.ts' },
    ],
  })
})

test('builds a 30-day business release calendar without engineering noise', () => {
  const calendar = buildReleaseCalendar(parseGitReleaseLog(sampleGitLog), {
    today: '2026-07-31',
  })

  assert.equal(calendar.startDate, '2026-07-02')
  assert.equal(calendar.endDate, '2026-07-31')
  assert.equal(calendar.days.length, 30)

  const landingDay = calendar.days.find((day) => day.date === '2026-07-20')
  assert.ok(landingDay)
  assert.equal(landingDay.landingPages.length, 1)
  assert.equal(landingDay.landingPages[0].label, 'Seedream 4.5')
  assert.equal(landingDay.landingPages[0].href, '/seedream-4-5')
  assert.equal(landingDay.majorUpdates.length, 1)
  assert.equal(landingDay.majorUpdates[0].label, '价格 / 付费更新')

  const wanUpdateDay = calendar.days.find((day) => day.date === '2026-07-19')
  assert.ok(wanUpdateDay)
  assert.equal(wanUpdateDay.landingPages.length, 1)
  assert.equal(wanUpdateDay.landingPages[0].label, 'Wan 2.5 AI Video Generator')
  assert.equal(wanUpdateDay.landingPages[0].kind, 'landing-page-update')
  assert.equal(wanUpdateDay.majorUpdates.length, 0)
  assert.equal(wanUpdateDay.changeCount, 1)

  assert.equal(calendar.totals.landingPages, 2)
  assert.equal(calendar.totals.majorUpdates, 1)
  assert.equal(calendar.totals.activeDays, 2)
  assert.equal(calendar.totals.commits, 3)
})

test('does not classify hub pages, shared locale files, or navigation as business releases', () => {
  const calendar = buildReleaseCalendar(parseGitReleaseLog([
    '__TOOLAZE_RELEASE_COMMIT__\taaabbbb\t2026-07-21\tUpdate AI tools hub entries',
    'M\tsrc/app/ai-tools/page.tsx',
    'M\tsrc/data/en/common.json',
    'M\tsrc/components/Navigation.tsx',
  ].join('\n')), {
    today: '2026-07-31',
  })
  const day = calendar.days.find((item) => item.date === '2026-07-21')

  assert.ok(day)
  assert.equal(day.landingPages.length, 0)
  assert.equal(day.majorUpdates.length, 0)
  assert.equal(day.changeCount, 0)
})

test('dedupes model landing pages and prefers model URLs', () => {
  const calendar = buildReleaseCalendar(parseGitReleaseLog([
    '__TOOLAZE_RELEASE_COMMIT__\tmmm1111\t2026-07-22\tAdd Wan model page',
    'A\tsrc/app/model/wan-2-5-ai-video-generator/page.tsx',
    'A\tsrc/data/en/wan-2-5-ai-video-generator.json',
    'A\tpublic/model-assets/wan-2-5-ai-video-generator/hero.webp',
    '__TOOLAZE_RELEASE_COMMIT__\tmmm2222\t2026-07-22\tAdd Wan model page',
    'A\tsrc/app/model/wan-2-5-ai-video-generator/page.tsx',
    'A\tsrc/data/fr/wan-2-5-ai-video-generator.json',
  ].join('\n')), {
    today: '2026-07-31',
  })
  const day = calendar.days.find((item) => item.date === '2026-07-22')

  assert.ok(day)
  assert.equal(day.landingPages.length, 1)
  assert.equal(day.landingPages[0].href, '/model/wan-2-5-ai-video-generator')
  assert.equal(day.landingPages[0].label, 'Wan 2.5 AI Video Generator')
})

test('keeps real landing pages from local untracked release records', () => {
  const calendar = buildReleaseCalendar(parseGitReleaseLog([
    '__TOOLAZE_RELEASE_COMMIT__\tlll9999\t2026-08-01\tuntracked files on main: publish unrestricted and breast expansion pages',
    'A\tsrc/app/unrestricted-ai-image-generator/page.tsx',
    'A\tsrc/app/[locale]/unrestricted-ai-image-generator/page.tsx',
    'A\tsrc/data/en/unrestricted-ai-image-generator.json',
    'A\tsrc/app/ai-breast-expansion/page.tsx',
    'A\tsrc/app/[locale]/ai-breast-expansion/page.tsx',
    'A\tsrc/data/en/ai-breast-expansion.json',
  ].join('\n')), {
    today: '2026-08-01',
  })
  const day = calendar.days.find((item) => item.date === '2026-08-01')

  assert.ok(day)
  assert.equal(day.landingPages.length, 2)
  assert.deepEqual(day.landingPages.map((item) => item.href).sort(), [
    '/ai-breast-expansion',
    '/unrestricted-ai-image-generator',
  ])
  assert.deepEqual(day.landingPages.map((item) => item.label).sort(), [
    'AI Breast Expansion',
    'Unrestricted AI Image Generator',
  ])
})

test('tracks selected landing page updates without adding every modified page', () => {
  const calendar = buildReleaseCalendar(parseGitReleaseLog([
    '__TOOLAZE_RELEASE_COMMIT__\tuuu1111\t2026-08-01\tUpdate AI video nav and signup credits',
    'M\tsrc/data/en/unrestricted-ai-image-generator.json',
    'M\tsrc/data/fr/unrestricted-ai-image-generator.json',
    'M\tsrc/data/en/ai-breast-expansion.json',
    'M\tsrc/data/de/ai-breast-expansion.json',
    'M\tsrc/data/en/ai-video-generator.json',
  ].join('\n')), {
    today: '2026-08-01',
  })
  const day = calendar.days.find((item) => item.date === '2026-08-01')

  assert.ok(day)
  assert.equal(day.landingPages.length, 2)
  assert.deepEqual(day.landingPages.map((item) => item.href).sort(), [
    '/ai-breast-expansion',
    '/unrestricted-ai-image-generator',
  ])
  assert.equal(day.landingPages.some((item) => item.href === '/ai-video-generator'), false)
})

test('tracks August 5 large landing releases in the calendar', () => {
  const calendar = buildReleaseCalendar(parseGitReleaseLog([
    '__TOOLAZE_RELEASE_COMMIT__\ted142cd0\t2026-08-05\tShip AI Zine Poster Generator',
    'A\tsrc/app/[locale]/ai-zine-poster-generator/page.tsx',
    'A\tsrc/app/ai-zine-poster-generator/page.tsx',
    'A\tsrc/data/en/ai-zine-poster-generator.json',
    '__TOOLAZE_RELEASE_COMMIT__\t0abdad82\t2026-08-05\tPublish Wan video model landing pages',
    'M\tsrc/app/model/wan-2-6-ai-video-generator/page.tsx',
    'M\tsrc/data/en/wan-2-5-ai-video-generator.json',
    'A\tsrc/data/en/wan-2-6-ai-video-generator.json',
    'M\tsrc/data/en/wan-2-7-ai-video-generator.json',
    '__TOOLAZE_RELEASE_COMMIT__\t0559c7c8\t2026-08-05\tConsolidate Seedance 2 legacy redirects',
    'M\tsrc/app/[locale]/seedance-2/page.tsx',
    'M\tsrc/app/seedance-2/page.tsx',
  ].join('\n')), {
    today: '2026-08-06',
  })
  const day = calendar.days.find((item) => item.date === '2026-08-05')

  assert.ok(day)
  assert.equal(day.commitCount, 3)
  assert.deepEqual(day.landingPages.map((item) => `${item.kind}:${item.label}`).sort(), [
    'landing-page-update:Seedance 2.0 旧链接优化',
    'landing-page-update:Wan 2.5 AI Video Generator',
    'landing-page-update:Wan 2.7 AI Video Generator',
    'new-landing-page:AI Zine Poster Generator',
    'new-landing-page:Wan 2.6 AI Video Generator',
  ])
})

test('tracks August 6 releases and sitemap publication optimizations', () => {
  const calendar = buildReleaseCalendar(parseGitReleaseLog([
    '__TOOLAZE_RELEASE_COMMIT__\t509f1865\t2026-08-06\tAdd buzz cut filter landing page',
    'A\tsrc/app/[locale]/buzz-cut-filter/page.tsx',
    'A\tsrc/app/buzz-cut-filter/page.tsx',
    'A\tsrc/data/en/buzz-cut-filter.json',
    'M\tsrc/app/sitemap.ts',
    '__TOOLAZE_RELEASE_COMMIT__\tbec84114\t2026-08-06\tAdd localized Veo 3.1 model page',
    'A\tsrc/app/model/veo-3-1-ai-video-generator/page.tsx',
    'A\tsrc/data/en/veo-3-1-ai-video-generator.json',
    'M\tsrc/app/sitemap.ts',
    '__TOOLAZE_RELEASE_COMMIT__\t15e24d7c\t2026-08-06\tFix sitemap lastmod and AI URL coverage',
    'M\tsrc/app/sitemap.ts',
    'M\tsrc/lib/localized-route-fallbacks.test.ts',
    '__TOOLAZE_RELEASE_COMMIT__\t09e3941c\t2026-08-06\tRefine sitemap lastmod dates for AI pages',
    'M\tsrc/app/sitemap.ts',
    'M\tsrc/lib/localized-route-fallbacks.test.ts',
  ].join('\n')), {
    today: '2026-08-07',
  })
  const day = calendar.days.find((item) => item.date === '2026-08-06')

  assert.ok(day)
  assert.equal(day.commitCount, 4)
  assert.deepEqual(day.landingPages.map((item) => `${item.kind}:${item.label}`).sort(), [
    'new-landing-page:Buzz Cut Filter',
    'new-landing-page:Veo 3.1 AI Video Generator',
  ])
  assert.deepEqual(day.majorUpdates.map((item) => `${item.kind}:${item.label}`), [
    'release-optimization:Sitemap / AI URL 收录优化',
  ])
})

test('tracks August 7 public demo, model page, and generator UX releases', () => {
  const calendar = buildReleaseCalendar(parseGitReleaseLog([
    '__TOOLAZE_RELEASE_COMMIT__\t359879f1\t2026-08-07\tFix reference ratios and mobile downloads',
    'M\tsrc/components/AiImageGenerationTool.tsx',
    'M\tsrc/components/AiVideoGeneratorTool.tsx',
    'M\tsrc/lib/browser-image-download.ts',
    '__TOOLAZE_RELEASE_COMMIT__\tb65539b0\t2026-08-07\tOptimize HappyHorse SEO and model breadcrumbs',
    'M\tsrc/components/Breadcrumb.tsx',
    'M\tsrc/data/en/happyhorse-ai-video-generator.json',
    '__TOOLAZE_RELEASE_COMMIT__\t608c765d\t2026-08-07\tPublish video demos and clean landing page navigation',
    'M\tsrc/data/en/pixverse-v6-ai-video-generator.json',
    'M\tsrc/data/en/wan-2-7-ai-video-generator.json',
    '__TOOLAZE_RELEASE_COMMIT__\t03e83961\t2026-08-07\tUpdate public demo media and tool entrypoints',
    'A\tsrc/app/[locale]/ai-photo-abstract-poster-generator/page.tsx',
    'A\tsrc/app/ai-photo-abstract-poster-generator/page.tsx',
    'A\tsrc/app/model/happyhorse-1-1/page.tsx',
    'A\tsrc/app/model/happyhorse-ai-video-generator/page.tsx',
    'A\tsrc/app/model/happyhorse/page.tsx',
    'A\tsrc/app/model/pixverse-v6-ai-video-generator/page.tsx',
    'A\tsrc/app/model/pixverse-v6/page.tsx',
    'M\tsrc/data/en/ai-zine-poster-generator.json',
    'M\tsrc/data/en/buzz-cut-filter.json',
    'M\tsrc/data/en/seedance-2.json',
  ].join('\n')), {
    today: '2026-08-08',
  })
  const day = calendar.days.find((item) => item.date === '2026-08-07')

  assert.ok(day)
  assert.equal(day.commitCount, 4)
  assert.deepEqual(day.landingPages.map((item) => `${item.kind}:${item.label}`).sort(), [
    'landing-page-update:AI Zine Poster Generator',
    'landing-page-update:Buzz Cut Filter',
    'landing-page-update:Seedance 2.0 旧链接优化',
    'landing-page-update:Wan 2.7 AI Video Generator',
    'new-landing-page:AI Photo Abstract Poster Generator',
    'new-landing-page:HappyHorse AI Video Generator',
    'new-landing-page:PixVerse V6 AI Video Generator',
  ])
  assert.deepEqual(day.majorUpdates.map((item) => `${item.kind}:${item.label}`), [
    'tool-experience-update:生成工具参考图比例与移动端下载优化',
  ])
})

test('tracks August 8 clothes and hairstyle tool releases', () => {
  const calendar = buildReleaseCalendar(parseGitReleaseLog([
    '__TOOLAZE_RELEASE_COMMIT__\t81c9767e\t2026-08-08\tPublish clothes and hairstyle image tools',
    'A\tsrc/app/[locale]/bald-filter/page.tsx',
    'A\tsrc/app/[locale]/bangs-filter/page.tsx',
    'A\tsrc/app/[locale]/perm-filter/page.tsx',
    'A\tsrc/app/bald-filter/page.tsx',
    'A\tsrc/app/bangs-filter/page.tsx',
    'A\tsrc/app/perm-filter/page.tsx',
    'M\tsrc/data/en/ai-clothes-changer.json',
    'M\tsrc/data/en/ai-hairstyle-changer.json',
    'A\tsrc/data/en/bald-filter.json',
    'A\tsrc/data/en/bangs-filter.json',
    'A\tsrc/data/en/perm-filter.json',
    '__TOOLAZE_RELEASE_COMMIT__\tcab941eb\t2026-08-08\tAdd Wan 3.0 multilingual model landing page',
    'A\tsrc/app/model/wan-3-0-ai-video-generator/page.tsx',
    'A\tsrc/data/en/wan-3-0-ai-video-generator.json',
  ].join('\n')), {
    today: '2026-08-09',
  })
  const day = calendar.days.find((item) => item.date === '2026-08-08')

  assert.ok(day)
  assert.equal(day.commitCount, 2)
  assert.deepEqual(day.landingPages.map((item) => `${item.kind}:${item.label}`).sort(), [
    'landing-page-update:AI Clothes Changer',
    'landing-page-update:AI Hairstyle Changer',
    'new-landing-page:Bald Filter',
    'new-landing-page:Bangs Filter',
    'new-landing-page:Perm Filter',
    'new-landing-page:Wan 3.0 AI Video Generator',
  ])
})

test('tracks August 9 publication, history, and compact image updates without backup noise', () => {
  const calendar = buildReleaseCalendar(parseGitReleaseLog([
    '__TOOLAZE_RELEASE_COMMIT__\t6688de0f\t2026-08-09\tfeat: publish compact image settings and history fixes',
    'M\tsrc/components/AiImageGenerationTool.tsx',
    'A\tsrc/lib/image-aspect-ratio-policy.ts',
    'A\tsrc/lib/image-aspect-ratio-policy.test.ts',
    '__TOOLAZE_RELEASE_COMMIT__\t5c15bfb2\t2026-08-09\tfix: publish bikini flow and canonical English routes',
    'M\tsrc/app/[locale]/ai-bikini-generator/page.tsx',
    'M\tsrc/data/en/ai-bikini-generator.json',
    '__TOOLAZE_RELEASE_COMMIT__\te69b3179\t2026-08-09\tfeat(history): persist generation task lifecycle',
    'A\tmigrations/0011_generation_attempts.sql',
    'A\tmigrations/0012_generation_attempt_resume_metadata.sql',
    'M\tsrc/components/HistoryPageClient.tsx',
    '__TOOLAZE_RELEASE_COMMIT__\t81f1c6e7\t2026-08-09\tfeat(seo): add page-specific social metadata',
    'M\tsrc/app/ai-breast-expansion/page.tsx',
    'M\tsrc/app/unrestricted-ai-image-generator/page.tsx',
    '__TOOLAZE_RELEASE_COMMIT__\t2779db91\t2026-08-09\tFix clothes and hairstyle generation flows',
    'M\tsrc/components/AiImageGenerationTool.tsx',
    'M\tsrc/data/en/ai-clothes-changer.json',
    '__TOOLAZE_RELEASE_COMMIT__\t05aa821c\t2026-08-09\tRelease clothes changer and hairstyle landing pages',
    'M\tsrc/app/ai-clothes-changer/page.tsx',
    'M\tsrc/app/ai-hairstyle-changer/page.tsx',
    'M\tsrc/app/buzz-cut-filter/page.tsx',
    '__TOOLAZE_RELEASE_COMMIT__\t3864a213\t2026-08-09\tFix AI Clothes Changer canonical OpenGraph URL',
    'M\tsrc/app/ai-clothes-changer/page.tsx',
  ].join('\n')), {
    today: '2026-08-10',
  })
  const day = calendar.days.find((item) => item.date === '2026-08-09')

  assert.ok(day)
  assert.equal(day.commitCount, 7)
  assert.deepEqual(day.landingPages.map((item) => `${item.kind}:${item.label}`).sort(), [
    'landing-page-update:AI Clothes Changer',
    'landing-page-update:AI Hairstyle Changer',
    'landing-page-update:Buzz Cut Filter',
  ])
  assert.deepEqual(day.majorUpdates.map((item) => `${item.kind}:${item.label}`).sort(), [
    'release-optimization:AI Bikini Generator 流程与英文 canonical 路由优化',
    'release-optimization:页面社交分享 Metadata 优化',
    'tool-experience-update:图片生成紧凑设置与历史修复',
    'tool-experience-update:生成历史任务生命周期持久化',
  ])
})

test('fetches local release calendar using fixed read-only git commands', async () => {
  const calls: Array<{ file: string; args: string[] }> = []

  const calendar = await fetchLocalReleaseCalendar(async (file, args) => {
    calls.push({ file, args })
    if (args[0] === 'status') return ''
    return sampleGitLog
  }, {
    today: '2026-07-31',
  })

  assert.equal(calendar.days.length, 30)
  assert.equal(calls.length, 2)
  assert.equal(calls[0].file, 'git')
  assert.deepEqual(calls[0].args.slice(0, 5), ['log', '--exclude=backup/*', '--branches', '--remotes', '--since=2026-07-02'])
  assert.ok(calls[0].args.includes('--exclude=backup/*'))
  assert.ok(calls[0].args.includes('--name-status'))
  assert.ok(calls[0].args.includes('--date=short'))
  assert.ok(calls[0].args.includes('src'))
  assert.ok(calls[0].args.includes('public'))
  assert.ok(calls[0].args.includes('docs'))
  assert.ok(calls[0].args.includes('migrations'))
  assert.equal(calls[0].args.includes('scripts'), false)
  assert.equal(calls[0].args.includes('--all'), false)
  assert.equal(calls[1].file, 'git')
  assert.deepEqual(calls[1].args.slice(0, 4), ['status', '--short', '--untracked-files=all', '--'])
  assert.ok(calls[1].args.includes('src/app/admin'))
  assert.ok(calls[1].args.includes('src/lib/admin'))
  assert.ok(calls[1].args.includes('src/components/admin'))
})

test('admin releases page stays protected and noindex', () => {
  const pagePath = join(process.cwd(), 'src/app/admin/releases/page.tsx')
  const plannerPath = join(process.cwd(), 'src/components/admin/ReleaseCalendarPlanner.tsx')

  assert.equal(existsSync(pagePath), true)
  assert.equal(existsSync(plannerPath), true)

  const source = [
    readFileSync(pagePath, 'utf8'),
    readFileSync(plannerPath, 'utf8'),
  ].join('\n')
  assert.match(source, /个人发版记录/)
  assert.match(source, /noindex, nofollow/)
  assert.match(source, /isAdminRequestAllowed/)
  assert.match(source, /notFound/)
  assert.match(source, /fetchLocalReleaseCalendar/)
  assert.match(source, /新落地页/)
  assert.match(source, /价格、付费/)
  assert.match(source, /后台大功能/)
  assert.match(source, /发布优化/)
  assert.match(source, /工具体验优化/)
  assert.match(source, /只读取当前项目的 Git 历史/)
  assert.doesNotMatch(source, /构建类大功能/)
  assert.doesNotMatch(source, /内容 \/ 价格更新/)
  assert.doesNotMatch(source, /部署流水线/)
  assert.doesNotMatch(source, /Vercel/)
})

test('tracks local admin dashboard feature updates from the working tree', async () => {
  const calls: Array<{ file: string; args: string[] }> = []

  const calendar = await fetchLocalReleaseCalendar(async (file, args) => {
    calls.push({ file, args })
    if (args[0] === 'status') {
      return [
        '?? src/app/admin/reward-reviews/page.tsx',
        '?? src/lib/admin/reward-reviews.ts',
        '?? src/app/admin/data-dashboard/page.tsx',
        '?? src/lib/admin/daily-metrics.ts',
        ' M src/components/admin/GenerationMediaPreview.tsx',
      ].join('\n')
    }

    return ''
  }, {
    today: '2026-08-04',
  })

  assert.equal(calls.length, 2)
  assert.deepEqual(calls[1].args.slice(0, 4), ['status', '--short', '--untracked-files=all', '--'])
  assert.ok(calls[1].args.includes('src/app/admin'))
  assert.ok(calls[1].args.includes('src/lib/admin'))

  const day = calendar.days.find((item) => item.date === '2026-08-04')
  assert.ok(day)
  assert.deepEqual(day.majorUpdates.map((item) => item.label).sort(), [
    '任务生成记录缩略图',
    '奖励审核后台',
    '每日数据看板',
  ])
})

test('admin releases page supports manual personal calendar items', () => {
  const pagePath = join(process.cwd(), 'src/app/admin/releases/page.tsx')
  const plannerPath = join(process.cwd(), 'src/components/admin/ReleaseCalendarPlanner.tsx')

  assert.equal(existsSync(pagePath), true)
  assert.equal(existsSync(plannerPath), true)

  const pageSource = readFileSync(pagePath, 'utf8')
  const plannerSource = readFileSync(plannerPath, 'utf8')

  assert.match(pageSource, /ReleaseCalendarPlanner/)
  assert.match(plannerSource, /'use client'/)
  assert.match(plannerSource, /localStorage/)
  assert.match(plannerSource, /ReleaseItemOverride/)
  assert.match(plannerSource, /RELEASE_OVERRIDE_STORAGE_KEY/)
  assert.match(plannerSource, /releaseItemsByDate/)
  assert.match(plannerSource, /moveReleaseItem/)
  assert.match(plannerSource, /deleteReleaseItem/)
  assert.match(plannerSource, /resetReleaseItemOverrides/)
  assert.match(plannerSource, /重置本地调整/)
  assert.match(plannerSource, /所有事项都可拖动/)
  assert.match(plannerSource, /min-w-\[1540px\]/)
  assert.match(plannerSource, /group-hover:opacity-100/)
  assert.match(plannerSource, /悬停右上角/)
  assert.match(plannerSource, /draggable/)
  assert.match(plannerSource, /CALENDAR_DRAG_MIME_TYPE/)
  assert.match(plannerSource, /dataTransfer/)
  assert.match(plannerSource, /effectAllowed = 'move'/)
  assert.match(plannerSource, /dropEffect = 'move'/)
  assert.match(plannerSource, /onDragStart/)
  assert.match(plannerSource, /onDragOver/)
  assert.match(plannerSource, /onDrop/)
  assert.match(plannerSource, /parseCalendarDragItem/)
  assert.match(plannerSource, /data-calendar-date/)
  assert.match(plannerSource, /deleteManualItem/)
  assert.match(plannerSource, /添加事项/)
  assert.match(plannerSource, /拖拽调整日期/)
  assert.match(plannerSource, /新增页/)
  assert.match(plannerSource, /优化页/)
  assert.match(plannerSource, /付费更新/)
  assert.match(plannerSource, /后台功能/)
  assert.match(plannerSource, /发布优化/)
  assert.match(plannerSource, /工具优化/)
  assert.match(plannerSource, /bg-red-50/)
  assert.match(plannerSource, /删除事项/)
  assert.match(plannerSource, /selectedReleaseItem/)
  assert.match(plannerSource, /发布详情/)
  assert.match(plannerSource, /具体发布内容/)
  assert.match(plannerSource, /影响页面/)
  assert.match(plannerSource, /提交信息/)
  assert.match(plannerSource, /涉及文件/)
  assert.match(plannerSource, /item\.summary/)
  assert.doesNotMatch(plannerSource, /点击目标日期移动/)
  assert.doesNotMatch(plannerSource, /移动到日期/)
  assert.doesNotMatch(plannerSource, /拖动到其他日期/)
  assert.doesNotMatch(plannerSource, />打开</)
  assert.doesNotMatch(plannerSource, /<select/)
  assert.doesNotMatch(plannerSource, /onPointerDown/)
  assert.doesNotMatch(plannerSource, /onMouseDown/)
  assert.doesNotMatch(plannerSource, /setPointerCapture/)
})
