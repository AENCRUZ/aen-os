import { useState } from 'react'
import { PixelIcon } from '../components/PixelIcon'
import { links, profile } from '../data/content'

export function Contact() {
  const [status, setStatus] = useState('')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setStatus('Copied to clipboard!')
    } catch {
      setStatus(`Couldn't copy. The address is ${profile.email}`)
    }
    window.setTimeout(() => setStatus(''), 2500)
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-3">
        <PixelIcon name="contact" size={48} className="shrink-0" />
        <p>Inbox is open. Questions, collabs or just a hello all welcome.</p>
      </div>

      <div className="px-inset mt-4 p-3">
        <p className="font-pixel text-[11px] text-muted-fg">EMAIL</p>
        <p className="mt-1 break-all text-accent">{profile.email}</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="px-btn inline-flex min-h-11 items-center px-4 no-underline"
          >
            Write an email
          </a>
          <button type="button" className="px-btn min-h-11 px-4" onClick={copy}>
            Copy address
          </button>
        </div>
        <p role="status" aria-live="polite" className="mt-2 min-h-7 text-accent">
          {status}
        </p>
      </div>

      <ul className="mt-4 flex flex-col gap-2">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="px-btn flex min-h-11 items-center justify-between gap-3 px-3 no-underline"
            >
              <span>{l.label}</span>
              <span className="truncate text-muted-fg">
                {l.handle} <span aria-hidden="true">↗</span>
              </span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
