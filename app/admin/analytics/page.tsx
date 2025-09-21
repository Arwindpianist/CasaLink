"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Activity, Download } from "lucide-react"
import { motion } from "framer-motion"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function AdminAnalytics() {
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
          {/* Header */}
          <header className="glass-header border-b border-border/50 px-4 lg:px-8 py-6 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="-ml-1 warm-hover backdrop-blur-sm hover:backdrop-blur-md hover:shadow-md" />
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-8 w-8 text-primary" />
                  <div>
                    <h1 className="dashboard-title warm-text-primary">Analytics Dashboard</h1>
                    <p className="warm-text-secondary">Platform performance and insights</p>
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
                      <BarChart3 className="h-5 w-5 text-primary" />
                    </div>
                    <span>Analytics Dashboard</span>
                  </CardTitle>
                  <CardDescription className="warm-text-secondary">
                    Comprehensive platform analytics and reporting coming soon
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center py-12">
                    <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      We're building advanced analytics features including real-time metrics, 
                      custom reports, and detailed performance insights.
                    </p>
                    <Badge variant="outline" className="text-sm">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Advanced Analytics
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="warm-card warm-hover">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Activity className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Real-time Metrics</p>
                            <p className="text-xs text-muted-foreground">Live performance data</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="warm-card warm-hover">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Custom Reports</p>
                            <p className="text-xs text-muted-foreground">Generate insights</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="warm-card warm-hover">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <Download className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium">Export Data</p>
                            <p className="text-xs text-muted-foreground">Download reports</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
