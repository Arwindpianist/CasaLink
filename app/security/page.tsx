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
  QrCode,
  Scan,
  UserCheck,
  Shield,
  LogOut,
} from "lucide-react"
import { motion } from "framer-motion"
import { SecuritySidebar } from "@/components/security/security-sidebar"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { RoleNavigation } from "@/components/navigation/role-navigation"
import { useIsMobile } from "@/hooks/use-mobile"

export default function SecurityDashboard() {
  const isMobile = useIsMobile()
  const [scannedVisitor, setScannedVisitor] = useState<any>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)

  // Mock visitor data for scanning
  const mockVisitorData = {
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
    hostPhone: "+60 12-987 6543",
  }

  const handleScan = () => {
    setIsScanning(true)
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false)
      setScanResult(mockVisitorData)
    }, 2000)
  }

  const handleApprove = () => {
    setScanResult({ ...scanResult, status: "approved" })
    setShowConfirmation(true)
    setTimeout(() => {
      setScanResult(null)
      setShowConfirmation(false)
    }, 3000)
  }

  const handleDeny = () => {
    setScanResult({ ...scanResult, status: "denied" })
    setShowConfirmation(true)
    setTimeout(() => {
      setScanResult(null)
      setShowConfirmation(false)
    }, 3000)
  }

  const handleCallResident = () => {
    // In a real app, this would initiate a call
    alert(`Calling ${mockVisitorData.hostName} at ${mockVisitorData.hostPhone}`)
  }

  // Mobile Interface Component
  const MobileSecurityInterface = () => {
    const fadeInUp = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6 },
    }

    if (showConfirmation) {
      return (
        <div className="min-h-screen bg-background p-4">
          <div className="max-w-md mx-auto space-y-6">
            {/* Header */}
            <motion.div className="text-center py-6" {...fadeInUp}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-8 w-8 text-primary" />
                  <span className="text-2xl font-bold text-foreground font-premium">Security</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem('casalink-demo-user')
                      document.cookie = 'casalink-demo-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
                      window.location.href = '/login'
                    }
                  }}
                  className="warm-hover backdrop-blur-sm hover:backdrop-blur-md hover:shadow-md border-red-200 hover:border-red-300 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
              <h1 className="text-xl font-semibold warm-text-primary">
                {scanResult?.status === "approved" ? "Access Approved" : "Access Denied"}
              </h1>
            </motion.div>

            {/* Confirmation Card */}
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
              <Card className="warm-card border-2 border-border">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center mx-auto mb-4">
                    {scanResult?.status === "approved" ? (
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-600" />
                    )}
                  </div>
                  <Badge className={scanResult?.status === "approved" ? "sage-success mb-3" : "rustic-error mb-3"}>
                    {scanResult?.status === "approved" ? "Access Granted" : "Access Denied"}
                  </Badge>
                  <p className="warm-text-secondary text-sm">
                    {scanResult?.status === "approved" 
                      ? "Visitor may proceed to the building" 
                      : "Visitor access has been denied"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      )
    }

    if (scanResult) {
      return (
        <div className="min-h-screen bg-background p-4">
          <div className="max-w-md mx-auto space-y-6">
            {/* Header */}
            <motion.div className="text-center py-6" {...fadeInUp}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-8 w-8 text-primary" />
                  <span className="text-2xl font-bold text-foreground font-premium">Security</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem('casalink-demo-user')
                      document.cookie = 'casalink-demo-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
                      window.location.href = '/login'
                    }
                  }}
                  className="warm-hover backdrop-blur-sm hover:backdrop-blur-md hover:shadow-md border-red-200 hover:border-red-300 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
              <h1 className="text-xl font-semibold warm-text-primary">Visitor Details</h1>
            </motion.div>

            {/* Visitor Information */}
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
              <Card className="warm-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={scanResult.avatar} />
                      <AvatarFallback>
                        {scanResult.visitorName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-foreground">{scanResult.visitorName}</h2>
                      <p className="text-muted-foreground">Visitor ID: {scanResult.id}</p>
                      <Badge className="amber-warning mt-2">Pending Approval</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <UserCheck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{scanResult.hostName}</p>
                        <p className="text-sm text-muted-foreground">Host - {scanResult.hostUnit}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                        <Clock className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{scanResult.purpose}</p>
                        <p className="text-sm text-muted-foreground">Purpose of visit</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                        <Car className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{scanResult.vehicle || "No vehicle"}</p>
                        <p className="text-sm text-muted-foreground">Vehicle number</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <div className="space-y-3">
                <Button 
                  className="w-full warm-button" 
                  onClick={handleApprove}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Access
                </Button>
                
                <Button 
                  className="w-full bg-transparent warm-hover" 
                  variant="outline"
                  onClick={handleDeny}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Deny Access
                </Button>

                <Button 
                  className="w-full bg-transparent warm-hover" 
                  variant="outline"
                  onClick={handleCallResident}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Resident ({scanResult.hostName})
                </Button>

                <Button 
                  className="w-full bg-transparent warm-hover" 
                  variant="outline"
                  onClick={() => setScanResult(null)}
                >
                  <Scan className="h-4 w-4 mr-2" />
                  Scan Another QR Code
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto space-y-6">
          {/* Header */}
          <motion.div className="text-center py-6" {...fadeInUp}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-foreground font-premium">Security</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('casalink-demo-user')
                    document.cookie = 'casalink-demo-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
                    window.location.href = '/login'
                  }
                }}
                className="warm-hover backdrop-blur-sm hover:backdrop-blur-md hover:shadow-md border-red-200 hover:border-red-300 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
            <h1 className="text-xl font-semibold warm-text-primary">QR Code Scanner</h1>
            <p className="warm-text-secondary">Scan visitor QR codes for access control</p>
          </motion.div>

          {/* Scanner Interface */}
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
            <Card className="warm-card">
              <CardContent className="p-8 text-center">
                <div className="w-40 h-40 bg-card/80 rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-primary/30">
                  {isScanning ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-3"></div>
                      <QrCode className="h-12 w-12 text-primary" />
                    </div>
                  ) : (
                    <QrCode className="h-20 w-20 text-primary" />
                  )}
                </div>
                
                <h3 className="font-semibold text-foreground mb-3 text-lg">
                  {isScanning ? "Scanning QR Code..." : "Ready to Scan"}
                </h3>
                <p className="text-sm text-muted-foreground mb-8">
                  {isScanning 
                    ? "Please wait while we process the QR code" 
                    : "Position the visitor's QR code within the camera view"}
                </p>

                <Button 
                  className="w-full warm-button" 
                  onClick={handleScan}
                  disabled={isScanning}
                  size="lg"
                >
                  <Scan className="h-5 w-5 mr-2" />
                  {isScanning ? "Scanning..." : "Start Scanning"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Enhanced Quick Stats */}
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
            <Card className="warm-card backdrop-blur-sm hover:backdrop-blur-md hover:shadow-md border border-border/50">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-3xl font-bold text-primary">24</p>
                    <p className="text-sm text-muted-foreground font-medium">Today's Visitors</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-green-600">18</p>
                    <p className="text-sm text-muted-foreground font-medium">Approved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

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

  const simulateQRScan = () => {
    setIsScanning(true)
    // Simulate QR code scan
    setTimeout(() => {
      const mockScannedVisitor = {
        id: "VIS-2024-001",
        visitorName: "John Doe",
        hostName: "Sarah Chen",
        hostUnit: "12-A, Tower 1",
        purpose: "Family Visit",
        phone: "+60 12-345 6789",
        qrCode: "QR-VIS-001",
        status: "pending",
        scannedAt: new Date().toLocaleTimeString()
      }
      setScannedVisitor(mockScannedVisitor)
      setIsScanning(false)
      setShowConfirmation(true)
    }, 2000)
  }

  const handleConfirmWithResident = (approved: boolean) => {
    // Simulate resident confirmation
    console.log(`Resident ${approved ? 'approved' : 'denied'} visitor:`, scannedVisitor.id)
    setShowConfirmation(false)
    setScannedVisitor(null)
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  // Show mobile interface for mobile/tablet, desktop interface for laptop/desktop
  if (isMobile) {
    return (
      <ProtectedRoute requiredRole="security">
        <MobileSecurityInterface />
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole="security">
      <SidebarProvider>
        <SecuritySidebar />
        <SidebarInset>
        {/* Enhanced Header with Glass Effect */}
        <header className="glass-header border-b border-border/50 px-4 lg:px-8 py-6 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="-ml-1 warm-hover backdrop-blur-sm hover:backdrop-blur-md hover:shadow-md" />
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="dashboard-title warm-text-primary">Security Dashboard</h1>
                  <p className="warm-text-secondary">Monitor and manage building access</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="sage-success backdrop-blur-sm">
                <Activity className="h-3 w-3 mr-1" />
                Online
              </Badge>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 space-y-8">
          {/* Enhanced Stats Overview with Glass Effects */}
          <motion.div {...fadeInUp}>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <Card className="warm-card warm-hover backdrop-blur-sm hover:backdrop-blur-md hover:shadow-md border border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold warm-text-primary">{todayStats.totalVisitors}</p>
                      <p className="text-xs warm-text-secondary">Total Visitors</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="warm-card warm-hover backdrop-blur-sm hover:backdrop-blur-md hover:shadow-md border border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold warm-text-primary">{todayStats.approved}</p>
                      <p className="text-xs warm-text-secondary">Approved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="warm-card warm-hover backdrop-blur-sm hover:backdrop-blur-md hover:shadow-md border border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold warm-text-primary">{todayStats.pending}</p>
                      <p className="text-xs warm-text-secondary">Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="warm-card warm-hover backdrop-blur-sm hover:backdrop-blur-md hover:shadow-md border border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <XCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold warm-text-primary">{todayStats.denied}</p>
                      <p className="text-xs warm-text-secondary">Denied</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="warm-card warm-hover backdrop-blur-sm hover:backdrop-blur-md hover:shadow-md border border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Activity className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold warm-text-primary">{todayStats.amenityAccess}</p>
                      <p className="text-xs warm-text-secondary">Amenity Access</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* QR Code Scanner */}
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
            <Card className="warm-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <QrCode className="h-5 w-5 text-primary" />
                  </div>
                  <span>QR Code Scanner</span>
                </CardTitle>
                <CardDescription>
                  Scan visitor QR codes at the entrance for approval
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {!scannedVisitor && !isScanning && (
                    <div className="text-center py-8">
                      <div className="w-32 h-32 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border-2 border-dashed border-primary/30">
                        <Scan className="h-16 w-16 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">Ready to Scan</h3>
                      <p className="warm-text-secondary mb-6">
                        Position the visitor's QR code within the camera view
                      </p>
                      <Button 
                        onClick={simulateQRScan}
                        className="warm-button"
                        size="lg"
                      >
                        <Scan className="h-4 w-4 mr-2" />
                        Start Scanning
                      </Button>
                    </div>
                  )}

                  {isScanning && (
                    <div className="text-center py-8">
                      <div className="w-32 h-32 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border-2 border-dashed border-primary/30 animate-pulse">
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-2"></div>
                          <Scan className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">Scanning QR Code...</h3>
                      <p className="warm-text-secondary mb-6">
                        Please wait while we process the QR code
                      </p>
                      <div className="w-full bg-secondary/20 rounded-full h-3">
                        <div className="bg-primary h-3 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  )}

                  {scannedVisitor && showConfirmation && (
                    <div className="space-y-6">
                      <div className="bg-green-50/80 border border-green-200 rounded-xl p-6 backdrop-blur-sm">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <UserCheck className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold warm-text-primary">QR Code Scanned Successfully</h3>
                            <p className="text-sm warm-text-secondary">Scanned at {scannedVisitor.scannedAt}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-card/80 border border-border/50 rounded-xl p-6 backdrop-blur-sm">
                        <h4 className="font-semibold warm-text-primary mb-4 flex items-center space-x-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Eye className="h-4 w-4 text-primary" />
                          </div>
                          <span>Visitor Details</span>
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between items-center py-2 border-b border-border/30">
                            <span className="warm-text-secondary font-medium">Name:</span>
                            <span className="warm-text-primary font-semibold">{scannedVisitor.visitorName}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-border/30">
                            <span className="warm-text-secondary font-medium">Host:</span>
                            <span className="warm-text-primary font-semibold">{scannedVisitor.hostName}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-border/30">
                            <span className="warm-text-secondary font-medium">Unit:</span>
                            <span className="warm-text-primary font-semibold">{scannedVisitor.hostUnit}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-border/30">
                            <span className="warm-text-secondary font-medium">Purpose:</span>
                            <span className="warm-text-primary font-semibold">{scannedVisitor.purpose}</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="warm-text-secondary font-medium">QR Code:</span>
                            <span className="warm-text-primary font-mono bg-primary/10 px-2 py-1 rounded">{scannedVisitor.qrCode}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-6 backdrop-blur-sm">
                        <h4 className="font-semibold warm-text-primary mb-3 flex items-center space-x-2">
                          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                            <Phone className="h-4 w-4 text-amber-600" />
                          </div>
                          <span>Confirm with Resident</span>
                        </h4>
                        <p className="text-sm warm-text-secondary mb-6">
                          Please confirm with <strong>{scannedVisitor.hostName}</strong> ({scannedVisitor.hostUnit}) before approving access.
                        </p>
                        <div className="flex space-x-3">
                          <Button 
                            onClick={() => handleConfirmWithResident(true)}
                            className="flex-1 sage-success backdrop-blur-sm hover:backdrop-blur-md hover:shadow-md"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve Access
                          </Button>
                          <Button 
                            onClick={() => handleConfirmWithResident(false)}
                            variant="outline"
                            className="flex-1 warm-hover backdrop-blur-sm hover:backdrop-blur-md hover:shadow-md"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Deny Access
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
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
    </ProtectedRoute>
  )
}
