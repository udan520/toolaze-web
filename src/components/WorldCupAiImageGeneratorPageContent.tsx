import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import AiImageGenerationTool from '@/components/AiImageGenerationTool'
import WorldCupTemplateGallery, { type WorldCupTemplateItem } from '@/components/WorldCupTemplateGallery'
import { loadCommonTranslations } from '@/lib/seo-loader'
import { getWorldCupPageCopy } from '@/app/world-cup-ai-image-generator/copy'

const templateExamples: WorldCupTemplateItem[] = [
  {
    id: 'fan-poster',
    title: 'Match-day Fan Poster',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/d67aebd7cde5431abd3a7bb74a89bac1.webp',
    referenceImage: '/model-assets/world-cup-2026/references/male-reference.webp',
    width: 358,
    height: 357,
    prompt:
      'Create a cinematic football fan poster for a global summer football tournament in 2026. A young male fan stands in a packed stadium under bright floodlights, cheering with clenched fists, wearing a dark football jersey and a scarf. Confetti, flags, dramatic stadium lights, emotional victory energy, realistic sports photography mixed with poster design. Add large bold poster text: "SUMMER FOOTBALL TOUR 2026". Add small subtitle text: "FAN POSTER". High contrast, sharp facial detail, energetic crowd background, 4:5 poster composition, no official logos, no real federation marks, no copyrighted team badges.',
    use: 'Use this when you want a high-energy fan image for a social poster, creator thumbnail, or match-day profile visual.',
  },
  {
    id: 'fan-edit',
    title: 'Neon Fan Edit Poster',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/783fea34e35f4f888e5255a60c04270e.webp',
    referenceImage: '/model-assets/world-cup-2026/references/female-reference.webp',
    width: 358,
    height: 357,
    prompt:
      'Create a vibrant football fan edit poster for a 2026 summer football event. A joyful female fan stands in a neon-lit stadium at night, holding a colorful scarf above her head, face paint on her cheeks, surrounded by pink and blue stadium lights and cheering crowd energy. Add big readable text at the top: "SUMMER FOOTBALL TOUR 2026". Add small subtitle text: "FOOTBALL FAN EDIT". Modern social media sports design, cinematic lighting, saturated magenta and blue color grade, realistic face detail, 4:5 composition, no official logos, no real team badges, no watermark.',
    use: 'Use this for a colorful TikTok cover, Instagram story, fan edit thumbnail, or energetic football campaign visual.',
  },
  {
    id: 'sticker-pack',
    title: 'Football Fan Sticker Pack',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/ca0e08fb103044ca9adb4d2d2b18760e.webp',
    width: 342,
    height: 357,
    prompt:
      'Create a clean football fan sticker pack on a warm off-white background. Include separate sticker-style icons: a blue football jersey, a black-and-white soccer ball, a happy fan face with blue hat, a blue-and-white scarf, a whistle, a ticket labeled "2026 FAN KIT", a foam finger with number 1, a blue football boot, a small goal, and a gold star. Cute outlined sticker style, soft shadows, crisp vector-like edges, playful sports merchandise look, balanced grid layout, no official logos, no real team badges, no watermark.',
    use: 'Use this for thumbnails, fan kit graphics, merch ideas, creator packs, or article illustrations.',
  },
  {
    id: 'retro-travel-poster',
    title: 'Retro Football Travel Poster',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/8a58b45bd05a4f26a9dda7417a62988d.webp',
    width: 354,
    height: 357,
    prompt:
      'Create a vintage travel poster for a 2026 summer football tour across the USA, Mexico, and Canada. Use a warm retro screen-print style with textured paper, sunset sky, stadium lights, city skyline, desert cactus, maple leaves, mountains, bridges, and a soccer ball in the foreground. Main headline must read exactly: "SUMMER FOOTBALL TOUR 2026". Subtitle: "USA • MEXICO • CANADA". Nostalgic travel poster composition, orange teal cream palette, bold readable block lettering, no official logos, no real tournament marks, no watermark.',
    use: 'Use this for travel-style football posts, event posters, blog covers, and retro campaign concepts.',
  },
]

