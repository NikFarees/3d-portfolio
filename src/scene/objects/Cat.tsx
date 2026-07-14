import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { useAnimations, useCursor, useGLTF, Html } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { useStore } from '../../store/useStore'
import { SpeechBubble } from '../../ui/SpeechBubble'

// "Toon Cat FREE" by Omabuarts Studio (CC-BY-4.0) — single clip is a walk
// cycle. The cat wanders between waypoints on the open floor, pausing
// between trips. Clicking it plays a meow and a short startled hop.
//
// It can also be picked up and dropped anywhere — floor or bed. While held
// it tips back like a kitten lifted by the scruff (walk frozen mid-stride,
// gentle sway) with a shadow blob tracking the drop point. On the bed it
// snuggles (lies on its side), pads around the mattress, or hops off; every
// so often it hops up there on its own.
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

const SPEED = 0.55 // m/s on the floor
const BED_SPEED = 0.3 // m/s padding around on the mattress
const TURN_SPEED = 5 // rad/s damp
const MEOW_MS = 1200

// Drag: pointer must travel this many screen px before a press counts as a
// pick-up rather than a click (click still meows).
const DRAG_THRESHOLD_PX = 5
const LIFT_HEIGHT = 0.55
// Mid-air pose while held: slight nose-down pitch with the walk cycle
// frozen at a legs-gathered frame, like a cat bracing to land.
const HOLD_TILT = 0.35 // radians, nose down
const HOLD_POSE_PHASE = 0.25 // fraction of the walk clip to freeze at
const FLOOR_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
// plane through the duvet top — lets the drag ray land on the bed surface
// the cursor is visually over, instead of the floor point hidden behind it
const BED_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.78)

// Room floor is an 8x8 square centered at the origin (see Room.tsx). Keep
// the cat well inside the walls regardless of viewport/frame-rate — a big
// delta (e.g. a mobile tab resuming from background) could otherwise let
// one frame's step overshoot a waypoint and carry it through a wall.
const ROOM_MIN = -3.6
const ROOM_MAX = 3.6

function clampToRoom(pos: THREE.Vector3) {
  pos.x = THREE.MathUtils.clamp(pos.x, ROOM_MIN, ROOM_MAX)
  pos.z = THREE.MathUtils.clamp(pos.z, ROOM_MIN, ROOM_MAX)
}

// Bed footprint (see Bed.tsx: group at [2.05,0,-2.15], platform 2.35x3.4)
// expanded by the cat's rough body radius, so it skirts the platform edge
// instead of clipping through it even when a waypoint sits close by.
const BED_BOUNDS = { minX: 0.5, maxX: 3.6, minZ: -4.2, maxZ: 0 }

// On top of the bed: duvet/mattress surface height and the patch the cat
// may occupy (mattress minus pillows, inset by body radius).
const BED_Y = 0.78
const BED_WALK = { minX: 1.25, maxX: 2.9, minZ: -3.3, maxZ: -1.0 }
// Wider mattress footprint used to decide whether a drag hovers/drops on
// the bed rather than the floor beside it.
const BED_TOP = { minX: 1.0, maxX: 3.1, minZ: -3.75, maxZ: -0.75 }

// Hop on/off the bed between these two points on its open (left) side.
const BED_APPROACH = new THREE.Vector3(0.3, 0, -1.6) // on the floor
const BED_LANDING = new THREE.Vector3(1.55, BED_Y, -1.6) // on the duvet
const JUMP_DUR = 0.55 // s
const JUMP_PEAK = 0.45 // arc height above the higher endpoint

// While snuggling the rigged walk-cycle model (no sleep clip exists) swaps
// for a curled-up low-poly ball — body, tucked head, ears, wrapped tail —
// matching the room's primitive style, with a slow breathing pulse.
const CAT_ORANGE = '#d98c50'
const CAT_ORANGE_DARK = '#c2743a'
const CAT_EAR_PINK = '#e8b08a'

