#!/usr/bin/env node
/**
 * Translation Completeness Checker
 * 
 * This script checks for missing or untranslated content across all language files.
 * Run with: node scripts/check-translations.js
 */

const fs = require('fs');
const path = require('path');

const languages = ['en', 'de', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'zh-TW'];
const nonEnLanguages = languages.slice(1);

// Fields that must be translated
const requiredFields = ['hero.h1', 'hero.desc', 'metadata.title', 'metadata.description'];

/**
 * Check if a string is likely untranslated (identical to English or contains only English characters)
 */
function isLikelyUntranslated(langValue, enValue, lang) {
  if (!langValue || langValue.trim() === '') {
    return true;
  }
  
  // If identical to English and contains only ASCII characters, likely untranslated
  if (langValue === enValue && /^[A-Za-z0-9\s\-.,!?;:'"()]+$/.test(langValue)) {
    return true;
  }
  
  return false;
}

/**
 * Check image-converter JSON files
 */
function checkImageConverter() {
  const issues = [];
  const slugs = ['png-to-jpg', 'jpg-to-png', 'webp-to-jpg', 'webp-to-png', 'heic-to-jpg', 'heic-to-png', 'heic-to-webp'];
  
  slugs.forEach(slug => {
    const enFile = path.join(__dirname, '../src/data/en/image-converter', `${slug}.json`);
    if (!fs.existsSync(enFile)) return;
    
    const enData = JSON.parse(fs.readFileSync(enFile, 'utf8'));
    
    nonEnLanguages.forEach(lang => {
      const langFile = path.join(__dirname, '../src/data', lang, 'image-converter', `${slug}.json`);
      if (!fs.existsSync(langFile)) {
        issues.push({
          tool: 'image-converter',
          slug,
          lang,
          issue: 'File missing'
        });
        return;
      }
      
      const langData = JSON.parse(fs.readFileSync(langFile, 'utf8'));
      
      // Check hero.h1
      const enH1 = enData.hero?.h1 || '';
      const langH1 = langData.hero?.h1 || '';
      if (isLikelyUntranslated(langH1, enH1, lang)) {
        issues.push({
          tool: 'image-converter',
          slug,
          lang,
          field: 'hero.h1',
          enValue: enH1,
          langValue: langH1,
          issue: 'Missing or identical to English'
        });
      }
      
      // Check hero.desc
      const enDesc = enData.hero?.desc || '';
      const langDesc = langData.hero?.desc || '';
      if (isLikelyUntranslated(langDesc, enDesc, lang)) {
        issues.push({
          tool: 'image-converter',
          slug,
          lang,
          field: 'hero.desc',
          enValue: enDesc.substring(0, 50) + '...',
          langValue: langDesc.substring(0, 50) + '...',
          issue: 'Missing or identical to English'
        });
      }
    });
  });
  
  return issues;
}

/**
 * Check image-compression.json file
 */
function checkImageCompressor() {
  const issues = [];
  const enFile = path.join(__dirname, '../src/data/en/image-compression.json');
  
  if (!fs.existsSync(enFile)) {
    return issues;
  }
  
  const enData = JSON.parse(fs.readFileSync(enFile, 'utf8'));
  
  nonEnLanguages.forEach(lang => {
    const langFile = path.join(__dirname, '../src/data', lang, 'image-compression.json');
    if (!fs.existsSync(langFile)) {
      issues.push({
        tool: 'image-compressor',
        lang,
        issue: 'File missing'
      });
      return;
    }
    
    const langData = JSON.parse(fs.readFileSync(langFile, 'utf8'));
    
    Object.keys(enData).forEach(slug => {
      const enTool = enData[slug];
      const langTool = langData[slug];
      
      if (!langTool) {
        issues.push({
          tool: 'image-compressor',
          slug,
          lang,
          issue: 'Tool entry missing'
        });
        return;
      }
      
      // Check hero.h1
      const enH1 = enTool.hero?.h1 || '';
      const langH1 = langTool.hero?.h1 || '';
      if (isLikelyUntranslated(langH1, enH1, lang)) {
        issues.push({
          tool: 'image-compressor',
          slug,
          lang,
          field: 'hero.h1',
          enValue: enH1,
          langValue: langH1,
          issue: 'Missing or identical to English'
        });
      }
      
      // Check hero.desc
      const enDesc = enTool.hero?.desc || '';
      const langDesc = langTool.hero?.desc || '';
      if (isLikelyUntranslated(langDesc, enDesc, lang)) {
        issues.push({
          tool: 'image-compressor',
          slug,
          lang,
          field: 'hero.desc',
          enValue: enDesc.substring(0, 50) + '...',
          langValue: langDesc.substring(0, 50) + '...',
          issue: 'Missing or identical to English'
        });
      }
      
      // Check SEO sections
      const sectionsToCheck = ['intro', 'features', 'howToUse', 'performanceMetrics', 'comparison', 'scenes', 'rating', 'faq'];
      
      sectionsToCheck.forEach(sectionKey => {
        const enSection = enTool[sectionKey];
        const langSection = langTool[sectionKey];
        
        if (enSection && !langSection) {
          issues.push({
            tool: 'image-compressor',
            slug,
            lang,
            section: sectionKey,
            issue: 'Section missing'
          });
        } else if (enSection && langSection) {
          // Check section titles
          if (enSection.title && isLikelyUntranslated(langSection.title, enSection.title, lang)) {
            issues.push({
              tool: 'image-compressor',
              slug,
              lang,
              section: `${sectionKey}.title`,
              enValue: enSection.title,
              langValue: langSection.title,
              issue: 'Missing or identical to English'
            });
          }
          
          // Check howToUse steps
          if (sectionKey === 'howToUse' && enSection.steps) {
            if (!langSection.steps || langSection.steps.length !== enSection.steps.length) {
              issues.push({
                tool: 'image-compressor',
                slug,
                lang,
                section: `${sectionKey}.steps`,
                issue: 'Steps missing or count mismatch'
              });
            } else {
              enSection.steps.forEach((enStep, idx) => {
                const langStep = langSection.steps[idx];
                if (enStep.title && isLikelyUntranslated(langStep?.title, enStep.title, lang)) {
                  issues.push({
                    tool: 'image-compressor',
                    slug,
                    lang,
                    section: `${sectionKey}.steps[${idx}].title`,
                    enValue: enStep.title,
                    langValue: langStep?.title,
                    issue: 'Missing or identical to English'
                  });
                }
                if (enStep.desc && isLikelyUntranslated(langStep?.desc, enStep.desc, lang)) {
                  issues.push({
                    tool: 'image-compressor',
                    slug,
                    lang,
                    section: `${sectionKey}.steps[${idx}].desc`,
                    enValue: enStep.desc.substring(0, 50) + '...',
                    langValue: langStep?.desc?.substring(0, 50) + '...',
                    issue: 'Missing or identical to English'
                  });
                }
              });
            }
          }
          
          // Check features items
          if (sectionKey === 'features' && enSection.items) {
            if (!langSection.items || langSection.items.length !== enSection.items.length) {
              issues.push({
                tool: 'image-compressor',
                slug,
                lang,
                section: `${sectionKey}.items`,
                issue: 'Items missing or count mismatch'
              });
            }
          }
          
          // Check intro content
          if (sectionKey === 'intro' && enSection.content) {
            if (!langSection.content || (Array.isArray(enSection.content) && Array.isArray(langSection.content) && langSection.content.length !== enSection.content.length)) {
              issues.push({
                tool: 'image-compressor',
                slug,
                lang,
                section: `${sectionKey}.content`,
                issue: 'Content missing or structure mismatch'
              });
            }
          }
        }
      });
    });
  });
  
  return issues;
}

/**
 * Check common.json files
 */
function checkCommon() {
  const issues = [];
  const enFile = path.join(__dirname, '../src/data/en/common.json');
  
  if (!fs.existsSync(enFile)) {
    return issues;
  }
  
  const enData = JSON.parse(fs.readFileSync(enFile, 'utf8'));
  
  nonEnLanguages.forEach(lang => {
    const langFile = path.join(__dirname, '../src/data', lang, 'common.json');
    if (!fs.existsSync(langFile)) {
      issues.push({
        file: 'common.json',
        lang,
        issue: 'File missing'
      });
      return;
    }
    
    const langData = JSON.parse(fs.readFileSync(langFile, 'utf8'));
    
    // Check critical fields
    const criticalFields = [
      'nav.quickTools',
      'nav.imageCompression',
      'nav.imageConverter',
      'breadcrumb.home',
      'breadcrumb.imageCompression',
      'breadcrumb.imageConverter',
      'common.allTools',
      'common.primaryTools',
      'common.specializedTools'
    ];
    
    criticalFields.forEach(fieldPath => {
      const parts = fieldPath.split('.');
      let enValue = enData;
      let langValue = langData;
      
      for (const part of parts) {
        enValue = enValue?.[part];
        langValue = langValue?.[part];
      }
      
      if (!langValue || langValue === enValue) {
        issues.push({
          file: 'common.json',
          lang,
          field: fieldPath,
          enValue: enValue,
          langValue: langValue,
          issue: 'Missing or identical to English'
        });
      }
    });
  });
  
  return issues;
}

/**
 * Main function
 */
function main() {
  console.log('🔍 Checking translation completeness...\n');
  
  const converterIssues = checkImageConverter();
  const compressorIssues = checkImageCompressor();
  const commonIssues = checkCommon();
  
  const allIssues = [...converterIssues, ...compressorIssues, ...commonIssues];
  
  if (allIssues.length === 0) {
    console.log('✅ All translations are complete!');
    process.exit(0);
  } else {
    console.log(`❌ Found ${allIssues.length} translation issues:\n`);
    console.log(JSON.stringify(allIssues, null, 2));
    console.log(`\n📊 Summary:`);
    console.log(`   - Image Converter: ${converterIssues.length} issues`);
    console.log(`   - Image Compressor: ${compressorIssues.length} issues`);
    console.log(`   - Common: ${commonIssues.length} issues`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkImageConverter, checkImageCompressor, checkCommon };
