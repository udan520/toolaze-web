interface ScenarioItem {
  icon?: string
  title: string
  desc?: string
  description?: string
}

interface ScenariosProps {
  title?: string
  scenarios?: ScenarioItem[]
  bgClass?: string
}

// 根据场景标题和描述智能生成 icon
function generateIconForScenario(scenario: ScenarioItem): string {
  const text = `${scenario.title} ${scenario.description || scenario.desc || ''}`.toLowerCase()
  
  // 关键词匹配规则
  const iconMap: Array<{ keywords: string[], icon: string }> = [
    { keywords: ['photographer', 'photo', 'camera', 'iphone', 'heic', 'image'], icon: '📸' },
    { keywords: ['social media', 'social', 'instagram', 'facebook', 'twitter', 'platform'], icon: '📱' },
    { keywords: ['office', 'productivity', 'email', 'business', 'work', 'professional'], icon: '💼' },
    { keywords: ['developer', 'web', 'code', 'programming', 'app', 'website'], icon: '💻' },
    { keywords: ['ecommerce', 'e-commerce', 'shop', 'store', 'product', 'selling'], icon: '🛒' },
    { keywords: ['designer', 'design', 'creative', 'art', 'graphic'], icon: '🎨' },
    { keywords: ['content creator', 'creator', 'blog', 'blogger', 'youtube'], icon: '📝' },
    { keywords: ['marketing', 'marketer', 'advertising', 'promotion'], icon: '📢' },
    { keywords: ['student', 'education', 'school', 'learning'], icon: '🎓' },
    { keywords: ['photography', 'photographer', 'photo', 'picture'], icon: '📷' },
  ]
  
  // 查找匹配的图标
  for (const { keywords, icon } of iconMap) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return icon
    }
  }
  
  // 默认图标
  return '💼'
}

export default function Scenarios({ title, scenarios, bgClass = 'bg-[#F8FAFF]' }: ScenariosProps) {
  if (!scenarios || scenarios.length === 0) return null

  return (
    <section className={`${bgClass} py-24 px-6`}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-slate-900 mb-12">{title || 'Use Cases'}</h2>
        <div className={`grid grid-cols-1 gap-6 ${
          scenarios.length === 2 
            ? 'md:grid-cols-2 md:max-w-4xl md:mx-auto md:justify-center' 
            : 'md:grid-cols-3'
        }`}>
          {scenarios.map((scenario: ScenarioItem, idx: number) => {
            // 如果没有 icon，根据场景内容自动生成
            const icon = scenario.icon || generateIconForScenario(scenario)
            
            return (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-indigo-50 shadow-sm flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                  idx === 0 ? 'bg-indigo-100' : idx === 1 ? 'bg-purple-100' : 'bg-blue-100'
                }`}>
                  <span className="flex items-center justify-center text-2xl leading-none">{icon}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  {scenario.title}
                </h3>
                <p className="desc-text">
                  {scenario.description || scenario.desc || ''}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
