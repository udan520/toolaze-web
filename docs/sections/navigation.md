# 菜单与路由分发逻辑

## in_menu 字段

每个 L3 页面 JSON 根级别添加 `in_menu`：

- `true`：核心功能，显示在主导航
- `false`：长尾页面，不显示在主导航

## 分类标准

### Primary Tool（in_menu: true）

- 基础格式处理工具，功能通用
- 示例：compress-jpg、jpg-to-png、png-to-webp

### Long-tail Landing Page（in_menu: false）

- 针对特定场景、平台或需求
- 示例：jpg-to-20kb、uscis-photo-240kb、discord-emoji-256kb

## L2 索引要求

- `in_menu: false` 的页面必须汇总到所属 L2 的 "More Tools" 或 "Related Tools" 区域
- 使用卡片式布局，显示标题、描述、链接

## 禁止

- 不能将 `in_menu: false` 的工具显示在顶部主导航
- 不能在主导航堆砌过多工具
