import type { Metadata } from 'next'
import { AiToolsPageContent } from './AiToolsPageContent'
import { getAiToolsPageCopy, getAiToolsPageMetadata } from './copy'

export const metadata: Metadata = getAiToolsPageMetadata('en')

export default function AIToolsPage() {
  const copy = getAiToolsPageCopy('en')
  return <AiToolsPageContent locale="en" pageCopy={copy} />
}
