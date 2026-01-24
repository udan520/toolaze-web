'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { FONT_GENERATOR_SLUGS } from '@/lib/seo-loader'
import { getFontStylesByCategory, convertToUnicodeFont as convertText } from '@/lib/unicode-fonts'

// 字体分类（基于关键词数据）
const fontCategories = [
  {
    id: 'all',
    name: 'All',
    icon: '🔤',
    keywords: ['font generator', 'fonts generator']
  },
  {
    id: 'cursive',
    name: 'Cursive',
    icon: '✍️',
    keywords: ['cursive font generator'],
    searchVolume: 33100,
    href: '/font-generator/cursive'
  },
  {
    id: 'fancy',
    name: 'Fancy',
    icon: '💎',
    keywords: ['fancy font generator'],
    searchVolume: 27100,
    href: '/font-generator/fancy'
  },
  {
    id: 'bold',
    name: 'Bold',
    icon: '🔲',
    keywords: ['bold font generator'],
    searchVolume: 18100,
    href: '/font-generator/bold'
  },
  {
    id: 'tattoo',
    name: 'Tattoo',
    icon: '🎨',
    keywords: ['tattoo font generator'],
    searchVolume: 18100,
    href: '/font-generator/tattoo'
  },
  {
    id: 'cool',
    name: 'Cool',
    icon: '⭐',
    keywords: ['cool font generator'],
    searchVolume: 14800,
    href: '/font-generator/cool'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📱',
    keywords: ['instagram font generator'],
    searchVolume: 12100,
    href: '/font-generator/instagram'
  },
  {
    id: 'italic',
    name: 'Italic',
    icon: 'ℹ️',
    keywords: ['italic font generator'],
    searchVolume: 9900,
    href: '/font-generator/italic'
  },
  {
    id: 'gothic',
    name: 'Gothic',
    icon: '🖤',
    keywords: ['gothic font generator'],
    searchVolume: 8100,
    href: '/font-generator/gothic'
  },
  {
    id: 'calligraphy',
    name: 'Calligraphy',
    icon: '🖋️',
    keywords: ['calligraphy font generator'],
    searchVolume: 8100,
    href: '/font-generator/calligraphy'
  },
  {
    id: 'discord',
    name: 'Discord',
    icon: '💬',
    keywords: ['discord font generator'],
    searchVolume: 5400,
    href: '/font-generator/discord'
  },
  {
    id: 'old-english',
    name: 'Old English',
    icon: '📜',
    keywords: ['old english font generator'],
    searchVolume: 5400,
    href: '/font-generator/old-english'
  },
  {
    id: '3d',
    name: '3D',
    icon: '🎯',
    keywords: ['3d font generator'],
    searchVolume: 4400,
    href: '/font-generator/3d'
  },
  {
    id: 'minecraft',
    name: 'Minecraft',
    icon: '⛏️',
    keywords: ['minecraft font generator'],
    searchVolume: 4400,
    href: '/font-generator/minecraft'
  },
  {
    id: 'disney',
    name: 'Disney',
    icon: '🏰',
    keywords: ['disney font generator'],
    searchVolume: 3600,
    href: '/font-generator/disney'
  },
  {
    id: 'bubble',
    name: 'Bubble',
    icon: '🫧',
    keywords: ['bubble font generator'],
    searchVolume: 2900,
    href: '/font-generator/bubble'
  },
  {
    id: 'star-wars',
    name: 'Star Wars',
    icon: '⭐',
    keywords: ['star wars font generator'],
    searchVolume: 2400,
    href: '/font-generator/star-wars'
  }
]

