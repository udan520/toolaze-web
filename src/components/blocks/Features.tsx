import React from 'react'

interface FeatureItem {
  icon?: string
  iconType?: string
  title: string
  desc?: string
  description?: string
}

interface FeaturesProps {
  title?: string
  features?: FeatureItem[]
  bgClass?: string
  layout?: 'default' | 'wide'
}

// 极简线条图标组件（indigo，极简线条风格）
const LineIcon = ({ type }: { type: string }) => {
  const icons: Record<string, React.ReactElement> = {
    privacy: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    speed: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    unlimited: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    batch: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      </svg>
    ),
    browser: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    easy: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    workflow: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8.5A2.5 2.5 0 016.5 6h3A2.5 2.5 0 0112 8.5v7A2.5 2.5 0 019.5 18h-3A2.5 2.5 0 014 15.5v-7zM14 7.5h2.5A3.5 3.5 0 0120 11v1.5a3.5 3.5 0 01-3.5 3.5H14m1.5-6l-2 2 2 2" />
      </svg>
    ),
    motion: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 15.5c2.4-4 5.1-4 7.5 0s5.1 4 7.5 0M5 8.5c2.4 4 5.1 4 7.5 0s5.1-4 7.5 0" />
      </svg>
    ),
    output: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 7.5A2.5 2.5 0 017.5 5h9A2.5 2.5 0 0119 7.5v9a2.5 2.5 0 01-2.5 2.5h-9A2.5 2.5 0 015 16.5v-9zM10 9l5 3-5 3V9z" />
      </svg>
    ),
    history: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.5 7.5A7 7 0 1112 19M6.5 7.5V4.5m0 3H10M12 8v4l2.5 1.5" />
      </svg>
    ),
    limits: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 7h14M8 7v10m8-10v10M5 17h14M9.5 12h5" />
      </svg>
    ),
    guidance: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 18h6M10 21h4M12 3a6 6 0 00-3 11.2c.7.4 1 1.1 1 1.8h4c0-.7.3-1.4 1-1.8A6 6 0 0012 3z" />
      </svg>
    ),
    layout: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5h14v14H5V5zm9 4h2v2h-2V9zm-6 6h3" />
      </svg>
    ),
    anchor: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 5v14M5 12h14M8 8.5A5.5 5.5 0 1112 17.5A5.5 5.5 0 018 8.5z" />
      </svg>
    ),
    texture: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 7.5c2.2-1.3 4.1-1.3 5.8 0s3.6 1.3 5.8 0M6 12h12M5 16.5c2.2 1.3 4.1 1.3 5.8 0s3.6-1.3 5.8 0" />
      </svg>
    ),
    typography: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 7h8M10 7v10M7 17h6M15 13h3m-3 4h3" />
      </svg>
    ),
    mood: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.5 4.5A7.5 7.5 0 1019.5 16A6 6 0 0117.5 4.5zM6.5 17.5h.01M9 19h.01" />
      </svg>
    ),
    accent: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 5.5c2.8 3 4.2 5.2 4.2 7.3A4.2 4.2 0 117.8 12.8c0-2.1 1.4-4.3 4.2-7.3zM17.5 6.5h1.8M18.4 5.6v1.8" />
      </svg>
    ),
    reference: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7.5A2.5 2.5 0 016.5 5h11A2.5 2.5 0 0120 7.5v9a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 014 16.5v-9zM8 9h8M8 12h5M8 15h3" />
      </svg>
    ),
    identity: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 12a3.5 3.5 0 100-7 3.5 3.5 0 000 7zm-6 7a6 6 0 0112 0M18 8h3m-1.5-1.5v3" />
      </svg>
    ),
    safety: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3l7 3v5c0 4.5-2.8 7.8-7 10-4.2-2.2-7-5.5-7-10V6l7-3zM9 12l2 2 4-4" />
      </svg>
    ),
  }
  return icons[type] || icons.guidance
}

const fallbackFeatureIconTypes = ['workflow', 'motion', 'output', 'history', 'limits', 'guidance'] as const

