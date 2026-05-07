# Use Cases / Scenarios 板块规范

## 数量要求

- **仅包含 3 个场景**，不多不少

## 结构

每个场景包含：`title`、`icon`、`desc`

## icon 要求

- 必须配置 icon，且不能为空字符串
- 图标使用 emoji 格式
- 图标与场景内容相关，不能重复
- 若缺少 icon，系统会根据 title/desc 自动匹配（见下方）

## 自动匹配规则（缺 icon 时）

| 场景类型 | 推荐 icon |
|----------|-----------|
| 摄影师/照片 | 📸 |
| 社交媒体 | 📱 |
| 办公/商务 | 💼 |
| 开发者/网站 | 💻 |
| 电商/购物 | 🛒 |
| 设计师/创意 | 🎨 |
| 内容创作者 | 📝 |
| 其他 | 💼 |

## 示例

```json
"scenes": [
  { "title": "iPhone Photographers", "icon": "📸", "desc": "..." },
  { "title": "Social Media Managers", "icon": "📱", "desc": "..." },
  { "title": "Office Productivity", "icon": "💼", "desc": "..." }
]
```
