export const SUPPORTED_WORLD_CUP_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'] as const

export type WorldCupPageLocale = (typeof SUPPORTED_WORLD_CUP_LOCALES)[number]

interface TextCard {
  title: string
  text: string
}

interface TemplateStyleRow {
  style: string
  bestFor: string
  promptFocus: string
  example: string
}

interface FaqItem {
  q: string
  a: string
}

export interface WorldCupPageCopy {
  metadata: {
    title: string
    description: string
  }
  breadcrumbs: {
    home: string
    aiTools: string
    current: string
  }
  hero: {
    highlight: string
    suffix: string
    description: string
  }
  templateSection: {
    eyebrow: string
    title: string
    description: string
  }
  templateGallery: {
    copyPrompt: string
    copied: string
    createSimilar: string
    altSuffix: string
    allCategory: string
    templateTitlePrefix: string
  }
  whatToMake: {
    eyebrow: string
    title: string
    description: string
    cards: TextCard[]
  }
  formats: {
    eyebrow: string
    title: string
    description: string
    cards: TextCard[]
  }
  howTo: {
    eyebrow: string
    title: string
    description: string
    stepLabel: string
    schemaName: string
    steps: TextCard[]
  }
  promptTips: {
    eyebrow: string
    title: string
    description: string
    cards: TextCard[]
  }
  templateStyles: {
    eyebrow: string
    title: string
    description: string
    headers: {
      style: string
      bestFor: string
      promptFocus: string
      example: string
    }
    rows: TemplateStyleRow[]
  }
  ideas: {
    eyebrow: string
    title: string
    description: string
    cards: TextCard[]
  }
  why: {
    eyebrow: string
    title: string
    description: string
    bullets: string[]
  }
  faq: {
    eyebrow: string
    title: string
    description: string
    items: FaqItem[]
  }
  cta: {
    title: string
    description: string
    button: string
  }
}

interface LocalePhraseSet {
  metadataTitle: string
  metadataDescription: string
  home: string
  aiTools: string
  current: string
  heroHighlight: string
  heroSuffix: string
  heroDescription: string
  templateEyebrow: string
  templateTitle: string
  templateDescription: string
  copyPrompt: string
  copied: string
  createSimilar: string
  altSuffix: string
  allCategory: string
  templateTitlePrefix: string
  whatEyebrow: string
  whatTitle: string
  whatDescription: string
  cards: {
    workflow: TextCard
    reference: TextCard
    social: TextCard
    selfie: TextCard
    colors: TextCard
    stickers: TextCard
    friends: TextCard
    cards: TextCard
    travel: TextCard
  }
  formatsEyebrow: string
  formatsTitle: string
  formatsDescription: string
  howEyebrow: string
  howTitle: string
  howDescription: string
  stepLabel: string
  schemaName: string
  steps: TextCard[]
  promptEyebrow: string
  promptTitle: string
  promptDescription: string
  promptCards: TextCard[]
  styleEyebrow: string
  styleTitle: string
  styleDescription: string
  styleHeaders: {
    style: string
    bestFor: string
    promptFocus: string
    example: string
  }
  styleRows: TemplateStyleRow[]
  ideasEyebrow: string
  ideasTitle: string
  ideasDescription: string
  ideas: TextCard[]
  whyEyebrow: string
  whyTitle: string
  whyDescription: string
  whyBullets: string[]
  faqEyebrow: string
  faqTitle: string
  faqDescription: string
  faqs: FaqItem[]
  ctaTitle: string
  ctaDescription: string
  ctaButton: string
}

function buildCopy(p: LocalePhraseSet): WorldCupPageCopy {
  return {
    metadata: {
      title: p.metadataTitle,
      description: p.metadataDescription,
    },
    breadcrumbs: {
      home: p.home,
      aiTools: p.aiTools,
      current: p.current,
    },
    hero: {
      highlight: p.heroHighlight,
      suffix: p.heroSuffix,
      description: p.heroDescription,
    },
    templateSection: {
      eyebrow: p.templateEyebrow,
      title: p.templateTitle,
      description: p.templateDescription,
    },
    templateGallery: {
      copyPrompt: p.copyPrompt,
      copied: p.copied,
      createSimilar: p.createSimilar,
      altSuffix: p.altSuffix,
      allCategory: p.allCategory,
      templateTitlePrefix: p.templateTitlePrefix,
    },
    whatToMake: {
      eyebrow: p.whatEyebrow,
      title: p.whatTitle,
      description: p.whatDescription,
      cards: [p.cards.workflow, p.cards.reference, p.cards.social],
    },
    formats: {
      eyebrow: p.formatsEyebrow,
      title: p.formatsTitle,
      description: p.formatsDescription,
      cards: [p.cards.selfie, p.cards.colors, p.cards.stickers, p.cards.friends, p.cards.cards, p.cards.travel],
    },
    howTo: {
      eyebrow: p.howEyebrow,
      title: p.howTitle,
      description: p.howDescription,
      stepLabel: p.stepLabel,
      schemaName: p.schemaName,
      steps: p.steps,
    },
    promptTips: {
      eyebrow: p.promptEyebrow,
      title: p.promptTitle,
      description: p.promptDescription,
      cards: p.promptCards,
    },
    templateStyles: {
      eyebrow: p.styleEyebrow,
      title: p.styleTitle,
      description: p.styleDescription,
      headers: p.styleHeaders,
      rows: p.styleRows,
    },
    ideas: {
      eyebrow: p.ideasEyebrow,
      title: p.ideasTitle,
      description: p.ideasDescription,
      cards: p.ideas,
    },
    why: {
      eyebrow: p.whyEyebrow,
      title: p.whyTitle,
      description: p.whyDescription,
      bullets: p.whyBullets,
    },
    faq: {
      eyebrow: p.faqEyebrow,
      title: p.faqTitle,
      description: p.faqDescription,
      items: p.faqs,
    },
    cta: {
      title: p.ctaTitle,
      description: p.ctaDescription,
      button: p.ctaButton,
    },
  }
}

const en = buildCopy({
  metadataTitle: 'World Cup AI Image Generator | AI Football Posters & Fan Photos | Toolaze',
  metadataDescription:
    'Create World Cup inspired AI football posters, fan selfies, country-color portraits, sticker packs, watch-party flyers, and social images with GPT Image 2 on Toolaze.',
  home: 'Home',
  aiTools: 'AI Tools',
  current: 'World Cup AI Image Generator',
  heroHighlight: 'World Cup AI',
  heroSuffix: 'Image Generator',
  heroDescription:
    'Create football fan posters, selfie edits, country-color portraits, sticker packs, watch-party flyers, and social images with GPT Image 2 directly in your browser.',
  templateEyebrow: 'Image Templates',
  templateTitle: 'Choose a World Cup Image Template and Create a Similar One',
  templateDescription:
    'Start from the football image directions we already generated: fan posters, meme reactions, sticker packs, watch-party flyers, countdowns, collages, and fan cards. Click a template to send its image and prompt back to the GPT Image 2 editor above.',
  copyPrompt: 'Copy Prompt',
  copied: 'Copied',
  createSimilar: 'Create Similar',
  altSuffix: 'World Cup AI image template',
  allCategory: 'All',
  templateTitlePrefix: 'Template',
  whatEyebrow: 'What to make',
  whatTitle: 'What can you create with this World Cup AI image generator?',
  whatDescription:
    'Use GPT Image 2 as an AI football poster generator and football fan poster maker. Start with a selfie, a template, or a short prompt, then create a still image ready for social posts, thumbnails, flyers, and fan graphics.',
  cards: {
    workflow: { title: 'Template-to-image workflow', text: 'Pick a football template, send its prompt and reference image into the generator, then create a similar image with your own selfie or idea.' },
    reference: { title: 'Selfie and reference friendly', text: 'Use a portrait, couple photo, group selfie, or simple reference image to guide the face, pose, styling, and football fan atmosphere.' },
    social: { title: 'Social-ready formats', text: 'Create vertical posters, fan portraits, sticker sheets, watch-party flyers, comic reactions, and collectible-style cards for everyday publishing.' },
    selfie: { title: 'Fan selfie portraits', text: 'Turn a clear portrait into a stadium-lit supporter image with face paint, scarf energy, fan-zone lights, and natural likeness.' },
    colors: { title: 'Country-color cheer photos', text: 'Create Brazil-inspired, Argentina-inspired, France-inspired, Mexico-inspired, Portugal-inspired, or custom color fan looks.' },
    stickers: { title: 'Face flag sticker selfies', text: 'Make close-up fan selfies with glossy cheek stickers, subtle glitter, soft stadium bokeh, and polished creator styling.' },
    friends: { title: 'Couple and friend fan photos', text: 'Generate mixed fan duos, friendly rival poses, best-friend selfies, and group fan-zone photos with different color themes.' },
    cards: { title: 'Fan trading cards', text: 'Create collectible-style portrait cards with foil borders, fictional fan stats, bold numbers, and premium sports-card energy.' },
    travel: { title: 'Boarding-pass travel graphics', text: 'Design travel-style football graphics with host-city routes, gate details, seat labels, and a portrait-led souvenir layout.' },
  },
  formatsEyebrow: 'Image formats',
  formatsTitle: 'Create football fan photos, posters, stickers, cards, and flyers',
  formatsDescription:
    'The template gallery already covers the most useful image directions: country-color cheer photos, face flag sticker selfies, couple and friend fan photos, fan trading cards, comic reactions, and boarding-pass travel graphics.',
  howEyebrow: 'How to create',
  howTitle: 'How to make a World Cup AI image',
  howDescription:
    'Keep the process simple: upload a clear reference when faces matter, choose a template style, describe the football scene, generate a few versions, and keep the strongest image.',
  stepLabel: 'Step',
  schemaName: 'How to create a World Cup AI image',
  steps: [
    { title: 'Upload a selfie or start from text', text: 'Use a clear portrait when you want a recognizable fan image, or start with a text prompt when the output is a flyer, sticker pack, poster, or graphic concept.' },
    { title: 'Pick a template style', text: 'Choose a template from the gallery or describe the format yourself: close-up selfie, cheer poster, trading card, comic panel, photo booth sheet, or watch-party flyer.' },
    { title: 'Add the football details', text: 'Include the scene, color palette, pose, expression, face stickers, scarf, confetti, lighting, and short headline you want the image to use.' },
    { title: 'Generate and compare versions', text: 'Run a few variations and keep the image with the best face, cleanest text, strongest composition, and most useful crop for your social channel.' },
    { title: 'Download or remix', text: 'Save the best result, copy the prompt, or return to the template gallery and create another version with a different color theme or fan-photo style.' },
  ],
  promptEyebrow: 'Prompt tips',
  promptTitle: 'Prompt tips for better football images',
  promptDescription:
    'A good football image prompt does not need to be long. It needs the right building blocks: subject, format, mood, colors, and a small amount of readable text.',
  promptCards: [
    { title: 'Subject', text: 'Start with one clear subject: a selfie, couple, friend group, sticker pack, watch-party scene, trading card, or travel poster.' },
    { title: 'Format', text: 'Name the output shape early: vertical poster, close-up selfie, photo booth sheet, flyer, comic strip, newspaper front page, or fan card.' },
    { title: 'Mood', text: 'Set a specific scene: stadium bokeh, street fan parade, morning match preview, fan-zone lights, confetti, phone-photo energy, or editorial lighting.' },
    { title: 'Colors', text: 'Use country-color language without needing official kit details: green and yellow, sky blue and white, blue white red, red green, black red gold.' },
    { title: 'Text', text: 'Keep generated text short. One headline such as Match Day, Fan Zone, Watch Party, or Summer Football works better than a crowded flyer.' },
  ],
  styleEyebrow: 'Template styles',
  styleTitle: 'Choose a template style',
  styleDescription:
    'Different image formats need different prompts. Use this quick guide when you want to move from a gallery template to a new football image idea.',
  styleHeaders: { style: 'Style', bestFor: 'Best for', promptFocus: 'Prompt focus', example: 'Gallery example' },
  styleRows: [
    { style: 'Selfie fan portrait', bestFor: 'Profile edits, story posts, fan-zone images, and personal match-day graphics', promptFocus: 'Face likeness, cheek stickers, color theme, stadium bokeh, natural expression', example: 'Face Flag Sticker Selfie' },
    { style: 'Couple or friend fan photo', bestFor: 'Duo edits, friendly rival posts, group selfies, and creator community images', promptFocus: 'Number of people, relationship pose, color contrast, fan-zone lighting', example: 'Couple Rival Fans' },
    { style: 'Graphic poster or card', bestFor: 'Fan trading cards, newspaper covers, Swiss posters, and collectible images', promptFocus: 'Layout, headline, typography style, borders, fictional details, clean spacing', example: 'Fan Trading Card Foil' },
    { style: 'Sticker or icon pack', bestFor: 'Creator kits, thumbnails, merch concepts, story stickers, and article art', promptFocus: 'Separate objects, consistent outline style, soft shadow, balanced grid', example: 'Football Fan Sticker Pack' },
    { style: 'Event flyer', bestFor: 'Watch-party invites, bar promos, viewing-night graphics, and local event posts', promptFocus: 'Venue mood, empty text space, crowd energy, snacks, drinks, readable headline', example: 'Watch Party Flyer' },
  ],
  ideasEyebrow: 'Image ideas',
  ideasTitle: 'World Cup AI image ideas for creators and small businesses',
  ideasDescription:
    'Use the generator for quick visual assets around football season: profile updates, creator posts, event graphics, thumbnails, sticker kits, and travel-style recaps.',
  ideas: [
    { title: 'Instagram story covers', text: 'Vertical fan portraits, face-paint close-ups, and match-day posters with space for short captions.' },
    { title: 'TikTok and Shorts thumbnails', text: 'High-energy selfies, shocked reactions, comic panels, and bold graphic cards that read quickly on small screens.' },
    { title: 'Watch-party flyers', text: 'Event graphics for bars, creators, campuses, clubs, and local viewing nights.' },
    { title: 'Fan profile images', text: 'Country-color fan portraits, cheek sticker looks, scarf poses, and polished profile-ready crops.' },
    { title: 'Sticker packs', text: 'Football icons, fan-kit illustrations, badge-like graphics, and playful objects for creator bundles.' },
    { title: 'Travel recap graphics', text: 'Boarding-pass cards, retro tour posters, city-route layouts, and souvenir-style match trip images.' },
  ],
  whyEyebrow: 'Why Toolaze',
  whyTitle: 'Why use Toolaze for World Cup AI images?',
  whyDescription:
    'Toolaze combines a real GPT Image 2 generator with a large football template gallery. You can copy prompts, create similar images, and bring reference photos into the top generator without rebuilding the idea from scratch.',
  whyBullets: [
    'Start from real generated football templates instead of a blank prompt box.',
    'Copy any prompt or send a template reference image into the generator with one click.',
    'Use selfie, couple, and group references for fan portraits and social images.',
    'Create still images for posts, thumbnails, flyers, stickers, profile photos, and creator graphics.',
  ],
  faqEyebrow: 'FAQ',
  faqTitle: 'World Cup AI content questions',
  faqDescription:
    'Short answers for creators making football-inspired images, fan portraits, stickers, flyers, thumbnails, and social posts.',
  faqs: [
    { q: 'What is a World Cup AI image generator?', a: 'A World Cup AI image generator helps you create football-inspired posters, fan portraits, stickers, flyers, and social graphics from text prompts or reference images.' },
    { q: 'Can I use my selfie to make a football fan image?', a: 'Yes. Upload a clear selfie, choose a template or write a prompt, and GPT Image 2 can create a fan portrait while keeping the main face recognizable.' },
    { q: 'Can I create country-color fan portraits?', a: 'Yes. You can describe color themes such as green and yellow, sky blue and white, blue white red, red green, or custom palettes for your fan image.' },
    { q: 'Can I make couple or friend football images?', a: 'Yes. Use a couple or group reference image, or start from the couple and friend templates in the gallery to create duo and group fan photos.' },
    { q: 'Does this page generate videos?', a: 'No. This page generates still images with GPT Image 2. Use it for posters, selfies, flyers, stickers, thumbnails, and other image assets.' },
    { q: 'What should I write in a football AI image prompt?', a: 'Include the subject, format, scene, colors, style, and short image text. For example: close-up fan selfie, red and green cheek stickers, stadium bokeh, editorial lighting.' },
    { q: 'Can I make watch-party flyers or sticker packs?', a: 'Yes. The generator can create watch-party flyers, football sticker sheets, fan-kit icons, social covers, and creator graphics from a written prompt.' },
    { q: 'Is Toolaze affiliated with FIFA?', a: 'Toolaze is an independent creative tool and is not affiliated with FIFA.' },
  ],
  ctaTitle: 'Create your World Cup AI image with GPT Image 2',
  ctaDescription:
    'Choose a template, upload a selfie or reference image, and generate a football fan poster, sticker pack, watch-party flyer, or social image in your browser.',
  ctaButton: 'Generate image',
})

