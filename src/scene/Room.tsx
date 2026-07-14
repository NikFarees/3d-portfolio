import { useMemo } from 'react'
import * as THREE from 'three'
import { Block } from './objects/Block'
import { COLORS } from './materials'

// Procedural oak-plank texture for the floor — staggered boards with seam
// lines and light grain streaks, generated on a canvas so no texture asset
// needs to ship with the app.
function createPlankTexture(): THREE.CanvasTexture {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  const rows = 8
  const plankH = size / rows
  const shades = ['#c99a68', '#d1a473', '#c2925f', '#cb9c6c']

  for (let row = 0; row < rows; row++) {
    const y = row * plankH
    ctx.fillStyle = shades[row % shades.length]!
    ctx.fillRect(0, y, size, plankH)

    // grain streaks
    ctx.strokeStyle = 'rgba(90, 60, 30, 0.1)'
    ctx.lineWidth = 1
    for (let i = 0; i < 4; i++) {
      const gy = y + ((i + 1) / 5) * plankH
      ctx.beginPath()
      ctx.moveTo(0, gy)
      ctx.bezierCurveTo(size / 3, gy + 3, (size * 2) / 3, gy - 3, size, gy)
      ctx.stroke()
    }

    // horizontal seam
    ctx.strokeStyle = 'rgba(70, 45, 22, 0.35)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(size, y)
    ctx.stroke()

    // staggered vertical plank joints
    ctx.lineWidth = 1.5
    const offset = (row % 2) * (size / 6)
    for (let x = offset - size / 3; x < size; x += size / 3) {
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x, y + plankH)
      ctx.stroke()
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(4, 4)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

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

// Low-poly tree: tapered trunk, branch stub, and a crown of overlapping
// faceted foliage clumps in three greens.
function Tree({
  position,
  scale = 1,
  yaw = 0,
}: {
  position: [number, number, number]
  scale?: number
  yaw?: number
}) {
  const clumps: {
    p: [number, number, number]
    r: number
    c: string
  }[] = [
    { p: [0, 2.05, 0], r: 0.95, c: COLORS.foliageDark },
    { p: [0.5, 2.5, 0.25], r: 0.62, c: COLORS.foliageMid },
    { p: [-0.45, 2.55, -0.1], r: 0.58, c: COLORS.foliageMid },
    { p: [0.1, 2.95, -0.25], r: 0.55, c: COLORS.foliageLight },
    { p: [-0.15, 2.4, 0.45], r: 0.5, c: COLORS.foliageLight },
  ]
  return (
    <group position={position} scale={scale} rotation={[0, yaw, 0]}>
      <mesh castShadow position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.11, 0.2, 1.8, 7]} />
        <meshStandardMaterial color={COLORS.trunk} roughness={1} />
      </mesh>
      {/* branch stub */}
      <mesh castShadow position={[0.28, 1.45, 0.05]} rotation={[0, 0, -0.9]}>
        <cylinderGeometry args={[0.045, 0.07, 0.6, 6]} />
        <meshStandardMaterial color={COLORS.trunk} roughness={1} />
      </mesh>
      {clumps.map((k, i) => (
        <mesh key={i} castShadow position={k.p} scale={[1, 0.82, 1]} rotation={[0, i * 1.3, 0]}>
          <icosahedronGeometry args={[k.r, 0]} />
          <meshStandardMaterial color={k.c} roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  )
}

// Cluster of 3 overlapping clumps reads much better than a single blob.
function Bush({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 0.3, 0]} scale={[1, 0.72, 1]}>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color={COLORS.foliageMid} roughness={1} flatShading />
      </mesh>
      <mesh castShadow position={[0.42, 0.22, 0.1]} scale={[1, 0.7, 1]}>
        <icosahedronGeometry args={[0.34, 0]} />
        <meshStandardMaterial color={COLORS.foliageDark} roughness={1} flatShading />
      </mesh>
      <mesh castShadow position={[-0.38, 0.2, -0.08]} scale={[1, 0.68, 1]}>
        <icosahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color={COLORS.foliageLight} roughness={1} flatShading />
      </mesh>
    </group>
  )
}

// Small grass tuft — three tiny leaning cones.
function GrassTuft({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.09, 0]} rotation={[0.1, 0, 0.15]}>
        <coneGeometry args={[0.035, 0.2, 4]} />
        <meshStandardMaterial color={COLORS.foliageLight} roughness={1} />
      </mesh>
      <mesh position={[0.05, 0.07, 0.03]} rotation={[0, 0, -0.3]}>
        <coneGeometry args={[0.03, 0.16, 4]} />
        <meshStandardMaterial color={COLORS.foliageMid} roughness={1} />
      </mesh>
      <mesh position={[-0.05, 0.06, -0.02]} rotation={[-0.15, 0, 0.35]}>
        <coneGeometry args={[0.028, 0.14, 4]} />
        <meshStandardMaterial color="#94b06e" roughness={1} />
      </mesh>
    </group>
  )
}

