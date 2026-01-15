interface SpecsProps {
  data?: {
    engine?: string
    capacity?: string
    limit?: string
    logic?: string
    privacy?: string
    batch?: string
    formats?: string
    output?: string
  }
}

export default function Specs({ data }: SpecsProps) {
  if (!data) return null

  const specs = [
    data.engine && { label: 'Engine', value: data.engine },
    data.capacity && { label: 'Capacity', value: data.capacity },
    data.limit && { label: 'Limit', value: data.limit },
    data.logic && { label: 'Logic', value: data.logic },
    data.privacy && { label: 'Privacy', value: data.privacy },
    data.batch && { label: 'Batch', value: data.batch },
    data.formats && { label: 'Formats', value: data.formats },
    data.output && { label: 'Output', value: data.output },
  ].filter(Boolean) as Array<{ label: string; value: string }>

  if (specs.length === 0) return null

  return (
    <section className="py-24 px-6 bg-[#F8FAFF] border-t border-indigo-50/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-12">Technical Specifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {specs.map((spec, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl border border-indigo-50 shadow-sm">
              <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">{spec.label}</div>
              <div className="text-base font-semibold text-slate-900">{spec.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
