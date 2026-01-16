interface ComparisonProps {
  data?: {
    toolaze: {
      features: string[]
    }
    competitors: {
      features: string[]
    }
  }
  compare?: {
    toolaze: string
    others: string
  }
  labels?: {
    smartChoice?: string
    toolaze?: string
    vs?: string
    otherTools?: string
  }
}

export default function Comparison({ data, compare, labels }: ComparisonProps) {
  if (!data && !compare) return null

  const smartChoice = labels?.smartChoice || 'Smart Choice'
  const toolazeLabel = labels?.toolaze || 'Toolaze 💎'
  const vsLabel = labels?.vs || 'VS'
  const otherToolsLabel = labels?.otherTools || 'Other Tools'

  // Support both old format (features array) and new format (string)
  if (compare) {
    return (
      <section className="py-24 px-6 bg-white relative overflow-hidden border-t border-indigo-50/50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 relative order-1">
            <div className="relative bg-white rounded-[2rem] p-10 shadow-2xl shadow-indigo-500/20 border border-white">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-brand text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-lg">{smartChoice}</div>
              <h3 className="font-bold text-slate-900 text-xl mb-8 border-b border-indigo-50 pb-4">{toolazeLabel}</h3>
              <p className="text-sm text-slate-700 leading-relaxed">{compare.toolaze}</p>
            </div>
          </div>
          <div className="hidden md:flex md:col-span-2 justify-center order-2 font-black text-indigo-200 text-2xl">{vsLabel}</div>
          <div className="md:col-span-5 bg-white/60 rounded-3xl p-8 border border-slate-200/60 opacity-80 grayscale order-3">
            <h3 className="font-bold text-slate-500 text-lg mb-8 border-b border-slate-200 pb-4">{otherToolsLabel}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{compare.others}</p>
          </div>
        </div>
      </section>
    )
  }

  if (data) {
    return (
      <section className="py-24 px-6 bg-white relative overflow-hidden border-t border-indigo-50/50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 relative order-1">
            <div className="relative bg-white rounded-[2rem] p-10 shadow-2xl shadow-indigo-500/20 border border-white">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-brand text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-lg">{smartChoice}</div>
              <h3 className="font-bold text-slate-900 text-xl mb-8 border-b border-indigo-50 pb-4">{toolazeLabel}</h3>
              <ul className="space-y-3 text-sm text-slate-700">
                {data.toolaze.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2" dangerouslySetInnerHTML={{ __html: feature }} />
                ))}
              </ul>
            </div>
          </div>
          <div className="hidden md:flex md:col-span-2 justify-center order-2 font-black text-indigo-200 text-2xl">{vsLabel}</div>
          <div className="md:col-span-5 bg-white/60 rounded-3xl p-8 border border-slate-200/60 opacity-80 grayscale order-3">
            <h3 className="font-bold text-slate-500 text-lg mb-8 border-b border-slate-200 pb-4">{otherToolsLabel}</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              {data.competitors.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2" dangerouslySetInnerHTML={{ __html: feature }} />
              ))}
            </ul>
          </div>
        </div>
      </section>
    )
  }

  return null
}
