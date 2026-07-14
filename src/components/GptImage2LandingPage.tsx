import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import NanoBananaTool from '@/components/NanoBananaTool'
import PromptCopyButton from '@/components/PromptCopyButton'
import RedditMediaCarousel from '@/components/RedditMediaCarousel'
import { loadCommonTranslations } from '@/lib/seo-loader'
import { getGptImage2LandingCopy, getGptImage2PageMetadata } from '@/lib/gpt-image-2-landing-copy'

const pageUrl = 'https://toolaze.com/model/gpt-image-2'

const galleryExamples = [
  {
    slot: 'gallery-product-poster',
    title: 'Product Launch Poster',
    text: 'Create a clean product poster for a bottle, skincare item, coffee drink, snack package, or software feature with a readable headline and clear product hero.',
  },
  {
    slot: 'gallery-social-ad',
    title: 'Social Media Ad',
    text: 'Build a scroll-stopping social ad with bold short text, a clear product benefit, creator-friendly composition, and safe fictional people or objects.',
  },
  {
    slot: 'gallery-ui-mockup',
    title: 'UI Mockup Concept',
    text: 'Generate an app dashboard, analytics panel, onboarding page, or feature overview image with readable labels and structured navigation.',
  },
  {
    slot: 'gallery-ecommerce',
    title: 'E-Commerce Product Image',
    text: 'Use a product reference to create a cleaner marketplace image, seasonal background, lifestyle setup, or bundle visual.',
  },
  {
    slot: 'gallery-education',
    title: 'Educational Infographic',
    text: 'Create a classroom visual, science diagram, historical explainer, process chart, or study guide image with clear section labels.',
  },
  {
    slot: 'gallery-text-logo',
    title: 'Text Logo Concept',
    text: 'Explore early logo concepts, badge layouts, event titles, sticker designs, and packaging wordmarks with short readable text.',
  },
  {
    slot: 'gallery-reference-edit',
    title: 'Reference-Guided Edit',
    text: 'Upload a reference image and ask GPT Image 2 to preserve the main subject while changing background, lighting, styling, or layout.',
  },
  {
    slot: 'gallery-high-resolution',
    title: 'High-Resolution Campaign Visual',
    text: 'Create a polished campaign image for posters, banners, product launches, and large-format creative drafts when 4K output is needed.',
  },
]

const audiences = [
  'Marketing teams: Create product posters, paid social concepts, campaign variants, launch visuals, and thumbnail ideas for fast creative testing.',
  'Designers: Explore moodboards, UI screens, layout systems, typography directions, and visual concepts before moving into production tools.',
  'E-commerce sellers: Create product image variations, seasonal backgrounds, listing visuals, bundle images, and promotional banners for online stores.',
  'Content creators: Make thumbnails, educational graphics, social media posts, creator economy visuals, and branded images with clearer text direction.',
  'Product managers: Mock up feature screens, internal planning boards, app concepts, and product storytelling visuals for early validation.',
  'Educators: Create diagrams, lesson visuals, concept maps, classroom explainers, and simple infographics for teaching materials.',
]

const comparisonRows = [
  {
    capability: 'Best for',
    gpt: 'Text-rich commercial visuals, image editing, UI mockups, structured layouts',
    nano: 'Fast image generation, reference edits, Gemini-style creative workflows',
    midjourney: 'Stylized art direction, cinematic visuals, aesthetic exploration',
    flux: 'Photoreal images, open workflows, multi-reference control',
  },
  {
    capability: 'Text rendering',
    gpt: 'Strong for short readable text, labels, posters, and UI-style visuals',
    nano: 'Strong in newer Gemini image workflows and text-heavy designs',
    midjourney: 'Improved but still needs careful review',
    flux: 'Strong in typography and layout-focused use cases',
  },
  {
    capability: 'Image editing',
    gpt: 'Useful for natural-language edits and reference-guided changes',
    nano: 'Useful for fast iteration and image-to-image variations',
    midjourney: 'Editor workflows are available but less direct for some users',
    flux: 'Strong for text-prompted editing and reference control',
  },
  {
    capability: 'Layout control',
    gpt: 'Strong for dashboards, posters, infographics, and multi-panel concepts',
    nano: 'Good for structured generation and commercial concepts',
    midjourney: 'Better for visual style than strict layout',
    flux: 'Strong for production-style visuals and controlled compositions',
  },
  {
    capability: '4K output',
    gpt: 'Supports high-resolution workflows, including 4K when settings support it',
    nano: 'Strong high-resolution positioning in current image workflows',
    midjourney: 'High-quality output with strong detail and texture',
    flux: 'Strong detail and photoreal output across supported workflows',
  },
  {
    capability: 'Limitations',
    gpt: 'Review spelling, small text, faces, hands, brand claims, and compliance',
    nano: 'Review model availability, style fit, and reference consistency',
    midjourney: 'Less ideal when exact text and strict layout are the priority',
    flux: 'Workflow and access can vary by platform and model version',
  },
]

