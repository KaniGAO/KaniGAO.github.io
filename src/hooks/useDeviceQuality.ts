import { useMemo } from 'react'

export type DeviceQuality = {
  /** 'low' = phone / weak device, 'high' = desktop / capable device */
  tier: 'low' | 'high'
  /** number of drifting particles */
  particleCount: number
  /** device-pixel-ratio clamp passed to the R3F Canvas */
  dpr: [number, number]
  /** tumbling wireframe shards (cool sky) */
  debrisSky: number
  /** tumbling wireframe shards (neon-red accent) */
  debrisRed: number
  /** Environment cubemap resolution (lower = cheaper to generate) */
  envResolution: number
  /** MSAA — disabled on weak devices to save fill-rate */
  antialias: boolean
}

const HIGH: DeviceQuality = {
  tier: 'high',
  particleCount: 380,
  dpr: [1, 2],
  debrisSky: 24,
  debrisRed: 7,
  envResolution: 256,
  antialias: true,
}

const LOW: DeviceQuality = {
  tier: 'low',
  particleCount: 130,
  dpr: [1, 1.5],
  debrisSky: 12,
  debrisRed: 4,
  envResolution: 128,
  antialias: false,
}

/**
 * Picks a render-quality tier from device signals (viewport width, CPU cores,
 * device memory, UA). Phones / low-core / low-memory devices get fewer
 * particles, a lower DPR cap and no antialiasing so the WebGL scene stays
 * smooth and cool instead of stuttering or cooking the device.
 */
export function useDeviceQuality(): DeviceQuality {
  return useMemo(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return HIGH
    }
    const isMobileViewport = window.matchMedia('(max-width: 768px)').matches
    const isMobileUA = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    const cores = navigator.hardwareConcurrency ?? 8
    // deviceMemory is non-standard; guard the access
    const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory
    const lowMemory = typeof mem === 'number' && mem <= 4
    const low = isMobileViewport || isMobileUA || cores <= 4 || lowMemory
    return low ? LOW : HIGH
  }, [])
}
