/**
 * Hand-drawn 16x16 pixel icons, rendered as crisp SVG rects.
 * Each sprite is a grid of characters; each character maps to a palette color.
 * No emoji, no icon font, no image files: they scale cleanly at any size.
 */

const PALETTE: Record<string, string> = {
  k: '#05070d', // ink outline
  w: '#f8fafc', // white
  L: '#cbd5e1', // light gray
  G: '#64748b', // gray
  n: '#0f172a', // navy
  b: '#2563eb', // blue
  B: '#60a5fa', // light blue
  r: '#dc2626', // red
  g: '#22c55e', // green
  y: '#facc15', // yellow
  Y: '#fde68a', // pale yellow
  o: '#ca8a04', // dark yellow
  s: '#f5c9a0', // skin
  h: '#3f2a1d', // hair
  p: '#f9a8d4', // pink
  P: '#db2777', // deep pink
  e: '#a3e635', // cat eye
  c: '#a8b0bd', // cat gray
  C: '#6b7280', // cat stripe
}

export { PALETTE }

export const SPRITES = {
  computer: [
    '................',
    '.kkkkkkkkkkkkkk.',
    '.kbbbbbbbbbbbbk.',
    '.kbnnnnnnnnnnbk.',
    '.kbngnnnnnnnnbk.',
    '.kbnnggnnnnnnbk.',
    '.kbngnnwwwnnnbk.',
    '.kbnnnnnnnnnnbk.',
    '.kbbbbbbbbbbbbk.',
    '.kkkkkkkkkkkkkk.',
    '......kkkk......',
    '.....kbbbbk.....',
    '...kkkkkkkkkk...',
    '...krrrrrrrrk...',
    '...kkkkkkkkkk...',
    '................',
  ],
  about: [
    '................',
    '.....kkkkkk.....',
    '....khhhhhhk....',
    '...khhhhhhhhk...',
    '...khsssssshk...',
    '...kssksskssk...',
    '...kssssssssk...',
    '...ksssrrsssk...',
    '....kssssssk....',
    '.....kkkkkk.....',
    '....kbbbbbbk....',
    '...kbbbbbbbbk...',
    '..kbbbbBBbbbbk..',
    '..kbbbbbbbbbbk..',
    '..kkkkkkkkkkkk..',
    '................',
  ],
  folder: [
    '................',
    '................',
    '.kkkkkk.........',
    'kyyyyyyk........',
    'kyyyyyyykkkkkkk.',
    'kYYYYYYYYYYYYYYk',
    'kyyyyyyyyyyyyyyk',
    'kyyyyyyyyyyyyyyk',
    'kyyyyyyyyyyyyyyk',
    'kyyyyyyyyyyyyyyk',
    'kyyyyyyyyyyyyyyk',
    'kyyyyyyyyyyyyyyk',
    'kyyyyyyyyyyyyyyk',
    'kooooooooooooook',
    'kkkkkkkkkkkkkkkk',
    '................',
  ],
  stack: [
    '................',
    '.kkkkkkkkkkkkkk.',
    '.kggggggggggggk.',
    '.kgggggggggggwk.',
    '.kkkkkkkkkkkkkk.',
    '................',
    '.kkkkkkkkkkkkkk.',
    '.kbbbbbbbbbbbbk.',
    '.kbbbbbbbbbbbwk.',
    '.kkkkkkkkkkkkkk.',
    '................',
    '.kkkkkkkkkkkkkk.',
    '.krrrrrrrrrrrrk.',
    '.krrrrrrrrrrrwk.',
    '.kkkkkkkkkkkkkk.',
    '................',
  ],
  contact: [
    '................',
    '................',
    'kkkkkkkkkkkkkkkk',
    'kkwwwwwwwwwwwwkk',
    'kwkwwwwwwwwwwkwk',
    'kwwkwwwwwwwwkwwk',
    'kwwwkwwwwwwkwwwk',
    'kwwwwkwwwwkwwwwk',
    'kwwwwwkrrkwwwwwk',
    'kwwwwwwkkwwwwwwk',
    'kwwwwwwwwwwwwwwk',
    'kLLLLLLLLLLLLLLk',
    'kkkkkkkkkkkkkkkk',
    '................',
    '................',
    '................',
  ],
  trash: [
    '................',
    '......kkkk......',
    '..kkkkkGGkkkkk..',
    '..kLLLLLLLLLLk..',
    '..kkkkkkkkkkkk..',
    '...kLLLLLLLLk...',
    '...kLGLGLGLGk...',
    '...kLGLGLGLGk...',
    '...kLGLGLGLGk...',
    '...kLGLGLGLGk...',
    '...kLGLGLGLGk...',
    '...kLGLGLGLGk...',
    '...kLGLGLGLGk...',
    '...kLLLLLLLLk...',
    '....kkkkkkkk....',
    '................',
  ],
  file: [
    '................',
    '..kkkkkkkkk.....',
    '..kwwwwwwwkk....',
    '..kwwwwwwwkLk...',
    '..kwwwwwwwkkkk..',
    '..kwwwwwwwwwwk..',
    '..kwGGGGGGGwwk..',
    '..kwwwwwwwwwwk..',
    '..kwGGGGGGwwwk..',
    '..kwwwwwwwwwwk..',
    '..kwGGGGGGGGwk..',
    '..kwwwwwwwwwwk..',
    '..kwGGGGwwwwwk..',
    '..kwwwwwwwwwwk..',
    '..kkkkkkkkkkkk..',
    '................',
  ],
  toybox: [
    '................',
    '.....kkkk.......',
    '....kpPppk......',
    '...kpppPppk.....',
    '...kpPppPpk.....',
    '.kkkkkkkkkkkkkk.',
    '.kyyyyyyyyyyyyk.',
    '.kooooooooooook.',
    '.kyyyyyyyyyyyyk.',
    '.kyyyykkkkyyyyk.',
    '.kyyyykyykyyyyk.',
    '.kyyyykkkkyyyyk.',
    '.kyyyyyyyyyyyyk.',
    '.kooooooooooook.',
    '.kkkkkkkkkkkkkk.',
    '................',
  ],
  // "a" is swapped for the project's accent color
  app: [
    '................',
    'kkkkkkkkkkkkkkkk',
    'kaaaaaaaaaaaarrk',
    'kkkkkkkkkkkkkkkk',
    'knnnnnnnnnnnnnnk',
    'knannnnnnnnnnnnk',
    'knnaannnnnnnnnnk',
    'knannwwwwnnnnnnk',
    'knnnnnnnnnnnnnnk',
    'knnnnnnnnnnnnnnk',
    'knaaaaaannnnnnnk',
    'knaaaaaaaaaannnk',
    'knaaaaannnnnnnnk',
    'knnnnnnnnnnnnnnk',
    'kkkkkkkkkkkkkkkk',
    '................',
  ],
} as const

