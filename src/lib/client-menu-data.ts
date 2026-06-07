export type ClientMenuItem = {
  slug: string
  title: string
  href: string
}

type EmojiTranslations = {
  emojiMenu?: Record<string, string>
}

type MenuTitleItem = {
  slug: string
  title: string
  titles?: Record<string, string>
}

const menuItemTitles: Record<string, Record<string, string>> = {
  'compress-jpg': {
    'zh-TW': '壓縮 JPG',
    de: 'JPG komprimieren',
    ja: 'JPGを圧縮',
    es: 'Comprimir JPG',
    pt: 'Comprimir JPG',
    fr: 'Compresser JPG',
    ko: 'JPG 압축',
    it: 'Comprimi JPG',
  },
  'compress-png': {
    'zh-TW': '壓縮 PNG',
    de: 'PNG komprimieren',
    ja: 'PNGを圧縮',
    es: 'Comprimir PNG',
    pt: 'Comprimir PNG',
    fr: 'Compresser PNG',
    ko: 'PNG 압축',
    it: 'Comprimi PNG',
  },
  'compress-webp': {
    'zh-TW': '壓縮 WebP',
    de: 'WebP komprimieren',
    ja: 'WebPを圧縮',
    es: 'Comprimir WebP',
    pt: 'Comprimir WebP',
    fr: 'Compresser WebP',
    ko: 'WebP 압축',
    it: 'Comprimi WebP',
  },
  'compress-image': {
    'zh-TW': '壓縮圖片',
    de: 'Bild komprimieren',
    ja: '画像を圧縮',
    es: 'Comprimir imagen',
    pt: 'Comprimir imagem',
    fr: 'Compresser une image',
    ko: '이미지 압축',
    it: 'Comprimi immagine',
  },
  'batch-compress': {
    'zh-TW': '批次壓縮',
    de: 'Stapelkomprimierung',
    ja: '一括圧縮',
    es: 'Compresión por lotes',
    pt: 'Compressão em lote',
    fr: 'Compression par lot',
    ko: '일괄 압축',
    it: 'Compressione batch',
  },
  'jpg-to-png': {
    'zh-TW': 'JPG 轉 PNG',
    de: 'JPG zu PNG',
    ja: 'JPGからPNGへ',
    es: 'JPG a PNG',
    pt: 'JPG para PNG',
    fr: 'JPG vers PNG',
    ko: 'JPG에서 PNG로',
    it: 'JPG in PNG',
  },
  'png-to-jpg': {
    'zh-TW': 'PNG 轉 JPG',
    de: 'PNG zu JPG',
    ja: 'PNGからJPGへ',
    es: 'PNG a JPG',
    pt: 'PNG para JPG',
    fr: 'PNG vers JPG',
    ko: 'PNG에서 JPG로',
    it: 'PNG in JPG',
  },
  'webp-to-jpg': {
    'zh-TW': 'WebP 轉 JPG',
    de: 'WebP zu JPG',
    ja: 'WebPからJPGへ',
    es: 'WebP a JPG',
    pt: 'WebP para JPG',
    fr: 'WebP vers JPG',
    ko: 'WebP에서 JPG로',
    it: 'WebP in JPG',
  },
  'webp-to-png': {
    'zh-TW': 'WebP 轉 PNG',
    de: 'WebP zu PNG',
    ja: 'WebPからPNGへ',
    es: 'WebP a PNG',
    pt: 'WebP para PNG',
    fr: 'WebP vers PNG',
    ko: 'WebP에서 PNG로',
    it: 'WebP in PNG',
  },
  'png-to-webp': {
    'zh-TW': 'PNG 轉 WebP',
    de: 'PNG zu WebP',
    ja: 'PNGからWebPへ',
    es: 'PNG a WebP',
    pt: 'PNG para WebP',
    fr: 'PNG vers WebP',
    ko: 'PNG에서 WebP로',
    it: 'PNG in WebP',
  },
  'jpg-to-webp': {
    'zh-TW': 'JPG 轉 WebP',
    de: 'JPG zu WebP',
    ja: 'JPGからWebPへ',
    es: 'JPG a WebP',
    pt: 'JPG para WebP',
    fr: 'JPG vers WebP',
    ko: 'JPG에서 WebP로',
    it: 'JPG in WebP',
  },
  'heic-to-jpg': {
    'zh-TW': 'HEIC 轉 JPG',
    de: 'HEIC zu JPG',
    ja: 'HEICからJPGへ',
    es: 'HEIC a JPG',
    pt: 'HEIC para JPG',
    fr: 'HEIC vers JPG',
    ko: 'HEIC에서 JPG로',
    it: 'HEIC in JPG',
  },
  'heic-to-png': {
    'zh-TW': 'HEIC 轉 PNG',
    de: 'HEIC zu PNG',
    ja: 'HEICからPNGへ',
    es: 'HEIC a PNG',
    pt: 'HEIC para PNG',
    fr: 'HEIC vers PNG',
    ko: 'HEIC에서 PNG로',
    it: 'HEIC in PNG',
  },
  cursive: {
    'zh-TW': '草寫字體',
    de: 'Schreibschrift',
    ja: '筆記体フォント',
    es: 'Fuente cursiva',
    pt: 'Fonte cursiva',
    fr: 'Police cursive',
    ko: '필기체 글꼴',
    it: 'Scrittura corsiva',
  },
  fancy: {
    'zh-TW': '花體字體',
    de: 'Zierschrift',
    ja: 'デコ文字',
    es: 'Fuente decorativa',
    pt: 'Fonte decorativa',
    fr: 'Police fantaisie',
    ko: '장식 글꼴',
    it: 'Font decorativo',
  },
  bold: {
    'zh-TW': '粗體字體',
    de: 'Fette Schrift',
    ja: '太字フォント',
    es: 'Fuente en negrita',
    pt: 'Fonte em negrito',
    fr: 'Police en gras',
    ko: '굵은 글꼴',
    it: 'Font grassetto',
  },
  tattoo: {
    'zh-TW': '刺青字體',
    de: 'Tattoo-Schrift',
    ja: 'タトゥーフォント',
    es: 'Fuente de tatuaje',
    pt: 'Fonte de tatuagem',
    fr: 'Police tatouage',
    ko: '타투 글꼴',
    it: 'Font tatuaggio',
  },
  cool: {
    'zh-TW': '酷炫字體',
    de: 'Coole Schrift',
    ja: 'クールフォント',
    es: 'Fuente cool',
    pt: 'Fonte estilosa',
    fr: 'Police stylée',
    ko: '멋진 글꼴',
    it: 'Font cool',
  },
  instagram: {
    'zh-TW': 'Instagram 字體',
    de: 'Instagram-Schrift',
    ja: 'Instagramフォント',
    es: 'Fuente para Instagram',
    pt: 'Fonte para Instagram',
    fr: 'Police Instagram',
    ko: '인스타그램 글꼴',
    it: 'Font Instagram',
  },
  italic: {
    'zh-TW': '斜體字體',
    de: 'Kursive Schrift',
    ja: '斜体フォント',
    es: 'Fuente en cursiva',
    pt: 'Fonte itálica',
    fr: 'Police italique',
    ko: '기울임 글꼴',
    it: 'Font corsivo',
  },
  gothic: {
    'zh-TW': '哥德字體',
    de: 'Gotische Schrift',
    ja: 'ゴシックフォント',
    es: 'Fuente gótica',
    pt: 'Fonte gótica',
    fr: 'Police gothique',
    ko: '고딕 글꼴',
    it: 'Font gotico',
  },
}

