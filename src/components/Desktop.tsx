import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { FileItem } from './FileItem'
import { CatLayer } from '../cat/CatLayer'
import { Wallpaper } from './Wallpaper'
import { Taskbar } from './Taskbar'
import { TASKBAR_H, Window, clampPosition } from './Window'
import { APPS, LAUNCHERS, accentFor, type AppId } from '../os/apps'
import { OsContext, type OpenOptions, type OsApi } from '../os/OsContext'
import { activeWindowId, initialWindows, windowsReducer } from '../os/windows'

export function Desktop({ onRestart, welcome }: { onRestart: () => void; welcome: boolean }) {
  const [state, dispatch] = useReducer(windowsReducer, initialWindows)
  const [selected, setSelected] = useState<AppId | null>(null)
  const openers = useRef(new Map<string, HTMLElement>())
  const opened = useRef(0)
  const activeId = activeWindowId(state)

  const openApp = useCallback((app: AppId, opts: OpenOptions = {}) => {
    const def = APPS[app]
    const id = opts.key ? `${app}:${opts.key}` : app
    const w = Math.min(def.size.w, window.innerWidth - 32)
    const h = Math.min(def.size.h, window.innerHeight - TASKBAR_H - 32)
    // cascade new windows so they don't stack exactly on top of each other
    const n = opened.current++ % 6
    const pos = clampPosition(
      Math.max(140, (window.innerWidth - w) / 2 - 120) + n * 36,
      Math.max(16, (window.innerHeight - TASKBAR_H - h) / 2 - 80) + n * 32,
      w,
    )
    const opener = document.activeElement
    if (opener instanceof HTMLElement && opener !== document.body) openers.current.set(id, opener)
    dispatch({
      type: 'open',
      win: { id, app, title: opts.title ?? def.title, payload: opts.payload, w, h, ...pos },
    })
  }, [])

  const closeWindow = useCallback((id: string) => {
    dispatch({ type: 'close', id })
    const opener = openers.current.get(id)
    openers.current.delete(id)
    // return focus to whatever opened the window, if it still exists
    requestAnimationFrame(() => {
      if (opener?.isConnected && opener.offsetParent !== null) opener.focus()
      else document.getElementById('desktop')?.focus()
    })
  }, [])

  // Say hello on first boot of the session.
  useEffect(() => {
    if (welcome) openApp('about')
  }, [welcome, openApp])

  // Keep windows reachable when the browser window shrinks.
  useEffect(() => {
    const onResize = () =>
      state.windows.forEach((w) => {
        const p = clampPosition(w.x, w.y, w.w)
        if (p.x !== w.x || p.y !== w.y) dispatch({ type: 'move', id: w.id, ...p })
      })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [state.windows])

  const api = useMemo<OsApi>(() => ({ mode: 'desktop', openApp }), [openApp])

  return (
    <OsContext.Provider value={api}>
      <main
        id="desktop"
        tabIndex={-1}
        aria-label="aen.os desktop"
        className="wallpaper fixed inset-0 overflow-hidden focus-visible:outline-none"
        style={{ bottom: TASKBAR_H }}
        onClick={() => setSelected(null)}
      >
        <h1 className="sr-only">aen.os, a portfolio desktop</h1>
        <Wallpaper />

        <ul
          aria-label="Desktop icons"
          className="grid h-full w-max grid-flow-col grid-rows-[repeat(auto-fill,116px)] gap-x-2 p-3"
        >
          {LAUNCHERS.map((id) => (
            <li key={id}>
              <FileItem
                variant="desktop"
                label={APPS[id].title}
                icon={APPS[id].icon}
                selected={selected === id}
                onSelect={() => setSelected(id)}
                onOpen={() => {
                  setSelected(id)
                  openApp(id)
                }}
              />
            </li>
          ))}
        </ul>

        <p
          aria-hidden="true"
          className="font-pixel pointer-events-none absolute right-6 bottom-5 text-right text-[28px] leading-none text-white/15 select-none"
        >
          aen<span className="text-accent/40">.os</span>
          <span className="mt-3 block font-term text-[20px] text-white/40">
            double-click an icon to open it
          </span>
        </p>

        <CatLayer minX={130} />

        {state.windows.map((w) => (
          <Window
            key={w.id}
            win={w}
            active={w.id === activeId}
            icon={APPS[w.app].icon}
            accent={accentFor(w.app, w.payload)}
            dispatch={dispatch}
            onClose={closeWindow}
          >
            {APPS[w.app].render(w.payload)}
          </Window>
        ))}
      </main>

      <Taskbar
        windows={state.windows}
        activeId={activeId}
        dispatch={dispatch}
        onOpenApp={openApp}
        onRestart={onRestart}
      />
    </OsContext.Provider>
  )
}
