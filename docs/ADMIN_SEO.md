# SEO 管理后台

在本地查看、编辑各工具页面的 SEO 内容（JSON 文件）。

## 启动

```bash
# 终端 1：管理后台
npm run admin:seo

# 终端 2：网站开发服务器（用于实时预览）
npm run dev
```

- 管理后台：http://localhost:3007
- 网站预览：http://localhost:3006

**若修改过 `admin-seo-server.js` 或 `admin-seo.html`，需重启管理后台**（Ctrl+C 后重新运行 `npm run admin:seo`）。验证 API 是否正常：访问 http://localhost:3007/api/health 应返回 `{"ok":true}`。

## 实时更新

### 开发环境（实时生效）

同时运行管理后台和 `npm run dev` 时，保存后**刷新网站页面**即可看到更新。Next.js 开发模式下每次请求都会重新读取 JSON 文件。

### 生产环境（需重新构建）

项目使用静态导出（`output: export`），线上内容在构建时已写入 HTML。保存后需：

1. 运行 `npm run build` 重新构建
2. 部署新构建产物

或使用管理后台的「保存并构建」按钮一键完成。

## 功能

- **工具列表**：展示所有有 SEO 内容的工具
- **页面选择**：L2 主页面和 L3 子页面
- **编辑 / 删除 / 新增**：各板块可编辑、删除，支持新增
- **预览**：链接到网站页面
- **AI 生成 SEO**：调用 Gemini API 生成 SEO 内容

## AI 生成 SEO

在编辑页面点击「生成 SEO」按钮，可调用 Gemini API 生成整页 SEO 内容。

### 配置

在 `.env.local` 中配置：

```
ZHEN_AI_API_KEY=sk-xxx          # 必填，API Key
ZHEN_AI_FLUX_BASE_URL=https://ai.t8star.cn   # 可选，默认 ai.t8star.cn
GEMINI_MODEL=gemini-2.0-flash   # 可选，默认 gemini-2.0-flash
```

**验证 API 是否可用**：启动管理后台后，在浏览器访问 http://localhost:3007/api/test-gemini ，会返回实际请求结果：
- `ok: true` 表示 API 正常
- `ok: false` 或 `status: 404` 表示 Base URL 可能不支持 chat，可尝试将 `ZHEN_AI_FLUX_BASE_URL` 改为支持 chat 的平台（如 gpt-best 的 Base URL）

### 生成选项

- **关键词参考**：选择 `docs/keywords/` 下的 JSON 文件，或上传 CSV/JSON，或粘贴文本
- **生成板块**：勾选要生成的板块（Metadata、Hero、How To Use、Model Intro、Features、Intro、Comparison、Scenarios、Rating、FAQ、Trust Bar）
- **参考规则**（可多选）：SEO 内容规范、SEO 布局规范、结构规范、工具规格

生成后点击「应用到当前页面」即可将内容替换到编辑器，可继续编辑后保存。

**新建 L3 页面**：在 URL 中填写新 slug（如 `how-to-remove-watermark`），生成后点击「应用」会创建新文件并跳转。watermark-remover 的 slug 已改为从文件系统动态读取，新建页面需点击「保存并构建」或运行 `npm run build` 后，网站才会包含新页面（静态导出需重新构建）。
