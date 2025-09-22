import { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/clerk-supabase"
import { withAuth, createAuthError } from "@/lib/auth-helpers"
import { CasaLinkUser } from "@/lib/clerk-supabase"

// GET /api/units/[unitId]/residents/[residentId] - Get specific resident
export async function GET(
  request: NextRequest,
  { params }: { params: { unitId: string; residentId: string } }
) {
  return withAuth(['platform_admin', 'management', 'security'], async (user: CasaLinkUser) => {
    try {
      const unitId = params.unitId
      const residentId = params.residentId
      const supabase = await createServerSupabaseClient()

      // Get unit info to check access
      const { data: unit, error: unitError } = await supabase
        .from('units')
        .select('condo_id')
        .eq('id', unitId)
        .single()

      if (unitError || !unit) {
        return createAuthError('Unit not found', 404)
      }

      // Check if user has access to this unit's property
      if (user.role !== 'platform_admin' && user.condo_id !== unit.condo_id) {
        return createAuthError('Access denied to this unit', 403)
      }

      const { data, error } = await supabase
        .from('unit_residents')
        .select('*')
        .eq('id', residentId)
        .eq('unit_id', unitId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return createAuthError('Resident not found', 404)
        }
        throw new Error(error.message)
      }

      return new Response(JSON.stringify({ resident: data }), {
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

// PUT /api/units/[unitId]/residents/[residentId] - Update resident
export async function PUT(
  request: NextRequest,
  { params }: { params: { unitId: string; residentId: string } }
) {
  return withAuth(['platform_admin', 'management'], async (user: CasaLinkUser) => {
    try {
      const unitId = params.unitId
      const residentId = params.residentId
      const body = await request.json()
      const supabase = await createServerSupabaseClient()

      // Get unit info to check access
      const { data: unit, error: unitError } = await supabase
        .from('units')
        .select('condo_id')
        .eq('id', unitId)
        .single()

      if (unitError || !unit) {
        return createAuthError('Unit not found', 404)
      }

      // Check if user has access to this unit's property
      if (user.role !== 'platform_admin' && user.condo_id !== unit.condo_id) {
        return createAuthError('Access denied to this unit', 403)
      }

      // Check if resident exists and belongs to this unit
      const { data: existingResident } = await supabase
        .from('unit_residents')
        .select('id, unit_id')
        .eq('id', residentId)
        .eq('unit_id', unitId)
        .single()

      if (!existingResident) {
        return createAuthError('Resident not found', 404)
      }

      // Prepare update data
      const updateData: any = {
        updated_at: new Date().toISOString()
      }

      // Allowed fields for update
      const allowedFields = ['name', 'phone', 'is_primary', 'is_active']

      for (const field of allowedFields) {
        if (body[field] !== undefined) {
          updateData[field] = body[field]
        }
      }

      // If setting as primary, unset other primary residents
      if (updateData.is_primary === true) {
        await supabase
          .from('unit_residents')
          .update({ is_primary: false })
          .eq('unit_id', unitId)
          .neq('id', residentId)
      }

      const { data, error } = await supabase
        .from('unit_residents')
        .update(updateData)
        .eq('id', residentId)
        .eq('unit_id', unitId)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return new Response(JSON.stringify({ resident: data }), {
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

// DELETE /api/units/[unitId]/residents/[residentId] - Remove resident
export async function DELETE(
  request: NextRequest,
  { params }: { params: { unitId: string; residentId: string } }
) {
  return withAuth(['platform_admin', 'management'], async (user: CasaLinkUser) => {
    try {
      const unitId = params.unitId
      const residentId = params.residentId
      const supabase = await createServerSupabaseClient()

      // Get unit info to check access
      const { data: unit, error: unitError } = await supabase
        .from('units')
        .select('condo_id')
        .eq('id', unitId)
        .single()

      if (unitError || !unit) {
        return createAuthError('Unit not found', 404)
      }

      // Check if user has access to this unit's property
      if (user.role !== 'platform_admin' && user.condo_id !== unit.condo_id) {
        return createAuthError('Access denied to this unit', 403)
      }

      // Check if resident exists and belongs to this unit
      const { data: existingResident } = await supabase
        .from('unit_residents')
        .select('id, unit_id, email')
        .eq('id', residentId)
        .eq('unit_id', unitId)
        .single()

      if (!existingResident) {
        return createAuthError('Resident not found', 404)
      }

      // Delete resident
      const { error } = await supabase
        .from('unit_residents')
        .delete()
        .eq('id', residentId)
        .eq('unit_id', unitId)

      if (error) {
        throw new Error(error.message)
      }

      return new Response(JSON.stringify({ 
        success: true,
        message: `Resident ${existingResident.email} removed successfully`
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
