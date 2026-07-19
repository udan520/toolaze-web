export type PricingPlan = {
  id: string
  name: string
  price: string
  credits: number
  baseCredits: number
  bonusCredits: number
  billingLabel: string
  validity: string
  checkoutEnabled: boolean
  badge?: string
}

export type PricingFaqItem = {
  question: string
  answer: string
}

export type PricingCheckoutCopy = {
  buyCredits: string
  openingCheckout: string
  checkoutComingSoon: string
  validityNote: string
  signInRequired: string
  checkoutFailed: string
}

export type PricingPageCopy = {
  metadataTitle: string
  metadataDescription: string
  breadcrumbHome: string
  breadcrumbPricing: string
  title: string
  subtitle: string
  mostPopularBadge: string
  bonusPercentLabel: string
  bonusLabel: string
  creditsIncludedLabel: string
  pricePerCreditUnit: string
  faqTitle: string
  faqIntro: string
  faq: PricingFaqItem[]
  supportPrefix: string
  supportLink: string
  supportSuffix: string
  checkout: PricingCheckoutCopy
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$1.99',
    credits: 200,
    baseCredits: 200,
    bonusCredits: 0,
    billingLabel: 'One-time purchase',
    validity: 'Credits valid for 12 months',
    checkoutEnabled: true,
  },
  {
    id: 'creator',
    name: 'Creator',
    price: '$8.99',
    credits: 1000,
    baseCredits: 900,
    bonusCredits: 100,
    billingLabel: 'One-time purchase',
    validity: 'Credits valid for 12 months',
    checkoutEnabled: true,
    badge: 'Most Popular',
  },
  {
    id: 'plus',
    name: 'Plus',
    price: '$39.99',
    credits: 5000,
    baseCredits: 4000,
    bonusCredits: 1000,
    billingLabel: 'One-time purchase',
    validity: 'Credits valid for 12 months',
    checkoutEnabled: true,
  },
  {
    id: 'studio',
    name: 'Studio',
    price: '$69.99',
    credits: 10000,
    baseCredits: 7000,
    bonusCredits: 3000,
    billingLabel: 'One-time purchase',
    validity: 'Credits valid for 12 months',
    checkoutEnabled: true,
  },
  {
    id: 'max',
    name: 'Max',
    price: '$179.99',
    credits: 30000,
    baseCredits: 18000,
    bonusCredits: 12000,
    billingLabel: 'One-time purchase',
    validity: 'Credits valid for 12 months',
    checkoutEnabled: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: '$249.99',
    credits: 50000,
    baseCredits: 25000,
    bonusCredits: 25000,
    billingLabel: 'One-time purchase',
    validity: 'Credits valid for 12 months',
    checkoutEnabled: true,
  },
]

export const PRICING_FAQ: PricingFaqItem[] = [
  {
    question: 'Are these subscriptions?',
    answer: 'No. These are one-time credit purchases, not recurring subscriptions.',
  },
  {
    question: 'How long do credits stay valid?',
    answer: 'Purchased credits are valid for 12 months from the purchase date.',
  },
  {
    question: 'What happens if a generation fails?',
    answer: 'Credits for failed generations are automatically returned when the failure is recorded.',
  },
  {
    question: 'Can I use generated images commercially?',
    answer: 'Yes. Commercial use is allowed as long as your use complies with Toolaze terms and applicable model policies.',
  },
  {
    question: 'Can I request a refund?',
    answer: 'You can contact support for refunds on unused credits. Credits already spent on delivered generations are not refundable.',
  },
]

const defaultCheckoutCopy: PricingCheckoutCopy = {
  buyCredits: 'Buy Credits',
  openingCheckout: 'Opening Checkout...',
  checkoutComingSoon: 'Checkout Coming Soon',
  validityNote: 'Credits valid for 12 months.',
  signInRequired: 'Please sign in before buying credits.',
  checkoutFailed: 'Checkout could not be started.',
}

