// 为所有字体分类生成 L3 页面的 JSON 文件（带独特场景和FAQ）
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

// 每个分类的独特场景
const uniqueScenes = {
  'cursive': [
    {
      "title": "Wedding Invitations",
      "icon": "💍",
      "desc": "Create elegant cursive text for wedding invitations, save-the-dates, and ceremony programs. Add a romantic, sophisticated touch to your special day with beautiful handwritten-style fonts."
    },
    {
      "title": "Personal Branding",
      "icon": "✍️",
      "desc": "Use cursive fonts for personal Instagram bios, LinkedIn headers, and email signatures. Stand out with elegant script fonts that convey professionalism and personality."
    },
    {
      "title": "Art & Design Projects",
      "icon": "🎨",
      "desc": "Generate cursive text for art prints, greeting cards, and design mockups. Perfect for adding a handcrafted, artistic feel to your creative projects."
    }
  ],
  'tattoo': [
    {
      "title": "Tattoo Designers",
      "icon": "🖋️",
      "desc": "Create unique tattoo font designs for clients. Preview different tattoo-style fonts to find the perfect match for names, quotes, or meaningful text before inking."
    },
    {
      "title": "Body Art Enthusiasts",
      "icon": "💪",
      "desc": "Experiment with tattoo fonts for your next ink design. Test how your name, quote, or phrase looks in various bold, gothic, and decorative tattoo styles."
    },
    {
      "title": "Alternative Fashion Brands",
      "icon": "👕",
      "desc": "Use tattoo fonts for clothing designs, merchandise, and brand logos. Create edgy, bold text that captures the rebellious spirit of tattoo culture."
    }
  ],
  'disney': [
    {
      "title": "Disney Fans & Content Creators",
      "icon": "🏰",
      "desc": "Create magical Disney-style text for social media posts, YouTube thumbnails, and fan content. Add that whimsical, enchanting Disney touch to your captions and graphics."
    },
    {
      "title": "Party Planners",
      "icon": "🎉",
      "desc": "Generate Disney fonts for birthday party invitations, decorations, and themed events. Make children's parties extra special with cute, playful Disney-style text."
    },
    {
      "title": "Kids' Content Creators",
      "icon": "👶",
      "desc": "Use Disney fonts for children's book covers, educational materials, and kid-friendly content. Create fun, approachable text that appeals to young audiences."
    }
  ],
  'gothic': [
    {
      "title": "Metal & Rock Bands",
      "icon": "🎸",
      "desc": "Create bold gothic fonts for band logos, album covers, and merchandise. Perfect for metal, rock, and alternative music genres that need powerful, dramatic typography."
    },
    {
      "title": "Horror Content Creators",
      "icon": "👻",
      "desc": "Generate gothic text for horror movie posters, book covers, and spooky social media content. Add a dark, mysterious atmosphere with classic gothic typography."
    },
    {
      "title": "Gaming Communities",
      "icon": "🎮",
      "desc": "Use gothic fonts for game titles, character names, and gaming clan logos. Create an epic, medieval fantasy feel for RPGs and adventure games."
    }
  ],
  'fancy': [
    {
      "title": "Luxury Brands",
      "icon": "💎",
      "desc": "Create elegant fancy fonts for high-end product packaging, luxury brand logos, and premium marketing materials. Add sophistication and exclusivity to your brand identity."
    },
    {
      "title": "Event Planners",
      "icon": "🎊",
      "desc": "Generate fancy text for formal invitations, wedding programs, and upscale event signage. Perfect for galas, corporate events, and elegant celebrations."
    },
    {
      "title": "Fashion Designers",
      "icon": "👗",
      "desc": "Use fancy fonts for fashion brand names, runway show graphics, and editorial content. Create a refined, stylish aesthetic that matches high-fashion sensibilities."
    }
  ],
  'bold': [
    {
      "title": "Marketing Professionals",
      "icon": "📢",
      "desc": "Create attention-grabbing bold fonts for advertisements, billboards, and marketing campaigns. Make your message stand out with powerful, impactful typography."
    },
    {
      "title": "Headline Designers",
      "icon": "📰",
      "desc": "Generate bold text for blog post titles, article headers, and news headlines. Ensure your content catches readers' eyes with strong, readable bold fonts."
    },
    {
      "title": "Brand Identity Designers",
      "icon": "🏢",
      "desc": "Use bold fonts for company logos, brand names, and corporate identity systems. Create a strong, confident brand presence with bold typography."
    }
  ],
  'cool': [
    {
      "title": "Streetwear Brands",
      "icon": "👟",
      "desc": "Create cool fonts for streetwear clothing, sneaker designs, and urban fashion brands. Generate trendy, modern text that captures street culture aesthetics."
    },
    {
      "title": "Music Producers",
      "icon": "🎵",
      "desc": "Use cool fonts for album artwork, track titles, and music video graphics. Add a contemporary, hip vibe to your music branding with stylish cool fonts."
    },
    {
      "title": "Tech Startups",
      "icon": "💻",
      "desc": "Generate cool text for app names, tech product launches, and startup branding. Create a modern, innovative feel with sleek, contemporary font styles."
    }
  ],
  'instagram': [
    {
      "title": "Instagram Influencers",
      "icon": "📸",
      "desc": "Create eye-catching Instagram fonts for your bio, story highlights, and post captions. Stand out in the feed with unique, stylish text that matches your personal brand."
    },
    {
      "title": "Social Media Managers",
      "icon": "📱",
      "desc": "Generate Instagram-compatible fonts for client accounts, brand posts, and marketing campaigns. Ensure your text works perfectly on Instagram's platform."
    },
    {
      "title": "Content Creators",
      "icon": "🎬",
      "desc": "Use Instagram fonts for video thumbnails, IGTV titles, and Reels graphics. Create consistent, branded text across all your Instagram content."
    }
  ],
  'italic': [
    {
      "title": "Academic Writers",
      "icon": "📚",
      "desc": "Create italic fonts for citations, emphasis in academic papers, and scholarly publications. Follow proper typographic conventions with elegant italic text."
    },
    {
      "title": "Book Publishers",
      "icon": "📖",
      "desc": "Generate italic text for book titles, chapter headings, and literary content. Add emphasis and visual interest to your publications with italic typography."
    },
    {
      "title": "Web Designers",
      "icon": "🌐",
      "desc": "Use italic fonts for website emphasis, quotes, and call-to-action text. Create visual hierarchy and draw attention to important content elements."
    }
  ],
  'calligraphy': [
    {
      "title": "Wedding Stationery Designers",
      "icon": "💌",
      "desc": "Create elegant calligraphy fonts for wedding invitations, place cards, and ceremony programs. Add a timeless, sophisticated touch to special events."
    },
    {
      "title": "Certificate Designers",
      "icon": "🏆",
      "desc": "Generate calligraphy text for certificates, awards, and diplomas. Create formal, prestigious documents with beautiful handwritten-style calligraphy."
    },
    {
      "title": "Artisanal Brands",
      "icon": "🖼️",
      "desc": "Use calligraphy fonts for artisanal product labels, craft fair signage, and handmade goods. Add a personal, handcrafted feel to your brand."
    }
  ],
  'discord': [
    {
      "title": "Gaming Communities",
      "icon": "🎮",
      "desc": "Create Discord fonts for server names, channel titles, and role names. Make your gaming community stand out with unique, readable Discord-compatible fonts."
    },
    {
      "title": "Streamers & Content Creators",
      "icon": "📺",
      "desc": "Generate Discord text for stream overlays, chat commands, and community branding. Ensure your text displays correctly in Discord's chat interface."
    },
    {
      "title": "Online Communities",
      "icon": "💬",
      "desc": "Use Discord fonts for community announcements, event promotions, and member communications. Create engaging, eye-catching text for your Discord server."
    }
  ],
  'old-english': [
    {
      "title": "Historical Reenactments",
      "icon": "⚔️",
      "desc": "Create Old English fonts for medieval events, Renaissance fairs, and historical reenactments. Add authenticity to period-appropriate signage and materials."
    },
    {
      "title": "Traditional Pubs & Restaurants",
      "icon": "🍺",
      "desc": "Generate Old English text for pub signs, menu boards, and traditional establishment branding. Create a classic, timeless British pub aesthetic."
    },
    {
      "title": "Literary Publications",
      "icon": "📜",
      "desc": "Use Old English fonts for classic literature covers, poetry collections, and traditional book designs. Add a sense of history and tradition to your publications."
    }
  ],
  '3d': [
    {
      "title": "3D Artists & Designers",
      "icon": "🎨",
      "desc": "Create 3D fonts for 3D modeling projects, game assets, and digital art. Generate text that looks three-dimensional for use in 3D environments."
    },
    {
      "title": "Video Game Developers",
      "icon": "🎮",
      "desc": "Generate 3D text for game titles, UI elements, and in-game signage. Add depth and dimension to your game's typography with 3D font styles."
    },
    {
      "title": "Architectural Visualization",
      "icon": "🏗️",
      "desc": "Use 3D fonts for architectural renderings, building signage, and presentation materials. Create realistic, dimensional text for professional visualizations."
    }
  ],
  'minecraft': [
    {
      "title": "Minecraft Content Creators",
      "icon": "⛏️",
      "desc": "Create Minecraft-style fonts for YouTube thumbnails, video titles, and channel branding. Generate pixelated, blocky text that matches Minecraft's aesthetic."
    },
    {
      "title": "Gaming Streamers",
      "icon": "🎮",
      "desc": "Generate Minecraft fonts for stream overlays, chat commands, and gaming content. Add that distinctive Minecraft look to your streaming graphics."
    },
    {
      "title": "Minecraft Server Owners",
      "icon": "🌐",
      "desc": "Use Minecraft fonts for server names, website headers, and community branding. Create consistent Minecraft-themed text across all your server materials."
    }
  ],
  'bubble': [
    {
      "title": "Children's Content",
      "icon": "🎈",
      "desc": "Create fun bubble fonts for kids' books, educational materials, and children's party decorations. Generate playful, friendly text that appeals to young audiences."
    },
    {
      "title": "Casual Brands",
      "icon": "😊",
      "desc": "Generate bubble text for casual clothing brands, lifestyle products, and friendly marketing materials. Add a lighthearted, approachable feel to your brand."
    },
    {
      "title": "Social Media Posts",
      "icon": "💬",
      "desc": "Use bubble fonts for fun social media posts, memes, and casual content. Create eye-catching, friendly text that stands out in social feeds."
    }
  ],
  'star-wars': [
    {
      "title": "Star Wars Fans",
      "icon": "⭐",
      "desc": "Create iconic Star Wars fonts for fan content, cosplay props, and themed events. Generate authentic-looking Star Wars text for your fan projects."
    },
    {
      "title": "Sci-Fi Content Creators",
      "icon": "🚀",
      "desc": "Generate Star Wars-style fonts for sci-fi YouTube channels, podcasts, and content. Add that epic, futuristic Star Wars aesthetic to your sci-fi branding."
    },
    {
      "title": "Gaming Communities",
      "icon": "🎮",
      "desc": "Use Star Wars fonts for gaming clan names, server branding, and Star Wars game content. Create immersive, authentic Star Wars typography for your gaming community."
    }
  ]
}