const de = buildCopy({
  metadataTitle: 'WM-KI-Bildgenerator | KI-Fußballposter und Fanbilder | Toolaze',
  metadataDescription: 'Erstelle WM-inspirierte KI-Fußballposter, Fan-Selfies, Porträts in Länderfarben, Stickerpacks, Watch-Party-Flyer und Social-Media-Bilder mit GPT Image 2 auf Toolaze.',
  home: 'Startseite',
  aiTools: 'KI-Tools',
  current: 'WM-KI-Bildgenerator',
  heroHighlight: 'WM-KI',
  heroSuffix: 'Bildgenerator',
  heroDescription: 'Erstelle Fußball-Fanposter, Selfie-Edits, Porträts in Länderfarben, Stickerpacks, Watch-Party-Flyer und Social-Media-Bilder mit GPT Image 2 direkt im Browser.',
  templateEyebrow: 'Bildvorlagen',
  templateTitle: 'Wähle eine WM-Bildvorlage und erstelle eine ähnliche Version',
  templateDescription: 'Starte mit bereits generierten Fußballideen: Fanposter, Meme-Reaktionen, Stickerpacks, Watch-Party-Flyer, Countdowns, Collagen und Fankarten. Klicke eine Vorlage an, um Bild und Prompt in den GPT Image 2 Editor zu senden.',
  copyPrompt: 'Prompt kopieren',
  copied: 'Kopiert',
  createSimilar: 'Ähnlich erstellen',
  altSuffix: 'WM-KI-Bildvorlage',
  allCategory: 'Alle',
  templateTitlePrefix: 'Vorlage',
  whatEyebrow: 'Was erstellen',
  whatTitle: 'Was kannst du mit diesem WM-KI-Bildgenerator erstellen?',
  whatDescription: 'Nutze GPT Image 2 als KI-Fußballposter-Generator und Fanposter-Maker. Beginne mit einem Selfie, einer Vorlage oder einem kurzen Prompt und erstelle ein Bild für Posts, Thumbnails, Flyer und Fangrafiken.',
  cards: {
    workflow: { title: 'Vorlage-zu-Bild-Workflow', text: 'Wähle eine Fußballvorlage, sende Prompt und Referenzbild in den Generator und erstelle ein ähnliches Bild mit deinem Selfie oder deiner Idee.' },
    reference: { title: 'Selfie- und referenzfreundlich', text: 'Nutze Porträts, Paarfotos, Gruppen-Selfies oder einfache Referenzen, um Gesicht, Pose, Stil und Fanatmosphäre zu steuern.' },
    social: { title: 'Formate für Social Media', text: 'Erstelle vertikale Poster, Fanporträts, Stickerbögen, Watch-Party-Flyer, Comic-Reaktionen und Sammelkarten für regelmäßige Veröffentlichungen.' },
    selfie: { title: 'Fan-Selfie-Porträts', text: 'Verwandle ein klares Porträt in ein stadionbeleuchtetes Fanbild mit Facepaint, Schal, Fanzonen-Licht und natürlicher Ähnlichkeit.' },
    colors: { title: 'Jubelfotos in Länderfarben', text: 'Erstelle Looks inspiriert von Brasilien, Argentinien, Frankreich, Mexiko, Portugal oder eigenen Farbkombinationen.' },
    stickers: { title: 'Gesichtsflaggen-Sticker-Selfies', text: 'Erzeuge Close-up-Fan-Selfies mit glänzenden Wangenstickern, leichtem Glitzer, Stadion-Bokeh und Creator-Styling.' },
    friends: { title: 'Paar- und Freundes-Fanfotos', text: 'Generiere Fan-Duos, freundliche Rivalenposen, Best-Friend-Selfies und Gruppenbilder mit verschiedenen Farbthemen.' },
    cards: { title: 'Fan-Sammelkarten', text: 'Erstelle Porträtkarten im Sammelkartenstil mit Folienrand, fiktiven Fanwerten, starken Nummern und Premium-Sportkarten-Energie.' },
    travel: { title: 'Boarding-Pass-Reisegrafiken', text: 'Gestalte Fußball-Reisegrafiken mit Gastgeberstadt-Routen, Gate-Details, Sitzlabels und einem porträtbasierten Souvenir-Look.' },
  },
  formatsEyebrow: 'Bildformate',
  formatsTitle: 'Erstelle Fanbilder, Poster, Sticker, Karten und Flyer',
  formatsDescription: 'Die Vorlagengalerie deckt die wichtigsten Bildrichtungen ab: Jubelfotos in Länderfarben, Gesichtssticker-Selfies, Paar- und Freundesbilder, Fankarten, Comic-Reaktionen und Boarding-Pass-Reisegrafiken.',
  howEyebrow: 'So geht es',
  howTitle: 'So erstellst du ein WM-KI-Bild',
  howDescription: 'Halte den Ablauf einfach: lade bei Gesichtern eine klare Referenz hoch, wähle einen Vorlagenstil, beschreibe die Fußballszene, erzeuge mehrere Versionen und behalte das stärkste Bild.',
  stepLabel: 'Schritt',
  schemaName: 'So erstellst du ein WM-KI-Bild',
  steps: [
    { title: 'Selfie hochladen oder mit Text starten', text: 'Nutze ein klares Porträt für erkennbare Fanbilder oder einen Textprompt für Flyer, Stickerpacks, Poster und Grafikkonzepte.' },
    { title: 'Vorlagenstil wählen', text: 'Wähle eine Galerievorlage oder beschreibe das Format: Close-up-Selfie, Jubelposter, Sammelkarte, Comicpanel, Fotobox-Bogen oder Watch-Party-Flyer.' },
    { title: 'Fußballdetails ergänzen', text: 'Nenne Szene, Farbpalette, Pose, Ausdruck, Gesichtssticker, Schal, Konfetti, Licht und kurze Headline.' },
    { title: 'Versionen erzeugen und vergleichen', text: 'Erzeuge einige Varianten und behalte das Bild mit bestem Gesicht, sauberstem Text, stärkster Komposition und nützlichstem Zuschnitt.' },
    { title: 'Herunterladen oder remixen', text: 'Speichere das beste Ergebnis, kopiere den Prompt oder erstelle eine weitere Version mit anderem Farbthema oder Fan-Fotostil.' },
  ],
  promptEyebrow: 'Prompt-Tipps',
  promptTitle: 'Prompt-Tipps für bessere Fußballbilder',
  promptDescription: 'Ein guter Fußballbild-Prompt muss nicht lang sein. Wichtig sind die richtigen Bausteine: Motiv, Format, Stimmung, Farben und wenig gut lesbarer Text.',
  promptCards: [
    { title: 'Motiv', text: 'Beginne mit einem klaren Motiv: Selfie, Paar, Freundesgruppe, Stickerpack, Watch-Party-Szene, Sammelkarte oder Reiseposter.' },
    { title: 'Format', text: 'Nenne früh die Ausgabeform: vertikales Poster, Close-up-Selfie, Fotobox-Bogen, Flyer, Comicstrip, Zeitungsfront oder Fankarte.' },
    { title: 'Stimmung', text: 'Lege eine konkrete Szene fest: Stadion-Bokeh, Straßenparade, Matchvorschau am Morgen, Fanzonen-Lichter, Konfetti oder Editorial-Licht.' },
    { title: 'Farben', text: 'Nutze Länderfarben ohne offizielle Trikotdetails: Grün-Gelb, Himmelblau-Weiß, Blau-Weiß-Rot, Rot-Grün oder Schwarz-Rot-Gold.' },
    { title: 'Text', text: 'Halte generierten Text kurz. Eine Headline wie Match Day, Fan Zone, Watch Party oder Summer Football funktioniert besser als ein voller Flyer.' },
  ],
  styleEyebrow: 'Vorlagenstile',
  styleTitle: 'Wähle einen Vorlagenstil',
  styleDescription: 'Verschiedene Bildformate brauchen verschiedene Prompts. Nutze diese Übersicht, wenn du aus einer Galerievorlage eine neue Fußballbildidee machen willst.',
  styleHeaders: { style: 'Stil', bestFor: 'Ideal für', promptFocus: 'Prompt-Fokus', example: 'Galeriebeispiel' },
  styleRows: [
    { style: 'Selfie-Fanporträt', bestFor: 'Profil-Edits, Story-Posts, Fanzonen-Bilder und persönliche Match-Day-Grafiken', promptFocus: 'Gesichtsähnlichkeit, Wangensticker, Farbthema, Stadion-Bokeh, natürlicher Ausdruck', example: 'Face Flag Sticker Selfie' },
    { style: 'Paar- oder Freundes-Fanfoto', bestFor: 'Duo-Edits, freundliche Rivalenposts, Gruppen-Selfies und Community-Bilder', promptFocus: 'Personenzahl, Beziehungspose, Farbkontrast und Fanzonen-Licht', example: 'Couple Rival Fans' },
    { style: 'Grafikposter oder Karte', bestFor: 'Fan-Sammelkarten, Zeitungscover, Swiss-Poster und Sammelbilder', promptFocus: 'Layout, Headline, Typografie, Rahmen, fiktive Details und klare Abstände', example: 'Fan Trading Card Foil' },
    { style: 'Sticker- oder Iconpack', bestFor: 'Creator-Kits, Thumbnails, Merch-Konzepte, Story-Sticker und Artikelbilder', promptFocus: 'Einzelne Objekte, einheitliche Outline, weiche Schatten und ausgewogenes Raster', example: 'Football Fan Sticker Pack' },
    { style: 'Event-Flyer', bestFor: 'Watch-Party-Einladungen, Bar-Promos, Viewing-Grafiken und lokale Eventposts', promptFocus: 'Venue-Stimmung, freie Textfläche, Crowd-Energie, Snacks, Drinks und lesbare Headline', example: 'Watch Party Flyer' },
  ],
  ideasEyebrow: 'Bildideen',
  ideasTitle: 'WM-KI-Bildideen für Creator und kleine Unternehmen',
  ideasDescription: 'Nutze den Generator für schnelle Fußball-Saison-Assets: Profilupdates, Creator-Posts, Eventgrafiken, Thumbnails, Stickerkits und Reise-Recaps.',
  ideas: [
    { title: 'Instagram-Story-Cover', text: 'Vertikale Fanporträts, Facepaint-Close-ups und Match-Day-Poster mit Platz für kurze Captions.' },
    { title: 'TikTok- und Shorts-Thumbnails', text: 'Energiegeladene Selfies, schockierte Reaktionen, Comicpanels und starke Grafikkarten, die auf kleinen Screens schnell wirken.' },
    { title: 'Watch-Party-Flyer', text: 'Eventgrafiken für Bars, Creator, Campusgruppen, Clubs und lokale Viewing-Abende.' },
    { title: 'Fan-Profilbilder', text: 'Fanporträts in Länderfarben, Wangensticker-Looks, Schalposen und polierte Zuschnitte für Profile.' },
    { title: 'Stickerpacks', text: 'Fußballicons, Fan-Kit-Illustrationen, Badge-Grafiken und spielerische Objekte für Creator-Bundles.' },
    { title: 'Reise-Recap-Grafiken', text: 'Boarding-Pass-Karten, Retro-Tourposter, City-Routen-Layouts und Souvenirbilder von Matchreisen.' },
  ],
  whyEyebrow: 'Warum Toolaze',
  whyTitle: 'Warum Toolaze für WM-KI-Bilder nutzen?',
  whyDescription: 'Toolaze kombiniert einen echten GPT Image 2 Generator mit einer großen Fußball-Vorlagengalerie. Du kannst Prompts kopieren, ähnliche Bilder erstellen und Referenzfotos direkt in den Generator übernehmen.',
  whyBullets: [
    'Starte mit echten generierten Fußballvorlagen statt mit einem leeren Promptfeld.',
    'Kopiere jeden Prompt oder sende eine Vorlagenreferenz mit einem Klick in den Generator.',
    'Nutze Selfie-, Paar- und Gruppenreferenzen für Fanporträts und Social Images.',
    'Erstelle Standbilder für Posts, Thumbnails, Flyer, Sticker, Profilfotos und Creator-Grafiken.',
  ],
  faqEyebrow: 'FAQ',
  faqTitle: 'Fragen zu WM-KI-Inhalten',
  faqDescription: 'Kurze Antworten für Creator, die Fußballbilder, Fanporträts, Sticker, Flyer, Thumbnails und Social Posts erstellen.',
  faqs: [
    { q: 'Was ist ein WM-KI-Bildgenerator?', a: 'Ein WM-KI-Bildgenerator hilft dir, Fußballposter, Fanporträts, Sticker, Flyer und Social-Media-Grafiken aus Textprompts oder Referenzbildern zu erstellen.' },
    { q: 'Kann ich mein Selfie für ein Fußball-Fanbild verwenden?', a: 'Ja. Lade ein klares Selfie hoch, wähle eine Vorlage oder schreibe einen Prompt. GPT Image 2 kann ein Fanporträt erstellen und das Hauptgesicht erkennbar halten.' },
    { q: 'Kann ich Fanporträts in Länderfarben erstellen?', a: 'Ja. Du kannst Farbthemen wie Grün-Gelb, Himmelblau-Weiß, Blau-Weiß-Rot, Rot-Grün oder eigene Paletten beschreiben.' },
    { q: 'Kann ich Fußballbilder für Paare oder Freunde machen?', a: 'Ja. Nutze ein Paar- oder Gruppenreferenzbild oder starte mit den Paar- und Freundesvorlagen in der Galerie.' },
    { q: 'Erzeugt diese Seite Videos?', a: 'Nein. Diese Seite erzeugt Standbilder mit GPT Image 2, etwa Poster, Selfies, Flyer, Sticker, Thumbnails und andere Bild-Assets.' },
    { q: 'Was sollte in einem Fußball-KI-Bildprompt stehen?', a: 'Nenne Motiv, Format, Szene, Farben, Stil und kurzen Bildtext, zum Beispiel Close-up-Fan-Selfie, rote und grüne Wangensticker, Stadion-Bokeh und Editorial-Licht.' },
    { q: 'Kann ich Watch-Party-Flyer oder Stickerpacks erstellen?', a: 'Ja. Der Generator kann Watch-Party-Flyer, Fußball-Stickerbögen, Fan-Kit-Icons, Social Cover und Creator-Grafiken aus Textprompts erzeugen.' },
    { q: 'Ist Toolaze mit FIFA verbunden?', a: 'Toolaze ist ein unabhängiges Kreativtool und steht in keiner Verbindung zu FIFA.' },
  ],
  ctaTitle: 'Erstelle dein WM-KI-Bild mit GPT Image 2',
  ctaDescription: 'Wähle eine Vorlage, lade ein Selfie oder Referenzbild hoch und erstelle ein Fanposter, Stickerpack, Watch-Party-Flyer oder Social-Media-Bild im Browser.',
  ctaButton: 'Bild generieren',
})

