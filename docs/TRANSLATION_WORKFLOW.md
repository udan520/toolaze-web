# 翻译工作流程

## 📋 快速开始

### 1. 翻译单个文件

```bash
# 1. 编辑翻译文件
# 例如：src/data/ja/font-generator.json

# 2. 检查翻译完整性
npm run check-translation src/data/ja/font-generator.json

# 或者直接使用脚本
node scripts/check-translation-keys.js src/data/ja/font-generator.json
```

### 2. 批量检查所有工具

```bash
# 检查日语翻译
npm run check-translations:ja

# 检查德语翻译
npm run check-translations:de

# 检查所有语言（需要手动指定）
node scripts/check-all-tool-translations.js [locale]
```

## 🔄 完整工作流程

### 步骤 1: 准备翻译

1. **查看结构指南**
   ```bash
   # 打开文档
   cat docs/TRANSLATION_STRUCTURE_GUIDE.md
   ```

2. **查看英文参考文件**
   ```bash
   # 查看英文版本的结构
   cat src/data/en/font-generator.json
   ```

### 步骤 2: 执行翻译

1. **编辑翻译文件**
   - 打开目标语言的 JSON 文件
   - 例如：`src/data/ja/font-generator.json`

2. **遵循结构规范**
   - 保持与英文版本完全相同的结构
   - 所有字段都必须存在
   - 数组结构必须一致

### 步骤 3: 验证翻译

1. **检查单个文件**
   ```bash
   npm run check-translation src/data/ja/font-generator.json
   ```

2. **检查所有工具**
   ```bash
   npm run check-translations:ja
   ```

3. **修复错误**
   - 根据检查结果修复缺失的字段
   - 确保结构完全一致

### 步骤 4: 最终验证

```bash
# 再次运行检查确保所有问题已修复
npm run check-translations:ja
```

## 📝 翻译检查清单

翻译完成后，请确认：

- [ ] 所有必须字段都已翻译
- [ ] 结构与英文版本完全一致
- [ ] 数组中的对象结构一致
- [ ] HTML 标签和链接正确保留
- [ ] JSON 格式正确（无语法错误）
- [ ] 运行了检查脚本且无错误
- [ ] `comparison` 使用 `toolazeFeatures` 和 `othersFeatures`（字符串格式）

## 🚨 常见问题

### 问题 1: 缺少字段

**错误信息**:
```
❌ Missing keys (3):
   - comparison.toolazeFeatures
   - rating.text
   - faqTitle
```

**解决方法**:
1. 查看英文版本对应的字段
2. 在翻译文件中添加缺失的字段
3. 重新运行检查

### 问题 2: 结构不一致

**错误信息**:
```
⚠️  Extra keys (not in en.json) (2):
   - comparison.features
   - rating.description
```

**解决方法**:
1. 查看 `docs/TRANSLATION_STRUCTURE_GUIDE.md`
2. 使用正确的字段名称
3. 移除多余的字段或重命名为正确的字段

### 问题 3: 数组结构不匹配

**错误信息**:
```
❌ Missing keys (1):
   - features.items[0].iconType
```

**解决方法**:
1. 确保数组中的每个对象都有相同的字段
2. 参考英文版本的第一项作为模板

## 💡 最佳实践

1. **翻译前先检查结构**
   ```bash
   # 查看英文版本的结构
   node scripts/check-translation-keys.js src/data/en/font-generator.json
   ```

2. **使用 IDE 的 JSON Schema 验证**
   - 在 VS Code 中，JSON Schema 会自动验证结构
   - Schema 文件：`schemas/tool-l2-page.schema.json`

3. **定期运行批量检查**
   ```bash
   # 在提交前检查所有语言
   for locale in ja de es fr it ko pt zh-TW; do
     npm run check-translations:$locale
   done
   ```

4. **保持术语一致性**
   - 参考现有翻译的术语表
   - 使用相同的术语翻译相同的概念

## 🔧 工具文件说明

### 检查脚本

- `scripts/check-translation-keys.js` - 检查单个文件的键完整性
- `scripts/check-all-tool-translations.js` - 批量检查所有工具文件

### 文档

- `docs/TRANSLATION_STRUCTURE_GUIDE.md` - 标准结构指南
- `docs/TRANSLATION_WORKFLOW.md` - 本文件，工作流程说明

### Schema

- `schemas/tool-l2-page.schema.json` - JSON Schema 用于 IDE 验证

## 📚 相关资源

- [翻译结构指南](./TRANSLATION_STRUCTURE_GUIDE.md)
- [JSON Schema 规范](https://json-schema.org/)
- [.cursorrules 翻译规则](../.cursorrules)
