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
  }
  return icons[type] || icons.privacy
}

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
    return null
  }

  const sectionTitle = title || 'Key Features'
  const isWideLayout = layout === 'wide'
  const containerClass = isWideLayout
    ? 'mx-auto w-full max-w-6xl'
    : 'mx-auto w-full max-w-[1440px]'
  const gridClass = isWideLayout
    ? 'grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full'
    : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-full'
  const cardClass = isWideLayout
    ? 'bg-white p-7 lg:p-8 rounded-xl shadow-sm'
    : 'bg-white p-6 rounded-lg shadow-sm'
  const sectionStyle: React.CSSProperties = isWideLayout
    ? {
        width: '100%',
        boxSizing: 'border-box',
      }
    : {
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        paddingLeft: '24px',
        paddingRight: '24px',
        boxSizing: 'border-box',
      }

  return (
    <section
      className={`${bgClass} py-24 relative ${isWideLayout ? 'px-6' : ''}`}
      style={sectionStyle}
    >
      <div className={containerClass}>
        {/* H2 标题 */}
        <h2 className="text-4xl font-extrabold text-center text-slate-900 mb-12">
          {sectionTitle}
        </h2>

        {/* 特性卡片网格 - 2x3 布局（6个特性点） */}
        <div className={gridClass}>
          {features.slice(0, 6).map((feature, idx) => {
            const featureObj = typeof feature === 'object' ? feature : { icon: '📂', title: feature, desc: '' }
            // 优先使用 iconType 字段，如果没有则根据标题匹配
            const iconType = featureObj.iconType || getIconType(featureObj.title)
            
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
                      {iconType ? (
                        <LineIcon type={iconType} />
                      ) : featureObj.icon ? (
                        <span className="text-2xl">{featureObj.icon}</span>
                      ) : null}
                    </div>
                  </div>
                  
                  {/* 标题 - 粗体深灰色，居中 */}
                  <h4 className="font-bold text-slate-900 mb-3 text-lg text-center">
                    {featureObj.title}
                  </h4>
                  
                  {/* 描述 - 浅灰色段落，居中，支持HTML链接 */}
                  {(featureObj.desc || featureObj.description) && (
                    <p 
                      className="text-sm text-slate-600 leading-relaxed text-center"
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
