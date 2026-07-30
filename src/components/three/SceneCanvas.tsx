import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Environment, Lightformer } from '@react-three/drei'
import { useTheme } from '@/hooks/useTheme'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useDeviceQuality } from '@/hooks/useDeviceQuality'
import HeadAvatar from './HeadAvatar'
import ParticleField from './ParticleField'
import FloatingDebris from './FloatingDebris'

/**
 * @param paused  when true (scene scrolled out / tab hidden) the render loop
 *                is stopped entirely to save CPU, battery and stop throttling.
 */
export default function SceneCanvas({ paused = false }: { paused?: boolean }) {
  const { isDark } = useTheme()
  const reduced = usePrefersReducedMotion()
  const q = useDeviceQuality()
  const bg = isDark ? '#04060d' : '#edf2fa'

  return (
    <Canvas
      camera={{ position: [0.35, 0.45, 5.6], fov: 40 }}
      dpr={q.dpr}
      // Stop drawing when the scene is off-screen or the tab is hidden: the
      // single biggest win against background stutter / heat-driven throttling.
      frameloop={paused || reduced ? 'never' : 'always'}
      gl={{ antialias: q.antialias, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[bg, 7, 13]} />
      {/* Cool neutral ambient — never warm, keeps the model inside the
          page's cool blue / red light language. */}
      <ambientLight intensity={isDark ? 0.55 : 0.9} />
      {/* PRIMARY KEY light from the RIGHT — cool blue, echoing the page's
          right-side blue glow so the head reads as lit by the same source. */}
      <directionalLight
        position={[4, 3, 2]}
        intensity={isDark ? 1.25 : 1.1}
        color={isDark ? '#7cc4ff' : '#9ec8ff'}
      />
      {/* Soft fill from the left-front — cool daylight, no warm cast. */}
      <directionalLight
        position={[-4, 1.5, 2]}
        intensity={0.55}
        color={isDark ? '#bcd4ff' : '#cfe0ff'}
      />
      {/* Neon-red RIM from behind-left — the signature accent, present in
          BOTH themes so the model never loses its red edge. */}
      <directionalLight
        position={[-6, 2.5, -4]}
        intensity={isDark ? 1.15 : 0.55}
        color="#ff2d4f"
      />
      {/* Cool neutralizing kicker in front (replaces the old warm point). */}
      <pointLight
        position={[0, 1, 3]}
        intensity={isDark ? 0.35 : 0.22}
        color="#cfe3ff"
      />
      <ParticleField isDark={isDark} reduced={reduced} count={q.particleCount} />
      <FloatingDebris
        isDark={isDark}
        reduced={reduced}
        skyCount={q.debrisSky}
        redCount={q.debrisRed}
      />
      {/* Procedural studio environment (no network fetch) — gives the PBR
          model realistic ambient light + soft reflections. */}
      <Environment resolution={q.envResolution}>
        <Lightformer
          intensity={isDark ? 1.1 : 1.4}
          position={[0, 2, 3]}
          scale={[6, 6, 1]}
          color="#dbeafe"
        />
        <Lightformer
          intensity={0.6}
          position={[-3, 1, 2]}
          scale={[3, 3, 1]}
          color="#88aaff"
        />
        <Lightformer
          intensity={0.6}
          position={[3, 0, 2]}
          scale={[3, 3, 1]}
          color="#7cc4ff"
        />
      </Environment>
      <Suspense fallback={null}>
        <HeadAvatar />
      </Suspense>
    </Canvas>
  )
}
