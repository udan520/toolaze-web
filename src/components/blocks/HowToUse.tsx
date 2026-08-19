import HowToStepCards from '@/components/blocks/HowToStepCards'

interface Step {
  title: string
  desc?: string
  media?: {
    src: string
    alt: string
    width?: number
    height?: number
  }
}

interface HowToUseProps {
  title?: string
  steps?: Step[] | string[]
  bgClass?: string
}

export default function HowToUse({ title, steps, bgClass = 'bg-[#F8FAFF]' }: HowToUseProps) {
  if (!steps || steps.length === 0) return null
  const mediaSteps = steps.filter((step): step is Step => typeof step === 'object' && Boolean(step.media))
  const hasMediaForEveryStep = mediaSteps.length === steps.length

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
      <div className={`${hasMediaForEveryStep ? 'max-w-[1600px]' : 'max-w-6xl'} mx-auto`}>
        <h2 className="text-4xl font-extrabold text-center text-slate-900">
          {renderTitle()}
        </h2>
        <div className="mt-12">
          {hasMediaForEveryStep ? (
            <HowToStepCards
              steps={mediaSteps.map((step) => ({
                title: step.title,
                description: step.desc,
                media: step.media!,
              }))}
            />
          ) : (
            <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-2 lg:grid-cols-4">
              {steps.map((step: Step | string, idx: number) => (
                <div key={idx} className="group">
                  <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-brand text-2xl font-bold text-white shadow-xl shadow-indigo-100 ring-4 ring-white">
                    {idx + 1}
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-slate-800">
                    {typeof step === 'object' ? step.title : step}
                  </h3>
                  {typeof step === 'object' && step.desc ? (
                    <p className="desc-text mx-auto max-w-[320px]">{step.desc}</p>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
