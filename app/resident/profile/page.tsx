"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { User, Building2, Bell, Shield, Settings, LogOut, Edit, Camera, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { BottomNavigation } from "@/components/resident/bottom-navigation"

export default function ResidentProfile() {
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)

  const userInfo = {
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    phone: "+60 12-345 6789",
    unit: "12-A, Tower 1",
    building: "Pavilion Residences",
    joinDate: "January 2023",
    avatar: "/sarah-profile.jpg",
  }

  const notificationSettings = [
    { id: "announcements", label: "Community Announcements", enabled: true },
    { id: "events", label: "Event Notifications", enabled: true },
    { id: "qr", label: "QR Code Updates", enabled: false },
    { id: "chat", label: "Chat Messages", enabled: true },
    { id: "maintenance", label: "Maintenance Alerts", enabled: true },
  ]

  const menuItems = [
    { icon: Bell, label: "Notification Settings", action: () => {} },
    { icon: Shield, label: "Privacy & Security", action: () => {} },
    { icon: Settings, label: "App Settings", action: () => {} },
    { icon: LogOut, label: "Sign Out", action: () => {}, danger: true },
  ]

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Profile Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={userInfo.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-lg">
                      {userInfo.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground">{userInfo.name}</h2>
                  <p className="text-muted-foreground">{userInfo.unit}</p>
                  <p className="text-sm text-muted-foreground">{userInfo.building}</p>
                  <p className="text-xs text-muted-foreground mt-1">Member since {userInfo.joinDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Personal Information */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={userInfo.name} disabled={!isEditing} />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={userInfo.email} disabled={!isEditing} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" value={userInfo.phone} disabled={!isEditing} />
                </div>
              </div>
              {isEditing && (
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsEditing(false)}>Save Changes</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Unit Information */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Unit Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Unit Number</Label>
                  <p className="font-medium text-foreground">{userInfo.unit}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Building</Label>
                  <p className="font-medium text-foreground">{userInfo.building}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Floor</Label>
                  <p className="font-medium text-foreground">12th Floor</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <p className="font-medium text-foreground">3BR + 2BA</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {notificationSettings.map((setting, index) => (
                <div key={setting.id} className="flex items-center justify-between">
                  <Label htmlFor={setting.id} className="text-sm font-medium">
                    {setting.label}
                  </Label>
                  <Switch id={setting.id} checked={setting.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Menu Items */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardContent className="p-0">
              {menuItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <div key={index}>
                    <button
                      onClick={item.action}
                      className={`w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors ${
                        item.danger ? "text-destructive" : "text-foreground"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                    {index < menuItems.length - 1 && <Separator />}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
