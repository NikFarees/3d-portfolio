import { create } from 'zustand'
import type { CatPose, FocusableId } from '../types'

interface PortfolioState {
  focusedId: FocusableId | null
  modalId: FocusableId | null
  isTransitioning: boolean
  lampOn: boolean
  catPose: CatPose
  clockBubble: string | null

  focusObject: (id: FocusableId) => void
  closeModal: () => void
  setModalId: (id: FocusableId | null) => void
  setTransitioning: (v: boolean) => void
  toggleLamp: () => void
  toggleCatPose: () => void
  showClockBubble: (text: string) => void
}

let clockTimeout: ReturnType<typeof setTimeout> | undefined

export const useStore = create<PortfolioState>()((set, get) => ({
  focusedId: null,
  modalId: null,
  isTransitioning: false,
  lampOn: false,
  catPose: 'loaf',
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
  toggleCatPose: () =>
    set((s) => ({ catPose: s.catPose === 'loaf' ? 'curled' : 'loaf' })),

  showClockBubble: (text) => {
    clearTimeout(clockTimeout)
    set({ clockBubble: text })
    clockTimeout = setTimeout(() => set({ clockBubble: null }), 3000)
  },
}))
