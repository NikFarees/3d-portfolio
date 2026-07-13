import { Interactable, HitBox } from './Interactable'
import { COLORS } from '../materials'
import { useStore } from '../../store/useStore'

// Wall sconce on the solid strip of the window wall, between the second
// window and the front corner. Click toggles its warm light.
export function WallLamp() {
  const on = useStore((s) => s.wallLampOn)
  const toggleWallLamp = useStore((s) => s.toggleWallLamp)

  return (
    <Interactable onActivate={toggleWallLamp} position={[-3.98, 2.55, 2.55]}>
      <HitBox size={[0.5, 0.7, 0.6]} position={[0.2, 0, 0]} />
      {/* mount plate against the wall */}
      <mesh castShadow position={[0.02, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.09, 0.09, 0.04, 12]} />
        <meshStandardMaterial color={COLORS.lampShade} roughness={0.5} metalness={0.4} />
      </mesh>
      {/* short arm out from the wall */}
      <mesh castShadow position={[0.14, 0.02, 0]} rotation={[0, 0, Math.PI / 2 - 0.25]}>
        <cylinderGeometry args={[0.02, 0.02, 0.26, 8]} />
        <meshStandardMaterial color={COLORS.lampShade} roughness={0.5} metalness={0.4} />
      </mesh>
      {/* cone shade tilted slightly down */}
      <mesh castShadow position={[0.28, 0.08, 0]} rotation={[0, 0, -0.35]}>
        <coneGeometry args={[0.16, 0.2, 14, 1, true]} />
        <meshStandardMaterial
          color={on ? '#f5e3c4' : '#ded5c2'}
          roughness={0.9}
          emissive={on ? '#ffd9a0' : '#000000'}
          emissiveIntensity={on ? 0.7 : 0}
          side={2}
        />
      </mesh>
      {/* glowing bulb hint */}
      <mesh position={[0.28, 0.02, 0]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshStandardMaterial
          color="#fff4dd"
          emissive={on ? '#ffedcc' : '#000000'}
          emissiveIntensity={on ? 1.4 : 0}
        />
      </mesh>
      <pointLight
        position={[0.3, -0.02, 0]}
        color="#ffd9a0"
        intensity={on ? 1.8 : 0}
        distance={5}
        decay={1.8}
      />
    </Interactable>
  )
}
