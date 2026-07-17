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

const temporaryBuildDirs = [
  {
    label: 'API 路由',
    sourceDir: path.join(projectRoot, 'src', 'app', 'api'),
    backupDir: path.join(projectRoot, '.api-backup'),
  },
  {
    label: '本地后台页',
    sourceDir: path.join(projectRoot, 'src', 'app', 'admin'),
    backupDir: path.join(projectRoot, '.admin-backup'),
  },
]

function restoreTemporaryBuildDirs() {
  for (const item of temporaryBuildDirs) {
    restoreTemporaryBuildDir(item)
  }
}

function restoreTemporaryBuildDir({ label, sourceDir, backupDir }) {
  if (!fs.existsSync(backupDir) || fs.existsSync(sourceDir)) {
    return
  }

  try {
    fs.renameSync(backupDir, sourceDir)
    console.log(`✅ ${label}已恢复（供 next dev 使用）`)
  } catch (error) {
    fs.cpSync(backupDir, sourceDir, { recursive: true, force: true })
    fs.rmSync(backupDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 })
    console.log(`✅ ${label}已恢复（使用复制方式）`)
  }
}

removeBuildOutput('.next')
removeBuildOutput('out')

const result = spawnSync(process.execPath, [nextCli, 'build'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_OPTIONS: merged },
  windowsHide: true,
})

restoreTemporaryBuildDirs()

process.exit(result.status === null ? 1 : result.status)
