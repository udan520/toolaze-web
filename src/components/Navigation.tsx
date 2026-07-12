'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import CloseIcon from './icons/CloseIcon'
import { getClientMenuItems, type ClientMenuItem } from '@/lib/client-menu-data'
import {
  PREFERRED_LOCALE_STORAGE_KEY,
  SITE_LOCALES,
  getAlternateLanguageUrl,
  getCurrentLocaleFromPath,
  getPreferredLocalizedUrl,
  getSupportedLocaleCodes,
  isSiteLocaleCode,
  resolveLocaleForPath,
  shouldShowLanguageSwitcher,
} from '@/lib/site-language-switch'

// 翻译数据(默认英语)
const defaultNavTranslations = {
  language: 'Language',
  quickTools: 'Quick Tools',
  aiTools: 'AI Tools',
  imageCompression: 'Image Compression',
  imageConverter: 'Image Converter',
  watermarkRemover: 'Watermark Remover',
  photoRestoration: 'Photo Restoration',
  aiCouplePhotoMaker: 'AI Couple Photo Maker',
  aiBabyGenerator: 'AI Baby Generator',
  aiHairstyleChanger: 'AI Hairstyle Changer',
  aiHairColorChanger: 'AI Hair Color Changer',
  worldCupAiImageGenerator: 'World Cup AI Image Generator',
  fontGenerator: 'Font Generator',
  emojiCopyAndPaste: 'Emoji Copy & Paste',
  aiImage: 'AI Image',
  aiImageGenerator: 'AI Image Generator',
  textToImageGenerator: 'Text to Image Generator',
  aiImageToImageGenerator: 'AI Image to Image Generator',
  aiVideo: 'AI Video',
  nanoBananaPro: 'Nano Banana Pro',
  nanoBanana2: 'Nano Banana 2',
  gptImage2: 'GPT Image 2',
  wan27Image: 'Wan 2.7 Image',
  seedream45: 'Seedream 4.5',
  seedream50Lite: 'Seedream 5.0 Lite',
  seedream50Pro: 'Seedream 5.0 Pro',
  seedance25: 'Seedance 2.5',
  seedance2: 'Seedance 2.0',
  kling3: 'Kling 3.0',
  promptLibrary: 'Prompts',
  allPrompts: 'All Prompts',
  promptModels: 'Model',
  promptScenes: 'Scenes',
  kling: 'Kling',
  nanoBanana: 'Nano Banana',
  advertising: 'Advertising',
  fashionBeauty: 'Fashion & Beauty',
  filmTrailer: 'Film & Trailer',
  aboutUs: 'About Us',
  viewAllAiTools: 'View All AI Tools',
  emojiMenu: {
    'crying-copy-and-paste': 'Crying Emoji Copy and Paste',
    'cross-copy-and-paste': 'Cross Emoji Copy and Paste',
    'adults-only-copy-and-paste': 'Adults Only Emoji Copy and Paste',
    'fire-copy-and-paste': 'Fire Emoji Copy and Paste',
    'birthday-copy-and-paste': 'Birthday Emoji Copy and Paste',
    'cat-copy-and-paste': 'Cat Emoji Copy and Paste',
  },
}

const defaultAuthTranslations = {
  signIn: 'Sign in',
  openAccountMenu: 'Open account menu',
  closeNotification: 'Close notification',
  modalTitle: 'Sign in to Toolaze',
  modalEyebrow: 'Toolaze account',
  modalDescription: 'Continue with Google to save your generation access and use Toolaze AI tools.',
  modalGoogleButton: 'Continue with Google',
  modalGoogleLoading: 'Connecting...',
  modalTerms: 'By continuing, you agree to use Toolaze with your Google account.',
  closeDialog: 'Close sign in dialog',
  noticeSignInFailedTitle: 'Sign-in failed',
  noticeSignInFailedMessage: 'Google sign-in could not be completed. Please try again.',
  noticeSignedInTitle: 'Signed in successfully',
  noticeSignedInMessage: 'You can now use Toolaze AI tools with your account.',
  signOut: 'Sign out',
}

const defaultAccountTranslations = {
  availableCredits: 'Available credits',
  creditHistory: 'Credit history',
  noCreditActivity: 'No credit activity yet.',
  balance: 'Balance',
  credits: 'credits',
  seeAll: 'See all',
  history: 'History',
  viewAll: 'View all',
  signOut: 'Sign out',
}

const AI_TOOLS_DEMO_IMAGES = {
  aiImageGenerator:
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-model-cards/gpt-image-2.jpg',
  textToImageGenerator:
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/ai-image-generator/text-to-image-generator.webp',
  watermarkRemover:
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
  photoRestoration:
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80',
  aiCouplePhotoMaker: '/ai-couple-photo-maker/rainy-eiffel-4x3.jpg',
  aiImageToImageGenerator:
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/gpt-image-2/feature-image-editing.webp',
  worldCupAiImageGenerator:
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/d67aebd7cde5431abd3a7bb74a89bac1.webp',
}

function getInitialNavTranslations(initialTranslations?: any) {
  if (!initialTranslations) return defaultNavTranslations
  return {
    ...defaultNavTranslations,
    ...(initialTranslations.nav || {}),
    language: initialTranslations.footer?.language || defaultNavTranslations.language,
  }
}

function getInitialAuthTranslations(initialTranslations?: any) {
  return {
    ...defaultAuthTranslations,
    ...(initialTranslations?.auth || {}),
  }
}

function getInitialAccountTranslations(initialTranslations?: any) {
  return {
    ...defaultAccountTranslations,
    ...(initialTranslations?.account || {}),
  }
}

type AuthUser = {
  id?: string
  email?: string
  name?: string | null
  avatarUrl?: string | null
}

type CreditTransaction = {
  id: string
  amount: number
  balanceAfter: number
  description: string
  createdAt: string
}

type CreditSummary = {
  balance: number
  transactions: CreditTransaction[]
}

type TopNotice = {
  type: 'success' | 'error'
  title: string
  message: string
}

const emptyCreditSummary: CreditSummary = {
  balance: 0,
  transactions: [],
}

const TOP_NOTICE_DURATION_MS = 3000
const AUTH_POPUP_NAME = 'toolaze-google-auth'
const AUTH_POPUP_MESSAGE_TYPE = 'toolaze:auth-result'
const LOCAL_AUTH_PROVIDER_ORIGIN = 'https://toolaze.com'
const AUTH_POPUP_FEATURES = [
  'popup=yes',
  'width=520',
  'height=720',
  'left=120',
  'top=80',
  'resizable=yes',
  'scrollbars=yes',
  'toolbar=no',
  'menubar=no',
  'location=yes',
  'status=no',
].join(',')

type AuthPopupMessage = {
  type: typeof AUTH_POPUP_MESSAGE_TYPE
  status: 'success' | 'error'
  error?: string
  localSessionToken?: string
  user?: AuthUser | null
}

interface NavigationProps {
  initialTranslations?: any
}

