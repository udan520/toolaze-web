#!/usr/bin/env node

/**
 * 上传示例图片到 R2 的简单脚本
 * 
 * 使用方法：
 * 1. 配置环境变量（见下方）
 * 2. node scripts/upload-sample-images.js /path/to/image1.jpg /path/to/image2.jpg
 * 
 * 环境变量：
 * - R2_ACCESS_KEY_ID: R2 Access Key ID
 * - R2_SECRET_ACCESS_KEY: R2 Secret Access Key
 * - R2_ENDPOINT_URL: R2 Endpoint URL (如 https://xxx.r2.cloudflarestorage.com)
 * - R2_BUCKET: R2 桶名称（默认: toolaze）
 * - R2_PUBLIC_BASE_URL: R2 公网域名（如 https://pub-xxxxx.r2.dev）
 */

const fs = require('fs')
const path = require('path')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')

const accessKeyId = process.env.R2_ACCESS_KEY_ID
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
const endpointUrl = process.env.R2_ENDPOINT_URL
const bucketName = process.env.R2_BUCKET || 'toolaze'
const publicBaseUrl = (process.env.R2_PUBLIC_BASE_URL || '').replace(/\/$/, '')

if (!accessKeyId || !secretAccessKey || !endpointUrl || !publicBaseUrl) {
  console.error('❌ 请设置环境变量：')
  console.error('  R2_ACCESS_KEY_ID')
  console.error('  R2_SECRET_ACCESS_KEY')
  console.error('  R2_ENDPOINT_URL')
  console.error('  R2_PUBLIC_BASE_URL')
  console.error('  R2_BUCKET (可选，默认: toolaze)')
  process.exit(1)
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint: endpointUrl,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
})

async function uploadImage(filePath, objectName) {
  try {
    const fileContent = fs.readFileSync(filePath)
    const ext = path.extname(filePath).toLowerCase()
    const contentType = 
      ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
      ext === '.png' ? 'image/png' :
      ext === '.webp' ? 'image/webp' :
      'image/jpeg'

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectName,
      Body: fileContent,
      ContentType: contentType,
    })

    await s3Client.send(command)
    const publicUrl = `${publicBaseUrl}/${objectName}`
    return publicUrl
  } catch (error) {
    console.error(`❌ 上传失败 ${filePath}:`, error.message)
    return null
  }
}

async function main() {
  const imagePaths = process.argv.slice(2)
  
  if (imagePaths.length === 0) {
    console.error('❌ 请提供图片路径')
    console.error('用法: node scripts/upload-sample-images.js /path/to/image1.jpg /path/to/image2.jpg')
    process.exit(1)
  }

  console.log('📤 开始上传示例图片到 R2...\n')

  const results = []
  for (let i = 0; i < imagePaths.length; i++) {
    const filePath = imagePaths[i]
    if (!fs.existsSync(filePath)) {
      console.error(`❌ 文件不存在: ${filePath}`)
      continue
    }

    const ext = path.extname(filePath).toLowerCase()
    const objectName = `samples/nano-banana-pro-sample-${i + 1}${ext}`
    
    console.log(`上传 ${i + 1}/${imagePaths.length}: ${path.basename(filePath)}`)
    const url = await uploadImage(filePath, objectName)
    
    if (url) {
      console.log(`✅ 成功: ${url}\n`)
      results.push({ index: i + 1, url, objectName })
    } else {
      console.log(`❌ 失败\n`)
    }
  }

  if (results.length > 0) {
    console.log('\n📋 上传结果：')
    console.log('='.repeat(60))
    results.forEach(({ index, url, objectName }) => {
      console.log(`示例图 ${index}:`)
      console.log(`  URL: ${url}`)
      console.log(`  对象名: ${objectName}`)
      console.log('')
    })
    
    console.log('💡 在代码中使用：')
    console.log('='.repeat(60))
    console.log('const sampleImages = [')
    results.forEach(({ index, url }) => {
      console.log(`  { url: '${url}', caption: 'Sample output ${index}' },`)
    })
    console.log(']')
  }
}

main().catch(console.error)
