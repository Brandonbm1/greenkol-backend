import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { anyone } from '@/access/anyone'
import { ApiErrorLogger } from '@/utilities/ApiErrorLogger'
import { ApiResponse } from '@/utilities/ApiResponse'
import { ApiResponseStatuses } from '@/utilities/ApiResponseStatuses'
import { env } from 'process'

export const Customer: CollectionConfig = {
  slug: 'customers',
  access: {
    create: anyone,
    delete: isAdminOrEditor,
    read: isAdminOrEditor,
    update: isAdminOrEditor,
  },
  admin: { defaultColumns: ['name', 'email'], useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    {
      name: 'address',
      type: 'group',
      fields: [
        {
          name: 'country',
          type: 'text',
          required: false,
        },
        {
          name: 'state',
          type: 'text',
          required: false,
        },
        {
          name: 'city',
          type: 'text',
          required: false,
        },
        {
          name: 'address',
          type: 'text',
          required: false,
        },
        {
          name: 'additionalData',
          type: 'text',
          required: false,
        },
      ],
      required: false,
    },
    {
      name: 'messages',
      type: 'array',
      fields: [
        { name: 'text', type: 'text' },
        { name: 'createdAt', type: 'date' },
      ],
    },
  ],
  timestamps: true,
  endpoints: [
    {
      path: '/send-message',
      method: 'post',
      handler: async (req) => {
        const data: {
          name: string
          email: string
          phone?: string
          message: string
        } | null = req.json ? await req.json() : null

        try {
          if (!data) {
            return ApiResponse({ message: 'Data is required' }, ApiResponseStatuses.BAD_REQUEST)
          }
          if (!data.email || !data.name || !data.message) {
            return ApiResponse({ message: 'Insuficient data' }, ApiResponseStatuses.BAD_REQUEST)
          }
          const existing = await req.payload.find({
            collection: 'customers',
            where: { email: { equals: data.email } },
            limit: 1,
          })

          const customer = existing.docs[0]

          if (!customer) {
            await req.payload.create({
              collection: 'customers',
              data: {
                name: data.name,
                email: data.email,
                phone: data.phone || '',
                messages: [
                  {
                    text: data.message,
                    createdAt: new Date().toISOString(),
                  },
                ],
              },
              draft: false,
            })
          } else {
            req.payload.update({
              collection: 'customers',
              id: customer.id,
              data: {
                messages: [
                  ...(customer.messages || []),
                  {
                    text: data.message,
                    createdAt: new Date().toISOString(),
                  },
                ],
              },
            })
          }

          const fromEmail = env.NO_REPLY_EMAIL
          // CONFIRMATION EMAIL TO USER
          await req.payload.sendEmail({
            from: fromEmail,
            to: data.email,
            subject: 'Nuevo Mensaje',
            html: `
              <h2>Hola ${data.name},</h2>
              <p>Gracias por escribirnos. Hemos recibido tu mensaje:</p>
              <blockquote>${data.message}</blockquote>
              <p>Te contactaremos pronto.</p>
            `,
          })

          // EMAIL TO GREENKOL SUPPORT
          const supportEmail = env.SUPPORT_EMAIL
          await req.payload.sendEmail({
            from: fromEmail,
            to: supportEmail,
            subject: `Nuevo Mensaje de ${data.name}`,
            html: `
              <h2>Nuevo Mensaje de ${data.name}</h2>
              <p>Correo electronico ${data.email}</p>
              <blockquote>${data.message}</blockquote>
              <p>Favor contactar lo mas pronto posible</p>
            `,
          })

          return ApiResponse({ created: true }, ApiResponseStatuses.OK)
        } catch (error) {
          ApiErrorLogger('Customer', error, 'get')
          return ApiResponse(
            { message: 'Internal server error' },
            ApiResponseStatuses.INTERNAL_SERVER_ERROR,
          )
        }
      },
    },
  ],
}
