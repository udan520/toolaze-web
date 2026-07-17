import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import AiImageGenerationTool from '@/components/AiImageGenerationTool'
import PromptCopyButton from '@/components/PromptCopyButton'
import RedditMediaCarousel from '@/components/RedditMediaCarousel'
import { loadCommonTranslations } from '@/lib/seo-loader'
import { getSeedream45LandingCopy } from '@/lib/seedream-4-5-landing-copy'

const pageUrl = 'https://toolaze.com/model/seedream-4-5'
const fourLineClampStyle = {
  display: '-webkit-box',
  WebkitLineClamp: 4,
  WebkitBoxOrient: 'vertical',
} as const

const redditDisplayImage = (url: string) => {
  const match = url.match(/-v0-([^/?]+)\.(png|jpe?g|gif)/i) || url.match(/\/([^/?]+)\.(png|jpe?g|gif)/i)
  if (!match) return url

  const [, mediaId, extension] = match
  return `https://images.weserv.nl/?url=i.redd.it/${mediaId}.${extension}&w=640&output=webp`
}

const redditMedia = (url: string) => ({ image: url, displayImage: redditDisplayImage(url) })

const redditDiscussions = [
  {
    id: 'seedream-45-performance-benchmark',
    href: 'https://www.reddit.com/r/singularity/comments/1pdc25l/performance_benchmark_seedream_45/',
    source: 'r/singularity',
    media: [
      {
        alt: 'Seedream 4.5 performance benchmark image from Reddit',
        ...redditMedia('https://preview.redd.it/performance-benchmark-seedream-4-5-v0-r4gu0ckc615g1.jpg?auto=webp&crop=smart&s=7ba5123f15925322c52fe9f6cdccbfb9c685a231&width=640'),
      },
      {
        alt: 'Second Seedream 4.5 performance benchmark image from Reddit',
        ...redditMedia('https://preview.redd.it/performance-benchmark-seedream-4-5-v0-qdcsbckc615g1.jpg?auto=webp&crop=smart&s=d3c9613d36c322ca7f4f2cb5c2387740b8a65b4f&width=640'),
      },
      {
        alt: 'Additional Seedream 4.5 benchmark image from Reddit',
        ...redditMedia('https://preview.redd.it/performance-benchmark-seedream-4-5-v0-bmrxhsra715g1.jpg?auto=webp&crop=smart&s=9a77df8c40695bdeae59696e79d45ecc8c4281fa&width=640'),
      },
    ],
  },
  {
    id: 'seedream-45-bytedance-dropped',
    href: 'https://www.reddit.com/r/singularity/comments/1pi94u8/bytedance_dropped_seedream_45_ran_it_against_nano/',
    source: 'r/singularity',
    media: [
      {
        alt: 'Fantasy castle Seedream 4.5 comparison image from Reddit',
        ...redditMedia('https://preview.redd.it/bytedance-dropped-seedream-4-5-ran-it-against-nano-banana-v0-3fm5izucx66g1.jpg?auto=webp&format=pjpg&s=bc8c415d8f4083e5ef24ece021f5517f20d4d307&width=3720'),
      },
    ],
  },
  {
    id: 'seedream-45-car-capsule-prompt',
    href: 'https://www.reddit.com/r/GenAIGallery/comments/1pltr8o/prompt_to_generate_car_capsule_style_image_using/',
    source: 'r/GenAIGallery',
    media: [
      {
        alt: 'Car capsule prompt image using Seedream 4.5 from Reddit',
        ...redditMedia('https://preview.redd.it/prompt-to-generate-car-capsule-style-image-using-seedream-4-v0-hnni57v1w07g1.png?auto=webp&crop=smart&s=74a6ae42f0f1e70dad770aea6795996e36932929&width=640'),
      },
    ],
  },
  {
    id: 'seedream-45-early-visual-tests',
    href: 'https://www.reddit.com/r/aiArt/comments/1pj5fga/early_seedream_45_tests_for_posters_thumbnails/',
    source: 'r/aiArt',
    media: [
      {
        alt: 'Seedream 4.5 social visual test from Reddit',
        ...redditMedia('https://preview.redd.it/early-seedream-4-5-tests-for-posters-thumbnails-and-social-v0-fsdy77maae6g1.png?auto=webp&format=png&s=d67740fb11f755e9bb7fbd8631a982a26609f35a&width=1728'),
      },
      {
        alt: 'Seedream 4.5 poster test from Reddit',
        ...redditMedia('https://preview.redd.it/early-seedream-4-5-tests-for-posters-thumbnails-and-social-v0-bth9y5l1ae6g1.png?auto=webp&format=png&s=b175f700e063cfa1bacce6a1ef3050ba47cbec72&width=2848'),
      },
      {
        alt: 'Seedream 4.5 thumbnail test from Reddit',
        ...redditMedia('https://preview.redd.it/early-seedream-4-5-tests-for-posters-thumbnails-and-social-v0-8kg96ep2ae6g1.png?auto=webp&format=png&s=31e0f57841796c98641e8500257429018010228a&width=2848'),
      },
      {
        alt: 'Seedream 4.5 infographic test from Reddit',
        ...redditMedia('https://preview.redd.it/early-seedream-4-5-tests-for-posters-thumbnails-and-social-v0-84v498a3ae6g1.png?auto=webp&format=png&s=98c31a7cead54c215bde3e7f002c36b59b0efb1c&width=1664'),
      },
      {
        alt: 'Seedream 4.5 design test from Reddit',
        ...redditMedia('https://preview.redd.it/early-seedream-4-5-tests-for-posters-thumbnails-and-social-v0-qov7y57n9e6g1.png?auto=webp&format=png&s=f094796c152a9d84efc518aa7ed4fe54271564b5&width=2940'),
      },
    ],
  },
  {
    id: 'seedream-45-officially-out',
    href: 'https://www.reddit.com/r/aiArt/comments/1pdntlc/seedream_45_officially_out/',
    source: 'r/aiArt',
    media: [
      {
        alt: 'Seedream 4.5 portrait example from Reddit',
        ...redditMedia('https://preview.redd.it/seedream-4-5-officially-out-v0-vn92pbycj35g1.jpg?auto=webp&crop=smart&s=886dd6299486fd915c69b3f9f0cdc955c54b7ef3&width=640'),
      },
      {
        alt: 'Second Seedream 4.5 portrait example from Reddit',
        ...redditMedia('https://preview.redd.it/seedream-4-5-officially-out-v0-l3mlhmcdj35g1.jpg?auto=webp&crop=smart&s=899ce9646435b2caa9f167c4e7d2355a0aac097d&width=640'),
      },
    ],
  },
  {
    id: 'seedream-45-motion-blur-athletic-portrait',
    href: 'https://www.reddit.com/r/aiArt/comments/1qmj5e2/seedream_45_motion_blur_athletic_portrait_prompt/',
    source: 'r/aiArt',
    media: [
      {
        alt: 'Seedream 4.5 motion blur athletic portrait from Reddit',
        ...redditMedia('https://preview.redd.it/seedream-4-5-motion-blur-athletic-portrait-prompt-included-v0-ua1kdjk3zhfg1.jpeg?auto=webp&crop=smart&s=e51ae1c634239b93a2e8712a04eb57c03d2d3fe8&width=640'),
      },
    ],
  },
  {
    id: 'seedream-45-black-white-portrait',
    href: 'https://www.reddit.com/r/aiArt/comments/1qu0tjo/intimate_bw_portrait_seedream_45_prompt/',
    source: 'r/aiArt',
    media: [
      {
        alt: 'Seedream 4.5 black and white portrait from Reddit',
        ...redditMedia('https://preview.redd.it/intimate-b-w-portrait-seedream-4-5-prompt-v0-h1anfrct44hg1.jpeg?auto=webp&crop=smart&s=6ef32672d3ff5bd6f9800e45bf6f308d87024cae&width=640'),
      },
    ],
  },
  {
    id: 'seedream-45-expression-portrait',
    href: 'https://www.reddit.com/r/aiArt/comments/1q5fwrk/seedream_is_giving_the_best_expression_for/',
    source: 'r/aiArt',
    media: [
      {
        alt: 'Seedream 4.5 expression portrait from Reddit',
        ...redditMedia('https://preview.redd.it/seedream-is-giving-the-best-expression-for-portrait-photo-v0-5jiyqmaoppbg1.jpeg?auto=webp&crop=smart&s=bb1c03ac102d5abb7b43bb976c8740b6682910b0&width=640'),
      },
    ],
  },
  {
    id: 'seedream-45-higgsfield-v45-feedback',
    href: 'https://www.reddit.com/r/aiArt/comments/1pdfzv3/what_do_you_guys_think_of_seedream_v45_better/',
    source: 'r/aiArt',
    media: [
      {
        alt: 'Seedream 4.5 character image from a Reddit feedback post',
        ...redditMedia('https://preview.redd.it/what-do-you-guys-think-of-seedream-v4-5-better-than-v4-v0-b6r6be3xw15g1.png?auto=webp&format=png&s=b795184034162a37e4882c00737a1340648d3d0f&width=1664'),
      },
    ],
  },
  {
    id: 'seedream-45-higgsfield-four-models',
    href: 'https://www.reddit.com/r/HiggsfieldAI/comments/1qe14i1/one_portrait_prompt_four_models_on_higgsfield/',
    source: 'r/HiggsfieldAI',
    media: [
      {
        alt: 'Seedream 4.5 portrait comparison from Reddit',
        ...redditMedia('https://preview.redd.it/one-portrait-prompt-four-models-on-higgsfield-nano-banana-v0-8tcbm0hwwldg1.jpg?auto=webp&crop=smart&s=aac695eb1f6c08367a1664ac9c05f08a8035e2b3&width=640'),
      },
      {
        alt: 'Second Seedream 4.5 portrait comparison from Reddit',
        ...redditMedia('https://preview.redd.it/one-portrait-prompt-four-models-on-higgsfield-nano-banana-v0-i0ysu2hwwldg1.jpg?auto=webp&crop=smart&s=1859d99b6ea01bb3938f673ca06c8a4f46754194&width=640'),
      },
      {
        alt: 'Third Seedream 4.5 portrait comparison from Reddit',
        ...redditMedia('https://preview.redd.it/one-portrait-prompt-four-models-on-higgsfield-nano-banana-v0-3um0t5hwwldg1.jpg?auto=webp&crop=smart&s=729e7bcb8f0b24f49e16eea28e82df25725f93fd&width=640'),
      },
      {
        alt: 'Fourth Seedream 4.5 portrait comparison from Reddit',
        ...redditMedia('https://preview.redd.it/one-portrait-prompt-four-models-on-higgsfield-nano-banana-v0-4q29z2hwwldg1.jpg?auto=webp&crop=smart&s=45b43bd4f337a1478ee3086c67ee9be99512642a&width=640'),
      },
    ],
  },
]

