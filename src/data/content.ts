/**
 * ─────────────────────────────────────────────────────────────
 *  EDIT ME. Everything personal on the site lives in this file.
 * ─────────────────────────────────────────────────────────────
 */

export const profile = {
  name: 'Angelyn Cruzat',
  short: 'Aen',
  handle: '@AENCRUZ',
  role: 'Computer Science student · Batangas State University',
  location: 'Batangas, PH',
  timezone: 'Asia/Manila', // used by the taskbar clock
  tzLabel: 'PHT',
  bio: [
    "Hi, I'm Aen! I'm a CS student who likes building things people can actually use, from web apps with real backends to desktop apps with a lot of personality.",
    "So far that's meant an AI-assisted skin health tool, a virtual pet that keeps you productive, and an arcade take on the FLAMES game. This site is the newest one: a tiny OS you can poke around in.",
  ],
  now: 'Building aen.os, one window at a time.',
  email: 'angelyncruzat123@gmail.com',
}

export interface Project {
  slug: string
  name: string
  year: string
  tagline: string
  description: string[]
  highlights: string[]
  stack: string[]
  accent: string
  /** Paths under /public. Leave empty for a placeholder frame. */
  screenshots: { src: string; alt: string }[]
  links: { label: string; href: string }[]
}

export const projects: Project[] = [
  {
    slug: 'skinsight',
    name: 'SkinSight',
    year: 'Academic project',
    tagline: 'AI-assisted skin health preparation tool.',
    description: [
      'SkinSight helps people document a skin concern, turn it into a summary they can bring to a dermatologist, find listed clinics and keep a personal medication list.',
      "It organizes, it never diagnoses: the AI assistant is instructed not to name conditions or recommend medicine, and a second automatic check on its replies enforces that.",
    ],
    highlights: [
      'Gemini-powered intake chat with retrieval over a curated knowledge base',
      'Consultation summary with TXT and PDF download',
      'Supabase auth (email + Google) and saved history with row-level security',
      'Medication tracker that syncs to Postgres or works offline as a guest',
      'Dermatologist finder with map search (Batangas clinics)',
    ],
    stack: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Express', 'Supabase', 'Gemini API', 'Render'],
    accent: '#0e7bc4',
    screenshots: [{ src: 'projects/skinsight.webp', alt: 'SkinSight home page: "Understand your skin. Prepare for better care."' }],
    links: [
      { label: 'Live site', href: 'https://aencruz.github.io/SkinSight/' },
      { label: 'Source', href: 'https://github.com/AENCRUZ/SkinSight' },
    ],
  },
  {
    slug: 'pawductivity',
    name: 'Pawductivity',
    year: 'CS 222 · Team LAVA',
    tagline: 'A digital pet productivity system.',
    description: [
      'A gamified to-do app for Windows. You adopt a cat or a dog, and your tasks decide how it does: finish them and it gains XP, mood, health and coins; let them go overdue and it suffers.',
      'Built as a team project for Advanced Object-Oriented Programming at Batangas State University.',
    ],
    highlights: [
      'Pet stats, levels and evolution driven by task completion',
      'Animated pet reactions, floating stat changes and coin effects',
      'Shop items and six switchable dashboard themes',
    ],
    stack: ['C#', '.NET 8 WinForms', 'Visual Studio'],
    accent: '#e8508a',
    screenshots: [{ src: 'projects/pawductivity.webp', alt: 'Pawductivity title screen with a puppy and a kitten, Start and Quit buttons' }],
    links: [{ label: 'Source', href: 'https://github.com/AENCRUZ/Pawductivity' }],
  },
  {
    slug: 'flames',
    name: 'FLAMES',
    year: 'Web game',
    tagline: 'The classic Filipino love game, as a retro arcade level.',
    description: [
      'Enter two names, watch the matching letters get cleared like an arcade puzzle, then face the FLAMES "final boss" countdown as the game reveals your result.',
    ],
    highlights: [
      'Animated letter cancellation and elimination countdown',
      'Three arcade-cabinet themes: Mario World, Pac-Man, Space Invaders',
      'NES-style sound effects generated with the Web Audio API',
      'Love History saved in localStorage, copy-to-share results',
      'Mobile responsive, with reduced-motion support',
    ],
    stack: ['HTML', 'CSS', 'JavaScript'],
    accent: '#e63946',
    screenshots: [{ src: 'projects/flames.webp', alt: 'FLAMES start screen: pixel title, "Insert two names to begin quest", Press Start button' }],
    links: [
      { label: 'Play it', href: 'https://aencruz.github.io/flames-love-calculator/' },
      { label: 'Source', href: 'https://github.com/AENCRUZ/flames-love-calculator' },
    ],
  },
  {
    slug: 'aen-os',
    name: 'aen.os',
    year: '2026',
    tagline: "The thing you're looking at right now.",
    description: [
      'A portfolio shaped like a retro desktop: a reusable window system with dragging, focus order and minimizing, a taskbar wired to the same state, and a separate phone layout for small screens.',
    ],
    highlights: [
      'Everything works from the keyboard, including moving windows',
      'Motion steps aside when reduced motion is on',
    ],
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'GitHub Pages'],
    accent: '#22c55e',
    screenshots: [
      {
        src: 'projects/aen-os.webp',
        alt: 'The aen.os desktop: pixel icons for About, Projects, Stack, Contact, Toy Box and Trash, with Mochi the cat sitting near the taskbar',
      },
    ],
    links: [{ label: 'Source', href: 'https://github.com/AENCRUZ' }],
  },
]

