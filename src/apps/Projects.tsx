import { useState } from 'react'
import { FileItem } from '../components/FileItem'
import { projects } from '../data/content'
import { useOs } from '../os/OsContext'

/** File-explorer style grid. Each project opens in its own window. */
export function Projects() {
  const { openApp, mode } = useOs()
  const [selected, setSelected] = useState<string | null>(null)
  const open = (slug: string, name: string) =>
    openApp('project', { key: slug, title: name, payload: slug })

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b-2 border-ink bg-muted px-3 py-2">
        <span className="font-pixel text-[11px] text-muted-fg">PATH</span>
        <span className="px-inset flex-1 truncate px-2">C:\aen\projects</span>
      </div>
      <div
        className="grid flex-1 grid-cols-[repeat(auto-fill,minmax(96px,1fr))] content-start justify-items-center gap-2 p-3"
        onClick={() => setSelected(null)}
      >
        {projects.map((p) => (
          <FileItem
            key={p.slug}
            label={p.name}
            icon="app"
            accent={p.accent}
            selected={selected === p.slug}
            onSelect={() => setSelected(p.slug)}
            onOpen={() => open(p.slug, p.name)}
          />
        ))}
      </div>
      <div className="flex justify-between border-t-2 border-ink bg-muted px-3 py-1 text-muted-fg">
        <span>{projects.length} objects</span>
        <span>{mode === 'mobile' ? 'tap to open' : 'double-click or Enter to open'}</span>
      </div>
    </div>
  )
}
