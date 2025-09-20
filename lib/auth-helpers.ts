import { auth } from '@clerk/nextjs/server'
import { 
  getUserByClerkId, 
  hasCondoAccess, 
  hasPermission, 
  type CasaLinkUser, 
  type UserRole 
} from './clerk-supabase'

// Server-side authentication helpers
export async function getCurrentUser(): Promise<CasaLinkUser | null> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return null
    }

    return await getUserByClerkId(userId)
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function requireAuth(): Promise<CasaLinkUser> {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  return user
}

export async function requireRole(allowedRoles: UserRole[]): Promise<CasaLinkUser> {
  const user = await requireAuth()
  
  if (!allowedRoles.includes(user.role)) {
    throw new Error(`Access denied. Required roles: ${allowedRoles.join(', ')}`)
  }
  
  return user
}

export async function requireCondoAccess(condoId: string): Promise<CasaLinkUser> {
  const user = await requireAuth()
  
  const hasAccess = await hasCondoAccess(user.clerk_id, condoId)
  
  if (!hasAccess) {
    throw new Error('Access denied to this condominium')
  }
  
  return user
}

export async function requirePermission(permission: string): Promise<CasaLinkUser> {
  const user = await requireAuth()
  
  if (!hasPermission(user.role, permission)) {
    throw new Error(`Permission denied: ${permission}`)
  }
  
  return user
}

// Role-specific helpers
export async function requirePlatformAdmin(): Promise<CasaLinkUser> {
  return requireRole(['platform_admin'])
}

export async function requireManagement(): Promise<CasaLinkUser> {
  return requireRole(['platform_admin', 'management'])
}

export async function requireSecurity(): Promise<CasaLinkUser> {
  return requireRole(['platform_admin', 'security'])
}

export async function requireResident(): Promise<CasaLinkUser> {
  return requireRole(['platform_admin', 'management', 'resident', 'moderator'])
}

export async function requireVisitor(): Promise<CasaLinkUser> {
  return requireRole(['platform_admin', 'visitor'])
}

// Permission-specific helpers
export async function requireReadPermission(): Promise<CasaLinkUser> {
  return requirePermission('read:condo')
}

export async function requireWritePermission(): Promise<CasaLinkUser> {
  return requirePermission('write:residents')
}

export async function requireModeratePermission(): Promise<CasaLinkUser> {
  return requirePermission('moderate:content')
}

export async function requireManagePermission(): Promise<CasaLinkUser> {
  return requirePermission('manage:users')
}

// Utility functions
export function isPlatformAdmin(user: CasaLinkUser): boolean {
  return user.role === 'platform_admin'
}

export function isManagement(user: CasaLinkUser): boolean {
  return ['platform_admin', 'management'].includes(user.role)
}

export function isSecurity(user: CasaLinkUser): boolean {
  return ['platform_admin', 'security'].includes(user.role)
}

export function isResident(user: CasaLinkUser): boolean {
  return ['platform_admin', 'management', 'resident', 'moderator'].includes(user.role)
}

export function isVisitor(user: CasaLinkUser): boolean {
  return ['platform_admin', 'visitor'].includes(user.role)
}

export function isModerator(user: CasaLinkUser): boolean {
  return ['platform_admin', 'management', 'moderator'].includes(user.role)
}

// Route protection helpers
export async function protectRoute(allowedRoles: UserRole[]): Promise<CasaLinkUser> {
  return requireRole(allowedRoles)
}

export async function protectCondoRoute(condoId: string, allowedRoles?: UserRole[]): Promise<CasaLinkUser> {
  const user = await requireCondoAccess(condoId)
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new Error(`Access denied. Required roles: ${allowedRoles.join(', ')}`)
  }
  
  return user
}

// Middleware helpers
export async function getAuthContext() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return {
        isAuthenticated: false,
        user: null,
        error: 'Not authenticated'
      }
    }

    const user = await getUserByClerkId(userId)
    
    if (!user) {
      return {
        isAuthenticated: false,
        user: null,
        error: 'User not found'
      }
    }

    return {
      isAuthenticated: true,
      user,
      error: null
    }
  } catch (error) {
    return {
      isAuthenticated: false,
      user: null,
      error: error instanceof Error ? error.message : 'Authentication error'
    }
  }
}

// API route helpers
export function createAuthError(message: string, status: number = 401) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}

export async function withAuth<T>(
  handler: (user: CasaLinkUser) => Promise<Response> | Response,
  allowedRoles?: UserRole[]
): Promise<Response> {
  try {
    const user = allowedRoles ? await requireRole(allowedRoles) : await requireAuth()
    return await handler(user)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Authentication error'
    return createAuthError(message, 401)
  }
}

export async function withCondoAuth<T>(
  condoId: string,
  handler: (user: CasaLinkUser) => Promise<Response> | Response,
  allowedRoles?: UserRole[]
): Promise<Response> {
  try {
    const user = await protectCondoRoute(condoId, allowedRoles)
    return await handler(user)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Authentication error'
    return createAuthError(message, 403)
  }
}

// Client-side helpers (for use in components)
export function getDefaultRedirectPath(role: UserRole): string {
  switch (role) {
    case 'platform_admin':
    case 'management':
      return '/admin'
    case 'security':
      return '/security'
    case 'resident':
    case 'moderator':
      return '/resident'
    case 'visitor':
      return '/visitor'
    default:
      return '/demo'
  }
}

export function canAccessRoute(userRole: UserRole, path: string): boolean {
  const rolePermissions: Record<UserRole, string[]> = {
    platform_admin: [
      '/admin',
      '/admin/condos',
      '/resident',
      '/resident/board',
      '/resident/chat',
      '/resident/profile',
      '/resident/qr',
      '/security',
      '/security/visitors',
      '/visitor',
      '/visitor/amenity',
      '/visitor/scan',
      '/demo'
    ],
    management: [
      '/admin',
      '/admin/condos',
      '/resident',
      '/resident/board',
      '/resident/chat',
      '/resident/profile',
      '/resident/qr',
      '/demo'
    ],
    security: [
      '/security',
      '/security/visitors',
      '/demo'
    ],
    resident: [
      '/resident',
      '/resident/board',
      '/resident/chat',
      '/resident/profile',
      '/resident/qr',
      '/visitor/amenity',
      '/demo'
    ],
    visitor: [
      '/visitor',
      '/visitor/amenity',
      '/visitor/scan',
      '/demo'
    ],
    moderator: [
      '/resident',
      '/resident/board',
      '/resident/chat',
      '/resident/profile',
      '/demo'
    ]
  }

  const allowedPaths = rolePermissions[userRole] || []
  return allowedPaths.some(allowedPath => path.startsWith(allowedPath))
}
