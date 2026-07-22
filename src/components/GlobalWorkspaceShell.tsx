'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

type WorkspaceMenuIcon = 'home' | 'create' | 'edit' | 'video' | 'tools' | 'models' | 'library'
type WorkspaceMenuLabelKey = 'home' | 'createImage' | 'editImage' | 'createVideo' | 'imageTools' | 'models' | 'library'

interface WorkspaceMenuItem {
  labelKey: WorkspaceMenuLabelKey
  href: string
  icon: WorkspaceMenuIcon
}

const SITE_LOCALE_PREFIXES = new Set(['de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'])

const WORKSPACE_MENU_TRANSLATIONS: Record<string, Record<WorkspaceMenuLabelKey, string>> = {
  en: {
    home: 'Home',
    createImage: 'Create Image',
    editImage: 'Edit Image',
    createVideo: 'Create Video',
    imageTools: 'Image Tools',
    models: 'AI Models',
    library: 'Library',
  },
  de: {
    home: 'Startseite',
    createImage: 'Bild erstellen',
    editImage: 'Bild bearbeiten',
    createVideo: 'Video erstellen',
    imageTools: 'Bildtools',
    models: 'KI-Modelle',
    library: 'Bibliothek',
  },
  ja: {
    home: 'ホーム',
    createImage: '画像作成',
    editImage: '画像編集',
    createVideo: '動画作成',
    imageTools: '画像ツール',
    models: 'AIモデル',
    library: 'ライブラリ',
  },
  es: {
    home: 'Inicio',
    createImage: 'Crear imagen',
    editImage: 'Editar imagen',
    createVideo: 'Crear video',
    imageTools: 'Herramientas de imagen',
    models: 'Modelos IA',
    library: 'Biblioteca',
  },
  'zh-TW': {
    home: '首頁',
    createImage: '建立圖像',
    editImage: '編輯圖像',
    createVideo: '建立影片',
    imageTools: '圖像工具',
    models: 'AI 模型',
    library: '作品庫',
  },
  pt: {
    home: 'Início',
    createImage: 'Criar imagem',
    editImage: 'Editar imagem',
    createVideo: 'Criar vídeo',
    imageTools: 'Ferramentas de imagem',
    models: 'Modelos de IA',
    library: 'Biblioteca',
  },
  fr: {
    home: 'Accueil',
    createImage: 'Créer une image',
    editImage: 'Modifier une image',
    createVideo: 'Créer une vidéo',
    imageTools: 'Outils image',
    models: 'Modèles IA',
    library: 'Bibliothèque',
  },
  ko: {
    home: '홈',
    createImage: '이미지 만들기',
    editImage: '이미지 편집',
    createVideo: '동영상 만들기',
    imageTools: '이미지 도구',
    models: 'AI 모델',
    library: '라이브러리',
  },
  it: {
    home: 'Pagina iniziale',
    createImage: 'Crea immagine',
    editImage: 'Modifica immagine',
    createVideo: 'Crea video',
    imageTools: 'Strumenti immagine',
    models: 'Modelli IA',
    library: 'Libreria',
  },
}

const WORKSPACE_MENU_ITEMS: WorkspaceMenuItem[] = [
  { labelKey: 'home', href: '/', icon: 'home' },
  { labelKey: 'createImage', href: '/ai-image-generator', icon: 'create' },
  { labelKey: 'editImage', href: '/ai-image-to-image-generator', icon: 'edit' },
  { labelKey: 'createVideo', href: '/ai-video-generator', icon: 'video' },
  { labelKey: 'imageTools', href: '/ai-tools', icon: 'tools' },
  { labelKey: 'models', href: '/model', icon: 'models' },
  { labelKey: 'library', href: '/history', icon: 'library' },
]

function getSegments(pathname: string | null): string[] {
  return (pathname || '/').split('/').filter(Boolean)
}

function getPathWithoutLocale(pathname: string | null): string {
  const segments = getSegments(pathname)
  if (segments.length > 0 && SITE_LOCALE_PREFIXES.has(segments[0])) {
    return `/${segments.slice(1).join('/')}` || '/'
  }
  return `/${segments.join('/')}` || '/'
}

function getWorkspaceLocale(pathname: string | null): string {
  const [locale] = getSegments(pathname)
  return locale && SITE_LOCALE_PREFIXES.has(locale) ? locale : 'en'
}

