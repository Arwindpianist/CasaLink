import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { WebhookEvent } from '@clerk/nextjs/server'
import { syncClerkUserWithSupabase } from '@/lib/clerk-supabase'

export async function POST(req: NextRequest) {
  // Get the headers
  const headerPayload = req.headers
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.text()
  const body = JSON.parse(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '')

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type

  try {
    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt.data)
        break
      case 'user.updated':
        await handleUserUpdated(evt.data)
        break
      case 'user.deleted':
        await handleUserDeleted(evt.data)
        break
      default:
        console.log(`Unhandled webhook event type: ${eventType}`)
    }

    return NextResponse.json({ message: 'Webhook processed successfully' })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleUserCreated(data: any) {
  console.log('User created:', data.id)
  
  // For new users, we'll need to get their role and condo_id from metadata
  // This should be set during the sign-up process
  const role = data.public_metadata?.role || 'resident'
  const condoId = data.public_metadata?.condo_id || 'default-condo'
  
  try {
    await syncClerkUserWithSupabase(data, role, condoId)
    console.log('User synced to Supabase successfully')
  } catch (error) {
    console.error('Error syncing user to Supabase:', error)
  }
}

async function handleUserUpdated(data: any) {
  console.log('User updated:', data.id)
  
  // Update user in Supabase
  try {
    const { createServerSupabaseClient } = await import('@/lib/clerk-supabase')
    const supabase = await createServerSupabaseClient()
    
    const userData = {
      name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || data.email_addresses[0]?.email_address,
      email: data.email_addresses[0]?.email_address,
      phone: data.phone_numbers[0]?.phone_number,
      avatar_url: data.image_url,
      updated_at: new Date().toISOString(),
    }

    await supabase
      .from('users')
      .update(userData)
      .eq('clerk_id', data.id)
    
    console.log('User updated in Supabase successfully')
  } catch (error) {
    console.error('Error updating user in Supabase:', error)
  }
}

async function handleUserDeleted(data: any) {
  console.log('User deleted:', data.id)
  
  // Soft delete user in Supabase (set is_active to false)
  try {
    const { createServerSupabaseClient } = await import('@/lib/clerk-supabase')
    const supabase = await createServerSupabaseClient()
    
    await supabase
      .from('users')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('clerk_id', data.id)
    
    console.log('User deactivated in Supabase successfully')
  } catch (error) {
    console.error('Error deactivating user in Supabase:', error)
  }
}
