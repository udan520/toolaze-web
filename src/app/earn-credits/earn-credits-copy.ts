export const EARN_CREDITS_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'] as const

export type EarnCreditsLocale = (typeof EARN_CREDITS_LOCALES)[number]

export type EarnCreditsPageCopy = {
  metadata: {
    title: string
    description: string
  }
  hero: {
    eyebrow: string
    title: string
    description: string
  }
  checkIn: {
    title: string
    description: string
    dayLabel: string
    checkedInAria: string
    checkedInToday: string
    claiming: string
    claimDayReward: string
  }
  share: {
    title: string
    description: string
    xPostUrlLabel: string
    xPostUrlPlaceholder: string
    submitting: string
    submitForReview: string
  }
  cta: {
    prefix: string
    linkLabel: string
  }
  notices: {
    rewardsLoadTitle: string
    signInEarn: string
    loadError: string
    alreadyCheckedInTitle: string
    alreadyCheckedInMessage: string
    dailyRewardClaimedTitle: string
    dailyRewardClaimedMessage: string
    checkInFailedTitle: string
    checkInFailedMessage: string
    xPostSubmittedTitle: string
    xPostDuplicateMessage: string
    xPostSubmittedMessage: string
    submissionFailedTitle: string
    signInXPost: string
    submissionFailedMessage: string
  }
}

function normalizeEarnCreditsLocale(locale: string): EarnCreditsLocale {
  if (locale === 'zh' || locale === 'zh-CN' || locale === 'zh-HK') return 'zh-TW'
  return EARN_CREDITS_LOCALES.includes(locale as EarnCreditsLocale) ? (locale as EarnCreditsLocale) : 'en'
}

