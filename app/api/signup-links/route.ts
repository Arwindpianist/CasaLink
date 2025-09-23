import { NextRequest } from "next/server"
import { createServerSupabaseClient, getUserByClerkId, CasaLinkUser } from "@/lib/clerk-supabase"
import { createAuthError } from "@/lib/auth-helpers"
import { auth } from "@clerk/nextjs/server"
import { randomBytes } from "crypto"

// GET /api/signup-links - List signup links for a property
export async function GET(request: NextRequest) {
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
      if (!['platform_admin', 'management', 'security'].includes(user.role)) {
        return createAuthError('Access denied. Required roles: platform_admin, management, security', 403)
      }
    }

    const supabase = await createServerSupabaseClient()
    const url = new URL(request.url)
    const condoId = url.searchParams.get('condo_id')
    const unitId = url.searchParams.get('unit_id')

    let query = supabase
      .from('signup_links')
      .select(`
        *,
        condominiums (
          id,
          name,
          address
        ),
        units (
          id,
          unit_number,
          floor_number
        )
      `)

    // Filter by condo if specified
    if (condoId) {
      query = query.eq('condo_id', condoId)
    }
    if (unitId) {
      query = query.eq('unit_id', unitId)
    }

    // Platform admins can see all, others only their condo
    if (user && user.role !== 'platform_admin' && user.condo_id) {
      query = query.eq('condo_id', user.condo_id)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return new Response(JSON.stringify({ signup_links: data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error in GET /api/signup-links:', error)
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// POST /api/signup-links - Create signup link
export async function POST(request: NextRequest) {
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
      if (!['platform_admin', 'management', 'security'].includes(user.role)) {
        return createAuthError('Access denied. Required roles: platform_admin, management, security', 403)
      }
    }

    const body = await request.json()
    const {
      condo_id,
      unit_id,
      resident_email,
      expires_in_hours = 168, // Default 7 days
      max_uses = 1,
      notes
    } = body

    // Validate required fields
    if (!condo_id || !resident_email) {
      return createAuthError('Missing required fields: condo_id, resident_email', 400)
    }

    // Check if user has access to the specified condo (only if user exists)
    if (user && user.role !== 'platform_admin' && condo_id !== user.condo_id) {
      return createAuthError('Access denied to this condominium', 403)
    }

    const supabase = await createServerSupabaseClient()

    // Generate secure token
    const token = randomBytes(32).toString('hex')
    
    // Calculate expiration date
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + expires_in_hours)

    // Create signup link
    const { data, error } = await supabase
      .from('signup_links')
      .insert({
        token,
        condo_id,
        unit_id: unit_id || null,
        resident_email,
        expires_at: expiresAt.toISOString(),
        max_uses,
        used_count: 0,
        notes: notes || null,
        created_by: user?.id || null
      })
      .select(`
        *,
        condominiums (
          id,
          name,
          address
        ),
        units (
          id,
          unit_number,
          floor_number
        )
      `)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    // Generate the full signup URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const signupUrl = `${baseUrl}/signup?token=${token}`

    return new Response(JSON.stringify({ 
      signup_link: data,
      signup_url: signupUrl
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error in POST /api/signup-links:', error)
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// PUT /api/signup-links - Update signup link
export async function PUT(request: NextRequest) {
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
      if (!['platform_admin', 'management', 'security'].includes(user.role)) {
        return createAuthError('Access denied. Required roles: platform_admin, management, security', 403)
      }
    }

    const body = await request.json()
    const {
      id,
      expires_in_hours,
      max_uses,
      notes,
      active
    } = body

    if (!id) {
      return createAuthError('Signup link ID is required', 400)
    }

    const supabase = await createServerSupabaseClient()

    // Check if user has access to this signup link
    const { data: existingLink } = await supabase
      .from('signup_links')
      .select('condo_id')
      .eq('id', id)
      .single()

    if (!existingLink) {
      return createAuthError('Signup link not found', 404)
    }

    if (user && user.role !== 'platform_admin' && existingLink.condo_id !== user.condo_id) {
      return createAuthError('Access denied to this signup link', 403)
    }

    // Update signup link
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (expires_in_hours !== undefined) {
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + expires_in_hours)
      updateData.expires_at = expiresAt.toISOString()
    }
    if (max_uses !== undefined) updateData.max_uses = max_uses
    if (notes !== undefined) updateData.notes = notes
    if (active !== undefined) updateData.active = active

    const { data, error } = await supabase
      .from('signup_links')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        condominiums (
          id,
          name,
          address
        ),
        units (
          id,
          unit_number,
          floor_number
        )
      `)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return new Response(JSON.stringify({ signup_link: data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error in PUT /api/signup-links:', error)
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// DELETE /api/signup-links - Delete signup link
export async function DELETE(request: NextRequest) {
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
      if (!['platform_admin', 'management', 'security'].includes(user.role)) {
        return createAuthError('Access denied. Required roles: platform_admin, management, security', 403)
      }
    }

    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return createAuthError('Signup link ID is required', 400)
    }

    const supabase = await createServerSupabaseClient()

    // Check if user has access to this signup link
    const { data: existingLink } = await supabase
      .from('signup_links')
      .select('condo_id')
      .eq('id', id)
      .single()

    if (!existingLink) {
      return createAuthError('Signup link not found', 404)
    }

    if (user && user.role !== 'platform_admin' && existingLink.condo_id !== user.condo_id) {
      return createAuthError('Access denied to this signup link', 403)
    }

    // Delete signup link
    const { error } = await supabase
      .from('signup_links')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(error.message)
    }

    return new Response(JSON.stringify({ message: 'Signup link deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error in DELETE /api/signup-links:', error)
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
