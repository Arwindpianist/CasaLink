import { NextRequest } from 'next/server'
import { withAuth, createAuthError } from '@/lib/auth-helpers'
import { createServerSupabaseClient, type CasaLinkUser } from '@/lib/clerk-supabase'

// GET /api/condominiums - Get all condominiums (platform admin only)
export async function GET(request: NextRequest) {
  return withAuth(['platform_admin'], async (user: CasaLinkUser) => {
    try {
      const supabase = await createServerSupabaseClient()
      const { searchParams } = new URL(request.url)
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '10')
      const search = searchParams.get('search') || ''
      const status = searchParams.get('status') || ''
      const plan = searchParams.get('plan') || ''

      let query = supabase
        .from('condominiums')
        .select(`
          *,
          users!users_condo_id_fkey(count),
          units!units_condo_id_fkey(count)
        `)

      // Apply filters
      if (search) {
        query = query.or(`name.ilike.%${search}%,address.ilike.%${search}%,city.ilike.%${search}%`)
      }
      
      if (status) {
        query = query.eq('status', status)
      }
      
      if (plan) {
        query = query.eq('subscription_plan', plan)
      }

      // Get total count for pagination
      const { count } = await query

      // Apply pagination
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to).order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify({ 
        condominiums: data,
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

// POST /api/condominiums - Create new condominium (platform admin only)
export async function POST(request: NextRequest) {
  return withAuth(['platform_admin'], async (user: CasaLinkUser) => {
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
