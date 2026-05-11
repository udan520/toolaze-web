# 语言切换与英语兜底跳转

全站统一逻辑见 **`src/lib/site-language-switch.ts`**（Navigation、Footer 共用，勿两套规则分叉）。

## 1. 何时显示语言入口（导航栏 + 页脚）

- **始终显示**语言入口（按钮/下拉）；**下拉里只列出**当前落地页 **`getSupportedLocaleCodes(pathname)`** 返回的语种（即该页实际有路由/有译文的语言）。
- **仅英文 canonical 的工具页**（`ENGLISH_ONLY_ROOT_TOOLS`：`watermark-remover`、`photo-restoration`、`ai-couple-photo-maker`、`ai-tools`）：下拉中**只有 `en`**；无 `/de/...` 等同路径的其它语言版本。
- **首页、About、Privacy、Terms**（各 locale 均有对应路由）→ 列出 **全部站点语种**。
- **`/model/[model]`**：按 **`MODEL_SUPPORTED_LOCALES`**（如 Nano Banana 2 / GPT Image 2 多语；Nano Banana Pro / Seedance / Kling 仅 `en`）。

新增或调整工具的语种覆盖时：同步更新 **`TOOL_SUPPORTED_LOCALES`**、**`MODEL_SUPPORTED_LOCALES`**、以及必要时 **`ENGLISH_ONLY_ROOT_TOOLS`**。

## 2. 下拉中列出哪些语言

- **必须与** `getSupportedLocaleCodes(pathname)` 一致（由上述表与路径规则推导）。
- **不得**为尚无该落地页译文的语种生成可点选项；用户通过站内链进入不支持语种的页面时，由 **`resolveLocaleForPath`** 与 **`[locale]/[tool]/[slug]` 等页面的 `redirect`** 兜底到英语 canonical（见下节）。

## 3. 不支持当前语种时的跳转（例如韩语）

用户在落地页 A（支持韩语）切换到韩语后，再进入落地页 B（**该页未提供韩语**）：

- **客户端**：`Navigation` / `Footer` 使用 **`getPreferredLocalizedUrl`**，按目标路径的支持列表将偏好语种**回落到 `en`** 再生成链接。
- **`[locale]/[tool]/[slug]`**：服务端若 **`getSeoContent(..., locale)` 为空** 且 **`locale !== 'en'`**，则 **`redirect('/${tool}/${slug}')`**（英语 canonical，无前缀）；**seedance-2 L3** 另按 **`/model/seedance-2/[slug]`** 规则。
- **L2**（如 `[locale]/image-compressor`）：若 **`getL2SeoContent` 为空则 `redirect`** 到无前缀英语页，保持现有行为。

这样避免出现空白或 404，并统一到英文内容。

## 4. 修改清单（自检）

- [ ] `TOOL_SUPPORTED_LOCALES` / `MODEL_SUPPORTED_LOCALES` / `ENGLISH_ONLY_ROOT_TOOLS` 已与 `src/app` 路由与 `src/data` 实际目录一致  
- [ ] `npm run build` 通过  
