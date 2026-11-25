import { memo, useEffect, useRef, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import { PixelIcon, type SpriteName } from './PixelIcon'
import type { WindowAction, WindowState } from '../os/windows'

export const TASKBAR_H = 48
const KEEP_VISIBLE = 96 // px of title bar that must stay on screen

export function clampPosition(x: number, y: number, w: number) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  return {
    x: Math.round(Math.min(Math.max(x, -(w - KEEP_VISIBLE)), vw - KEEP_VISIBLE)),
    y: Math.round(Math.min(Math.max(y, 0), vh - TASKBAR_H - 36)),
  }
}

interface WindowProps {
  win: WindowState
  active: boolean
  icon: SpriteName
  accent?: string
  dispatch: (a: WindowAction) => void
  onClose: (id: string) => void
  children: ReactNode
}

/**
 * The one reusable window. Handles:
 *  - bring to front on any pointer down inside it
 *  - drag by the title bar (pointer events + pointer capture; works for mouse, pen, touch)
 *  - keyboard move: focus the title bar, then arrow keys (Shift = bigger steps)
 *  - minimize / maximize / close, Esc to close
 */
export const Window = memo(function Window({
  win,
  active,
  icon,
  accent,
  dispatch,
  onClose,
  children,
}: WindowProps) {
  const ref = useRef<HTMLElement>(null)
  const drag = useRef<{ dx: number; dy: number; x: number; y: number } | null>(null)
  const titleId = `win-title-${win.id}`

  // Move focus into a window when it opens (or is restored and brought forward).
  useEffect(() => {
    ref.current?.focus({ preventScroll: true })
  }, [])

  const onTitlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || win.maximized) return
    if ((e.target as HTMLElement).closest('button')) return
    drag.current = { dx: e.clientX - win.x, dy: e.clientY - win.y, x: win.x, y: win.y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onTitlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d || !ref.current) return
    const p = clampPosition(e.clientX - d.dx, e.clientY - d.dy, win.w)
    d.x = p.x
    d.y = p.y
    // Write straight to the DOM while dragging; commit to state once on release.
    ref.current.style.transform = `translate(${p.x}px, ${p.y}px)`
  }

  const endDrag = () => {
    const d = drag.current
    if (!d) return
    drag.current = null
    dispatch({ type: 'move', id: win.id, x: d.x, y: d.y })
  }

  const onTitleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (win.maximized) return
    const step = e.shiftKey ? 64 : 16
    const delta: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    }
    const d = delta[e.key]
    if (!d) return
    e.preventDefault()
    const p = clampPosition(win.x + d[0], win.y + d[1], win.w)
    dispatch({ type: 'move', id: win.id, ...p })
  }

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      onClose(win.id)
    }
  }

  const style = win.maximized
    ? { zIndex: win.z, inset: 0 } // parent <main> already stops above the taskbar
    : {
        zIndex: win.z,
        width: win.w,
        height: win.h,
        transform: `translate(${win.x}px, ${win.y}px)`,
      }

  return (
    <section
      ref={ref}
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      tabIndex={-1}
      hidden={win.minimized}
      onPointerDownCapture={() => dispatch({ type: 'focus', id: win.id })}
      onFocusCapture={() => !active && dispatch({ type: 'focus', id: win.id })}
      onKeyDown={onKeyDown}
      style={style}
      className="px-box window-open absolute top-0 left-0 flex flex-col focus-visible:outline-none"
    >
      {/* Title bar = drag handle */}
      <div
        role="group"
        aria-label={`${win.title} title bar. Use arrow keys to move the window.`}
        tabIndex={0}
        onPointerDown={onTitlePointerDown}
        onPointerMove={onTitlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={(e) => {
          if (!(e.target as HTMLElement).closest('button'))
            dispatch({ type: 'toggleMaximize', id: win.id })
        }}
        onKeyDown={onTitleKeyDown}
        className={`m-[2px] flex h-10 shrink-0 touch-none items-center gap-2 pr-1 pl-2 select-none ${
          win.maximized ? '' : 'cursor-grab active:cursor-grabbing'
        } ${active ? 'bg-secondary text-white' : 'bg-muted text-muted-fg'}`}
      >
        <PixelIcon name={icon} size={20} accent={accent} />
        <h2 id={titleId} className="font-pixel m-0 min-w-0 flex-1 truncate text-[11px] leading-none">
          {win.title}
        </h2>
        <TitleButton label={`Minimize ${win.title}`} onClick={() => dispatch({ type: 'minimize', id: win.id })}>
          <rect x="3" y="10" width="8" height="2" />
        </TitleButton>
        <TitleButton
          label={`${win.maximized ? 'Restore' : 'Maximize'} ${win.title}`}
          onClick={() => dispatch({ type: 'toggleMaximize', id: win.id })}
        >
          <path d="M2 2h10v10H2zM4 5v5h6V5z" fillRule="evenodd" />
        </TitleButton>
        <TitleButton label={`Close ${win.title}`} onClick={() => onClose(win.id)} danger>
          <path d="M2 2h2v2H2zM4 4h2v2H4zM6 6h2v2H6zM8 8h2v2H8zM10 10h2v2h-2zM10 2h2v2h-2zM8 4h2v2H8zM4 8h2v2H4zM2 10h2v2H2z" />
        </TitleButton>
      </div>

      <div className="px-scroll m-[2px] mt-0 min-h-0 flex-1 overflow-auto bg-card">{children}</div>
    </section>
  )
})

function TitleButton({
  label,
  onClick,
  danger,
  children,
}: {
  label: string
  onClick: () => void
  danger?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`px-btn grid h-8 w-8 shrink-0 place-items-center text-white ${
        danger ? 'bg-primary! hover:bg-red-500!' : ''
      }`}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" shapeRendering="crispEdges" aria-hidden="true">
        {children}
      </svg>
    </button>
  )
}
