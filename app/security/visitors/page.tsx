"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Search, Filter, CheckCircle, XCircle, Clock, Eye, Phone, Car, Calendar, Download } from "lucide-react"
import { motion } from "framer-motion"
import { SecuritySidebar } from "@/components/security/security-sidebar"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"

export default function VisitorManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  const visitors = {
    pending: [
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
    ],
    approved: [
      {
        id: "VIS-2024-003",
        visitorName: "Lisa Wong",
        hostName: "David Lee",
        hostUnit: "15-C, Tower 1",
        purpose: "Social Visit",
        arrivalTime: "1:45 PM",
        approvedTime: "1:50 PM",
        phone: "+60 13-456 7890",
        vehicle: "DEF 5678",
        status: "approved",
        avatar: "/lisa-wong-visitor.jpg",
      },
    ],
    completed: [
      {
        id: "VIS-2024-004",
        visitorName: "Robert Kim",
        hostName: "Emma Chen",
        hostUnit: "9-A, Tower 2",
        purpose: "Delivery",
        arrivalTime: "11:30 AM",
        departureTime: "12:15 PM",
        phone: "+60 14-567 8901",
        vehicle: "GHI 9012",
        status: "completed",
        avatar: "/robert-kim-visitor.jpg",
      },
    ],
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Pending" }
      case "approved":
        return { color: "bg-green-100 text-green-800 border-green-200", label: "Approved" }
      case "completed":
        return { color: "bg-blue-100 text-blue-800 border-blue-200", label: "Completed" }
      case "denied":
        return { color: "bg-red-100 text-red-800 border-red-200", label: "Denied" }
      default:
        return { color: "bg-gray-100 text-gray-800 border-gray-200", label: "Unknown" }
    }
  }

  const handleApprove = (visitorId: string) => {
    console.log("Approving visitor:", visitorId)
  }

  const handleDeny = (visitorId: string) => {
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
        <header className="bg-card border-b border-border px-4 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Visitor Management</h1>
                <p className="text-muted-foreground">Review and manage all visitor access requests</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {/* Search and Stats */}
          <motion.div className="mb-8 space-y-4" {...fadeInUp}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search visitors by name, host, or unit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">{visitors.pending.length}</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">{visitors.approved.length}</p>
                      <p className="text-xs text-muted-foreground">Approved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">{visitors.completed.length}</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {visitors.pending.length + visitors.approved.length + visitors.completed.length}
                      </p>
                      <p className="text-xs text-muted-foreground">Today Total</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Visitor Tabs */}
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending">Pending ({visitors.pending.length})</TabsTrigger>
                <TabsTrigger value="approved">Approved ({visitors.approved.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({visitors.completed.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4 mt-6">
                {visitors.pending.map((visitor) => {
                  const statusConfig = getStatusConfig(visitor.status)
                  return (
                    <Card key={visitor.id}>
                      <CardContent className="p-6">
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
                                <h3 className="font-medium text-foreground">{visitor.visitorName}</h3>
                                <p className="text-sm text-muted-foreground">
                                  Visiting {visitor.hostName} • {visitor.hostUnit}
                                </p>
                                <p className="text-sm text-muted-foreground">{visitor.purpose}</p>
                              </div>
                              <div className="flex flex-col items-end space-y-2">
                                <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                                <span className="text-xs text-muted-foreground">Arrived: {visitor.arrivalTime}</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
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
                              <Button size="sm" onClick={() => handleApprove(visitor.id)}>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDeny(visitor.id)}>
                                <XCircle className="h-4 w-4 mr-1" />
                                Deny
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </TabsContent>

              <TabsContent value="approved" className="space-y-4 mt-6">
                {visitors.approved.map((visitor) => {
                  const statusConfig = getStatusConfig(visitor.status)
                  return (
                    <Card key={visitor.id}>
                      <CardContent className="p-6">
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
                                <h3 className="font-medium text-foreground">{visitor.visitorName}</h3>
                                <p className="text-sm text-muted-foreground">
                                  Visiting {visitor.hostName} • {visitor.hostUnit}
                                </p>
                                <p className="text-sm text-muted-foreground">{visitor.purpose}</p>
                              </div>
                              <div className="flex flex-col items-end space-y-2">
                                <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                                <span className="text-xs text-muted-foreground">Approved: {visitor.approvedTime}</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
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
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                View QR Code
                              </Button>
                              <Button size="sm" variant="ghost">
                                Mark as Completed
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </TabsContent>

              <TabsContent value="completed" className="space-y-4 mt-6">
                {visitors.completed.map((visitor) => {
                  const statusConfig = getStatusConfig(visitor.status)
                  return (
                    <Card key={visitor.id} className="opacity-75">
                      <CardContent className="p-6">
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
                                <h3 className="font-medium text-foreground">{visitor.visitorName}</h3>
                                <p className="text-sm text-muted-foreground">
                                  Visited {visitor.hostName} • {visitor.hostUnit}
                                </p>
                                <p className="text-sm text-muted-foreground">{visitor.purpose}</p>
                              </div>
                              <div className="flex flex-col items-end space-y-2">
                                <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                                <span className="text-xs text-muted-foreground">
                                  {visitor.arrivalTime} - {visitor.departureTime}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
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
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4 mr-1" />
                                View Log
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
