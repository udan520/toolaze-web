'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getAllSlugs, getSeoContent } from '@/lib/seo-loader'

const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

// 翻译数据(默认英语)
const defaultNavTranslations = {
  quickTools: 'Quick Tools',
  imageCompression: 'Image Compression',
  imageConverter: 'Image Converter',
  aboutUs: 'About Us'
}

// 加载导航翻译的函数
async function loadNavTranslations(locale: string) {
  try {
    let normalizedLocale = locale
    if (locale === 'zh' || locale === 'zh-CN' || locale === 'zh-HK') {
      normalizedLocale = 'zh-TW'
    }
    
    if (normalizedLocale === 'en') {
      const data = await import('@/data/en/common.json')
      return data.default?.nav || defaultNavTranslations
    }
    
    try {
      const data = await import(`@/data/${normalizedLocale}/common.json`)
      return data.default?.nav || defaultNavTranslations
    } catch {
      return defaultNavTranslations
    }
  } catch {
    return defaultNavTranslations
  }
}

// 格式化 tool 名称为显示名称（与页面中的函数一致）
function extractPageTitle(h1: string): string {
  if (!h1) return ''
  // 移除HTML标签
  let cleanH1 = h1.replace(/<[^>]*>/g, '')
  // 对于英文，移除常见前缀和后缀
  // 对于其他语言，直接返回清理后的标题
  if (/^[a-zA-Z]/.test(cleanH1)) {
    cleanH1 = cleanH1.replace(/^(Compress|Free|Convert|Optimize|Reduce)\s+/i, '')
    cleanH1 = cleanH1.replace(/\s+(Compression|Tool|Compressor|Converter|Optimizer)$/i, '')
  }
  return cleanH1.trim() || h1.replace(/<[^>]*>/g, '')
}

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedSubmenus, setExpandedSubmenus] = useState<Set<string>>(new Set())
  const [navTranslations, setNavTranslations] = useState(defaultNavTranslations)
  const [thirdLevelMenuData, setThirdLevelMenuData] = useState<Record<string, Array<{slug: string, title: string, href: string}>>>({})
  const pathname = usePathname()
  
  // 检测当前语言
  const getCurrentLocale = (): string => {
    if (!pathname) return 'en'
    const pathParts = pathname.split('/').filter(Boolean)
    const firstPart = pathParts[0] || ''
    return locales.includes(firstPart) ? firstPart : 'en'
  }
  
  const currentLocale = getCurrentLocale()
  
  // 加载翻译
  useEffect(() => {
    loadNavTranslations(currentLocale).then(setNavTranslations)
  }, [currentLocale])
  
  // 加载三级菜单数据
  useEffect(() => {
    const loadThirdLevelItems = async () => {
      const locale = getCurrentLocale()
      const data: Record<string, Array<{slug: string, title: string, href: string}>> = {}
      
      // 生成带语言前缀的链接的辅助函数
      const getHref = (href: string): string => {
        if (href.startsWith('http')) return href
        if (locale === 'en') return href
        if (href.startsWith(`/${locale}`)) return href
        return `/${locale}${href}`
      }
      
      // 加载 Image Compressor 的三级菜单（只显示 in_menu: true 的工具）
      try {
        const compressorSlugs = await getAllSlugs('image-compressor', locale)
        if (compressorSlugs && compressorSlugs.length > 0) {
          const compressorItems = await Promise.all(
            compressorSlugs.map(async (slug) => {
              try {
                const toolData = await getSeoContent('image-compressor', slug, locale)
                // 检查 in_menu 字段：如果不存在或为 true，则显示；如果为 false，则不显示
                if (toolData?.in_menu === false) {
                  return null
                }
                let title = slug
                if (toolData?.hero?.h1) {
                  title = toolData.hero.h1.replace(/<[^>]*>/g, '').trim()
                  if (!title) title = slug
                }
                return {
                  slug,
                  title,
                  href: getHref(`/image-compressor/${slug}`),
                }
              } catch (err) {
                // 如果单个项加载失败，返回 null，后续会被过滤掉
                return null
              }
            })
          )
          data['image-compressor'] = compressorItems.filter((item): item is { slug: string; title: string; href: string } => 
            item !== null && item.title !== undefined && item.href !== undefined
          )
        } else {
          data['image-compressor'] = []
        }
      } catch (error) {
        console.error('Failed to load image-compressor menu items:', error)
        data['image-compressor'] = []
      }
      
      // 加载 Image Converter 的三级菜单（只显示 in_menu: true 的工具）
      try {
        const converterSlugs = await getAllSlugs('image-converter', locale)
        const converterItems = await Promise.all(
          converterSlugs.map(async (slug) => {
            try {
              const toolData = await getSeoContent('image-converter', slug, locale)
              // 检查 in_menu 字段：如果不存在或为 true，则显示；如果为 false，则不显示
              if (toolData?.in_menu === false) {
                return null
              }
              let title = slug
              if (toolData?.hero?.h1) {
                title = toolData.hero.h1.replace(/<[^>]*>/g, '').trim()
                if (!title) title = slug
              }
              return {
                slug,
                title,
                href: getHref(`/image-converter/${slug}`),
              }
            } catch (err) {
              // 如果单个项加载失败，返回 null，后续会被过滤掉
              return null
            }
          })
        )
        data['image-converter'] = converterItems.filter((item): item is { slug: string; title: string; href: string } => 
          item !== null && item.title !== undefined && item.href !== undefined
        )
      } catch (error) {
        data['image-converter'] = []
      }
      
      setThirdLevelMenuData(data)
    }
    
    loadThirdLevelItems()
  }, [currentLocale, pathname])
  
  // 生成带语言前缀的链接（英语不使用 /en 前缀）
  const getLocalizedHref = (href: string): string => {
    // 如果 href 是绝对路径，直接返回
    if (href.startsWith('http')) {
      return href
    }
    
    // 英语版本：直接返回，不添加 /en
    if (currentLocale === 'en') {
      return href
    }
    
    // 如果 href 已经包含当前语言前缀，直接返回
    if (href.startsWith(`/${currentLocale}`)) {
      return href
    }
    
    // 其他语言：添加语言前缀
    return `/${currentLocale}${href}`
  }
  
  // 获取三级菜单项的函数（使用已加载的数据）
  const getThirdLevelItems = (tool: string): Array<{slug: string, title: string, href: string}> => {
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
  ]

  return (
    <nav id="mainNav" ref={navRef} className="sticky-nav w-full">
      <div className="py-6 px-6 flex justify-center items-center max-w-6xl mx-auto w-full relative">
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
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* 桌面端菜单 */}
        <div className="hidden md:flex gap-8 text-sm font-bold text-slate-700 items-center">
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
                {secondLevelItems.map((item) => {
                  const thirdLevelItems = item.hasThirdLevel && item.tool ? getThirdLevelItems(item.tool) : []
                  return (
                    <div key={item.title} className="relative group/secondary">
                      <Link
                        href={item.href}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center justify-between whitespace-nowrap"
                      >
                        <div className="flex items-center gap-2">
                          {item.icon && item.icon}
                          <span>{item.title}</span>
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
                            {thirdLevelItems.map((thirdItem) => (
                              <Link
                                key={thirdItem.slug}
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
          <Link href={getLocalizedHref('/about')} className="hover:text-indigo-600 transition-colors">{navTranslations.aboutUs}</Link>
        </div>

        {/* 移动端菜单面板 */}
        {mobileMenuOpen && (
          <div ref={menuRef} className="block md:!hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-indigo-50 z-40">
            <div className="px-6 py-4 space-y-4">
              {/* Quick Tools 部分 */}
              <div className="border-b border-indigo-50 pb-4">
                <div className="text-sm font-bold text-slate-700 mb-3">{navTranslations.quickTools}</div>
                <div className="space-y-2">
                  {secondLevelItems.map((item) => {
                    const isExpanded = expandedSubmenus.has(item.title)
                    const thirdLevelItems = item.hasThirdLevel && item.tool ? getThirdLevelItems(item.tool) : []
                    
                    return (
                      <div key={item.title}>
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
                            <span>{item.title}</span>
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
                                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
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
                            {thirdLevelItems.map((thirdItem) => (
                              <Link
                                key={thirdItem.slug}
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
              {/* About Us */}
              <Link
                href={getLocalizedHref('/about')}
                onClick={() => {
                  setMobileMenuOpen(false)
                  setExpandedSubmenus(new Set())
                }}
                className="block px-3 py-2 text-sm font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
              >
                {navTranslations.aboutUs}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
