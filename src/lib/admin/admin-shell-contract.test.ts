import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'
import { ADMIN_NAV_ITEMS } from './navigation'

function readSource(relativePath: string) {
  return readFileSync(join(process.cwd(), relativePath), 'utf8')
}

test('unified admin navigation includes the release calendar on port 3010', () => {
  assert.ok(ADMIN_NAV_ITEMS.some((item) => (
    item.label === '发版记录' && item.href === '/admin/releases'
  )))
  assert.equal(existsSync(join(process.cwd(), 'src/app/admin/releases/page.tsx')), true)
})

test('admin page headers do not repeat sidebar navigation or verbose breadcrumbs', () => {
  const usersPage = readSource('src/app/admin/users/page.tsx')
  const generationsPage = readSource('src/app/admin/generations/page.tsx')
  const dailyPage = readSource('src/app/admin/data-dashboard/page.tsx')
  const releasesPage = readSource('src/app/admin/releases/page.tsx')
  const dashboard = readSource('src/components/admin/UserDashboard.tsx')

  assert.doesNotMatch(usersPage, /<span>Toolaze Admin<\/span>/)
  assert.doesNotMatch(usersPage, /<span>线上 D1<\/span>/)
  assert.doesNotMatch(generationsPage, /返回用户列表/)
  assert.doesNotMatch(dailyPage, />用户列表</)
  assert.doesNotMatch(dailyPage, />任务生成记录</)
  assert.doesNotMatch(releasesPage, /用户列表|任务生成记录|每日数据看板/)
  assert.doesNotMatch(dashboard, /href="\/admin\/generations"/)

  for (const source of [usersPage, generationsPage, dailyPage, releasesPage]) {
    assert.match(source, /刷新(?:数据|记录)/)
  }
})
