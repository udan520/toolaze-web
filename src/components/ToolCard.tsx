import Link from 'next/link'

interface ToolCardProps {
  title: string
  description: string
  href: string
  icon?: string
  iconBgColor?: 'indigo' | 'purple' | 'blue'
  tryNowText?: string
  className?: string
}

export default function ToolCard({
  title,
  description,
  href,
  icon = '🖼️',
  iconBgColor = 'indigo',
  tryNowText = 'Try Now →',
  className = ''
}: ToolCardProps) {
  const bgColorClasses = {
    indigo: 'bg-indigo-100',
    purple: 'bg-purple-100',
    blue: 'bg-blue-100'
  }

  return (
    <Link
      href={href}
      className={`p-6 rounded-3xl border border-indigo-50 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group ${className || 'bg-white'}`}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 ${bgColorClasses[iconBgColor]}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
        {title}
      </h3>
      <p className="desc-text text-sm line-clamp-2">
        {description}
      </p>
      <div className="mt-4 text-sm font-bold text-indigo-600 group-hover:text-purple-600 transition-colors">
        {tryNowText}
      </div>
    </Link>
  )
}
