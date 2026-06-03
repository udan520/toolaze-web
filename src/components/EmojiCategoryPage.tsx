'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useCommonTranslations } from '@/lib/use-common-translations'

// 动态导入 emoji-picker-react（避免 SSR 问题）
// 在静态导出模式下，直接导入枚举值会导致模块解析错误
const EmojiPicker = dynamic(
  () => import('emoji-picker-react'),
  { ssr: false }
)

// 使用字符串字面量代替枚举值（避免静态导出模式下的模块解析问题）
const SKIN_TONE_NEUTRAL = 'neutral' as const
const SKIN_TONE_PICKER_LOCATION_PREVIEW = 'PREVIEW' as const

// Emoji 分类
const EMOJI_CATEGORIES = [
  { id: 'suggested', labelKey: 'suggested', fallbackLabel: 'Frequently Used', icon: '⭐' },
  { id: 'smileys_people', labelKey: 'smileysPeople', fallbackLabel: 'Smileys & People', icon: '😀' },
  { id: 'animals_nature', labelKey: 'animalsNature', fallbackLabel: 'Animals & Nature', icon: '🐶' },
  { id: 'food_drink', labelKey: 'foodDrink', fallbackLabel: 'Food & Drink', icon: '🍕' },
  { id: 'travel_places', labelKey: 'travelPlaces', fallbackLabel: 'Travel & Places', icon: '✈️' },
  { id: 'activities', labelKey: 'activities', fallbackLabel: 'Activities', icon: '⚽' },
  { id: 'objects', labelKey: 'objects', fallbackLabel: 'Objects', icon: '💡' },
  { id: 'symbols', labelKey: 'symbols', fallbackLabel: 'Symbols', icon: '❤️' },
  { id: 'flags', labelKey: 'flags', fallbackLabel: 'Flags', icon: '🏳️' },
]

interface EmojiCategoryPageProps {
  category?: string
  className?: string
  initialTranslations?: any
}

export default function EmojiCategoryPage({ category, className = '', initialTranslations }: EmojiCategoryPageProps) {
  const emojiText = useCommonTranslations(initialTranslations)?.common?.emojiPicker
  const [selectedCategory, setSelectedCategory] = useState(category || 'suggested')
  const [recentEmojis, setRecentEmojis] = useState<string[]>([])
  const [copiedEmoji, setCopiedEmoji] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const emojiPickerRef = useRef<HTMLDivElement>(null)
  const isScrollingRef = useRef(false)

  // 客户端挂载
  useEffect(() => {
    setIsMounted(true)
    // 从 localStorage 加载最近使用的 emoji
    const saved = localStorage.getItem('recent-emojis')
    if (saved) {
      try {
        setRecentEmojis(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse recent emojis:', e)
      }
    }
  }, [])

  // 保存最近使用的 emoji
  const saveRecentEmoji = (emoji: string) => {
    const updated = [emoji, ...recentEmojis.filter(e => e !== emoji)].slice(0, 20)
    setRecentEmojis(updated)
    localStorage.setItem('recent-emojis', JSON.stringify(updated))
  }

  // 处理 emoji 点击
  const handleEmojiClick = (emojiData: any) => {
    const emoji = emojiData.emoji
    navigator.clipboard.writeText(emoji)
    saveRecentEmoji(emoji)
    setCopiedEmoji(emoji)
    setTimeout(() => setCopiedEmoji(null), 2000)
  }

  // 处理分类点击：滚动右侧 emoji 区域到该分类
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId)
    isScrollingRef.current = true

    const runScroll = () => {
      const root = emojiPickerRef.current
      if (!root) return
      const scrollBody = root.querySelector('.epr-body') as HTMLElement | null
      const categoryEl = root.querySelector(`[data-name="${categoryId}"]`) as HTMLElement | null
      if (scrollBody && categoryEl) {
        const targetTop = categoryEl.offsetTop
        scrollBody.scrollTo({ top: targetTop, behavior: 'smooth' })
      }
      setTimeout(() => {
        isScrollingRef.current = false
      }, 400)
    }

    requestAnimationFrame(() => {
      runScroll()
      // 若初次未找到（虚拟列表未渲染），稍后再试
      setTimeout(runScroll, 150)
    })
  }

  // 检测可见的分类（右侧滚动时同步左侧高亮）
  useEffect(() => {
    if (!isMounted || isScrollingRef.current) return

    const root = emojiPickerRef.current
    if (!root) return
    const scrollBody = root.querySelector('.epr-body') as HTMLElement | null
    if (!scrollBody) return

    const handleScroll = () => {
      if (isScrollingRef.current) return
      const categories = root.querySelectorAll('li[data-name]')
      const scrollTop = scrollBody.scrollTop
      const viewportMid = scrollTop + scrollBody.clientHeight / 3

      for (const el of Array.from(categories)) {
        const li = el as HTMLElement
        const name = li.getAttribute('data-name')
        if (!name) continue
        const top = li.offsetTop
        const height = li.offsetHeight
        if (top <= viewportMid && top + height > viewportMid) {
          if (name !== selectedCategory) setSelectedCategory(name)
          break
        }
      }
    }

    scrollBody.addEventListener('scroll', handleScroll)
    return () => scrollBody.removeEventListener('scroll', handleScroll)
  }, [isMounted, selectedCategory])

  if (!isMounted) {
    return (
      <div className={['flex gap-6', className].filter(Boolean).join(' ')}>
        <div className="w-64 bg-white rounded-xl p-4 border border-slate-200">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded"></div>
            <div className="h-8 bg-slate-200 rounded"></div>
            <div className="h-8 bg-slate-200 rounded"></div>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-xl p-4 border border-slate-200">
          <div className="animate-pulse h-96 bg-slate-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={['flex flex-col lg:flex-row gap-6', className].filter(Boolean).join(' ')}>
      {/* 左侧分类导航：桌面端纵向，H5 端横向滑动 */}
      <div className="w-full lg:w-64 bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">{emojiText?.categoriesTitle || 'Categories'}</h3>
        <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
          {EMOJI_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`flex-shrink-0 lg:w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {emojiText?.categories?.[cat.labelKey] || cat.fallbackLabel}
            </button>
          ))}
        </div>
      </div>

      {/* 右侧 Emoji 选择器 */}
      <div className="flex-1 relative">
        {/* Emoji Picker - 增大显示区域 */}
        <div ref={emojiPickerRef} className="relative min-h-[520px]">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            defaultSkinTone={SKIN_TONE_NEUTRAL as any}
            width="100%"
            height={520}
            previewConfig={{
              showPreview: true
            }}
            skinTonePickerLocation={SKIN_TONE_PICKER_LOCATION_PREVIEW as any}
            searchDisabled={false}
          />
          
          {/* Copied 通知 */}
          {copiedEmoji && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium z-50">
              {emojiText?.copied || 'Copied!'} {copiedEmoji}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
