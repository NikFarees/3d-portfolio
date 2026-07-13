import { Interactable } from './Interactable'
import { SwappableModel } from './SwappableModel'
import { Block } from './Block'
import { COLORS } from '../materials'
import { DESK_TOP_Y } from './Desk'

// Anchor origin: bottom-center of the laptop base, hinge toward the wall
// (screen faces into the room, +x).
function LaptopPrimitive() {
  return (
    <group>
      <Block size={[0.45, 0.03, 0.7]} color="#adb3ba" position={[0, 0.015, 0]} roughness={0.4} metalness={0.5} />
      {/* screen leaning back toward the wall (-x) */}
      <group position={[-0.19, 0.03, 0]} rotation={[0, 0, 0.3]}>
        <Block size={[0.03, 0.45, 0.7]} color="#adb3ba" position={[0, 0.22, 0]} roughness={0.4} metalness={0.5} />
        <mesh position={[0.017, 0.22, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.62, 0.38]} />
          <meshStandardMaterial
            color={COLORS.screenDark}
            emissive="#39d47f"
            emissiveIntensity={0.35}
            roughness={0.4}
          />
        </mesh>
      </group>
    </group>
  )
}

export function Laptop() {
  return (
    <Interactable id="laptop" label="Projects" labelOffset={[0, 0.85, 0]} position={[-3.3, DESK_TOP_Y, -0.9]}>
      <SwappableModel fallback={<LaptopPrimitive />} />
    </Interactable>
  )
}
