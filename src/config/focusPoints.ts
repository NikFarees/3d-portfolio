import type { FocusableId } from '../types'

export interface FocusPoint {
  /** controls.target / lookAt point */
  target: [number, number, number]
  /** ortho zoom level when focused */
  zoom: number
}

// The camera keeps its isometric offset direction; focusing recenters the
// target on the object and raises ortho zoom. Targets are nudged toward
// screen-right (+0.65, 0, -0.65) so the object sits left of the modal panel.
export const FOCUS_POINTS: Record<FocusableId, FocusPoint> = {
  picture: { target: [-0.75, 2.55, -4.52], zoom: 170 },
  laptop: { target: [-2.65, 1.35, -1.55], zoom: 180 },
  medals: { target: [0.75, 2.5, -4.57], zoom: 170 },
  album: { target: [3.0, 1.85, -4.37], zoom: 190 },
  metalCase: { target: [3.15, 2.65, -4.37], zoom: 180 },
  coffee: { target: [-2.8, 1.35, -0.1], zoom: 200 },
}

// Camera position = target + this offset (the default iso direction).
export const CAMERA_OFFSET: [number, number, number] = [10, 8.8, 10]
