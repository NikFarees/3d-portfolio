import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useAnimations, useCursor, useGLTF, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import { SpeechBubble } from '../../ui/SpeechBubble'

// "Toon Cat FREE" by Omabuarts Studio (CC-BY-4.0) — single clip is a walk
// cycle. The cat wanders between waypoints on the open floor, pausing
// between trips. Clicking it plays a meow and a short startled hop.
const CAT_PATH = '/models/cat.glb'
useGLTF.preload(CAT_PATH)

// Open-floor waypoints (clear of bed, desk, walls).
const WAYPOINTS: [number, number][] = [
  [-1.5, 1.5],
  [0.8, 2.2],
  [2.2, 1.2],
  [0.2, 0.2],
  [-2.0, 2.6],
  [-0.8, -1.6],
  [1.4, 2.8],
  [-2.4, 0.4],
]

const SPEED = 0.55 // m/s
const TURN_SPEED = 5 // rad/s damp
const MEOW_MS = 1200

function pickNext(current: THREE.Vector3): THREE.Vector3 {
  let candidate: [number, number]
  do {
    candidate = WAYPOINTS[Math.floor(Math.random() * WAYPOINTS.length)]
  } while (
    Math.hypot(candidate[0] - current.x, candidate[1] - current.z) < 1.2
  )
  return new THREE.Vector3(candidate[0], 0, candidate[1])
}

function WanderingCat() {
  const group = useRef<THREE.Group>(null!)
  const { scene, animations } = useGLTF(CAT_PATH)
  const { actions, mixer } = useAnimations(animations, group)
  const [hovered, setHovered] = useState(false)
  const [meowing, setMeowing] = useState(false)
  useCursor(hovered)

  const audio = useMemo(() => new Audio('/sounds/meow.mp3'), [])
  const meowTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  // walking state machine kept in refs (no re-renders at 60fps)
  const state = useRef({
    mode: 'idle' as 'idle' | 'walking' | 'meowing',
    target: new THREE.Vector3(WAYPOINTS[1][0], 0, WAYPOINTS[1][1]),
    idleUntil: 1.5, // seconds of clock time when idling ends
  })

  const cloned = useMemo(() => {
    const c = scene
    c.traverse((o) => {
      o.castShadow = true
      o.receiveShadow = false
    })
    return c
  }, [scene])

  useEffect(() => {
    const action = actions[Object.keys(actions)[0]!]
    action?.play()
    return () => {
      clearTimeout(meowTimer.current)
    }
  }, [actions])

  useFrame(({ clock }, delta) => {
    const s = state.current
    const g = group.current
    const walkAction = actions[Object.keys(actions)[0]!]
    if (!walkAction) return

    if (s.mode === 'meowing') {
      mixer.timeScale = 0
      return
    }

    if (s.mode === 'idle') {
      // freeze mid-stride slowly instead of hard stop
      mixer.timeScale = THREE.MathUtils.damp(mixer.timeScale, 0.05, 6, delta)
      if (clock.elapsedTime > s.idleUntil) {
        s.target = pickNext(g.position)
        s.mode = 'walking'
      }
      return
    }

    // walking
    mixer.timeScale = THREE.MathUtils.damp(mixer.timeScale, 1, 6, delta)
    const toTarget = s.target.clone().sub(g.position)
    toTarget.y = 0
    const dist = toTarget.length()
    if (dist < 0.08) {
      s.mode = 'idle'
      s.idleUntil = clock.elapsedTime + 1.5 + Math.random() * 3
      return
    }
    const dir = toTarget.normalize()
    // face travel direction (model faces +z locally)
    const targetYaw = Math.atan2(dir.x, dir.z)
    let dYaw = targetYaw - g.rotation.y
    while (dYaw > Math.PI) dYaw -= Math.PI * 2
    while (dYaw < -Math.PI) dYaw += Math.PI * 2
    g.rotation.y += dYaw * Math.min(1, TURN_SPEED * delta)
    // only advance when roughly facing the right way
    if (Math.abs(dYaw) < 0.6) {
      g.position.addScaledVector(dir, SPEED * delta)
    }
  })

  const meow = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    if (useStore.getState().focusedId) return
    if (state.current.mode === 'meowing') return
    state.current.mode = 'meowing'
    setMeowing(true)
    audio.currentTime = 0
    void audio.play().catch(() => {})
    clearTimeout(meowTimer.current)
    meowTimer.current = setTimeout(() => {
      state.current.mode = 'idle'
      state.current.idleUntil = 0 // resume immediately
      setMeowing(false)
    }, MEOW_MS)
  }

  return (
    <group
      ref={group}
      position={[0.8, 0, 2.2]}
      onClick={meow}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      <primitive object={cloned} scale={0.0016} />
      {meowing && (
        <Html
          position={[0, 0.95, 0]}
          center
          zIndexRange={[10, 0]}
          style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}
        >
          <SpeechBubble
            text="Meow!"
            onClose={() => {
              clearTimeout(meowTimer.current)
              state.current.mode = 'idle'
              state.current.idleUntil = 0
              setMeowing(false)
            }}
          />
        </Html>
      )}
    </group>
  )
}

export function Cat() {
  return (
    <Suspense fallback={null}>
      <WanderingCat />
    </Suspense>
  )
}
