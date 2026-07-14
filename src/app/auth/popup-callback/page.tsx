'use client'

import { useEffect, useMemo, useState } from 'react'

const AUTH_POPUP_MESSAGE_TYPE = 'toolaze:auth-result'

type AuthPopupMessage = {
  type: typeof AUTH_POPUP_MESSAGE_TYPE
  status: 'success' | 'error'
  error?: string
  localSessionToken?: string
  user?: unknown
  credits?: unknown
  newUserCredits?: number
}

function getSafePath(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return '/'
  return value
}

function getAllowedOpenerOrigin(value: string | null): string {
  if (!value) return '*'

  try {
    const url = new URL(value)
    const hostname = url.hostname
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
    const isKnownToolazeHost = [
      'toolaze.com',
      'www.toolaze.com',
      'toolaze-web.pages.dev',
    ].includes(hostname)

    if ((url.protocol === 'http:' && isLocalhost) || (url.protocol === 'https:' && (isLocalhost || isKnownToolazeHost))) {
      return url.origin
    }
  } catch {
    return '*'
  }

  return '*'
}

async function getRemoteAuthState() {
  try {
    const response = await fetch('/api/auth/me', { cache: 'no-store' })
    if (!response.ok) return {}

    const data = await response.json().catch(() => ({}))
    if (!data?.user) return {}

    return {
      user: data.user,
      credits: data.credits ?? null,
    }
  } catch {
    return {}
  }
}

function getNewUserCredits(value: string | null): number | undefined {
  const amount = Number(value)
  return Number.isInteger(amount) && amount > 0 ? amount : undefined
}

export default function AuthPopupCallbackPage() {
  const [message, setMessage] = useState('Completing Google sign-in...')

  const params = useMemo(() => {
    if (typeof window === 'undefined') {
      return new URLSearchParams()
    }

    return new URLSearchParams(window.location.search)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function notifyOpener() {
      const authError = params.get('auth_error')
      const status = authError ? 'error' : 'success'
      const openerOrigin = getAllowedOpenerOrigin(params.get('openerOrigin'))
      const returnTo = getSafePath(params.get('returnTo'))
      const localSessionToken = params.get('local_session_token') || undefined
      const newUserCredits = status === 'success' ? getNewUserCredits(params.get('new_user_credits')) : undefined
      const remoteAuthState = status === 'success' ? await getRemoteAuthState() : {}

      if (cancelled) return

      const payload: AuthPopupMessage = {
        type: AUTH_POPUP_MESSAGE_TYPE,
        status,
        ...(authError ? { error: authError } : {}),
        ...(localSessionToken ? { localSessionToken } : {}),
        ...(newUserCredits ? { newUserCredits } : {}),
        ...remoteAuthState,
      }

      if (window.opener && !window.opener.closed) {
        window.opener.postMessage(payload, openerOrigin)
        window.close()
        setMessage('Sign-in complete. You can close this window.')
        return
      }

      window.location.replace(returnTo)
    }

    void notifyOpener()

    return () => {
      cancelled = true
    }
  }, [params])

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-center text-slate-900">
      <div className="max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
        <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-indigo-100 border-t-indigo-600" />
        <h1 className="text-lg font-extrabold">Google sign-in</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">{message}</p>
      </div>
    </main>
  )
}
