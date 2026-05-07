# Comparison 板块规范

## 内容要求

- 必须从源文档（specs）中提取技术规格（质量、压缩、支持）
- 以叙述或列表格式进行比较
- 对比 Toolaze 与竞品/其他工具的差异

## JSON 格式

```json
{
  "comparison": {
    "title": "...",
    "toolaze": "Toolaze 💎",
    "others": "Other Tools",
    "toolazeFeatures": "优势1, 优势2, 优势3",
    "othersFeatures": "劣势1, 劣势2"
  }
}
```

- `toolazeFeatures`、`othersFeatures`：逗号分隔的字符串

## 关键词

- 对比类长尾关键词（类别 B）布局在 FAQ、Comparison
- 自然嵌入，不刻意堆砌
