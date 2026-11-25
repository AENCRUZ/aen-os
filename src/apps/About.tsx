import { PixelIcon } from '../components/PixelIcon'
import { profile } from '../data/content'
import { useOs } from '../os/OsContext'

export function About() {
  const { openApp } = useOs()
  return (
    <div className="@container p-4">
      <div className="flex flex-col gap-4 @md:flex-row @md:items-start">
        <div className="px-inset grid shrink-0 place-items-center self-start p-3">
          <PixelIcon name="about" size={96} />
        </div>
        <div className="min-w-0">
          <h2 className="font-pixel text-[15px] leading-relaxed text-accent">{profile.name}</h2>
          <p className="text-muted-fg">
            {profile.role} · {profile.location}
          </p>
          {profile.bio.map((p) => (
            <p key={p} className="mt-3">
              {p}
            </p>
          ))}
        </div>
      </div>

      <div className="px-inset mt-5 p-3">
        <p className="font-pixel text-[11px] text-muted-fg">NOW PLAYING</p>
        <p className="mt-1">
          <span className="text-accent">&gt;</span> {profile.now}
          <span className="blink" aria-hidden="true">
            _
          </span>
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" className="px-btn min-h-11 px-4" onClick={() => openApp('projects')}>
          See projects
        </button>
        <button type="button" className="px-btn min-h-11 px-4" onClick={() => openApp('contact')}>
          Say hi
        </button>
      </div>
    </div>
  )
}
