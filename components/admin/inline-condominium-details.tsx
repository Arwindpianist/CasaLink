"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Users, 
  Calendar,
  X,
  Edit,
  Trash2,
  Crown,
  BarChart3,
  Settings,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Condominium {
  id: string
  name: string
  type: string
  address: string
  city: string
  state?: string
  country?: string
  postal_code?: string
  monthly_revenue: number
  total_units: number
  base_price: number
  price_per_unit: number
  addon_premium_ads: boolean
  addon_white_label: boolean
  addon_advanced_analytics: boolean
  addon_priority_support: boolean
  addon_premium_ads_price: number
  addon_white_label_price: number
  addon_advanced_analytics_price: number
  addon_priority_support_price: number
  calculated_monthly_total: number
  created_at: string
  updated_at: string
}

interface InlineCondominiumDetailsProps {
  condominium: Condominium
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
}

export function InlineCondominiumDetails({ 
  condominium, 
  onEdit, 
  onDelete, 
  onClose 
}: InlineCondominiumDetailsProps) {

  const getSubscriptionTier = () => {
    if (condominium.addon_priority_support) return 'Enterprise'
    if (condominium.addon_advanced_analytics || condominium.addon_white_label) return 'Professional'
    if (condominium.addon_premium_ads) return 'Standard'
    return 'Basic'
  }

  const getActiveAddons = () => {
    const addons = []
    if (condominium.addon_premium_ads) {
      addons.push({ name: 'Premium Ads', price: condominium.addon_premium_ads_price })
    }
    if (condominium.addon_white_label) {
      addons.push({ name: 'White-Label Branding', price: condominium.addon_white_label_price })
    }
    if (condominium.addon_advanced_analytics) {
      addons.push({ name: 'Advanced Analytics', price: condominium.addon_advanced_analytics_price })
    }
    if (condominium.addon_priority_support) {
      addons.push({ name: 'Priority Support', price: condominium.addon_priority_support_price })
    }
    return addons
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Enterprise': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'Professional': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Standard': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{condominium.name}</h2>
            <p className="text-sm text-muted-foreground">
              {condominium.type.charAt(0).toUpperCase() + condominium.type.slice(1)} • {condominium.city}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onEdit}
            className="border-2 hover:border-primary/50 hover:text-primary"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onDelete}
            className="border-2 hover:border-destructive/50 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="hover:bg-destructive/10 hover:text-destructive border border-transparent hover:border-destructive/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card className="border-2 border-border/50 hover:border-primary/20 transition-colors">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Property Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Address:</span>
              </div>
              <p className="text-sm ml-6">{condominium.address}</p>
              
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Type:</span>
              </div>
              <p className="text-sm ml-6 capitalize">{condominium.type}</p>
              
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Units:</span>
              </div>
              <p className="text-sm ml-6">{condominium.total_units.toLocaleString()} units</p>
              
              {condominium.postal_code && (
                <>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Postal Code:</span>
                  </div>
                  <p className="text-sm ml-6">{condominium.postal_code}</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pricing Information */}
        <Card className="border-2 border-border/50 hover:border-primary/20 transition-colors">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing & Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-xl font-bold text-primary">
                  RM{condominium.monthly_revenue.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Monthly Cost</div>
              </div>
              
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-lg font-semibold">
                  {getSubscriptionTier()}
                </div>
                <div className="text-xs text-muted-foreground">Service Tier</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Base Pricing:</span>
              </div>
              <p className="text-sm ml-6">
                RM{condominium.base_price.toFixed(2)} + RM{condominium.price_per_unit.toFixed(2)} × {condominium.total_units} units
              </p>
              
              {getActiveAddons().length > 0 && (
                <>
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Active Add-ons:</span>
                  </div>
                  <div className="ml-6 space-y-1">
                    {getActiveAddons().map((addon, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-sm">{addon.name} (+RM{addon.price}/mo)</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information */}
      <Card className="border-2 border-border/50 hover:border-primary/20 transition-colors">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Additional Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Created:</span>
              </div>
              <p className="text-sm ml-6">{formatDate(condominium.created_at)}</p>
              
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Last Updated:</span>
              </div>
              <p className="text-sm ml-6">{formatDate(condominium.updated_at)}</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Calculated Total:</span>
              </div>
              <p className="text-sm ml-6">RM{condominium.calculated_monthly_total.toLocaleString()}</p>
              
              <div className="flex items-center gap-2">
                <Badge className={cn("text-xs", getTierColor(getSubscriptionTier()))}>
                  {getSubscriptionTier()} Plan
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
