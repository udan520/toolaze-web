const fs = require('fs')
const path = require('path')

// 翻译映射表
const translations = {
  // 技术术语
  'Portable Network Graphics': '可攜式網路圖形',
  'Joint Photographic Experts Group': '聯合圖像專家組',
  'Browser Canvas API': '瀏覽器 Canvas API',
  'Canvas API': 'Canvas API',
  'Alpha channel': 'Alpha 通道',
  'alpha channel': 'Alpha 通道',
  'EXIF': 'EXIF',
  'EXIF Data': 'EXIF 資料',
  'EXIF data': 'EXIF 資料',
  'Web-Assembly': 'WebAssembly',
  'WebAssembly': 'WebAssembly',
  'HEVC': 'HEVC',
  'GPU': 'GPU',
  'Client-Side': '客戶端',
  'Client-side': '客戶端',
  'client-side': '客戶端',
  
  // 常见短语
  'Full alpha channel transparency enabled': '完整的 Alpha 通道透明度已啟用',
  'Preserved during conversion': '轉換期間保留',
  '100% Client-Side (Browser Canvas API)': '100% 客戶端（瀏覽器 Canvas API）',
  '100% Client-Side (WebAssembly HEVC Decoder)': '100% 客戶端（WebAssembly HEVC 解碼器）',
  'Unlimited (Limited by browser memory)': '無限制（受瀏覽器記憶體限制）',
  '100 Images per session': '每次會話 100 張圖片',
  'Lossless (No quality degradation)': '無損（無品質劣化）',
  'Lossy (Optimized for file size reduction)': '有損（針對檔案大小減少優化）',
  'Lossy/Lossless (25-35% size reduction)': '有損/無損（25-35% 大小減少）',
  
  // Features描述
  'All compression happens locally in your browser. Your design assets never leave your device, ensuring complete privacy and security.': '所有壓縮都在您的瀏覽器中本地進行。您的設計資產永遠不會離開您的裝置，確保完全隱私和安全。',
  'Process up to 100 PNG images simultaneously. Optimize entire design asset libraries in one operation for efficient workflow.': '同時處理最多 100 張 PNG 圖片。在一次操作中優化整個設計資產庫，實現高效工作流程。',
  'Browser-native Canvas API processing ensures instant compression without server uploads or waiting queues. Get your assets optimized immediately.': '瀏覽器原生 Canvas API 處理確保即時壓縮，無需伺服器上傳或等待佇列。立即優化您的資產。',
  'Unlimited PNG compression completely free—no premium tiers, no subscription fees, no advertisements. Perfect for developers and designers.': '無限制的 PNG 壓縮完全免費—無高級層級、無訂閱費用、無廣告。非常適合開發者和設計師。',
  'Maintain Alpha channel transparency throughout compression. Keep your transparent backgrounds perfectly clear for professional UI/UX designs.': '在整個壓縮過程中保持 Alpha 通道透明度。為專業的 UI/UX 設計保持透明背景完美清晰。',
  'Maintain Alpha 通道 transparency throughout compression. Keep your transparent backgrounds perfectly clear for professional UI/UX designs.': '在整個壓縮過程中保持 Alpha 通道透明度。為專業的 UI/UX 設計保持透明背景完美清晰。',
  
  // 更多Features描述
  'All compression happens locally in your browser. Your biometric photos never leave your device, ensuring complete privacy and security.': '所有壓縮都在您的瀏覽器中本地進行。您的生物識別照片永遠不會離開您的裝置，確保完全隱私和安全。',
  'Process up to 100 passport photos simultaneously. Perfect for family visa applications or multiple immigration submissions.': '同時處理最多 100 張護照照片。非常適合家庭簽證申請或多個移民提交。',
  'Browser-native Canvas API processing ensures instant compression without server uploads or waiting queues. Get your visa photos ready immediately.': '瀏覽器原生 Canvas API 處理確保即時壓縮，無需伺服器上傳或等待佇列。立即準備好您的簽證照片。',
  'Unlimited photo compression completely free—no premium tiers, no subscription fees, no advertisements. Perfect for all applicants.': '無限制的照片壓縮完全免費—無高級層級、無訂閱費用、無廣告。非常適合所有申請者。',
  'Process up to 100 passport photos simultaneously. Perfect for family travel applications or multiple renewal submissions.': '同時處理最多 100 張護照照片。非常適合家庭旅行申請或多個換發提交。',
  'Browser-native Canvas API processing ensures instant compression without server uploads or waiting queues. Get your passport photos ready immediately.': '瀏覽器原生 Canvas API 處理確保即時壓縮，無需伺服器上傳或等待佇列。立即準備好您的護照照片。',
  'Maintain original image format and facial clarity. Keep your photos sharp enough for official identification while meeting the 200KB limit.': '保持原始圖片格式和面部清晰度。在符合 200KB 限制的同時，保持照片足夠清晰以供官方識別。',
  'All compression happens locally in your browser. Your product photos never leave your device, ensuring complete privacy and IP protection.': '所有壓縮都在您的瀏覽器中本地進行。您的產品照片永遠不會離開您的裝置，確保完全隱私和智慧財產權保護。',
  'Process up to 100 product images simultaneously. Optimize entire product catalogs in one operation, perfect for power sellers and bulk listings.': '同時處理最多 100 張產品圖片。在一次操作中優化整個產品目錄，非常適合大賣家和批量上架。',
  'Browser-native Canvas API processing ensures instant compression without server uploads or waiting queues. Get your listings live faster.': '瀏覽器原生 Canvas API 處理確保即時壓縮，無需伺服器上傳或等待佇列。更快地讓您的上架生效。',
  'Unlimited image optimization completely free—no premium tiers, no subscription fees, no advertisements. Perfect for sellers of all sizes.': '無限制的圖片優化完全免費—無高級層級、無訂閱費用、無廣告。非常適合各種規模的賣家。',
  'Maintain resolution and detail for Amazon\'s zoom feature. Keep your product images sharp enough for customers to see fine details.': '為 Amazon 的縮放功能保持解析度和細節。保持您的產品圖片足夠清晰，讓客戶可以看到精細細節。',
  'All compression happens locally in your browser. Your product photos and designs never leave your device, ensuring complete privacy.': '所有壓縮都在您的瀏覽器中本地進行。您的產品照片和設計永遠不會離開您的裝置，確保完全隱私。',
  'Process up to 100 listing images simultaneously. Optimize entire product catalogs in one operation for efficient shop management.': '同時處理最多 100 張上架圖片。在一次操作中優化整個產品目錄，實現高效的商店管理。',
  'Maintain vibrant colors and fine textures. Keep your handmade products looking their best while reducing file size for faster loading.': '保持鮮豔的色彩和精細的質感。在減少檔案大小以加快載入速度的同時，保持您的手工產品看起來最佳。',
  'All compression happens locally in your browser. Your product photos never leave your device, ensuring complete privacy and security for your inventory.': '所有壓縮都在您的瀏覽器中本地進行。您的產品照片永遠不會離開您的裝置，確保您的庫存完全隱私和安全。',
  'Maintain product detail and color accuracy. Keep your images crisp and professional while reducing file size for faster mobile loading.': '保持產品細節和色彩準確性。在減少檔案大小以加快行動載入速度的同時，保持您的圖片清晰專業。',
  'All compression happens locally in your browser. Your thumbnail designs never leave your device, ensuring complete privacy and security.': '所有壓縮都在您的瀏覽器中本地進行。您的縮圖設計永遠不會離開您的裝置，確保完全隱私和安全。',
  'Unlimited thumbnail compression completely free—no premium tiers, no subscription fees, no advertisements.': '無限制的縮圖壓縮完全免費—無高級層級、無訂閱費用、無廣告。',
  'Maintain text sharpness and image clarity. Keep your 1920x1080 or 4K dimensions while reducing file size.': '保持文字清晰度和圖片清晰度。在減少檔案大小的同時，保持您的 1920x1080 或 4K 尺寸。',
  'All compression happens locally in your browser. Your emoji designs never leave your device, ensuring complete privacy and security.': '所有壓縮都在您的瀏覽器中本地進行。您的表情符號設計永遠不會離開您的裝置，確保完全隱私和安全。',
  'Process up to 100 emoji images simultaneously. Optimize entire emoji sets for server customization in one operation.': '同時處理最多 100 張表情符號圖片。在一次操作中優化整個表情符號集以進行伺服器自訂。',
  'Browser-native Canvas API processing ensures instant compression without server uploads or waiting queues. Get your emotes ready immediately.': '瀏覽器原生 Canvas API 處理確保即時壓縮，無需伺服器上傳或等待佇列。立即準備好您的表情符號。',
  'Unlimited emoji compression completely free—no premium tiers, no subscription fees, no advertisements. Perfect for server admins.': '無限制的表情符號壓縮完全免費—無高級層級、無訂閱費用、無廣告。非常適合伺服器管理員。',
  'Maintain Alpha 通道 transparency for PNG emojis. Keep your custom emotes crisp with transparent backgrounds for professional server branding.': '為 PNG 表情符號保持 Alpha 通道透明度。為專業的伺服器品牌保持您的自訂表情符號清晰，帶有透明背景。',
  'All compression happens locally in your browser. Your corporate logos and headshots never leave your device, ensuring complete privacy.': '所有壓縮都在您的瀏覽器中本地進行。您的企業標誌和頭像永遠不會離開您的裝置，確保完全隱私。',
  'Process up to 100 signature images simultaneously. Optimize entire team\'s logos and headshots in one operation.': '同時處理最多 100 張簽名圖片。在一次操作中優化整個團隊的標誌和頭像。',
  'Browser-native Canvas API processing ensures instant compression without server uploads or waiting queues. Get your signatures ready immediately.': '瀏覽器原生 Canvas API 處理確保即時壓縮，無需伺服器上傳或等待佇列。立即準備好您的簽名。',
  'Unlimited image optimization completely free—no premium tiers, no subscription fees, no advertisements. Perfect for businesses of all sizes.': '無限制的圖片優化完全免費—無高級層級、無訂閱費用、無廣告。非常適合各種規模的企業。',
  'Process up to 100 listing images simultaneously. Optimize entire product catalogs in one operation, perfect for power sellers and bulk listings.': '同時處理最多 100 張上架圖片。在一次操作中優化整個產品目錄，非常適合大賣家和批量上架。',
  'Maintain crisp quality for Retina displays. Keep your logos and headshots sharp even at small file sizes for professional branding.': '為 Retina 顯示器保持清晰品質。即使在小檔案大小下也保持您的標誌和頭像清晰，以實現專業品牌。',
  'Batch 100+ Images - Unlimited File Sizes': '批次 100+ 圖片 - 無限制檔案大小',
  'Maintains full Alpha 通道 transparency during compression. Your transparent backgrounds remain perfectly clear.': '在壓縮過程中保持完整的 Alpha 通道透明度。您的透明背景保持完美清晰。',
  'All compression happens locally in your browser. Your PNG files never leave your device, ensuring complete privacy.': '所有壓縮都在您的瀏覽器中本地進行。您的 PNG 檔案永遠不會離開您的裝置，確保完全隱私。',
  'Unlimited PNG compression completely free—no premium tiers, no subscription fees, no advertisements.': '無限制的 PNG 壓縮完全免費—無高級層級、無訂閱費用、無廣告。',
  'Preserve Transparency for Custom Server Emotes': '為自訂伺服器表情符號保留透明度',
  'Preserves transparency when compressing WebP files with Alpha 通道s. Maintains transparent backgrounds.': '在壓縮帶有 Alpha 通道的 WebP 檔案時保留透明度。保持透明背景。',
  'All compression happens locally in your browser. Your WebP files never leave your device, ensuring complete privacy.': '所有壓縮都在您的瀏覽器中本地進行。您的 WebP 檔案永遠不會離開您的裝置，確保完全隱私。',
  'Unlimited WebP compression completely free—no premium tiers, no subscription fees, no advertisements.': '無限制的 WebP 壓縮完全免費—無高級層級、無訂閱費用、無廣告。',
  'Browser-native Canvas API processing ensures fast batch compression without server uploads or delays.': '瀏覽器原生 Canvas API 處理確保快速批次壓縮，無需伺服器上傳或延遲。',
  'Unlimited batch compression completely free—no premium tiers, no subscription fees, no advertisements.': '無限制的批次壓縮完全免費—無高級層級、無訂閱費用、無廣告。',
  
  // Intro文本
  'Compress PNG images to exactly 100KB. Meet Lighthouse performance thresholds while maintaining visual quality and transparency for web optimization.': '將 PNG 圖片精確壓縮到 100KB。在保持視覺品質和透明度以進行網頁優化的同時，達到 Lighthouse 效能閾值。',
  'Maintain Original Format for Maximum Compatibility': '保持原始格式以實現最大相容性',
  'Maintain Click-Through Rates': '保持點擊率',
  
  // 长文本段落 - Intro content
  'Visa application photos contain sensitive biometric information that must be handled with extreme care. Uploading these photos to cloud-based compression services poses serious privacy and security risks, as your biometric data could be stored, analyzed, or misused by third parties. Toolaze processes all photos locally in your browser, ensuring your biometric information never leaves your device. All compression happens using JavaScript and Canvas API without any server uploads, facial recognition, or data storage. We provide pure technical compression without any facial alterations, beautification, or AI enhancements, ensuring your photo remains 100% authentic and compliant with immigration standards.': '簽證申請照片包含敏感的生物識別資訊，必須極其謹慎處理。將這些照片上傳到基於雲端的壓縮服務會帶來嚴重的隱私和安全風險，因為您的生物識別數據可能被第三方儲存、分析或濫用。Toolaze 在您的瀏覽器中本地處理所有照片，確保您的生物識別資訊永遠不會離開您的裝置。所有壓縮都使用 JavaScript 和 Canvas API 進行，無需任何伺服器上傳、人臉識別或數據儲存。我們提供純技術壓縮，不進行任何面部修改、美化或 AI 增強，確保您的照片保持 100% 真實並符合移民標準。',
  'Passport photos contain sensitive biometric information that must be handled with extreme care. Uploading these photos to cloud-based compression services poses serious privacy and security risks, as your biometric data could be stored, analyzed, or misused by third parties. Toolaze processes all photos locally in your browser, ensuring your biometric information never leaves your device. All compression happens using JavaScript and Canvas API without any server uploads, facial recognition, or data storage. We focus on technical clarity and file size optimization without any artificial alterations, beautification, or AI enhancements, ensuring your photo remains authentic and compliant with government standards.': '護照照片包含敏感的生物識別資訊，必須極其謹慎處理。將這些照片上傳到基於雲端的壓縮服務會帶來嚴重的隱私和安全風險，因為您的生物識別數據可能被第三方儲存、分析或濫用。Toolaze 在您的瀏覽器中本地處理所有照片，確保您的生物識別資訊永遠不會離開您的裝置。所有壓縮都使用 JavaScript 和 Canvas API 進行，無需任何伺服器上傳、人臉識別或數據儲存。我們專注於技術清晰度和檔案大小優化，不進行任何人工修改、美化或 AI 增強，確保您的照片保持真實並符合政府標準。',
  'As an Amazon seller, your product photos are valuable intellectual property that must be protected. Uploading unreleased products or proprietary designs to cloud-based compression services poses serious security risks, as your images could be stored, analyzed, or misused by competitors. Toolaze processes all images locally in your browser, ensuring your product photos never leave your device. All compression happens using JavaScript and Canvas API without any server uploads, watermarks, or data storage. Your trade secrets and product designs remain completely private and secure throughout the entire compression process, making it safe for unreleased products and proprietary information.': '作為 Amazon 賣家，您的產品照片是寶貴的智慧財產權，必須受到保護。將未發布的產品或專有設計上傳到基於雲端的壓縮服務會帶來嚴重的安全風險，因為您的圖片可能被競爭對手儲存、分析或濫用。Toolaze 在您的瀏覽器中本地處理所有圖片，確保您的產品照片永遠不會離開您的裝置。所有壓縮都使用 JavaScript 和 Canvas API 進行，無需任何伺服器上傳、浮水印或數據儲存。您的商業機密和產品設計在整個壓縮過程中保持完全私密和安全，使其適合未發布的產品和專有資訊。',
  'Custom Discord emojis often require transparent backgrounds to blend seamlessly with Discord\'s interface and look professional in chat. Converting PNG emojis to JPG to reduce file size destroys this transparency, forcing you to use solid backgrounds that look unprofessional. Our compression algorithm maintains the Alpha 通道 throughout the process, ensuring your transparent backgrounds remain perfectly clear and your custom emotes stay crisp. All processing happens locally in your browser, so your emoji designs never leave your device and remain completely private and secure.': '自訂 Discord 表情符號通常需要透明背景，以與 Discord 介面無縫融合，並在聊天中看起來專業。將 PNG 表情符號轉換為 JPG 以減少檔案大小會破壞這種透明度，迫使您使用看起來不專業的實色背景。我們的壓縮演算法在整個過程中保持 Alpha 通道，確保您的透明背景保持完美清晰，您的自訂表情符號保持清晰。所有處理都在您的瀏覽器中本地進行，因此您的表情符號設計永遠不會離開您的裝置，並保持完全私密和安全。',
  
  // Specs
  'Canvas API - Browser-Native Processing': 'Canvas API - 瀏覽器原生處理',
  'Canvas API 驅動 - 瀏覽器原生處理': 'Canvas API 驅動 - 瀏覽器原生處理',
  'Canvas API 引擎 - 瀏覽器原生處理': 'Canvas API 引擎 - 瀏覽器原生處理',
  'HEVC 解碼器啟用 - 本地 GPU 加速': 'HEVC 解碼器啟用 - 本地 GPU 加速',
  'HEVC 解碼器啟用 - WebAssembly 驅動處理': 'HEVC 解碼器啟用 - WebAssembly 驅動處理',
  
  // Performance metrics labels
  'File Size Target': '檔案大小目標',
  'Transparency Preserved': '透明度保留',
  'Quality Retention': '品質保留',
  'Processing Location': '處理位置',
  'Data Logic': '資料邏輯',
  'EXIF Support': 'EXIF 支援',
  
  // Features titles
  'Transparency Preserved': '透明度保留',
}

