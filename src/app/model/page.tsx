import type { Metadata } from 'next'
import { ModelPageContent } from './ModelPageContent'
import { getModelPageCopy, getModelPageMetadata } from './copy'

export const metadata: Metadata = getModelPageMetadata('en')

export default function ModelPage() {
  const copy = getModelPageCopy('en')
  return <ModelPageContent locale="en" pageCopy={copy} />
}
