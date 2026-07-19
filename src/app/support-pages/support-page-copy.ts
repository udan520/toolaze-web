export const SUPPORT_PAGE_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'] as const

export type SupportPageLocale = (typeof SUPPORT_PAGE_LOCALES)[number]
export type SupportPolicyKey = 'refundPolicy' | 'acceptableUse'

type PolicySection = {
  title: string
  body: string
}

export type SupportPolicyCopy = {
  metadata: {
    title: string
    description: string
  }
  breadcrumb: string
  title: string
  lastUpdated: string
  date: string
  intro: string
  sections: PolicySection[]
}

export type ContactPageCopy = {
  metadata: {
    title: string
    description: string
  }
  breadcrumb: string
  eyebrow: string
  title: string
  description: string
  responseTime: string
  cards: Array<{
    title: string
    body: string
    linkLabel?: string
    linkHref?: string
  }>
}

function normalizeSupportLocale(locale: string): SupportPageLocale {
  if (locale === 'zh' || locale === 'zh-CN' || locale === 'zh-HK') return 'zh-TW'
  return SUPPORT_PAGE_LOCALES.includes(locale as SupportPageLocale) ? (locale as SupportPageLocale) : 'en'
}

const refundPolicyCopies: Record<SupportPageLocale, SupportPolicyCopy> = {
  en: {
    metadata: {
      title: 'Refund Policy - Toolaze',
      description: 'Toolaze Refund Policy for one-time credit purchases, unused credits, failed generation credit returns, and refund requests.',
    },
    breadcrumb: 'Refund Policy',
    title: 'Refund Policy',
    lastUpdated: 'Last Updated:',
    date: 'July 15, 2026',
    intro: 'Toolaze sells credits as one-time purchases. This policy explains when unused credits can be refunded and how failed generation attempts are handled.',
    sections: [
      { title: '1. Unused Credits', body: 'You may request a refund for unused credits that remain in your Toolaze account. We calculate the refundable amount based on the unused credits from the relevant purchase, less any non-refundable taxes, processor fees, chargeback costs, discounts, or promotional value when applicable.' },
      { title: '2. Used Credits', body: 'Used credits are not refundable once they have been spent on a delivered generation, completed AI edit, completed tool run, download, or other completed service. Promotional credits, bonus credits, and expired credits are not refundable unless required by law.' },
      { title: '3. Failed Generation', body: 'If a generation fails and our system confirms that no usable output was delivered, the charged credits are returned to your account. This is a credit return, not a cash refund. If credits are not returned automatically, contact support with the generation time, account email, and any error message.' },
      { title: '4. Credit Validity', body: 'Purchased credits are valid for 12 months from the purchase date. Expired credits cannot be refunded, transferred, or restored unless required by law.' },
      { title: '5. How to Request a Refund', body: 'Send your request to support@toolaze.com from the email used for purchase. Include your order ID, account email, purchase date, and the reason for the request. Approved refunds are sent to the original payment method through Creem or the payment processor used at checkout.' },
      { title: '6. Abuse and Exceptions', body: 'We may deny refund requests connected to fraud, policy violations, chargeback abuse, prohibited content, or attempts to use the service without paying. Nothing in this policy limits consumer rights that cannot be waived under applicable law.' },
    ],
  },
  de: {
    metadata: {
      title: 'Rückerstattungsrichtlinie - Toolaze',
      description: 'Toolaze Rückerstattungsrichtlinie für einmalige Credit-Käufe, ungenutzte Credits, Rückgabe von Credits bei fehlgeschlagener Generierung und Erstattungsanfragen.',
    },
    breadcrumb: 'Rückerstattungsrichtlinie',
    title: 'Rückerstattungsrichtlinie',
    lastUpdated: 'Zuletzt aktualisiert:',
    date: '15. Juli 2026',
    intro: 'Toolaze verkauft Credits als einmalige Käufe. Diese Richtlinie erklärt, wann ungenutzte Credits erstattet werden können und wie fehlgeschlagene Generierungsversuche behandelt werden.',
    sections: [
      { title: '1. Ungenutzte Credits', body: 'Du kannst eine Rückerstattung für ungenutzte Credits beantragen, die in deinem Toolaze-Konto verbleiben. Wir berechnen den erstattungsfähigen Betrag anhand der ungenutzten Credits aus dem jeweiligen Kauf, abzüglich nicht erstattungsfähiger Steuern, Zahlungsgebühren, Chargeback-Kosten, Rabatte oder Werbewerte, sofern zutreffend.' },
      { title: '2. Verwendete Credits', body: 'Verwendete Credits sind nicht erstattungsfähig, sobald sie für eine gelieferte Generierung, eine abgeschlossene KI-Bearbeitung, einen abgeschlossenen Tool-Lauf, einen Download oder einen anderen abgeschlossenen Dienst ausgegeben wurden. Aktionscredits, Bonuscredits und abgelaufene Credits sind nicht erstattungsfähig, sofern gesetzlich nichts anderes vorgeschrieben ist.' },
      { title: '3. Fehlgeschlagene Generierung', body: 'Wenn eine Generierung fehlschlägt und unser System bestätigt, dass kein nutzbares Ergebnis geliefert wurde, werden die belasteten Credits deinem Konto zurückgegeben. Dies ist eine Credit-Rückgabe, keine Barauszahlung. Wenn Credits nicht automatisch zurückgegeben werden, kontaktiere den Support mit Generierungszeit, Konto-E-Mail und Fehlermeldung.' },
      { title: '4. Gültigkeit der Credits', body: 'Gekaufte Credits sind 12 Monate ab Kaufdatum gültig. Abgelaufene Credits können nicht erstattet, übertragen oder wiederhergestellt werden, sofern gesetzlich nichts anderes vorgeschrieben ist.' },
      { title: '5. Rückerstattung beantragen', body: 'Sende deine Anfrage von der beim Kauf verwendeten E-Mail-Adresse an support@toolaze.com. Gib Bestell-ID, Konto-E-Mail, Kaufdatum und den Grund der Anfrage an. Genehmigte Rückerstattungen werden über Creem oder den beim Checkout verwendeten Zahlungsanbieter auf die ursprüngliche Zahlungsmethode gesendet.' },
      { title: '6. Missbrauch und Ausnahmen', body: 'Wir können Rückerstattungsanfragen ablehnen, die mit Betrug, Richtlinienverstößen, Chargeback-Missbrauch, verbotenen Inhalten oder Versuchen verbunden sind, den Dienst ohne Zahlung zu nutzen. Diese Richtlinie beschränkt keine Verbraucherrechte, die nach geltendem Recht nicht ausgeschlossen werden können.' },
    ],
  },
  ja: {
    metadata: {
      title: '返金ポリシー - Toolaze',
      description: '一回限りのクレジット購入、未使用クレジット、生成失敗時のクレジット返還、返金申請に関する Toolaze の返金ポリシー。',
    },
    breadcrumb: '返金ポリシー',
    title: '返金ポリシー',
    lastUpdated: '最終更新:',
    date: '2026年7月15日',
    intro: 'Toolaze ではクレジットを一回限りの購入として販売しています。このポリシーでは、未使用クレジットが返金対象となる場合と、生成失敗時の扱いを説明します。',
    sections: [
      { title: '1. 未使用クレジット', body: 'Toolaze アカウントに残っている未使用クレジットについて、返金を申請できます。返金可能額は対象購入分の未使用クレジットを基準に計算し、返金不可の税金、決済手数料、チャージバック費用、割引、プロモーション価値がある場合は差し引きます。' },
      { title: '2. 使用済みクレジット', body: '配信済みの生成、完了した AI 編集、完了したツール実行、ダウンロード、その他完了済みサービスに使われたクレジットは返金できません。プロモーションクレジット、ボーナスクレジット、期限切れクレジットも、法律で求められる場合を除き返金できません。' },
      { title: '3. 生成失敗', body: '生成が失敗し、利用可能な出力が提供されなかったことを当社システムが確認した場合、消費されたクレジットはアカウントへ返還されます。これは現金返金ではなくクレジット返還です。自動で返還されない場合は、生成時刻、アカウントメール、エラーメッセージを添えてサポートへ連絡してください。' },
      { title: '4. クレジットの有効期限', body: '購入したクレジットは購入日から12か月間有効です。期限切れクレジットは、法律で求められる場合を除き、返金、譲渡、復元できません。' },
      { title: '5. 返金申請方法', body: '購入時に使用したメールアドレスから support@toolaze.com へ申請してください。注文 ID、アカウントメール、購入日、申請理由を含めてください。承認された返金は、Creem またはチェックアウトで使用された決済処理業者を通じて元の支払い方法に送られます。' },
      { title: '6. 不正利用と例外', body: '詐欺、ポリシー違反、チャージバック乱用、禁止コンテンツ、支払いを避けてサービスを利用しようとする行為に関連する返金申請は拒否する場合があります。このポリシーは、適用法で放棄できない消費者の権利を制限するものではありません。' },
    ],
  },
  es: {
    metadata: {
      title: 'Política de reembolsos - Toolaze',
      description: 'Política de reembolsos de Toolaze para compras únicas de créditos, créditos sin usar, devoluciones por generaciones fallidas y solicitudes de reembolso.',
    },
    breadcrumb: 'Política de reembolsos',
    title: 'Política de reembolsos',
    lastUpdated: 'Última actualización:',
    date: '15 de julio de 2026',
    intro: 'Toolaze vende créditos como compras únicas. Esta política explica cuándo pueden reembolsarse los créditos sin usar y cómo se gestionan los intentos de generación fallidos.',
    sections: [
      { title: '1. Créditos sin usar', body: 'Puedes solicitar un reembolso por créditos sin usar que permanezcan en tu cuenta de Toolaze. Calculamos el importe reembolsable según los créditos sin usar de la compra correspondiente, menos impuestos no reembolsables, comisiones del procesador, costes de contracargo, descuentos o valor promocional cuando corresponda.' },
      { title: '2. Créditos usados', body: 'Los créditos usados no son reembolsables una vez gastados en una generación entregada, una edición de IA completada, una ejecución de herramienta completada, una descarga u otro servicio completado. Los créditos promocionales, créditos de bonificación y créditos vencidos no son reembolsables salvo que la ley lo exija.' },
      { title: '3. Generación fallida', body: 'Si una generación falla y nuestro sistema confirma que no se entregó ningún resultado utilizable, los créditos cobrados se devuelven a tu cuenta. Esto es una devolución de créditos, no un reembolso en efectivo. Si los créditos no se devuelven automáticamente, contacta con soporte e incluye la hora de generación, el correo de la cuenta y cualquier mensaje de error.' },
      { title: '4. Validez de los créditos', body: 'Los créditos comprados son válidos durante 12 meses desde la fecha de compra. Los créditos vencidos no pueden reembolsarse, transferirse ni restaurarse salvo que la ley lo exija.' },
      { title: '5. Cómo solicitar un reembolso', body: 'Envía tu solicitud a support@toolaze.com desde el correo usado para la compra. Incluye el ID del pedido, correo de la cuenta, fecha de compra y motivo de la solicitud. Los reembolsos aprobados se envían al método de pago original mediante Creem o el procesador usado en el checkout.' },
      { title: '6. Abuso y excepciones', body: 'Podemos rechazar solicitudes de reembolso relacionadas con fraude, infracciones de políticas, abuso de contracargos, contenido prohibido o intentos de usar el servicio sin pagar. Nada en esta política limita los derechos del consumidor que no puedan renunciarse según la ley aplicable.' },
    ],
  },
  'zh-TW': {
    metadata: {
      title: '退款政策 - Toolaze',
      description: 'Toolaze 關於一次性點數購買、未使用點數、生成失敗點數退還與退款申請的退款政策。',
    },
    breadcrumb: '退款政策',
    title: '退款政策',
    lastUpdated: '最後更新：',
    date: '2026 年 7 月 15 日',
    intro: 'Toolaze 以一次性購買方式銷售點數。本政策說明未使用點數何時可以退款，以及生成失敗時如何處理。',
    sections: [
      { title: '1. 未使用點數', body: '你可以針對 Toolaze 帳號中尚未使用的點數申請退款。我們會根據相關購買中的未使用點數計算可退款金額，並在適用時扣除不可退還的稅費、付款處理費、拒付成本、折扣或促銷價值。' },
      { title: '2. 已使用點數', body: '點數一旦用於已交付的生成、已完成的 AI 編輯、已完成的工具操作、下載或其他已完成服務，即不可退款。促銷點數、贈送點數與過期點數除法律要求外不可退款。' },
      { title: '3. 生成失敗', body: '如果生成失敗，且我們的系統確認沒有交付可用結果，已扣除的點數會退回你的帳號。這是點數退還，不是現金退款。若點數沒有自動退回，請提供生成時間、帳號 Email 與錯誤訊息聯絡客服。' },
      { title: '4. 點數有效期', body: '購買的點數自購買日起 12 個月內有效。過期點數除法律要求外，不可退款、轉讓或恢復。' },
      { title: '5. 如何申請退款', body: '請使用購買時的 Email 寄信至 support@toolaze.com。請包含訂單 ID、帳號 Email、購買日期與申請原因。核准的退款會透過 Creem 或結帳時使用的付款處理方退回原付款方式。' },
      { title: '6. 濫用與例外', body: '我們可能拒絕與詐欺、政策違規、拒付濫用、禁止內容或試圖不付款使用服務相關的退款申請。本政策不限制適用法律下不可放棄的消費者權利。' },
    ],
  },
  pt: {
    metadata: {
      title: 'Política de reembolso - Toolaze',
      description: 'Política de reembolso da Toolaze para compras únicas de créditos, créditos não usados, devoluções por geração falhada e pedidos de reembolso.',
    },
    breadcrumb: 'Política de reembolso',
    title: 'Política de reembolso',
    lastUpdated: 'Última atualização:',
    date: '15 de julho de 2026',
    intro: 'A Toolaze vende créditos como compras únicas. Esta política explica quando créditos não usados podem ser reembolsados e como tentativas de geração falhadas são tratadas.',
    sections: [
      { title: '1. Créditos não usados', body: 'Você pode solicitar reembolso de créditos não usados que permaneçam na sua conta Toolaze. Calculamos o valor reembolsável com base nos créditos não usados da compra relevante, descontando impostos não reembolsáveis, taxas do processador, custos de contestação, descontos ou valor promocional quando aplicável.' },
      { title: '2. Créditos usados', body: 'Créditos usados não são reembolsáveis depois de gastos em uma geração entregue, edição de IA concluída, execução de ferramenta concluída, download ou outro serviço concluído. Créditos promocionais, bônus e créditos expirados não são reembolsáveis salvo exigência legal.' },
      { title: '3. Geração falhada', body: 'Se uma geração falhar e nosso sistema confirmar que nenhum resultado utilizável foi entregue, os créditos cobrados são devolvidos à sua conta. Isso é uma devolução de créditos, não um reembolso em dinheiro. Se os créditos não voltarem automaticamente, contate o suporte com horário da geração, email da conta e mensagem de erro.' },
      { title: '4. Validade dos créditos', body: 'Créditos comprados são válidos por 12 meses a partir da data da compra. Créditos expirados não podem ser reembolsados, transferidos ou restaurados salvo exigência legal.' },
      { title: '5. Como solicitar reembolso', body: 'Envie sua solicitação para support@toolaze.com a partir do email usado na compra. Inclua ID do pedido, email da conta, data da compra e motivo da solicitação. Reembolsos aprovados são enviados ao método de pagamento original pela Creem ou pelo processador usado no checkout.' },
      { title: '6. Abuso e exceções', body: 'Podemos recusar pedidos ligados a fraude, violações de política, abuso de contestação, conteúdo proibido ou tentativas de usar o serviço sem pagar. Nada nesta política limita direitos do consumidor que não possam ser renunciados pela lei aplicável.' },
    ],
  },
  fr: {
    metadata: {
      title: 'Politique de remboursement - Toolaze',
      description: 'Politique de remboursement Toolaze pour les achats uniques de crédits, les crédits inutilisés, les retours de crédits après génération échouée et les demandes de remboursement.',
    },
    breadcrumb: 'Politique de remboursement',
    title: 'Politique de remboursement',
    lastUpdated: 'Dernière mise à jour :',
    date: '15 juillet 2026',
    intro: 'Toolaze vend des crédits sous forme d’achats uniques. Cette politique explique quand les crédits inutilisés peuvent être remboursés et comment les échecs de génération sont traités.',
    sections: [
      { title: '1. Crédits inutilisés', body: 'Vous pouvez demander le remboursement des crédits inutilisés restant sur votre compte Toolaze. Nous calculons le montant remboursable à partir des crédits inutilisés de l’achat concerné, déduction faite des taxes non remboursables, frais de traitement, coûts de rétrofacturation, remises ou valeurs promotionnelles applicables.' },
      { title: '2. Crédits utilisés', body: 'Les crédits utilisés ne sont pas remboursables lorsqu’ils ont été dépensés pour une génération livrée, une édition IA terminée, une exécution d’outil terminée, un téléchargement ou un autre service terminé. Les crédits promotionnels, bonus et crédits expirés ne sont pas remboursables sauf obligation légale.' },
      { title: '3. Génération échouée', body: 'Si une génération échoue et que notre système confirme qu’aucun résultat utilisable n’a été livré, les crédits facturés sont retournés sur votre compte. Il s’agit d’un retour de crédits, pas d’un remboursement en espèces. Si les crédits ne reviennent pas automatiquement, contactez le support avec l’heure de génération, l’email du compte et le message d’erreur.' },
      { title: '4. Validité des crédits', body: 'Les crédits achetés sont valables 12 mois à compter de la date d’achat. Les crédits expirés ne peuvent pas être remboursés, transférés ou restaurés sauf obligation légale.' },
      { title: '5. Demander un remboursement', body: 'Envoyez votre demande à support@toolaze.com depuis l’email utilisé pour l’achat. Indiquez l’ID de commande, l’email du compte, la date d’achat et le motif de la demande. Les remboursements approuvés sont envoyés au moyen de paiement initial via Creem ou le processeur utilisé au checkout.' },
      { title: '6. Abus et exceptions', body: 'Nous pouvons refuser les demandes liées à la fraude, aux violations de politique, aux abus de rétrofacturation, aux contenus interdits ou aux tentatives d’utiliser le service sans payer. Cette politique ne limite aucun droit consommateur qui ne peut pas être exclu par la loi applicable.' },
    ],
  },
  ko: {
    metadata: {
      title: '환불 정책 - Toolaze',
      description: '일회성 크레딧 구매, 미사용 크레딧, 생성 실패 시 크레딧 반환, 환불 요청에 관한 Toolaze 환불 정책.',
    },
    breadcrumb: '환불 정책',
    title: '환불 정책',
    lastUpdated: '마지막 업데이트:',
    date: '2026년 7월 15일',
    intro: 'Toolaze는 크레딧을 일회성 구매로 판매합니다. 이 정책은 미사용 크레딧 환불 가능 조건과 생성 실패 처리 방식을 설명합니다.',
    sections: [
      { title: '1. 미사용 크레딧', body: 'Toolaze 계정에 남아 있는 미사용 크레딧에 대해 환불을 요청할 수 있습니다. 환불 가능 금액은 해당 구매의 미사용 크레딧을 기준으로 계산하며, 환불 불가 세금, 결제 처리 수수료, 차지백 비용, 할인 또는 프로모션 가치를 해당되는 경우 차감합니다.' },
      { title: '2. 사용한 크레딧', body: '전달된 생성 결과, 완료된 AI 편집, 완료된 도구 실행, 다운로드 또는 기타 완료된 서비스에 사용된 크레딧은 환불되지 않습니다. 프로모션 크레딧, 보너스 크레딧, 만료된 크레딧은 법에서 요구하지 않는 한 환불되지 않습니다.' },
      { title: '3. 생성 실패', body: '생성이 실패했고 당사 시스템이 사용 가능한 결과가 제공되지 않았음을 확인하면 차감된 크레딧은 계정으로 반환됩니다. 이는 현금 환불이 아닌 크레딧 반환입니다. 크레딧이 자동으로 반환되지 않으면 생성 시간, 계정 이메일, 오류 메시지를 포함해 지원팀에 문의하세요.' },
      { title: '4. 크레딧 유효기간', body: '구매한 크레딧은 구매일로부터 12개월 동안 유효합니다. 만료된 크레딧은 법에서 요구하지 않는 한 환불, 양도 또는 복원할 수 없습니다.' },
      { title: '5. 환불 요청 방법', body: '구매에 사용한 이메일에서 support@toolaze.com 으로 요청을 보내세요. 주문 ID, 계정 이메일, 구매일, 요청 사유를 포함하세요. 승인된 환불은 Creem 또는 체크아웃에 사용된 결제 처리사를 통해 원래 결제 수단으로 전송됩니다.' },
      { title: '6. 남용 및 예외', body: '사기, 정책 위반, 차지백 남용, 금지 콘텐츠, 비용을 지불하지 않고 서비스를 사용하려는 시도와 관련된 환불 요청은 거부될 수 있습니다. 이 정책은 적용 법률상 포기할 수 없는 소비자 권리를 제한하지 않습니다.' },
    ],
  },
  it: {
    metadata: {
      title: 'Politica sui rimborsi - Toolaze',
      description: 'Politica Toolaze sui rimborsi per acquisti una tantum di crediti, crediti inutilizzati, restituzioni per generazioni fallite e richieste di rimborso.',
    },
    breadcrumb: 'Politica sui rimborsi',
    title: 'Politica sui rimborsi',
    lastUpdated: 'Ultimo aggiornamento:',
    date: '15 luglio 2026',
    intro: 'Toolaze vende crediti come acquisti una tantum. Questa politica spiega quando i crediti inutilizzati possono essere rimborsati e come vengono gestiti i tentativi di generazione falliti.',
    sections: [
      { title: '1. Crediti inutilizzati', body: 'Puoi richiedere il rimborso dei crediti inutilizzati rimasti nel tuo account Toolaze. Calcoliamo l’importo rimborsabile in base ai crediti inutilizzati dell’acquisto rilevante, al netto di imposte non rimborsabili, commissioni del processore, costi di chargeback, sconti o valore promozionale quando applicabile.' },
      { title: '2. Crediti usati', body: 'I crediti usati non sono rimborsabili dopo essere stati spesi per una generazione consegnata, una modifica IA completata, un’esecuzione di strumento completata, un download o altro servizio completato. Crediti promozionali, bonus e crediti scaduti non sono rimborsabili salvo obbligo di legge.' },
      { title: '3. Generazione fallita', body: 'Se una generazione fallisce e il nostro sistema conferma che non è stato consegnato alcun output utilizzabile, i crediti addebitati vengono restituiti al tuo account. Questa è una restituzione di crediti, non un rimborso in denaro. Se i crediti non vengono restituiti automaticamente, contatta il supporto con ora della generazione, email dell’account ed eventuale messaggio di errore.' },
      { title: '4. Validità dei crediti', body: 'I crediti acquistati sono validi per 12 mesi dalla data di acquisto. I crediti scaduti non possono essere rimborsati, trasferiti o ripristinati salvo obbligo di legge.' },
      { title: '5. Come richiedere un rimborso', body: 'Invia la richiesta a support@toolaze.com dall’email usata per l’acquisto. Includi ID ordine, email dell’account, data di acquisto e motivo della richiesta. I rimborsi approvati vengono inviati al metodo di pagamento originale tramite Creem o il processore usato al checkout.' },
      { title: '6. Abusi ed eccezioni', body: 'Possiamo negare richieste collegate a frode, violazioni delle policy, abuso di chargeback, contenuti vietati o tentativi di usare il servizio senza pagare. Nulla in questa politica limita i diritti dei consumatori che non possono essere esclusi dalla legge applicabile.' },
    ],
  },
}

