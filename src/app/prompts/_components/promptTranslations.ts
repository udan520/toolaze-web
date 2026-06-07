import fs from 'node:fs'
import path from 'node:path'
import type { PromptGalleryCopy } from '@/components/prompts/PromptGallery'
import type { PromptLandingConfig } from './promptLandingConfigs'

export type PromptIndexTranslations = {
  promptLibrary: {
    metadataTitle: string
    metadataDescription: string
    ogTitle: string
    ogDescription: string
    badge: string
    heroTitle: string
    heroDescription: string
    liveIndex: string
    statsTemplates: string
    statsLikes: string
    statsViews: string
  }
  landingUi: PromptLandingUiCopy
  gallery: Partial<PromptGalleryCopy>
}

export type PromptLandingUiCopy = {
  back: string
  browse: string
  home: string
  prompts: string
  goal: string
  startWith: string
  bestFor: string
  replace: string
  keep: string
  watchThis: string
}

const dataRoot = path.join(process.cwd(), 'src', 'data')

function readJsonFile<T>(filePath: string): T | null {
  try {
    if (!fs.existsSync(filePath)) return null
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T
  } catch {
    return null
  }
}

function localeFile(locale: string, ...segments: string[]) {
  return path.join(dataRoot, locale, ...segments)
}

export function getPromptIndexTranslations(locale = 'en'): PromptIndexTranslations {
  const localized = readJsonFile<PromptIndexTranslations>(localeFile(locale, 'prompts.json'))
  if (localized) return localized

  return (
    readJsonFile<PromptIndexTranslations>(localeFile('en', 'prompts.json')) || {
      promptLibrary: {
        metadataTitle: 'AI Image & Video Prompt Templates | Seedance, Kling, GPT Image 2',
        metadataDescription: 'Copy source-backed AI prompt templates from X.',
        ogTitle: 'AI Image & Video Prompt Templates | Toolaze',
        ogDescription: 'Browse source-backed AI image and video prompts from X.',
        badge: 'Prompts',
        heroTitle: 'AI Image And Video Prompt Templates From X',
        heroDescription: 'Copy source-backed prompts by model, use case, and performance.',
        liveIndex: 'Live Index',
        statsTemplates: 'Templates',
        statsLikes: 'Likes',
        statsViews: 'Views',
      },
      landingUi: {
        back: 'Back to Prompt Library',
        browse: 'Browse templates',
        home: 'Home',
        prompts: 'Prompts',
        goal: 'Goal',
        startWith: 'Start with',
        bestFor: 'Best for',
        replace: 'Replace',
        keep: 'Keep',
        watchThis: 'Watch this',
      },
      gallery: {},
    }
  )
}

export function getPromptLandingTranslation(slug: string, locale = 'en'): PromptLandingConfig | null {
  const localized = readJsonFile<PromptLandingConfig>(localeFile(locale, 'prompts', `${slug}.json`))
  if (localized) return localized
  return readJsonFile<PromptLandingConfig>(localeFile('en', 'prompts', `${slug}.json`))
}

export function getPromptGalleryCopy(locale = 'en'): Partial<PromptGalleryCopy> {
  return getPromptIndexTranslations(locale).gallery
}

