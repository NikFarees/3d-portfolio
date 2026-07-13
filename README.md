# Interactive 3D Portfolio

An isometric 3D room portfolio built with React Three Fiber. Portfolio
sections are clickable objects in the room — the laptop opens projects, the
framed picture opens the bio, the medals open achievements, and so on.

## Stack

- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + [drei](https://github.com/pmndrs/drei) on Three.js
- Vite + TypeScript
- GSAP for camera transitions
- Zustand for shared state between the canvas and the DOM overlays

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # serve the production build
```

### Preview a lighting phase

The room lighting follows the visitor's local time (day 7–17, evening 17–20,
night otherwise). Append `?hour=22` to the URL to preview any phase without
changing your system clock.

## Interactions

| Object | Action |
| --- | --- |
| Framed picture | About Me modal |
| Laptop | Projects gallery |
| Medals | Achievements |
| Metal case (upper shelf) | Work experience |
| Album (lower shelf) | Education history |
| Coffee maker | Tech stack ("My Fuel") |
| Bed lamp | Toggles a warm point light |
| Stand lamp (corner) | Toggles a warm floor light |
| Alarm clock | Shows the current time in a bubble |
| Cat | Wanders the room; click it for a meow |

At night (after 8pm local time) both lamps start switched on.

## Swapping in real 3D models

Every object renders a primitive placeholder through
`src/scene/objects/SwappableModel.tsx`. To replace one with a real model:

1. Drop the file in `public/models/`, e.g. `public/models/laptop.glb`.
2. Pass `modelPath="/models/laptop.glb"` to that object's `<SwappableModel>`.
3. Model the GLB around the same anchor origin as the primitive (documented
   in each object component) so it inherits position/rotation/scale.

The primitive stays as the Suspense fallback while the GLB loads. For the
cat, swap the `useFrame` scale animation for drei's `useAnimations` and play
a clip keyed by the `catPose` store value.

## Content

All portfolio content lives in `src/data/*.ts` (bio, projects, experience,
education, achievements, stack). Editing content never touches scene code.

## Asset credits

- Cat model: this work is based on
  ["Toon Cat FREE"](https://sketchfab.com/3d-models/toon-cat-free-b2bd1ee7858444bda366110a2d960386)
  by [Omabuarts Studio](https://sketchfab.com/omabuarts), licensed under
  [CC-BY-4.0](http://creativecommons.org/licenses/by/4.0/).
- Meow sound: ["Sweet kitty meow"](https://mixkit.co/free-sound-effects/cat/)
  from Mixkit, used under the Mixkit License.
