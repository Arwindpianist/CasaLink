"use client"

import { Home, MessageCircle, Megaphone, QrCode, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "chat", label: "Chat", icon: MessageCircle },
    { id: "board", label: "Board", icon: Megaphone },
    { id: "qr", label: "QR Codes", icon: QrCode },
    { id: "profile", label: "Profile", icon: User },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-navbar border-t border-border/50 rounded-t-2xl md:hidden">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-xl warm-hover min-w-0 transition-all duration-200",
                isActive
                  ? "text-primary-foreground warm-button bg-primary/80 backdrop-blur-md shadow-lg border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/10 hover:backdrop-blur-md hover:shadow-md hover:border-white/20",
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium truncate">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