const xCommunityExamples = [
  {
    name: 'Marky @ Easy-Peasy.AI',
    handle: '@easy_peasy_ai',
    avatar: 'https://pbs.twimg.com/profile_images/1588347256499245056/mId9Kaeh_200x200.jpg',
    href: 'https://x.com/easy_peasy_ai/status/1996233802222539005',
    image: 'https://pbs.twimg.com/media/G7QMD7TboAAs4UB.jpg?name=orig',
    time: '11:03 PM',
    likes: '2',
    replies: '0',
  },
  {
    name: 'Heisenberg',
    handle: '@rovvmut_',
    avatar: 'https://pbs.twimg.com/profile_images/2061782278959935488/zxfVzXuw_200x200.jpg',
    href: 'https://x.com/rovvmut_/status/1996186327491162275',
    image: 'https://pbs.twimg.com/media/G7Pg4cWbQAA5hO9.jpg?name=orig',
    time: '7:54 PM',
    likes: '341',
    replies: '87',
  },
  {
    name: 'Brady Long',
    handle: '@thisguyknowsai',
    avatar: 'https://pbs.twimg.com/profile_images/1986942448723976192/86_UeEa0_200x200.jpg',
    href: 'https://x.com/thisguyknowsai/status/1998769783270158497',
    image: 'https://pbs.twimg.com/media/G70OhDtaMAIxPSI.png?name=orig',
    time: '11:00 PM',
    likes: '17',
    replies: '4',
  },
  {
    name: 'Heisenberg',
    handle: '@rovvmut_',
    avatar: 'https://pbs.twimg.com/profile_images/2061782278959935488/zxfVzXuw_200x200.jpg',
    href: 'https://x.com/rovvmut_/status/1996129741360038063',
    image: 'https://pbs.twimg.com/media/G7OtaNmbgAACEp7.jpg?name=orig',
    time: '4:09 PM',
    likes: '245',
    replies: '25',
  },
  {
    name: 'Curious Refuge',
    handle: '@CuriousRefuge',
    avatar: 'https://pbs.twimg.com/profile_images/1652411518062039040/gXeSS69n_200x200.jpg',
    href: 'https://x.com/CuriousRefuge/status/1999227782476497280',
    image: 'https://pbs.twimg.com/media/G76umqKagAIUJty.jpg?name=orig',
    time: '5:20 AM',
    likes: '7',
    replies: '6',
  },
  {
    name: 'Curious Refuge',
    handle: '@CuriousRefuge',
    avatar: 'https://pbs.twimg.com/profile_images/1652411518062039040/gXeSS69n_200x200.jpg',
    href: 'https://x.com/CuriousRefuge/status/2004675948734738438',
    image: 'https://pbs.twimg.com/media/G9IInEUaQAATm_4.jpg?name=orig',
    time: '6:09 AM',
    likes: '9',
    replies: '2',
  },
  {
    name: 'Replicate',
    handle: '@replicate',
    avatar: 'https://pbs.twimg.com/profile_images/1732095881695068160/qAiGXOMH_200x200.jpg',
    href: 'https://x.com/replicate/status/1996239048017596745',
    image: 'https://pbs.twimg.com/media/G7QQ1KMa0AAjslQ.jpg?name=orig',
    time: '11:24 PM',
    likes: '186',
    replies: '14',
  },
  {
    name: 'ElevenLabs',
    handle: '@ElevenLabs',
    avatar: 'https://pbs.twimg.com/profile_images/2047043946807754752/7xmvtysh_200x200.png',
    href: 'https://x.com/ElevenLabs/status/1996899490632978939',
    image: 'https://pbs.twimg.com/media/G7ZpgPNXQAAvvXI.jpg?name=orig',
    time: '7:08 PM',
    likes: '102',
    replies: '4',
  },
  {
    name: 'Oogie',
    handle: '@oggii_0',
    avatar: 'https://pbs.twimg.com/profile_images/2008212741434269696/N7S0tqfn_200x200.jpg',
    href: 'https://x.com/oggii_0/status/1996205261778747444',
    image: 'https://pbs.twimg.com/media/G7PyFsfaMAE2Afh.jpg?name=orig',
    time: '9:09 PM',
    likes: '196',
    replies: '34',
  },
  {
    name: 'AI/ML API',
    handle: '@aimlapi',
    avatar: 'https://pbs.twimg.com/profile_images/2061768103298473984/Zx3T3Ovp_200x200.jpg',
    href: 'https://x.com/aimlapi/status/1998061523747602499',
    image: 'https://pbs.twimg.com/media/G7qJuwdXwAAAHZz.jpg?name=orig',
    time: '12:06 AM',
    likes: '2',
    replies: '1',
  },
]

