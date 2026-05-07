'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Kling3Redirect() {
  const router = useRouter()
  useEffect(() => {
    router.push('/model/kling-3')
  }, [router])
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
      <p className="text-slate-500">Redirecting to Kling 3.0...</p>
    </div>
  )
}
