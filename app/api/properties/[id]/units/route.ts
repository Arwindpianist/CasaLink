import { NextRequest } from "next/server"
import { createServerSupabaseClient, getUserByClerkId, CasaLinkUser } from "@/lib/clerk-supabase"
import { withAuth, createAuthError } from "@/lib/auth-helpers"
import { auth } from "@clerk/nextjs/server"

// GET /api/properties/[id]/units - List units for a property
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
      if (!['platform_admin', 'management', 'security'].includes(user.role)) {
        return createAuthError('Access denied. Required roles: platform_admin, management, security', 403)
      }

      // Check if user has access to this property
      if (user.role !== 'platform_admin' && user.condo_id !== params.id) {
        return createAuthError('Access denied to this property', 403)
      }
    }

    const condoId = params.id
    const supabase = await createServerSupabaseClient()

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
        condominiums (
          id,
          name,
          type,
          address,
          city,
          state
        )
      `)
      .eq('condo_id', condoId)

    // Apply filters
    if (search) {
      query = query.or(`unit_number.ilike.%${search}%,block_number.ilike.%${search}%,floor_number.eq.${search}`)
    }
    if (status) {
      query = query.eq('status', status)
    }
    if (type) {
      query = query.eq('unit_type', type)
    }
    if (excluded !== null) {
      query = query.eq('excluded', excluded === 'true')
    }

    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query.order('unit_number', { ascending: true })

    if (error) {
      throw new Error(error.message)
    }

    return new Response(JSON.stringify({ 
      units: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
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
}

// POST /api/properties/[id]/units - Create units for a property
export async function POST(
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
    }

    const condoId = params.id
    const body = await request.json()
    const { configuration_id, units } = body

    // Check if user has access to this property (only if user exists)
    if (user && user.role !== 'platform_admin' && user.condo_id !== condoId) {
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

      if (configError) {
        throw new Error(`Configuration not found: ${configError.message}`)
      }

      if (!configData) {
        throw new Error('Configuration not found')
      }

      // Generate units based on configuration (direct JavaScript implementation)
      const units = []
      const { blocks, floors_per_block, units_per_floor, naming_scheme, excluded_units = [], unit_types = {} } = configData
      
      // Extract naming scheme parameters
      const blockPrefix = naming_scheme?.block_prefix || ''
      const floorPrefix = naming_scheme?.floor_prefix || ''
      const unitPrefix = naming_scheme?.unit_prefix || ''
      const blockFormat = naming_scheme?.block_format || '##'
      const floorFormat = naming_scheme?.floor_format || '##'
      const unitFormat = naming_scheme?.unit_format || '##'
      const startFloor = naming_scheme?.start_floor || 1
      const startUnit = naming_scheme?.start_unit || 1
      
      // Generate units
      for (let blockIdx = 1; blockIdx <= blocks; blockIdx++) {
        for (let floorIdx = 1; floorIdx <= floors_per_block; floorIdx++) {
          for (let unitIdx = 1; unitIdx <= units_per_floor; unitIdx++) {
            // Generate floor display (Malaysian convention - skip 4, use 3A)
            let floorDisplay
            const actualFloor = startFloor + floorIdx - 1
            if (actualFloor <= 3) {
              floorDisplay = actualFloor.toString()
            } else if (actualFloor === 4) {
              floorDisplay = '3A'
            } else {
              // For floors 5 and above, continue normally (5, 6, 7, etc.)
              floorDisplay = actualFloor.toString()
            }
            
            // Generate unit name based on scheme type
            let unitName
            if (naming_scheme?.scheme_type === 'analyze_existing' && naming_scheme?.detected_pattern) {
              // Use detected pattern for hyphenated schemes
              // Generate block letter (A, B, C, etc.)
              const blockLetter = String.fromCharCode(64 + blockIdx) // A=65, B=66, etc.
              unitName = `${blockLetter}-${floorDisplay}-${startUnit + unitIdx - 1}`
            } else {
              // Use traditional format
              const blockStr = blockIdx.toString().padStart(blockFormat.length, '0')
              const floorStr = floorDisplay.padStart(floorFormat.length, '0')
              const unitStr = (startUnit + unitIdx - 1).toString().padStart(unitFormat.length, '0')
              unitName = `${blockPrefix}${blockStr}${floorPrefix}${floorStr}${unitPrefix}${unitStr}`
            }
            
            // Check if unit is excluded
            if (!excluded_units.includes(unitName)) {
              units.push({
                condo_id: condoId,
                unit_number: unitName,
                floor_number: actualFloor,
                block_number: blockIdx.toString().padStart(blockFormat.length, '0'),
                unit_type: unit_types[unitName] || 'residential',
                status: 'vacant',
                excluded: false,
                resident_emails: [],
                notes: null
              })
            }
          }
        }
      }
      
      // Remove duplicates from units array
      const uniqueUnits = units.filter((unit, index, self) => 
        index === self.findIndex(u => u.unit_number === unit.unit_number)
      )
      
      // Insert units in batches
      const batchSize = 100
      let unitsCreated = 0
      
      for (let i = 0; i < uniqueUnits.length; i += batchSize) {
        const batch = uniqueUnits.slice(i, i + batchSize)
        const { error: insertError } = await supabase
          .from('units')
          .upsert(batch, { 
            onConflict: 'condo_id,unit_number',
            ignoreDuplicates: true 
          })
        
        if (insertError) {
          throw new Error(`Failed to insert units batch: ${insertError.message}`)
        }
        
        unitsCreated += batch.length
      }

      return new Response(JSON.stringify({ 
        units_created: unitsCreated,
        message: `Generated ${unitsCreated} units successfully`
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      })
    } else if (units && Array.isArray(units)) {
      // Bulk insert units
      const { data: insertedUnits, error: insertError } = await supabase
        .rpc('bulk_insert_units', {
          p_condo_id: condoId,
          p_units: units
        })

      if (insertError) {
        throw new Error(`Failed to insert units: ${insertError.message}`)
      }

      return new Response(JSON.stringify({ 
        units: insertedUnits,
        message: `Inserted ${insertedUnits?.length || 0} units successfully`
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
}

// PUT /api/properties/[id]/units - Bulk update units
export async function PUT(
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
    }

    const condoId = params.id
    const body = await request.json()
    const { unit_updates, bulk_action } = body

    // Check if user has access to this property (only if user exists)
    if (user && user.role !== 'platform_admin' && user.condo_id !== condoId) {
      return createAuthError('Access denied to this property', 403)
    }

      const supabase = await createServerSupabaseClient()

      if (unit_updates && Array.isArray(unit_updates)) {
        // Bulk update individual units
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
      } else if (bulk_action) {
        // Handle bulk actions like exclude/include all
        const { action, filters } = bulk_action
        
        let query = supabase
          .from('units')
          .update({ excluded: action === 'exclude' })
          .eq('condo_id', condoId)

        if (filters) {
          if (filters.status) query = query.eq('status', filters.status)
          if (filters.type) query = query.eq('unit_type', filters.type)
        }

        const { data, error } = await query.select()

        if (error) {
          throw new Error(`Bulk action failed: ${error.message}`)
        }

        return new Response(JSON.stringify({ 
          message: `Bulk ${action} completed successfully`,
          affected_units: data?.length || 0
        }), {
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
}
