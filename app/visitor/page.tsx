"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2, Clock, User, CheckCircle, XCircle, AlertCircle, MapPin, Phone, QrCode, LogOut } from "lucide-react"
import { motion } from "framer-motion"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { RoleNavigation } from "@/components/navigation/role-navigation"

// Mock visitor data - in real app this would come from database lookup by email
const mockVisitorData = {
  id: "VIS-2024-001",
  visitorName: "John Doe",
  visitorEmail: "john.doe@email.com",
  building: "Pavilion Residences",
  purpose: "Family Visit",
  validFrom: "Today, 2:00 PM",
  validUntil: "Today, 8:00 PM",
  status: "pending", // pending, approved, expired, denied, no_qr
  createdAt: "Today, 1:45 PM",
  qrCode: "/qr-code-visitor.jpg",
  hasQrCode: true, // This would be determined by database query for this email
}

// Example of visitor without QR code
const mockVisitorNoQR = {
  id: null,
  visitorName: "Jane Smith",
  visitorEmail: "jane.smith@email.com",
  building: "Pavilion Residences",
  purpose: "Business Meeting",
  validFrom: null,
  validUntil: null,
  status: "no_qr",
  createdAt: null,
  qrCode: null,
  hasQrCode: false, // No QR code found for this email
}

export default function VisitorAccess() {
  const [visitorData, setVisitorData] = useState(mockVisitorData)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // In real app, this would:
  // 1. Get visitor email from URL params or authentication
  // 2. Query database: SELECT * FROM visitors WHERE visitor_email = ?
  // 3. If found: show QR code and status
  // 4. If not found: show "no QR code" message
  // For demo purposes, we'll use the mock data

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          color: "amber-warning",
          icon: AlertCircle,
          iconColor: "text-primary",
          title: "Awaiting Approval",
          description: "Your visit request is being reviewed by security",
          bgColor: "bg-background",
        }
      case "approved":
        return {
          color: "sage-success",
          icon: CheckCircle,
          iconColor: "text-primary",
          title: "Access Approved",
          description: "You may proceed to the building",
          bgColor: "bg-background",
        }
      case "denied":
        return {
          color: "rustic-error",
          icon: XCircle,
          iconColor: "text-primary",
          title: "Access Denied",
          description: "Please contact your host for assistance",
          bgColor: "bg-background",
        }
      case "expired":
        return {
          color: "warm-text-secondary",
          icon: XCircle,
          iconColor: "text-primary",
          title: "Access Expired",
          description: "This QR code is no longer valid",
          bgColor: "bg-background",
        }
      case "no_qr":
        return {
          color: "amber-warning",
          icon: AlertCircle,
          iconColor: "text-primary",
          title: "No QR Code Found",
          description: "Please contact your host to create a visitor QR code",
          bgColor: "bg-background",
        }
      default:
        return {
          color: "warm-text-secondary",
          icon: AlertCircle,
          iconColor: "text-primary",
          title: "Unknown Status",
          description: "Please contact security for assistance",
          bgColor: "bg-background",
        }
    }
  }

  const statusConfig = getStatusConfig(visitorData.status)
  const StatusIcon = statusConfig.icon

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  return (
    <ProtectedRoute>
      <RoleNavigation />
      <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <motion.div className="text-center py-6" {...fadeInUp}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground font-premium">CasaLink</span>
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
          <h1 className="accent-text warm-text-primary">Visitor Access</h1>
          <p className="warm-text-secondary">{visitorData.building}</p>
        </motion.div>


        {/* Status Card */}
        <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
          <Card className="warm-card border-2 border-border">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center mx-auto mb-4">
                <StatusIcon className={`h-8 w-8 ${statusConfig.iconColor}`} />
              </div>
              <Badge className={`${statusConfig.color} mb-3`}>{statusConfig.title}</Badge>
              <p className="warm-text-secondary text-sm">{statusConfig.description}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Visitor Information */}
        <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
          <Card className="warm-card">
            <CardContent className="p-6">
              <h2 className="font-semibold warm-text-primary mb-4">Visit Details</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium warm-text-primary">{visitorData.visitorName}</p>
                    <p className="text-sm warm-text-secondary">Visitor</p>
                  </div>
                </div>


                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium warm-text-primary">{visitorData.purpose}</p>
                    <p className="text-sm warm-text-secondary">Purpose of visit</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium warm-text-primary">
                      {visitorData.validFrom} - {visitorData.validUntil}
                    </p>
                    <p className="text-sm warm-text-secondary">Valid period</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* QR Code Display - Show immediately when received */}
        {visitorData.hasQrCode && (
          <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
            <Card className="warm-card">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold warm-text-primary mb-4">
                  {visitorData.status === "approved" 
                    ? "Show this QR Code to Security" 
                    : "QR Code Ready - Awaiting Security Approval"}
                </h3>
                <div className="bg-white p-4 rounded-lg inline-block shadow-sm">
                  <img
                    src={visitorData.qrCode || "/placeholder.svg?height=200&width=200&query=QR code"}
                    alt="Visitor QR Code"
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                <p className="text-xs warm-text-secondary mt-4">ID: {visitorData.id}</p>
                {visitorData.status === "pending" && (
                  <p className="text-xs warm-text-secondary mt-2">
                    Security will scan this QR code at the entrance
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* No QR Code Message */}
        {!visitorData.hasQrCode && (
          <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
            <Card className="warm-card border-2 border-amber-200 bg-amber-50/50">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                  <QrCode className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="font-semibold warm-text-primary mb-2">No QR Code Generated</h3>
                <p className="warm-text-secondary text-sm mb-4">
                  No visitor QR code has been created for you yet. Please contact the resident you're visiting to generate one.
                </p>
                <div className="space-y-3">
                  <Button className="w-full warm-button" variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Resident
                  </Button>
                  <Button className="w-full bg-transparent warm-hover" variant="outline">
                    <Building2 className="h-4 w-4 mr-2" />
                    Contact Building Management
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
          <div className="space-y-3">
            {visitorData.status === "approved" && visitorData.hasQrCode && (
              <Button className="w-full bg-transparent warm-hover" variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Contact Resident
              </Button>
            )}

            {(visitorData.status === "denied" || visitorData.status === "expired") && visitorData.hasQrCode && (
              <Button className="w-full bg-transparent warm-hover" variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Contact Resident
              </Button>
            )}

            {/* Show contact options when no QR code exists */}
            {!visitorData.hasQrCode && (
              <div className="space-y-3">
                <Button className="w-full warm-button" variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Resident
                </Button>
                <Button className="w-full bg-transparent warm-hover" variant="outline">
                  <Building2 className="h-4 w-4 mr-2" />
                  Contact Building Management
                </Button>
              </div>
            )}

            {/* Logout Button */}
            <div className="pt-4 border-t border-border">
              <Button 
                className="w-full bg-transparent warm-hover" 
                variant="outline"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('casalink-demo-user')
                    document.cookie = 'casalink-demo-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
                    window.location.href = '/login'
                  }
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Switch Role / Logout
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Footer Info */}
        <motion.div {...fadeInUp} transition={{ delay: 0.5 }}>
          <Card className="warm-card">
            <CardContent className="p-4 text-center">
              <p className="text-xs warm-text-secondary">
                Generated: {visitorData.createdAt}
                <br />
                Current time: {currentTime.toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>
        </motion.div>

      </div>
      </div>
    </ProtectedRoute>
  )
}