const pricingPageCopyByLocale: Record<string, PricingPageCopy> = {
  en: {
    metadataTitle: 'Pricing - Toolaze Credits',
    metadataDescription:
      'Buy Toolaze AI creation credits with one-time packages. Credits are valid for 12 months, failed generations are refunded, and commercial use is allowed.',
    breadcrumbHome: 'Home',
    breadcrumbPricing: 'Pricing',
    title: 'Buy Credits, Pay As You Go',
    subtitle: 'One-time credit packs for Toolaze AI creation. No subscription required.',
    mostPopularBadge: 'Most Popular',
    bonusPercentLabel: '+{percent}% bonus',
    bonusLabel: 'bonus',
    creditsIncludedLabel: '{credits} credits included',
    pricePerCreditUnit: 'credit',
    faqTitle: 'Pricing Questions',
    faqIntro: 'Important credit terms are summarized here so the purchase cards stay focused.',
    faq: PRICING_FAQ,
    supportPrefix: 'Need help choosing a package or requesting a refund for unused credits? Contact',
    supportLink: 'support@toolaze.com',
    supportSuffix: '.',
    checkout: defaultCheckoutCopy,
  },
  de: {
    metadataTitle: 'Preise - Toolaze Credits',
    metadataDescription:
      'Kaufe Toolaze Credits fuer KI-Kreationen als einmalige Pakete. Credits sind 12 Monate gueltig, fehlgeschlagene Generierungen werden erstattet und kommerzielle Nutzung ist erlaubt.',
    breadcrumbHome: 'Startseite',
    breadcrumbPricing: 'Preise',
    title: 'Credits Kaufen, Flexibel Nutzen',
    subtitle: 'Einmalige Credit-Pakete fuer Toolaze KI-Kreationen. Kein Abo erforderlich.',
    mostPopularBadge: 'Am Beliebtesten',
    bonusPercentLabel: '+{percent}% Bonus',
    bonusLabel: 'Bonus',
    creditsIncludedLabel: '{credits} Credits enthalten',
    pricePerCreditUnit: 'Credit',
    faqTitle: 'Fragen Zu Preisen',
    faqIntro: 'Wichtige Credit-Bedingungen sind hier zusammengefasst, damit die Kaufkarten fokussiert bleiben.',
    faq: [
      { question: 'Sind das Abos?', answer: 'Nein. Dies sind einmalige Credit-Kaeufe, keine wiederkehrenden Abonnements.' },
      { question: 'Wie lange bleiben Credits gueltig?', answer: 'Gekaufte Credits sind ab Kaufdatum 12 Monate lang gueltig.' },
      { question: 'Was passiert, wenn eine Generierung fehlschlaegt?', answer: 'Credits fuer fehlgeschlagene Generierungen werden automatisch zurueckgegeben, sobald der Fehler erfasst wird.' },
      { question: 'Kann ich generierte Bilder kommerziell nutzen?', answer: 'Ja. Kommerzielle Nutzung ist erlaubt, solange deine Nutzung den Toolaze-Bedingungen und den geltenden Modellrichtlinien entspricht.' },
      { question: 'Kann ich eine Rueckerstattung anfordern?', answer: 'Du kannst den Support fuer Rueckerstattungen ungenutzter Credits kontaktieren. Bereits fuer gelieferte Generierungen verwendete Credits sind nicht erstattungsfaehig.' },
    ],
    supportPrefix: 'Brauchst du Hilfe bei der Paketauswahl oder einer Rueckerstattung fuer ungenutzte Credits? Kontaktiere',
    supportLink: 'support@toolaze.com',
    supportSuffix: '.',
    checkout: {
      buyCredits: 'Credits Kaufen',
      openingCheckout: 'Checkout Wird Geoeffnet...',
      checkoutComingSoon: 'Checkout Bald Verfuegbar',
      validityNote: 'Credits sind 12 Monate gueltig.',
      signInRequired: 'Bitte melde dich an, bevor du Credits kaufst.',
      checkoutFailed: 'Checkout konnte nicht gestartet werden.',
    },
  },
  ja: {
    metadataTitle: '料金 - Toolaze Credits',
    metadataDescription:
      'Toolaze の AI 制作用 Credits を一回払いのパックで購入できます。Credits は 12 か月有効で、生成失敗分は返還され、商用利用も可能です。',
    breadcrumbHome: 'ホーム',
    breadcrumbPricing: '料金',
    title: 'Credits を購入して必要な分だけ使う',
    subtitle: 'Toolaze の AI 制作用の一回払い Credit パック。サブスクリプションは不要です。',
    mostPopularBadge: '一番人気',
    bonusPercentLabel: '+{percent}% ボーナス',
    bonusLabel: 'ボーナス',
    creditsIncludedLabel: '{credits} Credits 含む',
    pricePerCreditUnit: 'Credit',
    faqTitle: '料金に関する質問',
    faqIntro: '購入カードを見やすくするため、重要な Credit 条件をここにまとめています。',
    faq: [
      { question: 'これはサブスクリプションですか？', answer: 'いいえ。これは一回払いの Credit 購入で、継続課金のサブスクリプションではありません。' },
      { question: 'Credits の有効期限は？', answer: '購入した Credits は購入日から 12 か月間有効です。' },
      { question: '生成に失敗した場合はどうなりますか？', answer: '失敗が記録された生成分の Credits は自動的に返還されます。' },
      { question: '生成画像を商用利用できますか？', answer: 'はい。Toolaze の利用規約と該当するモデルポリシーに従う限り、商用利用できます。' },
      { question: '返金を依頼できますか？', answer: '未使用 Credits の返金についてはサポートにお問い合わせください。納品済み生成に使用された Credits は返金対象外です。' },
    ],
    supportPrefix: 'パック選びや未使用 Credits の返金についてサポートが必要な場合は',
    supportLink: 'support@toolaze.com',
    supportSuffix: 'までお問い合わせください。',
    checkout: {
      buyCredits: 'Credits を購入',
      openingCheckout: 'Checkout を開いています...',
      checkoutComingSoon: 'Checkout は近日公開',
      validityNote: 'Credits は 12 か月有効です。',
      signInRequired: 'Credits を購入する前にサインインしてください。',
      checkoutFailed: 'Checkout を開始できませんでした。',
    },
  },
  es: {
    metadataTitle: 'Precios - Toolaze Credits',
    metadataDescription:
      'Compra Toolaze Credits para creacion con IA en paquetes de pago unico. Los credits son validos por 12 meses, las generaciones fallidas se reembolsan y se permite el uso comercial.',
    breadcrumbHome: 'Inicio',
    breadcrumbPricing: 'Precios',
    title: 'Compra Credits, Paga Solo Cuando Los Uses',
    subtitle: 'Paquetes de credits de pago unico para creacion con IA en Toolaze. Sin suscripcion.',
    mostPopularBadge: 'Mas Popular',
    bonusPercentLabel: '+{percent}% extra',
    bonusLabel: 'extra',
    creditsIncludedLabel: '{credits} Credits incluidos',
    pricePerCreditUnit: 'Credit',
    faqTitle: 'Preguntas De Precios',
    faqIntro: 'Los terminos importantes de credits se resumen aqui para mantener las tarjetas claras.',
    faq: [
      { question: '¿Son suscripciones?', answer: 'No. Son compras unicas de credits, no suscripciones recurrentes.' },
      { question: '¿Cuanto duran los credits?', answer: 'Los credits comprados son validos durante 12 meses desde la fecha de compra.' },
      { question: '¿Que ocurre si falla una generacion?', answer: 'Los credits de generaciones fallidas se devuelven automaticamente cuando se registra el fallo.' },
      { question: '¿Puedo usar imagenes generadas comercialmente?', answer: 'Si. El uso comercial esta permitido siempre que cumplas los terminos de Toolaze y las politicas del modelo correspondiente.' },
      { question: '¿Puedo solicitar un reembolso?', answer: 'Puedes contactar con soporte para reembolsos de credits no usados. Los credits ya gastados en generaciones entregadas no son reembolsables.' },
    ],
    supportPrefix: '¿Necesitas ayuda para elegir un paquete o solicitar un reembolso de credits no usados? Contacta con',
    supportLink: 'support@toolaze.com',
    supportSuffix: '.',
    checkout: {
      buyCredits: 'Comprar Credits',
      openingCheckout: 'Abriendo Checkout...',
      checkoutComingSoon: 'Checkout Proximamente',
      validityNote: 'Credits validos por 12 meses.',
      signInRequired: 'Inicia sesion antes de comprar credits.',
      checkoutFailed: 'No se pudo iniciar el checkout.',
    },
  },
  'zh-TW': {
    metadataTitle: '價格 - Toolaze Credits',
    metadataDescription:
      '以一次性方案購買 Toolaze AI 創作 Credits。Credits 有效期為 12 個月，生成失敗會退還點數，也支援商業使用。',
    breadcrumbHome: '首頁',
    breadcrumbPricing: '價格',
    title: '購買 Credits，隨用隨付',
    subtitle: '適用於 Toolaze AI 創作的一次性 Credit 方案。無需訂閱。',
    mostPopularBadge: '最受歡迎',
    bonusPercentLabel: '+{percent}% 贈送',
    bonusLabel: '贈送',
    creditsIncludedLabel: '包含 {credits} Credits',
    pricePerCreditUnit: 'Credit',
    faqTitle: '價格問題',
    faqIntro: '這裡整理重要的 Credit 規則，讓購買方案保持清楚簡潔。',
    faq: [
      { question: '這些是訂閱嗎？', answer: '不是。這些都是一次性購買 Credits，不是定期扣款的訂閱。' },
      { question: 'Credits 有效期多久？', answer: '購買的 Credits 自購買日起 12 個月內有效。' },
      { question: '如果生成失敗會怎樣？', answer: '生成失敗並被記錄後，對應 Credits 會自動退回。' },
      { question: '生成圖片可以商業使用嗎？', answer: '可以。只要你的使用方式符合 Toolaze 條款和適用模型政策，即可商業使用。' },
      { question: '可以申請退款嗎？', answer: '你可以聯絡客服申請未使用 Credits 的退款。已用於成功生成的 Credits 不可退款。' },
    ],
    supportPrefix: '需要協助選擇方案，或申請未使用 Credits 的退款？請聯絡',
    supportLink: 'support@toolaze.com',
    supportSuffix: '。',
    checkout: {
      buyCredits: '購買 Credits',
      openingCheckout: '正在開啟 Checkout...',
      checkoutComingSoon: 'Checkout 即將推出',
      validityNote: 'Credits 有效期為 12 個月。',
      signInRequired: '購買 Credits 前請先登入。',
      checkoutFailed: '無法啟動 Checkout。',
    },
  },
  pt: {
    metadataTitle: 'Precos - Toolaze Credits',
    metadataDescription:
      'Compre Toolaze Credits para criacao com IA em pacotes unicos. Os credits valem por 12 meses, geracoes com falha sao reembolsadas e o uso comercial e permitido.',
    breadcrumbHome: 'Inicio',
    breadcrumbPricing: 'Precos',
    title: 'Compre Credits, Pague Conforme Usa',
    subtitle: 'Pacotes unicos de credits para criacao com IA no Toolaze. Sem assinatura.',
    mostPopularBadge: 'Mais Popular',
    bonusPercentLabel: '+{percent}% bonus',
    bonusLabel: 'bonus',
    creditsIncludedLabel: '{credits} Credits incluidos',
    pricePerCreditUnit: 'Credit',
    faqTitle: 'Perguntas Sobre Precos',
    faqIntro: 'Os termos importantes de credits estao resumidos aqui para manter os cartoes de compra claros.',
    faq: [
      { question: 'Isso e assinatura?', answer: 'Nao. Sao compras unicas de credits, nao assinaturas recorrentes.' },
      { question: 'Por quanto tempo os credits sao validos?', answer: 'Credits comprados sao validos por 12 meses a partir da data da compra.' },
      { question: 'O que acontece se uma geracao falhar?', answer: 'Credits de geracoes com falha sao devolvidos automaticamente quando a falha e registrada.' },
      { question: 'Posso usar imagens geradas comercialmente?', answer: 'Sim. O uso comercial e permitido desde que voce cumpra os termos do Toolaze e as politicas de modelo aplicaveis.' },
      { question: 'Posso solicitar reembolso?', answer: 'Voce pode contatar o suporte para reembolso de credits nao usados. Credits ja gastos em geracoes entregues nao sao reembolsaveis.' },
    ],
    supportPrefix: 'Precisa de ajuda para escolher um pacote ou pedir reembolso de credits nao usados? Contate',
    supportLink: 'support@toolaze.com',
    supportSuffix: '.',
    checkout: {
      buyCredits: 'Comprar Credits',
      openingCheckout: 'Abrindo Checkout...',
      checkoutComingSoon: 'Checkout Em Breve',
      validityNote: 'Credits validos por 12 meses.',
      signInRequired: 'Entre antes de comprar credits.',
      checkoutFailed: 'Nao foi possivel iniciar o checkout.',
    },
  },
  fr: {
    metadataTitle: 'Tarifs - Toolaze Credits',
    metadataDescription:
      'Achetez des Toolaze Credits pour la creation IA avec des packs en paiement unique. Les credits sont valables 12 mois, les generations echouees sont remboursees et l usage commercial est autorise.',
    breadcrumbHome: 'Accueil',
    breadcrumbPricing: 'Tarifs',
    title: 'Achetez Des Credits, Payez A L Usage',
    subtitle: 'Packs de credits en paiement unique pour la creation IA sur Toolaze. Aucun abonnement requis.',
    mostPopularBadge: 'Le Plus Populaire',
    bonusPercentLabel: '+{percent}% bonus',
    bonusLabel: 'bonus',
    creditsIncludedLabel: '{credits} Credits inclus',
    pricePerCreditUnit: 'Credit',
    faqTitle: 'Questions Sur Les Tarifs',
    faqIntro: 'Les conditions importantes des credits sont resumees ici afin de garder les cartes d achat claires.',
    faq: [
      { question: 'S agit-il d abonnements ?', answer: 'Non. Ce sont des achats ponctuels de credits, pas des abonnements recurrents.' },
      { question: 'Combien de temps les credits restent-ils valables ?', answer: 'Les credits achetes sont valables 12 mois a partir de la date d achat.' },
      { question: 'Que se passe-t-il si une generation echoue ?', answer: 'Les credits des generations echouees sont automatiquement retournes lorsque l echec est enregistre.' },
      { question: 'Puis-je utiliser les images generees commercialement ?', answer: 'Oui. L usage commercial est autorise tant que votre utilisation respecte les conditions de Toolaze et les politiques des modeles applicables.' },
      { question: 'Puis-je demander un remboursement ?', answer: 'Vous pouvez contacter le support pour un remboursement des credits non utilises. Les credits deja depenses pour des generations livrees ne sont pas remboursables.' },
    ],
    supportPrefix: 'Besoin d aide pour choisir un pack ou demander le remboursement de credits non utilises ? Contactez',
    supportLink: 'support@toolaze.com',
    supportSuffix: '.',
    checkout: {
      buyCredits: 'Acheter Des Credits',
      openingCheckout: 'Ouverture Du Checkout...',
      checkoutComingSoon: 'Checkout Bientot Disponible',
      validityNote: 'Credits valables 12 mois.',
      signInRequired: 'Veuillez vous connecter avant d acheter des credits.',
      checkoutFailed: 'Le checkout n a pas pu etre lance.',
    },
  },
  ko: {
    metadataTitle: '가격 - Toolaze Credits',
    metadataDescription:
      'Toolaze AI 창작용 Credits를 일회성 패키지로 구매하세요. Credits는 12개월 동안 유효하며, 실패한 생성은 환불되고 상업적 사용도 가능합니다.',
    breadcrumbHome: '홈',
    breadcrumbPricing: '가격',
    title: 'Credits 구매, 필요한 만큼 사용',
    subtitle: 'Toolaze AI 창작을 위한 일회성 Credit 패키지입니다. 구독은 필요 없습니다.',
    mostPopularBadge: '가장 인기',
    bonusPercentLabel: '+{percent}% 보너스',
    bonusLabel: '보너스',
    creditsIncludedLabel: '{credits} Credits 포함',
    pricePerCreditUnit: 'Credit',
    faqTitle: '가격 질문',
    faqIntro: '구매 카드를 간결하게 유지하기 위해 중요한 Credit 조건을 여기에 정리했습니다.',
    faq: [
      { question: '구독인가요?', answer: '아니요. 반복 결제가 아닌 일회성 Credit 구매입니다.' },
      { question: 'Credits는 얼마나 오래 유효한가요?', answer: '구매한 Credits는 구매일로부터 12개월 동안 유효합니다.' },
      { question: '생성이 실패하면 어떻게 되나요?', answer: '실패가 기록된 생성에 사용된 Credits는 자동으로 반환됩니다.' },
      { question: '생성한 이미지를 상업적으로 사용할 수 있나요?', answer: '네. Toolaze 약관과 해당 모델 정책을 준수하는 경우 상업적 사용이 가능합니다.' },
      { question: '환불을 요청할 수 있나요?', answer: '사용하지 않은 Credits는 지원팀에 환불을 문의할 수 있습니다. 이미 완료된 생성에 사용된 Credits는 환불되지 않습니다.' },
    ],
    supportPrefix: '패키지 선택이나 사용하지 않은 Credits 환불에 도움이 필요하신가요?',
    supportLink: 'support@toolaze.com',
    supportSuffix: '로 문의하세요.',
    checkout: {
      buyCredits: 'Credits 구매',
      openingCheckout: 'Checkout 여는 중...',
      checkoutComingSoon: 'Checkout 곧 제공',
      validityNote: 'Credits는 12개월 동안 유효합니다.',
      signInRequired: 'Credits 구매 전에 로그인해 주세요.',
      checkoutFailed: 'Checkout을 시작할 수 없습니다.',
    },
  },
  it: {
    metadataTitle: 'Prezzi - Toolaze Credits',
    metadataDescription:
      'Acquista Toolaze Credits per creazione IA con pacchetti una tantum. I credits sono validi 12 mesi, le generazioni non riuscite vengono rimborsate e l uso commerciale e consentito.',
    breadcrumbHome: 'Home',
    breadcrumbPricing: 'Prezzi',
    title: 'Acquista Credits, Paga Quando Usi',
    subtitle: 'Pacchetti di credits una tantum per la creazione IA su Toolaze. Nessun abbonamento richiesto.',
    mostPopularBadge: 'Piu Popolare',
    bonusPercentLabel: '+{percent}% bonus',
    bonusLabel: 'bonus',
    creditsIncludedLabel: '{credits} Credits inclusi',
    pricePerCreditUnit: 'Credit',
    faqTitle: 'Domande Sui Prezzi',
    faqIntro: 'I termini importanti sui credits sono riassunti qui per mantenere chiare le schede di acquisto.',
    faq: [
      { question: 'Sono abbonamenti?', answer: 'No. Sono acquisti una tantum di credits, non abbonamenti ricorrenti.' },
      { question: 'Quanto durano i credits?', answer: 'I credits acquistati sono validi per 12 mesi dalla data di acquisto.' },
      { question: 'Cosa succede se una generazione fallisce?', answer: 'I credits delle generazioni fallite vengono restituiti automaticamente quando il fallimento viene registrato.' },
      { question: 'Posso usare commercialmente le immagini generate?', answer: 'Si. L uso commerciale e consentito se rispetti i termini di Toolaze e le politiche dei modelli applicabili.' },
      { question: 'Posso richiedere un rimborso?', answer: 'Puoi contattare il supporto per rimborsi sui credits non utilizzati. I credits gia spesi per generazioni consegnate non sono rimborsabili.' },
    ],
    supportPrefix: 'Ti serve aiuto per scegliere un pacchetto o richiedere il rimborso di credits non utilizzati? Contatta',
    supportLink: 'support@toolaze.com',
    supportSuffix: '.',
    checkout: {
      buyCredits: 'Acquista Credits',
      openingCheckout: 'Apertura Checkout...',
      checkoutComingSoon: 'Checkout In Arrivo',
      validityNote: 'Credits validi per 12 mesi.',
      signInRequired: 'Accedi prima di acquistare credits.',
      checkoutFailed: 'Impossibile avviare il checkout.',
    },
  },
}

export function getPricePerCredit(plan: PricingPlan): number {
  return Number(plan.price.replace('$', '')) / plan.credits
}

export function formatPricePerCredit(plan: PricingPlan, unitLabel = 'credit'): string {
  return `$${getPricePerCredit(plan).toFixed(3)} / ${unitLabel}`
}

export function getBonusPercent(plan: PricingPlan): number {
  if (plan.baseCredits === 0) return 0
  return Math.round((plan.bonusCredits / plan.baseCredits) * 100)
}

export function getPricingPageCopy(locale = 'en'): PricingPageCopy {
  return pricingPageCopyByLocale[locale] || pricingPageCopyByLocale.en
}
