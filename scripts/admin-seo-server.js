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

const PORT = Number.parseInt(process.env.PORT || '3007', 10) || 3007
const ROOT = path.join(__dirname, '..')
const DATA_ROOT = path.join(ROOT, 'src', 'data')
const DOCS_ROOT = path.join(ROOT, 'docs')

// 加载 .env.local（与 `node --env-file=.env.local` 对齐：文件内定义覆盖当前进程已有同名变量，
// 避免「终端探测用 --env-file 成功、长期运行的 admin 进程仍用旧/空 shell 里的 KIE_*」）
function loadEnvLocal() {
  const envPath = path.join(ROOT, '.env.local')
  try {
    let content = fs.readFileSync(envPath, 'utf-8')
    if (content.charCodeAt(0) === 0xfeff) content = content.slice(1)
    for (let line of content.split('\n')) {
      line = line.replace(/^\s*export\s+/i, '')
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
      if (m) {
        const val = m[2].replace(/^["']|["']$/g, '').trim()
        process.env[m[1]] = val
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

/** 虚拟工具：编辑各语言 common.json 中的 home（与 [locale] 首页一致） */
const HOMEPAGE_TOOL_ID = 'homepage'

function getCommonJsonPath(locale) {
  return path.join(DATA_ROOT, locale || 'en', 'common.json')
}

function readCommonJson(locale) {
  const p = getCommonJsonPath(locale)
  const raw = fs.readFileSync(p, 'utf-8')
  return JSON.parse(raw)
}

function writeCommonJson(locale, obj) {
  const p = getCommonJsonPath(locale)
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(obj, null, 2), 'utf-8')
}

function isHomepageSeoTool(tool) {
  return tool === HOMEPAGE_TOOL_ID
}

/** 与站点 src/lib/seo-loader 一致的翻译目标语言（不含仅作源的 en） */
const TRANSLATION_TARGET_LOCALES = ['de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

const LOCALE_LANGUAGE_NAMES = {
  de: 'German',
  ja: 'Japanese',
  es: 'Spanish',
  'zh-TW': 'Traditional Chinese (Taiwan)',
  pt: 'Portuguese',
  fr: 'French',
  ko: 'Korean',
  it: 'Italian',
}

/** 与 generateHreflangAlternates 一致：非英语站内路径带 /{locale} 前缀（英语无前缀） */
const SITE_LOCALES_FOR_URL = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

/**
 * 允许加 locale 前缀的路径首段（存在 src/app/[locale]/... 对应路由或与 slug 页一致）
 * 不在列表内的路径（如 /ai-tools）保持英文站根路径不变，避免 404
 */
const LOCALIZED_PATH_FIRST_SEGMENTS = new Set([
  'about',
  'privacy',
  'terms',
  'ai-tools',
  'image-compressor',
  'image-converter',
  'font-generator',
  'emoji-copy-and-paste',
  'kling-3',
  'seedance-2',
  'watermark-remover',
  'photo-restoration',
  'ai-couple-photo-maker',
])

function splitPathQueryHash(raw) {
  let path = raw
  let hash = ''
  const hi = path.indexOf('#')
  if (hi >= 0) {
    hash = path.slice(hi)
    path = path.slice(0, hi)
  }
  let query = ''
  const qi = path.indexOf('?')
  if (qi >= 0) {
    query = path.slice(qi)
    path = path.slice(0, qi)
  }
  return { path, query, hash }
}

/**
 * 将站内相对路径规范为当前翻译语言下的 URL（对齐 hreflang：非 en 为 /{locale}/path）
 */
function localizeInternalPath(pathOnly, targetLocale) {
  const { path, query, hash } = splitPathQueryHash(pathOnly)
  if (!path.startsWith('/') || path.startsWith('//')) return pathOnly

  let segments = path.replace(/^\/+/, '').split('/').filter(Boolean)

  if (segments.length && SITE_LOCALES_FOR_URL.includes(segments[0])) {
    segments = segments.slice(1)
  }

  if (segments[0] === 'model' && segments[1] === 'seedance-2') {
    segments = ['seedance-2', ...segments.slice(2)]
  }

  if (segments.length === 0) {
    return `/${targetLocale}${query}${hash}`
  }

  const first = segments[0]
  if (!LOCALIZED_PATH_FIRST_SEGMENTS.has(first)) {
    return pathOnly
  }

  const tail = segments.join('/')
  return `/${targetLocale}/${tail}${query}${hash}`
}

/** 递归处理 SEO JSON 中的相对站内 href（与 generateHreflangAlternates 一致） */
function rewriteLocaleUrlsInString(str, targetLocale) {
  if (typeof str !== 'string' || !str.includes('href=')) return str

  return str.replace(/href="([^"]*)"/gi, (_, rawPath) => {
    const t = rawPath.trim()
    if (!t.startsWith('/') || t.startsWith('//')) return `href="${rawPath}"`
    return `href="${localizeInternalPath(t, targetLocale)}"`
  })
}

function rewriteLocaleUrlsInJson(obj, targetLocale) {
  if (obj === null || obj === undefined) return obj
  if (typeof obj === 'string') return rewriteLocaleUrlsInString(obj, targetLocale)
  if (Array.isArray(obj)) return obj.map((x) => rewriteLocaleUrlsInJson(x, targetLocale))
  if (typeof obj === 'object') {
    const out = {}
    for (const k of Object.keys(obj)) {
      let v = rewriteLocaleUrlsInJson(obj[k], targetLocale)
      if (k === 'href' && typeof v === 'string' && v.startsWith('/') && !v.startsWith('//')) {
        v = localizeInternalPath(v, targetLocale)
      }
      out[k] = v
    }
    return out
  }
  return obj
}

function stableJson(value) {
  if (value === null || value === undefined) return JSON.stringify(value)
  if (typeof value !== 'object') return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map((v) => stableJson(v)).join(',')}]`
  const keys = Object.keys(value).sort()
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableJson(value[k])}`).join(',')}}`
}

function isSameContentAndStructure(a, b) {
  return stableJson(a) === stableJson(b)
}

/** 将叶子值规范为占位，仅用于对比 JSON 结构（键、数组长度、嵌套）是否一致 */
function structureOnly(obj) {
  if (obj === null) return null
  if (Array.isArray(obj)) return obj.map(structureOnly)
  if (typeof obj !== 'object') {
    if (typeof obj === 'string') return ''
    if (typeof obj === 'number') return 0
    if (typeof obj === 'boolean') return false
    return null
  }
  const out = {}
  for (const k of Object.keys(obj).sort()) {
    out[k] = structureOnly(obj[k])
  }
  return out
}

function sameJsonStructure(a, b) {
  try {
    return stableJson(structureOnly(a)) === stableJson(structureOnly(b))
  } catch {
    return false
  }
}

/** 从模型回复中提取第一个平衡的 {...}（忽略前文说明与 markdown 围栏） */
function extractBalancedJsonObject(text) {
  if (!text || typeof text !== 'string') return null
  const start = text.indexOf('{')
  if (start < 0) return null
  let depth = 0
  let inString = false
  let escape = false
  for (let i = start; i < text.length; i++) {
    const c = text[i]
    if (escape) {
      escape = false
      continue
    }
    if (inString) {
      if (c === '\\') escape = true
      else if (c === '"') inString = false
      continue
    }
    if (c === '"') {
      inString = true
      continue
    }
    if (c === '{') depth++
    else if (c === '}') {
      depth--
      if (depth === 0) return text.slice(start, i + 1)
    }
  }
  return null
}

function extractJsonObjectFromLlmText(raw) {
  if (raw == null || typeof raw !== 'string') return ''
  let s = raw.trim()
  if (s.charCodeAt(0) === 0xfeff) s = s.slice(1)
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fence) {
    const inner = fence[1].trim()
    const fromFence = extractBalancedJsonObject(inner) || (inner.startsWith('{') ? inner : null)
    if (fromFence) return fromFence
  }
  const balanced = extractBalancedJsonObject(s)
  if (balanced) return balanced
  return s.trim()
}

function getKieApiKey() {
  return (process.env.KIE_AI_API_KEY || process.env.ZHEN_AI_API_KEY || '').trim()
}

function getKieApiBase() {
  return (process.env.KIE_API_BASE_URL || 'https://api.kie.ai').replace(/\/$/, '')
}

/**
 * KIE 文档：POST `/{slug}/v1/chat/completions`（如 gemini-3-flash、gemini-2.5-flash）
 * @see https://docs.kie.ai/market/gemini/gemini-3-flash
 */
function getKieGeminiChatSlug() {
  const fromEnv = (process.env.KIE_GEMINI_CHAT_SLUG || '').trim().replace(/^\/+|\/+$/g, '')
  if (fromEnv) return fromEnv
  const model = (process.env.KIE_GEMINI_MODEL || 'gemini-3-flash').trim().toLowerCase()
  if (model.includes('2.5')) return 'gemini-2.5-flash'
  if (model.includes('3-flash') || model.includes('gemini-3')) return 'gemini-3-flash'
  return 'gemini-3-flash'
}

function getKieGeminiChatCompletionsUrl() {
  return `${getKieApiBase()}/${getKieGeminiChatSlug()}/v1/chat/completions`
}

/** Gemini 3 Flash 文档默认 stream=true；翻译需 JSON 一次性返回，显式关流式并压低 thoughts 体积 */
function kieGemini3TranslateBodyExtras() {
  if (!/\/gemini-3-flash\//i.test(getKieGeminiChatCompletionsUrl())) return {}
  const out = { stream: false }
  if (process.env.KIE_GEMINI_INCLUDE_THOUGHTS === '1') out.include_thoughts = true
  else out.include_thoughts = false
  const effort = (process.env.KIE_GEMINI_REASONING_EFFORT || 'low').trim().toLowerCase()
  if (effort === 'high' || effort === 'low') out.reasoning_effort = effort
  return out
}

function getKieTranslateApiLabel() {
  const slug = getKieGeminiChatSlug()
  const model = (process.env.KIE_GEMINI_MODEL || 'gemini-3-flash').trim()
  return `kie.ai /${slug}/ (${model})`
}

async function fetchKieChatOnce(bodyObj, timeoutMs) {
  const apiKey = getKieApiKey()
  if (!apiKey) throw new Error('未配置 KIE_AI_API_KEY 或 ZHEN_AI_API_KEY（kie.ai Bearer Token）')
  const chatUrl = getKieGeminiChatCompletionsUrl()

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(chatUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(bodyObj),
      signal: controller.signal,
    })
    const rawText = await res.text()
    let resJson
    try {
      resJson = JSON.parse(rawText)
    } catch {
      throw new Error(`KIE API 返回非 JSON: HTTP ${res.status} ${rawText.slice(0, 240)}`)
    }
    return { res, resJson }
  } finally {
    clearTimeout(timer)
  }
}

async function fetchKieChat(bodyObj, timeoutMs = 240000, retries = 3) {
  const apiKey = getKieApiKey()
  if (!apiKey) throw new Error('未配置 KIE_AI_API_KEY 或 ZHEN_AI_API_KEY（kie.ai Bearer Token）')

  let lastErr
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      async function oneShot(body) {
        return fetchKieChatOnce(body, timeoutMs)
      }

      let { res, resJson } = await oneShot(bodyObj)
      if (resJson.error && /response_format|json_object/i.test(String(resJson.error.message || ''))) {
        const retryBody = { ...bodyObj }
        delete retryBody.response_format
        ;({ res, resJson } = await oneShot(retryBody))
      }
      if (!res.ok || resJson.error) {
        const msg = resJson.error?.message || resJson.error || `HTTP ${res.status}`
        throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg))
      }
      // KIE 部分错误以 HTTP 200 + { code, msg } 返回，无 choices（与 OpenAI 兼容体不同）
      const choices = resJson?.choices
      const hasChatChoices = Array.isArray(choices) && choices.length > 0
      // 有 choices 数组但元素为空、或 message 无正文时，仍可能带顶层 code/msg（网关错误）
      const hasNonEmptyChatContent =
        hasChatChoices &&
        (() => {
          try {
            return Boolean(extractChatContentFromResponse(resJson)?.trim?.())
          } catch {
            return false
          }
        })()

      if ((!hasChatChoices || !hasNonEmptyChatContent) && resJson && typeof resJson === 'object') {
        const bizMsg = resJson.msg ?? resJson.message
        const bizCode = resJson.code
        if (bizMsg != null && String(bizMsg).trim() !== '') {
          throw new Error(`KIE API（code=${bizCode ?? 'n/a'}）: ${String(bizMsg).slice(0, 800)}`)
        }
        const codeNum =
          typeof bizCode === 'number'
            ? bizCode
            : typeof bizCode === 'string' && bizCode !== ''
              ? Number.parseInt(bizCode, 10)
              : NaN
        const codeLooksError =
          bizCode != null &&
          bizCode !== '' &&
          !(bizCode === 0 || bizCode === '0' || bizCode === 200 || bizCode === '200') &&
          !(Number.isFinite(codeNum) && codeNum === 0)
        if (codeLooksError) {
          throw new Error(`KIE API 业务错误: code=${bizCode}（无 choices，msg 为空）`)
        }
        // 仍无 choices：可能是未知错误体
        if ('code' in resJson || 'msg' in resJson) {
          throw new Error(
            `KIE API 返回非 Chat 结构（无 choices）: ${JSON.stringify(resJson).slice(0, 600)}`
          )
        }
        if (hasChatChoices && !hasNonEmptyChatContent) {
          throw new Error(
            `KIE API choices 无有效正文: ${JSON.stringify(resJson).slice(0, 800)}`
          )
        }
      }
      return resJson
    } catch (e) {
      lastErr = e
      const msg = e.message || String(e)
      const maintenanceOrOverload =
        /being maintained|try again later|maintenance|temporarily unavailable|overload|capacity|please retry|请稍后|重试/i.test(
          msg
        )
      const retryable =
        /fetch failed|ECONNRESET|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|socket|network|abort|Failed to fetch/i.test(
          msg
        ) ||
        maintenanceOrOverload ||
        /rate limit|too many requests|\b429\b/i.test(msg)
      if (!retryable || attempt === retries - 1) throw e
      const wait = maintenanceOrOverload ? 8000 * (attempt + 1) : 2000 * (attempt + 1)
      console.warn(`[fetchKieChat] 第 ${attempt + 1} 次请求失败: ${msg.slice(0, 160)} — ${wait}ms 后重试`)
      await new Promise((r) => setTimeout(r, wait))
    }
  }
  throw lastErr
}

function extractChatContentFromResponse(json) {
  const choice = json?.choices?.[0]
  const msg = choice?.message
  const c = msg?.content

  if (typeof c === 'string' && c.trim()) return c
  if (Array.isArray(c)) {
    const parts = c
      .map((p) => {
        if (typeof p === 'string') return p
        if (p && typeof p === 'object') return p.text || p.content || ''
        return ''
      })
      .filter(Boolean)
    if (parts.length) return parts.join('\n')
  }
  if (c && typeof c === 'object') {
    const text = c.text || c.content || ''
    if (typeof text === 'string' && text.trim()) return text
  }
  if (typeof choice?.text === 'string' && choice.text.trim()) return choice.text
  return ''
}

/**
 * 使用 KIE Gemini（OpenAI 兼容 Chat）将整页 SEO JSON 译为指定语言
 * @see https://docs.kie.ai/market/gemini/gemini-3-flash
 */
function buildTranslateMessages(sourceObj, targetLocale, extraUserHint = '') {
  const lang = LOCALE_LANGUAGE_NAMES[targetLocale] || targetLocale
  const model = (process.env.KIE_GEMINI_MODEL || 'gemini-3-flash').trim()
  const systemContent =
    `You translate Toolaze SEO JSON for international pages.\n` +
    `CRITICAL: Your entire reply must be ONLY a raw JSON object. ` +
    `Do not write any introduction, explanation, or closing text in any language (e.g. no "Aqui está", no "Here is"). ` +
    `Do not wrap in markdown. Start the first character with { and end with }.\n` +
    `The output MUST have the exact same keys, nesting depth, and array lengths as the input. ` +
    `Translate every human-readable string value into ${lang} (locale: ${targetLocale}). Do not skip or leave long passages in English. ` +
    `Never rename JSON keys. Keep boolean/number/null unchanged. ` +
    `Keep sectionsOrder values exactly as in input (identifiers like howToUse, features). ` +
    `Preserve HTML tags and attributes; translate only visible text. Preserve emoji. ` +
    `Keep href paths like the English source (e.g. /font-generator/cursive); the server will add /{locale}/ where needed. ` +
    `Keep machine identifiers unchanged. Do not add or remove fields.`

  const userContent =
    (extraUserHint ? `${extraUserHint}\n\n` : '') +
    `Translate the following JSON into ${lang}. Output only the JSON object.\n\n${JSON.stringify(sourceObj)}`

  return { model, messages: [{ role: 'system', content: systemContent }, { role: 'user', content: userContent }] }
}

function parseTranslatedJsonFromChatContent(content, contextLabel) {
  if (!content || typeof content !== 'string') {
    throw new Error(`${contextLabel}: API 返回空内容`)
  }
  const extracted = extractJsonObjectFromLlmText(content)
  if (!extracted || !String(extracted).trim().startsWith('{')) {
    throw new Error(
      `${contextLabel}: 无法从模型回复中提取 JSON。前 240 字符: ${String(content).slice(0, 240)}`
    )
  }
  try {
    return JSON.parse(extracted)
  } catch (e) {
    throw new Error(
      `${contextLabel}: 译文无法解析为 JSON: ${e.message}. 提取片段前 200 字符: ${String(extracted).slice(0, 200)}`
    )
  }
}

async function translateSeoJsonWithKieSingle(sourceObj, targetLocale, options = {}) {
  const { useResponseFormat = true, temperature = 0.2, extraUserHint = '' } = options
  const { model, messages } = buildTranslateMessages(sourceObj, targetLocale, extraUserHint)
  const reqBody = {
    model,
    messages,
    temperature,
    max_tokens: Number.parseInt(process.env.KIE_TRANSLATE_MAX_TOKENS || '65536', 10) || 65536,
  }
  if (useResponseFormat) reqBody.response_format = { type: 'json_object' }
  Object.assign(reqBody, kieGemini3TranslateBodyExtras())

  let json = await fetchKieChat(reqBody)
  let content = extractChatContentFromResponse(json)
  let finish = json?.choices?.[0]?.finish_reason || ''

  if (!content) {
    const retryBody = { ...reqBody, temperature: 0.05 }
    json = await fetchKieChat(retryBody)
    content = extractChatContentFromResponse(json)
    finish = json?.choices?.[0]?.finish_reason || finish
  }

  if (!content) {
    const keys = json && typeof json === 'object' ? Object.keys(json).join(', ') : 'n/a'
    let detail = ''
    if (json && typeof json === 'object') {
      const m = json.msg ?? json.message
      if (m != null && String(m).trim() !== '') {
        detail = ` | KIE msg=${String(m).slice(0, 800)} (code=${json.code ?? 'n/a'})`
      } else {
        detail = ` | raw=${JSON.stringify(json).slice(0, 900)}`
      }
    }
    throw new Error(`API 未返回可解析内容（finish_reason=${finish}, response_keys=${keys}）${detail}`)
  }

  const parsed = parseTranslatedJsonFromChatContent(content, targetLocale)
  return { parsed, finish }
}

/** 按顶层 key 分片翻译后合并，避免超长 JSON 截断导致漏译 */
async function translateSeoJsonWithKieChunked(sourceObj, targetLocale) {
  const keys = Object.keys(sourceObj)
  if (keys.length === 0) return {}
  const BATCH = Math.max(1, Number.parseInt(process.env.KIE_TRANSLATE_CHUNK_KEYS || '4', 10) || 4)
  let merged = {}
  for (let i = 0; i < keys.length; i += BATCH) {
    const slice = {}
    for (const k of keys.slice(i, i + BATCH)) slice[k] = sourceObj[k]
    const hint = `This is part ${Math.floor(i / BATCH) + 1} of ${Math.ceil(keys.length / BATCH)} of the same document. Translate ALL strings in this part completely into the target language.`
    const { parsed } = await translateSeoJsonWithKieSingle(slice, targetLocale, {
      useResponseFormat: true,
      temperature: 0.15,
      extraUserHint: hint,
    })
    merged = { ...merged, ...parsed }
  }
  if (!sameJsonStructure(sourceObj, merged)) {
    throw new Error(
      `${targetLocale}: 分片翻译后结构与原文不一致（请减小 KIE_TRANSLATE_CHUNK_KEYS 或重试）`
    )
  }
  return merged
}

async function translateSeoJsonWithKie(sourceObj, targetLocale) {
  const strLen = JSON.stringify(sourceObj).length
  const forceChunk = strLen >= (Number.parseInt(process.env.KIE_TRANSLATE_CHUNK_MIN_CHARS || '14000', 10) || 14000)

  if (forceChunk) {
    return translateSeoJsonWithKieChunked(sourceObj, targetLocale)
  }

  let lastErr
  for (const useFmt of [true, false]) {
    try {
      let { parsed, finish } = await translateSeoJsonWithKieSingle(sourceObj, targetLocale, {
        useResponseFormat: useFmt,
        temperature: 0.2,
      })
      if (finish === 'length' || !sameJsonStructure(sourceObj, parsed)) {
        console.warn(
          `[translate-seo] ${targetLocale}: 整包翻译截断或结构不一致 (finish=${finish})，改分片重试`
        )
        return translateSeoJsonWithKieChunked(sourceObj, targetLocale)
      }
      return parsed
    } catch (e) {
      lastErr = e
      const msg = e.message || String(e)
      if (useFmt && /无法解析|extract|JSON|未返回可解析|为空/i.test(msg)) {
        console.warn(`[translate-seo] ${targetLocale}: JSON 解析失败，将关闭 response_format 重试一次`)
        continue
      }
      throw e
    }
  }
  throw lastErr || new Error(`${targetLocale}: 翻译失败`)
}

/** 工具板块显示顺序（不含虚拟首页）；靠前的排在顶部；未列出的按 id 字母序排在后面 */
const TOOL_DISPLAY_ORDER = [
  'watermark-remover',
  'image-compressor',
  'image-compression',
  'image-converter',
  'font-generator',
  'emoji-copy-and-paste',
  'seedance-2',
  'kling-3',
  'nano-banana-pro',
  'nano-banana-2',
  'photo-restoration',
  'ai-couple-photo-maker',
]

/** 用于「最近上线」排序：取 en 下该工具 L2 文件或子目录内 JSON 的最新 mtime */
function getToolLatestMtimeMs(enDir, toolId) {
  const flat = path.join(enDir, `${toolId}.json`)
  try {
    if (fs.existsSync(flat)) return fs.statSync(flat).mtimeMs
  } catch {}
  const dir = path.join(enDir, toolId)
  try {
    const st = fs.statSync(dir)
    if (!st.isDirectory()) return 0
    let max = st.mtimeMs
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.json')) continue
      try {
        const ms = fs.statSync(path.join(dir, f)).mtimeMs
        if (ms > max) max = ms
      } catch {}
    }
    return max
  } catch {}
  return 0
}

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

  const arr = Array.from(toolMap.entries())
    .map(([id, v]) => ({ id, ...v }))
    .filter((t) => t.id !== HOMEPAGE_TOOL_ID)

  let recentId = ''
  let recentMtime = -1
  for (const t of arr) {
    const m = getToolLatestMtimeMs(enDir, t.id)
    if (m > recentMtime) {
      recentMtime = m
      recentId = t.id
    }
  }

  const recentEntry = arr.find((t) => t.id === recentId)
  const others = arr.filter((t) => t.id !== recentId)
  others.sort((a, b) => {
    const ia = TOOL_DISPLAY_ORDER.indexOf(a.id)
    const ib = TOOL_DISPLAY_ORDER.indexOf(b.id)
    if (ia >= 0 && ib >= 0) return ia - ib
    if (ia >= 0) return -1
    if (ib >= 0) return 1
    return a.id.localeCompare(b.id)
  })

  const homepageEntry = {
    id: HOMEPAGE_TOOL_ID,
    name: '首页 (多语言 /)',
    pages: [{ slug: '', name: 'common.home' }],
  }

  return recentEntry ? [homepageEntry, recentEntry, ...others] : [homepageEntry, ...others]
}

/** 与 src/app/page.tsx、src/lib/seo-loader.ts 一致（英文首页模型区） */
const HOME_PREVIEW_VIDEO_MODEL_L2S = ['seedance-2', 'kling-3']
const HOME_PREVIEW_IMAGE_MODEL_L2S = ['gpt-image-2', 'wan-2-7-image', 'nano-banana-pro', 'nano-banana-2']
/** 与 src/lib/homepage-grid-tools.ts 保持一致 */
const HOME_PREVIEW_ADVANCED_AI_TOOLS = ['ai-couple-photo-maker', 'watermark-remover', 'photo-restoration']
const HOME_PREVIEW_UTILITY_TOOLS = ['image-compressor', 'image-converter', 'font-generator', 'emoji-copy-and-paste']
const HOMEPAGE_TOOL_CARD_KEYS = [
  'toolImageCompressor',
  'toolImageCompressorDesc',
  'toolFormatConverter',
  'toolFormatConverterDesc',
  'toolFontGenerator',
  'toolFontGeneratorDesc',
  'toolEmojiCopyAndPaste',
  'toolEmojiCopyAndPasteDesc',
  'toolWatermarkRemover',
  'toolWatermarkRemoverDesc',
  'toolPhotoRestoration',
  'toolPhotoRestorationDesc',
  'toolImageResize',
  'toolImageResizeDesc',
  'toolVideoCompressor',
  'toolVideoCompressorDesc',
]

/** 与 src/lib/home-advanced-ai-card-images.ts 路径一致；缩略图长边≤800px、约≤100KB（最终使用 R2 URL） */
const HOME_ADVANCED_AI_CARD_IMAGES = {
  'ai-couple-photo-maker': 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-advanced-ai/ai-couple-photo-maker.jpg',
  'watermark-remover': 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-advanced-ai/watermark-remover.jpg',
  'photo-restoration': 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-advanced-ai/photo-restoration.jpg',
}
/** 与 src/lib/home-model-card-images.ts 一致（首页 AI Video / AI Image / Trending，最终使用 R2 URL） */
const HOME_MODEL_CARD_IMAGES = {
  'nano-banana-pro': 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-model-cards/nano-banana-pro.jpg',
  'nano-banana-2': 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-model-cards/nano-banana-2.jpg',
  'gpt-image-2': 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-model-cards/gpt-image-2.jpg',
  'wan-2-7-image': '/model-assets/wan-2-7-image/gallery-event-poster.webp',
  'seedance-2': 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-model-cards/seedance-2.jpg',
  'kling-3': 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-model-cards/kling-3.jpg',
}

const HOME_PREVIEW_AI_IMAGE_PATHS = {
  'nano-banana-pro': '/model/nano-banana-pro',
  'nano-banana-2': '/model/nano-banana-2',
  'gpt-image-2': '/model/gpt-image-2-0',
  'wan-2-7-image': '/model/wan-2-7-image',
}
const HOME_PREVIEW_AI_VIDEO_PATHS = {
  'seedance-2': '/model/seedance-2',
  'kling-3': '/model/kling-3',
}

function withImageCacheBust(publicPath) {
  if (!publicPath || typeof publicPath !== 'string' || !publicPath.startsWith('/')) return publicPath
  try {
    const diskPath = path.join(ROOT, 'public', publicPath.replace(/^\/+/, ''))
    if (!fs.existsSync(diskPath)) return publicPath
    const ms = Math.floor(fs.statSync(diskPath).mtimeMs)
    return `${publicPath}?v=${ms}`
  } catch {
    return publicPath
  }
}

function stripHtmlPreview(s) {
  return String(s || '')
    .replace(/<[^>]*>/g, '')
    .trim()
}

function homePreviewHref(tool, locale) {
  const base =
    HOME_PREVIEW_AI_IMAGE_PATHS[tool] ||
    HOME_PREVIEW_AI_VIDEO_PATHS[tool] ||
    `/${tool}`
  if (!locale || locale === 'en') return base
  return `/${locale}${base}`
}

function readL2JsonPreview(tool, locale) {
  const loc = locale || 'en'
  const tryRead = (lc) => {
    const p = path.join(DATA_ROOT, lc, `${tool}.json`)
    if (!fs.existsSync(p)) return null
    try {
      return JSON.parse(fs.readFileSync(p, 'utf-8'))
    } catch {
      return null
    }
  }
  // seedance-2 / kling-3（等）L2 仅存在于 en；与 getL2SeoContent / 线上首页一致：缺省时回退英文
  const primary = tryRead(loc)
  if (primary) return primary
  if (loc !== 'en') return tryRead('en')
  return null
}

function readHomepageToolCardSummariesForPreview(locale) {
  try {
    const raw = fs.readFileSync(getCommonJsonPath(locale || 'en'), 'utf-8')
    const common = JSON.parse(raw)
    const m = common?.home?.homepageToolCardSummaries
    return m && typeof m === 'object' && !Array.isArray(m) ? m : {}
  } catch {
    return {}
  }
}

function applyHomepageSummaryToPreviewCard(card, summaries) {
  if (!card || !summaries) return card
  const s = summaries[card.tool]
  if (!s || typeof s !== 'object') return card
  const summary = typeof s.summary === 'string' && s.summary.trim() ? s.summary.trim() : null
  const cardTitle = typeof s.cardTitle === 'string' && s.cardTitle.trim() ? s.cardTitle.trim() : null
  if (!summary && !cardTitle) return card
  return {
    ...card,
    ...(cardTitle ? { modelName: cardTitle, title: cardTitle } : {}),
    ...(summary ? { featuredDesc: summary, description: summary } : {}),
  }
}

function buildHomepagePreviewModels(locale) {
  const loc = locale || 'en'
  const homepageSummaries = readHomepageToolCardSummariesForPreview(loc)
  const homepageCommon = (() => {
    try {
      return readCommonJson(loc)?.home || {}
    } catch {
      return {}
    }
  })()

  function cardFromData(tool, data, kind) {
    if (!data) return null
    const getFeaturedDesc = (d) => {
      const desc = d?.modelIntro?.description?.[0]
      const card = d?.modelIntro?.featureCards?.[0]?.content
      return stripHtmlPreview(desc || card || '')
    }
    const meta = {
      modelName: data?.modelIntro?.modelName,
      modelType: data?.modelIntro?.modelType,
    }
    const title = stripHtmlPreview(data?.hero?.h1 || '')
    const description = stripHtmlPreview(data?.hero?.desc || data?.metadata?.description || '')
    const featuredDesc = getFeaturedDesc(data)
    return {
      tool,
      kind,
      title,
      description,
      featuredDesc,
      modelName: meta.modelName,
      modelType: meta.modelType,
      href: homePreviewHref(tool, loc),
      previewImage: withImageCacheBust(HOME_MODEL_CARD_IMAGES[tool]),
    }
  }

  const aiVideoTools = []
  for (const tool of HOME_PREVIEW_VIDEO_MODEL_L2S) {
    const data = readL2JsonPreview(tool, loc)
    const c = cardFromData(tool, data, 'video')
    if (c) aiVideoTools.push(applyHomepageSummaryToPreviewCard(c, homepageSummaries))
  }

  const aiImageTools = []
  for (const tool of HOME_PREVIEW_IMAGE_MODEL_L2S) {
    const data = readL2JsonPreview(tool, loc)
    const c = cardFromData(tool, data, 'image')
    if (c) aiImageTools.push(applyHomepageSummaryToPreviewCard(c, homepageSummaries))
  }

  const trendingModels = [...aiVideoTools, ...aiImageTools]

  function pushGridTool(arr, tool, usesAi) {
    const previewImage = usesAi ? withImageCacheBust(HOME_ADVANCED_AI_CARD_IMAGES[tool]) : undefined
    const data = readL2JsonPreview(tool, loc)
    if (!data) return
    const localizedUtilityOverrides = {
      'image-compressor': {
        title: stripHtmlPreview(homepageCommon?.toolImageCompressor || ''),
        description: stripHtmlPreview(homepageCommon?.toolImageCompressorDesc || ''),
      },
      'image-converter': {
        title: stripHtmlPreview(homepageCommon?.toolFormatConverter || ''),
        description: stripHtmlPreview(homepageCommon?.toolFormatConverterDesc || ''),
      },
      'font-generator': {
        title: stripHtmlPreview(homepageCommon?.toolFontGenerator || ''),
        description: stripHtmlPreview(homepageCommon?.toolFontGeneratorDesc || ''),
      },
      'emoji-copy-and-paste': {
        title: stripHtmlPreview(homepageCommon?.toolEmojiCopyAndPaste || ''),
        description: stripHtmlPreview(homepageCommon?.toolEmojiCopyAndPasteDesc || ''),
      },
      'watermark-remover': {
        title: stripHtmlPreview(homepageCommon?.toolWatermarkRemover || ''),
        description: stripHtmlPreview(homepageCommon?.toolWatermarkRemoverDesc || ''),
      },
      'photo-restoration': {
        title: stripHtmlPreview(homepageCommon?.toolPhotoRestoration || ''),
        description: stripHtmlPreview(homepageCommon?.toolPhotoRestorationDesc || ''),
      },
    }
    const utilityOverride = localizedUtilityOverrides[tool] || {}

    const row = {
      tool,
      kind: 'other',
      usesAi,
      title: utilityOverride.title || stripHtmlPreview(data?.hero?.h1 || '') || tool,
      description: utilityOverride.description || stripHtmlPreview(data?.hero?.desc || data?.metadata?.description || ''),
      href: homePreviewHref(tool, loc),
      previewImage,
    }
    arr.push(applyHomepageSummaryToPreviewCard(row, homepageSummaries))
  }

  const advancedAiTools = []
  for (const tool of HOME_PREVIEW_ADVANCED_AI_TOOLS) {
    pushGridTool(advancedAiTools, tool, true)
  }

  const utilityTools = []
  for (const tool of HOME_PREVIEW_UTILITY_TOOLS) {
    pushGridTool(utilityTools, tool, false)
  }

  return {
    locale: loc,
    aiVideoTools,
    aiImageTools,
    trendingModels,
    advancedAiTools,
    utilityTools,
  }
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
  const faqList = Array.isArray(parsed.faq) ? parsed.faq : (parsed.faq?.list || parsed.faq?.items || [])
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

function normalizeRequestPathname(url) {
  let p = (url.split('?')[0] || '/').trim()
  try {
    p = decodeURIComponent(p)
  } catch {
    /* ignore */
  }
  p = p.replace(/\/+/g, '/')
  if (!p.startsWith('/')) p = '/' + p
  p = p.replace(/\/$/, '') || '/'
  return p
}

/** 与浏览器地址栏一致，保证注入的 API_BASE 与当前页同源 */
function getAdminOriginFromRequest(req) {
  const host = (req.headers.host || '').trim()
  if (!host) return `http://127.0.0.1:${PORT}`
  const xf = String(req.headers['x-forwarded-proto'] || '')
    .split(',')[0]
    .trim()
  const proto =
    xf === 'https' || xf === 'http'
      ? xf
      : req.socket && req.socket.encrypted
        ? 'https'
        : 'http'
  return `${proto}://${host}`
}

