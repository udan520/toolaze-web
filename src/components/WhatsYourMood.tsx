'use client'

import { useState } from 'react'

interface WhatsYourMoodProps {
  className?: string
}

export default function WhatsYourMood({ className = '' }: WhatsYourMoodProps) {
  const [mood, setMood] = useState('')

  return (
    <div className={`${className}`}>
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
        <label htmlFor="mood-input" className="block text-sm font-semibold text-slate-700 mb-2">
          What's Your Mood?
        </label>
        <input
          id="mood-input"
          type="text"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="Type your mood here..."
          className="w-full px-4 py-3 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-slate-900 placeholder:text-slate-400"
        />
      </div>
    </div>
  )
}