const features = [
  {
    slot: 'feature-reference-consistency',
    title: 'Reference Consistency for Multi-Image Editing',
    label: 'Reference-guided edit board',
    paragraphs: [
      'Seedream 4.5 is especially useful when a prompt needs to keep visual identity stable across multiple references. Use it for product variants, character references, packaging changes, material swaps, and scenes where the uploaded image should still feel like the same subject after editing.',
      'Toolaze supports Seedream 4.5 image editing with reference inputs, including JPEG, PNG, and WEBP files. That makes the model a strong fit for reference-guided edits where consistency matters more than one-off visual exploration.',
    ],
  },
  {
    slot: 'feature-4k-output',
    title: '4K High Quality Output',
    label: '4K campaign image board',
    paragraphs: [
      'Toolaze exposes Seedream 4.5 quality modes for fast drafts and 4K output. That gives creators a clear path: draft quickly in a lighter mode, then choose higher quality when the image needs to work for posters, product pages, thumbnails, ads, or presentation visuals.',
      'Use 4K when layout detail, small typography, product texture, and large-format composition matter. For quick ideation, a lighter output can be enough before you refine the prompt.',
    ],
  },
  {
    slot: 'feature-typography',
    title: 'Typography and Dense Text Layouts',
    label: 'Typography-rich poster layout',
    paragraphs: [
      'ByteDance Seed highlights stronger typography, dense text rendering, poster layout, and design-oriented output for Seedream 4.5. This makes it useful for menu boards, event posters, product labels, social cards, invitation concepts, and multilingual layout drafts.',
      'Seedream 4.5 is strong for text-rich design drafts, but generated text should still be reviewed before publishing.',
    ],
  },
  {
    slot: 'feature-commercial-design',
    title: 'Commercial Poster and Product Design',
    label: 'Commercial product design sheet',
    paragraphs: [
      'Official Seedream 4.5 examples include e-commerce product displays, poster layouts, beauty key visuals, fragrance detail pages, SaaS-style promotional images, and wedding invitation designs. Those examples map well to the jobs users bring to Toolaze: selling, explaining, launching, and testing creative directions.',
      'For marketers and shop owners, the practical value is speed. Generate several layout directions, compare readability and product focus, then refine the best one before moving it into production.',
    ],
  },
  {
    slot: 'feature-prompt-adherence',
    title: 'Prompt Adherence and Layout Control',
    label: 'Structured prompt control canvas',
    paragraphs: [
      'ByteDance Seed says Seedream 4.5 improves prompt adherence, alignment, and aesthetics compared with Seedream 4.0 in its MagicBench framing. In practical terms, this matters when the prompt contains exact layout instructions, subject placement, background rules, and style constraints.',
      'Use structured prompts that name the asset type, subject, exact text, layout, lighting, background, ratio, and what must stay unchanged. Seedream 4.5 is strongest when the task is specific rather than vague.',
    ],
  },
]

