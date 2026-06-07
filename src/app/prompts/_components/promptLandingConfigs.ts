type PromptLandingStep = {
  title: string
  text: string
}

type PromptLandingPattern = {
  label: string
  heading: string
  body: string
}

type PromptLandingChooserRow = {
  goal: string
  startWith: string
  bestFor: string
  replace: string
  keep: string
}

type PromptLandingFaq = {
  q: string
  a: string
}

export type PromptLandingConfig = {
  slug: string
  kind: 'model' | 'category'
  filterValue: string
  defaultModel?: string
  defaultCategory?: string
  title: string
  description: string
  heroTitle: string
  heroDescription: string
  howToTitle: string
  howToIntro: string
  steps: PromptLandingStep[]
  remixTitle: string
  remixText: string
  patterns: PromptLandingPattern[]
  chooserTitle: string
  chooserIntro: string
  chooserRows: PromptLandingChooserRow[]
  answerTitle: string
  answerText: string
  anatomyTitle: string
  anatomyIntro: string
  anatomy: PromptLandingStep[]
  trustTitle: string
  trustText: string
  trustRules: string[]
  mistakesTitle: string
  mistakesText: string
  mistakes: PromptLandingStep[]
  faqTitle: string
  faqs: PromptLandingFaq[]
}

const sourceRules = [
  'Every template should point back to a public X source, not a made-up prompt example.',
  'The visible prompt should match the original post or comment language instead of being rewritten.',
  'The template should include enough context for a beginner to copy, replace, and test it.',
  'The media and metrics are treated as signals, but the prompt itself must still be usable.',
]

