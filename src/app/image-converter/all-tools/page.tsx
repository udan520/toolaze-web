import type { Metadata } from 'next'
import LocalizedAllToolsPage, {
  generateMetadata as generateLocalizedMetadata,
} from '@/app/[locale]/image-converter/all-tools/page'

export const dynamic = 'force-static'

const englishParams = Promise.resolve({ locale: 'en' })

export async function generateMetadata(): Promise<Metadata> {
  return generateLocalizedMetadata({ params: englishParams })
}

export default function AllToolsPage() {
  return <LocalizedAllToolsPage params={englishParams} />
}
