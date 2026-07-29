import { useState } from 'react'

export default function Agent() {
  const [apiReady] = useState(false)

  return (
    <div className="py-16">
      <div className="container-custom max-w-3xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">Ask Agent</h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            An AI assistant that knows everything about me — my projects, skills,
            and experience.
          </p>
        </div>

        <div className="card-base p-8 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10 text-2xl">
            🤖
          </div>
          <h2 className="mb-2 text-xl font-semibold">Coming online</h2>
          <p className="mx-auto max-w-md text-sm text-gray-600 dark:text-gray-400">
            The agent is wired to a backend API (Cloudflare Worker → Claude) so it
            can answer from my full knowledge base. Backend setup is Phase 2 —
            {apiReady
              ? ' it is live now.'
              : ' placeholder for now, UI ready.'}
          </p>
          <div className="mt-6 rounded-lg border border-dashed border-gray-300/60 p-4 text-sm text-gray-500 dark:border-gray-700/60">
            Try: “What quant projects has Kani shipped?” / “Summarize his WorldQuant
            work.”
          </div>
        </div>
      </div>
    </div>
  )
}
