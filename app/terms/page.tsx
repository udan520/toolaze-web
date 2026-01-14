import Link from 'next/link';

export default function TermsPage() {
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
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Terms of Service</h1>
          
          <p className="text-slate-500 mb-12 text-base leading-relaxed">
            <strong className="text-slate-900">Last Updated:</strong> January 14, 2026
          </p>

          <div className="text-slate-600 space-y-8 leading-relaxed text-base">
            <p>
              Welcome to <strong className="text-slate-900">Toolaze</strong>! By accessing or using our website (https://toolaze.com), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you disagree with any part of the terms, you may not access the Service.
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">1. Description of Service</h2>
              <p>
                Toolaze provides free, web-based AI tools for image and video processing (e.g., compression, conversion, editing).
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-slate-600">
                <li><strong className="text-slate-900">Local Processing:</strong> Our distinct feature is that we process files locally in your browser using WebAssembly technology. We do not upload or store your files on our servers.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">2. Use of Service</h2>
              <ul className="list-disc list-inside space-y-2 ml-4 text-slate-600">
                <li><strong className="text-slate-900">License:</strong> We grant you a limited, non-exclusive, non-transferable license to use our tools for personal or commercial purposes, provided you comply with these Terms.</li>
                <li><strong className="text-slate-900">No Registration:</strong> You do not need to create an account to use our current tools.</li>
                <li><strong className="text-slate-900">Prohibited Acts:</strong> You agree not to:
                  <ol className="list-decimal list-inside space-y-1 ml-6 mt-2">
                    <li>Reverse engineer, decompile, or attempt to extract the source code of the Service.</li>
                    <li>Use the Service to process illegal content.</li>
                    <li>Use automated scripts (bots) that affect the stability of our website.</li>
                  </ol>
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">3. User Content & Data</h2>
              <ul className="list-disc list-inside space-y-2 ml-4 text-slate-600">
                <li><strong className="text-slate-900">Your Ownership:</strong> You retain all rights and ownership of the images or videos you process using Toolaze. We claim no intellectual property rights over your content.</li>
                <li><strong className="text-slate-900">No Liability for Data Loss:</strong> Since we do not store your files, we cannot recover them for you. You are solely responsible for backing up your original data. If your browser crashes or the page refreshes during processing, any unsaved progress may be lost, and Toolaze is not liable for such loss.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">4. Intellectual Property</h2>
              <p>
                The Service itself (excluding your content), including its original content, features, code, and functionality, is and will remain the exclusive property of Toolaze and its licensors. Our trademarks (including the &quot;Toolaze&quot; name and Logo) may not be used without prior written consent.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">5. Disclaimer of Warranties (&quot;AS IS&quot;)</h2>
              <p>
                The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. Toolaze makes no representations or warranties of any kind, express or implied, regarding the operation of the Service or the accuracy of the AI processing results.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-slate-600 mt-4">
                <li>We do not guarantee that the image quality after compression will perfectly meet your expectations, as AI algorithms may vary based on file types.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">6. Limitation of Liability</h2>
              <p>
                In no event shall Toolaze be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, or goodwill, resulting from your use of the Service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">7. Changes to Terms</h2>
              <p>
                We reserve the right to modify or replace these Terms at any time. By continuing to access our Service after those revisions become effective, you agree to be bound by the revised terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">8. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at: <strong className="text-slate-900"><a href="mailto:support@toolaze.com" className="text-indigo-600 hover:text-purple-600 underline font-medium">support@toolaze.com</a></strong>
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Navigation Links */}
          <nav className="mb-8" aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm">
              <li><Link href="/" className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">Home</Link></li>
              <li><Link href="/tools" className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">All Tools</Link></li>
              <li><Link href="/about" className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">About Us</Link></li>
              <li><Link href="/privacy" className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">Terms of Service</Link></li>
              <li><a href="mailto:support@toolaze.com" className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">Contact</a></li>
            </ul>
          </nav>

          {/* Copyright */}
          <div className="text-center pt-6 border-t border-slate-700">
            <p className="text-xs text-slate-400 mb-2">
              © <span>{new Date().getFullYear()}</span> Toolaze Lab. All rights reserved.
            </p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">
              Free Online Tools • No Registration Required • 100% Private
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
