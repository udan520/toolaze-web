'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import CloseIcon from './icons/CloseIcon'
import { getClientMenuItems, type ClientMenuItem } from '@/lib/client-menu-data'
import {
  PREFERRED_LOCALE_STORAGE_KEY,
  SITE_LOCALES,
  getAlternateLanguageUrl,
  getCurrentLocaleFromPath,
  getPreferredLocalizedUrl,
  getSupportedLocaleCodes,
  isSiteLocaleCode,
  resolveLocaleForPath,
  shouldShowLanguageSwitcher,
} from '@/lib/site-language-switch'

// 翻译数据(默认英语)
const defaultNavTranslations = {
  language: 'Language',
  quickTools: 'Quick Tools',
  aiTools: 'AI Tools',
  imageCompression: 'Image Compression',
  imageConverter: 'Image Converter',
  watermarkRemover: 'Watermark Remover',
  photoRestoration: 'Photo Restoration',
  aiCouplePhotoMaker: 'AI Couple Photo Maker',
  fontGenerator: 'Font Generator',
  emojiCopyAndPaste: 'Emoji Copy & Paste',
  aiImage: 'AI Image',
  aiVideo: 'AI Video',
  nanoBananaPro: 'Nano Banana Pro',
  nanoBanana2: 'Nano Banana 2',
  gptImage2: 'GPT Image 2',
  seedance2: 'Seedance 2.0',
  kling3: 'Kling 3.0',
  promptLibrary: 'Prompts',
  allPrompts: 'All Prompts',
  promptModels: 'Model',
  promptScenes: 'Scenes',
  kling: 'Kling',
  nanoBanana: 'Nano Banana',
  advertising: 'Advertising',
  fashionBeauty: 'Fashion & Beauty',
  filmTrailer: 'Film & Trailer',
  aboutUs: 'About Us',
  viewAllAiTools: 'View All AI Tools',
  emojiMenu: {
    'crying-copy-and-paste': 'Crying Emoji Copy and Paste',
    'cross-copy-and-paste': 'Cross Emoji Copy and Paste',
    'adults-only-copy-and-paste': 'Adults Only Emoji Copy and Paste',
    'fire-copy-and-paste': 'Fire Emoji Copy and Paste',
    'birthday-copy-and-paste': 'Birthday Emoji Copy and Paste',
    'cat-copy-and-paste': 'Cat Emoji Copy and Paste',
  },
}

const AI_TOOLS_DEMO_IMAGES = {
  watermarkRemover:
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
  photoRestoration:
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80',
  aiCouplePhotoMaker: '/ai-couple-photo-maker/rainy-eiffel-4x3.jpg',
}

function getInitialNavTranslations(initialTranslations?: any) {
  if (!initialTranslations) return defaultNavTranslations
  return {
    ...defaultNavTranslations,
    ...(initialTranslations.nav || {}),
    language: initialTranslations.footer?.language || defaultNavTranslations.language,
  }
}

interface NavigationProps {
  initialTranslations?: any
}

