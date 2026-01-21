const fs = require('fs');
const path = require('path');

// intro.content[] 的翻译通常比较长且特定，这里先处理通用的部分
// 由于intro.content内容非常具体，我们需要一个更智能的方法

const languages = ['de', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'zh-TW'];
const enFile = path.join(__dirname, '../src/data/en/image-compression.json');
const enData = JSON.parse(fs.readFileSync(enFile, 'utf8'));

let totalFixed = 0;

languages.forEach(lang => {
  const filePath = path.join(__dirname, '../src/data', lang, 'image-compression.json');
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let langFixed = 0;
  
  // 修复所有工具的intro.content
  Object.keys(enData).forEach(slug => {
    const enTool = enData[slug];
    const langTool = data[slug];
    
    if (!enTool || !langTool || !enTool.intro || !langTool.intro || !enTool.intro.content) return;
    
    const enContent = Array.isArray(enTool.intro.content) ? enTool.intro.content : [];
    const langContent = Array.isArray(langTool.intro.content) ? langTool.intro.content : [];
    
    // 如果intro.content是数组格式
    if (enContent.length > 0) {
      if (langContent.length !== enContent.length) {
        // 如果长度不匹配，保持英文（需要手动翻译）
        console.log(`⚠️  ${slug} (${lang}): intro.content length mismatch, skipping`);
        return;
      }
      
      enContent.forEach((enItem, idx) => {
        const langItem = langContent[idx];
        if (!langItem) return;
        
        // 检查title是否需要翻译
        if (enItem.title && (!langItem.title || langItem.title === enItem.title)) {
          // title通常与intro.title相关，这里先标记为需要翻译
          // 由于内容太长，我们只标记，不自动翻译
          langFixed++;
        }
        
        // 检查text是否需要翻译
        if (enItem.text && (!langItem.text || langItem.text === enItem.text)) {
          // text内容太长，需要专业翻译，这里只标记
          langFixed++;
        }
      });
    }
  });
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`✅ Updated ${lang}/image-compression.json - Checked ${langFixed} intro.content items (need manual translation)`);
  totalFixed += langFixed;
});

console.log(`\n✨ Total checked: ${totalFixed} intro.content items`);
console.log(`⚠️  Note: intro.content requires professional translation due to length and specificity`);
