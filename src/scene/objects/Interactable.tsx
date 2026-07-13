import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { Html, useCursor } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import type { FocusableId } from '../../types'
import { SpeechBubble } from '../../ui/SpeechBubble'

type InteractableProps = {
  label?: string
  /** Bubble anchor, local to this group. */
  labelOffset?: [number, number, number]
  position?: [number, number, number]
  children: ReactNode
} & (
  | { id: FocusableId; onActivate?: never } // focuses camera + opens modal
  | { id?: never; onActivate: () => void } // easter-egg toggle
)

export function Interactable({
  label,
  labelOffset = [0, 0.6, 0],
  position,
  children,
  ...action
}: InteractableProps) {
  const group = useRef<THREE.Group>(null!)
  const [hovered, setHovered] = useState(false)
  const focusedId = useStore((s) => s.focusedId)
  useCursor(hovered && !focusedId)

  // Subtle hover feedback: the whole group breathes up ~4%.
  useFrame((_, delta) => {
    const target = hovered && !focusedId ? 1.04 : 1
    const s = THREE.MathUtils.damp(group.current.scale.x, target, 12, delta)
    group.current.scale.setScalar(s)
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    const { isTransitioning, focusedId, focusObject } = useStore.getState()
    if (isTransitioning) return
    if (action.id !== undefined) {
      if (focusedId) return
      focusObject(action.id)
      setHovered(false)
    } else {
      action.onActivate()
    }
  }

  return (
    <group
      ref={group}
      position={position}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      {children}
      {label && hovered && !focusedId && (
        <Html
          position={labelOffset}
          center
          zIndexRange={[10, 0]}
          style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}
        >
          <SpeechBubble text={label} />
        </Html>
      )}
    </group>
  )
}

/** Invisible enlarged hitbox for small/thin targets (medals, clock). */
export function HitBox({
  size,
  position,
}: {
  size: [number, number, number]
  position?: [number, number, number]
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}