// 每个分类的独特FAQ
const uniqueFAQs = {
  'cursive': [
    {
      "q": "Can I use cursive fonts for formal documents?",
      "a": "Yes! Cursive fonts generated by Toolaze use Unicode characters that work in most applications. However, for very formal documents like legal papers, you may want to verify compatibility with your specific document software first."
    },
    {
      "q": "Are cursive fonts readable on all devices?",
      "a": "Cursive text uses Unicode Mathematical Script characters that are widely supported. They display well on modern devices, though some older phones or applications may render them differently. Always preview on your target platform."
    },
    {
      "q": "Can I use cursive fonts in my email signature?",
      "a": "Yes! Cursive fonts work great in email signatures. Simply copy the generated cursive text and paste it into your email signature settings. Most email clients support Unicode characters."
    },
    {
      "q": "How do cursive fonts differ from calligraphy fonts?",
      "a": "Cursive fonts have a flowing, connected script style, while calligraphy fonts often have more decorative flourishes. Our cursive generator focuses on elegant, readable script styles perfect for everyday use. For more decorative options, try our <a href=\"/font-generator/calligraphy\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">calligraphy font generator</a> or <a href=\"/font-generator/fancy\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">fancy font generator</a>."
    },
    {
      "q": "Will cursive fonts work in Microsoft Word?",
      "a": "Yes, cursive Unicode characters work in Microsoft Word and most word processors. Simply copy and paste the generated text directly into your document."
    }
  ],
  'tattoo': [
    {
      "q": "Can I use these tattoo fonts for actual tattoo designs?",
      "a": "Yes! Many tattoo artists and clients use our generator to preview text styles before getting inked. However, always consult with your tattoo artist, as they may need to adapt the font for your specific design and body placement."
    },
    {
      "q": "Are tattoo fonts suitable for permanent tattoos?",
      "a": "Our tattoo fonts are great for design inspiration and previews. For actual tattoos, work with your artist to ensure the style is appropriate for the size and location of your tattoo, as some fonts may need adjustment for readability when inked."
    },
    {
      "q": "Can I use tattoo fonts for clothing designs?",
      "a": "Absolutely! Tattoo fonts are perfect for streetwear, band merchandise, and alternative fashion. The bold, edgy styles work great on t-shirts, hoodies, and accessories."
    },
    {
      "q": "Do tattoo fonts work on social media?",
      "a": "Yes! Tattoo fonts use Unicode characters that display well on Instagram, Facebook, Twitter, and TikTok. They're perfect for creating bold, eye-catching social media content."
    },
    {
      "q": "What's the difference between tattoo fonts and gothic fonts?",
      "a": "Tattoo fonts often combine bold, gothic, and decorative elements specifically chosen for tattoo aesthetics. Gothic fonts are more traditional and formal, while tattoo fonts are designed to be more versatile for body art. Explore our <a href=\"/font-generator/gothic\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">gothic font generator</a> for more traditional styles, or browse all our <a href=\"/font-generator\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">font generator</a> tools."
    }
  ],
  'disney': [
    {
      "q": "Are these official Disney fonts?",
      "a": "No, our Disney font generator creates text with a Disney-inspired aesthetic using Unicode characters. These are not official Disney fonts, but they capture that magical, whimsical Disney style for your personal projects."
    },
    {
      "q": "Can I use Disney fonts for commercial projects?",
      "a": "Our generated text uses Unicode characters, so technically you can use it anywhere. However, be aware that 'Disney' is a trademarked brand. For commercial use, especially anything that might be confused with official Disney content, consult legal advice."
    },
    {
      "q": "Are Disney fonts good for children's content?",
      "a": "Yes! Disney-style fonts are perfect for children's books, party invitations, educational materials, and kid-friendly content. They're playful, readable, and appeal to young audiences."
    },
    {
      "q": "Will Disney fonts work in children's apps?",
      "a": "Yes, Disney fonts use Unicode characters that work in most applications. However, always test in your specific app to ensure the fonts display correctly for your target audience."
    },
    {
      "q": "Can I use Disney fonts for birthday parties?",
      "a": "Absolutely! Disney fonts are perfect for birthday invitations, decorations, cake toppers, and party favors. They add that magical Disney touch to any celebration. For similar playful styles, try our <a href=\"/font-generator/bubble\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">bubble font generator</a> or explore our <a href=\"/font-generator\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">font generator</a> collection."
    }
  ],
  'gothic': [
    {
      "q": "Are gothic fonts the same as blackletter fonts?",
      "a": "Yes, gothic fonts (also called blackletter) are characterized by their ornate, medieval appearance. Our generator creates text with that classic gothic aesthetic using Unicode Mathematical Fraktur characters."
    },
    {
      "q": "Can I use gothic fonts for metal band logos?",
      "a": "Absolutely! Gothic fonts are extremely popular in metal and rock music. They're perfect for band logos, album covers, and merchandise that needs a bold, dramatic look."
    },
    {
      "q": "Are gothic fonts readable?",
      "a": "Gothic fonts can be less readable than modern fonts, especially in small sizes or long paragraphs. They work best for headlines, logos, and short text where the dramatic style is more important than quick readability."
    },
    {
      "q": "Will gothic fonts work in gaming applications?",
      "a": "Yes! Gothic fonts are popular in fantasy and medieval games. They work well in game titles, UI elements, and character names, adding an epic, historical feel to your game."
    },
    {
      "q": "Can I use gothic fonts for horror content?",
      "a": "Perfect! Gothic fonts are ideal for horror movie posters, book covers, and spooky social media content. They create that dark, mysterious atmosphere that horror content needs. For similar traditional styles, check out our <a href=\"/font-generator/old-english\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">Old English font generator</a> or browse our <a href=\"/font-generator\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">font generator</a> tools."
    }
  ],
  'fancy': [
    {
      "q": "What makes a font 'fancy'?",
      "a": "Fancy fonts typically have decorative elements, elegant curves, and sophisticated styling. Our fancy font generator includes double-struck, circled, and other decorative Unicode styles that create an upscale, refined appearance."
    },
    {
      "q": "Are fancy fonts suitable for luxury brands?",
      "a": "Yes! Fancy fonts are perfect for high-end product packaging, luxury brand logos, and premium marketing materials. They convey sophistication and exclusivity."
    },
    {
      "q": "Can I use fancy fonts in formal invitations?",
      "a": "Absolutely! Fancy fonts are ideal for wedding invitations, formal event programs, and elegant stationery. They add that special touch of sophistication to important occasions."
    },
    {
      "q": "Will fancy fonts work in print materials?",
      "a": "Yes, fancy Unicode fonts work well in both digital and print materials. They're perfect for business cards, letterheads, and high-quality printed materials."
    },
    {
      "q": "Are fancy fonts readable on mobile devices?",
      "a": "Most fancy fonts display well on modern mobile devices. However, some very decorative styles may be less readable at small sizes, so always preview on your target device. For more readable elegant styles, try our <a href=\"/font-generator/cursive\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">cursive font generator</a> or explore our <a href=\"/font-generator\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">font generator</a> collection."
    }
  ],
  'bold': [
    {
      "q": "What's the difference between bold fonts and regular bold text?",
      "a": "Our bold font generator uses Unicode Mathematical Bold characters, which are distinct Unicode symbols, not just styled text. This means they work consistently across all platforms, even where CSS styling isn't available."
    },
    {
      "q": "Can I use bold fonts in social media bios?",
      "a": "Yes! Bold fonts are perfect for social media bios, post captions, and anywhere you need text to stand out. They work great on Instagram, Twitter, Facebook, and TikTok."
    },
    {
      "q": "Are bold fonts good for headlines?",
      "a": "Absolutely! Bold fonts are ideal for blog post titles, article headers, and news headlines. They ensure your content catches readers' attention immediately."
    },
    {
      "q": "Will bold fonts work in email subject lines?",
      "a": "Yes, bold Unicode characters work in most email clients' subject lines. They can help your emails stand out in crowded inboxes."
    },
    {
      "q": "Can I combine bold fonts with other styles?",
      "a": "You can use bold fonts alongside other text, but each font style is independent. For mixed styling, you'd need to generate separate sections in different styles. Check out our <a href=\"/font-generator/tattoo\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">tattoo font generator</a> or <a href=\"/font-generator/gothic\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">gothic font generator</a> for more bold options, or browse our <a href=\"/font-generator\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">font generator</a> tools."
    }
  ],
  'cool': [
    {
      "q": "What makes a font 'cool'?",
      "a": "Cool fonts have a modern, trendy aesthetic that appeals to contemporary audiences. Our cool font generator includes bold, sans-serif, and monospace styles that create that sleek, hip look popular in streetwear and tech culture."
    },
    {
      "q": "Are cool fonts good for streetwear brands?",
      "a": "Yes! Cool fonts are perfect for streetwear clothing, sneaker designs, and urban fashion brands. They capture that contemporary, edgy street culture aesthetic."
    },
    {
      "q": "Can I use cool fonts for tech startups?",
      "a": "Absolutely! Cool fonts work great for app names, tech product launches, and startup branding. They create a modern, innovative feel that tech companies love."
    },
    {
      "q": "Will cool fonts work in gaming content?",
      "a": "Yes! Cool fonts are popular in gaming communities for clan names, server branding, and gaming content. They add that contemporary, competitive gaming vibe."
    },
    {
      "q": "Are cool fonts readable on all platforms?",
      "a": "Yes, cool fonts use Unicode characters that are widely supported. They display well on social media, gaming platforms, and most modern applications. For more modern styles, try our <a href=\"/font-generator/bold\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">bold font generator</a> or explore our <a href=\"/font-generator\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">font generator</a> collection."
    }
  ],
  'instagram': [
    {
      "q": "Do Instagram fonts actually work on Instagram?",
      "a": "Yes! Our Instagram font generator uses Unicode characters that are fully supported on Instagram. Simply copy and paste the generated text directly into your Instagram bio, posts, stories, or captions."
    },
    {
      "q": "Can I use Instagram fonts in Instagram Stories?",
      "a": "Yes! Instagram fonts work in Stories, posts, bios, and captions. However, note that Instagram Stories also has built-in text styling options, so you can combine both for maximum effect."
    },
    {
      "q": "Will Instagram fonts work in Instagram Reels?",
      "a": "Yes, Instagram fonts display correctly in Reels captions and on-screen text. They're perfect for creating eye-catching Reels content that stands out."
    },
    {
      "q": "Are Instagram fonts compatible with Instagram Highlights?",
      "a": "Yes! You can use Instagram fonts in your Highlight cover names and descriptions. They add a unique, branded look to your Instagram profile."
    },
    {
      "q": "Can I use Instagram fonts for Instagram ads?",
      "a": "Yes, Instagram fonts work in ad copy and descriptions. They can help your ads stand out and match your brand's Instagram aesthetic. For other platform fonts, check out our <a href=\"/font-generator/discord\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">Discord font generator</a> or browse our <a href=\"/font-generator\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">font generator</a> tools."
    }
  ],
  'italic': [
    {
      "q": "What's the difference between italic fonts and slanted text?",
      "a": "Our italic font generator uses Unicode Mathematical Italic characters, which are distinct symbols, not just styled text. This ensures consistent italic appearance across all platforms, even where CSS isn't available."
    },
    {
      "q": "Can I use italic fonts for emphasis in documents?",
      "a": "Yes! Italic fonts are perfect for emphasizing important text in documents, articles, and publications. They work great in word processors, PDFs, and web content."
    },
    {
      "q": "Are italic fonts good for book titles?",
      "a": "Absolutely! Italic fonts are commonly used for book titles, especially in academic and literary contexts. They add emphasis and visual interest to titles."
    },
    {
      "q": "Will italic fonts work in email?",
      "a": "Yes, italic Unicode characters work in most email clients. They're perfect for adding emphasis to important information in your emails."
    },
    {
      "q": "Can I use italic fonts for citations?",
      "a": "Yes! Italic fonts are standard for citations in academic writing. They work well in research papers, articles, and scholarly publications. For more script styles, try our <a href=\"/font-generator/cursive\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">cursive font generator</a> or explore our <a href=\"/font-generator\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">font generator</a> collection."
    }
  ],
  'calligraphy': [
    {
      "q": "Are calligraphy fonts the same as cursive fonts?",
      "a": "While similar, calligraphy fonts typically have more decorative flourishes and ornamental elements than simple cursive. Our calligraphy generator focuses on elegant, handwritten-style fonts with that classic calligraphy aesthetic."
    },
    {
      "q": "Can I use calligraphy fonts for wedding invitations?",
      "a": "Yes! Calligraphy fonts are perfect for wedding invitations, place cards, and ceremony programs. They add that timeless, sophisticated touch to special events."
    },
    {
      "q": "Are calligraphy fonts readable?",
      "a": "Calligraphy fonts prioritize elegance over quick readability. They work best for short text like names, titles, and invitations where the decorative style is more important than speed reading."
    },
    {
      "q": "Will calligraphy fonts work in print?",
      "a": "Yes! Calligraphy fonts work beautifully in print materials. They're ideal for formal invitations, certificates, and high-quality printed documents."
    },
    {
      "q": "Can I use calligraphy fonts for certificates?",
      "a": "Absolutely! Calligraphy fonts are perfect for certificates, awards, and diplomas. They create that formal, prestigious look that official documents need. For similar elegant styles, check out our <a href=\"/font-generator/cursive\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">cursive font generator</a> or <a href=\"/font-generator/fancy\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">fancy font generator</a>, or browse our <a href=\"/font-generator\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">font generator</a> tools."
    }
  ],
  'discord': [
    {
      "q": "Do Discord fonts actually work in Discord?",
      "a": "Yes! Our Discord font generator creates text using Unicode characters that display correctly in Discord's chat interface. Simply copy and paste into any Discord channel, server name, or username field."
    },
    {
      "q": "Can I use Discord fonts in server names?",
      "a": "Yes! Discord fonts work in server names, channel names, and role names. They help your Discord server stand out with unique, eye-catching text."
    },
    {
      "q": "Will Discord fonts work in Discord bots?",
      "a": "Yes, Discord bots can send messages with Discord fonts. The Unicode characters display correctly in bot messages, embeds, and announcements."
    },
    {
      "q": "Are Discord fonts readable in Discord's dark mode?",
      "a": "Yes! Discord fonts work in both light and dark modes. The Unicode characters adapt to Discord's theme settings automatically."
    },
    {
      "q": "Can I use Discord fonts for Discord Nitro?",
      "a": "Yes, Discord fonts work regardless of whether you have Nitro or not. They use standard Unicode characters that work for all Discord users. For other platform fonts, try our <a href=\"/font-generator/instagram\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">Instagram font generator</a> or explore our <a href=\"/font-generator\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">font generator</a> collection."
    }
  ],
  'old-english': [
    {
      "q": "Are Old English fonts historically accurate?",
      "a": "Our Old English fonts use Unicode Mathematical Fraktur characters that capture the aesthetic of traditional Old English/blackletter typography. While not exact historical replicas, they provide that classic medieval appearance."
    },
    {
      "q": "Can I use Old English fonts for pub signs?",
      "a": "Yes! Old English fonts are perfect for traditional pub signs, menu boards, and British-style establishment branding. They create that classic, timeless pub aesthetic."
    },
    {
      "q": "Are Old English fonts readable?",
      "a": "Old English fonts can be less readable than modern fonts, especially in small sizes. They work best for headlines, signs, and short text where the traditional style is more important than quick readability."
    },
    {
      "q": "Will Old English fonts work in gaming?",
      "a": "Yes! Old English fonts are popular in medieval and fantasy games. They're perfect for game titles, character names, and UI elements that need that historical, epic feel."
    },
    {
      "q": "Can I use Old English fonts for historical reenactments?",
      "a": "Absolutely! Old English fonts are ideal for medieval events, Renaissance fairs, and historical reenactments. They add authenticity to period-appropriate signage and materials. For similar traditional styles, check out our <a href=\"/font-generator/gothic\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">gothic font generator</a> or browse our <a href=\"/font-generator\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">font generator</a> tools."
    }
  ],
  '3d': [
    {
      "q": "Do 3D fonts actually look three-dimensional?",
      "a": "Our 3D font generator uses Unicode characters with bold, dimensional styling that creates a 3D-like appearance. While not true 3D graphics, they provide that depth and dimension effect using Unicode typography."
    },
    {
      "q": "Can I use 3D fonts in 3D modeling software?",
      "a": "The generated text uses Unicode characters, which can be imported into 3D software as text objects. However, for true 3D text, you'd typically use the 3D software's text tools to create actual 3D geometry."
    },
    {
      "q": "Are 3D fonts good for game titles?",
      "a": "Yes! 3D fonts are perfect for video game titles, logos, and UI elements. They add that modern, dimensional look that many games use for their branding."
    },
    {
      "q": "Will 3D fonts work on social media?",
      "a": "Yes! 3D fonts use Unicode characters that work on Instagram, Facebook, Twitter, and TikTok. They're great for creating eye-catching social media content with depth."
    },
    {
      "q": "Can I use 3D fonts for architectural visualization?",
      "a": "Yes, 3D fonts work well in architectural renderings and presentation materials. They create realistic, dimensional text for professional visualizations. For more bold styles, try our <a href=\"/font-generator/bold\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">bold font generator</a> or explore our <a href=\"/font-generator\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">font generator</a> collection."
    }
  ],
  'minecraft': [
    {
      "q": "Are these official Minecraft fonts?",
      "a": "No, our Minecraft font generator creates text with a Minecraft-inspired pixelated, blocky aesthetic using Unicode characters. These are not official Minecraft fonts, but they capture that distinctive Minecraft style."
    },
    {
      "q": "Can I use Minecraft fonts in Minecraft itself?",
      "a": "Our generated text uses Unicode characters that can be used in Minecraft chat, signs, and books. However, Minecraft has its own built-in font system, so the appearance may differ from our generator's preview."
    },
    {
      "q": "Are Minecraft fonts good for gaming content?",
      "a": "Yes! Minecraft fonts are perfect for YouTube thumbnails, video titles, and gaming channel branding. They create that recognizable Minecraft aesthetic for your content."
    },
    {
      "q": "Will Minecraft fonts work on streaming platforms?",
      "a": "Yes! Minecraft fonts work great in stream overlays, chat commands, and gaming content on Twitch, YouTube, and other streaming platforms."
    },
    {
      "q": "Can I use Minecraft fonts for server branding?",
      "a": "Absolutely! Minecraft fonts are ideal for server names, website headers, and community branding. They create consistent Minecraft-themed text across all your server materials. For similar gaming styles, try our <a href=\"/font-generator/3d\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">3D font generator</a> or browse our <a href=\"/font-generator\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">font generator</a> tools."
    }
  ],
  'bubble': [
    {
      "q": "What makes a font 'bubble' style?",
      "a": "Bubble fonts have a rounded, playful appearance that looks soft and friendly. Our bubble font generator uses bold, rounded Unicode styles that create that fun, approachable bubble aesthetic."
    },
    {
      "q": "Are bubble fonts good for children's content?",
      "a": "Yes! Bubble fonts are perfect for children's books, educational materials, and kids' party decorations. They're playful, friendly, and appeal to young audiences."
    },
    {
      "q": "Can I use bubble fonts for casual brands?",
      "a": "Absolutely! Bubble fonts work great for casual clothing brands, lifestyle products, and friendly marketing materials. They add a lighthearted, approachable feel to your brand."
    },
    {
      "q": "Will bubble fonts work on social media?",
      "a": "Yes! Bubble fonts are perfect for fun social media posts, memes, and casual content. They create eye-catching, friendly text that stands out in social feeds."
    },
    {
      "q": "Are bubble fonts readable?",
      "a": "Yes, bubble fonts are generally very readable. Their rounded, bold style makes them easy to read, even at smaller sizes, which is why they're popular for children's content. For similar playful styles, check out our <a href=\"/font-generator/disney\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">Disney font generator</a> or explore our <a href=\"/font-generator\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">font generator</a> collection."
    }
  ],
  'star-wars': [
    {
      "q": "Are these official Star Wars fonts?",
      "a": "No, our Star Wars font generator creates text with a Star Wars-inspired aesthetic using Unicode characters. These are not official Star Wars fonts, but they capture that iconic, futuristic Star Wars style."
    },
    {
      "q": "Can I use Star Wars fonts for fan content?",
      "a": "Yes! Star Wars fonts are perfect for fan content, cosplay props, and themed events. However, be aware that 'Star Wars' is a trademarked brand, so for commercial use, consult legal advice."
    },
    {
      "q": "Are Star Wars fonts good for sci-fi content?",
      "a": "Absolutely! Star Wars fonts work great for sci-fi YouTube channels, podcasts, and content. They add that epic, futuristic aesthetic to your sci-fi branding."
    },
    {
      "q": "Will Star Wars fonts work in gaming?",
      "a": "Yes! Star Wars fonts are perfect for gaming clan names, server branding, and Star Wars game content. They create immersive, authentic Star Wars typography for your gaming community."
    },
    {
      "q": "Can I use Star Wars fonts for space-themed events?",
      "a": "Yes! Star Wars fonts are ideal for space-themed parties, events, and decorations. They add that iconic Star Wars feel to any space-related celebration. For similar futuristic styles, try our <a href=\"/font-generator/3d\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">3D font generator</a> or browse our <a href=\"/font-generator\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">font generator</a> tools."
    }
  ]
}

