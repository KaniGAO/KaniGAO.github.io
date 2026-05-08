import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="text-center">
        {/* 404 Number */}
        <div className="text-8xl font-extrabold text-gray-200 dark:text-gray-800 sm:text-9xl">
          404
        </div>
        <h1 className="mt-4 text-2xl font-bold">Page Not Found</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>

        {/* Actions */}
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center rounded-xl bg-primary-500 px-6 py-3 font-medium text-white shadow-md shadow-primary-500/25 transition-all hover:bg-primary-600"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go Home
          </Link>
          <Link
            to="/projects"
            className="inline-flex items-center rounded-xl border border-gray-200 px-6 py-3 font-medium transition-all hover:border-primary-500/50 dark:border-gray-700"
          >
            Browse Projects
          </Link>
        </div>
      </div>
    </div>
  )
}
