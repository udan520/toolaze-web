# Toolaze 功能介绍规范索引

> **重要提示**：所有二级页面和三级页面的 SEO 内容必须严格按照各工具的功能介绍文件进行扩写。不支持的功能不能写，未提及的技术不能写。

## 文件结构

每个工具的功能介绍都存储在独立的文件中，便于管理和维护：

```
docs/specs/
├── image-converter.md      # Image Converter 功能介绍
├── image-compressor.md     # Image Compressor 功能介绍
├── common.md               # 通用功能特性（所有工具共用）
└── ...                     # 未来新增的工具介绍文件
```

## 各工具功能介绍文件

### Image Converter（图片转换工具）
📄 **文件位置**：`docs/specs/image-converter.md`

**查看方式**：编写 Image Converter 相关 SEO 内容时，必须参考此文件。

### Image Compressor（图片压缩工具）
📄 **文件位置**：`docs/specs/image-compressor.md`

**查看方式**：编写 Image Compressor 相关 SEO 内容时，必须参考此文件。

### 通用功能特性
📄 **文件位置**：`docs/specs/common.md`

**查看方式**：编写任何工具的 SEO 内容时，都需要参考此文件，确保通用特性描述一致。

---

## 使用说明

### 编写 SEO 内容流程

1. **确定工具类型**
   - 如果是 Image Converter → 查看 `docs/specs/image-converter.md`
   - 如果是 Image Compressor → 查看 `docs/specs/image-compressor.md`

2. **查看通用特性**
   - 同时参考 `docs/specs/common.md`，确保通用特性描述一致

3. **编写 SEO 内容**
   - ✅ 只写功能介绍文件中明确支持的功能
   - ✅ 只提及功能介绍文件中明确使用的技术
   - ❌ 不支持的功能不能写（如：不支持 video 格式就不能写 video）
   - ❌ 未使用的技术不能写（如：没有使用 AI 就不能说 AI 技术）

4. **检查清单**
   - [ ] 所有功能都在支持列表中
   - [ ] 没有提及不支持的功能
   - [ ] 技术描述准确
   - [ ] 通用特性描述一致

---

## 添加新工具

当添加新工具时：

1. **创建新的功能介绍文件**
   - 在 `docs/specs/` 目录下创建新文件，如 `docs/specs/new-tool.md`

2. **更新索引文件**
   - 在此文件（`FEATURE_SPECIFICATIONS.md`）中添加新工具的引用

3. **参考通用特性**
   - 确保新工具的功能介绍也参考 `docs/specs/common.md`

---

## 更新日志

- 2024-XX-XX: 重构为独立文件结构，便于管理
