import { useEffect, useRef, type KeyboardEvent } from 'react'
import { PixelIcon, type SpriteName } from './PixelIcon'
import { APPS, LAUNCHERS, type AppId } from '../os/apps'
import { profile } from '../data/content'

interface StartMenuProps {
  onOpenApp: (app: AppId) => void
  onRestart: () => void
  onClose: (returnFocus: boolean) => void
}

export function StartMenu({ onOpenApp, onRestart, onClose }: StartMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  const items = () => Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])

  useEffect(() => {
    items()[0]?.focus()
    const onDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement
      if (!menuRef.current?.contains(t) && !t.closest('[data-start-button]')) onClose(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [onClose])

  const onKeyDown = (e: KeyboardEvent) => {
    const list = items()
    const i = list.indexOf(document.activeElement as HTMLElement)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      list[(i + 1) % list.length]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      list[(i - 1 + list.length) % list.length]?.focus()
    } else if (e.key === 'Home') {
      e.preventDefault()
      list[0]?.focus()
    } else if (e.key === 'End') {
      e.preventDefault()
      list[list.length - 1]?.focus()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose(true)
    } else if (e.key === 'Tab') {
      onClose(false)
    }
  }

  return (
    <div
      ref={menuRef}
      id="start-menu"
      role="menu"
      aria-label="Start"
      onKeyDown={onKeyDown}
      className="px-box absolute bottom-[calc(100%+6px)] left-1 flex w-72 overflow-hidden"
    >
      <div className="flex w-9 items-end justify-center bg-secondary pb-3" aria-hidden="true">
        <span className="font-pixel rotate-180 text-[12px] whitespace-nowrap text-white [writing-mode:vertical-rl]">
          aen<span className="text-accent">.os</span>
        </span>
      </div>
      <div className="flex-1 py-1">
        {LAUNCHERS.map((id) => (
          <MenuItem key={id} icon={APPS[id].icon} label={APPS[id].title} onClick={() => onOpenApp(id)} />
        ))}
        <div className="mx-2 my-1 h-[2px] bg-ink" role="separator" />
        <MenuItem icon="computer" label="Restart" onClick={onRestart} />
        <p className="px-3 pt-1 pb-2 text-[18px] text-muted-fg">
          logged in as {profile.handle}
        </p>
      </div>
    </div>
  )
}

function MenuItem({ icon, label, onClick }: { icon: SpriteName; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={-1}
      onClick={onClick}
      className="flex min-h-11 w-full items-center gap-3 px-3 text-left hover:bg-secondary hover:text-white focus-visible:bg-secondary focus-visible:text-white focus-visible:outline-offset-[-3px]"
    >
      <PixelIcon name={icon} size={24} />
      {label}
    </button>
  )
}
