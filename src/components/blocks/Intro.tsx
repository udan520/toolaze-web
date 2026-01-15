interface IntroProps {
  title?: string
  content?: string
  data?: {
    title: string
    content: string
  }
}

export default function Intro({ title, content, data }: IntroProps) {
  const introTitle = title || data?.title
  const introContent = content || data?.content

  if (!introTitle && !introContent) return null

  return (
    <section className="py-24 px-6 bg-white border-t border-indigo-50/50">
      <div className="max-w-4xl mx-auto text-center">
        {introTitle && (
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
            {introTitle}
          </h2>
        )}
        {introContent && (
          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
            {introContent}
          </p>
        )}
      </div>
    </section>
  )
}