const promptExamples = [
  {
    id: 'multilingual-text',
    slot: 'prompt-multilingual-text',
    title: 'Multilingual Text Layout Prompt',
    prompt:
      'Create a premium multilingual editorial poster titled "GLOBAL TYPE". Include readable text blocks in English, Spanish, French, Japanese, and Arabic, with a clean grid, bold headline typography, strong color contrast, and enough spacing for each language. Keep all text short and review-ready.',
  },
  {
    id: 'print-layout',
    slot: 'prompt-print-layout',
    title: 'Print Layout Prompt',
    prompt:
      'Create a print-ready Art Deco bookmark concept for a fictional bookstore named "Tangerine Books". Show the bookmark on a clean proof sheet with visible bleed, trim, and safe margin guide lines. Include the exact words "TANGERINE BOOKS" and "READ WELL" with crisp lettering.',
  },
  {
    id: 'character-sheet',
    slot: 'prompt-character-sheet',
    title: 'Character Reference Sheet Prompt',
    prompt:
      'Create a coherent character reference sheet for an original adventure game heroine named "Adele". Show front view, side view, back view, three facial expressions, outfit details, a color palette, and one prop close-up. Keep the character identity consistent across every panel.',
  },
  {
    id: 'storyboard',
    slot: 'prompt-storyboard',
    title: 'Sequential Storyboard Prompt',
    prompt:
      'Create a six-panel storyboard titled "RAIN RUN". Show the same courier riding through a rainy neon city while delivering one glowing package. Keep the character, package, weather, and visual style consistent from Panel 1 through Panel 6.',
  },
  {
    id: 'reference-edit',
    slot: 'prompt-reference-edit',
    title: 'Reference-Guided Interior Edit Prompt',
    prompt:
      'Use the uploaded living room photo as the reference. Preserve the window placement, wall structure, sofa position, floor, and camera angle. Change only the interior style into a warm Japandi look with wood textures, soft daylight, neutral fabric, and sage green accents.',
  },
  {
    id: 'travel-brochure',
    slot: 'prompt-travel-brochure',
    title: 'Editorial Brochure Prompt',
    prompt:
      'Create a premium travel brochure spread for a fictional mountain retreat called "Mist Ridge Lodge". Include the headings "Weekend Retreat", "Rooms", "Dining", and "Trails". Use elegant editorial photography, readable type, calm luxury colors, and a polished hospitality layout.',
  },
]

const redditImage = (id: string, extension = 'png') =>
  `https://images.weserv.nl/?url=i.redd.it/${id}.${extension}&w=640&output=webp`

const xImage = (url: string) => `https://images.weserv.nl/?url=${encodeURIComponent(url)}&output=webp&w=640`

