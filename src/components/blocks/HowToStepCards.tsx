export type HowToStepCardData = {
  title: string
  description?: string
  media: {
    src: string
    alt: string
    width?: number
    height?: number
  }
}

export default function HowToStepCards({
  steps,
  stepLabel = 'Step',
}: {
  steps: HowToStepCardData[]
  stepLabel?: string
}) {
  if (steps.length === 0) return null

  const columns = steps.length >= 5
    ? 'md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5'
    : 'md:grid-cols-2 lg:grid-cols-3'

  return (
    <ol className={`grid grid-cols-1 gap-6 ${columns}`}>
      {steps.map((step, index) => (
        <li
          key={`${step.title}-${index}`}
          className="overflow-hidden rounded-[1.75rem] border border-indigo-100 bg-white shadow-sm shadow-indigo-100/60"
        >
          <div className="border-b border-indigo-100 bg-[#F8FAFF] p-3">
            <img
              src={step.media.src}
              alt={step.media.alt}
              width={step.media.width || 1200}
              height={step.media.height || 750}
              className="aspect-[8/5] w-full rounded-[1.25rem] bg-white object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="p-7 text-left">
            <h3 className="text-2xl font-extrabold leading-tight tracking-tight text-slate-950">
              {step.title}
            </h3>
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
              {stepLabel} {index + 1}
            </p>
            {step.description ? (
              <p className="mt-5 text-base leading-8 text-slate-600">
                {step.description}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  )
}
