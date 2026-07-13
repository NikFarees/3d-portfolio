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

// Floating desk under the windows on the x = -4 wall.
// Desk top surface sits at y = 1.10.
export const DESK_TOP_Y = 1.1

export function Desk() {
  return (
    <group>
      <Block size={[1.1, 0.08, 3.4]} color={COLORS.wood} position={[-3.4, 1.06, -1.0]} roughness={0.7} />
      {/* wall brackets */}
      <Block size={[0.9, 0.06, 0.12]} color={COLORS.woodDark} position={[-3.5, 0.99, -2.3]} />
      <Block size={[0.9, 0.06, 0.12]} color={COLORS.woodDark} position={[-3.5, 0.99, 0.3]} />
      {/* succulents on the far end of the desk */}
      <Plant position={[-3.55, DESK_TOP_Y, -2.35]} />
      <Plant position={[-3.2, DESK_TOP_Y, -2.5]} />
      <Plant position={[-3.6, DESK_TOP_Y, 0.1]} />
    </group>
  )
}
