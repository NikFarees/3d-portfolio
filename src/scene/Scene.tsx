import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Lighting } from './Lighting'
import { Room } from './Room'
import { RoomObjects } from './objects'
import { CameraRig } from './CameraRig'
import { ResponsiveZoom } from './ResponsiveZoom'

// Isometric framing: camera sits on the x=z diagonal, elevated, looking at
// room center. Ortho zoom (not distance) controls apparent size.
export const DEFAULT_CAMERA = {
  position: [10, 10, 10] as [number, number, number],
  target: [0, 1.2, 0] as [number, number, number],
  zoom: 55,
}

export function Scene() {
  return (
    <Canvas
      shadows
      orthographic
      camera={{
        position: DEFAULT_CAMERA.position,
        zoom: DEFAULT_CAMERA.zoom,
        near: -50,
        far: 100,
      }}
    >
      <OrbitControls
        makeDefault
        target={DEFAULT_CAMERA.target}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.6}
        minAzimuthAngle={Math.PI / 4 - 0.35}
        maxAzimuthAngle={Math.PI / 4 + 0.35}
      />
      <CameraRig />
      <ResponsiveZoom />
      <Lighting />
      <Room />
      <RoomObjects />
    </Canvas>
  )
}
