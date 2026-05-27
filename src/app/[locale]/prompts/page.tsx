import { redirect } from 'next/navigation'
import { SITE_LOCALES } from '@/lib/site-language-switch'

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return SITE_LOCALES
    .filter((locale) => locale.code !== 'en')
    .map((locale) => ({ locale: locale.code }))
}

export default function LocalizedPromptsPage() {
  redirect('/prompts')
}
