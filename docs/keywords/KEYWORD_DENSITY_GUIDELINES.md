# 关键词密度和布局指南

## 📊 SEO 关键词密度标准

### 主关键词密度
- **推荐密度**：1-2%
- **最低要求**：0.5%
- **最高限制**：3%（避免关键词堆砌）

### 长尾关键词密度
- **推荐密度**：每个关键词出现 1-2 次即可
- **总密度**：所有关键词总密度不超过 3%

### 关键词分布要求

#### 1. 核心位置（必须包含主关键词）
- ✅ **Title**：主关键词 + 品牌名
- ✅ **H1**：主关键词（精确匹配或变体）
- ✅ **Meta Description**：主关键词 + 1-2 个长尾关键词
- ✅ **前 100 字**：主关键词出现 1-2 次

#### 2. 内容分布（自然嵌入）
- **Intro 段落**：主关键词 1-2 次，相关关键词自然分布
- **Features 部分**：每个功能项可包含相关关键词
- **FAQ 部分**：长尾关键词自然嵌入到问题和答案中
- **Comparison 部分**：主关键词和相关关键词

#### 3. 关键词布局优先级
1. **Title**（最重要）
2. **H1**（最重要）
3. **Meta Description**（重要）
4. **前 100 字**（重要）
5. **内容段落**（自然分布）
6. **FAQ**（长尾关键词）

## 🎯 Rating 板块关键词要求

### 格式规范
Rating 板块的 `text` 字段必须根据每个落地页的具体内容编写，格式：

```
"Join thousands of satisfied users who trust Toolaze for [工具核心功能], [核心优势1], and [核心优势2]. [额外说明]."
```

### 关键词要求
- **必须包含**：工具的核心功能关键词（如：image compression, image conversion, AI image generation）
- **必须包含**：2-3 个核心优势关键词（如：fast, secure, free, private processing, no registration）
- **根据工具特性调整**：
  - **本地处理工具**：强调 "100% private processing"、"local processing"、"no uploads"
  - **API 调用工具**：强调 "no sign up required"、"fast generation"、"free forever"，**不能**说 "100% private processing"

### 示例

#### 本地处理工具（Image Compressor）
```json
"text": "Join thousands of satisfied users who trust Toolaze for fast, secure, and free image compression. No registration required, 100% private processing."
```

#### API 调用工具（Nano Banana Pro）
```json
"text": "Join thousands of satisfied users who trust Toolaze for fast, secure, and free AI image generation. No registration required, no sign up needed. Generate high-quality 4K images with Nano Banana Pro."
```

#### L3 页面特定（HEIC to JPG）
```json
"text": "\"Finally met the 20KB limit for my government exam registration! No more upload errors.\" - Join thousands of applicants who trust Toolaze for official portal compliance."
```

## ✅ 关键词检查清单

编写 SEO 内容后，检查以下项目：

- [ ] Title 包含主关键词
- [ ] H1 包含主关键词
- [ ] Meta Description 包含主关键词 + 1-2 个长尾关键词
- [ ] 前 100 字包含主关键词 1-2 次
- [ ] 主关键词密度在 1-2% 之间
- [ ] 长尾关键词自然分布在内容中（每个 1-2 次）
- [ ] 总关键词密度不超过 3%
- [ ] Rating 板块的 text 根据工具特性编写（本地处理 vs API 调用）
- [ ] 没有关键词堆砌（避免过度重复）
- [ ] 关键词使用自然，符合用户阅读习惯

## 📈 关键词密度计算方法

### 公式
```
关键词密度 = (关键词出现次数 / 总词数) × 100%
```

### 示例
- 总词数：500 词
- "nano banana pro" 出现：8 次
- 密度：8 / 500 × 100% = 1.6% ✅（符合 1-2% 标准）

## ⚠️ 常见错误

### ❌ 关键词堆砌
- 过度重复同一关键词
- 不自然的句子结构
- 关键词密度超过 3%

### ❌ 关键词缺失
- Title/H1 中没有主关键词
- 内容中关键词密度过低（< 0.5%）
- 长尾关键词完全没有使用

### ❌ 关键词位置不当
- 主关键词只出现在页面底部
- 前 100 字中没有主关键词
- Meta Description 中没有关键词

## 💡 最佳实践

1. **自然优先**：关键词使用要自然，符合用户阅读习惯
2. **位置优先**：优先在 Title、H1、前 100 字使用主关键词
3. **变体使用**：可以使用关键词的变体（如：AI image generator, image generator AI）
4. **语义相关**：使用相关关键词提升语义相关性
5. **定期检查**：定期检查关键词密度，确保符合标准
