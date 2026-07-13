import { Interactable, HitBox } from './Interactable'
import { Block } from './Block'

// Long folded ribbon loops with medal discs, hung from wall pegs —
// matches the reference: muted blue / cream / bronze ribbons.
function Medal({
  x,
  ribbon,
  disc,
  drop = 0.62,
}: {
  x: number
  ribbon: string
  disc: string
  drop?: number
}) {
  const spread = 0.1 // half-width of the V at the bottom
  const strip: [number, number, number] = [0.06, drop, 0.016]
  const lean = Math.atan2(spread, drop)
  return (
    <group position={[x, 0, 0]}>
      {/* peg */}
      <mesh castShadow position={[0, 0.03, 0.02]}>
        <cylinderGeometry args={[0.018, 0.018, 0.05, 8]} />
        <meshStandardMaterial color="#8a8580" roughness={0.6} metalness={0.3} />
      </mesh>
      {/* ribbon V — two strips from the peg down to the disc */}
      <Block size={strip} color={ribbon} position={[-spread / 2, -drop / 2, 0]} rotation={[0, 0, -lean]} roughness={0.85} />
      <Block size={strip} color={ribbon} position={[spread / 2, -drop / 2, 0.012]} rotation={[0, 0, lean]} roughness={0.85} />
      {/* disc with rim */}
      <mesh castShadow position={[0, -drop - 0.08, 0.015]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.028, 22]} />
        <meshStandardMaterial color={disc} roughness={0.3} metalness={0.75} />
      </mesh>
      <mesh position={[0, -drop - 0.08, 0.031]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.006, 20]} />
        <meshStandardMaterial color={disc} roughness={0.5} metalness={0.5} />
      </mesh>
    </group>
  )
}

function MedalsPrimitive() {
  return (
    <group>
      <Medal x={-0.3} ribbon="#7d8fb3" disc="#d9b545" drop={0.6} />
      <Medal x={0} ribbon="#e8e0cc" disc="#e8e8e2" drop={0.68} />
      <Medal x={0.3} ribbon="#b58a5f" disc="#b0703c" drop={0.56} />
    </group>
  )
}

export function Medals() {
  return (
    <Interactable id="medals" label="Achievements" labelOffset={[0, 0.4, 0]} position={[0.15, 3.0, -3.94]}>
      <HitBox size={[1.0, 1.1, 0.25]} position={[0, -0.4, 0.06]} />
      <MedalsPrimitive />
    </Interactable>
  )
}
