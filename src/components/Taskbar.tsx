import { useCallback, useRef, useState } from 'react'
import { Clock } from './Clock'
import { PixelIcon } from './PixelIcon'
import { StartMenu } from './StartMenu'
import { APPS, accentFor, type AppId } from '../os/apps'
import type { WindowAction, WindowState } from '../os/windows'
import { TASKBAR_H } from './Window'

interface TaskbarProps {
  windows: WindowState[]
  activeId: string | null
  dispatch: (a: WindowAction) => void
  onOpenApp: (app: AppId) => void
  onRestart: () => void
}

/** Reads and writes the same window state as the desktop. */
export function Taskbar({ windows, activeId, dispatch, onOpenApp, onRestart }: TaskbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const startRef = useRef<HTMLButtonElement>(null)

  const closeMenu = useCallback((returnFocus: boolean) => {
    setMenuOpen(false)
    if (returnFocus) startRef.current?.focus()
  }, [])

  const onTaskClick = (w: WindowState) => {
    // classic behavior: clicking the active window's button minimizes it
    if (w.id === activeId && !w.minimized) dispatch({ type: 'minimize', id: w.id })
    else dispatch({ type: 'focus', id: w.id })
  }

  return (
    <footer
      className="px-box fixed inset-x-0 bottom-0 z-[100000] flex items-center gap-2 px-1 shadow-none!"
      style={{ height: TASKBAR_H }}
    >
      <div className="relative">
        <button
          ref={startRef}
          type="button"
          data-start-button
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-controls={menuOpen ? 'start-menu' : undefined}
          onClick={() => setMenuOpen((o) => !o)}
          aria-pressed={menuOpen}
          className="px-btn font-pixel flex h-9 items-center gap-2 px-2 text-[11px]"
        >
          <PixelIcon name="computer" size={22} />
          Start
        </button>
        {menuOpen && (
          <StartMenu
            onClose={closeMenu}
            onOpenApp={(app) => {
              setMenuOpen(false)
              onOpenApp(app)
            }}
            onRestart={() => {
              setMenuOpen(false)
              onRestart()
            }}
          />
        )}
      </div>

      <div className="h-8 w-[2px] bg-ink" aria-hidden="true" />

      <nav aria-label="Open windows" className="min-w-0 flex-1">
        <ul className="flex gap-2 overflow-x-auto px-1 py-1">
          {windows.map((w) => {
            const isActive = w.id === activeId
            return (
              <li key={w.id} className="min-w-0 shrink">
                <button
                  type="button"
                  aria-pressed={isActive}
                  aria-label={`${w.title}${w.minimized ? ' (minimized)' : ''}`}
                  onClick={() => onTaskClick(w)}
                  className={`px-btn flex h-9 w-44 max-w-44 min-w-24 items-center gap-2 px-2 ${
                    w.minimized ? 'text-muted-fg' : ''
                  }`}
                >
                  <PixelIcon name={APPS[w.app].icon} size={18} accent={accentFor(w.app, w.payload)} />
                  <span className="truncate">{w.title}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="px-inset flex h-9 items-center px-3 text-[20px] whitespace-nowrap">
        <Clock />
      </div>
    </footer>
  )
}
