import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
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
const Quant = lazy(() => import('@/pages/Quant'))
const About = lazy(() => import('@/pages/About'))
const BarModel = lazy(() => import('@/pages/projects/BarModel'))
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
    <HashRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/bar-model" element={<BarModel />} />
            <Route path="tools" element={<Tools />} />
            <Route path="agent" element={<Agent />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="quant" element={<Quant />} />
            <Route path="about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
      <AiAssistant />
    </HashRouter>
  )
}
