'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { FONT_GENERATOR_SLUGS } from '@/lib/seo-loader'
import { getFontStylesByCategory, convertToUnicodeFont as convertText } from '@/lib/unicode-fonts'

// 支持的 locale 列表
const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

// 默认翻译（英语）
const defaultTranslations = {
  selectFontStyle: 'Select a font style',
  font: 'font',
  fonts: 'fonts',
  allFonts: 'All Fonts',
  copy: 'Copy',
  copied: 'Copied!',
  placeholder: 'Add text here to get started....',
  defaultText: 'Toolaze Font Generator 123',
  trustBar: {
    private: '100% Private',
    instantPreview: 'Instant Preview',
    noServerLogs: 'No Server Logs'
  },
  fontTerms: {
    Bold: 'Bold',
    Italic: 'Italic',
    'Sans Serif': 'Sans Serif',
    Serif: 'Serif',
    Cursive: 'Cursive',
    Script: 'Script',
    Gothic: 'Gothic',
    Fancy: 'Fancy',
    Fraktur: 'Fraktur',
    Monospace: 'Monospace',
    Fullwidth: 'Fullwidth',
    Circled: 'Circled',
    'Negative Circled': 'Negative Circled',
    Squared: 'Squared',
    'Negative Squared': 'Negative Squared',
    Parenthesized: 'Parenthesized',
    'Small Caps': 'Small Caps',
    Superscript: 'Superscript',
    Subscript: 'Subscript',
    'Greek Style': 'Greek Style',
    'Cyrillic Style': 'Cyrillic Style',
    'Regional Indicator': 'Regional Indicator',
    'Latin Extended': 'Latin Extended',
    'Latin Extended-B': 'Latin Extended-B'
  },
  categories: {
    all: 'All',
    cursive: 'Cursive',
    fancy: 'Fancy',
    bold: 'Bold',
    tattoo: 'Tattoo',
    cool: 'Cool',
    instagram: 'Instagram',
    italic: 'Italic',
    gothic: 'Gothic',
    calligraphy: 'Calligraphy',
    discord: 'Discord',
    oldEnglish: 'Old English',
    '3d': '3D',
    minecraft: 'Minecraft',
    disney: 'Disney',
    bubble: 'Bubble',
    starWars: 'Star Wars'
  }
}

