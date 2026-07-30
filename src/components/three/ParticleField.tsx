import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Weighted palette: mostly ice-blue/white dust, a few neon-red and amber sparks
const PALETTE = [
  '#38bdf8', '#38bdf8', '#7dd3fc', '#e2e8f0', '#e2e8f0',
  '#ff2d4f', '#f5b544',
]

type Props = {
  isDark: boolean
  reduced: boolean
  /** particle count — lowered on phones via the device-quality tier */
  count: number
}

/**
 * Drifting particle dust field — colored light points floating in the void.
 * Per-particle sine drift + slow group rotation + subtle mouse parallax.
 */
export default function ParticleField({ isDark, reduced, count }: Props) {
  const pointsRef = useRef<THREE.Points>(null)
  const groupRef = useRef<THREE.Group>(null)

  const { positions, colors, base, phase, speed, amp } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const base = new Float32Array(count * 3)
    const phase = new Float32Array(count)
    const speed = new Float32Array(count)
    const amp = new Float32Array(count)
    const color = new THREE.Color()

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 17
      const y = (Math.random() - 0.5) * 9.5
      const z = -4.5 + Math.random() * 7
      positions.set([x, y, z], i * 3)
      base.set([x, y, z], i * 3)
      color.set(PALETTE[Math.floor(Math.random() * PALETTE.length)])
      colors.set([color.r, color.g, color.b], i * 3)
      phase[i] = Math.random() * Math.PI * 2
      speed[i] = 0.12 + Math.random() * 0.45
      amp[i] = 0.15 + Math.random() * 0.5
    }
    return { positions, colors, base, phase, speed, amp }
  }, [count])

  useFrame(({ clock, pointer }) => {
    if (reduced) return
    const t = clock.getElapsedTime()
    const pts = pointsRef.current
    if (pts) {
      const attr = pts.geometry.getAttribute('position') as THREE.BufferAttribute
      const arr = attr.array as Float32Array
      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        arr[i3] = base[i3] + Math.sin(t * speed[i] + phase[i]) * amp[i] * 0.45
        arr[i3 + 1] =
          base[i3 + 1] + Math.sin(t * speed[i] * 0.8 + phase[i] * 1.7) * amp[i]
      }
      attr.needsUpdate = true
    }
    const g = groupRef.current
    if (g) {
      g.rotation.y = t * 0.018 + pointer.x * 0.05
      g.rotation.x = pointer.y * -0.028
    }
  })

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={isDark ? 0.8 : 0.25}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}
