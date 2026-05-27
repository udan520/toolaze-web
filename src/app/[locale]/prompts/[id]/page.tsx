import { redirect } from 'next/navigation'
import { SITE_LOCALES } from '@/lib/site-language-switch'
import { getPromptItems } from '@/lib/prompts'

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  const localizedLocales = SITE_LOCALES.filter((locale) => locale.code !== 'en')

  return localizedLocales.flatMap((locale) =>
    getPromptItems().map((item) => ({
      locale: locale.code,
      id: item.tweetId,
    }))
  )
}

type LocalizedPromptDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function LocalizedPromptDetailPage({ params }: LocalizedPromptDetailPageProps) {
  const { id } = await params
  redirect(`/prompts/${id}`)
}
