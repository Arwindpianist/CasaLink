"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Users, 
  UserCheck, 
  Eye, 
  Settings, 
  MessageSquare,
  Building2,
  QrCode,
  ArrowRight
} from 'lucide-react'
import { ClerkLogin, ClerkAuthButtons } from '@/components/auth/clerk-login'
import { SignedIn, SignedOut } from '@clerk/nextjs'

const ROLE_INFO = {
  platform_admin: {
    icon: Shield,
    title: 'Platform Admin',
    description: 'Full system access across all condominiums',
    color: 'bg-red-500',
    features: ['Global Analytics', 'System Management', 'All Condos Access']
  },
  management: {
    icon: Settings,
    title: 'Management',
    description: 'Property management and resident oversight',
    color: 'bg-blue-500',
    features: ['Resident Management', 'Amenity Control', 'Reports']
  },
  security: {
    icon: Shield,
    title: 'Security',
    description: 'QR verification and visitor management',
    color: 'bg-green-500',
    features: ['QR Scanning', 'Visitor Approval', 'Access Logs']
  },
  resident: {
    icon: Users,
    title: 'Resident',
    description: 'Community features and amenity booking',
    color: 'bg-purple-500',
    features: ['QR Generation', 'Community Chat', 'Amenity Booking']
  },
  visitor: {
    icon: Eye,
    title: 'Visitor',
    description: 'Temporary access with QR codes',
    color: 'bg-orange-500',
    features: ['QR Access', 'Status Checking', 'Amenity Access']
  },
  moderator: {
    icon: MessageSquare,
    title: 'Moderator',
    description: 'Community content moderation',
    color: 'bg-pink-500',
    features: ['Content Moderation', 'Chat Monitoring', 'Event Coordination']
  }
}

export default function LoginPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border glass-header">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img 
                src="/casalink-favicon/favicon-32x32.png" 
                alt="CasaLink Logo" 
                className="h-8 w-8"
              />
              <span className="text-xl font-bold text-foreground font-premium">CasaLink</span>
            </div>
            <div className="flex items-center space-x-2">
              <ClerkAuthButtons />
              <Button variant="outline" asChild>
                <a href="/">Back to Home</a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <SignedOut>
        <ClerkLogin />
      </SignedOut>
      
      <SignedIn>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Welcome to CasaLink
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
                You are successfully signed in! Choose your role to access the appropriate dashboard.
              </p>
              <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-lg">
                <QrCode className="h-4 w-4" />
                <span className="text-sm font-medium">Select your role below</span>
              </div>
            </div>

            {/* Role Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(ROLE_INFO).map(([role, info]) => {
                const Icon = info.icon
                
                const handleRoleSelection = () => {
                  // Redirect to role-specific dashboard
                  const defaultPaths = {
                    platform_admin: '/admin',
                    management: '/admin',
                    security: '/security',
                    resident: '/resident',
                    visitor: '/visitor',
                    moderator: '/resident'
                  }
                  
                  const redirectPath = defaultPaths[role as keyof typeof defaultPaths] || '/demo'
                  router.push(redirectPath)
                }
                
                return (
                  <Card key={role} className="hover:shadow-lg transition-shadow duration-300 rounded-xl cursor-pointer" onClick={handleRoleSelection}>
                    <CardHeader>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`w-12 h-12 ${info.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{info.title}</CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            CasaLink Role
                          </Badge>
                        </div>
                      </div>
                      <CardDescription className="text-sm">
                        {info.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <button
                          onClick={handleRoleSelection}
                          className="w-full p-3 bg-primary/5 hover:bg-primary/10 border border-primary/20 hover:border-primary/30 rounded-xl transition-all duration-200 group backdrop-blur-sm hover:backdrop-blur-md hover:shadow-md"
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-left">
                              <p className="text-sm font-medium text-primary group-hover:text-primary/80">
                                Access {info.title} Dashboard
                              </p>
                              <p className="text-sm text-primary font-mono">
                                Click to continue
                              </p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                          </div>
                        </button>
                        
                        <div>
                          <p className="text-sm font-medium text-foreground mb-2">Key Features:</p>
                          <ul className="space-y-1">
                            {info.features.map((feature, idx) => (
                              <li key={idx} className="text-xs text-muted-foreground flex items-center">
                                <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Additional Info */}
            <div className="mt-12 text-center">
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>CasaLink Platform</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    CasaLink provides role-based access control for condominium management. 
                    Each role has different permissions and access levels to ensure 
                    proper security and functionality.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge variant="outline">Secure Authentication</Badge>
                    <Badge variant="outline">Role-based Access</Badge>
                    <Badge variant="outline">QR Code Management</Badge>
                    <Badge variant="outline">Real-time Features</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SignedIn>
    </div>
  )
}
