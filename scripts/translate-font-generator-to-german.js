const fs = require('fs')
const path = require('path')

// 德语翻译映射（关键词和常用表达）
const translations = {
  // 基础术语
  'Font Generator': 'Schriftgenerator',
  'font generator': 'Schriftgenerator',
  'font': 'Schrift',
  'fonts': 'Schriften',
  'text': 'Text',
  'style': 'Stil',
  'styles': 'Stile',
  
  // 字体类型
  'cursive': 'kursiv',
  'fancy': 'verschönert',
  'bold': 'fett',
  'italic': 'kursiv',
  'gothic': 'gotisch',
  'tattoo': 'Tattoo',
  'calligraphy': 'Kalligrafie',
  'old english': 'Altenglisch',
  '3D': '3D',
  'minecraft': 'Minecraft',
  'disney': 'Disney',
  'bubble': 'Blase',
  'star wars': 'Star Wars',
  'cool': 'cool',
  'instagram': 'Instagram',
  'discord': 'Discord',
  
  // 常用动词和短语
  'Generate': 'Generieren',
  'generate': 'generieren',
  'Create': 'Erstellen',
  'create': 'erstellen',
  'Copy and paste': 'Kopieren und einfügen',
  'copy and paste': 'kopieren und einfügen',
  'Copy': 'Kopieren',
  'copy': 'kopieren',
  'Paste': 'Einfügen',
  'paste': 'einfügen',
  'Type your text': 'Geben Sie Ihren Text ein',
  'type your text': 'geben Sie Ihren Text ein',
  'Select': 'Wählen',
  'select': 'wählen',
  'Choose': 'Wählen',
  'choose': 'wählen',
  'Preview': 'Vorschau',
  'preview': 'Vorschau',
  
  // 描述性词汇
  'beautiful': 'schön',
  'elegant': 'elegant',
  'custom': 'benutzerdefiniert',
  'online': 'online',
  'free': 'kostenlos',
  'instant': 'sofort',
  'instantly': 'sofort',
  'real-time': 'Echtzeit',
  'private': 'privat',
  'secure': 'sicher',
  'local': 'lokal',
  'browser': 'Browser',
  'Unicode': 'Unicode',
  'characters': 'Zeichen',
  
  // 平台名称（保持英文）
  'Instagram': 'Instagram',
  'Facebook': 'Facebook',
  'Twitter': 'Twitter',
  'TikTok': 'TikTok',
  'Discord': 'Discord',
  'WhatsApp': 'WhatsApp',
  
  // 功能描述
  'No sign-up required': 'Keine Anmeldung erforderlich',
  'No installation needed': 'Keine Installation erforderlich',
  '100% free': '100% kostenlos',
  'Unlimited': 'Unbegrenzt',
  'unlimited': 'unbegrenzt',
}

