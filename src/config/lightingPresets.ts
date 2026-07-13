import type { DayPhase } from '../types'

export interface LightingPreset {
  ambientIntensity: number
  ambientColor: string
  sunIntensity: number
  sunColor: string
  sunPosition: [number, number, number]
  background: string
}

export const LIGHTING: Record<DayPhase, LightingPreset> = {
  day: {
    ambientIntensity: 0.9,
    ambientColor: '#fff6e8',
    sunIntensity: 2.4,
    sunColor: '#ffedcc',
    sunPosition: [-8, 8, 2],
    background: '#dfe8ef',
  },
  evening: {
    ambientIntensity: 0.45,
    ambientColor: '#ffd9c2',
    sunIntensity: 1.4,
    sunColor: '#ff9a5c',
    sunPosition: [-9, 4, 3],
    background: '#e8c4b0',
  },
  night: {
    ambientIntensity: 0.18,
    ambientColor: '#4a5a8a',
    sunIntensity: 0.5,
    sunColor: '#7d90d9',
    sunPosition: [-8, 7, 2],
    background: '#12182b',
  },
}