const acceptableUseCopies: Record<SupportPageLocale, SupportPolicyCopy> = {
  en: {
    metadata: {
      title: 'Acceptable Use Policy - Toolaze',
      description: 'Toolaze Acceptable Use Policy for AI generation, uploaded media, NSFW restrictions, identity safety, copyright, and illegal content.',
    },
    breadcrumb: 'Acceptable Use Policy',
    title: 'Acceptable Use Policy',
    lastUpdated: 'Last Updated:',
    date: 'July 15, 2026',
    intro: 'This policy applies to prompts, uploaded images, uploaded videos, reference media, generated outputs, downloads, and any other use of Toolaze. We may moderate prompts and uploads before generation and may block or remove content that violates this policy.',
    sections: [
      { title: '1. Sexual and NSFW Content', body: 'Do not use Toolaze to create, upload, edit, request, or distribute NSFW content, sexual content, nudity, fetish content, sexualized imagery, non-consensual intimate imagery, or sexual content involving minors. Any sexual content involving minors is strictly prohibited and may be reported.' },
      { title: '2. Illegal and Harmful Activity', body: 'Do not use Toolaze for illegal content, instructions for wrongdoing, fraud, scams, malware, weapon construction, evading law enforcement, trafficking, self-harm encouragement, or other activity that could cause real-world harm.' },
      { title: '3. Identity, Face, and Impersonation Safety', body: 'Do not create deceptive deepfake content, impersonation, fake endorsements, identity documents, misleading face swaps, non-consensual face edits, or content that suggests a real person said or did something they did not say or do.' },
      { title: '4. Harassment and Hate', body: 'Do not use Toolaze to harass, threaten, bully, shame, exploit, or dehumanize people. Content that promotes hate or violence against protected groups is prohibited.' },
      { title: '5. Copyright and Other Rights', body: 'You must not submit or generate content that infringes copyright, trademark, publicity rights, privacy rights, or contractual rights. You must have the rights needed for prompts, uploaded media, reference images, logos, product images, music, characters, and brand assets that you submit.' },
      { title: '6. Platform Abuse', body: 'Do not scrape, overload, bypass safety filters, automate abuse, resell account access, share accounts for misuse, attempt to extract model or system prompts, or interfere with Toolaze infrastructure.' },
      { title: '7. Enforcement', body: 'We may refuse prompts, remove outputs, return or withhold credits where appropriate, suspend accounts, deny refunds for policy abuse, or report serious violations. Questions can be sent to support@toolaze.com.' },
    ],
  },
  de: {
    metadata: {
      title: 'Richtlinie zur zulässigen Nutzung - Toolaze',
      description: 'Toolaze Richtlinie zur zulässigen Nutzung für KI-Generierung, hochgeladene Medien, NSFW-Einschränkungen, Identitätsschutz, Urheberrecht und illegale Inhalte.',
    },
    breadcrumb: 'Richtlinie zur zulässigen Nutzung',
    title: 'Richtlinie zur zulässigen Nutzung',
    lastUpdated: 'Zuletzt aktualisiert:',
    date: '15. Juli 2026',
    intro: 'Diese Richtlinie gilt für Prompts, hochgeladene Bilder, hochgeladene Videos, Referenzmedien, generierte Ergebnisse, Downloads und jede andere Nutzung von Toolaze. Wir können Prompts und Uploads vor der Generierung moderieren und Inhalte blockieren oder entfernen, die gegen diese Richtlinie verstoßen.',
    sections: [
      { title: '1. Sexuelle und NSFW-Inhalte', body: 'Nutze Toolaze nicht, um NSFW-Inhalte, sexuelle Inhalte, Nacktheit, Fetisch-Inhalte, sexualisierte Bilder, nicht einvernehmliche intime Bilder oder sexuelle Inhalte mit Minderjährigen zu erstellen, hochzuladen, zu bearbeiten, anzufordern oder zu verbreiten. Sexuelle Inhalte mit Minderjährigen sind strikt verboten und können gemeldet werden.' },
      { title: '2. Illegale und schädliche Aktivitäten', body: 'Nutze Toolaze nicht für illegale Inhalte, Anleitungen zu Fehlverhalten, Betrug, Scams, Malware, Waffenbau, Umgehung der Strafverfolgung, Menschenhandel, Ermutigung zu Selbstverletzung oder andere Aktivitäten, die realen Schaden verursachen könnten.' },
      { title: '3. Identitäts-, Gesichts- und Imitationsschutz', body: 'Erstelle keine täuschenden Deepfakes, Imitationen, falschen Empfehlungen, Ausweisdokumente, irreführenden Face Swaps, nicht einvernehmlichen Gesichtsänderungen oder Inhalte, die nahelegen, dass eine reale Person etwas gesagt oder getan hat, was sie nicht gesagt oder getan hat.' },
      { title: '4. Belästigung und Hass', body: 'Nutze Toolaze nicht, um Menschen zu belästigen, zu bedrohen, zu mobben, zu beschämen, auszunutzen oder zu entmenschlichen. Inhalte, die Hass oder Gewalt gegen geschützte Gruppen fördern, sind verboten.' },
      { title: '5. Urheberrecht und andere Rechte', body: 'Du darfst keine Inhalte einreichen oder generieren, die Urheberrecht, Markenrecht, Persönlichkeitsrechte, Datenschutzrechte oder vertragliche Rechte verletzen. Du musst die erforderlichen Rechte an Prompts, Uploads, Referenzbildern, Logos, Produktbildern, Musik, Figuren und Markenmaterial besitzen.' },
      { title: '6. Plattformmissbrauch', body: 'Scraping, Überlastung, Umgehung von Sicherheitsfiltern, automatisierter Missbrauch, Weiterverkauf von Kontozugängen, gemeinsames Nutzen von Konten zum Missbrauch, Extraktion von Modell- oder Systemprompts und Eingriffe in Toolaze-Infrastruktur sind untersagt.' },
      { title: '7. Durchsetzung', body: 'Wir können Prompts ablehnen, Outputs entfernen, Credits zurückgeben oder einbehalten, Konten sperren, Rückerstattungen bei Richtlinienmissbrauch verweigern oder schwere Verstöße melden. Fragen können an support@toolaze.com gesendet werden.' },
    ],
  },
  ja: {
    metadata: {
      title: '利用許容ポリシー - Toolaze',
      description: 'AI 生成、アップロードメディア、NSFW 制限、本人性の安全、著作権、違法コンテンツに関する Toolaze の利用許容ポリシー。',
    },
    breadcrumb: '利用許容ポリシー',
    title: '利用許容ポリシー',
    lastUpdated: '最終更新:',
    date: '2026年7月15日',
    intro: 'このポリシーは、プロンプト、アップロード画像、アップロード動画、参照メディア、生成結果、ダウンロード、その他 Toolaze の利用すべてに適用されます。当社は生成前にプロンプトやアップロードを審査し、このポリシーに違反するコンテンツをブロックまたは削除する場合があります。',
    sections: [
      { title: '1. 性的および NSFW コンテンツ', body: 'NSFW コンテンツ、性的コンテンツ、裸体、フェティッシュコンテンツ、性的に描写された画像、同意のない親密画像、未成年者に関わる性的コンテンツの作成、アップロード、編集、依頼、配布に Toolaze を使用しないでください。未成年者に関わる性的コンテンツは厳しく禁止され、通報される場合があります。' },
      { title: '2. 違法または有害な活動', body: '違法コンテンツ、不正行為の手順、詐欺、スキャム、マルウェア、武器製造、法執行の回避、人身取引、自傷の助長、その他現実世界で害を与える可能性のある活動に Toolaze を使用しないでください。' },
      { title: '3. 本人性、顔、なりすましの安全', body: '欺瞞的なディープフェイク、なりすまし、偽の推薦、身分証明書、誤解を招く顔交換、同意のない顔編集、実在人物が実際には言っていない、または行っていないことを示唆するコンテンツを作成しないでください。' },
      { title: '4. ハラスメントとヘイト', body: '人を嫌がらせ、脅迫、いじめ、辱め、搾取、非人間化するために Toolaze を使用しないでください。保護対象グループに対する憎悪や暴力を助長するコンテンツは禁止されています。' },
      { title: '5. 著作権およびその他の権利', body: '著作権、商標権、パブリシティ権、プライバシー権、契約上の権利を侵害するコンテンツを提出または生成してはいけません。プロンプト、アップロードメディア、参照画像、ロゴ、製品画像、音楽、キャラクター、ブランド素材について必要な権利を持っている必要があります。' },
      { title: '6. プラットフォームの不正利用', body: 'スクレイピング、過負荷、安全フィルターの回避、自動化された不正利用、アカウントアクセスの再販売、不正目的でのアカウント共有、モデルまたはシステムプロンプトの抽出、Toolaze インフラへの干渉を行わないでください。' },
      { title: '7. 執行', body: '当社は、プロンプトの拒否、出力の削除、必要に応じたクレジットの返還または保留、アカウント停止、ポリシー不正利用に関する返金拒否、重大な違反の通報を行う場合があります。質問は support@toolaze.com へ送信できます。' },
    ],
  },
  es: {
    metadata: {
      title: 'Política de uso aceptable - Toolaze',
      description: 'Política de uso aceptable de Toolaze para generación con IA, medios subidos, restricciones NSFW, seguridad de identidad, copyright y contenido ilegal.',
    },
    breadcrumb: 'Política de uso aceptable',
    title: 'Política de uso aceptable',
    lastUpdated: 'Última actualización:',
    date: '15 de julio de 2026',
    intro: 'Esta política se aplica a prompts, imágenes subidas, videos subidos, medios de referencia, resultados generados, descargas y cualquier otro uso de Toolaze. Podemos moderar prompts y cargas antes de la generación y bloquear o eliminar contenido que infrinja esta política.',
    sections: [
      { title: '1. Contenido sexual y NSFW', body: 'No uses Toolaze para crear, subir, editar, solicitar o distribuir contenido NSFW, contenido sexual, desnudez, contenido fetichista, imágenes sexualizadas, imágenes íntimas no consentidas o contenido sexual que involucre menores. Todo contenido sexual que involucre menores está estrictamente prohibido y puede ser denunciado.' },
      { title: '2. Actividad ilegal y dañina', body: 'No uses Toolaze para contenido ilegal, instrucciones para cometer delitos, fraude, estafas, malware, construcción de armas, evasión de la ley, trata, fomento de autolesiones u otra actividad que pueda causar daño real.' },
      { title: '3. Seguridad de identidad, rostro e impersonación', body: 'No crees deepfakes engañosos, impersonaciones, falsos respaldos, documentos de identidad, intercambios de rostro engañosos, ediciones faciales no consentidas o contenido que sugiera que una persona real dijo o hizo algo que no dijo o no hizo.' },
      { title: '4. Acoso y odio', body: 'No uses Toolaze para acosar, amenazar, intimidar, avergonzar, explotar o deshumanizar a personas. Está prohibido el contenido que promueva odio o violencia contra grupos protegidos.' },
      { title: '5. Copyright y otros derechos', body: 'No debes enviar ni generar contenido que infrinja derechos de autor, marcas, derechos de publicidad, privacidad o derechos contractuales. Debes contar con los derechos necesarios para prompts, medios subidos, imágenes de referencia, logos, imágenes de productos, música, personajes y activos de marca que envíes.' },
      { title: '6. Abuso de la plataforma', body: 'No hagas scraping, sobrecargues, evites filtros de seguridad, automatices abuso, revendas acceso a cuentas, compartas cuentas para uso indebido, intentes extraer prompts del modelo o del sistema, ni interfieras con la infraestructura de Toolaze.' },
      { title: '7. Cumplimiento', body: 'Podemos rechazar prompts, eliminar resultados, devolver o retener créditos cuando corresponda, suspender cuentas, negar reembolsos por abuso de políticas o reportar infracciones graves. Las preguntas pueden enviarse a support@toolaze.com.' },
    ],
  },
  'zh-TW': {
    metadata: {
      title: '可接受使用政策 - Toolaze',
      description: 'Toolaze 關於 AI 生成、上傳媒體、NSFW 限制、身份安全、著作權與非法內容的可接受使用政策。',
    },
    breadcrumb: '可接受使用政策',
    title: '可接受使用政策',
    lastUpdated: '最後更新：',
    date: '2026 年 7 月 15 日',
    intro: '本政策適用於提示詞、上傳圖片、上傳影片、參考媒體、生成結果、下載以及任何 Toolaze 使用行為。我們可能在生成前審核提示詞和上傳內容，並可能封鎖或移除違反本政策的內容。',
    sections: [
      { title: '1. 性與 NSFW 內容', body: '不得使用 Toolaze 建立、上傳、編輯、要求或散布 NSFW 內容、性內容、裸露、戀物內容、性化影像、未經同意的私密影像，或涉及未成年人的性內容。任何涉及未成年人的性內容均嚴格禁止，並可能被通報。' },
      { title: '2. 非法與有害活動', body: '不得使用 Toolaze 製作非法內容、犯罪指引、詐欺、詐騙、惡意軟體、武器製作、規避執法、人口販運、鼓勵自傷或其他可能造成現實傷害的活動。' },
      { title: '3. 身份、臉部與冒充安全', body: '不得建立具欺騙性的深偽內容、冒充、虛假背書、身份文件、誤導性的換臉、未經同意的臉部編輯，或暗示真人說過或做過其未曾說過或做過事情的內容。' },
      { title: '4. 騷擾與仇恨', body: '不得使用 Toolaze 騷擾、威脅、霸凌、羞辱、剝削或非人化他人。禁止宣揚針對受保護群體的仇恨或暴力內容。' },
      { title: '5. 著作權與其他權利', body: '你不得提交或生成侵犯著作權、商標權、公開權、隱私權或契約權利的內容。你必須擁有提交提示詞、上傳媒體、參考圖片、標誌、產品圖片、音樂、角色與品牌素材所需的權利。' },
      { title: '6. 平台濫用', body: '不得爬取、過度負載、繞過安全篩選器、自動化濫用、轉售帳號存取、共享帳號進行濫用、嘗試提取模型或系統提示詞，或干擾 Toolaze 基礎設施。' },
      { title: '7. 執行', body: '我們可能拒絕提示詞、移除輸出、視情況退回或保留點數、暫停帳號、拒絕因政策濫用產生的退款，或通報嚴重違規。問題可寄至 support@toolaze.com。' },
    ],
  },
  pt: {
    metadata: {
      title: 'Política de uso aceitável - Toolaze',
      description: 'Política de uso aceitável da Toolaze para geração por IA, mídia enviada, restrições NSFW, segurança de identidade, direitos autorais e conteúdo ilegal.',
    },
    breadcrumb: 'Política de uso aceitável',
    title: 'Política de uso aceitável',
    lastUpdated: 'Última atualização:',
    date: '15 de julho de 2026',
    intro: 'Esta política se aplica a prompts, imagens enviadas, vídeos enviados, mídias de referência, resultados gerados, downloads e qualquer outro uso da Toolaze. Podemos moderar prompts e envios antes da geração e bloquear ou remover conteúdo que viole esta política.',
    sections: [
      { title: '1. Conteúdo sexual e NSFW', body: 'Não use a Toolaze para criar, enviar, editar, solicitar ou distribuir conteúdo NSFW, conteúdo sexual, nudez, conteúdo fetichista, imagens sexualizadas, imagens íntimas sem consentimento ou conteúdo sexual envolvendo menores. Qualquer conteúdo sexual envolvendo menores é estritamente proibido e pode ser denunciado.' },
      { title: '2. Atividade ilegal e prejudicial', body: 'Não use a Toolaze para conteúdo ilegal, instruções para delitos, fraude, golpes, malware, construção de armas, evasão da lei, tráfico, incentivo à automutilação ou outra atividade que possa causar dano real.' },
      { title: '3. Segurança de identidade, rosto e impersonação', body: 'Não crie deepfakes enganosos, impersonação, falsos endossos, documentos de identidade, trocas de rosto enganosas, edições faciais sem consentimento ou conteúdo que sugira que uma pessoa real disse ou fez algo que não disse ou não fez.' },
      { title: '4. Assédio e ódio', body: 'Não use a Toolaze para assediar, ameaçar, intimidar, envergonhar, explorar ou desumanizar pessoas. Conteúdo que promova ódio ou violência contra grupos protegidos é proibido.' },
      { title: '5. Direitos autorais e outros direitos', body: 'Você não deve enviar ou gerar conteúdo que infrinja direitos autorais, marcas, direitos de imagem, privacidade ou direitos contratuais. Você deve ter os direitos necessários sobre prompts, mídias enviadas, imagens de referência, logos, imagens de produtos, músicas, personagens e ativos de marca enviados.' },
      { title: '6. Abuso da plataforma', body: 'Não faça scraping, sobrecarregue, contorne filtros de segurança, automatize abuso, revenda acesso à conta, compartilhe contas para uso indevido, tente extrair prompts do modelo ou sistema, nem interfira na infraestrutura da Toolaze.' },
      { title: '7. Aplicação', body: 'Podemos recusar prompts, remover saídas, devolver ou reter créditos quando apropriado, suspender contas, negar reembolsos por abuso de política ou denunciar violações graves. Perguntas podem ser enviadas para support@toolaze.com.' },
    ],
  },
  fr: {
    metadata: {
      title: 'Politique d’utilisation acceptable - Toolaze',
      description: 'Politique d’utilisation acceptable Toolaze pour la génération IA, les médias importés, les restrictions NSFW, la sécurité d’identité, le droit d’auteur et les contenus illégaux.',
    },
    breadcrumb: 'Politique d’utilisation acceptable',
    title: 'Politique d’utilisation acceptable',
    lastUpdated: 'Dernière mise à jour :',
    date: '15 juillet 2026',
    intro: 'Cette politique s’applique aux prompts, images importées, vidéos importées, médias de référence, sorties générées, téléchargements et à toute autre utilisation de Toolaze. Nous pouvons modérer les prompts et imports avant génération et bloquer ou supprimer les contenus qui enfreignent cette politique.',
    sections: [
      { title: '1. Contenu sexuel et NSFW', body: 'N’utilisez pas Toolaze pour créer, importer, modifier, demander ou distribuer du contenu NSFW, sexuel, de nudité, fétichiste, sexualisé, intime non consenti ou impliquant des mineurs. Tout contenu sexuel impliquant des mineurs est strictement interdit et peut être signalé.' },
      { title: '2. Activité illégale et nuisible', body: 'N’utilisez pas Toolaze pour du contenu illégal, des instructions de méfait, fraude, arnaques, malware, construction d’armes, contournement des forces de l’ordre, trafic, encouragement à l’automutilation ou toute activité pouvant causer un dommage réel.' },
      { title: '3. Sécurité d’identité, de visage et d’usurpation', body: 'Ne créez pas de deepfakes trompeurs, usurpations, faux soutiens, documents d’identité, échanges de visage trompeurs, modifications de visage non consenties ou contenus suggérant qu’une personne réelle a dit ou fait quelque chose qu’elle n’a pas dit ou fait.' },
      { title: '4. Harcèlement et haine', body: 'N’utilisez pas Toolaze pour harceler, menacer, intimider, humilier, exploiter ou déshumaniser des personnes. Les contenus qui promeuvent la haine ou la violence contre des groupes protégés sont interdits.' },
      { title: '5. Droit d’auteur et autres droits', body: 'Vous ne devez pas soumettre ni générer de contenu portant atteinte au droit d’auteur, aux marques, droits à l’image, droits à la vie privée ou droits contractuels. Vous devez disposer des droits nécessaires pour les prompts, médias importés, images de référence, logos, images produit, musiques, personnages et actifs de marque soumis.' },
      { title: '6. Abus de plateforme', body: 'Ne faites pas de scraping, surcharge, contournement des filtres de sécurité, automatisation d’abus, revente d’accès au compte, partage de compte à des fins abusives, extraction de prompts modèle ou système, ni interférence avec l’infrastructure Toolaze.' },
      { title: '7. Application', body: 'Nous pouvons refuser des prompts, supprimer des sorties, retourner ou retenir des crédits si nécessaire, suspendre des comptes, refuser des remboursements en cas d’abus de politique ou signaler des violations graves. Les questions peuvent être envoyées à support@toolaze.com.' },
    ],
  },
  ko: {
    metadata: {
      title: '허용 사용 정책 - Toolaze',
      description: 'AI 생성, 업로드 미디어, NSFW 제한, 신원 안전, 저작권, 불법 콘텐츠에 관한 Toolaze 허용 사용 정책.',
    },
    breadcrumb: '허용 사용 정책',
    title: '허용 사용 정책',
    lastUpdated: '마지막 업데이트:',
    date: '2026년 7월 15일',
    intro: '이 정책은 프롬프트, 업로드한 이미지, 업로드한 비디오, 참조 미디어, 생성 결과, 다운로드 및 Toolaze의 기타 모든 사용에 적용됩니다. 당사는 생성 전에 프롬프트와 업로드를 조정할 수 있으며, 이 정책을 위반하는 콘텐츠를 차단하거나 제거할 수 있습니다.',
    sections: [
      { title: '1. 성적 및 NSFW 콘텐츠', body: 'NSFW 콘텐츠, 성적 콘텐츠, 노출, 페티시 콘텐츠, 성적으로 묘사된 이미지, 동의 없는 친밀 이미지 또는 미성년자가 관련된 성적 콘텐츠를 만들거나 업로드, 편집, 요청, 배포하는 데 Toolaze를 사용하지 마세요. 미성년자가 관련된 모든 성적 콘텐츠는 엄격히 금지되며 신고될 수 있습니다.' },
      { title: '2. 불법 및 유해 활동', body: '불법 콘텐츠, 범죄 지침, 사기, 스캠, 악성코드, 무기 제작, 법 집행 회피, 인신매매, 자해 조장 또는 실제 피해를 초래할 수 있는 기타 활동에 Toolaze를 사용하지 마세요.' },
      { title: '3. 신원, 얼굴 및 사칭 안전', body: '기만적인 딥페이크, 사칭, 가짜 추천, 신분증, 오해를 부르는 얼굴 교체, 동의 없는 얼굴 편집, 실제 인물이 말하거나 행동하지 않은 것을 말하거나 행동한 것처럼 보이게 하는 콘텐츠를 만들지 마세요.' },
      { title: '4. 괴롭힘과 혐오', body: '사람을 괴롭히거나 위협, 따돌림, 모욕, 착취 또는 비인간화하기 위해 Toolaze를 사용하지 마세요. 보호 대상 집단에 대한 혐오나 폭력을 조장하는 콘텐츠는 금지됩니다.' },
      { title: '5. 저작권 및 기타 권리', body: '저작권, 상표권, 퍼블리시티권, 개인정보권 또는 계약상 권리를 침해하는 콘텐츠를 제출하거나 생성해서는 안 됩니다. 제출하는 프롬프트, 업로드 미디어, 참조 이미지, 로고, 제품 이미지, 음악, 캐릭터 및 브랜드 자산에 필요한 권리를 보유해야 합니다.' },
      { title: '6. 플랫폼 남용', body: '스크래핑, 과부하, 안전 필터 우회, 자동화된 남용, 계정 접근 재판매, 오용 목적의 계정 공유, 모델 또는 시스템 프롬프트 추출 시도, Toolaze 인프라 방해를 하지 마세요.' },
      { title: '7. 집행', body: '당사는 프롬프트 거부, 결과 제거, 적절한 경우 크레딧 반환 또는 보류, 계정 정지, 정책 남용에 대한 환불 거부, 심각한 위반 신고를 할 수 있습니다. 질문은 support@toolaze.com 으로 보낼 수 있습니다.' },
    ],
  },
  it: {
    metadata: {
      title: 'Politica di uso accettabile - Toolaze',
      description: 'Politica di uso accettabile Toolaze per generazione IA, media caricati, restrizioni NSFW, sicurezza dell’identità, copyright e contenuti illegali.',
    },
    breadcrumb: 'Politica di uso accettabile',
    title: 'Politica di uso accettabile',
    lastUpdated: 'Ultimo aggiornamento:',
    date: '15 luglio 2026',
    intro: 'Questa politica si applica a prompt, immagini caricate, video caricati, media di riferimento, output generati, download e qualsiasi altro uso di Toolaze. Possiamo moderare prompt e caricamenti prima della generazione e bloccare o rimuovere contenuti che violano questa politica.',
    sections: [
      { title: '1. Contenuti sessuali e NSFW', body: 'Non usare Toolaze per creare, caricare, modificare, richiedere o distribuire contenuti NSFW, sessuali, nudità, contenuti fetish, immagini sessualizzate, immagini intime non consensuali o contenuti sessuali che coinvolgono minori. Qualsiasi contenuto sessuale che coinvolge minori è strettamente vietato e può essere segnalato.' },
      { title: '2. Attività illegali e dannose', body: 'Non usare Toolaze per contenuti illegali, istruzioni per illeciti, frodi, truffe, malware, costruzione di armi, elusione delle forze dell’ordine, traffico, incoraggiamento all’autolesionismo o altre attività che possano causare danni reali.' },
      { title: '3. Sicurezza di identità, volto e impersonificazione', body: 'Non creare deepfake ingannevoli, impersonificazioni, falsi endorsement, documenti di identità, scambi di volto fuorvianti, modifiche del volto non consensuali o contenuti che suggeriscano che una persona reale abbia detto o fatto qualcosa che non ha detto o fatto.' },
      { title: '4. Molestie e odio', body: 'Non usare Toolaze per molestare, minacciare, bullizzare, umiliare, sfruttare o disumanizzare persone. Sono vietati i contenuti che promuovono odio o violenza contro gruppi protetti.' },
      { title: '5. Copyright e altri diritti', body: 'Non devi inviare o generare contenuti che violino copyright, marchi, diritti di immagine, privacy o diritti contrattuali. Devi avere i diritti necessari per prompt, media caricati, immagini di riferimento, loghi, immagini prodotto, musica, personaggi e asset di marca che invii.' },
      { title: '6. Abuso della piattaforma', body: 'Non effettuare scraping, sovraccaricare, aggirare filtri di sicurezza, automatizzare abusi, rivendere accessi account, condividere account per uso improprio, tentare di estrarre prompt modello o sistema, né interferire con l’infrastruttura Toolaze.' },
      { title: '7. Applicazione', body: 'Possiamo rifiutare prompt, rimuovere output, restituire o trattenere crediti quando appropriato, sospendere account, negare rimborsi per abuso delle policy o segnalare violazioni gravi. Le domande possono essere inviate a support@toolaze.com.' },
    ],
  },
}

