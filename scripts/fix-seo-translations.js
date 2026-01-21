#!/usr/bin/env node
/**
 * SEO Sections Translation Fixer
 * 
 * This script fixes missing translations for SEO sections in tool pages.
 * Currently focuses on the 5 main tools: compress-jpg, compress-png, compress-webp, compress-image, batch-compress
 * 
 * Run with: node scripts/fix-seo-translations.js
 */

const fs = require('fs');
const path = require('path');

const languages = ['de', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'zh-TW'];
const mainTools = ['compress-jpg', 'compress-png', 'compress-webp', 'compress-image', 'batch-compress'];

// 翻译模板 - 基于 common.json 中的通用翻译
const translationTemplates = {
  'compress-jpg': {
    de: {
      howToUse: {
        title: 'Wie man JPG-Bilder komprimiert',
        steps: [
          {
            title: 'JPG-Dateien hochladen',
            desc: 'Ziehen Sie Ihre JPG-Bilder in den Komprimierungsbereich oder klicken Sie, um JPG-Dateien von Ihrem Gerät auszuwählen.'
          },
          {
            title: 'Zielgröße festlegen',
            desc: 'Wählen Sie Ihre gewünschte Dateigröße in KB oder MB. Unser Kompressor optimiert Ihre JPG-Bilder, um das Ziel zu erreichen und gleichzeitig die Qualität zu erhalten.'
          },
          {
            title: 'Komprimierte Dateien herunterladen',
            desc: 'Laden Sie Ihre komprimierten JPG-Dateien sofort herunter. Jede Datei behält die visuelle Qualität bei und ist deutlich kleiner als das Original.'
          }
        ]
      },
      features: {
        title: 'JPG-Komprimierungsfunktionen'
      },
      intro: {
        title: 'Warum JPG-Bilder komprimieren?'
      },
      performanceMetrics: {
        title: 'Technische Spezifikationen'
      }
    },
    es: {
      howToUse: {
        title: 'Cómo Comprimir Imágenes JPG',
        steps: [
          {
            title: 'Subir Archivos JPG',
            desc: 'Arrastra y suelta tus imágenes JPG en el área del compresor o haz clic para navegar y seleccionar archivos JPG de tu dispositivo.'
          },
          {
            title: 'Establecer Tamaño Objetivo',
            desc: 'Elige el tamaño de archivo deseado en KB o MB. Nuestro compresor optimizará tus imágenes JPG para cumplir el objetivo manteniendo la calidad.'
          },
          {
            title: 'Descargar Archivos Comprimidos',
            desc: 'Descarga tus archivos JPG comprimidos al instante. Cada archivo mantiene la calidad visual mientras es significativamente más pequeño que el original.'
          }
        ]
      },
      features: {
        title: 'Características de Compresión JPG'
      },
      intro: {
        title: '¿Por Qué Comprimir Imágenes JPG?'
      },
      performanceMetrics: {
        title: 'Especificaciones Técnicas'
      }
    },
    fr: {
      howToUse: {
        title: 'Comment Compresser des Images JPG',
        steps: [
          {
            title: 'Télécharger Vos Fichiers JPG',
            desc: 'Glissez-déposez vos images JPG dans la zone de compression ou cliquez pour parcourir et sélectionner des fichiers JPG depuis votre appareil.'
          },
          {
            title: 'Définir la Taille Cible',
            desc: 'Choisissez la taille de fichier souhaitée en Ko ou Mo. Notre compresseur optimisera vos images JPG pour atteindre l\'objectif tout en maintenant la qualité.'
          },
          {
            title: 'Télécharger les Fichiers Comprimés',
            desc: 'Téléchargez vos fichiers JPG comprimés instantanément. Chaque fichier maintient la qualité visuelle tout en étant considérablement plus petit que l\'original.'
          }
        ]
      },
      features: {
        title: 'Fonctionnalités de Compression JPG'
      },
      intro: {
        title: 'Pourquoi Compresser des Images JPG?'
      },
      performanceMetrics: {
        title: 'Spécifications Techniques'
      }
    },
    it: {
      howToUse: {
        title: 'Come Comprimere Immagini JPG',
        steps: [
          {
            title: 'Carica i Tuoi File JPG',
            desc: 'Trascina e rilascia le tue immagini JPG nell\'area del compressore o fai clic per sfogliare e selezionare file JPG dal tuo dispositivo.'
          },
          {
            title: 'Imposta Dimensione Obiettivo',
            desc: 'Scegli la dimensione del file desiderata in KB o MB. Il nostro compressore ottimizzerà le tue immagini JPG per raggiungere l\'obiettivo mantenendo la qualità.'
          },
          {
            title: 'Scarica File Comprimiti',
            desc: 'Scarica i tuoi file JPG comprimiti all\'istante. Ogni file mantiene la qualità visiva pur essendo significativamente più piccolo dell\'originale.'
          }
        ]
      },
      features: {
        title: 'Funzionalità di Compressione JPG'
      },
      intro: {
        title: 'Perché Comprimere Immagini JPG?'
      },
      performanceMetrics: {
        title: 'Specifiche Tecniche'
      }
    },
    ja: {
      howToUse: {
        title: 'JPG画像を圧縮する方法',
        steps: [
          {
            title: 'JPGファイルをアップロード',
            desc: 'JPG画像を圧縮エリアにドラッグ&ドロップするか、クリックしてデバイスからJPGファイルを選択します。'
          },
          {
            title: 'ターゲットサイズを設定',
            desc: '希望するファイルサイズ（KBまたはMB）を選択します。圧縮ツールがJPG画像を最適化し、品質を維持しながらターゲットを達成します。'
          },
          {
            title: '圧縮ファイルをダウンロード',
            desc: '圧縮されたJPGファイルを即座にダウンロードします。各ファイルは視覚的な品質を維持しながら、元のファイルよりも大幅に小さくなります。'
          }
        ]
      },
      features: {
        title: 'JPG圧縮機能'
      },
      intro: {
        title: 'JPG画像を圧縮する理由'
      },
      performanceMetrics: {
        title: '技術仕様'
      }
    },
    ko: {
      howToUse: {
        title: 'JPG 이미지 압축 방법',
        steps: [
          {
            title: 'JPG 파일 업로드',
            desc: 'JPG 이미지를 압축 영역으로 드래그 앤 드롭하거나 클릭하여 기기에서 JPG 파일을 찾아 선택합니다.'
          },
          {
            title: '목표 크기 설정',
            desc: '원하는 파일 크기(KB 또는 MB)를 선택하세요. 압축기가 JPG 이미지를 최적화하여 품질을 유지하면서 목표를 달성합니다.'
          },
          {
            title: '압축 파일 다운로드',
            desc: '압축된 JPG 파일을 즉시 다운로드하세요. 각 파일은 시각적 품질을 유지하면서 원본보다 훨씬 작습니다.'
          }
        ]
      },
      features: {
        title: 'JPG 압축 기능'
      },
      intro: {
        title: 'JPG 이미지를 압축하는 이유'
      },
      performanceMetrics: {
        title: '기술 사양'
      }
    },
    pt: {
      howToUse: {
        title: 'Como Comprimir Imagens JPG',
        steps: [
          {
            title: 'Fazer Upload dos Seus Arquivos JPG',
            desc: 'Arraste e solte suas imagens JPG na área do compressor ou clique para navegar e selecionar arquivos JPG do seu dispositivo.'
          },
          {
            title: 'Definir Tamanho Alvo',
            desc: 'Escolha o tamanho de arquivo desejado em KB ou MB. Nosso compressor otimizará suas imagens JPG para atingir o alvo mantendo a qualidade.'
          },
          {
            title: 'Baixar Arquivos Comprimidos',
            desc: 'Baixe seus arquivos JPG comprimidos instantaneamente. Cada arquivo mantém a qualidade visual enquanto é significativamente menor que o original.'
          }
        ]
      },
      features: {
        title: 'Recursos de Compressão JPG'
      },
      intro: {
        title: 'Por Que Comprimir Imagens JPG?'
      },
      performanceMetrics: {
        title: 'Especificações Técnicas'
      }
    },
    'zh-TW': {
      howToUse: {
        title: '如何壓縮 JPG 圖片',
        steps: [
          {
            title: '上傳您的 JPG 檔案',
            desc: '將您的 JPG 圖片拖放到壓縮區域，或點擊瀏覽並從您的裝置中選擇 JPG 檔案。'
          },
          {
            title: '設定目標大小',
            desc: '選擇您想要的檔案大小（KB 或 MB）。我們的壓縮工具將優化您的 JPG 圖片以達到目標，同時保持品質。'
          },
          {
            title: '下載壓縮檔案',
            desc: '立即下載您的壓縮 JPG 檔案。每個檔案保持視覺品質，同時比原始檔案小得多。'
          }
        ]
      },
      features: {
        title: 'JPG 壓縮功能'
      },
      intro: {
        title: '為什麼要壓縮 JPG 圖片？'
      },
      performanceMetrics: {
        title: '技術規格'
      }
    }
  }
};

