"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Building2, 
  Users, 
  BarChart3, 
  DollarSign, 
  Settings, 
  Shield, 
  AlertTriangle, 
  Bell,
  Plus,
  Search,
  Filter,
  Crown,
  Globe,
  Activity,
  TrendingUp,
  Download,
  Eye,
  Edit,
  Trash2,
  Home,
  ChevronRight,
  Clock,
  User,
  Mail,
  Phone,
  Calendar,
  LogOut
} from "lucide-react"
import { motion } from "framer-motion"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useSearchParams } from "next/navigation"
import { useSimpleAuth } from "@/hooks/use-simple-auth"
import { cn } from "@/lib/utils"

export default function AdminDashboard() {
  const { casalinkUser: user, isLoading: authLoading } = useSimpleAuth()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [loading, setLoading] = useState(false)
  const [condominiums, setCondominiums] = useState<any[]>([])

  // Handle URL parameters for deep linking
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['dashboard', 'condos', 'users', 'analytics', 'billing', 'system', 'security', 'alerts', 'settings'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

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
        }
      } catch (error) {
        console.error('Failed to fetch condominiums:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCondominiums()
  }, [])

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  // Mock data
  const platformStats = {
    totalCondos: 24,
    totalUsers: 1247,
    activeSubscriptions: 22,
    monthlyRevenue: 45600
  }

  const recentActivities = [
    {
      id: 1,
      type: "condo_added",
      title: "New condominium registered",
      description: "Pavilion Residences has been added to the platform",
      time: "2 hours ago",
      priority: "low"
    },
    {
      id: 2,
      type: "user_signup",
      title: "User registration spike",
      description: "15 new users registered in the last hour",
      time: "4 hours ago",
      priority: "medium"
    },
    {
      id: 3,
      type: "system_alert",
      title: "High server load detected",
      description: "Server CPU usage reached 85%",
      time: "6 hours ago",
      priority: "high"
    }
  ]

  const systemHealth = {
    status: "healthy",
    uptime: "99.9%",
    responseTime: "120ms",
    activeUsers: 847
  }

  // Render different content based on active tab
  const renderContent = () => {
    if (activeTab === "dashboard") {
      return (
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Platform overview and key metrics</p>
          </div>

          {/* Platform Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div {...fadeInUp}>
              <Card className="rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Condominiums</p>
                      <p className="text-2xl font-bold text-foreground">{platformStats.totalCondos}</p>
                    </div>
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
              <Card className="rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                      <p className="text-2xl font-bold text-foreground">{platformStats.totalUsers.toLocaleString()}</p>
                    </div>
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <Card className="rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Subscriptions</p>
                      <p className="text-2xl font-bold text-foreground">{platformStats.activeSubscriptions}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
              <Card className="rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-foreground">RM {platformStats.monthlyRevenue.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Condominiums */}
          <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
            <Card className="rounded-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Condominiums</CardTitle>
                    <CardDescription>Latest registered properties</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Condo
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading condominiums...</p>
                    </div>
                  ) : condominiums.length > 0 ? (
                    condominiums.map((condo, index) => (
                      <div key={condo.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">{condo.name}</h3>
                            <p className="text-sm text-muted-foreground">{condo.address}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{condo.type}</Badge>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No condominiums found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activities */}
          <motion.div {...fadeInUp} transition={{ delay: 0.5 }}>
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest platform activities and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.priority === 'high' ? 'bg-red-500' : 
                        activity.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{activity.title}</h3>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-2">
                          <Clock className="h-3 w-3 mr-1" />
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )
    }

    if (activeTab === "condos") {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Condominium Management</h1>
            <p className="text-muted-foreground">Manage all condominiums on the platform</p>
          </div>

          <Card className="rounded-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Condominiums</CardTitle>
                  <CardDescription>View and manage registered properties</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Condo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Condominium Management</h3>
                <p className="text-muted-foreground mb-4">Add, edit, and manage condominiums on the platform</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Condominium
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    if (activeTab === "users") {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground">Manage users across all condominiums</p>
          </div>

          <Card className="rounded-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Users</CardTitle>
                  <CardDescription>View and manage user accounts</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">User Management</h3>
                <p className="text-muted-foreground mb-4">Manage users, roles, and permissions across the platform</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New User
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    if (activeTab === "analytics") {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analytics & Reports</h1>
            <p className="text-muted-foreground">Platform analytics and performance metrics</p>
          </div>

          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>Comprehensive platform analytics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Analytics Coming Soon</h3>
                <p className="text-muted-foreground mb-4">Advanced analytics and reporting features will be available soon</p>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    if (activeTab === "billing") {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Billing & Revenue</h1>
            <p className="text-muted-foreground">Manage subscriptions and billing</p>
          </div>

          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Billing Management</CardTitle>
              <CardDescription>Manage subscriptions, payments, and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <DollarSign className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Billing System</h3>
                <p className="text-muted-foreground mb-4">Subscription and billing management features coming soon</p>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Invoices
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    if (activeTab === "system") {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">System Health</h1>
            <p className="text-muted-foreground">Monitor system performance and health</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">System Status</p>
                    <p className="text-2xl font-bold text-green-600">Healthy</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Uptime</p>
                    <p className="text-2xl font-bold text-foreground">{systemHealth.uptime}</p>
                  </div>
                  <Clock className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Response Time</p>
                    <p className="text-2xl font-bold text-foreground">{systemHealth.responseTime}</p>
                  </div>
                  <Globe className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                    <p className="text-2xl font-bold text-foreground">{systemHealth.activeUsers}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    if (activeTab === "security") {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Security Center</h1>
            <p className="text-muted-foreground">Monitor security events and manage access</p>
          </div>

          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Security Dashboard</CardTitle>
              <CardDescription>Monitor security events and system access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Security Monitoring</h3>
                <p className="text-muted-foreground mb-4">Security monitoring and access management features coming soon</p>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View Security Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    if (activeTab === "alerts") {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Alerts & Logs</h1>
            <p className="text-muted-foreground">System alerts and activity logs</p>
          </div>

          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Recent alerts and system notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.priority === 'high' ? 'bg-red-500' : 
                      activity.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{activity.title}</h3>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <div className="flex items-center text-xs text-muted-foreground mt-2">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    if (activeTab === "settings") {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Platform Settings</h1>
            <p className="text-muted-foreground">Configure platform-wide settings</p>
          </div>

          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Configure platform settings and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Platform Settings</h3>
                <p className="text-muted-foreground mb-4">Configure platform-wide settings and preferences</p>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Open Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return null
  }

  // Show loading state while authenticating
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredRole="platform_admin">
      <SidebarProvider>
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-semibold">Admin Portal</h1>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>
          
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {renderContent()}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}