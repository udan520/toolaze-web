const fs = require('fs');
const path = require('path');

// 由于scenes、comparison、rating、faq的内容非常具体且需要上下文理解
// 这里先创建一个基础框架，标记需要翻译的内容

const languages = ['de', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'zh-TW'];
const enFile = path.join(__dirname, '../src/data/en/image-compression.json');
const enData = JSON.parse(fs.readFileSync(enFile, 'utf8'));

let totalChecked = {
  scenes: 0,
  comparison: 0,
  rating: 0,
  faq: 0
};

languages.forEach(lang => {
  const filePath = path.join(__dirname, '../src/data', lang, 'image-compression.json');
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  Object.keys(enData).forEach(slug => {
    const enTool = enData[slug];
    const langTool = data[slug];
    
    if (!enTool || !langTool) return;
    
    // 检查scenes[]
    if (enTool.scenes && Array.isArray(enTool.scenes)) {
      const langScenes = langTool.scenes || [];
      enTool.scenes.forEach((enScene, idx) => {
        const langScene = langScenes[idx];
        if (langScene) {
          if (enScene.title && (!langScene.title || langScene.title === enScene.title)) {
            totalChecked.scenes++;
          }
          if (enScene.desc && (!langScene.desc || langScene.desc === enScene.desc)) {
            totalChecked.scenes++;
          }
        }
      });
    }
    
    // 检查comparison
    if (enTool.comparison) {
      const langComparison = langTool.comparison || {};
      if (enTool.comparison.toolaze && (!langComparison.toolaze || langComparison.toolaze === enTool.comparison.toolaze)) {
        totalChecked.comparison++;
      }
      if (enTool.comparison.others && (!langComparison.others || langComparison.others === enTool.comparison.others)) {
        totalChecked.comparison++;
      }
    }
    
    // 检查rating.text
    if (enTool.rating && enTool.rating.text) {
      const langRating = langTool.rating || {};
      if (!langRating.text || langRating.text === enTool.rating.text) {
        totalChecked.rating++;
      }
    }
    
    // 检查faq[]
    if (enTool.faq && Array.isArray(enTool.faq)) {
      const langFaq = langTool.faq || [];
      enTool.faq.forEach((enFaq, idx) => {
        const langFaqItem = langFaq[idx];
        if (langFaqItem) {
          if (enFaq.q && (!langFaqItem.q || langFaqItem.q === enFaq.q)) {
            totalChecked.faq++;
          }
          if (enFaq.a && (!langFaqItem.a || langFaqItem.a === enFaq.a)) {
            totalChecked.faq++;
          }
        }
      });
    }
  });
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
});

console.log(`\n📊 Translation Status Check:`);
console.log(`- scenes[]: ${totalChecked.scenes} items need translation`);
console.log(`- comparison: ${totalChecked.comparison} items need translation`);
console.log(`- rating.text: ${totalChecked.rating} items need translation`);
console.log(`- faq[]: ${totalChecked.faq} items need translation`);
console.log(`\n⚠️  Note: These sections require professional translation due to context-specific content`);
