import { redirect } from 'next/navigation'
import { getPromptItems } from '@/lib/prompts'
import { SITE_LOCALES } from '@/lib/site-language-switch'

export const dynamic = 'force-static'
export const dynamicParams = false
export const revalidate = 86400

const PREGENERATED_PROMPT_DETAIL_LIMIT = 50

export function generateStaticParams(): Array<{ locale: string; id: string }> {
  const promptIds = getPromptItems()
    .slice(0, PREGENERATED_PROMPT_DETAIL_LIMIT)
    .map((item) => item.tweetId)

  return SITE_LOCALES.flatMap((locale) =>
    promptIds.map((id) => ({
      locale: locale.code,
      id,
    }))
  )
}

type LocalizedPromptDetailPageProps = {
  params: Promise<{ locale: string; id: string }>
}

export default async function LocalizedPromptDetailPage({ params }: LocalizedPromptDetailPageProps) {
  const { id } = await params
  redirect(`/prompts/${id}`)
}
