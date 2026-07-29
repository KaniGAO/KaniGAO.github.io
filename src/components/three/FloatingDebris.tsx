import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type Shard = {
  pos: THREE.Vector3
  axis: THREE.Vector3
  rotSpeed: number
  floatSpeed: number
  floatAmp: number
  phase: number
  scale: number
}

const SKY_COUNT = 24
const RED_COUNT = 7

function makeShards(count: number): Shard[] {
  const shards: Shard[] = []
  for (let i = 0; i < count; i++) {
    shards.push({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 8.5,
        -4.5 + Math.random() * 5.5
      ),
      axis: new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize(),
      rotSpeed: 0.15 + Math.random() * 0.5,
      floatSpeed: 0.2 + Math.random() * 0.4,
      floatAmp: 0.2 + Math.random() * 0.45,
      phase: Math.random() * Math.PI * 2,
      scale: 0.06 + Math.random() * 0.22,
    })
  }
  return shards
}

type Props = {
  isDark: boolean
  reduced: boolean
}

/**
 * Floating debris — sparse wireframe shards tumbling slowly, plus one large
 * abstract wireframe icosahedron rotating in the deep background.
 */
export default function FloatingDebris({ isDark, reduced }: Props) {
  const skyRef = useRef<THREE.InstancedMesh>(null)
  const redRef = useRef<THREE.InstancedMesh>(null)
  const rigRef = useRef<THREE.Group>(null)

  const skyShards = useMemo(() => makeShards(SKY_COUNT), [])
  const redShards = useMemo(() => makeShards(RED_COUNT), [])
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame(({ clock }) => {
    const t = reduced ? 0 : clock.getElapsedTime()

    if (rigRef.current) {
      rigRef.current.rotation.y = t * 0.045
      rigRef.current.rotation.x = Math.sin(t * 0.09) * 0.1
    }

    const update = (mesh: THREE.InstancedMesh | null, shards: Shard[]) => {
      if (!mesh) return
      for (let i = 0; i < shards.length; i++) {
        const s = shards[i]
        dummy.position.set(
          s.pos.x + Math.sin(t * s.floatSpeed + s.phase) * s.floatAmp * 0.5,
          s.pos.y + Math.sin(t * s.floatSpeed * 0.9 + s.phase * 1.3) * s.floatAmp,
          s.pos.z
        )
        dummy.quaternion.setFromAxisAngle(s.axis, t * s.rotSpeed + s.phase)
        dummy.scale.setScalar(s.scale)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
      }
      mesh.instanceMatrix.needsUpdate = true
    }

    update(skyRef.current, skyShards)
    update(redRef.current, redShards)
  })

  return (
    <>
      {/* Sparse tumbling shards */}
      <instancedMesh
        ref={skyRef}
        args={[undefined, undefined, SKY_COUNT]}
        frustumCulled={false}
      >
        <tetrahedronGeometry args={[1, 0]} />
        <meshBasicMaterial
          wireframe
          transparent
          opacity={isDark ? 0.32 : 0.14}
          color="#38bdf8"
        />
      </instancedMesh>
      <instancedMesh
        ref={redRef}
        args={[undefined, undefined, RED_COUNT]}
        frustumCulled={false}
      >
        <tetrahedronGeometry args={[1, 0]} />
        <meshBasicMaterial
          wireframe
          transparent
          opacity={isDark ? 0.5 : 0.16}
          color="#ff2d4f"
        />
      </instancedMesh>

      {/* Large abstract structure in the deep background (right side) */}
      <group ref={rigRef} position={[4.2, 0.6, -5.5]}>
        <mesh>
          <icosahedronGeometry args={[3.6, 1]} />
          <meshBasicMaterial
            wireframe
            transparent
            opacity={isDark ? 0.06 : 0.04}
            color="#7dd3fc"
          />
        </mesh>
        <mesh rotation={[0.6, 0.4, 0]}>
          <torusGeometry args={[4.6, 0.02, 8, 96]} />
          <meshBasicMaterial
            transparent
            opacity={isDark ? 0.12 : 0.05}
            color="#38bdf8"
          />
        </mesh>
      </group>
    </>
  )
}