const redditDiscussions = [
  {
    id: 'chatgpt-image-2-consistency-sequence',
    title: 'Image 2.0 consistency sequence',
    href: 'https://www.reddit.com/r/ChatGPT/comments/1statrb/image_20_is_actually_insane_this_is_not_a_small/',
    source: 'r/ChatGPT',
    text: 'A multi-image Reddit thread testing whether Image 2.0 can keep the same subject consistent across different angles and action shots.',
    media: [
      {
        alt: 'Character consistency Reddit media from a GPT Image 2 discussion',
        image:
          'https://preview.redd.it/image-2-0-is-actually-insane-this-is-not-a-small-upgrade-v0-0ecwp1jpwvwg1.png?auto=webp&crop=smart&s=45d6a24dfe7ef2e38fbd07fe94d84c49e97cafb3&width=640',
        displayImage: redditImage('0ecwp1jpwvwg1'),
      },
      {
        alt: 'Side-angle consistency Reddit media from a GPT Image 2 discussion',
        image:
          'https://preview.redd.it/image-2-0-is-actually-insane-this-is-not-a-small-upgrade-v0-1bvnw3jpwvwg1.png?auto=webp&crop=smart&s=aa708b3f87b8546ad89cba4db5a95bbb7338c008&width=640',
        displayImage: redditImage('1bvnw3jpwvwg1'),
      },
      {
        alt: 'Cinematic action Reddit media from a GPT Image 2 discussion',
        image:
          'https://preview.redd.it/image-2-0-is-actually-insane-this-is-not-a-small-upgrade-v0-4x8k23jpwvwg1.png?auto=webp&crop=smart&s=8db26d6a4fdfa49c7e5bcf6e981a1717858a9c29&width=640',
        displayImage: redditImage('4x8k23jpwvwg1'),
      },
    ],
  },
  {
    id: 'defendingaiart-tested-gpt-images-2',
    title: 'Prompt stress-test examples',
    href: 'https://www.reddit.com/r/DefendingAIArt/comments/1stqpgu/i_tested_gpt_images_2_on_some_tasks/',
    source: 'r/DefendingAIArt',
    text: 'A different Reddit post with several output tests, useful for comparing detail, composition, and prompt-following behavior across tasks.',
    media: [
      {
        alt: 'GPT Images 2 task test preview from Reddit',
        image:
          'https://preview.redd.it/i-tested-gpt-images-2-on-some-tasks-v0-85mp9vuadzwg1.png?auto=webp&crop=smart&s=5f51e64bf003fe543c688b18cdd97fdb5b59de23&width=640',
        displayImage: redditImage('85mp9vuadzwg1'),
      },
      {
        alt: 'Second GPT Images 2 task test preview from Reddit',
        image:
          'https://preview.redd.it/i-tested-gpt-images-2-on-some-tasks-v0-1lfm5ctddzwg1.png?auto=webp&crop=smart&s=5042d32ab3767e328795ab0cce7c857ab99520c6&width=640',
        displayImage: redditImage('1lfm5ctddzwg1'),
      },
      {
        alt: 'Third GPT Images 2 task test preview from Reddit',
        image:
          'https://preview.redd.it/i-tested-gpt-images-2-on-some-tasks-v0-d1mb7ozmdzwg1.jpg?auto=webp&crop=smart&s=7852a38bec55122a689899e2b9aedb841412cd0f&width=640',
        displayImage: redditImage('d1mb7ozmdzwg1', 'jpg'),
      },
      {
        alt: 'Fourth GPT Images 2 task test preview from Reddit',
        image:
          'https://preview.redd.it/i-tested-gpt-images-2-on-some-tasks-v0-5b0qlz6zdzwg1.png?auto=webp&crop=smart&s=0fc66e80f837714d42f42e3ad54c02f5b1517672&width=640',
        displayImage: redditImage('5b0qlz6zdzwg1'),
      },
      {
        alt: 'Fifth GPT Images 2 task test preview from Reddit',
        image:
          'https://preview.redd.it/i-tested-gpt-images-2-on-some-tasks-v0-0yhi27a0ezwg1.png?auto=webp&crop=smart&s=17cfbc59af235a5478b989d3d2262aca9b2e4006&width=640',
        displayImage: redditImage('0yhi27a0ezwg1'),
      },
    ],
  },
  {
    id: 'aigamedev-sprite-sheet-test',
    title: 'Game sprite workflow test',
    href: 'https://www.reddit.com/r/aigamedev/comments/1ss9bjz/wow_just_tested_gpt_image_2_it_is_impressive/',
    source: 'r/aigamedev',
    text: 'A game-dev discussion showing sprite-sheet output and animation-style media, relevant for consistency and asset-production use cases.',
    media: [
      {
        alt: 'Sprite sheet media from a GPT Image 2 Reddit game-dev post',
        image:
          'https://preview.redd.it/wow-just-tested-gpt-image-2-it-is-impressive-v0-5y10xctkqnwg1.png?auto=webp&crop=smart&s=3d941201da80743d89e9fe7c19eb45a4741f1822&width=640',
        displayImage: redditImage('5y10xctkqnwg1'),
      },
      {
        alt: 'Sprite animation media from a GPT Image 2 Reddit game-dev post',
        image:
          'https://preview.redd.it/wow-just-tested-gpt-image-2-it-is-impressive-v0-3q965oclqnwg1.gif?auto=webp&s=7611e106315b28e9cbdbbe6a691ef62ded922a10&width=256',
        displayImage: redditImage('3q965oclqnwg1', 'gif'),
        type: 'video' as const,
      },
    ],
  },
  {
    id: 'defendingaiart-messing-with-gptimage2',
    title: 'Casual output experimentation',
    href: 'https://www.reddit.com/r/DefendingAIArt/comments/1ssaj92/anyone_else_messing_with_gptimage2_seems_pretty/',
    source: 'r/DefendingAIArt',
    text: 'A separate community post with practical image examples and comments around how GPT-Image-2 feels in everyday experimentation.',
    media: [
      {
        alt: 'Casual GPT Image 2 experiment preview from Reddit',
        image:
          'https://preview.redd.it/anyone-else-messing-with-gpt-image-2-seems-pretty-nice-v0-61n8loaw0owg1.png?auto=webp&crop=smart&s=ab93349c0411da4a7f45e639a6c5890730c710ef&width=640',
        displayImage: redditImage('61n8loaw0owg1'),
      },
    ],
  },
  {
    id: 'chatgpt-artifact-critique',
    title: 'Artifact critique discussion',
    href: 'https://www.reddit.com/r/ChatGPT/comments/1t7tewy/gpt_image_2_keeps_adding_this_weird_artifact_to/',
    source: 'r/ChatGPT',
    text: 'A Reddit critique thread focused on visible artifacts, useful for balancing the page with real failure-mode discussion instead of only praise.',
    media: [
      {
        alt: 'GPT Image 2 artifact critique preview from Reddit',
        image:
          'https://preview.redd.it/gpt-image-2-keeps-adding-this-weird-artifact-to-faces-that-v0-7060q6svjbxg1.png?auto=webp&crop=smart&s=217df5d0a81dd26a554c5a29bf4033b073f3abb6&width=640',
        displayImage: redditImage('7060q6svjbxg1'),
      },
      {
        alt: 'Second GPT Image 2 artifact critique preview from Reddit',
        image:
          'https://preview.redd.it/gpt-image-2-keeps-adding-this-weird-artifact-to-faces-that-v0-bah2o57zjbxg1.png?auto=webp&crop=smart&s=20f0367c6246260e8a03f5e1d85c573d18d04e44&width=640',
        displayImage: redditImage('bah2o57zjbxg1'),
      },
    ],
  },
  {
    id: 'singularity-self-review-iteration',
    title: 'Self-review iteration claim',
    href: 'https://www.reddit.com/r/singularity/comments/1srehi7/gptimage2_now_reviews_its_own_output_and_iterates/',
    source: 'r/singularity',
    text: 'A post about GPT-Image-2 reviewing and iterating on its own output, useful context for quality-control and refinement claims.',
    media: [
      {
        alt: 'GPT Image 2 self-review Reddit media',
        image:
          'https://preview.redd.it/gpt-image-2-now-reviews-its-own-output-and-iterates-until-v0-l1gy51g5bhwg1.png?auto=webp&crop=smart&s=cc5211f78141d9458bb254b68311a73d14ec80af&width=640',
        displayImage: redditImage('l1gy51g5bhwg1'),
      },
    ],
  },
  {
    id: 'singularity-quality-jump',
    title: 'Quality jump discussion',
    href: 'https://www.reddit.com/r/singularity/comments/1sry7k9/gpt_image_2_has_the_biggest_jump_in_quality_ever/',
    source: 'r/singularity',
    text: 'A separate discussion centered on perceived quality gains, useful as community context rather than official model documentation.',
    media: [
      {
        alt: 'GPT Image 2 quality jump Reddit media',
        image:
          'https://preview.redd.it/gpt-image-2-has-the-biggest-jump-in-quality-ever-recorded-v0-gq2zlv0rilwg1.png?auto=webp&crop=smart&s=c2e2819a514786f145757198986bbcc6b1ba38df&width=640',
        displayImage: redditImage('gq2zlv0rilwg1'),
      },
    ],
  },
  {
    id: 'chatgpt-really-good-multi-example',
    title: 'Multi-example quality thread',
    href: 'https://www.reddit.com/r/ChatGPT/comments/1srveq3/gpt_image_2_is_really_good/',
    source: 'r/ChatGPT',
    text: 'A multi-image thread that gives another set of public examples, helping the section avoid depending on one viral post.',
    media: [
      {
        alt: 'First media from a GPT Image 2 quality Reddit thread',
        image:
          'https://preview.redd.it/gpt-image-2-is-really-good-v0-p6zo1vqqxlwg1.png?auto=webp&crop=smart&s=68b4a5fdf1da9299dc625d98e4882c778fcff085&width=640',
        displayImage: redditImage('p6zo1vqqxlwg1'),
      },
      {
        alt: 'Second media from a GPT Image 2 quality Reddit thread',
        image:
          'https://preview.redd.it/gpt-image-2-is-really-good-v0-qs41alpqxlwg1.png?auto=webp&crop=smart&s=60c665ed299167ab729a1c3404a64ffcd17b68fb&width=640',
        displayImage: redditImage('qs41alpqxlwg1'),
      },
      {
        alt: 'Third media from a GPT Image 2 quality Reddit thread',
        image:
          'https://preview.redd.it/gpt-image-2-is-really-good-v0-nltpw5qqxlwg1.png?auto=webp&crop=smart&s=e0b425c05148c1b8cb8d07a1a76c457fb7e22f7d&width=640',
        displayImage: redditImage('nltpw5qqxlwg1'),
      },
      {
        alt: 'Fourth media from a GPT Image 2 quality Reddit thread',
        image:
          'https://preview.redd.it/gpt-image-2-is-really-good-v0-5rfgtkpqxlwg1.png?auto=webp&crop=smart&s=1663e6fc4d86ba6511a21bf04272db78f5d6e3da&width=640',
        displayImage: redditImage('5rfgtkpqxlwg1'),
      },
      {
        alt: 'Fifth media from a GPT Image 2 quality Reddit thread',
        image:
          'https://preview.redd.it/gpt-image-2-is-really-good-v0-jkoialpqxlwg1.png?auto=webp&crop=smart&s=8a9e2c836c2b0198d92b21688f159e7308d7869f&width=640',
        displayImage: redditImage('jkoialpqxlwg1'),
      },
    ],
  },
  {
    id: 'chatgpt-image-2-wow',
    title: 'Image 2.0 wow examples',
    href: 'https://www.reddit.com/r/ChatGPT/comments/1ss26jj/gpt_image_20_is_wow/',
    source: 'r/ChatGPT',
    text: 'Another independent Reddit post with multiple examples, useful for judging style range and public reaction beyond a single thread.',
    media: [
      {
        alt: 'First GPT Image 2 wow example from Reddit',
        image:
          'https://preview.redd.it/gpt-image-2-0-is-wow-v0-wiod6ln38mwg1.png?auto=webp&crop=smart&s=bc919e325c711f17a9792b7d36b2fe5c8844e7b6&width=640',
        displayImage: redditImage('wiod6ln38mwg1'),
      },
      {
        alt: 'Second GPT Image 2 wow example from Reddit',
        image:
          'https://preview.redd.it/gpt-image-2-0-is-wow-v0-62dk9wz38mwg1.png?auto=webp&crop=smart&s=8567286cc925ee5b4b4afe9d1efe5d964594c82c&width=640',
        displayImage: redditImage('62dk9wz38mwg1'),
      },
      {
        alt: 'Third GPT Image 2 wow example from Reddit',
        image:
          'https://preview.redd.it/gpt-image-2-0-is-wow-v0-bzxdjta68mwg1.png?auto=webp&crop=smart&s=18556edba411ae803bfbcd0d7a9f6ca7c7f06a15&width=640',
        displayImage: redditImage('bzxdjta68mwg1'),
      },
      {
        alt: 'Fourth GPT Image 2 wow example from Reddit',
        image:
          'https://preview.redd.it/gpt-image-2-0-is-wow-v0-sq57cqu68mwg1.png?auto=webp&crop=smart&s=0f4d7f8a7b0f57b1a4c118c99d32c22f013c7419&width=640',
        displayImage: redditImage('sq57cqu68mwg1'),
      },
    ],
  },
  {
    id: 'imagine-aiart-model-comparison',
    title: 'GPT Image 2 vs Nano Banana 2',
    href: 'https://www.reddit.com/r/ImagineAiArt/comments/1u2bt9m/gpt_image_2_vs_nano_banana_2_who_wins_real/',
    source: 'r/ImagineAiArt',
    text: 'A model-comparison post with several side-by-side images, relevant for searchers comparing GPT Image 2 with other image models.',
    media: [
      {
        alt: 'Photoreal portrait side-by-side comparison media from Reddit',
        image:
          'https://preview.redd.it/gpt-image-2-vs-nano-banana-2-who-wins-real-side-by-sides-v0-0gaeudom7i6h1.png?auto=webp&crop=smart&s=df24be47998a14b71ffcd19e2eb021ffe91a6001&width=640',
        displayImage: redditImage('0gaeudom7i6h1'),
      },
      {
        alt: 'Lifestyle realism side-by-side comparison media from Reddit',
        image:
          'https://preview.redd.it/gpt-image-2-vs-nano-banana-2-who-wins-real-side-by-sides-v0-2jffueom7i6h1.png?auto=webp&crop=smart&s=f0bfc8acaee8e9581ab49d9e51082c5966f83616&width=640',
        displayImage: redditImage('2jffueom7i6h1'),
      },
      {
        alt: 'Multilingual layout side-by-side comparison media from Reddit',
        image:
          'https://preview.redd.it/gpt-image-2-vs-nano-banana-2-who-wins-real-side-by-sides-v0-oxi3e3rj7i6h1.png?auto=webp&crop=smart&s=025ed78d4666fb070242f6bcb73028bbc7348ab2&width=640',
        displayImage: redditImage('oxi3e3rj7i6h1'),
      },
    ],
  },
]