const expandedTemplateExamples: WorldCupTemplateItem[] = [
  {
    id: 'wc-001',
    title: 'Match Day Portrait',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/db6519460bc4499f8f30686c9c86d37a.webp',
    referenceImage: '/model-assets/world-cup-2026/references/female-reference.webp',
    width: 900,
    height: 1200,
    prompt:
      'Create a vertical match-day football fan poster for a 2026 summer tournament mood. Show one young supporter in a generic navy jersey holding a scarf inside a floodlit stadium. Use bold readable text: "MATCH DAY" and "2026". Cinematic sports lighting, confetti, blue and gold palette, social poster layout, no official logos, no team badges, no real player likeness.',
    use: 'Use this for a match-day announcement, profile visual, creator thumbnail, or story cover.',
  },
  {
    id: 'wc-002',
    title: 'Goal Reaction Cover',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/a9cbf924ac1d4350b7f4c23a2f8a73ca.webp',
    referenceImage: '/model-assets/world-cup-2026/references/female-reference.webp',
    width: 900,
    height: 1200,
    prompt:
      'Create a vertical social cover showing a football fan reacting to a goal under neon stadium lights. Use expressive face detail, magenta and blue color grading, motion energy, and large readable text: "GOAL REACTION" with small "2026". Keep the jersey generic and avoid official tournament marks, team badges, sponsor logos, and real player likeness.',
    use: 'Use this for reaction edits, Shorts covers, TikTok thumbnails, or fan highlight posts.',
  },
  {
    id: 'wc-003',
    title: 'We Won Celebration',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/7344ccda81cf44a6b19207563217f1ff.webp',
    referenceImage: '/model-assets/world-cup-2026/references/female-reference.webp',
    width: 900,
    height: 1200,
    prompt:
      'Create a bright football celebration poster with one smiling supporter holding a handmade sign that reads "WE WON" and "2026". Stadium crowd background, confetti, generic number 10 jersey, clean vertical composition, optimistic color mood, no official logos, no real team crests, no federation marks, no watermark.',
    use: 'Use this for victory posts, match recap graphics, fan page updates, or celebratory thumbnails.',
  },
  {
    id: 'wc-004',
    title: 'Missed Chance Meme',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/48f662d750c149bf86e43cab177ea14e.webp',
    referenceImage: '/model-assets/world-cup-2026/references/female-reference.webp',
    width: 900,
    height: 1200,
    prompt:
      'Create a football reaction meme poster in a watch-party crowd. The main fan looks shocked with hands on their face while holding popcorn. Add bold readable meme text: "NO WAY" at the top and "THAT MISSED" at the bottom. Realistic indoor sports bar lighting, generic fan clothing, no official logos, no real team badges, no broadcast graphics.',
    use: 'Use this for meme-style posts, missed-chance reactions, comments, and creator community graphics.',
  },
  {
    id: 'wc-005',
    title: 'Fan Cam Moment',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/d5f3e94971ac41dd8629e3e5a1867469.webp',
    referenceImage: '/model-assets/world-cup-2026/references/female-reference.webp',
    width: 900,
    height: 1200,
    prompt:
      'Create a vertical fan-cam style football poster. Show a smiling supporter in a generic blue jersey on a stadium screen, with a cheering crowd below and dramatic floodlights. Add readable text: "FAN CAM" and "2026". Broadcast-inspired composition, energetic but brand-safe, no official logos, no team crests, no real players.',
    use: 'Use this for fan-cam edits, stadium-day stories, creator posts, or event recap visuals.',
  },
  {
    id: 'wc-006',
    title: 'Fan Zone Selfie',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/699001c5d5134451a47a728379808bc7.webp',
    referenceImage: '/model-assets/world-cup-2026/references/female-reference.webp',
    width: 900,
    height: 1200,
    prompt:
      'Create a vertical football fan-zone selfie poster. One supporter in a generic jersey stands under colorful lights with subtle face paint and crowd energy behind them. Add a small readable label: "FAN ZONE 2026". Realistic phone-photo mood, crisp face detail, no official tournament marks, no team badges, no sponsor logos.',
    use: 'Use this for fan-zone posts, personal match-day stories, travel recaps, or creator thumbnails.',
  },
  {
    id: 'wc-007',
    title: 'Watch Party Flyer',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/6c314678235c4471b30198358e437718.webp',
    referenceImage: '/model-assets/world-cup-2026/references/female-reference.webp',
    width: 900,
    height: 1200,
    prompt:
      'Create a brand-safe football watch-party flyer for summer 2026. Scene: friends watching a match at night, warm lights, snacks, drinks, and a large screen in the background. Add readable headline text: "WATCH PARTY" and small "2026". Leave tidy room for event details. Generic jerseys only, no official logos, no real team badges.',
    use: 'Use this for local bar promos, creator meetups, watch-party invites, and small business posts.',
  },
  {
    id: 'wc-008',
    title: '2026 Fan Kit Stickers',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/c859f0681f114bcfbbce5b2fde5a4031.webp',
    width: 900,
    height: 1200,
    prompt:
      'Create a clean football sticker kit on an off-white background. Include a blue jersey, soccer ball, smiling fan face, shorts, ticket labeled "2026 FAN KIT", scarf, foam finger, boot, goal, star, and confetti stickers. Crisp outlined sticker style, soft shadows, balanced vertical sheet, no official logos, no team badges, no watermark.',
    use: 'Use this for sticker packs, fan kits, merch mockups, article images, and creator bundles.',
  },
  {
    id: 'wc-009',
    title: 'Circular Fan Badge',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/be7bc6e349f4483495224805adef2fd6.webp',
    referenceImage: '/model-assets/world-cup-2026/references/female-reference.webp',
    width: 900,
    height: 1200,
    prompt:
      'Create a premium circular football fan badge poster. Show one supporter portrait framed by a glowing gold ring, stadium lights, blue confetti, and a small soccer emblem with "2026". Trading-card polish, sharp portrait detail, dramatic blue and gold palette, no official marks, no team crests, no real player likeness.',
    use: 'Use this for profile badges, fan identity graphics, collectible-style posts, or avatar concepts.',
  },
  {
    id: 'wc-010',
    title: 'Fan Grid Collage',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/2111d3bcc8b34669b32fcb82c1da1586.webp',
    referenceImage: '/model-assets/world-cup-2026/references/female-reference.webp',
    width: 900,
    height: 1200,
    prompt:
      'Create a vertical fan grid collage for a 2026 football summer. Combine small panels: supporter portrait, stadium lights, soccer ball, snacks, scoreboard-style textures, confetti, and match-day atmosphere. Add clean title text: "Fan Grid 2026". Editorial collage layout, no official logos, no real team badges, no trademarked tournament marks.',
    use: 'Use this for blog covers, carousel openers, recap collages, and social mood boards.',
  },
  {
    id: 'wc-011',
    title: 'Victory Selfie',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/6fe08b26cd174bd3aaed3769719d2e71.webp',
    referenceImage: '/model-assets/world-cup-2026/references/female-reference.webp',
    width: 900,
    height: 1200,
    prompt:
      'Create a vertical football victory selfie poster. One supporter smiles in a stadium crowd with scarf, confetti, and blue-gold lighting. Add sticker-style readable text: "Victory Selfie" and "2026". Realistic selfie energy with polished social graphics, generic fan colors, no official logos, no team badges, no watermark.',
    use: 'Use this for personal victory posts, fan page reactions, story covers, and creator updates.',
  },
  {
    id: 'wc-012',
    title: 'Kickoff Countdown',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/a5047cc289d048c192ff0ac3a1a44b5a.webp',
    referenceImage: '/model-assets/world-cup-2026/references/female-reference.webp',
    width: 900,
    height: 1200,
    prompt:
      'Create a dramatic kickoff countdown poster in a floodlit football stadium. Show one supporter in generic fan gear with scarf and confetti. Add large readable text: "3 DAYS TO KICKOFF" and small "2026". High-energy vertical event graphic, blue and gold color mood, no official logos, no team badges, no real players.',
    use: 'Use this for countdown posts, event reminders, launch graphics, and match-week social posts.',
  },
  {
    id: 'wc-013',
    title: 'Stadium Spotlight Poster',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/0997028671e64a65814a64e198d35c0c.webp',
    referenceImage: '/model-assets/world-cup-2026/references/female-reference.webp',
    width: 900,
    height: 1200,
    prompt:
      'Create a cinematic vertical poster with a lone football supporter under a huge floodlit stadium bowl. Keep the composition clean, atmospheric, and poster-like with blue night lighting, subtle confetti, and generous space for a headline. Generic jersey, no official tournament marks, no team badges, no real player likeness.',
    use: 'Use this when you need a cleaner key visual for thumbnails, headers, posters, or atmospheric posts.',
  },
  {
    id: 'wc-014',
    title: 'Scoreless Stress Meme',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/6e0a5e563a5c4da2a5fce1e4a664a3dc.webp',
    referenceImage: '/model-assets/world-cup-2026/references/female-reference.webp',
    width: 900,
    height: 1200,
    prompt:
      'Create a football watch-party meme poster. A nervous supporter reacts to a tense scoreless match with a crowd behind them. Add bold readable text: "Still 0-0?" and "I can’t breathe". Colorful sports meme styling, realistic expression, generic jerseys only, no official logos, no team crests, no broadcast graphics.',
    use: 'Use this for tense-match jokes, halftime posts, fan comments, and creator meme templates.',
  },
  {
    id: 'wc-015',
    title: 'Fit Check Poster',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/2db131ad037949a1a1029a1e6a52826e.webp',
    referenceImage: '/model-assets/world-cup-2026/references/female-reference.webp',
    width: 900,
    height: 1200,
    prompt:
      'Create a football fan outfit check poster for 2026. Show one supporter posing in a generic blue jersey with scarf, ticket, soccer ball, boot stickers, and playful annotations. Add readable headline text: "FIT CHECK 2026". Clean social layout, sticker details, no official logos, no team badges, no trademarked marks.',
    use: 'Use this for outfit posts, creator fashion content, fan merch ideas, and social story graphics.',
  },
  {
    id: 'wc-016',
    title: 'Fan Card',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/6a2e10f174744e268760e4bbb317604c.webp',
    referenceImage: '/model-assets/world-cup-2026/references/female-reference.webp',
    width: 900,
    height: 1200,
    prompt:
      'Create a collectible football fan card for 2026. Show one supporter portrait in a generic jersey, framed by stadium lights, gold trim, stats-style labels, and a small soccer emblem. Add readable title text: "FAN CARD". Premium trading-card design, blue and gold palette, no official logos, no real team badges, no real player likeness.',
    use: 'Use this for collectible-style fan posts, profile cards, community features, and avatar graphics.',
  },
  {
    id: 'wc-017',
    title: 'Mood Pack Template',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/031284ca000547d7a8972e0289c48858.webp',
    referenceImage: '/model-assets/world-cup-2026/references/female-reference.webp',
    width: 900,
    height: 1200,
    prompt:
      'Create a football fan mood-pack poster for 2026 with four expressive portrait panels: excited, nervous, cheering, and shocked. Add playful sticker labels and soccer graphics around the panels. Bright social media collage style, generic jerseys, no official logos, no team crests, no watermark.',
    use: 'Use this for carousel posts, reaction packs, community templates, and fan emotion graphics.',
  },
  {
    id: 'wc-018',
    title: 'Street Parade Poster',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/249aad1df887448fa31fc38d812df4f3.webp',
    referenceImage: '/model-assets/world-cup-2026/references/female-reference.webp',
    width: 900,
    height: 1200,
    prompt:
      'Create a vertical street parade football poster for 2026. Show one supporter in generic fan colors walking through a lively city celebration with flags, confetti, warm street lights, and crowd energy. Add readable text: "Street Parade 2026". Cinematic social poster style, no official logos, no team badges, no real player likeness.',
    use: 'Use this for city celebration posts, travel edits, event recaps, and fan parade visuals.',
  },
  {
    id: 'wc-019',
    title: 'Match Day Dump',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/0b914c9e68d141228051269dbcf89f2d.webp',
    referenceImage: '/model-assets/world-cup-2026/references/female-reference.webp',
    width: 900,
    height: 1200,
    prompt:
      'Create a vertical scrapbook collage called "Match Day Dump 2026". Include instant-photo frames of a fan selfie, stadium lights, soccer ball, snacks, confetti, and ticket details on a paper background. Warm editorial layout, realistic photo collage, no official tournament marks, no real team crests, no sponsor logos.',
    use: 'Use this for recap posts, photo-dump covers, travel stories, and creator carousel openings.',
  },
  {
    id: 'wc-020',
    title: 'We Did It Poster',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/60a39626267f4f8d84b87c7251a646d7.webp',
    referenceImage: '/model-assets/world-cup-2026/references/female-reference.webp',
    width: 900,
    height: 1200,
    prompt:
      'Create a celebratory football fan poster with one supporter smiling in a generic jersey and scarf under confetti. Add large readable text: "We Did It" and small "2026". Emotional stadium lighting, blue and gold color mood, polished social poster layout, no official logos, no team badges, no real player likeness.',
    use: 'Use this for win posts, final whistle graphics, fan page celebrations, and recap thumbnails.',
  },
  {
    id: 'wc-021',
    title: 'Match Draw Ticket',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/026fff5f46344690a9857a36f7883ad6.webp',
    referenceImage: '/model-assets/world-cup-2026/references/female-reference.webp',
    width: 900,
    height: 1200,
    prompt:
      'Create a vertical football match draw poster for 2026. Show one supporter in generic fan gear holding a match ticket with stadium lights, soccer balls, and suspenseful fan energy. Add readable text: "MATCH DRAW" and small "2026". Premium social poster style, no official logos, no team crests, no real player likeness.',
    use: 'Use this for bracket reactions, draw-night posts, ticket-style graphics, and match announcement covers.',
  },
  {
    id: 'wc-022',
    title: 'Fan Bingo Sheet',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/334cf8ded71146f091633668119122d0.webp',
    width: 760,
    height: 1013,
    prompt:
      'Create a playful football fan bingo sheet for 2026. Include small illustrated tiles for goal scream, snack break, penalty panic, scarf wave, group selfie, confetti moment, lucky jersey, extra time, and happy tears. Bright social template layout, readable short labels, no official logos, no real team badges, no watermark.',
    use: 'Use this for watch-party games, story templates, community posts, and creator engagement graphics.',
  },
  {
    id: 'wc-023',
    title: 'Group Chat Reaction',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/e585c94e325e41748904bdddd3c34b75.webp',
    referenceImage: '/model-assets/world-cup-2026/references/female-reference.webp',
    width: 860,
    height: 1147,
    prompt:
      'Create a football group chat meme poster for 2026. Show one supporter next to stacked message bubbles reacting to a chaotic match. Use readable short chat lines, sticker-style soccer details, expressive fan portrait, generic jersey, no official logos, no team crests, no broadcast graphics.',
    use: 'Use this for meme posts, group chat jokes, comment bait, and social reaction templates.',
  },
  {
    id: 'wc-024',
    title: 'Fan Face Challenge',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/1019cac311fb4492b218ad32a3fafe38.webp',
    referenceImage: '/model-assets/world-cup-2026/references/female-reference.webp',
    width: 820,
    height: 1093,
    prompt:
      'Create a vertical football fan challenge poster for 2026. Show one supporter pointing toward the camera with playful stickers and short labels around them. Add readable headline text: "Show Your Fan Face". Bright creator-template style, generic jersey, no official logos, no team badges, no real player likeness.',
    use: 'Use this for fan challenges, creator calls to action, selfie prompts, and story posts.',
  },
  {
    id: 'wc-025',
    title: 'Snack Time Kickoff',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/69ee0d79863a4ae59b3e4b2656ab3fb3.webp',
    referenceImage: '/model-assets/world-cup-2026/references/female-reference.webp',
    width: 900,
    height: 1200,
    prompt:
      'Create a football watch-party food poster for summer 2026. Show one supporter holding a tray of snacks in a lively fan zone with stadium lights and match-night energy. Add readable text: "Snack Time Kickoff" and small "2026". Warm lifestyle ad style, generic fan clothing, no official logos, no team badges.',
    use: 'Use this for snack ads, local watch-party promos, food posts, and creator sponsorship visuals.',
  },
  {
    id: 'wc-026',
    title: 'Fan Issue Cover',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/f490c22b63b7480197a1bd952b46f003.webp',
    referenceImage: '/model-assets/world-cup-2026/references/female-reference.webp',
    width: 900,
    height: 1200,
    prompt:
      'Create a sports magazine cover called "Fan Issue" for a 2026 football summer. Show one supporter portrait in a generic jersey with cover-line typography, barcode-style detail, stadium lighting, and editorial polish. No official logos, no team crests, no real player likeness, no watermark.',
    use: 'Use this for editorial-style posts, profile covers, fan features, and blog hero images.',
  },
  {
    id: 'wc-027',
    title: 'Match Night Ticket',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/75d01eb7f5d64b609082565c96f967fc.webp',
    width: 740,
    height: 987,
    prompt:
      'Create a vintage football match-night ticket poster for 2026. Show a large illustrated admission ticket with stadium, scarf, soccer ball, and retro print texture. Add readable headline text: "MATCH NIGHT" and small "2026". Warm poster palette, no official logos, no real team badges, no trademarked tournament marks.',
    use: 'Use this for event flyers, ticket-style posts, watch-party invites, and retro football graphics.',
  },
  {
    id: 'wc-028',
    title: 'Fan Wall Poster',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/63e046d0fa1f4830bfcd7e9e9218c6c0.webp',
    referenceImage: '/model-assets/world-cup-2026/references/female-reference.webp',
    width: 860,
    height: 1147,
    prompt:
      'Create a vertical fan wall poster for a 2026 football summer. Show one supporter in generic fan colors in front of a graphic wall with soccer ball art, scarves, flags, and bold sticker-style text: "Fan Wall 2026". Energetic creator poster style, no official logos, no team crests, no real player likeness.',
    use: 'Use this for profile walls, fan identity posts, creator thumbnails, and event recap covers.',
  },
  {
    id: 'wc-029',
    title: 'Stadium Key Frame',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/af54a7d07fb3456998a878bd4997e04b.webp',
    width: 900,
    height: 1200,
    prompt:
      'Create a cinematic vertical stadium key frame for a 2026 football summer. Show an empty soccer ball in the foreground, bright floodlights, confetti in the night sky, and a huge stadium atmosphere. No text, no official logos, no team badges, no real players, no watermark.',
    use: 'Use this as a clean football image for thumbnails, backgrounds, headers, and atmospheric posts.',
  },
]