function keepClearOfBed(pos: THREE.Vector3) {
  const { minX, maxX, minZ, maxZ } = BED_BOUNDS
  if (pos.x <= minX || pos.x >= maxX || pos.z <= minZ || pos.z >= maxZ) return
  const dLeft = pos.x - minX
  const dRight = maxX - pos.x
  const dNear = pos.z - minZ
  const dFar = maxZ - pos.z
  const min = Math.min(dLeft, dRight, dNear, dFar)
  if (min === dLeft) pos.x = minX
  else if (min === dRight) pos.x = maxX
  else if (min === dNear) pos.z = minZ
  else pos.z = maxZ
}

function overBedTop(pos: THREE.Vector3) {
  return (
    pos.x >= BED_TOP.minX &&
    pos.x <= BED_TOP.maxX &&
    pos.z >= BED_TOP.minZ &&
    pos.z <= BED_TOP.maxZ
  )
}

function clampToBedWalk(pos: THREE.Vector3) {
  pos.x = THREE.MathUtils.clamp(pos.x, BED_WALK.minX, BED_WALK.maxX)
  pos.z = THREE.MathUtils.clamp(pos.z, BED_WALK.minZ, BED_WALK.maxZ)
}

function pickNextFloor(current: THREE.Vector3): THREE.Vector3 {
  let candidate: [number, number]
  do {
    candidate = WAYPOINTS[Math.floor(Math.random() * WAYPOINTS.length)]
  } while (
    Math.hypot(candidate[0] - current.x, candidate[1] - current.z) < 1.2
  )
  return new THREE.Vector3(candidate[0], 0, candidate[1])
}

function pickNextBed(): THREE.Vector3 {
  return new THREE.Vector3(
    BED_WALK.minX + Math.random() * (BED_WALK.maxX - BED_WALK.minX),
    BED_Y,
    BED_WALK.minZ + Math.random() * (BED_WALK.maxZ - BED_WALK.minZ),
  )
}

type Mode =
  | 'idle'
  | 'walking'
  | 'meowing'
  | 'dragging'
  | 'jumping'
  | 'snuggling'

