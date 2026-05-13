#!/usr/bin/env node
/**
 * 包装 `next build`，合并 NODE_OPTIONS（加大堆），避免 Pages/CI 在大量 SSG 时 OOM。
 * 不依赖 shell 语法，Windows / Linux / macOS 行为一致。
 */
const { spawnSync } = require('child_process')
const path = require('path')

const nextCli = path.join(__dirname, '..', 'node_modules', 'next', 'dist', 'bin', 'next')
const heap = '--max-old-space-size=6144'
const merged = [process.env.NODE_OPTIONS, heap].filter(Boolean).join(' ').trim()

const result = spawnSync(process.execPath, [nextCli, 'build'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_OPTIONS: merged },
  windowsHide: true,
})

process.exit(result.status === null ? 1 : result.status)
