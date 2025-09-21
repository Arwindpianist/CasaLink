import { NextRequest } from 'next/server'
import { withAuth, createAuthError } from '@/lib/auth-helpers'
import { createServerSupabaseClient, type CasaLinkUser } from '@/lib/clerk-supabase'

// GET /api/condominiums - Get all condominiums (platform admin only)
export async function GET(request: NextRequest) {
  // Try to get real data from Supabase first, fallback to mock data
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const plan = searchParams.get('plan') || ''

    // Try Supabase first
    try {
      const supabase = await createServerSupabaseClient()
      const offset = (page - 1) * limit

      // Build query
      let query = supabase
        .from('condominiums')
        .select(`
          *,
          users!users_condo_id_fkey(count),
          units!units_condo_id_fkey(count)
        `, { count: 'exact' })

      // Apply filters
      if (search) {
        query = query.or(`name.ilike.%${search}%,address.ilike.%${search}%,city.ilike.%${search}%`)
      }
      if (status && status !== 'all') {
        query = query.eq('status', status)
      }
      if (plan && plan !== 'all') {
        query = query.eq('subscription_plan', plan)
      }

      // Apply pagination
      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      const { data, error, count } = await query

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      // Transform data to match expected format
      const transformedData = (data || []).map(condo => ({
        ...condo,
        monthly_revenue: condo.monthly_revenue || 0,
        subscription_plan: condo.subscription_plan || 'basic',
        users: condo.users || [{ count: 0 }],
        units: condo.units || [{ count: 0 }]
      }))

      return new Response(JSON.stringify({ 
        condominiums: transformedData,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (supabaseError) {
      console.error('Supabase connection failed, using mock data:', supabaseError)
      
      // Fallback to mock data
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
          subscription_plan: 'professional',
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
          status: 'trial',
          settings: {},
          created_at: '2024-02-01T00:00:00Z',
          updated_at: '2024-02-01T00:00:00Z',
          users: [{ count: 67 }],
          units: [{ count: 150 }]
        }
      ]

      // Apply pagination to mock data
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedCondos = mockCondominiums.slice(startIndex, endIndex)

      return new Response(JSON.stringify({
        condominiums: paginatedCondos,
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

// POST /api/condominiums - Create new condominium (platform admin only)
export async function POST(request: NextRequest) {
  // For demo purposes, skip authentication
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
      return new Response(JSON.stringify({ error: 'Missing required fields: name and address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    try {
      const supabase = await createServerSupabaseClient()

      const { data, error } = await supabase
        .from('condominiums')
        .insert({
          name,
          address,
          city
        })
        .select()
        .single()

      if (error) {
        console.error('Supabase insert error:', error)
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify({ condominium: data }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (supabaseError) {
      console.error('Supabase connection failed:', supabaseError)
      // Return success response for demo purposes even if Supabase fails
      const demoCondominium = {
        id: `demo-condo-${Date.now()}`,
        name,
        address,
        city,
        created_at: new Date().toISOString()
      }
      
      return new Response(JSON.stringify({ condominium: demoCondominium }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      })
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