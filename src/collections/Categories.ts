import { slugField, type CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Category', plural: 'Categories' },
  access: {
    create: isAdminOrEditor,
    delete: isAdminOrEditor,
    read: anyone,
    update: isAdminOrEditor,
  },
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField({ position: 'sidebar' }),
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'active', type: 'checkbox', defaultValue: 'true' },
  ],
}