export type SpriteName = keyof typeof SPRITES

interface PixelIconProps {
  name: SpriteName
  size?: number
  accent?: string
  className?: string
}

/** Render any character-grid sprite as merged, crisp SVG rects. */
export function Sprite({
  rows,
  palette = PALETTE,
  accent = '#22c55e',
  scale,
  size,
  className,
  style,
}: {
  rows: readonly string[]
  palette?: Record<string, string>
  accent?: string
  /** px per art pixel (sets width and height from the grid) */
  scale?: number
  /** square size in px (for 16x16 icons) */
  size?: number
  className?: string
  style?: React.CSSProperties
}) {
  const w = Math.max(...rows.map((r) => r.length))
  const h = rows.length
  const rects: React.ReactElement[] = []
  rows.forEach((row, y) => {
    // merge horizontal runs of the same color into one rect: fewer DOM nodes
    let x = 0
    while (x < row.length) {
      const ch = row[x]
      let run = 1
      while (x + run < row.length && row[x + run] === ch) run++
      if (ch !== '.') {
        const fill = ch === 'a' ? accent : palette[ch]
        if (fill) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={run} height={1} fill={fill} />)
      }
      x += run
    }
  })
  return (
    <svg
      width={scale ? w * scale : size}
      height={scale ? h * scale : size}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={style}
    >
      {rects}
    </svg>
  )
}

export function PixelIcon({ name, size = 32, accent = '#22c55e', className }: PixelIconProps) {
  return <Sprite rows={SPRITES[name]} size={size} accent={accent} className={className} />
}
