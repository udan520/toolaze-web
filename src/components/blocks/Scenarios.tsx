type ScenarioItem = {
  icon?: string
  title: string
  desc?: string
  description?: string
}

interface ScenariosProps {
  data?: ScenarioItem[]
  scenes?: Array<{
    title: string
    desc: string
  }>
}

export default function Scenarios({ data, scenes }: ScenariosProps) {
  const scenarioList: Array<{ title: string; desc?: string; description?: string; icon?: string }> = []
  
  if (data) {
    scenarioList.push(...data)
  }
  if (scenes) {
    scenarioList.push(...scenes.map(s => ({ title: s.title, desc: s.desc })))
  }
  
  if (scenarioList.length === 0) return null

  return (
    <section className="py-24 px-6 bg-[#F8FAFF] border-t border-indigo-50/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-12">Use Cases</h2>
        <div className={`grid grid-cols-1 gap-6 ${
          scenarioList.length === 2 
            ? 'md:grid-cols-2 md:max-w-4xl md:mx-auto md:justify-center' 
            : 'md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {scenarioList.map((scenario, index) => (
            <div key={index} className="bg-white p-8 rounded-3xl border border-indigo-50 hover:shadow-lg transition-shadow">
              {scenario.icon && (
                <div className="text-4xl mb-4">{scenario.icon}</div>
              )}
              <h3 className="text-xl font-bold text-slate-900 mb-2">{scenario.title}</h3>
              <p className="desc-text">
                {scenario.desc || scenario.description || ''}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
