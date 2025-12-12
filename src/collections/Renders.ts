import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'

export const Renders: CollectionConfig = {
  slug: 'render',
  access: {
    create: isAdminOrEditor,
    delete: isAdminOrEditor,
    read: anyone,
    update: isAdminOrEditor,
  },
  fields: [{ name: 'alt', type: 'text' }],
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    mimeTypes: ['model/gltf-binary'],
  },
}