const es = buildCopy({
  metadataTitle: 'Generador de imágenes con IA para el Mundial | Pósters y fotos de fans | Toolaze',
  metadataDescription: 'Crea pósters de fútbol inspirados en el Mundial, selfies de fans, retratos con colores nacionales, stickers, flyers para watch parties e imágenes sociales con GPT Image 2 en Toolaze.',
  home: 'Inicio',
  aiTools: 'Herramientas de IA',
  current: 'Generador de imágenes con IA para el Mundial',
  heroHighlight: 'IA para el Mundial',
  heroSuffix: 'Generador de imágenes',
  heroDescription: 'Crea pósters de fans, edits de selfies, retratos con colores nacionales, stickers, flyers para watch parties e imágenes sociales con GPT Image 2 directamente en tu navegador.',
  templateEyebrow: 'Plantillas de imagen',
  templateTitle: 'Elige una plantilla del Mundial y crea una versión similar',
  templateDescription: 'Empieza con direcciones visuales ya generadas: pósters de fans, reacciones meme, stickers, flyers, cuentas atrás, collages y tarjetas de fans. Haz clic en una plantilla para enviar su imagen y prompt al editor GPT Image 2.',
  copyPrompt: 'Copiar prompt',
  copied: 'Copiado',
  createSimilar: 'Crear similar',
  altSuffix: 'plantilla de imagen IA del Mundial',
  allCategory: 'Todo',
  templateTitlePrefix: 'Plantilla',
  whatEyebrow: 'Qué crear',
  whatTitle: '¿Qué puedes crear con este generador de imágenes con IA para el Mundial?',
  whatDescription: 'Usa GPT Image 2 como generador de pósters de fútbol y creador de pósters de fans. Empieza con una selfie, una plantilla o un prompt breve y crea una imagen para publicaciones, miniaturas, flyers y gráficos de fans.',
  cards: {
    workflow: { title: 'Flujo de plantilla a imagen', text: 'Elige una plantilla de fútbol, envía su prompt y referencia al generador y crea una imagen similar con tu selfie o idea.' },
    reference: { title: 'Funciona con selfies y referencias', text: 'Usa un retrato, foto de pareja, selfie grupal o referencia simple para guiar rostro, pose, estilo y ambiente futbolero.' },
    social: { title: 'Formatos listos para redes', text: 'Crea pósters verticales, retratos de fans, hojas de stickers, flyers, reacciones de cómic y tarjetas coleccionables.' },
    selfie: { title: 'Retratos selfie de fans', text: 'Convierte un retrato claro en una imagen de fan con luces de estadio, pintura facial, bufanda y parecido natural.' },
    colors: { title: 'Fotos con colores nacionales', text: 'Crea looks inspirados en Brasil, Argentina, Francia, México, Portugal o paletas personalizadas.' },
    stickers: { title: 'Selfies con stickers de bandera', text: 'Haz selfies de primer plano con stickers brillantes en la mejilla, brillo sutil, bokeh de estadio y estilo de creador.' },
    friends: { title: 'Fotos de pareja y amigos', text: 'Genera dúos de fans, poses de rivalidad amistosa, selfies de mejores amigos y fotos grupales con distintos temas de color.' },
    cards: { title: 'Tarjetas de fans', text: 'Crea tarjetas tipo coleccionable con bordes foil, estadísticas ficticias, números llamativos y energía de tarjeta deportiva premium.' },
    travel: { title: 'Gráficos de viaje tipo boarding pass', text: 'Diseña gráficos de viaje futbolero con rutas de ciudades sede, detalles de puerta, asientos y composición de recuerdo.' },
  },
  formatsEyebrow: 'Formatos de imagen',
  formatsTitle: 'Crea fotos de fans, pósters, stickers, tarjetas y flyers',
  formatsDescription: 'La galería cubre las direcciones más útiles: fotos con colores nacionales, selfies con stickers de bandera, fotos de parejas y amigos, tarjetas de fans, reacciones cómicas y gráficos de viaje tipo boarding pass.',
  howEyebrow: 'Cómo crear',
  howTitle: 'Cómo hacer una imagen IA del Mundial',
  howDescription: 'Sube una referencia clara cuando el rostro importe, elige un estilo, describe la escena de fútbol, genera varias versiones y conserva la imagen más fuerte.',
  stepLabel: 'Paso',
  schemaName: 'Cómo crear una imagen IA del Mundial',
  steps: [
    { title: 'Sube una selfie o empieza con texto', text: 'Usa un retrato claro para una imagen reconocible o un prompt de texto para flyers, stickers, pósters y conceptos gráficos.' },
    { title: 'Elige un estilo de plantilla', text: 'Elige una plantilla o describe el formato: selfie cercana, póster de ánimo, tarjeta, panel de cómic, fotomatón o flyer.' },
    { title: 'Añade detalles de fútbol', text: 'Incluye escena, paleta, pose, expresión, stickers faciales, bufanda, confeti, iluminación y titular corto.' },
    { title: 'Genera y compara versiones', text: 'Prueba varias variaciones y conserva la que tenga mejor rostro, texto más limpio, composición fuerte y recorte útil.' },
    { title: 'Descarga o remezcla', text: 'Guarda el resultado, copia el prompt o vuelve a la galería para crear otra versión con otro color o estilo.' },
  ],
  promptEyebrow: 'Consejos de prompt',
  promptTitle: 'Consejos para mejores imágenes de fútbol',
  promptDescription: 'Un buen prompt no necesita ser largo. Necesita los bloques correctos: sujeto, formato, ambiente, colores y poco texto legible.',
  promptCards: [
    { title: 'Sujeto', text: 'Empieza con un sujeto claro: una selfie, pareja, grupo de amigos, sticker pack, escena de watch party, tarjeta o póster de viaje.' },
    { title: 'Formato', text: 'Nombra pronto la forma de salida: póster vertical, selfie cercana, hoja de fotomatón, flyer, tira cómica, portada de periódico o tarjeta de fan.' },
    { title: 'Ambiente', text: 'Define una escena concreta: bokeh de estadio, desfile de fans, previa matutina, luces de fan zone, confeti o iluminación editorial.' },
    { title: 'Colores', text: 'Usa lenguaje de colores nacionales sin detalles oficiales: verde y amarillo, celeste y blanco, azul blanco rojo, rojo verde o negro rojo oro.' },
    { title: 'Texto', text: 'Mantén el texto generado corto. Un titular como Match Day, Fan Zone, Watch Party o Summer Football funciona mejor que un flyer saturado.' },
  ],
  styleEyebrow: 'Estilos de plantilla',
  styleTitle: 'Elige un estilo de plantilla',
  styleDescription: 'Cada formato necesita un prompt distinto. Usa esta guía para pasar de una plantilla de galería a una nueva idea futbolera.',
  styleHeaders: { style: 'Estilo', bestFor: 'Ideal para', promptFocus: 'Foco del prompt', example: 'Ejemplo' },
  styleRows: [
    { style: 'Retrato selfie de fan', bestFor: 'Edits de perfil, historias, imágenes de fan zone y gráficos personales de partido', promptFocus: 'Parecido facial, stickers en la mejilla, tema de color, bokeh de estadio y expresión natural', example: 'Face Flag Sticker Selfie' },
    { style: 'Foto de pareja o amigos', bestFor: 'Edits de dúo, posts de rivalidad amistosa, selfies grupales e imágenes de comunidad', promptFocus: 'Número de personas, pose de relación, contraste de color e iluminación de fan zone', example: 'Couple Rival Fans' },
    { style: 'Póster gráfico o tarjeta', bestFor: 'Tarjetas de fans, portadas de periódico, pósters suizos e imágenes coleccionables', promptFocus: 'Layout, titular, estilo tipográfico, bordes, detalles ficticios y espaciado limpio', example: 'Fan Trading Card Foil' },
    { style: 'Sticker o pack de iconos', bestFor: 'Kits de creador, miniaturas, conceptos de merch, stickers de historias e imágenes para artículos', promptFocus: 'Objetos separados, estilo de contorno consistente, sombra suave y cuadrícula equilibrada', example: 'Football Fan Sticker Pack' },
    { style: 'Flyer de evento', bestFor: 'Invitaciones de watch party, promos de bares, gráficos de noche de partido y posts locales', promptFocus: 'Ambiente del lugar, espacio para texto, energía de público, snacks, bebidas y titular legible', example: 'Watch Party Flyer' },
  ],
  ideasEyebrow: 'Ideas de imagen',
  ideasTitle: 'Ideas de imágenes IA del Mundial para creadores y pequeños negocios',
  ideasDescription: 'Usa el generador para assets rápidos de temporada: perfiles, posts, eventos, miniaturas, stickers y recaps de viaje.',
  ideas: [
    { title: 'Portadas de historias de Instagram', text: 'Retratos verticales de fans, primeros planos con pintura facial y pósters de partido con espacio para textos breves.' },
    { title: 'Miniaturas para TikTok y Shorts', text: 'Selfies energéticas, reacciones de sorpresa, paneles de cómic y tarjetas gráficas que se leen rápido en pantallas pequeñas.' },
    { title: 'Flyers para watch parties', text: 'Gráficos de evento para bares, creadores, campus, clubes y noches locales de partido.' },
    { title: 'Imágenes de perfil de fan', text: 'Retratos con colores nacionales, stickers en la mejilla, poses con bufanda y recortes pulidos para perfil.' },
    { title: 'Sticker packs', text: 'Iconos de fútbol, ilustraciones de fan kit, gráficos tipo insignia y objetos divertidos para bundles de creador.' },
    { title: 'Gráficos de recap de viaje', text: 'Tarjetas tipo boarding pass, pósters retro de gira, rutas de ciudad e imágenes souvenir de viajes futboleros.' },
  ],
  whyEyebrow: 'Por qué Toolaze',
  whyTitle: '¿Por qué usar Toolaze para imágenes IA del Mundial?',
  whyDescription: 'Toolaze combina un generador GPT Image 2 real con una gran galería de plantillas de fútbol. Puedes copiar prompts, crear imágenes similares y llevar referencias al generador superior.',
  whyBullets: [
    'Empieza con plantillas reales generadas, no con una caja de prompt vacía.',
    'Copia cualquier prompt o envía una referencia al generador con un clic.',
    'Usa selfies, parejas y grupos como referencias para retratos de fans.',
    'Crea imágenes estáticas para posts, miniaturas, flyers, stickers y perfiles.',
  ],
  faqEyebrow: 'FAQ',
  faqTitle: 'Preguntas sobre contenido IA del Mundial',
  faqDescription: 'Respuestas breves para creadores que hacen imágenes futboleras, retratos de fans, stickers, flyers, miniaturas y posts.',
  faqs: [
    { q: '¿Qué es un generador de imágenes con IA para el Mundial?', a: 'Es una herramienta que ayuda a crear pósters de fútbol, retratos de fans, stickers, flyers e imágenes sociales a partir de prompts de texto o imágenes de referencia.' },
    { q: '¿Puedo usar mi selfie para crear una imagen de fan?', a: 'Sí. Sube una selfie clara, elige una plantilla o escribe un prompt, y GPT Image 2 puede crear un retrato de fan manteniendo reconocible el rostro principal.' },
    { q: '¿Puedo crear retratos de fans con colores nacionales?', a: 'Sí. Puedes describir temas de color como verde y amarillo, celeste y blanco, azul blanco rojo, rojo verde o paletas personalizadas.' },
    { q: '¿Puedo hacer imágenes de fútbol para parejas o amigos?', a: 'Sí. Usa una imagen de referencia de pareja o grupo, o empieza con las plantillas de pareja y amigos de la galería.' },
    { q: '¿Esta página genera videos?', a: 'No. Esta página genera imágenes estáticas con GPT Image 2 para pósters, selfies, flyers, stickers, miniaturas y otros assets visuales.' },
    { q: '¿Qué debería escribir en un prompt de imagen IA de fútbol?', a: 'Incluye sujeto, formato, escena, colores, estilo y texto breve. Por ejemplo: selfie cercana de fan, stickers rojos y verdes en la mejilla, bokeh de estadio e iluminación editorial.' },
    { q: '¿Puedo crear flyers para watch parties o stickers?', a: 'Sí. El generador puede crear flyers, hojas de stickers de fútbol, iconos de fan kit, portadas sociales y gráficos de creador desde un prompt.' },
    { q: '¿Toolaze está afiliado a FIFA?', a: 'Toolaze es una herramienta creativa independiente y no está afiliada a FIFA.' },
  ],
  ctaTitle: 'Crea tu imagen IA del Mundial con GPT Image 2',
  ctaDescription: 'Elige una plantilla, sube una selfie o referencia y genera un póster de fan, sticker pack, flyer o imagen social en tu navegador.',
  ctaButton: 'Generar imagen',
})

