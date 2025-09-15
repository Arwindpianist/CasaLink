"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Search, Users, Send, Plus } from "lucide-react"
import { motion } from "framer-motion"
import { BottomNavigation } from "@/components/resident/bottom-navigation"

export default function ResidentChat() {
  const [activeTab, setActiveTab] = useState("chat")
  const [selectedChat, setSelectedChat] = useState<number | null>(null)
  const [message, setMessage] = useState("")

  const chatGroups = [
    {
      id: 1,
      name: "Building A Residents",
      lastMessage: "Anyone interested in a potluck dinner this weekend?",
      time: "10 min ago",
      unread: 3,
      members: 24,
      avatar: "/modern-city-building.png",
    },
    {
      id: 2,
      name: "Gym Buddies",
      lastMessage: "Morning workout session tomorrow at 7 AM?",
      time: "1 hour ago",
      unread: 0,
      members: 12,
      avatar: "/modern-gym-interior.png",
    },
    {
      id: 3,
      name: "Parents Group",
      lastMessage: "Playground maintenance completed!",
      time: "3 hours ago",
      unread: 1,
      members: 18,
      avatar: "/parents.jpg",
    },
    {
      id: 4,
      name: "Book Club",
      lastMessage: "Next month's book selection is ready",
      time: "1 day ago",
      unread: 0,
      members: 8,
      avatar: "/stack-of-diverse-books.png",
    },
  ]

  const messages = [
    {
      id: 1,
      sender: "Alice Chen",
      message: "Hey everyone! I'm organizing a potluck dinner this Saturday. Who's interested?",
      time: "2:30 PM",
      isOwn: false,
      avatar: "/alice-in-wonderland.png",
    },
    {
      id: 2,
      sender: "You",
      message: "That sounds great! I can bring some homemade pasta.",
      time: "2:35 PM",
      isOwn: true,
      avatar: "/abstract-self-reflection.png",
    },
    {
      id: 3,
      sender: "Mike Wong",
      message: "Count me in! I'll bring dessert 🍰",
      time: "2:40 PM",
      isOwn: false,
      avatar: "/person-named-mike.png",
    },
    {
      id: 4,
      sender: "Sarah Lim",
      message: "What time should we meet? And where exactly?",
      time: "2:45 PM",
      isOwn: false,
      avatar: "/diverse-group-smiling.png",
    },
  ]

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle sending message
      setMessage("")
    }
  }

  if (selectedChat) {
    return (
      <div className="min-h-screen bg-background pb-20 flex flex-col">
        {/* Chat Header */}
        <div className="bg-card border-b border-border px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={() => setSelectedChat(null)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarImage src={chatGroups.find((g) => g.id === selectedChat)?.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                <Users className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="font-semibold text-foreground">{chatGroups.find((g) => g.id === selectedChat)?.name}</h1>
              <p className="text-sm text-muted-foreground">
                {chatGroups.find((g) => g.id === selectedChat)?.members} members
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex space-x-2 max-w-[80%] ${msg.isOwn ? "flex-row-reverse space-x-reverse" : ""}`}>
                {!msg.isOwn && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{msg.sender[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div>
                  {!msg.isOwn && <p className="text-xs text-muted-foreground mb-1">{msg.sender}</p>}
                  <div
                    className={`rounded-lg px-3 py-2 ${
                      msg.isOwn ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{msg.time}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-card border-t border-border px-4 py-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button size="icon" onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">Community Chat</h1>
          <Button size="icon" variant="ghost">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search chats..." className="pl-10" />
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="space-y-3">
          {chatGroups.map((group) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: group.id * 0.1 }}
            >
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedChat(group.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={group.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        <Users className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-foreground truncate">{group.name}</h3>
                        <span className="text-xs text-muted-foreground">{group.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{group.lastMessage}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">{group.members} members</span>
                        {group.unread > 0 && (
                          <Badge variant="default" className="text-xs">
                            {group.unread}
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

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
