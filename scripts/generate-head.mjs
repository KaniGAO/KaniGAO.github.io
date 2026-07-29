#!/usr/bin/env node
/**
 * Meshy Image-to-3D → GLB generator for the homepage avatar.
 *
 * Usage:
 *   1. cp scripts/.env.example scripts/.env   (then fill MESHY_API_KEY + IMAGE_URL)
 *   2. node scripts/generate-head.mjs
 *
 * It creates a Meshy image-to-3d task, polls until it succeeds, then downloads
 * the GLB into public/models/head.glb so HeadAvatar.tsx picks it up automatically.
 *
 * Requires Node >= 18 (native fetch). Get a key at https://meshy.ai → API.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

/** Minimal .env loader (no dependency needed). */
function loadEnv() {
  const envPath = resolve(__dirname, '.env')
  if (!existsSync(envPath)) {
    console.error(
      '[meshy] scripts/.env not found.\n' +
        '       cp scripts/.env.example scripts/.env  then fill in your key + image URL.'
    )
    process.exit(1)
  }
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  }
}
loadEnv()

const API_KEY = process.env.MESHY_API_KEY
const IMAGE_URL = process.env.IMAGE_URL
const OUT = resolve(ROOT, 'public/models/head.glb')

if (!API_KEY || !IMAGE_URL) {
  console.error('[meshy] Missing MESHY_API_KEY or IMAGE_URL in scripts/.env')
  process.exit(1)
}

const API = 'https://api.meshy.ai/openapi/v1'

async function createTask() {
  const res = await fetch(`${API}/image-to-3d`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image_url: IMAGE_URL,
      enable_pbr: true,
      target_formats: ['glb'],
      // symmetric topology helps a face look correct
      should_remesh: true,
      symmetry: true,
    }),
  })
  if (!res.ok) throw new Error(`create failed ${res.status}: ${await res.text()}`)
  const data = await res.json()
  return data.result
}

async function poll(taskId) {
  const start = Date.now()
  while (true) {
    const res = await fetch(`${API}/image-to-3d/${taskId}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    })
    if (!res.ok) throw new Error(`poll failed ${res.status}`)
    const data = await res.json()
    const status = data.status
    const elapsed = ((Date.now() - start) / 1000).toFixed(0)
    process.stdout.write(`\r[meshy] status=${status}  ${elapsed}s   `)
    if (status === 'SUCCEEDED') {
      console.log('')
      return data
    }
    if (status === 'FAILED') throw new Error(`task failed: ${JSON.stringify(data)}`)
    await new Promise((r) => setTimeout(r, 5000))
  }
}

async function download(url, out) {
  mkdirSync(dirname(out), { recursive: true })
  const res = await fetch(url)
  if (!res.ok) throw new Error(`download failed ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  writeFileSync(out, buf)
  console.log(`[meshy] saved ${buf.length.toLocaleString()} bytes -> ${out}`)
}

const task = await createTask()
console.log(`[meshy] task created: ${task}`)
const result = await poll(task)
const glbUrl = result.model_urls?.glb
if (!glbUrl) throw new Error('no glb url in result — check result.model_urls')
await download(glbUrl, OUT)
console.log('[meshy] done. Reload the site to see your 3D head.')
