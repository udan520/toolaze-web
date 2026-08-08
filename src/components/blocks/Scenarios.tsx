interface ScenarioItem {
  icon?: string
  title: string
  desc?: string
  description?: string
}

const SCENARIO_ICON_PATHS: Record<string, string[]> = {
  package: [
    'M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z',
    'm3.3 7 8.7 5 8.7-5M12 22V12',
  ],
  user: [
    'M20 21a8 8 0 0 0-16 0',
    'M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  ],
  film: [
    'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
    'M8 4v16M16 4v16M2 9h6m8 0h6M2 15h6m8 0h6',
  ],
  'shopping-bag': [
    'M6 8h12l1 13H5L6 8Z',
    'M9 10V6a3 3 0 0 1 6 0v4',
  ],
  layout: [
    'M3 3h18v18H3Z',
    'M3 9h18M9 9v12',
  ],
  music: [
    'M9 18V5l11-2v13',
    'M9 18a3 3 0 1 1-3-3h3M20 16a3 3 0 1 1-3-3h3',
  ],
  sparkles: [
    'm12 3-1.2 3.2a3 3 0 0 1-1.8 1.8L6 9l3 1.2a3 3 0 0 1 1.8 1.8l1.2 3 1.2-3a3 3 0 0 1 1.8-1.8L18 9l-3-1a3 3 0 0 1-1.8-1.8L12 3Z',
    'm5 16-.6 1.4A2 2 0 0 1 3 18l1.4.6A2 2 0 0 1 5 20l.6-1.4A2 2 0 0 1 7 18l-1.4-.6A2 2 0 0 1 5 16Z',
  ],
}

function ScenarioIcon({ name }: { name: string }) {
  const paths = SCENARIO_ICON_PATHS[name] || SCENARIO_ICON_PATHS.sparkles

  return (
    <svg aria-hidden="true" className="h-6 w-6 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths.map((path) => <path key={path} d={path} />)}
    </svg>
  )
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
            const iconName = /^[a-z][a-z0-9-]*$/.test(icon) ? icon : null
            
            return (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-indigo-50 shadow-sm flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                  idx === 0 ? 'bg-indigo-100' : idx === 1 ? 'bg-purple-100' : 'bg-blue-100'
                }`}>
                  {iconName
                    ? <ScenarioIcon name={iconName} />
                    : <span className="flex items-center justify-center text-2xl leading-none" aria-hidden="true">{icon}</span>}
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
