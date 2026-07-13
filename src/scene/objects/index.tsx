import { Desk } from './Desk'
import { Laptop } from './Laptop'
import { CoffeeMaker } from './CoffeeMaker'
import { FramedPicture } from './FramedPicture'
import { Medals } from './Medals'
import { Shelves } from './Shelves'
import { Nightstand } from './Nightstand'
import { Bed } from './Bed'
import { Cat } from './Cat'
import { FloorPlant, Pouf, WallClock } from './Decor'
import { StandLamp } from './StandLamp'
import { WallLamp } from './WallLamp'

export function RoomObjects() {
  return (
    <group>
      <Desk />
      <Laptop />
      <CoffeeMaker />
      <FramedPicture />
      <Medals />
      <Shelves />
      <Nightstand />
      <Bed />
      <Cat />
      {/* life: plants, pouf, clock */}
      <FloorPlant position={[-3.3, 0, 3.2]} scale={1.25} />
      <FloorPlant position={[3.55, 0, 1.6]} scale={0.9} />
      <Pouf position={[-1.3, 0.26, 2.7]} />
      <WallClock position={[3.45, 3.1, -3.93]} />
      <StandLamp />
      <WallLamp />
    </group>
  )
}
