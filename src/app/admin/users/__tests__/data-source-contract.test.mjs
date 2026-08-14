import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const usersPageSource = readFileSync('src/app/admin/users/page.tsx', 'utf8')
const userDetailPageSource = readFileSync('src/app/admin/users/[userId]/page.tsx', 'utf8')
const generationsPageSource = readFileSync('src/app/admin/generations/page.tsx', 'utf8')
const dashboardPageSource = readFileSync('src/app/admin/data-dashboard/page.tsx', 'utf8')
const userDashboardSource = readFileSync('src/components/admin/UserDashboard.tsx', 'utf8')

test('admin users page supports explicit local and production data sources', () => {
  assert.match(usersPageSource, /searchParams/)
  assert.match(usersPageSource, /resolveAdminDataSource/)
  assert.match(usersPageSource, /fetchLocalDevUsers/)
  assert.match(usersPageSource, /fetchProductionUsers/)
  assert.match(usersPageSource, /AdminDataSourceSwitch/)
  assert.match(usersPageSource, /当前数据源/)
})

test('admin generations page preserves data source links into user detail records', () => {
  assert.match(generationsPageSource, /resolveAdminDataSource/)
  assert.match(generationsPageSource, /fetchLocalDevGenerationRecords/)
  assert.match(generationsPageSource, /fetchProductionGenerationRecords/)
  assert.match(generationsPageSource, /AdminDataSourceSwitch/)
  assert.match(generationsPageSource, /buildAdminDataSourceHref/)
  assert.match(generationsPageSource, /getMediaSourceLabel/)
  assert.match(generationsPageSource, /媒体域名/)
})

test('admin user detail page can read local or production usage records', () => {
  assert.match(userDetailPageSource, /resolveAdminDataSource/)
  assert.match(userDetailPageSource, /fetchLocalDevUserUsage/)
  assert.match(userDetailPageSource, /fetchProductionUserUsage/)
  assert.match(userDetailPageSource, /AdminDataSourceSwitch/)
})

test('admin generation history pages show uploaded reference resources', () => {
  assert.match(generationsPageSource, /GenerationReferenceResources/)
  assert.match(generationsPageSource, /参考资源/)
  assert.match(userDetailPageSource, /GenerationReferenceResources/)
  assert.match(userDetailPageSource, /参考资源/)
})

test('admin generation history pages show full prompts on hover with copy action', () => {
  const promptCellSource = readFileSync('src/components/admin/GenerationPromptCell.tsx', 'utf8')

  assert.match(generationsPageSource, /GenerationPromptCell/)
  assert.match(userDetailPageSource, /GenerationPromptCell/)
  assert.match(promptCellSource, /navigator\.clipboard/)
  assert.match(promptCellSource, /writeText/)
  assert.match(promptCellSource, /复制/)
  assert.match(promptCellSource, /完整提示词/)
})

test('admin data dashboard shows the selected data source', () => {
  assert.match(dashboardPageSource, /resolveAdminDataSource/)
  assert.match(dashboardPageSource, /AdminDataSourceSwitch/)
  assert.match(dashboardPageSource, /当前数据源/)
})

test('user dashboard carries source through admin links and hides production-only grants locally', () => {
  assert.match(userDashboardSource, /dataSource/)
  assert.match(userDashboardSource, /buildAdminDataSourceHref/)
  assert.match(userDashboardSource, /canGrantCredits/)
})