// 每个分类的相关内链（根据内链策略）
const internalLinks = {
  'cursive': ['fancy', 'calligraphy', 'italic'],
  'tattoo': ['gothic', 'bold', 'cool'],
  'disney': ['bubble', 'cursive', 'fancy'],
  'gothic': ['old-english', 'tattoo', 'bold'],
  'fancy': ['cursive', 'calligraphy', 'bold'],
  'bold': ['tattoo', 'gothic', 'cool'],
  'cool': ['bold', 'tattoo', 'instagram'],
  'instagram': ['discord', 'cool', 'fancy'],
  'italic': ['cursive', 'calligraphy', 'bold'],
  'calligraphy': ['cursive', 'fancy', 'disney'],
  'discord': ['instagram', 'cool', 'bold'],
  'old-english': ['gothic', 'tattoo', 'bold'],
  '3d': ['bold', 'cool', 'tattoo'],
  'minecraft': ['3d', 'cool', 'bubble'],
  'bubble': ['disney', 'cursive', 'fancy'],
  'star-wars': ['3d', 'cool', 'bold']
}

// 生成内链HTML的函数
function addInternalLinks(text, categorySlug, tool = 'font-generator') {
  const relatedLinks = internalLinks[categorySlug] || []
  let result = text
  
  // 为每个相关分类添加链接
  relatedLinks.forEach(relatedSlug => {
    const categoryMap = {
      'cursive': 'cursive font generator',
      'fancy': 'fancy font generator',
      'bold': 'bold font generator',
      'tattoo': 'tattoo font generator',
      'cool': 'cool font generator',
      'instagram': 'Instagram font generator',
      'italic': 'italic font generator',
      'gothic': 'gothic font generator',
      'calligraphy': 'calligraphy font generator',
      'discord': 'Discord font generator',
      'old-english': 'Old English font generator',
      '3d': '3D font generator',
      'minecraft': 'Minecraft font generator',
      'disney': 'Disney font generator',
      'bubble': 'bubble font generator',
      'star-wars': 'Star Wars font generator'
    }
    
    const anchorText = categoryMap[relatedSlug]
    if (anchorText) {
      // 使用正则表达式替换文本中的关键词为链接
      const regex = new RegExp(`\\b${anchorText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
      result = result.replace(regex, (match) => {
        // 如果已经是链接，跳过
        if (result.includes(`<a href="/${tool}/${relatedSlug}">`)) {
          return match
        }
        return `<a href="/${tool}/${relatedSlug}" class="text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2">${match}</a>`
      })
    }
  })
  
  // 添加回到主页面的链接
  const mainPageLink = `<a href="/${tool}" class="text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2">font generator</a>`
  result = result.replace(/\bfont generator\b/gi, (match, offset) => {
    // 避免重复替换已经链接的文本
    const before = result.substring(0, offset)
    if (before.includes('<a href="/font-generator"')) {
      return match
    }
    return mainPageLink
  })
  
  return result
}

// 每个分类的独特intro内容（200+单词，针对每个分类的特点，包含内链）
const uniqueIntros = {
  'cursive': {
    "title": "Why Use a Cursive Font Generator?",
    "content": [
      {
        "title": "What is Cursive Font?",
        "text": "Cursive fonts, also known as script fonts, feature flowing, connected letterforms that mimic handwritten text. These elegant typefaces create a sense of sophistication and personal touch, making them perfect for formal invitations, personal branding, and artistic projects. Unlike standard fonts, cursive styles add warmth and personality to your text, conveying emotion and style through their graceful curves and connections. If you're looking for more decorative options, try our <a href=\"/font-generator/fancy\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">fancy font generator</a> or <a href=\"/font-generator/calligraphy\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">calligraphy font generator</a> for additional elegant styles."
      },
      {
        "title": "Why Generate Cursive Text Online?",
        "text": "Traditional methods of creating cursive text require expensive design software, font installation, and typography knowledge. Our cursive font generator eliminates these barriers by providing instant access to beautiful script styles directly in your browser. Whether you're designing wedding invitations, creating personal Instagram bios, or adding elegant touches to business cards, our tool transforms any text into professional cursive style in seconds—no downloads, no installations, no design experience needed. Explore more font styles with our comprehensive <a href=\"/font-generator\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">font generator</a> collection."
      }
    ]
  },
  'tattoo': {
    "title": "Why Use a Tattoo Font Generator?",
    "content": [
      {
        "title": "What is Tattoo Font?",
        "text": "Tattoo fonts combine bold, gothic, and decorative elements specifically designed for body art aesthetics. These distinctive typefaces feature strong lines, unique character shapes, and edgy styling that captures the rebellious spirit of tattoo culture. Tattoo fonts are characterized by their bold presence, making text stand out whether used in actual tattoo designs, streetwear clothing, or alternative fashion branding. For similar bold styles, check out our <a href=\"/font-generator/gothic\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">gothic font generator</a> or <a href=\"/font-generator/bold\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">bold font generator</a>."
      },
      {
        "title": "Why Generate Tattoo Text Online?",
        "text": "Designing tattoo-style text traditionally requires specialized design software and extensive typography knowledge. Tattoo artists and enthusiasts often spend hours searching for the perfect font style that matches their vision. Our tattoo font generator provides instant access to multiple bold, gothic, and decorative styles, allowing you to preview how names, quotes, or meaningful phrases will look before committing to permanent ink. Perfect for tattoo designers, body art enthusiasts, and alternative fashion brands who need distinctive, eye-catching typography. Explore more styles with our <a href=\"/font-generator\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">font generator</a> collection."
      }
    ]
  },
  'disney': {
    "title": "Why Use a Disney Font Generator?",
    "content": [
      {
        "title": "What is Disney Font?",
        "text": "Disney fonts capture that magical, whimsical aesthetic associated with Disney's enchanting world. These playful typefaces feature rounded, friendly letterforms with a sense of wonder and joy. Disney-style fonts are characterized by their cute, approachable appearance, making them perfect for children's content, party decorations, and family-friendly projects. They convey a sense of fun, adventure, and imagination that appeals to both kids and adults. For similar playful styles, try our <a href=\"/font-generator/bubble\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">bubble font generator</a> or <a href=\"/font-generator/cursive\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">cursive font generator</a>."
      },
      {
        "title": "Why Generate Disney Text Online?",
        "text": "Creating Disney-inspired text for parties, children's content, or fan projects typically requires expensive design software and font licensing. Our Disney font generator provides instant access to magical, whimsical text styles that capture that enchanting Disney feel. Whether you're planning a Disney-themed birthday party, creating children's book covers, or designing fun social media content, our tool transforms any text into playful Disney-style fonts instantly—bringing that magical touch to your projects without the complexity. Discover more font styles with our <a href=\"/font-generator\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">font generator</a> tools."
      }
    ]
  },
  'gothic': {
    "title": "Why Use a Gothic Font Generator?",
    "content": [
      {
        "title": "What is Gothic Font?",
        "text": "Gothic fonts, also known as blackletter, feature ornate, medieval letterforms with dramatic, angular strokes. These historic typefaces originated in medieval Europe and are characterized by their dense, decorative appearance with intricate details. Gothic fonts create a powerful, authoritative presence, making them ideal for metal band logos, horror content, gaming titles, and projects that need a bold, dramatic aesthetic. For similar traditional styles, explore our <a href=\"/font-generator/old-english\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">Old English font generator</a> or <a href=\"/font-generator/tattoo\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">tattoo font generator</a>."
      },
      {
        "title": "Why Generate Gothic Text Online?",
        "text": "Traditional gothic typography requires specialized knowledge of historical letterforms and expensive design software. Our gothic font generator provides instant access to classic blackletter styles using Unicode Mathematical Fraktur characters. Whether you're designing metal band logos, creating horror movie posters, or developing medieval fantasy games, our tool transforms any text into authentic-looking gothic style in seconds—perfect for projects that need that dark, powerful, historical aesthetic. Browse more font styles with our <a href=\"/font-generator\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">font generator</a> collection."
      }
    ]
  },
  'fancy': {
    "title": "Why Use a Fancy Font Generator?",
    "content": [
      {
        "title": "What is Fancy Font?",
        "text": "Fancy fonts encompass a wide range of decorative, elegant typefaces that add sophistication and visual interest to text. These refined styles include double-struck characters, circled letters, squared text, and other ornamental Unicode variations. Fancy fonts are characterized by their upscale appearance, making them perfect for luxury brands, formal invitations, high-end product packaging, and projects that require a premium, exclusive aesthetic. For more elegant script styles, try our <a href=\"/font-generator/cursive\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">cursive font generator</a> or <a href=\"/font-generator/calligraphy\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">calligraphy font generator</a>."
      },
      {
        "title": "Why Generate Fancy Text Online?",
        "text": "Creating fancy decorative text traditionally requires advanced typography skills and expensive design software. Our fancy font generator provides instant access to multiple elegant Unicode styles including double-struck, circled, squared, and parenthesized variations. Whether you're designing luxury brand logos, creating formal event invitations, or developing premium marketing materials, our tool transforms any text into sophisticated fancy style instantly—adding that special touch of elegance and exclusivity to your projects. Explore all our font tools with our <a href=\"/font-generator\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">font generator</a>."
      }
    ]
  },
  'bold': {
    "title": "Why Use a Bold Font Generator?",
    "content": [
      {
        "title": "What is Bold Font?",
        "text": "Bold fonts use Unicode Mathematical Bold characters—distinct Unicode symbols that create thicker, more prominent letterforms. Unlike CSS-styled bold text, these Unicode characters work consistently across all platforms, even where styling isn't available. Bold fonts are characterized by their strong, impactful appearance, making them perfect for headlines, marketing materials, brand names, and any text that needs to command attention and convey confidence. For more bold styles, check out our <a href=\"/font-generator/tattoo\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">tattoo font generator</a> or <a href=\"/font-generator/gothic\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">gothic font generator</a>."
      },
      {
        "title": "Why Generate Bold Text Online?",
        "text": "Standard bold text styling only works where CSS is supported, limiting its use in social media bios, email subject lines, and plain text environments. Our bold font generator uses Unicode Mathematical Bold characters that work everywhere—Instagram, Twitter, email, documents, and more. Whether you're creating attention-grabbing headlines, designing marketing campaigns, or building brand identity, our tool transforms any text into powerful bold style instantly, ensuring your message stands out across all platforms. Discover more styles with our <a href=\"/font-generator\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">font generator</a>."
      }
    ]
  },
  'cool': {
    "title": "Why Use a Cool Font Generator?",
    "content": [
      {
        "title": "What is Cool Font?",
        "text": "Cool fonts feature modern, trendy aesthetics that appeal to contemporary audiences. These sleek typefaces combine bold, sans-serif, and monospace styles to create that hip, urban look popular in streetwear culture, tech startups, and gaming communities. Cool fonts are characterized by their contemporary feel, making them perfect for streetwear brands, music producers, tech companies, and projects that need a modern, innovative aesthetic. For more bold styles, try our <a href=\"/font-generator/bold\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">bold font generator</a> or <a href=\"/font-generator/tattoo\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">tattoo font generator</a>."
      },
      {
        "title": "Why Generate Cool Text Online?",
        "text": "Creating cool, trendy text requires staying current with design trends and having access to modern typography tools. Our cool font generator provides instant access to contemporary font styles that capture that sleek, hip vibe. Whether you're designing streetwear clothing, creating tech startup branding, or developing gaming content, our tool transforms any text into modern cool style instantly—perfect for projects that need that contemporary, edgy aesthetic. Explore more styles with our <a href=\"/font-generator\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">font generator</a>."
      }
    ]
  },
  'instagram': {
    "title": "Why Use an Instagram Font Generator?",
    "content": [
      {
        "title": "What is Instagram Font?",
        "text": "Instagram fonts are Unicode-based text styles specifically optimized for Instagram's platform. These fonts use Unicode characters that display correctly in Instagram bios, posts, stories, captions, and highlights. Instagram fonts help your profile stand out in the feed, making your bio more eye-catching, your captions more engaging, and your brand more memorable. They're perfect for influencers, social media managers, and content creators who want to create unique, branded Instagram content. For other platform fonts, check out our <a href=\"/font-generator/discord\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">Discord font generator</a>."
      },
      {
        "title": "Why Generate Instagram Text Online?",
        "text": "Instagram's native text styling is limited, and finding fonts that work on Instagram can be challenging. Our Instagram font generator provides instant access to multiple Unicode font styles that are fully compatible with Instagram's platform. Whether you're updating your Instagram bio, creating engaging story text, or designing branded post captions, our tool transforms any text into Instagram-compatible fonts instantly—ensuring your content stands out and displays correctly across all Instagram features. Discover more with our <a href=\"/font-generator\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">font generator</a>."
      }
    ]
  },
  'italic': {
    "title": "Why Use an Italic Font Generator?",
    "content": [
      {
        "title": "What is Italic Font?",
        "text": "Italic fonts use Unicode Mathematical Italic characters—distinct Unicode symbols that create slanted, emphasized letterforms. Unlike CSS-styled italic text, these Unicode characters work consistently across all platforms, including email, documents, and plain text environments. Italic fonts are characterized by their emphasis effect, making them perfect for academic citations, book titles, document emphasis, and any text that needs to stand out while maintaining readability. For more script styles, try our <a href=\"/font-generator/cursive\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">cursive font generator</a> or <a href=\"/font-generator/calligraphy\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">calligraphy font generator</a>."
      },
      {
        "title": "Why Generate Italic Text Online?",
        "text": "Standard italic styling only works where CSS is supported, limiting its use in email, plain text documents, and many applications. Our italic font generator uses Unicode Mathematical Italic characters that work everywhere—email clients, word processors, academic papers, and more. Whether you're writing research papers, creating book titles, or adding emphasis to documents, our tool transforms any text into proper italic style instantly, ensuring your emphasis displays correctly across all platforms. Browse more styles with our <a href=\"/font-generator\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">font generator</a>."
      }
    ]
  },
  'calligraphy': {
    "title": "Why Use a Calligraphy Font Generator?",
    "content": [
      {
        "title": "What is Calligraphy Font?",
        "text": "Calligraphy fonts feature elegant, handwritten-style letterforms with decorative flourishes and ornamental elements. These sophisticated typefaces mimic traditional penmanship, creating a sense of timeless elegance and craftsmanship. Calligraphy fonts are characterized by their graceful curves, decorative details, and formal appearance, making them perfect for wedding invitations, certificates, awards, and projects that require a prestigious, handcrafted aesthetic. For similar elegant styles, explore our <a href=\"/font-generator/cursive\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">cursive font generator</a> or <a href=\"/font-generator/fancy\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">fancy font generator</a>."
      },
      {
        "title": "Why Generate Calligraphy Text Online?",
        "text": "Traditional calligraphy requires years of practice and expensive tools. Professional calligraphy services can cost hundreds of dollars for a single project. Our calligraphy font generator provides instant access to elegant, handwritten-style fonts that capture that classic calligraphy aesthetic. Whether you're designing wedding stationery, creating certificates, or developing artisanal brand materials, our tool transforms any text into beautiful calligraphy style instantly—bringing that timeless elegance to your projects without the cost or complexity. Find more elegant fonts with our <a href=\"/font-generator\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">font generator</a>."
      }
    ]
  },
  'discord': {
    "title": "Why Use a Discord Font Generator?",
    "content": [
      {
        "title": "What is Discord Font?",
        "text": "Discord fonts are Unicode-based text styles specifically optimized for Discord's chat interface. These fonts use Unicode characters that display correctly in Discord server names, channel titles, role names, and chat messages. Discord fonts help your server stand out, making your community more engaging and your branding more memorable. They're perfect for gaming communities, streamers, and online communities who want to create unique, eye-catching Discord content. For other platform fonts, try our <a href=\"/font-generator/instagram\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">Instagram font generator</a>."
      },
      {
        "title": "Why Generate Discord Text Online?",
        "text": "Discord's native text formatting is limited to basic markdown, and finding fonts that work in Discord can be challenging. Our Discord font generator provides instant access to multiple Unicode font styles that are fully compatible with Discord's platform. Whether you're naming your Discord server, creating channel titles, or designing role names, our tool transforms any text into Discord-compatible fonts instantly—ensuring your community stands out and your text displays correctly across all Discord features. Explore more with our <a href=\"/font-generator\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">font generator</a>."
      }
    ]
  },
  'old-english': {
    "title": "Why Use an Old English Font Generator?",
    "content": [
      {
        "title": "What is Old English Font?",
        "text": "Old English fonts, also known as blackletter or gothic script, feature ornate, medieval letterforms that originated in medieval Europe. These historic typefaces are characterized by their dense, angular strokes, intricate details, and traditional appearance. Old English fonts create an authentic medieval aesthetic, making them perfect for historical reenactments, traditional pubs, literary publications, and projects that need that classic, timeless British feel. For similar traditional styles, check out our <a href=\"/font-generator/gothic\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">gothic font generator</a> or <a href=\"/font-generator/tattoo\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">tattoo font generator</a>."
      },
      {
        "title": "Why Generate Old English Text Online?",
        "text": "Creating authentic Old English typography requires specialized knowledge of historical letterforms and expensive design software. Our Old English font generator provides instant access to classic blackletter styles using Unicode Mathematical Fraktur characters. Whether you're designing pub signs, creating historical event materials, or developing traditional branding, our tool transforms any text into authentic-looking Old English style in seconds—perfect for projects that need that classic, medieval aesthetic. Browse more styles with our <a href=\"/font-generator\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">font generator</a>."
      }
    ]
  },
  '3d': {
    "title": "Why Use a 3D Font Generator?",
    "content": [
      {
        "title": "What is 3D Font?",
        "text": "3D fonts use Unicode characters with bold, dimensional styling that creates a three-dimensional appearance. These typefaces feature thick strokes and visual depth, making text appear to pop off the page or screen. 3D fonts are characterized by their modern, dimensional look, making them perfect for video game titles, architectural visualizations, 3D design projects, and any content that needs that contemporary, depth-filled aesthetic. For more bold styles, try our <a href=\"/font-generator/bold\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">bold font generator</a> or <a href=\"/font-generator/cool\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">cool font generator</a>."
      },
      {
        "title": "Why Generate 3D Text Online?",
        "text": "Creating true 3D text requires expensive 3D modeling software and specialized skills. Our 3D font generator provides instant access to dimensional Unicode styles that create that 3D-like appearance. Whether you're designing game titles, creating architectural presentations, or developing modern branding, our tool transforms any text into bold 3D-style fonts instantly—adding that depth and dimension to your projects without the complexity of 3D software. Discover more with our <a href=\"/font-generator\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">font generator</a>."
      }
    ]
  },
  'minecraft': {
    "title": "Why Use a Minecraft Font Generator?",
    "content": [
      {
        "title": "What is Minecraft Font?",
        "text": "Minecraft fonts feature that distinctive pixelated, blocky aesthetic associated with Minecraft's iconic visual style. These typefaces use Unicode characters that create that recognizable Minecraft look with square, pixelated letterforms. Minecraft fonts are characterized by their playful, blocky appearance, making them perfect for Minecraft content creators, gaming streamers, server owners, and projects that need that distinctive Minecraft aesthetic. For similar gaming styles, check out our <a href=\"/font-generator/3d\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">3D font generator</a> or <a href=\"/font-generator/cool\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">cool font generator</a>."
      },
      {
        "title": "Why Generate Minecraft Text Online?",
        "text": "Creating Minecraft-style text for YouTube thumbnails, server branding, or gaming content typically requires design software and font installation. Our Minecraft font generator provides instant access to pixelated, blocky text styles that capture that iconic Minecraft feel. Whether you're creating YouTube content, designing server websites, or developing Minecraft-themed materials, our tool transforms any text into authentic-looking Minecraft style instantly—bringing that blocky, pixelated aesthetic to your projects. Explore more with our <a href=\"/font-generator\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">font generator</a>."
      }
    ]
  },
  'bubble': {
    "title": "Why Use a Bubble Font Generator?",
    "content": [
      {
        "title": "What is Bubble Font?",
        "text": "Bubble fonts feature rounded, playful letterforms that create a soft, friendly appearance. These cheerful typefaces use bold, rounded Unicode styles that look like bubbles or balloons. Bubble fonts are characterized by their fun, approachable aesthetic, making them perfect for children's content, casual brands, party decorations, and projects that need a lighthearted, friendly feel. For similar playful styles, try our <a href=\"/font-generator/disney\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">Disney font generator</a> or <a href=\"/font-generator/cursive\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">cursive font generator</a>."
      },
      {
        "title": "Why Generate Bubble Text Online?",
        "text": "Creating playful bubble text for children's books, party materials, or casual content typically requires design software and font selection. Our bubble font generator provides instant access to rounded, friendly text styles that capture that fun bubble aesthetic. Whether you're designing children's materials, creating party decorations, or developing casual brand content, our tool transforms any text into cheerful bubble style instantly—adding that playful, approachable touch to your projects. Browse more styles with our <a href=\"/font-generator\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">font generator</a>."
      }
    ]
  },
  'star-wars': {
    "title": "Why Use a Star Wars Font Generator?",
    "content": [
      {
        "title": "What is Star Wars Font?",
        "text": "Star Wars fonts capture that iconic, futuristic aesthetic associated with the Star Wars universe. These distinctive typefaces feature angular, sci-fi letterforms that create that epic, space-age feel. Star Wars fonts are characterized by their bold, futuristic appearance, making them perfect for Star Wars fans, sci-fi content creators, gaming communities, and projects that need that legendary, space-themed aesthetic. For similar futuristic styles, check out our <a href=\"/font-generator/3d\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">3D font generator</a> or <a href=\"/font-generator/cool\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">cool font generator</a>."
      },
      {
        "title": "Why Generate Star Wars Text Online?",
        "text": "Creating authentic Star Wars-style text for fan content, cosplay props, or themed events typically requires expensive fonts and design software. Our Star Wars font generator provides instant access to futuristic, sci-fi text styles that capture that iconic Star Wars feel. Whether you're creating fan content, designing gaming clan names, or developing space-themed materials, our tool transforms any text into epic Star Wars style instantly—bringing that legendary aesthetic to your projects. Explore more with our <a href=\"/font-generator\" class=\"text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2\">font generator</a>."
      }
    ]
  }
}

// 每个分类的独特features（改变措辞和结构，避免重复）
const uniqueFeatures = {
  'cursive': {
    "title": "Powerful Cursive Font Features",
    "items": [
      {
        "icon": "✍️",
        "iconType": "quality",
        "title": "Elegant Script Styles",
        "desc": "Access multiple flowing cursive styles that create beautiful handwritten effects for your text."
      },
      {
        "icon": "🔒",
        "iconType": "privacy",
        "title": "100% Private Processing",
        "desc": "Your text is processed entirely in your browser—never uploaded, never stored, complete privacy guaranteed."
      },
      {
        "icon": "⚡",
        "iconType": "speed",
        "title": "Real-Time Preview",
        "desc": "See your cursive text transform instantly as you type, with immediate visual feedback."
      },
      {
        "icon": "📋",
        "iconType": "batch",
        "title": "One-Click Copy",
        "desc": "Copy your styled cursive text instantly and paste it into any application or platform."
      },
      {
        "icon": "💎",
        "iconType": "free",
        "title": "Completely Free",
        "desc": "Unlimited cursive font generation with no costs, subscriptions, or advertisements—ever."
      },
      {
        "icon": "🌐",
        "iconType": "browser",
        "title": "Browser-Based",
        "desc": "Works entirely in your web browser—no software installation or font downloads required."
      }
    ]
  },
  'tattoo': {
    "title": "Powerful Tattoo Font Features",
    "items": [
      {
        "icon": "🖋️",
        "iconType": "quality",
        "title": "Bold Tattoo Styles",
        "desc": "Choose from multiple edgy tattoo font styles including gothic, bold, and decorative variations."
      },
      {
        "icon": "🔒",
        "iconType": "privacy",
        "title": "Local Processing Only",
        "desc": "All font generation happens on your device—your text never leaves your computer, ensuring complete security."
      },
      {
        "icon": "⚡",
        "iconType": "speed",
        "title": "Instant Transformation",
        "desc": "Watch your text convert to tattoo style immediately with live preview as you type."
      },
      {
        "icon": "📋",
        "iconType": "batch",
        "title": "Quick Copy & Paste",
        "desc": "Copy your tattoo text with a single click and use it anywhere—social media, designs, or documents."
      },
      {
        "icon": "💎",
        "iconType": "free",
        "title": "Free Forever",
        "desc": "Generate unlimited tattoo fonts completely free—no payments, no premium features, no ads."
      },
      {
        "icon": "🌐",
        "iconType": "browser",
        "title": "No Downloads",
        "desc": "Everything runs in your browser using client-side technology—no software or fonts to install."
      }
    ]
  },
  'disney': {
    "title": "Powerful Disney Font Features",
    "items": [
      {
        "icon": "🏰",
        "iconType": "quality",
        "title": "Magical Font Styles",
        "desc": "Access multiple whimsical Disney-inspired styles that create that enchanting, playful aesthetic."
      },
      {
        "icon": "🔒",
        "iconType": "privacy",
        "title": "Secure Local Generation",
        "desc": "Font generation occurs entirely in your browser—your text stays on your device, never uploaded anywhere."
      },
      {
        "icon": "⚡",
        "iconType": "speed",
        "title": "Immediate Results",
        "desc": "Transform your text to Disney style instantly with real-time preview showing changes as you type."
      },
      {
        "icon": "📋",
        "iconType": "batch",
        "title": "Simple Copy & Paste",
        "desc": "Copy your Disney text instantly and paste it into Instagram, party invitations, or any platform."
      },
      {
        "icon": "💎",
        "iconType": "free",
        "title": "Always Free",
        "desc": "Unlimited Disney font generation with zero cost—no fees, no subscriptions, no advertisements."
      },
      {
        "icon": "🌐",
        "iconType": "browser",
        "title": "Web-Based Tool",
        "desc": "Runs completely in your browser—no downloads, installations, or font files needed."
      }
    ]
  },
  'gothic': {
    "title": "Powerful Gothic Font Features",
    "items": [
      {
        "icon": "🖤",
        "iconType": "quality",
        "title": "Classic Blackletter Styles",
        "desc": "Generate authentic gothic text with medieval blackletter styles that create dramatic, powerful effects."
      },
      {
        "icon": "🔒",
        "iconType": "privacy",
        "title": "Device-Only Processing",
        "desc": "All gothic font generation happens locally—your text remains on your device, never transmitted anywhere."
      },
      {
        "icon": "⚡",
        "iconType": "speed",
        "title": "Live Style Preview",
        "desc": "Watch your text transform into gothic style in real-time as you type, with instant visual updates."
      },
      {
        "icon": "📋",
        "iconType": "batch",
        "title": "Instant Copy",
        "desc": "Copy your gothic text immediately and paste it into band logos, game titles, or horror content."
      },
      {
        "icon": "💎",
        "iconType": "free",
        "title": "No Cost Ever",
        "desc": "Unlimited gothic font generation at no charge—completely free with no hidden fees or ads."
      },
      {
        "icon": "🌐",
        "iconType": "browser",
        "title": "Zero Installation",
        "desc": "Runs entirely in your web browser—no software, no fonts, no downloads needed."
      }
    ]
  },
  'fancy': {
    "title": "Powerful Fancy Font Features",
    "items": [
      {
        "icon": "💎",
        "iconType": "quality",
        "title": "Decorative Unicode Styles",
        "desc": "Access elegant fancy fonts including double-struck, circled, squared, and parenthesized variations."
      },
      {
        "icon": "🔒",
        "iconType": "privacy",
        "title": "Complete Data Privacy",
        "desc": "Font generation occurs completely in your browser—your text never leaves your device, ensuring total privacy."
      },
      {
        "icon": "⚡",
        "iconType": "speed",
        "title": "Instant Style Application",
        "desc": "See your text transform to fancy style immediately with live preview updating as you type."
      },
      {
        "icon": "📋",
        "iconType": "batch",
        "title": "Effortless Copy",
        "desc": "Copy your fancy text with one click and paste it into luxury branding, invitations, or premium materials."
      },
      {
        "icon": "💎",
        "iconType": "free",
        "title": "Free Unlimited Use",
        "desc": "Generate unlimited fancy fonts without any cost—no subscriptions, no premium tiers, no advertisements."
      },
      {
        "icon": "🌐",
        "iconType": "browser",
        "title": "No Setup Required",
        "desc": "Operates entirely within your browser—no software installation or font file downloads necessary."
      }
    ]
  },
  'bold': {
    "title": "Powerful Bold Font Features",
    "items": [
      {
        "icon": "🔲",
        "iconType": "quality",
        "title": "Unicode Bold Characters",
        "desc": "Generate bold text using Unicode Mathematical Bold symbols that work everywhere, even without CSS."
      },
      {
        "icon": "🔒",
        "iconType": "privacy",
        "title": "Browser-Only Processing",
        "desc": "All bold font generation happens in your browser—your text stays local, never uploaded to servers."
      },
      {
        "icon": "⚡",
        "iconType": "speed",
        "title": "Immediate Bold Conversion",
        "desc": "Transform your text to bold style instantly with real-time preview showing changes immediately."
      },
      {
        "icon": "📋",
        "iconType": "batch",
        "title": "Fast Copy & Paste",
        "desc": "Copy your bold text instantly and paste it into headlines, social media, or marketing materials."
      },
      {
        "icon": "💎",
        "iconType": "free",
        "title": "Free Forever",
        "desc": "Unlimited bold font generation completely free—no charges, no subscriptions, no advertisements."
      },
      {
        "icon": "🌐",
        "iconType": "browser",
        "title": "No Installation",
        "desc": "Works completely in your browser—no software downloads or font installations required."
      }
    ]
  },
  'cool': {
    "title": "Powerful Cool Font Features",
    "items": [
      {
        "icon": "⭐",
        "iconType": "quality",
        "title": "Modern Font Styles",
        "desc": "Access trendy cool fonts including bold, sans-serif, and monospace styles for contemporary aesthetics."
      },
      {
        "icon": "🔒",
        "iconType": "privacy",
        "title": "Local Browser Processing",
        "desc": "Font generation happens entirely on your device—your text is never sent to any server."
      },
      {
        "icon": "⚡",
        "iconType": "speed",
        "title": "Real-Time Style Updates",
        "desc": "Watch your text change to cool style instantly with live preview as you type."
      },
      {
        "icon": "📋",
        "iconType": "batch",
        "title": "Easy Copy",
        "desc": "Copy your cool text quickly and paste it into streetwear designs, tech branding, or gaming content."
      },
      {
        "icon": "💎",
        "iconType": "free",
        "title": "Totally Free",
        "desc": "Generate unlimited cool fonts for free—no payments, no premium features, no ads ever."
      },
      {
        "icon": "🌐",
        "iconType": "browser",
        "title": "Browser-Only",
        "desc": "Runs entirely in your web browser—no software or font files to download or install."
      }
    ]
  },
  'instagram': {
    "title": "Powerful Instagram Font Features",
    "items": [
      {
        "icon": "📱",
        "iconType": "quality",
        "title": "Instagram-Compatible Styles",
        "desc": "Generate fonts that work perfectly on Instagram bios, posts, stories, and captions."
      },
      {
        "icon": "🔒",
        "iconType": "privacy",
        "title": "Private Generation",
        "desc": "All font generation happens locally in your browser—your text never leaves your device."
      },
      {
        "icon": "⚡",
        "iconType": "speed",
        "title": "Instant Instagram Text",
        "desc": "Transform your text to Instagram-compatible fonts instantly with real-time preview."
      },
      {
        "icon": "📋",
        "iconType": "batch",
        "title": "Quick Copy for Instagram",
        "desc": "Copy your Instagram text immediately and paste it directly into your Instagram profile or posts."
      },
      {
        "icon": "💎",
        "iconType": "free",
        "title": "Free Instagram Fonts",
        "desc": "Unlimited Instagram font generation completely free—no cost, no subscriptions, no ads."
      },
      {
        "icon": "🌐",
        "iconType": "browser",
        "title": "No App Needed",
        "desc": "Works entirely in your browser—no Instagram app modifications or downloads required."
      }
    ]
  },
  'italic': {
    "title": "Powerful Italic Font Features",
    "items": [
      {
        "icon": "ℹ️",
        "iconType": "quality",
        "title": "Unicode Italic Characters",
        "desc": "Generate italic text using Unicode Mathematical Italic symbols that work across all platforms."
      },
      {
        "icon": "🔒",
        "iconType": "privacy",
        "title": "Secure Local Processing",
        "desc": "Font generation occurs entirely in your browser—your text remains private and secure."
      },
      {
        "icon": "⚡",
        "iconType": "speed",
        "title": "Instant Italic Conversion",
        "desc": "See your text transform to italic style immediately with live preview updating in real-time."
      },
      {
        "icon": "📋",
        "iconType": "batch",
        "title": "Simple Copy",
        "desc": "Copy your italic text instantly and paste it into documents, emails, or academic papers."
      },
      {
        "icon": "💎",
        "iconType": "free",
        "title": "Completely Free",
        "desc": "Unlimited italic font generation at no cost—free forever with no hidden charges."
      },
      {
        "icon": "🌐",
        "iconType": "browser",
        "title": "No Downloads",
        "desc": "Operates entirely in your browser—no software installation or font downloads needed."
      }
    ]
  },
  'calligraphy': {
    "title": "Powerful Calligraphy Font Features",
    "items": [
      {
        "icon": "🖋️",
        "iconType": "quality",
        "title": "Elegant Handwritten Styles",
        "desc": "Access beautiful calligraphy fonts with decorative flourishes and ornamental elements."
      },
      {
        "icon": "🔒",
        "iconType": "privacy",
        "title": "Private Font Generation",
        "desc": "All calligraphy font generation happens locally—your text never leaves your device."
      },
      {
        "icon": "⚡",
        "iconType": "speed",
        "title": "Immediate Calligraphy Text",
        "desc": "Transform your text to calligraphy style instantly with real-time preview as you type."
      },
      {
        "icon": "📋",
        "iconType": "batch",
        "title": "Copy Calligraphy Text",
        "desc": "Copy your calligraphy text instantly and paste it into invitations, certificates, or formal documents."
      },
      {
        "icon": "💎",
        "iconType": "free",
        "title": "Free Calligraphy Fonts",
        "desc": "Unlimited calligraphy font generation completely free—no fees, no subscriptions, no ads."
      },
      {
        "icon": "🌐",
        "iconType": "browser",
        "title": "Browser-Based",
        "desc": "Runs completely in your browser—no software or calligraphy font downloads required."
      }
    ]
  },
  'discord': {
    "title": "Powerful Discord Font Features",
    "items": [
      {
        "icon": "💬",
        "iconType": "quality",
        "title": "Discord-Compatible Styles",
        "desc": "Generate fonts that display correctly in Discord server names, channels, and chat messages."
      },
      {
        "icon": "🔒",
        "iconType": "privacy",
        "title": "Local Processing",
        "desc": "Font generation happens entirely in your browser—your text stays on your device."
      },
      {
        "icon": "⚡",
        "iconType": "speed",
        "title": "Instant Discord Text",
        "desc": "Transform your text to Discord-compatible fonts instantly with live preview."
      },
      {
        "icon": "📋",
        "iconType": "batch",
        "title": "Copy for Discord",
        "desc": "Copy your Discord text immediately and paste it into server names, channels, or chat."
      },
      {
        "icon": "💎",
        "iconType": "free",
        "title": "Free Discord Fonts",
        "desc": "Unlimited Discord font generation completely free—no cost, no premium features, no ads."
      },
      {
        "icon": "🌐",
        "iconType": "browser",
        "title": "No Discord Mods",
        "desc": "Works entirely in your browser—no Discord modifications or bot installations needed."
      }
    ]
  },
  'old-english': {
    "title": "Powerful Old English Font Features",
    "items": [
      {
        "icon": "📜",
        "iconType": "quality",
        "title": "Classic Blackletter Styles",
        "desc": "Generate authentic Old English text with traditional blackletter and medieval styles."
      },
      {
        "icon": "🔒",
        "iconType": "privacy",
        "title": "Device-Only Generation",
        "desc": "All Old English font generation happens locally—your text never leaves your computer."
      },
      {
        "icon": "⚡",
        "iconType": "speed",
        "title": "Instant Old English Text",
        "desc": "Watch your text transform to Old English style immediately with real-time preview."
      },
      {
        "icon": "📋",
        "iconType": "batch",
        "title": "Copy Old English Text",
        "desc": "Copy your Old English text instantly and paste it into pub signs, historical materials, or traditional branding."
      },
      {
        "icon": "💎",
        "iconType": "free",
        "title": "Free Forever",
        "desc": "Unlimited Old English font generation completely free—no charges, no subscriptions, no ads."
      },
      {
        "icon": "🌐",
        "iconType": "browser",
        "title": "No Installation",
        "desc": "Runs entirely in your browser—no software or Old English font downloads required."
      }
    ]
  },
  '3d': {
    "title": "Powerful 3D Font Features",
    "items": [
      {
        "icon": "🎨",
        "iconType": "quality",
        "title": "Dimensional Font Styles",
        "desc": "Generate 3D-style fonts with bold, dimensional Unicode characters that create depth."
      },
      {
        "icon": "🔒",
        "iconType": "privacy",
        "title": "Local Browser Processing",
        "desc": "Font generation occurs entirely in your browser—your text stays private on your device."
      },
      {
        "icon": "⚡",
        "iconType": "speed",
        "title": "Instant 3D Conversion",
        "desc": "Transform your text to 3D style instantly with real-time preview showing dimensional effects."
      },
      {
        "icon": "📋",
        "iconType": "batch",
        "title": "Copy 3D Text",
        "desc": "Copy your 3D-style text instantly and paste it into game titles, presentations, or 3D projects."
      },
      {
        "icon": "💎",
        "iconType": "free",
        "title": "Free 3D Fonts",
        "desc": "Unlimited 3D font generation completely free—no cost, no premium tiers, no advertisements."
      },
      {
        "icon": "🌐",
        "iconType": "browser",
        "title": "No 3D Software",
        "desc": "Works entirely in your browser—no 3D modeling software or complex installations needed."
      }
    ]
  },
  'minecraft': {
    "title": "Powerful Minecraft Font Features",
    "items": [
      {
        "icon": "⛏️",
        "iconType": "quality",
        "title": "Pixelated Blocky Styles",
        "desc": "Generate Minecraft-style fonts with that distinctive pixelated, blocky aesthetic."
      },
      {
        "icon": "🔒",
        "iconType": "privacy",
        "title": "Private Generation",
        "desc": "All Minecraft font generation happens locally—your text never leaves your device."
      },
      {
        "icon": "⚡",
        "iconType": "speed",
        "title": "Instant Minecraft Text",
        "desc": "Transform your text to Minecraft style instantly with real-time preview showing blocky effects."
      },
      {
        "icon": "📋",
        "iconType": "batch",
        "title": "Copy Minecraft Text",
        "desc": "Copy your Minecraft-style text instantly and paste it into YouTube thumbnails, server branding, or gaming content."
      },
      {
        "icon": "💎",
        "iconType": "free",
        "title": "Free Minecraft Fonts",
        "desc": "Unlimited Minecraft font generation completely free—no payments, no subscriptions, no ads."
      },
      {
        "icon": "🌐",
        "iconType": "browser",
        "title": "No Mods Needed",
        "desc": "Runs entirely in your browser—no Minecraft mods or font installations required."
      }
    ]
  },
  'bubble': {
    "title": "Powerful Bubble Font Features",
    "items": [
      {
        "icon": "🎈",
        "iconType": "quality",
        "title": "Playful Rounded Styles",
        "desc": "Generate fun bubble fonts with rounded, friendly letterforms that create a cheerful appearance."
      },
      {
        "icon": "🔒",
        "iconType": "privacy",
        "title": "Secure Local Processing",
        "desc": "Font generation happens entirely in your browser—your text remains private and secure."
      },
      {
        "icon": "⚡",
        "iconType": "speed",
        "title": "Instant Bubble Text",
        "desc": "Watch your text transform to bubble style immediately with live preview as you type."
      },
      {
        "icon": "📋",
        "iconType": "batch",
        "title": "Copy Bubble Text",
        "desc": "Copy your bubble text instantly and paste it into children's content, party decorations, or casual branding."
      },
      {
        "icon": "💎",
        "iconType": "free",
        "title": "Free Bubble Fonts",
        "desc": "Unlimited bubble font generation completely free—no fees, no subscriptions, no advertisements."
      },
      {
        "icon": "🌐",
        "iconType": "browser",
        "title": "Browser-Only",
        "desc": "Works entirely in your browser—no software downloads or bubble font installations needed."
      }
    ]
  },
  'star-wars': {
    "title": "Powerful Star Wars Font Features",
    "items": [
      {
        "icon": "⭐",
        "iconType": "quality",
        "title": "Futuristic Sci-Fi Styles",
        "desc": "Generate Star Wars-style fonts with angular, futuristic letterforms that create that epic space aesthetic."
      },
      {
        "icon": "🔒",
        "iconType": "privacy",
        "title": "Local Processing Only",
        "desc": "All Star Wars font generation happens on your device—your text never leaves your computer."
      },
      {
        "icon": "⚡",
        "iconType": "speed",
        "title": "Instant Star Wars Text",
        "desc": "Transform your text to Star Wars style instantly with real-time preview showing futuristic effects."
      },
      {
        "icon": "📋",
        "iconType": "batch",
        "title": "Copy Star Wars Text",
        "desc": "Copy your Star Wars-style text instantly and paste it into fan content, gaming clans, or sci-fi projects."
      },
      {
        "icon": "💎",
        "iconType": "free",
        "title": "Free Star Wars Fonts",
        "desc": "Unlimited Star Wars font generation completely free—no cost, no premium features, no ads."
      },
      {
        "icon": "🌐",
        "iconType": "browser",
        "title": "No Downloads",
        "desc": "Runs entirely in your browser—no software or Star Wars font downloads required."
      }
    ]
  }
}

// 每个分类的独特howToUse（具体化动词和名词）
const uniqueHowToUse = {
  'cursive': {
    "title": "How to Generate Cursive Fonts",
    "steps": [
      {
        "title": "Enter Your Text",
        "desc": "Type the text you want to convert into elegant cursive style in the input field above."
      },
      {
        "title": "Choose Cursive Style",
        "desc": "Browse through available cursive font styles and preview how your text looks in each elegant script variation."
      },
      {
        "title": "Copy Your Cursive Text",
        "desc": "Click the copy button to copy your styled cursive text, then paste it into wedding invitations, Instagram bios, or any document."
      }
    ]
  },
  'tattoo': {
    "title": "How to Generate Tattoo Fonts",
    "steps": [
      {
        "title": "Type Your Text",
        "desc": "Enter the name, quote, or phrase you want to transform into bold tattoo style in the input field above."
      },
      {
        "title": "Select Tattoo Style",
        "desc": "Explore different tattoo font styles including gothic, bold, and decorative options. Preview each style to find the perfect match for your design."
      },
      {
        "title": "Copy Tattoo Text",
        "desc": "Click copy to get your tattoo-style text, then paste it into design software, social media, or share with your tattoo artist."
      }
    ]
  },
  'disney': {
    "title": "How to Generate Disney Fonts",
    "steps": [
      {
        "title": "Type Your Text",
        "desc": "Enter the text you want to transform into magical Disney style in the input field above."
      },
      {
        "title": "Pick Disney Style",
        "desc": "Browse through cute, playful Disney-inspired font styles and see how your text looks in each whimsical variation."
      },
      {
        "title": "Copy Disney Text",
        "desc": "Click the copy button to copy your Disney-style text, then paste it into party invitations, social media posts, or children's content."
      }
    ]
  },
  'gothic': {
    "title": "How to Generate Gothic Fonts",
    "steps": [
      {
        "title": "Enter Your Text",
        "desc": "Type the text you want to convert into dramatic gothic style in the input field above."
      },
      {
        "title": "Choose Gothic Style",
        "desc": "Select from classic blackletter gothic font styles and preview how your text looks in each medieval variation."
      },
      {
        "title": "Copy Gothic Text",
        "desc": "Click copy to get your gothic-style text, then paste it into band logos, game titles, or horror content."
      }
    ]
  },
  'fancy': {
    "title": "How to Generate Fancy Fonts",
    "steps": [
      {
        "title": "Type Your Text",
        "desc": "Enter the text you want to transform into elegant fancy style in the input field above."
      },
      {
        "title": "Select Fancy Style",
        "desc": "Choose from decorative fancy font styles including double-struck, circled, and squared variations. Preview each style to see the elegant effect."
      },
      {
        "title": "Copy Fancy Text",
        "desc": "Click the copy button to copy your fancy text, then paste it into luxury branding, formal invitations, or premium materials."
      }
    ]
  },
  'bold': {
    "title": "How to Generate Bold Fonts",
    "steps": [
      {
        "title": "Enter Your Text",
        "desc": "Type the text you want to convert into bold style in the input field above."
      },
      {
        "title": "Choose Bold Style",
        "desc": "Select from Unicode bold font styles and preview how your text looks with that strong, impactful appearance."
      },
      {
        "title": "Copy Bold Text",
        "desc": "Click copy to get your bold text, then paste it into headlines, social media bios, or marketing materials."
      }
    ]
  },
  'cool': {
    "title": "How to Generate Cool Fonts",
    "steps": [
      {
        "title": "Type Your Text",
        "desc": "Enter the text you want to transform into modern cool style in the input field above."
      },
      {
        "title": "Pick Cool Style",
        "desc": "Browse through trendy cool font styles and preview how your text looks in each contemporary variation."
      },
      {
        "title": "Copy Cool Text",
        "desc": "Click the copy button to copy your cool text, then paste it into streetwear designs, tech branding, or gaming content."
      }
    ]
  },
  'instagram': {
    "title": "How to Generate Instagram Fonts",
    "steps": [
      {
        "title": "Type Your Text",
        "desc": "Enter the text you want to convert into Instagram-compatible style in the input field above."
      },
      {
        "title": "Select Instagram Style",
        "desc": "Choose from Instagram-compatible font styles and preview how your text will look on Instagram."
      },
      {
        "title": "Copy Instagram Text",
        "desc": "Click copy to get your Instagram text, then paste it directly into your Instagram bio, posts, stories, or captions."
      }
    ]
  },
  'italic': {
    "title": "How to Generate Italic Fonts",
    "steps": [
      {
        "title": "Enter Your Text",
        "desc": "Type the text you want to convert into italic style in the input field above."
      },
      {
        "title": "Choose Italic Style",
        "desc": "Select from Unicode italic font styles and preview how your text looks with that slanted, emphasized appearance."
      },
      {
        "title": "Copy Italic Text",
        "desc": "Click copy to get your italic text, then paste it into documents, emails, or academic papers for emphasis."
      }
    ]
  },
  'calligraphy': {
    "title": "How to Generate Calligraphy Fonts",
    "steps": [
      {
        "title": "Type Your Text",
        "desc": "Enter the text you want to transform into elegant calligraphy style in the input field above."
      },
      {
        "title": "Select Calligraphy Style",
        "desc": "Choose from beautiful calligraphy font styles with decorative flourishes and preview how your text looks."
      },
      {
        "title": "Copy Calligraphy Text",
        "desc": "Click the copy button to copy your calligraphy text, then paste it into wedding invitations, certificates, or formal documents."
      }
    ]
  },
  'discord': {
    "title": "How to Generate Discord Fonts",
    "steps": [
      {
        "title": "Type Your Text",
        "desc": "Enter the text you want to convert into Discord-compatible style in the input field above."
      },
      {
        "title": "Choose Discord Style",
        "desc": "Select from Discord-compatible font styles and preview how your text will display in Discord."
      },
      {
        "title": "Copy Discord Text",
        "desc": "Click copy to get your Discord text, then paste it into server names, channel titles, or Discord chat."
      }
    ]
  },
  'old-english': {
    "title": "How to Generate Old English Fonts",
    "steps": [
      {
        "title": "Type Your Text",
        "desc": "Enter the text you want to convert into classic Old English style in the input field above."
      },
      {
        "title": "Select Old English Style",
        "desc": "Choose from traditional blackletter Old English font styles and preview how your text looks in each medieval variation."
      },
      {
        "title": "Copy Old English Text",
        "desc": "Click copy to get your Old English text, then paste it into pub signs, historical materials, or traditional branding."
      }
    ]
  },
  '3d': {
    "title": "How to Generate 3D Fonts",
    "steps": [
      {
        "title": "Type Your Text",
        "desc": "Enter the text you want to transform into 3D-style in the input field above."
      },
      {
        "title": "Choose 3D Style",
        "desc": "Select from dimensional 3D font styles and preview how your text looks with that bold, depth-filled appearance."
      },
      {
        "title": "Copy 3D Text",
        "desc": "Click the copy button to copy your 3D text, then paste it into game titles, presentations, or 3D projects."
      }
    ]
  },
  'minecraft': {
    "title": "How to Generate Minecraft Fonts",
    "steps": [
      {
        "title": "Type Your Text",
        "desc": "Enter the text you want to convert into Minecraft-style in the input field above."
      },
      {
        "title": "Select Minecraft Style",
        "desc": "Choose from pixelated, blocky Minecraft font styles and preview how your text looks with that distinctive Minecraft aesthetic."
      },
      {
        "title": "Copy Minecraft Text",
        "desc": "Click copy to get your Minecraft text, then paste it into YouTube thumbnails, server branding, or gaming content."
      }
    ]
  },
  'bubble': {
    "title": "How to Generate Bubble Fonts",
    "steps": [
      {
        "title": "Type Your Text",
        "desc": "Enter the text you want to transform into playful bubble style in the input field above."
      },
      {
        "title": "Choose Bubble Style",
        "desc": "Select from rounded, friendly bubble font styles and preview how your text looks with that cheerful appearance."
      },
      {
        "title": "Copy Bubble Text",
        "desc": "Click the copy button to copy your bubble text, then paste it into children's content, party decorations, or casual branding."
      }
    ]
  },
  'star-wars': {
    "title": "How to Generate Star Wars Fonts",
    "steps": [
      {
        "title": "Type Your Text",
        "desc": "Enter the text you want to convert into epic Star Wars style in the input field above."
      },
      {
        "title": "Select Star Wars Style",
        "desc": "Choose from futuristic Star Wars font styles and preview how your text looks with that iconic space-age aesthetic."
      },
      {
        "title": "Copy Star Wars Text",
        "desc": "Click copy to get your Star Wars text, then paste it into fan content, gaming clans, or sci-fi projects."
      }
    ]
  }
}

// 每个分类的独特comparison（改变措辞）
const uniqueComparisons = {
  'cursive': {
    "toolaze": "Unlimited cursive text generation, Multiple elegant script styles, Instant real-time preview, Browser-based processing, No character limits, Complete privacy protection, 100% free forever",
    "others": "Character limits, Limited script options, Slow server processing, Cloud uploads required, Privacy concerns, Watermarks or ads, Paid premium features"
  },
  'tattoo': {
    "toolaze": "Unlimited tattoo text generation, Multiple bold gothic styles, Instant preview, Local browser processing, No text length limits, Complete privacy, 100% free forever",
    "others": "Text length restrictions, Few style choices, Server-side delays, Required cloud uploads, Data privacy risks, Advertisements, Premium subscriptions"
  },
  'disney': {
    "toolaze": "Unlimited Disney text generation, Multiple whimsical styles, Real-time instant preview, Client-side processing, No limits, Total privacy, Forever free",
    "others": "Character restrictions, Limited Disney styles, Slow processing, Cloud uploads, Privacy issues, Watermarks, Paid features"
  },
  'gothic': {
    "toolaze": "Unlimited gothic text generation, Classic blackletter styles, Instant preview, Local processing, No limits, Complete privacy, Free forever",
    "others": "Character limits, Few gothic options, Server processing, Cloud uploads, Privacy concerns, Ads, Premium tiers"
  },
  'fancy': {
    "toolaze": "Unlimited fancy text generation, Multiple decorative styles, Real-time preview, Browser processing, No limits, Total privacy, 100% free",
    "others": "Text restrictions, Limited fancy options, Slow servers, Required uploads, Privacy risks, Watermarks, Paid features"
  },
  'bold': {
    "toolaze": "Unlimited bold text generation, Unicode bold characters, Instant preview, Local browser processing, No limits, Complete privacy, Free forever",
    "others": "Character limits, Limited bold styles, Server delays, Cloud uploads, Privacy issues, Ads, Premium subscriptions"
  },
  'cool': {
    "toolaze": "Unlimited cool text generation, Modern trendy styles, Real-time preview, Client-side processing, No limits, Total privacy, Forever free",
    "others": "Text restrictions, Few cool options, Slow processing, Cloud uploads, Privacy concerns, Watermarks, Paid tiers"
  },
  'instagram': {
    "toolaze": "Unlimited Instagram text generation, Instagram-compatible styles, Instant preview, Local processing, No limits, Complete privacy, Free forever",
    "others": "Character limits, Limited Instagram fonts, Server processing, Required uploads, Privacy risks, Ads, Premium features"
  },
  'italic': {
    "toolaze": "Unlimited italic text generation, Unicode italic characters, Real-time preview, Browser processing, No limits, Total privacy, 100% free",
    "others": "Text restrictions, Limited italic styles, Slow servers, Cloud uploads, Privacy issues, Watermarks, Paid subscriptions"
  },
  'calligraphy': {
    "toolaze": "Unlimited calligraphy text generation, Elegant handwritten styles, Instant preview, Local processing, No limits, Complete privacy, Free forever",
    "others": "Character limits, Few calligraphy options, Server delays, Required uploads, Privacy concerns, Ads, Premium tiers"
  },
  'discord': {
    "toolaze": "Unlimited Discord text generation, Discord-compatible styles, Real-time preview, Client-side processing, No limits, Total privacy, Forever free",
    "others": "Text restrictions, Limited Discord fonts, Slow processing, Cloud uploads, Privacy risks, Watermarks, Paid features"
  },
  'old-english': {
    "toolaze": "Unlimited Old English text generation, Classic blackletter styles, Instant preview, Local browser processing, No limits, Complete privacy, Free forever",
    "others": "Character limits, Few Old English options, Server processing, Required uploads, Privacy issues, Ads, Premium subscriptions"
  },
  '3d': {
    "toolaze": "Unlimited 3D text generation, Dimensional font styles, Real-time preview, Browser processing, No limits, Total privacy, 100% free",
    "others": "Text restrictions, Limited 3D styles, Slow servers, Cloud uploads, Privacy concerns, Watermarks, Paid tiers"
  },
  'minecraft': {
    "toolaze": "Unlimited Minecraft text generation, Pixelated blocky styles, Instant preview, Local processing, No limits, Complete privacy, Free forever",
    "others": "Character limits, Few Minecraft options, Server delays, Required uploads, Privacy risks, Ads, Premium features"
  },
  'bubble': {
    "toolaze": "Unlimited bubble text generation, Playful rounded styles, Real-time preview, Client-side processing, No limits, Total privacy, Forever free",
    "others": "Text restrictions, Limited bubble fonts, Slow processing, Cloud uploads, Privacy issues, Watermarks, Paid subscriptions"
  },
  'star-wars': {
    "toolaze": "Unlimited Star Wars text generation, Futuristic sci-fi styles, Instant preview, Local browser processing, No limits, Complete privacy, Free forever",
    "others": "Character limits, Few Star Wars options, Server processing, Required uploads, Privacy concerns, Ads, Premium tiers"
  }
}

// 生成每个分类的 JSON 内容
categories.forEach(category => {
  const scenes = uniqueScenes[category.slug] || [
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
  ]

  const faq = uniqueFAQs[category.slug] || [
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
      "a": `Yes, there are no character limits. You can generate ${category.name.toLowerCase()} text for sentences, paragraphs, or even entire documents. The generator processes your text instantly regardless of length.`
    },
    {
      "q": `Will my ${category.name.toLowerCase()} text work on all platforms?`,
      "a": `The ${category.name.toLowerCase()} text generated by Toolaze uses Unicode characters that are widely supported across platforms including Instagram, Facebook, Twitter, TikTok, Discord, WhatsApp, and most modern applications. However, some older platforms or applications may not display all Unicode characters correctly.`
    }
  ]

  const intro = uniqueIntros[category.slug] || {
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
  }

  const features = uniqueFeatures[category.slug] || {
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
  }

  const howToUse = uniqueHowToUse[category.slug] || {
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
  }

  const comparison = uniqueComparisons[category.slug] || {
    "toolaze": "Unlimited text length, Multiple ${category.name.toLowerCase()} styles, Instant preview, Real-time generation, 100% local processing, No uploads, Free forever",
    "others": "Character limits, Limited styles, Slow processing, Server uploads required, Cloud queues, Privacy concerns, Paid upgrades"
  }

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
    "intro": intro,
    "features": features,
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
    "howToUse": howToUse,
    "comparison": comparison,
    "scenes": scenes,
    "rating": {
      "text": `"The best ${category.name.toLowerCase()} font generator I've found. Instant results and works perfectly on Instagram!" - Join thousands of users who trust Toolaze for beautiful ${category.name.toLowerCase()} text generation.`
    },
    "faq": faq,
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

console.log(`\n✅ 已为 ${categories.length} 个分类创建 L3 页面 JSON 文件（带独特场景和FAQ）`)
