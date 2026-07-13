import { Interactable } from './Interactable'
import { SwappableModel } from './SwappableModel'
import { Block } from './Block'
import { COLORS } from '../materials'

// Framed portrait on the z = -4 wall. Anchor origin: center of the frame.
function FramedPicturePrimitive() {
  return (
    <group>
      <Block size={[1.0, 1.3, 0.05]} color={COLORS.woodDark} position={[0, 0, 0]} roughness={0.6} />
      {/* canvas */}
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[0.86, 1.16]} />
        <meshStandardMaterial color="#e8ddc4" roughness={0.9} />
      </mesh>
      {/* abstract portrait: head + shoulders */}
      <mesh position={[0, 0.2, 0.035]}>
        <circleGeometry args={[0.18, 20]} />
        <meshStandardMaterial color="#c98a5b" roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.24, 0.034]}>
        <planeGeometry args={[0.46, 0.36]} />
        <meshStandardMaterial color="#5a6b5d" roughness={0.9} />
      </mesh>
    </group>
  )
}

export function FramedPicture() {
  return (
    <Interactable id="picture" label="About Me" labelOffset={[0, 0.75, 0]} position={[-1.4, 2.55, -3.87]}>
      <SwappableModel fallback={<FramedPicturePrimitive />} />
    </Interactable>
  )
}
