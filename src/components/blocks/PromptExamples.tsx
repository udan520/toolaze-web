'use client'

interface PromptExampleItem {
  title: string
  prompt: string
  image: string
}

interface PromptExamplesProps {
  title?: string
  subtitle?: string
  items?: PromptExampleItem[]
  bgClass?: string
}

export default function PromptExamples({
  title = 'Prompt Examples',
  subtitle,
  items = [],
  bgClass = 'bg-white',
}: PromptExamplesProps) {
  if (!items || items.length === 0) return null

  const handleUsePrompt = (prompt: string) => {
    window.dispatchEvent(new CustomEvent('toolaze:use-prompt', { detail: { prompt } }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className={`${bgClass} py-24 px-6`}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-slate-900 mb-4">{title}</h2>
        {subtitle && (
          <p className="desc-text text-center max-w-3xl mx-auto mb-12">{subtitle}</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.slice(0, 4).map((item, idx) => (
            <article key={`${item.title}-${idx}`} className="bg-white rounded-3xl border border-indigo-50 shadow-sm overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full aspect-[4/3] object-cover"
                loading="lazy"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{item.prompt}</p>
                <button
                  type="button"
                  onClick={() => handleUsePrompt(item.prompt)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200"
                  style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #9333EA 100%)' }}
                >
                  Use Prompt
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

