declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PAYLOAD_SECRET: string
      DATABASE_URI: string
      R2_ENDPOINT: string
      R2_ACCESS_KEY_ID: string
      R2_SECRET_ACCESS_KEY: string
      R2_BUCKET: string
      R2_TOKEN: string
      RESEND_API_KEY: string
      CONTACT_EMAIL: string
      SUPPORT_EMAIL: string
      NO_REPLY_EMAIL: string
      ALLOWED_ORIGINS: string[]
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
