"use client"

import React from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Home, 
  Users, 
  Shield, 
  Settings, 
  MessageCircle, 
  QrCode,
  Building2,
  UserCheck
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useIsMobile } from '@/hooks/use-mobile'

export function RoleNavigation() {
  const { user } = useAuth()
  const pathname = usePathname()
  const isMobile = useIsMobile()

  if (!user) return null

  // Hide navigation on mobile devices
  if (isMobile) return null

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'platform_admin': return 'bg-red-500'
      case 'management': return 'bg-blue-500'
      case 'security': return 'bg-green-500'
      case 'resident': return 'bg-purple-500'
      case 'visitor': return 'bg-orange-500'
      case 'moderator': return 'bg-pink-500'
      default: return 'bg-gray-500'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'platform_admin': return 'Platform Admin'
      case 'management': return 'Management'
      case 'security': return 'Security'
      case 'resident': return 'Resident'
      case 'visitor': return 'Visitor'
      case 'moderator': return 'Moderator'
      default: return role
    }
  }

  const getNavigationItems = () => {
    switch (user.role) {
      case 'platform_admin':
        return [
          { href: '/admin', label: 'Admin Dashboard', icon: Settings },
          { href: '/admin/condos', label: 'Condominiums', icon: Building2 },
          { href: '/resident', label: 'Resident View', icon: Users },
          { href: '/security', label: 'Security View', icon: Shield },
          { href: '/visitor', label: 'Visitor View', icon: UserCheck },
          { href: '/demo', label: 'Demo', icon: Home }
        ]
      case 'management':
        return [
          { href: '/admin', label: 'Management Dashboard', icon: Settings },
          { href: '/admin/condos', label: 'Condominiums', icon: Building2 },
          { href: '/resident', label: 'Resident View', icon: Users },
          { href: '/demo', label: 'Demo', icon: Home }
        ]
      case 'security':
        return [
          { href: '/security', label: 'Security Dashboard', icon: Shield },
          { href: '/security/visitors', label: 'Visitor Management', icon: UserCheck },
          { href: '/demo', label: 'Demo', icon: Home }
        ]
      case 'resident':
        return [
          { href: '/resident', label: 'Dashboard', icon: Home },
          { href: '/resident/board', label: 'Community Board', icon: MessageCircle },
          { href: '/resident/chat', label: 'Chat', icon: MessageCircle },
          { href: '/resident/profile', label: 'Profile', icon: Users },
          { href: '/resident/qr', label: 'QR Codes', icon: QrCode },
          { href: '/demo', label: 'Demo', icon: Home }
        ]
      case 'visitor':
        return [
          { href: '/visitor', label: 'Visitor Dashboard', icon: Home },
          { href: '/visitor/amenity', label: 'Amenities', icon: Building2 },
          { href: '/visitor/scan', label: 'QR Scanner', icon: QrCode },
          { href: '/demo', label: 'Demo', icon: Home }
        ]
      case 'moderator':
        return [
          { href: '/resident', label: 'Dashboard', icon: Home },
          { href: '/resident/board', label: 'Community Board', icon: MessageCircle },
          { href: '/resident/chat', label: 'Chat', icon: MessageCircle },
          { href: '/resident/profile', label: 'Profile', icon: Users },
          { href: '/demo', label: 'Demo', icon: Home }
        ]
      default:
        return [
          { href: '/demo', label: 'Demo', icon: Home }
        ]
    }
  }

  const navigationItems = getNavigationItems()

  return (
    <div className="bg-background border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/casalink-favicon/favicon-32x32.png" 
                alt="CasaLink Logo" 
                className="h-6 w-6"
              />
              <span className="text-lg font-bold text-foreground font-premium">CasaLink</span>
            </div>
            <Badge className={`${getRoleColor(user.role)} text-white text-xs`}>
              {getRoleLabel(user.role)}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {user.condo_name}
            </Badge>
          </div>
          
          <nav className="flex items-center space-x-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              
              return (
                <Button
                  key={item.href}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className="text-xs"
                >
                  <Link href={item.href}>
                    <Icon className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                </Button>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}

