'use client'

import Link from 'next/link'
import { useEffect, useRef, useMemo } from 'react'
import { getAllSlugs, getSeoContent } from '@/lib/seo-loader'

// 格式化 tool 名称为显示名称（与页面中的函数一致）
function extractPageTitle(h1: string): string {
  let cleanH1 = h1.replace(/<[^>]*>/g, '')
  cleanH1 = cleanH1.replace(/^(Compress|Free|Convert|Optimize|Reduce)\s+/i, '')
  cleanH1 = cleanH1.replace(/\s+(Compression|Tool|Compressor|Converter|Optimizer)$/i, '')
  return cleanH1.trim() || h1.replace(/<[^>]*>/g, '')
}

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const handleScroll = () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop
      if (currentScroll > 50) {
        nav.classList.add('scrolled')
      } else {
        nav.classList.remove('scrolled')
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 获取三级菜单项的函数
  const getThirdLevelItems = (tool: string, basePath: string) => {
    try {
      const toolSlugs = getAllSlugs(tool)
      return toolSlugs.map(slug => {
        const toolData = getSeoContent(tool, slug)
        return {
          slug,
          title: toolData?.hero?.h1 ? extractPageTitle(toolData.hero.h1) : slug,
          href: `${basePath}/${slug}`,
        }
      }).filter(item => item.title && item.href)
    } catch (error) {
      return []
    }
  }

  // 二级菜单项
  const secondLevelItems = [
    {
      title: 'Image Compression',
      href: '/image-compressor',
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
      title: 'Image Converter',
      href: '/image-converter',
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
        <Link href="/" className="absolute left-6 text-3xl font-extrabold text-indigo-600 tracking-tighter flex items-center gap-3 hover:opacity-80 transition-opacity">
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="shadow-md shadow-indigo-100 rounded-lg">
            <rect width="40" height="40" rx="12" fill="white"/>
            <path d="M12 12H22C23.1 12 24 12.9 24 14V28C24 29.1 23.1 30 22 30H18C16.9 30 16 29.1 16 28V16H12C10.9 16 10 15.1 10 14V14C10 12.9 10.9 12 12 12Z" fill="url(#paint_wink)"/>
            <circle cx="29" cy="14" r="3" fill="url(#paint_wink)"/>
            <defs><linearGradient id="paint_wink" x1="10" y1="12" x2="29" y2="30" gradientUnits="userSpaceOnUse"><stop stopColor="#4F46E5"/><stop offset="1" stopColor="#9333EA"/></linearGradient></defs>
          </svg>
          Toolaze
        </Link>
        <div className="hidden md:flex gap-8 text-sm font-bold text-slate-700 items-center">
          {/* 一级菜单：Quick Tools */}
          <div className="relative group">
            <button className="hover:text-indigo-600 transition-colors flex items-center gap-1">
              Quick Tools
              <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            {/* 二级菜单下拉 */}
            <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-indigo-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-2">
                {secondLevelItems.map((item) => (
                  <div key={item.title} className="relative submenu-group">
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
                    {/* 三级菜单（hover到二级时显示） */}
                    {item.hasThirdLevel && item.tool && (() => {
                      const thirdLevelItems = getThirdLevelItems(item.tool, item.href)
                      return thirdLevelItems.length > 0 ? (
                        <div className="submenu-group-hover absolute left-full top-0 ml-2 w-64 bg-white rounded-xl shadow-lg border border-indigo-50 opacity-0 invisible transition-all duration-200 z-50 max-h-screen overflow-y-auto">
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
                      ) : null
                    })()}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Link href="/about" className="hover:text-indigo-600 transition-colors">About Us</Link>
        </div>
      </div>
    </nav>
  )
}
