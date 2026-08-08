'use client'

import { useCommonTranslations } from '@/lib/use-common-translations'

interface Wan30HeroPlaceholderProps {
  initialTranslations?: any
  titleHtml: React.ReactNode
  description?: string
}

export default function Wan30HeroPlaceholder({ initialTranslations, titleHtml, description }: Wan30HeroPlaceholderProps) {
  const text = useCommonTranslations(initialTranslations)?.common?.modelPlaceholders
  return (
    <header className="bg-[#F8FAFF] px-6 pb-12">
      <div className="max-w-4xl mx-auto text-center pt-8 mb-8">
        <h1 className="text-[40px] font-extrabold tracking-tight mb-4 leading-tight text-slate-900">{titleHtml}</h1>
        {description && <p className="desc-text text-lg md:text-xl max-w-3xl mx-auto">{description}</p>}
      </div>
      <div className="max-w-xl mx-auto rounded-2xl border border-indigo-100 bg-white p-10 text-center shadow-soft">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-2xl">W</div>
        <h2 className="text-2xl font-bold text-slate-900">{text?.comingSoon || 'Coming Soon'}</h2>
        <p className="mt-3 text-sm text-slate-500">{text?.wan30Description || 'Wan 3.0 video generation will be available here soon.'}</p>
      </div>
    </header>
  )
}