const latestGeneratedTemplateExamples: WorldCupTemplateItem[] = [
  {
    id: 'wc-030',
    title: 'Country Color Cheer Fan',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/world-cup-2026/templates/wc-030.webp',
    referenceImage: '/model-assets/world-cup-2026/selfie-references/selfie-001.webp',
    width: 900,
    height: 1200,
    prompt:
      'Use the input face selfie as the identity reference for the main person. Preserve the person’s face, age, skin tone, hair, and natural likeness while changing clothing and setting. Create a vertical 3:4 World Cup-inspired football template: create a tasteful football cheer fan portrait with the person in Brazil-inspired green, yellow, and blue fan styling, cheek flag stickers, hair ribbons, confetti, and a lively outdoor fan zone. Use one clearly recognizable main person based on the input portrait. Creative variation seed: selfie reference 1, template wc-030. Use generic football culture only: scarves, balls, stadium lights, city travel, snacks, fan energy, and creator-style graphics. Keep all jerseys, badges, tickets, and labels fictional. No FIFA logo, no World Cup trophy, no official tournament marks, no real team crests, no sponsor logos, no celebrity or player likeness, no watermark.',
    use: 'Use this for country color cheer fan football posts, creator edits, watch-party visuals, and reusable fan templates.',
  },
  {
    id: 'wc-031',
    title: 'Face Flag Sticker Selfie',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/world-cup-2026/templates/wc-031.webp',
    referenceImage: '/model-assets/world-cup-2026/selfie-references/selfie-002.webp',
    width: 900,
    height: 1200,
    prompt:
      'Use the input face selfie as the identity reference for the main person. Preserve the person’s face, age, skin tone, hair, and natural likeness while changing clothing and setting. Create a vertical 3:4 World Cup-inspired football template: make a close-up selfie template with glossy national flag cheek stickers inspired by Argentina sky blue and white colors, soft stadium bokeh, and fashionable fan styling. Use one clearly recognizable main person based on the input portrait. Creative variation seed: selfie reference 2, template wc-031. Use generic football culture only: scarves, balls, stadium lights, city travel, snacks, fan energy, and creator-style graphics. Keep all jerseys, badges, tickets, and labels fictional. No FIFA logo, no World Cup trophy, no official tournament marks, no real team crests, no sponsor logos, no celebrity or player likeness, no watermark.',
    use: 'Use this for face flag sticker selfie football posts, creator edits, watch-party visuals, and reusable fan templates.',
  },
  {
    id: 'wc-032',
    title: 'Fan Paint Close-Up',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/world-cup-2026/templates/wc-032.webp',
    referenceImage: '/model-assets/world-cup-2026/selfie-references/selfie-003.webp',
    width: 900,
    height: 1200,
    prompt:
      'Use the input face selfie as the identity reference for the main person. Preserve the person’s face, age, skin tone, hair, and natural likeness while changing clothing and setting. Create a vertical 3:4 World Cup-inspired football template: create a polished face-paint beauty portrait with France-inspired blue, white, and red accents, small cheek stickers, subtle glitter, and a cinematic crowd background. Use one clearly recognizable main person based on the input portrait. Creative variation seed: selfie reference 3, template wc-032. Use generic football culture only: scarves, balls, stadium lights, city travel, snacks, fan energy, and creator-style graphics. Keep all jerseys, badges, tickets, and labels fictional. No FIFA logo, no World Cup trophy, no official tournament marks, no real team crests, no sponsor logos, no celebrity or player likeness, no watermark.',
    use: 'Use this for fan paint close-up football posts, creator edits, watch-party visuals, and reusable fan templates.',
  },
  {
    id: 'wc-033',
    title: 'Match Day Cheer Poster',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/world-cup-2026/templates/wc-033.webp',
    referenceImage: '/model-assets/world-cup-2026/selfie-references/selfie-004.webp',
    width: 900,
    height: 1200,
    prompt:
      'Use the input face selfie as the identity reference for the main person. Preserve the person’s face, age, skin tone, hair, and natural likeness while changing clothing and setting. Create a vertical 3:4 World Cup-inspired football template: turn the person into an energetic Germany-inspired black, red, and gold cheer poster with tasteful sporty fan outfit, scarf motion, pom-pom blur, and falling confetti. Use one clearly recognizable main person based on the input portrait. Creative variation seed: selfie reference 4, template wc-033. Use generic football culture only: scarves, balls, stadium lights, city travel, snacks, fan energy, and creator-style graphics. Keep all jerseys, badges, tickets, and labels fictional. No FIFA logo, no World Cup trophy, no official tournament marks, no real team crests, no sponsor logos, no celebrity or player likeness, no watermark.',
    use: 'Use this for match day cheer poster football posts, creator edits, watch-party visuals, and reusable fan templates.',
  },
  {
    id: 'wc-034',
    title: 'Flag Sticker Photo Booth',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/world-cup-2026/templates/wc-034.webp',
    referenceImage: '/model-assets/world-cup-2026/selfie-references/selfie-005.webp',
    width: 900,
    height: 1200,
    prompt:
      'Use the input face selfie as the identity reference for the main person. Preserve the person’s face, age, skin tone, hair, and natural likeness while changing clothing and setting. Create a vertical 3:4 World Cup-inspired football template: make a Korean-style photo booth sticker sheet with four expressions of the person, Japan-inspired red and white face stickers, cute football doodles, and bright white border. Use one clearly recognizable main person based on the input portrait. Creative variation seed: selfie reference 5, template wc-034. Use generic football culture only: scarves, balls, stadium lights, city travel, snacks, fan energy, and creator-style graphics. Keep all jerseys, badges, tickets, and labels fictional. No FIFA logo, no World Cup trophy, no official tournament marks, no real team crests, no sponsor logos, no celebrity or player likeness, no watermark.',
    use: 'Use this for flag sticker photo booth football posts, creator edits, watch-party visuals, and reusable fan templates.',
  },
  {
    id: 'wc-035',
    title: 'Street Fan Parade',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/world-cup-2026/templates/wc-035.webp',
    referenceImage: '/model-assets/world-cup-2026/selfie-references/selfie-006.webp',
    width: 900,
    height: 1200,
    prompt:
      'Use the input face selfie as the identity reference for the main person. Preserve the person’s face, age, skin tone, hair, and natural likeness while changing clothing and setting. Create a vertical 3:4 World Cup-inspired football template: place the person in a Mexico-inspired green, white, and red street fan parade look, cheek flag sticker, casual jacket, festive ribbons, and documentary daylight. Use one clearly recognizable main person based on the input portrait. Creative variation seed: selfie reference 6, template wc-035. Use generic football culture only: scarves, balls, stadium lights, city travel, snacks, fan energy, and creator-style graphics. Keep all jerseys, badges, tickets, and labels fictional. No FIFA logo, no World Cup trophy, no official tournament marks, no real team crests, no sponsor logos, no celebrity or player likeness, no watermark.',
    use: 'Use this for street fan parade football posts, creator edits, watch-party visuals, and reusable fan templates.',
  },
  {
    id: 'wc-036',
    title: 'Couple Rival Fans',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/world-cup-2026/templates/wc-036.webp',
    referenceImage: '/model-assets/world-cup-2026/selfie-references/selfie-007.webp',
    width: 900,
    height: 1200,
    prompt:
      'Use the input face selfie as the identity reference for the main person. Preserve the person’s face, age, skin tone, hair, and natural likeness while changing clothing and setting. Create a vertical 3:4 World Cup-inspired football template: use the person as one half of a friendly mixed-gender fan duo wearing two different country colorways, cheek stickers, playful rivalry pose, and fan-zone lights. Include a natural mixed-gender composition, with the input person clearly recognizable as the primary subject. Creative variation seed: selfie reference 7, template wc-036. Use generic football culture only: scarves, balls, stadium lights, city travel, snacks, fan energy, and creator-style graphics. Keep all jerseys, badges, tickets, and labels fictional. No FIFA logo, no World Cup trophy, no official tournament marks, no real team crests, no sponsor logos, no celebrity or player likeness, no watermark.',
    use: 'Use this for couple rival fans football posts, creator edits, watch-party visuals, and reusable fan templates.',
  },
  {
    id: 'wc-037',
    title: 'Best Friends Fan Selfie',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/world-cup-2026/templates/wc-037.webp',
    referenceImage: '/model-assets/world-cup-2026/selfie-references/selfie-008.webp',
    width: 900,
    height: 1200,
    prompt:
      'Use the input face selfie as the identity reference for the main person. Preserve the person’s face, age, skin tone, hair, and natural likeness while changing clothing and setting. Create a vertical 3:4 World Cup-inspired football template: place the person with a diverse mixed-gender friend group in a realistic fan-zone selfie, each friend with different country-color cheek stickers and natural phone-photo energy. Include a natural mixed-gender composition, with the input person clearly recognizable as the primary subject. Creative variation seed: selfie reference 8, template wc-037. Use generic football culture only: scarves, balls, stadium lights, city travel, snacks, fan energy, and creator-style graphics. Keep all jerseys, badges, tickets, and labels fictional. No FIFA logo, no World Cup trophy, no official tournament marks, no real team crests, no sponsor logos, no celebrity or player likeness, no watermark.',
    use: 'Use this for best friends fan selfie football posts, creator edits, watch-party visuals, and reusable fan templates.',
  },
  {
    id: 'wc-038',
    title: 'Beauty Fan Close-Up',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/world-cup-2026/templates/wc-038.webp',
    referenceImage: '/model-assets/world-cup-2026/selfie-references/selfie-009.webp',
    width: 900,
    height: 1200,
    prompt:
      'Use the input face selfie as the identity reference for the main person. Preserve the person’s face, age, skin tone, hair, and natural likeness while changing clothing and setting. Create a vertical 3:4 World Cup-inspired football template: create a glamorous but believable adult fan close-up with Portugal-inspired red and green styling, glossy cheek flag sticker, hair accessory, and editorial lighting. Use one clearly recognizable main person based on the input portrait. Creative variation seed: selfie reference 9, template wc-038. Use generic football culture only: scarves, balls, stadium lights, city travel, snacks, fan energy, and creator-style graphics. Keep all jerseys, badges, tickets, and labels fictional. No FIFA logo, no World Cup trophy, no official tournament marks, no real team crests, no sponsor logos, no celebrity or player likeness, no watermark.',
    use: 'Use this for beauty fan close-up football posts, creator edits, watch-party visuals, and reusable fan templates.',
  },
  {
    id: 'wc-039',
    title: 'Split Nation Colors',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/world-cup-2026/templates/wc-039.webp',
    referenceImage: '/model-assets/world-cup-2026/selfie-references/selfie-010.webp',
    width: 900,
    height: 1200,
    prompt:
      'Use the input face selfie as the identity reference for the main person. Preserve the person’s face, age, skin tone, hair, and natural likeness while changing clothing and setting. Create a vertical 3:4 World Cup-inspired football template: create a split-color portrait poster with the person styled in two opposing generic nation colorways, cheek stickers on both sides, bold symmetrical graphic treatment. Use one clearly recognizable main person based on the input portrait. Creative variation seed: selfie reference 10, template wc-039. Use generic football culture only: scarves, balls, stadium lights, city travel, snacks, fan energy, and creator-style graphics. Keep all jerseys, badges, tickets, and labels fictional. No FIFA logo, no World Cup trophy, no official tournament marks, no real team crests, no sponsor logos, no celebrity or player likeness, no watermark.',
    use: 'Use this for split nation colors football posts, creator edits, watch-party visuals, and reusable fan templates.',
  },
  {
    id: 'wc-040',
    title: 'Fan ID Badge',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/world-cup-2026/templates/wc-040.webp',
    referenceImage: '/model-assets/world-cup-2026/selfie-references/selfie-young-001.webp',
    width: 900,
    height: 1200,
    prompt:
      'Use the input face selfie as the identity reference for the main person. Preserve the person’s face, age, skin tone, hair, and natural likeness while changing clothing and setting. Create a vertical 3:4 World Cup-inspired football template: design a laminated event staff-style fan ID badge for the person, lanyard, barcode-like details, bold FAN ACCESS text. Use one clearly recognizable main person based on the input portrait. Creative variation seed: selfie reference 11, template wc-040. Use generic football culture only: scarves, balls, stadium lights, city travel, snacks, fan energy, and creator-style graphics. Keep all jerseys, badges, tickets, and labels fictional. No FIFA logo, no World Cup trophy, no official tournament marks, no real team crests, no sponsor logos, no celebrity or player likeness, no watermark.',
    use: 'Use this for fan id badge football posts, creator edits, watch-party visuals, and reusable fan templates.',
  },
  {
    id: 'wc-041',
    title: 'Match Day Newspaper',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/world-cup-2026/templates/wc-041.webp',
    referenceImage: '/model-assets/world-cup-2026/selfie-references/selfie-young-002.webp',
    width: 768,
    height: 1024,
    prompt:
      'Use the input face selfie as the identity reference for the main person. Preserve the person’s face, age, skin tone, hair, and natural likeness while changing clothing and setting. Create a vertical 3:4 World Cup-inspired football template: make a tabloid newspaper front page with the person reacting to a match, bold headline, halftone print, editorial columns. Use one clearly recognizable main person based on the input portrait. Creative variation seed: selfie reference 12, template wc-041. Use generic football culture only: scarves, balls, stadium lights, city travel, snacks, fan energy, and creator-style graphics. Keep all jerseys, badges, tickets, and labels fictional. No FIFA logo, no World Cup trophy, no official tournament marks, no real team crests, no sponsor logos, no celebrity or player likeness, no watermark.',
    use: 'Use this for match day newspaper football posts, creator edits, watch-party visuals, and reusable fan templates.',
  },
  {
    id: 'wc-042',
    title: 'AR Face Filter Preview',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/world-cup-2026/templates/wc-042.webp',
    referenceImage: '/model-assets/world-cup-2026/selfie-references/selfie-young-003.webp',
    width: 900,
    height: 1200,
    prompt:
      'Use the input face selfie as the identity reference for the main person. Preserve the person’s face, age, skin tone, hair, and natural likeness while changing clothing and setting. Create a vertical 3:4 World Cup-inspired football template: create an app-like AR filter preview poster showing the person with generic face paint, floating football icons, UI frame without real platform branding. Use one clearly recognizable main person based on the input portrait. Creative variation seed: selfie reference 13, template wc-042. Use generic football culture only: scarves, balls, stadium lights, city travel, snacks, fan energy, and creator-style graphics. Keep all jerseys, badges, tickets, and labels fictional. No FIFA logo, no World Cup trophy, no official tournament marks, no real team crests, no sponsor logos, no celebrity or player likeness, no watermark.',
    use: 'Use this for ar face filter preview football posts, creator edits, watch-party visuals, and reusable fan templates.',
  },
  {
    id: 'wc-043',
    title: 'Vinyl Record Cover',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/world-cup-2026/templates/wc-043.webp',
    referenceImage: '/model-assets/world-cup-2026/selfie-references/selfie-young-004.webp',
    width: 900,
    height: 1200,
    prompt:
      'Use the input face selfie as the identity reference for the main person. Preserve the person’s face, age, skin tone, hair, and natural likeness while changing clothing and setting. Create a vertical 3:4 World Cup-inspired football template: turn the person into a football chant vinyl record cover, retro sleeve, stadium crowd texture, title SONGS FROM THE STANDS. Use one clearly recognizable main person based on the input portrait. Creative variation seed: selfie reference 14, template wc-043. Use generic football culture only: scarves, balls, stadium lights, city travel, snacks, fan energy, and creator-style graphics. Keep all jerseys, badges, tickets, and labels fictional. No FIFA logo, no World Cup trophy, no official tournament marks, no real team crests, no sponsor logos, no celebrity or player likeness, no watermark.',
    use: 'Use this for vinyl record cover football posts, creator edits, watch-party visuals, and reusable fan templates.',
  },
  {
    id: 'wc-044',
    title: 'Museum Guide Card',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/world-cup-2026/templates/wc-044.webp',
    referenceImage: '/model-assets/world-cup-2026/selfie-references/selfie-young-005.webp',
    width: 900,
    height: 1200,
    prompt:
      'Use the input face selfie as the identity reference for the main person. Preserve the person’s face, age, skin tone, hair, and natural likeness while changing clothing and setting. Create a vertical 3:4 World Cup-inspired football template: make a refined museum audio-guide style card about fan culture with the person as the exhibit portrait, numbered labels, elegant typography. Use one clearly recognizable main person based on the input portrait. Creative variation seed: selfie reference 15, template wc-044. Use generic football culture only: scarves, balls, stadium lights, city travel, snacks, fan energy, and creator-style graphics. Keep all jerseys, badges, tickets, and labels fictional. No FIFA logo, no World Cup trophy, no official tournament marks, no real team crests, no sponsor logos, no celebrity or player likeness, no watermark.',
    use: 'Use this for museum guide card football posts, creator edits, watch-party visuals, and reusable fan templates.',
  },
  {
    id: 'wc-045',
    title: 'Airport Boarding Pass',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/world-cup-2026/templates/wc-045.webp',
    referenceImage: '/model-assets/world-cup-2026/selfie-references/selfie-young-006.webp',
    width: 900,
    height: 1200,
    prompt:
      'Use the input face selfie as the identity reference for the main person. Preserve the person’s face, age, skin tone, hair, and natural likeness while changing clothing and setting. Create a vertical 3:4 World Cup-inspired football template: create a boarding-pass inspired football travel graphic with the person portrait, gate details, seat, host city route, no real airline branding. Use one clearly recognizable main person based on the input portrait. Creative variation seed: selfie reference 16, template wc-045. Use generic football culture only: scarves, balls, stadium lights, city travel, snacks, fan energy, and creator-style graphics. Keep all jerseys, badges, tickets, and labels fictional. No FIFA logo, no World Cup trophy, no official tournament marks, no real team crests, no sponsor logos, no celebrity or player likeness, no watermark.',
    use: 'Use this for airport boarding pass football posts, creator edits, watch-party visuals, and reusable fan templates.',
  },
  {
    id: 'wc-046',
    title: 'Comic Panel Reaction',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/world-cup-2026/templates/wc-046.webp',
    referenceImage: '/model-assets/world-cup-2026/selfie-references/selfie-young-007.webp',
    width: 900,
    height: 1200,
    prompt:
      'Use the input face selfie as the identity reference for the main person. Preserve the person’s face, age, skin tone, hair, and natural likeness while changing clothing and setting. Create a vertical 3:4 World Cup-inspired football template: make a four-panel comic strip using the person reacting to kickoff, near miss, goal, final whistle, bold clean illustrated-photo hybrid. Use one clearly recognizable main person based on the input portrait. Creative variation seed: selfie reference 17, template wc-046. Use generic football culture only: scarves, balls, stadium lights, city travel, snacks, fan energy, and creator-style graphics. Keep all jerseys, badges, tickets, and labels fictional. No FIFA logo, no World Cup trophy, no official tournament marks, no real team crests, no sponsor logos, no celebrity or player likeness, no watermark.',
    use: 'Use this for comic panel reaction football posts, creator edits, watch-party visuals, and reusable fan templates.',
  },
  {
    id: 'wc-047',
    title: 'Breakfast Table Preview',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/world-cup-2026/templates/wc-047.webp',
    referenceImage: '/model-assets/world-cup-2026/selfie-references/selfie-young-008.webp',
    width: 900,
    height: 1200,
    prompt:
      'Use the input face selfie as the identity reference for the main person. Preserve the person’s face, age, skin tone, hair, and natural likeness while changing clothing and setting. Create a vertical 3:4 World Cup-inspired football template: create a cozy morning match preview scene with the person reading a generic sports paper, coffee, croissant, scoreboard-style sticky notes. Use one clearly recognizable main person based on the input portrait. Creative variation seed: selfie reference 18, template wc-047. Use generic football culture only: scarves, balls, stadium lights, city travel, snacks, fan energy, and creator-style graphics. Keep all jerseys, badges, tickets, and labels fictional. No FIFA logo, no World Cup trophy, no official tournament marks, no real team crests, no sponsor logos, no celebrity or player likeness, no watermark.',
    use: 'Use this for breakfast table preview football posts, creator edits, watch-party visuals, and reusable fan templates.',
  },
  {
    id: 'wc-048',
    title: 'Minimal Swiss Poster',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/world-cup-2026/templates/wc-048.webp',
    referenceImage: '/model-assets/world-cup-2026/selfie-references/selfie-young-009.webp',
    width: 816,
    height: 1088,
    prompt:
      'Use the input face selfie as the identity reference for the main person. Preserve the person’s face, age, skin tone, hair, and natural likeness while changing clothing and setting. Create a vertical 3:4 World Cup-inspired football template: turn the person into a restrained Swiss grid football poster, large type, red black white accents, precise spacing, editorial crop. Use one clearly recognizable main person based on the input portrait. Creative variation seed: selfie reference 19, template wc-048. Use generic football culture only: scarves, balls, stadium lights, city travel, snacks, fan energy, and creator-style graphics. Keep all jerseys, badges, tickets, and labels fictional. No FIFA logo, no World Cup trophy, no official tournament marks, no real team crests, no sponsor logos, no celebrity or player likeness, no watermark.',
    use: 'Use this for minimal swiss poster football posts, creator edits, watch-party visuals, and reusable fan templates.',
  },
  {
    id: 'wc-049',
    title: 'Fan Trading Card Foil',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/world-cup-2026/templates/wc-049.webp',
    referenceImage: '/model-assets/world-cup-2026/selfie-references/selfie-young-010.webp',
    width: 900,
    height: 1200,
    prompt:
      'Use the input face selfie as the identity reference for the main person. Preserve the person’s face, age, skin tone, hair, and natural likeness while changing clothing and setting. Create a vertical 3:4 World Cup-inspired football template: make a holographic trading-card design with the person portrait, fictional fan stats, shiny foil border, premium collectible look. Use one clearly recognizable main person based on the input portrait. Creative variation seed: selfie reference 20, template wc-049. Use generic football culture only: scarves, balls, stadium lights, city travel, snacks, fan energy, and creator-style graphics. Keep all jerseys, badges, tickets, and labels fictional. No FIFA logo, no World Cup trophy, no official tournament marks, no real team crests, no sponsor logos, no celebrity or player likeness, no watermark.',
    use: 'Use this for fan trading card foil football posts, creator edits, watch-party visuals, and reusable fan templates.',
  },
]

