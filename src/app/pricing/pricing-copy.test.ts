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
    PRICING_PLANS.map((plan) => [plan.id, plan.name, plan.price, plan.baseCredits, plan.bonusCredits, plan.credits, plan.checkoutEnabled]),
    [
      ['starter', 'Starter', '$1.99', 200, 0, 200, true],
      ['creator', 'Creator', '$8.99', 900, 100, 1000, true],
      ['plus', 'Plus', '$39.99', 4000, 1000, 5000, true],
      ['studio', 'Studio', '$69.99', 7000, 3000, 10000, true],
      ['max', 'Max', '$179.99', 18000, 12000, 30000, true],
      ['business', 'Business', '$249.99', 25000, 25000, 50000, true],
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
      ['Plus', '0.008'],
      ['Studio', '0.007'],
      ['Max', '0.006'],
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

  assert.match(pageSource, />\s*Buy Credits, Pay As You Go\s*<\/h1>/)
  assert.match(pageSource, /One-time credit packs for Toolaze AI creation\. No subscription required\./)
  assert.doesNotMatch(pageSource, />\s*Buy Credits\s*<\/h1>/)
  assert.doesNotMatch(pageSource, /Buy Credits Once\. Use Them When You Need Them/)
  assert.doesNotMatch(pageSource, /Buy Toolaze Credits Once, Use Them When You Need Them/)
  assert.match(pageSource, /sm:max-w-3xl/)
  assert.match(pageSource, /mt-4 max-w-\[20rem\].*sm:max-w-3xl/)
  assert.doesNotMatch(pageSource, /mt-4 max-w-\[20rem\].*sm:max-w-2xl/)
  assert.match(pageSource, /flex flex-col gap-1 sm:flex-row/)
  assert.match(pageSource, /sm:flex-row/)
  assert.match(pageSource, /\/credits-icons\/diamond-3d-indigo\.svg/)
  assert.match(pageSource, /const bonusBadge = bonusPercent > 0/)
  assert.doesNotMatch(pageSource, /const hasTopBadge = Boolean\(bonusBadge \|\| plan\.badge\)/)
  assert.match(pageSource, /mb-3 flex min-h-8 items-start justify-between gap-2/)
  assert.match(pageSource, /PricingCheckoutButton/)
  assert.match(pageSource, /planId=\{plan\.id\}/)
  assert.match(pageSource, /enabled=\{plan\.checkoutEnabled\}/)
  assert.doesNotMatch(pageSource, /\$\{hasTopBadge \? 'pt-7' : ''\}/)
  assert.match(pageSource, /rounded-full bg-amber-100 px-3 py-1\.5/)
  assert.match(pageSource, /rounded-full bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-500 px-3 py-1\.5/)
  assert.match(pageSource, /\+\{plan\.bonusCredits\.toLocaleString\('en-US'\)\} bonus/)
  assert.match(pageSource, /bg-clip-text text-sm text-transparent/)
  assert.match(pageSource, /inline-flex items-center justify-center px-1 py-1 text-sm font-extrabold text-slate-600/)
  assert.match(pageSource, /\{plan\.credits\.toLocaleString\('en-US'\)\} credits included/)
  assert.doesNotMatch(pageSource, /inline-flex items-center justify-center rounded-full bg-white\/80 px-4 py-2 text-sm font-extrabold text-slate-600 shadow-sm shadow-indigo-100 ring-1 ring-indigo-100/)
  assert.doesNotMatch(pageSource, /inline-flex items-center justify-center rounded-full bg-white\/75 px-3 py-2 text-sm font-extrabold text-slate-600 shadow-sm shadow-indigo-100 ring-1 ring-indigo-100/)
  assert.doesNotMatch(pageSource, /left-0 top-0 rounded-br-2xl bg-gradient-to-r from-indigo-500/)
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

test('pricing checkout buttons show the credit validity note under each CTA', () => {
  const buttonSource = readFileSync('src/app/pricing/PricingCheckoutButton.tsx', 'utf8')

  assert.match(buttonSource, /Credits valid for 12 months\./)
  assert.match(buttonSource, /mt-2 text-center text-xs font-semibold text-slate-400/)
  assert.ok(
    buttonSource.indexOf('Credits valid for 12 months.') > buttonSource.indexOf('Buy Credits'),
    'validity note should render under the checkout CTA copy',
  )
})
