# 多语言 SEO 内容管理工作流程

## 🎯 核心理念

**英语版本是源文件** → **自动同步到其他语言** → **翻译各语言版本**

## 📝 日常使用流程

### 1. 添加新的 SEO 页面

**步骤：**

1. **编辑英语源文件**
   ```bash
   # 编辑 src/data/en/image-compression.json
   # 添加新的 slug，例如 "new-tool-slug"
   ```

2. **运行同步脚本**
   ```bash
   npm run sync-locales
   ```

3. **结果**
   - ✅ 所有语言文件自动添加新 slug
   - ✅ 内容使用英语作为模板
   - ✅ 可以后续翻译到各语言

### 2. 修改现有 SEO 内容

**步骤：**

1. **修改英语内容**
   ```bash
   # 编辑 src/data/en/image-compression.json
   # 修改某个 slug 的内容或添加新字段
   ```

2. **运行同步脚本**
   ```bash
   npm run sync-locales
   ```

3. **结果**
   - ✅ **已翻译的内容保持不变**
   - ✅ **新增的字段自动添加**（使用英语）
   - ✅ **结构自动同步**

### 3. 翻译内容

**直接编辑各语言文件：**

```bash
# 编辑德语版本
src/data/de/image-compression.json

# 编辑日语版本  
src/data/ja/image-compression.json

# ... 等等
```

**翻译后的内容会被保留**，下次运行同步脚本不会被覆盖。

## 🔄 自动化建议

### 方法 1：手动运行（推荐）

每次修改英语内容后运行：
```bash
npm run sync-locales
```

### 方法 2：Git Hook（自动同步）

如果你想在提交前自动同步，可以添加 pre-commit hook：

```bash
# 创建 .git/hooks/pre-commit
npm run sync-locales
```

## 📊 同步脚本的工作原理

### 智能合并逻辑

1. **新 slug** → 自动添加到所有语言（使用英语模板）
2. **新字段** → 自动添加到所有语言（使用英语模板）
3. **已翻译内容** → **完全保留**，不会被覆盖
4. **结构变化** → 自动同步到所有语言

### 合并示例

**英语版本（源文件）：**
```json
{
  "new-tool": {
    "metadata": {
      "title": "New Tool",
      "description": "Description"
    }
  }
}
```

**德语版本（已有部分翻译）：**
```json
{
  "old-tool": {
    "metadata": {
      "title": "Altes Tool",  // 已翻译
      "description": "Beschreibung"  // 已翻译
    }
  }
}
```

**运行同步后：**
```json
{
  "old-tool": {
    "metadata": {
      "title": "Altes Tool",  // ✅ 保留翻译
      "description": "Beschreibung"  // ✅ 保留翻译
    }
  },
  "new-tool": {
    "metadata": {
      "title": "New Tool",  // ✅ 自动添加（英语模板）
      "description": "Description"  // ✅ 自动添加（英语模板）
    }
  }
}
```

## ⚠️ 重要提示

1. **优先编辑英语版本**：`src/data/en/*.json` 是源文件
2. **同步后检查**：运行 `npm run sync-locales` 后检查生成的文件
3. **翻译不会被覆盖**：已翻译的内容会被保留
4. **结构一致性**：确保英语版本的结构完整且正确

## 🛠️ 故障排除

### Q: 同步后内容被覆盖了

**A:** 检查是否手动修改了 JSON 结构。确保结构一致，或者从 Git 历史恢复翻译。

### Q: 新字段没有同步

**A:** 确保英语版本的结构完整，然后再次运行同步脚本。

### Q: 某个语言文件缺失

**A:** 运行 `npm run sync-locales`，会自动创建缺失的语言文件。

## 📚 相关文件

- `scripts/sync-locales.ts` - 同步脚本源代码
- `src/data/README.md` - 数据结构说明
- `src/lib/seo-loader.ts` - SEO 内容加载器
