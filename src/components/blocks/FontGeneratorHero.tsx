import FontGenerator from '@/components/FontGenerator'
import TrustBar from '@/components/blocks/TrustBar'
import React from 'react'

interface FontGeneratorHeroProps {
  h1: string | React.ReactNode
  desc: string
}

// 智能识别核心关键词并应用渐变
function renderH1WithGradient(h1: string | React.ReactNode): React.ReactNode {
  if (React.isValidElement(h1)) {
    return h1
  }

  if (typeof h1 !== 'string') {
    return h1
  }

  if (h1.includes('<span')) {
    return <span dangerouslySetInnerHTML={{ __html: h1 }} />
  }

  const keywordPatterns = [
    { pattern: /\b(Font Generator|Fonts Generator|Cursive|Fancy|Bold|Italic|Gothic|Tattoo|Calligraphy)\b/gi, name: 'keyword' },
    { pattern: /\b(Generator|Font|Fonts)\b/gi, name: 'tool' },
  ]

  const parts = h1.split(/(\s+)/)
  const result: React.ReactNode[] = []

  parts.forEach((part, index) => {
    if (/^\s+$/.test(part)) {
      result.push(part)
      return
    }

    let isKeyword = false
    for (const { pattern } of keywordPatterns) {
      pattern.lastIndex = 0
      if (pattern.test(part)) {
        isKeyword = true
        break
      }
    }

    if (isKeyword) {
      result.push(
        <span key={index} className="text-gradient">
          {part}
        </span>
      )
    } else {
      result.push(part)
    }
  })

  return <>{result}</>
}

export default function FontGeneratorHero({ h1, desc }: FontGeneratorHeroProps) {
  return (
    <header className="bg-[#F8FAFF] pb-12 px-6">
      <div className="max-w-4xl mx-auto text-center pt-8 mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-slate-900">
          {renderH1WithGradient(h1)}
        </h1>
        <p className="desc-text text-lg md:text-xl max-w-2xl mx-auto">
          {desc}
        </p>
      </div>
      <FontGenerator />
      <TrustBar />
    </header>
  )
}
