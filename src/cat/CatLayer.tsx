import { useEffect, useRef, useState } from 'react'
import { Sprite } from '../components/PixelIcon'
import { cat, useCat, type ToyId } from './catStore'
import * as S from './sprites'

const SCALE = 4
const CAT_W = 20 * SCALE
const CAT_H = 14 * SCALE

type Pose = 'sit' | 'walkA' | 'walkB' | 'paw' | 'sleep'
type Mode = 'sit' | 'walk' | 'run' | 'sleep' | 'eat' | 'happy' | 'paw'

const POSES: Record<Pose, readonly string[]> = {
  sit: S.sit,
  walkA: S.walkA,
  walkB: S.walkB,
  paw: S.paw,
  sleep: S.sleep,
}

export const HEART = ['.kk.kk.', 'krrkrrk', 'krrrrrk', '.krrrk.', '..krk..', '...k...'] as const

const rand = (a: number, b: number) => a + Math.random() * (b - a)

interface Point {
  x: number
  y: number
}

interface Sim {
  x: number
  y: number
  facing: 1 | -1
  mode: Mode
  until: number
  target: Point | null
  jumpStart: number
  lastSwat: number
  ball: Point & { vx: number; vy: number; on: boolean; chase: boolean; bats: number }
  treat: Point & { on: boolean }
  pointer: Point & { in: boolean }
  lure: Point
  auto: Point & { until: number; next: number }
  toy: ToyId | null
  autoPlay: number
  ateAt: number
}

/**
 * Mochi lives here. One requestAnimationFrame loop moves her and her toys by
 * writing transforms straight to the DOM; React only re-renders when her pose
 * changes. Lives under the windows, and comes out on top while you hold a toy.
 */
