'use client'

import SiteImage from '@/components/SiteImage'

/**
 * ModelIntroBlock - 模型介绍页 SEO 板块
 *
 * 用于模型介绍页（如 Seedance 2.0）的 SEO 优化内容区块，包含：
 * 1. 顶部概览：H1 标题 + 多段描述 + 右侧配图或模型名占位
 * 2. 底部功能卡片：三个并列的功能/优势介绍卡片
 *
 * 设计规范：Style 1 (Soft Smart Tech)，遵循 SEO_MASTER_LAYOUT.md
 * 无图片时右侧显示模型名占位（如 "Seedance 2.0"）
 *
 * @example
 * <ModelIntroBlock
 *   title="Create Videos with Seedance 2.0 for Free"
 *   description={["..."]}
 *   modelName="Seedance 2.0"
 *   featureCards={[...]}
 * />
 */
export interface ModelIntroFeatureCard {
  title: string
  content: string
}

export interface ModelIntroImage {
  src: string
  alt: string
  width?: number
  height?: number
}

export interface ModelIntroBlockProps {
  /** H1 主标题 */
  title: string
  /** 描述段落（支持多段，每段可单独或合并） */
  description: string | string[]
  /** 右侧配图（可选，无图时用 modelName 占位） */
  image?: ModelIntroImage
  /** 模型名称，无图片时右侧占位显示 */
  modelName?: string
  /** 占位副标题，如 "AI Video Model" 或 "AI Image Model" */
  modelType?: string
  /** 底部三个功能卡片 */
  featureCards: [ModelIntroFeatureCard, ModelIntroFeatureCard, ModelIntroFeatureCard]
  /** 顶部区块背景色，默认 bg-[#F8FAFF] */
  topBgClass?: string
  /** 底部区块背景色，默认 bg-white */
  bottomBgClass?: string
}

const CARD_BG_CLASSES = [
  'bg-indigo-50/80',
  'bg-purple-50/80',
  'bg-slate-50/80',
] as const

export default function ModelIntroBlock({
  title,
  description,
  image,
  modelName,
  modelType = 'AI Video Model',
  featureCards,
  topBgClass = 'bg-[#F8FAFF]',
  bottomBgClass = 'bg-white',
}: ModelIntroBlockProps) {
  const paragraphs = Array.isArray(description) ? description : [description]
  const showRightColumn = image || modelName

  return (
    <>
      {/* 顶部概览区块 */}
      <section className={`${topBgClass} py-24 px-6 border-t border-indigo-50/50`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* 左侧：标题 + 描述 */}
            <div className={showRightColumn ? 'lg:col-span-7' : 'lg:col-span-12'}>
              <h2 className="text-4xl font-extrabold text-slate-900 leading-tight mb-6">
                {title}
              </h2>
              <div className="space-y-4">
                {paragraphs.map((para, idx) => (
                  <p key={idx} className="text-base leading-relaxed text-slate-600">
                    {para}
                  </p>
                ))}
              </div>
            </div>
            {/* 右侧：配图或模型名占位 */}
            {showRightColumn && (
              <div className="lg:col-span-5 flex items-center justify-center min-h-[320px]">
                {image ? (
                  <div className="relative w-full rounded-[2.5rem] overflow-hidden shadow-lg shadow-indigo-500/20 border border-indigo-100/50">
                    <SiteImage
                      src={image.src}
                      alt={image.alt}
                      width={image.width ?? 600}
                      height={image.height ?? 400}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ) : modelName ? (
                  <div className="relative w-full aspect-[4/3] max-w-md rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-100 shadow-xl shadow-indigo-500/15 flex items-center justify-center group">
                    {/* 装饰性网格背景 */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
                    {/* 中心内容 */}
                    <div className="relative text-center px-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100/80 mb-6 group-hover:scale-105 transition-transform">
                        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="block text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                        {modelName}
                      </span>
                      <p className="mt-2 text-xs font-semibold text-slate-400 uppercase tracking-[0.2em]">
                        {modelType}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 底部功能卡片区块 */}
      <section className={`${bottomBgClass} py-24 px-6 border-t border-indigo-50/50`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featureCards.map((card, idx) => (
              <div
                key={idx}
                className={`${CARD_BG_CLASSES[idx]} rounded-[2.5rem] p-8 border border-indigo-100/50 shadow-sm hover:shadow-md transition-all`}
              >
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {card.title}
                </h3>
                <p className="text-base leading-relaxed text-slate-600">
                  {card.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
