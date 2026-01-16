# 多语言 SEO 内容翻译指南

## 🎯 翻译原则

### 1. 关键词本地化（最重要）

**主关键词和长尾关键词必须本地化，使用有搜索量的本地语言关键词。**

#### 示例：英语 → 韩语

**英语原文：**
```json
{
  "metadata": {
    "title": "Compress JPG to 20KB - Precision Tool for Official Portals | Toolaze",
    "description": "Precisely compress JPG images to under 20KB for government and exam registrations..."
  },
  "hero": {
    "h1": "Compress JPG to 20KB",
    "sub": "Meet Strict Registration Limits"
  }
}
```

**韩语翻译（使用本地搜索关键词）：**
```json
{
  "metadata": {
    "title": "JPG 20KB 압축 - 공무원 시험 사진 최적화 도구 | Toolaze",
    "description": "공무원 시험 및 국가고시 지원을 위한 JPG 이미지를 정확히 20KB 이하로 압축합니다. 브라우저에서 100% 처리되어 완벽한 개인정보 보호..."
  },
  "hero": {
    "h1": "JPG 20KB 압축",
    "sub": "엄격한 제출 규격 충족"
  }
}
```

**关键词本地化说明：**
- `Compress JPG to 20KB` → `JPG 20KB 압축`（韩国用户常用搜索词）
- `Official Portals` → `공무원 시험`（更具体的本地化关键词）
- `government and exam registrations` → `공무원 시험 및 국가고시 지원`（本地化场景）

### 2. 各语言关键词研究建议

#### 🇰🇷 韩语 (ko)
- **图片压缩**: `이미지 압축`, `사진 용량 줄이기`, `JPG 압축`
- **格式转换**: `이미지 변환`, `JPG PNG 변환`, `웹이미지 변환`
- **场景关键词**: `공무원 시험 사진`, `여권 사진`, `온라인 지원서`

#### 🇯🇵 日语 (ja)
- **图片压缩**: `画像圧縮`, `JPG圧縮`, `ファイルサイズ削減`
- **格式转换**: `画像変換`, `JPG PNG変換`, `WebP変換`
- **场景关键词**: `公務員試験写真`, `パスポート写真`, `オンライン申請`

#### 🇩🇪 德语 (de)
- **图片压缩**: `Bildkomprimierung`, `JPG komprimieren`, `Dateigröße reduzieren`
- **格式转换**: `Bildkonvertierung`, `JPG zu PNG`, `WebP Konverter`
- **场景关键词**: `Behördenfoto`, `Reisepass Foto`, `Online-Bewerbung`

#### 🇪🇸 西班牙语 (es)
- **图片压缩**: `comprimir imagen`, `reducir tamaño JPG`, `optimizar foto`
- **格式转换**: `convertir imagen`, `JPG a PNG`, `convertidor WebP`
- **场景关键词**: `foto para examen`, `foto pasaporte`, `solicitud en línea`

#### 🇵🇹 葡萄牙语 (pt)
- **图片压缩**: `comprimir imagem`, `reduzir tamanho JPG`, `otimizar foto`
- **格式转换**: `converter imagem`, `JPG para PNG`, `conversor WebP`
- **场景关键词**: `foto para exame`, `foto passaporte`, `inscrição online`

#### 🇫🇷 法语 (fr)
- **图片压缩**: `compression d'image`, `réduire taille JPG`, `optimiser photo`
- **格式转换**: `convertir image`, `JPG vers PNG`, `convertisseur WebP`
- **场景关键词**: `photo examen`, `photo passeport`, `candidature en ligne`

#### 🇮🇹 意大利语 (it)
- **图片压缩**: `compressione immagine`, `ridurre dimensione JPG`, `ottimizzare foto`
- **格式转换**: `convertire immagine`, `JPG a PNG`, `convertitore WebP`
- **场景关键词**: `foto esame`, `foto passaporto`, `domanda online`

#### 🇹🇼 繁体中文 (zh-TW)
- **图片压缩**: `圖片壓縮`, `JPG壓縮`, `圖片大小調整`
- **格式转换**: `圖片轉換`, `JPG轉PNG`, `WebP轉換器`
- **场景关键词**: `公務員考試照片`, `護照照片`, `線上申請`

## 📝 翻译检查清单

### ✅ 必须翻译的字段

