import { useRef } from 'react'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { Interactable, HitBox } from './Interactable'
import { SwappableModel } from './SwappableModel'
import { Block } from './Block'
import { COLORS } from '../materials'
import { useStore } from '../../store/useStore'
import { SpeechBubble } from '../../ui/SpeechBubble'

const SHELF_TOP_Y = 1.03

// Desk lamp. Anchor origin: base bottom-center.
function LampPrimitive({ on }: { on: boolean }) {
  const light = useRef<THREE.PointLight>(null!)
  return (
    <group>
      <mesh castShadow position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.09, 0.11, 0.04, 12]} />
        <meshStandardMaterial color={COLORS.lampShade} roughness={0.5} metalness={0.4} />
      </mesh>
      {/* articulated arm */}
      <group position={[0.03, 0.04, 0]} rotation={[0, 0, -0.5]}>
        <Block size={[0.03, 0.34, 0.03]} color={COLORS.lampShade} position={[0, 0.17, 0]} metalness={0.4} roughness={0.5} />
      </group>
      <group position={[0.2, 0.32, 0]} rotation={[0, 0, 0.9]}>
        <Block size={[0.03, 0.22, 0.03]} color={COLORS.lampShade} position={[0, 0.1, 0]} metalness={0.4} roughness={0.5} />
      </group>
      {/* head */}
      <group position={[0.32, 0.38, 0]} rotation={[0, 0, 2.4]}>
        <mesh castShadow>
          <coneGeometry args={[0.09, 0.16, 14]} />
          <meshStandardMaterial
            color={COLORS.lampShade}
            roughness={0.5}
            metalness={0.4}
            emissive={on ? '#ffd9a0' : '#000000'}
            emissiveIntensity={on ? 0.9 : 0}
          />
        </mesh>
      </group>
      <pointLight
        ref={light}
        position={[0.36, 0.3, 0]}
        color="#ffd9a0"
        intensity={on ? 2.2 : 0}
        distance={4.5}
        decay={1.8}
      />
    </group>
  )
}

// Digital alarm clock. Anchor origin: bottom-center.
function ClockPrimitive() {
  return (
    <group>
      <Block size={[0.26, 0.12, 0.08]} color="#2b2e33" position={[0, 0.06, 0]} roughness={0.5} />
      <mesh position={[0, 0.06, 0.045]}>
        <planeGeometry args={[0.2, 0.07]} />
        <meshStandardMaterial color="#101418" emissive="#7fe0c3" emissiveIntensity={0.8} />
      </mesh>
    </group>
  )
}

// Floating nightstand on the z = -4 wall, between the shelves and the bed.
export function Nightstand() {
  const lampOn = useStore((s) => s.lampOn)
  const toggleLamp = useStore((s) => s.toggleLamp)
  const showClockBubble = useStore((s) => s.showClockBubble)
  const clockBubble = useStore((s) => s.clockBubble)

  const onClockClick = () => {
    const now = new Date()
    const hh = String(now.getHours()).padStart(2, '0')
    const mm = String(now.getMinutes()).padStart(2, '0')
    showClockBubble(`It's ${hh}:${mm}!`)
  }

  return (
    <group>
      <Block size={[0.85, 0.06, 0.55]} color={COLORS.wood} position={[0.35, 1.0, -3.72]} roughness={0.7} />

      <Interactable onActivate={toggleLamp} position={[0.15, SHELF_TOP_Y, -3.75]}>
        <HitBox size={[0.45, 0.6, 0.35]} position={[0.1, 0.25, 0]} />
        <SwappableModel fallback={<LampPrimitive on={lampOn} />} />
      </Interactable>

      <Interactable onActivate={onClockClick} position={[0.62, SHELF_TOP_Y, -3.7]}>
        <HitBox size={[0.32, 0.2, 0.15]} position={[0, 0.07, 0]} />
        <SwappableModel fallback={<ClockPrimitive />} />
        {clockBubble && (
          <Html
            position={[0, 0.45, 0]}
            center
            zIndexRange={[10, 0]}
            style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}
          >
            <SpeechBubble text={clockBubble} />
          </Html>
        )}
      </Interactable>
    </group>
  )
}