export default function Navigation({ initialTranslations }: NavigationProps = {}) {
  const navRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedSubmenus, setExpandedSubmenus] = useState<Set<string>>(new Set())
  const [navTranslations, setNavTranslations] = useState(getInitialNavTranslations(initialTranslations))
  const [thirdLevelMenuData, setThirdLevelMenuData] = useState<Record<string, ClientMenuItem[]>>({
    'image-compressor': [],
    'image-converter': [],
    'font-generator': [],
    'emoji-copy-and-paste': []
  })
  const [isMounted, setIsMounted] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)
  const pathname = usePathname()

  const currentLocale = getCurrentLocaleFromPath(pathname ?? null)

  const [navLangOpen, setNavLangOpen] = useState(false)

  const navSupportedLocales = useMemo(() => {
    const codes = getSupportedLocaleCodes(pathname ?? null)
    return SITE_LOCALES.filter((l) => codes.includes(l.code))
  }, [pathname])

  const showNavLanguageSwitcher = shouldShowLanguageSwitcher(pathname ?? null)
  const navEffectiveLocale = resolveLocaleForPath(pathname || '/', currentLocale)
  const navCurrentLocaleInfo = SITE_LOCALES.find((l) => l.code === navEffectiveLocale) || SITE_LOCALES[0]
  const navOtherLocales = navSupportedLocales.length === 1
    ? navSupportedLocales
    : navSupportedLocales.filter((l) => l.code !== navEffectiveLocale)
  
  // 翻译由 server page 作为 initialTranslations 传入，避免客户端打包全部 common.json。
  useEffect(() => {
    setIsMounted(true)
    setNavTranslations(getInitialNavTranslations(initialTranslations))
  }, [initialTranslations])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const firstSegment = (pathname ?? '').split('/').filter(Boolean)[0] ?? ''
    const hasExplicitLocale = isSiteLocaleCode(firstSegment)
    if (hasExplicitLocale) {
      window.localStorage.setItem(PREFERRED_LOCALE_STORAGE_KEY, currentLocale)
    }
  }, [pathname, currentLocale])

  useEffect(() => {
    setNavLangOpen(false)
  }, [pathname])

  // 运行时兜底：仅在移动端渲染 H5 菜单按钮，避免桌面端误显示
  useEffect(() => {
    if (typeof window === 'undefined') return
    const updateViewport = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    updateViewport()
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [])
  
  // 加载三级菜单数据：客户端菜单只依赖轻量元数据，避免把服务端 SEO loader 打进浏览器包。
  useEffect(() => {
    setThirdLevelMenuData({
      'image-compressor': getClientMenuItems('image-compressor', navEffectiveLocale, navTranslations),
      'image-converter': getClientMenuItems('image-converter', navEffectiveLocale, navTranslations),
      'font-generator': getClientMenuItems('font-generator', navEffectiveLocale, navTranslations),
      'emoji-copy-and-paste': getClientMenuItems('emoji-copy-and-paste', navEffectiveLocale, navTranslations),
    })
  }, [navEffectiveLocale, pathname, navTranslations])

  const getLocalizedHref = (href: string): string => {
    if (href.startsWith('http')) return href
    return getPreferredLocalizedUrl(href, navEffectiveLocale)
  }
  
  // 获取三级菜单项的函数（使用已加载的数据）
  const getThirdLevelItems = (tool: string): ClientMenuItem[] => {
    return thirdLevelMenuData[tool] || []
  }

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    // Simple scroll handler - only manages scrolled class
    // Let CSS handle sticky positioning completely
    const handleScroll = () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop
      if (currentScroll > 50) {
        nav.classList.add('scrolled')
      } else {
        nav.classList.remove('scrolled')
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // 点击外部关闭移动端菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen && menuRef.current && !menuRef.current.contains(event.target as Node) && navRef.current && !navRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false)
        setExpandedSubmenus(new Set())
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [mobileMenuOpen])


  // 二级菜单项（动态生成以包含语言前缀）
  const secondLevelItems = [
    {
      title: navTranslations.imageCompression,
      href: getLocalizedHref('/image-compressor'),
      hasThirdLevel: true,
      tool: 'image-compressor',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 flex-shrink-0">
          {/* 四个绿色方块，表示压缩 */}
          <rect x="3" y="3" width="7" height="7" rx="1.5" fill="#10B981"/>
          <rect x="14" y="3" width="7" height="7" rx="1.5" fill="#10B981"/>
          <rect x="3" y="14" width="7" height="7" rx="1.5" fill="#10B981"/>
          <rect x="14" y="14" width="7" height="7" rx="1.5" fill="#10B981"/>
          {/* 向内箭头（左上和右下） */}
          <path d="M6.5 6.5L9 9M9 6.5L6.5 9" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17.5 17.5L15 15M15 17.5L17.5 15" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          {/* 向外箭头（右上和左下） */}
          <path d="M17.5 6.5L15 9M15 6.5L17.5 9" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6.5 17.5L9 15M9 17.5L6.5 15" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: navTranslations.fontGenerator || defaultNavTranslations.fontGenerator,
      href: getLocalizedHref('/font-generator'),
      hasThirdLevel: true,
      tool: 'font-generator',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 flex-shrink-0">
          {/* 字体图标 - 使用紫色渐变 */}
          <rect x="3" y="4" width="18" height="16" rx="2" fill="url(#fontGradient)" opacity="0.2"/>
          <path d="M7 8H17M7 12H15M7 16H13" stroke="url(#fontGradient)" strokeWidth="2" strokeLinecap="round"/>
          <defs>
            <linearGradient id="fontGradient" x1="3" y1="4" x2="21" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9333EA"/>
              <stop offset="1" stopColor="#4F46E5"/>
            </linearGradient>
          </defs>
        </svg>
      ),
    },
    {
      title: navTranslations.imageConverter,
      href: getLocalizedHref('/image-converter'),
      hasThirdLevel: true,
      tool: 'image-converter',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 flex-shrink-0">
          {/* 浅蓝色背景矩形 */}
          <rect x="2" y="2" width="20" height="20" rx="2.5" fill="#93C5FD" opacity="0.4"/>
          {/* 深蓝色转换箭头（对角线） */}
          <path d="M5 5L19 19M19 5L5 19" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round"/>
          {/* 图片图标（前景） */}
          <rect x="7" y="9" width="10" height="7" rx="1.5" fill="#3B82F6"/>
          <circle cx="9.5" cy="11.5" r="0.8" fill="white"/>
          <path d="M11.5 13.5L13.5 11.5L15.5 13.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      ),
    },
    {
      title: navTranslations.emojiCopyAndPaste || defaultNavTranslations.emojiCopyAndPaste,
      href: getLocalizedHref('/emoji-copy-and-paste'),
      hasThirdLevel: true,
      tool: 'emoji-copy-and-paste',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 flex-shrink-0">
          <circle cx="12" cy="12" r="10" fill="#FCD34D" opacity="0.9"/>
          <circle cx="9" cy="10" r="1.25" fill="#78350F"/>
          <circle cx="15" cy="10" r="1.25" fill="#78350F"/>
          <path d="M8 14c0 0 1.5 2 4 2s4-2 4-2" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
  ]

  const promptMenuGroups = [
    {
      title: navTranslations.promptModels || defaultNavTranslations.promptModels,
      key: 'prompt-models',
      items: [
        {
          title: navTranslations.seedance2 || defaultNavTranslations.seedance2,
          href: getLocalizedHref('/prompts/models/seedance-2-0'),
        },
        {
          title: navTranslations.kling || defaultNavTranslations.kling,
          href: getLocalizedHref('/prompts/models/kling'),
        },
        {
          title: navTranslations.gptImage2 || defaultNavTranslations.gptImage2,
          href: getLocalizedHref('/prompts/models/gpt-image-2'),
        },
        {
          title: navTranslations.nanoBanana || defaultNavTranslations.nanoBanana,
          href: getLocalizedHref('/prompts/models/nano-banana'),
        },
      ],
    },
    {
      title: navTranslations.promptScenes || defaultNavTranslations.promptScenes,
      key: 'prompt-scenes',
      items: [
        {
          title: navTranslations.advertising || defaultNavTranslations.advertising,
          href: getLocalizedHref('/prompts/categories/advertising'),
        },
        {
          title: navTranslations.fashionBeauty || defaultNavTranslations.fashionBeauty,
          href: getLocalizedHref('/prompts/categories/fashion-beauty'),
        },
        {
          title: navTranslations.filmTrailer || defaultNavTranslations.filmTrailer,
          href: getLocalizedHref('/prompts/categories/film-trailer'),
        },
      ],
    },
  ]

  return (
    <nav id="mainNav" ref={navRef} className="sticky-nav w-full">
      <div className="h-[70px] px-6 flex justify-center items-center max-w-6xl mx-auto w-full relative">
        <Link href={getLocalizedHref('/')} className="absolute left-6 text-3xl font-extrabold text-indigo-600 tracking-tighter flex items-center gap-3 hover:opacity-80 transition-opacity">
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="shadow-md shadow-indigo-100 rounded-lg">
            <rect width="40" height="40" rx="12" fill="white"/>
            <path d="M12 12H22C23.1 12 24 12.9 24 14V28C24 29.1 23.1 30 22 30H18C16.9 30 16 29.1 16 28V16H12C10.9 16 10 15.1 10 14V14C10 12.9 10.9 12 12 12Z" fill="url(#paint_wink)"/>
            <circle cx="29" cy="14" r="3" fill="url(#paint_wink)"/>
            <defs><linearGradient id="paint_wink" x1="10" y1="12" x2="29" y2="30" gradientUnits="userSpaceOnUse"><stop stopColor="#4F46E5"/><stop offset="1" stopColor="#9333EA"/></linearGradient></defs>
          </svg>
          Toolaze
        </Link>
        
        {/* 移动端菜单按钮 - 右上角 */}
        {isMobileView && (
          <button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen)
              // 关闭菜单时重置子菜单展开状态
              if (mobileMenuOpen) {
                setExpandedSubmenus(new Set())
              }
            }}
            className="md:hidden absolute right-4 z-50 p-2 text-slate-700 hover:text-indigo-600 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <CloseIcon size={24} className="w-6 h-6" />
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        )}

        {/* 桌面端菜单 */}
        <div className="hidden md:flex gap-8 text-sm font-bold text-slate-700 items-center">
          {/* 一级菜单：Prompts */}
          <div className="relative group">
            <button className="hover:text-indigo-600 transition-colors flex items-center gap-1">
              {navTranslations.promptLibrary || defaultNavTranslations.promptLibrary}
              <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div className="absolute top-full left-0 mt-2 w-auto min-w-[220px] max-w-[320px] bg-white rounded-xl shadow-lg border border-indigo-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-visible">
              <div className="py-2">
                <Link
                  href={getLocalizedHref('/prompts')}
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors whitespace-nowrap"
                >
                  {navTranslations.allPrompts || defaultNavTranslations.allPrompts}
                </Link>
                {promptMenuGroups.map((group) => (
                  <div key={group.key} className="relative group/secondary">
                    <div className="flex items-center justify-between px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors whitespace-nowrap">
                      <span>{group.title}</span>
                      <svg className="w-3 h-3 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </div>
                    <div className="absolute left-full top-0 ml-1 w-auto min-w-[220px] max-w-[360px] bg-white rounded-xl shadow-lg border border-indigo-50 opacity-0 invisible group-hover/secondary:opacity-100 group-hover/secondary:visible transition-all duration-200 z-[60]">
                      <div className="py-2">
                        {group.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors whitespace-nowrap"
                          >
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* 一级菜单：Quick Tools */}
          <div className="relative group">
            <button className="hover:text-indigo-600 transition-colors flex items-center gap-1">
              {navTranslations.quickTools}
              <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            {/* 二级菜单下拉 */}
            <div className="absolute top-full left-0 mt-2 w-auto min-w-[200px] max-w-[320px] bg-white rounded-xl shadow-lg border border-indigo-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-visible">
              <div className="py-2">
                {secondLevelItems.map((item, index) => {
                  const thirdLevelItems = item.hasThirdLevel && item.tool ? getThirdLevelItems(item.tool) : []
                  return (
                    <div key={item.tool || `item-${index}`} className="relative group/secondary">
                      <Link
                        href={item.href}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center justify-between whitespace-nowrap"
                      >
                        <div className="flex items-center gap-2">
                          {item.icon && item.icon}
                          <span>{item.title || defaultNavTranslations[item.tool as keyof typeof defaultNavTranslations] || item.tool}</span>
                        </div>
                        {item.hasThirdLevel && (
                          <svg className="w-3 h-3 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        )}
                      </Link>
                      {/* 三级菜单（hover到二级菜单项时才显示） */}
                      {item.hasThirdLevel && thirdLevelItems.length > 0 && (
                        <div className="absolute left-full top-0 ml-1 w-auto min-w-[240px] max-w-[400px] bg-white rounded-xl shadow-lg border border-indigo-50 opacity-0 invisible group-hover/secondary:opacity-100 group-hover/secondary:visible transition-all duration-200 z-[60]">
                          <div className="py-2">
                            {thirdLevelItems.map((thirdItem, idx) => (
                              <Link
                                key={`${item.tool}-${thirdItem.slug}-${idx}`}
                                href={thirdItem.href}
                                className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                              >
                                {thirdItem.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          {/* 一级菜单：AI Tools */}
          <div className="relative group">
            <button className="hover:text-indigo-600 transition-colors flex items-center gap-1">
              {navTranslations.aiTools || 'AI Tools'}
              <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div className="absolute top-full left-0 mt-2 w-auto min-w-[280px] bg-white rounded-xl shadow-lg border border-indigo-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-2">
                <Link
                  href={getLocalizedHref('/watermark-remover')}
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-3"
                >
                  <img
                    src={AI_TOOLS_DEMO_IMAGES.watermarkRemover}
                    alt={navTranslations.watermarkRemover || 'Watermark Remover'}
                    className="w-10 h-10 rounded-lg object-cover border border-indigo-100 flex-shrink-0"
                  />
                  <span>{navTranslations.watermarkRemover || 'Watermark Remover'}</span>
                </Link>
                <Link
                  href={getLocalizedHref('/photo-restoration')}
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-3"
                >
                  <img
                    src={AI_TOOLS_DEMO_IMAGES.photoRestoration}
                    alt={navTranslations.photoRestoration || defaultNavTranslations.photoRestoration}
                    className="w-10 h-10 rounded-lg object-cover border border-indigo-100 flex-shrink-0"
                  />
                  <span>{navTranslations.photoRestoration || defaultNavTranslations.photoRestoration}</span>
                </Link>
                <Link
                  href={getLocalizedHref('/ai-couple-photo-maker')}
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-3"
                >
                  <img
                    src={AI_TOOLS_DEMO_IMAGES.aiCouplePhotoMaker}
                    alt={navTranslations.aiCouplePhotoMaker || defaultNavTranslations.aiCouplePhotoMaker}
                    className="w-10 h-10 rounded-lg object-cover border border-indigo-100 flex-shrink-0"
                  />
                  <span>{navTranslations.aiCouplePhotoMaker || defaultNavTranslations.aiCouplePhotoMaker}</span>
                </Link>
                <Link
                  href={getLocalizedHref('/ai-tools')}
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.location.href = '/ai-tools'
                    }
                  }}
                  className="block px-4 pt-2 pb-1 text-xs font-medium tracking-normal text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  {navTranslations.viewAllAiTools || defaultNavTranslations.viewAllAiTools}
                </Link>
              </div>
            </div>
          </div>
          {/* 一级菜单：AI Image */}
          <div className="relative group">
            <button className="hover:text-indigo-600 transition-colors flex items-center gap-1">
              {navTranslations.aiImage || defaultNavTranslations.aiImage}
              <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div className="absolute top-full left-0 pt-1 w-auto min-w-[200px] bg-transparent opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-white rounded-xl shadow-lg border border-indigo-50 py-2">
                <Link
                  href={getLocalizedHref('/model/nano-banana-pro')}
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                    <rect x="2" y="2" width="20" height="20" rx="2" fill="url(#aiImageGradient)" opacity="0.2"/>
                    <path d="M8 8H16M8 12H14M8 16H12" stroke="url(#aiImageGradient)" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="18" cy="6" r="2" fill="url(#aiImageGradient)"/>
                    <defs>
                      <linearGradient id="aiImageGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#9333EA"/>
                        <stop offset="1" stopColor="#4F46E5"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <span>{navTranslations.nanoBananaPro || defaultNavTranslations.nanoBananaPro}</span>
                </Link>
                <Link
                  href={getLocalizedHref('/model/nano-banana-2')}
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                    <rect x="2" y="2" width="20" height="20" rx="2" fill="url(#aiImageGradient2)" opacity="0.2"/>
                    <path d="M8 8H16M8 12H14M8 16H12" stroke="url(#aiImageGradient2)" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="18" cy="6" r="2" fill="url(#aiImageGradient2)"/>
                    <defs>
                      <linearGradient id="aiImageGradient2" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#9333EA"/>
                        <stop offset="1" stopColor="#4F46E5"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <span>{navTranslations.nanoBanana2 || defaultNavTranslations.nanoBanana2}</span>
                </Link>
                <Link
                  href={getLocalizedHref('/model/gpt-image-2-0')}
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                    <rect x="2" y="2" width="20" height="20" rx="2" fill="url(#aiImageGradient3)" opacity="0.2"/>
                    <path d="M7 15l3-3 2 2 5-5" stroke="url(#aiImageGradient3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                      <linearGradient id="aiImageGradient3" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#9333EA"/>
                        <stop offset="1" stopColor="#4F46E5"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <span>{navTranslations.gptImage2 || defaultNavTranslations.gptImage2}</span>
                </Link>
              </div>
            </div>
          </div>
          {/* 一级菜单：AI Video */}
          <div className="relative group">
            <button className="hover:text-indigo-600 transition-colors flex items-center gap-1">
              {navTranslations.aiVideo || defaultNavTranslations.aiVideo}
              <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div className="absolute top-full left-0 pt-1 w-auto min-w-[200px] bg-transparent opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-white rounded-xl shadow-lg border border-indigo-50 py-2">
                <Link
                  href={getLocalizedHref('/model/seedance-2')}
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                    <rect x="2" y="4" width="20" height="14" rx="2" fill="url(#aiVideoGradient)" opacity="0.2"/>
                    <path d="M10 8L16 12L10 16V8Z" fill="url(#aiVideoGradient)"/>
                    <defs>
                      <linearGradient id="aiVideoGradient" x1="2" y1="4" x2="22" y2="18" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#9333EA"/>
                        <stop offset="1" stopColor="#4F46E5"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <span>{navTranslations.seedance2 || defaultNavTranslations.seedance2}</span>
                </Link>
                <Link
                  href={getLocalizedHref('/model/kling-3')}
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                    <rect x="2" y="4" width="20" height="14" rx="2" fill="url(#aiVideoGradient2)" opacity="0.2"/>
                    <path d="M10 8L16 12L10 16V8Z" fill="url(#aiVideoGradient2)"/>
                    <defs>
                      <linearGradient id="aiVideoGradient2" x1="2" y1="4" x2="22" y2="18" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#9333EA"/>
                        <stop offset="1" stopColor="#4F46E5"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <span>{navTranslations.kling3 || defaultNavTranslations.kling3}</span>
                </Link>
              </div>
            </div>
          </div>
          {showNavLanguageSwitcher && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setNavLangOpen(!navLangOpen)}
                className="flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors px-2 py-1 rounded-lg hover:bg-indigo-50"
                aria-label={navTranslations.language}
                aria-expanded={navLangOpen}
              >
                <span className="text-base leading-none">{navCurrentLocaleInfo.flag}</span>
                <span className="hidden lg:inline">{navCurrentLocaleInfo.name}</span>
                <svg
                  className={'w-4 h-4 transition-transform' + (navLangOpen ? ' rotate-180' : '')}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {navLangOpen && (
                <>
                  <div className="fixed inset-0 z-[55]" onClick={() => setNavLangOpen(false)} aria-hidden />
                  <div className="absolute top-full right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-indigo-50 z-[60] overflow-hidden py-2">
                    {navOtherLocales.map((locale) => (
                      <Link
                        key={locale.code}
                        href={getAlternateLanguageUrl(pathname || '/', locale.code)}
                        onClick={() => {
                          const nextLocale = resolveLocaleForPath(pathname || '/', locale.code)
                          if (typeof window !== 'undefined') {
                            window.localStorage.setItem(PREFERRED_LOCALE_STORAGE_KEY, nextLocale)
                          }
                          setNavLangOpen(false)
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <span className="text-base">{locale.flag}</span>
                        <span>{locale.name}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* 移动端菜单面板 */}
        {mobileMenuOpen && (
          <div
            ref={menuRef}
            className="block md:!hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-indigo-50 z-40 max-h-[calc(100vh-70px)] overflow-y-auto overscroll-contain"
          >
            <div className="px-6 py-4 space-y-4 pb-8">
              {/* Prompts 部分 */}
              <div className="border-b border-indigo-50 pb-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm font-bold text-slate-700">{navTranslations.promptLibrary || defaultNavTranslations.promptLibrary}</div>
                  <Link
                    href={getLocalizedHref('/prompts')}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setExpandedSubmenus(new Set())
                    }}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                  >
                    {navTranslations.allPrompts || defaultNavTranslations.allPrompts}
                  </Link>
                </div>
                <div className="space-y-2">
                  {promptMenuGroups.map((group) => {
                    const isExpanded = expandedSubmenus.has(group.key)
                    return (
                      <div key={group.key}>
                        <button
                          type="button"
                          onClick={() => {
                            setExpandedSubmenus((prev) => {
                              const next = new Set(prev)
                              if (next.has(group.key)) {
                                next.delete(group.key)
                              } else {
                                next.add(group.key)
                              }
                              return next
                            })
                          }}
                          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                          aria-expanded={isExpanded}
                        >
                          <span>{group.title}</span>
                          <svg className={'h-4 w-4 transition-transform' + (isExpanded ? ' rotate-90' : '')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        {isExpanded && (
                          <div className="ml-5 mt-2 space-y-1">
                            {group.items.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => {
                                  setMobileMenuOpen(false)
                                  setExpandedSubmenus(new Set())
                                }}
                                className="block rounded-lg px-3 py-2 text-sm text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                              >
                                {item.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
              {/* Quick Tools 部分 */}
              <div className="border-b border-indigo-50 pb-4">
                <div className="text-sm font-bold text-slate-700 mb-3">{navTranslations.quickTools}</div>
                <div className="space-y-2">
                  {secondLevelItems.map((item, index) => {
                    const isExpanded = expandedSubmenus.has(item.title)
                    const thirdLevelItems = item.hasThirdLevel && item.tool ? getThirdLevelItems(item.tool) : []
                    
                    return (
                      <div key={item.tool || `item-${index}`}>
                        <div className="flex items-center">
                          <Link
                            href={item.href}
                            onClick={() => {
                              setMobileMenuOpen(false)
                              setExpandedSubmenus(new Set())
                            }}
                            className="flex-1 flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                          >
                            {item.icon && item.icon}
                            <span>{item.title || defaultNavTranslations[item.tool as keyof typeof defaultNavTranslations] || item.tool}</span>
                          </Link>
                          {thirdLevelItems.length > 0 && (
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                setExpandedSubmenus(prev => {
                                  const newSet = new Set(prev)
                                  if (newSet.has(item.title)) {
                                    newSet.delete(item.title)
                                  } else {
                                    newSet.add(item.title)
                                  }
                                  return newSet
                                })
                              }}
                              className="p-2 text-slate-500 hover:text-indigo-600 transition-colors"
                              aria-label={isExpanded ? 'Collapse submenu' : 'Expand submenu'}
                            >
                              <svg 
                                className={'w-4 h-4 transition-transform' + (isExpanded ? ' rotate-90' : '')} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          )}
                        </div>
                        {/* 移动端三级菜单 - 默认折叠 */}
                        {isExpanded && thirdLevelItems.length > 0 && (
                          <div className="ml-5 mt-2 space-y-1">
                            {thirdLevelItems.map((thirdItem, idx) => (
                              <Link
                                key={`${item.tool}-${thirdItem.slug}-${idx}`}
                                href={thirdItem.href}
                                onClick={() => {
                                  setMobileMenuOpen(false)
                                  setExpandedSubmenus(new Set())
                                }}
                                className="block px-3 py-2 text-sm text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                              >
                                {thirdItem.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
              {/* AI Tools 部分 */}
              <div className="border-b border-indigo-50 pb-4">
                <div className="text-sm font-bold text-slate-700 mb-3">{navTranslations.aiTools || 'AI Tools'}</div>
                <div className="space-y-2">
                  <Link
                    href={getLocalizedHref('/watermark-remover')}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setExpandedSubmenus(new Set())
                    }}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                  >
                    <img
                      src={AI_TOOLS_DEMO_IMAGES.watermarkRemover}
                      alt={navTranslations.watermarkRemover || 'Watermark Remover'}
                      className="w-10 h-10 rounded-lg object-cover border border-indigo-100 flex-shrink-0"
                    />
                    <span>{navTranslations.watermarkRemover || 'Watermark Remover'}</span>
                  </Link>
                  <Link
                    href={getLocalizedHref('/photo-restoration')}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setExpandedSubmenus(new Set())
                    }}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                  >
                    <img
                      src={AI_TOOLS_DEMO_IMAGES.photoRestoration}
                      alt={navTranslations.photoRestoration || defaultNavTranslations.photoRestoration}
                      className="w-10 h-10 rounded-lg object-cover border border-indigo-100 flex-shrink-0"
                    />
                    <span>{navTranslations.photoRestoration || defaultNavTranslations.photoRestoration}</span>
                  </Link>
                  <Link
                    href={getLocalizedHref('/ai-couple-photo-maker')}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setExpandedSubmenus(new Set())
                    }}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                  >
                    <img
                      src={AI_TOOLS_DEMO_IMAGES.aiCouplePhotoMaker}
                      alt={navTranslations.aiCouplePhotoMaker || defaultNavTranslations.aiCouplePhotoMaker}
                      className="w-10 h-10 rounded-lg object-cover border border-indigo-100 flex-shrink-0"
                    />
                    <span>{navTranslations.aiCouplePhotoMaker || defaultNavTranslations.aiCouplePhotoMaker}</span>
                  </Link>
                  <Link
                    href={getLocalizedHref('/ai-tools')}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setExpandedSubmenus(new Set())
                      if (typeof window !== 'undefined') {
                        window.location.href = '/ai-tools'
                      }
                    }}
                    className="flex items-center gap-3 px-3 py-2 text-xs font-medium tracking-normal text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    {navTranslations.viewAllAiTools || defaultNavTranslations.viewAllAiTools}
                  </Link>
                </div>
              </div>
              {/* AI Image 部分 */}
              <div className="border-b border-indigo-50 pb-4">
                <div className="text-sm font-bold text-slate-700 mb-3">{navTranslations.aiImage || defaultNavTranslations.aiImage}</div>
                <div className="space-y-2">
                  <Link
                    href={getLocalizedHref('/model/nano-banana-pro')}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setExpandedSubmenus(new Set())
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                      <rect x="2" y="2" width="20" height="20" rx="2" fill="url(#aiImageGradientMobile)" opacity="0.2"/>
                      <path d="M8 8H16M8 12H14M8 16H12" stroke="url(#aiImageGradientMobile)" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="18" cy="6" r="2" fill="url(#aiImageGradientMobile)"/>
                      <defs>
                        <linearGradient id="aiImageGradientMobile" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#9333EA"/>
                          <stop offset="1" stopColor="#4F46E5"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <span>{navTranslations.nanoBananaPro || defaultNavTranslations.nanoBananaPro}</span>
                  </Link>
                  <Link
                    href={getLocalizedHref('/model/nano-banana-2')}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setExpandedSubmenus(new Set())
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                      <rect x="2" y="2" width="20" height="20" rx="2" fill="url(#aiImageGradientMobile2)" opacity="0.2"/>
                      <path d="M8 8H16M8 12H14M8 16H12" stroke="url(#aiImageGradientMobile2)" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="18" cy="6" r="2" fill="url(#aiImageGradientMobile2)"/>
                      <defs>
                        <linearGradient id="aiImageGradientMobile2" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#9333EA"/>
                          <stop offset="1" stopColor="#4F46E5"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <span>{navTranslations.nanoBanana2 || defaultNavTranslations.nanoBanana2}</span>
                  </Link>
                  <Link
                    href={getLocalizedHref('/model/gpt-image-2-0')}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setExpandedSubmenus(new Set())
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                      <rect x="2" y="2" width="20" height="20" rx="2" fill="url(#aiImageGradientMobile3)" opacity="0.2"/>
                      <path d="M7 15l3-3 2 2 5-5" stroke="url(#aiImageGradientMobile3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <defs>
                        <linearGradient id="aiImageGradientMobile3" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#9333EA"/>
                          <stop offset="1" stopColor="#4F46E5"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <span>{navTranslations.gptImage2 || defaultNavTranslations.gptImage2}</span>
                  </Link>
                </div>
              </div>
              {/* AI Video 部分 */}
              <div className="border-b border-indigo-50 pb-4">
                <div className="text-sm font-bold text-slate-700 mb-3">{navTranslations.aiVideo || defaultNavTranslations.aiVideo}</div>
                <div className="space-y-2">
                  <Link
                    href={getLocalizedHref('/model/seedance-2')}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setExpandedSubmenus(new Set())
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                      <rect x="2" y="4" width="20" height="14" rx="2" fill="url(#aiVideoGradientMobile)" opacity="0.2"/>
                      <path d="M10 8L16 12L10 16V8Z" fill="url(#aiVideoGradientMobile)"/>
                      <defs>
                        <linearGradient id="aiVideoGradientMobile" x1="2" y1="4" x2="22" y2="18" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#9333EA"/>
                          <stop offset="1" stopColor="#4F46E5"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <span>{navTranslations.seedance2 || defaultNavTranslations.seedance2}</span>
                  </Link>
                  <Link
                    href={getLocalizedHref('/model/kling-3')}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setExpandedSubmenus(new Set())
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                      <rect x="2" y="4" width="20" height="14" rx="2" fill="url(#aiVideoGradientMobile2)" opacity="0.2"/>
                      <path d="M10 8L16 12L10 16V8Z" fill="url(#aiVideoGradientMobile2)"/>
                      <defs>
                        <linearGradient id="aiVideoGradientMobile2" x1="2" y1="4" x2="22" y2="18" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#9333EA"/>
                          <stop offset="1" stopColor="#4F46E5"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <span>{navTranslations.kling3 || defaultNavTranslations.kling3}</span>
                  </Link>
                </div>
              </div>
              {showNavLanguageSwitcher && (
                <div className="border-t border-indigo-50 pt-4 mt-2">
                  <div className="text-sm font-bold text-slate-700 mb-3">{navTranslations.language}</div>
                  <div className="flex flex-wrap gap-2">
                    {navOtherLocales.map((locale) => (
                      <Link
                        key={locale.code}
                        href={getAlternateLanguageUrl(pathname || '/', locale.code)}
                        onClick={() => {
                          const nextLocale = resolveLocaleForPath(pathname || '/', locale.code)
                          if (typeof window !== 'undefined') {
                            window.localStorage.setItem(PREFERRED_LOCALE_STORAGE_KEY, nextLocale)
                          }
                          setMobileMenuOpen(false)
                          setExpandedSubmenus(new Set())
                        }}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-200"
                      >
                        <span>{locale.flag}</span>
                        <span>{locale.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
