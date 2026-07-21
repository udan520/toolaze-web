import type { Metadata } from 'next'

export const GROK_IMAGINE_VIDEO_15_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'] as const

export type GrokImagineVideo15Locale = (typeof GROK_IMAGINE_VIDEO_15_LOCALES)[number]

type TextItem = {
  title: string
  text: string
}
type FeatureItem = {
  slot: string
  title: string
  paragraphs: string[]
  label: string
  imageSrc: string
  imageAlt: string
}

type GalleryItem = TextItem & {
  slot: string
  imageSrc?: string
  imageAlt?: string
}

type SpecItem = {
  label: string
  value: string
}

type ComparisonRow = {
  capability: string
  grok: string
  seedance: string
  kling: string
  veo: string
}

type PromptExample = {
  id: string
  slot: string
  title: string
  prompt: string
  videoSrc: string
  videoLabel: string
}

type RelatedLink = TextItem & {
  href: string
}

type FaqItem = {
  q: string
  a: string
}

export type GrokImagineVideo15LandingCopy = {
  metadata: {
    title: string
    description: string
    openGraphDescription: string
    twitterDescription: string
  }
  breadcrumbs: {
    home: string
    model: string
    current: string
  }
  schema: {
    pageName: string
    appName: string
    howToName: string
  }
  hero: {
    modelName: string
    suffix: string
    description: string
    demoVideo: {
      src: string
      label: string
    }
  }
  whatIs: {
    title: string
    paragraphs: string[]
    specsTitle: string
    specs: SpecItem[]
  }
  features: {
    title: string
    text: string
    items: FeatureItem[]
  }
  gallery: {
    title: string
    text: string
    examples: GalleryItem[]
  }
  comparison: {
    title: string
    text: string
    capabilityHeader: string
    rows: ComparisonRow[]
    note?: string
  }
  howTo: {
    title: string
    steps: string[]
  }
  prompts: {
    title: string
    text: string
    copyButton: string
    copiedButton: string
    examples: PromptExample[]
  }
  promptFormula: {
    title: string
    text: string
    items: TextItem[]
  }
  quality: {
    title: string
    text: string
    badge: string
    items: TextItem[]
  }
  related: {
    title: string
    text: string
    tryNow: string
    links: RelatedLink[]
  }
  faq: {
    title: string
    items: FaqItem[]
  }
  cta: {
    title: string
    text: string
    button: string
    label: string
  }
  visual: {
    badge: string
    duration: string
    cues: string[]
    container: string
  }
}

