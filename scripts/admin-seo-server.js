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
    if (kw.primaryKeywords) keywords = keywords.concat(kw.primaryKeywords.map((k) => ({ ...k, type: 'primary' })))
    if (kw.longTailKeywords) keywords = keywords.concat(kw.longTailKeywords.map((k) => ({ ...k, type: 'long-tail' })))
    if (kw.relatedKeywords) keywords = keywords.concat(kw.relatedKeywords.map((k) => ({ ...k, type: 'related' })))
  }

  const used = []
  for (const kwi of keywords) {
    const k = (kwi.keyword || kwi).toLowerCase()
    if (!k) continue
    const regex = new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    const count = (fullText.match(regex) || []).length
    if (count > 0) {
      const sectionLabels = []
      for (const [, info] of Object.entries(bySection)) {
        const txt = info?.text || ''
        if (txt && (txt.match(regex) || []).length > 0) sectionLabels.push(info.label || '')
      }
      used.push({
        keyword: kwi.keyword || kwi,
        searchVolume: kwi.searchVolume || 0,
        difficulty: kwi.difficulty || 0,
        type: kwi.type || 'unknown',
        count,
        density: wordCount ? ((count / wordCount) * 100).toFixed(2) + '%' : '0%',
        sections: sectionLabels.join(', '),
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
    const file = params.file
    const tool = params.tool
    const allowed = ['SEO_CONTENT_GUIDELINES.md', 'SEO_MASTER_LAYOUT.md', 'TRANSLATION_STRUCTURE_GUIDE.md']
    let relPath = ''
    if (allowed.includes(file)) {
      relPath = file
    } else if (file === 'tool' && tool && /^[a-z0-9-]+$/.test(tool)) {
      relPath = `specs/${tool}.md`
    } else if (file && /^[a-z0-9-]+\.md$/.test(file)) {
      relPath = `specs/${file}`
    }
    if (!relPath) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Invalid file' }))
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
      const payload = JSON.parse(body || '{}')
      const {
        tool,
        slug,
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
      if (useSeoContentGuidelines) seoRuleFiles.push('SEO_CONTENT_GUIDELINES.md')
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
      if (keywordsContent) {
        userParts.push(`\n--- Keywords Reference ---\n${keywordsContent.slice(0, 8000)}`)
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
      const parsed = JSON.parse(content)
      const report = generateSeoReport(parsed, tool, slug, keywordsContent)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: true, data: parsed, report }))
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
