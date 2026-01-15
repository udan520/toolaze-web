import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen flex items-center justify-center px-6 bg-[#F8FAFF]">
        <div className="text-center">
          <h1 className="text-6xl font-extrabold text-slate-900 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-slate-700 mb-4">Page Not Found</h2>
          <p className="text-slate-500 mb-8">The page you're looking for doesn't exist.</p>
          <Link 
            href="/" 
            className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-full hover:opacity-90 transition-opacity"
          >
            Go Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