const galleryExamples = [
  {
    slot: 'gallery-ecommerce-product',
    title: 'E-commerce Product Image',
    text: 'Create clean marketplace visuals with product focus, controlled background, readable selling points, and room for badges or promotional text.',
  },
  {
    slot: 'gallery-poster-layout',
    title: 'Poster Layout',
    text: 'Build event posters, campaign boards, launch announcements, and title-led visuals where composition and typography matter.',
  },
  {
    slot: 'gallery-fragrance-detail',
    title: 'Fragrance Detail Page',
    text: 'Explore premium product scenes with bottle texture, ingredient cues, layout hierarchy, and polished commercial lighting.',
  },
  {
    slot: 'gallery-saas-promo',
    title: 'SaaS Promo Visual',
    text: 'Generate product-led software ads, feature explainers, launch graphics, and clean interface-inspired campaign images.',
  },
  {
    slot: 'gallery-wedding-invitation',
    title: 'Wedding Invitation Concept',
    text: 'Create elegant invitation visuals, event cards, decorative borders, readable names, and refined layout directions.',
  },
  {
    slot: 'gallery-beauty-kv',
    title: 'Beauty Key Visual',
    text: 'Make skincare, cosmetics, salon, or fragrance visuals with product texture, premium color, and editorial composition.',
  },
  {
    slot: 'gallery-character-reference',
    title: 'Character Reference Edit',
    text: 'Use references to keep a character, mascot, or styled subject consistent while changing clothing, pose, scene, or mood.',
  },
  {
    slot: 'gallery-multilingual-layout',
    title: 'Multilingual Text Layout',
    text: 'Test dense English, Chinese, Japanese, or mixed-language visual layouts for posters, labels, menus, and information cards.',
  },
]

const audiences = [
  'Marketing teams: Create campaign visuals, product launch posters, paid social concepts, and fast creative variants before production design.',
  'E-commerce sellers: Generate product detail images, listing visuals, bundle graphics, seasonal promotions, and cleaner commercial backgrounds.',
  'Designers: Explore typography, layout hierarchy, poster directions, brand key visuals, and reference-based visual systems.',
  'Content creators: Make thumbnails, social graphics, educational cards, event images, and creator product visuals with clearer text direction.',
  'Product teams: Create SaaS feature images, onboarding visuals, announcement boards, and early concept graphics for product storytelling.',
  'Educators: Build readable explainers, classroom posters, process diagrams, and multilingual information graphics.',
]

const comparisonRows = [
  {
    capability: 'Best for',
    seedream: 'Reference editing, commercial layouts, typography, product and poster visuals',
    nano: 'Fast image workflows, reference edits, high-resolution design assets',
    gpt: 'Text-rich images, structured layouts, image editing, UI-style visuals',
    midjourney: 'Stylized art direction, cinematic imagery, aesthetic exploration',
  },
  {
    capability: 'Text rendering',
    seedream: 'Strong official focus on typography and dense text layouts',
    nano: 'Strong for text-heavy design in newer Gemini-style workflows',
    gpt: 'Strong for short readable text and structured UI-like labels',
    midjourney: 'Improved, but publishing text still needs careful review',
  },
  {
    capability: 'Image editing',
    seedream: 'Supports Seedream 4.5 Edit with reference image inputs',
    nano: 'Good reference-guided editing and fast iteration',
    gpt: 'Strong for natural-language image edits and layout changes',
    midjourney: 'Better for variation and style exploration than precise edits',
  },
  {
    capability: 'High resolution',
    seedream: 'Supports fast draft quality and 4K high quality output',
    nano: 'Supports high-resolution workflows depending on model and settings',
    gpt: 'Supports 4K output when selected settings allow it',
    midjourney: 'High-quality outputs with upscale/export workflows',
  },
  {
    capability: 'Commercial visuals',
    seedream: 'Strong fit for product boards, posters, invitations, and key visuals',
    nano: 'Strong for product visuals and flexible image generation',
    gpt: 'Strong for commercial drafts with text and layout requirements',
    midjourney: 'Strong for polished mood and art direction',
  },
  {
    capability: 'Limitations',
    seedream: 'Exact text and edit details still need review before publishing',
    nano: 'Model behavior varies by reference quality and prompt clarity',
    gpt: 'Best results still need prompt iteration and detail review',
    midjourney: 'Less ideal for precise editable production layouts',
  },
]

