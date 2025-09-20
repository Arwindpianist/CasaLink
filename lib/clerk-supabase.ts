import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'

// This file should only be imported on the server side

// Supabase client configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client with Clerk authentication
export async function createServerSupabaseClient() {
  const { getToken } = auth()
  
  try {
    const token = await getToken({ template: 'supabase' })
    
    if (!token) {
      throw new Error('No Clerk token available')
    }

    return createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })
  } catch (error) {
    console.error('Error creating server Supabase client:', error)
    return supabase // Fallback to anonymous client
  }
}

// Client-side Supabase client with Clerk authentication
export function createClientSupabaseClient(token: string) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}

// User role type
export type UserRole = 'platform_admin' | 'management' | 'security' | 'resident' | 'visitor' | 'moderator'

// Extended user interface with Clerk integration
export interface CasaLinkUser {
  id: string
  clerk_id: string // Clerk user ID
  condo_id: string
  unit_id?: string
  role: UserRole
  name: string
  email: string
  phone?: string
  avatar_url?: string
  preferences: Record<string, any>
  is_active: boolean
  last_seen_at?: string
  created_at: string
  updated_at: string
}

// Condominium interface
export interface Condominium {
  id: string
  name: string
  type: string
  address: string
  city?: string
  state?: string
  country: string
  postal_code?: string
  subscription_plan: string
  monthly_revenue: number
  status: string
  settings: Record<string, any>
  created_at: string
  updated_at: string
}

// Sync Clerk user with Supabase
export async function syncClerkUserWithSupabase(clerkUser: any, role: UserRole, condoId: string) {
  try {
    const serverSupabase = await createServerSupabaseClient()
    
    // Check if user already exists
    const { data: existingUser, error: fetchError } = await serverSupabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkUser.id)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError
    }

    const userData = {
      clerk_id: clerkUser.id,
      condo_id: condoId,
      role: role,
      name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || clerkUser.emailAddresses[0]?.emailAddress,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      phone: clerkUser.phoneNumbers[0]?.phoneNumber,
      avatar_url: clerkUser.imageUrl,
      preferences: {},
      is_active: true,
      last_seen_at: new Date().toISOString(),
    }

    if (existingUser) {
      // Update existing user
      const { data, error } = await serverSupabase
        .from('users')
        .update({
          ...userData,
          updated_at: new Date().toISOString(),
        })
        .eq('clerk_id', clerkUser.id)
        .select()
        .single()

      if (error) throw error
      return data
    } else {
      // Create new user
      const { data, error } = await serverSupabase
        .from('users')
        .insert(userData)
        .select()
        .single()

      if (error) throw error
      return data
    }
  } catch (error) {
    console.error('Error syncing Clerk user with Supabase:', error)
    throw error
  }
}

// Get user from Supabase by Clerk ID
export async function getUserByClerkId(clerkId: string): Promise<CasaLinkUser | null> {
  try {
    const serverSupabase = await createServerSupabaseClient()
    
    const { data, error } = await serverSupabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // User not found
      }
      throw error
    }

    return data
  } catch (error) {
    console.error('Error fetching user by Clerk ID:', error)
    return null
  }
}

// Get user's condominium
export async function getUserCondominium(userId: string): Promise<Condominium | null> {
  try {
    const serverSupabase = await createServerSupabaseClient()
    
    const { data, error } = await serverSupabase
      .from('users')
      .select(`
        condominiums (*)
      `)
      .eq('id', userId)
      .single()

    if (error) throw error
    return data?.condominiums || null
  } catch (error) {
    console.error('Error fetching user condominium:', error)
    return null
  }
}

// Check if user has access to a specific condo
export async function hasCondoAccess(clerkId: string, condoId: string): Promise<boolean> {
  try {
    const user = await getUserByClerkId(clerkId)
    if (!user) return false

    // Platform admins have access to all condos
    if (user.role === 'platform_admin') return true

    // Other users can only access their own condo
    return user.condo_id === condoId
  } catch (error) {
    console.error('Error checking condo access:', error)
    return false
  }
}

// Get user's role-based permissions
export function getUserPermissions(role: UserRole): string[] {
  const permissions: Record<UserRole, string[]> = {
    platform_admin: [
      'read:all',
      'write:all',
      'delete:all',
      'manage:users',
      'manage:condos',
      'manage:system'
    ],
    management: [
      'read:condo',
      'write:residents',
      'write:amenities',
      'write:visitors',
      'moderate:content',
      'manage:bookings'
    ],
    security: [
      'read:visitors',
      'write:visitors',
      'read:residents',
      'write:access_logs',
      'scan:qr_codes'
    ],
    resident: [
      'read:condo',
      'write:visitors',
      'write:bookings',
      'write:posts',
      'read:chat',
      'write:chat'
    ],
    visitor: [
      'read:visitor_status',
      'read:amenities'
    ],
    moderator: [
      'read:condo',
      'moderate:content',
      'moderate:chat',
      'read:reports'
    ]
  }

  return permissions[role] || []
}

