import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { isAdmin } from '@/access/isAdmin'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: isAdmin,
    delete: isAdmin,
    read: isAdminOrEditor,
    update: isAdminOrEditor,
  },
  admin: { defaultColumns: ['name', 'email'], useAsTitle: 'name' },
  auth: true,
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      access: { update: isAdmin },
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Vendedor', value: 'seller' },
        { label: 'Veedor', value: 'viewer' },
      ],
      defaultValue: 'viewer',
      required: true,
    },
  ],
  timestamps: true,
}
