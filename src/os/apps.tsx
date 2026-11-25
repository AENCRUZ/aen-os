import type { ReactNode } from 'react'
import type { SpriteName } from '../components/PixelIcon'
import { About } from '../apps/About'
import { Contact } from '../apps/Contact'
import { ProjectDetail } from '../apps/ProjectDetail'
import { Projects } from '../apps/Projects'
import { Stack } from '../apps/Stack'
import { TextFile, Trash } from '../apps/Trash'
import { ToyBox } from '../apps/ToyBox'
import { projects } from '../data/content'

export type AppId =
  | 'about'
  | 'projects'
  | 'project'
  | 'stack'
  | 'contact'
  | 'trash'
  | 'textfile'
  | 'toybox'

export interface AppDef {
  title: string
  icon: SpriteName
  /** preferred window size; clamped to the viewport when opened */
  size: { w: number; h: number }
  render: (payload?: string) => ReactNode
}

export const APPS: Record<AppId, AppDef> = {
  about: { title: 'About', icon: 'about', size: { w: 560, h: 520 }, render: () => <About /> },
  projects: { title: 'Projects', icon: 'folder', size: { w: 560, h: 400 }, render: () => <Projects /> },
  project: {
    title: 'Project',
    icon: 'app',
    size: { w: 640, h: 600 },
    render: (slug) => <ProjectDetail slug={slug} />,
  },
  stack: { title: 'Stack', icon: 'stack', size: { w: 520, h: 560 }, render: () => <Stack /> },
  contact: { title: 'Contact', icon: 'contact', size: { w: 480, h: 520 }, render: () => <Contact /> },
  trash: { title: 'Trash', icon: 'trash', size: { w: 520, h: 300 }, render: () => <Trash /> },
  toybox: { title: 'Toy Box', icon: 'toybox', size: { w: 560, h: 560 }, render: () => <ToyBox /> },
  textfile: {
    title: 'Notepad',
    icon: 'file',
    size: { w: 520, h: 420 },
    render: (name) => <TextFile name={name} />,
  },
}

/** Icons on the desktop / phone home screen, in order. */
export const LAUNCHERS: AppId[] = ['about', 'projects', 'stack', 'contact', 'toybox', 'trash']

/** project windows use their project's accent color on the app icon */
export function accentFor(app: AppId, payload?: string) {
  if (app !== 'project') return undefined
  return projects.find((p) => p.slug === payload)?.accent
}
