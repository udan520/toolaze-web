const fs = require('fs');
const path = require('path');

// 通用步骤翻译模板
const stepTranslations = {
  'Upload JPG Image': {
    de: 'JPG-Bild hochladen',
    es: 'Subir Imagen JPG',
    fr: 'Télécharger Image JPG',
    it: 'Carica Immagine JPG',
    ja: 'JPG画像をアップロード',
    ko: 'JPG 이미지 업로드',
    pt: 'Fazer Upload de Imagem JPG',
    'zh-TW': '上傳 JPG 圖片'
  },
  'Set 20KB Target': {
    de: '20KB-Ziel festlegen',
    es: 'Establecer Objetivo de 20KB',
    fr: 'Définir Cible de 20KB',
    it: 'Imposta Obiettivo di 20KB',
    ja: '20KBターゲットを設定',
    ko: '20KB 목표 설정',
    pt: 'Definir Meta de 20KB',
    'zh-TW': '設定 20KB 目標'
  },
  'Set 50KB Target': {
    de: '50KB-Ziel festlegen',
    es: 'Establecer Objetivo de 50KB',
    fr: 'Définir Cible de 50KB',
    it: 'Imposta Obiettivo di 50KB',
    ja: '50KBターゲットを設定',
    ko: '50KB 목표 설정',
    pt: 'Definir Meta de 50KB',
    'zh-TW': '設定 50KB 目標'
  },
  'Set 100KB Target': {
    de: '100KB-Ziel festlegen',
    es: 'Establecer Objetivo de 100KB',
    fr: 'Définir Cible de 100KB',
    it: 'Imposta Obiettivo di 100KB',
    ja: '100KBターゲットを設定',
    ko: '100KB 목표 설정',
    pt: 'Definir Meta de 100KB',
    'zh-TW': '設定 100KB 目標'
  },
  'Set 200KB Target': {
    de: '200KB-Ziel festlegen',
    es: 'Establecer Objetivo de 200KB',
    fr: 'Définir Cible de 200KB',
    it: 'Imposta Obiettivo di 200KB',
    ja: '200KBターゲットを設定',
    ko: '200KB 목표 설정',
    pt: 'Definir Meta de 200KB',
    'zh-TW': '設定 200KB 目標'
  },
  'Set 240KB Target': {
    de: '240KB-Ziel festlegen',
    es: 'Establecer Objetivo de 240KB',
    fr: 'Définir Cible de 240KB',
    it: 'Imposta Obiettivo di 240KB',
    ja: '240KBターゲットを設定',
    ko: '240KB 목표 설정',
    pt: 'Definir Meta de 240KB',
    'zh-TW': '設定 240KB 目標'
  },
  'Download Compressed': {
    de: 'Komprimiertes herunterladen',
    es: 'Descargar Comprimido',
    fr: 'Télécharger Comprimé',
    it: 'Scarica Comprimito',
    ja: '圧縮ファイルをダウンロード',
    ko: '압축 파일 다운로드',
    pt: 'Baixar Comprimido',
    'zh-TW': '下載壓縮檔'
  },
  'Upload Image': {
    de: 'Bild hochladen',
    es: 'Subir Imagen',
    fr: 'Télécharger Image',
    it: 'Carica Immagine',
    ja: '画像をアップロード',
    ko: '이미지 업로드',
    pt: 'Fazer Upload de Imagem',
    'zh-TW': '上傳圖片'
  },
  'Upload PNG Image': {
    de: 'PNG-Bild hochladen',
    es: 'Subir Imagen PNG',
    fr: 'Télécharger Image PNG',
    it: 'Carica Immagine PNG',
    ja: 'PNG画像をアップロード',
    ko: 'PNG 이미지 업로드',
    pt: 'Fazer Upload de Imagem PNG',
    'zh-TW': '上傳 PNG 圖片'
  },
  'Upload Multiple Images': {
    de: 'Mehrere Bilder hochladen',
    es: 'Subir Múltiples Imágenes',
    fr: 'Télécharger Plusieurs Images',
    it: 'Carica Più Immagini',
    ja: '複数の画像をアップロード',
    ko: '여러 이미지 업로드',
    pt: 'Fazer Upload de Várias Imagens',
    'zh-TW': '上傳多張圖片'
  }
};

