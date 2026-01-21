const fs = require('fs');
const path = require('path');

// comparison.title 翻译
const comparisonTitleTranslations = {
  en: 'Why Choose Toolaze?',
  de: 'Warum Toolaze wählen?',
  es: '¿Por qué elegir Toolaze?',
  fr: 'Pourquoi choisir Toolaze?',
  it: 'Perché scegliere Toolaze?',
  ja: 'なぜToolazeを選ぶのか？',
  ko: '왜 Toolaze를 선택해야 할까요?',
  pt: 'Por que escolher Toolaze?',
  'zh-TW': '為什麼選擇 Toolaze？'
};

const languages = ['de', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'zh-TW'];
const enFile = path.join(__dirname, '../src/data/en/common.json');
const enData = JSON.parse(fs.readFileSync(enFile, 'utf8'));

languages.forEach(lang => {
  const filePath = path.join(__dirname, '../src/data', lang, 'common.json');
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let fixed = false;
  
  // 修复 imageCompressor.comparison.title
  if (data.imageCompressor && data.imageCompressor.comparison) {
    if (!data.imageCompressor.comparison.title || data.imageCompressor.comparison.title === 'Why Choose Toolaze?') {
      data.imageCompressor.comparison.title = comparisonTitleTranslations[lang];
      fixed = true;
    }
  }
  
  // 修复 imageConverter.comparison.title
  if (data.imageConverter && data.imageConverter.comparison) {
    if (!data.imageConverter.comparison.title || data.imageConverter.comparison.title === 'Why Choose Toolaze?') {
      data.imageConverter.comparison.title = comparisonTitleTranslations[lang];
      fixed = true;
    }
  }
  
  if (fixed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log(`✅ Updated ${lang}/common.json - Added comparison.title`);
  } else {
    console.log(`⏭️  ${lang}/common.json - comparison.title already exists`);
  }
});

console.log(`\n✨ Comparison title translations added!`);
