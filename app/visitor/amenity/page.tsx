"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2, Clock, Dumbbell, CheckCircle, MapPin, Users, Calendar, LogOut } from "lucide-react"
import { motion } from "framer-motion"

// Mock amenity access data
const mockAmenityData = {
  id: "AME-2024-001",
  type: "Gym",
  bookedBy: "Sarah Chen",
  unit: "12-A, Tower 1",
  building: "Pavilion Residences",
  sessionTitle: "Personal Workout",
  validFrom: "Today, 6:00 PM",
  validUntil: "Today, 10:00 PM",
  status: "approved",
  capacity: "1/8 people",
  location: "Level 5, Fitness Center",
  qrCode: "/qr-code-gym.jpg",
}

export default function AmenityAccess() {
  const [amenityData, setAmenityData] = useState(mockAmenityData)

  const getAmenityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "gym":
        return Dumbbell
      case "pool":
        return Users
      default:
        return MapPin
    }
  }

  const AmenityIcon = getAmenityIcon(amenityData.type)

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
          <h1 className="text-xl font-semibold warm-text-primary">Amenity Access</h1>
          <p className="warm-text-secondary">{amenityData.building}</p>
        </motion.div>

        {/* Status Card */}
        <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
          <Card className="warm-card border-2 border-border">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <Badge className="sage-success mb-3">Access Approved</Badge>
              <p className="warm-text-secondary text-sm">You may proceed to the amenity</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Amenity Information */}
        <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
          <Card className="warm-card">
            <CardContent className="p-6">
              <h2 className="font-semibold warm-text-primary mb-4">Booking Details</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <AmenityIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium warm-text-primary">{amenityData.type}</p>
                    <p className="text-sm warm-text-secondary">{amenityData.sessionTitle}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/sarah-profile.jpg" />
                    <AvatarFallback>
                      {amenityData.bookedBy
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium warm-text-primary">{amenityData.bookedBy}</p>
                    <p className="text-sm warm-text-secondary">Booked by • {amenityData.unit}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium warm-text-primary">{amenityData.location}</p>
                    <p className="text-sm warm-text-secondary">Location</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium warm-text-primary">
                      {amenityData.validFrom} - {amenityData.validUntil}
                    </p>
                    <p className="text-sm warm-text-secondary">Session time</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium warm-text-primary">{amenityData.capacity}</p>
                    <p className="text-sm warm-text-secondary">Current capacity</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* QR Code Display */}
        <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
          <Card className="warm-card">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold warm-text-primary mb-4">Show this QR Code for Access</h3>
              <div className="bg-white p-4 rounded-lg inline-block shadow-sm">
                <img
                  src={amenityData.qrCode || "/placeholder.svg?height=200&width=200&query=Gym QR code"}
                  alt="Amenity Access QR Code"
                  className="w-48 h-48 mx-auto"
                />
              </div>
              <p className="text-xs warm-text-secondary mt-4">ID: {amenityData.id}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Amenity Rules */}
        <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
          <Card className="warm-card">
            <CardContent className="p-4">
              <h3 className="font-medium warm-text-primary mb-2">Gym Rules & Guidelines</h3>
              <ul className="text-sm warm-text-secondary space-y-1">
                <li>• Maximum 2-hour session per booking</li>
                <li>• Clean equipment after use</li>
                <li>• Proper gym attire required</li>
                <li>• No outside food or drinks</li>
                <li>• Report any equipment issues</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div {...fadeInUp} transition={{ delay: 0.5 }}>
          <div className="space-y-3">
            <Button className="w-full warm-button">Check In to {amenityData.type}</Button>
            <Button variant="outline" className="w-full bg-transparent warm-hover">
              <Calendar className="h-4 w-4 mr-2" />
              View Other Bookings
            </Button>
          </div>
        </motion.div>

        {/* Demo Controls */}
        <motion.div {...fadeInUp} transition={{ delay: 0.6 }}>
          <Card className="warm-card border-dashed border-2 border-border/50">
            <CardContent className="p-4">
              <p className="text-xs warm-text-secondary text-center mb-3">Demo: Switch Amenity Type</p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="warm-hover"
                  onClick={() =>
                    setAmenityData({
                      ...amenityData,
                      type: "Gym",
                      sessionTitle: "Personal Workout",
                      location: "Level 5, Fitness Center",
                      qrCode: "/qr-code-gym.jpg",
                    })
                  }
                >
                  Gym
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="warm-hover"
                  onClick={() =>
                    setAmenityData({
                      ...amenityData,
                      type: "Pool",
                      sessionTitle: "Swimming Session",
                      location: "Level 6, Pool Deck",
                      qrCode: "/qr-code-pool.jpg",
                    })
                  }
                >
                  Pool
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="warm-hover"
                  onClick={() =>
                    setAmenityData({
                      ...amenityData,
                      type: "Court",
                      sessionTitle: "Tennis Match",
                      location: "Level 7, Sports Court",
                      qrCode: "/qr-code-court.jpg",
                    })
                  }
                >
                  Court
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
