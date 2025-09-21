"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import { 
  Building2, 
  MapPin, 
  Users, 
  Home, 
  Calendar, 
  DollarSign, 
  BarChart3,
  Edit,
  Trash2,
  Activity,
  TrendingUp,
  AlertTriangle
} from "lucide-react"

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
  users?: any[]
  units?: any[]
}

interface CondominiumStats {
  totalUsers: number
  activeUsers: number
  totalUnits: number
  occupiedUnits: number
  totalAmenities: number
  activeAmenities: number
  recentVisitors: number
  recentBookings: number
  roleBreakdown: {
    management: number
    security: number
    residents: number
    moderators: number
  }
  amenityBreakdown: Record<string, number>
  unitStatusBreakdown: Record<string, number>
}

interface CondominiumDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  condominiumId: string | null
  onEdit: (condominium: Condominium) => void
  onDelete: (condominium: Condominium) => void
}

export function CondominiumDetailsDialog({ 
  open, 
  onOpenChange, 
  condominiumId,
  onEdit,
  onDelete
}: CondominiumDetailsDialogProps) {
  const [condominium, setCondominium] = useState<Condominium | null>(null)
  const [stats, setStats] = useState<CondominiumStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [statsLoading, setStatsLoading] = useState(false)

  // Fetch condominium details
  useEffect(() => {
    if (open && condominiumId) {
      fetchCondominiumDetails()
      fetchCondominiumStats()
    }
  }, [open, condominiumId])

  const fetchCondominiumDetails = async () => {
    if (!condominiumId) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/condominiums/${condominiumId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch condominium details')
      }
      const data = await response.json()
      setCondominium(data.condominium)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load condominium details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchCondominiumStats = async () => {
    if (!condominiumId) return
    
    setStatsLoading(true)
    try {
      const response = await fetch(`/api/condominiums/${condominiumId}/stats?include_analytics=true`)
      if (!response.ok) {
        throw new Error('Failed to fetch condominium stats')
      }
      const data = await response.json()
      setStats(data.stats)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setStatsLoading(false)
    }
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

  if (!open || !condominiumId) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">
                  {loading ? <Skeleton className="h-6 w-48" /> : condominium?.name}
                </DialogTitle>
                <DialogDescription>
                  {loading ? <Skeleton className="h-4 w-32 mt-1" /> : "Condominium details and statistics"}
                </DialogDescription>
              </div>
            </div>
            {condominium && (
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit(condominium)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onDelete(condominium)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : condominium ? (
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Name</h4>
                      <p className="text-lg font-semibold">{condominium.name}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Type</h4>
                      <p className="capitalize">{condominium.type}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Address</h4>
                      <p className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span>{condominium.address}</span>
                      </p>
                      {condominium.city && (
                        <p className="text-sm text-muted-foreground ml-6">
                          {condominium.city}{condominium.state && `, ${condominium.state}`}
                          {condominium.postal_code && ` ${condominium.postal_code}`}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground ml-6">{condominium.country}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Status</h4>
                      <Badge className={getStatusConfig(condominium.status).color}>
                        {getStatusConfig(condominium.status).label}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Subscription Plan</h4>
                      <Badge className={getPlanColor(condominium.subscription_plan)}>
                        {condominium.subscription_plan.charAt(0).toUpperCase() + condominium.subscription_plan.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Monthly Revenue</h4>
                      <p className="text-lg font-semibold text-green-600">
                        RM{condominium.monthly_revenue.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Created</h4>
                      <p className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(condominium.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            {statsLoading ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : stats ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Statistics & Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{stats.totalUsers}</p>
                      <p className="text-xs text-muted-foreground">Total Users</p>
                      <p className="text-xs text-green-600">{stats.activeUsers} active</p>
                    </div>
                    
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <Home className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{stats.totalUnits}</p>
                      <p className="text-xs text-muted-foreground">Total Units</p>
                      <p className="text-xs text-green-600">{stats.occupiedUnits} occupied</p>
                    </div>
                    
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{stats.totalAmenities}</p>
                      <p className="text-xs text-muted-foreground">Amenities</p>
                      <p className="text-xs text-green-600">{stats.activeAmenities} active</p>
                    </div>
                    
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{stats.recentVisitors}</p>
                      <p className="text-xs text-muted-foreground">Recent Visitors</p>
                      <p className="text-xs text-green-600">{stats.recentBookings} bookings</p>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">User Roles Breakdown</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Residents</span>
                          <Badge variant="outline">{stats.roleBreakdown.residents}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Management</span>
                          <Badge variant="outline">{stats.roleBreakdown.management}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Security</span>
                          <Badge variant="outline">{stats.roleBreakdown.security}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Moderators</span>
                          <Badge variant="outline">{stats.roleBreakdown.moderators}</Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Unit Status Breakdown</h4>
                      <div className="space-y-2">
                        {Object.entries(stats.unitStatusBreakdown).map(([status, count]) => (
                          <div key={status} className="flex justify-between items-center">
                            <span className="text-sm capitalize">{status}</span>
                            <Badge variant="outline">{count}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
