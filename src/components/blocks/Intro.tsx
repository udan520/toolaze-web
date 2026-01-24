interface IntroProps {
  title?: string
  description?: string
  bgClass?: string
}

export default function Intro({ title, description, bgClass = 'bg-[#F8FAFF]' }: IntroProps) {
  if (!title && !description) return null

  // 支持新的结构：content 可以是数组（带标题）或字符串（向后兼容）
  let contentItems: Array<{ title?: string; text: string }> = []
  
  if (Array.isArray(description)) {
    // 新结构：数组格式，每个元素有 title 和 text
    contentItems = description.map((item: any) => ({
      title: item.title,
      text: item.text || item
    }))
  } else if (typeof description === 'string') {
    // 向后兼容：字符串格式，按 \n\n 分割
    const paragraphs = description.split('\n\n').filter(p => p.trim())
    contentItems = paragraphs.map(text => ({ text: text.trim() }))
  }

  return (
    <section className={`${bgClass} py-24 px-6 border-t border-indigo-50/50`}>
      <div className="max-w-6xl mx-auto">
        {/* 标题区域 - 居中显示 */}
        <div className="text-center mb-8">
          {title && (
            <h2 className="text-4xl font-extrabold text-slate-900 leading-tight mb-6">{title}</h2>
          )}
        </div>


        {/* 描述卡片 - 标题下方，两段文字变成两个有设计感的卡片 */}
        {contentItems.length > 0 && (
          <div className="max-w-5xl mx-auto mb-16">
            {contentItems.length >= 2 ? (
              // 两段文字：显示为两个卡片
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contentItems.slice(0, 2).map((item, idx) => (
                  <div 
                    key={idx} 
                    className="relative bg-white rounded-2xl p-8 border border-indigo-100/50 shadow-sm hover:shadow-md transition-all overflow-hidden group"
                  >
                    {/* 渐变背景装饰 */}
                    <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 ${
                      idx === 0 ? 'bg-indigo-400' : 'bg-purple-400'
                    }`}></div>
                    
                    {/* 卡片内容 */}
                    <div className="relative z-10 flex flex-col items-center text-center">
                      {/* 卡片图标/标识 - 居中 */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                        idx === 0 ? 'bg-indigo-100' : 'bg-purple-100'
                      }`}>
                        {idx === 0 ? (
                          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      
                      {/* H3 小标题 - SEO 友好 */}
                      {item.title && (
                        <h3 className="text-xl font-bold text-slate-900 mb-3">
                          {item.title}
                        </h3>
                      )}
                      
                      {/* 文字内容 - 居中，支持HTML链接 */}
                      <p 
                        className="text-base leading-relaxed text-slate-700"
                        dangerouslySetInnerHTML={{ __html: item.text }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : contentItems.length === 1 ? (
              // 只有一段：显示为单个卡片
              <div className="relative bg-white rounded-2xl p-8 border border-indigo-100/50 shadow-sm hover:shadow-md transition-all overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 bg-indigo-400"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-indigo-100">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  {contentItems[0].title && (
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      {contentItems[0].title}
                    </h3>
                  )}
                  <p 
                    className="text-base leading-relaxed text-slate-700"
                    dangerouslySetInnerHTML={{ __html: contentItems[0].text }}
                  />
                </div>
              </div>
            ) : null}
          </div>
        )}

      </div>
    </section>
  )
}
