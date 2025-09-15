"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Building2,
  Users,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Globe,
  Server,
  Zap,
  Shield,
  BarChart3,
  Settings,
} from "lucide-react"
import { motion } from "framer-motion"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { ShineBorderCard } from "@/components/magicui/shine-border-card"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AdminDashboard() {

  const globalStats = {
    totalCondos: 47,
    activeUsers: 12847,
    monthlyRevenue: 89650,
    systemUptime: 99.97,
    qrScansToday: 3421,
    supportTickets: 12,
  }

  const recentCondos = [
    {
      id: 1,
      name: "Pavilion Residences",
      location: "Kuala Lumpur",
      units: 240,
      activeUsers: 186,
      plan: "Professional",
      status: "active",
      joinDate: "2024-01-15",
      revenue: 1497,
    },
    {
      id: 2,
      name: "KLCC Suites",
      location: "Kuala Lumpur",
      units: 180,
      activeUsers: 142,
      plan: "Enterprise",
      status: "active",
      joinDate: "2024-02-03",
      revenue: 2995,
    },
    {
      id: 3,
      name: "Mont Kiara Heights",
      location: "Mont Kiara",
      units: 320,
      activeUsers: 298,
      plan: "Enterprise",
      status: "active",
      joinDate: "2024-01-28",
      revenue: 2995,
    },
  ]

  const systemAlerts = [
    {
      id: 1,
      type: "warning",
      message: "High API usage detected for Pavilion Residences",
      time: "5 min ago",
      severity: "medium",
    },
    {
      id: 2,
      type: "info",
      message: "New condominium registration: Tropicana Gardens",
      time: "1 hour ago",
      severity: "low",
    },
    {
      id: 3,
      type: "error",
      message: "Payment failed for KLCC Towers - subscription suspended",
      time: "2 hours ago",
      severity: "high",
    },
  ]

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return AlertTriangle
      case "warning":
        return Clock
      case "info":
        return CheckCircle
      default:
        return Activity
    }
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-primary"
      case "medium":
        return "text-primary"
      case "low":
        return "text-primary"
      default:
        return "text-primary"
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="warm-card border-b border-border px-4 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <div>
                <h1 className="dashboard-title warm-text-primary">SaaS Admin Dashboard</h1>
                <p className="warm-text-secondary">Global platform monitoring and management</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="sage-success">
                <Activity className="h-3 w-3 mr-1" />
                All Systems Operational
              </Badge>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 space-y-8">
          {/* Global Stats */}
          <motion.div {...fadeInUp}>
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              <ShineBorderCard className="warm-hover">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold warm-text-primary">{globalStats.totalCondos}</p>
                      <p className="text-xs warm-text-secondary">Total Condos</p>
                    </div>
                  </div>
                </CardContent>
              </ShineBorderCard>

              <ShineBorderCard className="warm-hover">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold warm-text-primary">{globalStats.activeUsers.toLocaleString()}</p>
                      <p className="text-xs warm-text-secondary">Active Users</p>
                    </div>
                  </div>
                </CardContent>
              </ShineBorderCard>

              <ShineBorderCard className="warm-hover">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold warm-text-primary">
                        RM{globalStats.monthlyRevenue.toLocaleString()}
                      </p>
                      <p className="text-xs warm-text-secondary">Monthly Revenue</p>
                    </div>
                  </div>
                </CardContent>
              </ShineBorderCard>

              <ShineBorderCard className="warm-hover">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Server className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold warm-text-primary">{globalStats.systemUptime}%</p>
                      <p className="text-xs warm-text-secondary">System Uptime</p>
                    </div>
                  </div>
                </CardContent>
              </ShineBorderCard>

              <ShineBorderCard className="warm-hover">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold warm-text-primary">{globalStats.qrScansToday.toLocaleString()}</p>
                      <p className="text-xs warm-text-secondary">QR Scans Today</p>
                    </div>
                  </div>
                </CardContent>
              </ShineBorderCard>

              <ShineBorderCard className="warm-hover">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold warm-text-primary">{globalStats.supportTickets}</p>
                      <p className="text-xs warm-text-secondary">Support Tickets</p>
                    </div>
                  </div>
                </CardContent>
              </ShineBorderCard>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Condominiums */}
            <motion.div className="lg:col-span-2" {...fadeInUp} transition={{ delay: 0.1 }}>
              <Card className="warm-card">
                <CardHeader>
                  <CardTitle className="flex items-center warm-text-primary">
                    <Building2 className="h-5 w-5 mr-2 text-primary" />
                    Active Condominiums
                  </CardTitle>
                  <CardDescription className="warm-text-secondary">Overview of registered properties and their performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentCondos.map((condo) => (
                    <div key={condo.id} className="border border-border rounded-lg p-4 warm-hover">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={`/condo-${condo.id}.jpg`} />
                            <AvatarFallback>
                              <Building2 className="h-6 w-6" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium warm-text-primary">{condo.name}</h3>
                            <p className="text-sm warm-text-secondary">{condo.location}</p>
                            <div className="flex items-center space-x-4 mt-1 text-xs warm-text-secondary">
                              <span>{condo.units} units</span>
                              <span>•</span>
                              <span>{condo.activeUsers} active users</span>
                              <span>•</span>
                              <span>Joined {condo.joinDate}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="mb-2 warm-accent">
                            {condo.plan}
                          </Badge>
                          <p className="text-sm font-medium warm-text-primary">RM{condo.revenue}/month</p>
                          <Badge
                            variant="outline"
                            className="text-xs sage-success mt-1"
                          >
                            Active
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-4">
                        <Button size="sm" variant="outline" className="warm-hover">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          View Analytics
                        </Button>
                        <Button size="sm" variant="ghost" className="warm-hover">
                          <Settings className="h-4 w-4 mr-1" />
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* System Alerts */}
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <Card className="warm-card">
                <CardHeader>
                  <CardTitle className="flex items-center warm-text-primary">
                    <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
                    System Alerts
                  </CardTitle>
                  <CardDescription className="warm-text-secondary">Recent system events and notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {systemAlerts.map((alert) => {
                    const Icon = getAlertIcon(alert.type)
                    const colorClass = getAlertColor(alert.severity)
                    return (
                      <div key={alert.id} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                          <Icon className={`h-4 w-4 ${colorClass}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm warm-text-primary">{alert.message}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs warm-text-secondary">{alert.time}</span>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                alert.severity === "high"
                                  ? "rustic-error"
                                  : alert.severity === "medium"
                                    ? "amber-warning"
                                    : "sage-success"
                              }`}
                            >
                              {alert.severity}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Performance Metrics */}
          <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
            <Card className="warm-card">
              <CardHeader>
                <CardTitle className="flex items-center warm-text-primary">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                  Platform Performance
                </CardTitle>
                <CardDescription className="warm-text-secondary">Key performance indicators and system health metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Globe className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold warm-text-primary">99.97%</p>
                    <p className="text-sm warm-text-secondary">API Uptime</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Zap className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold warm-text-primary">142ms</p>
                    <p className="text-sm warm-text-secondary">Avg Response Time</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Activity className="h-8 w-8 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold warm-text-primary">98.5%</p>
                    <p className="text-sm warm-text-secondary">User Satisfaction</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Shield className="h-8 w-8 text-orange-600" />
                    </div>
                    <p className="text-2xl font-bold warm-text-primary">0</p>
                    <p className="text-sm warm-text-secondary">Security Incidents</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
            <Card className="warm-card">
              <CardHeader>
                <CardTitle className="warm-text-primary">Admin Quick Actions</CardTitle>
                <CardDescription className="warm-text-secondary">Common administrative tasks and system management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col bg-transparent warm-hover">
                    <Building2 className="h-6 w-6 mb-2" />
                    <span className="text-sm">Add New Condo</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent warm-hover">
                    <Users className="h-6 w-6 mb-2" />
                    <span className="text-sm">User Management</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent warm-hover">
                    <BarChart3 className="h-6 w-6 mb-2" />
                    <span className="text-sm">Generate Reports</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent warm-hover">
                    <Settings className="h-6 w-6 mb-2" />
                    <span className="text-sm">System Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
