import { redirect } from 'next/navigation'

const SUPPORTED_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'] as const

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }))
}

/** 仅英文站有 `/ai-tools` 内容与 canonical；各语言前缀 URL 统一回英文 */
export default async function AiToolsLocalePage() {
  redirect('/ai-tools')
}