const categoryLabels: Record<string, Record<string, string>> = {
  de: {
    'Film & Trailer': 'Film & Trailer',
    Advertising: 'Werbung',
    'Character & Portrait': 'Charakter & Porträt',
    'Infographic & Education': 'Infografik & Bildung',
    'UI & Design': 'UI & Design',
    'Fashion & Beauty': 'Mode & Beauty',
    'Social Media & Meme': 'Social Media & Meme',
    'Game & Action': 'Game & Action',
    'Fantasy & Anime': 'Fantasy & Anime',
    'Lifestyle & Vlog': 'Lifestyle & Vlog',
    'Art & Illustration': 'Kunst & Illustration',
    'Culture & History': 'Kultur & Geschichte',
    'Workflow & Utility': 'Workflow & Utility',
    General: 'Allgemein',
  },
  ja: {
    'Film & Trailer': '映画・予告編',
    Advertising: '広告',
    'Character & Portrait': 'キャラクター・ポートレート',
    'Infographic & Education': 'インフォグラフィック・教育',
    'UI & Design': 'UI・デザイン',
    'Fashion & Beauty': 'ファッション・ビューティー',
    'Social Media & Meme': 'SNS・ミーム',
    'Game & Action': 'ゲーム・アクション',
    'Fantasy & Anime': 'ファンタジー・アニメ',
    'Lifestyle & Vlog': 'ライフスタイル・Vlog',
    'Art & Illustration': 'アート・イラスト',
    'Culture & History': '文化・歴史',
    'Workflow & Utility': 'ワークフロー・実用',
    General: '一般',
  },
  es: {
    'Film & Trailer': 'Cine y tráiler',
    Advertising: 'Publicidad',
    'Character & Portrait': 'Personaje y retrato',
    'Infographic & Education': 'Infografía y educación',
    'UI & Design': 'UI y diseño',
    'Fashion & Beauty': 'Moda y belleza',
    'Social Media & Meme': 'Redes sociales y meme',
    'Game & Action': 'Juego y acción',
    'Fantasy & Anime': 'Fantasía y anime',
    'Lifestyle & Vlog': 'Estilo de vida y vlog',
    'Art & Illustration': 'Arte e ilustración',
    'Culture & History': 'Cultura e historia',
    'Workflow & Utility': 'Flujo de trabajo y utilidad',
    General: 'General',
  },
  'zh-TW': {
    'Film & Trailer': '電影與預告片',
    Advertising: '廣告',
    'Character & Portrait': '角色與肖像',
    'Infographic & Education': '資訊圖表與教育',
    'UI & Design': 'UI 與設計',
    'Fashion & Beauty': '時尚與美妝',
    'Social Media & Meme': '社群與迷因',
    'Game & Action': '遊戲與動作',
    'Fantasy & Anime': '奇幻與動漫',
    'Lifestyle & Vlog': '生活風格與 Vlog',
    'Art & Illustration': '藝術與插畫',
    'Culture & History': '文化與歷史',
    'Workflow & Utility': '工作流程與工具',
    General: '一般',
  },
  pt: {
    'Film & Trailer': 'Filme e trailer',
    Advertising: 'Publicidade',
    'Character & Portrait': 'Personagem e retrato',
    'Infographic & Education': 'Infográfico e educação',
    'UI & Design': 'UI e design',
    'Fashion & Beauty': 'Moda e beleza',
    'Social Media & Meme': 'Redes sociais e meme',
    'Game & Action': 'Jogo e ação',
    'Fantasy & Anime': 'Fantasia e anime',
    'Lifestyle & Vlog': 'Lifestyle e vlog',
    'Art & Illustration': 'Arte e ilustração',
    'Culture & History': 'Cultura e história',
    'Workflow & Utility': 'Fluxo de trabalho e utilidade',
    General: 'Geral',
  },
  fr: {
    'Film & Trailer': 'Film et bande-annonce',
    Advertising: 'Publicité',
    'Character & Portrait': 'Personnage et portrait',
    'Infographic & Education': 'Infographie et éducation',
    'UI & Design': 'UI et design',
    'Fashion & Beauty': 'Mode et beauté',
    'Social Media & Meme': 'Réseaux sociaux et meme',
    'Game & Action': 'Jeu et action',
    'Fantasy & Anime': 'Fantasy et anime',
    'Lifestyle & Vlog': 'Lifestyle et vlog',
    'Art & Illustration': 'Art et illustration',
    'Culture & History': 'Culture et histoire',
    'Workflow & Utility': 'Workflow et utilitaire',
    General: 'Général',
  },
  ko: {
    'Film & Trailer': '영화·트레일러',
    Advertising: '광고',
    'Character & Portrait': '캐릭터·초상화',
    'Infographic & Education': '인포그래픽·교육',
    'UI & Design': 'UI·디자인',
    'Fashion & Beauty': '패션·뷰티',
    'Social Media & Meme': '소셜 미디어·밈',
    'Game & Action': '게임·액션',
    'Fantasy & Anime': '판타지·애니메이션',
    'Lifestyle & Vlog': '라이프스타일·브이로그',
    'Art & Illustration': '아트·일러스트',
    'Culture & History': '문화·역사',
    'Workflow & Utility': '워크플로우·유틸리티',
    General: '일반',
  },
  it: {
    'Film & Trailer': 'Film e trailer',
    Advertising: 'Pubblicità',
    'Character & Portrait': 'Personaggio e ritratto',
    'Infographic & Education': 'Infografica e formazione',
    'UI & Design': 'UI e design',
    'Fashion & Beauty': 'Moda e beauty',
    'Social Media & Meme': 'Social media e meme',
    'Game & Action': 'Gioco e azione',
    'Fantasy & Anime': 'Fantasy e anime',
    'Lifestyle & Vlog': 'Lifestyle e vlog',
    'Art & Illustration': 'Arte e illustrazione',
    'Culture & History': 'Cultura e storia',
    'Workflow & Utility': 'Workflow e utility',
    General: 'Generale',
  },
}

export function getPromptCategoryLabels(locale = 'en'): Record<string, string> {
  return categoryLabels[locale] || {}
}
