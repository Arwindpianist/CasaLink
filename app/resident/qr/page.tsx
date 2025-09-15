"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { QrCode, Plus, Clock, User, Dumbbell, Waves, Share, Download, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import { BottomNavigation } from "@/components/resident/bottom-navigation"

export default function QRCodeManagement() {
  const [activeTab, setActiveTab] = useState("qr")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const activeQRCodes = [
    {
      id: 1,
      type: "Visitor",
      name: "John Doe",
      purpose: "Family Visit",
      validFrom: "Today, 2:00 PM",
      validUntil: "Today, 8:00 PM",
      status: "active",
      icon: User,
      qrCode: "/qr-code-visitor.jpg",
    },
    {
      id: 2,
      type: "Gym",
      name: "Personal Workout",
      purpose: "Fitness Session",
      validFrom: "Today, 6:00 PM",
      validUntil: "Today, 10:00 PM",
      status: "active",
      icon: Dumbbell,
      qrCode: "/qr-code-gym.jpg",
    },
  ]

  const pastQRCodes = [
    {
      id: 3,
      type: "Pool",
      name: "Swimming Session",
      purpose: "Recreation",
      validFrom: "Yesterday, 3:00 PM",
      validUntil: "Yesterday, 6:00 PM",
      status: "expired",
      icon: Waves,
    },
    {
      id: 4,
      type: "Visitor",
      name: "Sarah Wilson",
      purpose: "Business Meeting",
      validFrom: "Dec 10, 10:00 AM",
      validUntil: "Dec 10, 2:00 PM",
      status: "expired",
      icon: User,
    },
  ]

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

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">QR Codes</h1>
            <p className="text-muted-foreground">Manage visitor and amenity access</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create QR
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New QR Code</DialogTitle>
                <DialogDescription>Generate a QR code for visitor or amenity access</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="type">Access Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select access type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visitor">Visitor Access</SelectItem>
                      <SelectItem value="gym">Gym Access</SelectItem>
                      <SelectItem value="pool">Pool Access</SelectItem>
                      <SelectItem value="parking">Parking Access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter visitor name or session title" />
                </div>
                <div>
                  <Label htmlFor="purpose">Purpose</Label>
                  <Textarea id="purpose" placeholder="Brief description of the visit or activity" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="validFrom">Valid From</Label>
                    <Input id="validFrom" type="datetime-local" />
                  </div>
                  <div>
                    <Label htmlFor="validUntil">Valid Until</Label>
                    <Input id="validUntil" type="datetime-local" />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCreateDialogOpen(false)}>Generate QR Code</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Active QR Codes */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Active QR Codes</h2>
          <div className="space-y-4">
            {activeQRCodes.map((qr, index) => {
              const Icon = qr.icon
              return (
                <motion.div
                  key={qr.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-foreground">{qr.name}</h3>
                              <p className="text-sm text-muted-foreground">{qr.purpose}</p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {qr.validFrom}
                                </span>
                                <span>→</span>
                                <span>{qr.validUntil}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <Badge variant="secondary">{qr.type}</Badge>
                              <Badge className={getStatusColor(qr.status)}>{qr.status}</Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mt-4">
                            <Button size="sm" variant="outline">
                              <Share className="h-4 w-4 mr-1" />
                              Share
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                            <Button size="sm" variant="outline">
                              <QrCode className="h-4 w-4 mr-1" />
                              View QR
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Past QR Codes */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Past QR Codes</h2>
          <div className="space-y-4">
            {pastQRCodes.map((qr, index) => {
              const Icon = qr.icon
              return (
                <motion.div
                  key={qr.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="opacity-75 hover:opacity-100 transition-opacity">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-foreground">{qr.name}</h3>
                              <p className="text-sm text-muted-foreground">{qr.purpose}</p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {qr.validFrom}
                                </span>
                                <span>→</span>
                                <span>{qr.validUntil}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <Badge variant="outline">{qr.type}</Badge>
                              <Badge className={getStatusColor(qr.status)}>{qr.status}</Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mt-4">
                            <Button size="sm" variant="outline" disabled>
                              <QrCode className="h-4 w-4 mr-1" />
                              View QR
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
