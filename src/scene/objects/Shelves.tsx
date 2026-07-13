import { Interactable, HitBox } from './Interactable'
import { SwappableModel } from './SwappableModel'
import { Block } from './Block'
import { COLORS } from '../materials'

// Metal flight case. Anchor origin: bottom-center.
function MetalCasePrimitive() {
  return (
    <group>
      <Block size={[0.6, 0.36, 0.4]} color="#c7ccd1" position={[0, 0.18, 0]} roughness={0.35} metalness={0.6} />
      {/* lid seam + latches */}
      <Block size={[0.62, 0.02, 0.42]} color={COLORS.metalDark} position={[0, 0.26, 0]} metalness={0.6} roughness={0.4} />
      <Block size={[0.05, 0.1, 0.02]} color={COLORS.metalDark} position={[-0.15, 0.16, 0.2]} metalness={0.6} />
      <Block size={[0.05, 0.1, 0.02]} color={COLORS.metalDark} position={[0.15, 0.16, 0.2]} metalness={0.6} />
      {/* handle */}
      <Block size={[0.2, 0.04, 0.05]} color={COLORS.metalDark} position={[0, 0.4, 0]} metalness={0.5} />
    </group>
  )
}

// A thick photo album plus a book. Anchor origin: bottom-center.
function AlbumPrimitive() {
  return (
    <group>
      <Block size={[0.46, 0.08, 0.34]} color="#7a4a2b" position={[0, 0.04, 0]} roughness={0.8} />
      <Block size={[0.4, 0.06, 0.3]} color="#a5713d" position={[0.02, 0.11, 0]} rotation={[0, 0.18, 0]} roughness={0.8} />
    </group>
  )
}

// Two floating shelves on the z = -4 wall, right of the medals.
export function Shelves() {
  return (
    <group>
      {/* boards */}
      <Block size={[1.5, 0.06, 0.55]} color={COLORS.wood} position={[2.5, 2.4, -3.72]} roughness={0.7} />
      <Block size={[1.5, 0.06, 0.55]} color={COLORS.wood} position={[2.5, 1.7, -3.72]} roughness={0.7} />

      <Interactable id="metalCase" label="Work Experience" labelOffset={[0, 0.75, 0]} position={[2.5, 2.43, -3.72]}>
        <HitBox size={[0.7, 0.5, 0.5]} position={[0, 0.22, 0]} />
        <SwappableModel fallback={<MetalCasePrimitive />} />
      </Interactable>

      <Interactable id="album" label="Education History" labelOffset={[0, 0.55, 0]} position={[2.35, 1.73, -3.72]}>
        <HitBox size={[0.55, 0.3, 0.45]} position={[0, 0.1, 0]} />
        <SwappableModel fallback={<AlbumPrimitive />} />
      </Interactable>
    </group>
  )
}
