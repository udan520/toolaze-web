# SEO 管理后台

在本地查看、编辑各工具页面的 SEO 内容（JSON 文件）。

> **文档索引**：所有 SEO 规范文档总览见 `docs/README.md`。

## 启动

```bash
# 终端 1：管理后台
npm run admin:seo

# 终端 2：网站开发服务器（用于实时预览）
npm run dev
```

- 管理后台：http://localhost:3007（**必须用此端口打开后台页**；若在 Next 的 **3006** 打开，调用翻译等 API 会 404）
- 网站预览：http://localhost:3006

**若修改过 `admin-seo-server.js` 或 `admin-seo.html`，需重启管理后台**（Ctrl+C 后重新运行 `npm run admin:seo`），并在浏览器对后台页做一次 **强制刷新（Ctrl+Shift+R / ⌘+Shift+R）**，避免沿用缓存的旧 HTML（否则翻译等 API 仍可能 404）。验证 API：访问 http://localhost:3007/api/health 应含 `"version":"1.3"` 与 `translateSeo`；地址栏打开 http://localhost:3007/api/translate-seo 应返回 JSON（不是 404 文本）。

## 实时更新

### 开发环境（实时生效）

同时运行管理后台和 `npm run dev` 时，保存后**刷新网站页面**即可看到更新。Next.js 开发模式下每次请求都会重新读取 JSON 文件。

### 生产环境（需重新构建）

项目使用静态导出（`output: export`），线上内容在构建时已写入 HTML。保存后需：

1. 运行 `npm run build` 重新构建
2. 部署新构建产物

或使用管理后台的「保存并构建」按钮一键完成。

## 首页（多语言）

列表第一项 **「首页 (多语言 /)」**（内部 id：`homepage`）对应 **`src/data/<locale>/common.json` 中的 `home` 字段**，与 `/`、`/de`、`/ja` 等多语言首页文案一致。

- **保存**：只更新当前语种 `common.json` 里的 `home`，不会覆盖同一文件中的 `nav`、`footer` 等。
- **切换 JSON**：可直接编辑整块 `home` JSON（结构与落地页类似：`metadata`、`faq`、`features` 等）。
- **翻译多语言**：以英文 `common.json` 的 `home` 为源，写入各语言 `common.json` 的 `home`。
- **预览**：指向 `toolaze.com/` 或 `toolaze.com/{locale}/`。
- **板块可视化**：首页 JSON 结构与标准 L2 落地页不完全相同，若板块预览异常，请用「切换 JSON」编辑。

## 功能

- **工具列表**：展示所有有 SEO 内容的工具（含首页）
- **页面选择**：L2 主页面和 L3 子页面
- **多语言切换**：编辑页标题下方显示当前落地页在磁盘上**已存在的语言版本**标签（与 `src/data/<locale>/` 一致）；点击可切换到对应语种 JSON，预览 / 保存 / 删除 / 上架等均针对**当前语种文件**（英文下仍可「修改 URL」；其它语种隐藏该项以免误改 slug）
- **编辑 / 删除 / 新增**：各板块可编辑、删除，支持新增
- **预览**：链接到网站页面
- **AI 生成 SEO**：调用 Gemini API 生成 SEO 内容
- **翻译多语言**：以英文 `src/data/en/...` 为源，调用 [KIE Gemini 2.5 Flash](https://docs.kie.ai/market/gemini/gemini-2-5-flash) 写入 `de`、`ja`、`es`、`zh-TW`、`pt`、`fr`、`ko`、`it` 等目录（见下文）

## 翻译多语言（KIE Gemini 2.5 Flash）

在编辑页点击「翻译多语言」，勾选目标语言后执行。服务端会读取当前页的英文 JSON，保持键名与结构不变，仅翻译字符串值，并写入 `src/data/<locale>/`。

**站内链接 URL**：写盘前会自动把 HTML 里 `href="/…"` 的**相对站内路径**规范为与 `src/lib/hreflang.ts` 的 canonical 规则一致：非英语为 `/{locale}/路径`（如 `/de/font-generator/cursive`）；仅有 `[locale]` 路由的工具/页面首段会加前缀（如 `about`、`image-compressor`、`font-generator`）；根路径独有页面（如 `/watermark-remover`、`/ai-tools`）不加前缀，以免 404。`/model/seedance-2/…` 会规范为 `/{locale}/seedance-2/…`。

### 配置

在 `.env.local` 中配置（与 AI 生成 SEO 可共用同一组 Key，只要变量已加载即可）：

```
KIE_AI_API_KEY=xxx                    # 优先使用（kie.ai Bearer Token）
# 或沿用：
ZHEN_AI_API_KEY=xxx
KIE_API_BASE_URL=https://api.kie.ai   # 可选，默认 https://api.kie.ai
```

大页面翻译可能耗时数十秒至数分钟；若浏览器报超时，可在 `admin-seo.html` 的 `api(..., { timeoutMs })` 中适当加大翻译请求的等待时间。

翻译完成后需 **git 提交** 并 **`npm run build` + 部署**，线上静态页才会更新。

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