function menuItem(slug: string, title: string): MenuTitleItem {
  return {
    slug,
    title,
    titles: menuItemTitles[slug],
  }
}

const imageCompressorItems: MenuTitleItem[] = [
  menuItem('compress-jpg', 'Compress JPG'),
  menuItem('compress-png', 'Compress PNG'),
  menuItem('compress-webp', 'Compress WebP'),
  menuItem('compress-image', 'Compress Image'),
  menuItem('batch-compress', 'Batch Compress'),
]

const imageConverterItems: MenuTitleItem[] = [
  menuItem('jpg-to-png', 'JPG to PNG'),
  menuItem('png-to-jpg', 'PNG to JPG'),
  menuItem('webp-to-jpg', 'WebP to JPG'),
  menuItem('webp-to-png', 'WebP to PNG'),
  menuItem('png-to-webp', 'PNG to WebP'),
  menuItem('jpg-to-webp', 'JPG to WebP'),
  menuItem('heic-to-jpg', 'HEIC to JPG'),
  menuItem('heic-to-png', 'HEIC to PNG'),
]

const fontGeneratorItems: MenuTitleItem[] = [
  menuItem('cursive', 'Cursive'),
  menuItem('fancy', 'Fancy'),
  menuItem('bold', 'Bold'),
  menuItem('tattoo', 'Tattoo'),
  menuItem('cool', 'Cool'),
  menuItem('instagram', 'Instagram'),
  menuItem('italic', 'Italic'),
  menuItem('gothic', 'Gothic'),
]

export const emojiMenuFallbackItems = [
  { slug: 'crying-copy-and-paste', title: 'Crying Emoji Copy and Paste' },
  { slug: 'cross-copy-and-paste', title: 'Cross Emoji Copy and Paste' },
  { slug: 'adults-only-copy-and-paste', title: 'Adults Only Emoji Copy and Paste' },
  { slug: 'fire-copy-and-paste', title: 'Fire Emoji Copy and Paste' },
  { slug: 'birthday-copy-and-paste', title: 'Birthday Emoji Copy and Paste' },
  { slug: 'cat-copy-and-paste', title: 'Cat Emoji Copy and Paste' },
]

function localizeHref(href: string, locale: string) {
  if (href.startsWith('http')) return href
  if (locale === 'en') return href
  if (href.startsWith(`/${locale}`)) return href
  return `/${locale}${href}`
}

function getEmojiTitle(translations: EmojiTranslations, slug: string) {
  return translations.emojiMenu?.[slug]
    || emojiMenuFallbackItems.find((item) => item.slug === slug)?.title
    || slug
}

function getMenuTitle(item: MenuTitleItem, locale: string) {
  return item.titles?.[locale] || item.title
}

export function getClientMenuItems(
  tool: 'image-compressor' | 'image-converter' | 'font-generator' | 'emoji-copy-and-paste',
  locale: string,
  translations: EmojiTranslations = {}
): ClientMenuItem[] {
  if (tool === 'image-compressor') {
    return imageCompressorItems.map((item) => ({
      slug: item.slug,
      title: getMenuTitle(item, locale),
      href: localizeHref(`/image-compressor/${item.slug}`, locale),
    }))
  }

  if (tool === 'image-converter') {
    return imageConverterItems.map((item) => ({
      slug: item.slug,
      title: getMenuTitle(item, locale),
      href: localizeHref(`/image-converter/${item.slug}`, locale),
    }))
  }

  if (tool === 'font-generator') {
    return fontGeneratorItems.map((item) => ({
      slug: item.slug,
      title: getMenuTitle(item, locale),
      href: localizeHref(`/font-generator/${item.slug}`, locale),
    }))
  }

  return emojiMenuFallbackItems.map((item) => ({
    slug: item.slug,
    title: getEmojiTitle(translations, item.slug),
    href: localizeHref(`/emoji-copy-and-paste/${item.slug}`, locale),
  }))
}
