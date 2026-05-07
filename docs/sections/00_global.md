# 全局规范

> 适用于所有 SEO 板块的通用规则。

## 1. 样式规范

### H2 标题
- 所有 SEO 板块的 H2 必须使用 `text-4xl`（36px）
- Tailwind：`text-4xl font-extrabold text-center text-slate-900`
- 禁止响应式字体（如 `text-3xl md:text-4xl`）
- 适用：Intro、Features、How To Use、Performance Metrics、Comparison、Scenarios、Rating、FAQ

### JSON 标题字段禁止 CSS
`intro.title`、`features.title`、`scenesTitle`、`faqTitle` 等必须是**纯文本**，禁止写入 CSS 类名、HTML 或 Tailwind 类。样式由前端渲染时自动应用。

## 2. 功能真实性

- 只写 `FEATURE_SPECIFICATIONS.md` 中明确支持的功能
- 不支持的功能绝对不能写
- 未使用的技术不能写（如：没有 AI 就不能说 AI 技术）

## 3. 技术准确性

- 只提及实际使用的技术栈
- 不能夸大技术能力
- 不能使用未实现的技术术语

## 4. 内容一致性

- 所有页面的功能描述必须一致
- 不能在不同页面中描述不同的功能支持

## 5. 禁止事项

1. **禁止夸大功能**：不能写不支持的功能、未实现的技术、超出实际能力的特性
2. **禁止技术误导**：没有 AI 就不能说 AI；不支持 video 就不能写 video；不是云端处理就不能说云端
3. **禁止内容矛盾**：不同页面描述不一致；功能列表与实际不符
4. **禁止 FAQ 内容重复**：不同 L3 使用相同或高度相似的 FAQ；FAQ 少于 5 个；重复度超过 40%
5. **禁止 FAQ 模型对比只介绍一方**：对比类 FAQ 必须同时介绍两个模型的核心差异

## 6. 检查清单（编写后）

- [ ] 所有功能都在 `specs/` 支持列表中
- [ ] 没有提及不支持的功能
- [ ] 技术描述准确
- [ ] 内容与其他页面一致
- [ ] Use Cases 每个场景配置了 icon，且不重复（见 [scenarios.md](scenarios.md)）
- [ ] FAQ 至少 5 个问题，针对该 L3 定制，重复度 < 40%（见 [faq.md](faq.md)）
