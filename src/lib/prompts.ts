import fs from 'node:fs'
import path from 'node:path'

export type PromptItem = {
  rank: number
  model: string
  category: string
  title: string
  scenario?: string
  image?: string
  originalImage?: string
  resultImage?: string
  poster?: string
  videoUrl?: string
  handle?: string
  author?: string
  authorUrl?: string
  sourceUrl: string
  likes?: number
  views?: number | null
  retweets?: number
  replies?: number
  bookmarks?: number | null
  quotes?: number
  published?: string
  tweetId: string
  prompt: string
  promptStatus?: string
  promptSource?: string
}

const PROMPTS_DATA_FILE = path.join(process.cwd(), 'public/prompts-data.json')

export function getPromptItems(): PromptItem[] {
  if (!fs.existsSync(PROMPTS_DATA_FILE)) return []

  const source = fs.readFileSync(PROMPTS_DATA_FILE, 'utf8')
  try {
    return (JSON.parse(source) as PromptItem[]).sort((a, b) => Number(a.rank || 0) - Number(b.rank || 0))
  } catch {
    return []
  }
}

export function getPromptItem(id: string): PromptItem | null {
  return getPromptItems().find((item) => item.tweetId === id) ?? null
}

export function getPromptStats(items: PromptItem[]) {
  return {
    total: items.length,
    likes: items.reduce((sum, item) => sum + Number(item.likes || 0), 0),
    views: items.reduce((sum, item) => sum + Number(item.views || 0), 0),
  }
}

export function getRelatedPromptItems(baseItem: PromptItem, limit = 6): PromptItem[] {
  const tokens = new Set(
    [baseItem.title, baseItem.category, baseItem.model, baseItem.prompt]
      .join(' ')
      .toLowerCase()
      .match(/[a-z0-9]+/g)
      ?.filter((token) => token.length > 2) ?? []
  )

  return getPromptItems()
    .filter((item) => item.tweetId !== baseItem.tweetId)
    .map((item) => {
      const haystack = [item.title, item.category, item.model, item.prompt].join(' ').toLowerCase()
      let score = item.category === baseItem.category ? 60 : 0
      if (item.model === baseItem.model) score += 30
      tokens.forEach((token) => {
        if (haystack.includes(token)) score += 3
      })
      return { item, score }
    })
    .sort((a, b) => b.score - a.score || Number(b.item.likes || 0) - Number(a.item.likes || 0))
    .slice(0, limit)
    .map(({ item }) => item)
}

export const promptsDataFile = path.normalize(PROMPTS_DATA_FILE)
