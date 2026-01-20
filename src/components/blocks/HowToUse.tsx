interface Step {
  title: string
  desc?: string
}

interface HowToUseProps {
  title?: string
  steps?: Step[] | string[]
  bgClass?: string
}

export default function HowToUse({ title, steps, bgClass = 'bg-[#F8FAFF]' }: HowToUseProps) {
  if (!steps || steps.length === 0) return null

  // 统一格式：所有标题都应该是 "How to [动作]" 格式
  // 如果没有提供标题，使用默认值 "How to Use Toolaze?"
  const defaultTitle = title || 'How to Use Toolaze?'
  
  // 处理标题中的 Toolaze 高亮
  const renderTitle = () => {
    if (defaultTitle.includes('Toolaze')) {
      const parts = defaultTitle.split('Toolaze')
      return (
        <>
          {parts[0]}<span className="text-indigo-600">Toolaze</span>{parts[1]}
        </>
      )
    }
    return defaultTitle
  }

  return (
    <section className={`${bgClass} py-24 px-6`}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-slate-900 mb-20">
          {renderTitle()}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
          {steps.map((step: Step | string, idx: number) => (
            <div key={idx} className="group">
              <div className="w-20 h-20 mb-8 mx-auto rounded-full bg-gradient-brand flex items-center justify-center text-white shadow-xl shadow-indigo-100 ring-4 ring-white text-2xl font-bold">
                {idx + 1}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {typeof step === 'object' ? step.title : step}
              </h3>
              {typeof step === 'object' && step.desc && (
                <p className="desc-text max-w-[240px] mx-auto">
                  {step.desc}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
