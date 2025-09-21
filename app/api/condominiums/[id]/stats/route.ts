import { NextRequest } from 'next/server'
import { withAuth, createAuthError } from '@/lib/auth-helpers'
import { createServerSupabaseClient, type CasaLinkUser } from '@/lib/clerk-supabase'

// GET /api/condominiums/[id]/stats - Get condominium statistics and analytics
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(async (user: CasaLinkUser) => {
    // Check if user has platform_admin role
    if (user.role !== 'platform_admin') {
      return createAuthError('Access denied. Platform admin role required.', 403)
    }
    try {
      const supabase = await createServerSupabaseClient()
      const condoId = params.id
      const { searchParams } = new URL(request.url)
      const period = searchParams.get('period') || '30' // days

      // Check if condominium exists
      const { data: condominium, error: condoError } = await supabase
        .from('condominiums')
        .select('id, name')
        .eq('id', condoId)
        .single()

      if (condoError || !condominium) {
        return createAuthError('Condominium not found', 404)
      }

      const startDate = new Date()
      startDate.setDate(startDate.getDate() - parseInt(period))

      // Get basic statistics
      const [
        usersResult,
        unitsResult,
        visitorsResult,
        bookingsResult,
        amenitiesResult
      ] = await Promise.all([
        // Users count and active users
        supabase
          .from('users')
          .select('id, is_active, last_seen_at, role')
          .eq('condo_id', condoId),
        
        // Units count
        supabase
          .from('units')
          .select('id, status')
          .eq('condo_id', condoId),
        
        // Recent visitors
        supabase
          .from('visitors')
          .select('id, status, created_at')
          .eq('condo_id', condoId)
          .gte('created_at', startDate.toISOString()),
        
        // Recent bookings
        supabase
          .from('bookings')
          .select('id, status, created_at')
          .eq('condo_id', condoId)
          .gte('created_at', startDate.toISOString()),
        
        // Amenities count
        supabase
          .from('amenities')
          .select('id, type, is_active')
          .eq('condo_id', condoId)
      ])

      // Process statistics
      const users = usersResult.data || []
      const units = unitsResult.data || []
      const visitors = visitorsResult.data || []
      const bookings = bookingsResult.data || []
      const amenities = amenitiesResult.data || []

      const stats = {
        // Basic counts
        totalUsers: users.length,
        activeUsers: users.filter(u => u.is_active).length,
        totalUnits: units.length,
        occupiedUnits: units.filter(u => u.status === 'occupied').length,
        totalAmenities: amenities.length,
        activeAmenities: amenities.filter(a => a.is_active).length,
        
        // Activity in the selected period
        recentVisitors: visitors.length,
        pendingVisitors: visitors.filter(v => v.status === 'pending').length,
        approvedVisitors: visitors.filter(v => v.status === 'approved').length,
        
        recentBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        completedBookings: bookings.filter(b => b.status === 'completed').length,
        
        // User roles breakdown
        roleBreakdown: {
          management: users.filter(u => u.role === 'management').length,
          security: users.filter(u => u.role === 'security').length,
          residents: users.filter(u => u.role === 'resident').length,
          moderators: users.filter(u => u.role === 'moderator').length
        },
        
        // Amenity types breakdown
        amenityBreakdown: amenities.reduce((acc, amenity) => {
          acc[amenity.type] = (acc[amenity.type] || 0) + 1
          return acc
        }, {} as Record<string, number>),
        
        // Unit status breakdown
        unitStatusBreakdown: units.reduce((acc, unit) => {
          acc[unit.status] = (acc[unit.status] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      }

      // Get additional analytics if requested
      if (searchParams.get('include_analytics') === 'true') {
        // Get access logs for the period
        const { data: accessLogs } = await supabase
          .from('access_logs')
          .select('result, timestamp')
          .eq('condo_id', condoId)
          .gte('timestamp', startDate.toISOString())

        // Get chat activity
        const { data: chatMessages } = await supabase
          .from('chat_messages')
          .select('id, created_at')
          .eq('condo_id', condoId)
          .gte('created_at', startDate.toISOString())

        // Get community posts
        const { data: communityPosts } = await supabase
          .from('community_posts')
          .select('id, category, created_at')
          .eq('condo_id', condoId)
          .gte('created_at', startDate.toISOString())

        stats.analytics = {
          totalAccessAttempts: accessLogs?.length || 0,
          successfulAccess: accessLogs?.filter(log => log.result === 'success').length || 0,
          failedAccess: accessLogs?.filter(log => log.result === 'denied').length || 0,
          
          chatActivity: chatMessages?.length || 0,
          communityPosts: communityPosts?.length || 0,
          postCategories: communityPosts?.reduce((acc, post) => {
            acc[post.category] = (acc[post.category] || 0) + 1
            return acc
          }, {} as Record<string, number>) || {}
        }
      }

      return new Response(JSON.stringify({ 
        condominium: {
          id: condominium.id,
          name: condominium.name
        },
        period: `${period} days`,
        stats
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  })
}
