import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Base Supabase client (for public access)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Re-export client-side Clerk-Supabase utilities
export {
  createClientSupabaseClient,
  syncClerkUserWithSupabaseClient,
  getUserByClerkIdClient,
  updateUserLastSeenClient,
  type CasaLinkUser,
  type UserRole,
  type Condominium
} from './clerk-supabase-client'

// Database types
export interface Condominium {
  id: string
  name: string
  address: string
  city?: string
  type: string
  status: string
  created_at: string
}

export interface User {
  id: string
  condo_id: string
  name: string
  email: string
  phone?: string
  role: string
  is_active: boolean
  created_at: string
}

export interface Amenity {
  id: string
  condo_id: string
  name: string
  type: string
  capacity: number
  is_active: boolean
  created_at: string
}

export interface Visitor {
  id: string
  condo_id: string
  invited_by_user_id: string
  name: string
  phone?: string
  purpose?: string
  qr_code: string
  valid_from: string
  valid_until: string
  status: string
  created_at: string
}

export interface Booking {
  id: string
  amenity_id: string
  user_id: string
  condo_id: string
  start_time: string
  end_time: string
  qr_code: string
  status: string
  created_at: string
}

export interface CommunityPost {
  id: string
  user_id: string
  condo_id: string
  title: string
  content: string
  category: string
  created_at: string
}
