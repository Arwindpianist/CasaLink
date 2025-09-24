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

// Create Clerk user using Clerk's API
async function createClerkUser(email: string, password: string, firstName: string, lastName: string) {
  const clerkSecretKey = process.env.CLERK_SECRET_KEY
  
  if (!clerkSecretKey) {
    throw new Error('Clerk secret key not configured')
  }

  const response = await fetch('https://api.clerk.com/v1/users', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${clerkSecretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email_address: [email],
      password: password,
      first_name: firstName,
      last_name: lastName,
      skip_password_checks: false,
      skip_password_requirement: false,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Clerk API error: ${error}`)
  }

  return await response.json()
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

    // Create user in Clerk first
    console.log('Creating user in Clerk...')
    const clerkUser = await createClerkUser(email, password, firstName, lastName)
    console.log('Clerk user created:', clerkUser.id)

    // Create the user in our database with the real Clerk ID
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        clerk_id: clerkUser.id,
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
      console.error('Failed to create user in database:', userError)
      // Note: Clerk user was created, but database sync failed
      // In production, you might want to clean up the Clerk user
      return new Response(JSON.stringify({ 
        error: 'Failed to sync user to database' 
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
      clerk_user: {
        id: clerkUser.id,
        email_addresses: clerkUser.email_addresses,
        first_name: clerkUser.first_name,
        last_name: clerkUser.last_name
      },
      message: 'Account created successfully with Clerk authentication'
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
