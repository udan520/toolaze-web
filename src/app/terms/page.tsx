import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - Toolaze',
  description: 'Toolaze Terms of Service for AI generation, credits, one-time purchases, commercial use, refunds, and acceptable use.',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://toolaze.com/terms',
  },
}

export default function TermsPage() {
  return (
    <>
      <Navigation />

      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Terms of Service' },
      ]} />

      <main className="bg-white py-24 px-6 border-t border-indigo-50/50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-[40px] font-extrabold text-slate-900 mb-4">Terms of Service</h1>

          <p className="text-slate-500 mb-12 text-base leading-relaxed">
            <strong className="text-slate-900">Last updated:</strong> July 15, 2026
          </p>

          <div className="text-slate-600 space-y-8 leading-relaxed text-base">
            <p>
              Welcome to <strong className="text-slate-900">Toolaze</strong>. By using https://toolaze.com, you agree to these Terms of Service, our <Link href="/privacy" className="text-indigo-600 hover:text-purple-600 underline font-medium">Privacy Policy</Link>, our <Link href="/refund-policy" className="text-indigo-600 hover:text-purple-600 underline font-medium">Refund Policy</Link>, and our <Link href="/acceptable-use" className="text-indigo-600 hover:text-purple-600 underline font-medium">Acceptable Use Policy</Link>.
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">1. Service description</h2>
              <p>
                Toolaze provides AI generation, AI editing, image utilities, video utilities, prompt workflows, account features, generation history, and credit-based purchases. Some tools use third-party model providers and cloud infrastructure to process prompts, uploaded media, and generated outputs.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">2. Accounts, payments, and credits</h2>
              <ul className="list-disc list-inside space-y-2 ml-4 text-slate-600">
                <li>Credits are sold as one-time purchases, not subscriptions, unless a checkout page clearly says otherwise.</li>
                <li>Purchased credits are valid for 12 months from the purchase date.</li>
                <li>A failed generation returns the credits charged for that failed attempt when our system can confirm the failure.</li>
                <li>Payments, taxes, receipts, and refunds may be handled by Creem or another payment processor.</li>
                <li>You are responsible for keeping your account secure and for all activity under your account.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">3. User content and commercial use</h2>
              <p>
                You keep the rights you already have in prompts, uploaded images, uploaded videos, reference files, and other content you submit. Toolaze receives the rights needed to process, transmit, moderate, store, and display that content so we can provide the service.
              </p>
              <p>
                Commercial use is allowed for generated outputs, subject to these Terms, the Acceptable Use Policy, applicable law, and any third-party model or provider rules that apply to the generation. You are responsible for confirming that your inputs and outputs do not violate copyright, trademark, publicity, privacy, or other rights.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">4. Acceptable use</h2>
              <p>
                You may not use Toolaze to create, upload, request, or distribute illegal content, NSFW content, sexual content, sexual content involving minors, non-consensual intimate imagery, deceptive deepfakes, impersonation, hateful content, harassment, malware, or content that infringes copyright or other rights. More detail is available in our <Link href="/acceptable-use" className="text-indigo-600 hover:text-purple-600 underline font-medium">Acceptable Use Policy</Link>.
              </p>
              <p>
                We may block prompts, reject uploads, remove outputs, suspend access, or report activity when we believe the service is being misused.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">5. AI output limits</h2>
              <p>
                AI outputs can be inaccurate, unexpected, delayed, unavailable, similar to outputs generated for other users, or blocked by safety systems. Toolaze does not guarantee that a third-party model will produce a specific result, quality level, style, file type, or delivery time.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">6. Refunds</h2>
              <p>
                Refunds are available for unused credits according to our <Link href="/refund-policy" className="text-indigo-600 hover:text-purple-600 underline font-medium">Refund Policy</Link>. Used credits, delivered generations, completed tool runs, promotional credits, and expired credits are not refundable unless required by law.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">7. Intellectual property</h2>
              <p>
                Toolaze, including its website, software, design, branding, logos, and service features, belongs to Toolaze and its licensors. You may not copy, reverse engineer, scrape, overload, resell, or interfere with the service except as allowed by these Terms.
              </p>
              <p>
                Toolaze AI generation is powered by supported AI model providers, Toolaze integrations, and cloud infrastructure. Product names, trademarks, and model names belong to their respective owners and are used to identify supported model workflows available through Toolaze.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">8. Disclaimer and liability</h2>
              <p>
                Toolaze is provided "as is" and "as available." To the fullest extent allowed by law, Toolaze is not liable for indirect, incidental, special, consequential, punitive, or lost-profit damages arising from use of the service, AI outputs, payment issues, provider outages, or content decisions.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">9. Changes and contact</h2>
              <p>
                We may update these Terms from time to time. Continued use of Toolaze after an update means you accept the updated Terms. Questions can be sent to <a href="mailto:support@toolaze.com" className="text-indigo-600 hover:text-purple-600 underline font-medium">support@toolaze.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
