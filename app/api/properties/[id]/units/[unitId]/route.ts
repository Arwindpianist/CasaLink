import { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { withAuth, createAuthError } from "@/lib/auth-helpers"
import { CasaLinkUser } from "@/lib/clerk-supabase"

// GET /api/properties/[id]/units/[unitId] - Get specific unit
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; unitId: string } }
) {
  return withAuth(['platform_admin', 'management', 'security'], async (user: CasaLinkUser) => {
    try {
      const condoId = params.id
      const unitId = params.unitId
      const supabase = await createServerSupabaseClient()

      // Check if user has access to this property
      if (user.role !== 'platform_admin' && user.condo_id !== condoId) {
        return createAuthError('Access denied to this property', 403)
      }

      const { data, error } = await supabase
        .from('units')
        .select(`
          *,
          unit_residents (
            id,
            email,
            name,
            phone,
            is_primary,
            is_active,
            invited_at,
            accepted_at
          )
        `)
        .eq('id', unitId)
        .eq('condo_id', condoId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return createAuthError('Unit not found', 404)
        }
        throw new Error(error.message)
      }

      return new Response(JSON.stringify({ unit: data }), {
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

// PUT /api/properties/[id]/units/[unitId] - Update specific unit
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; unitId: string } }
) {
  return withAuth(['platform_admin', 'management'], async (user: CasaLinkUser) => {
    try {
      const condoId = params.id
      const unitId = params.unitId
      const body = await request.json()
      const supabase = await createServerSupabaseClient()

      // Check if user has access to this property
      if (user.role !== 'platform_admin' && user.condo_id !== condoId) {
        return createAuthError('Access denied to this property', 403)
      }

      // Check if unit exists and belongs to this condo
      const { data: existingUnit } = await supabase
        .from('units')
        .select('id, condo_id')
        .eq('id', unitId)
        .eq('condo_id', condoId)
        .single()

      if (!existingUnit) {
        return createAuthError('Unit not found', 404)
      }

      // Prepare update data
      const updateData: any = {
        updated_at: new Date().toISOString()
      }

      // Allowed fields for update
      const allowedFields = [
        'unit_number', 'block_number', 'floor_number', 'unit_type',
        'status', 'excluded', 'notes', 'naming_scheme', 'resident_emails'
      ]

      for (const field of allowedFields) {
        if (body[field] !== undefined) {
          updateData[field] = body[field]
        }
      }

      const { data, error } = await supabase
        .from('units')
        .update(updateData)
        .eq('id', unitId)
        .eq('condo_id', condoId)
        .select(`
          *,
          unit_residents (
            id,
            email,
            name,
            phone,
            is_primary,
            is_active,
            invited_at,
            accepted_at
          )
        `)
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return new Response(JSON.stringify({ unit: data }), {
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

// DELETE /api/properties/[id]/units/[unitId] - Delete specific unit
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; unitId: string } }
) {
  return withAuth(['platform_admin', 'management'], async (user: CasaLinkUser) => {
    try {
      const condoId = params.id
      const unitId = params.unitId
      const supabase = await createServerSupabaseClient()

      // Check if user has access to this property
      if (user.role !== 'platform_admin' && user.condo_id !== condoId) {
        return createAuthError('Access denied to this property', 403)
      }

      // Check if unit exists and belongs to this condo
      const { data: existingUnit } = await supabase
        .from('units')
        .select('id, condo_id, unit_number')
        .eq('id', unitId)
        .eq('condo_id', condoId)
        .single()

      if (!existingUnit) {
        return createAuthError('Unit not found', 404)
      }

      // Delete unit (this will cascade delete unit_residents)
      const { error } = await supabase
        .from('units')
        .delete()
        .eq('id', unitId)
        .eq('condo_id', condoId)

      if (error) {
        throw new Error(error.message)
      }

      return new Response(JSON.stringify({ 
        success: true,
        message: `Unit ${existingUnit.unit_number} deleted successfully`
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
