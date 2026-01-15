import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="px-6 max-w-6xl mx-auto w-full mb-4">
      <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && <span className="text-slate-300">/</span>}
              {item.href ? (
                <Link href={item.href} className="hover:text-indigo-600 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-slate-900 font-medium">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}
