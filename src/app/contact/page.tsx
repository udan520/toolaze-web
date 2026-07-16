import Link from 'next/link'
import type { Metadata } from 'next'
import Breadcrumb from '@/components/Breadcrumb'
import Footer from '@/components/Footer'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'Contact Toolaze Support',
  description: 'Contact Toolaze for support, refunds, account help, billing questions, and abuse reports.',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://toolaze.com/contact',
  },
}

export default function ContactPage() {
  return (
    <>
      <Navigation />

      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Contact' },
      ]} />

      <main className="bg-[#F8FAFF] px-6 py-20">
        <section className="mx-auto max-w-3xl rounded-[2rem] border border-indigo-100 bg-white p-8 shadow-sm shadow-indigo-50 md:p-10">
          <p className="mb-4 text-sm font-extrabold tracking-[0.14em] text-indigo-600">Support</p>
          <h1 className="mb-5 text-[36px] font-extrabold leading-tight text-slate-900">Contact Toolaze</h1>
          <p className="mb-8 text-base leading-7 text-slate-600">
            For product support, credit questions, billing issues, refund requests, or abuse reports, contact us at{' '}
            <a href="mailto:support@toolaze.com" className="font-bold text-indigo-600 underline">support@toolaze.com</a>.
            We aim to respond within 3 business days.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-indigo-50/70 p-5">
              <h2 className="mb-2 text-base font-extrabold text-slate-900">Refund requests</h2>
              <p className="text-sm leading-6 text-slate-600">
                Include your order ID, account email, purchase date, and the reason for the request. See our{' '}
                <Link href="/refund-policy" className="font-bold text-indigo-600 underline">Refund Policy</Link>.
              </p>
            </div>
            <div className="rounded-2xl bg-indigo-50/70 p-5">
              <h2 className="mb-2 text-base font-extrabold text-slate-900">Abuse reports</h2>
              <p className="text-sm leading-6 text-slate-600">
                Report suspected policy violations, impersonation, unsafe content, copyright misuse, or other abuse.
              </p>
            </div>
            <div className="rounded-2xl bg-indigo-50/70 p-5">
              <h2 className="mb-2 text-base font-extrabold text-slate-900">Product website</h2>
              <p className="text-sm leading-6 text-slate-600">https://toolaze.com</p>
            </div>
            <div className="rounded-2xl bg-indigo-50/70 p-5">
              <h2 className="mb-2 text-base font-extrabold text-slate-900">Operator</h2>
              <p className="text-sm leading-6 text-slate-600">Toolaze Lab</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
