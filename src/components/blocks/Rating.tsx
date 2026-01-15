export default function Rating() {
  return (
    <section className="py-24 px-6 bg-white border-t border-indigo-50/50">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-1">
            <span className="text-4xl text-yellow-400">★</span>
            <span className="text-4xl text-yellow-400">★</span>
            <span className="text-4xl text-yellow-400">★</span>
            <span className="text-4xl text-yellow-400">★</span>
            <span className="text-4xl text-yellow-400">★</span>
          </div>
          <div className="text-sm font-bold text-slate-600 uppercase tracking-widest">4.9/5 FROM 10K+ CREATORS</div>
          <p className="text-base text-slate-500 max-w-2xl mx-auto mt-4 leading-relaxed">
            Join thousands of satisfied users who trust Toolaze for fast, secure, and free image compression. No registration required, 100% private processing.
          </p>
        </div>
      </div>
    </section>
  )
}
