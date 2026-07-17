import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import RewardReviewsClient from '@/components/admin/RewardReviewsClient'
import { isLocalAdminHost } from './localhost-only'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Reward Reviews - Toolaze Admin',
  description: 'Hidden Toolaze admin page for manually reviewing reward submissions.',
  robots: 'noindex, nofollow',
}

export default async function RewardReviewsPage() {
  const requestHeaders = await headers()
  const host = requestHeaders.get('x-forwarded-host') || requestHeaders.get('host') || ''

  if (!isLocalAdminHost(host)) {
    notFound()
  }

  return <RewardReviewsClient />
}
