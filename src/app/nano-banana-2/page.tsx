'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NanoBanana2Redirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/model/nano-banana-2')
  }, [router])
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
      <p className="text-slate-500">Redirecting to Nano Banana 2...</p>
    </div>
  )
}
