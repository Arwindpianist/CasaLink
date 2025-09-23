import { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/clerk-supabase"

// POST /api/auth/signup-secure - Secure signup with Clerk integration
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

    // SECURE APPROACH: Create user in Clerk first, then sync to Supabase
    // This requires Clerk's Admin API or a different approach
    
    // For now, we'll return a redirect URL to Clerk's signup with metadata
    const clerkSignupUrl = new URL('https://clerk.com/sign-up')
    clerkSignupUrl.searchParams.set('redirect_url', `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`)
    
    // Store the signup token temporarily for the callback
    const tempToken = `temp_${Math.random().toString(36).substring(2, 15)}`
    
    // Store temporary signup data
    const { error: tempError } = await supabase
      .from('temp_signup_data')
      .insert({
        temp_token: tempToken,
        signup_token: token,
        email: email,
        first_name: firstName,
        last_name: lastName,
        condo_id: signupLink.condo_id,
        unit_id: signupLink.unit_id,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes
      })

    if (tempError) {
      throw new Error('Failed to create temporary signup data')
    }

    return new Response(JSON.stringify({ 
      success: true,
      redirect_url: clerkSignupUrl.toString(),
      temp_token: tempToken,
      message: 'Redirect to Clerk signup'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in POST /api/auth/signup-secure:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to process signup request' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
