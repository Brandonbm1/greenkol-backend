import type { CollectionConfig, PayloadRequest } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { anyone } from '@/access/anyone'
import { ApiResponse } from '@/utilities/ApiResponse'
import { ApiResponseStatuses } from '@/utilities/ApiResponseStatuses'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'images',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media' }],
      minRows: 1,
    },
    {
      name: 'render',
      label: '3D Render (.glb)',
      type: 'upload',
      relationTo: 'render',
      required: false,
    },
    { name: 'description', type: 'textarea', required: true },
    {
      name: 'features',
      type: 'group',
      fields: [
        { name: 'outside', type: 'checkbox' },
        { name: 'reciclableMaterials', type: 'checkbox' },
        { name: 'lowMaintenance', type: 'checkbox' },
        { name: 'warranty', type: 'number', required: true },
      ],
    },
    { name: 'details', type: 'richText' },
    {
      name: 'specifications',
      type: 'group',
      fields: [
        {
          name: 'dimentions',
          type: 'group',
          fields: [
            { name: 'x', type: 'number', required: true },
            { name: 'y', type: 'number', required: true },
            { name: 'z', type: 'number', required: true },
          ],
        },
        { name: 'weight', type: 'number', required: true },
      ],
    },
    { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text' }] },
    {
      name: 'category',
      label: 'Category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
  ],
  endpoints: [
    {
      path: '/details/:id',
      method: 'get',
      handler: async (req: PayloadRequest) => {
        const { id } = req.routeParams as { id: string }

        try {
          const product = await req.payload.findByID({
            collection: 'products',
            id,
            depth: 1,
          })
          return ApiResponse({ product }, ApiResponseStatuses.OK)
        } catch (error) {
          console.error(error)
          return ApiResponse(
            { message: 'Internal server error' },
            ApiResponseStatuses.INTERNAL_SERVER_ERROR,
          )
        }
      },
    },
    {
      path: '/by-slug/:slug',
      method: 'get',
      handler: async (req: PayloadRequest) => {
        const { slug } = req.routeParams as { slug: string }
        const { name } = req.query as { name?: string }

        try {
          const category = await req.payload.find({
            collection: 'categories',
            where: {
              slug: { equals: slug },
            },
            limit: 1,
          })
          if (!category.docs.length) {
            return ApiResponse({ message: 'Category not found' }, ApiResponseStatuses.NOT_FOUND)
          }
          const categoryId = category.docs[0].id

          const query: { category: { equals: string }; name?: { like: string } } = {
            category: { equals: categoryId },
          }
          if (name) {
            query.name = {
              like: name,
            }
          }

          const products = await req.payload.find({
            collection: 'products',
            where: query,
            depth: 2,
          })

          return ApiResponse(products, ApiResponseStatuses.OK)
        } catch (error) {
          console.error(error)
          return ApiResponse(
            { message: 'Internal server error' },
            ApiResponseStatuses.INTERNAL_SERVER_ERROR,
          )
        }
      },
    },
  ],
}