const promptExamples = [
  {
    slot: 'prompt-product-poster',
    title: 'Product Launch Poster',
    prompt:
      'Create a 4K product launch poster for a premium sparkling tea can. Use a clean vertical composition, large readable headline text "Bright Citrus Tea", smaller subtitle "zero sugar, real fruit aroma", fresh citrus slices, condensation, soft studio lighting, and a polished commercial layout with clear negative space.',
  },
  {
    slot: 'prompt-character-reference-edit',
    title: 'Character Reference Edit',
    prompt:
      'Use the uploaded character reference. Preserve the same face shape, hairstyle, eye color, and outfit details. Place the character in a cinematic rainy street scene at night, with reflective pavement, soft neon light, natural pose, and the same recognizable identity across the new image.',
  },
  {
    slot: 'prompt-education-infographic',
    title: 'Educational Infographic',
    prompt:
      'Design a clean educational infographic titled "How Solar Energy Works". Include four clearly separated steps, readable labels, simple flat diagrams, arrows, concise captions, blue and yellow accents, and a balanced classroom-friendly layout with no clutter.',
  },
  {
    slot: 'prompt-interior-redesign',
    title: 'Interior Redesign From Reference',
    prompt:
      'Use the uploaded room photo as a reference. Keep the camera angle, window placement, and room layout unchanged. Redesign the room in a warm Japandi style with oak furniture, linen textures, soft indirect lighting, neutral walls, and tidy styling suitable for an interior design proposal.',
  },
  {
    slot: 'prompt-event-poster',
    title: 'Event Poster With Dense Text',
    prompt:
      'Create a modern event poster for "Future Design Week 2026". Include readable schedule text for three sessions, speaker names, date, venue, ticket note, and a bold abstract visual system. Use strong hierarchy, generous spacing, and a polished editorial poster style.',
  },
]

const relatedLinks = [
  {
    title: 'GPT Image 2 AI Image Generator',
    href: '/model/gpt-image-2',
    text: 'Compare another strong image model for text-rich visuals, editing, UI mockups, and commercial drafts.',
  },
  {
    title: 'Nano Banana Pro Generator',
    href: '/model/nano-banana-pro',
    text: 'Explore a Gemini image workflow for high-resolution design assets and reference-guided edits.',
  },
  {
    title: 'Nano Banana 2 Generator',
    href: '/model/nano-banana-2',
    text: 'Use another fast image model for common creative formats, product visuals, and image editing.',
  },
  {
    title: 'Nano Banana Image to Image',
    href: '/model/nano-banana',
    text: 'Use a dedicated image-to-image workflow when uploaded references are your main priority.',
  },
  {
    title: 'AI Models Hub',
    href: '/model',
    text: 'Browse Toolaze image and video model pages when you want broader model comparison.',
  },
]

const faqs = [
  {
    q: 'What is Seedream 4.5?',
    a: 'Seedream 4.5 is ByteDance Seed\'s AI image generation and editing model for creating and refining images from prompts and reference images. It is useful for product visuals, posters, typography-rich layouts, multi-image editing, and commercial creative drafts.',
  },
  {
    q: 'Is Seedream 4.5 free on Toolaze?',
    a: 'Yes. Toolaze lets you try Seedream 4.5 online for free. Free usage may vary by quota, model availability, or selected quality settings.',
  },
  {
    q: 'Can I use Seedream 4.5 without signup?',
    a: 'Yes. Toolaze AI image model pages are designed for free no-signup access. Some advanced settings, higher limits, downloads, or continued usage may require signing in if the access policy changes.',
  },
  {
    q: 'Does Seedream 4.5 support 4K output?',
    a: 'Yes. Toolaze supports Seedream 4.5 4K output through its high quality mode. Use 4K for product posters, campaign visuals, detail images, and typography-heavy layouts that need more room for visual detail.',
  },
  {
    q: 'Can Seedream 4.5 edit images?',
    a: 'Yes. Toolaze supports Seedream 4.5 image editing with reference inputs, including JPEG, PNG, and WEBP files. Use it for product updates, reference-guided edits, background changes, layout revisions, and multi-image composition.',
  },
  {
    q: 'Is Seedream 4.5 better than Nano Banana or GPT Image 2?',
    a: 'It depends on the task. Seedream 4.5 is attractive for reference consistency, typography, product visuals, and poster layouts. GPT Image 2 is strong for structured text-rich images and editing, while Nano Banana models are useful for fast image workflows and reference-based generation.',
  },
  {
    q: 'What prompts work best with Seedream 4.5?',
    a: 'Use prompts that describe the asset type, subject, exact visible text, layout, ratio, lighting, background, and what should stay unchanged from references. For edits, specify what to preserve before describing what to change.',
  },
]

