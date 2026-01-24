// 为所有字体分类生成 L3 页面的 JSON 文件
const fs = require('fs')
const path = require('path')

// 所有分类及其信息
const categories = [
  { slug: 'cursive', name: 'Cursive', searchVolume: 33100, keyword: 'cursive font generator' },
  { slug: 'fancy', name: 'Fancy', searchVolume: 27100, keyword: 'fancy font generator' },
  { slug: 'bold', name: 'Bold', searchVolume: 18100, keyword: 'bold font generator' },
  { slug: 'tattoo', name: 'Tattoo', searchVolume: 18100, keyword: 'tattoo font generator' },
  { slug: 'cool', name: 'Cool', searchVolume: 14800, keyword: 'cool font generator' },
  { slug: 'instagram', name: 'Instagram', searchVolume: 12100, keyword: 'instagram font generator' },
  { slug: 'italic', name: 'Italic', searchVolume: 9900, keyword: 'italic font generator' },
  { slug: 'gothic', name: 'Gothic', searchVolume: 8100, keyword: 'gothic font generator' },
  { slug: 'calligraphy', name: 'Calligraphy', searchVolume: 8100, keyword: 'calligraphy font generator' },
  { slug: 'discord', name: 'Discord', searchVolume: 5400, keyword: 'discord font generator' },
  { slug: 'old-english', name: 'Old English', searchVolume: 5400, keyword: 'old english font generator' },
  { slug: '3d', name: '3D', searchVolume: 4400, keyword: '3d font generator' },
  { slug: 'minecraft', name: 'Minecraft', searchVolume: 4400, keyword: 'minecraft font generator' },
  { slug: 'disney', name: 'Disney', searchVolume: 3600, keyword: 'disney font generator' },
  { slug: 'bubble', name: 'Bubble', searchVolume: 2900, keyword: 'bubble font generator' },
  { slug: 'star-wars', name: 'Star Wars', searchVolume: 2400, keyword: 'star wars font generator' }
]

