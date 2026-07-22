import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const isSanityConfigured = Boolean(projectId && dataset)

export const client = createClient({
  projectId: projectId || 'placeholder',
  dataset:   dataset   || 'production',
  apiVersion,
  useCdn: true, // serve published content from Sanity CDN (fast, cached)
})
