const fs = require('fs');
const path = require('path');

// Scenarios 标题翻译模板
const scenariosTitleTranslations = {
  'Web Developers': {
    de: 'Web-Entwickler',
    es: 'Desarrolladores Web',
    fr: 'Développeurs Web',
    it: 'Sviluppatori Web',
    ja: 'Web開発者',
    ko: '웹 개발자',
    pt: 'Desenvolvedores Web',
    'zh-TW': '網頁開發者'
  },
  'Photographers': {
    de: 'Fotografen',
    es: 'Fotógrafos',
    fr: 'Photographes',
    it: 'Fotografi',
    ja: '写真家',
    ko: '사진작가',
    pt: 'Fotógrafos',
    'zh-TW': '攝影師'
  },
  'Content Creators': {
    de: 'Content-Ersteller',
    es: 'Creadores de Contenido',
    fr: 'Créateurs de Contenu',
    it: 'Creatori di Contenuti',
    ja: 'コンテンツクリエイター',
    ko: '콘텐츠 제작자',
    pt: 'Criadores de Conteúdo',
    'zh-TW': '內容創作者'
  },
  'For Web Developers': {
    de: 'Für Web-Entwickler',
    es: 'Para Desarrolladores Web',
    fr: 'Pour les Développeurs Web',
    it: 'Per Sviluppatori Web',
    ja: 'Web開発者のために',
    ko: '웹 개발자를 위해',
    pt: 'Para Desenvolvedores Web',
    'zh-TW': '為網頁開發者'
  },
  'For Photographers': {
    de: 'Für Fotografen',
    es: 'Para Fotógrafos',
    fr: 'Pour les Photographes',
    it: 'Per Fotografi',
    ja: '写真家のために',
    ko: '사진작가를 위해',
    pt: 'Para Fotógrafos',
    'zh-TW': '為攝影師'
  },
  'For Content Creators': {
    de: 'Für Content-Ersteller',
    es: 'Para Creadores de Contenido',
    fr: 'Pour les Créateurs de Contenu',
    it: 'Per Creatori di Contenuti',
    ja: 'コンテンツクリエイターのために',
    ko: '콘텐츠 제작자를 위해',
    pt: 'Para Criadores de Conteúdo',
    'zh-TW': '為內容創作者'
  },
  'For Designers': {
    de: 'Für Designer',
    es: 'Para Diseñadores',
    fr: 'Pour les Designers',
    it: 'Per Designer',
    ja: 'デザイナーのために',
    ko: '디자이너를 위해',
    pt: 'Para Designers',
    'zh-TW': '為設計師'
  },
  'For E-commerce': {
    de: 'Für E-Commerce',
    es: 'Para Comercio Electrónico',
    fr: 'Pour le E-commerce',
    it: 'Per E-commerce',
    ja: 'Eコマースのために',
    ko: '전자상거래를 위해',
    pt: 'Para E-commerce',
    'zh-TW': '為電子商務'
  },
  'iPhone Photographers': {
    de: 'iPhone-Fotografen',
    es: 'Fotógrafos de iPhone',
    fr: 'Photographes iPhone',
    it: 'Fotografi iPhone',
    ja: 'iPhone写真家',
    ko: 'iPhone 사진작가',
    pt: 'Fotógrafos iPhone',
    'zh-TW': 'iPhone 攝影師'
  },
  'A+ Content Creators': {
    de: 'A+ Content-Ersteller',
    es: 'Creadores de Contenido A+',
    fr: 'Créateurs de Contenu A+',
    it: 'Creatori di Contenuti A+',
    ja: 'A+コンテンツクリエイター',
    ko: 'A+ 콘텐츠 제작자',
    pt: 'Criadores de Conteúdo A+',
    'zh-TW': 'A+ 內容創作者'
  }
};

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
  
  // 修复所有工具的 scenes[].title
  Object.keys(enData).forEach(slug => {
    const enTool = enData[slug];
    const langTool = data[slug];
    
    if (!enTool || !langTool || !enTool.scenes || !Array.isArray(enTool.scenes)) return;
    
    const enScenes = enTool.scenes;
    const langScenes = langTool.scenes || [];
    
    if (!Array.isArray(langScenes) || langScenes.length !== enScenes.length) {
      // 如果长度不匹配，跳过（可能需要手动处理）
      return;
    }
    
    enScenes.forEach((enScene, index) => {
      const langScene = langScenes[index];
      if (!langScene || !enScene.title) return;
      
      // 检查是否需要翻译（如果标题是英文）
      const enTitle = enScene.title.trim();
      const langTitle = langScene.title?.trim() || '';
      
      // 如果标题与英文相同，或者包含英文关键词，需要翻译
      const needsTranslation = langTitle === enTitle || 
                               (langTitle.match(/^[A-Z][a-z]+/) && 
                                (langTitle.includes('Web Developers') || 
                                 langTitle.includes('Photographers') || 
                                 langTitle.includes('Content Creators') ||
                                 langTitle.includes('Designers') ||
                                 langTitle.includes('E-commerce')));
      
      if (needsTranslation && scenariosTitleTranslations[enTitle]) {
        const translation = scenariosTitleTranslations[enTitle][lang];
        if (translation && translation !== enTitle) {
          langScene.title = translation;
          langFixed++;
        }
      }
    });
  });
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`✅ Updated ${lang}/image-compression.json - Fixed ${langFixed} scene titles`);
  totalFixed += langFixed;
});

console.log(`\n✨ Total fixed: ${totalFixed} scene title translations`);