// 递归翻译函数
function translateText(text) {
  if (typeof text !== 'string') return text
  
  let translated = text
  
  // 应用翻译映射
  for (const [en, zh] of Object.entries(translations)) {
    // 精确匹配
    if (translated === en) {
      translated = zh
      continue
    }
    // 替换匹配
    translated = translated.replace(new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), zh)
  }
  
  return translated
}

// 递归处理对象
function translateObject(obj) {
  if (Array.isArray(obj)) {
    return obj.map(item => translateObject(item))
  } else if (obj !== null && typeof obj === 'object') {
    const translated = {}
    for (const [key, value] of Object.entries(obj)) {
      // 跳过某些不需要翻译的字段
      if (key === 'icon' || key === 'iconType' || key === 'in_menu' || key === 'sectionsOrder') {
        translated[key] = value
      } else if (key === 'value' || key === 'desc' || key === 'text' || key === 'engine' || key === 'logic' || key === 'limit' || key === 'privacy' || key === 'title') {
        // 这些字段需要翻译
        translated[key] = translateText(value)
      } else if (key === 'title' && typeof value === 'string' && value.includes('Preserved')) {
        translated[key] = translateText(value)
      } else {
        translated[key] = translateObject(value)
      }
    }
    return translated
  } else if (typeof obj === 'string') {
    return translateText(obj)
  }
  return obj
}

// 处理单个文件
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(content)
    const translated = translateObject(data)
    fs.writeFileSync(filePath, JSON.stringify(translated, null, 2) + '\n', 'utf8')
    return true
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message)
    return false
  }
}

// 主函数
function main() {
  const dataDir = path.join(__dirname, '../src/data/zh-TW')
  let processed = 0
  let errors = 0
  
  // 处理 image-converter 目录下的所有文件
  const converterDir = path.join(dataDir, 'image-converter')
  if (fs.existsSync(converterDir)) {
    const files = fs.readdirSync(converterDir)
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(converterDir, file)
        if (processFile(filePath)) {
          processed++
          console.log(`✅ Processed: ${file}`)
        } else {
          errors++
        }
      }
    }
  }
  
  // 处理 image-compression.json
  const compressionFile = path.join(dataDir, 'image-compression.json')
  if (fs.existsSync(compressionFile)) {
    if (processFile(compressionFile)) {
      processed++
      console.log(`✅ Processed: image-compression.json`)
    } else {
      errors++
    }
  }
  
  console.log(`\n完成！處理了 ${processed} 個文件，${errors} 個錯誤`)
}

main()