// 为其他工具生成类似的翻译（基于格式）
function generateTranslationsForTool(toolSlug, format) {
  const translations = {};
  
  languages.forEach(lang => {
    translations[lang] = {
      howToUse: {
        title: '', // 需要根据具体工具定制
        steps: []
      },
      features: {
        title: ''
      },
      intro: {
        title: ''
      },
      performanceMetrics: {
        title: translationTemplates['compress-jpg'][lang]?.performanceMetrics?.title || 'Technical Specifications'
      }
    };
  });
  
  return translations;
}

function main() {
  console.log('🔧 Starting SEO sections translation fix...\n');
  
  let fixedCount = 0;
  
  mainTools.forEach(toolSlug => {
    languages.forEach(lang => {
      const filePath = path.join(__dirname, '../src/data', lang, 'image-compression.json');
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${lang}/image-compression.json`);
        return;
      }
      
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const tool = data[toolSlug];
      
      if (!tool) {
        console.log(`⚠️  Tool not found: ${toolSlug} in ${lang}`);
        return;
      }
      
      const template = translationTemplates['compress-jpg']?.[lang];
      if (!template) {
        console.log(`⚠️  No template for ${lang}`);
        return;
      }
      
      // 修复 howToUse
      if (template.howToUse && tool.howToUse) {
        if (!tool.howToUse.title || tool.howToUse.title === 'How to Compress JPG Images') {
          // 根据工具类型调整标题
          let title = template.howToUse.title;
          if (toolSlug === 'compress-png') {
            title = title.replace('JPG', 'PNG');
          } else if (toolSlug === 'compress-webp') {
            title = title.replace('JPG', 'WebP');
          } else if (toolSlug === 'compress-image') {
            title = title.replace('JPG', 'Images').replace('JPG', 'Images');
          } else if (toolSlug === 'batch-compress') {
            title = title.replace('JPG Images', 'Multiple Images');
          }
          
          tool.howToUse.title = title;
          fixedCount++;
        }
        
        // 修复 steps（如果存在且未翻译）
        if (template.howToUse.steps && tool.howToUse.steps) {
          tool.howToUse.steps.forEach((step, idx) => {
            if (step.title && /^[A-Za-z]/.test(step.title) && template.howToUse.steps[idx]) {
              let stepTitle = template.howToUse.steps[idx].title;
              let stepDesc = template.howToUse.steps[idx].desc;
              
              // 根据工具类型调整
              if (toolSlug === 'compress-png') {
                stepTitle = stepTitle.replace(/JPG/gi, 'PNG');
                stepDesc = stepDesc.replace(/JPG/gi, 'PNG');
              } else if (toolSlug === 'compress-webp') {
                stepTitle = stepTitle.replace(/JPG/gi, 'WebP');
                stepDesc = stepDesc.replace(/JPG/gi, 'WebP');
              } else if (toolSlug === 'compress-image') {
                stepTitle = stepTitle.replace(/JPG/gi, 'Images');
                stepDesc = stepDesc.replace(/JPG/gi, 'Images');
              } else if (toolSlug === 'batch-compress') {
                stepTitle = stepTitle.replace(/JPG Files/gi, 'Multiple Images');
                stepDesc = stepDesc.replace(/JPG/gi, 'Images');
              }
              
              if (step.title === stepTitle || /^[A-Za-z]/.test(step.title)) {
                step.title = stepTitle;
                step.desc = stepDesc;
                fixedCount++;
              }
            }
          });
        }
      }
      
      // 修复 features.title
      if (template.features && tool.features) {
        if (!tool.features.title || tool.features.title.includes('JPG Compression Features')) {
          let title = template.features.title;
          if (toolSlug === 'compress-png') {
            title = title.replace('JPG', 'PNG');
          } else if (toolSlug === 'compress-webp') {
            title = title.replace('JPG', 'WebP');
          } else if (toolSlug === 'compress-image') {
            title = title.replace('JPG', 'Image');
          } else if (toolSlug === 'batch-compress') {
            title = title.replace('JPG', 'Batch Image');
          }
          
          tool.features.title = title;
          fixedCount++;
        }
      }
      
      // 修复 intro.title
      if (template.intro && tool.intro) {
        if (!tool.intro.title || tool.intro.title === 'Why Compress JPG Images?') {
          let title = template.intro.title;
          if (toolSlug === 'compress-png') {
            title = title.replace('JPG', 'PNG');
          } else if (toolSlug === 'compress-webp') {
            title = title.replace('JPG', 'WebP');
          } else if (toolSlug === 'compress-image') {
            title = title.replace('JPG', 'Images');
          } else if (toolSlug === 'batch-compress') {
            title = title.replace('JPG Images', 'Multiple Images');
          }
          
          tool.intro.title = title;
          fixedCount++;
        }
      }
      
      // 修复 performanceMetrics.title
      if (template.performanceMetrics && tool.performanceMetrics) {
        if (!tool.performanceMetrics.title || tool.performanceMetrics.title === 'Technical Specifications') {
          tool.performanceMetrics.title = template.performanceMetrics.title;
          fixedCount++;
        }
      }
      
      // 保存文件
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    });
    
    console.log(`✅ Fixed ${toolSlug}`);
  });
  
  console.log(`\n✨ Fixed ${fixedCount} translation issues`);
  console.log('\n📝 Note: This script only fixes the 5 main tools.');
  console.log('   For other tools, please run the full translation process.');
}

if (require.main === module) {
  main();
}

module.exports = { generateTranslationsForTool };