export interface StackItem {
  name: string
  /** badge color, used as a swatch beside the name */
  color: string
}

export const stack: { group: string; items: StackItem[] }[] = [
  {
    group: 'Languages',
    items: [
      { name: 'Java', color: '#ed8b00' },
      { name: 'C#', color: '#512bd4' },
      { name: 'Python', color: '#3776ab' },
      { name: 'JavaScript', color: '#f7df1e' },
      { name: 'HTML', color: '#e34f26' },
      { name: 'CSS', color: '#1572b6' },
      { name: 'SQL', color: '#336791' },
    ],
  },
  {
    group: 'Frameworks & data',
    items: [
      { name: '.NET 8 WinForms', color: '#512bd4' },
      { name: 'Node.js', color: '#339933' },
      { name: 'Express', color: '#f8fafc' },
      { name: 'Tkinter', color: '#3776ab' },
      { name: 'MySQL', color: '#4479a1' },
      { name: 'Supabase', color: '#3ecf8e' },
    ],
  },
  {
    group: 'Tools & hosting',
    items: [
      { name: 'Git', color: '#f05032' },
      { name: 'GitHub', color: '#f8fafc' },
      { name: 'GitHub Pages', color: '#94a3b8' },
      { name: 'Render', color: '#f8fafc' },
      { name: 'VS Code', color: '#007acc' },
      { name: 'Visual Studio', color: '#5c2d91' },
    ],
  },
]

export const links: { label: string; href: string; handle: string }[] = [
  { label: 'GitHub', href: 'https://github.com/AENCRUZ', handle: 'github.com/AENCRUZ' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/angelyn-cruzat-3ab330388/',
    handle: 'in/angelyn-cruzat',
  },
]

export interface TrashFile {
  name: string
  size: string
  deleted: string
  body: string
}

export const trash: TrashFile[] = [
  {
    name: 'motivation.exe',
    size: '0 KB',
    deleted: 'every Monday',
    body: `C:\\> motivation.exe

ERROR 0x000COFFEE
motivation.exe could not start because coffee.dll was not found.

Try:
  1. Reinstalling coffee
  2. Going outside for five minutes
  3. Shipping it anyway

Press any key to pretend this never happened.`,
  },
  {
    name: 'final_FINAL_v3_real.css',
    size: '84 KB',
    deleted: 'last week',
    body: `/* final_FINAL_v3_real.css */

.button {
  color: red !important;
  color: blue !important;   /* client said red */
  color: red !important;    /* client said blue */
  margin-left: -3px;        /* do not touch. it works. */
}

/* TODO: learn flexbox */
/* UPDATE: learned flexbox */
/* UPDATE: learned grid, flexbox is dead to me */`,
  },
]
