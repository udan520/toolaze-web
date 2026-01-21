# 多语言 SEO 内容管理

## 目录结构

```
src/data/
├── en/                    # 英语源文件（主要内容）
│   ├── image-compression.json
│   └── image-converter/
│       ├── jpg-to-png.json
│       ├── png-to-jpg.json
│       └── ...
├── de/                    # 德语
├── ja/                    # 日语
├── es/                    # 西班牙语
├── zh-TW/                 # 繁体中文
├── pt/                    # 葡萄牙语
├── fr/                    # 法语
├── ko/                    # 韩语
└── it/                    # 意大利语
```

## 工作流程

### 1. 修改英语内容
编辑 `src/data/en/image-compression.json` 或 `src/data/en/image-converter/[tool-name].json`

### 2. 同步到其他语言
运行同步脚本：

```bash
npm run sync-locales
```

这个脚本会：
- ✅ 自动检测英语版本中的所有 slug
- ✅ 为每个语言创建/更新对应的 JSON 文件
- ✅ **保留已翻译的内容**，只添加新的 slug 或字段
- ✅ 新内容使用英语作为模板，可以后续翻译

### 3. 翻译内容
编辑各个语言目录下的 JSON 文件，翻译标记为英语的内容。

## 同步脚本说明

`scripts/sync-locales.ts` 的智能合并逻辑：

- **已翻译的内容**：完全保留，不会被覆盖
- **新的 slug**：自动添加，使用英语版本作为模板
- **新的字段**：如果英语版本添加了新字段，会自动添加到所有语言版本
- **删除的 slug**：如果从英语版本中删除了某个 slug，其他语言版本会保留（不会自动删除）

## 示例

### 添加新的 slug

1. 在 `src/data/en/image-compression.json` 中添加：
```json
{
  "new-slug": {
    "metadata": {
      "title": "New Tool Title",
      "description": "Description..."
    }
  }
}
```

2. 运行 `npm run sync-locales`

3. 所有语言文件会自动添加 `new-slug`，使用英语内容作为模板

### 修改现有 slug

1. 在 `src/data/en/image-compression.json` 中修改某个 slug 的内容
2. 运行 `npm run sync-locales`
3. 其他语言文件中：
   - **已翻译的字段**：保持不变
   - **新增的字段**：自动添加（使用英语）
   - **修改的字段**：如果该字段未被翻译，会更新为新的英语内容

## 注意事项

- ⚠️ **英语版本是源文件**，修改时要注意结构完整性
- ✅ **翻译文件中的内容会被保留**，同步不会覆盖已翻译的内容
- 📝 新内容默认使用英语，需要手动翻译到其他语言
- 🔄 建议每次修改英语内容后都运行一次同步脚本
