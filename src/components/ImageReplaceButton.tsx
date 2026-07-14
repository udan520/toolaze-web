'use client'

import ReplaceIcon from './icons/ReplaceIcon'

interface ImageReplaceButtonProps {
  onReplace: () => void
  label?: string
  disabled?: boolean
}

export default function ImageReplaceButton({
  onReplace,
  label = 'Replace',
  disabled = false,
}: ImageReplaceButtonProps) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    onReplace()
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        aria-label={label}
        title={label}
        className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/45 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 disabled:cursor-not-allowed disabled:opacity-0 max-md:hidden"
      >
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-2 text-xs font-semibold text-indigo-600 shadow-lg">
          <ReplaceIcon size={15} />
          {label}
        </span>
      </button>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        aria-label={label}
        title={label}
        className="absolute bottom-2 left-2 z-10 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/70 bg-slate-950/70 text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-50 md:hidden"
      >
        <ReplaceIcon size={17} />
      </button>
    </>
  )
}
