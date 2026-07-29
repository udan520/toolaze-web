import {
  AI_IMAGE_GENERATOR_GROUPS,
  AI_IMAGE_GENERATOR_MODEL_OPTIONS,
} from './ai-image-generator-config'
import {
  AI_VIDEO_GENERATOR_MODEL_GROUPS,
  AI_VIDEO_GENERATOR_MODEL_OPTIONS,
} from './ai-video-generator-config'

type LocaleTemplate = {
  quality: string
  medium: string
  high: string
  imageDescription: (name: string) => string
  videoDescription: (name: string) => string
  imageGroupDescription: (name: string) => string
  videoGroupDescription: (name: string) => string
  logoAlt: (name: string) => string
}

const templates: Record<string, LocaleTemplate> = {
  en: {
    quality: 'Quality',
    medium: 'Medium',
    high: 'High',
    imageDescription: (name) => `Generate and edit images with ${name}.`,
    videoDescription: (name) => `Create videos with the text and image workflows available in ${name}.`,
    imageGroupDescription: (name) => `Image generation and editing models from ${name}.`,
    videoGroupDescription: (name) => `Video generation models from ${name}.`,
    logoAlt: (name) => `${name} logo`,
  },
  de: {
    quality: 'Qualität',
    medium: 'Mittel',
    high: 'Hoch',
    imageDescription: (name) => `Bilder mit ${name} erstellen und bearbeiten.`,
    videoDescription: (name) => `Videos mit den in ${name} verfügbaren Text- und Bild-Workflows erstellen.`,
    imageGroupDescription: (name) => `Modelle von ${name} für Bilderstellung und -bearbeitung.`,
    videoGroupDescription: (name) => `Videogenerierungsmodelle von ${name}.`,
    logoAlt: (name) => `Logo von ${name}`,
  },
  es: {
    quality: 'Calidad',
    medium: 'Media',
    high: 'Alta',
    imageDescription: (name) => `Crea y edita imágenes con ${name}.`,
    videoDescription: (name) => `Crea vídeos con los flujos de texto e imagen disponibles en ${name}.`,
    imageGroupDescription: (name) => `Modelos de ${name} para generar y editar imágenes.`,
    videoGroupDescription: (name) => `Modelos de generación de vídeo de ${name}.`,
    logoAlt: (name) => `Logotipo de ${name}`,
  },
  fr: {
    quality: 'Qualité',
    medium: 'Moyenne',
    high: 'Élevée',
    imageDescription: (name) => `Créez et modifiez des images avec ${name}.`,
    videoDescription: (name) => `Créez des vidéos avec les flux texte et image disponibles dans ${name}.`,
    imageGroupDescription: (name) => `Modèles ${name} de génération et de retouche d’images.`,
    videoGroupDescription: (name) => `Modèles de génération vidéo de ${name}.`,
    logoAlt: (name) => `Logo ${name}`,
  },
  it: {
    quality: 'Qualità',
    medium: 'Media',
    high: 'Alta',
    imageDescription: (name) => `Crea e modifica immagini con ${name}.`,
    videoDescription: (name) => `Crea video con i flussi di testo e immagine disponibili in ${name}.`,
    imageGroupDescription: (name) => `Modelli ${name} per generare e modificare immagini.`,
    videoGroupDescription: (name) => `Modelli di generazione video di ${name}.`,
    logoAlt: (name) => `Logo di ${name}`,
  },
  ja: {
    quality: '品質',
    medium: '標準',
    high: '高品質',
    imageDescription: (name) => `${name}で画像を生成・編集します。`,
    videoDescription: (name) => `${name}で利用できるテキスト・画像ワークフローから動画を生成します。`,
    imageGroupDescription: (name) => `${name}の画像生成・編集モデル。`,
    videoGroupDescription: (name) => `${name}の動画生成モデル。`,
    logoAlt: (name) => `${name}のロゴ`,
  },
  ko: {
    quality: '품질',
    medium: '보통',
    high: '높음',
    imageDescription: (name) => `${name}으로 이미지를 생성하고 편집합니다.`,
    videoDescription: (name) => `${name}에서 제공하는 텍스트 및 이미지 워크플로로 동영상을 생성합니다.`,
    imageGroupDescription: (name) => `${name}의 이미지 생성 및 편집 모델입니다.`,
    videoGroupDescription: (name) => `${name}의 동영상 생성 모델입니다.`,
    logoAlt: (name) => `${name} 로고`,
  },
  pt: {
    quality: 'Qualidade',
    medium: 'Média',
    high: 'Alta',
    imageDescription: (name) => `Crie e edite imagens com ${name}.`,
    videoDescription: (name) => `Crie vídeos com os fluxos de texto e imagem disponíveis no ${name}.`,
    imageGroupDescription: (name) => `Modelos do ${name} para gerar e editar imagens.`,
    videoGroupDescription: (name) => `Modelos de geração de vídeo do ${name}.`,
    logoAlt: (name) => `Logótipo do ${name}`,
  },
  'zh-TW': {
    quality: '品質',
    medium: '中等',
    high: '高',
    imageDescription: (name) => `使用 ${name} 生成與編輯圖片。`,
    videoDescription: (name) => `使用 ${name} 提供的文字與圖片工作流程生成影片。`,
    imageGroupDescription: (name) => `${name} 的圖片生成與編輯模型。`,
    videoGroupDescription: (name) => `${name} 的影片生成模型。`,
    logoAlt: (name) => `${name} 標誌`,
  },
}

