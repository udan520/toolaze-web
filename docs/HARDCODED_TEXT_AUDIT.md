# FontGenerator 组件硬编码文本审计报告

## ✅ 所有硬编码文本已修复

### 1. FontGenerator.tsx

#### ✅ 已修复的硬编码文本

1. **`'All Fonts'`** (第 631-633 行)
   - 修复：使用 `translations.allFonts`
   - 翻译键：`common.fontGenerator.allFonts`
   - 日语：`"すべてのフォント"`

2. **`'Copy'` / `'Copied!'`** (第 685 行)
   - 修复：使用 `translations.copy` / `translations.copied`
   - 翻译键：`common.fontGenerator.copy` / `common.fontGenerator.copied`
   - 日语：`"コピー"` / `"コピーしました！"`

3. **分类名称显示** (第 659 行)
   - 修复：使用 `getCategoryName()` 函数获取翻译后的分类名称
   - 翻译键：`common.fontGenerator.categories.{categoryId}`

4. **输入框 placeholder** (第 570 行)
   - 修复：使用 `translations.placeholder`
   - 翻译键：`common.fontGenerator.placeholder`
   - 日语：`"ここにテキストを入力して開始してください...."`

5. **默认示例文本** (第 238, 240, 656 行)
   - 修复：使用 `translations.defaultText`（可选，保持英文作为示例也可）
   - 翻译键：`common.fontGenerator.defaultText`
   - 日语：`"Toolaze Font Generator 123"`（保持英文）

### 2. FontGeneratorHero.tsx

#### ✅ 已修复的硬编码文本

1. **信任标签** (第 73-75 行)
   - 修复：创建了 `TrustBar` 客户端组件，从翻译系统加载
   - 翻译键：`common.fontGenerator.trustBar.{private|instantPreview|noServerLogs}`
   - 日语：
     - `"100% プライベート"`
     - `"即座のプレビュー"`
     - `"サーバーログなし"`

## 新增的翻译字段

### common.json 结构

```json
{
  "common": {
    "fontGenerator": {
      "selectFontStyle": "...",
      "font": "...",
      "fonts": "...",
      "allFonts": "...",
      "copy": "...",
      "copied": "...",
      "placeholder": "...",
      "defaultText": "...",
      "trustBar": {
        "private": "...",
        "instantPreview": "...",
        "noServerLogs": "..."
      },
      "moreTools": "...",
      "categories": { ... }
    }
  }
}
```

## 新增的组件

### TrustBar.tsx
- 位置：`src/components/blocks/TrustBar.tsx`
- 功能：显示信任标签（100% Private, Instant Preview, No Server Logs）
- 特性：自动检测 locale 并加载对应翻译

## 避免再次遗漏的方法

1. **翻译前检查清单**：
   - [ ] 检查组件中所有硬编码字符串
   - [ ] 检查所有用户可见的文本
   - [ ] 检查 placeholder、按钮文本、标签等
   - [ ] 检查错误消息（如果需要用户看到）

2. **代码审查要点**：
   - 搜索组件中的字符串字面量（`'...'` 或 `"..."`）
   - 检查是否有 `|| 'fallback'` 模式（可能表示硬编码）
   - 检查是否有直接使用英文文本的地方

3. **验证步骤**：
   - 使用 `check-translation-keys.js` 验证结构一致性
   - 在目标语言环境下测试所有功能
   - 检查浏览器控制台是否有翻译相关的错误

4. **最佳实践**：
   - 所有用户可见文本都应该从翻译系统获取
   - 使用 TypeScript 类型检查确保翻译键存在
   - 为每个新组件创建翻译键文档
