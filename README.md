# aen.os

A portfolio shaped like a tiny retro operating system. React + TypeScript + Vite + Tailwind CSS v4.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Make it yours

Everything personal lives in **`src/data/content.ts`**: name, bio, timezone, projects, stack, links and the Trash jokes.
Project screenshots go in `public/projects/` and are listed under each project's `screenshots`.

## Deploy (GitHub Pages)

1. Push to a GitHub repo on the `main` branch.
2. Repo **Settings → Pages → Source: GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` builds and publishes on every push.

`base: './'` in `vite.config.ts` means it works whatever the repo is named.

## How it's put together

```
src/
  os/windows.ts        window state: one array + a reducer (open, close, focus, minimize, maximize, move)
  os/apps.tsx          app registry: title, icon, default size, what to render
  os/OsContext.ts      openApp() — the same call opens a window on desktop or a full-screen app on phones
  components/
    Window.tsx         the one reusable window: drag, bring-to-front, keyboard move, Esc to close
    Desktop.tsx        icons + windows + focus return on close
    Taskbar.tsx        start menu, open windows, clock (owner's timezone)
    MobileOS.tsx       phone layout below 768px, back button wired to browser history
    BootScreen.tsx     ~1.5s fake boot, skippable, once per session
    PixelIcon.tsx      16x16 sprites drawn from character grids
  apps/                About, Projects, ProjectDetail, Stack, Contact, Trash
```

### Accessibility

- Desktop icons: click selects, double-click opens; **Tab + Enter** opens from the keyboard.
- Windows: focus moves in on open and back to the opener on close. **Esc** closes.
  Focus a title bar and use **arrow keys** to move the window (Shift for bigger steps), so dragging is never required.
- Start menu: arrow keys, Home/End, Esc returns focus to Start.
- `prefers-reduced-motion` turns off animations; one yellow focus ring is used everywhere.

## Next up (extras from the plan)

- [ ] Terminal window (`help`, `whoami`, `ls projects`, `open flames`)
- [ ] Day/night theme + CRT scanline toggle (all colors are already CSS variables in `src/index.css`)
- [ ] Music player with royalty-free lo-fi
- [ ] Save wallpaper/theme in localStorage
- [ ] Games folder easter egg (FLAMES)
