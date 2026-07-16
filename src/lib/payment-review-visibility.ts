export const HIDE_UNVERIFIED_SOCIAL_PROOF_FOR_PAYMENT_REVIEW = true

const PAYMENT_REVIEW_SOCIAL_PROOF_SECTIONS = new Set([
  'rating',
  'testimonials',
  'reviews',
  'comments',
])

export function shouldRenderPaymentReviewSocialProofSection(sectionKey: string) {
  return !HIDE_UNVERIFIED_SOCIAL_PROOF_FOR_PAYMENT_REVIEW || !PAYMENT_REVIEW_SOCIAL_PROOF_SECTIONS.has(sectionKey)
}

export function filterPaymentReviewSections(sections: readonly string[] = []) {
  return sections.filter(shouldRenderPaymentReviewSocialProofSection)
}

export function sanitizePaymentReviewCommonTranslations<T extends Record<string, unknown> | null | undefined>(
  translations: T
): T {
  if (!translations || !HIDE_UNVERIFIED_SOCIAL_PROOF_FOR_PAYMENT_REVIEW) return translations

  const {
    rating: _rating,
    testimonials: _testimonials,
    reviews: _reviews,
    comments: _comments,
    ...safeTranslations
  } = translations

  return safeTranslations as T
}
