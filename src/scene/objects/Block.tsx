import type { ThreeElements } from '@react-three/fiber'

type BlockProps = ThreeElements['mesh'] & {
  size: [number, number, number]
  color: string
  roughness?: number
  metalness?: number
}

// Basic building block for all primitive placeholders.
export function Block({
  size,
  color,
  roughness = 0.9,
  metalness = 0,
  ...meshProps
}: BlockProps) {
  return (
    <mesh castShadow receiveShadow {...meshProps}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
    </mesh>
  )
}
