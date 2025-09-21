"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Eye, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function AdminSecurity() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  return (
    <ProtectedRoute requiredRole="platform_admin">
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <header className="glass-header border-b border-border/50 px-4 lg:px-8 py-6 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="-ml-1 warm-hover backdrop-blur-sm hover:backdrop-blur-md hover:shadow-md" />
                <div className="flex items-center space-x-2">
                  <Shield className="h-8 w-8 text-primary" />
                  <div>
                    <h1 className="dashboard-title warm-text-primary">Security Center</h1>
                    <p className="warm-text-secondary">Platform security and access control</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <ThemeToggle />
              </div>
            </div>
          </header>

          <div className="p-4 lg:p-8 space-y-8">
            <motion.div {...fadeInUp}>
              <Card className="warm-card">
                <CardHeader>
                  <CardTitle className="flex items-center warm-text-primary space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <span>Security Management</span>
                  </CardTitle>
                  <CardDescription className="warm-text-secondary">
                    Advanced security features coming soon
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center py-12">
                    <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Advanced security features including access logs, threat detection, 
                      and security analytics are in development.
                    </p>
                    <Badge variant="outline" className="text-sm">
                      <Lock className="h-3 w-3 mr-1" />
                      Security Center
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
