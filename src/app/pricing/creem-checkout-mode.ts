export const CREEM_CHECKOUT_MODE_EMBEDDED = 'embedded'

export function shouldUseEmbeddedCheckout(mode = process.env.NEXT_PUBLIC_CREEM_CHECKOUT_MODE) {
  return mode === CREEM_CHECKOUT_MODE_EMBEDDED
}
