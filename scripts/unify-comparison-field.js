const fs = require('fs');
const path = require('path');

/**
 * 统一 comparison 字段
 * 1. 对于同时有 compare 和 comparison 的工具，保留 comparison（因为更具体）
 * 2. 删除 compare 字段
 * 3. 更新代码逻辑，只使用 comparison
 */

const languages = ['en', 'de', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'zh-TW'];
const tools = ['image-compression', 'image-converter'];

tools.forEach(toolType => {
  languages.forEach(lang => {
    const filePath = path.join(__dirname, '../src/data', lang, `${toolType}.json`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let modified = false;
    let removedCount = 0;
    
    // 处理所有工具
    Object.keys(data).forEach(slug => {
      const tool = data[slug];
      
      if (!tool) return;
      
      // 如果同时有 compare 和 comparison，删除 compare（保留更具体的 comparison）
      if (tool.compare && tool.comparison) {
        delete tool.compare;
        removedCount++;
        modified = true;
      }
      // 如果只有 compare，将其重命名为 comparison
      else if (tool.compare && !tool.comparison) {
        tool.comparison = tool.compare;
        delete tool.compare;
        removedCount++;
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      console.log(`✅ Updated ${lang}/${toolType}.json - Removed ${removedCount} compare fields`);
    }
  });
});

console.log('\n✨ Field unification complete!');
console.log('⚠️  Next step: Update code to only use comparison field');
