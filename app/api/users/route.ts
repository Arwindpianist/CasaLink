import { NextRequest } from 'next/server'
import { withAuth, createAuthError } from '@/lib/auth-helpers'
import { createServerSupabaseClient, type CasaLinkUser } from '@/lib/clerk-supabase'

// GET /api/users - Get users (with role-based access)
export async function GET(request: NextRequest) {
  return withAuth(['platform_admin', 'management'], async (user: CasaLinkUser) => {
    try {
      const supabase = await createServerSupabaseClient()
      const { searchParams } = new URL(request.url)
      const condoId = searchParams.get('condo_id')

      let query = supabase.from('users').select('*')

      // Platform admins can see all users, others only their condo
      if (user.role !== 'platform_admin' && condoId) {
        query = query.eq('condo_id', condoId)
      } else if (user.role !== 'platform_admin') {
        query = query.eq('condo_id', user.condo_id)
      }

      const { data, error } = await query

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify({ users: data }), {
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

// POST /api/users - Create user (management only)
export async function POST(request: NextRequest) {
  return withAuth(['platform_admin', 'management'], async (user: CasaLinkUser) => {
    try {
      const body = await request.json()
      const { clerk_id, condo_id, role, name, email, phone, unit_id } = body

      // Validate required fields
      if (!clerk_id || !condo_id || !role || !name || !email) {
        return createAuthError('Missing required fields', 400)
      }

      // Check if user has access to the specified condo
      if (user.role !== 'platform_admin' && condo_id !== user.condo_id) {
        return createAuthError('Access denied to this condominium', 403)
      }

      const supabase = await createServerSupabaseClient()

      const { data, error } = await supabase
        .from('users')
        .insert({
          clerk_id,
          condo_id,
          role,
          name,
          email,
          phone,
          unit_id,
          preferences: {},
          is_active: true,
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

      return new Response(JSON.stringify({ user: data }), {
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
