interface FAQItem {
  q?: string
  a?: string
  question?: string
  answer?: string
}

interface FAQProps {
  title?: string
  items?: FAQItem[]
  bgClass?: string
}

export default function FAQ({ title, items, bgClass = 'bg-white' }: FAQProps) {
  if (!items || items.length === 0) return null

  const faqTitle = title || 'Frequently Asked Questions'

  return (
    <section className={`${bgClass} py-24 px-6`}>
      <div className="max-w-3xl mx-auto space-y-4">
        <h2 className="text-4xl font-extrabold text-center text-slate-900 mb-12">{faqTitle}</h2>
        {items.map((item: FAQItem, idx: number) => (
          <details key={idx} className="bg-[#F8FAFF] rounded-2xl p-6 border border-indigo-50">
            <summary className="font-bold text-slate-800 cursor-pointer flex items-center justify-between">
              {item.q || item.question}
              <span className="text-indigo-600 text-xl">+</span>
            </summary>
            <p 
              className="desc-text mt-4"
              dangerouslySetInnerHTML={{ __html: item.a || item.answer || '' }}
            />
          </details>
        ))}
      </div>
    </section>
  )
}
