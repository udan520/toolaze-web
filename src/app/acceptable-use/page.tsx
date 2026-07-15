import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Acceptable Use Policy - Toolaze',
  description: 'Toolaze Acceptable Use Policy for AI generation, uploaded media, NSFW restrictions, identity safety, copyright, and illegal content.',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://toolaze.com/acceptable-use',
  },
}

export default function AcceptableUsePage() {
  return (
    <>
      <Navigation />

      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Acceptable Use Policy' },
      ]} />

      <main className="bg-white py-24 px-6 border-t border-indigo-50/50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-[40px] font-extrabold text-slate-900 mb-4">Acceptable Use Policy</h1>

          <p className="text-slate-500 mb-12 text-base leading-relaxed">
            <strong className="text-slate-900">Last updated:</strong> July 15, 2026
          </p>

          <div className="text-slate-600 space-y-8 leading-relaxed text-base">
            <p>
              This policy applies to prompts, uploaded images, uploaded videos, reference media, generated outputs, downloads, and any other use of Toolaze. We may moderate prompts and uploads before generation and may block or remove content that violates this policy.
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">1. Sexual and NSFW content</h2>
              <p>
                Do not use Toolaze to create, upload, edit, request, or distribute NSFW content, sexual content, nudity, fetish content, sexualized imagery, non-consensual intimate imagery, or sexual content involving minors. Any sexual content involving minors is strictly prohibited and may be reported.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">2. Illegal and harmful activity</h2>
              <p>
                Do not use Toolaze for illegal content, instructions for wrongdoing, fraud, scams, malware, weapon construction, evading law enforcement, trafficking, self-harm encouragement, or other activity that could cause real-world harm.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">3. Identity, face, and impersonation safety</h2>
              <p>
                Do not create deceptive deepfake content, impersonation, fake endorsements, identity documents, misleading face swaps, non-consensual face edits, or content that suggests a real person said or did something they did not say or do.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">4. Harassment and hate</h2>
              <p>
                Do not use Toolaze to harass, threaten, bully, shame, exploit, or dehumanize people. Content that promotes hate or violence against protected groups is prohibited.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">5. Copyright and other rights</h2>
              <p>
                You must not submit or generate content that infringes copyright, trademark, publicity rights, privacy rights, or contractual rights. You must have the rights needed for prompts, uploaded media, reference images, logos, product images, music, characters, and brand assets that you submit.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">6. Platform abuse</h2>
              <p>
                Do not scrape, overload, bypass safety filters, automate abuse, resell account access, share accounts for misuse, attempt to extract model or system prompts, or interfere with Toolaze infrastructure.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">7. Enforcement</h2>
              <p>
                We may refuse prompts, remove outputs, return or withhold credits where appropriate, suspend accounts, deny refunds for policy abuse, or report serious violations. Questions can be sent to <a href="mailto:support@toolaze.com" className="text-indigo-600 hover:text-purple-600 underline font-medium">support@toolaze.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