const englishCopy: GrokImagineVideo15LandingCopy = {
  metadata: {
    title: 'Grok Imagine Video 1.5 AI Video Generator | Toolaze',
    description:
      'Use Grok Imagine Video 1.5 on Toolaze to create 1-15 second AI videos with source-image motion, synchronized audio, and 480p or 720p output.',
    openGraphDescription:
      'Create short Grok Imagine Video 1.5 clips from a starting image or prompt, with practical controls for aspect ratio, 1-15 second duration, and 480p or 720p output.',
    twitterDescription:
      'Use Toolaze to create Grok Imagine Video 1.5 clips with a starting image, prompt direction, 1-15 second output, and 480p or 720p settings.',
  },
  breadcrumbs: {
    home: 'Home',
    model: 'Model',
    current: 'Grok Imagine Video 1.5',
  },
  schema: {
    pageName: 'Grok Imagine Video 1.5 AI Video Generator',
    appName: 'Grok Imagine Video 1.5 AI Video Generator',
    howToName: 'How to generate videos with Grok Imagine Video 1.5',
  },
  hero: {
    modelName: 'Grok Imagine Video 1.5',
    suffix: 'AI Video Generator',
    description:
      "Animate a starting image with controlled camera movement, more believable motion and physics, and synchronized sound. Use Grok Imagine Video 1.5 on Toolaze to create 1-15 second clips at 480p or 720p for product visuals, social content, and cinematic scene tests.",
    demoVideo: {
      src: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/7b12e05c8c564a18b1ce7b02887051ac.png',
      label: 'Grok Imagine Video 1.5 16:9 product motion demo',
    },
  },
  whatIs: {
    title: 'What Is Grok Imagine Video 1.5?',
    paragraphs: [
      "Grok Imagine Video 1.5 is xAI's generally available image-to-video model for turning one strong starting frame into a short audiovisual clip. It is designed to preserve the source image while adding camera movement, atmosphere, more believable physics, sound effects, ambience, or speech.",
      'On Toolaze, you can use one image up to 20MB or start from a text prompt, choose a default 5-second output or another duration from 1-15 seconds, and generate at 480p or 720p in landscape, portrait, square, or automatic aspect ratios.',
    ],
    specsTitle: 'Core Grok Video Settings on Toolaze',
    specs: [
      { label: 'Modes', value: 'Image-to-video and text-to-video' },
      { label: 'Reference input', value: 'One starting image' },
      { label: 'Upload size', value: 'One image up to 20MB' },
      { label: 'Duration', value: 'Default 5-second clips, adjustable from 1-15 seconds' },
      { label: 'Resolution', value: '480p or 720p' },
      { label: 'Audio', value: 'Native synchronized sound, ambience, and speech' },
      { label: 'Aspect ratios', value: 'Auto, 16:9, 9:16, 1:1, 3:2, 2:3' },
    ],
  },
  features: {
    title: 'Grok Imagine Video 1.5 Features',
    text: 'Grok Imagine Video 1.5 is strongest when a clear starting frame is paired with one focused action, one camera direction, and explicit sound or atmosphere cues.',
    items: [
      {
        slot: 'feature-image-to-video',
        title: 'Source-Image Fidelity',
        label: 'Reference image animation workflow',
        imageSrc: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/c98962e0262d4ed08a5f5d144afc9a5e.webp',
        imageAlt: 'A studio product scene with controlled motion cues generated from one reference image',
        paragraphs: [
          'Start with a clean product shot, character frame, room concept, poster, or campaign visual. Grok uses that image as the opening frame and carries its composition, lighting, color, and subject detail into the generated motion.',
          'Describe what should move and what must stay unchanged. A focused preservation instruction helps you judge identity, product geometry, room layout, and styling across the clip.',
        ],
      },
      {
        slot: 'feature-text-to-video',
        title: 'Motion and Physics',
        label: 'Prompt-only scene generation workflow',
        imageSrc: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/95dce42675f34bdb90aa722004904758.webp',
        imageAlt: 'A cinematic electric sports car scene created as a prompt-only video concept',
        paragraphs: [
          'Video 1.5 improves how movement holds together across a short clip, including weight, momentum, environmental motion, and camera-driven perspective changes.',
          'Keep the action readable: one primary subject action and one main camera move usually produce a clearer result than several competing movements in the same short generation.',
        ],
      },
      {
        slot: 'feature-spec-controls',
        title: '1-15 Second Clips With Practical Output Settings',
        label: 'Duration, resolution, and aspect ratio controls',
        imageSrc: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/30bbc85166e24e05b7cf83b4bfa4a246.webp',
        imageAlt: 'One action scene composed across widescreen, vertical, and square video formats',
        paragraphs: [
          'Grok Imagine Video 1.5 on Toolaze defaults to 5-second clips and lets you choose 1-15 seconds, with 480p and 720p output options. Keep early prompts short enough to fit the selected duration clearly.',
          'Choose Auto, 16:9, 9:16, 1:1, 3:2, or 2:3 depending on where the clip will be reviewed: landing page, product page, presentation, short-form feed, or storyboard board.',
        ],
      },
      {
        slot: 'feature-preview-download',
        title: 'Native Audio and Speech',
        label: 'Synchronized audio generation',
        imageSrc: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/72429cd40f56456c8ff18e7620b124a3.webp',
        imageAlt: 'A creator reviewing synchronized video and audio results at a professional workstation',
        paragraphs: [
          'Grok Imagine Video 1.5 can generate sound effects, ambience, music, and speech in the same pass as the video, helping audio events land closer to the visible action.',
          'Place each sound cue next to the action it belongs to. Keep dialogue short for a 1-15 second clip, and review lip sync, voice clarity, timing, and background noise before publishing.',
        ],
      },
    ],
  },
  gallery: {
    title: 'Grok Imagine Video 1.5 Use Cases',
    text: 'Use these examples to decide whether to start from a starting image or a prompt-only scene.',
    examples: [
      {
        slot: 'gallery-product-motion',
        title: 'Product Motion Reveal',
        text: 'Animate a still product image with a slow push-in, polished lighting, realistic reflections, and a short commercial-style camera move.',
        imageSrc: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/f56d19a415b5472c8c02303e45d432d1.webp',
        imageAlt: 'A cinematic luxury watch product reveal with polished reflections and dramatic motion lighting',
      },
      {
        slot: 'gallery-social-clip',
        title: 'Social Clip Concept',
        text: 'Create a vertical or square video idea for short-form channels using clear action, readable mood, and simple scene direction.',
        imageSrc: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/c6b6b43ba3f14a37964bfe0092da6b2b.webp',
        imageAlt: 'A dynamic skateboarder framed as a colorful short-form social video concept',
      },
      {
        slot: 'gallery-storyboard-beat',
        title: 'Storyboard Beat',
        text: 'Turn a written scene into a quick moving shot that helps evaluate pacing, camera angle, and visual tone.',
        imageSrc: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/787cf8661b984d04a895f6683fda9498.webp',
        imageAlt: 'A cinematic character entering an abandoned train station for a storyboard sequence',
      },
      {
        slot: 'gallery-character-motion',
        title: 'Character Motion Test',
        text: 'Use a reference character image and describe subtle motion, expression, lighting, and background atmosphere.',
        imageSrc: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/a7e3ca80a80b4e58a5f62530836ecfdc.webp',
        imageAlt: 'A character portrait with wind-swept hair, moving fabric, and atmospheric lighting',
      },
      {
        slot: 'gallery-interior-preview',
        title: 'Interior or Space Preview',
        text: 'Animate an architectural still with a gentle camera drift, daylight changes, and realistic environmental motion.',
        imageSrc: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/dd4a6bc26ac0400192481c3a7041bbfe.webp',
        imageAlt: 'A modern interior animated by changing daylight, soft curtains, and natural atmosphere',
      },
      {
        slot: 'gallery-ad-variant',
        title: 'Ad Creative Variant',
        text: 'Generate quick visual options for campaign testing before spending time on editing, sound design, and finishing.',
        imageSrc: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/62dd9661051944d794af65f837047f4c.webp',
        imageAlt: 'An energetic unbranded beverage advertising concept with splash and studio lighting',
      },
      {
        slot: 'gallery-cinematic-shot',
        title: 'Cinematic Establishing Shot',
        text: 'Describe a location, weather, movement, and camera direction to test the mood of a trailer or film sequence.',
        imageSrc: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/7f3bfa0f0eeb43019b63c26dd5624e6f.webp',
        imageAlt: 'A storm-lit coastal valley captured as a cinematic establishing shot',
      },
      {
        slot: 'gallery-moodboard-motion',
        title: 'Moodboard to Motion',
        text: 'Use a still image as a style anchor, then explore how the visual language feels once it moves.',
        imageSrc: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/5bae33bae2204740bfdcee8ea4dbb7c9.webp',
        imageAlt: 'An editorial fashion scene with flowing fabric and a distinctive blue-violet visual language',
      },
    ],
  },
  comparison: {
    title: 'Grok Imagine Video 1.5 vs Other AI Video Models',
    text: 'Compare input requirements, output limits, audio support, and best-fit workflows before choosing a video model.',
    capabilityHeader: 'Capability',
    rows: [
      {
        capability: 'Input resources',
        grok: 'Starting image plus motion prompt; prompt-only drafts also supported.',
        seedance: 'Text, image, audio, and video; up to 9 images, 3 clips, 3 audio files.',
        kling: 'Text, images, audio, video; references for characters, objects, and scenes.',
        veo: 'Text and image prompts for cinematic video generation.',
      },
      {
        capability: 'Output and length',
        grok: '1-15 second video clips at 480p or 720p.',
        seedance: 'Up to 15-second multi-shot audio-video scenes.',
        kling: 'Up to 15 seconds with native audio and voiceover.',
        veo: 'Short high-resolution video clips with native audio support.',
      },
      {
        capability: 'Best task fit',
        grok: 'Animating one strong starting frame for quick motion tests.',
        seedance: 'Complex scenes using several source assets and audio cues.',
        kling: 'Cinematic shots, dialogue, voiceover, and reference consistency.',
        veo: 'Cinematic scenes that prioritize realism, dialogue, and polished sound.',
      },
      {
        capability: 'Control strengths',
        grok: 'Camera moves, atmosphere, physics, and starting-frame detail.',
        seedance: 'Mixed references, action logic, audio matching, and video extension.',
        kling: 'Shot control, lip sync, speech, text, and consistency.',
        veo: 'Cinematic composition, prompt adherence, dialogue, and sound design.',
      },
      {
        capability: 'Review focus',
        grok: 'Motion consistency, identity, physics, faces, hands, brand details.',
        seedance: 'Multi-subject consistency, audio distortion, prompt drift, edit effects.',
        kling: 'Shot continuity, lip sync, voice order, text retention.',
        veo: 'Character continuity, speech timing, scene realism, and audio quality.',
      },
    ],
    note: 'Veo 3.1 capabilities can vary by product surface and selected generation mode; compare the settings available in your chosen tool before starting a production run.',
  },
  howTo: {
    title: 'How to Generate Videos with Grok Imagine Video 1.5',
    steps: [
      'Open the Grok Imagine Video 1.5 generator on Toolaze.',
      'Choose image-to-video when you have one starting image, or text-to-video when you want to start from a prompt.',
      'Describe subject, motion, camera movement, lighting, setting, style, and what should stay unchanged.',
      'Select aspect ratio, 480p or 720p resolution, and a 1-15 second duration. The default is 5 seconds.',
      'Preview the returned clip, compare recent attempts, and download the result if you want to keep it.',
    ],
  },
  prompts: {
    title: 'Grok Imagine Video 1.5 Prompt Examples',
    text: 'Copy a prompt, then adjust subject, motion, camera, style, and reference-image constraints for your own 1-15 second clip.',
    copyButton: 'Copy Prompt',
    copiedButton: 'Copied',
    examples: [
      {
        id: 'product-reveal',
        slot: 'prompt-product-reveal',
        title: 'Product Reveal Prompt',
        prompt:
          'Animate the uploaded product image into a 5-second premium product reveal. Slow push-in camera, subtle rotation, glossy reflections, clean studio lighting, realistic shadow movement, no extra text, commercial style.',
        videoSrc: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/8de0b3095d15419a8a71f762d6235166.png',
        videoLabel: '16:9 product reveal prompt example video',
      },
      {
        id: 'social-vertical',
        slot: 'prompt-social-vertical',
        title: 'Short-Form Social Prompt',
        prompt:
          'Create a 16:9 short-form video of a futuristic city street at night. A courier walks through neon rain, camera follows from behind, reflections on pavement, cinematic lighting, smooth motion, atmospheric but clear.',
        videoSrc: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/96060cfc87204bdba24d208dbc9e1f15.png',
        videoLabel: '16:9 neon city social prompt example video',
      },
      {
        id: 'interior-camera',
        slot: 'prompt-interior-camera',
        title: 'Interior Camera Move Prompt',
        prompt:
          'Use the uploaded room image as the reference. Preserve the layout and furniture. Add a gentle left-to-right camera drift, soft daylight through the window, moving curtain fabric, warm interior mood, realistic motion.',
        videoSrc: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/dbed78470f784d01a3cb413be3614ccf.png',
        videoLabel: '16:9 interior camera move prompt example video',
      },
      {
        id: 'character-motion',
        slot: 'prompt-character-motion',
        title: 'Character Motion Prompt',
        prompt:
          'Animate the reference character with subtle breathing, blinking, wind in hair, and a small camera push-in. Keep identity, outfit, color palette, and background style consistent. Cinematic portrait lighting.',
        videoSrc: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/d0d55df5eef346809067197fddb1b251.png',
        videoLabel: '16:9 character motion prompt example video',
      },
      {
        id: 'food-commercial',
        slot: 'prompt-food-commercial',
        title: 'Food Commercial Prompt',
        prompt:
          'A close-up food commercial shot of a dessert plate on a marble table. Steam, syrup movement, shallow depth of field, slow macro camera glide, elegant restaurant lighting, appetizing and realistic.',
        videoSrc: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/536bedba1104401ab11ff573fcce3587.png',
        videoLabel: '16:9 food commercial prompt example video',
      },
      {
        id: 'storyboard-shot',
        slot: 'prompt-storyboard-shot',
        title: 'Storyboard Shot Prompt',
        prompt:
          'Create an establishing shot for a science-fiction short film. A small research vehicle crosses a frozen plain under green aurora, wide-angle camera, slow forward motion, wind-blown snow, quiet cinematic tension.',
        videoSrc: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/56bb211041b34c5f8f27d3c0208322e7.png',
        videoLabel: '16:9 storyboard prompt example video',
      },
    ],
  },
  promptFormula: {
    title: 'How to Write Better Grok Video Prompts',
    text: 'Treat the prompt like a short shot brief. Put the most important action first, keep the camera direction focused, and state what must remain consistent.',
    items: [
      {
        title: 'Start With the Main Action',
        text: 'Name the subject and primary movement first so the key action has enough time to develop within the selected clip length.',
      },
      {
        title: 'Choose One Camera Move',
        text: 'Use one clear direction such as a slow push-in, pan left, orbit, tracking shot, or locked camera instead of competing moves.',
      },
      {
        title: 'Protect the Source Image',
        text: 'Say which identity, product shape, clothing, room layout, lighting, or background details must stay unchanged.',
      },
      {
        title: 'Add Pacing and Sound',
        text: 'Describe whether the motion is gradual, energetic, or still, then place ambience, effects, or a short spoken line beside the matching action.',
      },
    ],
  },
  quality: {
    title: 'Common Grok Video Problems and Fixes',
    text: 'When a result misses the brief, simplify the next prompt around the specific failure instead of changing every instruction at once.',
    badge: 'Problem and fix',
    items: [
      {
        title: 'Subject Drift',
        text: 'If a face, product, or room changes, use a cleaner source image and explicitly preserve identity, shape, layout, clothing, and colors.',
      },
      {
        title: 'Weak or Frozen Motion',
        text: 'Replace vague wording with one concrete action verb, one visible environmental movement, and a clear pace such as gradual or energetic.',
      },
      {
        title: 'Conflicting Camera Motion',
        text: 'Remove extra camera directions. Keep one primary move per clip and describe the subject action separately from the camera path.',
      },
      {
        title: 'Physics or Detail Errors',
        text: 'Reduce complex interactions, shorten the action, and avoid asking hands, liquids, fabric, and several objects to move at the same time.',
      },
      {
        title: 'Audio Mismatch',
        text: 'Put each sound cue next to its action, keep dialogue short, and remove competing music or ambience instructions when timing matters.',
      },
    ],
  },
  related: {
    title: 'Related AI Video and Image Tools',
    text: 'Continue with the broader AI Video Generator, compare model pages, or switch to a still-image model.',
    tryNow: 'Try now',
    links: [
      {
        title: 'AI Video Generator',
        href: '/ai-video-generator',
        text: 'Use the broader Toolaze AI video generator with model selection, text-to-video, and image-to-video controls.',
      },
      {
        title: 'Seedance 2.5 Video Generator',
        href: '/model/seedance-2-5',
        text: 'Choose Seedance 2.5 when you need a broader multimodal workflow with several source assets and more complex scene planning.',
      },
      {
        title: 'Seedance 2.0 Video Generator',
        href: '/model/seedance-2',
        text: 'Use Seedance 2.0 for multi-shot concepts, mixed references, and scenes that need coordinated visual and audio direction.',
      },
      {
        title: 'Kling 3.0 Video Generator',
        href: '/model/kling-3',
        text: 'Choose Kling 3.0 for high-resolution cinematic shots, dialogue, voiceover, and reference-guided scene consistency.',
      },
      {
        title: 'GPT Image 2 Generator',
        href: '/model/gpt-image-2',
        text: 'Use a still-image model when you need posters, product visuals, image edits, and UI mockups.',
      },
      {
        title: 'AI Models Hub',
        href: '/model',
        text: 'Browse Toolaze image and video model pages when you need broader model comparison.',
      },
    ],
  },
  faq: {
    title: 'Grok Imagine Video 1.5 FAQ',
    items: [
      {
        q: 'What is Grok Imagine Video 1.5?',
        a: "Grok Imagine Video 1.5 is xAI's generally available image-to-video model for short motion clips. On Toolaze, it runs inside a focused web generator with image-to-video and prompt-only drafting paths.",
      },
      {
        q: 'Does Grok Imagine Video 1.5 support image-to-video?',
        a: 'Yes. Upload one starting image up to 20MB, describe the motion and camera direction, then generate a default 5-second video clip or choose another duration from 1-15 seconds.',
      },
      {
        q: 'Does Grok Imagine Video 1.5 support text-to-video?',
        a: 'Toolaze provides a text-to-video path for prompt-only scene drafts. For the most predictable Video 1.5 workflow, start with one strong image and describe the motion you want.',
      },
      {
        q: 'Does Grok Imagine Video 1.5 generate audio?',
        a: 'Yes. The model can generate synchronized sound effects, ambience, music, and speech in the same pass as the video. Review timing, voice clarity, and lip sync before publishing.',
      },
      {
        q: 'Why did my starting image change?',
        a: 'Subject drift is more likely when the source is cluttered or the prompt asks for several complex changes. Use a clean image and state which identity, shape, layout, clothing, and colors must remain unchanged.',
      },
      {
        q: 'How should I prompt camera movement?',
        a: 'Use one primary camera direction per short clip, such as a slow push-in, pan, orbit, tracking shot, or locked camera. Multiple competing moves can make the result less predictable.',
      },
      {
        q: 'Is Grok Imagine Video 1.5 free on Toolaze?',
        a: 'Availability may depend on the current Toolaze access policy, quota, model availability, and selected settings. Check the generator for the latest access state.',
      },
      {
        q: 'When should I choose Grok instead of Seedance or Kling?',
        a: 'Choose Grok for fast image-to-video iteration from one strong starting frame. Seedance is better suited to broader multi-asset workflows, while Kling is useful for high-resolution cinematic shots, dialogue, and voiceover.',
      },
    ],
  },
  cta: {
    title: 'Start Generating Grok Imagine Video 1.5 Clips',
    text: 'Start from one strong image, describe one clear action and camera move, add sound cues when needed, and generate a short clip without leaving the page.',
    button: 'Try Grok Video Generator',
    label: 'Grok Imagine Video 1.5 final preview',
  },
  visual: {
    badge: 'Grok Video',
    duration: '5s',
    cues: ['Motion', 'Camera', 'Style'],
    container: 'Grok Imagine Video 1.5 visual preview',
  },
}

