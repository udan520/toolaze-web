import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{
    locale: string
  }>
}

export default async function LocalizedGptImage2Page({ params }: PageProps) {
  await params
  redirect('/model/gpt-image-2')
}

