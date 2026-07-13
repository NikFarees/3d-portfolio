import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Interactable, HitBox } from './Interactable'
import { useStore } from '../../store/useStore'
import { COLORS } from '../materials'
import type { CatPose } from '../../types'

// Per-pose targets for the primitive cat. When a real GLB with animation
// clips replaces this, swap the useFrame lerp for drei useAnimations keyed
// by the same `catPose` store value.
const POSE: Record<
  CatPose,
  { body: [number, number, number]; head: [number, number, number] }
> = {
  loaf: { body: [1, 0.62, 1.3], head: [0.3, 0.26, 0.34] },
  curled: { body: [1.06, 0.44, 1.02], head: [0.16, 0.14, 0.22] },
}

function CatPrimitive() {
  const body = useRef<THREE.Mesh>(null!)
  const head = useRef<THREE.Group>(null!)

  useFrame((_, delta) => {
    const target = POSE[useStore.getState().catPose]
    const b = body.current.scale
    b.x = THREE.MathUtils.damp(b.x, target.body[0], 6, delta)
    b.y = THREE.MathUtils.damp(b.y, target.body[1], 6, delta)
    b.z = THREE.MathUtils.damp(b.z, target.body[2], 6, delta)
    const h = head.current.position
    h.x = THREE.MathUtils.damp(h.x, target.head[0], 6, delta)
    h.y = THREE.MathUtils.damp(h.y, target.head[1], 6, delta)
    h.z = THREE.MathUtils.damp(h.z, target.head[2], 6, delta)
  })

  return (
    <group>
      {/* body */}
      <mesh ref={body} castShadow position={[0, 0.14, 0]}>
        <sphereGeometry args={[0.26, 16, 16]} />
        <meshStandardMaterial color={COLORS.catGrey} roughness={1} />
      </mesh>
      {/* head + ears */}
      <group ref={head} position={[0.3, 0.26, 0.34]}>
        <mesh castShadow>
          <sphereGeometry args={[0.14, 14, 14]} />
          <meshStandardMaterial color={COLORS.catGrey} roughness={1} />
        </mesh>
        <mesh castShadow position={[-0.05, 0.12, 0.04]} rotation={[0, 0, 0.2]}>
          <coneGeometry args={[0.04, 0.08, 6]} />
          <meshStandardMaterial color={COLORS.catGrey} roughness={1} />
        </mesh>
        <mesh castShadow position={[0.05, 0.12, -0.04]} rotation={[0, 0, -0.2]}>
          <coneGeometry args={[0.04, 0.08, 6]} />
          <meshStandardMaterial color={COLORS.catGrey} roughness={1} />
        </mesh>
      </group>
      {/* tail wrapped around the body */}
      <mesh castShadow position={[-0.08, 0.06, 0.02]} rotation={[Math.PI / 2, 0, 0.6]}>
        <torusGeometry args={[0.24, 0.045, 8, 18, 4.2]} />
        <meshStandardMaterial color="#7c7468" roughness={1} />
      </mesh>
    </group>
  )
}

export function Cat() {
  const toggleCatPose = useStore((s) => s.toggleCatPose)
  return (
    <Interactable onActivate={toggleCatPose} position={[1.75, 0.7, -1.35]}>
      <HitBox size={[0.9, 0.55, 0.9]} position={[0, 0.2, 0]} />
      <CatPrimitive />
    </Interactable>
  )
}
