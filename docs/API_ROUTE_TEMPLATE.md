# API 路由创建模板和规范

## ⚠️ 重要提示

在 Next.js 静态导出模式（`output: 'export'`）下，**所有 API 路由必须包含静态导出配置**，否则构建会失败。

## 必须添加的配置

在每个 API 路由文件（`route.ts` 或 `route.js`）的**文件开头**，必须添加：

```typescript
export const dynamic = 'force-static'
```

## 模板文件

创建新 API 路由时，可以参考模板文件：
- `src/app/api/_template.route.ts`

## 完整示例

```typescript
import { NextRequest, NextResponse } from 'next/server'

// ⚠️ 必须添加：静态导出模式配置
export const dynamic = 'force-static'

export async function GET(request: NextRequest) {
  try {
    // 你的业务逻辑
    return NextResponse.json({ message: 'Success' })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
```

## 自动检查

项目已配置自动检查脚本，在以下情况会自动检查：

1. **构建前检查**：运行 `npm run build` 时会自动检查
2. **部署前检查**：运行 `npm run pre-deploy` 时会检查
3. **手动检查**：运行 `node scripts/check-api-routes.js` 可以单独检查

## 常见错误

### ❌ 错误示例（缺少配置）

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // 缺少 export const dynamic = 'force-static'
  return NextResponse.json({ message: 'Hello' })
}
```

**错误信息：**
```
Error: export const dynamic = "force-static"/export const revalidate not configured 
on route "/api/your-route" with "output: export".
```

### ✅ 正确示例

```typescript
import { NextRequest, NextResponse } from 'next/server'

// ✅ 已添加静态导出配置
export const dynamic = 'force-static'

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello' })
}
```

## 注意事项

1. **配置位置**：`export const dynamic = 'force-static'` 必须放在文件顶部，在导入语句之后
2. **所有路由**：无论是 GET、POST、PUT、DELETE 等，都需要添加此配置
3. **子路由**：嵌套的 API 路由（如 `/api/image-to-image/status`）也需要添加配置

## 相关文件

- 检查脚本：`scripts/check-api-routes.js`
- 模板文件：`src/app/api/_template.route.ts`
- 部署前检查：`scripts/pre-deploy-check.js`