// 加载翻译
async function loadTranslations(locale: string) {
  try {
    let normalizedLocale = locale
    if (locale === 'zh' || locale === 'zh-CN' || locale === 'zh-HK') {
      normalizedLocale = 'zh-TW'
    }
    
    if (normalizedLocale === 'en') {
      const data = await import('@/data/en/common.json')
      return data.default?.common?.fontGenerator || defaultTranslations
    }
    
    try {
      const data = await import(`@/data/${normalizedLocale}/common.json`)
      return data.default?.common?.fontGenerator || defaultTranslations
    } catch {
      return defaultTranslations
    }
  } catch {
    return defaultTranslations
  }
}

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
  const categoryListRef = useRef<HTMLDivElement>(null) // 桌面端分类列表容器
  const mobileCategoryListRef = useRef<HTMLDivElement>(null) // 移动端分类芯片容器
  const categoryButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  
  // 多语言支持
  const [translations, setTranslations] = useState(defaultTranslations)
  const [currentLocale, setCurrentLocale] = useState('en')
  const [mounted, setMounted] = useState(false)
  
  // 从路径中检测 locale
  useEffect(() => {
    if (!pathname) return
    
    const pathParts = pathname.split('/').filter(Boolean)
    const firstPart = pathParts[0] || ''
    const detectedLocale = locales.includes(firstPart) ? firstPart : 'en'
    setCurrentLocale(detectedLocale)
    
    // 加载翻译
    loadTranslations(detectedLocale).then(setTranslations)
  }, [pathname])
  
  // 标记组件已挂载（客户端）
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // 从 localStorage 恢复输入框状态，如果没有则使用默认值
  // 服务器和客户端使用相同的初始值，避免水合错误
  const [inputText, setInputText] = useState(() => {
    // 服务器和客户端都使用相同的默认值
    return defaultTranslations.defaultText || 'Toolaze Font Generator 123'
  })
  
  // 客户端挂载后，从 localStorage 读取保存的值
  useEffect(() => {
    if (!mounted) return
    
    const saved = localStorage.getItem('font-generator-input')
    if (saved) {
      setInputText(saved)
    } else if (translations?.defaultText && translations.defaultText !== defaultTranslations.defaultText) {
      // 如果没有保存的值，使用翻译后的默认文本
      setInputText(translations.defaultText)
    }
  }, [mounted, translations?.defaultText])
  
  // 跟踪哪个字体样式被复制了（用于显示 "Copied" 反馈）
  const [copiedFontId, setCopiedFontId] = useState<string | null>(null)
  
  // 从 URL 路径中提取当前 slug，确定选中的分类
  const getCurrentCategory = (currentPath: string) => {
    if (!currentPath) return 'all'
    
    // 移除语言前缀（如 /de/）
    const pathWithoutLocale = currentPath.replace(/^\/(en|de|ja|es|zh-TW|pt|fr|ko|it)\//, '/')
    
    // 检查是否是 L3 页面（包含 /font-generator/ 且后面有 slug）
    const match = pathWithoutLocale.match(/\/font-generator\/([^\/]+)/)
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
    if (pathWithoutLocale === '/font-generator' || pathWithoutLocale.endsWith('/font-generator')) {
      return 'all'
    }
    
    return 'all'
  }
  
  const [selectedCategory, setSelectedCategory] = useState('all')

  // 滚动到选中的分类按钮
  const scrollToSelectedCategory = (categoryId: string) => {
    const button = categoryButtonRefs.current[categoryId]
    if (!button) return
    
    // 移动端：横向滚动
    const mobileContainer = mobileCategoryListRef.current
    if (mobileContainer) {
      const buttonRect = button.getBoundingClientRect()
      const containerRect = mobileContainer.getBoundingClientRect()
      
      // 计算按钮相对于容器的位置
      const buttonLeft = buttonRect.left - containerRect.left + mobileContainer.scrollLeft
      const buttonRight = buttonLeft + buttonRect.width
      
      // 获取容器的可见区域
      const containerWidth = containerRect.width
      const scrollLeft = mobileContainer.scrollLeft
      const scrollRight = scrollLeft + containerWidth
      
      // 如果按钮不在可见区域内，滚动到它
      if (buttonLeft < scrollLeft) {
        // 按钮在可见区域左侧，滚动到按钮左侧
        mobileContainer.scrollTo({
          left: buttonLeft - 16, // 留16px的间距
          behavior: 'smooth'
        })
      } else if (buttonRight > scrollRight) {
        // 按钮在可见区域右侧，滚动使按钮右侧可见
        mobileContainer.scrollTo({
          left: buttonRight - containerWidth + 16, // 留16px的间距
          behavior: 'smooth'
        })
      }
    }
    
    // 桌面端：纵向滚动 - 将选中的分类滚动到可见区域的顶部
    const desktopContainer = categoryListRef.current
    if (desktopContainer && button && desktopContainer.contains(button)) {
      // 获取所有按钮元素
      const allButtons = Array.from(desktopContainer.children) as HTMLElement[]
      const buttonIndex = allButtons.indexOf(button)
      
      if (buttonIndex >= 0) {
        // 计算按钮在容器中的绝对位置（累加前面所有元素的高度）
        let buttonTop = 0
        for (let i = 0; i < buttonIndex; i++) {
          const child = allButtons[i]
          if (child) {
            buttonTop += child.offsetHeight
            // space-y-2 = 8px 间距
            if (i < buttonIndex - 1) {
              buttonTop += 8
            }
          }
        }
        
        // 获取容器信息
        const containerHeight = desktopContainer.clientHeight
        const totalHeight = desktopContainer.scrollHeight
        const maxScroll = Math.max(0, totalHeight - containerHeight)
        
        // 计算按钮后面剩余的内容高度
        let remainingHeight = 0
        for (let i = buttonIndex + 1; i < allButtons.length; i++) {
          const child = allButtons[i]
          if (child) {
            remainingHeight += child.offsetHeight
            if (i < allButtons.length - 1) {
              remainingHeight += 8 // space-y-2 间距
            }
          }
        }
        
        // 计算目标滚动位置：让按钮显示在容器顶部
        let targetScrollTop = buttonTop - 10 // 留10px间距
        
        // 如果后面剩余内容不足以填满容器，调整滚动位置
        // 确保按钮尽可能靠上，但不超过最大滚动距离
        if (remainingHeight + button.offsetHeight < containerHeight) {
          // 如果剩余内容不足，让按钮尽可能靠上显示
          targetScrollTop = Math.min(targetScrollTop, maxScroll)
        }
        
        // 确保滚动位置在有效范围内
        targetScrollTop = Math.max(0, Math.min(targetScrollTop, maxScroll))
        
        // 执行滚动
        desktopContainer.scrollTop = targetScrollTop // 先立即设置，确保可见
        // 然后使用平滑滚动（如果需要）
        setTimeout(() => {
          desktopContainer.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
          })
        }, 50)
      }
    }
  }

  // 当路径变化时，更新选中的分类并滚动到输入框和分类按钮
  useEffect(() => {
    if (pathname) {
      const newCategory = getCurrentCategory(pathname)
      setSelectedCategory(newCategory)
      
      // URL变化时，延迟滚动到输入框和分类按钮（确保页面已渲染）
      setTimeout(() => {
        scrollToInputBox()
        // 如果选中的不是 'all'，滚动到对应的分类按钮
        if (newCategory !== 'all') {
          scrollToSelectedCategory(newCategory)
        }
      }, 200)
    }
  }, [pathname])

  // 当选中分类变化时，确保滚动到该分类（延迟执行，确保 ref 已设置）
  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'all') {
      let retryCount = 0
      const maxRetries = 20
      
      // 使用 requestAnimationFrame 确保 DOM 已更新
      const attemptScroll = () => {
        const button = categoryButtonRefs.current[selectedCategory]
        const container = categoryListRef.current
        
        if (button && container) {
          // 确保按钮在容器内
          if (container.contains(button)) {
            scrollToSelectedCategory(selectedCategory)
          } else if (retryCount < maxRetries) {
            // 如果按钮不在容器内，重试
            retryCount++
            requestAnimationFrame(() => {
              setTimeout(attemptScroll, 100)
            })
          }
        } else if (retryCount < maxRetries) {
          // 如果按钮 ref 还没设置，重试
          retryCount++
          requestAnimationFrame(() => {
            setTimeout(attemptScroll, 100)
          })
        }
      }
      
      // 延迟执行，确保所有 ref 都已设置完成
      const timer = setTimeout(() => {
        attemptScroll()
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [selectedCategory])

  // 保存输入框状态到 localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('font-generator-input', inputText)
    }
  }, [inputText])

  // 过滤分类：只显示已存在的 L3 页面
  // 获取翻译后的分类名称
  const getCategoryName = (categoryId: string): string => {
    if (!categoryId) return categoryId
    
    // 安全地访问 categories
    const categories = translations?.categories
    if (!categories || typeof categories !== 'object') {
      return categoryId
    }
    
    const categoryKey = categoryId === 'old-english' ? 'oldEnglish' : 
                       categoryId === 'star-wars' ? 'starWars' : 
                       categoryId === '3d' ? '3d' : categoryId
    return (categories as Record<string, string>)[categoryKey] || categoryId
  }
  
  // 获取翻译后的字体名称
  // 字体名称可能是组合式的，如 "Bold Sans Serif Italic"
  // 需要智能解析并翻译每个术语
  const getFontName = (fontName: string): string => {
    if (!fontName) return fontName
    
    // 安全地访问 fontTerms
    const fontTerms = translations?.fontTerms as Record<string, string> | undefined
    if (!fontTerms || typeof fontTerms !== 'object') {
      return fontName
    }
    
    // 按空格分割字体名称
    const parts = fontName.split(/\s+/)
    const translatedParts = parts.map(part => {
      if (!part) return part
      
      // 尝试直接匹配
      if (fontTerms[part]) {
        return fontTerms[part]
      }
      // 尝试匹配首字母大写的变体
      const capitalized = part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
      if (fontTerms[capitalized]) {
        return fontTerms[capitalized]
      }
      // 如果找不到翻译，返回原文本
      return part
    })
    
    return translatedParts.join(' ')
  }
  
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
      
      // 构建带语言前缀的 URL
      const targetHref = currentLocale === 'en' 
        ? category.href 
        : `/${currentLocale}${category.href}`
      
      // 使用 router.push 进行客户端路由切换，不刷新页面
      // 只有在当前路径不同时才切换
      if (pathname !== targetHref && pathname !== category.href) {
        router.push(targetHref)
        // 延迟滚动，确保页面已更新
        setTimeout(() => {
          scrollToInputBox()
          scrollToSelectedCategory(category.id)
        }, 100)
      } else {
        // 如果路径相同，直接滚动
        scrollToInputBox()
        scrollToSelectedCategory(category.id)
      }
      setSelectedCategory(category.id)
    } else if (category.id === 'all') {
      // "All" 分类，切换到 L2 页面
      const allHref = currentLocale === 'en' ? '/font-generator' : `/${currentLocale}/font-generator`
      if (pathname !== allHref && pathname !== '/font-generator' && !pathname.endsWith('/font-generator')) {
        router.push(allHref)
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

  // 计算每个分类的字体样式数量
  const categoryFontCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    availableCategories.forEach(category => {
      if (category.id === 'all') {
        counts['all'] = getFontStylesByCategory('all').length
      } else {
        counts[category.id] = getFontStylesByCategory(category.id).length
      }
    })
    return counts
  }, [availableCategories])

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6">
      {/* 输入框区域 - 移动端友好 */}
      <div ref={inputBoxRef} className="sticky top-16 md:top-20 z-40 mb-4 md:mb-8">
        <div className="bg-white rounded-2xl md:rounded-[2.5rem] p-4 md:p-6 shadow-lg shadow-indigo-500/10 border border-indigo-50">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={translations?.placeholder || 'Add text here to get started....'}
            className="w-full px-4 md:px-6 py-3 md:py-4 text-base md:text-lg border-2 border-indigo-100 rounded-full focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all text-slate-800 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* 移动端分类芯片 - 横向滚动 */}
      <div className="mb-4 md:hidden">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4" ref={mobileCategoryListRef}>
          {availableCategories.map((category) => {
            const isActive = selectedCategory === category.id
            return (
              <button
                key={category.id}
                ref={(el) => {
                  // 同时保存到 refs，这样滚动函数可以找到它
                  categoryButtonRefs.current[category.id] = el
                }}
                onClick={() => handleCategoryClick(category)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'bg-white text-slate-700 border border-indigo-100 hover:bg-indigo-50 hover:border-indigo-200'
                }`}
              >
                <span className="text-base">{category.icon}</span>
                <span>{getCategoryName(category.id)}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
        {/* 左侧分类栏 - 桌面端显示 */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-white rounded-2xl p-4 shadow-lg shadow-indigo-500/10 border border-indigo-50 sticky top-[calc(5rem+132px)] z-30">
            <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">{translations?.selectFontStyle || 'Select a font style'}</h3>
            <div ref={categoryListRef} className="space-y-2 max-h-[400px] overflow-y-auto">
              {availableCategories.map((category) => {
                const isActive = selectedCategory === category.id
                return (
                  <button
                    key={category.id}
                    ref={(el) => {
                      categoryButtonRefs.current[category.id] = el
                    }}
                    onClick={() => handleCategoryClick(category)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                        : 'text-slate-700 hover:bg-indigo-50 hover:shadow-sm'
                    }`}
                  >
                    <span className="text-xl">{category.icon}</span>
                    <span className="font-medium text-sm flex-1">{getCategoryName(category.id)}</span>
                    {categoryFontCounts[category.id] !== undefined && (
                      <span className={`text-xs ${
                        isActive ? 'text-white/80' : 'text-slate-400'
                      }`}>
                        {categoryFontCounts[category.id]} {categoryFontCounts[category.id] === 1 ? (translations?.font || 'font') : (translations?.fonts || 'fonts')}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* 字体预览区域 */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg shadow-indigo-500/10 border border-indigo-50">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-bold text-slate-900">
                {selectedCategory === 'all' 
                  ? (translations?.allFonts || 'All Fonts')
                  : `${getCategoryName(selectedCategory)} ${translations?.fonts || 'fonts'}`}
              </h3>
              <span className="text-xs md:text-sm text-slate-500 font-medium">
                {filteredFonts.length} {filteredFonts.length === 1 ? (translations?.font || 'font') : (translations?.fonts || 'fonts')}
              </span>
            </div>
            
            <div className="space-y-2 md:space-y-3 max-h-[calc(100vh-500px)] md:max-h-[800px] overflow-y-auto">
              {filteredFonts.map((font) => {
                // 确保使用固定的默认值，避免服务器和客户端不一致导致水合错误
                const displayText = inputText || defaultTranslations.defaultText || 'Toolaze Font Generator 123'
                const convertedText = convertText(displayText, font.id)
                const isCopied = copiedFontId === font.id
                
                return (
                  <div
                    key={font.id}
                    className="p-3 md:p-4 border border-indigo-100 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all group bg-white"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-base md:text-lg text-slate-800 break-all" suppressHydrationWarning>
                          {convertedText}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {font.category && font.category !== 'all' && (
                            <span className="text-xs text-indigo-600 font-medium px-2 py-0.5 bg-indigo-50 rounded">
                              {getCategoryName(font.category)}
                            </span>
                          )}
                          <span className="text-xs text-slate-500">{getFontName(font.name)}</span>
                        </div>
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
                        className={`w-full md:w-auto px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap text-center flex items-center justify-center ${
                          isCopied
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700'
                        }`}
                      >
                        {isCopied ? (translations?.copied || 'Copied!') : (translations?.copy || 'Copy')}
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
