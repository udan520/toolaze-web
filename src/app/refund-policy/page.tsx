import type { Metadata } from 'next'
import SupportPolicyPageContent from '../support-pages/SupportPolicyPageContent'
import { getSupportPolicyCopy } from '../support-pages/support-page-copy'
import { loadCommonTranslations } from '@/lib/seo-loader'

const copy = getSupportPolicyCopy('refundPolicy', 'en')

export const metadata: Metadata = {
  title: copy.metadata.title,
  description: copy.metadata.description,
  robots: 'index, follow',
  alternates: {
    canonical: 'https://toolaze.com/refund-policy',
  },
}

export default async function RefundPolicyPage() {
  const t = await loadCommonTranslations('en')
  return <SupportPolicyPageContent locale="en" copy={copy} initialTranslations={t} />
}