function injectAdminHtmlOrigin(html, req) {
  const origin = getAdminOriginFromRequest(req)
  return html.replace(
    /window\.__TOOLAZE_SEO_ADMIN_ORIGIN__\s*=\s*null\s*\/\/\s*__ADMIN_ORIGIN_PLACEHOLDER__/,
    `window.__TOOLAZE_SEO_ADMIN_ORIGIN__ = ${JSON.stringify(origin)} // bound to request Host`
  )
}

const server = http.createServer(async (req, res) => {
  const url = req.url || ''
  let pathname = normalizeRequestPathname(url)
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

  if (pathname === '/api/homepage-preview-models' && req.method === 'GET') {
    try {
      const locale = params.locale != null ? String(params.locale).trim() || 'en' : 'en'
      const payload = buildHomepagePreviewModels(locale)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(payload))
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
    res.end(
      JSON.stringify({
        ok: true,
        version: '1.3',
        translateSeo: true,
        hint: '若浏览器翻译仍 404，说明进程未重启：Ctrl+C 后重新 npm run admin:seo',
      })
    )
    return
  }

  /** GET 探测：旧版无此路由会 404；便于在地址栏直接验证是否已加载新脚本 */
  if (pathname === '/api/translate-seo' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(
      JSON.stringify({
        ok: true,
        translateSeo: true,
        usage: 'POST JSON: { tool, slug?, sourceLocale?, targetLocales[] }',
      })
    )
    return
  }

  if (pathname === '/api/test-gemini' && req.method === 'GET') {
    const apiKey = getKieApiKey()
    const model = process.env.KIE_GEMINI_MODEL || 'gemini-3-flash'
    const fullUrl = getKieGeminiChatCompletionsUrl()
    if (!apiKey) {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: false, error: 'KIE_AI_API_KEY 或 ZHEN_AI_API_KEY 未配置' }))
      return
    }
    try {
      const r = await fetch(fullUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          ...kieGemini3TranslateBodyExtras(),
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
        provider: getKieTranslateApiLabel(),
        response: body,
        hint: !r.ok ? '若 401：检查 KIE_AI_API_KEY。若 404/503：检查 KIE_GEMINI_CHAT_SLUG 或 kie.ai 模型可用性。' : null,
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
      let exists = false
      if (isHomepageSeoTool(tool) && !slug) {
        const p = getCommonJsonPath('en')
        exists = fs.existsSync(p)
      } else {
        const filePath = getFilePath(tool, slug || null, 'en')
        exists = fs.existsSync(filePath)
      }
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ exists }))
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: e.message }))
    }
    return
  }

  /** 返回当前工具/页面在磁盘上已存在的语言版本（用于后台语言切换入口） */
  if (pathname === '/api/seo/locales' && req.method === 'GET') {
    const tool = params.tool
    const slug = params.slug != null ? String(params.slug) : ''
    if (!tool) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'tool is required' }))
      return
    }
    try {
      const ALL = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
      const locales = []
      for (const loc of ALL) {
        let fp
        if (isHomepageSeoTool(tool) && !slug) {
          fp = getCommonJsonPath(loc)
        } else {
          fp = getFilePath(tool, slug || null, loc)
        }
        if (fs.existsSync(fp)) locales.push(loc)
      }
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ locales }))
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
      const { tool, slug, sectionId, extraInstructions, currentSectionData, locale: genLocale } = payload
      const targetLocale = genLocale && typeof genLocale === 'string' ? genLocale : 'en'
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
        `Target locale for all user-visible strings: "${targetLocale}" (when not "en", write fully in that language; keep JSON keys in English).`,
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
      let data
      if (isHomepageSeoTool(tool) && !slug) {
        const common = readCommonJson(locale || 'en')
        if (!common.home || typeof common.home !== 'object') {
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'common.json 缺少 home 对象' }))
          return
        }
        data = common.home
      } else {
        const filePath = getFilePath(tool, slug || null, locale || 'en')
        const content = fs.readFileSync(filePath, 'utf-8')
        data = JSON.parse(content)
      }
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
      let filePath
      if (isHomepageSeoTool(tool) && !slug) {
        const loc = locale || 'en'
        const common = readCommonJson(loc)
        common.home = data
        writeCommonJson(loc, common)
        filePath = getCommonJsonPath(loc)
      } else {
        filePath = getFilePath(tool, slug || null, locale || 'en')
        fs.mkdirSync(path.dirname(filePath), { recursive: true })
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
      }
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

  if (pathname === '/api/translate-seo' && req.method === 'POST') {
    loadEnvLocal()
    let body = ''
    for await (const chunk of req) body += chunk
    try {
      const payload = JSON.parse(body)
      const tool = payload.tool
      const slug = payload.slug != null ? String(payload.slug) : ''
      const sourceLocale = payload.sourceLocale || 'en'
      let targetLocales = Array.isArray(payload.targetLocales) ? payload.targetLocales : []
      targetLocales = [...new Set(targetLocales)].filter((loc) => TRANSLATION_TARGET_LOCALES.includes(loc))

      if (!tool) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'tool is required' }))
        return
      }
      if (targetLocales.length === 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: '请至少选择一种目标语言' }))
        return
      }

      const homePartial =
        payload.homePartial != null && typeof payload.homePartial === 'object' && !Array.isArray(payload.homePartial)
          ? payload.homePartial
          : null
      if (homePartial && Object.keys(homePartial).length === 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'homePartial 为空对象' }))
        return
      }
      if (homePartial && (!isHomepageSeoTool(tool) || slug)) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'homePartial 仅支持 tool=homepage 且无 slug' }))
        return
      }

      let sourceObj
      let srcPath
      if (homePartial) {
        sourceObj = homePartial
        srcPath = getCommonJsonPath(sourceLocale)

        // 兜底：如果是首页工具卡片分片翻译（旧前端可能漏字段），自动补齐整组卡片 key，避免同步英文后残留英文值。
        const partialKeys = Object.keys(homePartial)
        const hasAnyToolCardKey = partialKeys.some((k) => HOMEPAGE_TOOL_CARD_KEYS.includes(k))
        if (hasAnyToolCardKey && fs.existsSync(srcPath)) {
          const common = JSON.parse(fs.readFileSync(srcPath, 'utf-8'))
          const sourceHome = common?.home && typeof common.home === 'object' ? common.home : {}
          const expanded = { ...homePartial }
          for (const k of HOMEPAGE_TOOL_CARD_KEYS) {
            if (expanded[k] === undefined && sourceHome[k] !== undefined) expanded[k] = sourceHome[k]
          }
          sourceObj = expanded
        }
      } else if (isHomepageSeoTool(tool) && !slug) {
        srcPath = getCommonJsonPath(sourceLocale)
        if (!fs.existsSync(srcPath)) {
          res.writeHead(404, { 'Content-Type': 'application/json' })
          res.end(
            JSON.stringify({
              error: `源文件不存在: ${path.relative(ROOT, srcPath)}`,
              hint: '请先确保 src/data/en/common.json 存在且包含 home。',
            })
          )
          return
        }
        try {
          const common = JSON.parse(fs.readFileSync(srcPath, 'utf-8'))
          if (!common.home || typeof common.home !== 'object') {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: '英文 common.json 缺少 home 对象' }))
            return
          }
          sourceObj = common.home
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: '源 JSON 解析失败', hint: e.message }))
          return
        }
      } else {
        srcPath = getFilePath(tool, slug || null, sourceLocale)
        if (!fs.existsSync(srcPath)) {
          res.writeHead(404, { 'Content-Type': 'application/json' })
          res.end(
            JSON.stringify({
              error: `源文件不存在: ${path.relative(ROOT, srcPath)}`,
              hint: '请先在本页保存英文 SEO（src/data/en），或使用已有英文 JSON。',
            })
          )
          return
        }

        try {
          sourceObj = JSON.parse(fs.readFileSync(srcPath, 'utf-8'))
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: '源 JSON 解析失败', hint: e.message }))
          return
        }
      }

      const written = []
      const preSynced = []
      const errors = []
      for (const loc of targetLocales) {
        try {
          // 翻译前一致性检查：目标语言文件必须与英文在“结构+内容”一致；不一致先同步英文。
          if (isHomepageSeoTool(tool) && !slug) {
            const srcCommonPath = getCommonJsonPath(sourceLocale)
            if (!fs.existsSync(srcCommonPath)) {
              throw new Error(`源 common.json 不存在: ${path.relative(ROOT, srcCommonPath)}`)
            }
            const srcCommon = JSON.parse(fs.readFileSync(srcCommonPath, 'utf-8'))
            const sourceHomeForCheck = srcCommon?.home && typeof srcCommon.home === 'object' ? srcCommon.home : {}
            const targetCommon = readCommonJson(loc)
            const targetHomeForCheck =
              targetCommon && targetCommon.home && typeof targetCommon.home === 'object' ? targetCommon.home : {}

            if (!isSameContentAndStructure(sourceHomeForCheck, targetHomeForCheck)) {
              targetCommon.home = JSON.parse(JSON.stringify(sourceHomeForCheck))
              writeCommonJson(loc, targetCommon)
              preSynced.push({ locale: loc, path: path.relative(ROOT, getCommonJsonPath(loc)), reason: 'home mismatch' })
            }
          } else {
            const srcPathForCheck = getFilePath(tool, slug || null, sourceLocale)
            const dstPathForCheck = getFilePath(tool, slug || null, loc)
            if (!fs.existsSync(srcPathForCheck)) {
              throw new Error(`源文件不存在: ${path.relative(ROOT, srcPathForCheck)}`)
            }
            const sourceForCheck = JSON.parse(fs.readFileSync(srcPathForCheck, 'utf-8'))
            let targetForCheck = null
            if (fs.existsSync(dstPathForCheck)) {
              try {
                targetForCheck = JSON.parse(fs.readFileSync(dstPathForCheck, 'utf-8'))
              } catch {
                targetForCheck = null
              }
            }
            if (!targetForCheck || !isSameContentAndStructure(sourceForCheck, targetForCheck)) {
              fs.mkdirSync(path.dirname(dstPathForCheck), { recursive: true })
              fs.writeFileSync(dstPathForCheck, JSON.stringify(sourceForCheck, null, 2), 'utf-8')
              preSynced.push({ locale: loc, path: path.relative(ROOT, dstPathForCheck), reason: 'page mismatch' })
            }
          }

          const translated = await translateSeoJsonWithKie(sourceObj, loc)
          const withLocaleUrls = rewriteLocaleUrlsInJson(translated, loc)
          let outPath
          if (isHomepageSeoTool(tool) && !slug) {
            const targetCommon = readCommonJson(loc)
            targetCommon.home = targetCommon.home && typeof targetCommon.home === 'object' ? targetCommon.home : {}
            if (homePartial) {
              Object.assign(targetCommon.home, withLocaleUrls)
            } else {
              targetCommon.home = withLocaleUrls
            }
            outPath = getCommonJsonPath(loc)
            writeCommonJson(loc, targetCommon)
          } else {
            outPath = getFilePath(tool, slug || null, loc)
            fs.mkdirSync(path.dirname(outPath), { recursive: true })
            fs.writeFileSync(outPath, JSON.stringify(withLocaleUrls, null, 2), 'utf-8')
          }
          written.push({ locale: loc, path: path.relative(ROOT, outPath) })
          console.log('[translate-seo]', loc, outPath)
        } catch (err) {
          errors.push({ locale: loc, error: err.message || String(err) })
        }
      }

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({
          ok: errors.length === 0,
          written,
          preSynced,
          errors,
          api: getKieTranslateApiLabel(),
          homePartialMerge: !!homePartial,
          hint:
            errors.length === 0
              ? homePartial
                ? '已合并写入各语言 common.json 的 home（仅更新本次提交的字段）。请 git 提交并部署。'
                : '已写入 src/data/<locale>/。请 git 提交并部署后线上才会更新（静态站点）。'
              : '部分语言失败时请查看 errors；成功项已写入磁盘。',
        })
      )
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: e.message }))
    }
    return
  }

  if (pathname === '/api/homepage/sync-en' && req.method === 'POST') {
    let body = ''
    for await (const chunk of req) body += chunk
    try {
      let payload = {}
      try {
        payload = JSON.parse(body || '{}')
      } catch {
        payload = {}
      }
      let targetLocales = Array.isArray(payload.targetLocales) ? payload.targetLocales : TRANSLATION_TARGET_LOCALES
      targetLocales = [...new Set(targetLocales)].filter((loc) => TRANSLATION_TARGET_LOCALES.includes(loc))
      if (targetLocales.length === 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: '请至少提供一种目标语言' }))
        return
      }

      const enPath = getCommonJsonPath('en')
      if (!fs.existsSync(enPath)) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: `英文首页文件不存在: ${path.relative(ROOT, enPath)}` }))
        return
      }
      const enCommon = readCommonJson('en')
      if (!enCommon.home || typeof enCommon.home !== 'object') {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'src/data/en/common.json 缺少 home 对象' }))
        return
      }

      const written = []
      for (const loc of targetLocales) {
        const target = readCommonJson(loc)
        target.home = JSON.parse(JSON.stringify(enCommon.home))
        writeCommonJson(loc, target)
        written.push({ locale: loc, path: path.relative(ROOT, getCommonJsonPath(loc)) })
      }

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({
          ok: true,
          written,
          hint: '已将英文首页 common.home 全量同步到所选语言。后续可再按需翻译文本。',
        })
      )
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: e.message }))
    }
    return
  }

  if (pathname === '/' || pathname === '/admin' || pathname.startsWith('/admin')) {
    const htmlPath = path.join(__dirname, 'admin-seo.html')
    let html = fs.readFileSync(htmlPath, 'utf-8')
    html = injectAdminHtmlOrigin(html, req)
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(html)
    return
  }

  console.warn('[404]', req.method, pathname, url.slice(0, 80))
  res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(
    JSON.stringify({
      error: `接口不存在 (${req.method} ${pathname})`,
      hint:
        pathname.startsWith('/api/')
          ? `请确认：① 终端已运行 npm run admin:seo，地址为 http://localhost:${PORT}（勿在 Next 的 :3006 打开本页）；② 修改过 admin-seo-server.js 后已重启。`
          : undefined,
      pathname,
      method: req.method,
    })
  )
})

server.listen(PORT, () => {
  console.log(`\n📋 SEO 管理后台: http://localhost:${PORT}`)
  console.log(`   测试 API: http://localhost:${PORT}/api/test-gemini`)
  console.log(`   翻译 API: POST http://127.0.0.1:${PORT}/api/translate-seo`)
  console.log(`   浏览器探测: 打开 http://127.0.0.1:${PORT}/api/translate-seo 应显示 JSON（含 translateSeo）；若 404 请重启本进程。`)
  console.log(`\n   ⚠️  请保持本终端运行，不要按 Ctrl+C；另开终端跑 npm run dev（前端）。`)
  console.log(`   自检: curl -s http://127.0.0.1:${PORT}/api/health\n`)
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ 端口 ${PORT} 已被占用。请先停止旧进程：`)
    console.error(`   pkill -f admin-seo-server`)
    console.error(`   或在该终端按 Ctrl+C 停止后重新运行 npm run admin:seo\n`)
  } else {
    throw err
  }
})
