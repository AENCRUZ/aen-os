import type { MouseEvent } from 'react'
import { PixelIcon, type SpriteName } from './PixelIcon'
import { useOs } from '../os/OsContext'

interface FileItemProps {
  label: string
  icon: SpriteName
  accent?: string
  selected: boolean
  onSelect: () => void
  onOpen: () => void
  /** light text with a shadow for the wallpaper; normal text inside windows */
  variant?: 'desktop' | 'window'
}

/**
 * An icon you can open, desktop style:
 *  - mouse: click selects, double-click opens
 *  - keyboard: Tab to it, Enter or Space opens
 *  - phone layout: one tap opens
 */
export function FileItem({
  label,
  icon,
  accent,
  selected,
  onSelect,
  onOpen,
  variant = 'window',
}: FileItemProps) {
  const { mode } = useOs()

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation()
    // detail === 0 means the click came from the keyboard (Enter/Space)
    if (mode === 'mobile' || e.detail === 0) onOpen()
    else onSelect()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onDoubleClick={(e) => {
        e.stopPropagation()
        onOpen()
      }}
      className="group flex w-24 flex-col items-center gap-1 p-1 text-center outline-offset-0"
    >
      <span
        className={`grid place-items-center p-1 ${selected ? 'bg-secondary/60' : 'group-hover:bg-white/10'}`}
      >
        <PixelIcon name={icon} size={40} accent={accent} />
      </span>
      <span
        className={`px-1 text-[20px] leading-tight break-words ${
          selected ? 'bg-secondary text-white' : ''
        } ${variant === 'desktop' ? 'text-white [text-shadow:2px_2px_0_#05070d]' : ''}`}
      >
        {label}
      </span>
    </button>
  )
}
