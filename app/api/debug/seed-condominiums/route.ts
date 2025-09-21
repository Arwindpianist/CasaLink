import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/clerk-supabase'

// POST /api/debug/seed-condominiums - Add sample condominiums to database
export async function POST(request: NextRequest) {
  try {
    console.log('Starting to seed condominiums...')
    
    const supabase = await createServerSupabaseClient()
    
    // Sample condominiums data
    const sampleCondominiums = [
      {
        name: 'Pavilion Residences',
        type: 'condo',
        address: '168 Jalan Bukit Bintang',
        city: 'Kuala Lumpur',
        state: 'Wilayah Persekutuan',
        country: 'Malaysia',
        postal_code: '55100',
        subscription_plan: 'professional',
        monthly_revenue: 2500,
        status: 'active',
        settings: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        name: 'KLCC Towers',
        type: 'condo',
        address: 'Jalan Ampang',
        city: 'Kuala Lumpur',
        state: 'Wilayah Persekutuan',
        country: 'Malaysia',
        postal_code: '50450',
        subscription_plan: 'basic',
        monthly_revenue: 1800,
        status: 'active',
        settings: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        name: 'Tropicana Gardens',
        type: 'condo',
        address: 'Jalan Tropicana',
        city: 'Petaling Jaya',
        state: 'Selangor',
        country: 'Malaysia',
        postal_code: '47810',
        subscription_plan: 'enterprise',
        monthly_revenue: 3200,
        status: 'trial',
        settings: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        name: 'Mont Kiara Residences',
        type: 'condo',
        address: 'Jalan Kiara 3',
        city: 'Kuala Lumpur',
        state: 'Wilayah Persekutuan',
        country: 'Malaysia',
        postal_code: '50480',
        subscription_plan: 'professional',
        monthly_revenue: 2800,
        status: 'active',
        settings: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        name: 'Sunway Velocity',
        type: 'condo',
        address: 'Jalan Cheras',
        city: 'Kuala Lumpur',
        state: 'Wilayah Persekutuan',
        country: 'Malaysia',
        postal_code: '43200',
        subscription_plan: 'basic',
        monthly_revenue: 2200,
        status: 'active',
        settings: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        name: 'Bandar Utama Residences',
        type: 'condo',
        address: 'Jalan Bandar Utama',
        city: 'Petaling Jaya',
        state: 'Selangor',
        country: 'Malaysia',
        postal_code: '47800',
        subscription_plan: 'enterprise',
        monthly_revenue: 3000,
        status: 'active',
        settings: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        name: 'Cyberjaya Condominium',
        type: 'condo',
        address: 'Jalan Teknologi',
        city: 'Cyberjaya',
        state: 'Selangor',
        country: 'Malaysia',
        postal_code: '63000',
        subscription_plan: 'basic',
        monthly_revenue: 1900,
        status: 'active',
        settings: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        name: 'Subang Jaya Towers',
        type: 'condo',
        address: 'Jalan SS15',
        city: 'Subang Jaya',
        state: 'Selangor',
        country: 'Malaysia',
        postal_code: '47500',
        subscription_plan: 'professional',
        monthly_revenue: 2400,
        status: 'active',
        settings: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
    
    console.log(`Attempting to insert ${sampleCondominiums.length} condominiums...`)
    
    // Insert the sample data
    const { data, error } = await supabase
      .from('condominiums')
      .insert(sampleCondominiums)
      .select()
    
    if (error) {
      console.error('Insert error:', error)
      return new Response(JSON.stringify({
        success: false,
        error: error.message,
        details: error
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    console.log(`Successfully inserted ${data?.length || 0} condominiums`)
    
    // Verify the insertion
    const { count, error: countError } = await supabase
      .from('condominiums')
      .select('*', { count: 'exact', head: true })
    
    return new Response(JSON.stringify({
      success: true,
      inserted: data?.length || 0,
      totalInDatabase: count || 0,
      insertedData: data,
      countError: countError?.message || null
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('Seed endpoint error:', error)
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
