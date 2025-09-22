import { NextRequest } from "next/server"
import { createServerSupabaseClient, getUserByClerkId, CasaLinkUser } from "@/lib/clerk-supabase"
import { withAuth, createAuthError } from "@/lib/auth-helpers"
import { auth } from "@clerk/nextjs/server"

// GET /api/properties/configurations - List property configurations
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
      if (!['platform_admin', 'management'].includes(user.role)) {
        return createAuthError('Access denied. Required roles: platform_admin, management', 403)
      }
    }

    const supabase = await createServerSupabaseClient()
    const url = new URL(request.url)
    const condoId = url.searchParams.get('condo_id')

    let query = supabase
      .from('property_configurations')
      .select(`
        *,
        condominiums (
          id,
          name,
          type,
          address,
          city,
          state
        )
      `)

    // Filter by condo if specified
    if (condoId) {
      query = query.eq('condo_id', condoId)
    }

    // Platform admins can see all, others only their condo
    if (user && user.role !== 'platform_admin' && user.condo_id) {
      query = query.eq('condo_id', user.condo_id)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return new Response(JSON.stringify({ configurations: data }), {
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

// POST /api/properties/configurations - Create property configuration
export async function POST(request: NextRequest) {
  return withAuth(async (user: CasaLinkUser) => {
    try {
      // Check if user has required role
      if (!['platform_admin', 'management'].includes(user.role)) {
        return createAuthError('Access denied. Required roles: platform_admin, management', 403)
      }

      const body = await request.json()
      const {
        condo_id,
        blocks,
        floors_per_block,
        units_per_floor,
        unit_types,
        naming_scheme,
        excluded_units,
        special_floors
      } = body

      // Validate required fields
      if (!condo_id || !blocks || !floors_per_block || !units_per_floor) {
        return createAuthError('Missing required fields', 400)
      }

      // Check if user has access to the specified condo
      if (user.role !== 'platform_admin' && condo_id !== user.condo_id) {
        return createAuthError('Access denied to this condominium', 403)
      }

      const supabase = await createServerSupabaseClient()

      // Check if configuration already exists for this condo
      const { data: existingConfig } = await supabase
        .from('property_configurations')
        .select('id')
        .eq('condo_id', condo_id)
        .single()

      if (existingConfig) {
        return createAuthError('Configuration already exists for this property', 409)
      }

      // Create configuration
      const { data, error } = await supabase
        .from('property_configurations')
        .insert({
          condo_id,
          blocks,
          floors_per_block,
          units_per_floor,
          unit_types: unit_types || { residential: true },
          naming_scheme: naming_scheme || {},
          excluded_units: excluded_units || [],
          special_floors: special_floors || {}
        })
        .select(`
          *,
          condominiums (
            id,
            name,
            type,
            address,
            city,
            state
          )
        `)
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return new Response(JSON.stringify({ configuration: data }), {
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

// PUT /api/properties/configurations - Update property configuration
export async function PUT(request: NextRequest) {
  return withAuth(['platform_admin', 'management'], async (user: CasaLinkUser) => {
    try {
      const body = await request.json()
      const {
        id,
        blocks,
        floors_per_block,
        units_per_floor,
        unit_types,
        naming_scheme,
        excluded_units,
        special_floors
      } = body

      if (!id) {
        return createAuthError('Configuration ID is required', 400)
      }

      const supabase = await createServerSupabaseClient()

      // Check if user has access to this configuration
      const { data: existingConfig } = await supabase
        .from('property_configurations')
        .select('condo_id')
        .eq('id', id)
        .single()

      if (!existingConfig) {
        return createAuthError('Configuration not found', 404)
      }

      if (user.role !== 'platform_admin' && existingConfig.condo_id !== user.condo_id) {
        return createAuthError('Access denied to this configuration', 403)
      }

      // Update configuration
      const updateData: any = {
        updated_at: new Date().toISOString()
      }

      if (blocks !== undefined) updateData.blocks = blocks
      if (floors_per_block !== undefined) updateData.floors_per_block = floors_per_block
      if (units_per_floor !== undefined) updateData.units_per_floor = units_per_floor
      if (unit_types !== undefined) updateData.unit_types = unit_types
      if (naming_scheme !== undefined) updateData.naming_scheme = naming_scheme
      if (excluded_units !== undefined) updateData.excluded_units = excluded_units
      if (special_floors !== undefined) updateData.special_floors = special_floors

      const { data, error } = await supabase
        .from('property_configurations')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          condominiums (
            id,
            name,
            type,
            address,
            city,
            state
          )
        `)
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return new Response(JSON.stringify({ configuration: data }), {
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
  })
}

// DELETE /api/properties/configurations - Delete property configuration
export async function DELETE(request: NextRequest) {
  return withAuth(['platform_admin', 'management'], async (user: CasaLinkUser) => {
    try {
      const url = new URL(request.url)
      const id = url.searchParams.get('id')

      if (!id) {
        return createAuthError('Configuration ID is required', 400)
      }

      const supabase = await createServerSupabaseClient()

      // Check if user has access to this configuration
      const { data: existingConfig } = await supabase
        .from('property_configurations')
        .select('condo_id')
        .eq('id', id)
        .single()

      if (!existingConfig) {
        return createAuthError('Configuration not found', 404)
      }

      if (user.role !== 'platform_admin' && existingConfig.condo_id !== user.condo_id) {
        return createAuthError('Access denied to this configuration', 403)
      }

      // Delete configuration
      const { error } = await supabase
        .from('property_configurations')
        .delete()
        .eq('id', id)

      if (error) {
        throw new Error(error.message)
      }

      return new Response(JSON.stringify({ success: true }), {
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
  })
}
