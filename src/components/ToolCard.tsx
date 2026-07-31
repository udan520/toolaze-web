import Link from 'next/link'

interface ToolCardMedia {
  type: 'image' | 'video'
  src: string
  poster?: string
  alt?: string
}

interface ToolCardProps {
  title: string
  description: string
  href: string
  icon?: string
  iconBgColor?: 'indigo' | 'purple' | 'blue'
  media?: ToolCardMedia
  tryNowText?: string
  className?: string
}

export default function ToolCard({
  title,
  description,
  href,
  icon = '🖼️',
  iconBgColor = 'indigo',
  media,
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
      className={`group flex h-full flex-col rounded-3xl border border-indigo-50 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md ${media?.src ? 'p-5' : 'p-6'} ${className || 'bg-white'}`}
    >
      {media?.src ? (
        <div
          data-tool-card-media
          className="mb-5 aspect-video w-full overflow-hidden rounded-2xl border border-indigo-50 bg-slate-100"
        >
          {media.type === 'video' ? (
            <video
              className="h-full w-full object-cover"
              src={media.src}
              poster={media.poster}
              aria-label={media.alt || title}
              autoPlay
              loop
              muted
              playsInline
              preload="none"
            />
          ) : (
            <img
              className="h-full w-full object-cover"
              src={media.src}
              alt={media.alt || title}
              loading="lazy"
              decoding="async"
            />
          )}
        </div>
      ) : (
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 ${bgColorClasses[iconBgColor]}`}>
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
        {title}
      </h3>
      <p className="desc-text text-sm line-clamp-2">
        {description}
      </p>
      <div className="mt-auto pt-4 text-sm font-bold text-indigo-600 transition-colors group-hover:text-purple-600">
        {tryNowText}
      </div>
    </Link>
  )
}
