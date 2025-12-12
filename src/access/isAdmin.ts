import { User } from '@/payload-types'
import { FieldAccessArgs } from 'node_modules/payload/dist/fields/config/types'
import { AccessArgs, TypeWithID } from 'payload'

type isAdmin = (args: AccessArgs<User>) => boolean

type AccessContext<T extends TypeWithID = any, F = any> = AccessArgs<T> | FieldAccessArgs<T, F>

export const isAdmin = ({ req }: AccessContext): boolean => {
  const user = req.user
  return user?.role === 'admin'
}
