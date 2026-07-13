import { Interactable, HitBox } from './Interactable'
import { SwappableModel } from './SwappableModel'
import { COLORS } from '../materials'
import { DESK_TOP_Y } from './Desk'

// Pour-over coffee maker. Anchor origin: bottom-center.
function CoffeeMakerPrimitive() {
  return (
    <group>
      {/* carafe with coffee */}
      <mesh castShadow position={[0, 0.09, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 0.18, 12]} />
        <meshStandardMaterial color="#8a4b26" roughness={0.35} />
      </mesh>
      {/* wood collar */}
      <mesh castShadow position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 0.05, 12]} />
        <meshStandardMaterial color={COLORS.wood} roughness={0.7} />
      </mesh>
      {/* glass funnel */}
      <mesh castShadow position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.1, 0.04, 0.16, 12]} />
        <meshStandardMaterial color="#dfe4e6" roughness={0.15} transparent opacity={0.65} />
      </mesh>
    </group>
  )
}

export function CoffeeMaker() {
  return (
    <Interactable id="coffee" label="My Fuel" labelOffset={[0, 0.7, 0]} position={[-3.45, DESK_TOP_Y, 0.55]}>
      <HitBox size={[0.35, 0.5, 0.35]} position={[0, 0.2, 0]} />
      <SwappableModel fallback={<CoffeeMakerPrimitive />} />
    </Interactable>
  )
}