export default function Features({ title, features, bgClass = 'bg-white', layout = 'default' }: FeaturesProps) {
  if (!features || features.length === 0) return null

  // 根据标题匹配对应的图标类型
  const getIconType = (title: string) => {
    const titleLower = title.toLowerCase()
    if (titleLower.includes('fast') || titleLower.includes('speed')) return 'speed'
    if (titleLower.includes('privacy') || titleLower.includes('secure')) return 'privacy'
    if (titleLower.includes('unlimited') || titleLower.includes('free') || titleLower.includes('ad-free')) return 'unlimited'
    if (titleLower.includes('batch')) return 'batch'
    if (titleLower.includes('browser')) return 'browser'
    if (titleLower.includes('easy') || titleLower.includes('use')) return 'easy'
    if (titleLower.includes('image') || titleLower.includes('audio') || titleLower.includes('workflow')) return 'workflow'
    if (titleLower.includes('motion') || titleLower.includes('prompt')) return 'motion'
    if (titleLower.includes('output') || titleLower.includes('video')) return 'output'
    if (titleLower.includes('history') || titleLower.includes('result')) return 'history'
    if (titleLower.includes('limit')) return 'limits'
    if (titleLower.includes('guidance') || titleLower.includes('creator')) return 'guidance'
    return null
  }

  const sectionTitle = title || 'Key Features'
  const isWideLayout = layout === 'wide'
  const containerClass = isWideLayout
    ? 'mx-auto w-full max-w-6xl min-w-0'
    : 'mx-auto w-full max-w-[1440px] min-w-0'
  const gridClass = isWideLayout
    ? 'grid w-full min-w-0 grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8'
    : 'grid w-full min-w-0 grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3'
  const cardClass = isWideLayout
    ? 'min-w-0 rounded-xl bg-white p-7 shadow-sm lg:p-8'
    : 'min-w-0 rounded-lg bg-white p-6 shadow-sm'
  const sectionStyle: React.CSSProperties = isWideLayout
    ? {
        width: '100%',
        boxSizing: 'border-box',
      }
    : {
        width: '100%',
        position: 'relative',
        boxSizing: 'border-box',
      }

  return (
    <section
      className={`${bgClass} w-full max-w-full overflow-x-hidden px-6 py-24`}
      style={sectionStyle}
    >
      <div className={containerClass}>
        {/* H2 标题 */}
        <h2 className="mx-auto mb-12 max-w-4xl text-center text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl break-words">
          {sectionTitle}
        </h2>

        {/* 特性卡片网格 - 2x3 布局（6个特性点） */}
        <div className={gridClass}>
          {features.slice(0, 6).map((feature, idx) => {
            const featureObj = typeof feature === 'object' ? feature : { icon: '📂', title: feature, desc: '' }
            // 优先使用 iconType 字段，如果没有则根据标题匹配
            const iconType = featureObj.iconType || getIconType(featureObj.title)
            const featureIconType = iconType || (featureObj.icon ? null : fallbackFeatureIconTypes[idx % fallbackFeatureIconTypes.length])
            
            return (
              <div key={idx} className={cardClass}>
                {/* 图标 - 居中显示，indigo虚线圆圈边框，极简线条图标 */}
                <div className="flex flex-col items-center mb-4">
                  <div className="relative w-16 h-16 flex items-center justify-center mb-4">
                    {/* indigo虚线圆圈边框 */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 64 64">
                      <circle
                        cx="32"
                        cy="32"
                        r="30"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                        className="text-indigo-500"
                      />
                    </svg>
                    {/* 图标内容 - indigo（logo 主题色）极简线条图标 */}
                    <div className="relative z-10 text-indigo-600">
                      {featureIconType ? (
                        <LineIcon type={featureIconType} />
                      ) : featureObj.icon ? (
                        <span className="text-2xl">{featureObj.icon}</span>
                      ) : null}
                    </div>
                  </div>
                  
                  {/* 标题 - 粗体深灰色，居中 */}
                  <h4 className="mb-3 break-words text-center text-lg font-bold text-slate-900">
                    {featureObj.title}
                  </h4>
                  
                  {/* 描述 - 浅灰色段落，居中，支持HTML链接 */}
                  {(featureObj.desc || featureObj.description) && (
                    <p 
                      className="break-words text-center text-sm leading-relaxed text-slate-600"
                      dangerouslySetInnerHTML={{ __html: featureObj.desc || featureObj.description || '' }}
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
