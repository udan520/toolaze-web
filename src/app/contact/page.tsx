import type { Metadata } from 'next'
import ContactPageContent from '../support-pages/ContactPageContent'
import { getContactPageCopy } from '../support-pages/support-page-copy'
import { loadCommonTranslations } from '@/lib/seo-loader'

const copy = getContactPageCopy('en')

export const metadata: Metadata = {
  title: copy.metadata.title,
  description: copy.metadata.description,
  robots: 'index, follow',
  alternates: {
    canonical: 'https://toolaze.com/contact',
  },
}

export default async function ContactPage() {
  const t = await loadCommonTranslations('en')
  return <ContactPageContent locale="en" copy={copy} initialTranslations={t} />
}