const xCommunityExamples = [
  {
    title: 'Complete UI design system board',
    name: 'Nicolechan',
    handle: '@stark_nico99',
    avatar: '/model-assets/gpt-image-2/x-avatar-stark-nico99.webp',
    href: 'https://x.com/stark_nico99/status/2045836554451706125',
    image: 'https://pbs.twimg.com/media/HGRFgOPaYAAkrdn.jpg?format=jpg&name=orig',
    displayImage: xImage('https://pbs.twimg.com/media/HGRFgOPaYAAkrdn.jpg?format=jpg&name=orig'),
    body:
      'Public GPT Image 2 example testing a complete UI design system board with structured labels, component cards, and interface layout control.',
    time: '8:38 PM',
    likes: '2.8K',
    replies: '142',
  },
  {
    title: 'Official character sheet reconstruction',
    name: 'Kus',
    handle: '@tamayo888',
    avatar: '/model-assets/gpt-image-2/x-avatar-tamayo888.webp',
    href: 'https://x.com/tamayo888/status/2044814686701678977',
    image: 'https://pbs.twimg.com/media/HGCikX6a8AMRKSz.jpg?format=jpg&name=orig',
    displayImage: xImage('https://pbs.twimg.com/media/HGCikX6a8AMRKSz.jpg?format=jpg&name=orig'),
    body:
      'A useful X reference for character consistency, pose breakdowns, costume details, and reference-sheet style composition.',
    time: '11:16 AM',
    likes: '5.1K',
    replies: '238',
  },
  {
    title: 'Dense Chinese text layout test',
    name: 'Larus Canus',
    handle: '@MrLarus',
    avatar: '/model-assets/gpt-image-2/x-avatar-mrlarus.webp',
    href: 'https://x.com/mrlarus/status/2044824800909054181',
    image: 'https://pbs.twimg.com/media/HGCnWfOXwAAVCRn.jpg?format=jpg&name=orig',
    displayImage: xImage('https://pbs.twimg.com/media/HGCnWfOXwAAVCRn.jpg?format=jpg&name=orig'),
    body:
      'A dense non-English text layout test that is helpful for reviewing typography handling, spacing, hierarchy, and readable copy inside generated images.',
    time: '11:56 AM',
    likes: '1.9K',
    replies: '96',
  },
  {
    title: 'Mathematical concept visualization',
    name: '宝玉',
    handle: '@dotey',
    avatar: '/model-assets/gpt-image-2/x-avatar-dotey.webp',
    href: 'https://x.com/dotey/status/2048258873119674779',
    image: 'https://pbs.twimg.com/media/HGzgf5LbMAAy64Q.jpg?format=jpg&name=orig',
    displayImage: xImage('https://pbs.twimg.com/media/HGzgf5LbMAAy64Q.jpg?format=jpg&name=orig'),
    body:
      'A public educational visual example focused on concept explanation, clean diagram structure, and infographic-style reasoning.',
    time: '7:44 PM',
    likes: '3.4K',
    replies: '117',
  },
  {
    title: 'Multi-page brand kit',
    name: 'Justin Farrugia',
    handle: '@justinmfarrugia',
    avatar: '/model-assets/gpt-image-2/x-avatar-justinmfarrugia.webp',
    href: 'https://x.com/justinmfarrugia/status/2047695083160347015',
    image: 'https://pbs.twimg.com/media/HGra2vBWkAALy7x.jpg?format=jpg&name=orig',
    displayImage: xImage('https://pbs.twimg.com/media/HGra2vBWkAALy7x.jpg?format=jpg&name=orig'),
    body:
      'A commercial brand-kit style example for page consistency, identity presentation, layout systems, and campaign-ready visual direction.',
    time: '6:09 PM',
    likes: '4.6K',
    replies: '204',
  },
  {
    title: 'Interior design mood board',
    name: '知识猫图解',
    handle: '@GeekCatX',
    avatar: '/model-assets/gpt-image-2/x-avatar-geekcatx.webp',
    href: 'https://x.com/geekcatx/status/2052949583563784620',
    image: 'https://pbs.twimg.com/media/HH2Kv_9bIAA26Qi.jpg?format=jpg&name=orig',
    displayImage: xImage('https://pbs.twimg.com/media/HH2Kv_9bIAA26Qi.jpg?format=jpg&name=orig'),
    body:
      'A creator example for interior mood boards, material palettes, room concepts, and reference-guided visual planning.',
    time: '9:22 PM',
    likes: '1.3K',
    replies: '61',
  },
  {
    title: 'Stylized character poster',
    name: 'Kashiko',
    handle: '@Kashiko_AIart',
    avatar: 'https://unavatar.io/x/Kashiko_AIart',
    href: 'https://x.com/Kashiko_AIart/status/2044720225954967953',
    image: 'https://pbs.twimg.com/media/HGAcj_HbUAAFiuo.jpg?format=jpg&name=orig',
    displayImage: xImage('https://pbs.twimg.com/media/HGAcj_HbUAAFiuo.jpg?format=jpg&name=orig'),
    body:
      'A public image example focused on polished character presentation, strong art direction, and production-ready poster composition.',
    time: '5:02 PM',
    likes: '1.8K',
    replies: '84',
  },
  {
    title: 'Creator prompt collection',
    name: 'crayon',
    handle: '@crayon1267',
    avatar: 'https://unavatar.io/x/crayon1267',
    href: 'https://x.com/crayon1267/status/2044982485302620273',
    image: 'https://pbs.twimg.com/media/HGEsgJoaUAAygB-.jpg?format=jpg&name=orig',
    displayImage: xImage('https://pbs.twimg.com/media/HGEsgJoaUAAygB-.jpg?format=jpg&name=orig'),
    body:
      'A creator image test that is useful for studying promptable composition, visual hierarchy, and finished social-ready output.',
    time: '10:24 AM',
    likes: '2.1K',
    replies: '103',
  },
  {
    title: 'Studio product prompt',
    name: 'Min Choi',
    handle: '@minchoi',
    avatar: 'https://unavatar.io/x/minchoi',
    href: 'https://x.com/minchoi/status/2049968441601294564',
    image: 'https://pbs.twimg.com/media/HG7G5eObwAAamAB.jpg?format=jpg&name=orig',
    displayImage: xImage('https://pbs.twimg.com/media/HG7G5eObwAAamAB.jpg?format=jpg&name=orig'),
    body:
      'A public still-image example for product-style composition, lighting control, and prompt-driven commercial presentation.',
    time: '4:41 PM',
    likes: '3.2K',
    replies: '128',
  },
  {
    title: 'Cinematic illustration test',
    name: 'lakeside',
    handle: '@lakeside529',
    avatar: 'https://unavatar.io/x/lakeside529',
    href: 'https://x.com/lakeside529/status/2044645377392193602',
    image: 'https://pbs.twimg.com/media/HGAKAT9bcAEk4Oy.jpg?format=jpg&name=orig',
    displayImage: xImage('https://pbs.twimg.com/media/HGAKAT9bcAEk4Oy.jpg?format=jpg&name=orig'),
    body:
      'A public X image example for checking cinematic style, lighting, subject detail, and image-model range in a still visual.',
    time: '11:12 PM',
    likes: '1.5K',
    replies: '72',
  },
]