export default function FontGenerator() {
  const router = useRouter()
  const pathname = usePathname()
  const inputBoxRef = useRef<HTMLDivElement>(null)
  
  // 从 localStorage 恢复输入框状态，如果没有则使用默认值
  const [inputText, setInputText] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('font-generator-input')
      return saved || 'Toolaze Font Generator 123'
    }
    return 'Toolaze Font Generator 123'
  })
  
  // 跟踪哪个字体样式被复制了（用于显示 "Copied" 反馈）
  const [copiedFontId, setCopiedFontId] = useState<string | null>(null)
  
  // 从 URL 路径中提取当前 slug，确定选中的分类
  const getCurrentCategory = (currentPath: string) => {
    if (!currentPath) return 'all'
    
    // 检查是否是 L3 页面（包含 /font-generator/ 且后面有 slug）
    const match = currentPath.match(/\/font-generator\/([^\/]+)/)
    if (match && match[1]) {
      const slug = match[1]
      // 检查 slug 是否在可用列表中
      if (FONT_GENERATOR_SLUGS.includes(slug)) {
        const category = fontCategories.find(c => c.href === `/font-generator/${slug}`)
        return category?.id || 'all'
      }
      // 如果 slug 不存在，返回 'all'
      return 'all'
    }
    
    // 如果是 L2 页面（/font-generator），返回 'all'
    if (currentPath === '/font-generator' || currentPath.endsWith('/font-generator')) {
      return 'all'
    }
    
    return 'all'
  }
  
  const [selectedCategory, setSelectedCategory] = useState('all')

  // 当路径变化时，更新选中的分类并滚动到输入框
  useEffect(() => {
    if (pathname) {
      const newCategory = getCurrentCategory(pathname)
      setSelectedCategory(newCategory)
      
      // URL变化时，延迟滚动到输入框（确保页面已渲染）
      setTimeout(() => {
        scrollToInputBox()
      }, 150)
    }
  }, [pathname])

  // 保存输入框状态到 localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('font-generator-input', inputText)
    }
  }, [inputText])

  // 过滤分类：只显示已存在的 L3 页面
  const availableCategories = useMemo(() => {
    return fontCategories.filter(category => {
      // "All" 分类始终显示
      if (category.id === 'all') return true
      // 只显示在 FONT_GENERATOR_SLUGS 中的分类
      if (category.href) {
        const slug = category.href.replace('/font-generator/', '')
        return FONT_GENERATOR_SLUGS.includes(slug)
      }
      return false
    })
  }, [])

  // 滚动到输入框位置（距离顶部菜单栏20px）
  const scrollToInputBox = () => {
    if (inputBoxRef.current && typeof window !== 'undefined') {
      // 获取导航栏的实际高度
      const navElement = document.getElementById('mainNav')
      const navHeight = navElement ? navElement.getBoundingClientRect().height : 96 // 默认96px (top-24)
      
      // 获取输入框当前在视口中的位置
      const inputBoxRect = inputBoxRef.current.getBoundingClientRect()
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop
      const currentTop = inputBoxRect.top
      
      // 目标：输入框距离顶部菜单栏20px
      // 即输入框距离视口顶部 = 导航栏高度 + 20px
      const targetTop = navHeight + 20
      const adjustment = currentTop - targetTop
      
      // 如果调整量很小（小于5px），不需要滚动
      if (Math.abs(adjustment) > 5) {
        window.scrollTo({
          top: currentScrollY + adjustment,
          behavior: 'smooth'
        })
      }
    }
  }

  // 处理分类点击，无感切换 URL
  const handleCategoryClick = (category: typeof fontCategories[0]) => {
    if (category.href) {
      // 检查该分类是否存在于可用列表中
      const slug = category.href.replace('/font-generator/', '')
      if (!FONT_GENERATOR_SLUGS.includes(slug)) {
        // 如果不存在，不进行导航
        return
      }
      // 使用 router.push 进行客户端路由切换，不刷新页面
      // 只有在当前路径不同时才切换
      if (pathname !== category.href) {
        router.push(category.href)
        // 延迟滚动，确保页面已更新
        setTimeout(() => {
          scrollToInputBox()
        }, 100)
      } else {
        // 如果路径相同，直接滚动
        scrollToInputBox()
      }
      setSelectedCategory(category.id)
    } else {
      // "All" 分类，切换到 L2 页面（只有在当前不在 L2 页面时才切换）
      if (pathname !== '/font-generator' && !pathname.endsWith('/font-generator')) {
        router.push('/font-generator')
        // 延迟滚动，确保页面已更新
        setTimeout(() => {
          scrollToInputBox()
        }, 100)
      } else {
        // 如果路径相同，直接滚动
        scrollToInputBox()
      }
      setSelectedCategory('all')
    }
  }

  // 根据选择的分类获取字体样式（从新的字体库）
  const filteredFonts = useMemo(() => {
    return getFontStylesByCategory(selectedCategory)
  }, [selectedCategory])

  return (
    <div className="max-w-6xl mx-auto px-6">
      {/* 输入框区域 - 吸顶（在导航栏下方） */}
      <div ref={inputBoxRef} className="sticky top-24 z-40 mb-8">
        <div className="bg-white rounded-[2.5rem] p-6 shadow-lg shadow-indigo-500/10 border border-indigo-50">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Add text here to get started...."
            className="w-full px-6 py-4 text-lg border-2 border-indigo-100 rounded-full focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all text-slate-800 placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 左侧分类栏 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-4 shadow-lg shadow-indigo-500/10 border border-indigo-50 sticky top-[calc(6rem+132px)] z-30">
            <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Select a font style</h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {availableCategories.map((category) => {
                const isActive = selectedCategory === category.id
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                        : 'text-slate-700 hover:bg-indigo-50 hover:shadow-sm'
                    }`}
                  >
                    <span className="text-xl">{category.icon}</span>
                    <span className="font-medium text-sm flex-1">{category.name}</span>
                    {category.searchVolume && (
                      <span className={`text-xs ${
                        isActive ? 'text-white/80' : 'text-slate-400'
                      }`}>
                        {category.searchVolume >= 1000
                          ? `${(category.searchVolume / 1000).toFixed(1)}k`
                          : category.searchVolume.toLocaleString()}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* 右侧字体预览区域 */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-indigo-500/10 border border-indigo-50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                {selectedCategory === 'all' ? 'All Fonts' : `${fontCategories.find(c => c.id === selectedCategory)?.name} Fonts`}
              </h3>
              <span className="text-sm text-slate-500 font-medium">
                {filteredFonts.length} {filteredFonts.length === 1 ? 'font' : 'fonts'}
              </span>
            </div>
            
            <div className="space-y-3 max-h-[800px] overflow-y-auto">
              {filteredFonts.map((font) => {
                const displayText = inputText || 'Toolaze Font Generator 123'
                const convertedText = convertText(displayText, font.id)
                const isCopied = copiedFontId === font.id
                
                return (
                  <div
                    key={font.id}
                    className="p-4 border border-indigo-100 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all group bg-white"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-lg text-slate-800 break-all">
                          {convertedText}
                        </p>
                        <span className="text-xs text-slate-500 mt-1 block">{font.name}</span>
                      </div>
                      <button 
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(convertedText)
                            // 显示成功反馈
                            setCopiedFontId(font.id)
                            // 2秒后恢复原始状态
                            setTimeout(() => {
                              setCopiedFontId(null)
                            }, 2000)
                          } catch (err) {
                            console.error('Failed to copy text:', err)
                          }
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                          isCopied
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700'
                        }`}
                      >
                        {isCopied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