const allTemplateExamples = [...latestGeneratedTemplateExamples, ...templateExamples, ...expandedTemplateExamples]

function localizeTemplateItems(items: WorldCupTemplateItem[], titlePrefix: string): WorldCupTemplateItem[] {
  return items.map((item, index) => ({
    ...item,
    title: `${titlePrefix} ${index + 1}`,
  }))
}

function FieldPattern() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-45" aria-hidden="true">
      <div className="absolute left-1/2 top-16 h-[520px] w-[520px] -translate-x-1/2 rounded-full border border-white/15" />
      <div className="absolute inset-x-0 top-[320px] h-px bg-white/15" />
      <div className="absolute left-1/2 top-0 h-full w-px bg-white/10" />
      <div className="absolute -bottom-40 left-1/2 h-[420px] w-[920px] -translate-x-1/2 rounded-[50%] border border-white/10" />
    </div>
  )
}

export default async function WorldCupAiImageGeneratorPageContent({ locale = 'en' }: { locale?: string }) {
  const t = await loadCommonTranslations(locale)
  const copy = getWorldCupPageCopy(locale)
  const localizedTemplateExamples = localizeTemplateItems(
    allTemplateExamples,
    copy.templateGallery.templateTitlePrefix
  )

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: copy.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: copy.howTo.schemaName,
    step: copy.howTo.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.text,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <Navigation initialTranslations={t} />
      <main className="min-h-screen bg-[#F8FAFF] text-slate-950">
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_15%_10%,rgba(109,93,246,0.18),transparent_32%),linear-gradient(135deg,#FFFFFF_0%,#F8FAFF_48%,#EEF2FF_100%)] px-4 pb-12 pt-5 text-slate-950 md:px-6 md:pb-16">
          <FieldPattern />
          <div className="relative mx-auto max-w-7xl">
            <Breadcrumb
              items={[
                { label: copy.breadcrumbs.home, href: locale === 'en' ? '/' : `/${locale}` },
                { label: copy.breadcrumbs.aiTools, href: locale === 'en' ? '/ai-tools' : `/${locale}/ai-tools` },
                { label: copy.breadcrumbs.current },
              ]}
            />

            <div
              id="world-cup-gpt-image-2-generator"
              className="mt-8 flex h-[100svh] flex-col overflow-hidden border border-indigo-100 bg-white p-3 text-slate-950 md:p-5"
            >
              <AiImageGenerationTool
                modelId="gpt-image-2"
                modelName="GPT Image 2"
                dailyLimitStorageKey="world_cup_gpt_image_2_last_used_date"
                fitParentHeight
                plainRightPanel
                heroTitle={
                  <>
                    <span className="text-[#4F46E5]">{copy.hero.highlight}</span> {copy.hero.suffix}
                  </>
                }
                heroDescription={copy.hero.description}
                sampleImages={[
                  {
                    url: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/world-cup-2026/templates/wc-030.webp',
                    title: 'World Cup fan portrait sample output',
                    width: 900,
                    height: 1200,
                  },
                ]}
                initialTranslations={t}
              />
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-16 md:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
              <div>
                <p className="mb-4 text-sm font-black tracking-[0.08em] text-[#4F46E5]">
                  {copy.templateSection.eyebrow}
                </p>
                <h2 className="text-[36px] font-extrabold leading-tight tracking-tight text-slate-950">
                  {copy.templateSection.title}
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-8 text-slate-600">
                {copy.templateSection.description}
              </p>
            </div>
            <WorldCupTemplateGallery items={localizedTemplateExamples} labels={copy.templateGallery} />
          </div>
        </section>

        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
              <div>
                <p className="mb-4 text-sm font-black tracking-[0.08em] text-[#4F46E5]">
                  {copy.whatToMake.eyebrow}
                </p>
                <h2 className="text-[36px] font-extrabold leading-tight tracking-tight text-slate-950">
                  {copy.whatToMake.title}
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-8 text-slate-600">
                {copy.whatToMake.description}
              </p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {copy.whatToMake.cards.map((item) => (
                <article
                  key={item.title}
                  className="group flex min-h-[250px] flex-col justify-between border border-indigo-100 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-indigo-300"
                >
                  <div>
                    <h3 className="text-2xl font-black leading-tight tracking-[-0.03em] text-slate-950">
                      {item.title}
                    </h3>
                    <p className="mt-4 line-clamp-4 min-h-[7rem] text-sm leading-7 text-slate-600">
                      {item.text}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-16 md:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
              <div>
                <p className="mb-4 text-sm font-black tracking-[0.08em] text-[#4F46E5]">
                  {copy.formats.eyebrow}
                </p>
                <h2 className="text-[36px] font-extrabold leading-tight tracking-tight text-slate-950">
                  {copy.formats.title}
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-8 text-slate-600">
                {copy.formats.description}
              </p>
            </div>
            <div className="mt-10 grid gap-px border border-indigo-100 bg-indigo-100 md:grid-cols-2 lg:grid-cols-3">
              {copy.formats.cards.map((item) => (
                <article key={item.title} className="bg-[#F8FAFF] p-6">
                  <h3 className="text-xl font-black tracking-[-0.02em] text-slate-950">{item.title}</h3>
                  <p className="mt-3 line-clamp-4 min-h-[7rem] text-sm leading-7 text-slate-600">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="world-cup-prompts" className="px-6 py-16 md:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
              <div>
                <p className="mb-4 text-sm font-black tracking-[0.08em] text-[#4F46E5]">
                  {copy.howTo.eyebrow}
                </p>
                <h2 className="text-[36px] font-extrabold leading-tight tracking-tight text-slate-950">
                  {copy.howTo.title}
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-8 text-slate-600">
                {copy.howTo.description}
              </p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
              {copy.howTo.steps.map((step, index) => (
                <article
                  key={step.title}
                  className="flex min-h-[260px] flex-col border border-indigo-100 bg-white p-5 transition duration-200 hover:-translate-y-1 hover:border-[#4F46E5]"
                >
                  <p className="text-sm font-black text-[#4F46E5]">{copy.howTo.stepLabel} {index + 1}</p>
                  <h3 className="mt-4 text-xl font-black tracking-[-0.02em] text-slate-950">
                    {step.title}
                  </h3>
                  <p className="mt-4 line-clamp-5 min-h-[8.75rem] text-sm leading-7 text-slate-600">
                    {step.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-16 md:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
              <div>
                <p className="mb-4 text-sm font-black tracking-[0.08em] text-[#4F46E5]">
                  {copy.promptTips.eyebrow}
                </p>
                <h2 className="text-[36px] font-extrabold leading-tight tracking-tight text-slate-950">
                  {copy.promptTips.title}
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-8 text-slate-600">
                {copy.promptTips.description}
              </p>
            </div>
            <div className="mt-10 grid gap-px border border-indigo-100 bg-indigo-100 lg:grid-cols-5">
              {copy.promptTips.cards.map((item) => (
                <article key={item.title} className="bg-[#F8FAFF] p-6 transition duration-200 hover:-translate-y-1 hover:bg-white">
                  <h3 className="text-xl font-black tracking-[-0.02em] text-slate-950">{item.title}</h3>
                  <p className="mt-4 line-clamp-5 min-h-[8.75rem] text-sm leading-7 text-slate-600">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
              <div>
                <p className="mb-4 text-sm font-black tracking-[0.08em] text-[#4F46E5]">
                  {copy.templateStyles.eyebrow}
                </p>
                <h2 className="text-[36px] font-extrabold leading-tight tracking-tight text-slate-950">
                  {copy.templateStyles.title}
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-8 text-slate-600">
                {copy.templateStyles.description}
              </p>
            </div>
            <div className="mt-10 overflow-x-auto border border-indigo-100">
              <div className="min-w-[980px]">
                <div className="grid grid-cols-[0.85fr_1.25fr_1.35fr_1fr] bg-[#0B172A] text-sm font-black text-white">
                  <div className="p-4">{copy.templateStyles.headers.style}</div>
                  <div className="p-4">{copy.templateStyles.headers.bestFor}</div>
                  <div className="p-4">{copy.templateStyles.headers.promptFocus}</div>
                  <div className="p-4">{copy.templateStyles.headers.example}</div>
                </div>
                {copy.templateStyles.rows.map((row) => (
                  <div
                    key={row.style}
                    className="grid grid-cols-[0.85fr_1.25fr_1.35fr_1fr] border-t border-indigo-100 bg-white text-sm"
                  >
                    <div className="p-4 font-black text-slate-950">{row.style}</div>
                    <div className="p-4 leading-7 text-slate-600">{row.bestFor}</div>
                    <div className="p-4 leading-7 text-slate-600">{row.promptFocus}</div>
                    <div className="p-4 leading-7 text-[#4F46E5]">{row.example}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-16 md:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
              <div>
                <p className="mb-4 text-sm font-black tracking-[0.08em] text-[#4F46E5]">
                  {copy.ideas.eyebrow}
                </p>
                <h2 className="text-[36px] font-extrabold leading-tight tracking-tight text-slate-950">
                  {copy.ideas.title}
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-8 text-slate-600">
                {copy.ideas.description}
              </p>
            </div>
            <div className="mt-10 grid gap-px border border-indigo-100 bg-indigo-100 md:grid-cols-2 lg:grid-cols-3">
              {copy.ideas.cards.map((item) => (
                <article key={item.title} className="bg-[#F8FAFF] p-6 transition duration-200 hover:-translate-y-1 hover:bg-white">
                  <h3 className="text-xl font-black tracking-[-0.02em] text-slate-950">{item.title}</h3>
                  <p className="mt-4 line-clamp-4 min-h-[7rem] text-sm leading-7 text-slate-600">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="mb-4 text-sm font-black tracking-[0.08em] text-[#4F46E5]">
                {copy.why.eyebrow}
              </p>
              <h2 className="text-[36px] font-extrabold leading-tight tracking-tight text-slate-950">
                {copy.why.title}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
                {copy.why.description}
              </p>
            </div>
            <div className="grid gap-px border border-indigo-100 bg-indigo-100 md:grid-cols-2">
              {copy.why.bullets.map((item) => (
                <div key={item} className="bg-white p-6">
                  <p className="line-clamp-4 min-h-[7rem] text-sm leading-7 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
                <p className="mb-4 text-sm font-black tracking-[0.08em] text-[#4F46E5]">
                  {copy.faq.eyebrow}
                </p>
                <h2 className="text-[36px] font-extrabold leading-tight tracking-tight text-slate-950">
                  {copy.faq.title}
                </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
                {copy.faq.description}
              </p>
            </div>
            <div className="divide-y divide-indigo-100 border-y border-indigo-100 bg-white">
              {copy.faq.items.map((item) => (
                <details key={item.q} className="group px-5 py-5">
                  <summary className="cursor-pointer list-none text-base font-black text-slate-950">
                    {item.q}
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[linear-gradient(135deg,#4F46E5_0%,#6D5DF6_46%,#0B172A_100%)] px-6 py-16 text-white md:py-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="max-w-3xl text-[36px] font-extrabold leading-tight tracking-tight">
                {copy.cta.title}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-indigo-100">
                {copy.cta.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="#world-cup-gpt-image-2-generator" className="bg-white px-6 py-3 text-sm font-black text-[#4F46E5]">
                {copy.cta.button}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer initialTranslations={t} />
    </>
  )
}
