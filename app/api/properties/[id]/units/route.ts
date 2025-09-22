import { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { withAuth, createAuthError } from "@/lib/auth-helpers"
import { CasaLinkUser } from "@/lib/clerk-supabase"

// GET /api/properties/[id]/units - List units for a property
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(['platform_admin', 'management', 'security'], async (user: CasaLinkUser) => {
    try {
      const condoId = params.id
      const supabase = await createServerSupabaseClient()

      // Check if user has access to this property
      if (user.role !== 'platform_admin' && user.condo_id !== condoId) {
        return createAuthError('Access denied to this property', 403)
      }

      const url = new URL(request.url)
      const search = url.searchParams.get('search')
      const status = url.searchParams.get('status')
      const type = url.searchParams.get('type')
      const excluded = url.searchParams.get('excluded')
      const page = parseInt(url.searchParams.get('page') || '1')
      const limit = parseInt(url.searchParams.get('limit') || '50')

      let query = supabase
        .from('units')
        .select(`
          *,
          unit_residents (
            id,
            email,
            name,
            is_primary,
            is_active
          )
        `)
        .eq('condo_id', condoId)

      // Apply filters
      if (search) {
        query = query.or(`unit_number.ilike.%${search}%,block_number.ilike.%${search}%`)
      }

      if (status && status !== 'all') {
        query = query.eq('status', status)
      }

      if (type && type !== 'all') {
        query = query.eq('unit_type', type)
      }

      if (excluded !== null) {
        query = query.eq('excluded', excluded === 'true')
      }

      // Apply pagination
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to).order('unit_number')

      const { data, error, count } = await query

      if (error) {
        throw new Error(error.message)
      }

      return new Response(JSON.stringify({ 
        units: data,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil((count || 0) / limit)
        }
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

// POST /api/properties/[id]/units - Create units for a property
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(['platform_admin', 'management'], async (user: CasaLinkUser) => {
    try {
      const condoId = params.id
      const body = await request.json()
      const { configuration_id, units } = body

      // Check if user has access to this property
      if (user.role !== 'platform_admin' && user.condo_id !== condoId) {
        return createAuthError('Access denied to this property', 403)
      }

      const supabase = await createServerSupabaseClient()

      if (configuration_id) {
        // Generate units from configuration
        const { data: configData, error: configError } = await supabase
          .from('property_configurations')
          .select('*')
          .eq('id', configuration_id)
          .eq('condo_id', condoId)
          .single()

        if (configError || !configData) {
          return createAuthError('Configuration not found', 404)
        }

        // Use the database function to generate units
        const { data: generatedUnits, error: generateError } = await supabase
          .rpc('create_units_from_configuration', {
            p_condo_id: condoId,
            p_configuration_id: configuration_id
          })

        if (generateError) {
          throw new Error(generateError.message)
        }

        return new Response(JSON.stringify({ 
          units_created: generatedUnits,
          message: `${generatedUnits} units created successfully`
        }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' }
        })
      } else if (units && Array.isArray(units)) {
        // Create specific units
        const unitsToCreate = units.map(unit => ({
          condo_id: condoId,
          unit_number: unit.unit_number,
          block_number: unit.block_number,
          floor_number: unit.floor_number,
          unit_type: unit.unit_type || 'residential',
          naming_scheme: unit.naming_scheme,
          excluded: unit.excluded || false,
          status: unit.status || 'vacant',
          notes: unit.notes
        }))

        const { data, error } = await supabase
          .from('units')
          .insert(unitsToCreate)
          .select()

        if (error) {
          throw new Error(error.message)
        }

        return new Response(JSON.stringify({ 
          units: data,
          units_created: data.length
        }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' }
        })
      } else {
        return createAuthError('Either configuration_id or units array is required', 400)
      }
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

// PUT /api/properties/[id]/units - Bulk update units
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(['platform_admin', 'management'], async (user: CasaLinkUser) => {
    try {
      const condoId = params.id
      const body = await request.json()
      const { unit_updates, bulk_action } = body

      // Check if user has access to this property
      if (user.role !== 'platform_admin' && user.condo_id !== condoId) {
        return createAuthError('Access denied to this property', 403)
      }

      const supabase = await createServerSupabaseClient()

      if (bulk_action) {
        // Handle bulk actions
        const { action, unit_numbers, value } = bulk_action

        if (!unit_numbers || !Array.isArray(unit_numbers)) {
          return createAuthError('Unit numbers array is required for bulk actions', 400)
        }

        let updateData: any = {}
        
        switch (action) {
          case 'exclude':
            updateData.excluded = true
            break
          case 'include':
            updateData.excluded = false
            break
          case 'status':
            updateData.status = value
            break
          case 'type':
            updateData.unit_type = value
            break
          default:
            return createAuthError('Invalid bulk action', 400)
        }

        const { data, error } = await supabase
          .from('units')
          .update(updateData)
          .in('unit_number', unit_numbers)
          .eq('condo_id', condoId)
          .select()

        if (error) {
          throw new Error(error.message)
        }

        return new Response(JSON.stringify({ 
          units_updated: data.length,
          message: `${data.length} units updated successfully`
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      } else if (unit_updates && Array.isArray(unit_updates)) {
        // Handle individual unit updates
        const results = []

        for (const update of unit_updates) {
          const { unit_id, ...updateData } = update
          
          const { data, error } = await supabase
            .from('units')
            .update(updateData)
            .eq('id', unit_id)
            .eq('condo_id', condoId)
            .select()
            .single()

          if (error) {
            results.push({ unit_id, error: error.message })
          } else {
            results.push({ unit_id, success: true, data })
          }
        }

        return new Response(JSON.stringify({ results }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      } else {
        return createAuthError('Either unit_updates array or bulk_action is required', 400)
      }
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