type LocalizedCore = {
  metadata: GrokImagineVideo15LandingCopy['metadata']
  breadcrumbs: GrokImagineVideo15LandingCopy['breadcrumbs']
  schema: GrokImagineVideo15LandingCopy['schema']
  heroSuffix: string
  heroDescription: string
  sectionTitles: [string, string, string, string, string, string, string, string, string, string]
  sectionTexts: [string, string, string, string, string, string, string]
  buttons: [string, string, string, string]
  firstFaqAnswer: string
}

const localizedCore: Record<Exclude<GrokImagineVideo15Locale, 'en'>, LocalizedCore> = {
  de: {
    metadata: {
      title: 'Grok Imagine Video 1.5 KI-Videogenerator | Toolaze',
      description: 'Erstelle mit Grok Imagine Video 1.5 auf Toolaze 1–15 Sekunden lange KI-Videos mit Bildanimation, synchronem Ton und 480p- oder 720p-Ausgabe.',
      openGraphDescription: 'Erstelle kurze Grok Imagine Video 1.5-Clips aus einem Ausgangsbild oder Prompt und wähle Seitenverhältnis, Dauer sowie 480p oder 720p.',
      twitterDescription: 'Erstelle Grok Imagine Video 1.5-Clips mit Ausgangsbild, Bewegungsanweisung, 1–15 Sekunden Dauer und 480p- oder 720p-Ausgabe.',
    },
    breadcrumbs: { home: 'Startseite', model: 'Modelle', current: 'Grok Imagine Video 1.5' },
    schema: { pageName: 'Grok Imagine Video 1.5 KI-Videogenerator', appName: 'Grok Imagine Video 1.5 KI-Videogenerator', howToName: 'Videos mit Grok Imagine Video 1.5 erstellen' },
    heroSuffix: 'KI-Videogenerator',
    heroDescription: 'Animiere ein Ausgangsbild mit kontrollierter Kamerabewegung, glaubwürdiger Bewegung und synchronem Ton. Erstelle auf Toolaze 1–15 Sekunden lange Clips in 480p oder 720p.',
    sectionTitles: ['Was ist Grok Imagine Video 1.5?', 'Funktionen von Grok Imagine Video 1.5', 'Einsatzbereiche von Grok Imagine Video 1.5', 'Grok Imagine Video 1.5 im Vergleich', 'Videos mit Grok Imagine Video 1.5 erstellen', 'Prompt-Beispiele', 'Bessere Grok-Video-Prompts schreiben', 'Häufige Probleme und Lösungen', 'Verwandte KI-Video- und Bildtools', 'Häufig gestellte Fragen'],
    sectionTexts: ['Am besten funktioniert ein klares Ausgangsbild mit einer Hauptaktion, einer Kamerarichtung und eindeutigen Ton- oder Stimmungshinweisen.', 'Nutze diese Beispiele, um zwischen einem Ausgangsbild und einer reinen Prompt-Szene zu wählen.', 'Vergleiche Eingaben, Ausgabelimits, Audio und geeignete Arbeitsabläufe.', 'Kopiere einen Prompt und passe Motiv, Bewegung, Kamera, Stil und Bildvorgaben an.', 'Formuliere den Prompt wie eine kurze Einstellung: wichtigste Aktion zuerst, klare Kamerarichtung und feste Details.', 'Vereinfache bei Fehlern gezielt nur die Anweisung, die nicht funktioniert hat.', 'Wechsle zum allgemeinen Videogenerator, vergleiche Modelle oder nutze ein Standbildmodell.'],
    buttons: ['Prompt kopieren', 'Kopiert', 'Jetzt testen', 'Grok-Videogenerator testen'],
    firstFaqAnswer: 'Grok Imagine Video 1.5 ist das allgemein verfügbare Bild-zu-Video-Modell von xAI für kurze Clips. Auf Toolaze steht es in einem fokussierten Generator für Bild-zu-Video und promptbasierte Entwürfe bereit.',
  },
  ja: {
    metadata: { title: 'Grok Imagine Video 1.5 AI動画生成ツール | Toolaze', description: 'ToolazeのGrok Imagine Video 1.5で、元画像の動き、同期音声、480p／720p出力に対応した1〜15秒のAI動画を作成できます。', openGraphDescription: '元画像またはプロンプトから短いGrok Imagine Video 1.5動画を作成し、比率、1〜15秒の長さ、480p／720pを設定できます。', twitterDescription: '元画像と動きの指示を使い、1〜15秒・480p／720pのGrok Imagine Video 1.5動画を作成できます。' },
    breadcrumbs: { home: 'ホーム', model: 'モデル', current: 'Grok Imagine Video 1.5' },
    schema: { pageName: 'Grok Imagine Video 1.5 AI動画生成ツール', appName: 'Grok Imagine Video 1.5 AI動画生成ツール', howToName: 'Grok Imagine Video 1.5で動画を生成する方法' },
    heroSuffix: 'AI動画生成ツール', heroDescription: '元画像に制御されたカメラワーク、自然な動きと物理表現、同期音声を加えます。Toolazeで1〜15秒、480pまたは720pの動画を生成できます。',
    sectionTitles: ['Grok Imagine Video 1.5とは？', 'Grok Imagine Video 1.5の機能', 'Grok Imagine Video 1.5の活用例', '他のAI動画モデルとの比較', 'Grok Imagine Video 1.5で動画を生成する方法', 'プロンプト例', 'より良い動画プロンプトの書き方', 'よくある問題と解決方法', '関連するAI動画・画像ツール', 'よくある質問'],
    sectionTexts: ['明確な元画像に、主な動作、カメラ方向、音や雰囲気の指示を1つずつ組み合わせると効果的です。', '元画像から始めるか、プロンプトだけでシーンを作るかを活用例から選べます。', '入力条件、出力制限、音声対応、適した用途を比較できます。', 'プロンプトをコピーし、被写体、動き、カメラ、スタイル、元画像の制約を調整してください。', '短い撮影指示として、重要な動作を先に書き、カメラ方向と維持する要素を明確にします。', '意図どおりにならない場合は、すべてを変えず、失敗した指示だけを単純化します。', '総合動画生成ツールや他モデルを比較し、必要に応じて静止画モデルへ切り替えられます。'],
    buttons: ['プロンプトをコピー', 'コピー済み', '今すぐ試す', 'Grok動画生成を試す'], firstFaqAnswer: 'Grok Imagine Video 1.5は、短い動画向けにxAIが一般提供している画像から動画への生成モデルです。Toolazeでは画像から動画とプロンプトのみの下書きに対応した専用画面で利用できます。',
  },
  es: {
    metadata: { title: 'Generador de video con IA Grok Imagine Video 1.5 | Toolaze', description: 'Crea en Toolaze videos de IA de 1 a 15 segundos con Grok Imagine Video 1.5, movimiento desde una imagen, audio sincronizado y salida 480p o 720p.', openGraphDescription: 'Crea clips cortos con Grok Imagine Video 1.5 desde una imagen o un prompt y configura formato, duración y resolución.', twitterDescription: 'Crea clips con Grok Imagine Video 1.5 a partir de una imagen y una instrucción de movimiento, de 1 a 15 segundos y en 480p o 720p.' },
    breadcrumbs: { home: 'Inicio', model: 'Modelos', current: 'Grok Imagine Video 1.5' }, schema: { pageName: 'Generador de video con IA Grok Imagine Video 1.5', appName: 'Generador de video con IA Grok Imagine Video 1.5', howToName: 'Cómo generar videos con Grok Imagine Video 1.5' },
    heroSuffix: 'Generador de video con IA', heroDescription: 'Anima una imagen inicial con cámara controlada, movimiento y física más creíbles y sonido sincronizado. Crea clips de 1 a 15 segundos en 480p o 720p con Toolaze.',
    sectionTitles: ['¿Qué es Grok Imagine Video 1.5?', 'Funciones de Grok Imagine Video 1.5', 'Casos de uso de Grok Imagine Video 1.5', 'Comparación con otros modelos de video', 'Cómo generar videos con Grok Imagine Video 1.5', 'Ejemplos de prompts', 'Cómo escribir mejores prompts de video', 'Problemas frecuentes y soluciones', 'Herramientas de video e imagen relacionadas', 'Preguntas frecuentes'],
    sectionTexts: ['Funciona mejor con una imagen clara, una acción principal, una dirección de cámara y señales explícitas de sonido o ambiente.', 'Usa estos ejemplos para decidir si empezar con una imagen o con una escena descrita solo por texto.', 'Compara requisitos de entrada, límites de salida, audio y usos recomendados.', 'Copia un prompt y adapta el sujeto, el movimiento, la cámara, el estilo y las restricciones de la imagen.', 'Escribe el prompt como una breve indicación de plano: acción principal primero, cámara clara y elementos que deben conservarse.', 'Si el resultado falla, simplifica solo la instrucción problemática en vez de cambiar todo.', 'Continúa con el generador general, compara modelos o cambia a un modelo de imagen fija.'],
    buttons: ['Copiar prompt', 'Copiado', 'Probar ahora', 'Probar el generador Grok'], firstFaqAnswer: 'Grok Imagine Video 1.5 es el modelo de xAI disponible de forma general para convertir imágenes en clips cortos. En Toolaze se usa en un generador específico con flujos de imagen a video y borradores solo con prompt.',
  },
  'zh-TW': {
    metadata: { title: 'Grok Imagine Video 1.5 AI 影片生成器 | Toolaze', description: '在 Toolaze 使用 Grok Imagine Video 1.5，將圖片製作成 1–15 秒 AI 影片，支援同步音訊與 480p／720p 輸出。', openGraphDescription: '從起始圖片或提示詞製作 Grok Imagine Video 1.5 短片，並設定畫面比例、1–15 秒片長及 480p／720p 畫質。', twitterDescription: '使用起始圖片與動態指令，製作 1–15 秒、480p 或 720p 的 Grok Imagine Video 1.5 影片。' },
    breadcrumbs: { home: '首頁', model: '模型', current: 'Grok Imagine Video 1.5' }, schema: { pageName: 'Grok Imagine Video 1.5 AI 影片生成器', appName: 'Grok Imagine Video 1.5 AI 影片生成器', howToName: '如何使用 Grok Imagine Video 1.5 生成影片' },
    heroSuffix: 'AI 影片生成器', heroDescription: '為起始圖片加入可控的鏡頭運動、更自然的動態與物理效果，以及同步聲音。在 Toolaze 製作 1–15 秒、480p 或 720p 的影片。',
    sectionTitles: ['什麼是 Grok Imagine Video 1.5？', 'Grok Imagine Video 1.5 功能', 'Grok Imagine Video 1.5 使用情境', '與其他 AI 影片模型比較', '如何使用 Grok Imagine Video 1.5 生成影片', '提示詞範例', '如何撰寫更好的 Grok 影片提示詞', '常見問題與修正方式', '相關 AI 影片與圖片工具', '常見問題'],
    sectionTexts: ['清晰的起始畫面搭配一個主要動作、一種鏡頭方向，以及明確的聲音或氛圍指令，通常能獲得最佳效果。', '參考這些範例，判斷應從起始圖片開始，或只用提示詞建立場景。', '選擇模型前，可比較輸入需求、輸出限制、音訊支援與適用流程。', '複製提示詞後，再依需求調整主體、動作、鏡頭、風格與參考圖片限制。', '把提示詞視為簡短的分鏡說明：先寫主要動作，聚焦單一鏡頭方向，並指出必須保持一致的元素。', '結果不符合需求時，只針對失敗的指令簡化下一版提示詞，不要一次更改所有內容。', '你可以繼續使用完整 AI 影片生成器、比較其他模型，或改用靜態圖片模型。'],
    buttons: ['複製提示詞', '已複製', '立即試用', '試用 Grok 影片生成器'], firstFaqAnswer: 'Grok Imagine Video 1.5 是 xAI 正式推出的圖片轉影片模型，適合製作短篇動態內容。在 Toolaze 可透過專用生成器使用圖片轉影片與純提示詞草稿流程。',
  },
  pt: {
    metadata: { title: 'Gerador de vídeo com IA Grok Imagine Video 1.5 | Toolaze', description: 'Crie no Toolaze vídeos de IA de 1 a 15 segundos com Grok Imagine Video 1.5, movimento a partir de imagem, áudio sincronizado e saída em 480p ou 720p.', openGraphDescription: 'Crie clipes curtos com Grok Imagine Video 1.5 a partir de uma imagem ou prompt e ajuste formato, duração e resolução.', twitterDescription: 'Crie clipes Grok Imagine Video 1.5 com imagem inicial, instruções de movimento, duração de 1 a 15 segundos e 480p ou 720p.' },
    breadcrumbs: { home: 'Início', model: 'Modelos', current: 'Grok Imagine Video 1.5' }, schema: { pageName: 'Gerador de vídeo com IA Grok Imagine Video 1.5', appName: 'Gerador de vídeo com IA Grok Imagine Video 1.5', howToName: 'Como gerar vídeos com Grok Imagine Video 1.5' },
    heroSuffix: 'Gerador de vídeo com IA', heroDescription: 'Anime uma imagem inicial com câmera controlada, movimento e física mais naturais e som sincronizado. Crie no Toolaze clipes de 1 a 15 segundos em 480p ou 720p.',
    sectionTitles: ['O que é Grok Imagine Video 1.5?', 'Recursos do Grok Imagine Video 1.5', 'Casos de uso do Grok Imagine Video 1.5', 'Comparação com outros modelos de vídeo', 'Como gerar vídeos com Grok Imagine Video 1.5', 'Exemplos de prompts', 'Como escrever prompts melhores', 'Problemas comuns e soluções', 'Ferramentas relacionadas de vídeo e imagem', 'Perguntas frequentes'],
    sectionTexts: ['Os melhores resultados combinam uma imagem clara, uma ação principal, uma direção de câmera e indicações explícitas de som ou atmosfera.', 'Use os exemplos para decidir entre começar com uma imagem ou apenas com uma descrição em texto.', 'Compare entradas, limites de saída, suporte a áudio e fluxos mais indicados.', 'Copie um prompt e ajuste tema, movimento, câmera, estilo e restrições da imagem.', 'Escreva como uma instrução curta de cena: ação principal primeiro, câmera objetiva e detalhes que devem permanecer iguais.', 'Se o resultado falhar, simplifique apenas a instrução problemática em vez de mudar tudo.', 'Continue no gerador geral, compare modelos ou use um modelo de imagem estática.'],
    buttons: ['Copiar prompt', 'Copiado', 'Testar agora', 'Testar o gerador Grok'], firstFaqAnswer: 'Grok Imagine Video 1.5 é o modelo da xAI, disponível de forma geral, para transformar imagens em clipes curtos. No Toolaze, ele funciona em um gerador dedicado com imagem para vídeo e rascunhos somente por prompt.',
  },
  fr: {
    metadata: { title: 'Générateur vidéo IA Grok Imagine Video 1.5 | Toolaze', description: 'Créez sur Toolaze des vidéos IA de 1 à 15 secondes avec Grok Imagine Video 1.5, animation d’image, audio synchronisé et sortie 480p ou 720p.', openGraphDescription: 'Créez de courts clips Grok Imagine Video 1.5 depuis une image ou un prompt, puis réglez format, durée et résolution.', twitterDescription: 'Créez des clips Grok Imagine Video 1.5 à partir d’une image et d’indications de mouvement, de 1 à 15 secondes en 480p ou 720p.' },
    breadcrumbs: { home: 'Accueil', model: 'Modèles', current: 'Grok Imagine Video 1.5' }, schema: { pageName: 'Générateur vidéo IA Grok Imagine Video 1.5', appName: 'Générateur vidéo IA Grok Imagine Video 1.5', howToName: 'Comment générer des vidéos avec Grok Imagine Video 1.5' },
    heroSuffix: 'Générateur vidéo IA', heroDescription: 'Animez une image de départ avec un mouvement de caméra maîtrisé, une physique plus crédible et un son synchronisé. Créez sur Toolaze des clips de 1 à 15 secondes en 480p ou 720p.',
    sectionTitles: ['Qu’est-ce que Grok Imagine Video 1.5 ?', 'Fonctionnalités de Grok Imagine Video 1.5', 'Cas d’usage de Grok Imagine Video 1.5', 'Comparaison avec d’autres modèles vidéo', 'Comment générer une vidéo avec Grok Imagine Video 1.5', 'Exemples de prompts', 'Mieux rédiger vos prompts vidéo', 'Problèmes fréquents et solutions', 'Outils vidéo et image associés', 'Questions fréquentes'],
    sectionTexts: ['Associez une image claire à une action principale, un mouvement de caméra et des indications précises de son ou d’ambiance.', 'Ces exemples vous aident à choisir entre une image de départ et une scène créée uniquement par prompt.', 'Comparez les entrées, limites de sortie, fonctions audio et usages adaptés.', 'Copiez un prompt puis adaptez le sujet, le mouvement, la caméra, le style et les contraintes de l’image.', 'Rédigez une courte consigne de plan : action principale d’abord, caméra ciblée et éléments à préserver.', 'En cas d’échec, simplifiez uniquement l’instruction concernée au lieu de tout modifier.', 'Poursuivez avec le générateur général, comparez les modèles ou passez à un modèle d’image fixe.'],
    buttons: ['Copier le prompt', 'Copié', 'Essayer', 'Essayer le générateur Grok'], firstFaqAnswer: 'Grok Imagine Video 1.5 est le modèle image-vers-vidéo de xAI, disponible au public, conçu pour de courts clips. Toolaze le propose dans un générateur dédié avec création depuis une image ou uniquement un prompt.',
  },
  ko: {
    metadata: { title: 'Grok Imagine Video 1.5 AI 동영상 생성기 | Toolaze', description: 'Toolaze에서 Grok Imagine Video 1.5로 시작 이미지 움직임, 동기화 오디오, 480p 또는 720p 출력을 지원하는 1~15초 AI 동영상을 만드세요.', openGraphDescription: '시작 이미지나 프롬프트로 짧은 Grok Imagine Video 1.5 클립을 만들고 화면 비율, 길이, 해상도를 설정하세요.', twitterDescription: '시작 이미지와 움직임 지시로 1~15초, 480p 또는 720p Grok Imagine Video 1.5 클립을 만드세요.' },
    breadcrumbs: { home: '홈', model: '모델', current: 'Grok Imagine Video 1.5' }, schema: { pageName: 'Grok Imagine Video 1.5 AI 동영상 생성기', appName: 'Grok Imagine Video 1.5 AI 동영상 생성기', howToName: 'Grok Imagine Video 1.5로 동영상 생성하는 방법' },
    heroSuffix: 'AI 동영상 생성기', heroDescription: '시작 이미지에 제어된 카메라 움직임, 더 자연스러운 동작과 물리 효과, 동기화된 사운드를 더하세요. Toolaze에서 1~15초, 480p 또는 720p 클립을 만들 수 있습니다.',
    sectionTitles: ['Grok Imagine Video 1.5란?', 'Grok Imagine Video 1.5 기능', 'Grok Imagine Video 1.5 활용 사례', '다른 AI 동영상 모델과 비교', 'Grok Imagine Video 1.5로 동영상 만드는 방법', '프롬프트 예시', '더 좋은 동영상 프롬프트 작성법', '자주 발생하는 문제와 해결 방법', '관련 AI 동영상 및 이미지 도구', '자주 묻는 질문'],
    sectionTexts: ['선명한 시작 이미지에 하나의 주요 동작, 카메라 방향, 명확한 소리나 분위기 지시를 조합하면 가장 효과적입니다.', '예시를 보고 시작 이미지와 텍스트만 사용하는 장면 중 알맞은 방식을 선택하세요.', '입력 조건, 출력 제한, 오디오 지원과 적합한 작업을 비교하세요.', '프롬프트를 복사한 뒤 피사체, 움직임, 카메라, 스타일과 이미지 제약을 조정하세요.', '짧은 촬영 지시처럼 작성하세요. 주요 동작을 먼저 쓰고 카메라 방향과 유지할 요소를 명확히 하세요.', '결과가 맞지 않으면 모든 지시를 바꾸지 말고 실패한 부분만 단순화하세요.', '통합 동영상 생성기를 사용하거나 모델을 비교하고 정지 이미지 모델로 전환할 수 있습니다.'],
    buttons: ['프롬프트 복사', '복사됨', '지금 사용', 'Grok 동영상 생성기 사용'], firstFaqAnswer: 'Grok Imagine Video 1.5는 짧은 클립을 위한 xAI의 정식 이미지-동영상 모델입니다. Toolaze에서는 이미지-동영상과 프롬프트 전용 초안을 지원하는 전용 생성기로 이용할 수 있습니다.',
  },
  it: {
    metadata: { title: 'Generatore video IA Grok Imagine Video 1.5 | Toolaze', description: 'Crea su Toolaze video IA da 1 a 15 secondi con Grok Imagine Video 1.5, animazione da immagine, audio sincronizzato e output 480p o 720p.', openGraphDescription: 'Crea brevi clip Grok Imagine Video 1.5 da un’immagine o un prompt e imposta formato, durata e risoluzione.', twitterDescription: 'Crea clip Grok Imagine Video 1.5 da un’immagine iniziale con indicazioni di movimento, durata 1–15 secondi e 480p o 720p.' },
    breadcrumbs: { home: 'Home', model: 'Modelli', current: 'Grok Imagine Video 1.5' }, schema: { pageName: 'Generatore video IA Grok Imagine Video 1.5', appName: 'Generatore video IA Grok Imagine Video 1.5', howToName: 'Come generare video con Grok Imagine Video 1.5' },
    heroSuffix: 'Generatore video IA', heroDescription: 'Anima un’immagine iniziale con movimenti di camera controllati, movimento e fisica più credibili e audio sincronizzato. Crea su Toolaze clip da 1 a 15 secondi in 480p o 720p.',
    sectionTitles: ['Cos’è Grok Imagine Video 1.5?', 'Funzioni di Grok Imagine Video 1.5', 'Casi d’uso di Grok Imagine Video 1.5', 'Confronto con altri modelli video', 'Come generare video con Grok Imagine Video 1.5', 'Esempi di prompt', 'Come scrivere prompt video migliori', 'Problemi comuni e soluzioni', 'Strumenti video e immagine correlati', 'Domande frequenti'],
    sectionTexts: ['I risultati migliori combinano un’immagine chiara, un’azione principale, una direzione di camera e indicazioni esplicite per suono o atmosfera.', 'Usa gli esempi per scegliere se iniziare da un’immagine o da una scena descritta solo con testo.', 'Confronta requisiti di input, limiti di output, audio e flussi di lavoro più adatti.', 'Copia un prompt e modifica soggetto, movimento, camera, stile e vincoli dell’immagine.', 'Scrivi una breve indicazione di ripresa: prima l’azione principale, poi una camera chiara e gli elementi da conservare.', 'Se il risultato non è corretto, semplifica solo l’istruzione problematica invece di cambiare tutto.', 'Continua con il generatore generale, confronta i modelli o passa a un modello per immagini statiche.'],
    buttons: ['Copia prompt', 'Copiato', 'Prova ora', 'Prova il generatore Grok'], firstFaqAnswer: 'Grok Imagine Video 1.5 è il modello image-to-video di xAI disponibile al pubblico per brevi clip. Su Toolaze è accessibile in un generatore dedicato con flussi da immagine a video e bozze basate solo su prompt.',
  },
}