const earnCreditsCopies: Record<EarnCreditsLocale, EarnCreditsPageCopy> = {
  en: {
    metadata: {
      title: 'Earn Credits - Toolaze',
      description: 'Earn Toolaze credits through daily check-ins and approved social sharing rewards.',
    },
    hero: {
      eyebrow: 'Earn Free Credits',
      title: 'Get More Credits Without Buying a Pack',
      description: 'Check in daily or share Toolaze on X. Rewards are added to your account after claim or review.',
    },
    checkIn: {
      title: 'Daily Check-In',
      description: 'Keep the streak. Miss a day and the reward starts again from Day 1.',
      dayLabel: 'Day {day}',
      checkedInAria: 'Day {day} checked in',
      checkedInToday: 'Checked In Today',
      claiming: 'Claiming...',
      claimDayReward: 'Claim Day {day} Reward',
    },
    share: {
      title: 'Share on X',
      description: 'Post about Toolaze on X, paste the post link here, and approved posts receive {credits} credits.',
      xPostUrlLabel: 'X Post URL',
      xPostUrlPlaceholder: 'https://x.com/yourname/status/...',
      submitting: 'Submitting...',
      submitForReview: 'Submit for Review',
    },
    cta: {
      prefix: 'Need credits right now?',
      linkLabel: 'Buy a One-Time Pack',
    },
    notices: {
      rewardsLoadTitle: 'Rewards Could Not Load',
      signInEarn: 'Please sign in to earn credits.',
      loadError: 'Could not load reward status.',
      alreadyCheckedInTitle: 'Already Checked In',
      alreadyCheckedInMessage: 'You have already checked in today.',
      dailyRewardClaimedTitle: 'Daily Reward Claimed',
      dailyRewardClaimedMessage: 'Day {day} reward added: +{credits} credits.',
      checkInFailedTitle: 'Check-In Failed',
      checkInFailedMessage: 'Could not claim your daily reward.',
      xPostSubmittedTitle: 'X Post Submitted',
      xPostDuplicateMessage: 'This X post is already submitted and waiting for review.',
      xPostSubmittedMessage: 'X post submitted. Approved posts receive +10 credits.',
      submissionFailedTitle: 'Submission Failed',
      signInXPost: 'Please sign in to submit your X post.',
      submissionFailedMessage: 'Could not submit this X post.',
    },
  },
  de: {
    metadata: {
      title: 'Credits verdienen - Toolaze',
      description: 'Verdiene Toolaze Credits durch tägliche Check-ins und geprüfte Social-Sharing-Belohnungen.',
    },
    hero: {
      eyebrow: 'Kostenlose Credits verdienen',
      title: 'Mehr Credits erhalten, ohne ein Paket zu kaufen',
      description: 'Checke täglich ein oder teile Toolaze auf X. Belohnungen werden nach dem Einlösen oder nach Prüfung deinem Konto gutgeschrieben.',
    },
    checkIn: {
      title: 'Täglicher Check-In',
      description: 'Halte die Serie. Wenn du einen Tag verpasst, beginnt die Belohnung wieder bei Tag 1.',
      dayLabel: 'Tag {day}',
      checkedInAria: 'Tag {day} eingecheckt',
      checkedInToday: 'Heute eingecheckt',
      claiming: 'Wird eingelöst...',
      claimDayReward: 'Belohnung für Tag {day} einlösen',
    },
    share: {
      title: 'Auf X teilen',
      description: 'Poste über Toolaze auf X, füge den Link hier ein, und genehmigte Posts erhalten {credits} Credits.',
      xPostUrlLabel: 'X-Post-URL',
      xPostUrlPlaceholder: 'https://x.com/deinname/status/...',
      submitting: 'Wird gesendet...',
      submitForReview: 'Zur Prüfung einreichen',
    },
    cta: {
      prefix: 'Brauchst du sofort Credits?',
      linkLabel: 'Einmaliges Paket kaufen',
    },
    notices: {
      rewardsLoadTitle: 'Belohnungen konnten nicht geladen werden',
      signInEarn: 'Bitte melde dich an, um Credits zu verdienen.',
      loadError: 'Belohnungsstatus konnte nicht geladen werden.',
      alreadyCheckedInTitle: 'Bereits eingecheckt',
      alreadyCheckedInMessage: 'Du hast heute bereits eingecheckt.',
      dailyRewardClaimedTitle: 'Tägliche Belohnung eingelöst',
      dailyRewardClaimedMessage: 'Belohnung für Tag {day} hinzugefügt: +{credits} Credits.',
      checkInFailedTitle: 'Check-In fehlgeschlagen',
      checkInFailedMessage: 'Deine tägliche Belohnung konnte nicht eingelöst werden.',
      xPostSubmittedTitle: 'X-Post eingereicht',
      xPostDuplicateMessage: 'Dieser X-Post wurde bereits eingereicht und wartet auf Prüfung.',
      xPostSubmittedMessage: 'X-Post eingereicht. Genehmigte Posts erhalten +10 Credits.',
      submissionFailedTitle: 'Einreichung fehlgeschlagen',
      signInXPost: 'Bitte melde dich an, um deinen X-Post einzureichen.',
      submissionFailedMessage: 'Dieser X-Post konnte nicht eingereicht werden.',
    },
  },
  ja: {
    metadata: {
      title: 'クレジットを獲得 - Toolaze',
      description: '毎日のチェックインと承認されたソーシャル共有で Toolaze クレジットを獲得できます。',
    },
    hero: {
      eyebrow: '無料クレジットを獲得',
      title: 'パックを購入せずにクレジットを増やす',
      description: '毎日チェックインするか、X で Toolaze を共有してください。報酬は受け取り後または審査後にアカウントへ追加されます。',
    },
    checkIn: {
      title: 'デイリーチェックイン',
      description: '連続記録を保ちましょう。1日逃すと報酬は Day 1 から再開します。',
      dayLabel: 'Day {day}',
      checkedInAria: 'Day {day} チェックイン済み',
      checkedInToday: '本日はチェックイン済み',
      claiming: '受け取り中...',
      claimDayReward: 'Day {day} の報酬を受け取る',
    },
    share: {
      title: 'X で共有',
      description: 'X に Toolaze について投稿し、そのリンクをここに貼り付けてください。承認された投稿には {credits} クレジットが付与されます。',
      xPostUrlLabel: 'X 投稿 URL',
      xPostUrlPlaceholder: 'https://x.com/yourname/status/...',
      submitting: '送信中...',
      submitForReview: '審査に送信',
    },
    cta: {
      prefix: '今すぐクレジットが必要ですか？',
      linkLabel: '一回限りのパックを購入',
    },
    notices: {
      rewardsLoadTitle: '報酬を読み込めませんでした',
      signInEarn: 'クレジットを獲得するにはサインインしてください。',
      loadError: '報酬ステータスを読み込めませんでした。',
      alreadyCheckedInTitle: 'チェックイン済み',
      alreadyCheckedInMessage: '本日はすでにチェックイン済みです。',
      dailyRewardClaimedTitle: 'デイリー報酬を受け取りました',
      dailyRewardClaimedMessage: 'Day {day} の報酬を追加しました: +{credits} クレジット。',
      checkInFailedTitle: 'チェックインに失敗しました',
      checkInFailedMessage: 'デイリー報酬を受け取れませんでした。',
      xPostSubmittedTitle: 'X 投稿を送信しました',
      xPostDuplicateMessage: 'この X 投稿はすでに送信され、審査待ちです。',
      xPostSubmittedMessage: 'X 投稿を送信しました。承認された投稿には +10 クレジットが付与されます。',
      submissionFailedTitle: '送信に失敗しました',
      signInXPost: 'X 投稿を送信するにはサインインしてください。',
      submissionFailedMessage: 'この X 投稿を送信できませんでした。',
    },
  },
  es: {
    metadata: {
      title: 'Ganar créditos - Toolaze',
      description: 'Gana créditos de Toolaze con check-ins diarios y recompensas de publicaciones sociales aprobadas.',
    },
    hero: {
      eyebrow: 'Gana créditos gratis',
      title: 'Obtén más créditos sin comprar un pack',
      description: 'Haz check-in diario o comparte Toolaze en X. Las recompensas se añaden a tu cuenta tras reclamarlas o aprobarse.',
    },
    checkIn: {
      title: 'Check-In diario',
      description: 'Mantén la racha. Si pierdes un día, la recompensa vuelve a empezar desde el Día 1.',
      dayLabel: 'Día {day}',
      checkedInAria: 'Día {day} completado',
      checkedInToday: 'Check-In completado hoy',
      claiming: 'Reclamando...',
      claimDayReward: 'Reclamar recompensa del Día {day}',
    },
    share: {
      title: 'Compartir en X',
      description: 'Publica sobre Toolaze en X, pega aquí el enlace y las publicaciones aprobadas reciben {credits} créditos.',
      xPostUrlLabel: 'URL de publicación en X',
      xPostUrlPlaceholder: 'https://x.com/tuusuario/status/...',
      submitting: 'Enviando...',
      submitForReview: 'Enviar para revisión',
    },
    cta: {
      prefix: '¿Necesitas créditos ahora?',
      linkLabel: 'Comprar un pack único',
    },
    notices: {
      rewardsLoadTitle: 'No se pudieron cargar las recompensas',
      signInEarn: 'Inicia sesión para ganar créditos.',
      loadError: 'No se pudo cargar el estado de recompensas.',
      alreadyCheckedInTitle: 'Check-In ya completado',
      alreadyCheckedInMessage: 'Ya completaste el check-in de hoy.',
      dailyRewardClaimedTitle: 'Recompensa diaria reclamada',
      dailyRewardClaimedMessage: 'Recompensa del Día {day} añadida: +{credits} créditos.',
      checkInFailedTitle: 'Check-In fallido',
      checkInFailedMessage: 'No se pudo reclamar tu recompensa diaria.',
      xPostSubmittedTitle: 'Publicación en X enviada',
      xPostDuplicateMessage: 'Esta publicación de X ya fue enviada y espera revisión.',
      xPostSubmittedMessage: 'Publicación en X enviada. Las publicaciones aprobadas reciben +10 créditos.',
      submissionFailedTitle: 'Envío fallido',
      signInXPost: 'Inicia sesión para enviar tu publicación de X.',
      submissionFailedMessage: 'No se pudo enviar esta publicación de X.',
    },
  },
  'zh-TW': {
    metadata: {
      title: '獲得點數 - Toolaze',
      description: '透過每日簽到與審核通過的社群分享獎勵獲得 Toolaze 點數。',
    },
    hero: {
      eyebrow: '獲得免費點數',
      title: '不用購買點數包也能獲得更多點數',
      description: '每日簽到或在 X 分享 Toolaze。獎勵會在領取或審核通過後加入你的帳號。',
    },
    checkIn: {
      title: '每日簽到',
      description: '保持連續簽到。若中斷一天，獎勵會從 Day 1 重新開始。',
      dayLabel: 'Day {day}',
      checkedInAria: 'Day {day} 已簽到',
      checkedInToday: '今天已簽到',
      claiming: '領取中...',
      claimDayReward: '領取 Day {day} 獎勵',
    },
    share: {
      title: '分享到 X',
      description: '在 X 發文介紹 Toolaze，將貼文連結貼到這裡，審核通過後可獲得 {credits} 點數。',
      xPostUrlLabel: 'X 貼文 URL',
      xPostUrlPlaceholder: 'https://x.com/yourname/status/...',
      submitting: '提交中...',
      submitForReview: '提交審核',
    },
    cta: {
      prefix: '現在就需要點數？',
      linkLabel: '購買一次性點數包',
    },
    notices: {
      rewardsLoadTitle: '獎勵無法載入',
      signInEarn: '請先登入以獲得點數。',
      loadError: '無法載入獎勵狀態。',
      alreadyCheckedInTitle: '已完成簽到',
      alreadyCheckedInMessage: '你今天已經簽到過了。',
      dailyRewardClaimedTitle: '每日獎勵已領取',
      dailyRewardClaimedMessage: 'Day {day} 獎勵已加入：+{credits} 點數。',
      checkInFailedTitle: '簽到失敗',
      checkInFailedMessage: '無法領取每日獎勵。',
      xPostSubmittedTitle: 'X 貼文已提交',
      xPostDuplicateMessage: '這篇 X 貼文已提交，正在等待審核。',
      xPostSubmittedMessage: 'X 貼文已提交。審核通過的貼文可獲得 +10 點數。',
      submissionFailedTitle: '提交失敗',
      signInXPost: '請先登入以提交你的 X 貼文。',
      submissionFailedMessage: '無法提交這篇 X 貼文。',
    },
  },
  pt: {
    metadata: {
      title: 'Ganhar créditos - Toolaze',
      description: 'Ganhe créditos Toolaze com check-ins diários e recompensas de compartilhamento social aprovadas.',
    },
    hero: {
      eyebrow: 'Ganhe créditos grátis',
      title: 'Ganhe mais créditos sem comprar um pacote',
      description: 'Faça check-in diário ou compartilhe a Toolaze no X. As recompensas entram na conta após resgate ou revisão.',
    },
    checkIn: {
      title: 'Check-In diário',
      description: 'Mantenha a sequência. Se perder um dia, a recompensa recomeça no Dia 1.',
      dayLabel: 'Dia {day}',
      checkedInAria: 'Dia {day} concluído',
      checkedInToday: 'Check-In concluído hoje',
      claiming: 'Resgatando...',
      claimDayReward: 'Resgatar recompensa do Dia {day}',
    },
    share: {
      title: 'Compartilhar no X',
      description: 'Publique sobre a Toolaze no X, cole o link aqui, e posts aprovados recebem {credits} créditos.',
      xPostUrlLabel: 'URL do post no X',
      xPostUrlPlaceholder: 'https://x.com/seunome/status/...',
      submitting: 'Enviando...',
      submitForReview: 'Enviar para revisão',
    },
    cta: {
      prefix: 'Precisa de créditos agora?',
      linkLabel: 'Comprar pacote único',
    },
    notices: {
      rewardsLoadTitle: 'Não foi possível carregar recompensas',
      signInEarn: 'Entre para ganhar créditos.',
      loadError: 'Não foi possível carregar o status das recompensas.',
      alreadyCheckedInTitle: 'Check-In já feito',
      alreadyCheckedInMessage: 'Você já fez check-in hoje.',
      dailyRewardClaimedTitle: 'Recompensa diária resgatada',
      dailyRewardClaimedMessage: 'Recompensa do Dia {day} adicionada: +{credits} créditos.',
      checkInFailedTitle: 'Check-In falhou',
      checkInFailedMessage: 'Não foi possível resgatar sua recompensa diária.',
      xPostSubmittedTitle: 'Post no X enviado',
      xPostDuplicateMessage: 'Este post no X já foi enviado e aguarda revisão.',
      xPostSubmittedMessage: 'Post no X enviado. Posts aprovados recebem +10 créditos.',
      submissionFailedTitle: 'Envio falhou',
      signInXPost: 'Entre para enviar seu post no X.',
      submissionFailedMessage: 'Não foi possível enviar este post no X.',
    },
  },
  fr: {
    metadata: {
      title: 'Gagner des crédits - Toolaze',
      description: 'Gagnez des crédits Toolaze avec les check-ins quotidiens et les partages sociaux approuvés.',
    },
    hero: {
      eyebrow: 'Gagner des crédits gratuits',
      title: 'Obtenez plus de crédits sans acheter de pack',
      description: 'Faites un check-in quotidien ou partagez Toolaze sur X. Les récompenses sont ajoutées après réclamation ou validation.',
    },
    checkIn: {
      title: 'Check-In quotidien',
      description: 'Gardez la série. Si vous manquez un jour, la récompense repart au Jour 1.',
      dayLabel: 'Jour {day}',
      checkedInAria: 'Jour {day} validé',
      checkedInToday: 'Check-In effectué aujourd’hui',
      claiming: 'Réclamation...',
      claimDayReward: 'Réclamer la récompense du Jour {day}',
    },
    share: {
      title: 'Partager sur X',
      description: 'Publiez à propos de Toolaze sur X, collez le lien ici, et les posts approuvés reçoivent {credits} crédits.',
      xPostUrlLabel: 'URL du post X',
      xPostUrlPlaceholder: 'https://x.com/votrenom/status/...',
      submitting: 'Envoi...',
      submitForReview: 'Envoyer pour vérification',
    },
    cta: {
      prefix: 'Besoin de crédits maintenant ?',
      linkLabel: 'Acheter un pack unique',
    },
    notices: {
      rewardsLoadTitle: 'Récompenses impossibles à charger',
      signInEarn: 'Connectez-vous pour gagner des crédits.',
      loadError: 'Impossible de charger le statut des récompenses.',
      alreadyCheckedInTitle: 'Déjà validé',
      alreadyCheckedInMessage: 'Vous avez déjà fait le check-in aujourd’hui.',
      dailyRewardClaimedTitle: 'Récompense quotidienne réclamée',
      dailyRewardClaimedMessage: 'Récompense du Jour {day} ajoutée : +{credits} crédits.',
      checkInFailedTitle: 'Check-In échoué',
      checkInFailedMessage: 'Impossible de réclamer votre récompense quotidienne.',
      xPostSubmittedTitle: 'Post X envoyé',
      xPostDuplicateMessage: 'Ce post X a déjà été envoyé et attend une vérification.',
      xPostSubmittedMessage: 'Post X envoyé. Les posts approuvés reçoivent +10 crédits.',
      submissionFailedTitle: 'Envoi échoué',
      signInXPost: 'Connectez-vous pour envoyer votre post X.',
      submissionFailedMessage: 'Impossible d’envoyer ce post X.',
    },
  },
  ko: {
    metadata: {
      title: '크레딧 받기 - Toolaze',
      description: '매일 체크인과 승인된 소셜 공유 보상으로 Toolaze 크레딧을 받을 수 있습니다.',
    },
    hero: {
      eyebrow: '무료 크레딧 받기',
      title: '팩을 구매하지 않고 더 많은 크레딧 받기',
      description: '매일 체크인하거나 X에서 Toolaze를 공유하세요. 보상은 수령 또는 검토 후 계정에 추가됩니다.',
    },
    checkIn: {
      title: '일일 체크인',
      description: '연속 기록을 유지하세요. 하루를 놓치면 보상은 Day 1부터 다시 시작됩니다.',
      dayLabel: 'Day {day}',
      checkedInAria: 'Day {day} 체크인 완료',
      checkedInToday: '오늘 체크인 완료',
      claiming: '수령 중...',
      claimDayReward: 'Day {day} 보상 받기',
    },
    share: {
      title: 'X에 공유',
      description: 'X에 Toolaze에 대해 게시하고 링크를 여기에 붙여넣으세요. 승인된 게시물은 {credits} 크레딧을 받습니다.',
      xPostUrlLabel: 'X 게시물 URL',
      xPostUrlPlaceholder: 'https://x.com/yourname/status/...',
      submitting: '제출 중...',
      submitForReview: '검토 요청',
    },
    cta: {
      prefix: '지금 크레딧이 필요하신가요?',
      linkLabel: '일회성 팩 구매',
    },
    notices: {
      rewardsLoadTitle: '보상을 불러올 수 없습니다',
      signInEarn: '크레딧을 받으려면 로그인하세요.',
      loadError: '보상 상태를 불러올 수 없습니다.',
      alreadyCheckedInTitle: '이미 체크인됨',
      alreadyCheckedInMessage: '오늘 이미 체크인했습니다.',
      dailyRewardClaimedTitle: '일일 보상 수령 완료',
      dailyRewardClaimedMessage: 'Day {day} 보상이 추가되었습니다: +{credits} 크레딧.',
      checkInFailedTitle: '체크인 실패',
      checkInFailedMessage: '일일 보상을 받을 수 없습니다.',
      xPostSubmittedTitle: 'X 게시물 제출됨',
      xPostDuplicateMessage: '이 X 게시물은 이미 제출되어 검토 대기 중입니다.',
      xPostSubmittedMessage: 'X 게시물이 제출되었습니다. 승인된 게시물은 +10 크레딧을 받습니다.',
      submissionFailedTitle: '제출 실패',
      signInXPost: 'X 게시물을 제출하려면 로그인하세요.',
      submissionFailedMessage: '이 X 게시물을 제출할 수 없습니다.',
    },
  },
  it: {
    metadata: {
      title: 'Guadagna crediti - Toolaze',
      description: 'Guadagna crediti Toolaze con check-in giornalieri e ricompense di condivisione social approvate.',
    },
    hero: {
      eyebrow: 'Guadagna crediti gratis',
      title: 'Ottieni più crediti senza acquistare un pacchetto',
      description: 'Fai check-in ogni giorno o condividi Toolaze su X. Le ricompense vengono aggiunte dopo il riscatto o la revisione.',
    },
    checkIn: {
      title: 'Check-In giornaliero',
      description: 'Mantieni la serie. Se salti un giorno, la ricompensa riparte dal Giorno 1.',
      dayLabel: 'Giorno {day}',
      checkedInAria: 'Giorno {day} completato',
      checkedInToday: 'Check-In completato oggi',
      claiming: 'Riscatto...',
      claimDayReward: 'Riscatta ricompensa del Giorno {day}',
    },
    share: {
      title: 'Condividi su X',
      description: 'Pubblica su Toolaze su X, incolla qui il link e i post approvati ricevono {credits} crediti.',
      xPostUrlLabel: 'URL post X',
      xPostUrlPlaceholder: 'https://x.com/tuonome/status/...',
      submitting: 'Invio...',
      submitForReview: 'Invia per revisione',
    },
    cta: {
      prefix: 'Hai bisogno di crediti adesso?',
      linkLabel: 'Acquista un pacchetto una tantum',
    },
    notices: {
      rewardsLoadTitle: 'Impossibile caricare le ricompense',
      signInEarn: 'Accedi per guadagnare crediti.',
      loadError: 'Impossibile caricare lo stato delle ricompense.',
      alreadyCheckedInTitle: 'Check-In già completato',
      alreadyCheckedInMessage: 'Hai già fatto check-in oggi.',
      dailyRewardClaimedTitle: 'Ricompensa giornaliera riscattata',
      dailyRewardClaimedMessage: 'Ricompensa del Giorno {day} aggiunta: +{credits} crediti.',
      checkInFailedTitle: 'Check-In non riuscito',
      checkInFailedMessage: 'Impossibile riscattare la ricompensa giornaliera.',
      xPostSubmittedTitle: 'Post X inviato',
      xPostDuplicateMessage: 'Questo post X è già stato inviato ed è in attesa di revisione.',
      xPostSubmittedMessage: 'Post X inviato. I post approvati ricevono +10 crediti.',
      submissionFailedTitle: 'Invio non riuscito',
      signInXPost: 'Accedi per inviare il tuo post X.',
      submissionFailedMessage: 'Impossibile inviare questo post X.',
    },
  },
}

export function getEarnCreditsPageCopy(locale: string): EarnCreditsPageCopy {
  return earnCreditsCopies[normalizeEarnCreditsLocale(locale)]
}

export function formatEarnCreditsCopy(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template,
  )
}
