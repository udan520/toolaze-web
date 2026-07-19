interface ModelComparisonColumnHeaders {
  metric?: string
  baseline?: string
  target?: string
}

interface ModelComparisonRow {
  label: string
  baseline: string
  target: string
}

interface ModelComparisonTableProps {
  title?: string
  rows?: ModelComparisonRow[]
  columnHeaders?: ModelComparisonColumnHeaders
  bgClass?: string
}

export default function ModelComparisonTable({
  title,
  rows,
  columnHeaders,
  bgClass = 'bg-white',
}: ModelComparisonTableProps) {
  if (!rows || rows.length === 0) return null

  return (
    <section className={`${bgClass} py-24 px-6`}>
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-slate-900 mb-12">
          {title || 'Model Comparison'}
        </h2>
        <div className="bg-white rounded-3xl border-2 border-indigo-200 shadow-lg shadow-indigo-100/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b-2 border-indigo-200">
                  <th className="w-[22%] px-6 py-4 text-left text-sm font-bold text-slate-900">
                    {columnHeaders?.metric || 'Comparison Point'}
                  </th>
                  <th className="w-[39%] px-6 py-4 text-left text-sm font-bold text-slate-900">
                    {columnHeaders?.baseline || 'Seedance 2.0'}
                  </th>
                  <th className="w-[39%] px-6 py-4 text-left text-sm font-bold text-indigo-700">
                    {columnHeaders?.target || 'Seedance 2.5'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-100">
                {rows.map((row, idx) => (
                  <tr key={idx} className="bg-white hover:bg-indigo-50/30 transition-colors">
                    <td className="px-6 py-5 text-sm font-bold text-slate-800 align-top whitespace-nowrap">
                      {row.label}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600 align-top leading-relaxed">
                      {row.baseline}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-800 align-top leading-relaxed bg-indigo-50/30 font-medium">
                      {row.target}
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
