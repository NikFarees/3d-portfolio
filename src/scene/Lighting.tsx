import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { LIGHTING } from '../config/lightingPresets'
import { useTimeOfDay } from '../hooks/useTimeOfDay'

// One ambient + one shadow-casting "sun" aimed through the window wall
// (x = -4). Phase changes tween over ~2s instead of snapping.
export function Lighting() {
  const phase = useTimeOfDay()
  const scene = useThree((s) => s.scene)
  const ambientRef = useRef<THREE.AmbientLight>(null!)
  const sunRef = useRef<THREE.DirectionalLight>(null!)
  const firstRun = useRef(true)

  useEffect(() => {
    const preset = LIGHTING[phase]
    const ambient = ambientRef.current
    const sun = sunRef.current
    const ambientColor = new THREE.Color(preset.ambientColor)
    const sunColor = new THREE.Color(preset.sunColor)
    const background = new THREE.Color(preset.background)

    if (firstRun.current) {
      firstRun.current = false
      ambient.intensity = preset.ambientIntensity
      ambient.color.copy(ambientColor)
      sun.intensity = preset.sunIntensity
      sun.color.copy(sunColor)
      sun.position.set(...preset.sunPosition)
      scene.background = background
      return
    }

    const currentBg =
      scene.background instanceof THREE.Color
        ? scene.background
        : (scene.background = new THREE.Color())
    const tl = gsap.timeline({ defaults: { duration: 2, ease: 'power1.inOut' } })
    tl.to(ambient, { intensity: preset.ambientIntensity }, 0)
      .to(ambient.color, { r: ambientColor.r, g: ambientColor.g, b: ambientColor.b }, 0)
      .to(sun, { intensity: preset.sunIntensity }, 0)
      .to(sun.color, { r: sunColor.r, g: sunColor.g, b: sunColor.b }, 0)
      .to(sun.position, {
        x: preset.sunPosition[0],
        y: preset.sunPosition[1],
        z: preset.sunPosition[2],
      }, 0)
      .to(currentBg, { r: background.r, g: background.g, b: background.b }, 0)
    return () => {
      tl.kill()
    }
  }, [phase, scene])

  return (
    <>
      <ambientLight ref={ambientRef} />
      <directionalLight
        ref={sunRef}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0004}
      />
    </>
  )
}
