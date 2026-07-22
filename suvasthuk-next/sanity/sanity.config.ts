import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { project }     from './schemaTypes/project'
import { blogPost }    from './schemaTypes/blogPost'
import { testimonial } from './schemaTypes/testimonial'
import { constructionProject } from './schemaTypes/constructionProject'

export default defineConfig({
  name: 'suvasthuk',
  title: 'Suvasthuk Architects CMS',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: { types: [project, blogPost, testimonial, constructionProject] },
})
