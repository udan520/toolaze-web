/**
 * 首页「Advanced AI」与「浏览器工具」网格中的工具清单。
 * usesAi：该工具在 Toolaze 上主要依赖云端 AI 生成 / API（与本地处理的压缩、转换等区分）。
 *
 * 若增删首页网格工具，请同步更新 scripts/admin-seo-server.js 中的 HOME_PREVIEW_* 常量。
 * Advanced AI 区块缩略图：`src/lib/home-advanced-ai-card-images.ts` 与 `HOME_ADVANCED_AI_CARD_IMAGES`（admin-seo-server.js）。
 */
export const HOME_GRID_TOOLS = [
  { id: 'ai-couple-photo-maker', usesAi: true },
  { id: 'watermark-remover', usesAi: true },
  { id: 'photo-restoration', usesAi: true },
  { id: 'image-compressor', usesAi: false },
  { id: 'image-converter', usesAi: false },
  { id: 'font-generator', usesAi: false },
  { id: 'emoji-copy-and-paste', usesAi: false },
] as const

export type HomeGridToolId = (typeof HOME_GRID_TOOLS)[number]['id']

export const HOME_ADVANCED_AI_TOOL_IDS: readonly HomeGridToolId[] = HOME_GRID_TOOLS.filter((t) => t.usesAi).map(
  (t) => t.id
)

export const HOME_UTILITY_TOOL_IDS: readonly HomeGridToolId[] = HOME_GRID_TOOLS.filter((t) => !t.usesAi).map(
  (t) => t.id
)

export function homeGridToolUsesAi(toolId: string): boolean {
  const row = HOME_GRID_TOOLS.find((t) => t.id === toolId)
  return row ? row.usesAi : false
}
