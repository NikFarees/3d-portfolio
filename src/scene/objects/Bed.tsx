import { RoundedBox } from '@react-three/drei'
import { Block } from './Block'
import { COLORS } from '../materials'

// Low platform bed against the z = -4 wall, head at the wall.
// Rounded mattress/duvet/pillows so the bedding reads soft, not boxy.
export function Bed() {
  return (
    <group position={[2.05, 0, -2.15]}>
      {/* headboard */}
      <Block size={[2.35, 0.95, 0.08]} color={COLORS.woodDark} position={[0, 0.85, -1.72]} roughness={0.7} />
      {/* wood platform with foot overhang */}
      <Block size={[2.35, 0.14, 3.4]} color={COLORS.wood} position={[0, 0.33, 0.1]} roughness={0.7} />
      {/* recessed feet */}
      <Block size={[0.12, 0.26, 0.12]} color={COLORS.woodDark} position={[-1.0, 0.13, -1.4]} />
      <Block size={[0.12, 0.26, 0.12]} color={COLORS.woodDark} position={[1.0, 0.13, -1.4]} />
      <Block size={[0.12, 0.26, 0.12]} color={COLORS.woodDark} position={[-1.0, 0.13, 1.5]} />
      <Block size={[0.12, 0.26, 0.12]} color={COLORS.woodDark} position={[1.0, 0.13, 1.5]} />

      {/* mattress */}
      <RoundedBox args={[2.1, 0.32, 3.0]} radius={0.09} smoothness={4} castShadow receiveShadow position={[0, 0.56, -0.1]}>
        <meshStandardMaterial color={COLORS.linen} roughness={1} />
      </RoundedBox>
      {/* duvet over the lower two-thirds */}
      <RoundedBox args={[2.18, 0.2, 2.0]} radius={0.08} smoothness={4} castShadow receiveShadow position={[0, 0.68, 0.42]}>
        <meshStandardMaterial color={COLORS.duvet} roughness={1} />
      </RoundedBox>
      {/* folded blanket strip at the foot */}
      <RoundedBox args={[2.2, 0.1, 0.62]} radius={0.05} smoothness={4} castShadow position={[0, 0.8, 1.0]}>
        <meshStandardMaterial color={COLORS.duvetFold} roughness={1} />
      </RoundedBox>

      {/* pillows */}
      <RoundedBox args={[0.85, 0.22, 0.52]} radius={0.1} smoothness={4} castShadow position={[-0.52, 0.82, -1.28]} rotation={[-0.12, 0.06, 0]}>
        <meshStandardMaterial color={COLORS.pillow} roughness={1} />
      </RoundedBox>
      <RoundedBox args={[0.85, 0.22, 0.52]} radius={0.1} smoothness={4} castShadow position={[0.5, 0.82, -1.3]} rotation={[-0.12, -0.05, 0]}>
        <meshStandardMaterial color={COLORS.pillow} roughness={1} />
      </RoundedBox>
    </group>
  )
}
