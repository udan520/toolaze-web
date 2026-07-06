#!/usr/bin/env node
/**
 * 包装 `next build`，合并 NODE_OPTIONS（加大堆），避免 Pages/CI 在大量 SSG 时 OOM。
 * 不依赖 shell 语法，Windows / Linux / macOS 行为一致。
 */
const { spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const projectRoot = path.join(__dirname, '..')
const nextCli = path.join(__dirname, '..', 'node_modules', 'next', 'dist', 'bin', 'next')
const heap = '--max-old-space-size=6144'
const merged = [process.env.NODE_OPTIONS, heap].filter(Boolean).join(' ').trim()

function removeBuildOutput(dirName) {
  const dir = path.join(projectRoot, dirName)

  if (!fs.existsSync(dir)) {
    return
  }

  fs.rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 })
  console.log(`✅ 已清理旧构建产物 ${dirName}`)
}

function restoreApiRoutes() {
  const apiDir = path.join(projectRoot, 'src', 'app', 'api')
  const backupDir = path.join(projectRoot, '.api-backup')

  if (!fs.existsSync(backupDir) || fs.existsSync(apiDir)) {
    return
  }

  try {
    fs.renameSync(backupDir, apiDir)
    console.log('✅ API 路由已恢复（供 next dev 使用）')
  } catch (error) {
    fs.cpSync(backupDir, apiDir, { recursive: true, force: true })
    fs.rmSync(backupDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 })
    console.log('✅ API 路由已恢复（使用复制方式）')
  }
}

removeBuildOutput('.next')
removeBuildOutput('out')

const result = spawnSync(process.execPath, [nextCli, 'build'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_OPTIONS: merged },
  windowsHide: true,
})

restoreApiRoutes()

process.exit(result.status === null ? 1 : result.status)
