import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/hooks/useTheme'
import Layout from '@/components/Layout'
import LoadingSpinner from '@/components/LoadingSpinner'
import AiAssistant from '@/components/AiAssistant'

// Lazy loaded pages
const Home = lazy(() => import('@/pages/Home'))
const Projects = lazy(() => import('@/pages/Projects'))
const Tools = lazy(() => import('@/pages/Tools'))
const Agent = lazy(() => import('@/pages/Agent'))
const Blog = lazy(() => import('@/pages/Blog'))
const BlogPost = lazy(() => import('@/pages/BlogPost'))
const About = lazy(() => import('@/pages/About'))
const NotFound = lazy(() => import('@/pages/NotFound'))

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingSpinner />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
    <HashRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="projects" element={<Projects />} />
            <Route path="tools" element={<Tools />} />
            <Route path="agent" element={<Agent />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
      <AiAssistant />
    </HashRouter>
    </ThemeProvider>
  )
}
