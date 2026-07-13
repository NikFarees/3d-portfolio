import { Block } from './Block'
import { COLORS } from '../materials'

// Low platform bed against the z = -4 wall, head at the wall.
export function Bed() {
  return (
    <group position={[2.0, 0, -2.2]}>
      {/* wood platform, floating on recessed feet */}
      <Block size={[2.1, 0.16, 2.9]} color={COLORS.wood} position={[0, 0.34, 0]} roughness={0.7} />
      <Block size={[1.7, 0.26, 2.4]} color={COLORS.woodDark} position={[0, 0.13, 0]} />
      {/* mattress */}
      <Block size={[1.85, 0.28, 2.5]} color={COLORS.linen} position={[0, 0.56, -0.15]} roughness={1} />
      {/* folded blanket over the foot half */}
      <Block size={[1.87, 0.1, 1.3]} color={COLORS.linenShadow} position={[0, 0.68, 0.45]} roughness={1} />
      {/* pillows */}
      <Block size={[0.72, 0.14, 0.42]} color="#efeae0" position={[-0.45, 0.76, -1.05]} rotation={[0, 0.06, 0]} roughness={1} />
      <Block size={[0.72, 0.14, 0.42]} color="#efeae0" position={[0.42, 0.76, -1.08]} rotation={[0, -0.05, 0]} roughness={1} />
    </group>
  )
}
