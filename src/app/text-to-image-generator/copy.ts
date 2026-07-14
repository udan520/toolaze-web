import type { AiImageGeneratorPageCopy } from '@/app/ai-image-generator/copy'
import { getAiImageGeneratorPageCopy } from '@/app/ai-image-generator/copy'

export const TEXT_TO_IMAGE_GENERATOR_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'] as const

export type TextToImageGeneratorLocale = (typeof TEXT_TO_IMAGE_GENERATOR_LOCALES)[number]

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<unknown>
    ? T[P]
    : T[P] extends object
      ? DeepPartial<T[P]>
      : T[P]
}

const base = getAiImageGeneratorPageCopy('en')
const aiImageAsset = (fileName: string) =>
  `/ai-image-generator/${fileName}`
const textToImageAsset = (fileName: string) =>
  `/ai-image-generator/text-to-image-generator/${fileName}`

function mergeCopy<T>(baseCopy: T, override?: DeepPartial<T>): T {
  if (!override) return baseCopy
  const result: any = Array.isArray(baseCopy) ? [...baseCopy] : { ...(baseCopy as any) }

  Object.entries(override as Record<string, unknown>).forEach(([key, value]) => {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      result[key] &&
      typeof result[key] === 'object' &&
      !Array.isArray(result[key])
    ) {
      result[key] = mergeCopy(result[key], value as any)
      return
    }

    result[key] = value
  })

  return result
}

