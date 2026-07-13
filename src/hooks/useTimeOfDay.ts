import { useEffect, useState } from 'react'
import type { DayPhase } from '../types'

// Dev override: append ?hour=22 to preview a phase without changing the clock.
export function currentHour(): number {
  const param = new URLSearchParams(window.location.search).get('hour')
  if (param !== null) {
    const h = Number(param)
    if (Number.isFinite(h) && h >= 0 && h <= 23) return h
  }
  return new Date().getHours()
}

export function phaseFor(hour: number): DayPhase {
  if (hour >= 7 && hour < 17) return 'day'
  if (hour >= 17 && hour < 20) return 'evening'
  return 'night'
}

export function useTimeOfDay(): DayPhase {
  const [phase, setPhase] = useState<DayPhase>(() => phaseFor(currentHour()))

  useEffect(() => {
    const check = () => setPhase(phaseFor(currentHour()))
    const id = setInterval(check, 60_000)
    document.addEventListener('visibilitychange', check)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', check)
    }
  }, [])

  return phase
}
