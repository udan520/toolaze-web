import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  adminDataSourceOptions,
  buildAdminDataSourceHref,
  getAdminDataSourceDescription,
  getAdminDataSourceLabel,
  resolveAdminDataSource,
} from './data-source'

test('defaults admin pages to production data even on local hosts', () => {
  assert.equal(resolveAdminDataSource({}, 'localhost:3010'), 'production')
  assert.equal(resolveAdminDataSource({}, '127.0.0.1:3010'), 'production')
})

test('resolves explicit production source for local admin pages', () => {
  assert.equal(resolveAdminDataSource({ source: 'production' }, 'localhost:3010'), 'production')
  assert.equal(resolveAdminDataSource({ source: 'online' }, 'localhost:3010'), 'production')
  assert.equal(resolveAdminDataSource({ source: 'd1' }, 'localhost:3010'), 'production')
})

test('resolves explicit local source for local admin pages', () => {
  assert.equal(resolveAdminDataSource({ source: 'local' }, 'localhost:3010'), 'local')
})

test('remote admin pages default to production data', () => {
  assert.equal(resolveAdminDataSource({}, 'toolaze.com'), 'production')
})

test('builds stable admin data source links', () => {
  assert.equal(buildAdminDataSourceHref('/admin/users', 'local'), '/admin/users?source=local')
  assert.equal(buildAdminDataSourceHref('/admin/users', 'production'), '/admin/users?source=production')
  assert.equal(
    buildAdminDataSourceHref('/admin/users/user_1', 'production'),
    '/admin/users/user_1?source=production',
  )
})

test('labels admin data sources in user-facing Chinese', () => {
  assert.equal(getAdminDataSourceLabel('local'), '本地数据')
  assert.equal(getAdminDataSourceLabel('production'), '线上数据')
})

test('lists production data before local data for admin switchers', () => {
  assert.deepEqual(adminDataSourceOptions, ['production', 'local'])
})

test('local data source description explains remote media links', () => {
  const description = getAdminDataSourceDescription('local')

  assert.match(description, /本机 local-dev/)
  assert.match(description, /媒体链接/)
  assert.match(description, /线上 R2|第三方/)
})