const fr = buildCopy({
  metadataTitle: 'Générateur d’images IA Coupe du Monde | Posters et photos de fans | Toolaze',
  metadataDescription: 'Créez des posters de football inspirés de la Coupe du Monde, selfies de fans, portraits aux couleurs nationales, stickers, flyers de watch party et visuels sociaux avec GPT Image 2 sur Toolaze.',
  home: 'Accueil',
  aiTools: 'Outils IA',
  current: 'Générateur d’images IA Coupe du Monde',
  heroHighlight: 'IA Coupe du Monde',
  heroSuffix: 'Générateur d’images',
  heroDescription: 'Créez des posters de fans, edits de selfies, portraits aux couleurs nationales, stickers, flyers de watch party et images sociales avec GPT Image 2 directement dans votre navigateur.',
  templateEyebrow: 'Modèles d’image',
  templateTitle: 'Choisissez un modèle Coupe du Monde et créez une version similaire',
  templateDescription: 'Partez de directions déjà générées : posters de fans, réactions meme, stickers, flyers, comptes à rebours, collages et cartes de fans. Cliquez sur un modèle pour envoyer son image et son prompt vers l’éditeur GPT Image 2.',
  copyPrompt: 'Copier le prompt',
  copied: 'Copié',
  createSimilar: 'Créer similaire',
  altSuffix: 'modèle d’image IA Coupe du Monde',
  allCategory: 'Tout',
  templateTitlePrefix: 'Modèle',
  whatEyebrow: 'Quoi créer',
  whatTitle: 'Que créer avec ce générateur d’images IA Coupe du Monde ?',
  whatDescription: 'Utilisez GPT Image 2 comme générateur de posters de football et créateur de visuels de fans. Commencez avec un selfie, un modèle ou un court prompt pour produire une image prête pour les posts, miniatures, flyers et graphiques de fans.',
  cards: {
    workflow: { title: 'Du modèle à l’image', text: 'Choisissez un modèle de football, envoyez son prompt et son image de référence au générateur, puis créez une image similaire avec votre selfie ou votre idée.' },
    reference: { title: 'Adapté aux selfies et références', text: 'Utilisez un portrait, une photo de couple, un selfie de groupe ou une référence simple pour guider le visage, la pose, le style et l’ambiance de supporter.' },
    social: { title: 'Formats prêts pour les réseaux', text: 'Créez des posters verticaux, portraits de fans, planches de stickers, flyers, réactions BD et cartes collectionnables pour publier facilement.' },
    selfie: { title: 'Portraits selfie de fans', text: 'Transformez un portrait net en image de supporter sous les lumières du stade, avec maquillage, écharpe, ambiance de fan zone et ressemblance naturelle.' },
    colors: { title: 'Photos aux couleurs nationales', text: 'Créez des looks inspirés du Brésil, de l’Argentine, de la France, du Mexique, du Portugal ou de palettes personnalisées.' },
    stickers: { title: 'Selfies avec stickers de drapeau', text: 'Créez des gros plans de fans avec stickers brillants sur les joues, paillettes subtiles, bokeh de stade et style créateur soigné.' },
    friends: { title: 'Photos de couples et amis', text: 'Générez des duos de fans, poses de rivalité amicale, selfies de meilleurs amis et photos de groupe avec différents thèmes de couleur.' },
    cards: { title: 'Cartes de fans', text: 'Créez des cartes type collection avec bordures foil, statistiques fictives, grands numéros et énergie premium de carte sportive.' },
    travel: { title: 'Visuels de voyage boarding pass', text: 'Concevez des graphiques de voyage football avec routes de villes hôtes, détails de porte, sièges et mise en page souvenir autour du portrait.' },
  },
  formatsEyebrow: 'Formats d’image',
  formatsTitle: 'Créez photos de fans, posters, stickers, cartes et flyers',
  formatsDescription: 'La galerie couvre les directions les plus utiles : photos de supporters aux couleurs nationales, selfies avec stickers de drapeau, photos de couples et amis, cartes de fans, réactions BD et visuels de voyage façon boarding pass.',
  howEyebrow: 'Comment créer',
  howTitle: 'Comment créer une image IA Coupe du Monde',
  howDescription: 'Gardez un flux simple : importez une référence nette quand le visage compte, choisissez un style, décrivez la scène de football, générez plusieurs versions et gardez la plus forte.',
  stepLabel: 'Étape',
  schemaName: 'Comment créer une image IA Coupe du Monde',
  steps: [
    { title: 'Importez un selfie ou partez du texte', text: 'Utilisez un portrait net pour une image de fan reconnaissable, ou un prompt texte pour un flyer, sticker pack, poster ou concept graphique.' },
    { title: 'Choisissez un style de modèle', text: 'Sélectionnez un modèle de la galerie ou décrivez le format : selfie rapproché, poster de supporter, carte, panneau BD, planche photobooth ou flyer.' },
    { title: 'Ajoutez les détails football', text: 'Incluez la scène, la palette, la pose, l’expression, les stickers de visage, l’écharpe, les confettis, la lumière et un titre court.' },
    { title: 'Générez et comparez', text: 'Lancez plusieurs variantes et gardez l’image avec le meilleur visage, le texte le plus propre, la composition la plus forte et le cadrage le plus utile.' },
    { title: 'Téléchargez ou remixez', text: 'Enregistrez le meilleur résultat, copiez le prompt ou revenez à la galerie pour créer une autre version avec un autre thème couleur ou style de fan.' },
  ],
  promptEyebrow: 'Conseils de prompt',
  promptTitle: 'Conseils pour de meilleures images de football',
  promptDescription: 'Un bon prompt football n’a pas besoin d’être long. Il doit contenir les bons blocs : sujet, format, ambiance, couleurs et peu de texte lisible.',
  promptCards: [
    { title: 'Sujet', text: 'Commencez par un sujet clair : selfie, couple, groupe d’amis, sticker pack, scène de watch party, carte ou poster de voyage.' },
    { title: 'Format', text: 'Nommez tôt la forme de sortie : poster vertical, selfie rapproché, planche photobooth, flyer, bande dessinée, une de journal ou carte de fan.' },
    { title: 'Ambiance', text: 'Définissez une scène précise : bokeh de stade, parade de fans, aperçu de match le matin, lumières de fan zone, confettis ou lumière éditoriale.' },
    { title: 'Couleurs', text: 'Utilisez des couleurs nationales sans détails officiels de maillot : vert et jaune, bleu ciel et blanc, bleu blanc rouge, rouge vert ou noir rouge or.' },
    { title: 'Texte', text: 'Gardez le texte généré court. Un titre comme Match Day, Fan Zone, Watch Party ou Summer Football marche mieux qu’un flyer chargé.' },
  ],
  styleEyebrow: 'Styles de modèles',
  styleTitle: 'Choisissez un style de modèle',
  styleDescription: 'Chaque format d’image demande un prompt différent. Utilisez ce guide pour transformer un modèle de galerie en nouvelle idée football.',
  styleHeaders: { style: 'Style', bestFor: 'Idéal pour', promptFocus: 'Focus du prompt', example: 'Exemple' },
  styleRows: [
    { style: 'Portrait selfie de fan', bestFor: 'Edits de profil, stories, images de fan zone et visuels personnels de match', promptFocus: 'Ressemblance du visage, stickers, thème couleur, bokeh de stade et expression naturelle', example: 'Face Flag Sticker Selfie' },
    { style: 'Photo de couple ou amis', bestFor: 'Edits duo, posts de rivalité amicale, selfies de groupe et images communautaires', promptFocus: 'Nombre de personnes, pose relationnelle, contraste couleur et lumière de fan zone', example: 'Couple Rival Fans' },
    { style: 'Poster graphique ou carte', bestFor: 'Cartes de fans, unes de journal, posters suisses et visuels collectionnables', promptFocus: 'Mise en page, titre, typographie, bordures, détails fictifs et espacement net', example: 'Fan Trading Card Foil' },
    { style: 'Pack stickers ou icônes', bestFor: 'Kits créateurs, miniatures, concepts merch, stickers story et visuels d’article', promptFocus: 'Objets séparés, style de contour cohérent, ombres douces et grille équilibrée', example: 'Football Fan Sticker Pack' },
    { style: 'Flyer événement', bestFor: 'Invitations watch party, promos de bars, soirées de visionnage et posts locaux', promptFocus: 'Ambiance du lieu, espace texte, énergie de foule, snacks, boissons et titre lisible', example: 'Watch Party Flyer' },
  ],
  ideasEyebrow: 'Idées d’image',
  ideasTitle: 'Idées d’images IA Coupe du Monde pour créateurs et petites entreprises',
  ideasDescription: 'Utilisez le générateur pour créer rapidement des visuels de saison : profils, posts, événements, miniatures, stickers et souvenirs de voyage.',
  ideas: [
    { title: 'Couvertures de stories Instagram', text: 'Portraits verticaux de fans, gros plans maquillage et posters de match avec espace pour de courts textes.' },
    { title: 'Miniatures TikTok et Shorts', text: 'Selfies énergiques, réactions surprises, panneaux BD et cartes graphiques lisibles rapidement sur petit écran.' },
    { title: 'Flyers de watch party', text: 'Visuels d’événement pour bars, créateurs, campus, clubs et soirées locales de visionnage.' },
    { title: 'Images de profil fan', text: 'Portraits aux couleurs nationales, stickers de joue, poses avec écharpe et recadrages prêts pour les profils.' },
    { title: 'Sticker packs', text: 'Icônes football, illustrations fan kit, badges et objets ludiques pour bundles créateurs.' },
    { title: 'Visuels récap voyage', text: 'Cartes boarding pass, posters rétro, itinéraires de ville et images souvenir de voyages football.' },
  ],
  whyEyebrow: 'Pourquoi Toolaze',
  whyTitle: 'Pourquoi utiliser Toolaze pour les images IA Coupe du Monde ?',
  whyDescription: 'Toolaze combine un vrai générateur GPT Image 2 avec une grande galerie de modèles football. Vous pouvez copier les prompts, créer des images similaires et envoyer des références vers le générateur du haut.',
  whyBullets: [
    'Commencez avec de vrais modèles de football générés au lieu d’un champ de prompt vide.',
    'Copiez n’importe quel prompt ou envoyez une référence au générateur en un clic.',
    'Utilisez selfies, couples et groupes comme références pour portraits de fans et images sociales.',
    'Créez des images fixes pour posts, miniatures, flyers, stickers, profils et visuels créateurs.',
  ],
  faqEyebrow: 'FAQ',
  faqTitle: 'Questions sur le contenu IA Coupe du Monde',
  faqDescription: 'Réponses courtes pour créer images football, portraits de fans, stickers, flyers, miniatures et posts sociaux.',
  faqs: [
    { q: 'Qu’est-ce qu’un générateur d’images IA Coupe du Monde ?', a: 'C’est un outil qui aide à créer posters de football, portraits de fans, stickers, flyers et images sociales à partir de prompts texte ou d’images de référence.' },
    { q: 'Puis-je utiliser mon selfie pour créer une image de fan ?', a: 'Oui. Importez un selfie net, choisissez un modèle ou écrivez un prompt. GPT Image 2 peut créer un portrait de fan tout en gardant le visage principal reconnaissable.' },
    { q: 'Puis-je créer des portraits aux couleurs nationales ?', a: 'Oui. Décrivez des thèmes comme vert et jaune, bleu ciel et blanc, bleu blanc rouge, rouge vert ou une palette personnalisée.' },
    { q: 'Puis-je créer des images football pour couples ou amis ?', a: 'Oui. Utilisez une image de référence de couple ou groupe, ou partez des modèles couple et amis dans la galerie.' },
    { q: 'Cette page génère-t-elle des vidéos ?', a: 'Non. Cette page génère des images fixes avec GPT Image 2 : posters, selfies, flyers, stickers, miniatures et autres assets visuels.' },
    { q: 'Que mettre dans un prompt d’image IA football ?', a: 'Indiquez le sujet, le format, la scène, les couleurs, le style et un texte court, par exemple selfie de fan rapproché, stickers rouges et verts, bokeh de stade et lumière éditoriale.' },
    { q: 'Puis-je créer des flyers de watch party ou des stickers ?', a: 'Oui. Le générateur peut créer flyers, planches de stickers football, icônes fan kit, couvertures sociales et graphiques créateurs depuis un prompt.' },
    { q: 'Toolaze est-il affilié à FIFA ?', a: 'Toolaze est un outil créatif indépendant et n’est pas affilié à FIFA.' },
  ],
  ctaTitle: 'Créez votre image IA Coupe du Monde avec GPT Image 2',
  ctaDescription: 'Choisissez un modèle, ajoutez un selfie ou une référence, puis générez un poster de fan, un sticker pack, un flyer ou une image sociale dans votre navigateur.',
  ctaButton: 'Générer une image',
})

