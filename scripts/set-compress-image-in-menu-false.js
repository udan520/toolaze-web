const fs = require('fs')
const path = require('path')

async function main() {
  const languages = ['en', 'de', 'es', 'fr', 'pt', 'it', 'ja', 'ko', 'zh-TW']
  
  for (const lang of languages) {
    const filePath = path.join(__dirname, '..', 'src', 'data', lang, 'image-compression.json')
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    
    if (data['compress-image']) {
      data['compress-image'].in_menu = false
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8')
      console.log(`✅ ${lang}: compress-image.in_menu set to false`)
    } else {
      console.log(`⚠️  ${lang}: compress-image not found`)
    }
  }
  
  console.log('\n✨ All files updated!')
}

main().catch(console.error)
