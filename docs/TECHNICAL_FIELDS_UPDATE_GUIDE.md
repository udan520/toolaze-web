# 技术字段更新指南

## 概述

本文档说明如何更新和使用技术字段配置，以避免翻译检查脚本的误判。

## 配置文件位置

- **配置文件**: `scripts/translation-ignore-fields.json`
- **参考文档**: `docs/TECHNICAL_FIELDS_REFERENCE.md`
- **辅助模块**: `scripts/check-translation-helper.js`

## 当前记录的技术字段

以下字段已被记录为**不需要翻译**的技术字段：

1. **`in_menu`** - 布尔值，控制菜单显示
2. **`sectionsOrder`** - 数组，定义页面部分顺序
3. **`icon`** - Emoji 图标
4. **`iconType`** - 图标类型标识符

## 如何添加新的技术字段

### 步骤 1: 更新配置文件

编辑 `scripts/translation-ignore-fields.json`，在 `technicalFields` 数组中添加新字段：

```json
{
  "technicalFields": [
    "in_menu",
    "sectionsOrder",
    "icon",
    "iconType",
    "新字段名"  // 添加这里
  ]
}
```

### 步骤 2: 更新参考文档

编辑 `docs/TECHNICAL_FIELDS_REFERENCE.md`，在相应部分添加新字段的说明。

### 步骤 3: 更新检查脚本

所有使用 `check-translation-helper.js` 的脚本会自动使用新配置，无需修改。

如果脚本没有使用辅助模块，需要手动更新：

```javascript
const { findUntranslated, TECHNICAL_FIELDS } = require('./check-translation-helper')
```

## 已更新的脚本

以下脚本已更新为使用统一配置：

- ✅ `scripts/check-batch-compress-translations.js`
- ⏳ `scripts/check-compress-webp-translations.js` (待更新)
- ⏳ `scripts/check-compress-png-translations.js` (待更新)
- ⏳ 其他检查脚本 (待更新)

## 使用辅助模块

### 基本用法

```javascript
const { findUntranslated, isTechnicalField, TECHNICAL_FIELDS } = require('./check-translation-helper')

// 检查字段是否为技术字段
if (isTechnicalField('icon')) {
  // 跳过处理
}

// 查找未翻译字段（自动忽略技术字段）
const untranslated = findUntranslated(enData, langData)

// 获取技术字段列表
const fields = getTechnicalFields()
```

### 完整示例

```javascript
const fs = require('fs')
const path = require('path')
const { findUntranslated } = require('./check-translation-helper')

function checkTranslation(lang) {
  const enData = JSON.parse(fs.readFileSync('en/data.json', 'utf8'))
  const langData = JSON.parse(fs.readFileSync(`${lang}/data.json`, 'utf8'))
  
  // 自动忽略技术字段
  const untranslated = findUntranslated(enData, langData)
  
  return untranslated
}
```

## 注意事项

1. **技术字段必须存在**: 虽然不需要翻译，但这些字段必须在所有语言版本中存在，以保持数据结构一致性。

2. **metadata 对象**: `metadata` 对象本身是技术性的，但其内部的 `title` 和 `description` **需要翻译**。

3. **specs 对象**: `specs` 对象中的字段可能需要部分翻译，但技术术语（如 "Canvas API", "Client-Side"）应保持英文。

4. **向后兼容**: 添加新字段时，确保不会影响现有的翻译检查结果。

## 验证配置

运行检查脚本验证配置是否正确：

```bash
node scripts/check-batch-compress-translations.js
```

如果所有语言都显示 "✅ 所有内容均已翻译"，说明配置正确。

## 常见问题

### Q: 如何判断一个字段是否为技术字段？

A: 如果字段满足以下条件之一，应视为技术字段：
- 控制功能或行为（如 `in_menu`）
- 定义结构或顺序（如 `sectionsOrder`）
- 包含非文本标识符（如 `icon`, `iconType`）
- 包含技术术语且不应翻译（如 API 名称）

### Q: 如果误判了字段怎么办？

A: 更新 `scripts/translation-ignore-fields.json`，添加该字段到 `technicalFields` 数组，然后重新运行检查脚本。

### Q: 技术字段在不同语言中可以有不同值吗？

A: 通常不可以。技术字段应在所有语言版本中保持一致。唯一的例外是某些技术术语可能需要本地化（如 `specs` 对象中的描述），但核心术语应保持英文。