export const textToImageGeneratorPageCopy: AiImageGeneratorPageCopy = {
  ...base,
  metadata: {
    title: 'Text to Image Generator Free Online - No Sign Up | Toolaze',
    description:
      'Create AI images from text online for free, with practical guidance for writing clearer prompts, fixing weak results, and knowing when to use a reference image instead.',
  },
  breadcrumbs: {
    home: 'Home',
    aiTools: 'AI Tools',
    current: 'Text to Image Generator',
  },
  hero: {
    highlight: 'Text to Image Generator',
    description:
      'Create an image from words, then improve it with a clearer subject, composition, lighting, text rule, and review goal. Use it when you do not have a reference image yet.',
    badges: ['Words to Image', 'No Reference Upload', 'Free Online', 'No Sign Up', 'Prompt Fixes'],
  },
  whatIs: {
    title: 'What Is a Text to Image Generator?',
    paragraphs: [
      'A text to image generator creates a new visual from a written description. You explain what should appear, how it should be arranged, which visual style to use, and where any short visible text belongs.',
      'Use this workflow when the important input is the idea itself: a headline, product concept, character description, scene direction, layout request, or rough creative brief. The better you define the subject and constraints, the less the model has to guess.',
      'If you need to keep a real product, person, room, pose, or existing composition recognizable, use image-to-image instead. If you want text-only and reference-image creation together, use AI Image Generator.',
    ],
  },
  promise: {
    title: 'Write Less Guesswork Into the Prompt',
    text:
      'A weak prompt asks the model to invent too many decisions at once. A useful prompt gives the model a role, a subject, a layout, a style boundary, and a clear way to judge success.',
    cards: [
      {
        title: 'Use It When Text Is Enough',
        text: 'Good fit: mood exploration, rough campaign concepts, fictional products, thumbnails, characters, posters, explainers, and early visual directions.',
      },
      {
        title: 'Avoid It When Accuracy Matters',
        text: 'Poor fit: exact product likeness, real packaging, brand-safe faces, room preservation, pose matching, or any task where a source image must stay recognizable.',
      },
      {
        title: 'Write a Testable Request',
        text: 'Instead of “make it better”, name the exact failure to fix: clutter, wrong crop, weak subject, unreadable words, mismatched style, or incorrect aspect ratio.',
      },
      {
        title: 'Change One Variable',
        text: 'Compare variations by changing only one thing at a time, such as camera angle, lighting, background complexity, text length, or output format.',
      },
    ],
  },
  features: {
    title: 'What to Include in Your Prompt',
    text:
      'Strong text-to-image prompts remove ambiguity. Use this order: asset type, subject, composition, style, lighting, text rule, aspect ratio, and review goal.',
    items: [
      {
        title: '1. Asset Type',
        text: 'Say what the output is before describing the scene: landing page hero, product poster, YouTube thumbnail, character sheet, infographic, UI mockup, or social ad.',
        image: textToImageAsset('asset-type-output-set.webp'),
        alt: 'AI text to image outputs showing several asset types from prompts',
        width: 1600,
        height: 900,
      },
      {
        title: '2. Subject and Constraints',
        text: 'Name the main subject and the boundaries around it. For a product concept, include shape, material, surface, background, scale, and what must stay simple.',
        image: aiImageAsset('prompt-ecommerce-product.webp'),
        alt: 'AI ecommerce product output with clear subject constraints',
        width: 1600,
        height: 900,
      },
      {
        title: '3. Composition',
        text: 'Tell the model where things go: centered hero object, empty headline space, close crop, three-panel layout, top-down view, or subject on the left.',
        image: aiImageAsset('poster-ad-generator.webp'),
        alt: 'AI image concept with controlled composition and headline space',
        width: 1600,
        height: 900,
        href: '/prompts/categories/advertising',
        label: 'Explore examples',
      },
      {
        title: '4. Style Boundary',
        text: 'Use one coherent direction instead of a style pileup. “Editorial studio photo with soft shadows” is clearer than mixing cinematic, 3D, watercolor, luxury, and cyberpunk.',
        image: aiImageAsset('product-image-generator.webp'),
        alt: 'AI image generated with a clear style boundary',
        width: 1600,
        height: 900,
      },
      {
        title: '5. Lighting and Detail Level',
        text: 'Lighting changes the result more than many adjectives. Specify soft studio shadows, daylight interior, flat vector lighting, moody contrast, or clean ecommerce lighting.',
        image: aiImageAsset('product-launch-poster.webp'),
        alt: 'AI product poster output with controlled moody lighting',
        width: 1600,
        height: 900,
      },
      {
        title: '6. Text Rules',
        text: 'If the image needs words, keep them short, put exact copy in quotes, and define placement. Long slogans and dense labels are more likely to misspell.',
        image: textToImageAsset('text-rules-short-copy.webp'),
        alt: 'AI ad output with short readable text placement',
        width: 1600,
        height: 900,
      },
      {
        title: '7. Output Format',
        text: 'Choose the finished format before judging composition. A poster, thumbnail, social ad, mobile story, hero banner, and infographic all need different spacing and crop decisions.',
        image: textToImageAsset('output-format-infographic.webp'),
        alt: 'AI infographic output generated for a clear landscape format',
        width: 1600,
        height: 900,
        href: '/model/gpt-image-2',
        label: 'Try GPT Image 2',
      },
      {
        title: '8. Review Goal',
        text: 'End with what you are testing: concept direction, layout clarity, readable text, product mood, character design, or first-pass presentation quality.',
        image: aiImageAsset('ui-mockup-concept.webp'),
        alt: 'AI UI mockup output for reviewing layout clarity',
        width: 1600,
        height: 900,
      },
    ],
  },
  gallery: {
    title: 'Bad Prompt vs Better Prompt Examples',
    text:
      'Use these examples to turn vague requests into clearer image instructions with a subject, layout, style, text rule, and final-use context.',
    examples: [
      {
        title: 'Product Concept',
        text: 'Weak: “make a product ad.” Better: define the imaginary product shape, material, surface, background, headline zone, lighting, and campaign format.',
        image: aiImageAsset('product-launch-poster.webp'),
        alt: 'Text to image product concept prompt improvement example',
        width: 1600,
        height: 900,
      },
      {
        title: 'Social Ad',
        text: 'Weak: “viral fitness ad.” Better: give the hook, product role, camera crop, color contrast, background simplicity, and exact short copy.',
        image: textToImageAsset('fitness-drink-social-ad.webp'),
        alt: 'Text to image social ad prompt improvement example',
        width: 1600,
        height: 900,
      },
      {
        title: 'UI Mockup',
        text: 'Weak: “modern app screen.” Better: specify number of screens, screen purpose, component hierarchy, label style, palette, and presentation angle.',
        image: aiImageAsset('ui-mockup-concept.webp'),
        alt: 'Text to image UI mockup prompt improvement example',
        width: 1600,
        height: 900,
      },
      {
        title: 'Marketplace Image',
        text: 'Weak: “ecommerce photo.” Better: define the object, surface, prop limit, camera angle, whitespace, lighting, and whether the product is fictional.',
        image: aiImageAsset('ecommerce-product-image.webp'),
        alt: 'Text to image marketplace prompt improvement example',
        width: 1600,
        height: 900,
      },
      {
        title: 'Thumbnail',
        text: 'Weak: “eye-catching thumbnail.” Better: set the face or object, emotion, crop, contrast, title area, and maximum word count.',
        image: aiImageAsset('youtube-thumbnail.webp'),
        alt: 'Text to image thumbnail prompt improvement example',
        width: 1600,
        height: 900,
      },
      {
        title: 'Explainer Graphic',
        text: 'Weak: “make an infographic.” Better: limit it to three steps, simple icons, short labels, left-to-right flow, and one clear visual hierarchy.',
        image: aiImageAsset('educational-infographic.webp'),
        alt: 'Text to image explainer prompt improvement example',
        width: 1600,
        height: 900,
      },
      {
        title: 'Character Concept',
        text: 'Weak: “cool sci-fi character.” Better: name role, silhouette, outfit materials, prop, pose, expression, background simplicity, and sheet layout.',
        image: aiImageAsset('portrait-character-concept.webp'),
        alt: 'Text to image character prompt improvement example',
        width: 1600,
        height: 900,
      },
      {
        title: 'Productivity App Ad',
        text: 'Weak: “make an app ad.” Better: define the app benefit, phone placement, desk context, headline space, benefit callouts, and CTA style.',
        image: textToImageAsset('productivity-app-ad.webp'),
        alt: 'Text to image productivity app ad prompt improvement example',
        width: 1600,
        height: 900,
      },
    ],
  },
  models: {
    ...base.models,
    title: 'Choose a Text to Image Model',
    description:
      'Different image models handle instruction following, composition, readable short text, style range, speed, and high-resolution output differently. Start with GPT Image 2, then switch models when the image brief needs a different strength.',
    comparisonTitle: 'When to Switch Models',
  },
  modes: {
    title: 'When Text-to-Image Is the Wrong Tool',
    description:
      'Text-to-image is best for new ideas. Reference-image workflows are better when visual accuracy, identity, pose, product shape, or room layout matters.',
    headers: {
      label: 'Workflow',
      aiImageGenerator: 'Best for',
      textToImage: 'Input',
      imageToImage: 'Output',
    },
    rows: [
      {
        label: 'Text to Image Generator',
        aiImageGenerator: 'Creating a new visual from scratch',
        textToImage: 'Written description only',
        imageToImage: 'A generated image based on the text description',
      },
      {
        label: 'AI Image to Image Generator',
        aiImageGenerator: 'Creating controlled variations from an existing image',
        textToImage: 'Reference image plus prompt',
        imageToImage: 'A new image guided by the uploaded reference',
      },
      {
        label: 'AI Image Generator',
        aiImageGenerator: 'Choosing the best mode and model for the task',
        textToImage: 'Text, reference image, or both',
        imageToImage: 'New image, edited image, or creative variation',
      },
    ],
  },
  prompts: {
    title: 'Text to Image Brief Templates',
    text:
      'Copy a template, paste it into the generator, then replace the subject, style, aspect ratio, and text details. Each one shows a different structure rather than just another output category.',
    copyButton: 'Copy template',
    copiedButton: 'Copied',
    examples: [
      {
        title: 'Beverage Poster Brief',
        prompt:
          'Create a polished beverage poster for a fictional citrus sparkling water can named "Luma Fizz". Use the exact large headline "FRESH SPARK", add the short subline "Citrus sparkling water", center one can with citrus slices and water splash, and keep the copy short and readable.',
        image: textToImageAsset('text-rules-short-copy.webp'),
        alt: 'Text to image beverage poster brief example',
        width: 1600,
        height: 900,
      },
      {
        title: 'YouTube Thumbnail Brief',
        prompt:
          'Create a bold YouTube thumbnail concept for a tutorial video. Use one clear hero subject, close crop, strong contrast, expressive composition, bright accent color, and a short readable title area with no more than four words.',
        image: aiImageAsset('prompt-youtube-thumbnail.webp'),
        alt: 'Text to image YouTube thumbnail brief example',
        width: 1600,
        height: 900,
      },
      {
        title: 'Social Media Ad Brief',
        prompt:
          'Create a vertical social media visual for a new fitness drink concept. Show the imaginary product as the main subject, use energetic lighting, clean spacing for short copy, and a fresh commercial photography style.',
        image: aiImageAsset('prompt-social-media-ad.webp'),
        alt: 'Text to image social media ad brief example',
        width: 1600,
        height: 900,
      },
      {
        title: 'UI Mockup Brief',
        prompt:
          'Create a modern mobile app onboarding mockup for a finance app concept. Use three clean screens, rounded UI cards, readable labels, calm colors, and a realistic product presentation layout.',
        image: aiImageAsset('prompt-ui-mockup.webp'),
        alt: 'Text to image UI mockup brief example',
        width: 1600,
        height: 900,
      },
      {
        title: 'Character Concept Brief',
        prompt:
          'Create a character concept sheet for a friendly sci-fi courier. Include a full-body pose, outfit details, prop callouts, expressive face, clean background, and consistent design language.',
        image: aiImageAsset('prompt-character-sheet.webp'),
        alt: 'Text to image character concept brief example',
        width: 1600,
        height: 900,
      },
      {
        title: 'Educational Infographic Brief',
        prompt:
          'Create an educational infographic explaining how solar panels work. Use three clear steps, simple icons, readable labels, bright daylight colors, and a clean classroom presentation layout.',
        image: aiImageAsset('prompt-educational-infographic.webp'),
        alt: 'Text to image educational infographic brief example',
        width: 1600,
        height: 900,
      },
      {
        title: 'Productivity App Ad Brief',
        prompt:
          'Create a clean productivity app ad for an imaginary focus timer app. Show a phone mockup on a bright desk, use calm daylight, one large headline area, three short benefit callouts, and a neat app-store style CTA.',
        image: textToImageAsset('productivity-app-ad.webp'),
        alt: 'Text to image productivity app ad brief example',
        width: 1600,
        height: 900,
      },
      {
        title: 'Skincare Hero Brief',
        prompt:
          'Create a clean landing page hero image for an imaginary skincare serum. Place the product as the main subject, use soft daylight, botanical detail, generous whitespace for one short headline, and a polished ecommerce presentation style.',
        image: textToImageAsset('skincare-hero-brief.webp'),
        alt: 'Text to image skincare landing page hero brief example',
        width: 1600,
        height: 900,
      },
    ],
  },
  howTo: {
    schemaName: 'How to Use Toolaze Text to Image Generator',
    title: 'How to Get Better Results From Text',
    description:
      'Do not rewrite everything after the first result. Review the failure, then adjust the smallest instruction that explains the problem.',
    stepLabel: 'Step',
    steps: [
      {
        title: 'Write the First Version',
        text: 'Start with asset type, subject, composition, style, lighting, aspect ratio, text rule, and final use case.',
      },
      {
        title: 'Check the Main Failure',
        text: 'Identify the biggest issue first: wrong subject, cluttered scene, weak crop, misspelled text, inconsistent style, or poor hierarchy.',
      },
      {
        title: 'Change One Instruction',
        text: 'If the layout is wrong, change composition only. If the text fails, shorten text only. If the image feels generic, sharpen the subject only.',
      },
      {
        title: 'Compare Variations',
        text: 'Generate more than one result with the same request before changing the direction. One weak output does not always mean the instruction is wrong.',
      },
      {
        title: 'Switch Workflow if Needed',
        text: 'If you keep trying to preserve a real object, face, pose, room, or layout, stop rewriting text and upload a reference image instead.',
      },
    ],
  },
  useCases: {
    title: 'Common Failures and How to Fix Them',
    description:
      'Fix the biggest issue first: subject, layout, text, style, or realism. Change one instruction at a time instead of adding more style words.',
    cards: [
      {
        title: 'The Subject Looks Generic',
        text: 'Add concrete traits: shape, material, scale, role, pose, surface, era, product category, or one distinctive visual detail.',
      },
      {
        title: 'The Scene Is Cluttered',
        text: 'Limit the number of objects, ask for a simple background, define negative space, and remove competing style directions.',
      },
      {
        title: 'The Layout Feels Random',
        text: 'Specify focal point, crop, subject position, headline area, visual hierarchy, and the intended aspect ratio before generating again.',
      },
      {
        title: 'The Text Is Wrong',
        text: 'Use fewer words, put exact text in quotes, define placement, and avoid asking for dense labels or long slogans inside the image.',
      },
      {
        title: 'The Style Is Inconsistent',
        text: 'Remove mixed references. Pick one visual language, one lighting setup, and one color palette before testing another version.',
      },
      {
        title: 'The Result Cannot Match Reality',
        text: 'If the job depends on a real product, person, logo, room, or exact packaging shape, use image-to-image instead of text alone.',
      },
    ],
  },
  related: {
    title: 'Related AI Image Tools',
    description:
      'Continue with reference editing, broader AI image generation, model pages, prompt libraries, and publishing utilities.',
    cards: [
      {
        title: 'AI Image Generator',
        href: '/ai-image-generator',
        label: 'Open AI Image Generator',
        text: 'Use the broader image generator when you want both text-to-image and image-to-image workflows in one place.',
      },
      {
        title: 'AI Image to Image Generator',
        href: '/ai-image-to-image-generator',
        label: 'Edit From Image',
        text: 'Upload a reference image when you need to preserve a person, product, room, pose, layout, or existing composition.',
      },
      {
        title: 'GPT Image 2',
        href: '/model/gpt-image-2',
        label: 'Try GPT Image 2',
        text: 'Use GPT Image 2 for instruction following, structured layouts, short visible text, and first-pass drafts from words.',
      },
      {
        title: 'GPT Image 2 Prompts',
        href: '/prompts/models/gpt-image-2',
        label: 'Open Prompts',
        text: 'Browse reusable structures you can adapt before writing your own image brief.',
      },
      {
        title: 'Advertising Prompts',
        href: '/prompts/categories/advertising',
        label: 'View Advertising',
        text: 'Use ad-focused templates when an early campaign idea needs a stronger hook, layout, or CTA structure.',
      },
      {
        title: 'Image Compressor',
        href: '/image-compressor',
        label: 'Compress Images',
        text: 'Compress generated images for faster web publishing, ecommerce uploads, social posts, and landing pages.',
      },
    ],
  },
  faq: {
    title: 'Text to Image Generator FAQ',
    description:
      'Answers to common questions about written briefs, free usage, no-sign-up access, readable text, commercial drafts, and image creation workflows.',
    items: [
      {
        q: 'What is a text to image generator?',
        a: 'A text to image generator creates a new image from a written description. You describe the subject, scene, style, lighting, composition, aspect ratio, and any short visible text you want in the final image.',
      },
      {
        q: 'Can I use this text to image generator for free?',
        a: 'Yes. You can start creating AI images online for free. Usage may vary by quota, selected model, quality settings, and current account status.',
      },
      {
        q: 'Do I need to sign up?',
        a: 'No sign up is needed to start. You can open the generator, write a description, choose settings, and create images online.',
      },
      {
        q: 'How do I write a good text to image brief?',
        a: 'Include the asset type, subject, background, visual style, lighting, composition, aspect ratio, exact text if needed, and the final use case.',
      },
      {
        q: 'What can I create from text?',
        a: 'You can create first-pass visual directions, including concept images, layout drafts, short-text graphics, character briefs, explainer visuals, campaign moods, and placeholder assets.',
      },
      {
        q: 'When should I use Text to Image Generator?',
        a: 'Use this workflow when the job starts from words only and you want structured guidance. Use AI Image Generator when you want to switch freely between text-only and reference-image creation.',
      },
      {
        q: 'What should I include before creating the first image?',
        a: 'Include the asset type, main subject, composition, style, lighting, aspect ratio, visible text rules, and what you want to evaluate in the result.',
      },
      {
        q: 'Can it generate readable text inside images?',
        a: 'Short visible text is more reliable than long copy. Keep text brief, put exact words in quotes, describe where the text should appear, and review spelling before publishing.',
      },
      {
        q: 'What model should I start with?',
        a: 'Start with GPT Image 2 for instruction following, composition, short visible text, and structured layouts. Try other models when you need faster variations, different style behavior, or higher-resolution output.',
      },
      {
        q: 'How is text-to-image different from image-to-image?',
        a: 'Text-to-image starts from a prompt only. Image-to-image starts from an uploaded reference, so it is better when you need to keep a product, person, pose, room, or composition recognizable.',
      },
      {
        q: 'Can I use generated images commercially?',
        a: 'Generated images can be used as commercial drafts when they meet your rights, brand, platform, and legal requirements. Review final assets before publishing.',
      },
      {
        q: 'Why does my result not match the prompt?',
        a: 'The request may be too broad or contradictory. Rewrite it with a clearer subject, simpler layout, fewer competing styles, and more specific output details.',
      },
      {
        q: 'When should I upload a reference image instead?',
        a: 'Upload a reference when the result must preserve a real product, face, pose, room layout, packaging shape, or existing composition. Use text-only creation for new ideas from scratch.',
      },
      {
        q: 'How should I fix weak first results?',
        a: 'Diagnose one problem at a time. Clarify the subject if it looks generic, simplify the scene if it feels cluttered, shorten visible text if spelling fails, or choose a stricter aspect ratio if the layout drifts.',
      },
    ],
  },
  cta: {
    title: 'Write a Brief and Generate From Scratch',
    description:
      'Start with a written idea, choose a model and format, then create a text-only AI image you can refine into a stronger visual direction.',
    button: 'Start Text to Image',
  },
}

