interface ModelComparisonColumnHeaders {
  metric?: string
  baseline?: string
  middle?: string
  target?: string
}

interface ModelComparisonRow {
  label: string
  baseline: string
  middle?: string
  target: string
}

interface ModelComparisonTableProps {
  title?: string
  subtitle?: string
  featuredColumn?: 'baseline' | 'middle' | 'target'
  rows?: ModelComparisonRow[]
  columnHeaders?: ModelComparisonColumnHeaders
  bgClass?: string
}

export default function ModelComparisonTable({
  title,
  subtitle,
  featuredColumn = 'target',
  rows,
  columnHeaders,
  bgClass = 'bg-white',
}: ModelComparisonTableProps) {
  if (!rows || rows.length === 0) return null
  const hasMiddleColumn = Boolean(columnHeaders?.middle || rows.some((row) => row.middle))
  const featuredHeaderClass = 'text-indigo-700'
  const regularHeaderClass = 'text-slate-900'
  const getHeaderTone = (column: 'baseline' | 'middle' | 'target') =>
    featuredColumn === column ? featuredHeaderClass : regularHeaderClass
  const getCellTone = (column: 'baseline' | 'middle' | 'target') =>
    featuredColumn === column
      ? 'text-slate-800 bg-indigo-50/30 font-medium'
      : 'text-slate-600'

  return (
    <section className={`${bgClass} py-24 px-6`}>
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-slate-900 mb-12">
          {title || 'Model Comparison'}
        </h2>
        {subtitle && (
          <p className="-mt-8 mb-10 mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600">
            {subtitle}
          </p>
        )}
        <div className="bg-white rounded-3xl border-2 border-indigo-200 shadow-lg shadow-indigo-100/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className={`w-full ${hasMiddleColumn ? 'min-w-[980px]' : 'min-w-[760px]'}`}>
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b-2 border-indigo-200">
                  <th className={`${hasMiddleColumn ? 'w-[18%]' : 'w-[22%]'} px-6 py-4 text-left text-sm font-bold text-slate-900`}>
                    {columnHeaders?.metric || 'Comparison Point'}
                  </th>
                  <th className={`${hasMiddleColumn ? 'w-[27%]' : 'w-[39%]'} px-6 py-4 text-left text-sm font-bold ${getHeaderTone('baseline')}`}>
                    {columnHeaders?.baseline || 'Seedance 2.0'}
                  </th>
                  {hasMiddleColumn && (
                    <th className={`w-[27%] px-6 py-4 text-left text-sm font-bold ${getHeaderTone('middle')}`}>
                      {columnHeaders?.middle || 'Middle option'}
                    </th>
                  )}
                  <th className={`${hasMiddleColumn ? 'w-[28%]' : 'w-[39%]'} px-6 py-4 text-left text-sm font-bold ${getHeaderTone('target')}`}>
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
                    <td className={`px-6 py-5 text-sm align-top leading-relaxed ${getCellTone('baseline')}`}>
                      {row.baseline}
                    </td>
                    {hasMiddleColumn && (
                      <td className={`px-6 py-5 text-sm align-top leading-relaxed ${getCellTone('middle')}`}>
                        {row.middle}
                      </td>
                    )}
                    <td className={`px-6 py-5 text-sm align-top leading-relaxed ${getCellTone('target')}`}>
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