// 通用步骤描述翻译模板
const stepDescTranslations = {
  'Drag and drop your JPG image or click to browse. Supports JPG and JPEG formats from smartphones, scanners, or cameras.': {
    de: 'Ziehen Sie Ihr JPG-Bild per Drag & Drop oder klicken Sie zum Durchsuchen. Unterstützt JPG- und JPEG-Formate von Smartphones, Scannern oder Kameras.',
    es: 'Arrastra y suelta tu imagen JPG o haz clic para navegar. Admite formatos JPG y JPEG de smartphones, escáneres o cámaras.',
    fr: 'Glissez-déposez votre image JPG ou cliquez pour parcourir. Prend en charge les formats JPG et JPEG des smartphones, scanners ou caméras.',
    it: 'Trascina e rilascia la tua immagine JPG o fai clic per sfogliare. Supporta formati JPG e JPEG da smartphone, scanner o fotocamere.',
    ja: 'JPG画像をドラッグ&ドロップするか、クリックして参照します。スマートフォン、スキャナー、カメラのJPGおよびJPEG形式をサポートします。',
    ko: 'JPG 이미지를 드래그 앤 드롭하거나 클릭하여 찾아보기. 스마트폰, 스캐너 또는 카메라의 JPG 및 JPEG 형식을 지원합니다.',
    pt: 'Arraste e solte sua imagem JPG ou clique para navegar. Suporta formatos JPG e JPEG de smartphones, scanners ou câmeras.',
    'zh-TW': '拖放您的 JPG 圖片或點擊瀏覽。支援來自智慧型手機、掃描器或相機的 JPG 和 JPEG 格式。'
  },
  'The tool automatically sets the target to exactly 20KB. Our algorithm compresses your image precisely to meet government portal limits while preserving quality.': {
    de: 'Das Tool setzt das Ziel automatisch auf genau 20KB. Unser Algorithmus komprimiert Ihr Bild präzise, um die Grenzen der Regierungsportale zu erfüllen und dabei die Qualität zu erhalten.',
    es: 'La herramienta establece automáticamente el objetivo exactamente en 20KB. Nuestro algoritmo comprime tu imagen con precisión para cumplir con los límites de los portales gubernamentales mientras preserva la calidad.',
    fr: 'L\'outil définit automatiquement la cible à exactement 20KB. Notre algorithme compresse votre image avec précision pour répondre aux limites des portails gouvernementaux tout en préservant la qualité.',
    it: 'Lo strumento imposta automaticamente l\'obiettivo esattamente a 20KB. Il nostro algoritmo comprime la tua immagine con precisione per soddisfare i limiti dei portali governativi mantenendo la qualità.',
    ja: 'ツールは自動的にターゲットを正確に20KBに設定します。当社のアルゴリズムは、品質を維持しながら、政府ポータルの制限を正確に満たすように画像を圧縮します。',
    ko: '도구가 자동으로 목표를 정확히 20KB로 설정합니다. 당사의 알고리즘은 품질을 유지하면서 정부 포털 제한을 정확하게 충족하도록 이미지를 압축합니다.',
    pt: 'A ferramenta define automaticamente o alvo exatamente em 20KB. Nosso algoritmo comprime sua imagem com precisão para atender aos limites dos portais governamentais mantendo a qualidade.',
    'zh-TW': '工具會自動將目標設定為精確的 20KB。我們的演算法會精確壓縮您的圖片，在保持品質的同時滿足政府網站限制。'
  },
  'Download your compressed JPG instantly. The file is guaranteed to be under 20KB and ready to upload to official portals without errors.': {
    de: 'Laden Sie Ihr komprimiertes JPG sofort herunter. Die Datei ist garantiert unter 20KB und bereit für den Upload zu offiziellen Portalen ohne Fehler.',
    es: 'Descarga tu JPG comprimido al instante. El archivo está garantizado para estar bajo 20KB y listo para subir a portales oficiales sin errores.',
    fr: 'Téléchargez votre JPG compressé instantanément. Le fichier est garanti d\'être sous 20KB et prêt à être téléchargé sur les portails officiels sans erreurs.',
    it: 'Scarica il tuo JPG compresso istantaneamente. Il file è garantito per essere sotto 20KB e pronto per il caricamento su portali ufficiali senza errori.',
    ja: '圧縮されたJPGを即座にダウンロードします。ファイルは20KB未満であることが保証され、エラーなく公式ポータルにアップロードする準備ができています。',
    ko: '압축된 JPG를 즉시 다운로드하세요. 파일이 20KB 미만임이 보장되며 오류 없이 공식 포털에 업로드할 준비가 됩니다.',
    pt: 'Baixe seu JPG comprimido instantaneamente. O arquivo está garantido para estar abaixo de 20KB e pronto para upload em portais oficiais sem erros.',
    'zh-TW': '立即下載您的壓縮 JPG。檔案保證在 20KB 以下，可無錯誤地上傳到官方網站。'
  }
};