1. **metadata.title** - SEO 标题（包含关键词）
2. **metadata.description** - SEO 描述（包含长尾关键词）
3. **hero.h1** - 主标题（主关键词）
4. **hero.sub** - 副标题
5. **hero.desc** - 描述
6. **intro.title** - 介绍标题
7. **intro.content** - 介绍内容
8. **specs.*** - 规格说明
9. **scenes[].title** - 场景标题
10. **scenes[].desc** - 场景描述
11. **faq[].q** - 问题
12. **faq[].a** - 答案
13. **compare.toolaze** - 对比内容
14. **compare.others** - 对比内容

### ⚠️ 不需要翻译的字段

- **component** - 组件名称（代码相关）
- **slug** - URL slug（保持英文）

## 🔍 关键词研究工具

### 推荐工具

1. **Google Keyword Planner** - 免费，需要 Google Ads 账号
2. **Google Trends** - 免费，查看关键词趋势
3. **Ahrefs** - 付费，最全面的关键词研究工具
4. **SEMrush** - 付费，多语言关键词研究
5. **本地搜索引擎**：
   - 韩国：Naver Keyword Tool
   - 日本：Yahoo! Keyword Tool
   - 中国：百度指数、5118

### 关键词研究步骤

1. **翻译主关键词**：将英语关键词翻译成目标语言
2. **搜索本地变体**：在目标语言的搜索引擎中搜索，找到常用表达
3. **检查搜索量**：使用关键词工具检查搜索量
4. **选择最佳关键词**：选择搜索量高、竞争度适中的关键词
5. **自然融入内容**：将关键词自然融入标题和描述中

## 📋 翻译工作流程

### 步骤 1：准备翻译文件

运行同步脚本确保所有语言文件已创建：
```bash
npm run sync-locales
```

### 步骤 2：翻译单个 slug

1. 打开 `src/data/[locale]/image-compression.json`
2. 找到需要翻译的 slug（如 `jpg-to-20kb`）
3. 翻译所有文本字段
4. **特别注意**：将英语关键词替换为本地化关键词

### 步骤 3：验证翻译

1. 检查关键词是否本地化
2. 检查语法和拼写
3. 确保内容自然流畅
4. 测试页面显示

### 步骤 4：批量翻译

可以按优先级翻译：
1. **高优先级**：主页、主要工具页面
2. **中优先级**：常用工具页面
3. **低优先级**：特殊场景页面

## 💡 翻译示例

### 完整示例：JPG to 20KB 压缩工具

**英语版本：**
```json
{
  "jpg-to-20kb": {
    "metadata": {
      "title": "Compress JPG to 20KB - Precision Tool for Official Portals | Toolaze",
      "description": "Precisely compress JPG images to under 20KB for government and exam registrations. 100% browser-side processing for total privacy. Batch process up to 100 files."
    },
    "hero": {
      "h1": "Compress JPG to 20KB",
      "sub": "Meet Strict Registration Limits",
      "desc": "Designed for official portals with extreme file size caps. Reach the 20KB threshold accurately while maintaining the JPG format required for your application."
    }
  }
}
```

**韩语翻译（关键词本地化）：**
```json
{
  "jpg-to-20kb": {
    "metadata": {
      "title": "JPG 20KB 압축 - 공무원 시험 사진 최적화 도구 | Toolaze",
      "description": "공무원 시험 및 국가고시 지원을 위한 JPG 이미지를 정확히 20KB 이하로 압축합니다. 브라우저에서 100% 처리되어 완벽한 개인정보 보호. 최대 100개 파일 일괄 처리 가능."
    },
    "hero": {
      "h1": "JPG 20KB 압축",
      "sub": "엄격한 제출 규격 충족",
      "desc": "극도로 작은 파일 크기 제한이 있는 공무원 시험 지원 사이트를 위해 설계되었습니다. 지원서에 필요한 JPG 형식을 유지하면서 정확히 20KB 기준을 충족합니다."
    }
  }
}
```

**关键词对比：**
- `Compress JPG to 20KB` → `JPG 20KB 압축` ✅
- `Official Portals` → `공무원 시험` ✅（更具体，搜索量更高）
- `government and exam registrations` → `공무원 시험 및 국가고시 지원` ✅

## 🚀 快速开始

1. **选择语言**：从 `src/data/[locale]/` 中选择要翻译的语言
2. **打开 JSON 文件**：编辑对应的 `image-compression.json` 或 `image-converter.json`
3. **翻译内容**：使用本地化关键词翻译所有文本字段
4. **保存文件**：保存后刷新页面查看效果

## 📚 参考资源

- [Google SEO 多语言指南](https://developers.google.com/search/docs/advanced/crawling/localized-versions)
- [多语言 SEO 最佳实践](https://moz.com/learn/seo/international-seo)
- [关键词研究指南](https://ahrefs.com/blog/keyword-research/)
