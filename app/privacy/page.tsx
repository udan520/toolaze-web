import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="overflow-x-hidden min-h-screen bg-[#F8FAFF]">
      {/* Navigation */}
      <nav className="py-6 flex justify-center bg-[#F8FAFF]">
        <Link href="/" className="text-3xl font-extrabold text-indigo-600 tracking-tighter cursor-pointer flex items-center gap-3">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="shadow-lg shadow-indigo-100 rounded-xl">
            <rect width="40" height="40" rx="12" fill="white"/>
            <path d="M12 12H22C23.1 12 24 12.9 24 14V28C24 29.1 23.1 30 22 30H18C16.9 30 16 29.1 16 28V16H12C10.9 16 10 15.1 10 14V14C10 12.9 10.9 12 12 12Z" fill="url(#paint_wink)"/>
            <circle cx="29" cy="14" r="3" fill="url(#paint_wink)"/>
            <defs>
              <linearGradient id="paint_wink" x1="10" y1="12" x2="29" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4F46E5"/>
                <stop offset="1" stopColor="#9333EA"/>
              </linearGradient>
            </defs>
          </svg>
          Toolaze.
        </Link>
      </nav>

      {/* Main Content */}
      <main className="bg-white py-24 px-6 border-t border-indigo-50/50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Privacy Policy</h1>
          
          <p className="text-slate-500 mb-12 text-base leading-relaxed">
            <strong className="text-slate-900">Last Updated:</strong> January 14, 2026
          </p>

          <div className="text-slate-600 space-y-8 leading-relaxed text-base">
            <p>
              At <strong className="text-slate-900">Toolaze</strong> (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), accessible from https://toolaze.com, our main priority is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Toolaze and how we use it.
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">1. Core Privacy Promise: Local Processing</h2>
              <p>
                We differentiate ourselves by prioritizing your privacy. <strong className="text-slate-900">We do not upload your images or videos to our servers.</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-slate-600">
                <li>All file processing happens locally within your web browser.</li>
                <li>Your files never leave your device.</li>
                <li>We cannot view, copy, or sell your content.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">2. Information We Collect</h2>
              <p>
                We do not collect your files. We may collect anonymous non-personal information to improve our service:
              </p>

              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">A. Log Files</h3>
                  <p>
                    Toolaze follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected includes internet protocol (IP) addresses, browser type, date and time stamp, and referring/exit pages. These are not linked to any information that is personally identifiable.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">B. Cookies</h3>
                  <p>
                    Toolaze uses &quot;cookies&quot; solely to store information about visitors&apos; preferences (e.g., dark mode settings) and to optimize the user experience.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">3. Analytics</h2>
              <p>
                We use <strong className="text-slate-900">Google Analytics</strong> to understand how our website is being used in order to improve user experience (e.g., which tools are most popular). All user data collected is <strong className="text-slate-900">anonymous</strong> and aggregated. We do not use this data for advertising profiling.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">4. GDPR & CCPA Rights</h2>
              <p>
                We respect your data rights. Since we do not store personal data or files, we do not &quot;sell&quot; your data. You have the right to request information about our data practices at any time.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">5. Contact Us</h2>
              <p>
                If you have additional questions, do not hesitate to contact us at <a href="mailto:support@toolaze.com" className="text-indigo-600 hover:text-purple-600 underline font-medium">support@toolaze.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white pt-20 pb-10 px-6 text-center border-t border-indigo-50">
        <div className="mb-12">
          <div className="text-2xl mb-2 text-yellow-400 tracking-widest">⭐⭐⭐⭐⭐</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">4.9/5 from 10k+ Creators</div>
        </div>
        <div className="flex flex-wrap justify-center gap-6 mb-12 text-sm font-bold text-indigo-600">
          <Link href="/" className="hover:text-purple-600 transition-colors">Home</Link>
          <Link href="/privacy" className="hover:text-purple-600 transition-colors">Privacy Policy</Link>
          <a href="mailto:support@toolaze.com" className="hover:text-purple-600 transition-colors">Contact</a>
        </div>
        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.3em]">© 2026 Toolaze Lab.</p>
      </footer>
    </div>
  );
}