type SelectorCopy = {
  badges?: Record<string, string>
  image?: {
    quality?: string
    qualityOptions?: Record<string, string>
    groups?: Record<string, { description?: string; logoAlt?: string }>
    models?: Record<string, { description?: string }>
  }
  video?: {
    groups?: Record<string, { description?: string; logoAlt?: string }>
    models?: Record<string, { description?: string; logoAlt?: string }>
  }
}

export function getLocalizedModelSelectorCopy(
  locale: string,
  existing: SelectorCopy | undefined,
) {
  const template = templates[locale] || templates.en
  const isEnglish = locale === 'en'
  const imageGroups = Object.fromEntries(AI_IMAGE_GENERATOR_GROUPS.map((group) => [
    group.id,
    {
      description: existing?.image?.groups?.[group.id]?.description ||
        (isEnglish ? group.description : template.imageGroupDescription(group.name)),
      logoAlt: existing?.image?.groups?.[group.id]?.logoAlt ||
        (isEnglish ? group.logoAlt : template.logoAlt(group.name)),
    },
  ]))
  const imageModels = Object.fromEntries(
    AI_IMAGE_GENERATOR_MODEL_OPTIONS
      .filter(({ id }) => id !== 'grok-video-1-5')
      .map((model) => [
        model.id,
        {
          description: existing?.image?.models?.[model.id]?.description ||
            (isEnglish ? model.description : template.imageDescription(model.name)),
        },
      ]),
  )
  const videoGroups = Object.fromEntries(AI_VIDEO_GENERATOR_MODEL_GROUPS.map((group) => [
    group.id,
    {
      description: existing?.video?.groups?.[group.id]?.description ||
        template.videoGroupDescription(group.name),
      logoAlt: existing?.video?.groups?.[group.id]?.logoAlt ||
        (isEnglish ? group.logoAlt : template.logoAlt(group.name)),
    },
  ]))
  const videoModels = Object.fromEntries(AI_VIDEO_GENERATOR_MODEL_OPTIONS.map((model) => [
    model.id,
    {
      description: existing?.video?.models?.[model.id]?.description ||
        (isEnglish ? model.description : template.videoDescription(model.name)),
      logoAlt: existing?.video?.models?.[model.id]?.logoAlt ||
        (isEnglish ? model.logoAlt : template.logoAlt(model.vendor)),
    },
  ]))

  return {
    badges: existing?.badges || { hot: 'Hot', new: 'New' },
    image: {
      quality: existing?.image?.quality || template.quality,
      qualityOptions: {
        medium: existing?.image?.qualityOptions?.medium || template.medium,
        high: existing?.image?.qualityOptions?.high || template.high,
      },
      groups: imageGroups,
      models: imageModels,
    },
    video: {
      groups: videoGroups,
      models: videoModels,
    },
  }
}
