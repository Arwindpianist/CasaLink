"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { QrCode, Plus, Clock, Users, Calendar, Bell, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { BottomNavigation } from "@/components/resident/bottom-navigation"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ResidentDashboard() {
  const [activeTab, setActiveTab] = useState("home")

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

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="warm-card border-b border-border px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="dashboard-title warm-text-primary">Good morning, Sarah!</h1>
            <p className="warm-text-secondary">Unit 12-A, Tower 1</p>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <div className="relative">
              <Button variant="ghost" size="icon" className="warm-hover">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Quick Actions */}
        <motion.div {...fadeInUp}>
          <h2 className="text-lg font-semibold warm-text-primary mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card className="cursor-pointer warm-card warm-hover">
              <CardContent className="p-4 text-center">
                <QrCode className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium warm-text-primary">Create QR Code</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer warm-card warm-hover">
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
              <Card key={announcement.id} className="cursor-pointer warm-card warm-hover">
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
            <Button variant="ghost" size="sm" className="warm-hover">
              <Plus className="h-4 w-4 mr-1" />
              Create New
            </Button>
          </div>
          <div className="space-y-3">
            {activeQRCodes.map((qr) => (
              <Card key={qr.id} className="cursor-pointer warm-card warm-hover">
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
            <Button variant="ghost" size="sm" className="warm-hover">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-3">
            {recentChats.map((chat) => (
              <Card key={chat.id} className="cursor-pointer warm-card warm-hover">
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

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
