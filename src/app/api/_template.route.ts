import { NextRequest, NextResponse } from 'next/server'

/**
 * API 路由模板
 * 
 * ⚠️ 重要：在 Next.js 静态导出模式下，所有 API 路由必须包含以下配置：
 * export const dynamic = 'force-static'
 * 
 * 否则构建会失败！
 */

// ⚠️ 必须添加：静态导出模式配置
export const dynamic = 'force-static'

/**
 * 示例：GET 请求处理
 */
export async function GET(request: NextRequest) {
  try {
    // 你的业务逻辑
    return NextResponse.json({ message: 'Hello World' })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * 示例：POST 请求处理
 */
export async function POST(request: NextRequest) {
  try {
    // 你的业务逻辑
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
