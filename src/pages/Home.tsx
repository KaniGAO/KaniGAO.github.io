import { Link } from 'react-router-dom'
import Hero from '@/components/Hero'
import { projects } from '@/data/projects'
import { getSortedPosts } from '@/utils/blog'

function FeaturedProjects() {
  const featured = projects.slice(0, 3)

  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-2xl font-bold">精选项目</h2>
          <Link
            to="/projects"
            className="text-sm font-medium text-primary-500 hover:text-primary-400"
          >
            查看全部 &rarr;
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, index) => (
            <Link
              key={project.id}
              to="/projects"
              className="card-base group p-6 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Category Badge */}
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium mb-4 ${
                project.category === 'fullstack' ? 'bg-purple-500/10 text-purple-500' :
                project.category === 'frontend' ? 'bg-blue-500/10 text-blue-500' :
                project.category === 'backend' ? 'bg-green-500/10 text-green-500' :
                'bg-orange-500/10 text-orange-500'
              }`}>
                {project.category === 'fullstack' ? '全栈' :
                 project.category === 'frontend' ? '前端' :
                 project.category === 'backend' ? '后端' : '工具'}
              </span>

              <h3 className="mb-2 text-lg font-semibold group-hover:text-primary-500 transition-colors">
                {project.title}
              </h3>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function LatestPosts() {
  const posts = getSortedPosts().slice(0, 3)

  return (
    <section className="border-t border-gray-200/10 py-16">
      <div className="container-custom">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-2xl font-bold">最新文章</h2>
          <Link
            to="/blog"
            className="text-sm font-medium text-primary-500 hover:text-primary-400"
          >
            查看全部 &rarr;
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="card-base group p-6"
            >
              <time className="text-xs text-gray-500">{post.date}</time>
              <h3 className="mt-2 mb-2 font-semibold group-hover:text-primary-500 transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-xs text-gray-400">{post.readingTime}</span>
                <div className="flex gap-1.5">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="rounded bg-primary-500/10 px-2 py-0.5 text-xs text-primary-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <LatestPosts />
    </>
  )
}