const contactCopies: Record<SupportPageLocale, ContactPageCopy> = {
  en: {
    metadata: {
      title: 'Contact Toolaze Support',
      description: 'Contact Toolaze for support, refunds, account help, billing questions, and abuse reports.',
    },
    breadcrumb: 'Contact',
    eyebrow: 'Support',
    title: 'Contact Toolaze',
    description: 'For product support, credit questions, billing issues, refund requests, or abuse reports, contact us at support@toolaze.com.',
    responseTime: 'We aim to respond within 3 business days.',
    cards: [
      { title: 'Refund Requests', body: 'Include your order ID, account email, purchase date, and the reason for the request.', linkLabel: 'Refund Policy', linkHref: '/refund-policy' },
      { title: 'Abuse Reports', body: 'Report suspected policy violations, impersonation, unsafe content, copyright misuse, or other abuse.' },
      { title: 'Product Website', body: 'https://toolaze.com' },
      { title: 'Operator', body: 'Toolaze Lab' },
    ],
  },
  de: {
    metadata: { title: 'Toolaze Support kontaktieren', description: 'Kontaktiere Toolaze für Support, Rückerstattungen, Kontohilfe, Abrechnungsfragen und Missbrauchsmeldungen.' },
    breadcrumb: 'Kontakt',
    eyebrow: 'Support',
    title: 'Toolaze kontaktieren',
    description: 'Für Produktsupport, Credit-Fragen, Abrechnungsprobleme, Rückerstattungen oder Missbrauchsmeldungen kontaktiere uns unter support@toolaze.com.',
    responseTime: 'Wir bemühen uns, innerhalb von 3 Werktagen zu antworten.',
    cards: [
      { title: 'Rückerstattungsanfragen', body: 'Gib Bestell-ID, Konto-E-Mail, Kaufdatum und den Grund der Anfrage an.', linkLabel: 'Rückerstattungsrichtlinie', linkHref: '/refund-policy' },
      { title: 'Missbrauch melden', body: 'Melde vermutete Richtlinienverstöße, Imitation, unsichere Inhalte, Urheberrechtsmissbrauch oder anderen Missbrauch.' },
      { title: 'Produktwebsite', body: 'https://toolaze.com' },
      { title: 'Betreiber', body: 'Toolaze Lab' },
    ],
  },
  ja: {
    metadata: { title: 'Toolaze サポートへのお問い合わせ', description: 'サポート、返金、アカウント、請求、悪用報告について Toolaze にお問い合わせください。' },
    breadcrumb: 'お問い合わせ',
    eyebrow: 'サポート',
    title: 'Toolaze に問い合わせる',
    description: '製品サポート、クレジット、請求、返金申請、悪用報告については support@toolaze.com までご連絡ください。',
    responseTime: '通常 3 営業日以内の返信を目指しています。',
    cards: [
      { title: '返金申請', body: '注文 ID、アカウントメール、購入日、申請理由を含めてください。', linkLabel: '返金ポリシー', linkHref: '/refund-policy' },
      { title: '悪用報告', body: 'ポリシー違反、なりすまし、安全でないコンテンツ、著作権の不正利用、その他の悪用を報告してください。' },
      { title: '製品サイト', body: 'https://toolaze.com' },
      { title: '運営者', body: 'Toolaze Lab' },
    ],
  },
  es: {
    metadata: { title: 'Contactar con soporte de Toolaze', description: 'Contacta con Toolaze para soporte, reembolsos, ayuda de cuenta, facturación y reportes de abuso.' },
    breadcrumb: 'Contacto',
    eyebrow: 'Soporte',
    title: 'Contactar con Toolaze',
    description: 'Para soporte del producto, preguntas sobre créditos, facturación, reembolsos o reportes de abuso, contáctanos en support@toolaze.com.',
    responseTime: 'Intentamos responder en un plazo de 3 días laborables.',
    cards: [
      { title: 'Solicitudes de reembolso', body: 'Incluye tu ID de pedido, correo de la cuenta, fecha de compra y motivo de la solicitud.', linkLabel: 'Política de reembolsos', linkHref: '/refund-policy' },
      { title: 'Reportes de abuso', body: 'Reporta posibles infracciones de políticas, impersonación, contenido inseguro, uso indebido de copyright u otros abusos.' },
      { title: 'Sitio del producto', body: 'https://toolaze.com' },
      { title: 'Operador', body: 'Toolaze Lab' },
    ],
  },
  'zh-TW': {
    metadata: { title: '聯絡 Toolaze 支援', description: '聯絡 Toolaze 取得支援、退款、帳號協助、帳務問題與濫用通報。' },
    breadcrumb: '聯絡我們',
    eyebrow: '支援',
    title: '聯絡 Toolaze',
    description: '若需要產品支援、點數問題、帳務協助、退款申請或濫用通報，請寄信至 support@toolaze.com。',
    responseTime: '我們通常會在 3 個工作天內回覆。',
    cards: [
      { title: '退款申請', body: '請提供訂單 ID、帳號 Email、購買日期與申請原因。', linkLabel: '退款政策', linkHref: '/refund-policy' },
      { title: '濫用通報', body: '通報疑似政策違規、冒充、不安全內容、著作權濫用或其他濫用行為。' },
      { title: '產品網站', body: 'https://toolaze.com' },
      { title: '營運方', body: 'Toolaze Lab' },
    ],
  },
  pt: {
    metadata: { title: 'Contato com o suporte da Toolaze', description: 'Entre em contato com a Toolaze para suporte, reembolsos, ajuda de conta, dúvidas de cobrança e denúncias de abuso.' },
    breadcrumb: 'Contato',
    eyebrow: 'Suporte',
    title: 'Contato com a Toolaze',
    description: 'Para suporte do produto, dúvidas sobre créditos, cobrança, reembolsos ou denúncias de abuso, fale conosco em support@toolaze.com.',
    responseTime: 'Nosso objetivo é responder em até 3 dias úteis.',
    cards: [
      { title: 'Pedidos de reembolso', body: 'Inclua ID do pedido, email da conta, data da compra e motivo da solicitação.', linkLabel: 'Política de reembolso', linkHref: '/refund-policy' },
      { title: 'Denúncias de abuso', body: 'Denuncie suspeitas de violações de política, impersonação, conteúdo inseguro, uso indevido de direitos autorais ou outro abuso.' },
      { title: 'Site do produto', body: 'https://toolaze.com' },
      { title: 'Operador', body: 'Toolaze Lab' },
    ],
  },
  fr: {
    metadata: { title: 'Contacter le support Toolaze', description: 'Contactez Toolaze pour le support, les remboursements, l’aide de compte, les questions de facturation et les signalements d’abus.' },
    breadcrumb: 'Contact',
    eyebrow: 'Support',
    title: 'Contacter Toolaze',
    description: 'Pour le support produit, les questions de crédits, la facturation, les demandes de remboursement ou les signalements d’abus, contactez-nous à support@toolaze.com.',
    responseTime: 'Nous visons une réponse sous 3 jours ouvrés.',
    cards: [
      { title: 'Demandes de remboursement', body: 'Indiquez votre ID de commande, email de compte, date d’achat et motif de la demande.', linkLabel: 'Politique de remboursement', linkHref: '/refund-policy' },
      { title: 'Signalements d’abus', body: 'Signalez les violations présumées, usurpations, contenus dangereux, abus de droit d’auteur ou autres abus.' },
      { title: 'Site du produit', body: 'https://toolaze.com' },
      { title: 'Opérateur', body: 'Toolaze Lab' },
    ],
  },
  ko: {
    metadata: { title: 'Toolaze 지원팀 문의', description: '지원, 환불, 계정 도움, 결제 문의 및 악용 신고를 위해 Toolaze에 문의하세요.' },
    breadcrumb: '문의',
    eyebrow: '지원',
    title: 'Toolaze에 문의하기',
    description: '제품 지원, 크레딧 문의, 결제 문제, 환불 요청 또는 악용 신고는 support@toolaze.com 으로 연락하세요.',
    responseTime: '영업일 기준 3일 이내 답변을 목표로 합니다.',
    cards: [
      { title: '환불 요청', body: '주문 ID, 계정 이메일, 구매일, 요청 사유를 포함하세요.', linkLabel: '환불 정책', linkHref: '/refund-policy' },
      { title: '악용 신고', body: '정책 위반 의심, 사칭, 안전하지 않은 콘텐츠, 저작권 오용 또는 기타 악용을 신고하세요.' },
      { title: '제품 웹사이트', body: 'https://toolaze.com' },
      { title: '운영자', body: 'Toolaze Lab' },
    ],
  },
  it: {
    metadata: { title: 'Contatta il supporto Toolaze', description: 'Contatta Toolaze per supporto, rimborsi, aiuto account, domande di fatturazione e segnalazioni di abuso.' },
    breadcrumb: 'Contatto',
    eyebrow: 'Supporto',
    title: 'Contatta Toolaze',
    description: 'Per supporto prodotto, domande sui crediti, problemi di fatturazione, richieste di rimborso o segnalazioni di abuso, contattaci a support@toolaze.com.',
    responseTime: 'Puntiamo a rispondere entro 3 giorni lavorativi.',
    cards: [
      { title: 'Richieste di rimborso', body: 'Includi ID ordine, email account, data di acquisto e motivo della richiesta.', linkLabel: 'Politica sui rimborsi', linkHref: '/refund-policy' },
      { title: 'Segnalazioni di abuso', body: 'Segnala sospette violazioni delle policy, impersonificazione, contenuti non sicuri, uso improprio del copyright o altri abusi.' },
      { title: 'Sito prodotto', body: 'https://toolaze.com' },
      { title: 'Operatore', body: 'Toolaze Lab' },
    ],
  },
}

export function getSupportPolicyCopy(page: SupportPolicyKey, locale: string): SupportPolicyCopy {
  const normalizedLocale = normalizeSupportLocale(locale)
  return page === 'refundPolicy'
    ? refundPolicyCopies[normalizedLocale]
    : acceptableUseCopies[normalizedLocale]
}

export function getContactPageCopy(locale: string): ContactPageCopy {
  return contactCopies[normalizeSupportLocale(locale)]
}
