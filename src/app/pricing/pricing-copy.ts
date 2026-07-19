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

export function getPricePerCredit(plan: PricingPlan): number {
  return Number(plan.price.replace('$', '')) / plan.credits
}

export function formatPricePerCredit(plan: PricingPlan): string {
  return `$${getPricePerCredit(plan).toFixed(3)} / credit`
}

export function getBonusPercent(plan: PricingPlan): number {
  if (plan.baseCredits === 0) return 0
  return Math.round((plan.bonusCredits / plan.baseCredits) * 100)
}
