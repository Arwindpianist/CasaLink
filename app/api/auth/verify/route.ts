import { NextRequest, NextResponse } from 'next/server'
import { createWebhookSupabaseClient } from '@/lib/clerk-supabase'

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Extract the token
    const token = authHeader.substring(7)
    
    // For now, let's use a simple approach - get the user ID from the token
    // This is a temporary solution until we can properly configure Clerk middleware
    let userId: string | null = null
    
    try {
      // Try to decode the JWT token to get the user ID
      const payload = JSON.parse(atob(token.split('.')[1]))
      userId = payload.sub || payload.user_id
    } catch (e) {
      console.error('Error decoding token:', e)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const supabase = createWebhookSupabaseClient()
    
    // Get user from Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', userId)
      .single()

    if (error) {
      console.error('Error fetching user:', error)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Return user data with authentication status
    return NextResponse.json({
      authenticated: true,
      user: user,
      clerkId: userId
    })
  } catch (error) {
    console.error('Error in auth verify API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