const localizedTextToImageOverrides: Record<Exclude<TextToImageGeneratorLocale, 'en'>, DeepPartial<AiImageGeneratorPageCopy>> = {
  de: {
    metadata: { title: 'Text-zu-Bild-Generator kostenlos online - ohne Anmeldung | Toolaze', description: 'Erstellen Sie KI-Bilder kostenlos online aus Text. Toolaze hilft beim Formulieren klarerer Prompts, beim Verbessern schwacher Ergebnisse und beim Erkennen, wann ein Referenzbild besser ist.' },
    breadcrumbs: { home: 'Startseite', aiTools: 'KI-Tools', current: 'Text-zu-Bild-Generator' },
    hero: { highlight: 'Text-zu-Bild-Generator', description: 'Erstellen Sie Bilder aus Worten und verbessern Sie sie mit klarerem Motiv, Aufbau, Licht, Textregel und Prüfziel. Ideal, wenn Sie noch kein Referenzbild haben.', badges: ['Worte zu Bild', 'Kein Referenz-Upload', 'Kostenlos online', 'Ohne Anmeldung', 'Prompt-Hilfe'] },
    whatIs: { title: 'Was ist ein Text-zu-Bild-Generator?' },
    promise: { title: 'Weniger Rätselraten im Prompt' },
    features: { title: 'Was in den Prompt gehört' },
    gallery: { title: 'Schlechter Prompt vs. besserer Prompt' },
    howTo: { title: 'So erzielen Sie bessere Ergebnisse aus Text' },
    faq: { title: 'Text-zu-Bild-Generator FAQ' },
    cta: { title: 'Briefing schreiben und von Grund auf generieren', button: 'Text-zu-Bild starten' },
  },
  ja: {
    metadata: { title: 'テキストから画像生成 無料オンライン - 登録不要 | Toolaze', description: 'テキストからAI画像を無料でオンライン作成。より明確なプロンプト作成、弱い結果の改善、参照画像を使うべき場面の判断に役立ちます。' },
    breadcrumbs: { home: 'ホーム', aiTools: 'AIツール', current: 'テキストから画像生成' },
    hero: { highlight: 'テキストから画像生成', description: '言葉から画像を作り、主題、構図、照明、文字ルール、確認目標を明確にして改善できます。参照画像がまだないときに向いています。', badges: ['言葉から画像', '参照画像なし', '無料オンライン', '登録不要', 'プロンプト改善'] },
    whatIs: { title: 'テキストから画像生成とは？' },
    promise: { title: 'プロンプトの曖昧さを減らす' },
    features: { title: 'プロンプトに入れるべき内容' },
    gallery: { title: '弱いプロンプトと改善例' },
    howTo: { title: 'テキストからより良い結果を得る方法' },
    faq: { title: 'テキストから画像生成 FAQ' },
    cta: { title: '説明文を書いて一から生成', button: 'テキストから画像を開始' },
  },
  es: {
    metadata: { title: 'Generador de texto a imagen gratis online - sin registro | Toolaze', description: 'Crea imágenes IA desde texto online gratis, con guía práctica para escribir prompts más claros, corregir resultados débiles y saber cuándo usar una imagen de referencia.' },
    breadcrumbs: { home: 'Inicio', aiTools: 'Herramientas IA', current: 'Generador de texto a imagen' },
    hero: { highlight: 'Generador de texto a imagen', description: 'Crea una imagen desde palabras y mejórala con un sujeto, composición, iluminación, regla de texto y objetivo de revisión más claros. Úsalo cuando aún no tengas una referencia.', badges: ['Texto a imagen', 'Sin referencia', 'Gratis online', 'Sin registro', 'Mejoras de prompt'] },
    whatIs: { title: '¿Qué es un generador de texto a imagen?' },
    promise: { title: 'Reduce las conjeturas en el prompt' },
    features: { title: 'Qué incluir en tu prompt' },
    gallery: { title: 'Prompt débil vs. prompt mejorado' },
    howTo: { title: 'Cómo obtener mejores resultados desde texto' },
    faq: { title: 'FAQ del generador de texto a imagen' },
    cta: { title: 'Escribe un brief y genera desde cero', button: 'Empezar texto a imagen' },
  },
  'zh-TW': {
    metadata: { title: '文字轉圖像生成器免費線上使用 - 免註冊 | Toolaze', description: '免費線上從文字建立 AI 圖像，並獲得實用指引來撰寫更清楚的提示詞、修正不理想結果，以及判斷何時該使用參考圖片。' },
    breadcrumbs: { home: '首頁', aiTools: 'AI 工具', current: '文字轉圖像生成器' },
    hero: { highlight: '文字轉圖像生成器', description: '從文字建立圖像，再用更清楚的主體、構圖、光線、文字規則與檢查目標來改善結果。適合尚未有參考圖片時使用。', badges: ['文字轉圖像', '無需參考圖', '免費線上', '免註冊', '提示詞修正'] },
    whatIs: { title: '什麼是文字轉圖像生成器？' },
    promise: { title: '減少提示詞中的猜測空間' },
    features: { title: '提示詞應包含哪些內容' },
    gallery: { title: '不佳提示詞 vs 更佳提示詞範例' },
    howTo: { title: '如何從文字獲得更好的結果' },
    faq: { title: '文字轉圖像生成器常見問題' },
    cta: { title: '撰寫簡報並從零開始生成', button: '開始文字轉圖像' },
  },
  pt: {
    metadata: { title: 'Gerador de texto para imagem grátis online - sem cadastro | Toolaze', description: 'Crie imagens de IA a partir de texto gratuitamente online, com orientação prática para escrever prompts mais claros, corrigir resultados fracos e saber quando usar uma imagem de referência.' },
    breadcrumbs: { home: 'Início', aiTools: 'Ferramentas de IA', current: 'Gerador de texto para imagem' },
    hero: { highlight: 'Gerador de texto para imagem', description: 'Crie uma imagem a partir de palavras e melhore o resultado com assunto, composição, iluminação, regra de texto e objetivo de revisão mais claros. Use quando ainda não tiver uma referência.', badges: ['Texto para imagem', 'Sem referência', 'Grátis online', 'Sem cadastro', 'Correções de prompt'] },
    whatIs: { title: 'O que é um gerador de texto para imagem?' },
    promise: { title: 'Reduza a adivinhação no prompt' },
    features: { title: 'O que incluir no prompt' },
    gallery: { title: 'Prompt fraco vs. prompt melhor' },
    howTo: { title: 'Como obter melhores resultados a partir de texto' },
    faq: { title: 'FAQ do gerador de texto para imagem' },
    cta: { title: 'Escreva um briefing e gere do zero', button: 'Iniciar texto para imagem' },
  },
  fr: {
    metadata: { title: 'Générateur texte vers image gratuit en ligne - sans inscription | Toolaze', description: 'Créez gratuitement des images IA depuis du texte, avec des conseils pratiques pour écrire des prompts plus clairs, corriger les résultats faibles et savoir quand utiliser une image de référence.' },
    breadcrumbs: { home: 'Accueil', aiTools: 'Outils IA', current: 'Générateur texte vers image' },
    hero: { highlight: 'Générateur texte vers image', description: 'Créez une image à partir de mots, puis améliorez-la avec un sujet, une composition, une lumière, une règle de texte et un objectif de vérification plus clairs. À utiliser quand vous n’avez pas encore d’image de référence.', badges: ['Texte vers image', 'Sans référence', 'Gratuit en ligne', 'Sans inscription', 'Correction de prompt'] },
    whatIs: { title: 'Qu’est-ce qu’un générateur texte vers image ?' },
    promise: { title: 'Réduire les suppositions dans le prompt' },
    features: { title: 'Que mettre dans votre prompt' },
    gallery: { title: 'Prompt faible vs. meilleur prompt' },
    howTo: { title: 'Comment obtenir de meilleurs résultats depuis le texte' },
    faq: { title: 'FAQ du générateur texte vers image' },
    cta: { title: 'Rédiger un brief et générer de zéro', button: 'Démarrer texte vers image' },
  },
  ko: {
    metadata: { title: '텍스트 이미지 생성기 무료 온라인 - 가입 없음 | Toolaze', description: '텍스트에서 AI 이미지를 무료로 온라인 생성하세요. 더 명확한 프롬프트 작성, 약한 결과 개선, 참조 이미지를 써야 할 시점 판단에 도움이 됩니다.' },
    breadcrumbs: { home: '홈', aiTools: 'AI 도구', current: '텍스트 이미지 생성기' },
    hero: { highlight: '텍스트 이미지 생성기', description: '글에서 이미지를 만들고 주제, 구도, 조명, 텍스트 규칙, 검토 목표를 더 명확히 하여 결과를 개선하세요. 아직 참조 이미지가 없을 때 적합합니다.', badges: ['텍스트에서 이미지', '참조 업로드 없음', '무료 온라인', '가입 없음', '프롬프트 개선'] },
    whatIs: { title: '텍스트 이미지 생성기란?' },
    promise: { title: '프롬프트의 추측 줄이기' },
    features: { title: '프롬프트에 포함할 내용' },
    gallery: { title: '약한 프롬프트 vs 개선된 프롬프트' },
    howTo: { title: '텍스트에서 더 좋은 결과를 얻는 방법' },
    faq: { title: '텍스트 이미지 생성기 FAQ' },
    cta: { title: '브리프를 작성하고 처음부터 생성', button: '텍스트 이미지 시작' },
  },
  it: {
    metadata: { title: 'Generatore da testo a immagine gratis online - senza registrazione | Toolaze', description: 'Crea immagini IA da testo online gratis, con guida pratica per scrivere prompt più chiari, correggere risultati deboli e capire quando usare un’immagine di riferimento.' },
    breadcrumbs: { home: 'Home', aiTools: 'Strumenti IA', current: 'Generatore da testo a immagine' },
    hero: { highlight: 'Generatore da testo a immagine', description: 'Crea un’immagine dalle parole e migliorala con soggetto, composizione, luce, regole di testo e obiettivo di revisione più chiari. Usalo quando non hai ancora un’immagine di riferimento.', badges: ['Testo in immagine', 'Senza riferimento', 'Gratis online', 'Senza registrazione', 'Correzioni prompt'] },
    whatIs: { title: 'Che cos’è un generatore da testo a immagine?' },
    promise: { title: 'Riduci le supposizioni nel prompt' },
    features: { title: 'Cosa includere nel prompt' },
    gallery: { title: 'Prompt debole vs. prompt migliore' },
    howTo: { title: 'Come ottenere risultati migliori dal testo' },
    faq: { title: 'FAQ generatore da testo a immagine' },
    cta: { title: 'Scrivi un brief e genera da zero', button: 'Avvia testo in immagine' },
  },
}

export const textToImageGeneratorPageCopies: Record<TextToImageGeneratorLocale, AiImageGeneratorPageCopy> = TEXT_TO_IMAGE_GENERATOR_LOCALES.reduce((acc, locale) => {
  acc[locale] = locale === 'en'
    ? textToImageGeneratorPageCopy
    : mergeCopy(getAiImageGeneratorPageCopy(locale), localizedTextToImageOverrides[locale])
  return acc
}, {} as Record<TextToImageGeneratorLocale, AiImageGeneratorPageCopy>)

export function isTextToImageGeneratorLocale(
  locale: string,
): locale is TextToImageGeneratorLocale {
  return TEXT_TO_IMAGE_GENERATOR_LOCALES.includes(locale as TextToImageGeneratorLocale)
}

export function getTextToImageGeneratorPageCopy(
  locale: string = 'en',
): AiImageGeneratorPageCopy {
  return isTextToImageGeneratorLocale(locale)
    ? textToImageGeneratorPageCopies[locale]
    : textToImageGeneratorPageCopies.en
}
