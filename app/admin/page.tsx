"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Building2,
  Users,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Globe,
  Server,
  Zap,
  Shield,
  BarChart3,
  Settings,
  Crown,
} from "lucide-react"
import { motion } from "framer-motion"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { ShineBorderCard } from "@/components/magicui/shine-border-card"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { RoleNavigation } from "@/components/navigation/role-navigation"
import { Skeleton } from "@/components/ui/skeleton"

interface Condominium {
  id: string
  name: string
  type: string
  address: string
  city?: string
  state?: string
  country: string
  postal_code?: string
  subscription_plan: string
  monthly_revenue: number
  status: string
  settings: Record<string, any>
  created_at: string
  updated_at: string
  users?: { count: number }[]
  units?: { count: number }[]
}

export default function AdminDashboard() {
  const [condominiums, setCondominiums] = useState<Condominium[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch condominiums data for dashboard
  useEffect(() => {
    const fetchCondominiums = async () => {
      try {
        const response = await fetch('/api/condominiums?limit=3')
        if (response.ok) {
          const data = await response.json()
          setCondominiums(data.condominiums || [])
        } else {
          console.error('Failed to fetch condominiums:', response.status, response.statusText)
          // Set empty array if API fails
          setCondominiums([])
        }
      } catch (error) {
        console.error('Failed to fetch condominiums:', error)
        // Set empty array if fetch fails
        setCondominiums([])
      } finally {
        setLoading(false)
      }
    }

    fetchCondominiums()
  }, [])

  // Calculate real stats from condominiums data
  const getGlobalStats = () => {
    const totalCondos = condominiums.length
    const totalUsers = condominiums.reduce((sum, condo) => {
      const userCount = condo.users?.[0]?.count || 0
      return sum + userCount
    }, 0)
    const monthlyRevenue = condominiums.reduce((sum, condo) => sum + (condo.monthly_revenue || 0), 0)
    
    return {
      totalCondos,
      activeUsers: totalUsers,
      monthlyRevenue,
      systemUptime: 99.97, // Keep as is
      qrScansToday: 3421, // Keep as is
      supportTickets: 12, // Keep as is
    }
  }

  const globalStats = getGlobalStats()
  const recentCondos = condominiums.slice(0, 3).map(condo => ({
    id: condo.id,
    name: condo.name,
    location: condo.city || 'Unknown',
    units: condo.units?.[0]?.count || 0,
    activeUsers: condo.users?.[0]?.count || 0,
    plan: condo.subscription_plan.charAt(0).toUpperCase() + condo.subscription_plan.slice(1),
    status: condo.status,
    joinDate: new Date(condo.created_at).toLocaleDateString(),
    revenue: condo.monthly_revenue,
  }))

  const systemAlerts = [
    {
      id: 1,
      type: "warning",
      message: "High API usage detected for Pavilion Residences",
      time: "5 min ago",
      severity: "medium",
    },
    {
      id: 2,
      type: "info",
      message: "New condominium registration: Tropicana Gardens",
      time: "1 hour ago",
      severity: "low",
    },
    {
      id: 3,
      type: "error",
      message: "Payment failed for KLCC Towers - subscription suspended",
      time: "2 hours ago",
      severity: "high",
    },
  ]

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return AlertTriangle
      case "warning":
        return Clock
      case "info":
        return CheckCircle
      default:
        return Activity
    }
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-primary"
      case "medium":
        return "text-primary"
      case "low":
        return "text-primary"
      default:
        return "text-primary"
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  return (
    <ProtectedRoute requiredRole="platform_admin">
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
        {/* Enhanced Header with Glass Effect */}
        <header className="glass-header border-b border-border/50 px-4 lg:px-8 py-6 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="-ml-1 warm-hover backdrop-blur-sm hover:backdrop-blur-md hover:shadow-md" />
              <div className="flex items-center space-x-2">
                <Crown className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="dashboard-title warm-text-primary">SaaS Admin Dashboard</h1>
                  <p className="warm-text-secondary">Global platform monitoring and management</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="sage-success backdrop-blur-sm">
                <Activity className="h-3 w-3 mr-1" />
                All Systems Operational
              </Badge>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 space-y-8">
          {/* Enhanced Global Stats with Glass Effects */}
          <motion.div {...fadeInUp}>
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              <Card className="warm-card warm-hover backdrop-blur-sm hover:backdrop-blur-md hover:shadow-md border border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold warm-text-primary">
                        {loading ? <Skeleton className="h-6 w-8" /> : globalStats.totalCondos}
                      </p>
                      <p className="text-xs warm-text-secondary">Total Condos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="warm-card warm-hover backdrop-blur-sm hover:backdrop-blur-md hover:shadow-md border border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold warm-text-primary">
                        {loading ? <Skeleton className="h-6 w-12" /> : globalStats.activeUsers.toLocaleString()}
                      </p>
                      <p className="text-xs warm-text-secondary">Active Users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="warm-card warm-hover backdrop-blur-sm hover:backdrop-blur-md hover:shadow-md border border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold warm-text-primary">
                        {loading ? <Skeleton className="h-6 w-16" /> : `RM${globalStats.monthlyRevenue.toLocaleString()}`}
                      </p>
                      <p className="text-xs warm-text-secondary">Monthly Revenue</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="warm-card warm-hover backdrop-blur-sm hover:backdrop-blur-md hover:shadow-md border border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Server className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold warm-text-primary">{globalStats.systemUptime}%</p>
                      <p className="text-xs warm-text-secondary">System Uptime</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="warm-card warm-hover backdrop-blur-sm hover:backdrop-blur-md hover:shadow-md border border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Zap className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold warm-text-primary">{globalStats.qrScansToday.toLocaleString()}</p>
                      <p className="text-xs warm-text-secondary">QR Scans Today</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="warm-card warm-hover backdrop-blur-sm hover:backdrop-blur-md hover:shadow-md border border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <Shield className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold warm-text-primary">{globalStats.supportTickets}</p>
                      <p className="text-xs warm-text-secondary">Support Tickets</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Condominiums */}
            <motion.div className="lg:col-span-2" {...fadeInUp} transition={{ delay: 0.1 }}>
              <Card className="warm-card">
                <CardHeader>
                  <CardTitle className="flex items-center warm-text-primary space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <span>Active Condominiums</span>
                  </CardTitle>
                  <CardDescription className="warm-text-secondary">Overview of registered properties and their performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loading ? (
                    // Loading skeletons
                    [...Array(3)].map((_, i) => (
                      <div key={i} className="border border-border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-24" />
                              <Skeleton className="h-3 w-40" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-12" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : recentCondos.length === 0 ? (
                    <div className="text-center py-8">
                      <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No condominiums yet</h3>
                      <p className="text-muted-foreground mb-4">Get started by adding your first condominium</p>
                      <Button asChild>
                        <a href="/admin/condos">Add Condominium</a>
                      </Button>
                    </div>
                  ) : (
                    recentCondos.map((condo) => (
                      <div key={condo.id} className="border border-border rounded-lg p-4 warm-hover">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={`/condo-${condo.id}.jpg`} />
                              <AvatarFallback>
                                <Building2 className="h-6 w-6" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium warm-text-primary">{condo.name}</h3>
                              <p className="text-sm warm-text-secondary">{condo.location}</p>
                              <div className="flex items-center space-x-4 mt-1 text-xs warm-text-secondary">
                                <span>{condo.units} units</span>
                                <span>•</span>
                                <span>{condo.activeUsers} active users</span>
                                <span>•</span>
                                <span>Joined {condo.joinDate}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary" className="mb-2 warm-accent">
                              {condo.plan}
                            </Badge>
                            <p className="text-sm font-medium warm-text-primary">RM{condo.revenue}/month</p>
                            <Badge
                              variant="outline"
                              className="text-xs sage-success mt-1"
                            >
                              {condo.status === 'active' ? 'Active' : condo.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-4">
                          <Button size="sm" variant="outline" className="warm-hover" asChild>
                            <a href={`/admin/condos`}>
                              <BarChart3 className="h-4 w-4 mr-1" />
                              View Analytics
                            </a>
                          </Button>
                          <Button size="sm" variant="ghost" className="warm-hover" asChild>
                            <a href={`/admin/condos`}>
                              <Settings className="h-4 w-4 mr-1" />
                              Manage
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* System Alerts */}
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <Card className="warm-card">
                <CardHeader>
                  <CardTitle className="flex items-center warm-text-primary space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <span>System Alerts</span>
                  </CardTitle>
                  <CardDescription className="warm-text-secondary">Recent system events and notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {systemAlerts.map((alert) => {
                    const Icon = getAlertIcon(alert.type)
                    const colorClass = getAlertColor(alert.severity)
                    return (
                      <div key={alert.id} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                          <Icon className={`h-4 w-4 ${colorClass}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm warm-text-primary">{alert.message}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs warm-text-secondary">{alert.time}</span>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                alert.severity === "high"
                                  ? "rustic-error"
                                  : alert.severity === "medium"
                                    ? "amber-warning"
                                    : "sage-success"
                              }`}
                            >
                              {alert.severity}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Performance Metrics */}
          <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
            <Card className="warm-card">
              <CardHeader>
                <CardTitle className="flex items-center warm-text-primary">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                  Platform Performance
                </CardTitle>
                <CardDescription className="warm-text-secondary">Key performance indicators and system health metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Globe className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold warm-text-primary">99.97%</p>
                    <p className="text-sm warm-text-secondary">API Uptime</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Zap className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold warm-text-primary">142ms</p>
                    <p className="text-sm warm-text-secondary">Avg Response Time</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Activity className="h-8 w-8 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold warm-text-primary">98.5%</p>
                    <p className="text-sm warm-text-secondary">User Satisfaction</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Shield className="h-8 w-8 text-orange-600" />
                    </div>
                    <p className="text-2xl font-bold warm-text-primary">0</p>
                    <p className="text-sm warm-text-secondary">Security Incidents</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
