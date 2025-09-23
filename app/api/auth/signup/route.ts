import { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/clerk-supabase"
import { SignJWT } from "jose"

// POST /api/auth/signup - Create user account and link to property/unit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, token } = body

    if (!email || !password || !firstName || !lastName || !token) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const supabase = await createServerSupabaseClient()

    // Validate the signup token first
    const { data: signupLink, error: linkError } = await supabase
      .from('signup_links')
      .select(`
        *,
        condominiums (
          id,
          name,
          address
        ),
        units (
          id,
          unit_number,
          floor_number
        )
      `)
      .eq('token', token)
      .eq('active', true)
      .single()

    if (linkError || !signupLink) {
      return new Response(JSON.stringify({ 
        error: 'Invalid or expired signup link' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Check if link has expired
    const now = new Date()
    const expiresAt = new Date(signupLink.expires_at)
    
    if (now > expiresAt) {
      return new Response(JSON.stringify({ 
        error: 'Signup link has expired' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Check if link has reached max uses
    if (signupLink.used_count >= signupLink.max_uses) {
      return new Response(JSON.stringify({ 
        error: 'Signup link has already been used' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Verify email matches the signup link
    if (signupLink.resident_email.toLowerCase() !== email.toLowerCase()) {
      return new Response(JSON.stringify({ 
        error: 'Email address does not match the signup link' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (existingUser) {
      return new Response(JSON.stringify({ 
        error: 'User with this email already exists' 
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Create Clerk user (this would normally be done through Clerk's API)
    // For now, we'll create a mock clerk_id
    const mockClerkId = `user_${Math.random().toString(36).substring(2, 15)}`

    // Use the database function to create user and update signup link
    const { data: result, error: userError } = await supabase
      .rpc('validate_and_use_signup_link', {
        p_token: token,
        p_clerk_id: mockClerkId,
        p_email: email,
        p_first_name: firstName,
        p_last_name: lastName
      })

    if (userError) {
      console.error('Database error:', userError)
      return new Response(JSON.stringify({ 
        error: 'Failed to create user account' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (!result.success) {
      return new Response(JSON.stringify({ 
        error: result.error 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // In a real implementation, you would:
    // 1. Create the user in Clerk using their API
    // 2. Get the actual clerk_id from Clerk
    // 3. Update the user record with the real clerk_id

    return new Response(JSON.stringify({ 
      success: true,
      user: result.user,
      message: 'Account created successfully'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in POST /api/auth/signup:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to create account' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
