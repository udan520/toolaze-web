# 语言切换与英语兜底跳转

全站统一逻辑见 **`src/lib/site-language-switch.ts`**（Navigation、Footer 共用，勿两套规则分叉）。

## 1. 何时显示语言入口（导航栏 + 页脚）

- **仅当**当前 URL 对应的页面 **有两种及以上可选语言** 时，在 **顶部导航** 与 **页脚** 显示语言切换入口。
- **单语种落地页**（例如仅英文的 emoji-copy-and-paste、`/model/*`）→ **不显示**切换入口。
- **`ENGLISH_ONLY_ROOT_TOOLS`**（watermark-remover、photo-restoration、ai-couple-photo-maker、ai-tools）：页面本身只有英文路由，但仍在导航/页脚 **显示** 全站语种列表；点击 **非英语** 时跳转到 **`/${locale}` 该语种首页**（因不存在 `/ko/ai-couple-photo-maker` 等路径）；选 **英语** 则保留当前英文路径（含 slug）。
- **首页、About、Privacy、Terms**（存在各 locale 版本）→ **显示**，且列出全部站点支持的语种。

新增或调整工具的语种覆盖时：同步更新 **`TOOL_SUPPORTED_LOCALES`**（以及必要时 **`ENGLISH_ONLY_ROOT_TOOLS`**）。

## 2. 下拉中列出哪些语言

- 必须与 **`TOOL_SUPPORTED_LOCALES[tool]`**（或首页/静态页的「全语种」规则）一致。
- **`ENGLISH_ONLY_ROOT_TOOLS`**：列出 **全部站点语种**；切换目标由 **`getAlternateLanguageUrl`** 决定（非英语 → 该语种首页）。
- 其他工具：不得列出尚无 SEO JSON 的语种；用户选了也不会去到可用译文时，应由服务端 **重定向到英语**（见下节）。

## 3. 不支持当前语种时的跳转（例如韩语）

用户在落地页 A（支持韩语）切换到韩语后，再进入落地页 B（**该页未提供韩语 SEO JSON**）：

- **`[locale]/[tool]/[slug]`**：服务端若 **`getSeoContent(..., locale)` 为空** 且 **`locale !== 'en'`**，则 **`redirect('/${tool}/${slug}')`**（英语 canonical，无前缀）；**seedance-2** 另按 **`/model/seedance-2/[slug]`** 规则。
- **L2**（如 `[locale]/image-compressor`）：若已有 **`getL2SeoContent` 为空则 redirect** 到无前缀英语页的页面，保持现有行为。

这样避免出现空白或 404，并统一到英文内容。

## 4. 修改清单（自检）

- [ ] `TOOL_SUPPORTED_LOCALES` / 英文-only 工具列表已与 `src/data` 实际目录一致  
- [ ] `npm run build` 通过  
