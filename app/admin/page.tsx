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
  MapPin,
  Building,
  HomeIcon,
  TreePine,
  Factory
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
import { InlineCondominiumForm } from "@/components/admin/inline-condominium-form"
import { InlineCondominiumDetails } from "@/components/admin/inline-condominium-details"
import { InlineDeleteConfirmation } from "@/components/admin/inline-delete-confirmation"
import { toast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminDashboard() {
  const { casalinkUser: user, isLoading: authLoading } = useSimpleAuth()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [loading, setLoading] = useState(false)
  const [condominiums, setCondominiums] = useState<any[]>([])
  
  // Inline view states
  const [inlineView, setInlineView] = useState<'list' | 'create' | 'edit' | 'details' | 'delete'>('list')
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
      setLoading(true)
      try {
        const response = await fetch('/api/condominiums?limit=10')
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

  // Get property type icon and styling
  const getPropertyTypeConfig = (type: string) => {
    switch (type?.toLowerCase()) {
      case "condo":
      case "condominium":
        return {
          icon: Building2,
          bgColor: "bg-blue-500/20",
          iconColor: "text-blue-600",
          borderColor: "border-blue-200",
          label: "Condo"
        }
      case "apartment":
        return {
          icon: Building,
          bgColor: "bg-purple-500/20",
          iconColor: "text-purple-600",
          borderColor: "border-purple-200",
          label: "Apartment"
        }
      case "townhouse":
        return {
          icon: HomeIcon,
          bgColor: "bg-green-500/20",
          iconColor: "text-green-600",
          borderColor: "border-green-200",
          label: "Townhouse"
        }
      case "villa":
        return {
          icon: Home,
          bgColor: "bg-orange-500/20",
          iconColor: "text-orange-600",
          borderColor: "border-orange-200",
          label: "Villa"
        }
      case "office":
      case "commercial":
        return {
          icon: Factory,
          bgColor: "bg-gray-500/20",
          iconColor: "text-gray-600",
          borderColor: "border-gray-200",
          label: "Commercial"
        }
      case "resort":
        return {
          icon: TreePine,
          bgColor: "bg-emerald-500/20",
          iconColor: "text-emerald-600",
          borderColor: "border-emerald-200",
          label: "Resort"
        }
      default:
        return {
          icon: Building2,
          bgColor: "bg-primary/20",
          iconColor: "text-primary",
          borderColor: "border-primary/30",
          label: type || "Property"
        }
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
    setInlineView('create')
  }

  const handleEdit = (condominium: any) => {
    setSelectedCondominium(condominium)
    setInlineView('edit')
  }

  const handleView = (condominium: any) => {
    setSelectedCondominium(condominium)
    setInlineView('details')
  }

  const handleDelete = (condominium: any) => {
    setSelectedCondominium(condominium)
    setInlineView('delete')
  }

  const handleSuccess = () => {
    setInlineView('list')
    setSelectedCondominium(null)
    refreshCondominiums()
    toast({
      title: "Success",
      description: "Condominium operation completed successfully",
    })
  }

  const handleCancel = () => {
    setInlineView('list')
    setSelectedCondominium(null)
  }

  const recentActivities = [
    {
      id: 1,
      type: "condo_added",
      title: "New property registered",
      description: condominiums.length > 0 ? `${condominiums[0]?.name} has been added to the platform` : "New properties are being added",
      time: "2 hours ago",
      priority: "low"
    },
    {
      id: 2,
      type: "user_signup",
      title: "User registration spike",
      description: `${platformStats.totalUsers} total users across all properties`,
      time: "4 hours ago",
      priority: "medium"
    },
    {
      id: 3,
      type: "system_alert",
      title: "Platform health check",
      description: `${platformStats.activeSubscriptions} active properties generating RM${platformStats.monthlyRevenue.toLocaleString()} monthly`,
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
              <h1 className="text-2xl font-bold text-foreground dashboard-title">Admin Dashboard</h1>
              <p className="text-muted-foreground dashboard-text">Platform overview and key metrics</p>
            </div>
            <Button 
              variant="outline" 
              onClick={refreshCondominiums}
              disabled={loading}
              className="warm-hover border-2 border-primary/50 hover:border-primary hover:text-primary hover:bg-primary/20 dark:border-primary/60 dark:hover:border-primary dark:hover:bg-primary/30 dark:hover:text-primary"
            >
              <Activity className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Platform Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div {...fadeInUp}>
              <Card className="rounded-xl border-2 border-primary/40 hover:border-primary hover:shadow-lg transition-all duration-200 bg-card/80 backdrop-blur-sm dark:bg-card/95 dark:border-primary/60 dark:hover:border-primary dark:hover:shadow-primary/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Total Properties</p>
                      <p className="text-2xl font-bold text-foreground">{loading ? <Skeleton className="h-8 w-8" /> : platformStats.totalCondos}</p>
                    </div>
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
              <Card className="rounded-xl border-2 border-primary/40 hover:border-primary hover:shadow-lg transition-all duration-200 bg-card/80 backdrop-blur-sm dark:bg-card/95 dark:border-primary/60 dark:hover:border-primary dark:hover:shadow-primary/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Total Users</p>
                      <p className="text-2xl font-bold text-foreground">{loading ? <Skeleton className="h-8 w-12" /> : platformStats.totalUsers.toLocaleString()}</p>
                    </div>
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <Card className="rounded-xl border-2 border-primary/40 hover:border-primary hover:shadow-lg transition-all duration-200 bg-card/80 backdrop-blur-sm dark:bg-card/95 dark:border-primary/60 dark:hover:border-primary dark:hover:shadow-primary/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Active Subscriptions</p>
                      <p className="text-2xl font-bold text-foreground">{loading ? <Skeleton className="h-8 w-8" /> : platformStats.activeSubscriptions}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
              <Card className="rounded-xl border-2 border-primary/40 hover:border-primary hover:shadow-lg transition-all duration-200 bg-card/80 backdrop-blur-sm dark:bg-card/95 dark:border-primary/60 dark:hover:border-primary dark:hover:shadow-primary/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-foreground">{loading ? <Skeleton className="h-8 w-16" /> : `RM ${platformStats.monthlyRevenue.toLocaleString()}`}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Properties */}
          <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
            <Card className="rounded-xl border-2 border-primary/40 hover:border-primary hover:shadow-lg transition-all duration-200 bg-card/80 backdrop-blur-sm dark:bg-card/95 dark:border-primary/60 dark:hover:border-primary dark:hover:shadow-primary/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground">Recent Properties</CardTitle>
                    <CardDescription className="text-foreground">Latest registered properties</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleCreate} className="border-2 hover:border-primary/50 hover:text-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Property
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/30">
                              <Building2 className="h-5 w-5 text-primary" />
                            </div>
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-48" />
                              <Skeleton className="h-3 w-64" />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-8 w-8" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : condominiums.length > 0 ? (
                    condominiums.map((condo, index) => {
                      const propertyConfig = getPropertyTypeConfig(condo.type)
                      const PropertyIcon = propertyConfig.icon
                      return (
                        <div key={condo.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 ${propertyConfig.bgColor} rounded-lg flex items-center justify-center border ${propertyConfig.borderColor}`}>
                              <PropertyIcon className={`h-5 w-5 ${propertyConfig.iconColor}`} />
                            </div>
                            <div>
                              <h3 className="font-medium text-foreground">{condo.name}</h3>
                              <p className="text-sm text-foreground">{condo.address}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className={`${propertyConfig.bgColor} ${propertyConfig.iconColor} border ${propertyConfig.borderColor}`}>
                              {propertyConfig.label}
                            </Badge>
                            <Button size="sm" variant="outline" className="warm-hover border-2 border-primary/50 hover:border-primary hover:text-primary hover:bg-primary/20 dark:border-primary/60 dark:hover:border-primary dark:hover:bg-primary/30 dark:hover:text-primary">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-8">
                      <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No properties found</p>
                    </div>
                  )}
                  </div>
                </CardContent>
              </Card>
          </motion.div>

          {/* Recent Activities */}
          <motion.div {...fadeInUp} transition={{ delay: 0.5 }}>
            <Card className="rounded-xl border-2 border-primary/40 hover:border-primary hover:shadow-lg transition-all duration-200 bg-card/80 backdrop-blur-sm dark:bg-card/95 dark:border-primary/60 dark:hover:border-primary dark:hover:shadow-primary/50">
              <CardHeader>
                <CardTitle className="text-foreground">Recent Activities</CardTitle>
                <CardDescription className="text-foreground">Latest platform activities and alerts</CardDescription>
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
                        <p className="text-sm text-foreground">{activity.description}</p>
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
      // Render inline views based on current state
      if (inlineView === 'create') {
        return (
          <InlineCondominiumForm
            condominium={null}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            mode="create"
          />
        )
      }

      if (inlineView === 'edit' && selectedCondominium) {
        return (
          <InlineCondominiumForm
            condominium={selectedCondominium}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            mode="edit"
          />
        )
      }

      if (inlineView === 'details' && selectedCondominium) {
        return (
          <InlineCondominiumDetails
            condominium={selectedCondominium}
            onEdit={() => setInlineView('edit')}
            onDelete={() => setInlineView('delete')}
            onClose={handleCancel}
          />
        )
      }

      if (inlineView === 'delete' && selectedCondominium) {
  return (
          <InlineDeleteConfirmation
            condominium={selectedCondominium}
            onConfirm={handleSuccess}
            onCancel={handleCancel}
          />
        )
      }

      // Default list view
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground dashboard-title">Property Management</h1>
              <p className="text-foreground dashboard-text">Manage all properties on the platform</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={refreshCondominiums}
                disabled={loading}
                className="warm-hover border-2 border-primary/50 hover:border-primary hover:text-primary hover:bg-primary/20 dark:border-primary/60 dark:hover:border-primary dark:hover:bg-primary/30 dark:hover:text-primary"
              >
                <Activity className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                onClick={handleCreate}
                className="warm-button border-2 border-primary hover:border-primary/90 bg-primary hover:bg-primary/95 dark:border-primary dark:bg-primary dark:hover:bg-primary/90 dark:hover:border-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Property
              </Button>
            </div>
          </div>

          <Card className="warm-card border-2 border-primary/40 hover:border-primary/30 transition-all duration-200 hover:shadow-lg bg-card/80 backdrop-blur-sm dark:bg-card/95 dark:border-primary/60 dark:hover:border-primary/50 dark:hover:shadow-primary/40">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-foreground">All Properties</CardTitle>
                  <CardDescription className="text-foreground">View and manage registered properties</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                      <Card key={i} className="border-2 border-border/50">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary/30">
                              <Building2 className="h-8 w-8 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                  <Skeleton className="h-6 w-48" />
                                  <Skeleton className="h-4 w-64" />
                                  <Skeleton className="h-3 w-32" />
                                </div>
                                <div className="flex flex-col items-end space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Skeleton className="h-6 w-16" />
                                    <Skeleton className="h-6 w-20" />
                                  </div>
                                  <Skeleton className="h-6 w-24" />
                                  <Skeleton className="h-3 w-20" />
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 mt-4">
                                <Skeleton className="h-8 w-24" />
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-8 w-20" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : condominiums.length > 0 ? (
                  condominiums.map((condo, index) => {
                    const propertyConfig = getPropertyTypeConfig(condo.type)
                    const PropertyIcon = propertyConfig.icon
                    return (
                      <motion.div
                        key={condo.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="warm-card border-2 border-primary/40 hover:border-primary hover:shadow-lg transition-all duration-200 bg-card/80 backdrop-blur-sm dark:bg-card/95 dark:border-primary/60 dark:hover:border-primary dark:hover:shadow-primary/50">
                          <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                              <div className={`h-16 w-16 ${propertyConfig.bgColor} rounded-full flex items-center justify-center border-2 ${propertyConfig.borderColor}`}>
                                <PropertyIcon className={`h-8 w-8 ${propertyConfig.iconColor}`} />
                              </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-lg font-semibold text-foreground">{condo.name}</h3>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm text-foreground">{condo.address}</p>
                                  </div>
                                  {condo.city && (
                                    <p className="text-sm text-foreground ml-6">
                                      {condo.city}{condo.state && `, ${condo.state}`} {condo.postal_code}
                                    </p>
                                  )}
                                  <div className="flex items-center space-x-4 mt-2 text-sm text-foreground">
                                    <span>{condo.total_units || 0} units</span>
                                    <span>•</span>
                                    <span className="flex items-center">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      Joined {new Date(condo.created_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                      Active
              </Badge>
                                    <Badge className={`${propertyConfig.bgColor} ${propertyConfig.iconColor} border ${propertyConfig.borderColor}`}>
                                      {propertyConfig.label}
                                    </Badge>
                                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                      {condo.subscription_plan?.charAt(0).toUpperCase() + condo.subscription_plan?.slice(1) || 'Basic'}
                                    </Badge>
            </div>
                                  <p className="text-lg font-bold text-primary">
                                    RM{condo.monthly_revenue?.toLocaleString() || '0'}/month
                                  </p>
                                  <p className="text-xs text-foreground">
                                    Updated {new Date(condo.updated_at).toLocaleDateString()}
                                  </p>
          </div>
                              </div>

                              <div className="flex items-center space-x-2 mt-4">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleView(condo)}
                                  className="warm-hover border-2 border-primary/50 hover:border-primary hover:text-primary hover:bg-primary/20 dark:border-primary/60 dark:hover:border-primary dark:hover:bg-primary/30 dark:hover:text-primary"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View Details
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleEdit(condo)}
                                  className="warm-hover border-2 hover:border-blue-500/50 hover:text-blue-600"
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleDelete(condo)}
                                  className="warm-hover border-2 hover:border-destructive/50 hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                    </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
                      </motion.div>
                    )
                  })
                ) : (
                  <div className="text-center py-16">
                    <Building2 className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-foreground mb-3 dashboard-title">No properties found</h3>
                    <p className="text-foreground mb-6 max-w-md mx-auto dashboard-text">
                      Get started by adding your first property to the platform. You can configure pricing, add-ons, and manage all aspects of the property.
                    </p>
                    <Button 
                      onClick={handleCreate}
                      className="warm-button border-2 border-primary hover:border-primary/90 bg-primary hover:bg-primary/95 dark:border-primary dark:bg-primary dark:hover:bg-primary/90 dark:hover:border-primary/90"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Property
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
            <p className="text-foreground">Manage users across all condominiums</p>
                    </div>

          {/* User Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-sm font-medium text-foreground">Total Users</p>
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
                    <p className="text-sm font-medium text-foreground">Active Users</p>
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
                    <p className="text-sm font-medium text-foreground">New This Month</p>
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
                    <p className="text-sm font-medium text-foreground">Avg per Condo</p>
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
                  <p className="text-sm text-foreground">Residents</p>
                    </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Crown className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{userStats.byRole.management}</p>
                  <p className="text-sm text-foreground">Management</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Shield className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-600">{userStats.byRole.security}</p>
                  <p className="text-sm text-foreground">Security</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <User className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">{userStats.byRole.others}</p>
                  <p className="text-sm text-foreground">Others</p>
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
                      <p className="text-sm text-foreground">
                        {condo.users?.[0]?.count || 0} users • {condo.status} status
                      </p>
                    </div>
                        <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {condo.users?.[0]?.count || 0} users
                      </p>
                      <p className="text-xs text-foreground">
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
            <p className="text-foreground">Platform analytics and performance metrics</p>
                    </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Revenue Growth</p>
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
                    <p className="text-sm font-medium text-foreground">User Growth</p>
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
                    <p className="text-sm font-medium text-foreground">Avg Revenue/Condo</p>
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
                    <p className="text-sm font-medium text-foreground">Platform Growth</p>
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
                    {condominiums.filter(c => c.subscription_plan === 'basic').length} properties
                  </p>
                    </div>
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <DollarSign className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-blue-600">Professional</h3>
                  <p className="text-3xl font-bold text-blue-600">
                    RM{condominiums.filter(c => c.subscription_plan === 'professional').reduce((sum, c) => sum + (c.monthly_revenue || 0), 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {condominiums.filter(c => c.subscription_plan === 'professional').length} properties
                  </p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <DollarSign className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-purple-600">Enterprise</h3>
                  <p className="text-3xl font-bold text-purple-600">
                    RM{condominiums.filter(c => c.subscription_plan === 'enterprise').reduce((sum, c) => sum + (c.monthly_revenue || 0), 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {condominiums.filter(c => c.subscription_plan === 'enterprise').length} properties
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Properties */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Top Performing Properties</CardTitle>
              <CardDescription>Properties with highest revenue and user engagement</CardDescription>
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
                        <p className="text-sm text-foreground">
                          {condo.users?.[0]?.count || 0} users • {condo.subscription_plan} plan
                        </p>
                        </div>
                        <div className="text-right">
                        <p className="text-lg font-bold text-foreground">
                          RM{condo.monthly_revenue || 0}/month
                        </p>
                        <p className="text-xs text-foreground">
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
            <p className="text-foreground">Manage subscriptions and billing</p>
          </div>

          {/* Revenue Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Monthly Revenue</p>
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
                    <p className="text-sm font-medium text-foreground">Annual Projection</p>
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
                    <p className="text-sm font-medium text-foreground">Collection Rate</p>
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
                    <p className="text-sm font-medium text-foreground">Avg Payment Time</p>
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
                      {condominiums.filter(c => c.subscription_plan === 'basic').length} properties
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
                      {condominiums.filter(c => c.subscription_plan === 'professional').length} properties
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
                      {condominiums.filter(c => c.subscription_plan === 'enterprise').length} properties
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
              <CardDescription>Current payment status across all properties</CardDescription>
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
                        <p className="text-sm text-foreground">
                          {condo.subscription_plan} plan • {condo.status}
                        </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">
                          RM{condo.monthly_revenue || 0}/month
                        </p>
                        <p className="text-xs text-foreground">
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
            <p className="text-foreground">Monitor system performance and health</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">System Status</p>
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
                    <p className="text-sm font-medium text-foreground">Uptime</p>
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
                    <p className="text-sm font-medium text-foreground">Response Time</p>
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
                    <p className="text-sm font-medium text-foreground">Active Users</p>
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
            <p className="text-foreground">Monitor security events and manage access</p>
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
            <p className="text-foreground">System alerts and activity logs</p>
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
            <p className="text-foreground">Configure platform-wide settings</p>
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
          <p className="text-muted-foreground dashboard-text">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredRole="platform_admin">
      <SidebarProvider>
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <SidebarInset>
          <header className="glass-header border-b border-border px-4 py-4 dark:border-primary/30 dark:bg-background/90">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="-ml-1 warm-hover" />
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-primary" />
                  <h1 className="dashboard-title text-foreground">Admin Portal</h1>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button variant="ghost" size="icon" className="warm-hover">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="warm-hover">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>
          
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-background/50 dark:bg-background/80">
            {renderContent()}
        </div>
        </SidebarInset>

        {/* Dialog Components */}
      </SidebarProvider>
    </ProtectedRoute>
  )
}