import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Clock } from './Clock'
import { PixelIcon } from './PixelIcon'
import { APPS, LAUNCHERS, accentFor, type AppId } from '../os/apps'
import { OsContext, type OpenOptions, type OsApi } from '../os/OsContext'
import { profile } from '../data/content'
import { CatLayer } from '../cat/CatLayer'
import { useCat } from '../cat/catStore'

interface Screen {
  app: AppId
  title: string
  payload?: string
}

/**
 * Phone layout: a home screen of app icons; apps open full screen as a stack.
 * Each push adds a browser history entry, so the phone's own back gesture
 * goes back one screen instead of leaving the site.
 */
export function MobileOS() {
  const [stack, setStack] = useState<Screen[]>([])
  const appRef = useRef<HTMLDivElement>(null)
  const lastLauncher = useRef<HTMLElement | null>(null)

  const openApp = useCallback((app: AppId, opts: OpenOptions = {}) => {
    if (document.activeElement instanceof HTMLElement && !appRef.current?.contains(document.activeElement))
      lastLauncher.current = document.activeElement
    setStack((s) => [...s, { app, title: opts.title ?? APPS[app].title, payload: opts.payload }])
    history.pushState({ aenos: true }, '')
  }, [])

  useEffect(() => {
    const onPop = () => setStack((s) => s.slice(0, -1))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const top = stack[stack.length - 1]
  const { toy } = useCat()
  // while holding the laser or feather, finger drags steer the toy instead of scrolling
  const steering = toy === 'laser' || toy === 'feather'

  // move focus to the new screen's heading; back on the home screen, to the icon that launched it
  useEffect(() => {
    if (top) appRef.current?.querySelector<HTMLElement>('h1')?.focus()
    else lastLauncher.current?.focus()
  }, [top])

  const api = useMemo<OsApi>(() => ({ mode: 'mobile', openApp }), [openApp])

  return (
    <OsContext.Provider value={api}>
      <div className="wallpaper fixed inset-0 flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        {/* Status bar */}
        <div className="flex h-9 shrink-0 items-center justify-between bg-black/40 px-4 text-[20px]">
          <span className="font-pixel text-[10px]">
            aen<span className="text-accent">.os</span>
          </span>
          <Clock />
        </div>

        {/* Home screen */}
        <div hidden={!!top} className="relative min-h-0 flex-1" style={{ touchAction: steering ? 'none' : 'auto' }}>
        <main
          aria-label="Home screen"
          className="flex h-full flex-col gap-6 overflow-y-auto px-5 pt-6 pb-24"
        >
          <div className="px-box p-4">
            <h1 className="font-pixel text-[13px] leading-relaxed text-accent">{profile.name}</h1>
            <p className="text-muted-fg">{profile.role}</p>
            <p className="mt-2">{profile.now}</p>
          </div>

          <ul className="grid grid-cols-3 gap-x-2 gap-y-5 min-[400px]:grid-cols-4">
            {LAUNCHERS.map((id) => (
              <li key={id} className="flex justify-center">
                <button
                  type="button"
                  onClick={() => openApp(id)}
                  className="flex w-20 flex-col items-center gap-1"
                >
                  <span className="px-box grid h-16 w-16 place-items-center">
                    <PixelIcon name={APPS[id].icon} size={40} />
                  </span>
                  <span className="text-[20px] [text-shadow:2px_2px_0_#05070d]">{APPS[id].title}</span>
                </button>
              </li>
            ))}
          </ul>
        </main>
        <CatLayer />
        </div>

        {/* Full-screen app */}
        {top && (
          <div
            ref={appRef}
            key={stack.length}
            className="window-open flex min-h-0 flex-1 flex-col bg-card"
          >
            <div className="flex h-14 shrink-0 items-center gap-2 border-b-2 border-ink bg-secondary px-2 text-white">
              <button
                type="button"
                onClick={() => history.back()}
                className="px-btn flex h-11 min-w-11 items-center gap-1 px-3"
                aria-label={`Back to ${stack.length > 1 ? stack[stack.length - 2].title : 'home screen'}`}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" shapeRendering="crispEdges" aria-hidden="true">
                  <path d="M8 2h2v2H8zM6 4h2v2H6zM4 6h2v2H4zM6 8h2v2H6zM8 10h2v2H8z" />
                </svg>
                <span className="text-[20px]">Back</span>
              </button>
              <PixelIcon name={APPS[top.app].icon} size={22} accent={accentFor(top.app, top.payload)} />
              <h1 tabIndex={-1} className="font-pixel min-w-0 truncate text-[11px] focus-visible:outline-none">
                {top.title}
              </h1>
            </div>
            <div className="px-scroll min-h-0 flex-1 overflow-y-auto">{APPS[top.app].render(top.payload)}</div>
          </div>
        )}
      </div>
    </OsContext.Provider>
  )
}
