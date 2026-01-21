import ToolGrid from './ToolGrid'
import ViewAllToolsButton from './ViewAllToolsButton'

interface Tool {
  slug: string
  title: string
  description: string
  href: string
}

interface MoreToolsSectionProps {
  title: string
  subtitle?: string
  tools: Tool[]
  viewAllHref: string
  viewAllText?: string
  tryNowText?: string
  bgClass?: string
}

export default function MoreToolsSection({
  title,
  subtitle,
  tools,
  viewAllHref,
  viewAllText,
  tryNowText,
  bgClass = 'bg-white'
}: MoreToolsSectionProps) {
  return (
    <section className={`${bgClass} py-24 px-6`}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-slate-900 mb-4">
          {title}
        </h2>
        {subtitle && (
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        {tools.length > 0 && (
          <ToolGrid tools={tools} tryNowText={tryNowText} className="mb-12" />
        )}
        <ViewAllToolsButton
          href={viewAllHref}
          text={viewAllText}
          variant="all"
        />
      </div>
    </section>
  )
}
