import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/clerk-supabase'

// GET /api/debug/test-rls - Test RLS policies and database access
export async function GET(request: NextRequest) {
  try {
    console.log('Testing RLS and database access...')
    
    const supabase = await createServerSupabaseClient()
    
    // Test 1: Check current user context
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    console.log('Current user:', { user: user?.id || 'anonymous', error: userError })
    
    // Test 2: Try to bypass RLS by using service role (if available)
    const { data: rlsData, error: rlsError } = await supabase
      .from('condominiums')
      .select('*')
      .limit(5)
    
    console.log('RLS test result:', { 
      dataCount: rlsData?.length || 0, 
      error: rlsError?.message || null 
    })
    
    // Test 3: Check if we can access the table at all
    const { data: tableData, error: tableError } = await supabase
      .from('condominiums')
      .select('id, name')
      .limit(1)
    
    console.log('Table access test:', { 
      dataCount: tableData?.length || 0, 
      error: tableError?.message || null,
      data: tableData 
    })
    
    // Test 4: Try to get table info
    const { data: infoData, error: infoError } = await supabase
      .from('condominiums')
      .select('*')
      .limit(0)
    
    return new Response(JSON.stringify({
      success: true,
      tests: {
        userContext: {
          userId: user?.id || 'anonymous',
          userError: userError?.message || null,
          hasUser: !!user
        },
        rlsTest: {
          dataCount: rlsData?.length || 0,
          error: rlsError?.message || null,
          sampleData: rlsData?.slice(0, 2) || []
        },
        tableAccess: {
          dataCount: tableData?.length || 0,
          error: tableError?.message || null,
          sampleData: tableData || []
        },
        tableInfo: {
          error: infoError?.message || null,
          accessible: !infoError
        }
      },
      summary: {
        hasUser: !!user,
        canAccessTable: !tableError,
        hasData: (rlsData?.length || 0) > 0,
        rlsBlocking: !!rlsError && rlsError.message.includes('policy')
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('RLS test error:', error)
    
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
