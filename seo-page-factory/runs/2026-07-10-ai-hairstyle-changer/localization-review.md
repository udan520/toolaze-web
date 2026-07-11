# Localization Review

Status: passed_for_local_preview

## Locales

- en
- de
- es
- fr
- it
- ja
- ko
- pt
- zh-TW

## Review

- All locale JSON files exist and parse successfully.
- Module order and array structure match the English source.
- Metadata, hero, section headings, body copy, reviews, FAQ, navigation labels, footer labels, and homepage cards are localized.
- Women、Men、Custom Tab 标签和 22 个发型名称已按 locale 配置。
- Women 和 Men 的生成提示词保持英文并隐藏在模板数据中，不构成可见英文残留。
- Custom 的标签和 placeholder 已本地化。
- 页面顺序已移除 `promptExamples`，正文不再公开内部生成提示词。
- Brand names, URLs, file paths, schema keys, and model-independent technical values remain unchanged.
- The localization generator is stored in `localization/generate-locales.mjs`.
- The three-Tab synchronization script is stored in `localization/sync-preset-tabs.mjs`.

## Known Limitation

The shared hero image contains no locale-specific text. Final native-language editorial review and final template-image review are still required before production publishing.
