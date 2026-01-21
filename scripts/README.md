# Translation Verification Script

## 翻译验证脚本使用说明

### 功能
`check-translations.js` 脚本用于检查所有翻译文件的完整性，确保没有遗漏的翻译。

### 使用方法

```bash
# 运行翻译检查
node scripts/check-translations.js
```

### 检查内容

脚本会检查以下内容：

1. **Image Converter 工具页面** (`src/data/<lang>/image-converter/*.json`)
   - `hero.h1` - 页面标题
   - `hero.desc` - 页面描述

2. **Image Compressor 工具页面** (`src/data/<lang>/image-compression.json`)
   - `hero.h1` - 页面标题
   - `hero.desc` - 页面描述

3. **通用翻译文件** (`src/data/<lang>/common.json`)
   - `nav.*` - 导航菜单项
   - `breadcrumb.*` - 面包屑导航
   - `common.*` - 通用文本

### 检查规则

脚本会标记以下情况为问题：
- 字段缺失（空值）
- 与英文版本完全相同（可能是未翻译）
- 文件缺失

### 输出

- ✅ **成功**: `All translations are complete!` - 所有翻译完整
- ❌ **失败**: 显示详细的问题列表，包括：
  - 工具类型
  - 语言
  - 字段路径
  - 英文值
  - 当前值
  - 问题描述

### 集成到 CI/CD

可以将此脚本添加到 CI/CD 流程中：

```json
{
  "scripts": {
    "check-translations": "node scripts/check-translations.js"
  }
}
```

### 注意事项

- 脚本会检查所有 8 种语言（de, es, fr, it, ja, ko, pt, zh-TW）
- 如果发现新问题，脚本会以退出码 1 退出
- 建议在提交代码前运行此脚本
