import { stack } from '../data/content'

/** Skills as an inventory: one pixel "item slot" per tool, grouped like the badges on GitHub. */
export function Stack() {
  const total = stack.reduce((n, g) => n + g.items.length, 0)
  return (
    <div className="p-4">
      {stack.map((group) => (
        <section key={group.group} className="mb-5 last:mb-0">
          <h2 className="font-pixel mb-3 text-[11px] text-muted-fg">{group.group.toUpperCase()}</h2>
          <ul className="flex flex-wrap gap-2">
            {group.items.map((item) => (
              <li key={item.name} className="px-inset flex items-center gap-2 py-1 pr-3 pl-2 whitespace-nowrap">
                <span
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 border-2 border-ink"
                  style={{ background: item.color }}
                />
                {item.name}
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="mt-4 text-muted-fg">
        {total} items in inventory · always looking for the next one
      </p>
    </div>
  )
}
