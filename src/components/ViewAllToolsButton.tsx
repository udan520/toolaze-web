'use client'

import Link from 'next/link'
import { useMemo } from 'react'

interface ViewAllToolsButtonProps {
  href: string
  text?: string
  variant?: 'related' | 'all'
  className?: string
}

export default function ViewAllToolsButton({ 
  href, 
  text,
  variant = 'related',
  className = ''
}: ViewAllToolsButtonProps) {
  // 如果没有提供 text，使用默认值（客户端组件无法直接访问翻译）
  // 建议在使用时从服务端传递翻译后的文本
  const defaultText = variant === 'all' ? 'View All Tools' : 'View All Related Tools'
  const displayText = text || defaultText

  // 使用 useMemo 确保 className 在服务器和客户端一致
  // 将基础类名和额外类名分开处理，避免 Tailwind 类名被截断
  const finalClassName = useMemo(() => {
    const baseClasses = 'inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-full hover:shadow-lg hover:shadow-indigo-500/50 transition-all text-base'
    
    if (className && className.trim()) {
      return `${baseClasses} ${className.trim()}`
    }
    return baseClasses
  }, [className])

  return (
    <div className="text-center">
      <Link
        href={href}
        className={finalClassName}
      >
        {displayText}
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  )
}
