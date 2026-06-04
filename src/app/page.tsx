import type { Metadata } from 'next'
import { HomePageMain } from '@/components/home/HomePageMain'

// 确保静态生成
export const dynamic = 'force-static'
export const dynamicParams = false

export const metadata: Metadata = {
  title: 'Toolaze - Free AI Image Generator & AI Video Generator Online',
  description:
    'Free AI image generator and AI video generator online. Create 4K images with Nano Banana 2, generate videos with Seedance 2.0 and Kling 3.0. Text-to-image, text-to-video. No sign up required. Image compression and format conversion tools too.',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://toolaze.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://toolaze.com',
    siteName: 'Toolaze',
    title: 'Toolaze - Free AI Image Generator & AI Video Generator Online',
    description:
      'Free AI image generator and AI video generator online. Create 4K images with Nano Banana 2, generate videos with Seedance 2.0 and Kling 3.0. Text-to-image, text-to-video. No sign up required.',
    images: [
      {
        url: 'https://toolaze.com/web-app-manifest-512x512.png',
        width: 512,
        height: 512,
        alt: 'Toolaze Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toolaze - Free AI Image Generator & AI Video Generator Online',
    description:
      'Free AI image generator and AI video generator online. Create 4K images, generate videos. Text-to-image, text-to-video. No sign up required.',
    images: ['https://toolaze.com/web-app-manifest-512x512.png'],
  },
}

export default async function HomePage() {
  return <HomePageMain locale="en" />
}
