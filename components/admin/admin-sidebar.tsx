"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Crown,
  Home,
  Building2,
  Users,
  BarChart3,
  DollarSign,
  Settings,
  Shield,
  AlertTriangle,
  LogOut,
  Bell,
  Globe,
  ChevronDown,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function AdminSidebar() {
  const [activeItem, setActiveItem] = useState("dashboard")

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, badge: null },
    { id: "condos", label: "Condominiums", icon: Building2, badge: "47" },
    { id: "users", label: "User Management", icon: Users, badge: null },
    { id: "analytics", label: "Analytics", icon: BarChart3, badge: null },
    { id: "billing", label: "Billing & Revenue", icon: DollarSign, badge: "3" },
    { id: "system", label: "System Health", icon: Globe, badge: null },
    { id: "security", label: "Security", icon: Shield, badge: null },
    { id: "alerts", label: "Alerts & Logs", icon: AlertTriangle, badge: "12" },
    { id: "settings", label: "Platform Settings", icon: Settings, badge: null },
  ]

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Crown className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Admin Portal</span>
                    <span className="truncate text-xs">Platform Management</span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/admin-user.jpg" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Admin User</p>
                      <p className="text-xs text-muted-foreground">Platform Owner</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = activeItem === item.id
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      asChild
                      isActive={isActive}
                      onClick={() => setActiveItem(item.id)}
                    >
                      <a href="#" className="w-full">
                        <Icon className="size-4" />
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                    {item.badge && (
                      <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#">
                <Bell className="size-4" />
                <span>System Notifications</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        {/* Quick Actions Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#">
                    <Building2 className="size-4" />
                    <span>Add New Condo</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#">
                    <Users className="size-4" />
                    <span>User Management</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#">
                    <BarChart3 className="size-4" />
                    <span>Generate Reports</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#">
                    <Settings className="size-4" />
                    <span>System Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('casalink-demo-user')
                  document.cookie = 'casalink-demo-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
                  window.location.href = '/login'
                }
              }}
              className="text-destructive hover:text-destructive warm-hover backdrop-blur-sm hover:backdrop-blur-md hover:shadow-md"
            >
              <LogOut className="size-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
