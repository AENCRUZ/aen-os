import { useMemo } from 'react'
import { Sprite } from './PixelIcon'

/**
 * Animated pixel dusk: twinkling stars, a moon, drifting clouds and the odd
 * shooting star. Pure CSS animation (cheap, pauses in background tabs), and
 * it holds still under prefers-reduced-motion. Sits behind everything and
 * never catches clicks.
 */

const MOON = [
  '....xxxx....',
  '..xxxxxxxx..',
  '.xxxxxxyxxx.',
  '.xxyxxxxxxx.',
  'xxxxxxxxxxxx',
  'xxxxxxxxyyxx',
  'xxyyxxxxyyxx',
  'xxyyxxxxxxxx',
  '.xxxxxxxxxx.',
  '.xxxxxyxxxx.',
  '..xxxxxxxx..',
  '....xxxx....',
] as const
const MOON_COLORS = { x: '#fef3c7', y: '#fcd34d' }

const CLOUD = [
  '......xxxx..............',
  '....xxxxxxxx...xxx......',
  '..xxxxxxxxxxxxxxxxxx....',
  'xxxxxxxxxxxxxxxxxxxxxxx.',
  '.xxxxxxxxxxxxxxxxxxxxxx.',
  '...yyyyyyyyyyyyyyyyyy...',
] as const
const CLOUD_COLORS = { x: '#f5d0fe', y: '#c084fc' }

const STAR_COLORS = ['#ffffff', '#ffffff', '#fde68a', '#bfdbfe']

// small seeded RNG so the sky looks the same on every render
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const CLOUDS = [
  { top: '50%', scale: 5, duration: 140, delay: -30, opacity: 0.4, base: '20vw' },
  { top: '63%', scale: 4, duration: 110, delay: -80, opacity: 0.32, base: '60vw' },
  { top: '40%', scale: 3, duration: 170, delay: -120, opacity: 0.26, base: '75vw' },
]

export function Wallpaper({ stars = 60, moon = true }: { stars?: number; moon?: boolean }) {
  const sky = useMemo(() => {
    const r = rng(7)
    return Array.from({ length: stars }, () => ({
      left: r() * 100,
      top: r() * 44,
      size: r() < 0.8 ? 2 : 4,
      color: STAR_COLORS[Math.floor(r() * STAR_COLORS.length)],
      duration: 1.6 + r() * 3.4,
      delay: -r() * 5,
    }))
  }, [stars])

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {sky.map((s, i) => (
        <span
          key={i}
          className="wp-anim wp-twinkle absolute"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            background: s.color,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {moon && (
        <div className="wp-anim wp-moon absolute top-[7%] right-[11%]">
          <Sprite rows={MOON} palette={MOON_COLORS} scale={6} />
        </div>
      )}

      <span className="wp-anim wp-shooting absolute top-[10%] left-[18%]" />
      <span className="wp-anim wp-shooting wp-shooting-2 absolute top-[22%] left-[52%]" />

      {CLOUDS.map((c, i) => (
        <div
          key={i}
          className="wp-anim wp-drift absolute left-0"
          style={{
            top: c.top,
            opacity: c.opacity,
            transform: `translateX(${c.base})`, // resting spot when motion is reduced
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
          }}
        >
          <Sprite rows={CLOUD} palette={CLOUD_COLORS} scale={c.scale} />
        </div>
      ))}
    </div>
  )
}
