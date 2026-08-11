interface ReplaceRemoteMotionVideoStateInput<T> {
  remoteUrls: string[]
  remoteDurations: number[]
  localItems: T[]
  targetRemoteUrl: string
  nextItem: T
}

export function replaceRemoteMotionVideoState<T>({
  remoteUrls,
  remoteDurations,
  localItems,
  targetRemoteUrl,
  nextItem,
}: ReplaceRemoteMotionVideoStateInput<T>) {
  const targetIndex = remoteUrls.indexOf(targetRemoteUrl)

  return {
    remoteUrls: remoteUrls.filter((_, itemIndex) => itemIndex !== targetIndex),
    remoteDurations: remoteDurations.filter((_, itemIndex) => itemIndex !== targetIndex),
    localItems: [...localItems, nextItem],
  }
}
