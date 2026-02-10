interface CloseIconProps {
  size?: number
  className?: string
}

/**
 * 全站统一的关闭按钮图标
 */
export default function CloseIcon({ size = 20, className }: CloseIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 1024 1024"
      width={size}
      height={size}
      fill="currentColor"
      style={{ display: 'block', flexShrink: 0 }}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M300.8 240.469333l211.2 211.2 211.2-211.2 60.330667 60.330667-211.2 211.2 211.2 211.2-60.373334 60.330667-211.2-211.2-211.157333 211.2-60.330667-60.330667 211.2-211.2-211.2-211.2L300.8 240.469333z" />
    </svg>
  )
}