// 动态替换函数
function translateStepTitle(title, lang, toolSlug) {
  // 检查是否有直接匹配
  if (stepTranslations[title] && stepTranslations[title][lang]) {
    return stepTranslations[title][lang];
  }
  
  // 处理动态标题（如 "Set XXKB Target"）
  const match = title.match(/^Set (\d+KB) Target$/);
  if (match) {
    const size = match[1];
    const translations = {
      de: `${size}-Ziel festlegen`,
      es: `Establecer Objetivo de ${size}`,
      fr: `Définir Cible de ${size}`,
      it: `Imposta Obiettivo di ${size}`,
      ja: `${size}ターゲットを設定`,
      ko: `${size} 목표 설정`,
      pt: `Definir Meta de ${size}`,
      'zh-TW': `設定 ${size} 目標`
    };
    return translations[lang] || title;
  }
  
  // 处理 "Upload X Image" 模式
  const uploadMatch = title.match(/^Upload (.+) Image$/);
  if (uploadMatch) {
    const format = uploadMatch[1];
    const translations = {
      de: `${format}-Bild hochladen`,
      es: `Subir Imagen ${format}`,
      fr: `Télécharger Image ${format}`,
      it: `Carica Immagine ${format}`,
      ja: `${format}画像をアップロード`,
      ko: `${format} 이미지 업로드`,
      pt: `Fazer Upload de Imagem ${format}`,
      'zh-TW': `上傳 ${format} 圖片`
    };
    return translations[lang] || title;
  }
  
  return title;
}

