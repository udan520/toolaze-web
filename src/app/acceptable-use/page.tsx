import type { Metadata } from 'next'
import SupportPolicyPageContent from '../support-pages/SupportPolicyPageContent'
import { getSupportPolicyCopy } from '../support-pages/support-page-copy'
import { loadCommonTranslations } from '@/lib/seo-loader'

const copy = getSupportPolicyCopy('acceptableUse', 'en')

export const metadata: Metadata = {
  title: copy.metadata.title,
  description: copy.metadata.description,
  robots: 'index, follow',
  alternates: {
    canonical: 'https://toolaze.com/acceptable-use',
  },
}

export default async function AcceptableUsePage() {
  const t = await loadCommonTranslations('en')
  return <SupportPolicyPageContent locale="en" copy={copy} initialTranslations={t} />
}