const imageAssets: Record<string, string> = {
  'feature-reference-consistency': '/model-assets/seedream-4-5/feature-reference-consistency.webp',
  'feature-4k-output': '/model-assets/seedream-4-5/feature-4k-output.webp',
  'feature-typography': '/model-assets/seedream-4-5/feature-typography.webp',
  'feature-commercial-design': '/model-assets/seedream-4-5/feature-commercial-design.webp',
  'feature-prompt-adherence': '/model-assets/seedream-4-5/feature-prompt-adherence.webp',
  'gallery-ecommerce-product': '/model-assets/seedream-4-5/gallery-ecommerce-product.webp',
  'gallery-poster-layout': '/model-assets/seedream-4-5/gallery-poster-layout.webp',
  'gallery-fragrance-detail': '/model-assets/seedream-4-5/gallery-fragrance-detail.webp',
  'gallery-saas-promo': '/model-assets/seedream-4-5/gallery-saas-promo.webp',
  'gallery-wedding-invitation': '/model-assets/seedream-4-5/gallery-wedding-invitation.webp',
  'gallery-beauty-kv': '/model-assets/seedream-4-5/gallery-beauty-kv.webp',
  'gallery-character-reference': '/model-assets/seedream-4-5/gallery-character-reference.webp',
  'gallery-multilingual-layout': '/model-assets/seedream-4-5/gallery-multilingual-layout.webp',
  'prompt-product-poster': '/model-assets/seedream-4-5/prompt-product-poster.webp',
  'prompt-character-reference-edit': '/model-assets/seedream-4-5/prompt-character-reference-edit.webp',
  'prompt-education-infographic': '/model-assets/seedream-4-5/prompt-education-infographic.webp',
  'prompt-interior-redesign': '/model-assets/seedream-4-5/prompt-interior-redesign.webp',
  'prompt-event-poster': '/model-assets/seedream-4-5/prompt-event-poster.webp',
  'final-cta': '/model-assets/seedream-4-5/final-cta.webp',
}

function SectionHeader({ title, text, inverse = false }: { title: string; text?: string; inverse?: boolean }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <h2 className={`text-[36px] font-extrabold leading-tight tracking-tight ${inverse ? 'text-white' : 'text-slate-950'}`}>
        {title}
      </h2>
      {text ? (
        <p className={`mx-auto mt-4 text-base leading-8 md:text-lg ${inverse ? 'text-indigo-100' : 'text-slate-600'}`}>
          {text}
        </p>
      ) : null}
    </div>
  )
}

function RedditLogo() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[#ff4500]" aria-label="Reddit">
      <svg viewBox="0 0 36 36" className="h-6 w-6" aria-hidden="true">
        <circle cx="18" cy="18" r="16" fill="currentColor" />
        <circle cx="12.5" cy="19" r="2.2" fill="white" />
        <circle cx="23.5" cy="19" r="2.2" fill="white" />
        <path
          d="M12.5 24.2c2.9 2 8.1 2 11 0"
          fill="none"
          stroke="white"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <path d="M18 12.2l2.2-5.1 5.1 1.1" fill="none" stroke="white" strokeLinecap="round" strokeWidth="2" />
        <circle cx="27.2" cy="8.8" r="2.2" fill="white" />
      </svg>
    </span>
  )
}

function ImagePlaceholder({ slot, label }: { slot: string; label: string }) {
  const src = imageAssets[slot]

  return (
    <div
      data-image-src={src}
      className="min-h-[260px] overflow-hidden rounded-[1.5rem] border border-indigo-100 bg-[linear-gradient(135deg,#F8FAFF,#FFFFFF_46%,#EEF2FF)] shadow-sm shadow-indigo-100"
    >
      <img src={src} alt={label} className="h-full min-h-[260px] w-full object-cover" loading="lazy" />
    </div>
  )
}

