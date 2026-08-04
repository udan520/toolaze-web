import type { HTMLAttributes } from 'react'

export const WATERMARK_REMOVER_SOURCE_IMAGE =
  'https://assets.toolaze.com/home-advanced-ai/watermark-remover.jpg'

export const WATERMARK_REMOVER_DEMO_IMAGE =
  'https://assets.toolaze.com/home-advanced-ai/watermark-remover-demo-before-after.webp'

export type WatermarkRemoverDemoComparisonProps = HTMLAttributes<HTMLDivElement> & {
  imageUrl?: string
  alt?: string
  beforeLabel?: string
  afterLabel?: string
  watermarkText?: string
}

export default function WatermarkRemoverDemoComparison({
  imageUrl = WATERMARK_REMOVER_SOURCE_IMAGE,
  alt = 'Watermark remover before and after demo',
  beforeLabel = 'Before',
  afterLabel = 'After',
  watermarkText = 'Toolaze Sample',
  className = '',
  ...props
}: WatermarkRemoverDemoComparisonProps) {
  return (
    <div
      data-watermark-demo-comparison
      className={`grid h-full w-full grid-cols-2 gap-2 overflow-hidden rounded-md bg-white p-2 ring-1 ring-slate-200/70 ${className}`}
      {...props}
    >
      <div className="relative min-h-0 overflow-hidden rounded-md bg-slate-100">
        <img src={imageUrl} alt={`${alt} - ${beforeLabel}`} className="h-full w-full object-cover" />
        <div aria-hidden="true" className="absolute inset-0 bg-slate-950/10" />
        <div aria-hidden="true" className="absolute -inset-8 grid grid-cols-4 content-around gap-3">
          {Array.from({ length: 28 }).map((_, index) => (
            <span
              key={index}
              className="-rotate-[24deg] rounded-full border border-white/45 bg-white/28 px-2 py-1 text-center text-[10px] font-extrabold uppercase tracking-wide text-white shadow-sm backdrop-blur-[1px]"
            >
              {watermarkText}
            </span>
          ))}
        </div>
        <div aria-hidden="true" className="absolute inset-x-6 top-1/2 -translate-y-1/2 -rotate-12 rounded-2xl border border-white/45 bg-white/25 px-4 py-3 text-center text-2xl font-black uppercase tracking-[0.18em] text-white shadow-lg backdrop-blur-[2px] md:text-3xl">
          Watermark
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1 text-xs font-extrabold text-slate-700 shadow-sm">
          {beforeLabel}
        </span>
      </div>
      <div className="relative min-h-0 overflow-hidden rounded-md bg-slate-100">
        <img src={imageUrl} alt={`${alt} - ${afterLabel}`} className="h-full w-full object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1 text-xs font-extrabold text-emerald-700 shadow-sm">
          {afterLabel}
        </span>
      </div>
    </div>
  )
}
