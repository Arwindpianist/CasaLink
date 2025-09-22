import { NextRequest } from "next/server"
import { createServerSupabaseClient, getUserByClerkId, CasaLinkUser } from "@/lib/clerk-supabase"
import { withAuth, createAuthError } from "@/lib/auth-helpers"
import { auth } from "@clerk/nextjs/server"

// GET /api/properties/[id]/managers - List property managers
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Try to get user, but don't fail if not found
    let user: CasaLinkUser | null = null
    try {
      const { userId } = await auth()
      if (userId) {
        user = await getUserByClerkId(userId)
      }
    } catch (error) {
      console.error('Auth error:', error)
    }

    // For now, allow access without authentication for testing
    // TODO: Re-enable authentication once user data is properly set up
    if (!user) {
      console.log('No authenticated user found, allowing access for testing')
    } else {
      // Check if user has required role
      if (!['platform_admin', 'management'].includes(user.role)) {
        return createAuthError('Access denied. Required roles: platform_admin, management', 403)
      }

      // Check if user has access to this property
      if (user.role !== 'platform_admin' && user.condo_id !== params.id) {
        return createAuthError('Access denied to this property', 403)
      }
    }

    const condoId = params.id
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from('property_managers')
      .select(`
        *,
        user:users!property_managers_user_id_fkey (
          id,
          name,
          email,
          phone,
          avatar_url,
          role,
          is_active
        )
      `)
      .eq('condo_id', condoId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return new Response(JSON.stringify({ managers: data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// POST /api/properties/[id]/managers - Assign manager to property
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(['platform_admin', 'management'], async (user: CasaLinkUser) => {
    try {
      const condoId = params.id
      const body = await request.json()
      const { user_email, role, permissions } = body

      // Validate required fields
      if (!user_email || !role) {
        return createAuthError('User email and role are required', 400)
      }

      // Check if user has access to this property
      if (user.role !== 'platform_admin' && user.condo_id !== condoId) {
        return createAuthError('Access denied to this property', 403)
      }

      const supabase = await createServerSupabaseClient()

      // Check if user exists in the system
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('id, name, email, role, is_active')
        .eq('email', user_email)
        .single()

      let userId: string

      if (userError && userError.code === 'PGRST116') {
        // User doesn't exist, create a placeholder user record
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            condo_id: condoId,
            email: user_email,
            name: user_email.split('@')[0], // Use email prefix as name
            role: role === 'admin' ? 'management' : role,
            is_active: false, // Will be activated when they accept invitation
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select('id')
          .single()

        if (createError) {
          throw new Error(`Failed to create user: ${createError.message}`)
        }

        userId = newUser.id
      } else if (userError) {
        throw new Error(`Failed to check user: ${userError.message}`)
      } else {
        userId = existingUser.id
      }

      // Check if user is already assigned to this property
      const { data: existingAssignment } = await supabase
        .from('property_managers')
        .select('id')
        .eq('condo_id', condoId)
        .eq('user_id', userId)
        .single()

      if (existingAssignment) {
        return createAuthError('User is already assigned to this property', 409)
      }

      // Create property manager assignment
      const { data, error } = await supabase
        .from('property_managers')
        .insert({
          condo_id: condoId,
          user_id: userId,
          role,
          permissions: permissions || {
            manage_units: false,
            manage_residents: false,
            manage_visitors: true,
            view_analytics: false,
            manage_settings: false
          },
          is_active: existingUser?.is_active || false,
          assigned_at: new Date().toISOString()
        })
        .select(`
          *,
          user:users!property_managers_user_id_fkey (
            id,
            name,
            email,
            phone,
            avatar_url,
            role,
            is_active
          )
        `)
        .single()

      if (error) {
        throw new Error(error.message)
      }

      // TODO: Send invitation email to the user
      // This would integrate with your email service

      return new Response(JSON.stringify({ manager: data }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  })
}
