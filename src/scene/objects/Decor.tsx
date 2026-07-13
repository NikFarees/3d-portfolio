import { Block } from './Block'
import { COLORS } from '../materials'

// Tall potted plant — terracotta pot, several leaning leaf blades.
export function FloorPlant({
  position,
  scale = 1,
}: {
  position: [number, number, number]
  scale?: number
}) {
  const blades = [
    { yaw: 0.3, lean: 0.35, h: 1.0 },
    { yaw: 1.4, lean: 0.45, h: 0.85 },
    { yaw: 2.5, lean: 0.3, h: 1.1 },
    { yaw: 3.7, lean: 0.5, h: 0.8 },
    { yaw: 4.8, lean: 0.4, h: 0.95 },
    { yaw: 5.7, lean: 0.25, h: 1.15 },
  ]
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 0.26, 0]}>
        <cylinderGeometry args={[0.24, 0.18, 0.52, 14]} />
        <meshStandardMaterial color={COLORS.terracotta} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.22, 14]} />
        <meshStandardMaterial color="#4a3a2a" roughness={1} />
      </mesh>
      {blades.map((b, i) => (
        <group key={i} rotation={[0, b.yaw, 0]} position={[0, 0.5, 0]}>
          <mesh castShadow position={[0.1, b.h / 2, 0]} rotation={[0, 0, -b.lean]}>
            <coneGeometry args={[0.09, b.h, 5]} />
            <meshStandardMaterial
              color={i % 2 ? COLORS.foliageMid : COLORS.foliageDark}
              roughness={1}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// Soft floor pouf.
export function Pouf({ position }: { position: [number, number, number] }) {
  return (
    <mesh castShadow receiveShadow position={position} scale={[1, 0.55, 1]}>
      <sphereGeometry args={[0.45, 16, 12]} />
      <meshStandardMaterial color={COLORS.pouf} roughness={1} />
    </mesh>
  )
}

// Trailing pothos pot for shelves — pot plus a few dangling leaf strands.
export function ShelfPlant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.09, 0.07, 0.14, 10]} />
        <meshStandardMaterial color={COLORS.potWhite} roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, 0.17, 0]}>
        <sphereGeometry args={[0.12, 10, 8]} />
        <meshStandardMaterial color={COLORS.foliageMid} roughness={1} />
      </mesh>
      {/* dangling strands */}
      {[-0.06, 0.05].map((x, i) => (
        <mesh key={i} castShadow position={[x, -0.06, 0.09]} scale={[0.5, 1, 0.5]}>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshStandardMaterial color={COLORS.foliageLight} roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

// A short row of leaning books.
export function BookRow({
  position,
  rotation,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
}) {
  const books = [
    { w: 0.05, h: 0.28, c: '#8a5a3a', lean: 0 },
    { w: 0.06, h: 0.32, c: '#5a6b5d', lean: 0 },
    { w: 0.045, h: 0.26, c: '#a5713d', lean: 0 },
    { w: 0.05, h: 0.3, c: '#6b5a7a', lean: -0.22 },
  ]
  let x = 0
  return (
    <group position={position} rotation={rotation}>
      {books.map((b, i) => {
        x += b.w + 0.008
        return (
          <Block
            key={i}
            size={[b.w, b.h, 0.22]}
            color={b.c}
            position={[x, b.h / 2 + Math.abs(b.lean) * 0.02, 0]}
            rotation={[0, 0, b.lean]}
            roughness={0.85}
          />
        )
      })}
    </group>
  )
}

// Minimal wall clock.
export function WallClock({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.05, 24]} />
        <meshStandardMaterial color="#efece6" roughness={0.6} />
      </mesh>
      <Block size={[0.02, 0.14, 0.02]} color="#2b2e33" position={[0, 0.05, 0.03]} />
      <Block size={[0.1, 0.02, 0.02]} color="#2b2e33" position={[0.04, 0, 0.03]} />
    </group>
  )
}
