'use client'

interface VideoDurationSliderProps {
  options: readonly number[]
  value: number
  onChange: (value: number) => void
  ariaLabel: string
}

export default function VideoDurationSlider({
  options,
  value,
  onChange,
  ariaLabel,
}: VideoDurationSliderProps) {
  const selectedIndex = Math.max(0, options.indexOf(value))
  const maxIndex = Math.max(options.length - 1, 0)
  const progress = maxIndex > 0 ? (selectedIndex / maxIndex) * 100 : 0

  return (
    <div data-video-duration-slider className="rounded-lg bg-white px-3 py-2">
      <div className="relative h-6">
        <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#E0E7FF]" />
        <div
          data-video-duration-slider-fill
          className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#4F46E5]"
          style={{ width: `${progress}%` }}
        />
        <input
          data-video-duration-range
          type="range"
          min={0}
          max={maxIndex}
          step={1}
          value={selectedIndex}
          onChange={(event) => onChange(options[Number(event.target.value)])}
          className="absolute inset-x-[-2px] top-0 h-6 w-[calc(100%+4px)] cursor-pointer opacity-0"
          aria-label={ariaLabel}
          aria-valuetext={`${value}s`}
        />
        <div
          data-video-duration-thumb
          className="pointer-events-none absolute top-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#4F46E5] shadow-md shadow-[#4F46E5]/20 ring-2 ring-white"
          style={{ left: `${progress}%` }}
        >
          <span className="sr-only">{value}s</span>
        </div>
      </div>
    </div>
  )
}
