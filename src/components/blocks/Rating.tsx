interface RatingProps {
  title?: string
  rating?: string
  description?: string
  bgClass?: string
}

export default function Rating({ title, rating, description, bgClass = 'bg-white' }: RatingProps) {
  const defaultRating = rating || '4.9/5 FROM 10K+ CREATORS'
  const defaultDescription = description || 'Join thousands of satisfied users who trust Toolaze for fast, secure, and free image compression. No registration required, 100% private processing.'
  const defaultTitle = title || 'Trusted by Thousands of Creators'

  return (
    <section className={`${bgClass} py-24 px-6 border-t border-indigo-50/50`}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-center text-slate-900 mb-12">{defaultTitle}</h2>
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-1">
            <span className="text-4xl text-yellow-400">★</span>
            <span className="text-4xl text-yellow-400">★</span>
            <span className="text-4xl text-yellow-400">★</span>
            <span className="text-4xl text-yellow-400">★</span>
            <span className="text-4xl text-yellow-400">★</span>
          </div>
          <div className="text-sm font-bold text-slate-600 uppercase tracking-widest">{defaultRating}</div>
          <p className="text-base text-slate-500 max-w-2xl mx-auto mt-4 leading-relaxed">
            {defaultDescription}
          </p>
        </div>
      </div>
    </section>
  )
}
