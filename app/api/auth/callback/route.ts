import { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/clerk-supabase"
import { auth } from "@clerk/nextjs/server"

// POST /api/auth/callback - Complete signup after Clerk authentication
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { temp_token } = body

    if (!temp_token) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Missing temporary token' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Get the authenticated user from Clerk
    const { userId } = await auth()
    
    if (!userId) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'User not authenticated' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const supabase = await createServerSupabaseClient()

    // Get temporary signup data
    const { data: tempData, error: tempError } = await supabase
      .from('temp_signup_data')
      .select('*')
      .eq('temp_token', temp_token)
      .eq('active', true)
      .single()

    if (tempError || !tempData) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Invalid or expired temporary token' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Check if temporary data has expired
    const now = new Date()
    const expiresAt = new Date(tempData.expires_at)
    
    if (now > expiresAt) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Temporary token has expired' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Get the original signup link
    const { data: signupLink, error: linkError } = await supabase
      .from('signup_links')
      .select('*')
      .eq('token', tempData.signup_token)
      .eq('active', true)
      .single()

    if (linkError || !signupLink) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Original signup link not found' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', userId)
      .single()

    if (existingUser) {
      // User exists, update their condo_id and unit_id
      const { error: updateError } = await supabase
        .from('users')
        .update({
          condo_id: tempData.condo_id,
          unit_id: tempData.unit_id,
          role: 'resident',
          updated_at: new Date().toISOString()
        })
        .eq('clerk_id', userId)

      if (updateError) {
        throw new Error('Failed to update user')
      }
    } else {
      // Create new user
      const { error: createError } = await supabase
        .from('users')
        .insert({
          clerk_id: userId,
          condo_id: tempData.condo_id,
          unit_id: tempData.unit_id,
          role: 'resident',
          name: `${tempData.first_name} ${tempData.last_name}`,
          email: tempData.email,
          preferences: {},
          is_active: true,
          last_seen_at: new Date().toISOString()
        })

      if (createError) {
        throw new Error('Failed to create user')
      }
    }

    // Increment signup link usage
    await supabase
      .from('signup_links')
      .update({ 
        used_count: signupLink.used_count + 1,
        updated_at: new Date().toISOString()
      })
      .eq('token', tempData.signup_token)

    // Deactivate temporary data
    await supabase
      .from('temp_signup_data')
      .update({ active: false })
      .eq('temp_token', temp_token)

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Account created successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in POST /api/auth/callback:', error)
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Failed to complete signup' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
