import { useState } from 'react'
import { BootScreen } from './components/BootScreen'
import { Desktop } from './components/Desktop'
import { MobileOS } from './components/MobileOS'
import { useMediaQuery } from './hooks/useMediaQuery'

const BOOTED_KEY = 'aenos:booted'

function alreadyBooted() {
  try {
    return sessionStorage.getItem(BOOTED_KEY) === '1'
  } catch {
    return false
  }
}

export default function App() {
  // Boot once per browser session; reloads go straight to the desktop.
  const [booted, setBooted] = useState(alreadyBooted)
  const [welcome, setWelcome] = useState(!booted)
  const [session, setSession] = useState(0)
  // Dragging windows on a phone is miserable: small screens get a phone OS instead.
  const isPhone = useMediaQuery('(max-width: 767px)')

  const finishBoot = () => {
    try {
      sessionStorage.setItem(BOOTED_KEY, '1')
    } catch {
      /* private mode etc. */
    }
    setBooted(true)
  }

  const restart = () => {
    setWelcome(true)
    setBooted(false)
    setSession((s) => s + 1) // fresh desktop, all windows closed
  }

  return (
    <>
      {!booted && <BootScreen onDone={finishBoot} />}
      {booted &&
        (isPhone ? <MobileOS key={session} /> : <Desktop key={session} onRestart={restart} welcome={welcome} />)}
    </>
  )
}
