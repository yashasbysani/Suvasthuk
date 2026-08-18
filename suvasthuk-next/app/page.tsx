import Hero           from '@/components/home/Hero'
import Marquee        from '@/components/home/Marquee'
import AboutStrip     from '@/components/home/AboutStrip'
import ServicesGrid   from '@/components/home/ServicesGrid'
import ProjectsMosaic  from '@/components/home/ProjectsMosaic'
import Testimonial    from '@/components/home/Testimonial'
import BlogPreview    from '@/components/home/BlogPreview'
import CtaBand        from '@/components/home/CtaBand'
import { getFeaturedProjects, getTestimonials, getAllBlogPosts } from '@/sanity/lib/queries'


export const revalidate = 3600 // ISR: re-generate at most once an hour

export default async function HomePage() {
  // Gracefully fall back to empty arrays if Sanity is not yet configured
  const [projects, testimonials, posts] = await Promise.all([
    getFeaturedProjects().catch(() => []),
    getTestimonials().catch(() => []),
    getAllBlogPosts().catch(() => []),
  ])

  return (
    <main id="main-content">
      <Hero />
      <Marquee />
      <AboutStrip />
      <ServicesGrid />
      <ProjectsMosaic projects={projects} />
      <Testimonial testimonials={testimonials} />
      <BlogPreview posts={posts.slice(0, 3)} totalCount={posts.length} />
      <CtaBand />
    </main>
  )
}
