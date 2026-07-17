import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { AdminUser } from './users'
import { filterAndSortUsers } from './user-view'

const users: AdminUser[] = [
  {
    id: 'new',
    email: 'new@example.com',
    name: 'New User',
    avatarUrl: null,
    createdAt: '2026-07-10T00:00:00.000Z',
    updatedAt: '2026-07-10T00:00:00.000Z',
    signupPath: null,
    signupUrl: null,
    signupReferrer: null,
    lastLoginAt: null,
    creditBalance: 5,
    hasActiveSession: false,
    imageGenerationCount: 0,
    videoGenerationCount: 0,
    lastGenerationAt: null,
    recentModel: null,
    recentToolSlug: null,
    recentToolLabel: null,
    topToolSlug: null,
    topToolLabel: null,
    topToolCount: 0,
  },
  {
    id: 'active',
    email: 'active@example.com',
    name: 'Active Owner',
    avatarUrl: null,
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-07-09T00:00:00.000Z',
    signupPath: null,
    signupUrl: null,
    signupReferrer: null,
    lastLoginAt: '2026-07-09T00:00:00.000Z',
    creditBalance: 50,
    hasActiveSession: true,
    imageGenerationCount: 2,
    videoGenerationCount: 1,
    lastGenerationAt: '2026-07-09T00:00:00.000Z',
    recentModel: 'gpt-image-2',
    recentToolSlug: 'ai-image-generator',
    recentToolLabel: 'AI Image Generator',
    topToolSlug: 'ai-image-generator',
    topToolLabel: 'AI Image Generator',
    topToolCount: 2,
  },
  {
    id: 'older-active',
    email: 'older@example.com',
    name: null,
    avatarUrl: null,
    createdAt: '2026-06-01T00:00:00.000Z',
    updatedAt: '2026-07-08T00:00:00.000Z',
    signupPath: null,
    signupUrl: null,
    signupReferrer: null,
    lastLoginAt: '2026-07-08T00:00:00.000Z',
    creditBalance: 50,
    hasActiveSession: true,
    imageGenerationCount: 1,
    videoGenerationCount: 0,
    lastGenerationAt: '2026-07-08T00:00:00.000Z',
    recentModel: 'seedream-5-0-pro',
    recentToolSlug: 'ai-hairstyle-changer',
    recentToolLabel: 'AI Hairstyle Changer',
    topToolSlug: 'ai-hairstyle-changer',
    topToolLabel: 'AI Hairstyle Changer',
    topToolCount: 1,
  },
]

test('searches by email and name case-insensitively', () => {
  assert.deepEqual(
    filterAndSortUsers(users, {
      query: 'OWNER',
      session: 'all',
      sort: 'newest',
    }).map((user) => user.id),
    ['active'],
  )
})

test('filters active and inactive sessions', () => {
  assert.deepEqual(
    filterAndSortUsers(users, {
      query: '',
      session: 'active',
      sort: 'newest',
    }).map((user) => user.id),
    ['active', 'older-active'],
  )

  assert.deepEqual(
    filterAndSortUsers(users, {
      query: '',
      session: 'inactive',
      sort: 'newest',
    }).map((user) => user.id),
    ['new'],
  )
})

test('sorts credits descending and uses newest registration as tie-breaker', () => {
  assert.deepEqual(
    filterAndSortUsers(users, {
      query: '',
      session: 'all',
      sort: 'credits',
    }).map((user) => user.id),
    ['active', 'older-active', 'new'],
  )
})

test('sorts users without a login after users with a login', () => {
  assert.deepEqual(
    filterAndSortUsers(users, {
      query: '',
      session: 'all',
      sort: 'lastLogin',
    }).map((user) => user.id),
    ['active', 'older-active', 'new'],
  )
})

test('sorts users by recent generation and keeps users without generations last', () => {
  const mixedUsers = [
    {
      ...users[0],
      id: 'registered-newest-no-generation',
      createdAt: '2026-07-11T00:00:00.000Z',
      lastGenerationAt: null,
    },
    {
      ...users[1],
      id: 'generated-old',
      lastGenerationAt: '2026-07-08T00:00:00.000Z',
    },
    {
      ...users[2],
      id: 'generated-new',
      lastGenerationAt: '2026-07-10T00:00:00.000Z',
    },
  ]

  assert.deepEqual(
    filterAndSortUsers(mixedUsers, {
      query: '',
      session: 'all',
      sort: 'lastGeneration',
    }).map((user) => user.id),
    ['generated-new', 'generated-old', 'registered-newest-no-generation'],
  )
})

test('does not mutate the input array', () => {
  const originalIds = users.map((user) => user.id)

  filterAndSortUsers(users, {
    query: '',
    session: 'all',
    sort: 'credits',
  })

  assert.deepEqual(users.map((user) => user.id), originalIds)
})