const youtubeCommunityExamples = [
  {
    title: 'Introducing ChatGPT Images 2.0',
    creator: 'OpenAI',
    href: 'https://www.youtube.com/watch?v=sWkGomJ3TLI',
    videoId: 'sWkGomJ3TLI',
    text: 'An official launch-style video reference for understanding how OpenAI presents the new image workflow and model direction.',
  },
  {
    title: 'GPT Image 2 vs Nano Banana 2',
    creator: 'Creator guide',
    href: 'https://www.youtube.com/watch?v=Yp4nRScy45c',
    videoId: 'Yp4nRScy45c',
    text: 'A practical comparison video that helps users evaluate model choice, workflow differences, and real image results.',
  },
  {
    title: 'OpenAI Image 2: 10 ways to use it',
    creator: 'Creator test',
    href: 'https://www.youtube.com/watch?v=GY-kAiZGLOw',
    videoId: 'GY-kAiZGLOw',
    text: 'A use-case focused video that explores practical applications beyond a single gallery image.',
  },
]

const relatedLinks = [
  {
    title: 'GPT Image 2 Prompt Templates',
    href: '/prompts/models/gpt-image-2',
    text: 'Study source-backed prompt structures, then return to GPT Image 2 to create your own image.',
  },
  {
    title: 'Nano Banana Pro Generator',
    href: '/model/nano-banana-pro',
    text: 'Compare a Gemini image workflow for high-resolution design assets and text-heavy layouts.',
  },
  {
    title: 'Nano Banana 2 Generator',
    href: '/model/nano-banana-2',
    text: 'Explore another fast image generation and editing model for common publishing formats.',
  },
  {
    title: 'Nano Banana Image to Image',
    href: '/model/nano-banana',
    text: 'Use another image-to-image workflow when reference-guided editing is your main priority.',
  },
  {
    title: 'AI Models Hub',
    href: '/model',
    text: 'Browse Toolaze image and video model pages when you need broader model comparison.',
  },
]

