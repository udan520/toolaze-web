interface FAQProps {
  items?: Array<{
    q: string
    a: string
  }>
  data?: Array<{
    q: string
    a: string
  }>
  showTitle?: boolean
  title?: string
}

export default function FAQ({ items, data, showTitle = true, title }: FAQProps) {
  const faqList = items || data || []
  if (!faqList || faqList.length === 0) return null

  const faqTitle = title || 'Frequently Asked Questions'

  return (
    <section className="py-24 px-6 bg-white border-t border-indigo-50/50">
      <div className="max-w-3xl mx-auto">
        {showTitle && (
          <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-12">{faqTitle}</h2>
        )}
        <div className="space-y-4">
          {faqList.map((item, index) => (
            <details key={index} className="bg-white rounded-2xl p-6 border border-indigo-50 hover:shadow-md transition-shadow">
              <summary className="font-bold text-slate-900 cursor-pointer flex items-center justify-between">
                <span>{item.q}</span>
                <span className="text-indigo-600 text-xl font-bold">+</span>
              </summary>
              <p className="text-sm text-slate-600 mt-4 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