export function Room() {
  const floorTexture = useMemo(() => createPlankTexture(), [])
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
      <mesh receiveShadow position={[0, -0.15, 0]}>
        <boxGeometry args={[ROOM + 0.5, 0.3, ROOM + 0.5]} />
        <meshStandardMaterial map={floorTexture} roughness={0.85} />
      </mesh>

      {/* soft area rug on the open floor */}
      <mesh receiveShadow position={[0.2, 0.02, 1.1]} scale={[1.25, 1, 0.9]}>
        <cylinderGeometry args={[1.5, 1.5, 0.03, 28]} />
        <meshStandardMaterial color={COLORS.rug} roughness={1} />
      </mesh>
      <mesh receiveShadow position={[0.2, 0.026, 1.1]} scale={[1.05, 1, 0.72]}>
        <cylinderGeometry args={[1.5, 1.5, 0.03, 28]} />
        <meshStandardMaterial color="#d6c7b2" roughness={1} />
      </mesh>

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

      {/* concrete panel seams */}
      {[-1.3, 1.3].map((z) => (
        <Block key={`lw${z}`} size={[0.012, WALL_H, 0.03]} color="#a8a49b" position={[-3.99 + WALL_T / 2 - 0.12, WALL_H / 2, z]} />
      ))}
      {[-2.6, 0, 2.6].map((x) => (
        <Block key={`rw${x}`} size={[0.03, WALL_H, 0.012]} color="#b3afa6" position={[x, WALL_H / 2, -3.99]} />
      ))}
      {/* horizontal seam on the right wall */}
      <Block size={[ROOM, 0.012, 0.03]} color="#b3afa6" position={[0, 2.0, -3.99]} />

      {/* garden strip outside the window wall */}
      <Block
        size={[2.6, 0.22, 8.5]}
        color="#8faa7b"
        position={[-5.55, -0.13, 0]}
        roughness={1}
      />
      <Tree position={[-5.6, -0.02, -2.6]} scale={1.15} />
      <Tree position={[-6.0, -0.02, 0.7]} scale={0.95} yaw={2.1} />
      <Tree position={[-5.3, -0.02, 3.4]} scale={0.8} yaw={4.2} />
      <Bush position={[-4.9, -0.02, -1.5]} />
      <Bush position={[-5.1, -0.02, 1.9]} scale={0.85} />
      <Bush position={[-4.8, -0.02, -3.7]} scale={0.7} />
      {[
        [-4.7, -0.6],
        [-5.0, 0.3],
        [-4.65, 2.6],
        [-5.6, 2.4],
        [-4.9, 3.6],
        [-6.2, -1.3],
        [-4.6, -2.5],
        [-6.3, 2.9],
      ].map(([x, z], i) => (
        <GrassTuft key={i} position={[x, -0.02, z]} scale={1 + (i % 3) * 0.3} />
      ))}
    </group>
  )
}
