import { Sprite } from '../components/PixelIcon'
import { cat, TOYS, useCat, type ToyId } from '../cat/catStore'
import { HEART } from '../cat/CatLayer'
import * as S from '../cat/sprites'
import { useOs } from '../os/OsContext'

const LASER = [
  '........kk',
  '.......krk',
  '......kLLk',
  '.....kLGk.',
  '....kLGk..',
  '...kLGk...',
  '..kLGk....',
  '.kLGk.....',
  'kGGk......',
  '.kk.......',
] as const

const ICONS: Record<ToyId, readonly string[]> = {
  yarn: S.yarn,
  laser: LASER,
  feather: S.feather,
  fish: S.fish,
}

/** Pick a toy for Mochi. Every toy also has a button, so mouse isn't required to play. */
export function ToyBox() {
  const { toy, status, roam, pets, name } = useCat()
  const { mode } = useOs()
  const held = TOYS.find((t) => t.id === toy)

  const play = (id: ToyId) => {
    cat.playForMe(id)
    // on the phone, go back to the home screen so you can watch
    if (mode === 'mobile') history.back()
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="px-inset flex items-center gap-3 p-3">
        <Sprite rows={S.sit} scale={3} className="shrink-0" />
        <div className="min-w-0">
          <p className="font-pixel text-[12px] leading-relaxed text-accent">{name}</p>
          <p>
            {name} {status}
          </p>
          <p className="flex items-center gap-2 text-muted-fg">
            <Sprite rows={HEART} scale={2} /> petted {pets} {pets === 1 ? 'time' : 'times'}
          </p>
        </div>
      </div>

      <div>
        <h2 className="font-pixel mb-2 text-[11px] text-muted-fg">PICK A TOY</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TOYS.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={toy === t.id}
              onClick={() => cat.pickToy(t.id)}
              className="px-btn flex min-h-24 flex-col items-center justify-center gap-2 p-2 aria-pressed:bg-secondary! aria-pressed:text-white"
            >
              <span className="grid h-10 place-items-center">
                <Sprite rows={ICONS[t.id]} scale={3} />
              </span>
              <span className="text-[20px] leading-none">{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-inset p-3" aria-live="polite">
        {held ? (
          <>
            <p>
              <span className="text-accent">Holding the {held.name.toLowerCase()}.</span>{' '}
              {held.how[mode]}
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <button type="button" className="px-btn min-h-11 px-4" onClick={() => play(held.id)}>
                {held.auto}
              </button>
              <button type="button" className="px-btn min-h-11 px-4" onClick={cat.putAway}>
                Put toys away
              </button>
            </div>
          </>
        ) : (
          <p className="text-muted-fg">
            No toy in hand. Pick one above, or {mode === 'mobile' ? 'tap' : 'click'} {name} to pet her.
          </p>
        )}
      </div>

      <label className="flex min-h-11 cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={roam}
          onChange={(e) => cat.setRoam(e.target.checked)}
          className="h-5 w-5 accent-[var(--color-accent)]"
        />
        Let {name} wander when she&apos;s not playing
      </label>
    </div>
  )
}