// 翻译函数 - 处理完整句子和段落
function translateToGerman(text) {
  if (!text) return text
  
  let translated = text
  
  // 翻译常见短语和句子
  const phraseTranslations = {
    // 标题和描述
    'Free Font Generator - Create Custom Fonts Online | Toolaze': 
      'Kostenloser Schriftgenerator - Erstellen Sie benutzerdefinierte Schriften online | Toolaze',
    'Generate custom fonts online for free. Create cursive, fancy, bold, italic, gothic, and tattoo fonts. Copy and paste instantly. No sign-up required.':
      'Generieren Sie kostenlos benutzerdefinierte Schriften online. Erstellen Sie kursive, verschönerte, fette, kursive, gotische und Tattoo-Schriften. Sofort kopieren und einfügen. Keine Anmeldung erforderlich.',
    
    // 常见问题
    'What is a Font Generator?': 'Was ist ein Schriftgenerator?',
    'Why Use Toolaze Font Generator?': 'Warum Toolaze Schriftgenerator verwenden?',
    'Why Generate Fonts Online?': 'Warum Schriften online generieren?',
    'How to Use Toolaze Font Generator': 'Wie verwende ich den Toolaze Schriftgenerator',
    'How to Generate': 'Wie generiere ich',
    'Fonts': 'Schriften',
    
    // 功能特性
    'Multiple Font Styles': 'Mehrere Schriftstile',
    'Complete Privacy Protection': 'Vollständiger Datenschutz',
    'Instant Generation': 'Sofortige Generierung',
    'Easy Copy & Paste': 'Einfaches Kopieren & Einfügen',
    'Zero Cost Forever': 'Für immer kostenlos',
    'No Installation Needed': 'Keine Installation erforderlich',
    'Powerful Font Generator Features': 'Leistungsstarke Schriftgenerator-Funktionen',
    'Powerful': 'Leistungsstarke',
    'Features': 'Funktionen',
    
    // Features描述
    'Generate beautiful text with multiple font styles including cursive, fancy, bold, italic, gothic, tattoo, calligraphy, old english, 3D, and more.':
      'Generieren Sie schöne Texte mit mehreren Schriftstilen, einschließlich kursiv, verschönert, fett, kursiv, gotisch, Tattoo, Kalligrafie, Altenglisch, 3D und mehr.',
    'All font generation happens locally in your browser—your text never leaves your device, ensuring absolute data security.':
      'Die gesamte Schriftgenerierung erfolgt lokal in Ihrem Browser—Ihr Text verlässt niemals Ihr Gerät und gewährleistet absolute Datensicherheit.',
    'Transform your text into styled fonts instantly with real-time preview—no waiting, no delays.':
      'Wandeln Sie Ihren Text sofort in formatierte Schriften um, mit Echtzeit-Vorschau—kein Warten, keine Verzögerungen.',
    'Copy your styled text with one click and paste it directly into Instagram, Facebook, Twitter, TikTok, Discord, or any platform.':
      'Kopieren Sie Ihren formatierten Text mit einem Klick und fügen Sie ihn direkt in Instagram, Facebook, Twitter, TikTok, Discord oder jede andere Plattform ein.',
    'Enjoy unlimited font generation completely free—no subscriptions, no hidden fees, no advertisements ever.':
      'Genießen Sie unbegrenzte Schriftgenerierung völlig kostenlos—keine Abonnements, keine versteckten Gebühren, keine Werbung.',
    'Everything runs directly in your web browser using client-side technology—no software downloads or font installations required.':
      'Alles läuft direkt in Ihrem Webbrowser mit clientseitiger Technologie—keine Software-Downloads oder Schriftinstallationen erforderlich.',
    
    // 技术规格
    'Technical Specifications': 'Technische Spezifikationen',
    'Font Styles': 'Schriftstile',
    'Text Length': 'Textlänge',
    'Processing Speed': 'Verarbeitungsgeschwindigkeit',
    'Output Format': 'Ausgabeformat',
    'Platform Support': 'Plattformunterstützung',
    'Processing Location': 'Verarbeitungsort',
    'Privacy': 'Datenschutz',
    'Unlimited characters': 'Unbegrenzte Zeichen',
    'Instant (Real-time preview)': 'Sofort (Echtzeit-Vorschau)',
    'Unicode text (Copy & paste ready)': 'Unicode-Text (Kopieren & Einfügen bereit)',
    'No server uploads, complete local processing': 'Keine Server-Uploads, vollständige lokale Verarbeitung',
    
    // 步骤说明
    'Type Your Text': 'Geben Sie Ihren Text ein',
    'Choose Font Style': 'Wählen Sie den Schriftstil',
    'Copy & Paste': 'Kopieren & Einfügen',
    'Enter the text you want to convert into a custom font style in the input field above.':
      'Geben Sie den Text ein, den Sie in einen benutzerdefinierten Schriftstil umwandeln möchten, in das Eingabefeld oben.',
    'Select from multiple font styles including cursive, fancy, bold, italic, gothic, tattoo, and more. Preview your text in real-time to see how it looks.':
      'Wählen Sie aus mehreren Schriftstilen, einschließlich kursiv, verschönert, fett, kursiv, gotisch, Tattoo und mehr. Vorschau Ihres Textes in Echtzeit, um zu sehen, wie er aussieht.',
    'Click the copy button to copy your styled text, then paste it anywhere—social media, documents, or design tools.':
      'Klicken Sie auf die Kopieren-Schaltfläche, um Ihren formatierten Text zu kopieren, und fügen Sie ihn dann überall ein—soziale Medien, Dokumente oder Design-Tools.',
    
    // 场景描述
    'For Social Media Users': 'Für Social-Media-Nutzer',
    'For Designers': 'Für Designer',
    'For Content Creators': 'Für Content-Ersteller',
    'Create eye-catching fonts for Instagram, Facebook, Twitter, and TikTok posts. Stand out with custom styled text that matches your brand.':
      'Erstellen Sie auffällige Schriften für Instagram, Facebook, Twitter und TikTok-Posts. Heben Sie sich mit benutzerdefiniertem formatiertem Text ab, der zu Ihrer Marke passt.',
    'Generate fonts for design projects, logos, and branding materials. Preview different styles instantly before finalizing your design.':
      'Generieren Sie Schriften für Design-Projekte, Logos und Branding-Materialien. Vorschau verschiedener Stile sofort, bevor Sie Ihr Design finalisieren.',
    'Enhance your content with custom fonts for YouTube thumbnails, blog posts, and marketing materials. Copy and paste anywhere.':
      'Verbessern Sie Ihren Content mit benutzerdefinierten Schriften für YouTube-Thumbnails, Blog-Posts und Marketing-Materialien. Kopieren und einfügen überall.',
    
    // FAQ常见问题
    'What font styles are available?': 'Welche Schriftstile sind verfügbar?',
    'Is this font generator really free?': 'Ist dieser Schriftgenerator wirklich kostenlos?',
    'Can I use these fonts on social media?': 'Kann ich diese Schriften in sozialen Medien verwenden?',
    'Are my texts uploaded to a server?': 'Werden meine Texte auf einen Server hochgeladen?',
    'Can I download font files?': 'Kann ich Schriftdateien herunterladen?',
    'Is there a character limit?': 'Gibt es ein Zeichenlimit?',
    
    // 答案
    'Yes! Toolaze is 100% free with no ads, no registration, and no hidden fees. All font generation happens in your browser.':
      'Ja! Toolaze ist zu 100% kostenlos, ohne Werbung, ohne Registrierung und ohne versteckte Gebühren. Die gesamte Schriftgenerierung erfolgt in Ihrem Browser.',
    'Yes, you can copy and paste the generated fonts to Instagram, Facebook, Twitter, TikTok, Discord, and other platforms that support Unicode characters.':
      'Ja, Sie können die generierten Schriften zu Instagram, Facebook, Twitter, TikTok, Discord und anderen Plattformen kopieren und einfügen, die Unicode-Zeichen unterstützen.',
    'No! All font generation happens locally in your browser using JavaScript. Your text never leaves your device, ensuring complete privacy.':
      'Nein! Die gesamte Schriftgenerierung erfolgt lokal in Ihrem Browser mit JavaScript. Ihr Text verlässt niemals Ihr Gerät und gewährleistet vollständige Privatsphäre.',
    'Toolaze generates styled text that you can copy and paste. We don\'t provide downloadable font files (.ttf, .otf), but you can use the generated text anywhere.':
      'Toolaze generiert formatierte Texte, die Sie kopieren und einfügen können. Wir bieten keine herunterladbaren Schriftdateien (.ttf, .otf) an, aber Sie können den generierten Text überall verwenden.',
    'No, there are no character limits. You can generate styled text for sentences, paragraphs, or even entire documents. The generator processes your text instantly regardless of length.':
      'Nein, es gibt keine Zeichenlimits. Sie können formatierte Texte für Sätze, Absätze oder sogar ganze Dokumente generieren. Der Generator verarbeitet Ihren Text sofort, unabhängig von der Länge.',
    
    // Comparison
    'Unlimited text length, Multiple font styles, Instant preview, Real-time generation, 100% local processing, No uploads, Free forever':
      'Unbegrenzte Textlänge, Mehrere Schriftstile, Sofortige Vorschau, Echtzeit-Generierung, 100% lokale Verarbeitung, Keine Uploads, Für immer kostenlos',
    'Character limits, Limited styles, Slow processing, Server uploads required, Cloud queues, Privacy concerns, Paid upgrades':
      'Zeichenlimits, Begrenzte Stile, Langsame Verarbeitung, Server-Uploads erforderlich, Cloud-Warteschlangen, Datenschutzbedenken, Bezahlte Upgrades',
    
    // Rating
    '"The best font generator I\'ve found. Instant results and works perfectly on Instagram!" - Join thousands of users who trust Toolaze for beautiful font generation.':
      '"Der beste Schriftgenerator, den ich gefunden habe. Sofortige Ergebnisse und funktioniert perfekt auf Instagram!" - Schließen Sie sich Tausenden von Benutzern an, die Toolaze für schöne Schriftgenerierung vertrauen.',
    
    // L3页面特定的功能描述
    'Access multiple flowing cursive styles that create beautiful handwritten effects for your text.':
      'Zugriff auf mehrere fließende kursive Stile, die schöne handgeschriebene Effekte für Ihren Text erzeugen.',
    'Your text is processed entirely in your browser—never uploaded, never stored, complete privacy guaranteed.':
      'Ihr Text wird vollständig in Ihrem Browser verarbeitet—niemals hochgeladen, niemals gespeichert, vollständiger Datenschutz garantiert.',
    'See your cursive text transform instantly as you type, with immediate visual feedback.':
      'Sehen Sie, wie sich Ihr kursiver Text sofort beim Tippen transformiert, mit sofortigem visuellen Feedback.',
    'Copy your styled cursive text instantly and paste it into any application or platform.':
      'Kopieren Sie Ihren formatierten kursiven Text sofort und fügen Sie ihn in jede Anwendung oder Plattform ein.',
    'Unlimited cursive font generation with no costs, subscriptions, or advertisements—ever.':
      'Unbegrenzte kursive Schriftgenerierung ohne Kosten, Abonnements oder Werbung—für immer.',
    'Works entirely in your web browser—no software installation or font downloads required.':
      'Funktioniert vollständig in Ihrem Webbrowser—keine Software-Installation oder Schrift-Downloads erforderlich.',
    
    // HowToUse步骤
    'Type the text you want to convert into elegant cursive style in the input field above.':
      'Geben Sie den Text ein, den Sie in einen eleganten kursiven Stil umwandeln möchten, in das Eingabefeld oben.',
    'Browse through available cursive font styles and preview how your text looks in each elegant script variation.':
      'Durchsuchen Sie verfügbare kursive Schriftstile und sehen Sie in der Vorschau, wie Ihr Text in jeder eleganten Schriftvariation aussieht.',
    'Click the copy button to copy your styled cursive text, then paste it into wedding invitations, Instagram bios, or any document.':
      'Klicken Sie auf die Kopieren-Schaltfläche, um Ihren formatierten kursiven Text zu kopieren, und fügen Sie ihn dann in Hochzeitseinladungen, Instagram-Bios oder jedes Dokument ein.',
    
    // Scenarios
    'Create elegant cursive text for wedding invitations, save-the-dates, and ceremony programs. Add a romantic, sophisticated touch to your special day with beautiful handwritten-style fonts.':
      'Erstellen Sie eleganten kursiven Text für Hochzeitseinladungen, Save-the-Dates und Zeremonieprogramme. Fügen Sie Ihrem besonderen Tag mit schönen handgeschriebenen Schriftstilen eine romantische, raffinierte Note hinzu.',
    'Use cursive fonts for personal Instagram bios, LinkedIn headers, and email signatures. Stand out with elegant script fonts that convey professionalism and personality.':
      'Verwenden Sie kursive Schriften für persönliche Instagram-Bios, LinkedIn-Header und E-Mail-Signaturen. Heben Sie sich mit eleganten Schriftstilen ab, die Professionalität und Persönlichkeit vermitteln.',
    'Generate cursive text for art prints, greeting cards, and design mockups. Perfect for adding a handcrafted, artistic feel to your creative projects.':
      'Generieren Sie kursiven Text für Kunstdrucke, Grußkarten und Design-Mockups. Perfekt, um Ihren kreativen Projekten ein handgemachtes, künstlerisches Gefühl zu verleihen.',
    
    // FAQ常见问题（L3特定）
    'Can I use cursive fonts for formal documents?':
      'Kann ich kursive Schriften für formelle Dokumente verwenden?',
    'Yes! Cursive fonts generated by Toolaze use Unicode characters that work in most applications. However, for very formal documents like legal papers, you may want to verify compatibility with your specific document software first.':
      'Ja! Kursive Schriften, die von Toolaze generiert werden, verwenden Unicode-Zeichen, die in den meisten Anwendungen funktionieren. Für sehr formelle Dokumente wie Rechtsdokumente sollten Sie jedoch zuerst die Kompatibilität mit Ihrer spezifischen Dokumentensoftware überprüfen.',
    'Are cursive fonts readable on all devices?':
      'Sind kursive Schriften auf allen Geräten lesbar?',
    'Cursive text uses Unicode Mathematical Script characters that are widely supported. They display well on modern devices, though some older phones or applications may render them differently. Always preview on your target platform.':
      'Kursiver Text verwendet Unicode Mathematical Script-Zeichen, die weitgehend unterstützt werden. Sie werden auf modernen Geräten gut angezeigt, obwohl einige ältere Telefone oder Anwendungen sie möglicherweise anders rendern. Vorschau immer auf Ihrer Zielplattform.',
    'Can I use cursive fonts in my email signature?':
      'Kann ich kursive Schriften in meiner E-Mail-Signatur verwenden?',
    'Yes! Cursive fonts work great in email signatures. Simply copy the generated cursive text and paste it into your email signature settings. Most email clients support Unicode characters.':
      'Ja! Kursive Schriften funktionieren hervorragend in E-Mail-Signaturen. Kopieren Sie einfach den generierten kursiven Text und fügen Sie ihn in Ihre E-Mail-Signatur-Einstellungen ein. Die meisten E-Mail-Client unterstützen Unicode-Zeichen.',
    'How do cursive fonts differ from calligraphy fonts?':
      'Wie unterscheiden sich kursive Schriften von Kalligrafie-Schriften?',
    'Cursive fonts have a flowing, connected script style, while calligraphy fonts often have more decorative flourishes. Our cursive generator focuses on elegant, readable script styles perfect for everyday use. For more decorative options, try our':
      'Kursive Schriften haben einen fließenden, verbundenen Schriftstil, während Kalligrafie-Schriften oft mehr dekorative Verzierungen haben. Unser kursiver Generator konzentriert sich auf elegante, lesbare Schriftstile, die perfekt für den täglichen Gebrauch sind. Für mehr dekorative Optionen probieren Sie unseren',
    'Will cursive fonts work in Microsoft Word?':
      'Funktionieren kursive Schriften in Microsoft Word?',
    'Yes, cursive Unicode characters work in Microsoft Word and most word processors. Simply copy and paste the generated text directly into your document.':
      'Ja, kursive Unicode-Zeichen funktionieren in Microsoft Word und den meisten Textverarbeitungsprogrammen. Kopieren Sie einfach den generierten Text direkt in Ihr Dokument.',
    
    // 更多通用翻译
    'Powerful': 'Leistungsstarke',
    'Font Features': 'Schrift-Funktionen',
    'Cursive Font Features': 'Kursive Schrift-Funktionen',
    'Fancy Font Features': 'Verschönerte Schrift-Funktionen',
    'Bold Font Features': 'Fette Schrift-Funktionen',
    'Tattoo Font Features': 'Tattoo-Schrift-Funktionen',
    'Cool Font Features': 'Coole Schrift-Funktionen',
    'Instagram Font Features': 'Instagram-Schrift-Funktionen',
    'Italic Font Features': 'Kursive Schrift-Funktionen',
    'Gothic Font Features': 'Gotische Schrift-Funktionen',
    'Calligraphy Font Features': 'Kalligrafie-Schrift-Funktionen',
    'Discord Font Features': 'Discord-Schrift-Funktionen',
    'Old English Font Features': 'Altenglische Schrift-Funktionen',
    '3D Font Features': '3D-Schrift-Funktionen',
    'Minecraft Font Features': 'Minecraft-Schrift-Funktionen',
    'Disney Font Features': 'Disney-Schrift-Funktionen',
    'Bubble Font Features': 'Blasen-Schrift-Funktionen',
    'Star Wars Font Features': 'Star Wars-Schrift-Funktionen',
    
    // 通用功能描述
    'Elegant Script Styles': 'Elegante Schriftstile',
    '100% Private Processing': '100% private Verarbeitung',
    'Real-Time Preview': 'Echtzeit-Vorschau',
    'One-Click Copy': 'Ein-Klick-Kopieren',
    'Completely Free': 'Völlig kostenlos',
    'Browser-Based': 'Browser-basiert',
    
    // 更多完整句子
    'Enter Your Text': 'Geben Sie Ihren Text ein',
    'Choose Cursive Style': 'Wählen Sie den kursiven Stil',
    'Choose Fancy Style': 'Wählen Sie den verschönerten Stil',
    'Choose Bold Style': 'Wählen Sie den fetten Stil',
    'Choose Tattoo Style': 'Wählen Sie den Tattoo-Stil',
    'Copy Your Cursive Text': 'Kopieren Sie Ihren kursiven Text',
    'Copy Your Fancy Text': 'Kopieren Sie Ihren verschönerten Text',
    'Copy Your Bold Text': 'Kopieren Sie Ihren fetten Text',
    'Copy Your Tattoo Text': 'Kopieren Sie Ihren Tattoo-Text',
    
    // 场景标题
    'Wedding Invitations': 'Hochzeitseinladungen',
    'Personal Branding': 'Persönliches Branding',
    'Art & Design Projects': 'Kunst- & Design-Projekte',
    
    // 更多FAQ问题
    'Are cursive fonts readable on all devices?': 'Sind kursive Schriften auf allen Geräten lesbar?',
    'Can I use cursive fonts in my email signature?': 'Kann ich kursive Schriften in meiner E-Mail-Signatur verwenden?',
    'How do cursive fonts differ from calligraphy fonts?': 'Wie unterscheiden sich kursive Schriften von Kalligrafie-Schriften?',
    'Will cursive fonts work in Microsoft Word?': 'Funktionieren kursive Schriften in Microsoft Word?',
    
    // 更多通用翻译模式（处理混合语言）
    'Browse through available': 'Durchsuchen Sie verfügbare',
    'and vorschau how your text looks in each': 'und sehen Sie in der Vorschau, wie Ihr Text in jeder',
    'elegant script variation': 'eleganten Schriftvariation aussieht',
    'Erstellen elegant': 'Erstellen Sie eleganten',
    'text for': 'Text für',
    'save-the-dates': 'Save-the-Dates',
    'and ceremony programs': 'und Zeremonieprogramme',
    'Add a romantic, sophisticated touch to your special day with': 'Fügen Sie Ihrem besonderen Tag mit',
    'schön handwritten-stil Schriften': 'schönen handgeschriebenen Schriftstilen eine romantische, raffinierte Note hinzu',
    'Use': 'Verwenden Sie',
    'for personal': 'für persönliche',
    'bios': 'Bios',
    'headers': 'Header',
    'and email signatures': 'und E-Mail-Signaturen',
    'Stand out with elegant script': 'Heben Sie sich mit eleganten',
    'that convey professionalism and personality': 'ab, die Professionalität und Persönlichkeit vermitteln',
    'Can I use': 'Kann ich',
    'for formal documents': 'für formelle Dokumente verwenden',
    'Yes!': 'Ja!',
    'generated by Toolaze': 'die von Toolaze generiert werden',
    'use Unicode': 'verwenden Unicode',
    'zeichen': 'Zeichen',
    'that work in most applications': 'die in den meisten Anwendungen funktionieren',
    'However, for very formal documents like legal papers': 'Für sehr formelle Dokumente wie Rechtsdokumente',
    'you may want to verify compatibility': 'sollten Sie die Kompatibilität überprüfen',
    'with your specific document software first': 'mit Ihrer spezifischen Dokumentensoftware zuerst',
    'work great in email signatures': 'funktionieren hervorragend in E-Mail-Signaturen',
    'Simply': 'Einfach',
    'kopieren': 'kopieren',
    'einfügen': 'einfügen',
    'it into your email signature settings': 'und fügen Sie ihn in Ihre E-Mail-Signatur-Einstellungen ein',
    'Most email clients support Unicode': 'Die meisten E-Mail-Clients unterstützen Unicode',
    'have a flowing, connected script style': 'haben einen fließenden, verbundenen Schriftstil',
    'while': 'während',
    'often have more decorative flourishes': 'oft mehr dekorative Verzierungen haben',
    'Our': 'Unser',
    'generator focuses on elegant, readable script styles perfect for everyday use': 'Generator konzentriert sich auf elegante, lesbare Schriftstile, die perfekt für den täglichen Gebrauch sind',
    'For more decorative options, try our': 'Für mehr dekorative Optionen probieren Sie unseren',
    'work in Microsoft Word and most word processors': 'funktionieren in Microsoft Word und den meisten Textverarbeitungsprogrammen',
    'Simply copy and paste the generated text directly into your document': 'Kopieren Sie einfach den generierten Text direkt in Ihr Dokument',
    'Unbegrenzt': 'Unbegrenzte',
    'text generation': 'Textgenerierung',
    'Multiple': 'Mehrere',
    'elegant': 'elegante',
    'stile': 'Stile',
    'Sofort': 'Sofortige',
    'Echtzeit-Vorschau': 'Echtzeit-Vorschau',
    'Browser-basiert': 'Browser-basierte',
    'processing': 'Verarbeitung',
    'No character limits': 'Keine Zeichenlimits',
    'kostenlos forever': 'für immer kostenlos',
    'Limited': 'Begrenzte',
    'options': 'Optionen',
    'Slow': 'Langsame',
    'server': 'Server',
    'Cloud uploads required': 'Cloud-Uploads erforderlich',
    'concerns': 'Bedenken',
    'Watermarks or ads': 'Wasserzeichen oder Werbung',
    'Paid premium': 'Bezahlte Premium',
    'Funktionen': 'Funktionen',
    'The best': 'Der beste',
    "I've found": 'den ich gefunden habe',
    'results and works perfectly on Instagram': 'Ergebnisse und funktioniert perfekt auf Instagram',
    'Join thousands of users who trust Toolaze for': 'Schließen Sie sich Tausenden von Benutzern an, die Toolaze für',
    'text generation': 'Textgenerierung vertrauen',
    'schön': 'schöne',
    'kursiv': 'kursive',
    'Sofort': 'Sofortige',
    'schriftgenerator': 'Schriftgenerator',
    
    // ========== Intro板块完整翻译 ==========
    // Bold Font Generator
    'Why Use a Bold Font Generator?': 'Warum einen fetten Schriftgenerator verwenden?',
    'What is Bold Font?': 'Was ist eine fette Schrift?',
    'Bold fonts use Unicode Mathematical Bold characters—distinct Unicode symbols that create thicker, more prominent letterforms. Unlike CSS-styled bold text, these Unicode characters work consistently across all platforms, even where styling isn\'t available. Bold fonts are characterized by their strong, impactful appearance, making them perfect for headlines, marketing materials, brand names, and any text that needs to command attention and convey confidence. For more bold styles, check out our': 
      'Fette Schriften verwenden Unicode Mathematical Bold-Zeichen—eindeutige Unicode-Symbole, die dickere, auffälligere Buchstabenformen erzeugen. Im Gegensatz zu CSS-formatiertem fetten Text funktionieren diese Unicode-Zeichen konsistent auf allen Plattformen, auch dort, wo Formatierungen nicht verfügbar sind. Fette Schriften zeichnen sich durch ihr starkes, wirkungsvolles Erscheinungsbild aus und sind daher perfekt für Überschriften, Marketing-Materialien, Markennamen und jeden Text, der Aufmerksamkeit erregen und Vertrauen vermitteln muss. Für mehr fette Stile probieren Sie unseren',
    'Why Generate Bold Text Online?': 'Warum fetten Text online generieren?',
    'Standard bold text styling only works where CSS is supported, limiting its use in social media bios, email subject lines, and plain text environments. Our bold uses Unicode Mathematical Bold characters that work everywhere—Instagram, Twitter, email, documents, and more. Whether you\'re creating attention-grabbing headlines, designing marketing campaigns, or building brand identity, our tool transforms any text into powerful bold style instantly, ensuring your message stands out across all platforms. Discover more styles with our':
      'Standard-Fetttext-Formatierung funktioniert nur dort, wo CSS unterstützt wird, was ihre Verwendung in Social-Media-Bios, E-Mail-Betreffzeilen und reinen Textumgebungen einschränkt. Unser Fetttext verwendet Unicode Mathematical Bold-Zeichen, die überall funktionieren—Instagram, Twitter, E-Mail, Dokumente und mehr. Ob Sie aufmerksamkeitsstarke Überschriften erstellen, Marketing-Kampagnen gestalten oder Markenidentität aufbauen, unser Tool verwandelt jeden Text sofort in einen kraftvollen fetten Stil und sorgt dafür, dass Ihre Nachricht auf allen Plattformen hervorsticht. Entdecken Sie mehr Stile mit unserem',
    
    // Cursive Font Generator
    'Why Use a Cursive Font Generator?': 'Warum einen kursiven Schriftgenerator verwenden?',
    'What is Cursive Font?': 'Was ist eine kursive Schrift?',
    'Cursive fonts, also known as script fonts, feature flowing, connected letterforms that mimic handwritten text. These elegant typefaces create a sense of sophistication and personal touch, making them perfect for formal invitations, personal branding, and artistic projects. Unlike standard fonts, cursive styles add warmth and personality to your text, conveying emotion and style through their graceful curves and connections. If you\'re looking for more decorative options, try our':
      'Kursive Schriften, auch als Script-Schriften bekannt, zeichnen sich durch fließende, verbundene Buchstabenformen aus, die handgeschriebenen Text nachahmen. Diese eleganten Schriftarten schaffen ein Gefühl von Raffinesse und persönlicher Note und sind daher perfekt für formelle Einladungen, persönliches Branding und künstlerische Projekte. Im Gegensatz zu Standard-Schriften verleihen kursive Stile Ihrem Text Wärme und Persönlichkeit und vermitteln Emotionen und Stil durch ihre anmutigen Kurven und Verbindungen. Wenn Sie nach mehr dekorativen Optionen suchen, probieren Sie unseren',
    'Why Generate Cursive Text Online?': 'Warum kursiven Text online generieren?',
    'Traditional methods of creating cursive text require expensive design software, font installation, and typography knowledge. Whether you\'re designing wedding invitations, creating personal Instagram bios, or adding elegant touches to business cards, our tool transforms any text into professional cursive style in seconds—no downloads, no installations, no design experience needed. Explore more font styles with our comprehensive':
      'Traditionelle Methoden zur Erstellung von kursivem Text erfordern teure Design-Software, Schriftinstallation und Typografie-Kenntnisse. Ob Sie Hochzeitseinladungen gestalten, persönliche Instagram-Bios erstellen oder elegante Akzente auf Visitenkarten hinzufügen, unser Tool verwandelt jeden Text in Sekunden in einen professionellen kursiven Stil—keine Downloads, keine Installationen, keine Design-Erfahrung erforderlich. Erkunden Sie mehr Schriftstile mit unserer umfassenden',
    
    // Tattoo Font Generator
    'Why Use a Tattoo Font Generator?': 'Warum einen Tattoo-Schriftgenerator verwenden?',
    'What is Tattoo Font?': 'Was ist eine Tattoo-Schrift?',
    'Tattoo fonts combine bold, gothic, and decorative elements specifically designed for body art aesthetics. These distinctive typefaces feature strong lines, unique character shapes, and edgy styling that captures the rebellious spirit of tattoo culture. Tattoo fonts are characterized by their bold presence, making text stand out whether used in actual tattoo designs, streetwear clothing, or alternative fashion branding. For similar bold styles, check out our':
      'Tattoo-Schriften kombinieren fette, gotische und dekorative Elemente, die speziell für Body-Art-Ästhetik entwickelt wurden. Diese unverwechselbaren Schriftarten zeichnen sich durch starke Linien, einzigartige Zeichenformen und provokantes Styling aus, das den rebellischen Geist der Tattoo-Kultur einfängt. Tattoo-Schriften zeichnen sich durch ihre fette Präsenz aus und lassen Text hervorstechen, egal ob in tatsächlichen Tattoo-Designs, Streetwear-Kleidung oder alternativer Mode-Markenbildung verwendet. Für ähnliche fette Stile probieren Sie unseren',
    'Why Generate Tattoo Text Online?': 'Warum Tattoo-Text online generieren?',
    'Designing tattoo-style text traditionally requires specialized design software and extensive typography knowledge. Tattoo artists and enthusiasts often spend hours searching for the perfect font style that matches their vision. Perfect for tattoo designers, body art enthusiasts, and alternative fashion brands who need distinctive, eye-catching typography. Explore more styles with our':
      'Die Gestaltung von Tattoo-Text erfordert traditionell spezialisierte Design-Software und umfangreiches Typografie-Wissen. Tattoo-Künstler und Enthusiasten verbringen oft Stunden damit, den perfekten Schriftstil zu finden, der ihrer Vision entspricht. Perfekt für Tattoo-Designer, Body-Art-Enthusiasten und alternative Mode-Marken, die unverwechselbare, auffällige Typografie benötigen. Erkunden Sie mehr Stile mit unserer',
    
    // Fancy Font Generator
    'Why Use a Fancy Font Generator?': 'Warum einen verschönerten Schriftgenerator verwenden?',
    'What is Fancy Font?': 'Was ist eine verschönerte Schrift?',
    'Fancy fonts encompass a wide range of decorative, elegant typefaces that add sophistication and visual interest to text. These refined styles include double-struck characters, circled letters, squared text, and other ornamental Unicode variations. Fancy fonts are characterized by their upscale appearance, making them perfect for luxury brands, formal invitations, high-end product packaging, and projects that require a premium, exclusive aesthetic. For more elegant script styles, try our':
      'Verschönerte Schriften umfassen eine breite Palette dekorativer, eleganter Schriftarten, die Text Raffinesse und visuelles Interesse verleihen. Diese verfeinerten Stile umfassen doppelt durchgestrichene Zeichen, umkreiste Buchstaben, quadratischen Text und andere ornamentale Unicode-Variationen. Verschönerte Schriften zeichnen sich durch ihr hochwertiges Erscheinungsbild aus und sind daher perfekt für Luxusmarken, formelle Einladungen, hochwertige Produktverpackungen und Projekte, die eine Premium-, exklusive Ästhetik erfordern. Für elegantere Script-Stile probieren Sie unseren',
    'Why Generate Fancy Text Online?': 'Warum verschönerten Text online generieren?',
    'Creating fancy decorative text traditionally requires advanced typography skills and expensive design software. Our fancy text tiny fancy fonts generator copy paste provides instant access to multiple elegant Unicode styles including double-struck, circled, squared, and parenthesized variations. Whether you\'re designing luxury brand logos, creating formal event invitations, or developing premium marketing materials, our tool transforms any text into sophisticated fancy style instantly—adding that special touch of elegance and exclusivity to your projects. Explore all our font tools with our':
      'Die Erstellung von verschönertem dekorativem Text erfordert traditionell fortgeschrittene Typografie-Fähigkeiten und teure Design-Software. Unser verschönerter Text-Generator bietet sofortigen Zugang zu mehreren eleganten Unicode-Stilen, einschließlich doppelt durchgestrichener, umkreister, quadratischer und in Klammern gesetzter Variationen. Ob Sie Luxusmarken-Logos gestalten, formelle Veranstaltungseinladungen erstellen oder Premium-Marketing-Materialien entwickeln, unser Tool verwandelt jeden Text sofort in einen raffinierten verschönerten Stil—und verleiht Ihren Projekten diese besondere Note von Eleganz und Exklusivität. Erkunden Sie alle unsere Schrift-Tools mit unserem',
    
    // Instagram Font Generator
    'Why Use an Instagram Font Generator?': 'Warum einen Instagram-Schriftgenerator verwenden?',
    'What is Instagram Font?': 'Was ist eine Instagram-Schrift?',
    'Instagram fonts are Unicode-based text styles specifically optimized for Instagram\'s platform. These fonts use Unicode characters that display correctly in Instagram bios, posts, stories, captions, and highlights. Instagram fonts help your profile stand out in the feed, making your bio more eye-catching, your captions more engaging, and your brand more memorable. They\'re perfect for influencers, social media managers, and content creators who want to create unique, branded Instagram content. For other platform fonts, check out our':
      'Instagram-Schriften sind Unicode-basierte Textstile, die speziell für Instagrams Plattform optimiert sind. Diese Schriften verwenden Unicode-Zeichen, die in Instagram-Bios, Posts, Stories, Beschriftungen und Highlights korrekt angezeigt werden. Instagram-Schriften helfen Ihrem Profil, sich im Feed abzuheben, machen Ihre Bio auffälliger, Ihre Beschriftungen ansprechender und Ihre Marke unvergesslicher. Sie sind perfekt für Influencer, Social-Media-Manager und Content-Ersteller, die einzigartige, markenspezifische Instagram-Inhalte erstellen möchten. Für andere Plattform-Schriften probieren Sie unseren',
    'Why Generate Instagram Text Online?': 'Warum Instagram-Text online generieren?',
    'Instagram\'s native text styling is limited, and finding fonts that work on Instagram can be challenging. Whether you\'re updating your Instagram bio, creating engaging story text, or designing branded post captions, our tool transforms any text into Instagram-compatible fonts instantly—ensuring your content stands out and displays correctly across all Instagram features. Discover more with our':
      'Instagrams native Text-Formatierung ist begrenzt, und das Finden von Schriften, die auf Instagram funktionieren, kann eine Herausforderung sein. Ob Sie Ihre Instagram-Bio aktualisieren, ansprechende Story-Texte erstellen oder markenspezifische Post-Beschriftungen gestalten, unser Tool verwandelt jeden Text sofort in Instagram-kompatible Schriften—und sorgt dafür, dass Ihr Content hervorsticht und in allen Instagram-Funktionen korrekt angezeigt wird. Entdecken Sie mehr mit unserem',
    
    // Gothic Font Generator
    'Why Use a Gothic Font Generator?': 'Warum einen gotischen Schriftgenerator verwenden?',
    'What is Gothic Font?': 'Was ist eine gotische Schrift?',
    'Gothic fonts, also known as blackletter, feature ornate, medieval letterforms with dramatic, angular strokes. These historic typefaces originated in medieval Europe and are characterized by their dense, decorative appearance with intricate details. Gothic fonts create a powerful, authoritative presence, making them ideal for metal band logos, horror content, gaming titles, and projects that need a bold, dramatic aesthetic. For similar traditional styles, explore our':
      'Gotische Schriften, auch als Blackletter bekannt, zeichnen sich durch verzierte, mittelalterliche Buchstabenformen mit dramatischen, eckigen Strichen aus. Diese historischen Schriftarten entstanden im mittelalterlichen Europa und zeichnen sich durch ihr dichtes, dekoratives Erscheinungsbild mit komplexen Details aus. Gotische Schriften schaffen eine kraftvolle, autoritative Präsenz und sind daher ideal für Metal-Band-Logos, Horror-Content, Gaming-Titel und Projekte, die eine fette, dramatische Ästhetik benötigen. Für ähnliche traditionelle Stile erkunden Sie unseren',
    'Why Generate Gothic Text Online?': 'Warum gotischen Text online generieren?',
    'Traditional gothic typography requires specialized knowledge of historical letterforms and expensive design software. Our gothic text tiny gothic provides instant access to classic blackletter styles using Unicode Mathematical Fraktur characters. Whether you\'re designing metal band logos, creating horror movie posters, or developing medieval fantasy games, our tool transforms any text into authentic-looking gothic style in seconds—perfect for projects that need that dark, powerful, historical aesthetic. Browse more font styles with our':
      'Traditionelle gotische Typografie erfordert spezialisiertes Wissen über historische Buchstabenformen und teure Design-Software. Unser gotischer Text-Generator bietet sofortigen Zugang zu klassischen Blackletter-Stilen mit Unicode Mathematical Fraktur-Zeichen. Ob Sie Metal-Band-Logos gestalten, Horror-Filmplakate erstellen oder mittelalterliche Fantasy-Spiele entwickeln, unser Tool verwandelt jeden Text in Sekunden in einen authentisch aussehenden gotischen Stil—perfekt für Projekte, die diese dunkle, kraftvolle, historische Ästhetik benötigen. Durchsuchen Sie mehr Schriftstile mit unserer',
    
    // Calligraphy Font Generator
    'Why Use a Calligraphy Font Generator?': 'Warum einen Kalligrafie-Schriftgenerator verwenden?',
    'What is Calligraphy Font?': 'Was ist eine Kalligrafie-Schrift?',
    'Calligraphy fonts feature elegant, handwritten-style letterforms with decorative flourishes and ornamental elements. These sophisticated typefaces mimic traditional penmanship, creating a sense of timeless elegance and craftsmanship. Calligraphy fonts are characterized by their graceful curves, decorative details, and formal appearance, making them perfect for wedding invitations, certificates, awards, and projects that require a prestigious, handcrafted aesthetic. For similar elegant styles, explore our':
      'Kalligrafie-Schriften zeichnen sich durch elegante, handgeschriebene Buchstabenformen mit dekorativen Verzierungen und ornamentalen Elementen aus. Diese raffinierten Schriftarten ahmen traditionelle Handschrift nach und schaffen ein Gefühl von zeitloser Eleganz und Handwerkskunst. Kalligrafie-Schriften zeichnen sich durch ihre anmutigen Kurven, dekorativen Details und formelles Erscheinungsbild aus und sind daher perfekt für Hochzeitseinladungen, Zertifikate, Auszeichnungen und Projekte, die eine prestigeträchtige, handgemachte Ästhetik erfordern. Für ähnliche elegante Stile erkunden Sie unseren',
    'Why Generate Calligraphy Text Online?': 'Warum Kalligrafie-Text online generieren?',
    'Traditional calligraphy requires years of practice and expensive tools. Professional calligraphy services can cost hundreds of dollars for a single project. Our calligraphy text tiny calligraphy provides instant access to elegant, handwritten-style fonts that capture that classic calligraphy aesthetic. Whether you\'re designing wedding stationery, creating certificates, or developing artisanal brand materials, our tool transforms any text into beautiful calligraphy style instantly—bringing that timeless elegance to your projects without the cost or complexity. Find more elegant fonts with our':
      'Traditionelle Kalligrafie erfordert jahrelange Übung und teure Werkzeuge. Professionelle Kalligrafie-Dienste können Hunderte von Dollar für ein einzelnes Projekt kosten. Unser Kalligrafie-Text-Generator bietet sofortigen Zugang zu eleganten, handgeschriebenen Schriftarten, die diese klassische Kalligrafie-Ästhetik einfangen. Ob Sie Hochzeitspapeterie gestalten, Zertifikate erstellen oder handwerkliche Markenmaterialien entwickeln, unser Tool verwandelt jeden Text sofort in einen schönen Kalligrafie-Stil—und bringt diese zeitlose Eleganz in Ihre Projekte ohne die Kosten oder Komplexität. Finden Sie mehr elegante Schriften mit unserem',
    
    // Discord Font Generator
    'Why Use a Discord Font Generator?': 'Warum einen Discord-Schriftgenerator verwenden?',
    'What is Discord Font?': 'Was ist eine Discord-Schrift?',
    'Discord fonts are Unicode-based text styles specifically optimized for Discord\'s chat interface. These fonts use Unicode characters that display correctly in Discord server names, channel titles, role names, and chat messages. Discord fonts help your server stand out, making your community more engaging and your branding more memorable. They\'re perfect for gaming communities, streamers, and online communities who want to create unique, eye-catching Discord content. For other platform fonts, try our':
      'Discord-Schriften sind Unicode-basierte Textstile, die speziell für Discords Chat-Oberfläche optimiert sind. Diese Schriften verwenden Unicode-Zeichen, die in Discord-Servernamen, Kanal-Titeln, Rollennamen und Chat-Nachrichten korrekt angezeigt werden. Discord-Schriften helfen Ihrem Server, sich abzuheben, machen Ihre Community ansprechender und Ihr Branding unvergesslicher. Sie sind perfekt für Gaming-Communities, Streamer und Online-Communities, die einzigartige, auffällige Discord-Inhalte erstellen möchten. Für andere Plattform-Schriften probieren Sie unseren',
    'Why Generate Discord Text Online?': 'Warum Discord-Text online generieren?',
    'Discord\'s native text formatting is limited to basic markdown, and finding fonts that work in Discord can be challenging. Our Discord text tiny discord provides instant access to multiple Unicode font styles that are fully compatible with Discord\'s platform. Whether you\'re naming your Discord server, creating channel titles, or designing role names, our tool transforms any text into Discord-compatible fonts instantly—ensuring your community stands out and your text displays correctly across all Discord features. Explore more with our':
      'Discords native Text-Formatierung ist auf einfaches Markdown beschränkt, und das Finden von Schriften, die in Discord funktionieren, kann eine Herausforderung sein. Unser Discord-Text-Generator bietet sofortigen Zugang zu mehreren Unicode-Schriftstilen, die vollständig mit Discords Plattform kompatibel sind. Ob Sie Ihren Discord-Server benennen, Kanal-Titel erstellen oder Rollennamen gestalten, unser Tool verwandelt jeden Text sofort in Discord-kompatible Schriften—und sorgt dafür, dass Ihre Community hervorsticht und Ihr Text in allen Discord-Funktionen korrekt angezeigt wird. Erkunden Sie mehr mit unserem',
    
    // Old English Font Generator
    'Why Use an Old English Font Generator?': 'Warum einen Altenglischen Schriftgenerator verwenden?',
    'What is Old English Font?': 'Was ist eine Altenglische Schrift?',
    'Old English fonts, also known as blackletter or gothic script, feature ornate, medieval letterforms that originated in medieval Europe. These historic typefaces are characterized by their dense, angular strokes, intricate details, and traditional appearance. Old English fonts create an authentic medieval aesthetic, making them perfect for historical reenactments, traditional pubs, literary publications, and projects that need that classic, timeless British feel. For similar traditional styles, check out our':
      'Altenglische Schriften, auch als Blackletter oder gotische Schrift bekannt, zeichnen sich durch verzierte, mittelalterliche Buchstabenformen aus, die im mittelalterlichen Europa entstanden. Diese historischen Schriftarten zeichnen sich durch ihre dichten, eckigen Striche, komplexen Details und traditionelles Erscheinungsbild aus. Altenglische Schriften schaffen eine authentische mittelalterliche Ästhetik und sind daher perfekt für historische Nachstellungen, traditionelle Pubs, literarische Publikationen und Projekte, die dieses klassische, zeitlose britische Gefühl benötigen. Für ähnliche traditionelle Stile probieren Sie unseren',
    'Why Generate Old English Text Online?': 'Warum Altenglischen Text online generieren?',
    'Creating authentic Old English typography requires specialized knowledge of historical letterforms and expensive design software. Our Old English text tiny old english provides instant access to classic blackletter styles using Unicode Mathematical Fraktur characters. Whether you\'re designing pub signs, creating historical event materials, or developing traditional branding, our tool transforms any text into authentic-looking Old English style in seconds—perfect for projects that need that classic, medieval aesthetic. Browse more styles with our':
      'Die Erstellung authentischer Altenglischer Typografie erfordert spezialisiertes Wissen über historische Buchstabenformen und teure Design-Software. Unser Altenglischer Text-Generator bietet sofortigen Zugang zu klassischen Blackletter-Stilen mit Unicode Mathematical Fraktur-Zeichen. Ob Sie Pub-Schilder gestalten, historische Veranstaltungsmaterialien erstellen oder traditionelles Branding entwickeln, unser Tool verwandelt jeden Text in Sekunden in einen authentisch aussehenden Altenglischen Stil—perfekt für Projekte, die diese klassische, mittelalterliche Ästhetik benötigen. Durchsuchen Sie mehr Stile mit unserer',
    
    // 3D Font Generator
    'Why Use a 3D Font Generator?': 'Warum einen 3D-Schriftgenerator verwenden?',
    'What is 3D Font?': 'Was ist eine 3D-Schrift?',
    '3D fonts use Unicode characters with bold, dimensional styling that creates a three-dimensional appearance. These typefaces feature thick strokes and visual depth, making text appear to pop off the page or screen. 3D fonts are characterized by their modern, dimensional look, making them perfect for video game titles, architectural visualizations, 3D design projects, and any content that needs that contemporary, depth-filled aesthetic. For more bold styles, try our':
      '3D-Schriften verwenden Unicode-Zeichen mit fetter, dimensionaler Formatierung, die ein dreidimensionales Erscheinungsbild erzeugt. Diese Schriftarten zeichnen sich durch dicke Striche und visuelle Tiefe aus und lassen Text von der Seite oder dem Bildschirm hervorstechen. 3D-Schriften zeichnen sich durch ihr modernes, dimensionales Aussehen aus und sind daher perfekt für Videospiel-Titel, architektonische Visualisierungen, 3D-Design-Projekte und jeden Content, der diese zeitgenössische, tiefenreiche Ästhetik benötigt. Für mehr fette Stile probieren Sie unseren',
    'Why Generate 3D Text Online?': 'Warum 3D-Text online generieren?',
    'Creating true 3D text requires expensive 3D modeling software and specialized skills. Our 3D text tiny 3d provides instant access to dimensional Unicode styles that create that 3D-like appearance. Whether you\'re designing game titles, creating architectural presentations, or developing modern branding, our tool transforms any text into bold 3D-style fonts instantly—adding that depth and dimension to your projects without the complexity of 3D software. Discover more with our':
      'Die Erstellung von echtem 3D-Text erfordert teure 3D-Modellierungssoftware und spezialisierte Fähigkeiten. Unser 3D-Text-Generator bietet sofortigen Zugang zu dimensionalen Unicode-Stilen, die dieses 3D-ähnliche Erscheinungsbild erzeugen. Ob Sie Spiel-Titel gestalten, architektonische Präsentationen erstellen oder modernes Branding entwickeln, unser Tool verwandelt jeden Text sofort in fette 3D-Stil-Schriften—und verleiht Ihren Projekten diese Tiefe und Dimension ohne die Komplexität von 3D-Software. Entdecken Sie mehr mit unserem',
    
    // Italic Font Generator
    'Why Use an Italic Font Generator?': 'Warum einen kursiven Schriftgenerator verwenden?',
    'What is Italic Font?': 'Was ist eine kursive Schrift?',
    'Italic fonts use Unicode Mathematical Italic characters—distinct Unicode symbols that create slanted, emphasized letterforms. Unlike CSS-styled italic text, these Unicode characters work consistently across all platforms, including email, documents, and plain text environments. Italic fonts are characterized by their emphasis effect, making them perfect for academic citations, book titles, document emphasis, and any text that needs to stand out while maintaining readability. For more script styles, try our':
      'Kursive Schriften verwenden Unicode Mathematical Italic-Zeichen—eindeutige Unicode-Symbole, die geneigte, betonte Buchstabenformen erzeugen. Im Gegensatz zu CSS-formatiertem kursivem Text funktionieren diese Unicode-Zeichen konsistent auf allen Plattformen, einschließlich E-Mail, Dokumenten und reinen Textumgebungen. Kursive Schriften zeichnen sich durch ihren Betonungseffekt aus und sind daher perfekt für akademische Zitate, Buchtitel, Dokumentbetonung und jeden Text, der hervorstechen muss, während die Lesbarkeit erhalten bleibt. Für mehr Script-Stile probieren Sie unseren',
    'Why Generate Italic Text Online?': 'Warum kursiven Text online generieren?',
    'Standard italic styling only works where CSS is supported, limiting its use in email, plain text documents, and many applications. Our italic text italic uses Unicode Mathematical Italic characters that work everywhere—email clients, word processors, academic papers, and more. Whether you\'re writing research papers, creating book titles, or adding emphasis to documents, our tool transforms any text into proper italic style instantly, ensuring your emphasis displays correctly across all platforms. Browse more styles with our':
      'Standard-Kursiv-Formatierung funktioniert nur dort, wo CSS unterstützt wird, was ihre Verwendung in E-Mail, reinen Textdokumenten und vielen Anwendungen einschränkt. Unser Kursiv-Text verwendet Unicode Mathematical Italic-Zeichen, die überall funktionieren—E-Mail-Clients, Textverarbeitungsprogramme, akademische Papiere und mehr. Ob Sie Forschungsarbeiten schreiben, Buchtitel erstellen oder Dokumenten Betonung hinzufügen, unser Tool verwandelt jeden Text sofort in einen ordnungsgemäßen Kursiv-Stil und sorgt dafür, dass Ihre Betonung auf allen Plattformen korrekt angezeigt wird. Durchsuchen Sie mehr Stile mit unserer',
    
    // Cool Font Generator
    'Why Use a Cool Font Generator?': 'Warum einen coolen Schriftgenerator verwenden?',
    'What is Cool Font?': 'Was ist eine coole Schrift?',
    'Cool fonts feature modern, trendy aesthetics that appeal to contemporary audiences. These sleek typefaces combine bold, sans-serif, and monospace styles to create that hip, urban look popular in streetwear culture, tech startups, and gaming communities. Cool fonts are characterized by their contemporary feel, making them perfect for streetwear brands, music producers, tech companies, and projects that need a modern, innovative aesthetic. For more bold styles, try our':
      'Coole Schriften zeichnen sich durch moderne, trendige Ästhetik aus, die zeitgenössische Zielgruppen anspricht. Diese eleganten Schriftarten kombinieren fette, Sans-Serif- und Monospace-Stile, um diesen hippen, urbanen Look zu schaffen, der in Streetwear-Kultur, Tech-Startups und Gaming-Communities beliebt ist. Coole Schriften zeichnen sich durch ihr zeitgenössisches Gefühl aus und sind daher perfekt für Streetwear-Marken, Musikproduzenten, Tech-Unternehmen und Projekte, die eine moderne, innovative Ästhetik benötigen. Für mehr fette Stile probieren Sie unseren',
    'Why Generate Cool Text Online?': 'Warum coolen Text online generieren?',
    'Creating cool, trendy text requires staying current with design trends and having access to modern typography tools. Our cool text tiny cool provides instant access to contemporary font styles that capture that sleek, hip vibe. Whether you\'re designing streetwear clothing, creating tech startup branding, or developing gaming content, our tool transforms any text into modern cool style instantly—perfect for projects that need that contemporary, edgy aesthetic. Explore more styles with our':
      'Die Erstellung von coolen, trendigen Texten erfordert, mit Design-Trends Schritt zu halten und Zugang zu modernen Typografie-Tools zu haben. Unser Cool-Text-Generator bietet sofortigen Zugang zu zeitgenössischen Schriftstilen, die diese elegante, hippe Atmosphäre einfangen. Ob Sie Streetwear-Kleidung gestalten, Tech-Startup-Branding erstellen oder Gaming-Content entwickeln, unser Tool verwandelt jeden Text sofort in einen modernen Cool-Stil—perfekt für Projekte, die diese zeitgenössische, provokante Ästhetik benötigen. Erkunden Sie mehr Stile mit unserer',
    
    // 通用链接文本翻译
    'tattoo font generator': 'Tattoo-Schriftgenerator',
    'gothic font generator': 'gotischen Schriftgenerator',
    'font generator': 'Schriftgenerator',
    'fancy font generator': 'verschönerten Schriftgenerator',
    'calligraphy font generator': 'Kalligrafie-Schriftgenerator',
    'Discord font generator': 'Discord-Schriftgenerator',
    'Old English font generator': 'Altenglischen Schriftgenerator',
    'bold font generator': 'fetten Schriftgenerator',
    'cool font generator': 'coolen Schriftgenerator',
    'cursive font generator': 'kursiven Schriftgenerator',
    'Instagram font generator': 'Instagram-Schriftgenerator',
    'or': 'oder',
    'for additional elegant styles': 'für zusätzliche elegante Stile',
    'collection': 'Sammlung',
    'With our italic font generator, you can create styled text in seconds.': 'Mit unserem kursiven Schriftgenerator können Sie formatierte Texte in Sekunden erstellen.',
    
    // Minecraft Font Generator
    'Why Use a Minecraft Font Generator?': 'Warum einen Minecraft-Schriftgenerator verwenden?',
    'What is Minecraft Font?': 'Was ist eine Minecraft-Schrift?',
    'Minecraft fonts feature that distinctive pixelated, blocky aesthetic associated with Minecraft\'s iconic visual style. These typefaces use Unicode characters that create that recognizable Minecraft look with square, pixelated letterforms. Minecraft fonts are characterized by their playful, blocky appearance, making them perfect for Minecraft content creators, gaming streamers, server owners, and projects that need that distinctive Minecraft aesthetic. For similar gaming styles, check out our':
      'Minecraft-Schriften zeichnen sich durch diese unverwechselbare pixelige, blockige Ästhetik aus, die mit Minecrafts ikonischem visuellen Stil verbunden ist. Diese Schriftarten verwenden Unicode-Zeichen, die diesen erkennbaren Minecraft-Look mit quadratischen, pixeligen Buchstabenformen erzeugen. Minecraft-Schriften zeichnen sich durch ihr verspieltes, blockiges Erscheinungsbild aus und sind daher perfekt für Minecraft-Content-Ersteller, Gaming-Streamer, Server-Besitzer und Projekte, die diese unverwechselbare Minecraft-Ästhetik benötigen. Für ähnliche Gaming-Stile probieren Sie unseren',
    'Why Generate Minecraft Text Online?': 'Warum Minecraft-Text online generieren?',
    'Creating Minecraft-style text for YouTube thumbnails, server branding, or gaming content typically requires design software and font installation. Our Minecraft text tiny minecraft provides instant access to pixelated, blocky text styles that capture that iconic Minecraft feel. Whether you\'re creating YouTube content, designing server websites, or developing Minecraft-themed materials, our tool transforms any text into authentic-looking Minecraft style instantly—bringing that blocky, pixelated aesthetic to your projects. Explore more with our':
      'Die Erstellung von Minecraft-Stil-Text für YouTube-Thumbnails, Server-Branding oder Gaming-Content erfordert typischerweise Design-Software und Schriftinstallation. Unser Minecraft-Text-Generator bietet sofortigen Zugang zu pixeligen, blockigen Textstilen, die dieses ikonische Minecraft-Gefühl einfangen. Ob Sie YouTube-Content erstellen, Server-Websites gestalten oder Minecraft-thematische Materialien entwickeln, unser Tool verwandelt jeden Text sofort in einen authentisch aussehenden Minecraft-Stil—und bringt diese blockige, pixelige Ästhetik in Ihre Projekte. Erkunden Sie mehr mit unserem',
    
    // Disney Font Generator
    'Why Use a Disney Font Generator?': 'Warum einen Disney-Schriftgenerator verwenden?',
    'What is Disney Font?': 'Was ist eine Disney-Schrift?',
    'Disney fonts capture that magical, whimsical aesthetic associated with Disney\'s enchanting world. These playful typefaces feature rounded, friendly letterforms with a sense of wonder and joy. Disney-style fonts are characterized by their cute, approachable appearance, making them perfect for children\'s content, party decorations, and family-friendly projects. They convey a sense of fun, adventure, and imagination that appeals to both kids and adults. For similar playful styles, try our':
      'Disney-Schriften fangen diese magische, verspielte Ästhetik ein, die mit Disneys verzaubernder Welt verbunden ist. Diese verspielten Schriftarten zeichnen sich durch abgerundete, freundliche Buchstabenformen mit einem Gefühl von Wunder und Freude aus. Disney-Stil-Schriften zeichnen sich durch ihr süßes, zugängliches Erscheinungsbild aus und sind daher perfekt für Kinder-Content, Party-Dekorationen und familienfreundliche Projekte. Sie vermitteln ein Gefühl von Spaß, Abenteuer und Fantasie, das sowohl Kinder als auch Erwachsene anspricht. Für ähnliche verspielte Stile probieren Sie unseren',
    'Why Generate Disney Text Online?': 'Warum Disney-Text online generieren?',
    'Creating Disney-inspired text for parties, children\'s content, or fan projects typically requires expensive design software and font licensing. Our Disney text tiny disney provides instant access to magical, whimsical text styles that capture that enchanting Disney feel. Whether you\'re planning a Disney-themed birthday party, creating children\'s book covers, or designing fun social media content, our tool transforms any text into playful Disney-style fonts instantly—bringing that magical touch to your projects without the complexity. Discover more font styles with our':
      'Die Erstellung von Disney-inspiriertem Text für Partys, Kinder-Content oder Fan-Projekte erfordert typischerweise teure Design-Software und Schriftlizenzierung. Unser Disney-Text-Generator bietet sofortigen Zugang zu magischen, verspielten Textstilen, die dieses verzaubernde Disney-Gefühl einfangen. Ob Sie eine Disney-thematische Geburtstagsfeier planen, Kinderbuch-Cover erstellen oder lustige Social-Media-Inhalte gestalten, unser Tool verwandelt jeden Text sofort in verspielte Disney-Stil-Schriften—und bringt diese magische Note in Ihre Projekte ohne die Komplexität. Entdecken Sie mehr Schriftstile mit unseren',
    
    // Bubble Font Generator
    'Why Use a Bubble Font Generator?': 'Warum einen Blasen-Schriftgenerator verwenden?',
    'What is Bubble Font?': 'Was ist eine Blasen-Schrift?',
    'Bubble fonts feature rounded, playful letterforms that create a soft, friendly appearance. These cheerful typefaces use bold, rounded Unicode styles that look like bubbles or balloons. Bubble fonts are characterized by their fun, approachable aesthetic, making them perfect for children\'s content, casual brands, party decorations, and projects that need a lighthearted, friendly feel. For similar playful styles, try our':
      'Blasen-Schriften zeichnen sich durch abgerundete, verspielte Buchstabenformen aus, die ein weiches, freundliches Erscheinungsbild schaffen. Diese fröhlichen Schriftarten verwenden fette, abgerundete Unicode-Stile, die wie Blasen oder Ballons aussehen. Blasen-Schriften zeichnen sich durch ihre lustige, zugängliche Ästhetik aus und sind daher perfekt für Kinder-Content, lässige Marken, Party-Dekorationen und Projekte, die ein unbeschwertes, freundliches Gefühl benötigen. Für ähnliche verspielte Stile probieren Sie unseren',
    'Why Generate Bubble Text Online?': 'Warum Blasen-Text online generieren?',
    'Creating playful bubble text for children\'s books, party materials, or casual content typically requires design software and font selection. Our bubble text tiny bubble provides instant access to rounded, friendly text styles that capture that fun bubble aesthetic. Whether you\'re designing children\'s materials, creating party decorations, or developing casual brand content, our tool transforms any text into cheerful bubble style instantly—adding that playful, approachable touch to your projects. Browse more styles with our':
      'Die Erstellung von verspieltem Blasen-Text für Kinderbücher, Party-Materialien oder lässigen Content erfordert typischerweise Design-Software und Schriftauswahl. Unser Blasen-Text-Generator bietet sofortigen Zugang zu abgerundeten, freundlichen Textstilen, die diese lustige Blasen-Ästhetik einfangen. Ob Sie Kinder-Materialien gestalten, Party-Dekorationen erstellen oder lässigen Marken-Content entwickeln, unser Tool verwandelt jeden Text sofort in einen fröhlichen Blasen-Stil—und verleiht Ihren Projekten diese verspielte, zugängliche Note. Durchsuchen Sie mehr Stile mit unserer',
    
    // Star Wars Font Generator
    'Why Use a Star Wars Font Generator?': 'Warum einen Star Wars-Schriftgenerator verwenden?',
    'What is Star Wars Font?': 'Was ist eine Star Wars-Schrift?',
    'Star Wars fonts capture that iconic, futuristic aesthetic associated with the Star Wars universe. These distinctive typefaces feature angular, sci-fi letterforms that create that epic, space-age feel. Star Wars fonts are characterized by their bold, futuristic appearance, making them perfect for Star Wars fans, sci-fi content creators, gaming communities, and projects that need that legendary, space-themed aesthetic. For similar futuristic styles, check out our':
      'Star Wars-Schriften fangen diese ikonische, futuristische Ästhetik ein, die mit dem Star Wars-Universum verbunden ist. Diese unverwechselbaren Schriftarten zeichnen sich durch eckige, Sci-Fi-Buchstabenformen aus, die dieses epische, Space-Age-Gefühl erzeugen. Star Wars-Schriften zeichnen sich durch ihr fettes, futuristisches Erscheinungsbild aus und sind daher perfekt für Star Wars-Fans, Sci-Fi-Content-Ersteller, Gaming-Communities und Projekte, die diese legendäre, raumthematische Ästhetik benötigen. Für ähnliche futuristische Stile probieren Sie unseren',
    'Why Generate Star Wars Text Online?': 'Warum Star Wars-Text online generieren?',
    'Creating authentic Star Wars-style text for fan content, cosplay props, or themed events typically requires expensive fonts and design software. Our Star Wars text tiny star wars provides instant access to futuristic, sci-fi text styles that capture that iconic Star Wars feel. Whether you\'re creating fan content, designing gaming clan names, or developing space-themed materials, our tool transforms any text into epic Star Wars style instantly—bringing that legendary aesthetic to your projects. Explore more with our':
      'Die Erstellung von authentischem Star Wars-Stil-Text für Fan-Content, Cosplay-Requisiten oder thematische Veranstaltungen erfordert typischerweise teure Schriften und Design-Software. Unser Star Wars-Text-Generator bietet sofortigen Zugang zu futuristischen, Sci-Fi-Textstilen, die dieses ikonische Star Wars-Gefühl einfangen. Ob Sie Fan-Content erstellen, Gaming-Clan-Namen gestalten oder raumthematische Materialien entwickeln, unser Tool verwandelt jeden Text sofort in einen epischen Star Wars-Stil—und bringt diese legendäre Ästhetik in Ihre Projekte. Erkunden Sie mehr mit unserem',
    
    // 更多链接文本
    'Disney text font generator': 'Disney-Text-Schriftgenerator',
    'font generator tools': 'Schriftgenerator-Tools',
    
    // FAQ常见英语短语翻译
    'that display well': 'die gut angezeigt werden',
    'They\'re perfect': 'Sie sind perfekt',
    'They\'re': 'Sie sind',
    'that work': 'die funktionieren',
    'that work well': 'die gut funktionieren',
    'Yes,': 'Ja,',
    'Yes!': 'Ja!',
    'Absolutely!': 'Absolut!',
    'for creating': 'zum Erstellen',
    'für creating': 'zum Erstellen',
    'eye-catching': 'auffälligen',
    'social media content': 'Social-Media-Content',
    'are popular': 'sind beliebt',
    'are extremely popular': 'sind extrem beliebt',
    'perfect für': 'perfekt für',
    'work in': 'funktionieren in',
    'work well in': 'funktionieren gut in',
    'work regardless of': 'funktionieren unabhängig von',
    'whether you have': 'ob Sie haben',
    'oder not': 'oder nicht',
    'standard Unicode': 'Standard-Unicode',
    'that work für': 'die funktionieren für',
    'all Discord': 'alle Discord',
    'Benutzer': 'Benutzer',
    'try unser': 'probieren Sie unseren',
    'erkunden unser': 'erkunden Sie unsere',
    'Sammlung': 'Sammlung',
    'You can': 'Sie können',
    'Verwenden Sie': 'verwenden',
    'alongside': 'neben',
    'other text': 'anderem Text',
    'but each': 'aber jeder',
    'stil is': 'Stil ist',
    'independent': 'unabhängig',
    'Foder mixed': 'Für gemischte',
    'styling': 'Formatierung',
    'you\'d need to': 'müssten Sie',
    'generieren separate': 'separate generieren',
    'sections in different': 'Abschnitte in verschiedenen',
    'stile': 'Stilen',
    'Check out': 'Probieren Sie',
    'unser': 'unseren',
    'für modere': 'für moderne',
    'fett Optionen': 'fette Optionen',
    'oder browse': 'oder durchsuchen Sie',
    'Schriftgenerator-Tools': 'Schriftgenerator-Tools',
    'display coderrectly': 'werden korrekt angezeigt',
    'that display coderrectly': 'die korrekt angezeigt werden',
    'display correctly': 'werden korrekt angezeigt',
    'that display correctly': 'die korrekt angezeigt werden',
    'in Reels captions': 'in Reels-Beschriftungen',
    'and on-screen text': 'und On-Screen-Text',
    'Reels content': 'Reels-Content',
    'that stands out': 'das hervorsticht',
    'work in most': 'funktionieren in den meisten',
    'email clients': 'E-Mail-Clients',
    'adding emphasis to': 'Betonung hinzufügen zu',
    'impodertant': 'wichtigen',
    'information in': 'Informationen in',
    'yunser emails': 'Ihren E-Mails',
    'to generieren': 'zu generieren',
    'schön text stile': 'schöne Textstile',
    'are perfect für': 'sind perfekt für',
    'children\'s books': 'Kinderbücher',
    'party invitations': 'Party-Einladungen',
    'educational materials': 'Bildungsmaterialien',
    'kid-friendly content': 'kinderfreundlichen Content',
    'They\'re playful': 'Sie sind verspielt',
    'readable': 'lesbar',
    'and appeal to': 'und sprechen',
    'young audiences': 'junge Zielgruppen an',
    'work well in both': 'funktionieren gut in sowohl',
    'digital and print': 'digitalen als auch gedruckten',
    'materials': 'Materialien',
    'business cards': 'Visitenkarten',
    'letterheads': 'Briefköpfe',
    'high-quality printed': 'hochwertige gedruckte',
    'printed materials': 'gedruckte Materialien',
    'are perfect für': 'sind perfekt für',
    'band logos': 'Band-Logos',
    'album covers': 'Album-Cover',
    'merchandise': 'Merchandise',
    'that needs': 'die benötigt',
    'dramatic look': 'dramatisches Aussehen',
    'game titles': 'Spiel-Titel',
    'character names': 'Charakternamen',
    'UI elements': 'UI-Elemente',
    'that need that': 'die diese benötigen',
    'histoderical': 'historische',
    'epic feel': 'episches Gefühl',
  }
  
  // 先处理完整短语（按长度从长到短排序，确保长短语优先匹配）
  const sortedPhrases = Object.entries(phraseTranslations).sort((a, b) => b[0].length - a[0].length)
  for (const [en, de] of sortedPhrases) {
    translated = translated.replace(new RegExp(escapeRegex(en), 'gi'), de)
  }
  
  // 然后处理单个词汇（如果还没有被短语替换）
  // 但跳过在URL路径和HTML属性中的单词
  for (const [en, de] of Object.entries(translations)) {
    // 跳过不应该被翻译的单词（在URL或HTML属性中）
    if (en === 'font' || en === 'generator' || en === 'Font' || en === 'Generator') {
      continue // 这些词在URL和类名中，不应该被替换
    }
    
    // 使用单词边界来避免部分匹配
    const regex = new RegExp(`\\b${escapeRegex(en)}\\b`, 'gi')
    if (!phraseTranslations[en]) {
      translated = translated.replace(regex, (match, offset, string) => {
        // 检查是否在HTML属性或URL中
        const before = string.substring(0, offset)
        const after = string.substring(offset + match.length)
        
        // 如果在 href="..." 或 class="..." 中，不翻译
        if (before.match(/href=["'][^"']*$/i) || before.match(/class=["'][^"']*$/i)) {
          return match
        }
        
        // 保持原始大小写
        if (match === match.toUpperCase()) return de.toUpperCase()
        if (match[0] === match[0].toUpperCase()) return de.charAt(0).toUpperCase() + de.slice(1)
        return de.toLowerCase()
      })
    }
  }
  
  return translated
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// 保护HTML属性和URL不被翻译
function protectHtmlAndUrls(text) {
  // 保护URL路径（如 /font-generator/xxx）
  text = text.replace(/(href=["'])([^"']*)(["'])/gi, (match, prefix, url, suffix) => {
    return prefix + url + suffix
  })
  
  // 保护HTML属性中的类名（如 class="font-semibold"）
  text = text.replace(/(class=["'])([^"']*)(["'])/gi, (match, prefix, classes, suffix) => {
    return prefix + classes + suffix
  })
  
  return text
}

// 恢复被错误翻译的URL和类名
function restoreHtmlAndUrls(text) {
  // 恢复URL路径
  text = text.replace(/schrift-generatoder/g, 'font-generator')
  text = text.replace(/schrift-generator/g, 'font-generator')
  
  // 恢复HTML类名
  text = text.replace(/schrift-semibold/g, 'font-semibold')
  text = text.replace(/decoderation/g, 'decoration')
  
  // 恢复其他被错误替换的单词
  text = text.replace(/generatoder/g, 'generator')
  text = text.replace(/foderm/g, 'form')
  text = text.replace(/fodermat/g, 'format')
  text = text.replace(/fodermatierung/g, 'Formatierung')
  text = text.replace(/dodert/g, 'dort')
  
  // 修复 "yunser" -> "Ihr"
  text = text.replace(/\byunser\b/gi, (match) => {
    if (match === match.toUpperCase()) return 'IHR'
    if (match[0] === match[0].toUpperCase()) return 'Ihr'
    return 'ihr'
  })
  
  // 修复 "coderrectly" -> "korrekt"
  text = text.replace(/coderrectly/gi, 'korrekt')
  text = text.replace(/display coderrectly/gi, 'werden korrekt angezeigt')
  text = text.replace(/that display coderrectly/gi, 'die korrekt angezeigt werden')
  
  // 修复混合英语和德语的短语
  text = text.replace(/Generieren Schriften that display/gi, 'Generieren Sie Schriften, die angezeigt werden')
  text = text.replace(/Generieren Schriften die korrekt angezeigt werden in/gi, 'Generieren Sie Schriften, die korrekt in')
  text = text.replace(/Transform yunser text/gi, 'Transformieren Sie Ihren Text')
  text = text.replace(/Transform ihr text/gi, 'Transformieren Sie Ihren Text')
  text = text.replace(/Kopieren yunser/gi, 'Kopieren Sie Ihren')
  text = text.replace(/Kopieren ihr/gi, 'Kopieren Sie Ihren')
  text = text.replace(/einfügen it into/gi, 'fügen Sie es in')
  text = text.replace(/oder chat/gi, 'oder Chat')
  text = text.replace(/with live vorschau/gi, 'mit Live-Vorschau')
  text = text.replace(/happens entirely in yunser browser/gi, 'erfolgt vollständig in Ihrem Browser')
  text = text.replace(/happens entirely in ihr browser/gi, 'erfolgt vollständig in Ihrem Browser')
  text = text.replace(/yunser text stays/gi, 'Ihr Text bleibt')
  text = text.replace(/ihr text stays/gi, 'Ihr Text bleibt')
  text = text.replace(/on yunser device/gi, 'auf Ihrem Gerät')
  text = text.replace(/on ihr device/gi, 'auf Ihrem Gerät')
  text = text.replace(/immediately and fügen/gi, 'sofort und fügen')
  text = text.replace(/Server names, channels, and chat messages/gi, 'Servernamen, Kanälen und Chat-Nachrichten')
  text = text.replace(/Server names, channels, oder Chat/gi, 'Servernamen, Kanälen oder Chat')
  
  // 修复 "Font generation" -> "Die Schriftgenerierung"
  text = text.replace(/Font generation erfolgt/gi, 'Die Schriftgenerierung erfolgt')
  text = text.replace(/Font generation happens/gi, 'Die Schriftgenerierung erfolgt')
  
  // 修复 "to Discord-compatible" -> "in Discord-kompatible"
  text = text.replace(/to Discord-compatible/gi, 'in Discord-kompatible')
  text = text.replace(/to Discord-kompatible/gi, 'in Discord-kompatible')
  text = text.replace(/Ihren Text to Discord-compatible/gi, 'Ihren Text in Discord-kompatible')
  text = text.replace(/Text to Discord-compatible/gi, 'Text in Discord-kompatible')
  
  // 修复 "Discord text" -> "Discord-Text"
  text = text.replace(/\bDiscord text\b/gi, 'Discord-Text')
  text = text.replace(/Discord text sofort/gi, 'Discord-Text sofort')
  text = text.replace(/Discord text immediately/gi, 'Discord-Text sofort')
  text = text.replace(/Ihren Discord text/gi, 'Ihren Discord-Text')
  text = text.replace(/Sofodertige/g, 'Sofortige')
  text = text.replace(/Sofodertigeige/g, 'Sofortige')
  text = text.replace(/Sofodertigeigen/g, 'Sofortigen')
  text = text.replace(/Sofodertigeigem/g, 'Sofortigem')
  text = text.replace(/koderr/g, 'korr')
  text = text.replace(/koderrekt/g, 'korrekt')
  text = text.replace(/koderr/g, 'korr')
  text = text.replace(/Stodery/g, 'Story')
  text = text.replace(/Stoderies/g, 'Stories')
  text = text.replace(/Discoderd/g, 'Discord')
  text = text.replace(/discoderd/g, 'discord')
  text = text.replace(/Hoderroder/g, 'Horror')
  text = text.replace(/hoderroder/g, 'horror')
  text = text.replace(/histoderisch/g, 'historisch')
  text = text.replace(/histoderische/g, 'historische')
  text = text.replace(/histoderischen/g, 'historischen')
  text = text.replace(/autoderitative/g, 'autoritative')
  text = text.replace(/erfoderdert/g, 'erfordert')
  text = text.replace(/erfoderdert/g, 'erfordert')
  text = text.replace(/sodergt/g, 'sorgt')
  text = text.replace(/hervodersticht/g, 'hervorsticht')
  text = text.replace(/hervodersticht/g, 'hervorsticht')
  text = text.replace(/Plattfoderm/g, 'Plattform')
  text = text.replace(/Plattfodermen/g, 'Plattformen')
  text = text.replace(/Buchstabenfodermen/g, 'Buchstabenformen')
  text = text.replace(/Buchstabenfoderm/g, 'Buchstabenform')
  text = text.replace(/TextStile/g, 'Textstile')
  text = text.replace(/TextStilen/g, 'Textstilen')
  text = text.replace(/SchriftStile/g, 'Schriftstile')
  text = text.replace(/SchriftStilen/g, 'Schriftstilen')
  text = text.replace(/SchriftStil/g, 'Schriftstil')
  text = text.replace(/Verwenden Siers/g, 'Benutzer')
  text = text.replace(/Verwenden Sie/g, 'Verwenden Sie')
  text = text.replace(/foder/g, 'für')
  text = text.replace(/woderk/g, 'work')
  text = text.replace(/woderk/g, 'work')
  text = text.replace(/oder/g, 'oder')
  text = text.replace(/explodere/g, 'erkunden')
  text = text.replace(/Unser/g, 'unser')
  
  // 修复大小写和复数问题
  text = text.replace(/Fodermatierungen/g, 'Formatierungen')
  text = text.replace(/Fodermatierung/g, 'Formatierung')
  text = text.replace(/unserenen/g, 'unseren')
  text = text.replace(/unserenem/g, 'unserem')
  text = text.replace(/unseren Fetttext/g, 'Unser Fetttext')
  text = text.replace(/unseren Tool/g, 'Unser Tool')
  text = text.replace(/unseren Generator/g, 'Unser Generator')
  text = text.replace(/unseren Schriftgenerator/g, 'Unser Schriftgenerator')
  text = text.replace(/probieren Sie unserenen/g, 'probieren Sie unseren')
  text = text.replace(/mit unserenem/g, 'mit unserem')
  text = text.replace(/für mehr fette Stilen/g, 'für mehr fette Stile')
  text = text.replace(/mehr Stilen mit/g, 'mehr Stile mit')
  text = text.replace(/mit Stilen/g, 'mit Stile')
  text = text.replace(/Text Sofortige/g, 'Text sofort')
  text = text.replace(/jeden Text Sofortige/g, 'jeden Text sofort')
  text = text.replace(/Sofortige in einen/g, 'sofort in einen')
  
  // 修复常见拼写错误
  text = text.replace(/kursivee\b/gi, 'kursive')
  text = text.replace(/kursiveen\b/gi, 'kursiven')
  text = text.replace(/kursiveeen\b/gi, 'kursiven')
  text = text.replace(/kursiveem\b/gi, 'kursivem')
  text = text.replace(/erfürderlich\b/gi, 'erforderlich')
  text = text.replace(/erfürdern\b/gi, 'erfordern')
  text = text.replace(/Sofortigeige\b/gi, 'Sofortige')
  text = text.replace(/schönee\b/gi, 'schöne')
  text = text.replace(/Schriftstilenn\b/gi, 'Schriftstilen')
  text = text.replace(/Schriftstilenn\b/gi, 'Schriftstilen')
  text = text.replace(/dekoderative\b/gi, 'dekorative')
  text = text.replace(/dekoderativen\b/gi, 'dekorativen')
  text = text.replace(/eleganteen\b/gi, 'elegante')
  text = text.replace(/elegantee\b/gi, 'elegante')
  text = text.replace(/eleganteen\b/gi, 'eleganten')
  text = text.replace(/Unbegrenztee\b/gi, 'Unbegrenzte')
  text = text.replace(/Voderschau\b/gi, 'Vorschau')
  text = text.replace(/Echtzeit-Voderschau\b/gi, 'Echtzeit-Vorschau')
  text = text.replace(/Voderschau\b/gi, 'Vorschau')
  text = text.replace(/Explodere\b/gi, 'Erkunden Sie')
  text = text.replace(/Explodere unser\b/gi, 'Erkunden Sie unseren')
  text = text.replace(/unserener\b/gi, 'unserer')
  text = text.replace(/unserener umfassenden\b/gi, 'unserer umfassenden')
  text = text.replace(/unserener Sammlung\b/gi, 'unserer Sammlung')
  text = text.replace(/Generatoder\b/gi, 'Generator')
  text = text.replace(/Generatoders\b/gi, 'Generators')
  text = text.replace(/Herausfürderung\b/gi, 'Herausforderung')
  text = text.replace(/Sofortigeigen\b/gi, 'sofortigen')
  text = text.replace(/Sofortigeigen Zugang\b/gi, 'sofortigen Zugang')
  text = text.replace(/Textstilenn\b/gi, 'Textstilen')
  text = text.replace(/Schriftstilenn\b/gi, 'Schriftstilen')
  text = text.replace(/Stilenn\b/gi, 'Stilen')
  text = text.replace(/modere\b/gi, 'moderne')
  text = text.replace(/ihr text\b/gi, 'Ihr Text')
  text = text.replace(/ihr browser\b/gi, 'Ihrem Browser')
  text = text.replace(/ihr device\b/gi, 'Ihrem Gerät')
  text = text.replace(/ihr design\b/gi, 'Ihr Design')
  text = text.replace(/ihr artist\b/gi, 'Ihrem Künstler')
  text = text.replace(/ihr tattoo\b/gi, 'Ihr Tattoo')
  text = text.replace(/ihr name\b/gi, 'Ihr Name')
  text = text.replace(/ihr content\b/gi, 'Ihr Content')
  text = text.replace(/ihr message\b/gi, 'Ihre Nachricht')
  text = text.replace(/ihr emails\b/gi, 'Ihre E-Mails')
  text = text.replace(/ihr brand identity\b/gi, 'Ihre Markenidentität')
  text = text.replace(/ihr target device\b/gi, 'Ihrem Zielgerät')
  
  // 修复更多常见错误
  text = text.replace(/kursiveer\b/gi, 'kursiver')
  text = text.replace(/kursiveer Text\b/gi, 'kursiver Text')
  text = text.replace(/kursiveer Generator\b/gi, 'kursiver Generator')
  text = text.replace(/schöneen\b/gi, 'schönen')
  text = text.replace(/Sofortigeigem\b/gi, 'sofortigem')
  text = text.replace(/unserener\b/gi, 'unserer')
  text = text.replace(/unserener umfassenden\b/gi, 'unserer umfassenden')
  text = text.replace(/unserener Sammlung\b/gi, 'unserer Sammlung')
  text = text.replace(/unserener\b/gi, 'unserer')
  text = text.replace(/suppoderts\b/gi, 'unterstützt')
  text = text.replace(/including\b/gi, 'einschließlich')
  text = text.replace(/all available stile\b/gi, 'alle verfügbaren Stile')
  text = text.replace(/in echtzeit\b/gi, 'in Echtzeit')
  text = text.replace(/many moderne\b/gi, 'viele moderne')
  text = text.replace(/vorschau all\b/gi, 'Vorschau aller')
  text = text.replace(/specific stile\b/gi, 'spezifische Stile')
  text = text.replace(/für specific\b/gi, 'für spezifische')
  text = text.replace(/distinctive Text\b/gi, 'unterscheidbaren Text')
  text = text.replace(/distinctive text\b/gi, 'unterscheidbaren Text')
  text = text.replace(/styled Text\b/gi, 'formatierter Text')
  text = text.replace(/styled text\b/gi, 'formatierter Text')
  text = text.replace(/quick styled\b/gi, 'schnell formatierte')
  text = text.replace(/Mehrere schön\b/gi, 'mehrere schöne')
  text = text.replace(/Mehrere Schriftstilen\b/gi, 'Mehrere Schriftstile')
  text = text.replace(/Mehrere schön stile\b/gi, 'mehrere schöne Stile')
  text = text.replace(/and moderne\b/gi, 'und moderne')
  text = text.replace(/and modere\b/gi, 'und moderne')
  text = text.replace(/perfekt für\b/gi, 'perfekt für')
  text = text.replace(/perfekt für Social-Media-Nutzer\b/gi, 'perfekt für Social-Media-Nutzer')
  text = text.replace(/who want\b/gi, 'die möchten')
  text = text.replace(/as well as\b/gi, 'sowie')
  text = text.replace(/who need\b/gi, 'die benötigen')
  text = text.replace(/for mockups\b/gi, 'für Mockups')
  text = text.replace(/and presentations\b/gi, 'und Präsentationen')
  text = text.replace(/Erkunden Sie unser\b/gi, 'Erkunden Sie unseren')
  text = text.replace(/Erkunden Sie unser\b/gi, 'Erkunden Sie unseren')
  text = text.replace(/Try unser\b/gi, 'Probieren Sie unseren')
  text = text.replace(/unser popular\b/gi, 'unseren beliebten')
  text = text.replace(/unser Schriftgenerator\b/gi, 'unser Schriftgenerator')
  text = text.replace(/unser Tool\b/gi, 'unser Tool')
  text = text.replace(/unser Generator\b/gi, 'unser Generator')
  text = text.replace(/unser Schriftgenerator lets\b/gi, 'unser Schriftgenerator ermöglicht es Ihnen')
  text = text.replace(/lets you\b/gi, 'ermöglicht es Ihnen')
  text = text.replace(/sofort transform\b/gi, 'sofort zu transformieren')
  text = text.replace(/transform any text\b/gi, 'jeden Text zu transformieren')
  text = text.replace(/without downloading\b/gi, 'ohne herunterzuladen')
  text = text.replace(/without installing\b/gi, 'ohne zu installieren')
  text = text.replace(/oder installing\b/gi, 'oder zu installieren')
  text = text.replace(/oder using\b/gi, 'oder zu verwenden')
  text = text.replace(/It allows you to\b/gi, 'Es ermöglicht Ihnen')
  text = text.replace(/allows you to erstellen\b/gi, 'ermöglicht es Ihnen zu erstellen')
  text = text.replace(/erstellen schön\b/gi, 'schöne zu erstellen')
  text = text.replace(/distinctive text stile\b/gi, 'unterscheidbare Textstile')
  text = text.replace(/are perfect für\b/gi, 'sind perfekt für')
  text = text.replace(/Schriftgenerators are perfect\b/gi, 'Schriftgeneratoren sind perfekt')
  text = text.replace(/anywhere you want\b/gi, 'überall, wo Sie möchten')
  text = text.replace(/to add visual flair\b/gi, 'visuellen Flair hinzuzufügen')
  text = text.replace(/to Ihr Text\b/gi, 'zu Ihrem Text')
  text = text.replace(/to get started\b/gi, 'um zu beginnen')
  text = text.replace(/oder fetten Schriftgenerator to get started\b/gi, 'oder fetten Schriftgenerator, um zu beginnen')
  text = text.replace(/Creating styled text\b/gi, 'Die Erstellung von formatiertem Text')
  text = text.replace(/manually requires\b/gi, 'erfordert manuell')
  text = text.replace(/design software\b/gi, 'Design-Software')
  text = text.replace(/font installation\b/gi, 'Schriftinstallation')
  text = text.replace(/and technical knowledge\b/gi, 'und technisches Wissen')
  text = text.replace(/A Schriftgenerator is\b/gi, 'Ein Schriftgenerator ist')
  text = text.replace(/is an online tool\b/gi, 'ist ein Online-Tool')
  text = text.replace(/that transforms\b/gi, 'das transformiert')
  text = text.replace(/plain text\b/gi, 'Klartext')
  text = text.replace(/into styled text\b/gi, 'in formatierten Text')
  text = text.replace(/using Unicode zeichen\b/gi, 'mit Unicode-Zeichen')
  text = text.replace(/using Unicode characters\b/gi, 'mit Unicode-Zeichen')
  
  return text
}

// 翻译JSON对象
function translateJsonObject(obj, depth = 0) {
  if (depth > 10) return obj // 防止无限递归
  
  if (typeof obj === 'string') {
    // 先保护HTML和URL
    let protected = protectHtmlAndUrls(obj)
    
    // 如果是HTML链接，需要特殊处理
    if (protected.includes('<a href=')) {
      // 保持链接结构，只翻译链接文本内容
      let result = protected
      // 先翻译完整的句子（可能包含多个链接）
      result = translateToGerman(result)
      // 然后确保链接内的文本也被正确翻译
      result = result.replace(/(<a[^>]*>)([^<]+)(<\/a>)/gi, (match, openTag, linkText, closeTag) => {
        // 如果链接文本还没有被翻译（仍然是英文），再次翻译
        if (linkText && !linkText.match(/[äöüÄÖÜß]/)) {
          return openTag + translateToGerman(linkText) + closeTag
        }
        return match
      })
      // 恢复被错误翻译的URL和类名
      return restoreHtmlAndUrls(result)
    }
    
    // 翻译普通文本
    let translated = translateToGerman(protected)
    // 恢复被错误翻译的URL和类名
    return restoreHtmlAndUrls(translated)
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => translateJsonObject(item, depth + 1))
  }
  
  if (obj && typeof obj === 'object') {
    const translated = {}
    for (const [key, value] of Object.entries(obj)) {
      // 跳过某些不需要翻译的键
      if (key === 'sectionsOrder' || key === 'iconType' || key === 'icon') {
        translated[key] = value
      } else {
        translated[key] = translateJsonObject(value, depth + 1)
      }
    }
    return translated
  }
  
  return obj
}

// 主函数
function main() {
  const enDir = path.join(__dirname, '../src/data/en/font-generator')
  const deDir = path.join(__dirname, '../src/data/de/font-generator')
  const enL2File = path.join(__dirname, '../src/data/en/font-generator.json')
  const deL2File = path.join(__dirname, '../src/data/de/font-generator.json')
  
  // 确保德语目录存在
  if (!fs.existsSync(deDir)) {
    fs.mkdirSync(deDir, { recursive: true })
  }
  
  // 翻译L2页面
  console.log('翻译 L2 页面...')
  const enL2Data = JSON.parse(fs.readFileSync(enL2File, 'utf8'))
  const deL2Data = translateJsonObject(enL2Data)
  fs.writeFileSync(deL2File, JSON.stringify(deL2Data, null, 2), 'utf8')
  console.log('✓ L2 页面翻译完成')
  
  // 翻译所有L3页面
  const files = fs.readdirSync(enDir).filter(f => f.endsWith('.json'))
  console.log(`\n找到 ${files.length} 个 L3 页面文件`)
  
  for (const file of files) {
    console.log(`翻译 ${file}...`)
    const enFilePath = path.join(enDir, file)
    const deFilePath = path.join(deDir, file)
    
    const enData = JSON.parse(fs.readFileSync(enFilePath, 'utf8'))
    const deData = translateJsonObject(enData)
    
    fs.writeFileSync(deFilePath, JSON.stringify(deData, null, 2), 'utf8')
    console.log(`✓ ${file} 翻译完成`)
  }
  
  console.log('\n✅ 所有文件翻译完成！')
}

main()
