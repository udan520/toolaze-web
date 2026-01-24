# SEO 关键词库

> **用途**：存储每个功能相关的搜索词及其搜索量、难度等信息，用于指导 SEO 内容编写时的关键词布局。

## 文件结构

每个工具的关键词都存储在独立的 JSON 文件中：

```
docs/keywords/
├── image-converter-keywords.json      # Image Converter 关键词
├── image-compressor-keywords.json     # Image Compressor 关键词
├── font-generator-keywords.json        # Font Generator 关键词
└── ...                                # 未来新增工具的关键词文件
```

## 关键词数据结构

每个关键词文件包含以下字段：

```json
{
  "tool": "image-converter",
  "lastUpdated": "2024-01-01",
  "primaryKeywords": [
    {
      "keyword": "image converter",
      "searchVolume": 100000,
      "difficulty": 45,
      "type": "primary",
      "notes": "主关键词，用于 H1 和 Title"
    }
  ],
  "longTailKeywords": [
    {
      "keyword": "convert jpg to png online free",
      "searchVolume": 5000,
      "difficulty": 25,
      "type": "long-tail",
      "targetPage": "jpg-to-png",
      "notes": "长尾关键词，用于特定三级页面"
    }
  ],
  "relatedKeywords": [
    {
      "keyword": "image format converter",
      "searchVolume": 20000,
      "difficulty": 35,
      "type": "related",
      "notes": "相关关键词，用于内容自然嵌入"
    }
  ],
  "internalLinking": [
    {
      "keyword": "compress image",
      "targetPage": "image-compressor",
      "anchorText": "compress images",
      "notes": "内链关键词，链接到压缩工具页面"
    }
  ]
}
```

## 字段说明

### primaryKeywords（主关键词）
- **用途**：用于 H1、Title、Meta Description 等核心位置
- **特点**：搜索量大，竞争度高
- **数量**：通常 3-5 个

### longTailKeywords（长尾关键词）
- **用途**：用于特定三级页面（L3）的 SEO 优化
- **特点**：搜索量中等，竞争度低，转化率高
- **数量**：每个工具通常 10-20 个
- **targetPage**：指定该关键词对应的三级页面 slug

### relatedKeywords（相关关键词）
- **用途**：在内容中自然嵌入，提升语义相关性
- **特点**：搜索量中等，用于内容优化
- **数量**：通常 10-15 个

### internalLinking（内链关键词）
- **用途**：用于页面间的内部链接，提升整体 SEO
- **特点**：连接相关工具页面，提升权重传递
- **targetPage**：链接目标页面
- **anchorText**：锚文本

## 如何使用

### 1. 编写 SEO 内容时参考
- 查看对应工具的关键词文件
- 根据关键词的搜索量和难度确定优先级
- 将主关键词用于 H1、Title 等核心位置
- 将长尾关键词分配给对应的三级页面
- 在内容中自然嵌入相关关键词

### 2. 确定页面结构
- **主关键词** → 用于二级页面（L2）和核心三级页面
- **长尾关键词** → 创建专门的三级页面（L3）
- **相关关键词** → 在内容中自然使用
- **内链关键词** → 用于页面间的链接策略

### 3. 关键词布局建议
- **H1**：使用主关键词或长尾关键词
- **Title**：主关键词 + 品牌名
- **Meta Description**：包含主关键词和 1-2 个长尾关键词
- **内容段落**：自然嵌入相关关键词
- **内链**：使用内链关键词连接相关页面

## 更新流程

1. **接收关键词数据**：从 xlsx 文件导入关键词
2. **分类整理**：将关键词分类为主词、长尾词、相关词
3. **分配页面**：为长尾关键词分配对应的三级页面
4. **更新文件**：更新对应的 JSON 文件
5. **应用关键词**：在编写 SEO 内容时参考关键词文档

## 如何提供 xlsx 文件

### 方法 1：转换为 CSV（推荐）
1. 在 Excel 中打开 xlsx 文件
2. 另存为 CSV 格式
3. 将 CSV 内容粘贴到聊天中

### 方法 2：直接粘贴表格内容
1. 在 Excel 中复制表格内容
2. 直接粘贴到聊天中（我会自动识别表格格式）

### 方法 3：描述文件结构
如果文件较大，可以告诉我：
- 列名（如：关键词、搜索量、难度、类型等）
- 数据行数
- 我可以帮你创建一个导入脚本

## 关键词文件命名规范

- 格式：`{tool-name}-keywords.json`
- 示例：
  - `image-converter-keywords.json`
  - `image-compressor-keywords.json`
  - `alt-text-generator-keywords.json`

## 注意事项

1. **定期更新**：关键词搜索量和难度会变化，建议定期更新
2. **本地化**：不同语言版本可能需要不同的关键词文件
3. **竞争分析**：结合难度数据，优先优化低难度、高搜索量的关键词
4. **内容质量**：关键词只是指导，内容质量仍然是核心
