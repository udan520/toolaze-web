'use client'

import { useEffect } from 'react'

export default function ErrorSuppressor() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Suppress browser extension message port errors
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      try {
        const reason = event.reason
        const reasonString = reason?.toString() || ''
        const reasonMessage = reason?.message || ''
        
        if (
          reason &&
          (typeof reason === 'string' || reason instanceof Error) &&
          (reasonString.includes('message port closed') ||
           reasonString.includes('Message port closed') ||
           reasonMessage.includes('message port closed') ||
           reasonMessage.includes('Message port closed') ||
           reasonString.includes('Extension context invalidated') ||
           reasonMessage.includes('Extension context invalidated'))
        ) {
          event.preventDefault()
          return false
        }
      } catch (e) {
        // Ignore errors in error handler
      }
    }

    // Suppress console errors from extensions
    const originalError = console.error
    console.error = (...args: any[]) => {
      const message = args.join(' ')
      if (
        typeof message === 'string' &&
        (message.includes('message port closed') ||
         message.includes('Message port closed') ||
         message.includes('Extension context invalidated') ||
         message.includes('Non-Error promise rejection') ||
         message.includes('content.js'))
      ) {
        return
      }
      originalError.apply(console, args)
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      console.error = originalError
    }
  }, [])

  return null
}