const it = buildCopy({
  metadataTitle: 'Generatore di immagini IA Mondiali | Poster e foto tifosi | Toolaze',
  metadataDescription: 'Crea poster calcistici ispirati ai Mondiali, selfie da tifoso, ritratti con colori nazionali, sticker pack, flyer per watch party e immagini social con GPT Image 2 su Toolaze.',
  home: 'Home',
  aiTools: 'Strumenti IA',
  current: 'Generatore di immagini IA Mondiali',
  heroHighlight: 'IA Mondiali',
  heroSuffix: 'Generatore di immagini',
  heroDescription: 'Crea poster da tifoso, selfie edit, ritratti con colori nazionali, sticker pack, flyer per watch party e immagini social con GPT Image 2 direttamente nel browser.',
  templateEyebrow: 'Modelli immagine',
  templateTitle: 'Scegli un modello dei Mondiali e crea una versione simile',
  templateDescription: 'Parti da direzioni già generate: poster da tifoso, reazioni meme, sticker pack, flyer, countdown, collage e card. Clicca un modello per inviare immagine e prompt all’editor GPT Image 2.',
  copyPrompt: 'Copia prompt',
  copied: 'Copiato',
  createSimilar: 'Crea simile',
  altSuffix: 'modello immagine IA Mondiali',
  allCategory: 'Tutto',
  templateTitlePrefix: 'Modello',
  whatEyebrow: 'Cosa creare',
  whatTitle: 'Cosa puoi creare con questo generatore di immagini IA per i Mondiali?',
  whatDescription: 'Usa GPT Image 2 come generatore di poster calcistici e creatore di immagini per tifosi. Parti da un selfie, un modello o un prompt breve e crea immagini statiche per post, miniature, flyer e grafiche fan.',
  cards: {
    workflow: { title: 'Da modello a immagine', text: 'Scegli un modello di calcio, invia prompt e immagine di riferimento al generatore e crea una versione simile con il tuo selfie o la tua idea.' },
    reference: { title: 'Adatto a selfie e reference', text: 'Usa un ritratto, foto di coppia, selfie di gruppo o reference semplice per guidare volto, posa, stile e atmosfera da tifoso.' },
    social: { title: 'Formati pronti per social', text: 'Crea poster verticali, ritratti fan, fogli sticker, flyer, reazioni a fumetto e card collezionabili per pubblicare ogni giorno.' },
    selfie: { title: 'Ritratti selfie da tifoso', text: 'Trasforma un ritratto nitido in un’immagine da stadio con face paint, sciarpa, luci fan zone e somiglianza naturale.' },
    colors: { title: 'Foto con colori nazionali', text: 'Crea look ispirati a Brasile, Argentina, Francia, Messico, Portogallo o palette personalizzate.' },
    stickers: { title: 'Selfie con sticker bandiera', text: 'Realizza close-up da tifoso con sticker lucidi sulle guance, glitter leggero, bokeh da stadio e styling curato.' },
    friends: { title: 'Foto di coppia e amici', text: 'Genera duo di tifosi, pose da rivalità amichevole, selfie con migliori amici e foto di gruppo con temi colore diversi.' },
    cards: { title: 'Card tifoso', text: 'Crea card in stile collezionabile con bordo foil, statistiche fittizie, numeri forti e look premium da carta sportiva.' },
    travel: { title: 'Grafiche viaggio boarding pass', text: 'Progetta grafiche viaggio calcistiche con rotte di città ospitanti, dettagli gate, posti e layout souvenir con ritratto.' },
  },
  formatsEyebrow: 'Formati immagine',
  formatsTitle: 'Crea foto tifosi, poster, sticker, card e flyer',
  formatsDescription: 'La galleria copre le direzioni più utili: foto con colori nazionali, selfie con sticker bandiera, foto di coppie e amici, card tifoso, reazioni fumetto e grafiche viaggio tipo boarding pass.',
  howEyebrow: 'Come creare',
  howTitle: 'Come creare un’immagine IA dei Mondiali',
  howDescription: 'Mantieni il flusso semplice: carica una reference chiara quando conta il volto, scegli uno stile, descrivi la scena calcistica, genera varianti e conserva l’immagine migliore.',
  stepLabel: 'Passo',
  schemaName: 'Come creare un’immagine IA dei Mondiali',
  steps: [
    { title: 'Carica un selfie o parti dal testo', text: 'Usa un ritratto chiaro per un’immagine riconoscibile, oppure un prompt testuale per flyer, sticker pack, poster e concept grafici.' },
    { title: 'Scegli uno stile modello', text: 'Scegli dalla galleria o descrivi il formato: selfie ravvicinato, poster da tifo, card, pannello fumetto, photobooth o flyer.' },
    { title: 'Aggiungi dettagli calcistici', text: 'Includi scena, palette, posa, espressione, sticker viso, sciarpa, coriandoli, luce e titolo breve.' },
    { title: 'Genera e confronta versioni', text: 'Prova alcune varianti e tieni quella con volto migliore, testo più pulito, composizione più forte e crop più utile.' },
    { title: 'Scarica o remix', text: 'Salva il risultato, copia il prompt o torna alla galleria per creare un’altra versione con colori o stile fan diversi.' },
  ],
  promptEyebrow: 'Consigli prompt',
  promptTitle: 'Consigli per immagini calcistiche migliori',
  promptDescription: 'Un buon prompt non deve essere lungo. Servono i blocchi giusti: soggetto, formato, mood, colori e poco testo leggibile.',
  promptCards: [
    { title: 'Soggetto', text: 'Inizia con un soggetto chiaro: selfie, coppia, gruppo di amici, sticker pack, scena watch party, card o poster di viaggio.' },
    { title: 'Formato', text: 'Indica subito la forma: poster verticale, selfie close-up, foglio photobooth, flyer, striscia fumetto, prima pagina o card tifoso.' },
    { title: 'Mood', text: 'Definisci una scena precisa: bokeh da stadio, parata di tifosi, preview mattutina, luci fan zone, coriandoli o luce editoriale.' },
    { title: 'Colori', text: 'Usa colori nazionali senza dettagli ufficiali: verde e giallo, azzurro e bianco, blu bianco rosso, rosso verde o nero rosso oro.' },
    { title: 'Testo', text: 'Mantieni breve il testo generato. Un titolo come Match Day, Fan Zone, Watch Party o Summer Football funziona meglio di un flyer pieno.' },
  ],
  styleEyebrow: 'Stili modello',
  styleTitle: 'Scegli uno stile modello',
  styleDescription: 'Formati diversi richiedono prompt diversi. Usa questa guida per passare da un modello della galleria a una nuova idea calcistica.',
  styleHeaders: { style: 'Stile', bestFor: 'Ideale per', promptFocus: 'Focus prompt', example: 'Esempio' },
  styleRows: [
    { style: 'Ritratto selfie fan', bestFor: 'Edit profilo, storie, immagini fan zone e grafiche personali match-day', promptFocus: 'Somiglianza volto, sticker guancia, tema colore, bokeh stadio, espressione naturale', example: 'Face Flag Sticker Selfie' },
    { style: 'Foto coppia o amici', bestFor: 'Edit duo, post rivalità amichevole, selfie gruppo e immagini community', promptFocus: 'Numero persone, posa relazionale, contrasto colore e luce fan zone', example: 'Couple Rival Fans' },
    { style: 'Poster grafico o card', bestFor: 'Card tifoso, copertine giornale, poster Swiss e immagini collezionabili', promptFocus: 'Layout, titolo, tipografia, bordi, dettagli fittizi e spaziatura pulita', example: 'Fan Trading Card Foil' },
    { style: 'Sticker o icon pack', bestFor: 'Kit creator, miniature, concept merch, sticker storie e illustrazioni articolo', promptFocus: 'Oggetti separati, outline coerente, ombre morbide e griglia bilanciata', example: 'Football Fan Sticker Pack' },
    { style: 'Flyer evento', bestFor: 'Inviti watch party, promo bar, grafiche viewing night e post locali', promptFocus: 'Mood locale, spazio testo, energia folla, snack, drink e titolo leggibile', example: 'Watch Party Flyer' },
  ],
  ideasEyebrow: 'Idee immagine',
  ideasTitle: 'Idee immagini IA dei Mondiali per creator e piccole attività',
  ideasDescription: 'Usa il generatore per asset rapidi di stagione: profili, post creator, grafiche evento, miniature, sticker kit e recap viaggio.',
  ideas: [
    { title: 'Cover storie Instagram', text: 'Ritratti verticali da tifoso, close-up con face paint e poster match-day con spazio per caption brevi.' },
    { title: 'Miniature TikTok e Shorts', text: 'Selfie energici, reazioni stupite, pannelli fumetto e card grafiche leggibili su schermi piccoli.' },
    { title: 'Flyer watch party', text: 'Grafiche evento per bar, creator, campus, club e serate locali di visione.' },
    { title: 'Immagini profilo fan', text: 'Ritratti con colori nazionali, sticker guancia, pose con sciarpa e crop pronti per profili.' },
    { title: 'Sticker pack', text: 'Icone calcio, illustrazioni fan kit, badge e oggetti giocosi per bundle creator.' },
    { title: 'Grafiche recap viaggio', text: 'Card boarding pass, poster tour retro, layout con rotte città e immagini souvenir calcistiche.' },
  ],
  whyEyebrow: 'Perché Toolaze',
  whyTitle: 'Perché usare Toolaze per immagini IA dei Mondiali?',
  whyDescription: 'Toolaze combina un generatore GPT Image 2 reale con una grande galleria di modelli calcistici. Puoi copiare prompt, creare immagini simili e portare reference nel generatore in alto.',
  whyBullets: [
    'Parti da modelli calcistici generati davvero, non da una casella prompt vuota.',
    'Copia qualsiasi prompt o invia una reference al generatore con un clic.',
    'Usa selfie, coppie e gruppi come reference per ritratti fan e immagini social.',
    'Crea immagini statiche per post, miniature, flyer, sticker, profili e grafiche creator.',
  ],
  faqEyebrow: 'FAQ',
  faqTitle: 'Domande sui contenuti IA dei Mondiali',
  faqDescription: 'Risposte brevi per creator che realizzano immagini calcistiche, ritratti fan, sticker, flyer, miniature e post social.',
  faqs: [
    { q: 'Cos’è un generatore di immagini IA dei Mondiali?', a: 'È uno strumento che aiuta a creare poster calcistici, ritratti da tifoso, sticker, flyer e immagini social da prompt testuali o immagini di riferimento.' },
    { q: 'Posso usare il mio selfie per creare un’immagine da tifoso?', a: 'Sì. Carica un selfie chiaro, scegli un modello o scrivi un prompt. GPT Image 2 può creare un ritratto da tifoso mantenendo riconoscibile il volto principale.' },
    { q: 'Posso creare ritratti con colori nazionali?', a: 'Sì. Puoi descrivere temi come verde e giallo, azzurro e bianco, blu bianco rosso, rosso verde o palette personalizzate.' },
    { q: 'Posso fare immagini di calcio per coppie o amici?', a: 'Sì. Usa una reference di coppia o gruppo, oppure parti dai modelli per coppie e amici nella galleria.' },
    { q: 'Questa pagina genera video?', a: 'No. Questa pagina genera immagini statiche con GPT Image 2: poster, selfie, flyer, sticker, miniature e altri asset visivi.' },
    { q: 'Cosa scrivere in un prompt IA di calcio?', a: 'Includi soggetto, formato, scena, colori, stile e testo breve, per esempio selfie close-up da tifoso, sticker rossi e verdi, bokeh stadio e luce editoriale.' },
    { q: 'Posso creare flyer watch party o sticker pack?', a: 'Sì. Il generatore può creare flyer, fogli sticker calcio, icone fan kit, cover social e grafiche creator da prompt.' },
    { q: 'Toolaze è affiliato a FIFA?', a: 'Toolaze è uno strumento creativo indipendente e non è affiliato a FIFA.' },
  ],
  ctaTitle: 'Crea la tua immagine IA dei Mondiali con GPT Image 2',
  ctaDescription: 'Scegli un modello, carica un selfie o una reference e genera un poster da tifoso, sticker pack, flyer o immagine social nel browser.',
  ctaButton: 'Genera immagine',
})

const pt = buildCopy({
  metadataTitle: 'Gerador de imagens de IA da Copa do Mundo | Pôsteres e fotos de fãs | Toolaze',
  metadataDescription: 'Crie pôsteres de futebol inspirados na Copa do Mundo, selfies de fãs, retratos com cores de países, pacotes de stickers, flyers de watch party e imagens sociais com GPT Image 2 no Toolaze.',
  home: 'Início',
  aiTools: 'Ferramentas de IA',
  current: 'Gerador de imagens de IA da Copa do Mundo',
  heroHighlight: 'IA da Copa do Mundo',
  heroSuffix: 'Gerador de imagens',
  heroDescription: 'Crie pôsteres de torcedor, edições de selfie, retratos com cores de países, stickers, flyers de watch party e imagens sociais com GPT Image 2 diretamente no navegador.',
  templateEyebrow: 'Modelos de imagem',
  templateTitle: 'Escolha um modelo da Copa do Mundo e crie uma versão parecida',
  templateDescription: 'Comece com direções já geradas: pôsteres de fãs, reações meme, stickers, flyers de watch party, contagens regressivas, colagens e cartões de fãs. Clique em um modelo para enviar a imagem e o prompt ao editor GPT Image 2.',
  copyPrompt: 'Copiar prompt',
  copied: 'Copiado',
  createSimilar: 'Criar similar',
  altSuffix: 'modelo de imagem de IA da Copa do Mundo',
  allCategory: 'Tudo',
  templateTitlePrefix: 'Modelo',
  whatEyebrow: 'O que criar',
  whatTitle: 'O que você pode criar com este gerador de imagens de IA da Copa do Mundo?',
  whatDescription: 'Use GPT Image 2 como gerador de pôsteres de futebol e criador de imagens de fãs. Comece com uma selfie, um modelo ou um prompt curto e crie uma imagem estática para posts, miniaturas, flyers e gráficos de torcedor.',
  cards: {
    workflow: { title: 'Fluxo de modelo para imagem', text: 'Escolha um modelo de futebol, envie o prompt e a imagem de referência ao gerador e crie uma imagem parecida com sua selfie ou ideia.' },
    reference: { title: 'Funciona com selfies e referências', text: 'Use retratos, fotos de casal, selfies em grupo ou referências simples para guiar rosto, pose, estilo e atmosfera de torcida.' },
    social: { title: 'Formatos prontos para redes', text: 'Crie pôsteres verticais, retratos de fãs, folhas de stickers, flyers, reações em quadrinhos e cartões colecionáveis.' },
    selfie: { title: 'Retratos selfie de fãs', text: 'Transforme um retrato claro em uma imagem de torcedor com luzes de estádio, pintura facial, cachecol, luzes de fan zone e semelhança natural.' },
    colors: { title: 'Fotos com cores de países', text: 'Crie looks inspirados no Brasil, Argentina, França, México, Portugal ou paletas personalizadas.' },
    stickers: { title: 'Selfies com stickers de bandeira', text: 'Faça selfies em close com stickers brilhantes no rosto, brilho sutil, bokeh de estádio e estilo de criador.' },
    friends: { title: 'Fotos de casal e amigos', text: 'Gere duplas de fãs, poses de rivalidade amigável, selfies de melhores amigos e fotos de grupo com temas de cor diferentes.' },
    cards: { title: 'Cartões de fãs', text: 'Crie cartões colecionáveis com bordas foil, estatísticas fictícias, números fortes e visual premium de cartão esportivo.' },
    travel: { title: 'Gráficos de viagem boarding pass', text: 'Desenhe gráficos de viagem futebolística com rotas de cidades-sede, detalhes de portão, assentos e layout souvenir com retrato.' },
  },
  formatsEyebrow: 'Formatos de imagem',
  formatsTitle: 'Crie fotos de fãs, pôsteres, stickers, cartões e flyers',
  formatsDescription: 'A galeria cobre as direções mais úteis: fotos com cores de países, selfies com stickers de bandeira, fotos de casais e amigos, cartões de fãs, reações em quadrinhos e gráficos de viagem estilo boarding pass.',
  howEyebrow: 'Como criar',
  howTitle: 'Como fazer uma imagem de IA da Copa do Mundo',
  howDescription: 'Mantenha simples: envie uma referência clara quando o rosto importar, escolha um estilo, descreva a cena de futebol, gere versões e fique com a imagem mais forte.',
  stepLabel: 'Etapa',
  schemaName: 'Como criar uma imagem de IA da Copa do Mundo',
  steps: [
    { title: 'Envie uma selfie ou comece pelo texto', text: 'Use um retrato claro para uma imagem reconhecível, ou um prompt de texto para flyers, stickers, pôsteres e conceitos gráficos.' },
    { title: 'Escolha um estilo de modelo', text: 'Escolha na galeria ou descreva o formato: selfie em close, pôster de torcida, cartão, painel de quadrinhos, folha de photobooth ou flyer.' },
    { title: 'Adicione detalhes de futebol', text: 'Inclua cena, paleta, pose, expressão, stickers no rosto, cachecol, confete, iluminação e título curto.' },
    { title: 'Gere e compare versões', text: 'Teste algumas variações e mantenha a imagem com melhor rosto, texto mais limpo, composição mais forte e corte mais útil.' },
    { title: 'Baixe ou remixe', text: 'Salve o melhor resultado, copie o prompt ou volte à galeria para criar outra versão com outro tema de cor ou estilo de fã.' },
  ],
  promptEyebrow: 'Dicas de prompt',
  promptTitle: 'Dicas para imagens de futebol melhores',
  promptDescription: 'Um bom prompt de futebol não precisa ser longo. Ele precisa dos blocos certos: assunto, formato, clima, cores e pouco texto legível.',
  promptCards: [
    { title: 'Assunto', text: 'Comece com um assunto claro: selfie, casal, grupo de amigos, sticker pack, cena de watch party, cartão ou pôster de viagem.' },
    { title: 'Formato', text: 'Diga cedo o formato: pôster vertical, selfie em close, folha photobooth, flyer, tirinha, capa de jornal ou cartão de fã.' },
    { title: 'Clima', text: 'Defina uma cena específica: bokeh de estádio, desfile de fãs, prévia de manhã, luzes de fan zone, confete ou luz editorial.' },
    { title: 'Cores', text: 'Use linguagem de cores de países sem detalhes oficiais: verde e amarelo, azul claro e branco, azul branco vermelho, vermelho verde ou preto vermelho dourado.' },
    { title: 'Texto', text: 'Mantenha o texto curto. Um título como Match Day, Fan Zone, Watch Party ou Summer Football funciona melhor que um flyer carregado.' },
  ],
  styleEyebrow: 'Estilos de modelo',
  styleTitle: 'Escolha um estilo de modelo',
  styleDescription: 'Formatos diferentes precisam de prompts diferentes. Use este guia para transformar um modelo da galeria em uma nova ideia de imagem de futebol.',
  styleHeaders: { style: 'Estilo', bestFor: 'Ideal para', promptFocus: 'Foco do prompt', example: 'Exemplo' },
  styleRows: [
    { style: 'Retrato selfie de fã', bestFor: 'Edições de perfil, stories, imagens de fan zone e gráficos pessoais de dia de jogo', promptFocus: 'Semelhança do rosto, stickers, tema de cor, bokeh de estádio e expressão natural', example: 'Face Flag Sticker Selfie' },
    { style: 'Foto de casal ou amigos', bestFor: 'Edições de dupla, posts de rivalidade amigável, selfies em grupo e imagens de comunidade', promptFocus: 'Número de pessoas, pose de relação, contraste de cor e iluminação de fan zone', example: 'Couple Rival Fans' },
    { style: 'Pôster gráfico ou cartão', bestFor: 'Cartões de fãs, capas de jornal, pôsteres Swiss e imagens colecionáveis', promptFocus: 'Layout, título, tipografia, bordas, detalhes fictícios e espaçamento limpo', example: 'Fan Trading Card Foil' },
    { style: 'Sticker ou pacote de ícones', bestFor: 'Kits de criador, miniaturas, conceitos de merch, stickers de stories e imagens de artigo', promptFocus: 'Objetos separados, contorno consistente, sombra suave e grade equilibrada', example: 'Football Fan Sticker Pack' },
    { style: 'Flyer de evento', bestFor: 'Convites de watch party, promos de bares, gráficos de noite de jogo e posts locais', promptFocus: 'Clima do local, espaço para texto, energia de público, snacks, bebidas e título legível', example: 'Watch Party Flyer' },
  ],
  ideasEyebrow: 'Ideias de imagem',
  ideasTitle: 'Ideias de imagens de IA da Copa do Mundo para criadores e pequenos negócios',
  ideasDescription: 'Use o gerador para assets rápidos da temporada: perfis, posts, gráficos de eventos, miniaturas, kits de stickers e recaps de viagem.',
  ideas: [
    { title: 'Capas de stories do Instagram', text: 'Retratos verticais de fãs, closes com pintura facial e pôsteres de jogo com espaço para legendas curtas.' },
    { title: 'Miniaturas para TikTok e Shorts', text: 'Selfies energéticas, reações de surpresa, painéis de quadrinhos e cartões gráficos fáceis de ler em telas pequenas.' },
    { title: 'Flyers de watch party', text: 'Gráficos de evento para bares, criadores, campus, clubes e noites locais de jogo.' },
    { title: 'Imagens de perfil de fã', text: 'Retratos com cores de países, stickers no rosto, poses com cachecol e cortes prontos para perfil.' },
    { title: 'Sticker packs', text: 'Ícones de futebol, ilustrações de fan kit, badges e objetos divertidos para pacotes de criador.' },
    { title: 'Gráficos de recap de viagem', text: 'Cartões boarding pass, pôsteres retrô, layouts de rotas de cidade e imagens souvenir de viagens de futebol.' },
  ],
  whyEyebrow: 'Por que Toolaze',
  whyTitle: 'Por que usar Toolaze para imagens de IA da Copa do Mundo?',
  whyDescription: 'Toolaze combina um gerador GPT Image 2 real com uma grande galeria de modelos de futebol. Você pode copiar prompts, criar imagens similares e levar referências para o gerador no topo.',
  whyBullets: [
    'Comece com modelos de futebol realmente gerados, não com uma caixa de prompt vazia.',
    'Copie qualquer prompt ou envie uma referência ao gerador com um clique.',
    'Use selfies, casais e grupos como referências para retratos de fãs e imagens sociais.',
    'Crie imagens estáticas para posts, miniaturas, flyers, stickers, perfis e gráficos de criador.',
  ],
  faqEyebrow: 'FAQ',
  faqTitle: 'Perguntas sobre conteúdo de IA da Copa do Mundo',
  faqDescription: 'Respostas curtas para criadores que fazem imagens de futebol, retratos de fãs, stickers, flyers, miniaturas e posts sociais.',
  faqs: [
    { q: 'O que é um gerador de imagens de IA da Copa do Mundo?', a: 'É uma ferramenta que ajuda a criar pôsteres de futebol, retratos de fãs, stickers, flyers e imagens sociais a partir de prompts de texto ou imagens de referência.' },
    { q: 'Posso usar minha selfie para criar uma imagem de torcedor?', a: 'Sim. Envie uma selfie clara, escolha um modelo ou escreva um prompt. GPT Image 2 pode criar um retrato de fã mantendo o rosto principal reconhecível.' },
    { q: 'Posso criar retratos de fãs com cores de países?', a: 'Sim. Você pode descrever temas como verde e amarelo, azul claro e branco, azul branco vermelho, vermelho verde ou paletas personalizadas.' },
    { q: 'Posso fazer imagens de futebol para casais ou amigos?', a: 'Sim. Use uma imagem de referência de casal ou grupo, ou comece pelos modelos de casal e amigos na galeria.' },
    { q: 'Esta página gera vídeos?', a: 'Não. Esta página gera imagens estáticas com GPT Image 2, como pôsteres, selfies, flyers, stickers, miniaturas e outros assets visuais.' },
    { q: 'O que escrever em um prompt de imagem IA de futebol?', a: 'Inclua assunto, formato, cena, cores, estilo e texto curto, por exemplo selfie de torcedor em close, stickers vermelhos e verdes, bokeh de estádio e luz editorial.' },
    { q: 'Posso criar flyers de watch party ou sticker packs?', a: 'Sim. O gerador pode criar flyers, folhas de stickers de futebol, ícones de fan kit, capas sociais e gráficos de criador a partir de prompt.' },
    { q: 'Toolaze é afiliado à FIFA?', a: 'Toolaze é uma ferramenta criativa independente e não é afiliada à FIFA.' },
  ],
  ctaTitle: 'Crie sua imagem de IA da Copa do Mundo com GPT Image 2',
  ctaDescription: 'Escolha um modelo, envie uma selfie ou imagem de referência e gere um pôster de fã, pacote de stickers, flyer ou imagem social no navegador.',
  ctaButton: 'Gerar imagem',
})

