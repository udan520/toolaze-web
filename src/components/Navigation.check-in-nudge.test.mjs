import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const navigationSource = readFileSync(new URL('./Navigation.tsx', import.meta.url), 'utf8')
const globalStylesSource = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8')

test('daily check-in nudge is not suppressed on earn credits pages', () => {
  assert.equal(
    navigationSource.includes("currentPath.includes('/earn-credits')"),
    false,
  )
})

test('daily check-in nudge records intentional dismiss and reward navigation for the local day', () => {
  const nudgeSource = navigationSource.slice(
    navigationSource.indexOf('const renderCheckInNudge'),
    navigationSource.indexOf('const renderAccountMenu'),
  )

  assert.doesNotMatch(nudgeSource, /onClickCapture=\{markCheckInNudgeInteracted\}/)
  assert.match(navigationSource, /hasCheckInNudgeInteractionToday\(window\.localStorage,\s*undefined,\s*authUser\.id\)/)
  assert.match(navigationSource, /markCheckInNudgeInteractionToday\(window\.localStorage,\s*undefined,\s*authUser\?\.id\)/)
  assert.match(nudgeSource, /onClick=\{dismissCheckInNudge\}/)
  assert.match(nudgeSource, /href=\{getEarnCreditsCheckInHref\(\)\}[\s\S]*onClick=\{markCheckInNudgeInteracted\}/)
})

test('daily check-in nudge clears immediately after a successful check-in event', () => {
  const earnCreditsSource = readFileSync(new URL('./EarnCreditsPageClient.tsx', import.meta.url), 'utf8')

  assert.match(earnCreditsSource, /toolaze:check-in-updated/)
  assert.match(earnCreditsSource, /const nextCheckIn = data\.checkIn \|\| fallbackCheckIn/)
  assert.match(earnCreditsSource, /dispatchCheckInUpdated\(nextCheckIn\)/)
  assert.match(navigationSource, /toolaze:check-in-updated/)
  assert.match(navigationSource, /handleCheckInUpdated/)
  assert.match(navigationSource, /checkIn\?\.checkedInToday/)
  assert.match(navigationSource, /setCheckInNudge\(null\)/)
})

test('daily check-in nudge does not show a later action', () => {
  const nudgeSource = navigationSource.slice(
    navigationSource.indexOf('const renderCheckInNudge'),
    navigationSource.indexOf('const renderAccountMenu'),
  )

  assert.ok(!nudgeSource.includes('Later'))
})

test('daily check-in nudge shows dynamic claim and see rewards actions', () => {
  const nudgeSource = navigationSource.slice(
    navigationSource.indexOf('const renderCheckInNudge'),
    navigationSource.indexOf('const renderAccountMenu'),
  )

  assert.match(nudgeSource, /You have \{checkInNudge\.rewardCredits\} credits waiting\./)
  assert.match(nudgeSource, /Claim \{checkInNudge\.rewardCredits\}/)
  assert.doesNotMatch(nudgeSource, /Claim \+\{checkInNudge\.rewardCredits\}/)
  assert.match(nudgeSource, /Claim \{checkInNudge\.rewardCredits\}[\s\S]*\/credits-icons\/diamond-3d-indigo\.svg/)
  assert.doesNotMatch(nudgeSource, /bg-white\/90 p-0\.5 shadow-sm/)
  assert.match(nudgeSource, /See Rewards/)
  assert.match(nudgeSource, /className="[^"]*flex items-center justify-center[^"]*"[\s\S]*>\s*See Rewards/)
  assert.match(nudgeSource, /dismissCheckInNudge/)
  assert.doesNotMatch(nudgeSource, /View rewards/)
})

