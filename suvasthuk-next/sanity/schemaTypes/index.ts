import { type SchemaTypeDefinition } from 'sanity'
import { project }             from './project'
import { blogPost }            from './blogPost'
import { testimonial }         from './testimonial'
import { constructionProject } from './constructionProject'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [project, blogPost, testimonial, constructionProject],
}
