import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Toolaze',
  description: 'Toolaze Privacy Policy for AI generation, uploads, credits, payments, analytics, and third-party providers.',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://toolaze.com/privacy',
  },
}

export default function PrivacyPage() {
  return (
    <>
      <Navigation />

      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Privacy Policy' },
      ]} />

      <main className="bg-white py-24 px-6 border-t border-indigo-50/50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-[40px] font-extrabold text-slate-900 mb-4">Privacy Policy</h1>

          <p className="text-slate-500 mb-12 text-base leading-relaxed">
            <strong className="text-slate-900">Last updated:</strong> July 15, 2026
          </p>

          <div className="text-slate-600 space-y-8 leading-relaxed text-base">
            <p>
              Toolaze provides AI generation and creative tools at https://toolaze.com. This Privacy Policy explains what we collect, how AI generation works, and how we handle uploads, prompts, generated outputs, credits, and payments.
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">1. Information we collect</h2>
              <p>
                We collect the information needed to run Toolaze, protect the service, and support purchases:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-slate-600">
                <li>Account and contact details, such as your email address and authentication status.</li>
                <li>AI generation inputs, including prompts, negative prompts, model settings, uploaded images, uploaded videos, reference media, and generated outputs.</li>
                <li>Usage records, including credit balance changes, generation status, failed generation events, downloads, and support requests.</li>
                <li>Payment records handled by Creem or other payment processors, such as checkout status, order IDs, refund status, tax information, and billing metadata. We do not store full card numbers.</li>
                <li>Technical data, including IP address, device type, browser type, referral pages, cookies, logs, and analytics events.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">2. AI generation and uploaded content</h2>
              <p>
                When you use AI generation or an AI editing tool, Toolaze may send prompts, uploaded images, uploaded videos, reference files, model settings, and generated outputs to third-party AI providers, moderation services, storage providers, and infrastructure vendors. These providers process the data so we can create, transform, moderate, store, and deliver the requested result.
              </p>
              <p>
                We may store generated assets, upload references, prompts, and related metadata when needed for history, downloads, abuse prevention, billing, debugging, refunds, and customer support. You should avoid uploading confidential, regulated, or highly sensitive content unless you are comfortable with this processing.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">3. How we use information</h2>
              <ul className="list-disc list-inside space-y-2 ml-4 text-slate-600">
                <li>Provide AI generation, editing, compression, conversion, history, download, and account features.</li>
                <li>Track credits, return credits for failed generation attempts, process refunds, and resolve billing questions.</li>
                <li>Moderate prompts and uploaded content for safety, fraud, NSFW content, illegal content, and abuse.</li>
                <li>Improve reliability, diagnose failures, measure product usage, and protect Toolaze from automated misuse.</li>
                <li>Comply with law, payment processor rules, and valid legal requests.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">4. Sharing and service providers</h2>
              <p>
                We share information only with vendors that help us operate Toolaze, including AI model providers, content moderation providers, hosting, storage, CDN, analytics, email, authentication, payment, and fraud prevention services. Creem processes payments and refunds according to its own terms and privacy practices.
              </p>
              <p>
                We may also disclose information if required by law, to protect users and the service, or to investigate violations of our Terms of Service or Acceptable Use Policy.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">5. Cookies, analytics, and retention</h2>
              <p>
                Toolaze uses cookies and similar technologies for authentication, preferences, analytics, security, and checkout flows. We keep account, payment, usage, and content records for as long as needed to provide the service, comply with legal obligations, resolve disputes, prevent abuse, and support refunds.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">6. Your choices and rights</h2>
              <p>
                Depending on your location, you may have rights to access, correct, delete, or export certain personal information. You can contact us to ask about your data, account, generation history, or payment records. Some records may need to be kept for security, tax, accounting, legal, or fraud prevention reasons.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">7. Children</h2>
              <p>
                Toolaze is not intended for children under 13. Users must also follow any higher age requirement that applies in their country or to the AI model they use.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">8. Contact us</h2>
              <p>
                Questions about this Privacy Policy can be sent to <a href="mailto:support@toolaze.com" className="text-indigo-600 hover:text-purple-600 underline font-medium">support@toolaze.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
