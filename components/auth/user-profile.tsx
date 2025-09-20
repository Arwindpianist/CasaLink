"use client"

import React from 'react'
import { useAuth } from './auth-provider'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { LogOut, User, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function UserProfile() {
  const { user, logout } = useAuth()
  const router = useRouter()

  if (!user) return null

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

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar_url} alt={user.name} />
            <AvatarFallback className={`${getRoleColor(user.role)} text-white text-xs`}>
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {getRoleLabel(user.role)}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {user.condo_name}
              </Badge>
            </div>
            {user.unit_number && (
              <p className="text-xs text-muted-foreground">Unit {user.unit_number}</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/resident/profile')}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/demo')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Demo</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

