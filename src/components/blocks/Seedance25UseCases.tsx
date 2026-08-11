type UseCase = {
  title: string
  desc: string
  bestFor?: string
  direction?: string
}

type Seedance25UseCasesProps = {
  title?: string
  subtitle?: string
  items?: UseCase[]
  bgClass?: string
}

export default function Seedance25UseCases({
  title,
  subtitle,
  items = [],
  bgClass = 'bg-white',
}: Seedance25UseCasesProps) {
  if (!title || items.length === 0) return null

  return (
    <section className={`${bgClass} px-6 py-20 md:py-28`}>
      <div className="mx-auto max-w-6xl">
        <div className="max-w-6xl">
          <h2 className="text-3xl font-extrabold leading-tight text-slate-950 md:text-4xl">{title}</h2>
          {subtitle && <p className="mt-5 max-w-5xl text-base leading-7 text-slate-600 md:text-lg">{subtitle}</p>}
        </div>

        <ol className="mt-14 grid border-l border-t border-indigo-100 sm:grid-cols-2">
          {items.map((item) => (
            <li className="border-b border-r border-indigo-100 p-7 md:p-9" key={item.title}>
              <div>
                  <h3 className="text-xl font-extrabold text-slate-950 md:text-2xl">{item.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{item.desc}</p>
                  {(item.bestFor || item.direction) && (
                    <dl className="mt-5 grid gap-4 rounded-2xl bg-indigo-50/70 p-4 text-sm sm:grid-cols-2">
                      {item.bestFor && (
                        <div>
                          <dt className="font-bold text-slate-900">Best for</dt>
                          <dd className="mt-1 leading-5 text-slate-600">{item.bestFor}</dd>
                        </div>
                      )}
                      {item.direction && (
                        <div>
                          <dt className="font-bold text-slate-900">Direct with</dt>
                          <dd className="mt-1 leading-5 text-slate-600">{item.direction}</dd>
                        </div>
                      )}
                    </dl>
                  )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
