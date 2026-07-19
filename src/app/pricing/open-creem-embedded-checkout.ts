import type { CreemCheckoutOptions } from '@creem_io/embed'

type EmbeddedCheckoutOptions = Pick<CreemCheckoutOptions, 'onClose'>

export async function openCreemEmbeddedCheckout(
  checkoutUrl: string,
  options: EmbeddedCheckoutOptions = {},
) {
  const { CreemEmbedCheckout } = await import('@creem_io/embed')

  return CreemEmbedCheckout.create({
    checkoutUrl,
    theme: 'light',
    ...options,
  })
}
