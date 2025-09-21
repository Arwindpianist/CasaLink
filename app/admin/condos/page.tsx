"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Building2,
  Search,
  Filter,
  Plus,
  Users,
  Activity,
  DollarSign,
  Settings,
  BarChart3,
  MapPin,
  Calendar,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
} from "lucide-react"
import { motion } from "framer-motion"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { CondominiumFormDialog } from "@/components/admin/condominium-form-dialog"
import { CondominiumDetailsDialog } from "@/components/admin/condominium-details-dialog"
import { CondominiumDeleteDialog } from "@/components/admin/condominium-delete-dialog"
import { toast } from "@/hooks/use-toast"
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

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function CondoManagement() {
  const [condominiums, setCondominiums] = useState<Condominium[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all")
  
  // Dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCondominium, setSelectedCondominium] = useState<Condominium | null>(null)

  // Fetch condominiums data
  const fetchCondominiums = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })
      
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter)
      if (planFilter && planFilter !== 'all') params.append('plan', planFilter)

      const response = await fetch(`/api/condominiums?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch condominiums')
      }
      
      const data = await response.json()
      setCondominiums(data.condominiums)
      setPagination(data.pagination)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load condominiums",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchCondominiums()
  }, [pagination.page, searchTerm, statusFilter, planFilter])

  // CRUD operations
  const handleCreate = () => {
    setSelectedCondominium(null)
    setFormDialogOpen(true)
  }

  const handleEdit = (condominium: Condominium) => {
    setSelectedCondominium(condominium)
    setFormDialogOpen(true)
  }

  const handleView = (condominium: Condominium) => {
    setSelectedCondominium(condominium)
    setDetailsDialogOpen(true)
  }

  const handleDelete = (condominium: Condominium) => {
    setSelectedCondominium(condominium)
    setDeleteDialogOpen(true)
  }

  const handleSuccess = () => {
    fetchCondominiums()
  }

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

  const getTotalUsers = () => {
    return condominiums.reduce((sum, condo) => {
      const userCount = condo.users?.[0]?.count || 0
      return sum + userCount
    }, 0)
  }

  const getTotalRevenue = () => {
    return condominiums.reduce((sum, condo) => sum + (condo.monthly_revenue || 0), 0)
  }

  const getActiveCondominiums = () => {
    return condominiums.filter(condo => condo.status === 'active').length
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="bg-card border-b border-border px-4 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Condominium Management</h1>
                <p className="text-foreground">Manage all registered properties and their configurations</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={fetchCondominiums}
                disabled={loading}
                className="hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button size="sm" onClick={handleCreate} className="hover:bg-primary/90 hover:shadow-md transition-all duration-200">
                <Plus className="h-4 w-4 mr-2" />
                Add Condo
              </Button>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {/* Search and Overview */}
          <motion.div className="mb-8 space-y-4" {...fadeInUp}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground" />
                <Input
                  placeholder="Search condominiums by name, location, or plan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={planFilter} onValueChange={setPlanFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {loading ? <Skeleton className="h-6 w-8" /> : pagination.total}
                      </p>
                      <p className="text-xs text-foreground">Total Properties</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {loading ? <Skeleton className="h-6 w-12" /> : getTotalUsers().toLocaleString()}
                      </p>
                      <p className="text-xs text-foreground">Total Users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {loading ? <Skeleton className="h-6 w-16" /> : `RM${getTotalRevenue().toLocaleString()}`}
                      </p>
                      <p className="text-xs text-foreground">Monthly Revenue</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {loading ? <Skeleton className="h-6 w-8" /> : getActiveCondominiums()}
                      </p>
                      <p className="text-xs text-foreground">Active Properties</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Condominiums List */}
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
            {loading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-6 w-48" />
                          <Skeleton className="h-4 w-64" />
                          <Skeleton className="h-4 w-32" />
                          <div className="flex gap-2 mt-4">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-8 w-24" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : condominiums.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Building2 className="h-12 w-12 text-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No condominiums found</h3>
                  <p className="text-foreground mb-4">
                    {searchTerm || (statusFilter && statusFilter !== 'all') || (planFilter && planFilter !== 'all')
                      ? "Try adjusting your search filters"
                      : "Get started by adding your first condominium"
                    }
                  </p>
                  <Button onClick={handleCreate} className="hover:bg-primary/90 hover:shadow-md transition-all duration-200">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Condominium
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {condominiums.map((condo) => {
                  const statusConfig = getStatusConfig(condo.status)
                  const planColor = getPlanColor(condo.subscription_plan)
                  const userCount = condo.users?.[0]?.count || 0
                  const unitCount = condo.units?.[0]?.count || 0
                  
                  return (
                    <Card key={condo.id}>
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
                                  <MapPin className="h-4 w-4 text-foreground" />
                                  <p className="text-sm text-foreground">{condo.address}</p>
                                </div>
                                {condo.city && (
                                  <p className="text-sm text-foreground ml-6">
                                    {condo.city}{condo.state && `, ${condo.state}`} {condo.postal_code}
                                  </p>
                                )}
                                <div className="flex items-center space-x-4 mt-2 text-sm text-foreground">
                                  <span>{unitCount} units</span>
                                  <span>•</span>
                                  <span>{userCount} users</span>
                                  <span>•</span>
                                  <span className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    Joined {new Date(condo.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col items-end space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                                  <Badge className={planColor}>
                                    {condo.subscription_plan.charAt(0).toUpperCase() + condo.subscription_plan.slice(1)}
                                  </Badge>
                                </div>
                                <p className="text-lg font-bold text-foreground">
                                  {condo.monthly_revenue > 0 ? `RM${condo.monthly_revenue}/month` : "Trial"}
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
                                className="hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEdit(condo)}
                                className="hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDelete(condo)}
                                className="hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                              {condo.status === "trial" && (
                                <Button size="sm" variant="outline" className="hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                                  <TrendingUp className="h-4 w-4 mr-1" />
                                  Upgrade Plan
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <p className="text-sm text-foreground">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} condominiums
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>

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
      </SidebarInset>
    </SidebarProvider>
  )
}
