import { useEffect, useRef, useState } from 'react'
import { profile } from '../data/content'

const LINES = [
  'AEN-BIOS v2.6  (c) 2026',
  'CPU: one (1) caffeinated human ........ OK',
  'RAM: 640K, should be enough for anybody . OK',
  'Mounting C:\\aen\\projects ............. OK',
  'Loading pixel fonts ................... OK',
  'Starting desktop ...',
]

const STEP_MS = 420

/** A short fake boot. Skippable by button, any key, or a click anywhere. */
export function BootScreen({ onDone }: { onDone: () => void }) {
  const [shown, setShown] = useState(1)
  const doneRef = useRef(false)
  const skipRef = useRef<HTMLButtonElement>(null)

  const finish = () => {
    if (doneRef.current) return
    doneRef.current = true
    onDone()
  }

  useEffect(() => {
    skipRef.current?.focus()
    const id = window.setInterval(() => setShown((n) => n + 1), STEP_MS)
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') finish()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearInterval(id)
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (shown > LINES.length + 2) finish()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown])

  const progress = Math.min(1, shown / (LINES.length + 1))

  return (
    <div
      className="fixed inset-0 z-[200000] flex flex-col bg-[#05070d] p-6 text-accent sm:p-10"
      onClick={finish}
      role="status"
      aria-label="aen.os is starting"
    >
      <p className="font-pixel text-[18px] leading-relaxed text-white sm:text-[24px]">
        aen<span className="text-accent">.os</span>
      </p>
      <p className="mt-1 text-muted-fg">portfolio of {profile.name}</p>

      <ol className="mt-6 flex-1 text-[20px] sm:text-[22px]" aria-hidden="true">
        {LINES.slice(0, shown).map((l) => (
          <li key={l} className="break-all sm:break-normal">
            {l}
          </li>
        ))}
        <li>
          <span className="blink">_</span>
        </li>
      </ol>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div
          className="px-inset h-6 flex-1 p-1"
          role="progressbar"
          aria-label="Boot progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        >
          <div
            className="h-full bg-accent"
            style={{ width: `${Math.round(progress * 12) * (100 / 12)}%` }}
          />
        </div>
        <button
          ref={skipRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            finish()
          }}
          className="px-btn font-pixel min-h-11 px-4 text-[11px] text-white"
        >
          Skip ›
        </button>
      </div>
    </div>
  )
}