// 生成每个分类的 JSON 内容
categories.forEach(category => {
  const jsonContent = {
    "in_menu": true,
    "metadata": {
      "title": `${category.name} Font Generator (Free, Copy Paste & No Ads) - Toolaze`,
      "description": `How to generate ${category.name.toLowerCase()} fonts? 1. Type your text 2. Select ${category.name.toLowerCase()} style 3. Copy and paste. Create beautiful ${category.name.toLowerCase()} text for Instagram, Facebook, and social media. Free & Private.`
    },
    "sectionsOrder": [
      "howToUse",
      "features",
      "intro",
      "performanceMetrics",
      "comparison",
      "scenes",
      "rating",
      "faq"
    ],
    "hero": {
      "h1": `${category.name} Font Generator`,
      "desc": `Generate beautiful ${category.name.toLowerCase()} fonts online for free. Simply type your text below to create elegant ${category.name.toLowerCase()} text that you can copy and paste anywhere.`
    },
    "intro": {
      "title": `Why Use a ${category.name} Font Generator?`,
      "content": [
        {
          "title": `What is ${category.name} Font?`,
          "text": `${category.name} fonts are distinctive typefaces that create unique visual styles. They feature ${category.name.toLowerCase()}-specific characteristics that make your text stand out. ${category.name} fonts are perfect for adding a special touch to social media posts, invitations, logos, and design projects where you want to convey a specific aesthetic or personality.`
        },
        {
          "title": `Why Generate ${category.name} Text Online?`,
          "text": `Creating ${category.name.toLowerCase()} text manually requires design software and font installation, which can be time-consuming and complex. Our ${category.name.toLowerCase()} font generator lets you instantly transform any text into beautiful ${category.name.toLowerCase()} style without downloading software or installing fonts. Perfect for social media users who want distinctive text for Instagram bios, Facebook posts, or TikTok captions, as well as designers who need quick ${category.name.toLowerCase()} text for mockups and presentations.`
        }
      ]
    },
    "features": {
      "title": `Powerful ${category.name} Font Features`,
      "items": [
        {
          "icon": "✍️",
          "iconType": "quality",
          "title": `Elegant ${category.name} Styles`,
          "desc": `Generate beautiful ${category.name.toLowerCase()} text with multiple elegant styles that create distinctive visual effects.`
        },
        {
          "icon": "🔒",
          "iconType": "privacy",
          "title": "Complete Privacy Protection",
          "desc": "All font generation happens locally in your browser—your text never leaves your device, ensuring absolute data security."
        },
        {
          "icon": "⚡",
          "iconType": "speed",
          "title": "Instant Generation",
          "desc": "Transform your text into ${category.name.toLowerCase()} style instantly with real-time preview—no waiting, no delays."
        },
        {
          "icon": "📋",
          "iconType": "batch",
          "title": "Easy Copy & Paste",
          "desc": "Copy your ${category.name.toLowerCase()} text with one click and paste it directly into Instagram, Facebook, Twitter, or any platform."
        },
        {
          "icon": "💎",
          "iconType": "free",
          "title": "Zero Cost Forever",
          "desc": "Enjoy unlimited ${category.name.toLowerCase()} font generation completely free—no subscriptions, no hidden fees, no advertisements ever."
        },
        {
          "icon": "🌐",
          "iconType": "browser",
          "title": "No Installation Needed",
          "desc": "Everything runs directly in your web browser using client-side technology—no software downloads or font installations required."
        }
      ]
    },
    "specs": {
      "engine": "Browser-Native Font Rendering - Client-Side Processing",
      "limit": "Unlimited Text Length - No Character Limits",
      "logic": "Real-Time Preview (Instant Style Application)",
      "privacy": "100% Client-Side (Local Browser Processing)"
    },
    "performanceMetrics": {
      "title": "Technical Specifications",
      "metrics": [
        {
          "label": "Font Style",
          "value": `${category.name} (Distinctive Style)`
        },
        {
          "label": "Text Length",
          "value": "Unlimited characters"
        },
        {
          "label": "Processing Speed",
          "value": "Instant (Real-time preview)"
        },
        {
          "label": "Output Format",
          "value": "Unicode text (Copy & paste ready)"
        },
        {
          "label": "Platform Support",
          "value": "Instagram, Facebook, Twitter, TikTok, Discord, and more"
        },
        {
          "label": "Processing Location",
          "value": "100% Client-Side (Browser JavaScript)"
        },
        {
          "label": "Privacy",
          "value": "No server uploads, complete local processing"
        }
      ]
    },
    "howToUse": {
      "title": `How to Generate ${category.name} Fonts`,
      "steps": [
        {
          "title": "Type Your Text",
          "desc": `Enter the text you want to convert into ${category.name.toLowerCase()} style in the input field above.`
        },
        {
          "title": `Select ${category.name} Style`,
          "desc": `Choose from multiple elegant ${category.name.toLowerCase()} font styles. Preview your text in real-time to see how it looks.`
        },
        {
          "title": "Copy & Paste",
          "desc": "Click the copy button to copy your ${category.name.toLowerCase()} text, then paste it anywhere—social media, documents, or design tools."
        }
      ]
    },
    "comparison": {
      "toolaze": "Unlimited text length, Multiple ${category.name.toLowerCase()} styles, Instant preview, Real-time generation, 100% local processing, No uploads, Free forever",
      "others": "Character limits, Limited styles, Slow processing, Server uploads required, Cloud queues, Privacy concerns, Paid upgrades"
    },
    "scenes": [
      {
        "title": "Social Media Users",
        "icon": "📱",
        "desc": `Create elegant ${category.name.toLowerCase()} text for Instagram bios, Facebook posts, Twitter tweets, and TikTok captions. Stand out with beautiful ${category.name.toLowerCase()}-style text that matches your personal brand.`
      },
      {
        "title": "Content Creators",
        "icon": "🎨",
        "desc": `Generate ${category.name.toLowerCase()} fonts for YouTube thumbnails, blog post titles, and marketing materials. Add a distinctive touch to your content with elegant ${category.name.toLowerCase()} text.`
      },
      {
        "title": "Designers",
        "icon": "💼",
        "desc": `Quickly generate ${category.name.toLowerCase()} text for design mockups, presentations, and branding projects. Preview different ${category.name.toLowerCase()} styles instantly before finalizing your design.`
      }
    ],
    "rating": {
      "text": `"The best ${category.name.toLowerCase()} font generator I've found. Instant results and works perfectly on Instagram!" - Join thousands of users who trust Toolaze for beautiful ${category.name.toLowerCase()} text generation.`
    },
    "faq": [
      {
        "q": `Can I use ${category.name.toLowerCase()} fonts on Instagram?`,
        "a": `Yes! The ${category.name.toLowerCase()} text generated by Toolaze uses Unicode characters that are fully supported on Instagram, Facebook, Twitter, TikTok, and most social media platforms. Simply copy and paste your ${category.name.toLowerCase()} text directly into your posts, bios, or captions.`
      },
      {
        "q": `Is the ${category.name.toLowerCase()} font generator really free?`,
        "a": "Yes, Toolaze is completely free forever with no hidden costs or advertisements. More importantly, all font generation happens locally in your browser using client-side technology. Your text never leaves your device—it's never uploaded to any server, ensuring 100% privacy and security."
      },
      {
        "q": `How many ${category.name.toLowerCase()} font styles are available?`,
        "a": `Toolaze offers multiple elegant ${category.name.toLowerCase()} font styles, each with its own unique appearance. You can preview all available styles in real-time and choose the one that best matches your needs.`
      },
      {
        "q": `Can I generate ${category.name.toLowerCase()} text for long paragraphs?`,
        "a": "Yes, there are no character limits. You can generate ${category.name.toLowerCase()} text for sentences, paragraphs, or even entire documents. The generator processes your text instantly regardless of length."
      },
      {
        "q": `Will my ${category.name.toLowerCase()} text work on all platforms?`,
        "a": `The ${category.name.toLowerCase()} text generated by Toolaze uses Unicode characters that are widely supported across platforms including Instagram, Facebook, Twitter, TikTok, Discord, WhatsApp, and most modern applications. However, some older platforms or applications may not display all Unicode characters correctly.`
      },
      {
        "q": `Can I download ${category.name.toLowerCase()} font files?`,
        "a": "Toolaze generates styled text that you can copy and paste. We don't provide downloadable font files (.ttf, .otf), but you can use the generated ${category.name.toLowerCase()} text anywhere that supports Unicode characters."
      },
      {
        "q": "Is my text stored or logged anywhere?",
        "a": "No! All ${category.name.toLowerCase()} font generation happens locally in your browser. Your text is never uploaded to any server, never stored in any database, and never logged. Complete privacy is guaranteed."
      }
    ],
    "compare": {
      "toolaze": `Unlimited ${category.name.toLowerCase()} text generation, Multiple elegant styles, Instant real-time preview, Local-first architecture, No character limits, Complete privacy protection, 100% free forever`,
      "others": "Character limits, Limited style options, Slow server processing, Cloud uploads required, Privacy concerns, Watermarks or ads, Paid premium features"
    }
  }

  // 确保目录存在
  const dirPath = path.join(__dirname, '../src/data/en/font-generator')
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }

  // 写入文件
  const filePath = path.join(dirPath, `${category.slug}.json`)
  fs.writeFileSync(filePath, JSON.stringify(jsonContent, null, 2), 'utf8')
  console.log(`✅ 已创建: ${category.slug}.json`)
})

console.log(`\n✅ 已为 ${categories.length} 个分类创建 L3 页面 JSON 文件`)
