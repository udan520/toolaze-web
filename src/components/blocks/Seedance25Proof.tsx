type ProofMetric = {
  value: string
  label: string
  note?: string
}

type TimelineBeat = {
  time: string
  title: string
  description: string
}

type ProofMedia = {
  src: string
  poster: string
  title: string
  description: string
  duration?: string
}

type Seedance25ProofProps = {
  title?: string
  description?: string
  metrics?: ProofMetric[]
  video?: ProofMedia
  timelineTitle?: string
  timeline?: TimelineBeat[]
  bgClass?: string
}

export default function Seedance25Proof({
  title,
  description,
  metrics = [],
  video,
  timelineTitle,
  timeline = [],
  bgClass = 'bg-white',
}: Seedance25ProofProps) {
  if (!title || !video) return null

  return (
    <section className={`${bgClass} px-6 py-20 md:py-28`}>
      <div className="mx-auto max-w-6xl">
        <div>
          <h2 className="text-3xl font-extrabold leading-tight text-slate-950 md:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mt-5 max-w-5xl text-base leading-7 text-slate-600 md:text-lg">
              {description}
            </p>
          )}
        </div>

        <div className="mt-12 overflow-hidden rounded-[2rem] border border-indigo-100 bg-indigo-50 shadow-2xl shadow-indigo-100/70">
          <div className="relative aspect-video">
            <video
              className="h-full w-full object-contain"
              controls
              playsInline
              poster={video.poster}
              preload="metadata"
              aria-label={video.title}
            >
              <source src={video.src} />
            </video>
            {video.duration && (
              <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm shadow-indigo-200">
                {video.duration}
              </span>
            )}
          </div>
          <div className="grid gap-2 border-t border-indigo-100 bg-white px-6 py-5 text-slate-900 md:grid-cols-[0.75fr_1.25fr] md:px-8">
            <h3 className="font-bold">{video.title}</h3>
            <p className="text-sm leading-6 text-slate-600">{video.description}</p>
          </div>
        </div>

        {metrics.length > 0 && (
          <dl className="mt-6 grid overflow-hidden rounded-3xl border border-indigo-100 bg-white sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric, index) => (
              <div
                className={`p-6 ${index > 0 ? 'border-t border-indigo-100' : ''} ${index % 2 === 1 ? 'sm:border-l' : ''} ${index < 2 ? 'sm:border-t-0' : ''} ${index >= 2 ? 'lg:border-t-0' : ''} ${index === 2 ? 'lg:border-l' : ''}`}
                key={`${metric.value}-${metric.label}`}
              >
                <dd className="text-3xl font-extrabold tracking-tight text-indigo-600">{metric.value}</dd>
                <dt className="mt-2 font-bold text-slate-900">{metric.label}</dt>
                {metric.note && <p className="mt-1 text-sm leading-5 text-slate-500">{metric.note}</p>}
              </div>
            ))}
          </dl>
        )}

        {timeline.length > 0 && (
          <div className="mt-16 rounded-[2rem] border border-indigo-100 bg-indigo-50/70 px-6 py-8 text-slate-900 md:px-10 md:py-10">
            {timelineTitle && <h3 className="text-2xl font-extrabold">{timelineTitle}</h3>}
            <ol className="mt-8 grid gap-8 md:grid-cols-4 md:gap-0">
              {timeline.map((beat, index) => (
                <li className="relative md:pr-8" key={`${beat.time}-${beat.title}`}>
                  {index < timeline.length - 1 && (
                    <span className="absolute left-4 top-4 hidden h-px w-[calc(100%-1rem)] bg-indigo-200 md:block" />
                  )}
                  <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 border-indigo-50 bg-indigo-600 text-[10px] font-bold text-white">
                    {index + 1}
                  </div>
                  <h4 className="mt-5 font-bold">{beat.title}</h4>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">{beat.time}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{beat.description}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  )
}
