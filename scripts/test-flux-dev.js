#!/usr/bin/env node
/**
 * 测试 flux-dev API 调用
 * 用法：node scripts/test-flux-dev.js
 * 需在 .env.local 配置 ZHEN_AI_API_KEY、ZHEN_AI_FLUX_BASE_URL
 */
const fs = require('fs')
const path = require('path')

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local')
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local 不存在')
    process.exit(1)
  }
  const content = fs.readFileSync(envPath, 'utf8')
  const env = {}
  for (const line of content.split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
  }
  return env
}

async function main() {
  const env = loadEnv()
  const apiKey = env.ZHEN_AI_API_KEY
  const baseUrl = (env.ZHEN_AI_FLUX_BASE_URL || 'https://api.openai-hk.com').replace(/\/$/, '')

  if (!apiKey) {
    console.error('❌ ZHEN_AI_API_KEY 未配置')
    process.exit(1)
  }

  const url = `${baseUrl}/bfl/v1/flux-dev`
  console.log('📤 请求:', url)
  console.log('📋 参数: 文生图，prompt="a cute cat"')

  const payload = {
    prompt: 'a cute cat',
    width: 512,
    height: 512,
    steps: 8,
    prompt_upsampling: false,
    seed: 42,
    guidance: 3,
    safety_tolerance: 2,
    output_format: 'jpeg',
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json().catch(() => ({}))
    console.log('📥 状态:', res.status)
    console.log('📥 响应:', JSON.stringify(data, null, 2))

    if (res.ok && (data.id || data.polling_url)) {
      console.log('\n✅ 调用成功')
    } else {
      console.log('\n❌ 调用失败')
      process.exit(1)
    }
  } catch (e) {
    console.error('❌ 请求异常:', e.message)
    process.exit(1)
  }
}

main()
