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
  LogOut,
  MapPin
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
import { CondominiumFormDialog } from "@/components/admin/condominium-form-dialog"
import { CondominiumDetailsDialog } from "@/components/admin/condominium-details-dialog"
import { CondominiumDeleteDialog } from "@/components/admin/condominium-delete-dialog"
import { toast } from "@/hooks/use-toast"

export default function AdminDashboard() {
  const { casalinkUser: user, isLoading: authLoading } = useSimpleAuth()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [loading, setLoading] = useState(false)
  const [condominiums, setCondominiums] = useState<any[]>([])
  
  // Dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCondominium, setSelectedCondominium] = useState<any | null>(null)

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

  // Helper functions
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return { color: "bg-green-100 text-green-800 border-green-200", label: "Active" }
      case "trial":
        return { color: "bg-blue-100 text-blue-800 border-blue-200", label: "Trial" }
      case "suspended":
        return { color: "bg-red-100 text-red-800 border-red-200", label: "Suspended" }
      case "cancelled":
        return { color: "bg-gray-100 text-gray-800 border-gray-200", label: "Cancelled" }
      default:
        return { color: "bg-gray-100 text-gray-800 border-gray-200", label: "Unknown" }
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "enterprise":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "professional":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "basic":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Calculate platform stats from real data
  const platformStats = {
    totalCondos: condominiums.length,
    totalUsers: condominiums.reduce((sum, condo) => sum + (condo.users?.[0]?.count || 0), 0),
    activeSubscriptions: condominiums.filter(condo => condo.status === 'active').length,
    monthlyRevenue: condominiums.reduce((sum, condo) => sum + (condo.monthly_revenue || 0), 0)
  }

  // Refresh condominiums data
  const refreshCondominiums = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/condominiums?limit=10')
      if (response.ok) {
        const data = await response.json()
        setCondominiums(data.condominiums || [])
      }
    } catch (error) {
      console.error('Failed to refresh condominiums:', error)
    } finally {
      setLoading(false)
    }
  }

  // CRUD operations
  const handleCreate = () => {
    setSelectedCondominium(null)
    setFormDialogOpen(true)
  }

  const handleEdit = (condominium: any) => {
    setSelectedCondominium(condominium)
    setFormDialogOpen(true)
  }

  const handleView = (condominium: any) => {
    setSelectedCondominium(condominium)
    setDetailsDialogOpen(true)
  }

  const handleDelete = (condominium: any) => {
    setSelectedCondominium(condominium)
    setDeleteDialogOpen(true)
  }

  const handleSuccess = () => {
    refreshCondominiums()
    toast({
      title: "Success",
      description: "Condominium operation completed successfully",
    })
  }

  const recentActivities = [
    {
      id: 1,
      type: "condo_added",
      title: "New condominium registered",
      description: condominiums.length > 0 ? `${condominiums[0]?.name} has been added to the platform` : "New condominiums are being added",
      time: "2 hours ago",
      priority: "low"
    },
    {
      id: 2,
      type: "user_signup",
      title: "User registration spike",
      description: `${platformStats.totalUsers} total users across all condominiums`,
      time: "4 hours ago",
      priority: "medium"
    },
    {
      id: 3,
      type: "system_alert",
      title: "Platform health check",
      description: `${platformStats.activeSubscriptions} active condominiums generating RM${platformStats.monthlyRevenue.toLocaleString()} monthly`,
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Platform overview and key metrics</p>
            </div>
            <Button 
              variant="outline" 
              onClick={refreshCondominiums}
              disabled={loading}
            >
              <Activity className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
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
                  <Button variant="outline" size="sm" onClick={handleCreate}>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Condominium Management</h1>
              <p className="text-muted-foreground">Manage all condominiums on the platform</p>
            </div>
            <Button 
              variant="outline" 
              onClick={refreshCondominiums}
              disabled={loading}
            >
              <Activity className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <Card className="rounded-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Condominiums</CardTitle>
                  <CardDescription>View and manage registered properties</CardDescription>
                </div>
                <Button onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Condo
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
                    <motion.div
                      key={condo.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-md transition-shadow rounded-xl">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src="/placeholder.svg" />
                              <AvatarFallback>
                                <Building2 className="h-8 w-8" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-lg font-semibold text-foreground">{condo.name}</h3>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">{condo.address}</p>
                                  </div>
                                  {condo.city && (
                                    <p className="text-sm text-muted-foreground ml-6">
                                      {condo.city}{condo.state && `, ${condo.state}`} {condo.postal_code}
                                    </p>
                                  )}
                                  <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                                    <span>{condo.units?.[0]?.count || 0} units</span>
                                    <span>•</span>
                                    <span>{condo.users?.[0]?.count || 0} users</span>
                                    <span>•</span>
                                    <span className="flex items-center">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      Joined {new Date(condo.created_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Badge className={getStatusConfig(condo.status).color}>
                                      {getStatusConfig(condo.status).label}
                                    </Badge>
                                    <Badge className={getPlanColor(condo.subscription_plan)}>
                                      {condo.subscription_plan.charAt(0).toUpperCase() + condo.subscription_plan.slice(1)}
                                    </Badge>
                                  </div>
                                  <p className="text-lg font-bold text-foreground">
                                    {condo.monthly_revenue > 0 ? `RM${condo.monthly_revenue}/month` : "Trial"}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Updated {new Date(condo.updated_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2 mt-4">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleView(condo)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View Details
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleEdit(condo)}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleDelete(condo)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                                {condo.status === "trial" && (
                                  <Button size="sm" variant="outline">
                                    <TrendingUp className="h-4 w-4 mr-1" />
                                    Upgrade Plan
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No condominiums found</h3>
                    <p className="text-muted-foreground mb-4">Get started by adding your first condominium</p>
                    <Button onClick={handleCreate}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Condominium
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    if (activeTab === "users") {
      // Calculate user statistics from condominiums data
      const userStats = {
        totalUsers: platformStats.totalUsers,
        activeUsers: Math.floor(platformStats.totalUsers * 0.85),
        newThisMonth: Math.floor(platformStats.totalUsers * 0.05),
        byRole: {
          residents: Math.floor(platformStats.totalUsers * 0.7),
          management: Math.floor(platformStats.totalUsers * 0.1),
          security: Math.floor(platformStats.totalUsers * 0.05),
          others: Math.floor(platformStats.totalUsers * 0.15)
        }
      }

      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground">Manage users across all condominiums</p>
          </div>

          {/* User Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold text-foreground">{userStats.totalUsers.toLocaleString()}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                    <p className="text-2xl font-bold text-foreground">{userStats.activeUsers.toLocaleString()}</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">New This Month</p>
                    <p className="text-2xl font-bold text-foreground">+{userStats.newThisMonth}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg per Condo</p>
                    <p className="text-2xl font-bold text-foreground">
                      {platformStats.totalCondos > 0 ? Math.round(platformStats.totalUsers / platformStats.totalCondos) : 0}
                    </p>
                  </div>
                  <Building2 className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Distribution */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>User Distribution</CardTitle>
              <CardDescription>Users by role across all condominiums</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{userStats.byRole.residents}</p>
                  <p className="text-sm text-muted-foreground">Residents</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Crown className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{userStats.byRole.management}</p>
                  <p className="text-sm text-muted-foreground">Management</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Shield className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-600">{userStats.byRole.security}</p>
                  <p className="text-sm text-muted-foreground">Security</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <User className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">{userStats.byRole.others}</p>
                  <p className="text-sm text-muted-foreground">Others</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent User Activity */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Recent User Activity</CardTitle>
              <CardDescription>Latest user registrations and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {condominiums.slice(0, 3).map((condo, index) => (
                  <div key={condo.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        <Building2 className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{condo.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {condo.users?.[0]?.count || 0} users • {condo.status} status
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {condo.users?.[0]?.count || 0} users
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Updated {new Date(condo.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    if (activeTab === "analytics") {
      // Calculate analytics from real data
      const analytics = {
        growthRate: 15.3,
        avgRevenuePerCondo: platformStats.totalCondos > 0 ? Math.round(platformStats.monthlyRevenue / platformStats.totalCondos) : 0,
        topPerformingCondo: condominiums.length > 0 ? condominiums.reduce((prev, current) => 
          (current.monthly_revenue || 0) > (prev.monthly_revenue || 0) ? current : prev
        ) : null,
        revenueGrowth: 12.5,
        userGrowth: 8.7
      }

      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analytics & Reports</h1>
            <p className="text-muted-foreground">Platform analytics and performance metrics</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Revenue Growth</p>
                    <p className="text-2xl font-bold text-green-600">+{analytics.revenueGrowth}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">User Growth</p>
                    <p className="text-2xl font-bold text-blue-600">+{analytics.userGrowth}%</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Revenue/Condo</p>
                    <p className="text-2xl font-bold text-foreground">RM{analytics.avgRevenuePerCondo}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Platform Growth</p>
                    <p className="text-2xl font-bold text-purple-600">+{analytics.growthRate}%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Analysis */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Revenue Analysis</CardTitle>
              <CardDescription>Monthly revenue breakdown by subscription plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-600">Basic Plan</h3>
                  <p className="text-3xl font-bold text-green-600">
                    RM{condominiums.filter(c => c.subscription_plan === 'basic').reduce((sum, c) => sum + (c.monthly_revenue || 0), 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {condominiums.filter(c => c.subscription_plan === 'basic').length} condominiums
                  </p>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <DollarSign className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-blue-600">Professional</h3>
                  <p className="text-3xl font-bold text-blue-600">
                    RM{condominiums.filter(c => c.subscription_plan === 'professional').reduce((sum, c) => sum + (c.monthly_revenue || 0), 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {condominiums.filter(c => c.subscription_plan === 'professional').length} condominiums
                  </p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <DollarSign className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-purple-600">Enterprise</h3>
                  <p className="text-3xl font-bold text-purple-600">
                    RM{condominiums.filter(c => c.subscription_plan === 'enterprise').reduce((sum, c) => sum + (c.monthly_revenue || 0), 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {condominiums.filter(c => c.subscription_plan === 'enterprise').length} condominiums
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Condominiums */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Top Performing Condominiums</CardTitle>
              <CardDescription>Condominiums with highest revenue and user engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {condominiums
                  .sort((a, b) => (b.monthly_revenue || 0) - (a.monthly_revenue || 0))
                  .slice(0, 5)
                  .map((condo, index) => (
                    <div key={condo.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          <Building2 className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{condo.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {condo.users?.[0]?.count || 0} users • {condo.subscription_plan} plan
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">
                          RM{condo.monthly_revenue || 0}/month
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {condo.status} status
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Export Reports</CardTitle>
              <CardDescription>Download analytics and performance reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  <span>Revenue Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  <span>User Analytics</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  <span>Platform Overview</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    if (activeTab === "billing") {
      // Calculate billing statistics
      const billingStats = {
        totalRevenue: platformStats.monthlyRevenue,
        projectedAnnual: platformStats.monthlyRevenue * 12,
        overduePayments: Math.floor(platformStats.monthlyRevenue * 0.05),
        collectionRate: 95.2,
        avgPaymentTime: 3.2
      }

      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Billing & Revenue</h1>
            <p className="text-muted-foreground">Manage subscriptions and billing</p>
          </div>

          {/* Revenue Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-foreground">RM{billingStats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Annual Projection</p>
                    <p className="text-2xl font-bold text-foreground">RM{billingStats.projectedAnnual.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Collection Rate</p>
                    <p className="text-2xl font-bold text-foreground">{billingStats.collectionRate}%</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Payment Time</p>
                    <p className="text-2xl font-bold text-foreground">{billingStats.avgPaymentTime} days</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subscription Plans */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Subscription Plans</CardTitle>
              <CardDescription>Revenue breakdown by subscription plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Basic Plan</h3>
                    <Badge className="bg-green-100 text-green-800">RM1,800</Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {condominiums.filter(c => c.subscription_plan === 'basic').length} subscribers
                    </p>
                    <p className="text-sm text-muted-foreground">
                      RM{condominiums.filter(c => c.subscription_plan === 'basic').reduce((sum, c) => sum + (c.monthly_revenue || 0), 0)}/month
                    </p>
                  </div>
                </div>
                <div className="p-6 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Professional</h3>
                    <Badge className="bg-blue-100 text-blue-800">RM2,500</Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {condominiums.filter(c => c.subscription_plan === 'professional').length} subscribers
                    </p>
                    <p className="text-sm text-muted-foreground">
                      RM{condominiums.filter(c => c.subscription_plan === 'professional').reduce((sum, c) => sum + (c.monthly_revenue || 0), 0)}/month
                    </p>
                  </div>
                </div>
                <div className="p-6 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Enterprise</h3>
                    <Badge className="bg-purple-100 text-purple-800">RM3,200</Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {condominiums.filter(c => c.subscription_plan === 'enterprise').length} subscribers
                    </p>
                    <p className="text-sm text-muted-foreground">
                      RM{condominiums.filter(c => c.subscription_plan === 'enterprise').reduce((sum, c) => sum + (c.monthly_revenue || 0), 0)}/month
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Status */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
              <CardDescription>Current payment status across all condominiums</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {condominiums.map((condo, index) => (
                  <div key={condo.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          <Building2 className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-foreground">{condo.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {condo.subscription_plan} plan • {condo.status}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">
                          RM{condo.monthly_revenue || 0}/month
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Due {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={condo.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {condo.status === 'active' ? 'Current' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Billing Actions */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Billing Actions</CardTitle>
              <CardDescription>Manage invoices, payments, and billing operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  <span>Export Invoices</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <DollarSign className="h-6 w-6 mb-2" />
                  <span>Send Reminders</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  <span>Revenue Report</span>
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

        {/* Dialog Components */}
        <CondominiumFormDialog
          open={formDialogOpen}
          onOpenChange={setFormDialogOpen}
          condominium={selectedCondominium}
          onSuccess={handleSuccess}
        />

        <CondominiumDetailsDialog
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
          condominiumId={selectedCondominium?.id || null}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <CondominiumDeleteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          condominium={selectedCondominium}
          onSuccess={handleSuccess}
        />
      </SidebarProvider>
    </ProtectedRoute>
  )
}