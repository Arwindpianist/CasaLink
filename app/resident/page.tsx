"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QrCode, Plus, Clock, Users, Calendar, Bell, ChevronRight, ArrowLeft, User, Phone, Mail, Dumbbell, Waves, Share, Download, Trash2, Home, MessageCircle, Megaphone, LogOut } from "lucide-react"
import { motion } from "framer-motion"
import { BottomNavigation } from "@/components/resident/bottom-navigation"
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler"
import { QRGenerator } from "@/components/qr-generator"
import { generateVisitorQR } from "@/lib/qr-utils"
import { visitorsApi } from "@/lib/api"
import { useSearchParams } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/components/auth/auth-provider"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

// Resident page is protected and requires authentication

export default function ResidentApp() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState("home")
  const [qrMode, setQrMode] = useState("list") // "list", "create", "generated"
  const [generatedQR, setGeneratedQR] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Handle URL parameters for deep linking
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['home', 'chat', 'board', 'qr', 'profile'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // QR Form Data
  const [qrFormData, setQrFormData] = useState({
    visitorName: "",
    visitorEmail: "",
    visitorPhone: "",
    numberOfPax: "1",
    purpose: "",
    validFrom: "",
    validUntil: "",
    vehiclePlate: ""
  })

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  // Mock data
  const recentAnnouncements = [
    {
      id: 1,
      title: "Pool Maintenance Schedule",
      content: "The swimming pool will be closed for maintenance from Dec 15-17.",
      time: "2 hours ago",
      priority: "high",
    },
    {
      id: 2,
      title: "New Year Community Event",
      content: "Join us for the New Year celebration at the clubhouse!",
      time: "1 day ago",
      priority: "medium",
    },
  ]

  const activeQRCodes = [
    {
      id: 1,
      type: "Visitor",
      name: "John Doe",
      purpose: "Family Visit",
      validUntil: "Today, 8:00 PM",
      status: "active",
    },
    {
      id: 2,
      type: "Gym",
      name: "Personal Workout",
      purpose: "Fitness Session",
      validUntil: "Today, 10:00 PM",
      status: "active",
    },
  ]

  const recentChats = [
    {
      id: 1,
      name: "Building A Residents",
      lastMessage: "Anyone interested in a potluck dinner?",
      time: "10 min ago",
      unread: 3,
    },
    {
      id: 2,
      name: "Gym Buddies",
      lastMessage: "Morning workout session tomorrow?",
      time: "1 hour ago",
      unread: 0,
    },
  ]

  const handleInputChange = (field: string, value: string) => {
    setQrFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!qrFormData.visitorName.trim()) {
      setError("Visitor name is required")
      return false
    }
    if (!qrFormData.visitorEmail.trim()) {
      setError("Visitor email is required")
      return false
    }
    if (!qrFormData.purpose.trim()) {
      setError("Purpose of visit is required")
      return false
    }
    if (!qrFormData.validFrom || !qrFormData.validUntil) {
      setError("Valid time period is required")
      return false
    }
    
    const startTime = new Date(qrFormData.validFrom)
    const endTime = new Date(qrFormData.validUntil)
    const now = new Date()
    
    if (startTime < now) {
      setError("Valid from time cannot be in the past")
      return false
    }
    if (endTime <= startTime) {
      setError("Valid until time must be after valid from time")
      return false
    }
    
    return true
  }

  const handleGenerateQR = async () => {
    setError("")
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      // Generate QR code data
      const expiresAt = new Date(qrFormData.validUntil)
      const qrData = generateVisitorQR(crypto.randomUUID(), expiresAt)
      
      // Create visitor record in database
      const visitorData = {
        condo_id: "your-condo-id", // This should come from user context/auth
        invited_by_user_id: "your-user-id", // This should come from user context/auth
        name: qrFormData.visitorName,
        phone: qrFormData.visitorPhone,
        email: qrFormData.visitorEmail,
        purpose: `${qrFormData.purpose} (${qrFormData.numberOfPax} ${qrFormData.numberOfPax === "1" ? "person" : "people"})`,
        qr_code: qrData,
        valid_from: new Date(qrFormData.validFrom).toISOString(),
        valid_until: expiresAt.toISOString(),
        status: "pending"
      }

      // Save to database
      const visitor = await visitorsApi.create(visitorData)
      
      setGeneratedQR(qrData)
      setQrMode("generated")
    } catch (err) {
      console.error('Error generating QR:', err)
      setError("Failed to generate QR code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "expired":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'platform_admin': return 'bg-red-500'
      case 'management': return 'bg-blue-500'
      case 'security': return 'bg-green-500'
      case 'resident': return 'bg-purple-500'
      case 'visitor': return 'bg-orange-500'
      case 'moderator': return 'bg-pink-500'
      default: return 'bg-gray-500'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'platform_admin': return 'Platform Admin'
      case 'management': return 'Management'
      case 'security': return 'Security'
      case 'resident': return 'Resident'
      case 'visitor': return 'Visitor'
      case 'moderator': return 'Moderator'
      default: return role
    }
  }

  // Render different content based on active tab and QR mode
  const renderContent = () => {
    if (activeTab === "qr") {
      if (qrMode === "create") {
        return (
          <div className="space-y-6">
            {/* QR Creation Header */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setQrMode("list")}
                className="warm-hover flex-shrink-0"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-bold warm-text-primary">Create Visitor QR Code</h1>
                <p className="warm-text-secondary text-sm sm:text-base">Generate QR code for visitor access</p>
              </div>
            </div>

            {/* QR Creation Form */}
            <Card className="warm-card rounded-2xl">
              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="visitorName">Visitor Name *</Label>
                    <Input
                      id="visitorName"
                      value={qrFormData.visitorName}
                      onChange={(e) => handleInputChange("visitorName", e.target.value)}
                      placeholder="Enter visitor's full name"
                      className="warm-hover"
                    />
                  </div>
                  <div>
                    <Label htmlFor="visitorEmail">Email Address *</Label>
                    <Input
                      id="visitorEmail"
                      type="email"
                      value={qrFormData.visitorEmail}
                      onChange={(e) => handleInputChange("visitorEmail", e.target.value)}
                      placeholder="visitor@email.com"
                      className="warm-hover"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="visitorPhone">Phone Number</Label>
                    <Input
                      id="visitorPhone"
                      value={qrFormData.visitorPhone}
                      onChange={(e) => handleInputChange("visitorPhone", e.target.value)}
                      placeholder="+60 12-345 6789"
                      className="warm-hover"
                    />
                  </div>
                  <div>
                    <Label htmlFor="numberOfPax">Number of People</Label>
                    <Select value={qrFormData.numberOfPax} onValueChange={(value) => handleInputChange("numberOfPax", value)}>
                      <SelectTrigger className="warm-hover">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? "person" : "people"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="purpose">Purpose of Visit *</Label>
                  <Textarea
                    id="purpose"
                    value={qrFormData.purpose}
                    onChange={(e) => handleInputChange("purpose", e.target.value)}
                    placeholder="e.g., Family visit, Business meeting, Delivery, etc."
                    className="warm-hover"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="vehiclePlate">Vehicle Plate Number (Optional)</Label>
                  <Input
                    id="vehiclePlate"
                    value={qrFormData.vehiclePlate}
                    onChange={(e) => handleInputChange("vehiclePlate", e.target.value)}
                    placeholder="ABC 1234"
                    className="warm-hover"
                  />
                </div>

                {/* Time Period */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="font-medium warm-text-primary">Access Time Period</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="validFrom">Valid From *</Label>
                      <Input
                        id="validFrom"
                        type="datetime-local"
                        value={qrFormData.validFrom}
                        onChange={(e) => handleInputChange("validFrom", e.target.value)}
                        className="warm-hover"
                      />
                    </div>
                    <div>
                      <Label htmlFor="validUntil">Valid Until *</Label>
                      <Input
                        id="validUntil"
                        type="datetime-local"
                        value={qrFormData.validUntil}
                        onChange={(e) => handleInputChange("validUntil", e.target.value)}
                        className="warm-hover"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setQrMode("list")}
                    className="warm-hover order-2 sm:order-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleGenerateQR}
                    disabled={loading}
                    className="warm-button order-1 sm:order-2"
                  >
                    {loading ? "Generating..." : "Generate QR Code"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      }

      if (qrMode === "generated") {
        return (
          <div className="space-y-6">
            {/* QR Generated Header */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setQrMode("list")}
                className="warm-hover flex-shrink-0"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-bold warm-text-primary">Visitor QR Code Generated</h1>
                <p className="warm-text-secondary text-sm sm:text-base">Share this QR code with your visitor</p>
              </div>
            </div>

            {/* QR Code Display */}
            <Card className="warm-card rounded-2xl">
              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="text-center">
                  <QRGenerator data={generatedQR!} size={isMobile ? 200 : 250} />
                </div>

                {/* Visitor Details Summary */}
                <div className="space-y-4">
                  <h3 className="font-semibold warm-text-primary">Visit Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="warm-text-secondary">Name:</span>
                        <span className="warm-text-primary">{qrFormData.visitorName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="warm-text-secondary">Email:</span>
                        <span className="warm-text-primary">{qrFormData.visitorEmail}</span>
                      </div>
                      {qrFormData.visitorPhone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="warm-text-secondary">Phone:</span>
                          <span className="warm-text-primary">{qrFormData.visitorPhone}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="warm-text-secondary">People:</span>
                        <span className="warm-text-primary">{qrFormData.numberOfPax}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="warm-text-secondary">Valid:</span>
                        <span className="warm-text-primary">
                          {new Date(qrFormData.validFrom).toLocaleString()} - {new Date(qrFormData.validUntil).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm warm-text-secondary">
                      <strong>Purpose:</strong> {qrFormData.purpose}
                    </p>
                    {qrFormData.vehiclePlate && (
                      <p className="text-sm warm-text-secondary">
                        <strong>Vehicle:</strong> {qrFormData.vehiclePlate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setQrMode("create")
                      setGeneratedQR(null)
                      setQrFormData({
                        visitorName: "",
                        visitorEmail: "",
                        visitorPhone: "",
                        numberOfPax: "1",
                        purpose: "",
                        validFrom: "",
                        validUntil: "",
                        vehiclePlate: ""
                      })
                    }}
                    className="warm-hover order-2 sm:order-1"
                  >
                    Create Another
                  </Button>
                  <Button 
                    onClick={() => setQrMode("list")}
                    className="warm-button order-1 sm:order-2"
                  >
                    Back to QR Management
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      }

      // Default QR list view
      return (
        <div className="space-y-6">
          {/* QR Management Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-foreground">QR Codes</h1>
              <p className="text-muted-foreground text-sm sm:text-base">Manage visitor and amenity access</p>
            </div>
            <Button onClick={() => setQrMode("create")} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Create Visitor QR
            </Button>
          </div>

          {/* Active QR Codes */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Active QR Codes</h2>
            <div className="space-y-4">
              {activeQRCodes.map((qr, index) => (
                <motion.div
                  key={qr.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow rounded-xl">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-foreground">{qr.name}</h3>
                              <p className="text-sm text-muted-foreground">{qr.purpose}</p>
                              <div className="flex items-center mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Valid until {qr.validUntil}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center sm:flex-col sm:items-end gap-2 sm:space-y-2">
                              <Badge variant="secondary" className="text-xs">{qr.type}</Badge>
                              <Badge className={`${getStatusColor(qr.status)} text-xs`}>{qr.status}</Badge>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-4">
                            <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                              <Share className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Share</span>
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                              <Download className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Download</span>
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                              <QrCode className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">View QR</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    if (activeTab === "chat") {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Community Chat</h1>
              <p className="text-muted-foreground">Connect with your neighbors</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>

          <div className="space-y-3">
            {recentChats.map((chat) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: chat.id * 0.1 }}
              >
                <Card className="cursor-pointer hover:shadow-md transition-shadow rounded-xl">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`/abstract-geometric-shapes.png?height=40&width=40&query=${chat.name}`} />
                        <AvatarFallback>
                          <Users className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-foreground truncate">{chat.name}</h3>
                          <span className="text-xs text-muted-foreground">{chat.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground">24 members</span>
                          {chat.unread > 0 && (
                            <Badge variant="default" className="text-xs">
                              {chat.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )
    }

    if (activeTab === "board") {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Community Board</h1>
              <p className="text-muted-foreground">Stay connected with your community</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </div>

          <div className="space-y-4">
            {recentAnnouncements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow rounded-xl">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div>
                          <h3 className="font-medium text-foreground">{announcement.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{announcement.content}</p>
                          <div className="flex items-center text-xs text-muted-foreground mt-2">
                            <Clock className="h-3 w-3 mr-1" />
                            {announcement.time}
                          </div>
                        </div>
                      </div>
                      {announcement.priority === "high" && (
                        <Badge variant="destructive" className="text-xs">
                          Urgent
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )
    }

    if (activeTab === "profile") {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground">Manage your account settings</p>
          </div>

          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user?.avatar_url || "/sarah-profile.jpg"} />
                  <AvatarFallback>
                    {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'SC'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h2 className="text-xl font-semibold text-foreground">{user?.name || 'Sarah Chen'}</h2>
                    {user?.role && (
                      <Badge className={`${getRoleColor(user.role)} text-white text-xs`}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">{user?.email || 'sarah.chen@email.com'}</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.unit_number ? `Unit ${user.unit_number}` : 'Unit 12-A, Tower 1'}
                  </p>
                  {user?.phone && (
                    <p className="text-sm text-muted-foreground">{user.phone}</p>
                  )}
                  {user?.condo_name && (
                    <p className="text-sm text-muted-foreground">{user.condo_name}</p>
                  )}
                </div>
              </div>
              
              <div className="border-t border-border pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Account Actions</h3>
                    <p className="text-sm text-muted-foreground">Switch roles or logout from your account</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      // Import logout from auth provider
                      if (typeof window !== 'undefined') {
                        // Clear auth data
                        localStorage.removeItem('casalink-demo-user')
                        document.cookie = 'casalink-demo-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
                        // Redirect to login
                        window.location.href = '/login'
                      }
                    }}
                    className="warm-hover backdrop-blur-sm hover:backdrop-blur-md hover:shadow-md border-red-200 hover:border-red-300 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    // Default home view
    return (
      <div className="space-y-6">
        {/* Quick Actions */}
        <motion.div {...fadeInUp}>
          <h2 className="text-lg font-semibold warm-text-primary mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card 
              className="cursor-pointer warm-card warm-hover rounded-xl"
              onClick={() => setActiveTab("qr")}
            >
              <CardContent className="p-4 text-center">
                <QrCode className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium warm-text-primary">Create QR Code</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer warm-card warm-hover rounded-xl">
              <CardContent className="p-4 text-center">
                <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium warm-text-primary">Book Amenity</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Recent Announcements */}
        <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold warm-text-primary">Recent Announcements</h2>
            <Button variant="ghost" size="sm" className="warm-hover">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-3">
            {recentAnnouncements.map((announcement) => (
              <Card key={announcement.id} className="cursor-pointer warm-card warm-hover rounded-xl">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium warm-text-primary">{announcement.title}</h3>
                        {announcement.priority === "high" && (
                          <Badge variant="destructive" className="text-xs rustic-error">
                            Urgent
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm warm-text-secondary mb-2">{announcement.content}</p>
                      <div className="flex items-center text-xs warm-text-secondary">
                        <Clock className="h-3 w-3 mr-1" />
                        {announcement.time}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Active QR Codes */}
        <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold warm-text-primary">Active QR Codes</h2>
            <Button variant="ghost" size="sm" className="warm-hover" onClick={() => setActiveTab("qr")}>
              <Plus className="h-4 w-4 mr-1" />
              Create New
            </Button>
          </div>
          <div className="space-y-3">
            {activeQRCodes.map((qr) => (
              <Card key={qr.id} className="cursor-pointer warm-card warm-hover rounded-xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <QrCode className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium warm-text-primary">{qr.name}</h3>
                        <p className="text-sm warm-text-secondary">{qr.purpose}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="mb-1 warm-accent">
                        {qr.type}
                      </Badge>
                      <p className="text-xs warm-text-secondary">Valid until {qr.validUntil}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Recent Chats */}
        <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold warm-text-primary">Recent Chats</h2>
            <Button variant="ghost" size="sm" className="warm-hover" onClick={() => setActiveTab("chat")}>
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-3">
            {recentChats.map((chat) => (
              <Card key={chat.id} className="cursor-pointer warm-card warm-hover rounded-xl" onClick={() => setActiveTab("chat")}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`/abstract-geometric-shapes.png?height=40&width=40&query=${chat.name}`} />
                      <AvatarFallback>
                        <Users className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium warm-text-primary truncate">{chat.name}</h3>
                        <span className="text-xs warm-text-secondary">{chat.time}</span>
                      </div>
                      <p className="text-sm warm-text-secondary truncate">{chat.lastMessage}</p>
                    </div>
                    {chat.unread > 0 && (
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs text-primary-foreground font-medium">{chat.unread}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-20 md:pb-6">
        {/* Header */}
        <div className="glass-header border-b border-border px-4 py-4 sm:py-6 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <img 
                src="/casalink-favicon/favicon-32x32.png" 
                alt="CasaLink Logo" 
                className="h-6 w-6 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h1 className="dashboard-title warm-text-primary">Good morning, {user?.name || 'Sarah'}!</h1>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 mx-6">
              {[
                { id: "home", label: "Home", icon: Home },
                { id: "chat", label: "Chat", icon: MessageCircle },
                { id: "board", label: "Board", icon: Megaphone },
                { id: "qr", label: "QR Codes", icon: QrCode },
                { id: "profile", label: "Profile", icon: User },
              ].map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <Button
                    key={tab.id}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "warm-hover transition-all duration-200",
                      isActive 
                        ? "bg-primary/80 backdrop-blur-md text-primary-foreground shadow-lg border border-primary/20" 
                        : "hover:bg-white/10 hover:backdrop-blur-md hover:shadow-md hover:border-white/20"
                    )}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </Button>
                )
              })}
            </div>
            
            <div className="flex items-center space-x-2 flex-shrink-0">
              <AnimatedThemeToggler />
              <div className="relative">
                <Button variant="ghost" size="icon" className="warm-hover">
                  <Bell className="h-5 w-5" />
                </Button>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

      {/* Dynamic Content */}
      <div className="px-4 py-4 sm:py-6">
        {renderContent()}
      </div>

        {/* Bottom Navigation - Mobile Only */}
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </ProtectedRoute>
  )
}