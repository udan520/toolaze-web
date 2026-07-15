import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import {
  PRICING_FAQ,
  PRICING_PLANS,
  getBonusPercent,
  getPricePerCredit,
} from './pricing-copy'
import { BROWSER_LOCALE_REDIRECT_SCRIPT } from '../../lib/browser-locale-redirect'
import { getPreferredLocalizedUrl } from '../../lib/site-language-switch'

test('pricing plans expose one-time packs with bonus credits instead of discounted unit pricing', () => {
  assert.equal(PRICING_PLANS.length, 6)
  assert.deepEqual(
    PRICING_PLANS.map((plan) => [plan.name, plan.price, plan.baseCredits, plan.bonusCredits, plan.credits]),
    [
      ['Starter', '$1.99', 200, 0, 200],
      ['Creator', '$8.99', 900, 100, 1000],
      ['Growth', '$39.99', 4000, 1000, 5000],
      ['Studio', '$69.99', 7000, 3000, 10000],
      ['Scale', '$179.99', 18000, 12000, 30000],
      ['Business', '$249.99', 25000, 25000, 50000],
    ],
  )

  assert.equal(PRICING_PLANS.find((plan) => plan.price === '$8.99')?.badge, 'Most Popular')

  for (const plan of PRICING_PLANS) {
    assert.equal(plan.billingLabel, 'One-time purchase')
    assert.equal(plan.validity, 'Credits valid for 12 months')
  }
})

test('unit prices are calculated from amount paid and total credits received', () => {
  assert.deepEqual(
    PRICING_PLANS.map((plan) => [plan.name, getPricePerCredit(plan).toFixed(3)]),
    [
      ['Starter', '0.010'],
      ['Creator', '0.009'],
      ['Growth', '0.008'],
      ['Studio', '0.007'],
      ['Scale', '0.006'],
      ['Business', '0.005'],
    ],
  )
})

test('bonus packs keep the base credit price and show increasing bonus value', () => {
  const bonusPercents = PRICING_PLANS.map(getBonusPercent)
  assert.deepEqual(bonusPercents, [0, 11, 25, 43, 67, 100])

  for (const plan of PRICING_PLANS.slice(1)) {
    assert.ok(plan.bonusCredits > 0, `${plan.name} should include bonus credits`)
  }
})

test('pricing FAQ covers failed generations, commercial use, and unused credit refunds', () => {
  assert.ok(PRICING_FAQ.some((item) => /fail/i.test(item.question) && /returned|refunded/i.test(item.answer)))
  assert.ok(PRICING_FAQ.some((item) => /commercial/i.test(item.question) && /commercial/i.test(item.answer)))
  assert.ok(PRICING_FAQ.some((item) => /refund/i.test(item.question) && /unused credits/i.test(item.answer)))
  assert.ok(PRICING_FAQ.some((item) => /subscription/i.test(item.question) && /one-time/i.test(item.answer)))
})

test('pricing remains an English canonical route from localized navigation', () => {
  assert.equal(getPreferredLocalizedUrl('/pricing', 'de'), '/pricing')
  assert.equal(getPreferredLocalizedUrl('/pricing', 'zh-TW'), '/pricing')
  assert.match(BROWSER_LOCALE_REDIRECT_SCRIPT, /root==='pricing'/)
})

test('pricing page keeps the hero and checkout rows readable on mobile', () => {
  const pageSource = readFileSync('src/app/pricing/page.tsx', 'utf8')

  assert.match(pageSource, /max-w-\[21rem\]/)
  assert.match(pageSource, /sm:max-w-3xl/)
  assert.match(pageSource, /flex flex-col gap-1 sm:flex-row/)
  assert.match(pageSource, /sm:flex-row/)
  assert.match(pageSource, /\/credits-icons\/diamond-3d-indigo\.svg/)
  assert.match(pageSource, /const bonusBadge = bonusPercent > 0/)
  assert.match(pageSource, /const hasTopBadge = Boolean\(bonusBadge \|\| plan\.badge\)/)
  assert.match(pageSource, /right-0 top-0 rounded-bl-2xl bg-amber-100/)
  assert.match(pageSource, /\+\{plan\.bonusCredits\.toLocaleString\('en-US'\)\} bonus/)
  assert.match(pageSource, /bg-clip-text text-sm text-transparent/)
  assert.doesNotMatch(pageSource, /rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 px-3 py-1 text-xs text-indigo-50/)
  assert.doesNotMatch(pageSource, /mx-1\.5 text-indigo-400/)
  assert.doesNotMatch(pageSource, /bonus credits included/)
  assert.doesNotMatch(pageSource, /paid credits/)
  assert.doesNotMatch(pageSource, /One-time purchase\s*<\/span>/)
  assert.doesNotMatch(pageSource, /approx images/)
  assert.doesNotMatch(pageSource, /approx videos/)
  assert.doesNotMatch(pageSource, /function CreditIcon/)
  assert.doesNotMatch(pageSource, /About/)
  assert.doesNotMatch(pageSource, /getGenerationEstimateSentence/)
})
