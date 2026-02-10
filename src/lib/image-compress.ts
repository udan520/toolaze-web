/**
 * 图片压缩和转换工具
 * 将图片转换为 WebP 格式并压缩到指定大小以内
 */

/**
 * 将图片转换为 WebP 格式并压缩到指定大小（KB）
 * @param file 原始图片文件
 * @param maxSizeKB 最大文件大小（KB），默认 100KB
 * @returns 压缩后的 WebP Blob
 */
export async function compressToWebP(
  file: File,
  maxSizeKB: number = 100
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onerror = () => reject(new Error('图片加载失败'))
    
    img.onload = async () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('无法获取 Canvas 上下文'))
          return
        }

        const maxSizeBytes = maxSizeKB * 1024
        let width = img.width
        let height = img.height
        let quality = 0.9 // 初始质量

        // 如果图片太大，先缩小尺寸
        const maxDimension = 1920 // 最大尺寸
        if (width > maxDimension || height > maxDimension) {
          const ratio = Math.min(maxDimension / width, maxDimension / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }

        let blob: Blob | null = null
        let attempts = 0
        const maxAttempts = 10

        // 逐步降低质量直到满足大小要求
        while (attempts < maxAttempts) {
          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0, width, height)

          blob = await new Promise<Blob | null>((resolveBlob) => {
            canvas.toBlob(resolveBlob, 'image/webp', quality)
          })

          if (!blob) {
            reject(new Error('图片转换失败'))
            return
          }

          // 如果文件大小满足要求，返回结果
          if (blob.size <= maxSizeBytes) {
            resolve(blob)
            return
          }

          // 如果文件仍然太大，降低质量
          if (quality > 0.3) {
            quality -= 0.1
          } else {
            // 质量已经很低，开始缩小尺寸
            width = Math.round(width * 0.9)
            height = Math.round(height * 0.9)
            quality = 0.8 // 重置质量
          }

          attempts++
        }

        // 如果经过多次尝试仍然太大，返回最后一次的结果
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('压缩失败：无法达到目标大小'))
        }
      } catch (error) {
        reject(error instanceof Error ? error : new Error('压缩过程出错'))
      }
    }

    // 加载图片
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        img.src = e.target.result as string
      }
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsDataURL(file)
  })
}

/**
 * 获取文件大小的友好显示
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }
}
