'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    console.error('Error digest:', error.digest)
  }, [error])

  return (
    <>
      <Navigation />
      <main className="min-h-screen flex items-center justify-center px-6 bg-[#F8FAFF]">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-4">Something went wrong!</h1>
          <p className="text-lg text-slate-600 mb-8">
            We encountered an unexpected error. Please try again.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={reset}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-full hover:opacity-90 transition-opacity"
            >
              Try again
            </button>
            <Link
              href="/"
              className="px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-200 font-bold rounded-full hover:bg-indigo-50 transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