export const promptLandingConfigs: Record<string, PromptLandingConfig> = {
  'seedance-2-0': {
    slug: 'seedance-2-0',
    kind: 'model',
    filterValue: 'Seedance 2.0',
    defaultModel: 'Seedance 2.0',
    title: 'Seedance 2.0 Prompt Library From Viral X Examples | Toolaze',
    description:
      'Copy and remix source-backed Seedance 2.0 prompts from viral X examples for product ads, trailers, fashion clips, character motion, and social media videos.',
    heroTitle: 'Create Seedance 2.0 Videos From Prompts That Already Worked On X',
    heroDescription:
      'Most creators do not want to become prompt engineers before making their first AI video. This page collects source-backed Seedance 2.0 prompts from X, so you can copy a proven structure, replace the subject with your own idea, and publish a social-ready video faster.',
    howToTitle: 'How to use Seedance 2.0 prompts from this library',
    howToIntro:
      'Treat each template as a shortcut, not a magic spell. Start from a public X prompt, copy the structure, replace the parts that belong to your idea, then compare the result with the source example before publishing.',
    steps: [
      {
        title: 'Pick a proven idea',
        text: 'Start from prompts that already appeared in public X posts instead of staring at a blank box. The source link, model tag, prompt text, and engagement data help you see which creative angles people reacted to.',
      },
      {
        title: 'Copy the structure',
        text: 'Open a template, copy the prompt, and keep the parts that make it work: subject setup, timed beats, camera movement, visual style, and final hook.',
      },
      {
        title: 'Replace the content',
        text: 'Swap in your product, character, scene, or reference image while keeping the rhythm of the original. This is faster than inventing a full cinematic prompt from scratch.',
      },
      {
        title: 'Generate and compare',
        text: 'Use the original X post as a creative benchmark, then adjust camera speed, motion beats, identity preservation, and visual density until the result feels publishable.',
      },
    ],
    remixTitle: 'Copy the prompt, then make the idea yours',
    remixText:
      'A good template is not a cage. It is a scaffold. Keep the viral mechanism, change the subject, and rebuild the prompt around your own product, character, image, or story.',
    patterns: [
      {
        label: 'For beginners',
        heading: 'Use the prompt first, learn the craft second.',
        body: 'Copy one template, change the subject, generate a result, then study which parts controlled the motion, look, and final frame.',
      },
      {
        label: 'For social posts',
        heading: 'Remix the hook, not just the image.',
        body: 'Keep the visible hook: surprising transformation, satisfying product reveal, cinematic creature shot, character motion, or before-and-after contrast.',
      },
      {
        label: 'For product ads',
        heading: 'Turn a template into a repeatable ad format.',
        body: 'Replace the original object with your product, keep the reveal sequence, then add packshot, material texture, use case, and final call-to-action frame.',
      },
    ],
    chooserTitle: 'Choose the right Seedance 2.0 prompt template for the video you want to post',
    chooserIntro:
      'The easiest mistake is copying a good prompt for the wrong job. Start with the format closest to your goal, then change the parts that make it yours.',
    chooserRows: [
      {
        goal: 'Product ad',
        startWith: 'A small product problem, one tactile change, and a clean hero shot.',
        bestFor: 'Short ads, ecommerce creative, launch posts, and product demos.',
        replace: 'Product name, material, use case, background, and logo-safe final frame.',
        keep: 'Reveal rhythm, packshot ending, camera move, and benefit-first setup.',
      },
      {
        goal: 'Fashion transformation',
        startWith: 'One transition trigger such as a spin, sleeve flick, hair touch, or fan movement.',
        bestFor: 'Outfit changes, beauty clips, hair motion, styling posts, and character reels.',
        replace: 'Character, wardrobe, fabric, accessories, expression, and transition trigger.',
        keep: 'Identity locks, fabric behavior, timed outfit changes, and camera distance.',
      },
      {
        goal: 'Film trailer',
        startWith: 'A calm setup, one unsettling movement or conflict, and a final hook frame.',
        bestFor: 'Cinematic scenes, creature shots, horror moments, action beats, and worldbuilding.',
        replace: 'Setting, creature, conflict, lighting, sound cue, and final reveal.',
        keep: 'Shot-list structure, escalation, atmosphere, and last-frame hook.',
      },
    ],
    answerTitle: 'What is the fastest way to use Seedance 2.0 prompts?',
    answerText:
      'Start from a prompt that has already performed well on X. Pick a template close to your goal, copy the original prompt, replace the subject or product, keep the timing and camera structure, then generate a new version.',
    anatomyTitle: 'What a reusable Seedance prompt usually contains',
    anatomyIntro:
      'You do not have to memorize prompt theory. When a template works, it usually has these pieces hiding in plain sight.',
    anatomy: [
      { title: 'The thing viewers notice first', text: 'Name the product, character, creature, or scene clearly.' },
      { title: 'The parts that must stay stable', text: 'For reference images, protect face, outfit, product shape, logo placement, color palette, pose, or background perspective.' },
      { title: 'The movement beat by beat', text: 'Use time ranges or short action beats so the model knows what changes first, next, and last.' },
      { title: 'The camera, not just the style', text: 'Add a real camera instruction such as dolly in, locked medium shot, macro push, orbit, handheld zoom, or lateral tracking.' },
    ],
    trustTitle: 'Why these Seedance 2.0 prompt templates are source-backed',
    trustText:
      'A prompt library is only useful if the examples are traceable, copyable, and honest about where they came from.',
    trustRules: sourceRules,
    mistakesTitle: 'Small changes that make a copied prompt feel original',
    mistakesText:
      'Use the source prompt as scaffolding, then make enough decisions that the result belongs to your idea.',
    mistakes: [
      { title: 'Changing the subject but leaving the old scene', text: 'Change the environment and final frame with the subject, or the output feels patched together.' },
      { title: 'Deleting the timing because it looks verbose', text: 'The timing often makes the clip feel controlled. Remove it only when the motion is genuinely simple.' },
      { title: 'Keeping camera moves that do not fit your idea', text: 'Keep the intent, not every camera word from the source.' },
    ],
    faqTitle: 'Seedance 2.0 prompt library FAQ',
    faqs: [
      {
        q: 'Who is this Seedance 2.0 prompt library for?',
        a: 'It is for creators who want to make AI videos without writing prompts from scratch. Beginners can copy a source-backed prompt directly, while marketers and prompt creators can remix the structure.',
      },
      {
        q: 'Why use X examples instead of generic prompt formulas?',
        a: 'X examples give you a real creative reference, a public source, and a clearer sense of what might work on social media.',
      },
      {
        q: 'How do I make my own viral-style Seedance prompt?',
        a: 'Choose a proven template, keep its creative hook, replace the content with your own subject, then make the first frame and final frame easy to understand.',
      },
    ],
  },
  kling: {
    slug: 'kling',
    kind: 'model',
    filterValue: 'Kling',
    defaultModel: 'Kling',
    title: 'Kling Prompt Templates From Viral X Examples | Toolaze',
    description:
      'Browse source-backed Kling prompt templates from X for product ads, cinematic scenes, fashion clips, anime videos, and social media posts.',
    heroTitle: 'Create Kling Videos From Prompt Formats People Already Shared On X',
    heroDescription:
      'Kling prompts work best when the motion is specific: camera direction, subject movement, scene pacing, and a final frame that feels worth posting. This library helps you start from real X examples instead of guessing from a blank text box.',
    howToTitle: 'How to use Kling prompt templates without overprompting',
    howToIntro:
      'Kling can handle cinematic movement, but vague prompts often become busy. Use the source example as a frame, then keep the action readable.',
    steps: [
      {
        title: 'Choose the closest motion style',
        text: 'Start with a template that already moves like your idea: vlog, product reveal, trailer shot, character action, or fashion transition.',
      },
      {
        title: 'Keep one main action',
        text: 'Replace the subject, but avoid stacking too many movements. A clear first action usually beats a crowded scene.',
      },
      {
        title: 'Protect the final frame',
        text: 'Describe what the last shot should show, especially for ads, trailers, and social posts where the ending carries the hook.',
      },
      {
        title: 'Adjust camera language',
        text: 'Swap camera moves only when they fit your scene. A handheld vlog prompt should not become a polished commercial unless that is intentional.',
      },
    ],
    remixTitle: 'Turn a Kling example into your own video format',
    remixText:
      'The useful part of a Kling template is not just the wording. It is the rhythm: what appears first, what changes, what the camera follows, and why the final frame is shareable.',
    patterns: [
      {
        label: 'For ads',
        heading: 'Make the benefit visible before the logo.',
        body: 'Use a product prompt to show texture, use case, transformation, or appetite appeal before asking for a clean hero shot.',
      },
      {
        label: 'For trailers',
        heading: 'Let tension build in one direction.',
        body: 'A strong Kling trailer prompt usually starts calm, adds one threat or reveal, then ends on a frame that invites a second watch.',
      },
      {
        label: 'For creators',
        heading: 'Borrow the pacing, not the exact story.',
        body: 'Keep the beat structure from the source and replace the cast, setting, props, and final payoff with something that belongs to you.',
      },
    ],
    chooserTitle: 'Pick a Kling template by the kind of motion you need',
    chooserIntro: 'Use the table as a practical shortcut before browsing the templates.',
    chooserRows: [
      {
        goal: 'Product motion',
        startWith: 'A tactile action such as pour, unwrap, slice, sparkle, splash, or reveal.',
        bestFor: 'Food, beauty, ecommerce, app promos, and launch videos.',
        replace: 'Product, setting, hand action, material, and final packshot.',
        keep: 'Macro timing, benefit reveal, and clean ending.',
      },
      {
        goal: 'Cinematic scene',
        startWith: 'A short shot list with one emotional or physical conflict.',
        bestFor: 'Trailers, fantasy scenes, horror, action, and worldbuilding.',
        replace: 'Character, location, threat, lighting, and camera move.',
        keep: 'Escalation, atmosphere, and the final hook.',
      },
      {
        goal: 'Social character clip',
        startWith: 'One gesture, one expression, and one camera distance.',
        bestFor: 'Portrait animation, influencer clips, anime, mascots, and vlog-style scenes.',
        replace: 'Identity anchor, pose, emotion, background, and platform format.',
        keep: 'Face consistency and simple motion beats.',
      },
    ],
    answerTitle: 'What is the fastest way to write a Kling prompt?',
    answerText:
      'Start from a source-backed Kling template that already matches your motion goal. Replace the subject and setting, keep the timing and camera structure, then make the ending more specific. Kling usually improves when the prompt has fewer competing actions and a clearer last frame.',
    anatomyTitle: 'What a reusable Kling prompt usually controls',
    anatomyIntro: 'Good Kling prompts tell the model what should move, what should stay stable, and where the viewer should look.',
    anatomy: [
      { title: 'Motion priority', text: 'Name the one movement that matters most before adding secondary details.' },
      { title: 'Camera distance', text: 'Specify close-up, medium shot, wide shot, POV, handheld, orbit, or locked camera when it changes the result.' },
      { title: 'Scene continuity', text: 'Keep the same product, face, outfit, lighting, or location across the shot.' },
      { title: 'Social payoff', text: 'Define the visual moment that makes the video worth posting or remixing.' },
    ],
    trustTitle: 'Why these Kling prompts are source-backed',
    trustText:
      'A Kling template is more useful when you can see the original context and decide whether the idea is worth adapting.',
    trustRules: sourceRules,
    mistakesTitle: 'Common Kling remix mistakes',
    mistakesText: 'Most weak remixes fail because the motion becomes unclear.',
    mistakes: [
      { title: 'Adding five actions to a short clip', text: 'Keep the main action readable. Extra movement can make Kling lose the subject.' },
      { title: 'Forgetting the last frame', text: 'A social post needs a clear ending, not only a cinematic middle.' },
      { title: 'Using the wrong camera style', text: 'A commercial prompt and a vlog prompt need different camera behavior.' },
    ],
    faqTitle: 'Kling prompt template FAQ',
    faqs: [
      { q: 'Can beginners use these Kling prompts?', a: 'Yes. Copy a template, replace the subject and scene, and keep the motion structure until you understand what each part controls.' },
      { q: 'Are these prompts only for video ads?', a: 'No. The Kling library includes ads, trailers, character motion, fantasy scenes, fashion clips, and social formats.' },
      { q: 'Why use X examples?', a: 'X examples show real prompt formats people shared publicly, so you can study both the wording and the social angle.' },
    ],
  },
  'gpt-image-2': {
    slug: 'gpt-image-2',
    kind: 'model',
    filterValue: 'GPT Image 2',
    defaultModel: 'GPT Image 2',
    title: 'GPT Image 2 Prompt Templates From Viral X Examples | Toolaze',
    description:
      'Copy source-backed GPT Image 2 prompt templates from X for ads, posters, memes, UI mockups, portraits, infographics, and social images.',
    heroTitle: 'Create GPT Image 2 Images From Prompt Structures That Already Worked On X',
    heroDescription:
      'GPT Image 2 prompts are often strongest when they describe layout, subject, style, and constraints in one clean brief. This page collects real X examples so you can copy the structure and make your own image faster.',
    howToTitle: 'How to use GPT Image 2 prompt templates',
    howToIntro:
      'Image prompts need sharper composition rules than video prompts. Start with the visual hierarchy, then add style and constraints.',
    steps: [
      { title: 'Pick the output type', text: 'Choose a template for a poster, ad, meme, portrait, infographic, UI board, or product image before changing the subject.' },
      { title: 'Keep the composition logic', text: 'Preserve the layout instruction that made the source useful, such as hero subject, margins, framing, or text placement.' },
      { title: 'Replace the reference details', text: 'Swap in your product, character, scene, brand mood, or visual joke while keeping the prompt readable.' },
      { title: 'Check text and artifacts', text: 'If the image contains typography, keep it short and ask for clean spelling, contrast, and layout.' },
    ],
    remixTitle: 'Use the prompt as an image brief, not a keyword pile',
    remixText:
      'A strong GPT Image 2 prompt reads like a creative brief. It says what should be seen first, what style should hold the image together, and what must not break.',
    patterns: [
      { label: 'For ads', heading: 'Give the product a job in the image.', body: 'Do not only ask for a beautiful packshot. Show the product benefit, setting, material, or moment of use.' },
      { label: 'For memes', heading: 'Preserve the joke structure.', body: 'The viral part is often the mismatch, redraw style, or absurd instruction. Keep that mechanic when changing the subject.' },
      { label: 'For layouts', heading: 'Control hierarchy before decoration.', body: 'Posters, UI boards, and infographics need spacing and alignment rules before style words.' },
    ],
    chooserTitle: 'Choose a GPT Image 2 template by image format',
    chooserIntro: 'Different image formats need different prompt structure.',
    chooserRows: [
      { goal: 'Product ad', startWith: 'A clear hero product and one benefit.', bestFor: 'Ecommerce, launch posts, skincare, food, fashion, and app promos.', replace: 'Product, surface, background, use case, and brand mood.', keep: 'Packshot clarity, material details, and readable final composition.' },
      { goal: 'Poster or key visual', startWith: 'A strong title area and one central subject.', bestFor: 'Campaign images, character posters, event graphics, and social covers.', replace: 'Subject, title, palette, scene, and typography style.', keep: 'Grid, margins, contrast, and visual hierarchy.' },
      { goal: 'Meme or redraw', startWith: 'The funny instruction or image transformation.', bestFor: 'Shareable X posts, reaction images, visual jokes, and trend formats.', replace: 'Subject, reference, joke, and output style.', keep: 'Recognizable contrast and low-friction remixability.' },
    ],
    answerTitle: 'What is the fastest way to use GPT Image 2 prompts?',
    answerText:
      'Choose a source-backed template close to your image format, keep its composition rules, replace the subject and style details, then generate a version with a clear first-read focal point. For posters or ads, check text, margins, and product clarity before posting.',
    anatomyTitle: 'What a reusable GPT Image 2 prompt usually contains',
    anatomyIntro: 'The best reusable image prompts behave like compact art direction.',
    anatomy: [
      { title: 'Main subject', text: 'Name the object, character, scene, or idea that should be noticed first.' },
      { title: 'Composition', text: 'Describe framing, hierarchy, margins, background, and text placement when needed.' },
      { title: 'Visual language', text: 'Keep style, lighting, material, color, and perspective consistent.' },
      { title: 'Quality controls', text: 'Add constraints for text, anatomy, logos, hands, and unwanted artifacts only when relevant.' },
    ],
    trustTitle: 'Why these GPT Image 2 templates are source-backed',
    trustText:
      'Prompt libraries get weak when they invent polished-sounding templates. These examples stay useful because the source context is visible.',
    trustRules: sourceRules,
    mistakesTitle: 'Common GPT Image 2 remix mistakes',
    mistakesText: 'Most failures come from vague layout, too much style stacking, or ignored text constraints.',
    mistakes: [
      { title: 'Changing the product but not the scene', text: 'A perfume layout may not fit a sneaker, SaaS screen, or food product without changing the setting.' },
      { title: 'Asking for too much text', text: 'Short, high-contrast copy works better than paragraphs inside the image.' },
      { title: 'Treating style as the whole prompt', text: 'Style words help, but composition and subject hierarchy do more work.' },
    ],
    faqTitle: 'GPT Image 2 prompt template FAQ',
    faqs: [
      { q: 'Can I copy these prompts directly?', a: 'Yes, but the better workflow is to keep the structure and replace the subject, product, reference, or layout goal.' },
      { q: 'Do these templates include meme prompts?', a: 'Yes. GPT Image 2 examples include ads, posters, portraits, UI concepts, infographics, and meme-style image prompts.' },
      { q: 'Should I translate the original prompt?', a: 'For source accuracy, keep the original prompt language when studying it. You can write your remix in the language your model handles best.' },
    ],
  },
  'nano-banana': {
    slug: 'nano-banana',
    kind: 'model',
    filterValue: 'Nano Banana',
    defaultModel: 'Nano Banana',
    title: 'Nano Banana Prompt Templates From Viral X Examples | Toolaze',
    description:
      'Browse source-backed Nano Banana prompt templates from X for portraits, product visuals, fashion edits, ads, and social images.',
    heroTitle: 'Create Nano Banana Images From Real Prompt Examples On X',
    heroDescription:
      'Nano Banana prompts are useful for fast image experiments, character edits, product visuals, and social-ready compositions. This library helps you start from real examples instead of generic prompt formulas.',
    howToTitle: 'How to remix Nano Banana prompt templates',
    howToIntro:
      'Nano Banana works best when the prompt is specific about identity, style, and the part of the image that must change.',
    steps: [
      { title: 'Choose a similar image task', text: 'Start with a template for portraits, product visuals, fashion, lifestyle, or stylized social images.' },
      { title: 'Protect the important details', text: 'If the source prompt preserves a face, outfit, object shape, or pose, replace that rule with your own anchor.' },
      { title: 'Make one visible change', text: 'Ask for a clear transformation, setting, pose, lighting change, or product story instead of a vague enhancement.' },
      { title: 'Compare before posting', text: 'Check whether the result still reads as your subject and whether the final image works without extra explanation.' },
    ],
    remixTitle: 'Make the example useful without cloning it',
    remixText:
      'A Nano Banana template gives you a working image direction. Your job is to change the subject, the setting, and the final purpose enough that the result belongs to your project.',
    patterns: [
      { label: 'For portraits', heading: 'Keep identity stable first.', body: 'Face, age, expression, hair, clothing, and pose need clear rules before you add cinematic style.' },
      { label: 'For products', heading: 'Show the object clearly.', body: 'Product shape and material should stay readable even when the background or lighting changes.' },
      { label: 'For social posts', heading: 'Design for instant recognition.', body: 'A good social image should communicate the joke, transformation, or aesthetic in one glance.' },
    ],
    chooserTitle: 'Choose a Nano Banana template by edit type',
    chooserIntro: 'Different Nano Banana prompts are useful for different image jobs.',
    chooserRows: [
      { goal: 'Portrait edit', startWith: 'A reference identity and a specific mood.', bestFor: 'Avatars, fashion portraits, creator photos, and character images.', replace: 'Face anchor, wardrobe, pose, lighting, and background.', keep: 'Identity consistency and natural anatomy.' },
      { goal: 'Product visual', startWith: 'A clear product shape and one setting idea.', bestFor: 'Ads, ecommerce images, launch teasers, and lifestyle packshots.', replace: 'Product, material, scene, surface, and brand mood.', keep: 'Product readability and clean composition.' },
      { goal: 'Stylized social image', startWith: 'A strong aesthetic or visual joke.', bestFor: 'X posts, thumbnails, memes, covers, and trend remixes.', replace: 'Subject, style, color palette, and platform format.', keep: 'The contrast or transformation that makes the example interesting.' },
    ],
    answerTitle: 'What is the fastest way to use Nano Banana prompts?',
    answerText:
      'Start with a template that matches your image task, keep the identity or product protection rules, then change the scene and final purpose. Nano Banana prompts work better when the requested change is visible and the subject stays easy to recognize.',
    anatomyTitle: 'What a reusable Nano Banana prompt usually contains',
    anatomyIntro: 'A reusable prompt makes the edit direction clear without burying the model in noise.',
    anatomy: [
      { title: 'Identity anchor', text: 'Say what must remain recognizable, such as face, product shape, clothing, or pose.' },
      { title: 'Visible change', text: 'Name the transformation the viewer should notice immediately.' },
      { title: 'Scene and style', text: 'Use lighting, background, lens feel, and color as support, not clutter.' },
      { title: 'Output purpose', text: 'Mention whether the result is for an ad, avatar, post, thumbnail, or reference image.' },
    ],
    trustTitle: 'Why these Nano Banana templates are source-backed',
    trustText:
      'The page is built around public prompt examples so you can inspect the source before adapting the format.',
    trustRules: sourceRules,
    mistakesTitle: 'Common Nano Banana remix mistakes',
    mistakesText: 'Weak remixes usually change the style but forget the subject.',
    mistakes: [
      { title: 'Not saying what must stay the same', text: 'Identity and product drift are easier when the prompt only talks about style.' },
      { title: 'Making the change too subtle', text: 'If the transformation is hard to see, the social post loses its reason to exist.' },
      { title: 'Copying the source too closely', text: 'Keep the structure, but change the purpose, subject, and visual context.' },
    ],
    faqTitle: 'Nano Banana prompt template FAQ',
    faqs: [
      { q: 'What are Nano Banana prompts good for?', a: 'They are useful for portraits, product visuals, social images, fashion edits, and quick visual experiments.' },
      { q: 'Can I use these examples for ads?', a: 'Yes. Choose a product-oriented template and replace the subject, material, setting, and final brand frame.' },
      { q: 'Why keep the X source?', a: 'The source helps you verify the prompt context and avoid relying on invented templates.' },
    ],
  },
  advertising: {
    slug: 'advertising',
    kind: 'category',
    filterValue: 'Advertising',
    defaultCategory: 'Advertising',
    title: 'AI Advertising Prompt Templates From Viral X Examples | Toolaze',
    description:
      'Copy source-backed AI advertising prompt templates from X for product ads, launch videos, packshots, food commercials, fashion promos, and social campaigns.',
    heroTitle: 'Create Product Ads From AI Prompt Templates That Already Worked On X',
    heroDescription:
      'Good AI ad prompts do more than make a product look pretty. They show a benefit, create a reveal, and end with a frame people can understand quickly. This page collects advertising templates from real X examples across image and video models.',
    howToTitle: 'How to use AI advertising prompt templates',
    howToIntro:
      'Start from the business goal, not the model name. A skincare ad, food commercial, app mockup, and fashion campaign need different prompt structure.',
    steps: [
      { title: 'Identify the product moment', text: 'Choose whether the ad should show texture, transformation, use case, appetite appeal, speed, luxury, or a clear packshot.' },
      { title: 'Copy the ad structure', text: 'Keep the source prompt rhythm: setup, reveal, detail shot, benefit, and final hero frame.' },
      { title: 'Replace brand-specific parts', text: 'Swap product, audience, material, setting, color palette, and safe final frame.' },
      { title: 'Test if it works without a caption', text: 'A strong ad result should communicate the product and benefit even before someone reads the post.' },
    ],
    remixTitle: 'Turn a viral prompt into a usable ad concept',
    remixText:
      'The point is not to copy another brand idea. Use the template to borrow pacing, clarity, and visual hierarchy, then rebuild it around your product.',
    patterns: [
      { label: 'For ecommerce', heading: 'Make the product unmistakable.', body: 'Keep shape, material, color, and final packshot clear enough for a buyer to understand instantly.' },
      { label: 'For social ads', heading: 'Lead with the hook.', body: 'Use a surprising reveal, tactile motion, or before-and-after contrast before the final brand frame.' },
      { label: 'For launches', heading: 'Show why this product exists.', body: 'A launch prompt should imply a problem, transformation, or aspiration rather than only showing a nice object.' },
    ],
    chooserTitle: 'Choose an advertising template by campaign goal',
    chooserIntro: 'Use the closest campaign goal before choosing a model.',
    chooserRows: [
      { goal: 'Product reveal', startWith: 'A hidden or quiet product moment that turns into a clean hero shot.', bestFor: 'Beauty, food, tech, fashion, home goods, and accessories.', replace: 'Product, reveal action, texture, lighting, and final packshot.', keep: 'The reveal rhythm and product clarity.' },
      { goal: 'Lifestyle ad', startWith: 'A person using the product in a believable setting.', bestFor: 'Fitness, travel, skincare, apparel, apps, and creator brands.', replace: 'User, location, product role, mood, and camera distance.', keep: 'The benefit-first story and natural context.' },
      { goal: 'Poster or static ad', startWith: 'A strong product image with readable hierarchy.', bestFor: 'Social posts, thumbnails, launch graphics, and campaign visuals.', replace: 'Headline, product, brand mood, background, and composition.', keep: 'Margins, contrast, and first-read focal point.' },
    ],
    answerTitle: 'What makes an AI advertising prompt useful?',
    answerText:
      'A useful AI advertising prompt gives the product a visible job. It says what the viewer should notice, how the product appears, what benefit or emotion is shown, and what the final frame should communicate. Templates from X are helpful because they show ad formats that creators already tested publicly.',
    anatomyTitle: 'What an AI ad prompt usually needs',
    anatomyIntro: 'Ads need clearer hierarchy than generic aesthetic prompts.',
    anatomy: [
      { title: 'Product role', text: 'Say whether the product is solving, revealing, transforming, satisfying, or elevating something.' },
      { title: 'Audience context', text: 'Add who the scene is for, such as buyer, creator, traveler, athlete, gamer, or skincare user.' },
      { title: 'Brand-safe ending', text: 'Describe a clean final frame that could work as a post, ad, or landing page visual.' },
      { title: 'Constraint control', text: 'Protect logos, packaging, readable text, hands, and product proportions when relevant.' },
    ],
    trustTitle: 'Why these advertising templates are source-backed',
    trustText:
      'Ad prompt examples are only worth studying when the source, prompt, and result context are traceable.',
    trustRules: sourceRules,
    mistakesTitle: 'Common AI ad prompt mistakes',
    mistakesText: 'Weak ads often look polished but fail to sell the idea.',
    mistakes: [
      { title: 'Only asking for cinematic style', text: 'A pretty shot is not an ad unless the product benefit is visible.' },
      { title: 'Forgetting the final frame', text: 'The ending should be usable as a thumbnail, post, or packshot.' },
      { title: 'Overloading the prompt with brand claims', text: 'Show the benefit visually instead of stuffing the image or video with text.' },
    ],
    faqTitle: 'AI advertising prompt template FAQ',
    faqs: [
      { q: 'Can I use these for ecommerce products?', a: 'Yes. Start with a product reveal or packshot template, then replace the product, material, setting, and final frame.' },
      { q: 'Do advertising prompts work for both image and video models?', a: 'Yes, but video prompts need motion and timing while image prompts need layout and hierarchy.' },
      { q: 'Why study X ad prompts?', a: 'They show public examples of what creators are testing, liking, saving, and remixing.' },
    ],
  },
  'fashion-beauty': {
    slug: 'fashion-beauty',
    kind: 'category',
    filterValue: 'Fashion & Beauty',
    defaultCategory: 'Fashion & Beauty',
    title: 'AI Fashion And Beauty Prompt Templates From Viral X Examples | Toolaze',
    description:
      'Browse source-backed AI fashion and beauty prompt templates from X for outfit changes, portraits, skincare ads, hair motion, styling clips, and social visuals.',
    heroTitle: 'Create Fashion And Beauty Visuals From Prompt Templates Shared On X',
    heroDescription:
      'Fashion and beauty prompts need identity consistency, fabric behavior, styling details, and a strong visual mood. This page collects real examples you can copy, adapt, and use for outfits, portraits, beauty ads, and transformation clips.',
    howToTitle: 'How to use fashion and beauty prompt templates',
    howToIntro:
      'The best fashion prompts protect identity and styling while making one visual change feel intentional.',
    steps: [
      { title: 'Pick the visual job', text: 'Decide whether you need an outfit change, beauty portrait, product ad, hair motion, or editorial scene.' },
      { title: 'Keep identity stable', text: 'Preserve face, body proportions, hair, skin tone, outfit anchor, or product packaging when the source prompt does so.' },
      { title: 'Replace styling details', text: 'Change fabric, color, accessories, makeup, pose, lighting, and location to fit your concept.' },
      { title: 'Check realism and taste', text: 'Review hands, fabric folds, face consistency, and whether the result feels like a real style direction.' },
    ],
    remixTitle: 'Use the template as a styling brief',
    remixText:
      'A fashion prompt works when the styling choices feel connected. Keep the structure, then build a coherent outfit, mood, and camera language.',
    patterns: [
      { label: 'For outfit changes', heading: 'Use a repeatable transition trigger.', body: 'Spin, sleeve flick, fan movement, hair touch, or camera wipe can organize multiple looks.' },
      { label: 'For beauty ads', heading: 'Let texture sell the product.', body: 'Skin glow, cream texture, water, light, and close-up detail can do more than slogans.' },
      { label: 'For portraits', heading: 'Protect the face before changing style.', body: 'Identity drift hurts fashion prompts quickly, so preserve facial features and expression first.' },
    ],
    chooserTitle: 'Choose a fashion and beauty template by output type',
    chooserIntro: 'Use the format closest to what you want to post.',
    chooserRows: [
      { goal: 'Outfit transformation', startWith: 'A clear transition action and timed look changes.', bestFor: 'TikTok-style reels, ancient costume changes, styling posts, and fashion edits.', replace: 'Wardrobe, fabric, accessories, transition trigger, and pose.', keep: 'Identity consistency and rhythm.' },
      { goal: 'Beauty product visual', startWith: 'A product texture or skin detail moment.', bestFor: 'Skincare, makeup, haircare, fragrance, and wellness ads.', replace: 'Product, skin tone, surface, ingredient cue, and lighting.', keep: 'Clean close-ups and product readability.' },
      { goal: 'Editorial portrait', startWith: 'A person, mood, outfit, and camera perspective.', bestFor: 'Avatars, portfolio shots, campaign visuals, and creator posts.', replace: 'Face anchor, wardrobe, location, lens feel, and color palette.', keep: 'Anatomy, expression, and styling coherence.' },
    ],
    answerTitle: 'What makes a fashion prompt reusable?',
    answerText:
      'A reusable fashion prompt separates the person, styling, motion, and camera. You can swap clothing, product, or setting while keeping identity, fabric behavior, and visual rhythm stable. That makes it easier to create multiple looks from one working format.',
    anatomyTitle: 'What a fashion and beauty prompt usually controls',
    anatomyIntro: 'Good fashion prompts are specific without becoming costume soup.',
    anatomy: [
      { title: 'Identity and body consistency', text: 'Keep face, body proportions, hair, and pose stable unless the change is intentional.' },
      { title: 'Wardrobe materials', text: 'Name fabric, fit, color, accessories, and how the clothing moves.' },
      { title: 'Beauty details', text: 'Control skin texture, makeup, hair, product texture, and lighting.' },
      { title: 'Camera and platform', text: 'Use medium shot, close-up, mirror selfie, editorial portrait, or vertical reel framing as needed.' },
    ],
    trustTitle: 'Why these fashion and beauty templates are source-backed',
    trustText:
      'Fashion prompts are easy to over-polish. Source-backed examples make it easier to see the original prompt and social context.',
    trustRules: sourceRules,
    mistakesTitle: 'Common fashion prompt mistakes',
    mistakesText: 'The fastest way to weaken a fashion prompt is to ignore consistency.',
    mistakes: [
      { title: 'Changing every detail at once', text: 'Keep identity and camera stable when testing a new outfit or product style.' },
      { title: 'Ignoring fabric behavior', text: 'Clothing should drape, flutter, stretch, or fold in a way that matches the movement.' },
      { title: 'Letting beauty details become plastic', text: 'Natural skin texture and realistic lighting usually look better than over-smoothed polish.' },
    ],
    faqTitle: 'Fashion and beauty prompt template FAQ',
    faqs: [
      { q: 'Can these templates create outfit change videos?', a: 'Yes. Choose a transformation template and replace the wardrobe, transition action, and styling details.' },
      { q: 'Can I use them for beauty ads?', a: 'Yes. Start from a product or close-up template, then describe texture, lighting, skin detail, and final product frame.' },
      { q: 'What should I protect in a fashion prompt?', a: 'Protect identity, body proportions, fabric logic, accessories, and the camera distance that makes the look readable.' },
    ],
  },
  'film-trailer': {
    slug: 'film-trailer',
    kind: 'category',
    filterValue: 'Film & Trailer',
    defaultCategory: 'Film & Trailer',
    title: 'AI Film And Trailer Prompt Templates From Viral X Examples | Toolaze',
    description:
      'Copy source-backed AI film and trailer prompt templates from X for cinematic shots, horror scenes, fantasy worlds, action beats, and short story clips.',
    heroTitle: 'Create Cinematic AI Scenes From Film And Trailer Prompt Templates',
    heroDescription:
      'Film and trailer prompts need more than the word cinematic. They need a setup, camera behavior, escalation, atmosphere, and a final shot that makes people want the next scene. This page collects source-backed examples from X for that kind of work.',
    howToTitle: 'How to use film and trailer prompt templates',
    howToIntro:
      'Treat each prompt like a tiny shot list. The clearer the scene beat, the better the model can stage it.',
    steps: [
      { title: 'Start with genre and setting', text: 'Choose horror, fantasy, action, sci-fi, creature scene, or grounded realism before changing details.' },
      { title: 'Keep the shot progression', text: 'A good trailer prompt often moves from calm setup to threat, reveal, impact, or cliffhanger.' },
      { title: 'Replace the world details', text: 'Change location, character, creature, era, lighting, conflict, and final reveal.' },
      { title: 'Make the ending memorable', text: 'The last frame should feel like a trailer beat, not a random pause.' },
    ],
    remixTitle: 'Use the prompt as a compact scene blueprint',
    remixText:
      'The value of a trailer template is the dramatic order. Keep the tension curve, then write your own world around it.',
    patterns: [
      { label: 'For horror', heading: 'Delay the reveal just enough.', body: 'Start with a normal detail, then introduce movement, scale, shadow, or sound before the creature or threat appears.' },
      { label: 'For action', heading: 'Stage the camera around impact.', body: 'Action prompts need clear spatial logic, not just explosions and motion words.' },
      { label: 'For fantasy', heading: 'Make the world readable fast.', body: 'Give the model a few strong anchors: terrain, costume, creature, magic behavior, and light.' },
    ],
    chooserTitle: 'Choose a film and trailer template by story beat',
    chooserIntro: 'Start with the kind of scene you want viewers to feel.',
    chooserRows: [
      { goal: 'Creature reveal', startWith: 'A quiet environment and one unnatural movement.', bestFor: 'Horror, monster, desert, forest, sci-fi, and survival clips.', replace: 'Creature, setting, scale, lighting, and final reveal.', keep: 'Suspense curve and reveal timing.' },
      { goal: 'Action sequence', startWith: 'One conflict with clear direction and camera position.', bestFor: 'Fights, chases, explosions, battle scenes, and game-style clips.', replace: 'Characters, weapons, location, camera, and impact moment.', keep: 'Spatial clarity and escalation.' },
      { goal: 'Worldbuilding shot', startWith: 'A striking location with one moving subject.', bestFor: 'Fantasy, anime, historical, sci-fi, and cinematic landscapes.', replace: 'World, costume, creature, weather, and lens feel.', keep: 'Atmosphere and first-read visual anchor.' },
    ],
    answerTitle: 'What makes an AI trailer prompt work?',
    answerText:
      'An AI trailer prompt works when it gives the model a short dramatic path: where the scene begins, what changes, how the camera follows it, and what final frame sells the story. Source-backed examples help you study those beats without starting from empty cinematic adjectives.',
    anatomyTitle: 'What a film and trailer prompt usually contains',
    anatomyIntro: 'Cinematic prompts need structure, not just style.',
    anatomy: [
      { title: 'Genre promise', text: 'Name the genre, realism level, era, and mood so the scene has a clear direction.' },
      { title: 'Shot order', text: 'Describe the setup, escalation, reveal, and final image in a compact sequence.' },
      { title: 'Camera behavior', text: 'Use low angle, tracking, handheld, dolly, close-up, wide shot, or POV only when it serves the scene.' },
      { title: 'Atmospheric control', text: 'Lighting, weather, dust, smoke, sound cues, and scale help sell the trailer feel.' },
    ],
    trustTitle: 'Why these film and trailer templates are source-backed',
    trustText:
      'Cinematic prompt examples often sound impressive but produce weak scenes. Source-backed examples let you inspect prompts people actually shared.',
    trustRules: sourceRules,
    mistakesTitle: 'Common film prompt mistakes',
    mistakesText: 'Most weak cinematic prompts are too vague or too crowded.',
    mistakes: [
      { title: 'Using cinematic as the whole direction', text: 'Add camera, setting, action, and final frame instead of relying on one style word.' },
      { title: 'Adding too many characters', text: 'Short AI scenes work better with one clear subject or conflict.' },
      { title: 'Skipping the reveal beat', text: 'A trailer prompt needs a reason for the viewer to keep watching.' },
    ],
    faqTitle: 'Film and trailer prompt template FAQ',
    faqs: [
      { q: 'Can these prompts make short AI trailers?', a: 'Yes. They are best used as short scene templates, then expanded with your own setting, conflict, and ending.' },
      { q: 'Do I need advanced film terms?', a: 'No. Start with simple shot order and one camera instruction. Add film terms only when they help the scene.' },
      { q: 'Why use source-backed trailer prompts?', a: 'They show how creators structure cinematic examples publicly, including the prompt language and social context.' },
    ],
  },
}
