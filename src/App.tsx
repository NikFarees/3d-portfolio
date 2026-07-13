import { useEffect } from 'react'
import { Scene } from './scene/Scene'
import { ModalRoot } from './ui/ModalRoot'
import { DoodleOverlay } from './ui/DoodleOverlay'
import { useStore } from './store/useStore'

export default function App() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') useStore.getState().closeModal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="app">
      <Scene />
      <DoodleOverlay />
      <ModalRoot />
    </div>
  )
}
