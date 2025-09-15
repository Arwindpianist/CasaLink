"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2, Clock, User, CheckCircle, XCircle, AlertCircle, MapPin, Phone } from "lucide-react"
import { motion } from "framer-motion"

// Mock visitor data - in real app this would come from QR code scan or URL params
const mockVisitorData = {
  id: "VIS-2024-001",
  visitorName: "John Doe",
  hostName: "Sarah Chen",
  hostUnit: "12-A, Tower 1",
  hostPhone: "+60 12-345 6789",
  building: "Pavilion Residences",
  purpose: "Family Visit",
  validFrom: "Today, 2:00 PM",
  validUntil: "Today, 8:00 PM",
  status: "pending", // pending, approved, expired, denied
  createdAt: "Today, 1:45 PM",
  qrCode: "/qr-code-visitor.jpg",
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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <motion.div className="text-center py-6" {...fadeInUp}>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground font-premium">CasaLink</span>
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
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/sarah-profile.jpg" />
                    <AvatarFallback>
                      {visitorData.hostName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium warm-text-primary">{visitorData.hostName}</p>
                    <p className="text-sm warm-text-secondary">Host • {visitorData.hostUnit}</p>
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

        {/* QR Code Display */}
        {visitorData.status === "approved" && (
          <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
            <Card className="warm-card">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold warm-text-primary mb-4">Show this QR Code to Security</h3>
                <div className="bg-white p-4 rounded-lg inline-block shadow-sm">
                  <img
                    src={visitorData.qrCode || "/placeholder.svg?height=200&width=200&query=QR code"}
                    alt="Visitor QR Code"
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                <p className="text-xs warm-text-secondary mt-4">ID: {visitorData.id}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
          <div className="space-y-3">
            {visitorData.status === "pending" && (
              <Button className="w-full warm-button" onClick={() => setVisitorData({ ...visitorData, status: "approved" })}>
                Refresh Status
              </Button>
            )}

            {visitorData.status === "approved" && (
              <div className="space-y-3">
                <Button className="w-full bg-transparent warm-hover" variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Host: {visitorData.hostPhone}
                </Button>
                <Button
                  className="w-full bg-transparent warm-hover"
                  variant="outline"
                  onClick={() => setVisitorData({ ...visitorData, status: "expired" })}
                >
                  Mark as Used
                </Button>
              </div>
            )}

            {(visitorData.status === "denied" || visitorData.status === "expired") && (
              <Button className="w-full bg-transparent warm-hover" variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Contact Host: {visitorData.hostPhone}
              </Button>
            )}
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

        {/* Demo Controls */}
        <motion.div {...fadeInUp} transition={{ delay: 0.6 }}>
          <Card className="warm-card border-dashed border-2 border-border/50">
            <CardContent className="p-4">
              <p className="text-xs warm-text-secondary text-center mb-3">Demo Controls</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="warm-hover"
                  onClick={() => setVisitorData({ ...visitorData, status: "pending" })}
                >
                  Pending
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="warm-hover"
                  onClick={() => setVisitorData({ ...visitorData, status: "approved" })}
                >
                  Approved
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="warm-hover"
                  onClick={() => setVisitorData({ ...visitorData, status: "denied" })}
                >
                  Denied
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="warm-hover"
                  onClick={() => setVisitorData({ ...visitorData, status: "expired" })}
                >
                  Expired
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
