# 技术字段参考文档

## 概述

本文档记录了所有**不需要翻译**的技术字段。这些字段在所有语言版本中应保持一致，用于控制功能、数据结构或包含技术术语。

## 不需要翻译的字段列表

### 1. 基础技术字段

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| `in_menu` | boolean | 控制工具是否在菜单中显示 | `true`, `false` |
| `sectionsOrder` | array | 定义页面部分的显示顺序 | `["howToUse", "features", "intro"]` |
| `icon` | string | Emoji 图标，用于视觉展示 | `"📦"`, `"🔒"`, `"⚡"` |
| `iconType` | string | 图标类型标识符，用于样式分类 | `"compression"`, `"privacy"`, `"batch"` |

### 2. 技术对象

#### `metadata` 对象
- **对象本身**: 技术性，不需要翻译
- **内部字段**: 
  - `title`: **需要翻译**（SEO 标题）
  - `description`: **需要翻译**（SEO 描述）

#### `specs` 对象
包含技术规格信息，字段可能包含技术术语：

| 字段名 | 说明 | 翻译策略 |
|--------|------|----------|
| `engine` | 处理引擎描述 | 技术术语（如 "Canvas API"）保持英文 |
| `limit` | 限制描述 | 需要翻译，但技术术语保持英文 |
| `logic` | 逻辑描述 | 需要翻译，但技术术语保持英文 |
| `privacy` | 隐私处理描述 | 需要翻译，但技术术语（如 "Client-Side"）保持英文 |

## 使用指南

### 在检查脚本中使用

所有翻译检查脚本应忽略以下字段：
- `in_menu`
- `sectionsOrder`
- `icon`
- `iconType`

### 在翻译脚本中使用

当自动修复翻译时，应：
1. 保留这些技术字段不变
2. 只翻译实际的文本内容（title, desc, text, q, a 等）
3. 对于 `specs` 对象，翻译描述性文本，但保留技术术语

## 示例

### 正确示例

```json
{
  "in_menu": true,  // ✅ 保持原样，不翻译
  "sectionsOrder": ["howToUse", "features"],  // ✅ 保持原样，不翻译
  "features": {
    "items": [
      {
        "icon": "📦",  // ✅ 保持原样，不翻译
        "iconType": "batch",  // ✅ 保持原样，不翻译
        "title": "Process 100 Images",  // ✅ 需要翻译
        "desc": "Compress up to 100 images..."  // ✅ 需要翻译
      }
    ]
  },
  "specs": {
    "engine": "Canvas API - Browser-Native Processing",  // ⚠️ 部分翻译，技术术语保持英文
    "privacy": "100% Client-Side (Local Browser Processing)"  // ⚠️ 部分翻译，技术术语保持英文
  }
}
```

### 错误示例

```json
{
  "in_menu": true,  // ❌ 错误：不应该翻译为 "verdadeiro"
  "icon": "📦",  // ❌ 错误：不应该翻译为其他 emoji
  "iconType": "batch",  // ❌ 错误：不应该翻译为 "lote"
  "sectionsOrder": ["howToUse", "features"]  // ❌ 错误：不应该翻译数组内容
}
```

## 配置文件

技术字段列表已保存在 `scripts/translation-ignore-fields.json` 中，所有检查脚本应引用此配置文件。

## 更新记录

- 2024-12-19: 初始创建，记录基础技术字段
- 2024-12-19: 添加 `specs` 对象的翻译策略说明