export async function Seedream45LandingPage({ locale = 'en' }: { locale?: string } = {}) {
  const copy = getSeedream45LandingCopy(locale)
  const t = await loadCommonTranslations(locale)
  const features = copy.features.items
  const galleryExamples = copy.gallery.examples
  const audiences = copy.audiences.items
  const comparisonRows = copy.comparison.rows
  const promptExamples = copy.prompts.examples
  const youtubeExamples = copy.youtube.examples
  const localizedRedditDiscussions = redditDiscussions.map((item, index) => {
    const localizedItem = {
      ...item,
      ...(copy.reddit.items[index] || {}),
    }

    return {
      ...localizedItem,
      media: item.media.map((media) => ({
        ...media,
        alt: `${localizedItem.title} ${copy.reddit.communityDiscussion}`,
      })),
    }
  })
  const localizedXCommunityExamples = xCommunityExamples.map((item, index) => ({
    ...item,
    ...(copy.x.items[index] || {}),
  }))
  const relatedLinks = copy.related.links
  const howToSteps = copy.howTo.steps
  const faqs = copy.faq.items

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }
  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: copy.schema.pageName,
        url: pageUrl,
        description: copy.metadata.description,
      },
      {
        '@type': 'SoftwareApplication',
        name: copy.schema.appName,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'HowTo',
        name: copy.schema.howToName,
        step: howToSteps.map((text) => ({ '@type': 'HowToStep', text })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: copy.breadcrumbs.home, item: 'https://toolaze.com' },
          { '@type': 'ListItem', position: 2, name: copy.breadcrumbs.model, item: 'https://toolaze.com/model' },
          { '@type': 'ListItem', position: 3, name: copy.schema.pageName, item: pageUrl },
        ],
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navigation initialTranslations={t} />
      <main className="min-h-screen overflow-x-hidden bg-[#F8FAFF] text-slate-950">
        <section id="seedream-4-5-generator" className="bg-[#F8FAFF] pb-12 pl-0 pr-2 md:pl-0 md:pr-4 xl:pl-0 xl:pr-6 2xl:pl-0 2xl:pr-8">
          <div className="w-full max-w-full">
            <AiImageGenerationTool
              modelId="seedream-4-5"
              modelName="Seedream 4.5"
              dailyLimitStorageKey="seedream_4_5_last_used_date"
              heroBreadcrumbItems={[
                { label: copy.breadcrumbs.home, href: '/' },
                { label: copy.breadcrumbs.model, href: '/model' },
                { label: copy.breadcrumbs.current },
              ]}
              heroTitle={
                <>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    {copy.hero.modelName}
                  </span>{' '}
                  {copy.hero.suffix}
                </>
              }
              heroDescription={copy.hero.description}
              initialTranslations={t}
            />
          </div>
        </section>

        <section className="bg-[#F8FAFF] px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-[36px] font-extrabold leading-tight tracking-tight text-slate-950">{copy.whatIs.title}</h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-slate-700">
              {copy.whatIs.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="bg-white px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl space-y-14">
            <SectionHeader
              title={copy.features.title}
              text={copy.features.text}
            />
            {features.map((item, index) => {
              const textBlock = (
                <div>
                  <h3 className="text-3xl font-extrabold tracking-tight text-slate-950">{item.title}</h3>
                  {item.paragraphs.map((paragraph, paragraphIndex) => (
                    <p key={paragraph} className={`${paragraphIndex === 0 ? 'mt-5' : 'mt-4'} text-base leading-8 text-slate-700`}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              )
              const imageBlock = <ImagePlaceholder slot={item.slot} label={item.label} />
              return (
                <div key={item.slot} className="grid gap-8 lg:grid-cols-2 lg:items-center">
                  {index % 2 === 0 ? (
                    <>
                      {textBlock}
                      {imageBlock}
                    </>
                  ) : (
                    <>
                      {imageBlock}
                      {textBlock}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <section className="bg-[#F8FAFF] px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              title={copy.gallery.title}
              text={copy.gallery.text}
            />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {galleryExamples.map((item) => (
                <article key={item.slot} className="rounded-[1.5rem] border border-indigo-100 bg-white p-4 shadow-sm shadow-indigo-100">
                  <ImagePlaceholder slot={item.slot} label={item.title} />
                  <h3 className="mt-5 text-xl font-extrabold tracking-tight text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader title={copy.audiences.title} />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {audiences.map((item) => (
                <div key={item} className="rounded-[1.5rem] border border-indigo-100 bg-[#F8FAFF] p-6 shadow-sm shadow-indigo-100">
                  <p className="text-sm leading-7 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#111827] px-4 py-14 text-white md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              title={copy.comparison.title}
              text={copy.comparison.text}
              inverse
            />
            <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5">
              <div className="overflow-x-auto">
                <table className="min-w-[920px] w-full text-left text-sm">
                  <thead className="bg-white/10 text-white">
                    <tr>
                      <th className="px-5 py-4">{copy.comparison.capabilityHeader}</th>
                      <th className="px-5 py-4">Seedream 4.5</th>
                      <th className="px-5 py-4">Nano Banana</th>
                      <th className="px-5 py-4">GPT Image 2</th>
                      <th className="px-5 py-4">Midjourney</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-indigo-50">
                    {comparisonRows.map((row) => (
                      <tr key={row.capability}>
                        <td className="px-5 py-4 font-extrabold text-white">{row.capability}</td>
                        <td className="px-5 py-4">{row.seedream}</td>
                        <td className="px-5 py-4">{row.nano}</td>
                        <td className="px-5 py-4">{row.gpt}</td>
                        <td className="px-5 py-4">{row.midjourney}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-[36px] font-extrabold leading-tight tracking-tight text-slate-950">
              {copy.howTo.title}
            </h2>
            <ol className="mt-8 grid gap-4 text-base leading-8 text-slate-700">
              {howToSteps.map((step, index) => (
                <li key={step} className="flex gap-4 rounded-[1.25rem] border border-indigo-100 bg-[#F8FAFF] p-5">
                  <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-indigo-700 text-sm font-extrabold text-white">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-[#F8FAFF] px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              title={copy.prompts.title}
              text={copy.prompts.text}
            />
            <div className="space-y-6">
              {promptExamples.map((item) => (
                <article key={item.slot} className="grid gap-6 rounded-[1.5rem] border border-indigo-100 bg-white p-5 shadow-sm shadow-indigo-100 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-2xl font-extrabold tracking-tight text-slate-950">{item.title}</h3>
                      <PromptCopyButton prompt={item.prompt} copyLabel={copy.prompts.copyButton} copiedLabel={copy.prompts.copiedButton} />
                    </div>
                    <p className="mt-4 rounded-2xl bg-[#F8FAFF] p-5 text-sm leading-7 text-slate-700">{item.prompt}</p>
                  </div>
                  <ImagePlaceholder slot={item.slot} label={item.title} />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              title={copy.youtube.title}
              text={copy.youtube.text}
            />
            <div className="grid gap-5 md:grid-cols-3">
              {youtubeExamples.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-indigo-100 bg-[#F8FAFF] shadow-sm shadow-indigo-100 transition hover:-translate-y-1 hover:border-indigo-300"
                >
                  <div className="relative">
                    <iframe
                      src={`https://www.youtube.com/embed/${item.videoId}`}
                      title={item.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="aspect-video w-full border-0"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-xs font-extrabold text-white">
                      YouTube
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-extrabold text-indigo-600">{item.creator}</p>
                    <h3 className="mt-3 text-xl font-extrabold tracking-tight text-slate-950">{item.title}</h3>
                    <p className="mt-3 min-h-[96px] overflow-hidden text-sm leading-6 text-slate-600" style={fourLineClampStyle}>{item.text}</p>
                    <p className="mt-auto pt-5 text-sm font-extrabold text-indigo-700 group-hover:text-indigo-900">{copy.youtube.watch}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F8FAFF] px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-[1500px]">
            <SectionHeader
              title={copy.reddit.title}
              text={copy.reddit.text}
            />
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {localizedRedditDiscussions.map((item) => (
                <article
                  key={item.id}
                  className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-indigo-100 bg-white shadow-sm shadow-indigo-100 transition hover:-translate-y-1 hover:border-indigo-300"
                >
                  <div className="flex items-center justify-between gap-3 bg-white px-4 py-4">
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-indigo-600">{item.source}</p>
                      <p className="mt-1 truncate text-xs font-semibold text-slate-500">{copy.reddit.communityDiscussion}</p>
                    </div>
                    <RedditLogo />
                  </div>
                  <RedditMediaCarousel media={item.media} title={item.title} />
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-base font-extrabold leading-snug tracking-tight text-slate-950">{item.title}</h3>
                    <p className="mt-3 min-h-[96px] overflow-hidden text-xs leading-6 text-slate-600" style={fourLineClampStyle}>{item.text}</p>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto pt-4 text-xs font-extrabold text-indigo-700 transition hover:text-indigo-900"
                    >
                      {copy.reddit.openDiscussion}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#1f1f25] px-4 py-14 text-white md:px-6 md:py-20">
          <div className="mx-auto max-w-[1500px]">
            <SectionHeader
              title={copy.x.title}
              text={copy.x.text}
              inverse
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {localizedXCommunityExamples.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-[1.75rem] bg-white p-5 text-slate-950 shadow-2xl shadow-black/25 transition hover:-translate-y-1 hover:shadow-black/40"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={item.avatar}
                      alt={`${item.name} ${copy.x.title}`}
                      loading="lazy"
                      decoding="async"
                      className="h-12 w-12 shrink-0 rounded-full border border-slate-200 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-sm font-extrabold">{item.name}</p>
                        <span className="rounded-full bg-sky-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                          {copy.x.verified}
                        </span>
                      </div>
                      <p className="truncate text-sm text-slate-500">{item.handle}</p>
                    </div>
                    <span className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-extrabold text-slate-950">
                      {copy.x.follow}
                    </span>
                    <span className="text-2xl font-black leading-none text-slate-950">X</span>
                  </div>

                  <p className="mt-5 min-h-[96px] overflow-hidden text-sm font-semibold leading-6 text-slate-900" style={fourLineClampStyle}>{item.body}</p>

                  <div className="relative mt-5 overflow-hidden rounded-[1.25rem] border border-slate-200 bg-slate-100">
                    <img
                      src={item.image}
                      alt={`${item.title} ${item.handle}`}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="aspect-[16/10] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                    <span className="absolute right-3 top-3 rounded-full bg-slate-950/85 px-3 py-1 text-xs font-extrabold text-white">
                      {copy.x.watch}
                    </span>
                  </div>

                  <div className="mt-4 border-b border-slate-200 pb-4 text-sm text-slate-500">
                    <span>{item.time}</span>
                    <span className="mx-2">.</span>
                    <span>{copy.x.monthYear}</span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-bold text-slate-600">
                    <span>{item.likes} {copy.x.likes}</span>
                    <span>{copy.x.reply}</span>
                    <span>{copy.x.copyLink}</span>
                  </div>

                  <div className="mt-auto pt-5">
                    <span className="inline-flex w-full items-center justify-center rounded-full bg-sky-500 px-4 py-3 text-sm font-extrabold text-white transition group-hover:bg-sky-600">
                      {copy.x.read} {item.replies} {copy.x.replies}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F8FAFF] px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader title={copy.related.title} />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {relatedLinks.map((item) => (
                <Link key={item.href} href={item.href} className="group rounded-[1.5rem] border border-indigo-100 bg-white p-6 shadow-sm shadow-indigo-100 transition hover:-translate-y-1 hover:border-indigo-300">
                  <h3 className="text-xl font-extrabold tracking-tight text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                  <p className="mt-5 text-sm font-extrabold text-indigo-700 group-hover:text-indigo-900">{copy.related.tryNow}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="bg-[#F8FAFF] px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-4xl">
            <SectionHeader title={copy.faq.title} />
            <div className="divide-y divide-indigo-100 rounded-[1.75rem] border border-indigo-100 bg-white px-6 shadow-sm shadow-indigo-100">
              {faqs.map((item, index) => (
                <details key={item.q} open={index === 0} className="group py-5">
                  <summary className="cursor-pointer list-none text-base font-extrabold text-slate-950">{item.q}</summary>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[radial-gradient(circle_at_12%_20%,rgba(139,92,246,0.22),transparent_34%),radial-gradient(circle_at_85%_12%,rgba(196,181,253,0.28),transparent_30%),linear-gradient(135deg,#F5F0FF,#FFFFFF_48%,#EEF2FF)] px-4 py-14 text-slate-950 md:px-6 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
            <div>
              <h2 className="max-w-3xl text-[36px] font-extrabold leading-tight tracking-tight">
                {copy.cta.title}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-700">
                {copy.cta.text}
              </p>
              <a
                href="#seedream-4-5-generator"
                className="mt-7 inline-flex rounded-full bg-indigo-700 px-7 py-3 text-sm font-extrabold text-white shadow-sm shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-800"
              >
                {copy.cta.button}
              </a>
            </div>
            <ImagePlaceholder slot="final-cta" label={copy.cta.label} />
          </div>
        </section>
      </main>
      <Footer initialTranslations={t} />
    </>
  )
}
