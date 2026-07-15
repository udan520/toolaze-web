import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund Policy - Toolaze',
  description: 'Toolaze Refund Policy for one-time credit purchases, unused credits, failed generation credit returns, and refund requests.',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://toolaze.com/refund-policy',
  },
}

export default function RefundPolicyPage() {
  return (
    <>
      <Navigation />

      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Refund Policy' },
      ]} />

      <main className="bg-white py-24 px-6 border-t border-indigo-50/50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-[40px] font-extrabold text-slate-900 mb-4">Refund Policy</h1>

          <p className="text-slate-500 mb-12 text-base leading-relaxed">
            <strong className="text-slate-900">Last updated:</strong> July 15, 2026
          </p>

          <div className="text-slate-600 space-y-8 leading-relaxed text-base">
            <p>
              Toolaze sells credits as one-time purchases. This policy explains when unused credits can be refunded and how failed generation attempts are handled.
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">1. Unused credits</h2>
              <p>
                You may request a refund for unused credits that remain in your Toolaze account. We calculate the refundable amount based on the unused credits from the relevant purchase, less any non-refundable taxes, processor fees, chargeback costs, discounts, or promotional value when applicable.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">2. Used credits</h2>
              <p>
                Used credits are not refundable once they have been spent on a delivered generation, completed AI edit, completed tool run, download, or other completed service. Promotional credits, bonus credits, and expired credits are not refundable unless required by law.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">3. Failed generation</h2>
              <p>
                If a generation fails and our system confirms that no usable output was delivered, the charged credits are returned to your account. This is a credit return, not a cash refund. If credits are not returned automatically, contact support with the generation time, account email, and any error message.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">4. Credit validity</h2>
              <p>
                Purchased credits are valid for 12 months from the purchase date. Expired credits cannot be refunded, transferred, or restored unless required by law.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">5. How to request a refund</h2>
              <p>
                Send your request to <a href="mailto:support@toolaze.com" className="text-indigo-600 hover:text-purple-600 underline font-medium">support@toolaze.com</a> from the email used for purchase. Include your order ID, account email, purchase date, and the reason for the request. Approved refunds are sent to the original payment method through Creem or the payment processor used at checkout.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">6. Abuse and exceptions</h2>
              <p>
                We may deny refund requests connected to fraud, policy violations, chargeback abuse, prohibited content, or attempts to use the service without paying. Nothing in this policy limits consumer rights that cannot be waived under applicable law.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
