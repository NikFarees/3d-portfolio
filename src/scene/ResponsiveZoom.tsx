import { useLayoutEffect } from 'react'
import { useThree } from '@react-three/fiber'
import type * as THREE from 'three'
import { useStore } from '../store/useStore'
import { DEFAULT_CAMERA } from './Scene'

// At zoom 55 the room + garden span ~720px wide and ~430px tall on screen.
// Below these viewport baselines we shrink the zoom so the scene still fits.
const BASE_W = 850
const BASE_H = 620

let factor = 1
export const getZoomFactor = () => factor

// Watches the canvas size and rescales the ortho zoom so the whole room
// stays in frame on narrow (mobile portrait) and short (landscape) screens.
export function ResponsiveZoom() {
  const size = useThree((s) => s.size)
  const camera = useThree((s) => s.camera) as THREE.OrthographicCamera

  useLayoutEffect(() => {
    factor = Math.min(1, size.width / BASE_W, size.height / BASE_H)
    if (import.meta.env.DEV) {
      // exposed for browser-automation tests
      ;(window as unknown as Record<string, unknown>).__camera = camera
    }
    const { focusedId, isTransitioning } = useStore.getState()
    // Mid-tween or focused, CameraRig owns the zoom; it picks up the new
    // factor on its next move.
    if (!focusedId && !isTransitioning) {
      camera.zoom = DEFAULT_CAMERA.zoom * factor
      camera.updateProjectionMatrix()
    }
  }, [size.width, size.height, camera])

  return null
}