test('account menu earn credits button keeps the label visually centered', () => {
  const accountMenuSource = navigationSource.slice(
    navigationSource.indexOf('const renderAccountMenu'),
    navigationSource.indexOf('const renderMobileAccountButton'),
  )
  const buyCreditsButtonSource = accountMenuSource.slice(
    accountMenuSource.indexOf("href={getLocalizedHref('/pricing')}"),
    accountMenuSource.indexOf('</Link>', accountMenuSource.indexOf("href={getLocalizedHref('/pricing')}")),
  )
  const earnCreditsButtonSource = accountMenuSource.slice(
    accountMenuSource.indexOf('href={getEarnCreditsCheckInHref()}'),
    accountMenuSource.indexOf('</Link>', accountMenuSource.indexOf('href={getEarnCreditsCheckInHref()}')),
  )

  assert.ok(
    accountMenuSource.indexOf("href={getLocalizedHref('/pricing')}") < accountMenuSource.indexOf('href={getEarnCreditsCheckInHref()}'),
    'Buy Credits should appear before Earn Credits',
  )
  assert.match(buyCreditsButtonSource, /bg-gradient-to-r/)
  assert.match(buyCreditsButtonSource, /<span>\{accountTranslations\.buyCredits\}<\/span>/)
  assert.match(earnCreditsButtonSource, /className="[^"]*flex[^"]*items-center[^"]*justify-center[^"]*text-center[^"]*"/)
  assert.doesNotMatch(earnCreditsButtonSource, /bg-gradient-to-r/)
  assert.match(earnCreditsButtonSource, /border border-indigo-100/)
  assert.doesNotMatch(earnCreditsButtonSource, /justify-between/)
  assert.match(earnCreditsButtonSource, /<span>\{accountTranslations\.earnCredits\}<\/span>/)
  assert.doesNotMatch(earnCreditsButtonSource, /\+5/)
  assert.doesNotMatch(earnCreditsButtonSource, /\/credits-icons\/diamond-3d-indigo\.svg/)
  assert.doesNotMatch(earnCreditsButtonSource, /absolute right-4/)
  assert.doesNotMatch(earnCreditsButtonSource, /bg-white\/90/)
})

test('account menu stays within the viewport and scrolls to the sign out action', () => {
  const accountMenuSource = navigationSource.slice(
    navigationSource.indexOf('const renderAccountMenu'),
    navigationSource.indexOf('const renderMobileAccountButton'),
  )

  assert.match(accountMenuSource, /overflow-y-auto/)
  assert.match(accountMenuSource, /overscroll-contain/)
  assert.match(accountMenuSource, /max-h-\[calc\(100vh-5rem\)\]/)
  assert.match(accountMenuSource, /max-h-\[calc\(100vh-6rem\)\]/)
  assert.ok(
    accountMenuSource.indexOf('overflow-y-auto') < accountMenuSource.indexOf('{accountTranslations.signOut}'),
    'Scrollable account menu wrapper should contain the sign out action',
  )
  const signOutButtonSource = accountMenuSource.slice(
    accountMenuSource.indexOf('onClick={handleSignOut}'),
    accountMenuSource.indexOf('</button>', accountMenuSource.indexOf('onClick={handleSignOut}')),
  )
  assert.match(signOutButtonSource, /className="[^"]*w-full[^"]*text-center[^"]*"/)
  assert.doesNotMatch(signOutButtonSource, /text-left/)
})

