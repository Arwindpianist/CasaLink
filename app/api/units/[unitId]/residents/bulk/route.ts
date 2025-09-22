import { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { withAuth, createAuthError } from "@/lib/auth-helpers"
import { CasaLinkUser } from "@/lib/clerk-supabase"

// POST /api/units/[unitId]/residents/bulk - Bulk add residents to unit
export async function POST(
  request: NextRequest,
  { params }: { params: { unitId: string } }
) {
  return withAuth(['platform_admin', 'management'], async (user: CasaLinkUser) => {
    try {
      const unitId = params.unitId
      const body = await request.json()
      const { emails, primary_email } = body

      // Validate required fields
      if (!emails || !Array.isArray(emails) || emails.length === 0) {
        return createAuthError('Emails array is required', 400)
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

      // Validate emails
      const validEmails = emails.filter(email => 
        typeof email === 'string' && 
        email.includes('@') && 
        email.trim().length > 0
      )

      if (validEmails.length === 0) {
        return createAuthError('No valid email addresses provided', 400)
      }

      // Check for existing residents
      const { data: existingResidents } = await supabase
        .from('unit_residents')
        .select('email')
        .eq('unit_id', unitId)
        .in('email', validEmails)

      const existingEmails = existingResidents?.map(r => r.email) || []
      const newEmails = validEmails.filter(email => !existingEmails.includes(email))

      if (newEmails.length === 0) {
        return createAuthError('All provided emails are already linked to this unit', 409)
      }

      // Set primary email
      const primaryEmail = primary_email || newEmails[0]
      if (!newEmails.includes(primaryEmail)) {
        return createAuthError('Primary email must be in the provided emails list', 400)
      }

      // If setting a new primary, unset existing primary residents
      if (primaryEmail && newEmails.includes(primaryEmail)) {
        await supabase
          .from('unit_residents')
          .update({ is_primary: false })
          .eq('unit_id', unitId)
      }

      // Prepare residents data
      const residentsData = newEmails.map(email => ({
        unit_id: unitId,
        email: email.trim(),
        is_primary: email === primaryEmail,
        is_active: true,
        invited_at: new Date().toISOString()
      }))

      // Insert residents
      const { data, error } = await supabase
        .from('unit_residents')
        .insert(residentsData)
        .select()

      if (error) {
        throw new Error(error.message)
      }

      // TODO: Send invitation emails to all new residents
      // This would integrate with your email service

      return new Response(JSON.stringify({ 
        residents: data,
        residents_added: data.length,
        skipped_existing: validEmails.length - newEmails.length,
        message: `${data.length} residents added successfully`
      }), {
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
