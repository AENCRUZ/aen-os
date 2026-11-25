import { useSyncExternalStore } from 'react'

export type ToyId = 'yarn' | 'laser' | 'feather' | 'fish'

export interface CatState {
  name: string
  /** the toy you're holding; null = Mochi does her own thing */
  toy: ToyId | null
  /** what Mochi is up to, shown in the Toy Box */
  status: string
  /** wander around when idle (off by default under reduced motion) */
  roam: boolean
  pets: number
  /** bumped by "play for me" buttons; the cat engine watches it */
  autoPlay: number
}

const prefersReduced =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

let state: CatState = {
  name: 'Mochi',
  toy: null,
  status: 'is stretching',
  roam: !prefersReduced,
  pets: 0,
  autoPlay: 0,
}

const listeners = new Set<() => void>()

function set(patch: Partial<CatState>) {
  state = { ...state, ...patch }
  listeners.forEach((l) => l())
}

/** Tiny global store: shared by the cat on the desktop and the Toy Box window. */
export const cat = {
  get: () => state,
  subscribe(l: () => void) {
    listeners.add(l)
    return () => listeners.delete(l)
  },
  pickToy: (toy: ToyId | null) => set({ toy: state.toy === toy ? null : toy }),
  putAway: () => set({ toy: null }),
  setRoam: (roam: boolean) => set({ roam }),
  setStatus: (status: string) => {
    if (status !== state.status) set({ status })
  },
  pet: () => set({ pets: state.pets + 1 }),
  playForMe: (toy: ToyId) => set({ toy, autoPlay: state.autoPlay + 1 }),
}

export function useCat() {
  return useSyncExternalStore(cat.subscribe, cat.get, cat.get)
}

export const TOYS: { id: ToyId; name: string; how: { desktop: string; mobile: string }; auto: string }[] = [
  {
    id: 'yarn',
    name: 'Yarn ball',
    how: { desktop: 'Click the desktop to throw it.', mobile: 'Tap the home screen to throw it.' },
    auto: 'Throw the yarn',
  },
  {
    id: 'laser',
    name: 'Laser pointer',
    how: { desktop: 'Move your mouse around the desktop.', mobile: 'Drag your finger on the home screen.' },
    auto: 'Wiggle the laser',
  },
  {
    id: 'feather',
    name: 'Feather wand',
    how: { desktop: 'Dangle it with your mouse.', mobile: 'Drag your finger on the home screen.' },
    auto: 'Wave the feather',
  },
  {
    id: 'fish',
    name: 'Fish treat',
    how: { desktop: 'Click the desktop to drop one.', mobile: 'Tap the home screen to drop one.' },
    auto: 'Drop a treat',
  },
]
