import { shouldRenderPaymentReviewSocialProofSection } from '@/lib/payment-review-visibility'

interface RatingProps {
  title?: string
  rating?: string
  description?: string
  bgClass?: string
}

export default function Rating({ title, rating, description, bgClass = 'bg-white' }: RatingProps) {
  if (!shouldRenderPaymentReviewSocialProofSection('rating')) return null

  const defaultRating = rating || ''
  const defaultDescription = description || ''
  const defaultTitle = title || 'User feedback'

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
          {defaultRating && <div className="text-sm font-bold text-slate-600 uppercase tracking-widest">{defaultRating}</div>}
          {defaultDescription && (
            <p className="text-base text-slate-500 max-w-2xl mx-auto mt-4 leading-relaxed">
              {defaultDescription}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
