"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, QrCode, Camera, User, Phone, MapPin, LogOut } from "lucide-react"
import { motion } from "framer-motion"

export default function VisitorScan() {
  const [step, setStep] = useState(1) // 1: scan, 2: form, 3: confirmation
  const [formData, setFormData] = useState({
    visitorName: "",
    phone: "",
    purpose: "",
    vehicleNumber: "",
  })

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(3)
  }

  if (step === 1) {
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
            <h1 className="text-xl font-semibold warm-text-primary">Visitor Check-in</h1>
            <p className="warm-text-secondary">Scan your QR code to proceed</p>
          </motion.div>

          {/* QR Scanner Placeholder */}
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
            <Card className="warm-card">
              <CardContent className="p-8 text-center">
                <div className="w-48 h-48 mx-auto bg-muted rounded-lg flex items-center justify-center mb-6">
                  <div className="text-center">
                    <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">QR Scanner View</p>
                  </div>
                </div>
                <p className="warm-text-secondary mb-4">Position the QR code within the frame</p>
                <div className="space-y-3">
                  <Button className="w-full warm-button">
                    <Camera className="h-4 w-4 mr-2" />
                    Enable Camera
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent warm-hover" onClick={() => setStep(2)}>
                    Manual Entry
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Instructions */}
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
            <Card className="warm-card">
              <CardContent className="p-4">
                <h3 className="font-medium warm-text-primary mb-2">Instructions</h3>
                <ul className="text-sm warm-text-secondary space-y-1">
                  <li>• Hold your phone steady</li>
                  <li>• Ensure good lighting</li>
                  <li>• Keep QR code within the frame</li>
                  <li>• Wait for automatic detection</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  if (step === 2) {
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
            <h1 className="text-xl font-semibold warm-text-primary">Visitor Information</h1>
            <p className="warm-text-secondary">Please provide your details</p>
          </motion.div>

          {/* Form */}
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
            <Card className="warm-card">
              <CardContent className="p-6">
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="visitorName">Full Name *</Label>
                    <Input
                      id="visitorName"
                      value={formData.visitorName}
                      onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+60 12-345 6789"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="purpose">Purpose of Visit *</Label>
                    <Input
                      id="purpose"
                      value={formData.purpose}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      placeholder="e.g., Family visit, Business meeting"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="vehicleNumber">Vehicle Number (Optional)</Label>
                    <Input
                      id="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                      placeholder="e.g., ABC 1234"
                    />
                  </div>

                  <div className="space-y-3 pt-4">
                    <Button type="submit" className="w-full warm-button">
                      Submit Information
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full bg-transparent warm-hover"
                      onClick={() => setStep(1)}
                    >
                      Back to Scanner
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
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
          <h1 className="text-xl font-semibold warm-text-primary">Check-in Successful</h1>
          <p className="warm-text-secondary">Your information has been submitted</p>
        </motion.div>

        {/* Success Card */}
        <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
          <Card className="warm-card border-2 border-border">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="h-8 w-8 text-primary" />
              </div>
              <h2 className="font-semibold warm-text-primary mb-2">Information Submitted</h2>
              <p className="warm-text-secondary text-sm mb-4">
                Security has been notified of your arrival. Please wait for approval.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Submitted Information */}
        <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
          <Card className="warm-card">
            <CardContent className="p-6">
              <h3 className="font-semibold warm-text-primary mb-4">Submitted Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium warm-text-primary">{formData.visitorName}</p>
                    <p className="text-sm warm-text-secondary">Visitor Name</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium warm-text-primary">{formData.phone}</p>
                    <p className="text-sm warm-text-secondary">Phone Number</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium warm-text-primary">{formData.purpose}</p>
                    <p className="text-sm warm-text-secondary">Purpose</p>
                  </div>
                </div>

                {formData.vehicleNumber && (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-muted rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-muted-foreground">V</span>
                    </div>
                    <div>
                      <p className="font-medium warm-text-primary">{formData.vehicleNumber}</p>
                      <p className="text-sm warm-text-secondary">Vehicle Number</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Next Steps */}
        <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
          <Card className="warm-card">
            <CardContent className="p-4">
              <h3 className="font-medium warm-text-primary mb-2">What happens next?</h3>
              <ul className="text-sm warm-text-secondary space-y-1">
                <li>• Security will review your information</li>
                <li>• You'll receive approval notification</li>
                <li>• Present your ID at the security desk</li>
                <li>• Proceed to your destination</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Button */}
        <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
          <Button className="w-full warm-button" onClick={() => (window.location.href = "/visitor")}>
            Check Status
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
