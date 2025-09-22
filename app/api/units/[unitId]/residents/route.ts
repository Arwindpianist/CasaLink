import { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/clerk-supabase"
import { withAuth, createAuthError } from "@/lib/auth-helpers"
import { CasaLinkUser } from "@/lib/clerk-supabase"

// GET /api/units/[unitId]/residents - List residents for a unit
export async function GET(
  request: NextRequest,
  { params }: { params: { unitId: string } }
) {
  return withAuth(['platform_admin', 'management', 'security'], async (user: CasaLinkUser) => {
    try {
      const unitId = params.unitId
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
        .eq('unit_id', unitId)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      return new Response(JSON.stringify({ residents: data }), {
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

// POST /api/units/[unitId]/residents - Add resident to unit
export async function POST(
  request: NextRequest,
  { params }: { params: { unitId: string } }
) {
  return withAuth(['platform_admin', 'management'], async (user: CasaLinkUser) => {
    try {
      const unitId = params.unitId
      const body = await request.json()
      const { email, name, phone, is_primary } = body

      // Validate required fields
      if (!email) {
        return createAuthError('Email is required', 400)
      }

      const supabase = await createServerSupabaseClient()

      // Get unit info to check access
      const { data: unit, error: unitError } = await supabase
        .from('units')
        .select('condo_id, unit_number')
        .eq('id', unitId)
        .single()

      if (unitError || !unit) {
        return createAuthError('Unit not found', 404)
      }

      // Check if user has access to this unit's property
      if (user.role !== 'platform_admin' && user.condo_id !== unit.condo_id) {
        return createAuthError('Access denied to this unit', 403)
      }

      // Check if resident already exists for this unit
      const { data: existingResident } = await supabase
        .from('unit_residents')
        .select('id')
        .eq('unit_id', unitId)
        .eq('email', email)
        .single()

      if (existingResident) {
        return createAuthError('Resident already linked to this unit', 409)
      }

      // If setting as primary, unset other primary residents
      if (is_primary) {
        await supabase
          .from('unit_residents')
          .update({ is_primary: false })
          .eq('unit_id', unitId)
      }

      // Create resident record
      const { data, error } = await supabase
        .from('unit_residents')
        .insert({
          unit_id: unitId,
          email,
          name,
          phone,
          is_primary: is_primary || false,
          is_active: true,
          invited_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      // TODO: Send invitation email to the resident
      // This would integrate with your email service

      return new Response(JSON.stringify({ resident: data }), {
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
