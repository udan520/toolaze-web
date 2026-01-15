'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Footer() {
  // Use a static year initially to avoid hydration mismatch
  // The year will be updated on client side after hydration
  const [currentYear, setCurrentYear] = useState(2024)

  useEffect(() => {
    // Update year after hydration to ensure it's current
    setCurrentYear(new Date().getFullYear())
  }, [])

  return (
    <footer className="bg-slate-900 pt-16 pb-8 px-6 mt-auto">
      <div className="max-w-6xl mx-auto">
        <nav className="mb-8" aria-label="Footer navigation">
          <ul className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm">
            <li><Link href="/" className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">Home</Link></li>
            <li><Link href="/#tools" className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">All Tools</Link></li>
            <li><Link href="/about" className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">About Us</Link></li>
            <li><Link href="/privacy" className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">Terms of Service</Link></li>
            <li><a href="mailto:support@toolaze.com" className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">Contact</a></li>
          </ul>
        </nav>

        <div className="text-center pt-6 border-t border-slate-700">
          <p className="text-xs text-slate-400 mb-2">
            © {currentYear} Toolaze Lab. All rights reserved.
          </p>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">
            Free Online Tools • No Registration Required • 100% Private
          </p>
        </div>
      </div>
    </footer>
  )
}
