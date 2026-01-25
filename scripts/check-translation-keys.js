#!/usr/bin/env node
/**
 * Translation Key Missing Checker
 * 
 * This script checks if a translation JSON file has all keys matching the structure of en.json.
 * Usage: node scripts/check-translation-keys.js <file-path>
 * 
 * Example:
 *   node scripts/check-translation-keys.js src/data/de/common.json
 *   node scripts/check-translation-keys.js src/data/ja/image-compression.json
 */

const fs = require('fs');
const path = require('path');

/**
 * Get all keys from a JSON object recursively
 * Returns an array of dot-notation paths (e.g., ['nav.quickTools', 'home.title'])
 * For arrays, checks the structure of the first item as a template
 */
function getAllKeys(obj, prefix = '') {
  const keys = [];
  
  if (obj === null || obj === undefined) {
    return keys;
  }
  
  if (Array.isArray(obj)) {
    // For arrays, use the first item as a template for structure checking
    // This ensures we check that the array structure exists, not the exact count
    if (obj.length > 0) {
      const firstItem = obj[0];
      if (typeof firstItem === 'object' && firstItem !== null) {
        // Use [0] notation to indicate we're checking array item structure
        keys.push(...getAllKeys(firstItem, prefix ? `${prefix}[0]` : '[0]'));
      } else {
        // For primitive arrays, just mark that the array exists
        keys.push(prefix || '[0]');
      }
    } else {
      // Empty array - still mark it exists
      keys.push(prefix || '[]');
    }
    return keys;
  }
  
  if (typeof obj !== 'object') {
    return keys;
  }
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      // Recursively get keys from nested objects
      keys.push(...getAllKeys(obj[key], fullKey));
    } else if (Array.isArray(obj[key])) {
      // Handle arrays - check structure of first item
      keys.push(fullKey); // Add the array key itself
      if (obj[key].length > 0) {
        const firstItem = obj[key][0];
        if (typeof firstItem === 'object' && firstItem !== null) {
          keys.push(...getAllKeys(firstItem, `${fullKey}[0]`));
        }
      }
    } else {
      // Leaf node - add the key
      keys.push(fullKey);
    }
  }
  
  return keys;
}

/**
 * Check if a key path exists in an object
 * Handles both regular keys and array notation like [0]
 */
function keyExists(obj, keyPath) {
  // Handle root-level array notation like [0] or []
  if (keyPath.startsWith('[')) {
    if (!Array.isArray(obj)) {
      return false;
    }
    if (keyPath === '[]' || keyPath === '[0]') {
      return obj.length > 0;
    }
    const match = keyPath.match(/^\[(\d+)\](.*)$/);
    if (match) {
      const index = parseInt(match[1]);
      const rest = match[2];
      if (index >= obj.length) {
        return false;
      }
      if (rest) {
        // Remove leading dot if present
        const nextPath = rest.startsWith('.') ? rest.substring(1) : rest;
        return keyExists(obj[index], nextPath);
      }
      return true;
    }
    return false;
  }
  
  const parts = keyPath.split('.');
  let current = obj;
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    
    // Handle array indices like [0], [1]
    const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);
    if (arrayMatch) {
      const arrayKey = arrayMatch[1];
      const arrayIndex = parseInt(arrayMatch[2]);
      
      if (!current || typeof current !== 'object' || !(arrayKey in current)) {
        return false;
      }
      
      const array = current[arrayKey];
      if (!Array.isArray(array) || arrayIndex >= array.length) {
        return false;
      }
      
      current = array[arrayIndex];
    } else {
      if (!current || typeof current !== 'object' || !(part in current)) {
        return false;
      }
      current = current[part];
    }
  }
  
  return true;
}

/**
 * Main function
 */
function main() {
  const filePath = process.argv[2];
  
  if (!filePath) {
    console.error('❌ Error: Please provide a file path');
    console.error('Usage: node scripts/check-translation-keys.js <file-path>');
    console.error('Example: node scripts/check-translation-keys.js src/data/de/common.json');
    process.exit(1);
  }
  
  const absolutePath = path.isAbsolute(filePath) 
    ? filePath 
    : path.join(__dirname, '..', filePath);
  
  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ Error: File not found: ${absolutePath}`);
    process.exit(1);
  }
  
  // Determine the corresponding en.json file
  // Extract locale and file name from path
  const pathParts = absolutePath.split(path.sep);
  const dataIndex = pathParts.indexOf('data');
  
  if (dataIndex === -1) {
    console.error('❌ Error: File path must be in src/data/ directory');
    process.exit(1);
  }
  
  const locale = pathParts[dataIndex + 1];
  const fileName = pathParts[pathParts.length - 1];
  const subPath = pathParts.slice(dataIndex + 2, -1); // Path between locale and filename
  
  // Build en.json path
  const basePath = pathParts.slice(0, dataIndex + 1);
  const enPathParts = [...basePath, 'en', ...subPath, fileName];
  // Handle absolute paths on Unix systems (starts with /)
  const enPath = absolutePath.startsWith('/') 
    ? '/' + enPathParts.join('/')
    : path.join(...enPathParts);
  
  if (!fs.existsSync(enPath)) {
    console.error(`❌ Error: English reference file not found: ${enPath}`);
    process.exit(1);
  }
  
  // Read both files
  let enData, transData;
  try {
    enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    transData = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
  } catch (error) {
    console.error(`❌ Error parsing JSON: ${error.message}`);
    process.exit(1);
  }
  
  // Get all keys from en.json
  const enKeys = getAllKeys(enData);
  const transKeys = getAllKeys(transData);
  
  // Find missing keys
  const missingKeys = enKeys.filter(key => !keyExists(transData, key));
  
  // Find extra keys (keys in translation but not in en.json)
  const extraKeys = transKeys.filter(key => !keyExists(enData, key));
  
  // Report results
  console.log(`\n🔍 Checking translation keys: ${filePath}`);
  console.log(`📄 Reference file: ${enPath}`);
  console.log(`\n📊 Summary:`);
  console.log(`   - Total keys in en.json: ${enKeys.length}`);
  console.log(`   - Total keys in translation: ${transKeys.length}`);
  console.log(`   - Missing keys: ${missingKeys.length}`);
  console.log(`   - Extra keys: ${extraKeys.length}`);
  
  if (missingKeys.length > 0) {
    console.log(`\n❌ Missing keys (${missingKeys.length}):`);
    missingKeys.forEach(key => {
      console.log(`   - ${key}`);
    });
  }
  
  if (extraKeys.length > 0) {
    console.log(`\n⚠️  Extra keys (not in en.json) (${extraKeys.length}):`);
    extraKeys.forEach(key => {
      console.log(`   - ${key}`);
    });
  }
  
  if (missingKeys.length === 0 && extraKeys.length === 0) {
    console.log(`\n✅ All keys match! Translation structure is consistent with en.json.`);
    process.exit(0);
  } else {
    console.log(`\n❌ Translation structure does not match en.json. Please fix the issues above.`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { getAllKeys, keyExists };
