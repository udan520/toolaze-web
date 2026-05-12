import type { Metadata } from 'next'
import Script from 'next/script'
import { HomePageMain } from '@/components/home/HomePageMain'
import { ALL_LOCALE_CODES, PREFERRED_LOCALE_STORAGE_KEY } from '@/lib/site-language-switch'

/** 在 hydration 前按 localStorage 跳转到 /ja 等，避免 Client 边界导致的首页白屏；仅作用于路径 `/`。 */
const HOME_ROOT_LOCALE_REDIRECT_SCRIPT = `(function(){try{var k=${JSON.stringify(PREFERRED_LOCALE_STORAGE_KEY)};var locs=${JSON.stringify([...ALL_LOCALE_CODES])};var path=typeof location!=='undefined'?location.pathname:'';if(path!=='/'&&path!=='')return;var raw=null;try{raw=localStorage.getItem(k);}catch(e1){}if(!raw||raw==='en'||locs.indexOf(raw)<0)return;location.replace('/'+raw);}catch(e2){}})();`

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
  return (
    <>
      <Script
        id="home-root-locale-redirect"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: HOME_ROOT_LOCALE_REDIRECT_SCRIPT }}
      />
      <HomePageMain locale="en" />
    </>
  )
}