const howToSteps = [
  'Open the GPT Image 2 page on Toolaze.',
  'Start with free no-signup access.',
  'Enter a clear prompt or upload a reference image when your task needs image-to-image editing.',
  'Generate, review spelling and visual details, then refine the prompt or reference images.',
]

const faqs = [
  {
    q: 'What is GPT Image 2?',
    a: "GPT Image 2 is OpenAI's image generation and editing model for creating images from text prompts and reference images. It is useful for product posters, social media ads, UI mockups, image editing, text-rich visuals, and structured commercial design concepts.",
  },
  {
    q: 'Is GPT Image 2 free on Toolaze?',
    a: 'Yes. Toolaze lets you try GPT Image 2 for free online. Free usage may depend on daily quota, model availability, output settings, or future access policy, but the page is designed for fast browser-based image generation.',
  },
  {
    q: 'Can I use GPT Image 2 without signup?',
    a: 'Yes. Toolaze lets you try GPT Image 2 without signup or login. Some advanced settings, higher limits, downloads, or continued usage may require signing in, depending on the current Toolaze access policy.',
  },
  {
    q: 'Does GPT Image 2 support 4K output?',
    a: 'Yes. GPT Image 2 supports high-resolution image workflows, including 4K output when the selected mode, ratio, and settings support it. Use 4K for product posters, campaign visuals, UI mockups, and presentation-ready creative drafts.',
  },
  {
    q: 'What can I create with GPT Image 2?',
    a: 'You can create product posters, social media ads, UI mockups, e-commerce images, educational infographics, text logo concepts, edited images, campaign visuals, thumbnails, and reference-guided creative variations.',
  },
  {
    q: 'Can GPT Image 2 edit images?',
    a: 'Yes. GPT Image 2 supports image editing from text and image inputs. Use it for product image cleanup, background changes, lighting refinement, layout changes, visual variations, before-after concepts, and reference-guided creative updates.',
  },
  {
    q: 'Is GPT Image 2 better than Nano Banana, Midjourney, or Flux?',
    a: 'It depends on the task. GPT Image 2 is a strong choice for text-rich images, structured layouts, image editing, and commercial visuals. Midjourney is often stronger for stylized art direction, while Flux and Nano Banana can be useful for different reference and workflow needs.',
  },
  {
    q: 'What prompts work best with GPT Image 2?',
    a: 'The best prompts describe the asset type, subject, exact text, composition, style, lighting, background, output purpose, and constraints. For edits, specify what should stay unchanged and what should be modified.',
  },
]

