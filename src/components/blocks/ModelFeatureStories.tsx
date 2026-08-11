type FeatureStoryMedia = {
  type: 'image' | 'video'
  src: string
  alt: string
  poster?: string
  duration?: string
}

type FeatureStoryTimelineBeat = {
  title: string
  time: string
  description: string
}

type FeatureStory = {
  title: string
  paragraphs: string[]
  media: FeatureStoryMedia
  timelineTitle?: string
  timeline?: FeatureStoryTimelineBeat[]
}

type ModelFeatureStoriesProps = {
  title?: string
  description?: string
  items?: FeatureStory[]
  bgClass?: string
}

export default function ModelFeatureStories({
  title,
  description,
  items = [],
  bgClass = 'bg-white',
}: ModelFeatureStoriesProps) {
  if (!title || items.length === 0) return null

  return (
    <section className={`${bgClass} px-6 py-20 md:py-28`}>
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold leading-tight text-slate-950 md:text-4xl">{title}</h2>
          {description && (
            <p className="mx-auto mt-5 max-w-5xl text-base leading-7 text-slate-600 md:text-lg">{description}</p>
          )}
        </div>

        <div className="mt-16 space-y-20 md:mt-20 md:space-y-28">
          {items.map((item, index) => {
            const textOrder = index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'
            const mediaOrder = index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'

            return (
              <article className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16" key={item.title}>
                <div className={textOrder}>
                  <h3 className="text-2xl font-extrabold leading-tight text-slate-950 md:text-3xl">{item.title}</h3>
                  <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
                    {item.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>

                </div>

                <figure className={`${mediaOrder} overflow-hidden rounded-[2rem] border border-indigo-100 bg-indigo-50/70 p-3 shadow-xl shadow-indigo-100/50`}>
                  <div className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-[1.4rem] bg-white md:min-h-[420px]">
                    {item.media.type === 'video' ? (
                      <video
                        className="h-full max-h-[620px] w-full object-contain"
                        controls
                        playsInline
                        poster={item.media.poster}
                        preload="none"
                        aria-label={item.media.alt}
                      >
                        <source src={item.media.src} />
                      </video>
                    ) : (
                      <img
                        className="h-full max-h-[620px] w-full object-contain"
                        src={item.media.src}
                        alt={item.media.alt}
                        loading="lazy"
                        width="820"
                        height="1000"
                      />
                    )}
                  </div>
                </figure>

                {item.timeline && item.timeline.length > 0 && (
                  <div className="rounded-3xl border border-indigo-100 bg-indigo-50/70 p-6 lg:order-3 lg:col-span-2 md:p-8">
                    {item.timelineTitle && <h4 className="text-xl font-extrabold text-slate-950">{item.timelineTitle}</h4>}
                    <ol className="mt-6 grid gap-6 md:grid-cols-4">
                      {item.timeline.map((beat) => (
                        <li className="border-l-2 border-indigo-200 pl-4" key={`${beat.title}-${beat.time}`}>
                          <h5 className="font-bold text-slate-900">{beat.title}</h5>
                          <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-indigo-600">{beat.time}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{beat.description}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