// Check if user has specific permission
export function hasPermission(userRole: UserRole, permission: string): boolean {
  const permissions = getUserPermissions(userRole)
  return permissions.includes(permission) || permissions.includes('read:all') || permissions.includes('write:all')
}

// Update user's last seen timestamp
export async function updateUserLastSeen(clerkId: string): Promise<void> {
  try {
    const serverSupabase = await createServerSupabaseClient()
    
    await serverSupabase
      .from('users')
      .update({ 
        last_seen_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('clerk_id', clerkId)
  } catch (error) {
    console.error('Error updating user last seen:', error)
  }
}

// Get user's dashboard data based on role
export async function getUserDashboardData(clerkId: string) {
  try {
    const user = await getUserByClerkId(clerkId)
    if (!user) return null

    const serverSupabase = await createServerSupabaseClient()
    
    switch (user.role) {
      case 'platform_admin':
        return await getPlatformAdminDashboard(serverSupabase)
      case 'management':
        return await getManagementDashboard(serverSupabase, user.condo_id)
      case 'security':
        return await getSecurityDashboard(serverSupabase, user.condo_id)
      case 'resident':
        return await getResidentDashboard(serverSupabase, user.id, user.condo_id)
      case 'visitor':
        return await getVisitorDashboard(serverSupabase, user.id, user.condo_id)
      case 'moderator':
        return await getModeratorDashboard(serverSupabase, user.condo_id)
      default:
        return null
    }
  } catch (error) {
    console.error('Error getting user dashboard data:', error)
    return null
  }
}

// Dashboard data functions
async function getPlatformAdminDashboard(supabase: any) {
  const [condos, users, alerts] = await Promise.all([
    supabase.from('condominiums').select('*'),
    supabase.from('users').select('*'),
    supabase.from('system_alerts').select('*').eq('is_resolved', false)
  ])

  return {
    condos: condos.data || [],
    users: users.data || [],
    alerts: alerts.data || []
  }
}

async function getManagementDashboard(supabase: any, condoId: string) {
  const [residents, visitors, amenities, bookings] = await Promise.all([
    supabase.from('users').select('*').eq('condo_id', condoId).eq('role', 'resident'),
    supabase.from('visitors').select('*').eq('condo_id', condoId).eq('status', 'pending'),
    supabase.from('amenities').select('*').eq('condo_id', condoId),
    supabase.from('bookings').select('*').eq('condo_id', condoId).gte('start_time', new Date().toISOString())
  ])

  return {
    residents: residents.data || [],
    pendingVisitors: visitors.data || [],
    amenities: amenities.data || [],
    upcomingBookings: bookings.data || []
  }
}

async function getSecurityDashboard(supabase: any, condoId: string) {
  const [visitors, accessLogs, residents] = await Promise.all([
    supabase.from('visitors').select('*').eq('condo_id', condoId).eq('status', 'approved'),
    supabase.from('access_logs').select('*').eq('condo_id', condoId).order('timestamp', { ascending: false }).limit(50),
    supabase.from('users').select('*').eq('condo_id', condoId).eq('role', 'resident')
  ])

  return {
    approvedVisitors: visitors.data || [],
    recentAccessLogs: accessLogs.data || [],
    residents: residents.data || []
  }
}

async function getResidentDashboard(supabase: any, userId: string, condoId: string) {
  const [visitors, bookings, posts, notifications] = await Promise.all([
    supabase.from('visitors').select('*').eq('invited_by_user_id', userId),
    supabase.from('bookings').select('*').eq('user_id', userId).gte('start_time', new Date().toISOString()),
    supabase.from('community_posts').select('*').eq('condo_id', condoId).order('created_at', { ascending: false }).limit(10),
    supabase.from('notifications').select('*').eq('user_id', userId).eq('status', 'pending')
  ])

  return {
    myVisitors: visitors.data || [],
    myBookings: bookings.data || [],
    recentPosts: posts.data || [],
    notifications: notifications.data || []
  }
}

async function getVisitorDashboard(supabase: any, userId: string, condoId: string) {
  const [visitorStatus, amenities] = await Promise.all([
    supabase.from('visitors').select('*').eq('invited_by_user_id', userId).order('created_at', { ascending: false }).limit(5),
    supabase.from('amenities').select('*').eq('condo_id', condoId).eq('is_active', true)
  ])

  return {
    visitorStatus: visitorStatus.data || [],
    availableAmenities: amenities.data || []
  }
}

async function getModeratorDashboard(supabase: any, condoId: string) {
  const [posts, comments, reports] = await Promise.all([
    supabase.from('community_posts').select('*').eq('condo_id', condoId).eq('is_approved', false),
    supabase.from('community_comments').select('*').eq('condo_id', condoId).order('created_at', { ascending: false }).limit(20),
    supabase.from('access_logs').select('*').eq('condo_id', condoId).eq('result', 'denied').order('timestamp', { ascending: false }).limit(10)
  ])

  return {
    pendingPosts: posts.data || [],
    recentComments: comments.data || [],
    securityReports: reports.data || []
  }
}