const imageAssets: Record<string, string> = {
  'feature-text-rendering': '/model-assets/gpt-image-2/feature-text-rendering-v2.webp',
  'feature-4k-output': '/model-assets/gpt-image-2/feature-4k-output-v2.webp',
  'feature-image-editing': '/model-assets/gpt-image-2/feature-image-editing.webp',
  'feature-ui-layouts': '/model-assets/gpt-image-2/feature-ui-layouts.webp',
  'feature-commercial-output': '/model-assets/gpt-image-2/feature-commercial-output.webp',
  'feature-prompt-following': '/model-assets/gpt-image-2/feature-prompt-following.webp',
  'gallery-product-poster': '/model-assets/gpt-image-2/prompt-product-poster.webp',
  'gallery-social-ad': '/model-assets/gpt-image-2/gallery-social-ad.webp',
  'gallery-ui-mockup': '/model-assets/gpt-image-2/feature-ui-layouts.webp',
  'gallery-ecommerce': '/model-assets/gpt-image-2/prompt-ecommerce-product.webp',
  'gallery-education': '/model-assets/gpt-image-2/gallery-education.webp',
  'gallery-text-logo': '/model-assets/gpt-image-2/gallery-text-logo.webp',
  'gallery-reference-edit': '/model-assets/gpt-image-2/feature-image-editing.webp',
  'gallery-high-resolution': '/model-assets/gpt-image-2/feature-4k-output-v2.webp',
  'prompt-multilingual-text': '/model-assets/gpt-image-2/prompt-multilingual-text.webp',
  'prompt-print-layout': '/model-assets/gpt-image-2/prompt-print-layout.webp',
  'prompt-character-sheet': '/model-assets/gpt-image-2/prompt-character-sheet.webp',
  'prompt-storyboard': '/model-assets/gpt-image-2/prompt-storyboard.webp',
  'prompt-reference-edit': '/model-assets/gpt-image-2/prompt-reference-edit.webp',
  'prompt-travel-brochure': '/model-assets/gpt-image-2/prompt-travel-brochure.webp',
  'final-cta': '/model-assets/gpt-image-2/final-cta.webp',
}

function SectionHeader({
  title,
  text,
  inverse = false,
}: {
  title: string
  text?: string
  inverse?: boolean
}) {
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
      <span className="text-2xl font-black tracking-tight">reddit</span>
    </span>
  )
}

function ImagePlaceholder({
  slot,
  label,
  containerLabel = 'Image container',
  compact = false,
}: {
  slot: string
  label: string
  containerLabel?: string
  compact?: boolean
}) {
  const imageSrc = imageAssets[slot]

  if (imageSrc) {
    return (
      <figure
        data-image-slot={slot}
        className={`overflow-hidden rounded-[1.5rem] border border-indigo-100 bg-white shadow-sm shadow-indigo-100 ${compact ? 'min-h-[220px]' : 'min-h-[320px]'}`}
      >
        <img
          src={imageSrc}
          alt={label}
          loading="lazy"
          decoding="async"
          className="aspect-[16/10] h-full w-full object-cover"
        />
      </figure>
    )
  }

  return (
    <div
      slot={slot}
      data-image-slot={slot}
      aria-label={label}
      className={`flex ${compact ? 'min-h-[220px]' : 'min-h-[320px]'} items-center justify-center rounded-[1.5rem] border border-dashed border-indigo-300 bg-[linear-gradient(135deg,#EEF2FF,#FFFFFF_48%,#E0F2FE)] p-6 text-center shadow-inner shadow-indigo-100`}
    >
      <div>
        <p className="text-xs font-extrabold tracking-[0.08em] text-indigo-500">{containerLabel}</p>
        <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{label}</p>
        <p className="mt-2 text-xs text-slate-400">{slot}</p>
      </div>
    </div>
  )
}