const ja = buildCopy({
  metadataTitle: 'ワールドカップAI画像ジェネレーター | AIサッカーポスターとファン写真 | Toolaze',
  metadataDescription: 'Toolaze の GPT Image 2 で、ワールドカップ風のAIサッカーポスター、ファン自撮り、国カラーのポートレート、ステッカー、観戦会フライヤー、SNS画像を作成できます。',
  home: 'ホーム',
  aiTools: 'AIツール',
  current: 'ワールドカップAI画像ジェネレーター',
  heroHighlight: 'ワールドカップAI',
  heroSuffix: '画像ジェネレーター',
  heroDescription: 'サッカーファンポスター、自撮り編集、国カラーのポートレート、ステッカー、観戦会フライヤー、SNS画像を GPT Image 2 でブラウザ上から作成できます。',
  templateEyebrow: '画像テンプレート',
  templateTitle: 'ワールドカップ画像テンプレートを選んで似た画像を作成',
  templateDescription: 'ファンポスター、ミーム反応、ステッカー、観戦会フライヤー、カウントダウン、コラージュ、ファンカードなど、生成済みの方向性から始められます。テンプレートをクリックすると画像とプロンプトが上の GPT Image 2 エディターに送られます。',
  copyPrompt: 'プロンプトをコピー',
  copied: 'コピー済み',
  createSimilar: '似た画像を作成',
  altSuffix: 'ワールドカップAI画像テンプレート',
  allCategory: 'すべて',
  templateTitlePrefix: 'テンプレート',
  whatEyebrow: '作れるもの',
  whatTitle: 'このワールドカップAI画像ジェネレーターで何を作れますか？',
  whatDescription: 'GPT Image 2 をAIサッカーポスター生成ツール、ファンポスター作成ツールとして使えます。自撮り、テンプレート、短いプロンプトから、投稿、サムネイル、フライヤー、ファングラフィック向けの静止画を作成できます。',
  cards: {
    workflow: { title: 'テンプレートから画像へ', text: 'サッカーテンプレートを選び、プロンプトと参照画像をジェネレーターへ送り、自分の自撮りやアイデアで似た画像を作成します。' },
    reference: { title: '自撮りと参照画像に対応', text: 'ポートレート、カップル写真、集合自撮り、シンプルな参照画像で、顔、ポーズ、スタイル、ファンらしい雰囲気を調整できます。' },
    social: { title: 'SNS向けフォーマット', text: '縦型ポスター、ファンポートレート、ステッカーシート、観戦会フライヤー、コミック風リアクション、コレクションカードを作成できます。' },
    selfie: { title: 'ファン自撮りポートレート', text: 'クリアなポートレートを、フェイスペイント、スカーフ、ファンゾーンの光、自然な似顔感のあるスタジアム風画像に変換します。' },
    colors: { title: '国カラーの応援写真', text: 'ブラジル、アルゼンチン、フランス、メキシコ、ポルトガル風、または独自カラーのファンルックを作れます。' },
    stickers: { title: '顔旗ステッカー自撮り', text: '光沢のある頬ステッカー、控えめなきらめき、スタジアムのボケ、洗練されたクリエイター風スタイルを加えます。' },
    friends: { title: 'カップルと友達のファン写真', text: 'ミックスファンデュオ、友好的なライバルポーズ、親友自撮り、色テーマの異なるグループ写真を生成できます。' },
    cards: { title: 'ファントレーディングカード', text: '箔風の枠、架空のファンステータス、大きな番号、プレミアムなスポーツカード感のあるカードを作成します。' },
    travel: { title: '搭乗券風トラベルグラフィック', text: '開催都市ルート、ゲート情報、座席ラベル、ポートレート中心の記念デザインを作れます。' },
  },
  formatsEyebrow: '画像フォーマット',
  formatsTitle: 'ファン写真、ポスター、ステッカー、カード、フライヤーを作成',
  formatsDescription: 'テンプレートギャラリーには、国カラーの応援写真、顔旗ステッカー自撮り、カップルや友達のファン写真、ファンカード、コミック反応、搭乗券風の旅行グラフィックが含まれています。',
  howEyebrow: '作り方',
  howTitle: 'ワールドカップAI画像の作り方',
  howDescription: '顔が重要な場合は明瞭な参照画像をアップロードし、テンプレートスタイルを選び、サッカーシーンを説明して複数案から最も強い画像を残します。',
  stepLabel: 'ステップ',
  schemaName: 'ワールドカップAI画像の作り方',
  steps: [
    { title: '自撮りをアップロード、またはテキストから開始', text: '認識しやすいファン画像には明瞭なポートレートを使い、フライヤーやステッカー、ポスターにはテキストプロンプトから始めます。' },
    { title: 'テンプレートスタイルを選ぶ', text: 'ギャラリーから選ぶか、近接自撮り、応援ポスター、カード、コミックパネル、フォトブース、観戦会フライヤーなどを指定します。' },
    { title: 'サッカーの詳細を追加', text: 'シーン、色、ポーズ、表情、顔ステッカー、スカーフ、紙吹雪、照明、短い見出しを含めます。' },
    { title: '生成して比較', text: '複数のバリエーションを作り、顔、テキスト、構図、SNS向けの切り抜きが最も良いものを選びます。' },
    { title: 'ダウンロードまたはリミックス', text: '結果を保存し、プロンプトをコピーするか、別の色テーマやファン写真スタイルで再生成します。' },
  ],
  promptEyebrow: 'プロンプトのコツ',
  promptTitle: 'より良いサッカー画像のためのプロンプト',
  promptDescription: '良いサッカー画像プロンプトは長くなくて構いません。必要なのは、被写体、形式、雰囲気、色、少量の読みやすい文字です。',
  promptCards: [
    { title: '被写体', text: '自撮り、カップル、友達グループ、ステッカーセット、観戦会シーン、トレーディングカード、旅行ポスターなど、主役を明確にします。' },
    { title: '形式', text: '縦型ポスター、近接自撮り、フォトブースシート、フライヤー、コミック、新聞の一面、ファンカードなど、出力形式を早めに指定します。' },
    { title: '雰囲気', text: 'スタジアムのボケ、ストリートの応援パレード、朝の試合プレビュー、ファンゾーンの光、紙吹雪、編集写真風の光などを指定します。' },
    { title: '色', text: '公式ユニフォームに頼らず、緑と黄色、水色と白、青白赤、赤と緑、黒赤金などの国カラーを指定します。' },
    { title: '文字', text: '生成する文字は短くします。Match Day、Fan Zone、Watch Party、Summer Football のような見出しが使いやすいです。' },
  ],
  styleEyebrow: 'テンプレートスタイル',
  styleTitle: 'テンプレートスタイルを選ぶ',
  styleDescription: '画像形式によって必要なプロンプトは変わります。ギャラリーのテンプレートから新しいサッカー画像案へ広げるときに使えます。',
  styleHeaders: { style: 'スタイル', bestFor: '向いている用途', promptFocus: 'プロンプトの焦点', example: '例' },
  styleRows: [
    { style: 'ファン自撮りポートレート', bestFor: 'プロフィール編集、ストーリー投稿、ファンゾーン画像、個人の試合日グラフィック', promptFocus: '顔の似顔感、頬ステッカー、色テーマ、スタジアムのボケ、自然な表情', example: 'Face Flag Sticker Selfie' },
    { style: 'カップルまたは友達のファン写真', bestFor: 'デュオ編集、友好的なライバル投稿、集合自撮り、コミュニティ画像', promptFocus: '人数、関係性のあるポーズ、色の対比、ファンゾーンの照明', example: 'Couple Rival Fans' },
    { style: 'グラフィックポスターまたはカード', bestFor: 'ファンカード、新聞風カバー、スイス風ポスター、コレクション画像', promptFocus: 'レイアウト、見出し、タイポグラフィ、枠、架空の詳細、余白', example: 'Fan Trading Card Foil' },
    { style: 'ステッカーまたはアイコンパック', bestFor: 'クリエイターキット、サムネイル、グッズ案、ストーリーステッカー、記事画像', promptFocus: '個別オブジェクト、統一された輪郭、柔らかい影、整ったグリッド', example: 'Football Fan Sticker Pack' },
    { style: 'イベントフライヤー', bestFor: '観戦会の招待、バー告知、試合観戦イベント、ローカル投稿', promptFocus: '会場の雰囲気、文字スペース、観客の熱気、軽食、飲み物、読みやすい見出し', example: 'Watch Party Flyer' },
  ],
  ideasEyebrow: '画像アイデア',
  ideasTitle: 'クリエイターと小規模ビジネス向けのワールドカップAI画像アイデア',
  ideasDescription: 'サッカーシーズンのプロフィール更新、投稿、イベント画像、サムネイル、ステッカー、旅行風まとめ画像をすばやく作れます。',
  ideas: [
    { title: 'Instagramストーリーカバー', text: '縦型ファンポートレート、フェイスペイントの近接画像、短いキャプション用スペースのある試合日ポスター。' },
    { title: 'TikTokとShortsのサムネイル', text: '勢いのある自撮り、驚きのリアクション、コミックパネル、小さな画面でも読める強いグラフィックカード。' },
    { title: '観戦会フライヤー', text: 'バー、クリエイター、キャンパス、クラブ、地域の観戦イベント向けの告知画像。' },
    { title: 'ファンプロフィール画像', text: '国カラーのファンポートレート、頬ステッカー、スカーフポーズ、プロフィール向けの整った切り抜き。' },
    { title: 'ステッカーパック', text: 'サッカーアイコン、ファンキット風イラスト、バッジ風グラフィック、クリエイター用の遊び心ある素材。' },
    { title: '旅行まとめグラフィック', text: '搭乗券風カード、レトロなツアーポスター、都市ルート、サッカー旅行の記念画像。' },
  ],
  whyEyebrow: 'Toolazeを使う理由',
  whyTitle: 'ワールドカップAI画像にToolazeを使う理由',
  whyDescription: 'Toolaze は実際の GPT Image 2 ジェネレーターと大きなサッカーテンプレートギャラリーを組み合わせています。プロンプトをコピーし、似た画像を作り、参照画像を上のジェネレーターに送れます。',
  whyBullets: [
    '空のプロンプト欄ではなく、実際に生成されたサッカーテンプレートから始められます。',
    '任意のプロンプトをコピーし、参照画像をワンクリックでジェネレーターに送れます。',
    '自撮り、カップル、グループ参照を使ってファンポートレートやSNS画像を作れます。',
    '投稿、サムネイル、フライヤー、ステッカー、プロフィール画像、クリエイター素材向けの静止画を作れます。',
  ],
  faqEyebrow: 'FAQ',
  faqTitle: 'ワールドカップAIコンテンツの質問',
  faqDescription: 'サッカー風画像、ファンポートレート、ステッカー、フライヤー、サムネイル、SNS投稿を作る方向けの短い回答です。',
  faqs: [
    { q: 'ワールドカップAI画像ジェネレーターとは何ですか？', a: 'テキストプロンプトや参照画像から、サッカーポスター、ファンポートレート、ステッカー、フライヤー、SNS画像を作るためのツールです。' },
    { q: '自撮りを使ってファン画像を作れますか？', a: 'はい。明瞭な自撮りをアップロードし、テンプレートを選ぶかプロンプトを書けば、GPT Image 2 が主な顔を認識しやすく保ちながらファンポートレートを作成できます。' },
    { q: '国カラーのファンポートレートを作れますか？', a: 'はい。緑と黄色、水色と白、青白赤、赤と緑、または独自の配色を指定できます。' },
    { q: 'カップルや友達のサッカー画像も作れますか？', a: 'はい。カップルやグループの参照画像を使うか、ギャラリーのカップル・友達テンプレートから始められます。' },
    { q: 'このページは動画を生成しますか？', a: 'いいえ。このページは GPT Image 2 で静止画を生成します。ポスター、自撮り、フライヤー、ステッカー、サムネイルなどに使えます。' },
    { q: 'サッカーAI画像のプロンプトには何を書くべきですか？', a: '被写体、形式、シーン、色、スタイル、短い文字を含めます。例：近接ファン自撮り、赤と緑の頬ステッカー、スタジアムボケ、編集写真風の照明。' },
    { q: '観戦会フライヤーやステッカーも作れますか？', a: 'はい。テキストプロンプトから観戦会フライヤー、サッカーステッカーシート、ファンキットアイコン、SNSカバー、クリエイター用グラフィックを作れます。' },
    { q: 'Toolaze は FIFA と関係がありますか？', a: 'Toolaze は独立したクリエイティブツールであり、FIFA とは提携していません。' },
  ],
  ctaTitle: 'GPT Image 2 でワールドカップAI画像を作成',
  ctaDescription: 'テンプレートを選び、自撮りや参照画像をアップロードして、ファンポスター、ステッカー、観戦会フライヤー、SNS画像をブラウザで生成できます。',
  ctaButton: '画像を生成',
})

