const fs = require('fs');
const path = require('path');

// Rating title 翻译模板
const ratingTitleTranslations = {
  de: 'Vertraut von Tausenden von Creators',
  es: 'Confiado por Miles de Creadores',
  fr: 'Approuvé par des Milliers de Créateurs',
  it: 'Fidato da Migliaia di Creatori',
  ja: '数千人のクリエイターに信頼されています',
  ko: '수천 명의 크리에이터가 신뢰합니다',
  pt: 'Confiado por Milhares de Criadores',
  'zh-TW': '受到數千名創作者的信任'
};

const languages = ['de', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'zh-TW'];
const enFile = path.join(__dirname, '../src/data/en/common.json');
const enData = JSON.parse(fs.readFileSync(enFile, 'utf8'));

// 确保英文版本有 title 字段
if (!enData.common?.rating?.title) {
  if (!enData.common) enData.common = {};
  if (!enData.common.rating) enData.common.rating = {};
  enData.common.rating.title = 'Trusted by Thousands of Creators';
  fs.writeFileSync(enFile, JSON.stringify(enData, null, 2) + '\n', 'utf8');
  console.log('✅ Added rating.title to en/common.json');
}

languages.forEach(lang => {
  const filePath = path.join(__dirname, '../src/data', lang, 'common.json');
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // 确保 common.rating 存在
  if (!data.common) data.common = {};
  if (!data.common.rating) data.common.rating = {};
  
  // 添加或更新 title
  if (!data.common.rating.title || data.common.rating.title === 'Trusted by Thousands of Creators') {
    data.common.rating.title = ratingTitleTranslations[lang];
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log(`✅ Updated ${lang}/common.json - Added rating.title`);
  } else {
    console.log(`ℹ️  ${lang}/common.json already has rating.title: ${data.common.rating.title}`);
  }
});

console.log('\n✨ Rating title translations complete!');
