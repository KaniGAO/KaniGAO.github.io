import { useRef, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, useAnimations, Center } from '@react-three/drei'
import * as THREE from 'three'
import { useScrollProgress } from '@/hooks/useScrollProgress'

/**
 * Single source of truth for the avatar model. The GLB is shipped in
 * /public/models (generated via scripts/generate-head.mjs + Meshy).
 * Keep this as the only model path — no second placeholder branch.
 */
export const MODEL_URL = '/models/head.glb'

/**
 * Scroll-driven head rotation. As the user scrolls through the first viewport
 * the head turns from front-facing to a slight side profile (about -34deg).
 */
const SCROLL_ROTATION_RANGE = -0.6 // radians (≈ -34deg)

/** A ref holding 0..1 scroll progress, read every frame inside useFrame. */
type ScrollRef = { current: number }

/* ------------------------------------------------------------------ */
/* GLB-loaded model                                                    */
/* ------------------------------------------------------------------ */

function GltfHead({ url, scrollProg }: { url: string; scrollProg: ScrollRef }) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(url)
  const { actions } = useAnimations(animations, group)

  // Play the first clip if the model ships with animation (e.g. idle blink)
  useFrame((state) => {
    if (animations.length && actions) {
      const first = actions[animations[0].name]
      if (first && !first.isRunning()) first.reset().play()
    }
    if (group.current) {
      const g = group.current
      const { x, y } = state.pointer
      const t = state.clock.elapsedTime
      const p = scrollProg.current
      // Responsive stage: wide screens park the model on the RIGHT half,
      // narrow screens center it behind the copy. Scale tuned for the Meshy
      // bust whose native size is ~1.9 units tall (camera sees ~4 units at the
      // model plane, so ~1.8 fills it nicely without swallowing the camera).
      const wide = state.size.width / state.size.height >= 1
      const px = wide ? 2.0 : 0
      const py = wide ? 0.1 : -0.1
      const ps = wide ? 1.62 : 1.35
      g.position.x = THREE.MathUtils.lerp(g.position.x, px, 0.08)
      g.position.y = THREE.MathUtils.lerp(g.position.y, py, 0.08)
      g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, ps, 0.08))
      // scroll-driven turn + idle sway + mouse parallax (camera stays put so
      // the mouse-tracked eyes keep working throughout the scroll)
      const targetY = p * SCROLL_ROTATION_RANGE + Math.sin(t * 0.35) * 0.12 + x * 0.35
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetY, 0.06)
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -y * 0.18, 0.06)
    }
  })

  return (
    <group ref={group} position={[2.0, 0.1, 0]} scale={1.62}>
      <Center disableY>
        <primitive object={scene} />
      </Center>
    </group>
  )
}

export default function HeadAvatar() {
  const scrollProg = useScrollProgress()

  return (
    <group>
      <Suspense fallback={null}>
        <GltfHead url={MODEL_URL} scrollProg={scrollProg} />
      </Suspense>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 1.7}
        minAzimuthAngle={-0.55}
        maxAzimuthAngle={0.55}
        target={[0.35, 0.15, 0]}
      />
    </group>
  )
}

// Preload the shipped model (no second branch → no 404 risk)
useGLTF.preload(MODEL_URL)
