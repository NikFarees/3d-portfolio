import { Desk } from './Desk'
import { Laptop } from './Laptop'
import { CoffeeMaker } from './CoffeeMaker'
import { FramedPicture } from './FramedPicture'
import { Medals } from './Medals'
import { Shelves } from './Shelves'
import { Nightstand } from './Nightstand'
import { Bed } from './Bed'
import { Cat } from './Cat'

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
    </group>
  )
}