export default function Navigation({ initialTranslations }: NavigationProps = {}) {
  const navRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const accountMenuRef = useRef<HTMLDivElement>(null)
  const authPopupRef = useRef<Window | null>(null)
  const topNoticeTimerRef = useRef<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDesktopMenu, setOpenDesktopMenu] = useState<string | null>(null)
  const [expandedSubmenus, setExpandedSubmenus] = useState<Set<string>>(new Set())
  const [navTranslations, setNavTranslations] = useState(getInitialNavTranslations(initialTranslations))
  const [authTranslations, setAuthTranslations] = useState(getInitialAuthTranslations(initialTranslations))
  const [accountTranslations, setAccountTranslations] = useState(getInitialAccountTranslations(initialTranslations))
  const [thirdLevelMenuData, setThirdLevelMenuData] = useState<Record<string, ClientMenuItem[]>>({
    'image-compressor': [],
    'image-converter': [],
    'font-generator': [],
    'emoji-copy-and-paste': []
  })
  const [isMounted, setIsMounted] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [creditSummary, setCreditSummary] = useState<CreditSummary>(emptyCreditSummary)
  const [authLoaded, setAuthLoaded] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authRedirecting, setAuthRedirecting] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [topNotice, setTopNotice] = useState<TopNotice | null>(null)
  const pathname = usePathname()

  const currentLocale = getCurrentLocaleFromPath(pathname ?? null)

  const [navLangOpen, setNavLangOpen] = useState(false)

  const toggleDesktopMenu = (menuKey: string) => {
    setOpenDesktopMenu((currentMenu) => currentMenu === menuKey ? null : menuKey)
    setNavLangOpen(false)
    setAccountMenuOpen(false)
  }

  const navSupportedLocales = useMemo(() => {
    const codes = getSupportedLocaleCodes(pathname ?? null)
    return SITE_LOCALES.filter((l) => codes.includes(l.code))
  }, [pathname])

  const showNavLanguageSwitcher = shouldShowLanguageSwitcher(pathname ?? null)
  const navEffectiveLocale = resolveLocaleForPath(pathname || '/', currentLocale)
  const navCurrentLocaleInfo = SITE_LOCALES.find((l) => l.code === navEffectiveLocale) || SITE_LOCALES[0]
  const navOtherLocales = navSupportedLocales.length === 1
    ? navSupportedLocales
    : navSupportedLocales.filter((l) => l.code !== navEffectiveLocale)
  
  // 翻译由 server page 作为 initialTranslations 传入，避免客户端打包全部 common.json。
  useEffect(() => {
    setIsMounted(true)
    setNavTranslations(getInitialNavTranslations(initialTranslations))
    setAuthTranslations(getInitialAuthTranslations(initialTranslations))
    setAccountTranslations(getInitialAccountTranslations(initialTranslations))
  }, [initialTranslations])

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && topNoticeTimerRef.current) {
        window.clearTimeout(topNoticeTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const firstSegment = (pathname ?? '').split('/').filter(Boolean)[0] ?? ''
    const hasExplicitLocale = isSiteLocaleCode(firstSegment)
    if (hasExplicitLocale) {
      window.localStorage.setItem(PREFERRED_LOCALE_STORAGE_KEY, currentLocale)
    }
  }, [pathname, currentLocale])

  useEffect(() => {
    setNavLangOpen(false)
    setOpenDesktopMenu(null)
    setAccountMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    let cancelled = false

    void loadAuthState(() => cancelled)

    return () => {
      cancelled = true
    }
  }, [pathname])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleAuthPopupMessage = (event: MessageEvent<AuthPopupMessage>) => {
      if (!isTrustedAuthMessageOrigin(event.origin)) return
      if (!event.data || event.data.type !== AUTH_POPUP_MESSAGE_TYPE) return

      void (async () => {
        authPopupRef.current = null
        setAuthRedirecting(false)
        setAuthModalOpen(false)

        await persistLocalSession(event.data.localSessionToken)
        showTimedTopNotice(buildAuthNotice(event.data.status))

        if (event.data.user !== undefined) {
          setAuthUser(event.data.user)
          setAuthLoaded(true)
          return
        }

        await loadAuthState()
      })()
    }

    window.addEventListener('message', handleAuthPopupMessage)
    return () => window.removeEventListener('message', handleAuthPopupMessage)
  }, [authTranslations])

  useEffect(() => {
    if (!authRedirecting || typeof window === 'undefined') return

    const timer = window.setInterval(() => {
      if (!authPopupRef.current || !authPopupRef.current.closed) return

      authPopupRef.current = null
      setAuthRedirecting(false)
      void loadAuthState()
      window.clearInterval(timer)
    }, 500)

    return () => window.clearInterval(timer)
  }, [authRedirecting])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleOpenAuthModal = () => openAuthModal()
    const handleCreditsUpdated = () => {
      void loadAuthState()
    }

    window.addEventListener('toolaze:open-auth-modal', handleOpenAuthModal)
    window.addEventListener('toolaze:credits-updated', handleCreditsUpdated)

    return () => {
      window.removeEventListener('toolaze:open-auth-modal', handleOpenAuthModal)
      window.removeEventListener('toolaze:credits-updated', handleCreditsUpdated)
    }
  }, [])

  // 运行时兜底：仅在移动端渲染 H5 菜单按钮，避免桌面端误显示
  useEffect(() => {
    if (typeof window === 'undefined') return
    const updateViewport = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    updateViewport()
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [])
  
  // 加载三级菜单数据：客户端菜单只依赖轻量元数据，避免把服务端 SEO loader 打进浏览器包。
  useEffect(() => {
    setThirdLevelMenuData({
      'image-compressor': getClientMenuItems('image-compressor', navEffectiveLocale, navTranslations),
      'image-converter': getClientMenuItems('image-converter', navEffectiveLocale, navTranslations),
      'font-generator': getClientMenuItems('font-generator', navEffectiveLocale, navTranslations),
      'emoji-copy-and-paste': getClientMenuItems('emoji-copy-and-paste', navEffectiveLocale, navTranslations),
    })
  }, [navEffectiveLocale, pathname, navTranslations])

  const getLocalizedHref = (href: string): string => {
    if (href.startsWith('http')) return href
    return getPreferredLocalizedUrl(href, navEffectiveLocale)
  }
  
  // 获取三级菜单项的函数（使用已加载的数据）
  const getThirdLevelItems = (tool: string): ClientMenuItem[] => {
    return thirdLevelMenuData[tool] || []
  }

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    // Simple scroll handler - only manages scrolled class
    // Let CSS handle sticky positioning completely
    const handleScroll = () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop
      if (currentScroll > 50) {
        nav.classList.add('scrolled')
      } else {
        nav.classList.remove('scrolled')
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // 点击外部关闭移动端、桌面端和账号菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen && menuRef.current && !menuRef.current.contains(event.target as Node) && navRef.current && !navRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false)
        setExpandedSubmenus(new Set())
      }

      if (openDesktopMenu && navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDesktopMenu(null)
      }

      if (accountMenuOpen && accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false)
      }
    }

    if (mobileMenuOpen || openDesktopMenu || accountMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [mobileMenuOpen, openDesktopMenu, accountMenuOpen])

  async function loadAuthState(cancelled?: () => boolean) {
    try {
      const response = await fetch('/api/auth/me', { cache: 'no-store', credentials: 'include' })
      if (cancelled?.()) return
      if (!response.ok) {
        setAuthUser(null)
        setCreditSummary(emptyCreditSummary)
        return
      }

      const data = await response.json().catch(() => ({}))
      if (cancelled?.()) return
      setAuthUser(data?.user || null)
      setCreditSummary(data?.credits || emptyCreditSummary)
    } catch {
      if (cancelled?.()) return
      setAuthUser(null)
      setCreditSummary(emptyCreditSummary)
    } finally {
      if (cancelled?.()) return
      setAuthLoaded(true)
    }
  }

  function buildAuthNotice(status: 'success' | 'error'): TopNotice {
    if (status === 'success') {
      return {
        type: 'success',
        title: authTranslations.noticeSignedInTitle,
        message: authTranslations.noticeSignedInMessage,
      }
    }

    return {
      type: 'error',
      title: authTranslations.noticeSignInFailedTitle,
      message: authTranslations.noticeSignInFailedMessage,
    }
  }

  function showTimedTopNotice(notice: TopNotice) {
    if (typeof window !== 'undefined' && topNoticeTimerRef.current) {
      window.clearTimeout(topNoticeTimerRef.current)
    }

    setTopNotice(notice)

    if (typeof window !== 'undefined') {
      topNoticeTimerRef.current = window.setTimeout(() => {
        setTopNotice(null)
        topNoticeTimerRef.current = null
      }, TOP_NOTICE_DURATION_MS)
    }
  }

  function isTrustedAuthMessageOrigin(origin: string): boolean {
    if (typeof window === 'undefined') return false
    if (origin === window.location.origin) return true

    return [
      'https://toolaze.com',
      'https://www.toolaze.com',
      'https://toolaze-web.pages.dev',
    ].includes(origin)
  }

  async function persistLocalSession(token?: string) {
    if (!token || typeof window === 'undefined') return

    const { hostname } = window.location
    const isLocalhost = ['localhost', '127.0.0.1', '::1', '[::1]'].includes(hostname)
    if (!isLocalhost) return

    await fetch('/api/auth/local-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    }).catch(() => null)
  }

  function getAuthProviderOriginForCurrentPage(): string {
    if (typeof window === 'undefined') return ''

    const { hostname } = window.location
    const isLocalhost = ['localhost', '127.0.0.1', '[::1]'].includes(hostname)

    return isLocalhost ? LOCAL_AUTH_PROVIDER_ORIGIN : ''
  }

  function getSignInHref(): string {
    const currentPath = pathname || '/'
    const callbackParams = new URLSearchParams({ returnTo: currentPath })

    if (typeof window !== 'undefined') {
      callbackParams.set('openerOrigin', window.location.origin)
    }

    const popupReturnTo = `/auth/popup-callback?${callbackParams.toString()}`
    const authProviderOrigin = getAuthProviderOriginForCurrentPage()

    return `${authProviderOrigin}/api/auth/google/start?returnTo=${encodeURIComponent(popupReturnTo)}`
  }

  function openAuthModal() {
    setAuthModalOpen(true)
    setMobileMenuOpen(false)
    setOpenDesktopMenu(null)
    setAccountMenuOpen(false)
    setExpandedSubmenus(new Set())
  }

  function closeAuthModal() {
    setAuthModalOpen(false)
    setAuthRedirecting(false)
  }

  function startGoogleSignIn() {
    if (typeof window === 'undefined' || authRedirecting) return

    setAuthRedirecting(true)
    const popup = window.open(getSignInHref(), AUTH_POPUP_NAME, AUTH_POPUP_FEATURES)

    if (!popup) {
      setAuthRedirecting(false)
      showTimedTopNotice(buildAuthNotice('error'))
      return
    }

    authPopupRef.current = popup
    popup.focus()
    setAuthModalOpen(false)
  }

  async function handleSignOut() {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    } finally {
      setAuthUser(null)
      setCreditSummary(emptyCreditSummary)
      setAccountMenuOpen(false)
      setTopNotice(null)
      setMobileMenuOpen(false)
      setExpandedSubmenus(new Set())
    }
  }

  function toggleAccountMenu() {
    setAccountMenuOpen((open) => !open)
    setNavLangOpen(false)
    setOpenDesktopMenu(null)
    setMobileMenuOpen(false)
    setExpandedSubmenus(new Set())
  }

  const renderAvatar = (sizeClass = 'h-8 w-8') => (
    authUser?.avatarUrl ? (
      <img
        src={authUser.avatarUrl}
        alt={authUser.name || authUser.email || 'Account'}
        className={`${sizeClass} rounded-full object-cover`}
      />
    ) : (
      <span className={`${sizeClass} inline-flex items-center justify-center rounded-full bg-indigo-600 text-sm font-extrabold text-white`}>
        {(authUser?.name || authUser?.email || 'U').slice(0, 1).toUpperCase()}
      </span>
    )
  )

  function formatCreditDate(value: string): string {
    const date = new Date(value)
    if (!Number.isFinite(date.getTime())) return ''
    return date.toLocaleDateString(navEffectiveLocale, { month: 'short', day: 'numeric' })
  }

  const renderCreditTransactions = () => {
    const recentTransactions = creditSummary.transactions.slice(0, 3)
    if (recentTransactions.length === 0) {
      return (
        <div className="rounded-xl border border-dashed border-slate-200 px-3 py-4 text-center text-xs text-slate-500">
          {accountTranslations.noCreditActivity}
        </div>
      )
    }

    return (
      <div className="space-y-2">
        {recentTransactions.map((transaction) => {
          const isPositive = transaction.amount > 0
          return (
            <div key={transaction.id} className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-800">
                    {transaction.description}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {formatCreditDate(transaction.createdAt)} · {accountTranslations.balance} {transaction.balanceAfter}
                  </p>
                </div>
                <span className={`shrink-0 text-sm font-extrabold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {isPositive ? '+' : ''}{transaction.amount}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderAccountMenu = () => {
    if (!authUser) return null

    return (
      <div className="absolute right-0 top-full z-[80] mt-3 w-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/60">
        <div className="border-b border-slate-100 px-4 py-4">
          <div className="flex items-center gap-3">
            {renderAvatar('h-10 w-10')}
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">{authUser.name || authUser.email}</p>
              {authUser.email && (
                <p className="truncate text-xs text-slate-500">{authUser.email}</p>
              )}
            </div>
          </div>
          <div className="mt-4 rounded-xl bg-indigo-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-600">
              {accountTranslations.availableCredits}
            </p>
            <p className="mt-1 text-3xl font-extrabold text-slate-950">
              {creditSummary.balance}
            </p>
          </div>
        </div>
        <div className="px-4 py-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-900">{accountTranslations.creditHistory}</p>
            <Link
              href={getLocalizedHref('/credits')}
              onClick={() => setAccountMenuOpen(false)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
            >
              {accountTranslations.seeAll}
            </Link>
          </div>
          {renderCreditTransactions()}
          <Link
            href={getLocalizedHref('/history')}
            onClick={() => setAccountMenuOpen(false)}
            className="mt-4 flex w-full items-center justify-between rounded-xl border-t border-slate-100 px-4 py-3 text-left text-sm font-bold text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
          >
            <span>{accountTranslations.history}</span>
            <span className="text-xs text-slate-400">{accountTranslations.viewAll}</span>
          </Link>
          <div className="mt-4 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full rounded-xl px-4 py-2.5 text-left text-sm font-bold text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
            >
              {accountTranslations.signOut}
            </button>
          </div>
        </div>
      </div>
    )
  }


  // 二级菜单项（动态生成以包含语言前缀）
  const secondLevelItems = [
    {
      title: navTranslations.imageCompression,
      href: getLocalizedHref('/image-compressor'),
      hasThirdLevel: true,
      tool: 'image-compressor',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 flex-shrink-0">
          {/* 四个绿色方块，表示压缩 */}
          <rect x="3" y="3" width="7" height="7" rx="1.5" fill="#10B981"/>
          <rect x="14" y="3" width="7" height="7" rx="1.5" fill="#10B981"/>
          <rect x="3" y="14" width="7" height="7" rx="1.5" fill="#10B981"/>
          <rect x="14" y="14" width="7" height="7" rx="1.5" fill="#10B981"/>
          {/* 向内箭头（左上和右下） */}
          <path d="M6.5 6.5L9 9M9 6.5L6.5 9" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17.5 17.5L15 15M15 17.5L17.5 15" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          {/* 向外箭头（右上和左下） */}
          <path d="M17.5 6.5L15 9M15 6.5L17.5 9" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6.5 17.5L9 15M9 17.5L6.5 15" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: navTranslations.fontGenerator || defaultNavTranslations.fontGenerator,
      href: getLocalizedHref('/font-generator'),
      hasThirdLevel: true,
      tool: 'font-generator',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 flex-shrink-0">
          {/* 字体图标 - 使用紫色渐变 */}
          <rect x="3" y="4" width="18" height="16" rx="2" fill="url(#fontGradient)" opacity="0.2"/>
          <path d="M7 8H17M7 12H15M7 16H13" stroke="url(#fontGradient)" strokeWidth="2" strokeLinecap="round"/>
          <defs>
            <linearGradient id="fontGradient" x1="3" y1="4" x2="21" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9333EA"/>
              <stop offset="1" stopColor="#4F46E5"/>
            </linearGradient>
          </defs>
        </svg>
      ),
    },
    {
      title: navTranslations.imageConverter,
      href: getLocalizedHref('/image-converter'),
      hasThirdLevel: true,
      tool: 'image-converter',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 flex-shrink-0">
          {/* 浅蓝色背景矩形 */}
          <rect x="2" y="2" width="20" height="20" rx="2.5" fill="#93C5FD" opacity="0.4"/>
          {/* 深蓝色转换箭头（对角线） */}
          <path d="M5 5L19 19M19 5L5 19" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round"/>
          {/* 图片图标（前景） */}
          <rect x="7" y="9" width="10" height="7" rx="1.5" fill="#3B82F6"/>
          <circle cx="9.5" cy="11.5" r="0.8" fill="white"/>
          <path d="M11.5 13.5L13.5 11.5L15.5 13.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      ),
    },
    {
      title: navTranslations.emojiCopyAndPaste || defaultNavTranslations.emojiCopyAndPaste,
      href: getLocalizedHref('/emoji-copy-and-paste'),
      hasThirdLevel: true,
      tool: 'emoji-copy-and-paste',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 flex-shrink-0">
          <circle cx="12" cy="12" r="10" fill="#FCD34D" opacity="0.9"/>
          <circle cx="9" cy="10" r="1.25" fill="#78350F"/>
          <circle cx="15" cy="10" r="1.25" fill="#78350F"/>
          <path d="M8 14c0 0 1.5 2 4 2s4-2 4-2" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
  ]

  const promptMenuGroups = [
    {
      title: navTranslations.promptModels || defaultNavTranslations.promptModels,
      key: 'prompt-models',
      items: [
        {
          title: navTranslations.seedance25 || defaultNavTranslations.seedance25,
          href: getLocalizedHref('/model/seedance-2-5'),
        },
        {
          title: navTranslations.gptImage2 || defaultNavTranslations.gptImage2,
          href: getLocalizedHref('/prompts/models/gpt-image-2'),
        },
        {
          title: navTranslations.seedance2 || defaultNavTranslations.seedance2,
          href: getLocalizedHref('/prompts/models/seedance-2-0'),
        },
        {
          title: navTranslations.kling || defaultNavTranslations.kling,
          href: getLocalizedHref('/prompts/models/kling'),
        },
        {
          title: navTranslations.nanoBanana || defaultNavTranslations.nanoBanana,
          href: getLocalizedHref('/prompts/models/nano-banana'),
        },
      ],
    },
    {
      title: navTranslations.promptScenes || defaultNavTranslations.promptScenes,
      key: 'prompt-scenes',
      items: [
        {
          title: navTranslations.advertising || defaultNavTranslations.advertising,
          href: getLocalizedHref('/prompts/categories/advertising'),
        },
        {
          title: navTranslations.fashionBeauty || defaultNavTranslations.fashionBeauty,
          href: getLocalizedHref('/prompts/categories/fashion-beauty'),
        },
        {
          title: navTranslations.filmTrailer || defaultNavTranslations.filmTrailer,
          href: getLocalizedHref('/prompts/categories/film-trailer'),
        },
      ],
    },
  ]

  return (
    <>
    <nav id="mainNav" ref={navRef} className="sticky-nav w-full">
      <div className="h-[70px] px-6 flex justify-center items-center max-w-6xl mx-auto w-full relative">
        <Link href={getLocalizedHref('/')} className="absolute left-6 text-3xl font-extrabold text-indigo-600 tracking-tighter flex items-center gap-3 hover:opacity-80 transition-opacity">
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="shadow-md shadow-indigo-100 rounded-lg">
            <rect width="40" height="40" rx="12" fill="white"/>
            <path d="M12 12H22C23.1 12 24 12.9 24 14V28C24 29.1 23.1 30 22 30H18C16.9 30 16 29.1 16 28V16H12C10.9 16 10 15.1 10 14V14C10 12.9 10.9 12 12 12Z" fill="url(#paint_wink)"/>
            <circle cx="29" cy="14" r="3" fill="url(#paint_wink)"/>
            <defs><linearGradient id="paint_wink" x1="10" y1="12" x2="29" y2="30" gradientUnits="userSpaceOnUse"><stop stopColor="#4F46E5"/><stop offset="1" stopColor="#9333EA"/></linearGradient></defs>
          </svg>
          Toolaze
        </Link>
        
        {/* 移动端账号入口 + 菜单按钮 */}
        {isMobileView && (
          <div className="absolute right-4 z-50 flex items-center gap-2 md:hidden">
            {authLoaded && authUser ? (
              <div ref={accountMenuRef} className="relative flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1 text-sm font-extrabold text-[#4F46E5]"
                  aria-label={`${creditSummary.balance} ${accountTranslations.credits}`}
                >
                  <span className="tabular-nums">{creditSummary.balance}</span>
                  <img
                    src="/credits-icons/diamond-3d-indigo.svg"
                    alt=""
                    aria-hidden="true"
                    className="h-5 w-5"
                  />
                </span>
                <button
                  type="button"
                  onClick={toggleAccountMenu}
                  data-account-avatar-trigger
                  className="flex h-10 w-10 appearance-none items-center justify-center overflow-hidden rounded-full border-0 bg-transparent p-0 shadow-none transition-colors hover:bg-transparent"
                  aria-label={authTranslations.openAccountMenu}
                  aria-expanded={accountMenuOpen}
                >
                  {renderAvatar('h-10 w-10')}
                </button>
                {accountMenuOpen && renderAccountMenu()}
              </div>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:border-indigo-200 hover:text-indigo-600"
              >
                {authTranslations.signIn}
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen)
                setAccountMenuOpen(false)
                // 关闭菜单时重置子菜单展开状态
                if (mobileMenuOpen) {
                  setExpandedSubmenus(new Set())
                }
              }}
              className="p-2 text-slate-700 transition-colors hover:text-indigo-600"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <CloseIcon size={24} className="w-6 h-6" />
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        )}

        {/* 桌面端菜单 */}
        <div className="hidden md:flex gap-5 text-sm font-bold text-slate-700 items-center">
          {/* 一级菜单：Prompts */}
          <div className="relative group order-4">
            <button
              type="button"
              onClick={() => toggleDesktopMenu('prompts')}
              aria-expanded={openDesktopMenu === 'prompts'}
              className="hover:text-indigo-600 transition-colors flex items-center gap-1"
            >
              {navTranslations.promptLibrary || defaultNavTranslations.promptLibrary}
              <svg className={'w-4 h-4 transition-transform group-hover:rotate-180' + (openDesktopMenu === 'prompts' ? ' rotate-180' : '')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div className={'absolute top-full left-0 mt-2 w-auto min-w-[220px] max-w-[320px] bg-white rounded-xl shadow-lg border border-indigo-50 transition-all duration-200 z-50 overflow-visible ' + (openDesktopMenu === 'prompts' ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible')}>
              <div className="py-2">
                <Link
                  href={getLocalizedHref('/prompts')}
                  onClick={() => setOpenDesktopMenu(null)}
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors whitespace-nowrap"
                >
                  {navTranslations.allPrompts || defaultNavTranslations.allPrompts}
                </Link>
                <Link
                  href={getLocalizedHref('/world-cup-ai-image-generator')}
                  onClick={() => setOpenDesktopMenu(null)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors whitespace-nowrap"
                >
                  <img
                    src={AI_TOOLS_DEMO_IMAGES.worldCupAiImageGenerator}
                    alt={navTranslations.worldCupAiImageGenerator || defaultNavTranslations.worldCupAiImageGenerator}
                    className="w-8 h-8 rounded-lg object-cover border border-indigo-100 flex-shrink-0"
                  />
                  <span>{navTranslations.worldCupAiImageGenerator || defaultNavTranslations.worldCupAiImageGenerator}</span>
                </Link>
                {promptMenuGroups.map((group) => (
                  <div key={group.key} className="relative group/secondary">
                    <div className="flex items-center justify-between px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors whitespace-nowrap">
                      <span>{group.title}</span>
                      <svg className="w-3 h-3 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </div>
                    <div className="absolute left-full top-0 ml-1 w-auto min-w-[220px] max-w-[360px] bg-white rounded-xl shadow-lg border border-indigo-50 opacity-0 invisible group-hover/secondary:opacity-100 group-hover/secondary:visible transition-all duration-200 z-[60]">
                      <div className="py-2">
                        {group.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpenDesktopMenu(null)}
                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors whitespace-nowrap"
                          >
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* 一级菜单：AI Tools */}
          <div className="relative group order-2">
            <button
              type="button"
              onClick={() => toggleDesktopMenu('ai-tools')}
              aria-expanded={openDesktopMenu === 'ai-tools'}
              className="hover:text-indigo-600 transition-colors flex items-center gap-1"
            >
              {navTranslations.aiTools || 'AI Tools'}
              <svg className={'w-4 h-4 transition-transform group-hover:rotate-180' + (openDesktopMenu === 'ai-tools' ? ' rotate-180' : '')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div className={'absolute top-full left-0 mt-2 w-auto min-w-[280px] bg-white rounded-xl shadow-lg border border-indigo-50 transition-all duration-200 z-50 ' + (openDesktopMenu === 'ai-tools' ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible')}>
              <div className="py-2">
                <Link
                  href={getLocalizedHref('/ai-image-to-image-generator')}
                  onClick={() => setOpenDesktopMenu(null)}
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-3"
                >
                  <img
                    src={AI_TOOLS_DEMO_IMAGES.aiImageToImageGenerator}
                    alt={navTranslations.aiImageToImageGenerator || defaultNavTranslations.aiImageToImageGenerator}
                    className="w-10 h-10 rounded-lg object-cover border border-indigo-100 flex-shrink-0"
                  />
                  <span>{navTranslations.aiImageToImageGenerator || defaultNavTranslations.aiImageToImageGenerator}</span>
                </Link>
                <Link
                  href={getLocalizedHref('/world-cup-ai-image-generator')}
                  onClick={() => setOpenDesktopMenu(null)}
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-3"
                >
                  <img
                    src={AI_TOOLS_DEMO_IMAGES.worldCupAiImageGenerator}
                    alt={navTranslations.worldCupAiImageGenerator || defaultNavTranslations.worldCupAiImageGenerator}
                    className="w-10 h-10 rounded-lg object-cover border border-indigo-100 flex-shrink-0"
                  />
                  <span>{navTranslations.worldCupAiImageGenerator || defaultNavTranslations.worldCupAiImageGenerator}</span>
                </Link>
                <Link
                  href={getLocalizedHref('/watermark-remover')}
                  onClick={() => setOpenDesktopMenu(null)}
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-3"
                >
                  <img
                    src={AI_TOOLS_DEMO_IMAGES.watermarkRemover}
                    alt={navTranslations.watermarkRemover || 'Watermark Remover'}
                    className="w-10 h-10 rounded-lg object-cover border border-indigo-100 flex-shrink-0"
                  />
                  <span>{navTranslations.watermarkRemover || 'Watermark Remover'}</span>
                </Link>
                <Link
                  href={getLocalizedHref('/photo-restoration')}
                  onClick={() => setOpenDesktopMenu(null)}
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-3"
                >
                  <img
                    src={AI_TOOLS_DEMO_IMAGES.photoRestoration}
                    alt={navTranslations.photoRestoration || defaultNavTranslations.photoRestoration}
                    className="w-10 h-10 rounded-lg object-cover border border-indigo-100 flex-shrink-0"
                  />
                  <span>{navTranslations.photoRestoration || defaultNavTranslations.photoRestoration}</span>
                </Link>
                <Link
                  href={getLocalizedHref('/ai-couple-photo-maker')}
                  onClick={() => setOpenDesktopMenu(null)}
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-3"
                >
                  <img
                    src={AI_TOOLS_DEMO_IMAGES.aiCouplePhotoMaker}
                    alt={navTranslations.aiCouplePhotoMaker || defaultNavTranslations.aiCouplePhotoMaker}
                    className="w-10 h-10 rounded-lg object-cover border border-indigo-100 flex-shrink-0"
                  />
                  <span>{navTranslations.aiCouplePhotoMaker || defaultNavTranslations.aiCouplePhotoMaker}</span>
                </Link>
                <Link
                  href={getLocalizedHref('/ai-tools')}
                  onClick={() => {
                    setOpenDesktopMenu(null)
                    if (typeof window !== 'undefined') {
                      window.location.href = '/ai-tools'
                    }
                  }}
                  className="block px-4 pt-2 pb-1 text-xs font-medium tracking-normal text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  {navTranslations.viewAllAiTools || defaultNavTranslations.viewAllAiTools}
                </Link>
              </div>
            </div>
          </div>
          {/* 一级菜单：AI Image */}
          <div className="relative group order-1">
            <button
              type="button"
              onClick={() => toggleDesktopMenu('ai-image')}
              aria-expanded={openDesktopMenu === 'ai-image'}
              className="hover:text-indigo-600 transition-colors flex items-center gap-1"
            >
              {navTranslations.aiImage || defaultNavTranslations.aiImage}
              <svg className={'w-4 h-4 transition-transform group-hover:rotate-180' + (openDesktopMenu === 'ai-image' ? ' rotate-180' : '')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div className={'absolute top-full left-0 pt-1 w-auto min-w-[200px] bg-transparent transition-all duration-200 z-50 ' + (openDesktopMenu === 'ai-image' ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible')}>
              <div className="flex flex-col bg-white rounded-xl shadow-lg border border-indigo-50 py-2">
                <Link
                  href={getLocalizedHref('/ai-image-generator')}
                  onClick={() => setOpenDesktopMenu(null)}
                  className="order-1 block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                    <rect x="2" y="2" width="20" height="20" rx="2" fill="url(#aiImageGeneratorGradient)" opacity="0.2"/>
                    <path d="M6 16l4-4 3 3 5-6" stroke="url(#aiImageGeneratorGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 5l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" fill="url(#aiImageGeneratorGradient)"/>
                    <defs>
                      <linearGradient id="aiImageGeneratorGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#9333EA"/>
                        <stop offset="1" stopColor="#4F46E5"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <span>{navTranslations.aiImageGenerator || defaultNavTranslations.aiImageGenerator}</span>
                </Link>
                <Link
                  href={getLocalizedHref('/text-to-image-generator')}
                  onClick={() => setOpenDesktopMenu(null)}
                  className="order-2 block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                    <rect x="2" y="2" width="20" height="20" rx="2" fill="url(#textToImageGeneratorGradient)" opacity="0.2"/>
                    <path d="M7 8h4M7 12h7M7 16h5" stroke="url(#textToImageGeneratorGradient)" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M16 7l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" fill="url(#textToImageGeneratorGradient)"/>
                    <defs>
                      <linearGradient id="textToImageGeneratorGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#9333EA"/>
                        <stop offset="1" stopColor="#4F46E5"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <span>{navTranslations.textToImageGenerator || defaultNavTranslations.textToImageGenerator}</span>
                </Link>
                <Link
                  href={getLocalizedHref('/ai-image-to-image-generator')}
                  onClick={() => setOpenDesktopMenu(null)}
                  className="order-3 block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                    <rect x="2" y="2" width="20" height="20" rx="2" fill="url(#aiImageToImageGradient)" opacity="0.2"/>
                    <path d="M6 8h7M6 12h5M6 16h7" stroke="url(#aiImageToImageGradient)" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M15 7l3 3-3 3M18 10H12" stroke="url(#aiImageToImageGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                      <linearGradient id="aiImageToImageGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#9333EA"/>
                        <stop offset="1" stopColor="#4F46E5"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <span>{navTranslations.aiImageToImageGenerator || defaultNavTranslations.aiImageToImageGenerator}</span>
                </Link>
                <Link
                  href={getLocalizedHref('/model/gpt-image-2-0')}
                  onClick={() => setOpenDesktopMenu(null)}
                  className="order-5 block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                    <rect x="2" y="2" width="20" height="20" rx="2" fill="url(#aiImageGradient3)" opacity="0.2"/>
                    <path d="M7 15l3-3 2 2 5-5" stroke="url(#aiImageGradient3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                      <linearGradient id="aiImageGradient3" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#9333EA"/>
                        <stop offset="1" stopColor="#4F46E5"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="inline-flex items-center gap-2">
                    <span>{navTranslations.gptImage2 || defaultNavTranslations.gptImage2}</span>
                    <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-white">Hot</span>
                  </span>
                </Link>
                <Link
                  href={getLocalizedHref('/model/seedream-5-0-pro')}
                  onClick={() => setOpenDesktopMenu(null)}
                  className="order-4 block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                    <rect x="2" y="2" width="20" height="20" rx="2" fill="url(#aiImageGradient50Pro)" opacity="0.2"/>
                    <path d="M7 8h10M7 12h7M7 16h5M17 5l1.8 3.4L22 10l-3.2 1.6L17 15l-1.8-3.4L12 10l3.2-1.6L17 5Z" stroke="url(#aiImageGradient50Pro)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                      <linearGradient id="aiImageGradient50Pro" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#9333EA"/>
                        <stop offset="1" stopColor="#4F46E5"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="inline-flex items-center gap-2">
                    <span>{navTranslations.seedream50Pro || defaultNavTranslations.seedream50Pro}</span>
                    <span className="rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-white">New</span>
                  </span>
                </Link>
                <Link
                  href={getLocalizedHref('/model/wan-2-7-image')}
                  onClick={() => setOpenDesktopMenu(null)}
                  className="order-6 block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                    <rect x="2" y="2" width="20" height="20" rx="2" fill="url(#aiImageGradientWan27)" opacity="0.2"/>
                    <path d="M7 8h10M7 12h7M7 16h10M17 6l1.5 3L21 10.5l-2.5 1.5L17 15l-1.5-3L13 10.5 15.5 9 17 6Z" stroke="url(#aiImageGradientWan27)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                      <linearGradient id="aiImageGradientWan27" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#9333EA"/>
                        <stop offset="1" stopColor="#4F46E5"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <span>{navTranslations.wan27Image || defaultNavTranslations.wan27Image}</span>
                </Link>
                <Link
                  href={getLocalizedHref('/model/nano-banana-pro')}
                  onClick={() => setOpenDesktopMenu(null)}
                  className="order-7 block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                    <rect x="2" y="2" width="20" height="20" rx="2" fill="url(#aiImageGradient)" opacity="0.2"/>
                    <path d="M8 8H16M8 12H14M8 16H12" stroke="url(#aiImageGradient)" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="18" cy="6" r="2" fill="url(#aiImageGradient)"/>
                    <defs>
                      <linearGradient id="aiImageGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#9333EA"/>
                        <stop offset="1" stopColor="#4F46E5"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <span>{navTranslations.nanoBananaPro || defaultNavTranslations.nanoBananaPro}</span>
                </Link>
                <Link
                  href={getLocalizedHref('/model/nano-banana-2')}
                  onClick={() => setOpenDesktopMenu(null)}
                  className="order-8 block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                    <rect x="2" y="2" width="20" height="20" rx="2" fill="url(#aiImageGradient2)" opacity="0.2"/>
                    <path d="M8 8H16M8 12H14M8 16H12" stroke="url(#aiImageGradient2)" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="18" cy="6" r="2" fill="url(#aiImageGradient2)"/>
                    <defs>
                      <linearGradient id="aiImageGradient2" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#9333EA"/>
                        <stop offset="1" stopColor="#4F46E5"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <span>{navTranslations.nanoBanana2 || defaultNavTranslations.nanoBanana2}</span>
                </Link>
                <Link
                  href={getLocalizedHref('/model/seedream-4-5')}
                  onClick={() => setOpenDesktopMenu(null)}
                  className="order-10 block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                    <rect x="2" y="2" width="20" height="20" rx="2" fill="url(#aiImageGradient4)" opacity="0.2"/>
                    <path d="M6 16c3-6 9-8 12-8M7 8h5M7 12h8" stroke="url(#aiImageGradient4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                      <linearGradient id="aiImageGradient4" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#9333EA"/>
                        <stop offset="1" stopColor="#4F46E5"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <span>{navTranslations.seedream45 || defaultNavTranslations.seedream45}</span>
                </Link>
                <Link
                  href={getLocalizedHref('/model/seedream-5-0-lite')}
                  onClick={() => setOpenDesktopMenu(null)}
                  className="order-9 block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                    <rect x="2" y="2" width="20" height="20" rx="2" fill="url(#aiImageGradient50Lite)" opacity="0.2"/>
                    <path d="M7 8h7M7 12h10M7 16h6M17 6l1.5 3L21 10.5l-2.5 1.5L17 15l-1.5-3L13 10.5 15.5 9 17 6Z" stroke="url(#aiImageGradient50Lite)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                      <linearGradient id="aiImageGradient50Lite" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#9333EA"/>
                        <stop offset="1" stopColor="#4F46E5"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <span>{navTranslations.seedream50Lite || defaultNavTranslations.seedream50Lite}</span>
                </Link>
              </div>
            </div>
          </div>
          {/* 一级菜单：AI Video */}
          <div className="relative group order-3">
            <button
              type="button"
              onClick={() => toggleDesktopMenu('ai-video')}
              aria-expanded={openDesktopMenu === 'ai-video'}
              className="hover:text-indigo-600 transition-colors flex items-center gap-1"
            >
              {navTranslations.aiVideo || defaultNavTranslations.aiVideo}
              <svg className={'w-4 h-4 transition-transform group-hover:rotate-180' + (openDesktopMenu === 'ai-video' ? ' rotate-180' : '')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div className={'absolute top-full left-0 pt-1 w-auto min-w-[200px] bg-transparent transition-all duration-200 z-50 ' + (openDesktopMenu === 'ai-video' ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible')}>
              <div className="bg-white rounded-xl shadow-lg border border-indigo-50 py-2">
                <Link
                  href={getLocalizedHref('/model/seedance-2-5')}
                  onClick={() => setOpenDesktopMenu(null)}
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                    <rect x="2" y="4" width="20" height="14" rx="2" fill="url(#aiVideoGradient25)" opacity="0.2"/>
                    <path d="M10 8L16 12L10 16V8Z" fill="url(#aiVideoGradient25)"/>
                    <defs>
                      <linearGradient id="aiVideoGradient25" x1="2" y1="4" x2="22" y2="18" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#9333EA"/>
                        <stop offset="1" stopColor="#4F46E5"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <span>{navTranslations.seedance25 || defaultNavTranslations.seedance25}</span>
                </Link>
                <Link
                  href={getLocalizedHref('/model/seedance-2')}
                  onClick={() => setOpenDesktopMenu(null)}
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                    <rect x="2" y="4" width="20" height="14" rx="2" fill="url(#aiVideoGradient)" opacity="0.2"/>
                    <path d="M10 8L16 12L10 16V8Z" fill="url(#aiVideoGradient)"/>
                    <defs>
                      <linearGradient id="aiVideoGradient" x1="2" y1="4" x2="22" y2="18" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#9333EA"/>
                        <stop offset="1" stopColor="#4F46E5"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <span>{navTranslations.seedance2 || defaultNavTranslations.seedance2}</span>
                </Link>
                <Link
                  href={getLocalizedHref('/model/kling-3')}
                  onClick={() => setOpenDesktopMenu(null)}
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                    <rect x="2" y="4" width="20" height="14" rx="2" fill="url(#aiVideoGradient2)" opacity="0.2"/>
                    <path d="M10 8L16 12L10 16V8Z" fill="url(#aiVideoGradient2)"/>
                    <defs>
                      <linearGradient id="aiVideoGradient2" x1="2" y1="4" x2="22" y2="18" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#9333EA"/>
                        <stop offset="1" stopColor="#4F46E5"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <span>{navTranslations.kling3 || defaultNavTranslations.kling3}</span>
                </Link>
              </div>
            </div>
          </div>
          {showNavLanguageSwitcher && (
            <div className="relative order-5">
              <button
                type="button"
                onClick={() => setNavLangOpen(!navLangOpen)}
                className="flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors px-2 py-1 rounded-lg hover:bg-indigo-50"
                aria-label={navTranslations.language}
                aria-expanded={navLangOpen}
              >
                <span className="text-base leading-none">{navCurrentLocaleInfo.flag}</span>
                <span className="hidden lg:inline">{navCurrentLocaleInfo.name}</span>
                <svg
                  className={'w-4 h-4 transition-transform' + (navLangOpen ? ' rotate-180' : '')}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {navLangOpen && (
                <>
                  <div className="fixed inset-0 z-[55]" onClick={() => setNavLangOpen(false)} aria-hidden />
                  <div className="absolute top-full right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-indigo-50 z-[60] overflow-hidden py-2">
                    {navOtherLocales.map((locale) => (
                      <Link
                        key={locale.code}
                        href={getAlternateLanguageUrl(pathname || '/', locale.code)}
                        onClick={() => {
                          const nextLocale = resolveLocaleForPath(pathname || '/', locale.code)
                          if (typeof window !== 'undefined') {
                            window.localStorage.setItem(PREFERRED_LOCALE_STORAGE_KEY, nextLocale)
                          }
                          setNavLangOpen(false)
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <span className="text-base">{locale.flag}</span>
                        <span>{locale.name}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="absolute right-6 hidden md:flex items-center gap-3">
          {authLoaded && authUser ? (
            <div ref={accountMenuRef} className="relative">
              <button
                type="button"
                onClick={toggleAccountMenu}
                className="flex items-center gap-2 rounded-full bg-white p-1 pl-3 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-indigo-600"
                aria-label={authTranslations.openAccountMenu}
                aria-expanded={accountMenuOpen}
              >
                <span
                  className="inline-flex items-center gap-1.5 text-[#4F46E5]"
                  aria-label={`${creditSummary.balance} ${accountTranslations.credits}`}
                >
                  <span className="tabular-nums">{creditSummary.balance}</span>
                  <img
                    src="/credits-icons/diamond-3d-indigo.svg"
                    alt=""
                    aria-hidden="true"
                    className="h-5 w-5"
                  />
                </span>
                {renderAvatar()}
              </button>
              {accountMenuOpen && renderAccountMenu()}
            </div>
          ) : (
            <button
              type="button"
              onClick={openAuthModal}
              className="text-sm font-semibold text-slate-700 transition-colors hover:text-indigo-600"
            >
              {authTranslations.signIn}
            </button>
          )}
        </div>

        {/* 移动端菜单面板 */}
        {mobileMenuOpen && (
          <div
            ref={menuRef}
            className="block md:!hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-indigo-50 z-40 max-h-[calc(100vh-70px)] overflow-y-auto overscroll-contain"
          >
            <div className="flex flex-col gap-4 px-6 py-4 pb-8">
              {/* Prompts 部分 */}
              <div className="order-4 border-b border-indigo-50 pb-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm font-bold text-slate-700">{navTranslations.promptLibrary || defaultNavTranslations.promptLibrary}</div>
                  <Link
                    href={getLocalizedHref('/prompts')}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setExpandedSubmenus(new Set())
                    }}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                  >
                    {navTranslations.allPrompts || defaultNavTranslations.allPrompts}
                  </Link>
                </div>
                <div className="space-y-2">
                  {promptMenuGroups.map((group) => {
                    const isExpanded = expandedSubmenus.has(group.key)
                    return (
                      <div key={group.key}>
                        <button
                          type="button"
                          onClick={() => {
                            setExpandedSubmenus((prev) => {
                              const next = new Set(prev)
                              if (next.has(group.key)) {
                                next.delete(group.key)
                              } else {
                                next.add(group.key)
                              }
                              return next
                            })
                          }}
                          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                          aria-expanded={isExpanded}
                        >
                          <span>{group.title}</span>
                          <svg className={'h-4 w-4 transition-transform' + (isExpanded ? ' rotate-90' : '')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        {isExpanded && (
                          <div className="ml-5 mt-2 space-y-1">
                            {group.items.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => {
                                  setMobileMenuOpen(false)
                                  setExpandedSubmenus(new Set())
                                }}
                                className="block rounded-lg px-3 py-2 text-sm text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                              >
                                {item.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
              {/* AI Tools 部分 */}
              <div className="order-2 border-b border-indigo-50 pb-4">
                <div className="text-sm font-bold text-slate-700 mb-3">{navTranslations.aiTools || 'AI Tools'}</div>
                <div className="space-y-2">
                  <Link
                    href={getLocalizedHref('/ai-image-to-image-generator')}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setExpandedSubmenus(new Set())
                    }}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                  >
                    <img
                      src={AI_TOOLS_DEMO_IMAGES.aiImageToImageGenerator}
                      alt={navTranslations.aiImageToImageGenerator || defaultNavTranslations.aiImageToImageGenerator}
                      className="w-10 h-10 rounded-lg object-cover border border-indigo-100 flex-shrink-0"
                    />
                    <span>{navTranslations.aiImageToImageGenerator || defaultNavTranslations.aiImageToImageGenerator}</span>
                  </Link>
                  <Link
                    href={getLocalizedHref('/world-cup-ai-image-generator')}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setExpandedSubmenus(new Set())
                    }}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                  >
                    <img
                      src={AI_TOOLS_DEMO_IMAGES.worldCupAiImageGenerator}
                      alt={navTranslations.worldCupAiImageGenerator || defaultNavTranslations.worldCupAiImageGenerator}
                      className="w-10 h-10 rounded-lg object-cover border border-indigo-100 flex-shrink-0"
                    />
                    <span>{navTranslations.worldCupAiImageGenerator || defaultNavTranslations.worldCupAiImageGenerator}</span>
                  </Link>
                  <Link
                    href={getLocalizedHref('/watermark-remover')}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setExpandedSubmenus(new Set())
                    }}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                  >
                    <img
                      src={AI_TOOLS_DEMO_IMAGES.watermarkRemover}
                      alt={navTranslations.watermarkRemover || 'Watermark Remover'}
                      className="w-10 h-10 rounded-lg object-cover border border-indigo-100 flex-shrink-0"
                    />
                    <span>{navTranslations.watermarkRemover || 'Watermark Remover'}</span>
                  </Link>
                  <Link
                    href={getLocalizedHref('/photo-restoration')}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setExpandedSubmenus(new Set())
                    }}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                  >
                    <img
                      src={AI_TOOLS_DEMO_IMAGES.photoRestoration}
                      alt={navTranslations.photoRestoration || defaultNavTranslations.photoRestoration}
                      className="w-10 h-10 rounded-lg object-cover border border-indigo-100 flex-shrink-0"
                    />
                    <span>{navTranslations.photoRestoration || defaultNavTranslations.photoRestoration}</span>
                  </Link>
                  <Link
                    href={getLocalizedHref('/ai-couple-photo-maker')}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setExpandedSubmenus(new Set())
                    }}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                  >
                    <img
                      src={AI_TOOLS_DEMO_IMAGES.aiCouplePhotoMaker}
                      alt={navTranslations.aiCouplePhotoMaker || defaultNavTranslations.aiCouplePhotoMaker}
                      className="w-10 h-10 rounded-lg object-cover border border-indigo-100 flex-shrink-0"
                    />
                    <span>{navTranslations.aiCouplePhotoMaker || defaultNavTranslations.aiCouplePhotoMaker}</span>
                  </Link>
                  <Link
                    href={getLocalizedHref('/ai-tools')}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setExpandedSubmenus(new Set())
                      if (typeof window !== 'undefined') {
                        window.location.href = '/ai-tools'
                      }
                    }}
                    className="flex items-center gap-3 px-3 py-2 text-xs font-medium tracking-normal text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    {navTranslations.viewAllAiTools || defaultNavTranslations.viewAllAiTools}
                  </Link>
                </div>
              </div>
              {/* AI Image 部分 */}
              <div className="order-1 border-b border-indigo-50 pb-4">
                <div className="text-sm font-bold text-slate-700 mb-3">{navTranslations.aiImage || defaultNavTranslations.aiImage}</div>
                <div className="flex flex-col gap-2">
                  <Link
                    href={getLocalizedHref('/ai-image-generator')}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setExpandedSubmenus(new Set())
                    }}
                    className="order-1 flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                      <rect x="2" y="2" width="20" height="20" rx="2" fill="url(#aiImageGeneratorGradientMobile)" opacity="0.2"/>
                      <path d="M6 16l4-4 3 3 5-6" stroke="url(#aiImageGeneratorGradientMobile)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 5l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" fill="url(#aiImageGeneratorGradientMobile)"/>
                      <defs>
                        <linearGradient id="aiImageGeneratorGradientMobile" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#9333EA"/>
                          <stop offset="1" stopColor="#4F46E5"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <span>{navTranslations.aiImageGenerator || defaultNavTranslations.aiImageGenerator}</span>
                  </Link>
                  <Link
                    href={getLocalizedHref('/text-to-image-generator')}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setExpandedSubmenus(new Set())
                    }}
                    className="order-2 flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                      <rect x="2" y="2" width="20" height="20" rx="2" fill="url(#textToImageGeneratorGradientMobile)" opacity="0.2"/>
                      <path d="M7 8h4M7 12h7M7 16h5" stroke="url(#textToImageGeneratorGradientMobile)" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M16 7l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" fill="url(#textToImageGeneratorGradientMobile)"/>
                      <defs>
                        <linearGradient id="textToImageGeneratorGradientMobile" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#9333EA"/>
                          <stop offset="1" stopColor="#4F46E5"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <span>{navTranslations.textToImageGenerator || defaultNavTranslations.textToImageGenerator}</span>
                  </Link>
                  <Link
                    href={getLocalizedHref('/ai-image-to-image-generator')}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setExpandedSubmenus(new Set())
                    }}
                    className="order-3 flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                      <rect x="2" y="2" width="20" height="20" rx="2" fill="url(#aiImageToImageGradientMobile)" opacity="0.2"/>
                      <path d="M6 8h7M6 12h5M6 16h7" stroke="url(#aiImageToImageGradientMobile)" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M15 7l3 3-3 3M18 10H12" stroke="url(#aiImageToImageGradientMobile)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <defs>
                        <linearGradient id="aiImageToImageGradientMobile" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#9333EA"/>
                          <stop offset="1" stopColor="#4F46E5"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <span>{navTranslations.aiImageToImageGenerator || defaultNavTranslations.aiImageToImageGenerator}</span>
                  </Link>
                  <Link
                    href={getLocalizedHref('/model/gpt-image-2-0')}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setExpandedSubmenus(new Set())
                    }}
                    className="order-5 flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                      <rect x="2" y="2" width="20" height="20" rx="2" fill="url(#aiImageGradientMobile3)" opacity="0.2"/>
                      <path d="M7 15l3-3 2 2 5-5" stroke="url(#aiImageGradientMobile3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <defs>
                        <linearGradient id="aiImageGradientMobile3" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#9333EA"/>
                          <stop offset="1" stopColor="#4F46E5"/>
                        </linearGradient>
                      </defs>
                  </svg>
                  <span className="inline-flex items-center gap-2">
                    <span>{navTranslations.gptImage2 || defaultNavTranslations.gptImage2}</span>
                    <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-white">Hot</span>
                  </span>
                </Link>
                <Link
                  href={getLocalizedHref('/model/seedream-5-0-pro')}
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setExpandedSubmenus(new Set())
                  }}
                  className="order-4 flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                    <rect x="2" y="2" width="20" height="20" rx="2" fill="url(#aiImageGradientMobile50Pro)" opacity="0.2"/>
                    <path d="M7 8h10M7 12h7M7 16h5M17 5l1.8 3.4L22 10l-3.2 1.6L17 15l-1.8-3.4L12 10l3.2-1.6L17 5Z" stroke="url(#aiImageGradientMobile50Pro)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                      <linearGradient id="aiImageGradientMobile50Pro" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#9333EA"/>
                        <stop offset="1" stopColor="#4F46E5"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="inline-flex items-center gap-2">
                    <span>{navTranslations.seedream50Pro || defaultNavTranslations.seedream50Pro}</span>
                    <span className="rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-white">New</span>
                  </span>
                </Link>
                <Link
                  href={getLocalizedHref('/model/wan-2-7-image')}
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setExpandedSubmenus(new Set())
                  }}
                  className="order-6 flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                    <rect x="2" y="2" width="20" height="20" rx="2" fill="url(#aiImageGradientMobileWan27)" opacity="0.2"/>
                    <path d="M7 8h10M7 12h7M7 16h10M17 6l1.5 3L21 10.5l-2.5 1.5L17 15l-1.5-3L13 10.5 15.5 9 17 6Z" stroke="url(#aiImageGradientMobileWan27)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                      <linearGradient id="aiImageGradientMobileWan27" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#9333EA"/>
                        <stop offset="1" stopColor="#4F46E5"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <span>{navTranslations.wan27Image || defaultNavTranslations.wan27Image}</span>
                </Link>
                <Link
                  href={getLocalizedHref('/model/nano-banana-pro')}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setExpandedSubmenus(new Set())
                    }}
                    className="order-7 flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                      <rect x="2" y="2" width="20" height="20" rx="2" fill="url(#aiImageGradientMobile)" opacity="0.2"/>
                      <path d="M8 8H16M8 12H14M8 16H12" stroke="url(#aiImageGradientMobile)" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="18" cy="6" r="2" fill="url(#aiImageGradientMobile)"/>
                      <defs>
                        <linearGradient id="aiImageGradientMobile" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#9333EA"/>
                          <stop offset="1" stopColor="#4F46E5"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <span>{navTranslations.nanoBananaPro || defaultNavTranslations.nanoBananaPro}</span>
                  </Link>
                  <Link
                    href={getLocalizedHref('/model/nano-banana-2')}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setExpandedSubmenus(new Set())
                    }}
                    className="order-8 flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                      <rect x="2" y="2" width="20" height="20" rx="2" fill="url(#aiImageGradientMobile2)" opacity="0.2"/>
                      <path d="M8 8H16M8 12H14M8 16H12" stroke="url(#aiImageGradientMobile2)" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="18" cy="6" r="2" fill="url(#aiImageGradientMobile2)"/>
                      <defs>
                        <linearGradient id="aiImageGradientMobile2" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#9333EA"/>
                          <stop offset="1" stopColor="#4F46E5"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <span>{navTranslations.nanoBanana2 || defaultNavTranslations.nanoBanana2}</span>
                  </Link>
                  <Link
                    href={getLocalizedHref('/model/seedream-4-5')}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setExpandedSubmenus(new Set())
                    }}
                    className="order-10 flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                      <rect x="2" y="2" width="20" height="20" rx="2" fill="url(#aiImageGradientMobile4)" opacity="0.2"/>
                      <path d="M6 16c3-6 9-8 12-8M7 8h5M7 12h8" stroke="url(#aiImageGradientMobile4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <defs>
                        <linearGradient id="aiImageGradientMobile4" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#9333EA"/>
                          <stop offset="1" stopColor="#4F46E5"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <span>{navTranslations.seedream45 || defaultNavTranslations.seedream45}</span>
                  </Link>
                  <Link
                    href={getLocalizedHref('/model/seedream-5-0-lite')}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setExpandedSubmenus(new Set())
                    }}
                    className="order-9 flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                      <rect x="2" y="2" width="20" height="20" rx="2" fill="url(#aiImageGradientMobile50Lite)" opacity="0.2"/>
                      <path d="M7 8h7M7 12h10M7 16h6M17 6l1.5 3L21 10.5l-2.5 1.5L17 15l-1.5-3L13 10.5 15.5 9 17 6Z" stroke="url(#aiImageGradientMobile50Lite)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      <defs>
                        <linearGradient id="aiImageGradientMobile50Lite" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#9333EA"/>
                          <stop offset="1" stopColor="#4F46E5"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <span>{navTranslations.seedream50Lite || defaultNavTranslations.seedream50Lite}</span>
                  </Link>
                </div>
              </div>
              {/* AI Video 部分 */}
              <div className="order-3 border-b border-indigo-50 pb-4">
                <div className="text-sm font-bold text-slate-700 mb-3">{navTranslations.aiVideo || defaultNavTranslations.aiVideo}</div>
                <div className="space-y-2">
                  <Link
                    href={getLocalizedHref('/model/seedance-2-5')}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setExpandedSubmenus(new Set())
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                      <rect x="2" y="4" width="20" height="14" rx="2" fill="url(#aiVideoGradientMobile25)" opacity="0.2"/>
                      <path d="M10 8L16 12L10 16V8Z" fill="url(#aiVideoGradientMobile25)"/>
                      <defs>
                        <linearGradient id="aiVideoGradientMobile25" x1="2" y1="4" x2="22" y2="18" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#9333EA"/>
                          <stop offset="1" stopColor="#4F46E5"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <span>{navTranslations.seedance25 || defaultNavTranslations.seedance25}</span>
                  </Link>
                  <Link
                    href={getLocalizedHref('/model/seedance-2')}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setExpandedSubmenus(new Set())
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                      <rect x="2" y="4" width="20" height="14" rx="2" fill="url(#aiVideoGradientMobile)" opacity="0.2"/>
                      <path d="M10 8L16 12L10 16V8Z" fill="url(#aiVideoGradientMobile)"/>
                      <defs>
                        <linearGradient id="aiVideoGradientMobile" x1="2" y1="4" x2="22" y2="18" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#9333EA"/>
                          <stop offset="1" stopColor="#4F46E5"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <span>{navTranslations.seedance2 || defaultNavTranslations.seedance2}</span>
                  </Link>
                  <Link
                    href={getLocalizedHref('/model/kling-3')}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setExpandedSubmenus(new Set())
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                      <rect x="2" y="4" width="20" height="14" rx="2" fill="url(#aiVideoGradientMobile2)" opacity="0.2"/>
                      <path d="M10 8L16 12L10 16V8Z" fill="url(#aiVideoGradientMobile2)"/>
                      <defs>
                        <linearGradient id="aiVideoGradientMobile2" x1="2" y1="4" x2="22" y2="18" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#9333EA"/>
                          <stop offset="1" stopColor="#4F46E5"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <span>{navTranslations.kling3 || defaultNavTranslations.kling3}</span>
                  </Link>
                </div>
              </div>
              {showNavLanguageSwitcher && (
                <div className="order-5 border-t border-indigo-50 pt-4 mt-2">
                  <div className="text-sm font-bold text-slate-700 mb-3">{navTranslations.language}</div>
                  <div className="flex flex-wrap gap-2">
                    {navOtherLocales.map((locale) => (
                      <Link
                        key={locale.code}
                        href={getAlternateLanguageUrl(pathname || '/', locale.code)}
                        onClick={() => {
                          const nextLocale = resolveLocaleForPath(pathname || '/', locale.code)
                          if (typeof window !== 'undefined') {
                            window.localStorage.setItem(PREFERRED_LOCALE_STORAGE_KEY, nextLocale)
                          }
                          setMobileMenuOpen(false)
                          setExpandedSubmenus(new Set())
                        }}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-200"
                      >
                        <span>{locale.flag}</span>
                        <span>{locale.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
    {topNotice && (
      <div className="fixed right-4 top-20 z-[10000] max-w-sm rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/70">
        <div className="flex items-start gap-3">
          <div className={`mt-1 h-2.5 w-2.5 rounded-full ${topNotice.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-extrabold text-slate-950">{topNotice.title}</p>
            <p className="mt-0.5 text-xs leading-5 text-slate-600">{topNotice.message}</p>
          </div>
          <button
            type="button"
            onClick={() => setTopNotice(null)}
            className="rounded-full p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label={authTranslations.closeNotification}
          >
            <CloseIcon size={16} />
          </button>
        </div>
      </div>
    )}
    {authModalOpen && (
      <div
        className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <button
          type="button"
          className="absolute inset-0 h-full w-full cursor-default rounded-none border-0 bg-transparent p-0"
          aria-label={authTranslations.closeDialog}
          onClick={closeAuthModal}
        />
        <div className="relative w-full max-w-[420px] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
          <button
            type="button"
            onClick={closeAuthModal}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-900"
            aria-label={authTranslations.closeDialog}
          >
            <CloseIcon size={18} />
          </button>
          <div className="px-6 pb-6 pt-7 sm:px-8 sm:pb-8">
            <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-100">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 3L14.3 8.1L20 8.7L15.7 12.4L17 18L12 15.1L7 18L8.3 12.4L4 8.7L9.7 8.1L12 3Z" fill="currentColor" />
              </svg>
            </div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
              {authTranslations.modalEyebrow}
            </p>
            <h2 id="auth-modal-title" className="text-2xl font-extrabold leading-tight text-slate-950">
              {authTranslations.modalTitle}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {authTranslations.modalDescription}
            </p>
            <button
              type="button"
              onClick={startGoogleSignIn}
              disabled={authRedirecting}
              className={`mt-6 flex w-full items-center justify-center gap-3 rounded-xl border px-4 py-3 text-sm font-bold shadow-sm transition ${
                authRedirecting
                  ? 'pointer-events-none border-indigo-100 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 bg-white text-slate-900 hover:border-indigo-200 hover:bg-slate-50'
              }`}
            >
              {authRedirecting ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" aria-hidden="true" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5.4c-.2 1.2-.9 2.2-2 2.9v2.4h3.2c1.8-1.7 3-4.2 3-7Z" />
                  <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.5l-3.2-2.4c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.8-5.6-4.1H3.1v2.5C4.8 19.7 8.2 22 12 22Z" />
                  <path fill="#FBBC05" d="M6.4 13.9c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V7.6H3.1C2.4 8.9 2 10.4 2 12s.4 3.1 1.1 4.4l3.3-2.5Z" />
                  <path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.8-2.8C17 3 14.7 2 12 2 8.2 2 4.8 4.3 3.1 7.6l3.3 2.5C7.2 7.8 9.4 6 12 6Z" />
                </svg>
              )}
              {authRedirecting ? authTranslations.modalGoogleLoading : authTranslations.modalGoogleButton}
            </button>
            <p className="mt-4 text-center text-xs leading-5 text-slate-500">
              {authTranslations.modalTerms}
            </p>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