const ko = buildCopy({
  metadataTitle: '월드컵 AI 이미지 생성기 | AI 축구 포스터와 팬 사진 | Toolaze',
  metadataDescription: 'Toolaze의 GPT Image 2로 월드컵 분위기의 AI 축구 포스터, 팬 셀피, 국가 컬러 초상화, 스티커 팩, 관전 파티 전단, 소셜 이미지를 만드세요.',
  home: '홈',
  aiTools: 'AI 도구',
  current: '월드컵 AI 이미지 생성기',
  heroHighlight: '월드컵 AI',
  heroSuffix: '이미지 생성기',
  heroDescription: '축구 팬 포스터, 셀피 편집, 국가 컬러 초상화, 스티커 팩, 관전 파티 전단, 소셜 이미지를 GPT Image 2로 브라우저에서 바로 만들 수 있습니다.',
  templateEyebrow: '이미지 템플릿',
  templateTitle: '월드컵 이미지 템플릿을 선택하고 비슷한 이미지를 만들기',
  templateDescription: '팬 포스터, 밈 리액션, 스티커 팩, 관전 파티 전단, 카운트다운, 콜라주, 팬 카드 등 이미 생성된 방향에서 시작하세요. 템플릿을 클릭하면 이미지와 프롬프트가 위의 GPT Image 2 편집기로 전송됩니다.',
  copyPrompt: '프롬프트 복사',
  copied: '복사됨',
  createSimilar: '비슷하게 만들기',
  altSuffix: '월드컵 AI 이미지 템플릿',
  allCategory: '전체',
  templateTitlePrefix: '템플릿',
  whatEyebrow: '만들 수 있는 것',
  whatTitle: '이 월드컵 AI 이미지 생성기로 무엇을 만들 수 있나요?',
  whatDescription: 'GPT Image 2를 AI 축구 포스터 생성기와 팬 포스터 제작 도구로 사용할 수 있습니다. 셀피, 템플릿, 짧은 프롬프트에서 시작해 게시물, 썸네일, 전단, 팬 그래픽용 정지 이미지를 만드세요.',
  cards: {
    workflow: { title: '템플릿에서 이미지로', text: '축구 템플릿을 고르고 프롬프트와 참고 이미지를 생성기로 보내 셀피나 아이디어로 비슷한 이미지를 만드세요.' },
    reference: { title: '셀피와 참고 이미지 지원', text: '인물 사진, 커플 사진, 단체 셀피, 간단한 참고 이미지로 얼굴, 포즈, 스타일, 팬 분위기를 조정할 수 있습니다.' },
    social: { title: '소셜용 형식', text: '세로 포스터, 팬 초상화, 스티커 시트, 관전 파티 전단, 만화 반응, 수집 카드 스타일 이미지를 만들 수 있습니다.' },
    selfie: { title: '팬 셀피 초상화', text: '선명한 인물 사진을 페이스 페인트, 스카프, 팬 존 조명, 자연스러운 닮은꼴이 있는 경기장 분위기 이미지로 바꿉니다.' },
    colors: { title: '국가 컬러 응원 사진', text: '브라질, 아르헨티나, 프랑스, 멕시코, 포르투갈풍 또는 맞춤 색상 조합의 팬 룩을 만들 수 있습니다.' },
    stickers: { title: '얼굴 깃발 스티커 셀피', text: '광택 있는 볼 스티커, 은은한 반짝임, 경기장 보케, 세련된 크리에이터 스타일의 클로즈업 셀피를 만듭니다.' },
    friends: { title: '커플과 친구 팬 사진', text: '팬 듀오, 친근한 라이벌 포즈, 베스트 프렌드 셀피, 다양한 색상 테마의 그룹 팬 존 사진을 생성합니다.' },
    cards: { title: '팬 트레이딩 카드', text: '포일 테두리, 가상의 팬 스탯, 굵은 숫자, 프리미엄 스포츠 카드 느낌의 초상화 카드를 만듭니다.' },
    travel: { title: '탑승권 스타일 여행 그래픽', text: '개최 도시 경로, 게이트 정보, 좌석 라벨, 인물 중심의 기념품 레이아웃이 있는 축구 여행 그래픽을 디자인합니다.' },
  },
  formatsEyebrow: '이미지 형식',
  formatsTitle: '팬 사진, 포스터, 스티커, 카드, 전단 만들기',
  formatsDescription: '템플릿 갤러리는 국가 컬러 응원 사진, 얼굴 깃발 스티커 셀피, 커플과 친구 팬 사진, 팬 카드, 만화 반응, 탑승권 스타일 여행 그래픽 등 유용한 방향을 포함합니다.',
  howEyebrow: '만드는 방법',
  howTitle: '월드컵 AI 이미지 만드는 방법',
  howDescription: '얼굴이 중요하면 선명한 참고 이미지를 업로드하고, 템플릿 스타일을 고르고, 축구 장면을 설명한 뒤 여러 버전 중 가장 좋은 이미지를 선택하세요.',
  stepLabel: '단계',
  schemaName: '월드컵 AI 이미지 만드는 방법',
  steps: [
    { title: '셀피 업로드 또는 텍스트로 시작', text: '알아보기 쉬운 팬 이미지는 선명한 인물 사진을 사용하고, 전단이나 스티커, 포스터는 텍스트 프롬프트로 시작하세요.' },
    { title: '템플릿 스타일 선택', text: '갤러리에서 선택하거나 클로즈업 셀피, 응원 포스터, 카드, 만화 패널, 포토부스 시트, 관전 파티 전단 같은 형식을 지정하세요.' },
    { title: '축구 디테일 추가', text: '장면, 색상, 포즈, 표정, 얼굴 스티커, 스카프, 색종이, 조명, 짧은 제목을 포함하세요.' },
    { title: '생성하고 비교', text: '여러 변형을 만들고 얼굴, 텍스트, 구도, 소셜 채널용 크롭이 가장 좋은 이미지를 선택하세요.' },
    { title: '다운로드 또는 리믹스', text: '결과를 저장하고 프롬프트를 복사하거나 다른 색상 테마와 팬 사진 스타일로 다시 생성하세요.' },
  ],
  promptEyebrow: '프롬프트 팁',
  promptTitle: '더 좋은 축구 이미지를 위한 프롬프트 팁',
  promptDescription: '좋은 축구 이미지 프롬프트는 길 필요가 없습니다. 주제, 형식, 분위기, 색상, 읽기 쉬운 짧은 텍스트가 중요합니다.',
  promptCards: [
    { title: '주제', text: '셀피, 커플, 친구 그룹, 스티커 팩, 관전 파티 장면, 트레이딩 카드, 여행 포스터처럼 주제를 명확히 정하세요.' },
    { title: '형식', text: '세로 포스터, 클로즈업 셀피, 포토부스 시트, 전단, 만화 스트립, 신문 1면, 팬 카드 등 출력 형식을 먼저 지정하세요.' },
    { title: '분위기', text: '경기장 보케, 거리 응원 퍼레이드, 아침 경기 프리뷰, 팬 존 조명, 색종이, 에디토리얼 조명 같은 구체적인 장면을 정하세요.' },
    { title: '색상', text: '공식 유니폼 대신 초록과 노랑, 하늘색과 흰색, 파랑 흰색 빨강, 빨강 초록, 검정 빨강 금색 같은 국가 컬러를 쓰세요.' },
    { title: '텍스트', text: '생성 텍스트는 짧게 유지하세요. Match Day, Fan Zone, Watch Party, Summer Football 같은 한 줄 제목이 좋습니다.' },
  ],
  styleEyebrow: '템플릿 스타일',
  styleTitle: '템플릿 스타일 선택',
  styleDescription: '이미지 형식마다 필요한 프롬프트가 다릅니다. 갤러리 템플릿을 새로운 축구 이미지 아이디어로 확장할 때 이 가이드를 사용하세요.',
  styleHeaders: { style: '스타일', bestFor: '추천 용도', promptFocus: '프롬프트 초점', example: '예시' },
  styleRows: [
    { style: '팬 셀피 초상화', bestFor: '프로필 편집, 스토리 게시물, 팬 존 이미지, 개인 경기일 그래픽', promptFocus: '얼굴 닮은꼴, 볼 스티커, 색상 테마, 경기장 보케, 자연스러운 표정', example: 'Face Flag Sticker Selfie' },
    { style: '커플 또는 친구 팬 사진', bestFor: '듀오 편집, 친근한 라이벌 게시물, 그룹 셀피, 커뮤니티 이미지', promptFocus: '인원수, 관계 포즈, 색상 대비, 팬 존 조명', example: 'Couple Rival Fans' },
    { style: '그래픽 포스터 또는 카드', bestFor: '팬 카드, 신문 표지, 스위스 포스터, 수집형 이미지', promptFocus: '레이아웃, 제목, 타이포그래피, 테두리, 가상 디테일, 여백', example: 'Fan Trading Card Foil' },
    { style: '스티커 또는 아이콘 팩', bestFor: '크리에이터 키트, 썸네일, 굿즈 콘셉트, 스토리 스티커, 기사 이미지', promptFocus: '분리된 오브젝트, 일관된 외곽선, 부드러운 그림자, 균형 잡힌 그리드', example: 'Football Fan Sticker Pack' },
    { style: '이벤트 전단', bestFor: '관전 파티 초대, 바 프로모션, 시청 이벤트 그래픽, 로컬 게시물', promptFocus: '장소 분위기, 텍스트 공간, 군중 에너지, 간식, 음료, 읽기 쉬운 제목', example: 'Watch Party Flyer' },
  ],
  ideasEyebrow: '이미지 아이디어',
  ideasTitle: '크리에이터와 소규모 비즈니스를 위한 월드컵 AI 이미지 아이디어',
  ideasDescription: '축구 시즌의 프로필 업데이트, 크리에이터 게시물, 이벤트 그래픽, 썸네일, 스티커 키트, 여행 리캡을 빠르게 만들 수 있습니다.',
  ideas: [
    { title: 'Instagram 스토리 커버', text: '짧은 캡션 공간이 있는 세로 팬 초상화, 페이스 페인트 클로즈업, 경기일 포스터.' },
    { title: 'TikTok과 Shorts 썸네일', text: '작은 화면에서도 빠르게 읽히는 에너지 있는 셀피, 놀란 반응, 만화 패널, 굵은 그래픽 카드.' },
    { title: '관전 파티 전단', text: '바, 크리에이터, 캠퍼스, 클럽, 지역 관전 밤을 위한 이벤트 그래픽.' },
    { title: '팬 프로필 이미지', text: '국가 컬러 팬 초상화, 볼 스티커 룩, 스카프 포즈, 프로필용으로 다듬은 크롭.' },
    { title: '스티커 팩', text: '축구 아이콘, 팬 키트 일러스트, 배지형 그래픽, 크리에이터 번들용 playful 오브젝트.' },
    { title: '여행 리캡 그래픽', text: '탑승권 카드, 레트로 투어 포스터, 도시 경로 레이아웃, 축구 여행 기념 이미지.' },
  ],
  whyEyebrow: 'Toolaze를 쓰는 이유',
  whyTitle: '월드컵 AI 이미지에 Toolaze를 쓰는 이유',
  whyDescription: 'Toolaze는 실제 GPT Image 2 생성기와 큰 축구 템플릿 갤러리를 결합합니다. 프롬프트를 복사하고, 비슷한 이미지를 만들고, 참고 사진을 위 생성기로 보낼 수 있습니다.',
  whyBullets: [
    '빈 프롬프트 상자가 아니라 실제 생성된 축구 템플릿에서 시작합니다.',
    '프롬프트를 복사하거나 템플릿 참고 이미지를 한 번에 생성기로 보냅니다.',
    '셀피, 커플, 그룹 참고 이미지를 팬 초상화와 소셜 이미지에 사용할 수 있습니다.',
    '게시물, 썸네일, 전단, 스티커, 프로필 사진, 크리에이터 그래픽용 정지 이미지를 만듭니다.',
  ],
  faqEyebrow: 'FAQ',
  faqTitle: '월드컵 AI 콘텐츠 질문',
  faqDescription: '축구 이미지, 팬 초상화, 스티커, 전단, 썸네일, 소셜 게시물을 만드는 크리에이터를 위한 짧은 답변입니다.',
  faqs: [
    { q: '월드컵 AI 이미지 생성기는 무엇인가요?', a: '텍스트 프롬프트나 참고 이미지로 축구 포스터, 팬 초상화, 스티커, 전단, 소셜 그래픽을 만드는 데 도움을 주는 도구입니다.' },
    { q: '셀피로 축구 팬 이미지를 만들 수 있나요?', a: '네. 선명한 셀피를 업로드하고 템플릿을 선택하거나 프롬프트를 쓰면 GPT Image 2가 주요 얼굴을 알아보기 쉽게 유지하며 팬 초상화를 만들 수 있습니다.' },
    { q: '국가 컬러 팬 초상화를 만들 수 있나요?', a: '네. 초록과 노랑, 하늘색과 흰색, 파랑 흰색 빨강, 빨강 초록 또는 맞춤 팔레트를 설명할 수 있습니다.' },
    { q: '커플이나 친구 축구 이미지도 만들 수 있나요?', a: '네. 커플 또는 그룹 참고 이미지를 사용하거나 갤러리의 커플과 친구 템플릿에서 시작할 수 있습니다.' },
    { q: '이 페이지는 영상을 생성하나요?', a: '아니요. 이 페이지는 GPT Image 2로 포스터, 셀피, 전단, 스티커, 썸네일 같은 정지 이미지를 생성합니다.' },
    { q: '축구 AI 이미지 프롬프트에는 무엇을 써야 하나요?', a: '주제, 형식, 장면, 색상, 스타일, 짧은 이미지 텍스트를 포함하세요. 예: 클로즈업 팬 셀피, 빨강과 초록 볼 스티커, 경기장 보케, 에디토리얼 조명.' },
    { q: '관전 파티 전단이나 스티커 팩도 만들 수 있나요?', a: '네. 텍스트 프롬프트로 관전 파티 전단, 축구 스티커 시트, 팬 키트 아이콘, 소셜 커버, 크리에이터 그래픽을 만들 수 있습니다.' },
    { q: 'Toolaze는 FIFA와 관련이 있나요?', a: 'Toolaze는 독립적인 크리에이티브 도구이며 FIFA와 제휴되어 있지 않습니다.' },
  ],
  ctaTitle: 'GPT Image 2로 월드컵 AI 이미지 만들기',
  ctaDescription: '템플릿을 선택하고 셀피나 참고 이미지를 업로드해 팬 포스터, 스티커 팩, 관전 파티 전단, 소셜 이미지를 브라우저에서 생성하세요.',
  ctaButton: '이미지 생성',
})

