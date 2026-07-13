import { Block } from './objects/Block'
import { COLORS } from './materials'

// Room bounds: floor spans x/z in [-4, 4], floor top at y = 0, walls 4 high.
// Window wall sits at x = -4 (screen-left from the iso camera); the solid
// wall at z = -4 (screen-right) carries the picture, medals and shelves.

const WALL_H = 4
const WALL_T = 0.25
const ROOM = 8

// Two window openings in the x = -4 wall, each 2 wide (z) x 1.9 tall,
// sill at y = 1.4.
const WIN = { yBottom: 1.4, yTop: 3.3, a: [-3.3, -1.3], b: [-0.7, 1.3] } as const

function zStrip(z0: number, z1: number, y0: number, y1: number) {
  return {
    position: [-4 - WALL_T / 2, (y0 + y1) / 2, (z0 + z1) / 2] as [number, number, number],
    size: [WALL_T, y1 - y0, z1 - z0] as [number, number, number],
  }
}

function WindowFrame({ zCenter }: { zCenter: number }) {
  const w = 2
  const h = WIN.yTop - WIN.yBottom
  const yCenter = (WIN.yBottom + WIN.yTop) / 2
  const bar = 0.05
  const x = -4 - WALL_T / 2
  return (
    <group>
      {/* border */}
      <Block size={[WALL_T + 0.04, bar, w]} color={COLORS.woodDark} position={[x, WIN.yBottom + bar / 2, zCenter]} />
      <Block size={[WALL_T + 0.04, bar, w]} color={COLORS.woodDark} position={[x, WIN.yTop - bar / 2, zCenter]} />
      <Block size={[WALL_T + 0.04, h, bar]} color={COLORS.woodDark} position={[x, yCenter, zCenter - w / 2 + bar / 2]} />
      <Block size={[WALL_T + 0.04, h, bar]} color={COLORS.woodDark} position={[x, yCenter, zCenter + w / 2 - bar / 2]} />
      {/* mullion grid (3x3 panes) */}
      <Block size={[0.04, h, bar]} color={COLORS.woodDark} position={[x, yCenter, zCenter - w / 6]} />
      <Block size={[0.04, h, bar]} color={COLORS.woodDark} position={[x, yCenter, zCenter + w / 6]} />
      <Block size={[0.04, bar, w]} color={COLORS.woodDark} position={[x, yCenter - h / 6, zCenter]} />
      <Block size={[0.04, bar, w]} color={COLORS.woodDark} position={[x, yCenter + h / 6, zCenter]} />
    </group>
  )
}

export function Room() {
  const [a0, a1] = WIN.a
  const [b0, b1] = WIN.b
  const segments = [
    // full-height strips between/around the openings
    zStrip(-4, a0, 0, WALL_H),
    zStrip(a1, b0, 0, WALL_H),
    zStrip(b1, 4, 0, WALL_H),
    // below + above each opening
    zStrip(a0, a1, 0, WIN.yBottom),
    zStrip(a0, a1, WIN.yTop, WALL_H),
    zStrip(b0, b1, 0, WIN.yBottom),
    zStrip(b0, b1, WIN.yTop, WALL_H),
  ]

  return (
    <group>
      {/* floor slab, top face at y = 0 */}
      <Block
        size={[ROOM + 0.5, 0.3, ROOM + 0.5]}
        color={COLORS.floorTile}
        position={[0, -0.15, 0]}
        roughness={0.95}
      />
      {/* tile grid lines */}
      <gridHelper
        args={[ROOM, 4, '#b9b5ac', '#b9b5ac']}
        position={[0, 0.006, 0]}
      />

      {/* window wall (x = -4) built from segments around the two openings */}
      {segments.map((s, i) => (
        <Block key={i} size={s.size} color={COLORS.concrete} position={s.position} />
      ))}
      <WindowFrame zCenter={(a0 + a1) / 2} />
      <WindowFrame zCenter={(b0 + b1) / 2} />

      {/* solid wall (z = -4) */}
      <Block
        size={[ROOM + WALL_T * 2, WALL_H, WALL_T]}
        color={COLORS.concreteLight}
        position={[0, WALL_H / 2, -4 - WALL_T / 2]}
      />

      {/* foliage hints outside the windows for depth */}
      <mesh position={[-5.2, 2.4, -2.3]}>
        <sphereGeometry args={[1.1, 12, 12]} />
        <meshStandardMaterial color={COLORS.plantGreen} roughness={1} />
      </mesh>
      <mesh position={[-5.4, 2.7, 0.4]}>
        <sphereGeometry args={[1.3, 12, 12]} />
        <meshStandardMaterial color={COLORS.plantGreen} roughness={1} />
      </mesh>
    </group>
  )
}
