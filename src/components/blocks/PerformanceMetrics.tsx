interface Metric {
  label: string
  value: string
}

interface PerformanceMetricsProps {
  title?: string
  metrics?: Metric[]
  bgClass?: string
  columnHeaders?: {
    metric?: string
    specification?: string
  }
}

export default function PerformanceMetrics({ title, metrics, bgClass = 'bg-white', columnHeaders }: PerformanceMetricsProps) {
  if (!metrics || metrics.length === 0) return null

  return (
    <section className={`${bgClass} py-24 px-6`}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-slate-900 mb-12">
          {title || 'Performance Metrics'}
        </h2>
        <div className="bg-white rounded-3xl border-2 border-indigo-200 shadow-lg shadow-indigo-100/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b-2 border-indigo-200">
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 uppercase tracking-wider">{columnHeaders?.metric || 'Performance Metric'}</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 uppercase tracking-wider">{columnHeaders?.specification || 'Toolaze Specification'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-100">
                {metrics.map((metric: Metric, idx: number) => (
                  <tr key={idx} className="hover:bg-indigo-50/30 transition-colors bg-white">
                    <td className="px-6 py-4 text-sm font-bold text-slate-800 whitespace-nowrap">
                      {metric.label}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                      {metric.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
