import { useEffect } from 'react'
import { Loader } from '@react-three/drei'
import { Scene } from './scene/Scene'
import { ModalRoot } from './ui/ModalRoot'
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
      <ModalRoot />
      {/* progress overlay — only appears once real .glb assets are loading */}
      <Loader />
    </div>
  )
}