function normalizeLocale(locale: string): GrokImagineVideo15Locale {
  if (locale === 'zh' || locale === 'zh-CN' || locale === 'zh-HK') return 'zh-TW'
  return GROK_IMAGINE_VIDEO_15_LOCALES.includes(locale as GrokImagineVideo15Locale)
    ? (locale as GrokImagineVideo15Locale)
    : 'en'
}

export function getGrokImagineVideo15LandingCopy(locale: string): GrokImagineVideo15LandingCopy {
  const normalized = normalizeLocale(locale)
  if (normalized === 'en') return englishCopy

  const localized = localizedCore[normalized]
  const copy = structuredClone(englishCopy)
  copy.metadata = localized.metadata
  copy.breadcrumbs = localized.breadcrumbs
  copy.schema = localized.schema
  copy.hero.suffix = localized.heroSuffix
  copy.hero.description = localized.heroDescription
  ;[
    copy.whatIs.title,
    copy.features.title,
    copy.gallery.title,
    copy.comparison.title,
    copy.howTo.title,
    copy.prompts.title,
    copy.promptFormula.title,
    copy.quality.title,
    copy.related.title,
    copy.faq.title,
  ] = localized.sectionTitles
  ;[
    copy.features.text,
    copy.gallery.text,
    copy.comparison.text,
    copy.prompts.text,
    copy.promptFormula.text,
    copy.quality.text,
    copy.related.text,
  ] = localized.sectionTexts
  ;[copy.prompts.copyButton, copy.prompts.copiedButton, copy.related.tryNow, copy.cta.button] = localized.buttons
  copy.faq.items[0].a = localized.firstFaqAnswer
  return copy
}

export function getGrokImagineVideo15PageMetadata(
  locale: string,
  canonicalUrl = 'https://toolaze.com/model/grok-imagine-video-1-5',
): Metadata {
  const copy = getGrokImagineVideo15LandingCopy(locale)

  return {
    title: copy.metadata.title,
    description: copy.metadata.description,
    robots: 'index, follow',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: copy.metadata.title,
      description: copy.metadata.openGraphDescription,
      url: canonicalUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.metadata.title,
      description: copy.metadata.twitterDescription,
    },
  }
}
