import { useState } from 'react'
import { PixelIcon } from '../components/PixelIcon'
import { projects } from '../data/content'

export function ProjectDetail({ slug }: { slug?: string }) {
  const project = projects.find((p) => p.slug === slug)
  const [shot, setShot] = useState(0)
  if (!project) return <p className="p-4">File not found. It may have been moved to the Trash.</p>

  const current = project.screenshots[shot]

  return (
    <div className="@container p-4">
      <header className="flex items-center gap-3">
        <PixelIcon name="app" size={48} accent={project.accent} className="shrink-0" />
        <div className="min-w-0">
          <h2 className="font-pixel text-[14px] leading-relaxed">{project.name}</h2>
          <p className="text-muted-fg">
            {project.year} · {project.tagline}
          </p>
        </div>
      </header>

      {/* Screenshots */}
      <figure className="mt-4">
        <div className="px-inset aspect-video w-full overflow-hidden">
          {current ? (
            <img
              src={current.src}
              alt={current.alt}
              className="h-full w-full bg-[#05070d] object-contain"
              loading="lazy"
            />
          ) : (
            <div
              className="grid h-full w-full place-items-center p-4 text-center text-muted-fg"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, ${project.accent}22 0 8px, transparent 8px 16px)`,
              }}
            >
              <span>
                no screenshot yet
                <br />
                add one in content.ts
              </span>
            </div>
          )}
        </div>
        {project.screenshots.length > 1 && (
          <div className="mt-2 flex gap-2" role="group" aria-label="Screenshots">
            {project.screenshots.map((s, i) => (
              <button
                key={s.src}
                type="button"
                aria-label={`Screenshot ${i + 1} of ${project.screenshots.length}`}
                aria-pressed={i === shot}
                onClick={() => setShot(i)}
                className="px-btn h-12 w-16 overflow-hidden p-1"
              >
                <img src={s.src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </figure>

      <div className="mt-4 grid gap-4 @lg:grid-cols-[1fr_auto]">
        <div>
          {project.description.map((d) => (
            <p key={d} className="mb-3">
              {d}
            </p>
          ))}
          {project.highlights.length > 0 && (
            <>
              <h3 className="font-pixel mt-4 mb-2 text-[11px] text-muted-fg">FEATURES</h3>
              <ul className="mb-3 flex flex-col gap-1">
                {project.highlights.map((h) => (
                  <li key={h} className="flex gap-2">
                    <span aria-hidden="true" style={{ color: project.accent }}>
                      ■
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <div>
          <h3 className="font-pixel text-[11px] text-muted-fg">STACK</h3>
          <ul className="mt-2 flex flex-wrap gap-2 @lg:max-w-48 @lg:flex-col">
            {project.stack.map((s) => (
              <li key={s} className="px-inset px-2 whitespace-nowrap">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {project.links.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-3">
          {project.links.map((l) => (
            <a
              key={l.href + l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="px-btn inline-flex min-h-11 items-center px-4 no-underline"
            >
              {l.label} <span aria-hidden="true">&nbsp;↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
