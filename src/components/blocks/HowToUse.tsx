interface HowToUseProps {
  data: {
    steps: Array<{
      number: number
      title: string
      description: string
    }>
  }
  title?: string
}

export default function HowToUse({ data, title }: HowToUseProps) {
  if (!data || !data.steps || data.steps.length === 0) return null

  const sectionTitle = title || 'How to Use Toolaze?'

  return (
    <section className="py-24 px-6 bg-[#F8FAFF] border-t border-indigo-50/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-20">
          {sectionTitle.includes('Toolaze') ? (
            <>
              {sectionTitle.split('Toolaze')[0]}<span className="text-indigo-600">Toolaze</span>{sectionTitle.split('Toolaze')[1]}
            </>
          ) : (
            sectionTitle
          )}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
          {data.steps.map((step) => (
            <div key={step.number} className="group">
              <div className="w-20 h-20 mb-8 mx-auto rounded-full bg-gradient-brand flex items-center justify-center text-white shadow-xl shadow-indigo-100 ring-4 ring-white text-2xl font-bold">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{step.title}</h3>
              <p className="desc-text max-w-[240px] mx-auto">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
