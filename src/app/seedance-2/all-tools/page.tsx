'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Seedance2AllToolsRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.push('/model/seedance-2/all-tools')
  }, [router])
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
      <p className="text-slate-500">Redirecting...</p>
    </div>
  )
}
