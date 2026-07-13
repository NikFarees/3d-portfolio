import { create } from 'zustand'
import type { FocusableId } from '../types'
import { currentHour, phaseFor } from '../hooks/useTimeOfDay'

// Visiting at night? The lamps greet you already lit.
const startsAtNight = phaseFor(currentHour()) === 'night'

interface PortfolioState {
  focusedId: FocusableId | null
  modalId: FocusableId | null
  isTransitioning: boolean
  lampOn: boolean
  standLampOn: boolean
  wallLampOn: boolean
  clockBubble: string | null

  focusObject: (id: FocusableId) => void
  closeModal: () => void
  setModalId: (id: FocusableId | null) => void
  setTransitioning: (v: boolean) => void
  toggleLamp: () => void
  toggleStandLamp: () => void
  toggleWallLamp: () => void
  showClockBubble: (text: string) => void
  hideClockBubble: () => void
}

let clockTimeout: ReturnType<typeof setTimeout> | undefined

export const useStore = create<PortfolioState>()((set, get) => ({
  focusedId: null,
  modalId: null,
  isTransitioning: false,
  lampOn: startsAtNight,
  standLampOn: startsAtNight,
  wallLampOn: startsAtNight,
  clockBubble: null,

  focusObject: (id) => {
    const { isTransitioning, focusedId } = get()
    if (isTransitioning || focusedId) return
    set({ focusedId: id, isTransitioning: true })
  },

  closeModal: () => {
    const { isTransitioning, focusedId } = get()
    if (isTransitioning || !focusedId) return
    set({ modalId: null, focusedId: null, isTransitioning: true })
  },

  setModalId: (id) => set({ modalId: id }),
  setTransitioning: (v) => set({ isTransitioning: v }),
  toggleLamp: () => set((s) => ({ lampOn: !s.lampOn })),
  toggleStandLamp: () => set((s) => ({ standLampOn: !s.standLampOn })),
  toggleWallLamp: () => set((s) => ({ wallLampOn: !s.wallLampOn })),

  showClockBubble: (text) => {
    clearTimeout(clockTimeout)
    set({ clockBubble: text })
    clockTimeout = setTimeout(() => set({ clockBubble: null }), 4000)
  },

  hideClockBubble: () => {
    clearTimeout(clockTimeout)
    set({ clockBubble: null })
  },
}))

if (import.meta.env.DEV) {
  // exposed for browser-automation tests
  ;(window as unknown as Record<string, unknown>).__store = useStore
}
