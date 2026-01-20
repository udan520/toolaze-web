interface ComparisonProps {
  compare?: {
    toolaze: string
    others: string
  }
  title?: string
  labels?: {
    smartChoice?: string
    toolaze?: string
    vs?: string
    otherTools?: string
  }
  bgClass?: string
}

export default function Comparison({ compare, title, labels, bgClass = 'bg-white' }: ComparisonProps) {
  if (!compare) return null

  const smartChoice = labels?.smartChoice || 'Smart Choice'
  const toolazeLabel = labels?.toolaze || 'Toolaze'
  const vsLabel = labels?.vs || 'VS'
  const otherToolsLabel = labels?.otherTools || 'Other Tools'
  const sectionTitle = title || 'Why Choose Toolaze?'

  return (
    <section className={`${bgClass} py-24 px-6 relative overflow-hidden`}>
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-4xl font-extrabold text-center text-slate-900 mb-16">{sectionTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          <div className="md:col-span-5 relative order-1">
            {/* Toolaze 卡片 - 增强视觉效果 */}
            <div className="relative bg-gradient-to-br from-white to-indigo-50/30 rounded-[2rem] p-10 shadow-2xl shadow-indigo-500/30 border-2 border-indigo-200/50 transform hover:scale-[1.02] transition-transform duration-300">
              {/* 顶部徽章 - 增强 */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-black uppercase px-6 py-2 rounded-full shadow-xl shadow-indigo-500/50 z-20">
                {smartChoice}
              </div>
              {/* 装饰性边框高光 */}
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-indigo-100/50 via-transparent to-purple-100/30 pointer-events-none"></div>
              <div className="relative z-10">
                <h3 className="font-extrabold text-slate-900 text-2xl mb-8 border-b-2 border-indigo-100 pb-4 flex items-center gap-2">
                  <span>{toolazeLabel}</span>
                  <span className="text-2xl">💎</span>
                </h3>
                <ul className="space-y-4 text-sm text-slate-800">
                  {compare.toolaze.split(', ').map((item: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-3 group">
                      <span className="text-green-600 font-bold text-lg flex-shrink-0 group-hover:scale-110 transition-transform">✅</span>
                      <span className="font-medium leading-relaxed">{item.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {/* VS 分隔符 - 增强 */}
          <div className="hidden md:flex md:col-span-2 justify-center items-center order-2 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-px h-full bg-gradient-to-b from-transparent via-indigo-300 to-transparent"></div>
            </div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center shadow-lg border-2 border-indigo-200">
              <span className="font-black text-indigo-600 text-xl">{vsLabel}</span>
            </div>
          </div>
          {/* Other Tools 卡片 - 增强可见度但保持弱化 */}
          <div className="md:col-span-5 bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-300/60 opacity-85 grayscale-[0.15] order-3 relative shadow-lg shadow-slate-200/50">
            {/* 弱化遮罩 - 减少强度 */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/40 to-slate-100/20 rounded-3xl pointer-events-none"></div>
            <div className="relative z-10">
              <h3 className="font-bold text-slate-500 text-lg mb-8 border-b border-slate-300/60 pb-4">{otherToolsLabel}</h3>
              <ul className="space-y-3 text-sm text-slate-500">
                {compare.others.split(', ').map((item: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-3">
                    <span className="text-red-500 font-bold text-lg flex-shrink-0">❌</span>
                    <span className="leading-relaxed">{item.trim()}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
