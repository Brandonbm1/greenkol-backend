import type { CollectionConfig, PayloadRequest } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { anyone } from '@/access/anyone'
import { ApiResponse } from '@/utilities/ApiResponse'
import { ApiResponseStatuses } from '@/utilities/ApiResponseStatuses'
import { ApiErrorLogger } from '@/utilities/ApiErrorLogger'

export const Projects: CollectionConfig = {
  slug: 'projects',
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
        { name: 'weight', type: 'number', required: false },
      ],
    },
    {
      name: 'importance',
      type: 'select',
      options: [
        { label: 'Important', value: 'important' },
        { label: 'Regular', value: 'regular' },
        { label: 'Hidden', value: 'hidden' },
      ],
      defaultValue: 'hidden',
      required: true,
    },
    {
      name: 'customer',
      label: 'Customer',
      type: 'relationship',
      relationTo: 'customers',
      required: false,
    },
    {
      name: 'vendor',
      label: 'Vendor',
      type: 'relationship',
      relationTo: 'users',
      required: false,
    },
  ],
  endpoints: [
    {
      path: '/details/:id',
      method: 'get',
      handler: async (req: PayloadRequest) => {
        const { id } = req.routeParams as { id: string }

        try {
          const project = await req.payload.findByID({
            collection: 'projects',
            id,
            depth: 1,
          })
          return ApiResponse({ project }, ApiResponseStatuses.OK)
        } catch (error) {
          ApiErrorLogger('Projects', error, 'get')
          return ApiResponse(
            { message: 'Internal server error' },
            ApiResponseStatuses.INTERNAL_SERVER_ERROR,
          )
        }
      },
    },
    {
      path: '/important',
      method: 'get',
      handler: async (req: PayloadRequest) => {
        try {
          const projects = await req.payload.find({
            collection: 'projects',
            where: {
              importance: {
                equals: 'important',
              },
            },
            select: {
              name: true,
              description: true,
              images: true,
            },
          })

          return ApiResponse(projects, ApiResponseStatuses.OK)
        } catch (error) {
          ApiErrorLogger('Projects', error, 'get')
          return ApiResponse(
            { message: 'Internal server error' },
            ApiResponseStatuses.INTERNAL_SERVER_ERROR,
          )
        }
      },
    },
  ],
}
