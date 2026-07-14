'use client'

import { Fragment, useState } from 'react'
import type { FormEvent } from 'react'

interface Seedance25LaunchUpdatesCopy {
  eyebrow?: string
  title?: string
  description?: string
  emailLabel?: string
  emailPlaceholder?: string
  button?: string
  idleText?: string
  successText?: string
  errorText?: string
  tagline?: string
  badges?: string[]
}

interface Seedance25LaunchUpdatesProps {
  copy?: Seedance25LaunchUpdatesCopy
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

export default function Seedance25LaunchUpdates({ copy }: Seedance25LaunchUpdatesProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const badges = copy?.badges?.length ? copy.badges : ['Longer scenes', 'Reference control', 'Launch alerts']

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedEmail = email.trim().toLowerCase()

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setStatus('error')
      return
    }

    try {
      const key = 'seedance_2_5_waitlist'
      const current = JSON.parse(window.localStorage.getItem(key) || '[]') as Array<{ email: string; createdAt: string }>
      const next = [
        { email: normalizedEmail, createdAt: new Date().toISOString() },
        ...current.filter((item) => item.email !== normalizedEmail),
      ].slice(0, 200)
      window.localStorage.setItem(key, JSON.stringify(next))

      const eventPayload = {
        model: 'seedance_2_5',
        page_type: 'model_landing',
        signup_location: 'hero',
      }

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'waitlist_signup', eventPayload)
      } else {
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({ event: 'waitlist_signup', ...eventPayload })
      }

      setEmail('')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="max-w-3xl mx-auto relative z-10">
      <div className="bg-white rounded-super p-2 shadow-soft border border-indigo-50">
        <div className="border-2 border-dashed border-indigo-100 rounded-[2.2rem] p-5 md:p-6 bg-indigo-50/20 relative overflow-hidden group hover:border-indigo-300 transition-all">
          <div className="grid gap-4 md:grid-cols-[76px_1fr] md:items-start">
            <div className="text-5xl text-center md:text-left group-hover:scale-110 transition-transform">🎬</div>
            <div className="text-center md:text-left">
              <p className="text-[12px] font-bold text-indigo-400 uppercase tracking-widest mb-3">
                {copy?.eyebrow || 'Launch updates'}
              </p>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-3">
                {copy?.title || 'Get Seedance 2.5 access alerts'}
              </h2>
              <p className="text-sm text-slate-500">
                {copy?.description || 'Enter your email to hear when Seedance 2.5 access opens.'}
              </p>

              <form className="mt-4 text-left" onSubmit={handleSubmit}>
                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="seedance-25-email">
                  {copy?.emailLabel || 'Email address'}
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    id="seedance-25-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={copy?.emailPlaceholder || 'you@company.com'}
                    autoComplete="email"
                    required
                    className="min-w-0 h-12 flex-1 rounded-2xl border-2 border-indigo-100 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                  />
                  <button
                    type="submit"
                    className="h-12 shrink-0 rounded-2xl bg-gradient-brand px-6 text-sm font-bold text-white shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:shadow-lg active:translate-y-px"
                  >
                    {copy?.button || 'Notify Me'}
                  </button>
                </div>
                <p className={`mt-4 text-center md:text-left text-sm ${status === 'error' ? 'text-red-600' : 'text-slate-500'}`}>
                  {status === 'success'
                    ? copy?.successText || "You're on the Seedance 2.5 update list."
                    : status === 'error'
                      ? copy?.errorText || 'Please enter a valid email address.'
                      : copy?.idleText || 'No spam. We will only email you about Seedance 2.5 availability and product updates.'}
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-4 text-[11px] font-bold text-indigo-900/60 uppercase tracking-widest">
        {badges.map((badge, index) => (
          <Fragment key={badge}>
            <span>{badge}</span>
            {index < badges.length - 1 && <span className="hidden md:block">|</span>}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
