/**
 * 为 HTML 内容中的内部链接添加语言前缀
 * @param htmlContent HTML 内容字符串
 * @param locale 当前语言代码
 * @returns 处理后的 HTML 内容
 */
export function localizeInternalLinks(htmlContent: string, locale: string): string {
  if (!htmlContent || locale === 'en') {
    return htmlContent
  }

  // 匹配 href="/font-generator/xxx" 或 href="/image-compressor/xxx" 等内部链接
  // 但不匹配已经包含语言前缀的链接（如 href="/de/font-generator/xxx"）
  // 也不匹配外部链接（如 href="http://..." 或 href="https://..."）
  return htmlContent.replace(
    /href="\/(font-generator|image-compressor|image-converter)(\/[^"]*)?"/gi,
    (match, tool, path = '') => {
      // 检查是否已经包含任何语言前缀（通过检查是否匹配 /[locale]/tool 模式）
      // 如果 match 已经包含 /de/、/ja/ 等语言代码，说明已经处理过，跳过
      const hasLocalePrefix = /\/[a-z]{2}(-[A-Z]{2})?\//.test(match)
      if (hasLocalePrefix) {
        return match
      }
      // 添加语言前缀
      return `href="/${locale}/${tool}${path}"`
    }
  )
}

/**
 * 递归处理对象中的所有字符串值，为内部链接添加语言前缀
 * @param obj 要处理的对象
 * @param locale 当前语言代码
 * @returns 处理后的对象
 */
export function localizeLinksInObject(obj: any, locale: string): any {
  if (!obj || locale === 'en') {
    return obj
  }

  if (typeof obj === 'string') {
    // 如果是字符串，检查是否包含 HTML 链接
    if (obj.includes('href=')) {
      return localizeInternalLinks(obj, locale)
    }
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => localizeLinksInObject(item, locale))
  }

  if (obj && typeof obj === 'object') {
    const result: any = {}
    for (const [key, value] of Object.entries(obj)) {
      result[key] = localizeLinksInObject(value, locale)
    }
    return result
  }

  return obj
}