function translateStepDesc(desc, lang) {
  // 检查是否有直接匹配
  if (stepDescTranslations[desc] && stepDescTranslations[desc][lang]) {
    return stepDescTranslations[desc][lang];
  }
  
  // 处理通用模式
  if (desc.includes('Drag and drop')) {
    const translations = {
      de: 'Ziehen Sie Ihr Bild per Drag & Drop oder klicken Sie zum Durchsuchen.',
      es: 'Arrastra y suelta tu imagen o haz clic para navegar.',
      fr: 'Glissez-déposez votre image ou cliquez pour parcourir.',
      it: 'Trascina e rilascia la tua immagine o fai clic per sfogliare.',
      ja: '画像をドラッグ&ドロップするか、クリックして参照します。',
      ko: '이미지를 드래그 앤 드롭하거나 클릭하여 찾아보기.',
      pt: 'Arraste e solte sua imagem ou clique para navegar.',
      'zh-TW': '拖放您的圖片或點擊瀏覽。'
    };
    return translations[lang] || desc;
  }
  
  if (desc.includes('automatically sets the target to exactly')) {
    const match = desc.match(/automatically sets the target to exactly (\d+KB)/);
    if (match) {
      const size = match[1];
      const translations = {
        de: `Das Tool setzt das Ziel automatisch auf genau ${size}. Unser Algorithmus komprimiert Ihr Bild präzise, um die Anforderungen zu erfüllen und dabei die Qualität zu erhalten.`,
        es: `La herramienta establece automáticamente el objetivo exactamente en ${size}. Nuestro algoritmo comprime tu imagen con precisión para cumplir con los requisitos mientras preserva la calidad.`,
        fr: `L'outil définit automatiquement la cible à exactement ${size}. Notre algorithme compresse votre image avec précision pour répondre aux exigences tout en préservant la qualité.`,
        it: `Lo strumento imposta automaticamente l'obiettivo esattamente a ${size}. Il nostro algoritmo comprime la tua immagine con precisione per soddisfare i requisiti mantenendo la qualità.`,
        ja: `ツールは自動的にターゲットを正確に${size}に設定します。当社のアルゴリズムは、品質を維持しながら、要件を正確に満たすように画像を圧縮します。`,
        ko: `도구가 자동으로 목표를 정확히 ${size}로 설정합니다. 당사의 알고리즘은 품질을 유지하면서 요구사항을 정확하게 충족하도록 이미지를 압축합니다.`,
        pt: `A ferramenta define automaticamente o alvo exatamente em ${size}. Nosso algoritmo comprime sua imagem com precisão para atender aos requisitos mantendo a qualidade.`,
        'zh-TW': `工具會自動將目標設定為精確的 ${size}。我們的演算法會精確壓縮您的圖片，在保持品質的同時滿足要求。`
      };
      return translations[lang] || desc;
    }
  }
  
  if (desc.includes('Download your compressed')) {
    const translations = {
      de: 'Laden Sie Ihr komprimiertes Bild sofort herunter. Die Datei ist bereit für die Verwendung.',
      es: 'Descarga tu imagen comprimida al instante. El archivo está listo para usar.',
      fr: 'Téléchargez votre image compressée instantanément. Le fichier est prêt à être utilisé.',
      it: 'Scarica la tua immagine compressa istantaneamente. Il file è pronto per l\'uso.',
      ja: '圧縮された画像を即座にダウンロードします。ファイルは使用準備ができています。',
      ko: '압축된 이미지를 즉시 다운로드하세요. 파일이 사용할 준비가 되었습니다.',
      pt: 'Baixe sua imagem comprimida instantaneamente. O arquivo está pronto para uso.',
      'zh-TW': '立即下載您的壓縮圖片。檔案已準備好使用。'
    };
    return translations[lang] || desc;
  }
  
  return desc;
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
  
  // 修复所有工具的howToUse.steps
  Object.keys(enData).forEach(slug => {
    const enTool = enData[slug];
    const langTool = data[slug];
    
    if (!enTool || !langTool || !enTool.howToUse || !langTool.howToUse || !enTool.howToUse.steps) return;
    
    const enSteps = enTool.howToUse.steps || [];
    const langSteps = langTool.howToUse.steps || [];
    
    if (enSteps.length !== langSteps.length) {
      langTool.howToUse.steps = enSteps.map(step => ({
        title: translateStepTitle(step.title, lang, slug),
        desc: translateStepDesc(step.desc, lang)
      }));
      langFixed += enSteps.length * 2;
    } else {
      enSteps.forEach((enStep, idx) => {
        const langStep = langSteps[idx];
        if (!langStep) return;
        
        const translatedTitle = translateStepTitle(enStep.title, lang, slug);
        if (translatedTitle !== enStep.title && (!langStep.title || langStep.title === enStep.title)) {
          langStep.title = translatedTitle;
          langFixed++;
        }
        
        const translatedDesc = translateStepDesc(enStep.desc, lang);
        if (translatedDesc !== enStep.desc && (!langStep.desc || langStep.desc === enStep.desc)) {
          langStep.desc = translatedDesc;
          langFixed++;
        }
      });
    }
  });
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`✅ Updated ${lang}/image-compression.json - Fixed ${langFixed} howToUse steps`);
  totalFixed += langFixed;
});

console.log(`\n✨ Total fixed: ${totalFixed} howToUse step translations`);
