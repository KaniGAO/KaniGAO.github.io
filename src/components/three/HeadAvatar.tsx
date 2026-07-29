import { useRef, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, useAnimations, Center } from '@react-three/drei'
import * as THREE from 'three'
import { useScrollProgress } from '@/hooks/useScrollProgress'

/**
 * One-line config to swap the avatar model.
 * Drop a .glb into /public/models/ and set MODEL_URL = '/models/head.glb'.
 * Generate one with Meshy — see scripts/generate-head.mjs + scripts/.env.example.
 * Leave as null to keep the built-in procedural placeholder.
 */
export const MODEL_URL: string | null = '/models/head.glb'

/**
 * Scroll-driven head rotation. As the user scrolls through the first viewport
 * the head turns from front-facing to a slight side profile (about -34deg).
 */
const SCROLL_ROTATION_RANGE = -0.6 // radians (≈ -34deg)

/** A ref holding 0..1 scroll progress, read every frame inside useFrame. */
type ScrollRef = { current: number }

/* ------------------------------------------------------------------ */
/* Shared eye component — follows the mouse every frame, all the time */
/* ------------------------------------------------------------------ */

function Eye({ side }: { side: number }) {
  const pupil = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!pupil.current) return
    const x = state.pointer.x
    const y = state.pointer.y
    pupil.current.rotation.y = THREE.MathUtils.lerp(pupil.current.rotation.y, -x * 0.6, 0.12)
    pupil.current.rotation.x = THREE.MathUtils.lerp(pupil.current.rotation.x, y * 0.45, 0.12)
  })

  return (
    <group position={[side * 0.3, 0.12, 0.86]}>
      <mesh>
        <sphereGeometry args={[0.17, 24, 24]} />
        <meshStandardMaterial color="#f7f7f5" />
      </mesh>
      <group ref={pupil} position={[0, 0, 0.11]}>
        <mesh>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshStandardMaterial color="#16161a" roughness={0.3} />
        </mesh>
        <mesh position={[0.02, 0.02, 0.05]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.6} />
        </mesh>
      </group>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Procedural placeholder (used until a GLB is provided)              */
/* ------------------------------------------------------------------ */

function PlaceholderHead({ scrollProg }: { scrollProg: ScrollRef }) {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!group.current) return
    const p = scrollProg.current
    const { x } = state.pointer
    const t = state.clock.elapsedTime
    // scroll-driven turn + idle sway + mouse parallax
    const targetY = p * SCROLL_ROTATION_RANGE + Math.sin(t * 0.35) * 0.12 + x * 0.25
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.08)
  })

  return (
    <group ref={group} position={[0, 0.3, 0]}>
      <mesh castShadow>
        <sphereGeometry args={[1, 48, 48]} />
        <meshStandardMaterial color="#c9a07a" roughness={0.65} metalness={0.05} />
      </mesh>
      <mesh position={[-1.0, 0.05, 0]}>
        <sphereGeometry args={[0.18, 20, 20]} />
        <meshStandardMaterial color="#bd936e" roughness={0.7} />
      </mesh>
      <mesh position={[1.0, 0.05, 0]}>
        <sphereGeometry args={[0.18, 20, 20]} />
        <meshStandardMaterial color="#bd936e" roughness={0.7} />
      </mesh>
      <Eye side={-1} />
      <Eye side={1} />
      <mesh position={[0, -0.08, 1.0]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.09, 0.28, 16]} />
        <meshStandardMaterial color="#b88a64" roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.45, 0.92]}>
        <torusGeometry args={[0.22, 0.04, 12, 24, Math.PI]} />
        <meshStandardMaterial color="#7a4a3a" />
      </mesh>
      <mesh position={[0, -1.7, 0]}>
        <cylinderGeometry args={[0.85, 1.35, 1.25, 32]} />
        <meshStandardMaterial color="#3b4a6b" roughness={0.85} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* GLB-loaded model                                                    */
/* ------------------------------------------------------------------ */

/**
 * Meshy GLB eyes are baked into the texture (not separate meshes). The overlay
 * GlbEyes below sit on top of the face so the mouse tracking still reads.
 * Once head.glb lands, open the page, inspect the eye positions, then nudge the
 * two vectors below and flip SHOW_GLB_OVERLAY_EYES to true.
 */
const GLB_EYE_LEFT: [number, number, number] = [-0.12, 0.05, 0.18]
const GLB_EYE_RIGHT: [number, number, number] = [0.12, 0.05, 0.18]
const SHOW_GLB_OVERLAY_EYES = false // set true once head.glb exists & positions tuned

function GlbEye({ position }: { position: [number, number, number] }) {
  const pupil = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!pupil.current) return
    const x = state.pointer.x
    const y = state.pointer.y
    pupil.current.rotation.y = THREE.MathUtils.lerp(pupil.current.rotation.y, -x * 0.5, 0.12)
    pupil.current.rotation.x = THREE.MathUtils.lerp(pupil.current.rotation.x, y * 0.4, 0.12)
  })
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color="#0e0e12" roughness={0.25} />
      </mesh>
      <group ref={pupil} position={[0, 0, 0.03]}>
        <mesh>
          <sphereGeometry args={[0.018, 12, 12]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
      </group>
    </group>
  )
}

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
      // Responsive stage: wide screens park the model BIG on the RIGHT half,
      // narrow screens center it behind the copy.
      const wide = state.size.width / state.size.height >= 1
      const px = wide ? 1.7 : 0
      const py = wide ? -1.2 : -1.6
      const ps = wide ? 21 : 15
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
    <group ref={group} position={[1.7, -1.2, 0]} scale={21}>
      <Center disableY>
        <primitive object={scene} />
      </Center>
      {SHOW_GLB_OVERLAY_EYES && (
        <>
          <GlbEye position={GLB_EYE_LEFT} />
          <GlbEye position={GLB_EYE_RIGHT} />
        </>
      )}
    </group>
  )
}

export default function HeadAvatar() {
  const scrollProg = useScrollProgress()
  const content = MODEL_URL ? (
    <Suspense fallback={<PlaceholderHead scrollProg={scrollProg} />}>
      <GltfHead url={MODEL_URL} scrollProg={scrollProg} />
    </Suspense>
  ) : (
    <PlaceholderHead scrollProg={scrollProg} />
  )

  return (
    <group>
      {content}
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

// Preload only when a model is configured (avoids a 404 in placeholder mode)
if (MODEL_URL) useGLTF.preload(MODEL_URL)
