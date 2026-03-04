#!/usr/bin/env node
/**
 * 测试 qwen-image-edit API 调用
 * 用法：node scripts/test-qwen-image-edit.js <图片路径>
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
  const imagePath = process.argv[2]
  if (!imagePath || !fs.existsSync(imagePath)) {
    console.error('用法: node scripts/test-qwen-image-edit.js <图片路径>')
    process.exit(1)
  }

  const env = loadEnv()
  const apiKey = env.ZHEN_AI_API_KEY
  const baseUrl = (env.ZHEN_AI_FLUX_BASE_URL || 'https://ai.t8star.cn').replace(/\/$/, '')

  if (!apiKey) {
    console.error('❌ ZHEN_AI_API_KEY 未配置')
    process.exit(1)
  }

  const url = `${baseUrl}/v1/images/edits`
  console.log('📤 请求:', url)
  console.log('📋 参数: model=qwen-image-edit, prompt=remove all watermarks, image=', imagePath)

  const formData = new FormData()
  formData.append('model', 'qwen-image-edit')
  formData.append('prompt', 'remove all watermarks in the image.')
  const blob = new Blob([fs.readFileSync(imagePath)])
  const ext = path.extname(imagePath).slice(1) || 'png'
  formData.append('image', blob, `test.${ext}`)

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: formData,
    })

    const data = await res.json().catch(() => ({}))
    console.log('📥 状态:', res.status)
    const imageUrl = data?.data?.[0]?.url || data?.url
    if (res.ok && imageUrl) {
      console.log('📥 结果 URL:', imageUrl.substring(0, 80) + (imageUrl.length > 80 ? '...' : ''))
      console.log('\n✅ 调用成功')
    } else {
      console.log('📥 响应:', JSON.stringify(data, null, 2))
      console.log('\n❌ 调用失败')
      process.exit(1)
    }
  } catch (e) {
    console.error('❌ 请求异常:', e.message)
    process.exit(1)
  }
}

main()
