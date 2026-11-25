import { createContext, useContext } from 'react'
import type { AppId } from './apps'

export interface OpenOptions {
  /** Distinguishes several windows of the same app, e.g. one per project. */
  key?: string
  title?: string
  payload?: string
}

export interface OsApi {
  /** 'desktop' opens floating windows; 'mobile' pushes full-screen apps. */
  mode: 'desktop' | 'mobile'
  openApp: (app: AppId, opts?: OpenOptions) => void
}

export const OsContext = createContext<OsApi>({ mode: 'desktop', openApp: () => {} })

export const useOs = () => useContext(OsContext)
