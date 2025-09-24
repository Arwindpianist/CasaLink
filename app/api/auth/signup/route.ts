import { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { SignJWT } from "jose"

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

    const supabase = createServiceSupabaseClient()

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
      console.error('Signup link validation failed:', linkError)
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

    // Create the user in the database
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        clerk_id: mockClerkId,
        email: email,
        first_name: firstName,
        last_name: lastName,
        role: 'resident',
        condo_id: signupLink.condo_id,
        unit_id: signupLink.unit_id,
        status: 'active'
      })
      .select()
      .single()

    if (userError) {
      console.error('Failed to create user:', userError)
      return new Response(JSON.stringify({ 
        error: 'Failed to create user account' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Update the signup link usage count
    const { error: updateError } = await supabase
      .from('signup_links')
      .update({ 
        used_count: signupLink.used_count + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', signupLink.id)

    if (updateError) {
      console.error('Failed to update signup link:', updateError)
      // Don't fail the signup if we can't update the usage count
    }

    // Link the user to the unit if specified
    if (signupLink.unit_id) {
      const { error: linkError } = await supabase
        .from('unit_residents')
        .insert({
          unit_id: signupLink.unit_id,
          user_id: newUser.id,
          role: 'resident',
          status: 'active'
        })

      if (linkError) {
        console.error('Failed to link user to unit:', linkError)
        // Don't fail the signup if we can't link to unit
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      user: newUser,
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
