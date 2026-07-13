import { RoundedBox } from '@react-three/drei'
import { Block } from './Block'
import { COLORS } from '../materials'

function Plant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.08, 0.06, 0.14, 12]} />
        <meshStandardMaterial color={COLORS.potWhite} roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.11, 10, 10]} />
        <meshStandardMaterial color={COLORS.plantGreen} roughness={1} />
      </mesh>
    </group>
  )
}

function Mug({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.05, 0.045, 0.12, 12]} />
        <meshStandardMaterial color="#c96f4a" roughness={0.6} />
      </mesh>
      {/* coffee surface */}
      <mesh position={[0, 0.115, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.042, 12]} />
        <meshStandardMaterial color="#4a3020" roughness={0.4} />
      </mesh>
    </group>
  )
}

// A-frame wooden desk leg pair.
function LegPair({ z }: { z: number }) {
  return (
    <group position={[-3.4, 0, z]}>
      <Block size={[0.07, 1.06, 0.09]} color={COLORS.woodDark} position={[-0.35, 0.53, 0]} rotation={[0, 0, -0.28]} />
      <Block size={[0.07, 1.06, 0.09]} color={COLORS.woodDark} position={[0.35, 0.53, 0]} rotation={[0, 0, 0.28]} />
      {/* cross brace */}
      <Block size={[0.62, 0.05, 0.07]} color={COLORS.woodDark} position={[0, 0.45, 0]} />
    </group>
  )
}

// Simple wooden stool tucked at the desk.
function Stool() {
  return (
    <group position={[-2.35, 0, -0.85]}>
      <mesh castShadow position={[0, 0.52, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.06, 16]} />
        <meshStandardMaterial color={COLORS.wood} roughness={0.7} />
      </mesh>
      {/* cushion */}
      <RoundedBox args={[0.42, 0.08, 0.42]} radius={0.04} smoothness={3} castShadow position={[0, 0.58, 0]}>
        <meshStandardMaterial color={COLORS.linenShadow} roughness={1} />
      </RoundedBox>
      {[0.7, 2.27, 3.84, 5.41].map((a) => (
        <mesh key={a} castShadow position={[Math.cos(a) * 0.18, 0.26, Math.sin(a) * 0.18]} rotation={[Math.sin(a) * 0.18, 0, -Math.cos(a) * 0.18]}>
          <cylinderGeometry args={[0.025, 0.035, 0.52, 8]} />
          <meshStandardMaterial color={COLORS.woodDark} roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

// Wooden desk under the windows on the x = -4 wall, now with A-frame legs.
// Desk top surface sits at y = 1.10.
export const DESK_TOP_Y = 1.1

export function Desk() {
  return (
    <group>
      <Block size={[1.1, 0.08, 3.4]} color={COLORS.wood} position={[-3.4, 1.06, -1.0]} roughness={0.7} />
      <LegPair z={-2.45} />
      <LegPair z={0.45} />
      {/* succulents + coffee mug + notebook */}
      <Plant position={[-3.55, DESK_TOP_Y, -2.35]} />
      <Plant position={[-3.2, DESK_TOP_Y, -2.5]} />
      <Plant position={[-3.6, DESK_TOP_Y, 0.1]} />
      <Mug position={[-3.15, DESK_TOP_Y, -0.35]} />
      <Block size={[0.36, 0.03, 0.26]} color="#e8e2d4" position={[-3.25, DESK_TOP_Y + 0.015, -1.65]} rotation={[0, 0.25, 0]} />
      <Block size={[0.3, 0.015, 0.2]} color="#c9bfa8" position={[-3.24, DESK_TOP_Y + 0.04, -1.64]} rotation={[0, 0.18, 0]} />
      <Stool />
    </group>
  )
}
