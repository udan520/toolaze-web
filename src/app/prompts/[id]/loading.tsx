import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function PromptDetailLoading() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#F8FAFF]">
        <div className="mx-auto max-w-6xl px-6 pb-4 pt-10">
          <div className="h-5 w-44 animate-pulse rounded-full bg-indigo-100" />
        </div>
        <section className="bg-white px-6 py-12">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div className="aspect-[4/3] w-full animate-pulse bg-indigo-50" />
            <article className="border border-indigo-100 bg-[#F8FAFF] p-6 md:p-8">
              <div className="mb-5 flex gap-2">
                <div className="h-7 w-28 animate-pulse rounded-full bg-slate-200" />
                <div className="h-7 w-32 animate-pulse rounded-full bg-white" />
              </div>
              <div className="mb-6 h-10 w-4/5 animate-pulse rounded-full bg-slate-200" />
              <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="rounded-2xl bg-white p-4">
                    <div className="mx-auto mb-2 h-10 w-10 animate-pulse rounded-full bg-indigo-50" />
                    <div className="mx-auto mb-2 h-5 w-14 animate-pulse rounded-full bg-slate-100" />
                    <div className="mx-auto h-3 w-16 animate-pulse rounded-full bg-slate-100" />
                  </div>
                ))}
              </div>
              <div className="rounded-[1.5rem] border border-indigo-100 bg-white p-5">
                <div className="mb-4 h-4 w-20 animate-pulse rounded-full bg-slate-100" />
                <div className="space-y-3">
                  <div className="h-3 w-full animate-pulse rounded-full bg-slate-100" />
                  <div className="h-3 w-11/12 animate-pulse rounded-full bg-slate-100" />
                  <div className="h-3 w-4/5 animate-pulse rounded-full bg-slate-100" />
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