export async function GptImage2LandingPage({ locale = 'en' }: { locale?: string } = {}) {
  const copy = getGptImage2LandingCopy(locale)
  const t = await loadCommonTranslations(locale)
  const galleryExamples = copy.gallery.examples
  const audiences = copy.audiences.items
  const comparisonRows = copy.comparison.rows
  const promptExamples = copy.prompts.examples
  const youtubeCommunityExamples = copy.youtube.examples
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
        description: copy.metadata.description,
        url: pageUrl,
        isPartOf: {
          '@type': 'WebSite',
          name: 'Toolaze',
          url: 'https://toolaze.com',
        },
      },
      {
        '@type': 'SoftwareApplication',
        name: copy.schema.appName,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        isAccessibleForFree: true,
        publisher: {
          '@type': 'Organization',
          name: 'Toolaze',
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'HowTo',
        name: copy.schema.howToName,
        step: howToSteps.map((step) => ({
          '@type': 'HowToStep',
          text: step,
        })),
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
        <section id="gpt-image-2-generator" className="bg-[#F8FAFF] pb-12 pl-0 pr-2 md:pl-0 md:pr-4 xl:pl-0 xl:pr-6 2xl:pl-0 2xl:pr-8">
          <div className="w-full max-w-full">
            <NanoBananaTool
              modelId="gpt-image-2"
              modelName="GPT Image 2"
              dailyLimitStorageKey="gpt_image_2_last_used_date"
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

            {copy.features.items.map((item, index) => {
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
              const imageBlock = <ImagePlaceholder slot={item.slot} label={item.label} containerLabel={copy.image.container} />

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

        <section id="examples" className="bg-[#F8FAFF] px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              title={copy.gallery.title}
              text={copy.gallery.text}
            />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {galleryExamples.map((item) => (
                <article key={item.slot} className="overflow-hidden rounded-[1.75rem] border border-indigo-100 bg-white shadow-sm shadow-indigo-100">
                  <ImagePlaceholder slot={item.slot} label={`${copy.hero.modelName} ${item.title}`} containerLabel={copy.image.container} compact />
                  <div className="p-6">
                    <h3 className="text-xl font-extrabold tracking-tight text-slate-950">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              title={copy.audiences.title}
              text={copy.audiences.text}
            />
            <div className="grid gap-4 md:grid-cols-2">
              {audiences.map((item) => (
                <p key={item} className="rounded-[1.25rem] border border-indigo-100 bg-[#F8FAFF] p-5 text-sm leading-7 text-slate-700">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section id="compare" className="bg-[#F8FAFF] px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              title={copy.comparison.title}
              text={copy.comparison.text}
            />
            <div className="overflow-x-auto rounded-[1.75rem] border border-indigo-100 bg-white shadow-sm shadow-indigo-100">
              <table className="min-w-[1120px] text-left text-sm">
                <thead className="bg-slate-950 text-white">
                  <tr>
                    <th className="w-[190px] px-5 py-4 font-extrabold">{copy.comparison.capabilityHeader}</th>
                    <th className="px-5 py-4 font-extrabold">GPT Image 2</th>
                    <th className="px-5 py-4 font-extrabold">Nano Banana</th>
                    <th className="px-5 py-4 font-extrabold">Midjourney</th>
                    <th className="px-5 py-4 font-extrabold">Flux</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.capability} className="border-t border-indigo-100">
                      <th className="bg-[#F8FAFF] px-5 py-4 align-top font-extrabold text-slate-950">{row.capability}</th>
                      <td className="px-5 py-4 align-top leading-7 text-slate-600">{row.gpt}</td>
                      <td className="px-5 py-4 align-top leading-7 text-slate-600">{row.nano}</td>
                      <td className="px-5 py-4 align-top leading-7 text-slate-600">{row.midjourney}</td>
                      <td className="px-5 py-4 align-top leading-7 text-slate-600">{row.flux}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-7 text-slate-600">
              {copy.comparison.note}
            </p>
          </div>
        </section>

        <section id="how-to" className="bg-white px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader title={copy.howTo.title} />
            <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {howToSteps.map((step, index) => (
                <li key={step} className="relative min-h-[180px] rounded-[1.5rem] border border-indigo-100 bg-[#F8FAFF] p-6 pt-14 shadow-sm shadow-indigo-100">
                  <span className="absolute right-5 top-4 text-5xl font-extrabold leading-none tracking-tight text-indigo-100">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="relative text-sm font-semibold leading-7 text-slate-700">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="prompts" className="bg-[#F8FAFF] px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              title={copy.prompts.title}
              text={copy.prompts.text}
            />
            <div className="space-y-6">
              {promptExamples.map((item) => (
                <article key={item.id} className="grid gap-6 rounded-[1.75rem] border border-indigo-100 bg-white p-5 shadow-sm shadow-indigo-100 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
                  <div className="p-1 md:p-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-2xl font-extrabold tracking-tight text-slate-950">{item.title}</h3>
                      <PromptCopyButton
                        prompt={item.prompt}
                        copyLabel={copy.prompts.copyButton}
                        copiedLabel={copy.prompts.copiedButton}
                      />
                    </div>
                    <p className="mt-4 rounded-[1.25rem] border border-indigo-100 bg-[#F8FAFF] p-5 text-sm leading-7 text-slate-700">
                      {item.prompt}
                    </p>
                  </div>
                  <ImagePlaceholder slot={item.slot} label={`${copy.hero.modelName} ${item.title}`} containerLabel={copy.image.container} compact />
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
              {youtubeCommunityExamples.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group overflow-hidden rounded-[1.5rem] border border-indigo-100 bg-[#F8FAFF] shadow-sm shadow-indigo-100 transition hover:-translate-y-1 hover:border-indigo-300"
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
                  <div className="p-6">
                    <p className="text-xs font-extrabold text-indigo-600">{item.creator}</p>
                    <h3 className="mt-3 text-xl font-extrabold tracking-tight text-slate-950">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                    <p className="mt-5 text-sm font-extrabold text-indigo-700 group-hover:text-indigo-900">{copy.youtube.watch}</p>
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
                    <p className="mt-3 flex-1 text-xs leading-6 text-slate-600">{item.text}</p>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 text-xs font-extrabold text-indigo-700 transition hover:text-indigo-900"
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
                  key={item.image}
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
                        <span className="rounded-full bg-sky-500 px-1.5 py-0.5 text-[10px] font-black leading-none text-white">
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

                  <p className="mt-5 text-[15px] font-semibold leading-7 text-slate-900">{item.body}</p>

                  <div className="relative mt-5 overflow-hidden rounded-[1.25rem] border border-slate-200 bg-slate-100">
                    <img
                      src={item.displayImage}
                      alt={`${item.title} ${item.handle}`}
                      loading="lazy"
                      decoding="async"
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

                  <div className="mt-5">
                    <span className="inline-flex w-full items-center justify-center rounded-full bg-sky-500 px-4 py-3 text-sm font-extrabold text-white transition group-hover:bg-sky-600">
                      {copy.x.read} {item.replies} {copy.x.replies}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              title={copy.related.title}
              text={copy.related.text}
            />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {relatedLinks.map((item) => (
                <Link key={item.href} href={item.href} className="group rounded-[1.5rem] border border-indigo-100 bg-[#F8FAFF] p-6 shadow-sm shadow-indigo-100 transition hover:-translate-y-1 hover:border-indigo-300">
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
                href="#gpt-image-2-generator"
                className="mt-7 inline-flex rounded-full bg-indigo-700 px-7 py-3 text-sm font-extrabold text-white shadow-sm shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-800"
              >
                {copy.cta.button}
              </a>
            </div>
            <ImagePlaceholder
              slot="final-cta"
              label={copy.cta.label}
              containerLabel={copy.image.container}
            />
          </div>
        </section>
      </main>
      <Footer initialTranslations={t} />
    </>
  )
}
