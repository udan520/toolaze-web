import { redirect, notFound } from 'next/navigation'

// 不支持多语言的工具列表
// 这些工具只有英语版本，访问其他语言版本时应该重定向到英语版本
const NON_MULTILINGUAL_TOOLS = ['font-generator']

// 支持多语言的工具列表（在 [locale] 目录下有对应的页面）
const MULTILINGUAL_TOOLS = ['image-compressor', 'image-converter']

interface PageProps {
  params: Promise<{
    locale: string
    tool: string
  }>
}

export default async function ToolPage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'
  const tool = resolvedParams.tool

  if (!tool) {
    redirect('/')
    return null
  }

  // 如果工具不支持多语言，且当前不是英语，重定向到英语版本
  if (NON_MULTILINGUAL_TOOLS.includes(tool)) {
    if (locale !== 'en') {
      redirect(`/${tool}`)
    } else {
      // 如果是英语，也重定向到无locale版本（因为英语是默认的）
      redirect(`/${tool}`)
    }
  }

  // 如果工具支持多语言，但当前路径没有对应的页面，返回 404
  // 支持多语言的工具应该有自己专门的页面处理逻辑（如 image-compressor/page.tsx）
  if (!MULTILINGUAL_TOOLS.includes(tool)) {
    notFound()
    return null
  }

  // 如果工具支持多语言，应该由具体的工具页面处理
  // 这里不应该到达，因为支持多语言的工具应该有专门的页面
  notFound()
  return null
}
