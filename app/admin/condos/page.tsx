"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
} from "lucide-react"
import { motion } from "framer-motion"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"

export default function CondoManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  const condominiums = [
    {
      id: 1,
      name: "Pavilion Residences",
      location: "Kuala Lumpur",
      address: "168 Jalan Bukit Bintang, 55100 KL",
      units: 240,
      activeUsers: 186,
      plan: "Professional",
      status: "active",
      joinDate: "2024-01-15",
      monthlyRevenue: 1497,
      lastActivity: "2 hours ago",
      usage: {
        qrScans: 1247,
        chatMessages: 3421,
        announcements: 12,
      },
      avatar: "/pavilion-residences.jpg",
    },
    {
      id: 2,
      name: "KLCC Suites",
      location: "Kuala Lumpur",
      address: "50 Jalan Ampang, 50450 KL",
      units: 180,
      activeUsers: 142,
      plan: "Enterprise",
      status: "active",
      joinDate: "2024-02-03",
      monthlyRevenue: 2995,
      lastActivity: "1 hour ago",
      usage: {
        qrScans: 892,
        chatMessages: 2156,
        announcements: 8,
      },
      avatar: "/klcc-suites.jpg",
    },
    {
      id: 3,
      name: "Mont Kiara Heights",
      location: "Mont Kiara",
      address: "2 Jalan Kiara, Mont Kiara, 50480 KL",
      units: 320,
      activeUsers: 298,
      plan: "Enterprise",
      status: "active",
      joinDate: "2024-01-28",
      monthlyRevenue: 2995,
      lastActivity: "30 min ago",
      usage: {
        qrScans: 1876,
        chatMessages: 4532,
        announcements: 15,
      },
      avatar: "/mont-kiara-heights.jpg",
    },
    {
      id: 4,
      name: "Tropicana Gardens",
      location: "Petaling Jaya",
      address: "2A Jalan PJU 3, 47410 PJ",
      units: 150,
      activeUsers: 89,
      plan: "Starter",
      status: "trial",
      joinDate: "2024-03-10",
      monthlyRevenue: 0,
      lastActivity: "5 hours ago",
      usage: {
        qrScans: 234,
        chatMessages: 567,
        announcements: 3,
      },
      avatar: "/tropicana-gardens.jpg",
    },
  ]

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return { color: "bg-green-100 text-green-800 border-green-200", label: "Active" }
      case "trial":
        return { color: "bg-blue-100 text-blue-800 border-blue-200", label: "Trial" }
      case "suspended":
        return { color: "bg-red-100 text-red-800 border-red-200", label: "Suspended" }
      case "pending":
        return { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Pending" }
      default:
        return { color: "bg-gray-100 text-gray-800 border-gray-200", label: "Unknown" }
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "Enterprise":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Professional":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Starter":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
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
                <p className="text-muted-foreground">Manage all registered properties and their configurations</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Condo
              </Button>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {/* Search and Overview */}
          <motion.div className="mb-8 space-y-4" {...fadeInUp}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search condominiums by name, location, or plan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">{condominiums.length}</p>
                      <p className="text-xs text-muted-foreground">Total Properties</p>
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
                        {condominiums.reduce((sum, condo) => sum + condo.activeUsers, 0)}
                      </p>
                      <p className="text-xs text-muted-foreground">Total Users</p>
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
                        RM{condominiums.reduce((sum, condo) => sum + condo.monthlyRevenue, 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Monthly Revenue</p>
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
                        {condominiums.filter((c) => c.status === "active").length}
                      </p>
                      <p className="text-xs text-muted-foreground">Active Properties</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Condominiums List */}
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
            <div className="space-y-6">
              {condominiums.map((condo) => {
                const statusConfig = getStatusConfig(condo.status)
                const planColor = getPlanColor(condo.plan)
                return (
                  <Card key={condo.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={condo.avatar || "/placeholder.svg"} />
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
                              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                                <span>{condo.units} units</span>
                                <span>•</span>
                                <span>{condo.activeUsers} active users</span>
                                <span>•</span>
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Joined {condo.joinDate}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <div className="flex items-center space-x-2">
                                <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                                <Badge className={planColor}>{condo.plan}</Badge>
                              </div>
                              <p className="text-lg font-bold text-foreground">
                                {condo.monthlyRevenue > 0 ? `RM${condo.monthlyRevenue}/month` : "Trial"}
                              </p>
                              <p className="text-xs text-muted-foreground">Last active: {condo.lastActivity}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mt-4 p-4 bg-muted/30 rounded-lg">
                            <div className="text-center">
                              <p className="text-lg font-semibold text-foreground">{condo.usage.qrScans}</p>
                              <p className="text-xs text-muted-foreground">QR Scans</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-semibold text-foreground">{condo.usage.chatMessages}</p>
                              <p className="text-xs text-muted-foreground">Chat Messages</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-semibold text-foreground">{condo.usage.announcements}</p>
                              <p className="text-xs text-muted-foreground">Announcements</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 mt-4">
                            <Button size="sm">
                              <BarChart3 className="h-4 w-4 mr-1" />
                              View Analytics
                            </Button>
                            <Button size="sm" variant="outline">
                              <Settings className="h-4 w-4 mr-1" />
                              Configure
                            </Button>
                            <Button size="sm" variant="outline">
                              <Users className="h-4 w-4 mr-1" />
                              Manage Users
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
                )
              })}
            </div>
          </motion.div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
