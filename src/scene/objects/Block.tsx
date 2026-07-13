import type { MeshProps } from '@react-three/fiber'

interface BlockProps extends MeshProps {
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
