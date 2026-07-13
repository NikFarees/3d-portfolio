import { Interactable, HitBox } from './Interactable'
import { COLORS } from '../materials'
import { useStore } from '../../store/useStore'

// Tall floor lamp in the back corner (right of the desk, left of the
// About Me frame). Click toggles its warm light.
export function StandLamp() {
  const on = useStore((s) => s.standLampOn)
  const toggleStandLamp = useStore((s) => s.toggleStandLamp)

  return (
    <Interactable onActivate={toggleStandLamp} position={[-3.05, 0, -3.25]}>
      <HitBox size={[0.6, 1.9, 0.6]} position={[0, 0.95, 0]} />
      {/* base */}
      <mesh castShadow position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.22, 0.26, 0.06, 16]} />
        <meshStandardMaterial color={COLORS.lampShade} roughness={0.5} metalness={0.4} />
      </mesh>
      {/* pole */}
      <mesh castShadow position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 1.65, 10]} />
        <meshStandardMaterial color={COLORS.lampShade} roughness={0.5} metalness={0.4} />
      </mesh>
      {/* fabric drum shade */}
      <mesh castShadow position={[0, 1.78, 0]}>
        <cylinderGeometry args={[0.24, 0.28, 0.36, 18, 1, true]} />
        <meshStandardMaterial
          color={on ? '#f5e3c4' : '#ded5c2'}
          roughness={0.9}
          emissive={on ? '#ffd9a0' : '#000000'}
          emissiveIntensity={on ? 0.75 : 0}
          side={2}
        />
      </mesh>
      {/* glowing bulb hint */}
      <mesh position={[0, 1.74, 0]}>
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshStandardMaterial
          color="#fff4dd"
          emissive={on ? '#ffedcc' : '#000000'}
          emissiveIntensity={on ? 1.4 : 0}
        />
      </mesh>
      <pointLight
        position={[0, 1.72, 0]}
        color="#ffd9a0"
        intensity={on ? 2.6 : 0}
        distance={6}
        decay={1.8}
      />
    </Interactable>
  )
}
