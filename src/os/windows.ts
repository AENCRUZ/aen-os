import type { AppId } from './apps'

/** One open window. All windows live in a single array (the plan's "one state array"). */
export interface WindowState {
  id: string
  app: AppId
  title: string
  payload?: string
  x: number
  y: number
  w: number
  h: number
  z: number
  minimized: boolean
  maximized: boolean
}

export interface WindowsState {
  windows: WindowState[]
  nextZ: number
}

export type WindowAction =
  | { type: 'open'; win: Omit<WindowState, 'z' | 'minimized' | 'maximized'> }
  | { type: 'close'; id: string }
  | { type: 'focus'; id: string }
  | { type: 'minimize'; id: string }
  | { type: 'toggleMaximize'; id: string }
  | { type: 'move'; id: string; x: number; y: number }
  | { type: 'closeAll' }

export const initialWindows: WindowsState = { windows: [], nextZ: 1 }

const update = (s: WindowsState, id: string, patch: Partial<WindowState>): WindowState[] =>
  s.windows.map((w) => (w.id === id ? { ...w, ...patch } : w))

export function windowsReducer(state: WindowsState, action: WindowAction): WindowsState {
  switch (action.type) {
    case 'open': {
      const existing = state.windows.find((w) => w.id === action.win.id)
      if (existing) {
        // already open: restore and bring to front instead of duplicating
        return {
          windows: update(state, existing.id, { minimized: false, z: state.nextZ }),
          nextZ: state.nextZ + 1,
        }
      }
      return {
        windows: [
          ...state.windows,
          { ...action.win, z: state.nextZ, minimized: false, maximized: false },
        ],
        nextZ: state.nextZ + 1,
      }
    }
    case 'close':
      return { ...state, windows: state.windows.filter((w) => w.id !== action.id) }
    case 'focus': {
      const win = state.windows.find((w) => w.id === action.id)
      if (!win) return state
      if (win.z === state.nextZ - 1 && !win.minimized) return state // already on top
      return {
        windows: update(state, action.id, { z: state.nextZ, minimized: false }),
        nextZ: state.nextZ + 1,
      }
    }
    case 'minimize':
      return { ...state, windows: update(state, action.id, { minimized: true }) }
    case 'toggleMaximize': {
      const win = state.windows.find((w) => w.id === action.id)
      if (!win) return state
      return {
        windows: update(state, action.id, { maximized: !win.maximized, z: state.nextZ }),
        nextZ: state.nextZ + 1,
      }
    }
    case 'move':
      return { ...state, windows: update(state, action.id, { x: action.x, y: action.y }) }
    case 'closeAll':
      return initialWindows
  }
}

/** The active window is the top-most one that isn't minimized. */
export function activeWindowId(state: WindowsState): string | null {
  let top: WindowState | null = null
  for (const w of state.windows) {
    if (!w.minimized && (!top || w.z > top.z)) top = w
  }
  return top?.id ?? null
}
