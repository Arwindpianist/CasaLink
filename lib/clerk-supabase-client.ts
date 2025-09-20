"use client"

import { createClient } from '@supabase/supabase-js'

// Client-side Supabase utilities for Clerk integration

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create client-side Supabase client with Clerk token
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

// Client-side user sync function
export async function syncClerkUserWithSupabaseClient(
  clerkUser: any, 
  role: UserRole, 
  condoId: string,
  token: string
) {
  try {
    const supabase = createClientSupabaseClient(token)
    
    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
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
      const { data, error } = await supabase
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
      const { data, error } = await supabase
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

// Get user from Supabase by Clerk ID (client-side)
export async function getUserByClerkIdClient(clerkId: string, token: string): Promise<CasaLinkUser | null> {
  try {
    const supabase = createClientSupabaseClient(token)
    
    const { data, error } = await supabase
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

// Update user's last seen timestamp (client-side)
export async function updateUserLastSeenClient(clerkId: string, token: string): Promise<void> {
  try {
    const supabase = createClientSupabaseClient(token)
    
    await supabase
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
