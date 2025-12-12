import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { s3Storage, S3StorageOptions } from '@payloadcms/storage-s3'
import { Plugin } from 'payload'

const s3StorageOptions: S3StorageOptions = {
  collections: {
    media: {
      prefix: 'media',
    },
    render: {
      prefix: 'render',
    },
  },
  bucket: process.env.R2_BUCKET,
  config: {
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
  },
}

const plugins: Plugin[] = [
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  payloadCloudPlugin(),
  s3Storage(s3StorageOptions),
]

export default plugins
