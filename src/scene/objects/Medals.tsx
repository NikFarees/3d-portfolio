import { Interactable, HitBox } from './Interactable'
import { SwappableModel } from './SwappableModel'
import { Block } from './Block'
import { COLORS } from '../materials'

function Medal({ x, color }: { x: number; color: string }) {
  return (
    <group position={[x, 0, 0]}>
      {/* ribbon */}
      <Block size={[0.06, 0.34, 0.02]} color="#4a5568" position={[0, 0, 0]} />
      {/* disc */}
      <mesh castShadow position={[0, -0.24, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.03, 20]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
      </mesh>
    </group>
  )
}

// Three medals hanging on the z = -4 wall. Anchor origin: ribbon tops.
function MedalsPrimitive() {
  return (
    <group>
      <Medal x={-0.35} color={COLORS.gold} />
      <Medal x={0} color={COLORS.silver} />
      <Medal x={0.35} color={COLORS.bronze} />
    </group>
  )
}

export function Medals() {
  return (
    <Interactable id="medals" label="Achievements" labelOffset={[0, 0.6, 0]} position={[0.1, 2.75, -3.92]}>
      <HitBox size={[1.1, 0.75, 0.25]} position={[0, -0.18, 0.05]} />
      <SwappableModel fallback={<MedalsPrimitive />} />
    </Interactable>
  )
}
