import assert from 'node:assert/strict'
import test from 'node:test'
import { getCreemPromptModerationSetting } from './runtime-settings.mjs'

function createSettingsDb(rowValue) {
  return {
    prepare() {
      return {
        bind() {
          return {
            async first() {
              return rowValue === undefined ? null : { value: rowValue }
            },
          }
        },
      }
    },
  }
}

test('Creem prompt moderation defaults off when settings storage is unavailable', async () => {
  const setting = await getCreemPromptModerationSetting({})

  assert.equal(setting.enabled, false)
  assert.equal(setting.reason, 'settings_unbound')
})

test('Creem prompt moderation defaults off when the setting row is missing', async () => {
  const setting = await getCreemPromptModerationSetting({ DB: createSettingsDb(undefined) })

  assert.equal(setting.enabled, false)
  assert.equal(setting.reason, 'settings_missing')
})

test('Creem prompt moderation defaults off when the setting value is invalid', async () => {
  const setting = await getCreemPromptModerationSetting({ DB: createSettingsDb('unexpected') })

  assert.equal(setting.enabled, false)
  assert.equal(setting.reason, 'disabled_by_admin')
})
