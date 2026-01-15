interface HeroProps {
  title?: string
  subtitle?: string
  description?: string
  data?: {
    h1: string
    sub: string
    desc?: string
  }
}

export default function Hero({ title, subtitle, description, data }: HeroProps) {
  // Support both old and new prop formats
  const h1 = title || data?.h1 || ''
  const sub = subtitle || data?.sub || ''
  const desc = description || data?.desc || ''

  // Check if h1 contains HTML tags (like <span class="text-gradient">)
  const hasHtmlTags = /<[^>]+>/.test(h1)
  
  return (
    <header className="bg-[#F8FAFF] pb-12 px-6 border-b border-indigo-50/50">
      <div className="max-w-4xl mx-auto text-center pt-8 mb-12">
        <h1 
          className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-slate-900"
          dangerouslySetInnerHTML={hasHtmlTags ? { __html: h1 } : undefined}
        >
          {!hasHtmlTags && h1}
        </h1>
        <p className="desc-text text-lg md:text-xl max-w-2xl mx-auto">
          {sub}
        </p>
      </div>
    </header>
  )
}
