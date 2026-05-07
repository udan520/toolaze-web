#!/usr/bin/env node
/**
 * SEO 管理后台 - 独立服务器
 * 用于在本地读写 src/data 下的 JSON 文件（Next.js 静态导出不支持 API 路由）
 *
 * 用法：node scripts/admin-seo-server.js
 * 访问：http://localhost:3007
 */
const http = require('http')
const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')

const PORT = 3007
const ROOT = path.join(__dirname, '..')
const DATA_ROOT = path.join(ROOT, 'src', 'data')
const DOCS_ROOT = path.join(ROOT, 'docs')

// 加载 .env.local
function loadEnvLocal() {
  const envPath = path.join(ROOT, '.env.local')
  try {
    const content = fs.readFileSync(envPath, 'utf-8')
    for (const line of content.split('\n')) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
      if (m) {
        const val = m[2].replace(/^["']|["']$/g, '').trim()
        if (!process.env[m[1]]) process.env[m[1]] = val
      }
    }
  } catch {}
}
loadEnvLocal()

function getFilePath(tool, slug, locale) {
  const loc = locale || 'en'
  if (!slug) {
    return path.join(DATA_ROOT, loc, `${tool}.json`)
  }
  return path.join(DATA_ROOT, loc, tool, `${slug}.json`)
}

/** 工具板块显示顺序，靠前的排在顶部；未列出的按原顺序排在后面 */
const TOOL_DISPLAY_ORDER = ['watermark-remover', 'image-compressor', 'image-compression', 'image-converter', 'font-generator', 'emoji-copy-and-paste', 'seedance-2', 'kling-3', 'nano-banana-pro', 'nano-banana-2']

async function listTools() {
  const enDir = path.join(DATA_ROOT, 'en')
  const entries = fs.readdirSync(enDir, { withFileTypes: true })
  const toolMap = new Map()

  for (const ent of entries) {
    if (ent.name === 'common.json') continue
    if (ent.isFile() && ent.name.endsWith('.json')) {
      const id = ent.name.replace('.json', '')
      if (!toolMap.has(id)) {
        toolMap.set(id, {
          name: id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          pages: [{ slug: '', name: 'L2 主页面' }],
        })
      }
    }
    if (ent.isDirectory()) {
      const subPath = path.join(enDir, ent.name)
      let files = []
      try {
        files = fs.readdirSync(subPath)
      } catch {}
      const slugs = files.filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', ''))
      // L2 主页面在 L3 之上
      const pages = [{ slug: '', name: 'L2 主页面' }, ...slugs.map((s) => ({ slug: s, name: s }))]
      const existing = toolMap.get(ent.name)
      if (existing) {
        existing.pages = pages
      } else {
        toolMap.set(ent.name, {
          name: ent.name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          pages,
        })
      }
    }
  }

  const arr = Array.from(toolMap.entries()).map(([id, v]) => ({ id, ...v }))
  arr.sort((a, b) => {
    const ia = TOOL_DISPLAY_ORDER.indexOf(a.id)
    const ib = TOOL_DISPLAY_ORDER.indexOf(b.id)
    if (ia >= 0 && ib >= 0) return ia - ib
    if (ia >= 0) return -1
    if (ib >= 0) return 1
    return a.id.localeCompare(b.id)
  })
  return arr
}

function parseQuery(url) {
  const i = url.indexOf('?')
  if (i < 0) return {}
  const params = new URLSearchParams(url.slice(i))
  return Object.fromEntries(params)
}

/** 从 SEO JSON 中提取所有文本（用于关键词分析） */
function extractTextFromSeoJson(obj, acc = []) {
  if (!obj) return acc
  if (typeof obj === 'string') {
    acc.push(obj.replace(/<[^>]+>/g, ' '))
    return acc
  }
  if (Array.isArray(obj)) {
    for (const item of obj) extractTextFromSeoJson(item, acc)
    return acc
  }
  if (typeof obj === 'object') {
    for (const v of Object.values(obj)) extractTextFromSeoJson(v, acc)
    return acc
  }
  return acc
}

/** 按板块提取文本，返回 { sectionId: { label, text } }，兼容多种 JSON 结构 */
function extractTextBySection(parsed) {
  const sections = {}
  const add = (id, text) => {
    if (!text || typeof text !== 'string') return
    const t = text.replace(/<[^>]+>/g, ' ').trim()
    if (t) sections[id] = (sections[id] || '') + ' ' + t
  }
  if (parsed.metadata) {
    add('metadata', parsed.metadata.title)
    add('metadata', parsed.metadata.description)
  }
  if (parsed.hero) {
    add('hero', parsed.hero.h1)
    add('hero', parsed.hero.desc)
  }
  if (parsed.howToUse) {
    add('howToUse', parsed.howToUse.title)
    for (const s of parsed.howToUse.steps || []) { add('howToUse', s.title); add('howToUse', s.desc) }
  }
  if (parsed.modelIntro) {
    add('modelIntro', parsed.modelIntro.title)
    const desc = parsed.modelIntro.description
    if (Array.isArray(desc)) for (const d of desc) add('modelIntro', d)
    else if (typeof desc === 'string') add('modelIntro', desc)
    for (const c of parsed.modelIntro.featureCards || []) { add('modelIntro', c.title); add('modelIntro', c.content) }
  }
  if (parsed.features) {
    add('features', parsed.features.title)
    const items = parsed.features.items || parsed.features.list || []
    for (const i of items) {
      if (typeof i === 'string') add('features', i)
      else { add('features', i.title); add('features', i.desc) }
    }
  }
  if (parsed.intro) {
    add('intro', parsed.intro.title)
    const content = parsed.intro.content
    if (typeof content === 'string') add('intro', content)
    else for (const c of content || []) { add('intro', c.title); add('intro', c.text) }
    for (const b of parsed.intro.bottomCards || []) { add('intro', b.title); add('intro', b.desc) }
  }
  if (parsed.comparison) {
    add('comparison', parsed.comparison.title)
    add('comparison', parsed.comparison.toolazeFeatures)
    add('comparison', parsed.comparison.othersFeatures)
  }
  add('scenes', parsed.scenesTitle || parsed.scenes?.title)
  const scenesList = Array.isArray(parsed.scenes) ? parsed.scenes : (parsed.scenes?.list || [])
  for (const s of scenesList) { add('scenes', s.title); add('scenes', s.desc) }
  if (parsed.rating) { add('rating', parsed.rating.title); add('rating', parsed.rating.text) }
  add('faq', parsed.faqTitle || parsed.faq?.title)
  const faqList = Array.isArray(parsed.faq) ? parsed.faq : (parsed.faq?.list || [])
  for (const f of faqList) { add('faq', f.q || f.question); add('faq', f.a || f.answer) }
  const labels = { metadata: 'Metadata', hero: 'Hero', howToUse: 'How To Use', modelIntro: 'Model Intro', features: 'Features', intro: 'Intro', comparison: 'Comparison', scenes: 'Scenarios', rating: 'Rating', faq: 'FAQ' }
  return Object.fromEntries(Object.entries(sections).map(([k, v]) => [k, { label: labels[k] || k, text: String(v).trim() }]))
}

/** 从内容中提取内链 <a href="..."> */
function extractInternalLinks(obj, acc = []) {
  if (!obj) return acc
  if (typeof obj === 'string') {
    const matches = obj.matchAll(/<a\s+href=["']([^"']+)["'][^>]*>([^<]*)<\/a>/gi)
    for (const m of matches) {
      const href = m[1]
      const anchor = m[2]
      if (href.startsWith('/') || href.includes('toolaze.com')) acc.push({ href, anchor })
    }
    return acc
  }
  if (Array.isArray(obj)) {
    for (const item of obj) extractInternalLinks(item, acc)
    return acc
  }
  if (typeof obj === 'object') {
    for (const v of Object.values(obj)) extractInternalLinks(v, acc)
    return acc
  }
  return acc
}

/** 生成 SEO 策略报告 */
function generateSeoReport(parsed, tool, slug, keywordsContent) {
  const texts = extractTextFromSeoJson(parsed)
  const fullText = texts.join(' ')
  const wordCount = fullText.split(/\s+/).filter(Boolean).length
  const bySection = extractTextBySection(parsed)

  let keywords = []
  let kw = null
  try {
    kw = keywordsContent ? JSON.parse(keywordsContent) : null
  } catch {}
  if (!kw) {
    const fallback = path.join(DOCS_ROOT, 'keywords', `${tool}-keywords.json`)
    if (fs.existsSync(fallback)) {
      try {
        kw = JSON.parse(fs.readFileSync(fallback, 'utf-8'))
      } catch {}
    }
  }
  if (kw) {
    const safeMap = (arr, type) => (Array.isArray(arr) ? arr : []).map((k) => ({ ...(typeof k === 'object' && k ? k : { keyword: k }), type }))
    if (kw.primaryKeywords) keywords = keywords.concat(safeMap(kw.primaryKeywords, 'primary'))
    if (kw.longTailKeywords) keywords = keywords.concat(safeMap(kw.longTailKeywords, 'long-tail'))
    if (kw.relatedKeywords) keywords = keywords.concat(safeMap(kw.relatedKeywords, 'related'))
  }

  const used = []
  for (const kwi of keywords) {
    const k = (kwi.keyword || kwi).toLowerCase()
    if (!k) continue
    const regex = new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    const count = (fullText.match(regex) || []).length
    const sectionLabels = []
    if (count > 0) {
      for (const [, info] of Object.entries(bySection)) {
        const txt = info?.text || ''
        if (txt && (txt.match(regex) || []).length > 0) sectionLabels.push(info.label || '')
      }
    }
    if (count > 0 || kwi.type === 'primary') {
      used.push({
        keyword: kwi.keyword || kwi,
        searchVolume: kwi.searchVolume || 0,
        difficulty: kwi.difficulty || 0,
        type: kwi.type || 'unknown',
        count,
        density: wordCount ? ((count / wordCount) * 100).toFixed(2) + '%' : '0%',
        sections: sectionLabels.join(', ') || (count === 0 ? '（未出现，建议在 H1/Title/Hero 布局）' : ''),
      })
    }
  }

  const links = []
  const seen = new Set()
  for (const l of extractInternalLinks(parsed)) {
    const key = l.href + '|' + l.anchor
    if (!seen.has(key)) {
      seen.add(key)
      links.push(l)
    }
  }

  const lines = [
    `# SEO 策略报告`,
    `- **工具**: ${tool}`,
    `- **页面**: ${slug || 'L2 主页面'}`,
    `- **总字数**: ${wordCount}`,
    ``,
    `## 关键词使用情况`,
    `| 关键词 | 搜索量 | 难度 | 类型 | 出现次数 | 密度 | 使用板块 |`,
    `|--------|--------|------|------|----------|------|----------|`,
  ]
  for (const u of used) {
    lines.push(`| ${u.keyword} | ${u.searchVolume || '-'} | ${u.difficulty || '-'} | ${u.type} | ${u.count} | ${u.density} | ${u.sections || '-'} |`)
  }
  if (used.length === 0) lines.push(`| （无匹配关键词） | - | - | - | - | - | - |`)

  lines.push(``, `## 内链使用情况`)
  if (links.length > 0) {
    lines.push(`| 锚文本 | 链接 |`, `|--------|------|`)
    for (const l of links) {
      lines.push(`| ${l.anchor} | ${l.href} |`)
    }
  } else {
    lines.push(`（无内链）`)
  }

  lines.push(``, `## 策略总结`)
  const primaryUsed = used.filter((u) => u.type === 'primary')
  const longTailUsed = used.filter((u) => u.type === 'long-tail')
  const totalSearchVol = used.reduce((s, u) => s + (u.searchVolume || 0), 0)
  const linkCount = links.length
  const linkDensity = wordCount ? (linkCount / (wordCount / 1000)).toFixed(1) : 0
  const summary = []
  if (primaryUsed.length > 0) {
    summary.push(`- **主关键词覆盖**: ${primaryUsed.length} 个，建议 H1/Title/Meta/Hero 均有主词`)
  } else {
    summary.push(`- **主关键词**: 未检测到主词，建议在 Hero、Metadata 中布局`)
  }
  if (longTailUsed.length > 0) {
    summary.push(`- **长尾关键词**: ${longTailUsed.length} 个，适合 FAQ、Intro、Scenarios`)
  }
  summary.push(`- **总搜索量覆盖**: ${totalSearchVol.toLocaleString()}（已用关键词）`)
  summary.push(`- **关键词密度**: 主词建议 1–2%，长尾自然分布 0.5–1%`)
  if (linkCount > 0) {
    summary.push(`- **内链**: ${linkCount} 个，约 ${linkDensity} 个/千词（建议 3–5 个/千词）`)
  } else {
    summary.push(`- **内链**: 无，可考虑在 Intro/FAQ 中添加相关工具内链`)
  }
  lines.push(...summary)

  return { markdown: lines.join('\n'), used, links, wordCount }
}

const server = http.createServer(async (req, res) => {
  const url = req.url || ''
  let pathname = (url.split('?')[0] || '/').replace(/\/$/, '') || '/'
  const params = parseQuery(url)

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (pathname === '/api/tools') {
    try {
      const tools = await listTools()
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(tools))
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: e.message }))
    }
    return
  }

  if (pathname === '/api/rule-preview' && req.method === 'GET') {
    const file = (params.file != null ? String(params.file).trim() : '') || ''
    const tool = params.tool
    const allowed = new Set([
      'README.md', 'SEO_CONTENT_GUIDELINES.md', 'SEO_MASTER_LAYOUT.md', 'TRANSLATION_STRUCTURE_GUIDE.md',
      'sections/00_global.md', 'sections/metadata.md', 'sections/hero.md', 'sections/how-to-use.md',
      'sections/features.md', 'sections/intro.md', 'sections/model-intro.md', 'sections/scenarios.md',
      'sections/rating.md', 'sections/faq.md', 'sections/comparison.md', 'sections/internal-links.md', 'sections/navigation.md', 'sections/more-tools.md',
      'keywords/KEYWORD_STRATEGY.md', 'keywords/KEYWORD_DENSITY_GUIDELINES.md'
    ])
    let relPath = ''
    if (file && (allowed.has(file) || /^keywords\/[A-Za-z0-9_-]+\.md$/.test(file))) {
      relPath = file
    } else if (file === 'tool' && tool && /^[a-z0-9-]+$/.test(tool)) {
      relPath = `specs/${tool}.md`
    } else if (file && /^[a-z0-9-]+\.md$/.test(file)) {
      relPath = `specs/${file}`
    }
    if (!relPath) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Invalid file', received: file }))
      return
    }
    try {
      const p = path.resolve(DOCS_ROOT, relPath)
      const rel = path.relative(DOCS_ROOT, p)
      if (rel.startsWith('..') || path.isAbsolute(rel)) {
        res.writeHead(403, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Invalid path' }))
        return
      }
      if (!fs.existsSync(p)) {
        console.warn('[rule-preview] File not found:', p, '(relPath:', relPath, ')')
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'File not found', path: rel, resolved: p }))
        return
      }
      const content = fs.readFileSync(p, 'utf-8')
      res.writeHead(200, { 'Content-Type': 'text/markdown; charset=utf-8' })
      res.end(content)
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: e.message }))
    }
    return
  }

  if (pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: true, version: '1.1' }))
    return
  }

  if (pathname === '/api/test-gemini' && req.method === 'GET') {
    const apiKey = process.env.ZHEN_AI_API_KEY
    const apiUrl = (process.env.ZHEN_AI_FLUX_BASE_URL || 'https://ai.t8star.cn').replace(/\/$/, '')
    const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash'
    const fullUrl = `${apiUrl}/v1/chat/completions`
    if (!apiKey) {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: false, error: 'ZHEN_AI_API_KEY 未配置' }))
      return
    }
    try {
      const r = await fetch(fullUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: 'Say hi' }],
          max_tokens: 10,
        }),
      })
      const text = await r.text()
      let body
      try { body = JSON.parse(text) } catch { body = text }
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({
        ok: r.ok,
        status: r.status,
        statusText: r.statusText,
        url: fullUrl,
        model,
        response: body,
        hint: !r.ok ? '若 404：该 Base URL 可能不支持 chat，可尝试 gpt-best 等平台的 Base URL。若 401：检查 API Key。' : null,
      }))
    } catch (e) {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: false, error: e.message, url: fullUrl }))
    }
    return
  }

  if (pathname === '/api/seo/exists' && req.method === 'GET') {
    const { tool, slug } = params
    if (!tool) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'tool is required' }))
      return
    }
    try {
      const filePath = getFilePath(tool, slug || null, 'en')
      const exists = fs.existsSync(filePath)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ exists }))
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: e.message }))
    }
    return
  }

  if (pathname === '/api/generate-url' && req.method === 'POST') {
    let body = ''
    for await (const chunk of req) body += chunk
    try {
      const { tool, seed, pageType, keywordsContent } = JSON.parse(body || '{}')
      if (!tool) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'tool is required' }))
        return
      }
      const apiKey = process.env.ZHEN_AI_API_KEY
      if (!apiKey) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'ZHEN_AI_API_KEY not configured' }))
        return
      }
      let kwData = null
      try {
        kwData = keywordsContent ? JSON.parse(keywordsContent) : null
      } catch {}
      if (!kwData) {
        const fallback = path.join(DOCS_ROOT, 'keywords', `${tool}-keywords.json`)
        if (fs.existsSync(fallback)) {
          try {
            kwData = JSON.parse(fs.readFileSync(fallback, 'utf-8'))
          } catch {}
        }
      }
      const kwList = []
      if (kwData) {
        for (const arr of [kwData.primaryKeywords, kwData.longTailKeywords, kwData.relatedKeywords]) {
          if (Array.isArray(arr)) {
            for (const k of arr) {
              const kw = k.keyword || k
              const vol = k.searchVolume || 0
              const target = k.targetPage || ''
              if (kw) kwList.push({ keyword: kw, searchVolume: vol, targetPage: target })
            }
          }
        }
      }
      const kwHint = kwList.length > 0
        ? `\nKeywords with search volume (prioritize high-volume for URL):\n${kwList
            .sort((a, b) => (b.searchVolume || 0) - (a.searchVolume || 0))
            .slice(0, 15)
            .map((k) => `- ${k.keyword} (${k.searchVolume || 0})${k.targetPage ? ' -> ' + k.targetPage : ''}`)
            .join('\n')}`
        : ''
      const isL2 = pageType === 'l2'
      const apiUrl = process.env.ZHEN_AI_FLUX_BASE_URL || 'https://ai.t8star.cn'
      const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash'
      const prompt = isL2
        ? `Generate a tool URL slug for the main page. Current tool: ${tool}. ${seed ? 'Context: ' + seed : ''}${kwHint}
Rules: lowercase, hyphens only. Prefer high-search-volume keywords. Example: watermark-remover, image-converter.
Output ONLY the slug, nothing else.`
        : `Generate a URL slug for an SEO sub-page. Tool: ${tool}. ${seed ? 'Context: ' + seed : ''}${kwHint}
Rules: lowercase, hyphens only. Prefer keywords with high search volume or existing targetPage. Example: how-to-remove-watermark-from-photo.
Output ONLY the slug, nothing else.`
      const resBody = await fetch(`${apiUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 100,
        }),
      })
      const json = await resBody.json()
      if (json.error) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: json.error.message || 'API error' }))
        return
      }
      let slug = (json.choices?.[0]?.message?.content || '').trim()
      slug = slug.replace(/["'\s]/g, '').toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: true, slug: slug || null }))
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: e.message }))
    }
    return
  }

  if (pathname === '/api/seo/rename-tool' && req.method === 'POST') {
    let body = ''
    for await (const chunk of req) body += chunk
    try {
      const { oldTool, newTool } = JSON.parse(body || '{}')
      if (!oldTool || !newTool) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'oldTool and newTool are required' }))
        return
      }
      const cleanNew = newTool.replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
      if (!cleanNew) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Invalid newTool' }))
        return
      }
      const locDir = path.join(DATA_ROOT)
      const entries = fs.readdirSync(locDir, { withFileTypes: true })
      const locales = entries.filter((d) => d.isDirectory()).map((d) => d.name)
      for (const loc of locales) {
        const oldFile = path.join(locDir, loc, `${oldTool}.json`)
        const newFile = path.join(locDir, loc, `${cleanNew}.json`)
        if (fs.existsSync(oldFile)) {
          const content = fs.readFileSync(oldFile, 'utf-8')
          fs.mkdirSync(path.dirname(newFile), { recursive: true })
          fs.writeFileSync(newFile, content, 'utf-8')
          fs.unlinkSync(oldFile)
        }
        const oldDir = path.join(locDir, loc, oldTool)
        const newDir = path.join(locDir, loc, cleanNew)
        if (fs.existsSync(oldDir) && fs.statSync(oldDir).isDirectory()) {
          const files = fs.readdirSync(oldDir)
          fs.mkdirSync(newDir, { recursive: true })
          for (const f of files) {
            const src = path.join(oldDir, f)
            const dest = path.join(newDir, f)
            if (fs.statSync(src).isFile()) {
              fs.copyFileSync(src, dest)
              fs.unlinkSync(src)
            }
          }
          fs.rmdirSync(oldDir)
        }
      }
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: true, newTool: cleanNew }))
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: e.message }))
    }
    return
  }

  if (pathname === '/api/keywords' && req.method === 'GET') {
    try {
      const { tool } = params
      const kwDir = path.join(DOCS_ROOT, 'keywords')
      const files = fs.readdirSync(kwDir).filter((f) => f.endsWith('-keywords.json'))
      const forTool = tool
        ? files.filter((f) => f.startsWith(tool + '-') || f === tool + '-keywords.json')
        : files
      const list = forTool.map((f) => {
        const p = path.join(kwDir, f)
        const data = JSON.parse(fs.readFileSync(p, 'utf-8'))
        return { file: f, tool: data.tool || f.replace('-keywords.json', '') }
      })
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(list))
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: e.message }))
    }
    return
  }

  if (pathname === '/api/generate' && req.method === 'POST') {
    let body = ''
    for await (const chunk of req) body += chunk
    try {
      let payload = {}
      try {
        payload = JSON.parse(body || '{}')
      } catch (parseErr) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: '请求体 JSON 解析失败', hint: parseErr.message }))
        return
      }
      const {
        tool,
        slug,
        topComponent,
        coreKeyword,
        keywordsText,
        keywordsFile,
        useComponents = [],
        useSeoContentGuidelines = true,
        useSeoLayout = true,
        useStructureGuide = true,
        useToolSpec = true,
      } = payload
      if (!tool) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'tool is required' }))
        return
      }
      const apiKey = process.env.ZHEN_AI_API_KEY
      if (!apiKey) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'ZHEN_AI_API_KEY not configured in .env.local' }))
        return
      }

      let keywordsContent = keywordsText || ''
      if (!keywordsContent && keywordsFile) {
        const kwPath = path.join(DOCS_ROOT, 'keywords', keywordsFile)
        if (fs.existsSync(kwPath)) {
          keywordsContent = fs.readFileSync(kwPath, 'utf-8')
        }
      }
      if (!keywordsContent) {
        const fallback = path.join(DOCS_ROOT, 'keywords', `${tool}-keywords.json`)
        if (fs.existsSync(fallback)) {
          keywordsContent = fs.readFileSync(fallback, 'utf-8')
        }
      }

      let seoRulesContent = ''
      const seoRuleFiles = []
      if (useSeoContentGuidelines) {
        seoRuleFiles.push('SEO_CONTENT_GUIDELINES.md')
        // 附带加载 sections/ 板块细致规范（规则拆分后需补充）
        const sectionFiles = ['00_global.md', 'metadata.md', 'hero.md', 'how-to-use.md', 'features.md', 'intro.md', 'model-intro.md', 'scenarios.md', 'rating.md', 'faq.md', 'comparison.md', 'more-tools.md']
        for (const sf of sectionFiles) {
          const sp = path.join(DOCS_ROOT, 'sections', sf)
          if (fs.existsSync(sp)) {
            seoRuleFiles.push('sections/' + sf)
          }
        }
      }
      if (useSeoLayout) seoRuleFiles.push('SEO_MASTER_LAYOUT.md')
      if (useStructureGuide) seoRuleFiles.push('TRANSLATION_STRUCTURE_GUIDE.md')
      for (const f of seoRuleFiles) {
        const p = path.join(DOCS_ROOT, f)
        if (fs.existsSync(p)) {
          seoRulesContent += '\n\n--- ' + f + ' ---\n' + fs.readFileSync(p, 'utf-8')
        }
      }

      let toolSpecContent = ''
      if (useToolSpec) {
        const specPath = path.join(DOCS_ROOT, 'specs', `${tool}.md`)
        if (fs.existsSync(specPath)) {
          toolSpecContent = fs.readFileSync(specPath, 'utf-8')
        }
      }

      const components = useComponents.length
        ? useComponents
        : [
            'metadata',
            'hero',
            'howToUse',
            'modelIntro',
            'features',
            'intro',
            'comparison',
            'scenes',
            'rating',
            'faq',
          ]
      const pageType = slug ? 'L3 page' : 'L2 main page'
      const pageSlug = slug || '(main)'

      const systemPrompt = `You are an SEO content writer for Toolaze (toolaze.com). Your task is to generate a complete SEO JSON file for a tool landing page.

Output ONLY valid JSON. No markdown code fences, no explanation. The JSON must match the structure defined in TRANSLATION_STRUCTURE_GUIDE.md.

Rules:
- Generate ONLY the sections listed in useComponents. Do NOT add any section that is not in the list. Do NOT omit any section that is in the list.
- sectionsOrder must list the section IDs in display order, including scenes and faq when they are in useComponents.
- For comparison: use toolazeFeatures and othersFeatures as comma-separated strings.
- For scenes (Use Cases): REQUIRED when in useComponents. Exactly 3 items. Structure: scenesTitle (string) + scenes (array of {title, icon, desc}). Each item: title, icon (emoji), desc (1-2 sentences).
- For faq: REQUIRED when in useComponents. At least 5 items for L3 pages, at least 5 for L2. Structure: faqTitle (string) + faq (array of {q, a}). Each item: q (question), a (answer).
- For hero.h1: use <span class="text-gradient">...</span> for the tool name only.
- intro.title, features.title, scenesTitle, faqTitle: PLAIN TEXT only. Use semantic titles like "Key Features", "Use Cases", "Frequently Asked Questions". NEVER use CSS classes (e.g. text-4xl, font-extrabold), HTML tags, or Tailwind class names in these fields.
- intro.content: array of {title, text}. Each text should be plain paragraphs. Do NOT put HTML in title or text except for <a href="..."> links.
- features.items: EXACTLY 6 items. Each item must have distinct title and desc. The desc must expand on the title (1-2 sentences), NOT repeat it. Use icon (emoji) and iconType "ai" or similar.
- Processing: Follow the tool spec strictly. Watermark Remover and similar API tools: images are UPLOADED to server. Do NOT say "local processing", "100% private processing", or "processing on your device". Say "no sign-up required", "images not stored permanently", "secure processing" instead.
- Only write features that are explicitly supported in the tool spec.
- Use keywords naturally from the keywords reference.
- All content in English.`

      const userParts = [
        `Generate SEO JSON for: tool="${tool}", page="${pageSlug}" (${pageType}).`,
        `Sections to generate (ONLY these, no others): ${components.join(', ')}.`,
      ]
      if (coreKeyword) {
        userParts.push(`\n--- Core Keyword (P0 - HIGHEST PRIORITY) ---\nThe user specified this as the PRIMARY keyword: "${coreKeyword}". It OVERRIDES primaryKeywords from the keywords file. You MUST use it in metadata.title, metadata.description, hero.h1, hero.desc, and naturally throughout the content. The keywords reference below is supplementary for long-tail planning only.`)
      }
      if (keywordsContent) {
        userParts.push(`\n--- Keywords Reference (search volume table) ---\n${keywordsContent.slice(0, 8000)}`)
      }
      if (seoRulesContent) {
        userParts.push(`\n--- SEO Rules (follow these) ---\n${seoRulesContent.slice(0, 12000)}`)
      }
      if (toolSpecContent) {
        userParts.push(`\n--- Tool Spec (only write supported features) ---\n${toolSpecContent}`)
      }

      const apiUrl = process.env.ZHEN_AI_FLUX_BASE_URL || 'https://ai.t8star.cn'
      const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash'
      const reqBody = {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userParts.join('\n') },
        ],
        temperature: 0.5,
        max_tokens: 8000,
        response_format: { type: 'json_object' },
      }
      const chatUrl = `${apiUrl.replace(/\/$/, '')}/v1/chat/completions`
      let resBody = await fetch(chatUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(reqBody),
      })
      const rawText = await resBody.text()
      let resJson
      try {
        resJson = JSON.parse(rawText)
      } catch (_) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
          error: `API 返回 ${resBody.status} ${resBody.statusText}`,
          hint: resBody.status === 404
            ? '该 Base URL 可能不支持 chat。请检查 ZHEN_AI_FLUX_BASE_URL，或尝试 gpt-best 等支持 chat 的平台 Base URL。'
            : resBody.status === 401
            ? 'API Key 无效，请检查 ZHEN_AI_API_KEY'
            : rawText ? `响应: ${rawText.slice(0, 300)}` : null,
        }))
        return
      }
      if (resJson.error && /response_format|json_object/i.test(resJson.error.message || '')) {
        delete reqBody.response_format
        resBody = await fetch(chatUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(reqBody),
        })
        const retryText = await resBody.text()
        try {
          resJson = JSON.parse(retryText)
        } catch {
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: `重试返回 ${resBody.status}`, hint: retryText.slice(0, 200) }))
          return
        }
      }
      const json = resJson
      if (json.error) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
          error: json.error.message || JSON.stringify(json.error),
          hint: resBody.status === 404
            ? '该 Base URL 可能不支持 chat。请检查 ZHEN_AI_FLUX_BASE_URL。'
            : resBody.status === 401
            ? 'API Key 无效，请检查 ZHEN_AI_API_KEY'
            : null,
        }))
        return
      }
      if (resBody.status !== 200) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
          error: `API 返回 ${resBody.status}`,
          hint: resBody.status === 404 ? 'Base URL 可能不支持 chat，请尝试其他平台（如 gpt-best）' : null,
        }))
        return
      }
      let content = json.choices?.[0]?.message?.content
      if (!content) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'No content in API response' }))
        return
      }
      content = content.replace(/^```(?:json)?\s*|\s*```$/g, '').trim()
      let parsed
      try {
        parsed = JSON.parse(content)
      } catch (parseErr) {
        console.error('[generate] JSON parse error:', parseErr.message)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
          error: 'AI 返回内容无法解析为 JSON',
          hint: parseErr.message + (content ? `\n前 200 字符: ${content.slice(0, 200)}` : ''),
        }))
        return
      }
      if (topComponent) parsed.topComponent = topComponent
      let report = { markdown: '（报告生成失败）', used: [], links: [], wordCount: 0 }
      try {
        report = generateSeoReport(parsed, tool, slug, keywordsContent)
      } catch (reportErr) {
        console.error('[generate] Report error:', reportErr)
      }
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: true, data: parsed, report }))
    } catch (e) {
      console.error('[generate] Error:', e)
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: e.message, stack: process.env.NODE_ENV === 'development' ? e.stack : undefined }))
    }
    return
  }

  const SECTION_RULE_FILES = {
    metadata: 'metadata.md', hero: 'hero.md', howToUse: 'how-to-use.md',
    modelIntro: 'model-intro.md', features: 'features.md', intro: 'intro.md',
    comparison: 'comparison.md', scenes: 'scenarios.md', rating: 'rating.md',
    faq: 'faq.md', trustBar: 'hero.md', moreTools: 'more-tools.md',
  }

  const VIDEO_MODEL_L2S = ['seedance-2', 'kling-3']
  const IMAGE_MODEL_L2S = ['nano-banana-pro', 'nano-banana-2']
  const SEEDANCE_2_SLUGS = ['text-to-video', 'image-to-video', 'ai-video-generator']

  function loadJsonSafe(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      }
    } catch {}
    return null
  }

  function extractSimpleTitle(h1) {
    if (!h1) return ''
    return String(h1).replace(/<[^>]+>/g, '').trim()
  }

  async function getRecommendedToolsForMoreTools(tool, slug) {
    const locale = 'en'
    const links = []
    if (VIDEO_MODEL_L2S.includes(tool)) {
      const others = VIDEO_MODEL_L2S.filter((t) => t !== tool)
      for (const modelTool of others.slice(0, 3)) {
        const fp = modelTool === 'seedance-2' ? path.join(DATA_ROOT, locale, 'seedance-2.json') : path.join(DATA_ROOT, locale, `${modelTool}.json`)
        const d = loadJsonSafe(fp)
        const href = `/model/${modelTool}`
        links.push({
          slug: modelTool,
          title: d?.hero?.h1 ? extractSimpleTitle(d.hero.h1) : modelTool,
          description: (d?.hero?.desc || d?.metadata?.description || '').slice(0, 120),
          href,
        })
      }
    } else if (IMAGE_MODEL_L2S.includes(tool)) {
      const others = IMAGE_MODEL_L2S.filter((t) => t !== tool)
      for (const modelTool of others.slice(0, 3)) {
        const fp = path.join(DATA_ROOT, locale, `${modelTool}.json`)
        const d = loadJsonSafe(fp)
        const href = `/model/${modelTool}`
        links.push({
          slug: modelTool,
          title: d?.hero?.h1 ? extractSimpleTitle(d.hero.h1) : modelTool,
          description: (d?.hero?.desc || d?.metadata?.description || '').slice(0, 120),
          href,
        })
      }
    } else if (tool === 'watermark-remover') {
      for (const t of ['image-compressor', 'image-converter']) {
        const fp = path.join(DATA_ROOT, locale, `${t}.json`)
        const d = loadJsonSafe(fp)
        links.push({
          slug: t,
          title: d?.hero?.h1 ? extractSimpleTitle(d.hero.h1) : t,
          description: (d?.hero?.desc || d?.metadata?.description || '').slice(0, 120),
          href: `/${t}`,
        })
      }
      const howToFp = path.join(DATA_ROOT, locale, 'watermark-remover', 'how-to-remove-watermark.json')
      const howToD = loadJsonSafe(howToFp)
      if (howToD) {
        links.push({
          slug: 'how-to-remove-watermark',
          title: howToD.hero?.h1 ? extractSimpleTitle(howToD.hero.h1) : 'How to Remove Watermark',
          description: (howToD.hero?.desc || howToD.metadata?.description || '').slice(0, 120),
          href: '/watermark-remover/how-to-remove-watermark',
        })
      }
    } else {
      let slugs = []
      if (tool === 'seedance-2' && slug) {
        slugs = SEEDANCE_2_SLUGS.filter((s) => s !== slug).slice(0, 3)
      } else if (tool === 'image-compressor' || tool === 'image-compression') {
        const fp = path.join(DATA_ROOT, locale, 'image-compression.json')
        const d = loadJsonSafe(fp)
        slugs = d && typeof d === 'object' ? Object.keys(d).filter((k) => d[k] && typeof d[k] === 'object' && d[k].metadata?.published !== false).slice(0, 3) : []
      } else if (tool === 'image-converter' || tool === 'image-conversion') {
        const dir = path.join(DATA_ROOT, locale, 'image-converter')
        if (fs.existsSync(dir)) {
          slugs = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', '')).filter((s) => s !== slug).slice(0, 3)
        }
      } else if (tool === 'font-generator') {
        const dir = path.join(DATA_ROOT, locale, 'font-generator')
        if (fs.existsSync(dir)) {
          slugs = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', '')).filter((s) => s !== slug).slice(0, 3)
        }
      } else if (tool === 'watermark-remover' && slug) {
        const dir = path.join(DATA_ROOT, locale, 'watermark-remover')
        if (fs.existsSync(dir)) {
          slugs = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', '')).filter((s) => s !== slug).slice(0, 3)
        }
      } else if (tool === 'emoji-copy-and-paste') {
        const dir = path.join(DATA_ROOT, locale, 'emoji-copy-and-paste')
        if (fs.existsSync(dir)) {
          slugs = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', '')).filter((s) => s !== slug).slice(0, 3)
        }
      }
      const toolBase = ['seedance-2', 'kling-3'].includes(tool) ? `model/${tool}` : (tool === 'image-compression' ? 'image-compressor' : tool)
      for (const s of slugs) {
        let d = null
        if (tool === 'image-compressor' || tool === 'image-compression') {
          const compData = loadJsonSafe(path.join(DATA_ROOT, locale, 'image-compression.json'))
          d = compData?.[s]
        } else {
          d = loadJsonSafe(path.join(DATA_ROOT, locale, tool, `${s}.json`))
        }
        const href = `/${toolBase}/${s}`
        links.push({
          slug: s,
          title: d?.hero?.h1 ? extractSimpleTitle(d.hero.h1) : d?.metadata?.title || s,
          description: (d?.hero?.desc || d?.metadata?.description || '').slice(0, 120),
          href,
        })
      }
    }
    return links.filter((l) => l.title && l.href)
  }

  if (pathname === '/api/layout-strategy' && req.method === 'POST') {
    let body = ''
    for await (const chunk of req) body += chunk
    try {
      const payload = JSON.parse(body || '{}')
      const { keywordsCsv, competitorUrls = [], targetTool } = payload
      if (!keywordsCsv || typeof keywordsCsv !== 'string') {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'keywordsCsv is required' }))
        return
      }
      const apiKey = process.env.ZHEN_AI_API_KEY
      if (!apiKey) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'ZHEN_AI_API_KEY not configured' }))
        return
      }

      // Parse CSV: support keyword, searchVolume, difficulty, etc.
      const parseCsv = (text) => {
        const lines = text.trim().split(/\r?\n/).filter(Boolean)
        if (lines.length < 2) return []
        const header = lines[0].toLowerCase().split(/[,\t]/).map((h) => h.trim())
        const kwIdx = Math.max(0, header.findIndex((h) => /keyword|词|关键词/i.test(h)))
        const volIdx = header.findIndex((h) => /volume|搜索量|search/i.test(h))
        const diffIdx = header.findIndex((h) => /difficulty|难度/i.test(h))
        const rows = []
        for (let i = 1; i < lines.length; i++) {
          const cells = lines[i].split(/[,\t]/).map((c) => c.trim())
          const keyword = cells[kwIdx] || cells[0]
          if (!keyword) continue
          rows.push({
            keyword,
            searchVolume: volIdx >= 0 && cells[volIdx] ? parseInt(cells[volIdx], 10) || 0 : 0,
            difficulty: diffIdx >= 0 && cells[diffIdx] ? parseInt(cells[diffIdx], 10) || 0 : 0,
          })
        }
        return rows
      }
      const keywords = parseCsv(keywordsCsv)
      if (keywords.length === 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'CSV 解析后无有效关键词，请检查格式（需含 keyword 列）' }))
        return
      }

      // Optionally fetch competitor pages and extract link structure
      let competitorData = ''
      const urls = Array.isArray(competitorUrls) ? competitorUrls.filter((u) => typeof u === 'string' && u.startsWith('http')) : []
      for (const url of urls.slice(0, 5)) {
        try {
          const resp = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ToolazeSEO/1.0)' },
            signal: AbortSignal.timeout(8000),
          })
          const html = await resp.text()
          const links = []
          const hrefRe = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([^<]*)</gi
          let m
          while ((m = hrefRe.exec(html)) !== null) {
            const href = m[1].trim()
            const text = (m[2] || '').replace(/<[^>]+>/g, '').trim()
            if (href.startsWith('/') && href.length > 1 && text.length > 0 && text.length < 80) {
              links.push({ path: href, text })
            }
          }
          const unique = [...new Map(links.map((l) => [l.path, l])).values()].slice(0, 50)
          competitorData += `\n竞品 ${url} 内链示例:\n${unique.map((l) => `  ${l.path} - ${l.text}`).join('\n')}\n`
        } catch (fetchErr) {
          competitorData += `\n竞品 ${url} 抓取失败: ${fetchErr.message}\n`
        }
      }

      const targetHint = targetTool ? `\n用户指定目标工具: ${targetTool}。L3 推荐优先考虑该工具下的子页面。` : ''
      const systemPrompt = `You are an SEO strategist for Toolaze (toolaze.com). Given a keyword list (CSV), recommend L2 and L3 page structure for SEO landing pages.

L2 = tool main page (e.g. /image-converter, /nano-banana-pro). One tool = one L2.
L3 = tool sub-page (e.g. /image-converter/heic-to-jpg, /nano-banana-pro/image-to-image). Each L3 targets a specific long-tail keyword.

Output valid JSON only. No markdown fences. Structure:
{
  "l2Recommendations": [
    { "tool": "slug-style-id", "reason": "详细理由", "keywordVolume": 0, "keywords": ["keyword1", "keyword2"], "competitorRef": "竞品参考（如有）" }
  ],
  "l3Recommendations": [
    { "tool": "existing-or-new-tool", "slug": "url-slug", "reason": "详细理由", "keywordVolume": 0, "keywords": ["keyword1"], "coreKeyword": "主关键词" }
  ]
}

Rules:
- tool/slug: lowercase, hyphens only. No spaces.
- Recommend 2-6 L2 and 5-15 L3 based on keyword potential.
- keywordVolume: sum or estimate from provided data.
- reason: 1-2 sentences in Chinese, explain why this page is valuable.
- If competitor data provided, reference it in competitorRef.
- Prioritize high search volume keywords for L2; long-tail for L3.`

      const userParts = [
        `关键词列表（${keywords.length} 条）:\n${keywords.slice(0, 100).map((k) => `${k.keyword}\t${k.searchVolume || 0}\t${k.difficulty || 0}`).join('\n')}`,
        competitorData ? `\n--- 竞品内链结构 ---${competitorData}` : '',
        targetHint,
        `\n请输出 JSON，包含 l2Recommendations 和 l3Recommendations。`,
      ]

      const apiUrl = process.env.ZHEN_AI_FLUX_BASE_URL || 'https://ai.t8star.cn'
      const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash'
      const chatUrl = `${apiUrl.replace(/\/$/, '')}/v1/chat/completions`
      const reqBody = {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userParts.join('\n') },
        ],
        temperature: 0.4,
        max_tokens: 4000,
        response_format: { type: 'json_object' },
      }
      let resBody
      try {
        resBody = await fetch(chatUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify(reqBody),
        })
      } catch (fetchErr) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: `AI 请求失败: ${fetchErr.message}` }))
        return
      }
      const rawText = await resBody.text()
      let resJson
      try {
        resJson = JSON.parse(rawText)
      } catch (_) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'API 返回非 JSON', hint: rawText.slice(0, 300) }))
        return
      }
      if (resJson.error) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: resJson.error.message || 'API error' }))
        return
      }
      let content = resJson.choices?.[0]?.message?.content
      if (!content) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'No content in response' }))
        return
      }
      content = content.replace(/^```(?:json)?\s*|\s*```$/g, '').trim()
      let parsed
      try {
        parsed = JSON.parse(content)
      } catch (parseErr) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'AI 返回 JSON 解析失败', hint: parseErr.message }))
        return
      }
      const l2 = Array.isArray(parsed.l2Recommendations) ? parsed.l2Recommendations : []
      const l3 = Array.isArray(parsed.l3Recommendations) ? parsed.l3Recommendations : []
      for (const r of l2) {
        r.type = 'l2'
        r.tool = (r.tool || '').replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'new-tool'
        r.url = '/' + r.tool
      }
      for (const r of l3) {
        r.type = 'l3'
        r.tool = (r.tool || '').replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'nano-banana-pro'
        r.slug = (r.slug || '').replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'page'
        r.url = '/' + r.tool + '/' + r.slug
      }
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({
        ok: true,
        recommendations: [...l2, ...l3],
        keywordCount: keywords.length,
      }))
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: e.message }))
    }
    return
  }

  if (pathname === '/api/more-tools-preview' && req.method === 'GET') {
    const { tool, slug } = parseQuery(url)
    if (!tool) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'tool is required' }))
      return
    }
    try {
      const links = await getRecommendedToolsForMoreTools(tool, slug || '')
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: true, links }))
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: e.message }))
    }
    return
  }

  if (pathname === '/api/generate-section' && req.method === 'POST') {
    let body = ''
    for await (const chunk of req) body += chunk
    try {
      const payload = JSON.parse(body || '{}')
      const { tool, slug, sectionId, extraInstructions, currentSectionData } = payload
      if (!tool || !sectionId) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'tool and sectionId are required' }))
        return
      }
      const apiKey = process.env.ZHEN_AI_API_KEY
      if (!apiKey) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'ZHEN_AI_API_KEY not configured' }))
        return
      }
      const ruleFile = SECTION_RULE_FILES[sectionId] || `${sectionId}.md`
      const rulePath = path.join(DOCS_ROOT, 'sections', ruleFile)
      let sectionRules = ''
      if (fs.existsSync(rulePath)) {
        sectionRules = fs.readFileSync(rulePath, 'utf-8')
      }
      const globalPath = path.join(DOCS_ROOT, 'sections', '00_global.md')
      if (fs.existsSync(globalPath)) {
        sectionRules = fs.readFileSync(globalPath, 'utf-8') + '\n\n---\n\n' + sectionRules
      }
      let toolSpec = ''
      const specPath = path.join(DOCS_ROOT, 'specs', `${tool}.md`)
      if (fs.existsSync(specPath)) {
        toolSpec = fs.readFileSync(specPath, 'utf-8')
      }
      let keywordsHint = ''
      const kwPath = path.join(DOCS_ROOT, 'keywords', `${tool}-keywords.json`)
      if (fs.existsSync(kwPath)) {
        try {
          const kwData = JSON.parse(fs.readFileSync(kwPath, 'utf-8'))
          const kwList = []
          for (const arr of [kwData.primaryKeywords, kwData.longTailKeywords, kwData.relatedKeywords]) {
            if (Array.isArray(arr)) {
              for (const k of arr) {
                const kw = typeof k === 'string' ? k : (k.keyword || '')
                if (kw) kwList.push(kw)
              }
            }
          }
          if (kwList.length > 0) {
            keywordsHint = `\nKeywords to use naturally (prioritize primary/long-tail):\n${[...new Set(kwList)].slice(0, 25).join(', ')}`
          }
        } catch {}
      }
      const pageType = slug ? 'L3' : 'L2'
      const outputHints = {
        metadata: 'Output: { "title": "...", "description": "...", "h1": "..." }',
        faq: 'Output: { "faqTitle": "...", "faq": [{ "q": "Question?", "a": "Answer." }] }',
        scenes: 'Output: { "scenesTitle": "...", "scenes": [{ "title": "...", "icon": "📷", "desc": "..." }] } - exactly 3 scenes',
        moreTools: 'Output: { "moreTools": "More [Tool Name] Tools" } - section title only. Links are auto-filled from recommended tools.',
      }
      const structureHint = outputHints[sectionId] ? `\nExpected structure: ${outputHints[sectionId]}` : ''
      const systemPrompt = `You are an SEO content writer for Toolaze. Generate ONLY the "${sectionId}" section as valid JSON.

Rules (follow strictly):
${sectionRules}

Tool spec (only write supported features):
${toolSpec}
${keywordsHint}
${structureHint}

Output ONLY valid JSON for this section. No markdown fences, no explanation. Match the exact structure expected for ${sectionId}.`

      const userParts = [
        `Regenerate the "${sectionId}" section for tool="${tool}", page="${slug || '(main)'}" (${pageType}).`,
        `Current section data (for reference, improve or replace):\n${JSON.stringify(currentSectionData || {}, null, 2)}`,
      ]
      if (extraInstructions) {
        userParts.push(`\nAdditional instructions (apply to this generation only):\n${extraInstructions}`)
      }

      const apiUrl = process.env.ZHEN_AI_FLUX_BASE_URL || 'https://ai.t8star.cn'
      const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash'
      const chatUrl = `${apiUrl.replace(/\/$/, '')}/v1/chat/completions`
      const reqBody = {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userParts.join('\n') },
        ],
        temperature: 0.5,
        max_tokens: 4000,
        response_format: { type: 'json_object' },
      }
      let resBody
      try {
        resBody = await fetch(chatUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify(reqBody),
        })
      } catch (fetchErr) {
        const msg = fetchErr?.message || 'fetch failed'
        const isNetwork = /fetch failed|Failed to fetch|ECONNREFUSED|ENOTFOUND|ETIMEDOUT|network/i.test(msg)
        const hint = isNetwork
          ? `请检查：1) 网络连接是否正常 2) ZHEN_AI_FLUX_BASE_URL 是否可访问（当前: ${apiUrl}） 3) 若在国内，可能需要代理`
          : undefined
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: `AI API 请求失败: ${msg}`, hint }))
        return
      }
      const rawText = await resBody.text()
      let resJson
      try {
        resJson = JSON.parse(rawText)
      } catch (_) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'API parse error', hint: rawText.slice(0, 200) }))
        return
      }
      if (resJson.error) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: resJson.error.message || 'API error' }))
        return
      }
      let content = resJson.choices?.[0]?.message?.content
      if (!content) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'No content in response' }))
        return
      }
      content = content.replace(/^```(?:json)?\s*|\s*```$/g, '').trim()
      const parsed = JSON.parse(content)
      if (sectionId === 'moreTools') {
        const recommendedLinks = await getRecommendedToolsForMoreTools(tool, slug || '')
        parsed.moreToolsLinks = recommendedLinks
      }
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: true, data: parsed }))
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: e.message }))
    }
    return
  }

  if (pathname === '/api/seo' && req.method === 'GET') {
    const { tool, slug, locale } = params
    if (!tool) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'tool is required' }))
      return
    }
    try {
      const filePath = getFilePath(tool, slug || null, locale || 'en')
      const content = fs.readFileSync(filePath, 'utf-8')
      const data = JSON.parse(content)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(data))
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: e.message }))
    }
    return
  }

  if (pathname === '/api/seo' && req.method === 'DELETE') {
    const { tool, slug, locale } = params
    if (!tool) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'tool is required' }))
      return
    }
    if (!slug) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'slug is required for delete (cannot delete L2 main page)' }))
      return
    }
    try {
      const filePath = getFilePath(tool, slug, locale || 'en')
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: true, deleted: slug }))
      } else {
        // 幂等：文件已不存在时也返回成功
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: true, deleted: slug, alreadyGone: true }))
      }
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: e.message }))
    }
    return
  }

  if (pathname === '/api/seo' && req.method === 'PUT') {
    let body = ''
    for await (const chunk of req) body += chunk
    try {
      const { tool, slug, locale, data, rebuild } = JSON.parse(body)
      if (!tool || data === undefined) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'tool and data are required' }))
        return
      }
      const filePath = getFilePath(tool, slug || null, locale || 'en')
      fs.mkdirSync(path.dirname(filePath), { recursive: true })
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
      let rebuildStatus = null
      if (rebuild) {
        const proc = spawn('npm', ['run', 'build'], { cwd: ROOT, stdio: 'ignore', shell: true })
        proc.on('close', (code) => {
          console.log(`[admin] Build finished with code ${code}`)
        })
        rebuildStatus = { building: true, hint: '构建已在后台启动，完成后部署 out/ 目录即可' }
      }
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: true, filePath, ...rebuildStatus }))
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: e.message }))
    }
    return
  }

  if (pathname === '/' || pathname === '/admin' || pathname.startsWith('/admin')) {
    const htmlPath = path.join(__dirname, 'admin-seo.html')
    const html = fs.readFileSync(htmlPath, 'utf-8')
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(html)
    return
  }

  console.warn('[404]', req.method, pathname, url.slice(0, 80))
  res.writeHead(404)
  res.end('Not Found')
})

server.listen(PORT, () => {
  console.log(`\n📋 SEO 管理后台: http://localhost:${PORT}`)
  console.log(`   测试 API: http://localhost:${PORT}/api/test-gemini\n`)
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ 端口 ${PORT} 已被占用。请先停止旧进程：`)
    console.error(`   pkill -f admin-seo-server`)
    console.error(`   或在该终端按 Ctrl+C 停止后重新运行 npm run admin:seo\n`)
  } else {
    throw err
  }
})
