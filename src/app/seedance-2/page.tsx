'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Seedance2Redirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/model/seedance-2')
  }, [router])
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
      <p className="text-slate-500">Redirecting to Seedance 2.0...</p>
    </div>
  )
}
