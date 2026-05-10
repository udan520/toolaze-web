/**
 * 首页模型区 / Advanced AI 工具卡片文案：来自各语言 common.json#home.homepageToolCardSummaries，
 * 为提炼后的短描述，不直接使用 L2 SEO 长文（modelIntro / hero）。
 */
export type HomepageToolCardSummary = {
  /** 卡片标题（可选）；不填则沿用 L2 的 modelName / hero 标题 */
  cardTitle?: string
  /** 卡片正文：1–3 句要点 */
  summary?: string
}

export type HomepageToolCardSummaries = Record<string, HomepageToolCardSummary>

export type HomepageSummarizableCard = {
  tool: string
  title: string
  description: string
  featuredDesc?: string
  modelName?: string
  modelType?: string
}

export function applyHomepageToolCardSummary<T extends HomepageSummarizableCard>(
  card: T,
  summaries: HomepageToolCardSummaries | undefined
): T {
  if (!summaries || !card?.tool) return card
  const s = summaries[card.tool]
  if (!s || typeof s !== 'object') return card

  const summary = typeof s.summary === 'string' && s.summary.trim() ? s.summary.trim() : null
  const cardTitle = typeof s.cardTitle === 'string' && s.cardTitle.trim() ? s.cardTitle.trim() : null

  if (!summary && !cardTitle) return card

  return {
    ...card,
    ...(cardTitle ? { modelName: cardTitle, title: cardTitle } : {}),
    ...(summary ? { featuredDesc: summary, description: summary } : {}),
  }
}
