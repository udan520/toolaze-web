import { redirect } from 'next/navigation'

export const dynamic = 'force-static'
export const dynamicParams = true
export const revalidate = 86400

export function generateStaticParams(): Array<{ locale: string; id: string }> {
  return []
}

type LocalizedPromptDetailPageProps = {
  params: Promise<{ locale: string; id: string }>
}

export default async function LocalizedPromptDetailPage({ params }: LocalizedPromptDetailPageProps) {
  const { id } = await params
  redirect(`/prompts/${id}`)
}
