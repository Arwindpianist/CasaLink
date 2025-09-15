"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Megaphone, Calendar, Clock, MapPin, Heart, MessageCircle, Share } from "lucide-react"
import { motion } from "framer-motion"
import { BottomNavigation } from "@/components/resident/bottom-navigation"

export default function CommunityBoard() {
  const [activeTab, setActiveTab] = useState("board")

  const announcements = [
    {
      id: 1,
      title: "Pool Maintenance Schedule",
      content:
        "The swimming pool will be closed for maintenance from December 15-17. We apologize for any inconvenience.",
      author: "Management Office",
      time: "2 hours ago",
      priority: "high",
      category: "maintenance",
    },
    {
      id: 2,
      title: "New Year Community Event",
      content:
        "Join us for the New Year celebration at the clubhouse on December 31st at 8 PM. Food and drinks will be provided!",
      author: "Community Committee",
      time: "1 day ago",
      priority: "medium",
      category: "event",
    },
    {
      id: 3,
      title: "Parking Reminder",
      content: "Please ensure your vehicles are parked within designated areas. Unauthorized parking will be towed.",
      author: "Security Team",
      time: "3 days ago",
      priority: "low",
      category: "general",
    },
  ]

  const events = [
    {
      id: 1,
      title: "Yoga Class",
      description: "Weekly yoga session for all residents",
      date: "Every Tuesday",
      time: "7:00 PM - 8:00 PM",
      location: "Clubhouse",
      organizer: "Sarah Chen",
      attendees: 12,
    },
    {
      id: 2,
      title: "Book Club Meeting",
      description: "Monthly book discussion and coffee",
      date: "Dec 20, 2024",
      time: "2:00 PM - 4:00 PM",
      location: "Community Room",
      organizer: "Mike Wong",
      attendees: 8,
    },
  ]

  const marketplace = [
    {
      id: 1,
      title: "Dining Table Set",
      description: "6-seater wooden dining table with chairs. Excellent condition.",
      price: "RM 800",
      seller: "Alice Tan",
      image: "/elegant-dining-table.png",
      likes: 5,
      comments: 3,
      time: "2 days ago",
    },
    {
      id: 2,
      title: "Children's Bicycle",
      description: "Red bicycle for kids aged 5-8. Barely used, includes training wheels.",
      price: "RM 150",
      seller: "John Lim",
      image: "/colorful-kids-bicycle.png",
      likes: 8,
      comments: 2,
      time: "1 week ago",
    },
  ]

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-6">
        <h1 className="text-2xl font-bold text-foreground">Community Board</h1>
        <p className="text-muted-foreground">Stay connected with your community</p>
      </div>

      <div className="px-4 py-6">
        <Tabs defaultValue="announcements" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          </TabsList>

          <TabsContent value="announcements" className="space-y-4 mt-6">
            {announcements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <Megaphone className="h-5 w-5 text-primary" />
                        <div>
                          <CardTitle className="text-lg">{announcement.title}</CardTitle>
                          <CardDescription className="flex items-center space-x-2 mt-1">
                            <span>{announcement.author}</span>
                            <span>•</span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {announcement.time}
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                      {announcement.priority === "high" && (
                        <Badge variant="destructive" className="text-xs">
                          Urgent
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{announcement.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="events" className="space-y-4 mt-6">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-secondary" />
                        <div>
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <CardDescription>{event.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {event.attendees} attending
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {event.date}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <span className="mr-2">By:</span>
                        {event.organizer}
                      </div>
                    </div>
                    <Button className="w-full">Join Event</Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="marketplace" className="space-y-4 mt-6">
            {marketplace.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex space-x-4">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded-lg bg-muted"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-foreground truncate">{item.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                              <span>By {item.seller}</span>
                              <span>•</span>
                              <span>{item.time}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">{item.price}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <button className="flex items-center space-x-1 hover:text-primary transition-colors">
                              <Heart className="h-4 w-4" />
                              <span>{item.likes}</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-primary transition-colors">
                              <MessageCircle className="h-4 w-4" />
                              <span>{item.comments}</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-primary transition-colors">
                              <Share className="h-4 w-4" />
                            </button>
                          </div>
                          <Button size="sm">Contact Seller</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
