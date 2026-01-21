const fs = require('fs');
const path = require('path');

// 技术术语翻译
const technicalTermTranslations = {
  'JPG/JPEG (Joint Photographic Experts Group)': {
    de: 'JPG/JPEG (Gemeinsame Gruppe der Bildfachleute)',
    es: 'JPG/JPEG (Grupo Conjunto de Expertos en Fotografía)',
    fr: 'JPG/JPEG (Groupe d\'experts photographiques conjoints)',
    it: 'JPG/JPEG (Gruppo congiunto di esperti fotografici)',
    ja: 'JPG/JPEG（Joint Photographic Experts Group）',
    ko: 'JPG/JPEG (공동 사진 전문가 그룹)',
    pt: 'JPG/JPEG (Grupo Conjunto de Especialistas em Fotografia)',
    'zh-TW': 'JPG/JPEG（聯合圖像專家組）'
  },
  'PNG (Portable Network Graphics)': {
    de: 'PNG (Portable Network Graphics)',
    es: 'PNG (Portable Network Graphics)',
    fr: 'PNG (Portable Network Graphics)',
    it: 'PNG (Portable Network Graphics)',
    ja: 'PNG（Portable Network Graphics）',
    ko: 'PNG (Portable Network Graphics)',
    pt: 'PNG (Portable Network Graphics)',
    'zh-TW': 'PNG（可攜式網路圖形）'
  },
  'WebP (Web Picture Format)': {
    de: 'WebP (Web Picture Format)',
    es: 'WebP (Web Picture Format)',
    fr: 'WebP (Web Picture Format)',
    it: 'WebP (Web Picture Format)',
    ja: 'WebP（Web Picture Format）',
    ko: 'WebP (Web Picture Format)',
    pt: 'WebP (Web Picture Format)',
    'zh-TW': 'WebP（網頁圖片格式）'
  }
};

// 翻译函数
function translateTechnicalTerm(text, lang) {
  // 检查直接匹配
  if (technicalTermTranslations[text] && technicalTermTranslations[text][lang]) {
    return technicalTermTranslations[text][lang];
  }
  
  // 处理包含技术术语的文本
  if (text.includes('Joint Photographic Experts Group')) {
    const translations = {
      de: 'JPG/JPEG (Gemeinsame Gruppe der Bildfachleute)',
      es: 'JPG/JPEG (Grupo Conjunto de Expertos en Fotografía)',
      fr: 'JPG/JPEG (Groupe d\'experts photographiques conjoints)',
      it: 'JPG/JPEG (Gruppo congiunto di esperti fotografici)',
      ja: 'JPG/JPEG（Joint Photographic Experts Group）',
      ko: 'JPG/JPEG (공동 사진 전문가 그룹)',
      pt: 'JPG/JPEG (Grupo Conjunto de Especialistas em Fotografia)',
      'zh-TW': 'JPG/JPEG（聯合圖像專家組）'
    };
    // 如果当前文本与英文相同，使用翻译
    if (text === 'JPG/JPEG (Joint Photographic Experts Group)') {
      return translations[lang] || text;
    }
    // 对于其他情况，替换括号内的内容
    if (text.includes('Joint Photographic Experts Group')) {
      const translated = translations[lang];
      if (translated && translated !== text) {
        return translated;
      }
    }
    return text;
  }
  
  return text;
}

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
  
  // 修复所有工具的performanceMetrics.metrics[].value
  Object.keys(enData).forEach(slug => {
    const enTool = enData[slug];
    const langTool = data[slug];
    
    if (!enTool || !langTool || !enTool.performanceMetrics || !enTool.performanceMetrics.metrics) return;
    
    const enMetrics = enTool.performanceMetrics.metrics || [];
    const langMetrics = langTool.performanceMetrics?.metrics || [];
    
    if (!langTool.performanceMetrics) {
      langTool.performanceMetrics = {};
    }
    
    if (!langTool.performanceMetrics.metrics) {
      langTool.performanceMetrics.metrics = [];
    }
    
    enMetrics.forEach((enMetric, idx) => {
      const langMetric = langMetrics[idx];
      if (!langMetric) {
        langMetrics[idx] = {
          label: langMetrics[idx]?.label || enMetric.label,
          value: translateTechnicalTerm(enMetric.value, lang)
        };
        langFixed++;
        return;
      }
      
      // 修复value中的技术术语 - 如果与英文相同，强制翻译
      if (enMetric.value && enMetric.value.includes('Joint Photographic')) {
        // 如果当前值与英文相同，需要翻译
        if (!langMetric.value || langMetric.value === enMetric.value) {
          const translatedValue = translateTechnicalTerm(enMetric.value, lang);
          langMetric.value = translatedValue;
          langFixed++;
        }
      }
    });
  });
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`✅ Updated ${lang}/image-compression.json - Fixed ${langFixed} technical terms`);
  totalFixed += langFixed;
});

console.log(`\n✨ Total fixed: ${totalFixed} technical term translations`);
