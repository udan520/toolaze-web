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

type BooleanCellKind = 'yes' | 'no'

const yesValues = new Set(['yes', 'ja', 'sí', 'oui', 'sì', 'sim', 'はい', '예', '是'])
const noValues = new Set(['no', 'nein', 'non', 'não', 'いいえ', '아니요', '否'])

function getBooleanCellKind(value?: string) {
  const normalized = value?.trim().toLowerCase()

  if (!normalized) return null
  if (yesValues.has(normalized)) return 'yes'
  if (noValues.has(normalized)) return 'no'

  return null
}

function BooleanComparisonIcon({ kind, label }: { kind: BooleanCellKind; label: string }) {
  const isSupported = kind === 'yes'

  return (
    <span aria-label={label} className="flex w-full items-center justify-center" role="img">
      <span
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${
          isSupported ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200' : 'bg-rose-50 text-rose-500 ring-1 ring-rose-200'
        }`}
      >
        {isSupported ? (
          <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 20 20">
            <path
              d="M5 10.2 8.4 13.5 15 6.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.4"
            />
          </svg>
        ) : (
          <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 20 20">
            <path
              d="m6.3 6.3 7.4 7.4m0-7.4-7.4 7.4"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.3"
            />
          </svg>
        )}
      </span>
    </span>
  )
}

function renderComparisonValue(value?: string) {
  const kind = getBooleanCellKind(value)

  if (kind) return <BooleanComparisonIcon kind={kind} label={value || kind} />

  return value
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
                      {renderComparisonValue(row.baseline)}
                    </td>
                    {hasMiddleColumn && (
                      <td className={`px-6 py-5 text-sm align-top leading-relaxed ${getCellTone('middle')}`}>
                        {renderComparisonValue(row.middle)}
                      </td>
                    )}
                    <td className={`px-6 py-5 text-sm align-top leading-relaxed ${getCellTone('target')}`}>
                      {renderComparisonValue(row.target)}
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
