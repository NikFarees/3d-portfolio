import { Suspense, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { GroupProps } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

interface SwappableModelProps extends GroupProps {
  /** Path to a .glb/.gltf under public/ (e.g. '/models/laptop.glb').
   *  Leave undefined to render the primitive fallback. */
  modelPath?: string
  /** Primitive placeholder — also shown while the GLTF loads. */
  fallback: ReactNode
}

// Every room object goes through this wrapper: position/rotation/scale live
// on the outer group, so a future GLB drop-in inherits placement as long as
// it is modeled around the same anchor origin as the primitive.
export function SwappableModel({ modelPath, fallback, ...groupProps }: SwappableModelProps) {
  return (
    <group {...groupProps}>
      {modelPath ? (
        <Suspense fallback={fallback}>
          <GltfModel path={modelPath} />
        </Suspense>
      ) : (
        fallback
      )}
    </group>
  )
}

// Separate component because useGLTF suspends. Scene is cloned so the same
// asset can be instanced several times (e.g. three medals).
function GltfModel({ path }: { path: string }) {
  const { scene } = useGLTF(path)
  const cloned = useMemo(() => {
    const c = scene.clone(true)
    c.traverse((o) => {
      o.castShadow = true
      o.receiveShadow = true
    })
    return c
  }, [scene])
  return <primitive object={cloned} />
}
