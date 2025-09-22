import { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { withAuth, createAuthError } from "@/lib/auth-helpers"
import { CasaLinkUser } from "@/lib/clerk-supabase"

// GET /api/properties/[id]/managers/[managerId] - Get specific manager
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; managerId: string } }
) {
  return withAuth(['platform_admin', 'management'], async (user: CasaLinkUser) => {
    try {
      const condoId = params.id
      const managerId = params.managerId
      const supabase = await createServerSupabaseClient()

      // Check if user has access to this property
      if (user.role !== 'platform_admin' && user.condo_id !== condoId) {
        return createAuthError('Access denied to this property', 403)
      }

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
        .eq('id', managerId)
        .eq('condo_id', condoId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return createAuthError('Manager not found', 404)
        }
        throw new Error(error.message)
      }

      return new Response(JSON.stringify({ manager: data }), {
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

// PUT /api/properties/[id]/managers/[managerId] - Update manager
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; managerId: string } }
) {
  return withAuth(['platform_admin', 'management'], async (user: CasaLinkUser) => {
    try {
      const condoId = params.id
      const managerId = params.managerId
      const body = await request.json()
      const supabase = await createServerSupabaseClient()

      // Check if user has access to this property
      if (user.role !== 'platform_admin' && user.condo_id !== condoId) {
        return createAuthError('Access denied to this property', 403)
      }

      // Check if manager exists and belongs to this condo
      const { data: existingManager } = await supabase
        .from('property_managers')
        .select('id, condo_id')
        .eq('id', managerId)
        .eq('condo_id', condoId)
        .single()

      if (!existingManager) {
        return createAuthError('Manager not found', 404)
      }

      // Prepare update data
      const updateData: any = {
        updated_at: new Date().toISOString()
      }

      // Allowed fields for update
      const allowedFields = ['role', 'permissions', 'is_active']

      for (const field of allowedFields) {
        if (body[field] !== undefined) {
          updateData[field] = body[field]
        }
      }

      const { data, error } = await supabase
        .from('property_managers')
        .update(updateData)
        .eq('id', managerId)
        .eq('condo_id', condoId)
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

      return new Response(JSON.stringify({ manager: data }), {
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

// DELETE /api/properties/[id]/managers/[managerId] - Remove manager
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; managerId: string } }
) {
  return withAuth(['platform_admin', 'management'], async (user: CasaLinkUser) => {
    try {
      const condoId = params.id
      const managerId = params.managerId
      const supabase = await createServerSupabaseClient()

      // Check if user has access to this property
      if (user.role !== 'platform_admin' && user.condo_id !== condoId) {
        return createAuthError('Access denied to this property', 403)
      }

      // Check if manager exists and belongs to this condo
      const { data: existingManager } = await supabase
        .from('property_managers')
        .select('id, condo_id, user_id')
        .eq('id', managerId)
        .eq('condo_id', condoId)
        .single()

      if (!existingManager) {
        return createAuthError('Manager not found', 404)
      }

      // Delete property manager assignment
      const { error } = await supabase
        .from('property_managers')
        .delete()
        .eq('id', managerId)
        .eq('condo_id', condoId)

      if (error) {
        throw new Error(error.message)
      }

      // Note: We don't delete the user record, just the property assignment
      // The user might be assigned to other properties

      return new Response(JSON.stringify({ 
        success: true,
        message: "Manager removed successfully"
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
