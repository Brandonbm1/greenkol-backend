import { User } from '@/payload-types'
import { FieldAccessArgs } from 'node_modules/payload/dist/fields/config/types'
import { AccessArgs, TypeWithID } from 'payload'

type isAdminOrEditor = (args: AccessArgs<User>) => boolean

type AccessContext<T extends TypeWithID = any, F = any> = AccessArgs<T> | FieldAccessArgs<T, F>
export const isAdminOrEditor: isAdminOrEditor = ({ req }: AccessContext) => {
  const user = req.user
  return Boolean(user && ['admin', 'editor'].includes(user.role))
}