function WanderingCat() {
  const group = useRef<THREE.Group>(null!)
  const blob = useRef<THREE.Mesh>(null)
  const curled = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(CAT_PATH)
  const { actions, mixer } = useAnimations(animations, group)
  const controls = useThree((s) => s.controls) as OrbitControlsImpl | null
  const [hovered, setHovered] = useState(false)
  const [meowing, setMeowing] = useState(false)
  useCursor(hovered, 'grab')

  const audio = useMemo(() => new Audio('/sounds/meow.mp3'), [])
  const meowTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  // behavior state machine kept in refs (no re-renders at 60fps)
  const state = useRef({
    mode: 'idle' as Mode,
    surface: 'floor' as 'floor' | 'bed',
    target: new THREE.Vector3(WAYPOINTS[1][0], 0, WAYPOINTS[1][1]),
    idleUntil: 1.5, // seconds of clock time when idling ends
    // set while walking toward a point: what the arrival turns into
    trip: null as null | 'toBed' | 'offBed' | 'nap',
    // after being dropped on the bed: pad around first, then curl up
    napAfterWalk: false,
    nextBedTripAt: 14 + Math.random() * 10,
    snuggleUntil: 0,
    jump: {
      start: new THREE.Vector3(),
      end: new THREE.Vector3(),
      t: 0,
      toSurface: 'bed' as 'floor' | 'bed',
    },
  })

  const drag = useRef({
    pointerId: -1, // -1 → not dragging
    startX: 0,
    startY: 0,
    moved: false,
    posed: false, // walk clip snapped to the held pose frame
  })
  const dragHit = useMemo(() => new THREE.Vector3(), [])
  // clock.elapsedTime mirrored each frame so pointer handlers can set
  // idleUntil without access to the frame clock
  const elapsed = useRef(0)

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

  // dev-only handle for debugging/browser automation (stripped from builds)
  const camera = useThree((s) => s.camera)
  useEffect(() => {
    if (import.meta.env.DEV) {
      ;(window as unknown as Record<string, unknown>).__catDebug = {
        group: group.current,
        camera,
        state: state.current,
      }
    }
  }, [camera])

  const startJump = (end: THREE.Vector3, toSurface: 'floor' | 'bed') => {
    const s = state.current
    const g = group.current
    s.jump.start.copy(g.position)
    s.jump.end.copy(end)
    s.jump.t = 0
    s.jump.toSurface = toSurface
    s.mode = 'jumping'
    // face the leap
    const dir = end.clone().sub(g.position)
    g.rotation.y = Math.atan2(dir.x, dir.z)
  }

  useFrame(({ clock }, delta) => {
    const s = state.current
    const g = group.current
    elapsed.current = clock.elapsedTime
    const walkAction = actions[Object.keys(actions)[0]!]
    if (!walkAction) return

    const groundY = s.surface === 'bed' ? BED_Y : 0

    // --- pose: pitch (held tilt), roll (snuggle), height ---
    const held = s.mode === 'dragging' && drag.current.moved
    const hoverGroundY = held && overBedTop(g.position) ? BED_Y : held ? 0 : groundY
    const targetY =
      s.mode === 'jumping'
        ? g.position.y // jump arc owns y
        : held
          ? hoverGroundY + LIFT_HEIGHT
          : groundY
    if (s.mode !== 'jumping') {
      g.position.y = THREE.MathUtils.damp(g.position.y, targetY, 10, delta)
    }
    g.rotation.x = THREE.MathUtils.damp(
      g.rotation.x,
      held ? HOLD_TILT : 0,
      8,
      delta,
    )
    const targetRoll = held
      ? Math.sin(clock.elapsedTime * 3) * 0.07 // gentle dangling sway
      : 0
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, targetRoll, 6, delta)

    // swap the walking model for the curled-up ball while snuggling
    const snug = s.mode === 'snuggling'
    cloned.visible = !snug
    if (curled.current) curled.current.visible = snug

    // shadow blob sticks to the surface under the cat, fading in with lift
    if (blob.current) {
      blob.current.position.y = hoverGroundY + 0.02 - g.position.y
      const mat = blob.current.material as THREE.MeshBasicMaterial
      mat.opacity =
        0.22 *
        THREE.MathUtils.clamp(
          (g.position.y - hoverGroundY) / LIFT_HEIGHT,
          0,
          1,
        )
    }

    if (s.mode === 'dragging') {
      // snap the walk cycle to its legs-gathered frame and hold it
      mixer.timeScale = THREE.MathUtils.damp(mixer.timeScale, 0, 20, delta)
      if (drag.current.moved && !drag.current.posed) {
        walkAction.time = HOLD_POSE_PHASE * walkAction.getClip().duration
        drag.current.posed = true
      }
      return
    }

    if (s.mode === 'jumping') {
      mixer.timeScale = THREE.MathUtils.damp(mixer.timeScale, 0.4, 8, delta)
      s.jump.t = Math.min(1, s.jump.t + delta / JUMP_DUR)
      const t = s.jump.t
      g.position.lerpVectors(s.jump.start, s.jump.end, t)
      g.position.y +=
        (JUMP_PEAK + Math.abs(s.jump.end.y - s.jump.start.y) * 0.25) *
        4 *
        t *
        (1 - t)
      if (t >= 1) {
        s.surface = s.jump.toSurface
        s.mode = 'idle'
        if (s.surface === 'bed') {
          // usually settle straight into a snuggle after hopping up
          s.idleUntil = clock.elapsedTime + 0.4
        } else {
          s.idleUntil = clock.elapsedTime + 0.6 + Math.random() * 1.5
          s.nextBedTripAt = clock.elapsedTime + 25 + Math.random() * 25
        }
      }
      return
    }

    if (s.mode === 'meowing') {
      mixer.timeScale = 0
      return
    }

    if (s.mode === 'snuggling') {
      // fast asleep: slow breathing pulse on the curled ball
      mixer.timeScale = THREE.MathUtils.damp(mixer.timeScale, 0, 4, delta)
      if (curled.current) {
        const breathe = 1 + Math.sin(clock.elapsedTime * 1.6) * 0.04
        curled.current.scale.set(1, breathe, 1)
      }
      if (clock.elapsedTime > s.snuggleUntil) {
        s.mode = 'idle'
        s.idleUntil = clock.elapsedTime + 0.5 + Math.random()
      }
      return
    }

    if (s.mode === 'idle') {
      // freeze mid-stride slowly instead of hard stop
      mixer.timeScale = THREE.MathUtils.damp(mixer.timeScale, 0.05, 6, delta)
      if (clock.elapsedTime > s.idleUntil) {
        if (s.surface === 'floor') {
          if (clock.elapsedTime > s.nextBedTripAt) {
            // stroll over and hop onto the bed
            s.trip = 'toBed'
            s.target.copy(BED_APPROACH)
          } else {
            s.trip = null
            s.target = pickNextFloor(g.position)
          }
        } else if (s.napAfterWalk) {
          // just dropped here: pad to a comfy spot, then curl up on arrival
          s.napAfterWalk = false
          s.trip = 'nap'
          s.target = pickNextBed()
        } else {
          const roll = Math.random()
          if (roll < 0.55) {
            s.mode = 'snuggling'
            s.snuggleUntil = clock.elapsedTime + 6 + Math.random() * 8
            return
          } else if (roll < 0.85) {
            s.trip = null
            s.target = pickNextBed()
          } else {
            // pad to the edge, then hop down
            s.trip = 'offBed'
            s.target.copy(BED_LANDING)
          }
        }
        s.mode = 'walking'
      }
      return
    }

    // walking
    mixer.timeScale = THREE.MathUtils.damp(mixer.timeScale, 1, 10, delta)
    const toTarget = s.target.clone().sub(g.position)
    toTarget.y = 0
    const dist = toTarget.length()
    if (dist < 0.08) {
      if (s.trip === 'nap') {
        s.trip = null
        s.mode = 'snuggling'
        s.snuggleUntil = clock.elapsedTime + 6 + Math.random() * 8
      } else if (s.trip === 'toBed') {
        s.trip = null
        startJump(BED_LANDING, 'bed')
      } else if (s.trip === 'offBed') {
        s.trip = null
        startJump(BED_APPROACH, 'floor')
      } else {
        s.mode = 'idle'
        s.idleUntil = clock.elapsedTime + 1.5 + Math.random() * 3
      }
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
    if (Math.abs(dYaw) < 1.0) {
      const speed = s.surface === 'bed' ? BED_SPEED : SPEED
      const step = Math.min(speed * delta, dist)
      g.position.addScaledVector(dir, step)
      if (s.surface === 'bed') {
        clampToBedWalk(g.position)
      } else {
        clampToRoom(g.position)
        // walking to the hop point may legitimately hug the bed edge
        if (s.trip !== 'toBed') keepClearOfBed(g.position)
      }
    }
  })

  const meow = () => {
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

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    if (useStore.getState().focusedId) return
    if (state.current.mode === 'jumping') return
    // picking up cancels an in-flight meow or snuggle
    clearTimeout(meowTimer.current)
    setMeowing(false)
    const d = drag.current
    d.pointerId = e.pointerId
    d.startX = e.clientX
    d.startY = e.clientY
    d.moved = false
    d.posed = false
    ;(e.target as Element).setPointerCapture(e.pointerId)
    state.current.mode = 'dragging'
    state.current.trip = null
    state.current.napAfterWalk = false
    if (controls) controls.enabled = false
    document.body.style.cursor = 'grabbing'
  }

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    const d = drag.current
    if (e.pointerId !== d.pointerId) return
    e.stopPropagation()
    if (
      !d.moved &&
      Math.hypot(e.clientX - d.startX, e.clientY - d.startY) <
        DRAG_THRESHOLD_PX
    )
      return
    d.moved = true
    const g = group.current
    // prefer the bed-top surface when the cursor is visually over it
    if (
      e.ray.intersectPlane(BED_PLANE, dragHit) &&
      overBedTop(dragHit)
    ) {
      g.position.x = dragHit.x
      g.position.z = dragHit.z
    } else if (e.ray.intersectPlane(FLOOR_PLANE, dragHit)) {
      g.position.x = dragHit.x
      g.position.z = dragHit.z
      clampToRoom(g.position)
    }
  }

  const endDrag = (e: ThreeEvent<PointerEvent>) => {
    const d = drag.current
    if (e.pointerId !== d.pointerId) return
    e.stopPropagation()
    d.pointerId = -1
    ;(e.target as Element).releasePointerCapture(e.pointerId)
    if (controls) controls.enabled = true
    document.body.style.cursor = hovered ? 'grab' : 'auto'
    const s = state.current
    if (!d.moved) {
      // a press without movement is a click
      s.mode = 'idle'
      meow()
      return
    }
    // dropped: bed top → look around briefly, pad to a spot, then curl up;
    // anywhere else → floor
    const g = group.current
    if (overBedTop(g.position)) {
      clampToBedWalk(g.position)
      s.surface = 'bed'
      s.napAfterWalk = true
      s.mode = 'idle'
      s.idleUntil = elapsed.current + 0.3 + Math.random() * 0.4
      return
    }
    keepClearOfBed(g.position)
    s.surface = 'floor'
    s.mode = 'idle'
    s.idleUntil = elapsed.current + 0.2 + Math.random() * 0.5
  }

  return (
    <group
      ref={group}
      position={[0.8, 0, 2.2]}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      <primitive object={cloned} scale={0.0016} />
      {/* curled-up sleeping pose, shown only while snuggling */}
      <group ref={curled} visible={false}>
        {/* body: squashed ball */}
        <mesh castShadow position={[0, 0.16, 0]} scale={[1, 0.62, 0.92]}>
          <sphereGeometry args={[0.26, 20, 16]} />
          <meshStandardMaterial color={CAT_ORANGE} roughness={0.9} />
        </mesh>
        {/* head tucked against the body */}
        <mesh castShadow position={[0.16, 0.12, 0.16]}>
          <sphereGeometry args={[0.13, 16, 12]} />
          <meshStandardMaterial color={CAT_ORANGE} roughness={0.9} />
        </mesh>
        {/* ears */}
        <mesh castShadow position={[0.12, 0.24, 0.11]} rotation={[0, 0, 0.3]}>
          <coneGeometry args={[0.04, 0.07, 6]} />
          <meshStandardMaterial color={CAT_ORANGE_DARK} roughness={0.9} />
        </mesh>
        <mesh castShadow position={[0.24, 0.21, 0.19]} rotation={[0, 0, -0.35]}>
          <coneGeometry args={[0.04, 0.07, 6]} />
          <meshStandardMaterial color={CAT_EAR_PINK} roughness={0.9} />
        </mesh>
        {/* tail wrapped around the base */}
        <mesh castShadow position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 1.2]}>
          <torusGeometry args={[0.23, 0.05, 8, 20, Math.PI * 1.35]} />
          <meshStandardMaterial color={CAT_ORANGE_DARK} roughness={0.9} />
        </mesh>
      </group>
      <mesh ref={blob} rotation-x={-Math.PI / 2} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.32, 24]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
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
