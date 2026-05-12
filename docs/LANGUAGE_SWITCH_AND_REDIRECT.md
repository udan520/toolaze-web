# 语言切换与英语兜底跳转

全站统一逻辑见 **`src/lib/site-language-switch.ts`**（Navigation、Footer 共用，勿两套规则分叉）。

## 1. 何时显示语言入口（导航栏 + 页脚）

- **始终显示**语言入口（按钮/下拉）。
- **下拉里列出的语种**：与首页一致，**始终为全站支持语言**（`getSupportedLocaleCodes` → 与 `SITE_LOCALES` / `ALL_LOCALE_CODES` 一致）。
- **点击某一语种后的 URL**：由 **`getAlternateLanguageUrl(pathname, targetLocale)`** 决定。若当前落地页**没有**该语种的译文/路由（见 `getContentSupportedLocaleCodes`），则跳转到该页的**英文 canonical**（无前缀路径，`toEnglishCanonicalPath`），而不是保留错误 locale。

## 2. 内容实际支持哪些语言（用于回退判断）

- **`getContentSupportedLocaleCodes(pathname)`** 与 `TOOL_SUPPORTED_LOCALES`、`MODEL_SUPPORTED_LOCALES`、`ENGLISH_ONLY_ROOT_TOOLS` 及静态页规则一致；**不用于裁剪下拉**，只用于：
  - `getAlternateLanguageUrl` 是否在目标语种有该页；
  - `resolveLocaleForPath` / `getPreferredLocalizedUrl`（站内链在偏好语种无该页时仍走英文 canonical）。

新增或调整工具的语种覆盖时：同步更新 **`TOOL_SUPPORTED_LOCALES`**、**`MODEL_SUPPORTED_LOCALES`**、以及必要时 **`ENGLISH_ONLY_ROOT_TOOLS`**。

## 3. 不支持当前语种时的跳转（服务端）

用户在带 locale 的 URL 上但 **SEO JSON 缺失** 时，仍由 **`[locale]/[tool]/[slug]`** 等页面的 **`redirect`** 到英文 canonical（现有行为不变）。见各 `page.tsx` 实现。

## 4. 修改清单（自检）

- [ ] `TOOL_SUPPORTED_LOCALES` / `MODEL_SUPPORTED_LOCALES` / `ENGLISH_ONLY_ROOT_TOOLS` 已与 `src/app` 路由与 `src/data` 一致  
- [ ] **`[locale]/[tool]/[slug]`** 的 **`generateStaticParams`**：凡 `dynamicParams = false` 下应可访问的 L3（含 **`emoji-copy-and-paste`**），均已按 `locale × slug` 写入 `params`（勿只 `getAllSlugs` 而不 `push`）  
- [ ] `npm run build` 通过  
