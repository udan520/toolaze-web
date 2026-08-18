export type HowToScreenshotData = {
  src: string
  alt: string
  caption?: string
  width?: number
  height?: number
}

export default function HowToScreenshot({ screenshot }: { screenshot?: HowToScreenshotData }) {
  if (!screenshot?.src || !screenshot.alt) return null

  return (
    <figure className="mx-auto mb-14 mt-10 max-w-5xl">
      <div className="overflow-hidden rounded-[1.75rem] border border-indigo-100 bg-indigo-50 p-2 shadow-lg shadow-indigo-100/50 md:p-3">
        <img
          src={screenshot.src}
          alt={screenshot.alt}
          width={screenshot.width || 1600}
          height={screenshot.height || 900}
          className="aspect-[16/9] w-full rounded-[1.25rem] bg-white object-contain"
          loading="lazy"
          decoding="async"
        />
      </div>
      {screenshot.caption && (
        <figcaption className="mx-auto mt-4 max-w-3xl text-center text-sm leading-6 text-slate-500">
          {screenshot.caption}
        </figcaption>
      )}
    </figure>
  )
}