function getWorkspaceMenuLabel(labelKey: WorkspaceMenuLabelKey, pathname: string | null): string {
  const locale = getWorkspaceLocale(pathname)
  return WORKSPACE_MENU_TRANSLATIONS[locale]?.[labelKey] || WORKSPACE_MENU_TRANSLATIONS.en[labelKey]
}

function getLocalizedWorkspaceHref(href: string, pathname: string | null): string {
  const segments = getSegments(pathname)
  const localePrefix = segments.length > 0 && SITE_LOCALE_PREFIXES.has(segments[0]) ? segments[0] : ''
  if (href === '/') return localePrefix ? `/${localePrefix}` : '/'
  return localePrefix ? `/${localePrefix}${href}` : href
}

function isWorkspaceMenuItemActive(href: string, pathname: string | null): boolean {
  const currentPath = getPathWithoutLocale(pathname)
  if (href === '/') return currentPath === '/'
  return currentPath === href || currentPath.startsWith(`${href}/`)
}

function WorkspaceMenuIconSvg({ icon }: { icon: WorkspaceMenuIcon }) {
  const commonProps = {
    className: 'h-5 w-5 shrink-0',
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 2,
    viewBox: '0 0 24 24',
    'aria-hidden': true,
  }

  if (icon === 'home') {
    return (
      <svg {...commonProps}>
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M5.5 10.5V20h13v-9.5" />
        <path d="M9.5 20v-6h5v6" />
      </svg>
    )
  }

  if (icon === 'create') {
    return (
      <svg {...commonProps}>
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <path d="M8 15l2.5-3 2 2.4 1.5-1.8L17 16" />
        <path d="M8 9h.01" />
      </svg>
    )
  }

  if (icon === 'edit') {
    return (
      <svg {...commonProps}>
        <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z" />
        <path d="m14 7 3 3" />
      </svg>
    )
  }

  if (icon === 'video') {
    return (
      <svg {...commonProps}>
        <rect x="3" y="6" width="13" height="12" rx="2" />
        <path d="m16 10 5-3v10l-5-3" />
      </svg>
    )
  }

  if (icon === 'tools') {
    return (
      <svg {...commonProps}>
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h16" />
        <path d="M8 4v4" />
        <path d="M15 10v4" />
        <path d="M11 16v4" />
      </svg>
    )
  }

  if (icon === 'models') {
    return (
      <svg {...commonProps}>
        <path d="M12 3 4.5 7.2 12 11.4l7.5-4.2L12 3Z" />
        <path d="M4.5 12 12 16.2 19.5 12" />
        <path d="M4.5 16.8 12 21l7.5-4.2" />
      </svg>
    )
  }

  return (
    <svg {...commonProps}>
      <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v15H7.5A2.5 2.5 0 0 0 5 20.5v-15Z" />
      <path d="M8 7h7" />
      <path d="M8 11h6" />
    </svg>
  )
}

function WorkspaceSidebar({ pathname }: { pathname: string | null }) {
  return (
    <nav
      aria-label="Toolaze workspace navigation"
      className="hidden xl:fixed xl:left-0 xl:top-0 xl:z-[80] xl:flex xl:h-dvh xl:w-48 flex-col gap-2 overflow-hidden border-r border-[#E0E7FF] bg-white p-4 shadow-lg shadow-[#4F46E5]/8"
    >
      {WORKSPACE_MENU_ITEMS.map((item) => {
        const isActive = isWorkspaceMenuItemActive(item.href, pathname)
        const label = getWorkspaceMenuLabel(item.labelKey, pathname)
        return (
          <a
            key={item.href}
            href={getLocalizedWorkspaceHref(item.href, pathname)}
            aria-current={isActive ? 'page' : undefined}
            className={`flex w-full items-center justify-start gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold leading-tight transition-colors ${
              isActive
                ? 'bg-[#EEF2FF] text-[#4F46E5]'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <WorkspaceMenuIconSvg icon={item.icon} />
            <span>{label}</span>
          </a>
        )
      })}
    </nav>
  )
}

export default function GlobalWorkspaceShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <>
      <WorkspaceSidebar pathname={pathname} />
      <div className="xl:pl-48">{children}</div>
    </>
  )
}
