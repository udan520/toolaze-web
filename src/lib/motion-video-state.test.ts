import assert from 'node:assert/strict'
import test from 'node:test'
import { replaceRemoteMotionVideoState } from './motion-video-state'

test('concurrent remote replacements reduce against the latest aligned motion video state', () => {
  const localA = { id: 'local-a' }
  const localB = { id: 'local-b' }
  const replacementA = { id: 'replacement-a' }
  const replacementB = { id: 'replacement-b' }

  const initialState = {
    remoteUrls: ['remote-a', 'remote-b', 'remote-c'],
    remoteDurations: [3, 8, 13],
    localItems: [localA, localB],
  }
  const afterBCompletes = replaceRemoteMotionVideoState({
    ...initialState,
    targetRemoteUrl: 'remote-b',
    nextItem: replacementB,
  })
  const result = replaceRemoteMotionVideoState({
    ...afterBCompletes,
    targetRemoteUrl: 'remote-a',
    nextItem: replacementA,
  })

  assert.deepEqual(result.remoteUrls, ['remote-c'])
  assert.deepEqual(result.remoteDurations, [13])
  assert.deepEqual(result.localItems, [localA, localB, replacementB, replacementA])
  assert.deepEqual(
    result.remoteUrls.map((url, index) => [url, result.remoteDurations[index]]),
    [['remote-c', 13]],
  )
})
