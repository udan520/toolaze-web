type HowToMedia = {
  type: 'image' | 'video'
  src: string
  poster?: string
  alt: string
}

type HowToStep = {
  title: string
  desc: string
  media: HowToMedia
}

type Seedance25HowToProps = {
  title?: string
  subtitle?: string
  steps?: HowToStep[]
  bgClass?: string
}

export default function Seedance25HowTo({
  title,
  subtitle,
  steps = [],
  bgClass = 'bg-white',
}: Seedance25HowToProps) {
  if (!title || steps.length === 0) return null

  return (
    <section className={`${bgClass} px-6 py-20 md:py-28`}>
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-extrabold leading-tight text-slate-950 md:text-4xl">{title}</h2>
          {subtitle && (
            <p className="mx-auto mt-5 max-w-5xl text-base leading-7 text-slate-600 md:text-lg">{subtitle}</p>
          )}
        </div>

        <ol className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li className="flex min-w-0 flex-col overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-sm" key={step.title}>
              <div className="aspect-[4/3] overflow-hidden border-b border-indigo-100 bg-[#F8FAFF] p-3">
                {step.media.type === 'video' ? (
                  <video
                    className="h-full w-full rounded-2xl bg-indigo-50 object-contain"
                    controls
                    playsInline
                    poster={step.media.poster}
                    preload="none"
                    aria-label={step.media.alt}
                  >
                    <source src={step.media.src} />
                  </video>
                ) : (
                  <img
                    className="h-full w-full rounded-2xl border border-indigo-100 bg-white object-contain"
                    src={step.media.src}
                    alt={step.media.alt}
                    loading="lazy"
                    width="820"
                    height="1000"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-extrabold text-slate-950">{step.title}</h3>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">Step {index + 1}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
