import { client, isSanityConfigured } from './client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

const builder = imageUrlBuilder(client)
export const urlFor = (source: SanityImageSource) => builder.image(source)

// Projects
export async function getFeaturedProjects() {
  if (!isSanityConfigured) return []
  return client.fetch(`*[_type=="project" && featured==true] | order(_createdAt desc) [0..4] {
    title, slug, category, coverImage
  }`)
}

export async function getAllProjects() {
  if (!isSanityConfigured) return []
  return client.fetch(`*[_type=="project"] | order(year desc) {
    title, slug, category, area, location, year, coverImage
  }`)
}

export async function getProjectBySlug(slug: string) {
  if (!isSanityConfigured) return null
  return client.fetch(`*[_type=="project" && slug.current==$slug][0] {
    title, slug, category, area, location, year, services,
    coverImage, gallery, brief, designStory, tags, seoTitle, seoDescription
  }`, { slug })
}

export async function getAllProjectSlugs() {
  if (!isSanityConfigured) return []
  return client.fetch(`*[_type=="project"]{ "slug": slug.current, _updatedAt }`)
}

// Blog
export async function getAllBlogPosts() {
  if (!isSanityConfigured) return []
  return client.fetch(`*[_type=="blogPost"] | order(publishedAt desc) {
    title, slug, category, coverImage, excerpt, author, publishedAt, readTime
  }`)
}

export async function getBlogPostBySlug(slug: string) {
  if (!isSanityConfigured) return null
  return client.fetch(`*[_type=="blogPost" && slug.current==$slug][0] {
    title, slug, category, coverImage, excerpt, author,
    publishedAt, readTime, body, tags, seoTitle, seoDescription
  }`, { slug })
}

export async function getAllBlogSlugs() {
  if (!isSanityConfigured) return []
  return client.fetch(`*[_type=="blogPost"]{ "slug": slug.current, _updatedAt }`)
}

// Testimonials
export async function getTestimonials() {
  if (!isSanityConfigured) return []
  return client.fetch(`*[_type=="testimonial"] | order(order asc) { quote, author, location, rating, date, sourceUrl, avatarGender }`)
}

// --- Construction Projects ---

export type ConstructionProject = {
  title:          string
  slug:           { current: string }
  category:       string
  coverImage?:    { asset: { _ref: string }; hotspot?: unknown }
  localImage?:    string
  location?:      string
  area?:          string
  completionYear?: number
  description?:   string
}

export async function getFeaturedConstructionProjects(): Promise<ConstructionProject[]> {
  if (!isSanityConfigured) return []
  return client.fetch(
    `*[_type=="constructionProject"] | order(_createdAt desc)[0...5] {
      title, slug, category, coverImage, location, area, completionYear, description
    }`
  )
}

export async function getAllConstructionProjects(): Promise<ConstructionProject[]> {
  if (!isSanityConfigured) return []
  return client.fetch(
    `*[_type=="constructionProject"] | order(_createdAt desc) {
      title, slug, category, coverImage, location, area, completionYear, description
    }`
  )
}

export async function getConstructionProjectBySlug(slug: string) {
  if (!isSanityConfigured) return null
  return client.fetch(
    `*[_type=="constructionProject" && slug.current==$slug][0] {
      title, slug, category, coverImage, location, area, completionYear, description, body
    }`,
    { slug }
  )
}

export async function getAllConstructionProjectSlugs() {
  if (!isSanityConfigured) return []
  return client.fetch(`*[_type=="constructionProject"]{ "slug": slug.current, _updatedAt }`)
}