const zhTW = buildCopy({
  metadataTitle: '世界盃 AI 圖像生成器 | AI 足球海報與球迷照片 | Toolaze',
  metadataDescription: '使用 Toolaze 的 GPT Image 2 建立世界盃風格 AI 足球海報、球迷自拍、國家色肖像、貼圖包、觀賽派對傳單與社群圖片。',
  home: '首頁',
  aiTools: 'AI 工具',
  current: '世界盃 AI 圖像生成器',
  heroHighlight: '世界盃 AI',
  heroSuffix: '圖像生成器',
  heroDescription: '直接在瀏覽器中用 GPT Image 2 建立足球球迷海報、自拍改圖、國家色肖像、貼圖包、觀賽派對傳單與社群圖片。',
  templateEyebrow: '圖像模板',
  templateTitle: '選擇世界盃圖像模板並建立相似版本',
  templateDescription: '從已生成的足球方向開始：球迷海報、迷因反應、貼圖包、觀賽派對傳單、倒數、拼貼和球迷卡。點選模板即可把圖片與提示詞送到上方 GPT Image 2 編輯器。',
  copyPrompt: '複製提示詞',
  copied: '已複製',
  createSimilar: '建立相似圖片',
  altSuffix: '世界盃 AI 圖像模板',
  allCategory: '全部',
  templateTitlePrefix: '模板',
  whatEyebrow: '可以建立什麼',
  whatTitle: '這個世界盃 AI 圖像生成器可以建立哪些內容？',
  whatDescription: '把 GPT Image 2 當作 AI 足球海報生成器與球迷海報製作工具。從自拍、模板或短提示詞開始，建立適合貼文、縮圖、傳單與球迷圖像的靜態圖片。',
  cards: {
    workflow: { title: '從模板到圖像', text: '選擇足球模板，把提示詞和參考圖片送入生成器，再用你的自拍或想法建立相似圖片。' },
    reference: { title: '支援自拍與參考圖', text: '使用肖像、情侶照、團體自拍或簡單參考圖，引導臉部、姿勢、風格和球迷氣氛。' },
    social: { title: '適合社群的格式', text: '建立直式海報、球迷肖像、貼圖表、觀賽派對傳單、漫畫反應和收藏卡風格圖片。' },
    selfie: { title: '球迷自拍肖像', text: '把清晰肖像轉成有臉部彩繪、圍巾、球迷區燈光和自然相似度的球場氛圍圖片。' },
    colors: { title: '國家色應援照片', text: '建立巴西、阿根廷、法國、墨西哥、葡萄牙風格，或自訂配色的球迷造型。' },
    stickers: { title: '臉部國旗貼紙自拍', text: '製作帶有亮面臉頰貼紙、細緻閃粉、球場散景和創作者風格的近距離自拍。' },
    friends: { title: '情侶與朋友球迷照片', text: '生成球迷雙人照、友好對手姿勢、好友自拍，以及不同配色主題的團體球迷照片。' },
    cards: { title: '球迷收藏卡', text: '建立有箔面邊框、虛構球迷數據、醒目號碼和高級運動卡感的肖像卡。' },
    travel: { title: '登機證風旅行圖像', text: '設計包含主辦城市路線、登機口細節、座位標籤和肖像紀念版面的足球旅行圖像。' },
  },
  formatsEyebrow: '圖像格式',
  formatsTitle: '建立球迷照片、海報、貼圖、卡片和傳單',
  formatsDescription: '模板圖庫已涵蓋實用方向：國家色應援照片、臉部國旗貼紙自拍、情侶與朋友球迷照片、球迷卡、漫畫反應和登機證風旅行圖像。',
  howEyebrow: '建立方式',
  howTitle: '如何製作世界盃 AI 圖像',
  howDescription: '保持流程簡單：臉部重要時上傳清楚參考圖，選擇模板風格，描述足球場景，生成幾個版本並保留最好的圖片。',
  stepLabel: '步驟',
  schemaName: '如何建立世界盃 AI 圖像',
  steps: [
    { title: '上傳自拍或從文字開始', text: '想要可辨識的球迷圖片時使用清楚肖像；製作傳單、貼圖、海報或圖像概念時可從文字提示詞開始。' },
    { title: '選擇模板風格', text: '從圖庫選擇，或描述格式：近距離自拍、應援海報、卡片、漫畫分鏡、拍貼表或觀賽派對傳單。' },
    { title: '加入足球細節', text: '包含場景、色彩、姿勢、表情、臉部貼紙、圍巾、紙花、燈光和短標題。' },
    { title: '生成並比較版本', text: '生成幾個變化，保留臉部最好、文字最乾淨、構圖最強、最適合社群裁切的圖片。' },
    { title: '下載或重新混合', text: '儲存最佳結果、複製提示詞，或回到模板圖庫用不同色彩主題和球迷照片風格再生成。' },
  ],
  promptEyebrow: '提示詞技巧',
  promptTitle: '製作更好足球圖片的提示詞技巧',
  promptDescription: '好的足球圖片提示詞不需要很長。重點是主體、格式、氣氛、顏色，以及少量可讀文字。',
  promptCards: [
    { title: '主體', text: '先明確主體：自拍、情侶、朋友團體、貼圖包、觀賽派對場景、收藏卡或旅行海報。' },
    { title: '格式', text: '盡早說明輸出形式：直式海報、近距離自拍、拍貼表、傳單、漫畫條、報紙頭版或球迷卡。' },
    { title: '氣氛', text: '指定具體場景：球場散景、街頭球迷遊行、早晨賽前預覽、球迷區燈光、紙花或編輯感燈光。' },
    { title: '顏色', text: '用國家色描述，不必依賴官方球衣細節：綠黃、天藍白、藍白紅、紅綠、黑紅金。' },
    { title: '文字', text: '生成文字保持簡短。像 Match Day、Fan Zone、Watch Party 或 Summer Football 這類標題更容易成功。' },
  ],
  styleEyebrow: '模板風格',
  styleTitle: '選擇模板風格',
  styleDescription: '不同圖像格式需要不同提示詞。當你想把圖庫模板延伸成新的足球圖片想法時，可以使用這份指南。',
  styleHeaders: { style: '風格', bestFor: '適合用途', promptFocus: '提示詞重點', example: '範例' },
  styleRows: [
    { style: '球迷自拍肖像', bestFor: '個人資料編輯、限時動態、球迷區圖片和比賽日個人圖像', promptFocus: '臉部相似度、臉頰貼紙、色彩主題、球場散景、自然表情', example: 'Face Flag Sticker Selfie' },
    { style: '情侶或朋友球迷照片', bestFor: '雙人改圖、友好對手貼文、團體自拍和社群圖片', promptFocus: '人數、關係姿勢、色彩對比、球迷區燈光', example: 'Couple Rival Fans' },
    { style: '圖像海報或卡片', bestFor: '球迷卡、報紙封面、Swiss poster 和收藏型圖片', promptFocus: '版面、標題、字體風格、邊框、虛構細節、乾淨間距', example: 'Fan Trading Card Foil' },
    { style: '貼圖或圖示包', bestFor: '創作者素材包、縮圖、商品概念、限動貼圖和文章配圖', promptFocus: '分離物件、一致描邊、柔和陰影、平衡網格', example: 'Football Fan Sticker Pack' },
    { style: '活動傳單', bestFor: '觀賽派對邀請、酒吧宣傳、觀賽夜圖像和地方活動貼文', promptFocus: '場地氣氛、文字空間、人群能量、點心、飲料、可讀標題', example: 'Watch Party Flyer' },
  ],
  ideasEyebrow: '圖像想法',
  ideasTitle: '給創作者和小型商家的世界盃 AI 圖像想法',
  ideasDescription: '使用生成器快速製作足球季素材：個人資料更新、創作者貼文、活動圖像、縮圖、貼圖包和旅行回顧。',
  ideas: [
    { title: 'Instagram 限時動態封面', text: '直式球迷肖像、臉部彩繪近照，以及保留短文案空間的比賽日海報。' },
    { title: 'TikTok 和 Shorts 縮圖', text: '小螢幕上也能快速辨識的高能自拍、震驚反應、漫畫分鏡和醒目圖像卡。' },
    { title: '觀賽派對傳單', text: '給酒吧、創作者、校園、社團和地方觀賽夜使用的活動圖像。' },
    { title: '球迷個人頭像', text: '國家色球迷肖像、臉頰貼紙造型、圍巾姿勢和適合個人資料的精修裁切。' },
    { title: '貼圖包', text: '足球圖示、球迷套件插畫、徽章風圖像和創作者素材包用的趣味物件。' },
    { title: '旅行回顧圖像', text: '登機證卡片、復古巡迴海報、城市路線版面和足球旅行紀念圖片。' },
  ],
  whyEyebrow: '為什麼用 Toolaze',
  whyTitle: '為什麼用 Toolaze 製作世界盃 AI 圖像？',
  whyDescription: 'Toolaze 結合真正的 GPT Image 2 生成器和大型足球模板圖庫。你可以複製提示詞、建立相似圖片，並把參考照片送到上方生成器。',
  whyBullets: [
    '從真實生成的足球模板開始，而不是空白提示詞框。',
    '一鍵複製任何提示詞，或把模板參考圖片送進生成器。',
    '使用自拍、情侶和團體參考圖製作球迷肖像與社群圖片。',
    '建立適合貼文、縮圖、傳單、貼圖、個人照片和創作者圖像的靜態圖片。',
  ],
  faqEyebrow: 'FAQ',
  faqTitle: '世界盃 AI 內容常見問題',
  faqDescription: '給製作足球風圖片、球迷肖像、貼圖、傳單、縮圖和社群貼文的創作者的簡短回答。',
  faqs: [
    { q: '什麼是世界盃 AI 圖像生成器？', a: '它能幫助你用文字提示詞或參考圖片建立足球海報、球迷肖像、貼圖、傳單和社群圖像。' },
    { q: '我可以用自拍製作足球球迷圖片嗎？', a: '可以。上傳清楚自拍，選擇模板或撰寫提示詞，GPT Image 2 可以建立球迷肖像並保留主要臉部辨識度。' },
    { q: '可以建立國家色球迷肖像嗎？', a: '可以。你可以描述綠黃、天藍白、藍白紅、紅綠或自訂色彩主題。' },
    { q: '可以製作情侶或朋友足球圖片嗎？', a: '可以。使用情侶或團體參考圖，或從圖庫中的情侶和朋友模板開始。' },
    { q: '這個頁面會生成影片嗎？', a: '不會。這個頁面使用 GPT Image 2 生成靜態圖片，適合海報、自拍、傳單、貼圖、縮圖等圖像素材。' },
    { q: '足球 AI 圖像提示詞應該寫什麼？', a: '包含主體、格式、場景、顏色、風格和短文字。例如：近距離球迷自拍、紅綠臉頰貼紙、球場散景、編輯感燈光。' },
    { q: '可以製作觀賽派對傳單或貼圖包嗎？', a: '可以。生成器能從文字提示詞建立觀賽派對傳單、足球貼圖表、球迷套件圖示、社群封面和創作者圖像。' },
    { q: 'Toolaze 和 FIFA 有關係嗎？', a: 'Toolaze 是獨立創意工具，與 FIFA 沒有關聯。' },
  ],
  ctaTitle: '用 GPT Image 2 建立你的世界盃 AI 圖像',
  ctaDescription: '選擇模板，上傳自拍或參考圖片，直接在瀏覽器中生成球迷海報、貼圖包、觀賽派對傳單或社群圖片。',
  ctaButton: '生成圖片',
})

const copies: Record<WorldCupPageLocale, WorldCupPageCopy> = {
  en,
  de,
  ja,
  es,
  'zh-TW': zhTW,
  pt,
  fr,
  ko,
  it,
}

export function getWorldCupPageCopy(locale: string): WorldCupPageCopy {
  return copies[locale as WorldCupPageLocale] || en
}
