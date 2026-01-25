#!/usr/bin/env node
/**
 * Check All Tool Translations
 * 
 * This script checks all tool-specific JSON files for a given locale
 * to ensure they match the structure of the English versions.
 * 
 * Usage: node scripts/check-all-tool-translations.js [locale]
 * 
 * Example:
 *   node scripts/check-all-tool-translations.js ja
 *   node scripts/check-all-tool-translations.js de
 */

const fs = require('fs');
const path = require('path');
const { getAllKeys, keyExists } = require('./check-translation-keys.js');

const SUPPORTED_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'];
const TOOL_FILES = [
  'font-generator.json',
  'image-compressor.json',
  'image-converter.json'
];

function checkToolFile(locale, toolFile) {
  const enPath = path.join(__dirname, '..', 'src', 'data', 'en', toolFile);
  const transPath = path.join(__dirname, '..', 'src', 'data', locale, toolFile);
  
  if (!fs.existsSync(enPath)) {
    return {
      tool: toolFile,
      status: 'error',
      message: `English reference file not found: ${enPath}`
    };
  }
  
  if (!fs.existsSync(transPath)) {
    return {
      tool: toolFile,
      status: 'missing',
      message: `Translation file not found: ${transPath}`
    };
  }
  
  try {
    const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    const transData = JSON.parse(fs.readFileSync(transPath, 'utf8'));
    
    const enKeys = getAllKeys(enData);
    const transKeys = getAllKeys(transData);
    
    const missingKeys = enKeys.filter(key => !keyExists(transData, key));
    const extraKeys = transKeys.filter(key => !keyExists(enData, key));
    
    return {
      tool: toolFile,
      status: missingKeys.length === 0 && extraKeys.length === 0 ? 'ok' : 'error',
      missingKeys,
      extraKeys,
      totalKeys: enKeys.length,
      translatedKeys: transKeys.length
    };
  } catch (error) {
    return {
      tool: toolFile,
      status: 'error',
      message: `Error parsing JSON: ${error.message}`
    };
  }
}

function main() {
  const locale = process.argv[2];
  
  if (!locale) {
    console.error('❌ Error: Please provide a locale');
    console.error('Usage: node scripts/check-all-tool-translations.js [locale]');
    console.error('Example: node scripts/check-all-tool-translations.js ja');
    console.error(`Supported locales: ${SUPPORTED_LOCALES.join(', ')}`);
    process.exit(1);
  }
  
  if (!SUPPORTED_LOCALES.includes(locale)) {
    console.error(`❌ Error: Unsupported locale: ${locale}`);
    console.error(`Supported locales: ${SUPPORTED_LOCALES.join(', ')}`);
    process.exit(1);
  }
  
  if (locale === 'en') {
    console.log('ℹ️  English is the reference language, skipping check.');
    process.exit(0);
  }
  
  console.log(`\n🔍 Checking all tool translations for locale: ${locale}\n`);
  
  const results = TOOL_FILES.map(toolFile => checkToolFile(locale, toolFile));
  
  let hasErrors = false;
  let hasMissing = false;
  
  results.forEach(result => {
    if (result.status === 'ok') {
      console.log(`✅ ${result.tool}`);
      console.log(`   - Total keys: ${result.totalKeys}`);
      console.log(`   - Translated keys: ${result.translatedKeys}`);
    } else if (result.status === 'missing') {
      console.log(`⚠️  ${result.tool}`);
      console.log(`   - ${result.message}`);
      hasMissing = true;
    } else if (result.status === 'error') {
      if (result.message) {
        console.log(`❌ ${result.tool}`);
        console.log(`   - ${result.message}`);
      } else {
        console.log(`❌ ${result.tool}`);
        console.log(`   - Total keys: ${result.totalKeys}`);
        console.log(`   - Translated keys: ${result.translatedKeys}`);
        if (result.missingKeys && result.missingKeys.length > 0) {
          console.log(`   - Missing keys (${result.missingKeys.length}):`);
          result.missingKeys.slice(0, 10).forEach(key => {
            console.log(`     • ${key}`);
          });
          if (result.missingKeys.length > 10) {
            console.log(`     ... and ${result.missingKeys.length - 10} more`);
          }
        }
        if (result.extraKeys && result.extraKeys.length > 0) {
          console.log(`   - Extra keys (${result.extraKeys.length}):`);
          result.extraKeys.slice(0, 10).forEach(key => {
            console.log(`     • ${key}`);
          });
          if (result.extraKeys.length > 10) {
            console.log(`     ... and ${result.extraKeys.length - 10} more`);
          }
        }
      }
      hasErrors = true;
    }
    console.log('');
  });
  
  if (hasErrors || hasMissing) {
    console.log('❌ Some translations have issues. Please fix them before proceeding.');
    console.log('\n💡 Tip: Run the following to check individual files:');
    results.forEach(result => {
      if (result.status !== 'ok') {
        console.log(`   node scripts/check-translation-keys.js src/data/${locale}/${result.tool}`);
      }
    });
    process.exit(1);
  } else {
    console.log('✅ All tool translations are complete and consistent!');
    process.exit(0);
  }
}

if (require.main === module) {
  main();
}
