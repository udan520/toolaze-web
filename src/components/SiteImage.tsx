'use client'

import Image, { ImageProps } from 'next/image'
import { useState, useEffect } from 'react'
import { generateAltFromImage } from '@/lib/generate-alt'

/**
 * SiteImage - 通用的图片组件
 * 
 * 功能：
 * - 支持从 /public 文件夹读取本地图片（使用相对路径，如 "/logo.png"）
 * - 支持从 Cloudflare R2 读取远程图片（使用完整 URL，如 "https://pub-xxxxx.r2.dev/..."）
 * - SEO 优化：支持自动生成 alt 文本（基于图片内容）
 * - 自动设置 priority：通过 isAboveFold 参数指定首屏图片，自动设置 priority={true}
 * 
 * @example
 * // 本地图片（手动指定 alt）
 * <SiteImage src="/logo.png" alt="Toolaze Logo" width={200} height={50} />
 * 
 * // R2 远程图片（手动指定 alt）
 * <SiteImage src="https://pub-xxxxx.r2.dev/image.jpg" alt="User Image" width={800} height={600} />
 * 
 * // 自动生成 alt 文本（基于图片内容）
 * <SiteImage src="https://pub-xxxxx.r2.dev/image.jpg" autoAlt width={800} height={600} />
 * 
 * // 首屏图片（自动设置 priority 以优化首屏加载）
 * <SiteImage src="/hero.jpg" alt="Hero Image" width={1200} height={600} isAboveFold />
 */
interface SiteImageProps extends Omit<ImageProps, 'alt'> {
  /**
   * 图片源路径
   * - 本地图片：以 "/" 开头的路径，相对于 /public 文件夹（如 "/logo.png"）
   * - 远程图片：完整的 URL（如 "https://pub-xxxxx.r2.dev/image.jpg"）
   */
  src: string
  
  /**
   * 图片的替代文本（可选，如果设置了 autoAlt 则自动生成）
   * 如果未提供 alt 且 autoAlt 为 false，则使用默认值 "Image"
   */
  alt?: string
  
  /**
   * 是否自动生成 alt 文本（基于图片内容）
   * 如果为 true，会调用 AI API 分析图片并生成描述性的 alt 文本
   * 注意：这需要配置 OPENAI_API_KEY 环境变量
   */
  autoAlt?: boolean
  
  /**
   * 是否为首屏图片（Above the fold）
   * 如果为 true，会自动设置 priority={true} 以优化首屏加载性能
   * 建议对页面顶部可见区域的图片设置此属性为 true
   */
  isAboveFold?: boolean
  
  /**
   * 图片宽度（必填）
   */
  width: number
  
  /**
   * 图片高度（必填）
   */
  height: number
}

export default function SiteImage({
  src,
  alt: providedAlt,
  autoAlt = false,
  isAboveFold = false,
  width,
  height,
  priority,
  ...restProps
}: SiteImageProps) {
  const [generatedAlt, setGeneratedAlt] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // 如果启用了 autoAlt 且没有提供 alt，则自动生成
  useEffect(() => {
    if (autoAlt && !providedAlt && src) {
      // 只对远程图片生成 alt（本地图片通常已经有明确的用途）
      const isRemoteImage = src.startsWith('http://') || src.startsWith('https://')
      if (isRemoteImage && !generatedAlt && !isGenerating) {
        setIsGenerating(true)
        generateAltFromImage(src)
          .then((alt) => {
            setGeneratedAlt(alt)
            setIsGenerating(false)
          })
          .catch(() => {
            setIsGenerating(false)
          })
      }
    }
  }, [autoAlt, providedAlt, src, generatedAlt, isGenerating])

  // 确定最终使用的 alt 文本
  const finalAlt = providedAlt || generatedAlt || 'Image'

  // 如果用户明确指定了 priority，使用用户指定的值
  // 否则，如果 isAboveFold 为 true，则自动设置 priority={true}
  const finalPriority = priority !== undefined ? priority : isAboveFold

  return (
    <Image
      src={src}
      alt={finalAlt}
      width={width}
      height={height}
      priority={finalPriority}
      {...restProps}
    />
  )
}
