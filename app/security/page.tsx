"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Phone,
  Car,
  Building2,
  Activity,
  TrendingUp,
  Calendar,
} from "lucide-react"
import { motion } from "framer-motion"
import { SecuritySidebar } from "@/components/security/security-sidebar"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

export default function SecurityDashboard() {

  const pendingVisitors = [
    {
      id: "VIS-2024-001",
      visitorName: "John Doe",
      hostName: "Sarah Chen",
      hostUnit: "12-A, Tower 1",
      purpose: "Family Visit",
      arrivalTime: "2:30 PM",
      phone: "+60 12-345 6789",
      vehicle: "ABC 1234",
      status: "pending",
      avatar: "/john-doe-visitor.jpg",
    },
    {
      id: "VIS-2024-002",
      visitorName: "Mike Wilson",
      hostName: "Alice Tan",
      hostUnit: "8-B, Tower 2",
      purpose: "Business Meeting",
      arrivalTime: "3:15 PM",
      phone: "+60 11-987 6543",
      vehicle: null,
      status: "pending",
      avatar: "/mike-wilson-visitor.jpg",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "visitor_approved",
      message: "Visitor Lisa Wong approved for Unit 15-C",
      time: "5 min ago",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      id: 2,
      type: "amenity_access",
      message: "Gym access granted to resident from Unit 12-A",
      time: "12 min ago",
      icon: Activity,
      color: "text-blue-600",
    },
    {
      id: 3,
      type: "visitor_denied",
      message: "Visitor access denied - Host not available",
      time: "25 min ago",
      icon: XCircle,
      color: "text-red-600",
    },
    {
      id: 4,
      type: "announcement",
      message: "New announcement posted to community board",
      time: "1 hour ago",
      icon: AlertTriangle,
      color: "text-orange-600",
    },
  ]

  const todayStats = {
    totalVisitors: 24,
    approved: 18,
    denied: 3,
    pending: 3,
    amenityAccess: 12,
  }

  const handleApproveVisitor = (visitorId: string) => {
    // Handle visitor approval
    console.log("Approving visitor:", visitorId)
  }

  const handleDenyVisitor = (visitorId: string) => {
    // Handle visitor denial
    console.log("Denying visitor:", visitorId)
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  return (
    <SidebarProvider>
      <SecuritySidebar />
      <SidebarInset>
        {/* Header */}
        <header className="warm-card border-b border-border px-4 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <div>
                <h1 className="dashboard-title warm-text-primary">Security Dashboard</h1>
                <p className="warm-text-secondary">Monitor and manage building access</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="sage-success">
                <Activity className="h-3 w-3 mr-1" />
                Online
              </Badge>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 space-y-8">
          {/* Stats Overview */}
          <motion.div {...fadeInUp}>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <Card className="warm-card warm-hover">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold warm-text-primary">{todayStats.totalVisitors}</p>
                      <p className="text-xs warm-text-secondary">Total Visitors</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="warm-card warm-hover">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold warm-text-primary">{todayStats.approved}</p>
                      <p className="text-xs warm-text-secondary">Approved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="warm-card warm-hover">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold warm-text-primary">{todayStats.pending}</p>
                      <p className="text-xs warm-text-secondary">Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="warm-card warm-hover">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold warm-text-primary">{todayStats.denied}</p>
                      <p className="text-xs warm-text-secondary">Denied</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="warm-card warm-hover">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold warm-text-primary">{todayStats.amenityAccess}</p>
                      <p className="text-xs warm-text-secondary">Amenity Access</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pending Visitors */}
            <motion.div className="lg:col-span-2" {...fadeInUp} transition={{ delay: 0.1 }}>
              <Card className="warm-card">
                <CardHeader>
                  <CardTitle className="flex items-center warm-text-primary">
                    <Clock className="h-5 w-5 mr-2 text-primary" />
                    Pending Visitor Approvals
                  </CardTitle>
                  <CardDescription className="warm-text-secondary">Review and approve visitor access requests</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pendingVisitors.map((visitor) => (
                    <div key={visitor.id} className="border border-border rounded-lg p-4 warm-hover">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={visitor.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {visitor.visitorName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium warm-text-primary">{visitor.visitorName}</h3>
                              <p className="text-sm warm-text-secondary">
                                Visiting {visitor.hostName} • {visitor.hostUnit}
                              </p>
                              <p className="text-sm warm-text-secondary">{visitor.purpose}</p>
                            </div>
                            <Badge variant="outline" className="amber-warning">
                              {visitor.arrivalTime}
                            </Badge>
                          </div>

                          <div className="flex items-center space-x-4 mt-2 text-xs warm-text-secondary">
                            <span className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {visitor.phone}
                            </span>
                            {visitor.vehicle && (
                              <span className="flex items-center">
                                <Car className="h-3 w-3 mr-1" />
                                {visitor.vehicle}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-2 mt-4">
                            <Button size="sm" onClick={() => handleApproveVisitor(visitor.id)} className="warm-button">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDenyVisitor(visitor.id)} className="warm-hover">
                              <XCircle className="h-4 w-4 mr-1" />
                              Deny
                            </Button>
                            <Button size="sm" variant="ghost" className="warm-hover">
                              <Eye className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <Card className="warm-card">
                <CardHeader>
                  <CardTitle className="flex items-center warm-text-primary">
                    <Activity className="h-5 w-5 mr-2 text-primary" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="warm-text-secondary">Latest security events and actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity) => {
                    const Icon = activity.icon
                    return (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                          <Icon className={`h-4 w-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm warm-text-primary">{activity.message}</p>
                          <p className="text-xs warm-text-secondary">{activity.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
            <Card className="warm-card">
              <CardHeader>
                <CardTitle className="warm-text-primary">Quick Actions</CardTitle>
                <CardDescription className="warm-text-secondary">Common security management tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col bg-transparent warm-hover">
                    <Users className="h-6 w-6 mb-2" />
                    <span className="text-sm">View All Visitors</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent warm-hover">
                    <Building2 className="h-6 w-6 mb-2" />
                    <span className="text-sm">Resident Directory</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent warm-hover">
                    <Calendar className="h-6 w-6 mb-2" />
                    <span className="text-sm">Amenity Bookings</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent warm-hover">
                    <TrendingUp className="h-6 w-6 mb-2" />
                    <span className="text-sm">Generate Report</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
