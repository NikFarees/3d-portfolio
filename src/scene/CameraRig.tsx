import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { useStore } from '../store/useStore'
import { FOCUS_POINTS, CAMERA_OFFSET } from '../config/focusPoints'
import { DEFAULT_CAMERA } from './Scene'

// Drives all camera moves with GSAP. Watches focusedId: non-null → zoom to
// its focus point, null → return to the default pose. OrbitControls are
// disabled while a tween runs and re-synced via controls.update().
export function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.OrthographicCamera
  const controls = useThree((s) => s.controls) as OrbitControlsImpl | null
  const focusedId = useStore((s) => s.focusedId)
  const timeline = useRef<gsap.core.Timeline | null>(null)
  const started = useRef(false)

  useEffect(() => {
    if (!controls) return
    // Skip the initial render — the camera already sits at the default pose.
    if (!started.current) {
      started.current = true
      if (!focusedId) return
    }

    const { setTransitioning, setModalId } = useStore.getState()
    const toFocus = focusedId !== null
    const target = toFocus
      ? FOCUS_POINTS[focusedId].target
      : DEFAULT_CAMERA.target
    const zoom = toFocus ? FOCUS_POINTS[focusedId].zoom : DEFAULT_CAMERA.zoom
    const position = toFocus
      ? [
          target[0] + CAMERA_OFFSET[0],
          target[1] + CAMERA_OFFSET[1],
          target[2] + CAMERA_OFFSET[2],
        ]
      : DEFAULT_CAMERA.position

    controls.enabled = false
    timeline.current?.kill()

    const tl = gsap.timeline({
      defaults: { duration: 1.1, ease: 'power2.inOut' },
      onUpdate: () => {
        camera.updateProjectionMatrix()
        controls.update()
      },
      onComplete: () => {
        setTransitioning(false)
        if (toFocus) {
          setModalId(focusedId)
        } else {
          controls.enabled = true
        }
      },
    })
    tl.to(camera.position, { x: position[0], y: position[1], z: position[2] }, 0)
      .to(controls.target, { x: target[0], y: target[1], z: target[2] }, 0)
      .to(camera, { zoom }, 0)
    timeline.current = tl

    return () => {
      tl.kill()
    }
  }, [focusedId, camera, controls])

  return null
}
