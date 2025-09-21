import { NextRequest } from 'next/server'
import { withAuth, createAuthError } from '@/lib/auth-helpers'
import { createServerSupabaseClient, type CasaLinkUser } from '@/lib/clerk-supabase'

// GET /api/condominiums - Get all condominiums (platform admin only)
export async function GET(request: NextRequest) {
  // For demo purposes, return mock data without authentication
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Return mock data for demo
    const mockCondominiums = [
      {
        id: 'demo-condo-1',
        name: 'Pavilion Residences',
        type: 'condo',
        address: '168 Jalan Bukit Bintang',
        city: 'Kuala Lumpur',
        state: 'Wilayah Persekutuan',
        country: 'Malaysia',
        postal_code: '55100',
        subscription_plan: 'premium',
        monthly_revenue: 2500,
        status: 'active',
        settings: {},
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        users: [{ count: 45 }],
        units: [{ count: 120 }]
      },
      {
        id: 'demo-condo-2',
        name: 'KLCC Towers',
        type: 'condo',
        address: 'Jalan Ampang',
        city: 'Kuala Lumpur',
        state: 'Wilayah Persekutuan',
        country: 'Malaysia',
        postal_code: '50450',
        subscription_plan: 'basic',
        monthly_revenue: 1800,
        status: 'active',
        settings: {},
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z',
        users: [{ count: 32 }],
        units: [{ count: 85 }]
      },
      {
        id: 'demo-condo-3',
        name: 'Tropicana Gardens',
        type: 'condo',
        address: 'Jalan Tropicana',
        city: 'Petaling Jaya',
        state: 'Selangor',
        country: 'Malaysia',
        postal_code: '47810',
        subscription_plan: 'enterprise',
        monthly_revenue: 3200,
        status: 'active',
        settings: {},
        created_at: '2024-02-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z',
        users: [{ count: 67 }],
        units: [{ count: 150 }]
      }
    ]

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedData = mockCondominiums.slice(startIndex, endIndex)

    return new Response(JSON.stringify({ 
      condominiums: paginatedData,
      pagination: {
        page,
        limit,
        total: mockCondominiums.length,
        totalPages: Math.ceil(mockCondominiums.length / limit)
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

  // TODO: Re-enable authentication once we have proper users set up
  // return withAuth(async (user: CasaLinkUser) => {
  //   // Check if user has platform_admin role
  //   if (user.role !== 'platform_admin') {
  //     return createAuthError('Access denied. Platform admin role required.', 403)
  //   }
  //   try {
  //     const supabase = await createServerSupabaseClient()
  //     const { searchParams } = new URL(request.url)
  //     const page = parseInt(searchParams.get('page') || '1')
  //     const limit = parseInt(searchParams.get('limit') || '10')
  //     const search = searchParams.get('search') || ''
  //     const status = searchParams.get('status') || ''
  //     const plan = searchParams.get('plan') || ''

  //     let query = supabase
  //       .from('condominiums')
  //       .select(`
  //         *,
  //         users!users_condo_id_fkey(count),
  //         units!units_condo_id_fkey(count)
  //       `)

  //     // Apply filters
  //     if (search) {
  //       query = query.or(`name.ilike.%${search}%,address.ilike.%${search}%,city.ilike.%${search}%`)
  //     }
      
  //     if (status) {
  //       query = query.eq('status', status)
  //     }
      
  //     if (plan) {
  //       query = query.eq('subscription_plan', plan)
  //     }

  //     // Get total count for pagination
  //     const { count } = await query

  //     // Apply pagination
  //     const from = (page - 1) * limit
  //     const to = from + limit - 1
  //     query = query.range(from, to).order('created_at', { ascending: false })

  //     const { data, error } = await query

  //     if (error) {
  //       return new Response(JSON.stringify({ error: error.message }), {
  //         status: 500,
  //         headers: { 'Content-Type': 'application/json' }
  //       })
  //     }

  //     return new Response(JSON.stringify({ 
  //       condominiums: data,
  //       pagination: {
  //         page,
  //         limit,
  //         total: count || 0,
  //         totalPages: Math.ceil((count || 0) / limit)
  //       }
  //     }), {
  //       status: 200,
  //       headers: { 'Content-Type': 'application/json' }
  //     })
  //   } catch (error) {
  //     return new Response(JSON.stringify({ 
  //       error: error instanceof Error ? error.message : 'Unknown error' 
  //     }), {
  //       status: 500,
  //       headers: { 'Content-Type': 'application/json' }
  //     })
  //   }
  // })
}

// POST /api/condominiums - Create new condominium (platform admin only)
export async function POST(request: NextRequest) {
  return withAuth(async (user: CasaLinkUser) => {
    // Check if user has platform_admin role
    if (user.role !== 'platform_admin') {
      return createAuthError('Access denied. Platform admin role required.', 403)
    }
    try {
      const body = await request.json()
      const { 
        name, 
        type = 'condo', 
        address, 
        city, 
        state, 
        country = 'Malaysia', 
        postal_code,
        subscription_plan = 'basic',
        monthly_revenue = 0,
        status = 'active',
        settings = {}
      } = body

      // Validate required fields
      if (!name || !address) {
        return createAuthError('Missing required fields: name and address', 400)
      }

      const supabase = await createServerSupabaseClient()

      const { data, error } = await supabase
        .from('condominiums')
        .insert({
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
          settings,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify({ condominium: data }), {
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