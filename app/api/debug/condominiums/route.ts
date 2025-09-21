import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/clerk-supabase'

// GET /api/debug/condominiums - Debug endpoint to check Supabase connection and data
export async function GET(request: NextRequest) {
  try {
    console.log('Starting debug query...')
    
    const supabase = await createServerSupabaseClient()
    console.log('Supabase client created successfully')
    
    // Test 1: Simple query to check if table exists and has data
    const { data: simpleData, error: simpleError } = await supabase
      .from('condominiums')
      .select('*')
      .limit(5)
    
    console.log('Simple query result:', { 
      dataCount: simpleData?.length || 0, 
      error: simpleError,
      data: simpleData 
    })
    
    // Test 2: Check table structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('condominiums')
      .select('*')
      .limit(0)
    
    console.log('Table structure test:', { 
      error: tableError,
      hasData: !!tableInfo 
    })
    
    // Test 3: Try to count total records
    const { count, error: countError } = await supabase
      .from('condominiums')
      .select('*', { count: 'exact', head: true })
    
    console.log('Count query result:', { count, error: countError })
    
    return new Response(JSON.stringify({
      success: true,
      tests: {
        simpleQuery: {
          dataCount: simpleData?.length || 0,
          error: simpleError?.message || null,
          sampleData: simpleData?.slice(0, 2) || []
        },
        tableStructure: {
          error: tableError?.message || null,
          accessible: !tableError
        },
        count: {
          totalRecords: count || 0,
          error: countError?.message || null
        }
      },
      summary: {
        hasData: (simpleData?.length || 0) > 0,
        totalRecords: count || 0,
        connectionWorking: !simpleError && !tableError && !countError
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('Debug endpoint error:', error)
    
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
