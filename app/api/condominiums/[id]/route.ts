import { NextRequest } from 'next/server'
import { withAuth, createAuthError } from '@/lib/auth-helpers'
import { createServerSupabaseClient, type CasaLinkUser } from '@/lib/clerk-supabase'

// GET /api/condominiums/[id] - Get specific condominium
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(async (user: CasaLinkUser) => {
    // Check if user has platform_admin role
    if (user.role !== 'platform_admin') {
      return createAuthError('Access denied. Platform admin role required.', 403)
    }
    try {
      const supabase = await createServerSupabaseClient()
      const condoId = params.id

      const { data, error } = await supabase
        .from('condominiums')
        .select(`
          *,
          users!users_condo_id_fkey(
            id,
            name,
            email,
            role,
            is_active,
            created_at
          ),
          units!units_condo_id_fkey(
            id,
            unit_number,
            floor_number,
            tower,
            status,
            created_at
          )
        `)
        .eq('id', condoId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return createAuthError('Condominium not found', 404)
        }
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify({ condominium: data }), {
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

// PUT /api/condominiums/[id] - Update condominium
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(async (user: CasaLinkUser) => {
    // Check if user has platform_admin role
    if (user.role !== 'platform_admin') {
      return createAuthError('Access denied. Platform admin role required.', 403)
    }
    try {
      const body = await request.json()
      const condoId = params.id
      const {
        name,
        type,
        address,
        city,
        state,
        country,
        postal_code,
        subscription_plan,
        monthly_revenue,
        status,
        settings
      } = body

      const supabase = await createServerSupabaseClient()

      // Check if condominium exists
      const { data: existingCondo, error: fetchError } = await supabase
        .from('condominiums')
        .select('id')
        .eq('id', condoId)
        .single()

      if (fetchError || !existingCondo) {
        return createAuthError('Condominium not found', 404)
      }

      // Prepare update data
      const updateData: any = {
        updated_at: new Date().toISOString()
      }

      // Only include fields that are provided
      if (name !== undefined) updateData.name = name
      if (type !== undefined) updateData.type = type
      if (address !== undefined) updateData.address = address
      if (city !== undefined) updateData.city = city
      if (state !== undefined) updateData.state = state
      if (country !== undefined) updateData.country = country
      if (postal_code !== undefined) updateData.postal_code = postal_code
      if (subscription_plan !== undefined) updateData.subscription_plan = subscription_plan
      if (monthly_revenue !== undefined) updateData.monthly_revenue = monthly_revenue
      if (status !== undefined) updateData.status = status
      if (settings !== undefined) updateData.settings = settings

      const { data, error } = await supabase
        .from('condominiums')
        .update(updateData)
        .eq('id', condoId)
        .select()
        .single()

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify({ condominium: data }), {
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

// DELETE /api/condominiums/[id] - Delete condominium
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(async (user: CasaLinkUser) => {
    // Check if user has platform_admin role
    if (user.role !== 'platform_admin') {
      return createAuthError('Access denied. Platform admin role required.', 403)
    }
    try {
      const supabase = await createServerSupabaseClient()
      const condoId = params.id

      // Check if condominium exists
      const { data: existingCondo, error: fetchError } = await supabase
        .from('condominiums')
        .select('id, name')
        .eq('id', condoId)
        .single()

      if (fetchError || !existingCondo) {
        return createAuthError('Condominium not found', 404)
      }

      // Check if there are any users associated with this condominium
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id')
        .eq('condo_id', condoId)
        .limit(1)

      if (usersError) {
        return new Response(JSON.stringify({ error: usersError.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      if (users && users.length > 0) {
        return createAuthError(
          'Cannot delete condominium with associated users. Please remove all users first.',
          400
        )
      }

      // Delete the condominium
      const { error } = await supabase
        .from('condominiums')
        .delete()
        .eq('id', condoId)

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify({ 
        message: `Condominium "${existingCondo.name}" deleted successfully` 
      }), {
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
