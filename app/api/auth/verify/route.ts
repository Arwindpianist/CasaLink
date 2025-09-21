import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createWebhookSupabaseClient } from '@/lib/clerk-supabase'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
