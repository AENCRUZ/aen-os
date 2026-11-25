import { useEffect, useState } from 'react'
import { profile } from '../data/content'

const timeFmt = new Intl.DateTimeFormat('en-US', {
  timeZone: profile.timezone,
  hour: 'numeric',
  minute: '2-digit',
})
const fullFmt = new Intl.DateTimeFormat('en-US', {
  timeZone: profile.timezone,
  dateStyle: 'full',
  timeStyle: 'short',
})

/** Clock in the owner's timezone (not the visitor's), so people know when you're awake. */
export function Clock({ className = '' }: { className?: string }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 10_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <time
      dateTime={now.toISOString()}
      title={`${fullFmt.format(now)} in ${profile.location}`}
      className={className}
    >
      {timeFmt.format(now)} <span className="text-muted-fg">{profile.tzLabel}</span>
      <span className="sr-only"> ({profile.location} time)</span>
    </time>
  )
}
