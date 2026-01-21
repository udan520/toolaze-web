interface FeatureCardProps {
  icon: string
  title: string
  description: string
  iconBgColor?: 'indigo' | 'purple' | 'blue'
  className?: string
}

export default function FeatureCard({
  icon,
  title,
  description,
  iconBgColor = 'indigo',
  className = ''
}: FeatureCardProps) {
  const bgColorClasses = {
    indigo: 'bg-indigo-100',
    purple: 'bg-purple-100',
    blue: 'bg-blue-100'
  }

  return (
    <div className={`bg-[#F8FAFF] p-6 rounded-3xl border border-indigo-50 flex items-center gap-4 ${className}`}>
      <div className={`w-12 h-12 rounded-2xl ${bgColorClasses[iconBgColor]} flex items-center justify-center text-2xl`}>
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-slate-800">{title}</h4>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </div>
  )
}