test('account header credit balance shows the number with a compact diamond icon', () => {
  const mobileAccountEntrySource = navigationSource.slice(
    navigationSource.indexOf('/* 移动端账号入口 + 菜单按钮 */'),
    navigationSource.indexOf('data-account-avatar-trigger'),
  )
  const desktopAccountButtonSource = navigationSource.slice(
    navigationSource.indexOf('className="relative flex items-center gap-2 rounded-full bg-white'),
    navigationSource.indexOf('{renderAvatar()}', navigationSource.indexOf('className="relative flex items-center gap-2 rounded-full bg-white')),
  )

  assert.match(mobileAccountEntrySource, /creditSummary\.balance/)
  assert.match(desktopAccountButtonSource, /creditSummary\.balance/)
  assert.match(mobileAccountEntrySource, /\/credits-icons\/diamond-3d-indigo\.svg/)
  assert.match(desktopAccountButtonSource, /\/credits-icons\/diamond-3d-indigo\.svg/)
  assert.match(mobileAccountEntrySource, /className="h-4 w-4/)
  assert.match(desktopAccountButtonSource, /className="h-4 w-4/)
  assert.doesNotMatch(mobileAccountEntrySource, /bg-white\/90 p-0\.5 shadow-sm/)
  assert.doesNotMatch(desktopAccountButtonSource, /bg-white\/90 p-0\.5 shadow-sm/)
})

test('account avatar trigger does not render a numeric check-in reward badge', () => {
  const mobileAccountControlsSource = navigationSource.slice(
    navigationSource.indexOf('data-account-avatar-trigger'),
    navigationSource.indexOf('{renderCheckInNudge', navigationSource.indexOf('data-account-avatar-trigger')),
  )
  const desktopAccountControlsSource = navigationSource.slice(
    navigationSource.indexOf('{renderAvatar()}'),
    navigationSource.indexOf('{renderCheckInNudge', navigationSource.indexOf('{renderAvatar()}')),
  )

  assert.doesNotMatch(mobileAccountControlsSource, /\+\{checkInNudge\.rewardCredits\}/)
  assert.doesNotMatch(desktopAccountControlsSource, /\+\{checkInNudge\.rewardCredits\}/)
  assert.doesNotMatch(mobileAccountControlsSource, /View daily check-in rewards and claim/)
  assert.doesNotMatch(desktopAccountControlsSource, /View daily check-in rewards and claim/)
})

test('daily check-in nudge can claim from the header and refresh credits', () => {
  assert.match(navigationSource, /async function claimCheckInFromNudge/)
  assert.match(navigationSource, /fetch\('\/api\/rewards\/check-in', \{\s*method: 'POST'/)
  assert.match(navigationSource, /window\.dispatchEvent\(new CustomEvent\('toolaze:credits-updated'/)
  assert.match(navigationSource, /window\.dispatchEvent\(new CustomEvent\('toolaze:check-in-updated'/)
  assert.match(navigationSource, /showTimedTopNotice\(\{\s*type: 'success'/)
  assert.match(navigationSource, /setCheckInNudge\(null\)/)
})

test('daily check-in nudge shows claimed state before dismissing after claim', () => {
  const nudgeSource = navigationSource.slice(
    navigationSource.indexOf('const renderCheckInNudge'),
    navigationSource.indexOf('const renderAccountMenu'),
  )
  const claimSource = navigationSource.slice(
    navigationSource.indexOf('async function claimCheckInFromNudge'),
    navigationSource.indexOf('function isTrustedAuthMessageOrigin'),
  )

  assert.match(navigationSource, /const \[checkInNudgeClaimState, setCheckInNudgeClaimState\] = useState<'idle' \| 'claiming' \| 'claimed'>\('idle'\)/)
  assert.doesNotMatch(nudgeSource, /onClickCapture=\{markCheckInNudgeInteracted\}/)
  assert.match(nudgeSource, /checkInNudgeClaimState === 'claimed'[\s\S]*Claimed/)
  assert.match(claimSource, /setCheckInNudgeClaimState\('claiming'\)/)
  assert.match(claimSource, /setCheckInNudgeClaimState\('claimed'\)/)
  assert.match(claimSource, /window\.setTimeout\(\(\) => \{[\s\S]*window\.dispatchEvent\(new CustomEvent\('toolaze:check-in-updated'/)
  assert.match(claimSource, /window\.setTimeout\(\(\) => \{[\s\S]*setCheckInNudge\(null\)/)
  assert.match(claimSource, /markCheckInNudgeInteractionToday\(window\.localStorage, undefined, authUser\?\.id\)/)
})

test('mobile header keeps the logo clear of account controls', () => {
  assert.match(navigationSource, /max-w-\[calc\(100%-9rem\)\]/)
  assert.match(navigationSource, /truncate/)
  assert.match(navigationSource, /max-\[360px\]:w-14/)
})

test('account menu English labels use Title Case', () => {
  assert.match(navigationSource, /availableCredits: 'Available Credits'/)
  assert.match(navigationSource, /creditHistory: 'Credit History'/)
  assert.match(navigationSource, /seeAll: 'See All'/)
  assert.match(navigationSource, /buyCredits: 'Buy Credits'/)
  assert.match(navigationSource, /earnCredits: 'Earn Credits'/)
  assert.match(navigationSource, /signOut: 'Sign Out'/)
})

test('navigation pricing label can use localized nav or footer copy', () => {
  assert.match(navigationSource, /pricing: initialTranslations\.nav\?\.pricing \|\| initialTranslations\.footer\?\.pricing/)
  assert.match(navigationSource, /pricing: 'Pricing'/)
})

test('credit purchase transaction descriptions are formatted for display', () => {
  assert.match(navigationSource, /formatCreditTransactionDescription/)
  assert.match(navigationSource, /formatCreditTransactionDescription\(transaction\.description\)/)
  assert.match(navigationSource, /transaction\.balanceAfter\.toLocaleString\('en-US'\)/)
  assert.doesNotMatch(navigationSource, /transaction\.balanceAfter\.toLocaleString\('en-US'\)\} \{accountTranslations\.credits\}/)
})

test('global top notice events use the timed dismissible notice surface', () => {
  assert.match(navigationSource, /toolaze:top-notice/)
  assert.match(navigationSource, /showTimedTopNotice/)
  assert.match(navigationSource, /const TOP_NOTICE_DURATION_MS = 5000/)
  assert.match(navigationSource, /window\.setTimeout/)
  assert.match(navigationSource, /setTopNotice\(null\)/)
})

test('global notices render centered below the sticky navigation', () => {
  assert.match(navigationSource, /fixed left-1\/2 top-\[90px\]/)
  assert.match(navigationSource, /-translate-x-1\/2/)
  assert.equal(navigationSource.includes('fixed right-4 top-20'), false)
  assert.match(globalStylesSource, /top: calc\(70px \+ 20px\);/)
  assert.match(globalStylesSource, /width: min\(420px, calc\(100vw - 32px\)\);/)
})

test('celebration top notices trigger a one-shot confetti burst', () => {
  assert.match(navigationSource, /celebration\?: boolean/)
  assert.match(navigationSource, /showCelebrationConfetti/)
  assert.match(navigationSource, /const CONFETTI_DURATION_MS = 3600/)
  assert.match(navigationSource, /const CONFETTI_PARTICLE_COUNT = 92/)
  assert.match(navigationSource, /CONFETTI_PARTICLES/)
  assert.match(navigationSource, /Array\.from\(\{ length: CONFETTI_PARTICLE_COUNT \}/)
  assert.match(navigationSource, /fromLeft \? '8vw' : '92vw'/)
  assert.match(navigationSource, /sideLift \* 360/)
  assert.match(navigationSource, /toolaze-confetti-layer/)
  assert.match(navigationSource, /toolaze-confetti-particle/)
  assert.match(navigationSource, /animationDuration/)
  assert.match(globalStylesSource, /toolaze-confetti-cannon/)
  assert.match(globalStylesSource, /var\(--confetti-y, -420px\)/)
  assert.match(globalStylesSource, /prefers-reduced-motion/)
})


test('celebration confetti renders above product overlays', () => {
  const match = globalStylesSource.match(/\.toolaze-confetti-layer\s*\{[\s\S]*?z-index:\s*(\d+);/)
  assert.ok(match, 'confetti layer should define an explicit z-index')
  assert.ok(Number(match[1]) > 20001, 'confetti should render above product modals and image action overlays')
  assert.match(globalStylesSource, /\.toolaze-confetti-layer\s*\{[\s\S]*?pointer-events:\s*none;/)
})
