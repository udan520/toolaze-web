interface WhyToolazeProps {
  data: {
    headline: string
    description: string
    features: Array<{
      icon: string
      title: string
      description: string
    }>
  }
  badge?: string
}

export default function WhyToolaze({ data, badge }: WhyToolazeProps) {
  if (!data) return null

  const badgeText = badge || 'Why Toolaze?'

  return (
    <section className="bg-white py-24 px-6 border-t border-indigo-50/50">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="text-left space-y-6">
          <span className="text-xs font-bold text-purple-500 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full">
            {badgeText}
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">{data.headline}</h2>
          <p className="desc-text text-lg">{data.description}</p>
        </div>
        <div className="grid gap-4">
          {data.features.map((feature, index) => (
            <div key={index} className="bg-[#F8FAFF] p-6 rounded-3xl border border-indigo-50 hover:shadow-md transition-shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl flex-shrink-0">
                {feature.icon}
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{feature.title}</h4>
                <p className="text-xs text-slate-500">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
