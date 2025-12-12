import { AccessArgs } from 'payload'
import { User } from '@/payload-types'

// Esta función genera una función de acceso según los roles permitidos
const USER_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
  SELLER: 'seller',
} as const

const hasRoles =
  (roles: Array<User['role']>) =>
  ({ req }: AccessArgs<User>): boolean => {
    if (!roles.length) return Boolean(true)
    const user = req.user
    if (!user) return false
    return roles.includes(user.role)
  }

export const isAdmin = hasRoles([USER_ROLES.ADMIN])
export const isAdminOrEditor = hasRoles([USER_ROLES.ADMIN, USER_ROLES.EDITOR])
export const isEditorOrViewer = hasRoles([USER_ROLES.EDITOR, USER_ROLES.VIEWER])
export const isNotViewer = hasRoles([USER_ROLES.ADMIN, USER_ROLES.EDITOR, USER_ROLES.SELLER])
export const isAnyRole = hasRoles([])
