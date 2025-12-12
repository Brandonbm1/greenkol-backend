// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { resendAdapter } from '@payloadcms/email-resend'

import sharp from 'sharp'

import COLLECTIONS from './collections/'
import PLUGINS from './plugins'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const allowedOrigins: string[] = (() => {
  try {
    const res = JSON.parse(process.env.ALLOWED_ORIGINS || '[]')
    console.log(res)
    return res
  } catch (_) {
    console.error('Invalid ALLOWED_ORIGINS:', process.env.ALLOWED_ORIGINS)
    return []
  }
})()

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: COLLECTIONS,
  email: resendAdapter({
    defaultFromAddress: process.env.NO_REPLY_EMAIL,
    defaultFromName: 'GreenKol SAS',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: PLUGINS,
  cors: allowedOrigins.filter(Boolean),
})
