import ToolCard from './ToolCard'

interface Tool {
  slug: string
  title: string
  description: string
  href: string
}

interface ToolGridProps {
  tools: Tool[]
  tryNowText?: string
  className?: string
}

export default function ToolGrid({ tools, tryNowText, className = '' }: ToolGridProps) {
  if (!tools || tools.length === 0) return null

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      {tools.map((tool, idx) => {
        const iconBgColors: Array<'indigo' | 'purple' | 'blue'> = ['indigo', 'purple', 'blue']
        const iconBgColor = iconBgColors[idx % 3] as 'indigo' | 'purple' | 'blue'

        return (
          <ToolCard
            key={tool.slug}
            title={tool.title}
            description={tool.description}
            href={tool.href}
            iconBgColor={iconBgColor}
            tryNowText={tryNowText}
          />
        )
      })}
    </div>
  )
}
