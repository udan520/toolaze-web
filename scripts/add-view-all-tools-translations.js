const fs = require('fs');
const path = require('path');

// View All Tools 翻译模板
const viewAllToolsTranslations = {
  related: {
    de: 'Alle Verwandten Tools Anzeigen',
    es: 'Ver Todas las Herramientas Relacionadas',
    fr: 'Voir Tous les Outils Associés',
    it: 'Visualizza Tutti gli Strumenti Correlati',
    ja: '関連するすべてのツールを表示',
    ko: '관련된 모든 도구 보기',
    pt: 'Ver Todas as Ferramentas Relacionadas',
    'zh-TW': '查看所有相關工具'
  },
  all: {
    de: 'Alle Tools Anzeigen',
    es: 'Ver Todas las Herramientas',
    fr: 'Voir Tous les Outils',
    it: 'Visualizza Tutti gli Strumenti',
    ja: 'すべてのツールを表示',
    ko: '모든 도구 보기',
    pt: 'Ver Todas as Ferramentas',
    'zh-TW': '查看所有工具'
  }
};

const languages = ['de', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'zh-TW'];

languages.forEach(lang => {
  const filePath = path.join(__dirname, '../src/data', lang, 'common.json');
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // 确保 common.viewAllTools 存在
  if (!data.common) data.common = {};
  if (!data.common.viewAllTools) {
    data.common.viewAllTools = {};
  }
  
  // 添加翻译
  if (!data.common.viewAllTools.related) {
    data.common.viewAllTools.related = viewAllToolsTranslations.related[lang];
  }
  if (!data.common.viewAllTools.all) {
    data.common.viewAllTools.all = viewAllToolsTranslations.all[lang];
  }
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`✅ Updated ${lang}/common.json - Added viewAllTools translations`);
});

console.log('\n✨ View All Tools translations complete!');