export function CatLayer({ minX = 40 }: { minX?: number }) {
  const { toy, name } = useCat()
  const layerRef = useRef<HTMLDivElement>(null)
  const catRef = useRef<HTMLButtonElement>(null)
  const flipRef = useRef<HTMLDivElement>(null)
  const ballRef = useRef<HTMLDivElement>(null)
  const treatRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const featherRef = useRef<HTMLDivElement>(null)
  const [pose, setPose] = useState<Pose>('sit')
  const [hearts, setHearts] = useState<{ id: number; dx: number }[]>([])
  const sim = useRef<Sim | null>(null)

  const now = () => performance.now()

  const pet = () => {
    const s = sim.current
    if (!s) return
    s.mode = 'happy'
    s.until = now() + 1600
    s.target = null
    cat.pet()
    const burst = Array.from({ length: 3 }, (_, i) => ({ id: Date.now() + i, dx: rand(-18, 18) }))
    setHearts((h) => [...h, ...burst])
    window.setTimeout(() => setHearts((h) => h.filter((x) => !burst.includes(x))), 1200)
  }

  useEffect(() => {
    const layer = layerRef.current
    if (!layer) return
    const host = layer.parentElement!
    let raf = 0
    let last = now()
    let shownPose: Pose = 'sit'

    const W = () => layer.clientWidth
    const H = () => layer.clientHeight
    const floor = () => H() - 8
    const top = () => Math.min(CAT_H + 8, floor())

    const s: Sim = (sim.current = sim.current ?? {
      x: Math.max(minX + 40, W() * 0.72),
      y: floor(),
      facing: -1,
      mode: 'sit',
      until: now() + 2500,
      target: null,
      jumpStart: -1,
      lastSwat: 0,
      ball: { x: 0, y: 0, vx: 0, vy: 0, on: false, chase: false, bats: 0 },
      treat: { x: 0, y: 0, on: false },
      pointer: { x: 0, y: 0, in: false },
      lure: { x: 0, y: 0 },
      auto: { x: 0, y: 0, until: 0, next: 0 },
      toy: cat.get().toy,
      autoPlay: cat.get().autoPlay,
      ateAt: 0,
    })

    const randomSpot = (): Point => ({
      x: rand(minX + 20, W() - 40),
      y: rand(H() * 0.4, floor() - 10),
    })

    const throwYarn = (at: Point) => {
      Object.assign(s.ball, { ...at, vx: rand(-320, 320), vy: rand(-140, 140), on: true, chase: true, bats: 0 })
    }
    const dropTreat = (at: Point) => Object.assign(s.treat, { ...at, on: true })

    // pointer: laser dot / feather follow it; clicks throw yarn or drop treats
    const onMove = (e: PointerEvent) => {
      const r = layer.getBoundingClientRect()
      s.pointer.x = e.clientX - r.left
      s.pointer.y = e.clientY - r.top
      s.pointer.in = s.pointer.x >= 0 && s.pointer.y >= 0 && s.pointer.x <= r.width && s.pointer.y <= r.height
    }
    const onLeave = (e: PointerEvent) => {
      if (!e.relatedTarget || e.pointerType === 'touch') s.pointer.in = false
    }
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (t.closest('[role="dialog"], button, a, input, label')) return
      const r = layer.getBoundingClientRect()
      const at = { x: e.clientX - r.left, y: Math.max(e.clientY - r.top, top()) }
      if (s.toy === 'yarn') throwYarn(at)
      if (s.toy === 'fish') dropTreat({ x: at.x, y: Math.min(at.y, floor()) })
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerdown', onMove)
    document.addEventListener('pointerout', onLeave)
    const onUp = (e: PointerEvent) => {
      if (e.pointerType === 'touch') s.pointer.in = false
    }
    window.addEventListener('pointerup', onUp)
    host.addEventListener('click', onClick)

    const moveToward = (p: Point, speed: number, dt: number) => {
      const dx = p.x - s.x
      const dy = p.y - s.y
      const d = Math.hypot(dx, dy)
      if (Math.abs(dx) > 2) s.facing = dx > 0 ? 1 : -1
      if (d < 2) return true
      const step = Math.min(d, speed * dt)
      s.x += (dx / d) * step
      s.y += (dy / d) * step
      return false
    }

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const t = now()
      const dt = Math.min(0.05, (t - last) / 1000)
      last = t
      if (W() === 0 || H() === 0) return // hidden (e.g. phone app open)

      const st = cat.get()
      if (st.toy !== s.toy) {
        s.toy = st.toy
        // playing: come out on top of the windows; otherwise live underneath them
        layer.style.zIndex = s.toy ? '99980' : '0'
        if (s.toy !== 'yarn') s.ball.on = false
        if (s.toy !== 'fish') s.treat.on = false
        s.auto.until = 0
        if (s.mode !== 'sleep') s.mode = 'sit'
        s.until = t + 800
      }
      if (st.autoPlay !== s.autoPlay) {
        s.autoPlay = st.autoPlay
        if (s.toy === 'yarn') throwYarn(randomSpot())
        if (s.toy === 'fish') dropTreat({ ...randomSpot(), y: rand(H() * 0.55, floor()) })
        if (s.toy === 'laser' || s.toy === 'feather') {
          s.auto.until = t + 7000
          s.auto.next = 0
          Object.assign(s.auto, { x: s.x, y: s.y - 40 })
        }
      }

      // --- toys ---------------------------------------------------------
      let lure: Point | null = null
      if (s.toy === 'laser' || s.toy === 'feather') {
        let p: Point | null = null
        if (t < s.auto.until) {
          if (t > s.auto.next) {
            s.auto.next = t + rand(450, 900)
            const to = randomSpot()
            s.lure.x = to.x
            // the feather hangs ~90px below the hand, so keep the hand higher up
            s.lure.y = s.toy === 'feather' ? rand(H() * 0.15, Math.max(H() * 0.2, floor() - 120)) : to.y
          }
          s.auto.x += (s.lure.x - s.auto.x) * Math.min(1, dt * 9)
          s.auto.y += (s.lure.y - s.auto.y) * Math.min(1, dt * 9)
          p = s.auto
        } else if (s.pointer.in) p = s.pointer
        const dot = dotRef.current!
        const feather = featherRef.current!
        dot.style.display = s.toy === 'laser' && p ? 'block' : 'none'
        feather.style.display = s.toy === 'feather' && p ? 'block' : 'none'
        if (p) {
          dot.style.transform = `translate(${p.x - 6}px, ${p.y - 6}px)`
          feather.style.transform = `translate(${p.x - 12}px, ${p.y}px)`
          lure = s.toy === 'laser' ? { x: p.x, y: Math.max(p.y, top()) } : { x: p.x, y: Math.min(Math.max(p.y + 90, top()), floor()) }
        }
      } else {
        dotRef.current!.style.display = 'none'
        featherRef.current!.style.display = 'none'
      }

      const b = s.ball
      if (b.on) {
        b.x += b.vx * dt
        b.y += b.vy * dt
        const damp = Math.pow(0.3, dt)
        b.vx *= damp
        b.vy *= damp
        if (b.x < 12 || b.x > W() - 12) (b.vx *= -1), (b.x = Math.min(Math.max(b.x, 12), W() - 12))
        if (b.y < H() * 0.3 || b.y > floor()) (b.vy *= -1), (b.y = Math.min(Math.max(b.y, H() * 0.3), floor()))
        if (Math.hypot(b.vx, b.vy) < 6) b.vx = b.vy = 0
        if (b.chase) lure = b
      }
      ballRef.current!.style.display = b.on ? 'block' : 'none'
      ballRef.current!.style.transform = `translate(${b.x - 15}px, ${b.y - 30}px) rotate(${b.x * 3}deg)`

      if (s.treat.on) lure = s.treat
      treatRef.current!.style.display = s.treat.on ? 'block' : 'none'
      treatRef.current!.style.transform = `translate(${s.treat.x - 18}px, ${s.treat.y - 24}px)`

      // --- Mochi --------------------------------------------------------
      const timed = s.mode === 'happy' || s.mode === 'eat' || s.mode === 'paw'
      if (timed) {
        if (t >= s.until) {
          if (s.mode === 'eat') {
            s.treat.on = false
            s.ateAt = t
            s.mode = 'happy'
            s.until = t + 1400
          } else if (s.mode === 'happy' && t - s.ateAt < 2000) {
            s.mode = 'sleep' // food coma
            s.until = t + 9000
          } else {
            const wasPaw = s.mode === 'paw'
            s.mode = 'sit'
            s.until = t + (wasPaw ? 300 : rand(1500, 3000))
          }
        }
      } else if (lure && !(s.mode === 'sleep' && t - s.ateAt < 9000)) {
        const isGrab = s.toy === 'yarn' || s.toy === 'fish'
        const reach = isGrab ? 24 : 16
        const dist = Math.hypot(lure.x - s.x, lure.y - s.y)
        if (dist > reach) {
          s.mode = 'run'
          moveToward(lure, s.toy === 'laser' ? 260 : 200, dt)
        } else if (s.toy === 'fish') {
          s.mode = 'eat'
          s.until = t + 1800
        } else if (s.toy === 'yarn') {
          s.facing = b.x >= s.x ? 1 : -1
          s.mode = 'paw'
          s.until = t + 280
          b.vx = s.facing * rand(260, 460)
          b.vy = rand(-180, 180)
          b.bats += 1
          if (b.bats >= 5) b.chase = false // tired; throw it again to restart
        } else {
          s.mode = 'sit'
          s.until = t + 600
          if (t - s.lastSwat > 750) {
            s.jumpStart = t
            s.lastSwat = t
          }
        }
      } else if (s.mode === 'walk' || s.mode === 'run') {
        if (!s.target || moveToward(s.target, s.mode === 'run' ? 200 : 45, dt)) {
          s.mode = 'sit'
          s.target = null
          s.until = t + rand(2000, 5000)
        }
      } else if (t >= s.until) {
        if (s.y < floor() - 4) {
          s.mode = 'walk' // hop back down to the floor after playing
          s.target = { x: s.x, y: floor() }
        } else if (st.roam) {
          const r = Math.random()
          if (r < 0.55) {
            s.mode = 'walk'
            s.target = { x: rand(minX + 20, W() - 40), y: floor() }
          } else if (r < 0.8) {
            s.mode = 'sit'
            s.until = t + rand(2000, 4000)
          } else {
            s.mode = 'sleep'
            s.until = t + rand(9000, 15000)
          }
        } else {
          s.mode = 'sleep'
          s.until = t + 20000
        }
      }

      // keep her on screen if the window resizes
      s.x = Math.min(Math.max(s.x, CAT_W / 2), W() - CAT_W / 2)
      s.y = Math.min(Math.max(s.y, top()), floor())

      // --- draw ---------------------------------------------------------
      let jy = 0
      if (s.jumpStart >= 0) {
        const p = (t - s.jumpStart) / 450
        if (p >= 1) s.jumpStart = -1
        else jy = -Math.sin(Math.PI * p) * 38
      }
      const bob = s.mode === 'eat' ? (Math.floor(t / 180) % 2) * 3 : 0
      catRef.current!.style.transform = `translate(${s.x - CAT_W / 2}px, ${s.y - CAT_H + jy + bob}px)`
      flipRef.current!.style.transform = `scaleX(${s.facing})`

      let next: Pose = 'sit'
      if (s.mode === 'sleep') next = 'sleep'
      else if (s.mode === 'paw') next = 'paw'
      else if (s.jumpStart >= 0) next = 'walkA'
      else if (s.mode === 'walk' || s.mode === 'run')
        next = Math.floor(t / (s.mode === 'run' ? 90 : 200)) % 2 ? 'walkA' : 'walkB'
      if (next !== shownPose) {
        shownPose = next
        setPose(next)
      }

      cat.setStatus(statusFor(s, b.chase))
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onMove)
      document.removeEventListener('pointerout', onLeave)
      window.removeEventListener('pointerup', onUp)
      host.removeEventListener('click', onClick)
    }
  }, [minX])

  const sleeping = pose === 'sleep'

  return (
    <>
      {/* Mochi and floor toys: under the windows */}
      <div ref={layerRef} className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        <div ref={ballRef} className="absolute top-0 left-0" style={{ display: 'none' }} aria-hidden="true">
          <Sprite rows={S.yarn} scale={3} />
        </div>
        <div ref={treatRef} className="absolute top-0 left-0" style={{ display: 'none' }} aria-hidden="true">
          <Sprite rows={S.fish} scale={3} />
        </div>
        <button
          ref={catRef}
          type="button"
          data-cat
          onClick={pet}
          aria-label={`${name} the cat. Pet her.`}
          title={`Pet ${name}`}
          className="pointer-events-auto absolute top-0 left-0 cursor-pointer"
          style={{ width: CAT_W, height: CAT_H, transform: 'translate(-200px, -200px)' }}
        >
          <div ref={flipRef} className="h-full w-full">
            <Sprite rows={POSES[pose]} scale={SCALE} />
          </div>
          {sleeping && (
            <span className="font-pixel blink absolute -top-5 right-0 text-[10px] text-white [text-shadow:2px_2px_0_#05070d]" aria-hidden="true">
              z<sup>z</sup>
            </span>
          )}
          {hearts.map((h) => (
            <span
              key={h.id}
              aria-hidden="true"
              className="cat-heart absolute -top-4 left-1/2"
              style={{ marginLeft: h.dx }}
            >
              <Sprite rows={HEART} scale={2} />
            </span>
          ))}
        </button>
      </div>

      {/* Held toys: above the windows, never catch clicks */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 99990 }} aria-hidden="true">
        <div
          ref={dotRef}
          className="absolute top-0 left-0 h-3 w-3 rounded-full bg-red-500 shadow-[0_0_10px_4px_rgba(239,68,68,0.7)]"
          style={{ display: 'none' }}
        />
        <div ref={featherRef} className="absolute top-0 left-0" style={{ display: 'none' }}>
          <div className="mx-auto h-12 w-[2px] bg-white/80" />
          <div className="feather-sway origin-top">
            <Sprite rows={S.feather} scale={3} />
          </div>
        </div>
      </div>
      {toy === null ? null : <span className="sr-only">Holding the {toy}</span>}
    </>
  )
}

function statusFor(s: Sim, chasing: boolean) {
  switch (s.mode) {
    case 'sleep':
      return performance.now() - s.ateAt < 11000 ? 'is in a food coma' : 'is napping'
    case 'walk':
      return 'is wandering around'
    case 'run':
      return {
        laser: 'is chasing the red dot!',
        feather: 'is stalking the feather',
        yarn: 'is chasing the yarn',
        fish: 'smells a fish treat',
      }[s.toy ?? 'yarn']
    case 'paw':
      return 'is batting the yarn'
    case 'eat':
      return 'is eating a fish treat'
    case 'happy':
      return 'is purring'
    default:
      if (s.toy === 'yarn' && s.ball.on && !chasing) return 'is bored of the yarn. Throw it again?'
      if (s.toy === 'laser') return 'is waiting for the red dot'
      if (s.toy === 'feather') return 'is watching the feather'
      if (s.toy === 'fish') return 'is hoping for a treat'
      return 'is sitting pretty'
  }
}
