'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { SkinTones } from 'emoji-picker-react'

// 动态导入 emoji-picker-react（避免 SSR 问题）
const EmojiPicker = dynamic(
  () => import('emoji-picker-react'),
  { ssr: false }
)

// 肤色选项
const SKIN_TONES = [
  { value: SkinTones.NEUTRAL, label: 'Default', emoji: '👤' },
  { value: SkinTones.LIGHT, label: 'Light', emoji: '👶' },
  { value: SkinTones.MEDIUM_LIGHT, label: 'Medium Light', emoji: '👦' },
  { value: SkinTones.MEDIUM, label: 'Medium', emoji: '👧' },
  { value: SkinTones.MEDIUM_DARK, label: 'Medium Dark', emoji: '👨' },
  { value: SkinTones.DARK, label: 'Dark', emoji: '👩' },
]

// Emoji 分类
const EMOJI_CATEGORIES = [
  { id: 'suggested', label: 'Frequently Used', icon: '⭐' },
  { id: 'smileys_people', label: 'Smileys & People', icon: '😀' },
  { id: 'animals_nature', label: 'Animals & Nature', icon: '🐶' },
  { id: 'food_drink', label: 'Food & Drink', icon: '🍕' },
  { id: 'travel_places', label: 'Travel & Places', icon: '✈️' },
  { id: 'activities', label: 'Activities', icon: '⚽' },
  { id: 'objects', label: 'Objects', icon: '💡' },
  { id: 'symbols', label: 'Symbols', icon: '❤️' },
  { id: 'flags', label: 'Flags', icon: '🏳️' },
]

interface EmojiCategoryPageProps {
  category?: string
  className?: string
}

export default function EmojiCategoryPage({ category, className = '' }: EmojiCategoryPageProps) {
  const [skinTone, setSkinTone] = useState(SkinTones.NEUTRAL)
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

  // 处理分类点击
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId)
    isScrollingRef.current = true
    
    // 等待 emoji picker 渲染后滚动到对应分类
    setTimeout(() => {
      const scrollContainer = emojiPickerRef.current?.querySelector('.epr-emoji-category') as HTMLElement
      if (scrollContainer) {
        scrollContainer.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      setTimeout(() => {
        isScrollingRef.current = false
      }, 500)
    }, 100)
  }

  // 检测可见的分类（用于双向联动）
  useEffect(() => {
    if (!isMounted || isScrollingRef.current) return

    const scrollContainer = emojiPickerRef.current?.querySelector('.epr-emoji-category') as HTMLElement
    if (!scrollContainer) return

    const handleScroll = () => {
      if (isScrollingRef.current) return

      const categoryLabels = scrollContainer.querySelectorAll('[data-id]')
      const viewportTop = scrollContainer.scrollTop + 100 // 考虑 sticky nav 高度

      for (const label of Array.from(categoryLabels)) {
        const element = label as HTMLElement
        const rect = element.getBoundingClientRect()
        const containerRect = scrollContainer.getBoundingClientRect()
        const relativeTop = rect.top - containerRect.top + scrollContainer.scrollTop

        if (relativeTop <= viewportTop && relativeTop + rect.height > viewportTop) {
          const categoryId = element.getAttribute('data-id')
          if (categoryId && categoryId !== selectedCategory) {
            setSelectedCategory(categoryId)
          }
          break
        }
      }
    }

    scrollContainer.addEventListener('scroll', handleScroll)
    return () => scrollContainer.removeEventListener('scroll', handleScroll)
  }, [isMounted, selectedCategory])

  if (!isMounted) {
    return (
      <div className={`flex gap-6 ${className}`}>
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
    <div className={`flex flex-col lg:flex-row gap-6 ${className}`}>
      {/* 左侧分类导航 */}
      <div className="w-full lg:w-64 bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Categories</h3>
          {EMOJI_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 右侧 Emoji 选择器 */}
      <div className="flex-1 relative">
        {/* 顶部肤色选择器 */}
        <div className="mb-4 bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Skin Tone
          </label>
          <div className="flex gap-2 flex-wrap">
            {SKIN_TONES.map((tone) => (
              <button
                key={tone.value}
                onClick={() => setSkinTone(tone.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  skinTone === tone.value
                    ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="mr-1">{tone.emoji}</span>
                {tone.label}
              </button>
            ))}
          </div>
        </div>

        {/* Emoji Picker */}
        <div ref={emojiPickerRef} className="relative">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            defaultSkinTone={skinTone}
            previewConfig={{
              showPreview: false
            }}
            searchDisabled={false}
          />
          
          {/* Copied 通知 */}
          {copiedEmoji && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium z-50">
              Copied! {copiedEmoji}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
