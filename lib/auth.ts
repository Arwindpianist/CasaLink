// Authentication utilities for CasaLink
// This is a temporary demo authentication system before implementing Clerk

export type UserRole = 'platform_admin' | 'management' | 'security' | 'resident' | 'visitor' | 'moderator'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  condo_id: string
  condo_name: string
  unit_number?: string
  phone?: string
  avatar_url?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Demo accounts for each role
export const DEMO_ACCOUNTS: Record<string, User> = {
  'platform_admin': {
    id: 'demo-platform-admin-1',
    name: 'Alex Chen',
    email: 'admin@casalink.com',
    role: 'platform_admin',
    condo_id: 'global',
    condo_name: 'Platform Admin',
    phone: '+60123456789',
    avatar_url: '/placeholder-user.jpg'
  },
  'management': {
    id: 'demo-management-1',
    name: 'Sarah Wong',
    email: 'management@pavilion.com',
    role: 'management',
    condo_id: 'demo-condo-1',
    condo_name: 'Pavilion Residences',
    phone: '+60123456790',
    avatar_url: '/sarah-profile.jpg'
  },
  'security': {
    id: 'demo-security-1',
    name: 'John Doe',
    email: 'security@pavilion.com',
    role: 'security',
    condo_id: 'demo-condo-1',
    condo_name: 'Pavilion Residences',
    phone: '+60123456791',
    avatar_url: '/placeholder-user.jpg'
  },
  'resident': {
    id: 'demo-resident-1',
    name: 'Sarah Chen',
    email: 'sarah@email.com',
    role: 'resident',
    condo_id: 'demo-condo-1',
    condo_name: 'Pavilion Residences',
    unit_number: '12-A',
    phone: '+60123456792',
    avatar_url: '/sarah-profile.jpg'
  },
  'visitor': {
    id: 'demo-visitor-1',
    name: 'Mike Wong',
    email: 'visitor@example.com',
    role: 'visitor',
    condo_id: 'demo-condo-1',
    condo_name: 'Pavilion Residences',
    phone: '+60123456793',
    avatar_url: '/person-named-mike.png'
  },
  'moderator': {
    id: 'demo-moderator-1',
    name: 'Lisa Tan',
    email: 'moderator@pavilion.com',
    role: 'moderator',
    condo_id: 'demo-condo-1',
    condo_name: 'Pavilion Residences',
    phone: '+60123456794',
    avatar_url: '/placeholder-user.jpg'
  }
}

// Role-based access control
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
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

// Check if user has access to a route
export function hasAccess(userRole: UserRole, path: string): boolean {
  const allowedPaths = ROLE_PERMISSIONS[userRole]
  return allowedPaths.some(allowedPath => path.startsWith(allowedPath))
}

// Get default redirect path for a role
export function getDefaultPath(role: UserRole): string {
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

// Authentication functions
export function loginDemo(role: UserRole): User {
  const user = DEMO_ACCOUNTS[role]
  if (!user) {
    throw new Error(`Demo account for role ${role} not found`)
  }
  
  // Store in localStorage and cookie for demo purposes
  if (typeof window !== 'undefined') {
    localStorage.setItem('casalink-demo-user', JSON.stringify(user))
    // Also set cookie for middleware access
    document.cookie = `casalink-demo-user=${JSON.stringify(user)}; path=/; max-age=86400`
  }
  
  return user
}

export function logoutDemo(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('casalink-demo-user')
    // Clear cookie
    document.cookie = 'casalink-demo-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  
  try {
    const userData = localStorage.getItem('casalink-demo-user')
    return userData ? JSON.parse(userData) : null
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}
