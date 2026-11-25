import { useState } from 'react'
import { PixelIcon } from '../components/PixelIcon'
import { trash } from '../data/content'
import { useOs } from '../os/OsContext'

/** Details view. Rows are buttons, so the same select/open rules as icons apply. */
export function Trash() {
  const { openApp, mode } = useOs()
  const [selected, setSelected] = useState<string | null>(null)
  const open = (name: string) => openApp('textfile', { key: name, title: name, payload: name })

  return (
    <div className="flex h-full flex-col">
      <div className="grid grid-cols-[1fr_5rem_8rem] gap-2 border-b-2 border-ink bg-muted px-3 py-1 font-pixel text-[10px] text-muted-fg max-sm:grid-cols-[1fr_5rem]">
        <span>NAME</span>
        <span>SIZE</span>
        <span className="max-sm:hidden">DELETED</span>
      </div>
      <ul className="flex-1">
        {trash.map((f) => (
          <li key={f.name}>
            <button
              type="button"
              onClick={(e) =>
                mode === 'mobile' || e.detail === 0 ? open(f.name) : setSelected(f.name)
              }
              onDoubleClick={() => open(f.name)}
              className={`grid min-h-11 w-full grid-cols-[1fr_5rem_8rem] items-center gap-2 px-3 text-left max-sm:grid-cols-[1fr_5rem] ${
                selected === f.name ? 'bg-secondary text-white' : 'hover:bg-white/10'
              }`}
            >
              <span className="flex min-w-0 items-center gap-2">
                <PixelIcon name="file" size={24} />
                <span className="truncate">{f.name}</span>
              </span>
              <span>{f.size}</span>
              <span className="max-sm:hidden">{f.deleted}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="border-t-2 border-ink bg-muted px-3 py-1 text-muted-fg">
        {trash.length} items · probably for the best
      </p>
    </div>
  )
}

export function TextFile({ name }: { name?: string }) {
  const file = trash.find((f) => f.name === name)
  return (
    <pre className="m-0 min-h-full p-4 font-term text-[20px] leading-snug whitespace-pre-wrap text-accent">
      {file?.body ?? 'This file is empty. Spooky.'}
    </pre>
  )
}
