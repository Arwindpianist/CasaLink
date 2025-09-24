import { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create service role client that bypasses RLS
function createServiceSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// GET /api/signup-links/validate - Validate signup link
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const token = url.searchParams.get('token')

    if (!token) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Token is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const supabase = createServiceSupabaseClient()

    // Get the signup link with property and unit information
    const { data: signupLink, error } = await supabase
      .from('signup_links')
      .select(`
        *,
        condominiums (
          id,
          name,
          address,
          city,
          state
        ),
        units (
          id,
          unit_number,
          floor_number,
          block_number
        )
      `)
      .eq('token', token)
      .eq('active', true)
      .single()

    if (error || !signupLink) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Invalid or expired signup link' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Check if link has expired
    const now = new Date()
    const expiresAt = new Date(signupLink.expires_at)
    
    if (now > expiresAt) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Signup link has expired' 
      }), {
        status: 410,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Check if link has reached max uses
    if (signupLink.used_count >= signupLink.max_uses) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Signup link has already been used' 
      }), {
        status: 410,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ 
      success: true,
      signup_link: {
        condo_id: signupLink.condo_id,
        unit_id: signupLink.unit_id,
        resident_email: signupLink.resident_email,
        condominiums: signupLink.condominiums,
        units: signupLink.units,
        expires_at: signupLink.expires_at,
        max_uses: signupLink.max_uses,
        used_count: signupLink.used_count
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error in GET /api/signup-links/validate:', error)
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Failed to validate signup link' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
