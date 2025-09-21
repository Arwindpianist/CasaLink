"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  X, 
  Save, 
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { PricingCalculator } from "./pricing-calculator"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

interface Condominium {
  id: string
  name: string
  type: string
  address: string
  city: string
  state?: string
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

interface InlineCondominiumFormProps {
  condominium?: Condominium | null
  onSuccess: () => void
  onCancel: () => void
  mode: 'create' | 'edit'
}

const CONDOMINIUM_TYPES = [
  { value: 'condo', label: 'Condominium' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'office', label: 'Office Building' }
]

export function InlineCondominiumForm({ 
  condominium, 
  onSuccess, 
  onCancel, 
  mode 
}: InlineCondominiumFormProps) {
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'condo',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    monthly_revenue: 0,
    total_units: 0,
    base_price: 199,
    price_per_unit: 1.50,
    addon_premium_ads: false,
    addon_white_label: false,
    addon_advanced_analytics: false,
    addon_priority_support: false,
    addon_premium_ads_price: 50,
    addon_white_label_price: 300,
    addon_advanced_analytics_price: 199,
    addon_priority_support_price: 299,
    calculated_monthly_total: 0
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize form data
  useEffect(() => {
    if (condominium && mode === 'edit') {
        setFormData({
          name: condominium.name || '',
          type: condominium.type || 'condo',
          address: condominium.address || '',
          city: condominium.city || '',
          state: condominium.state || '',
          postal_code: condominium.postal_code || '',
          monthly_revenue: condominium.monthly_revenue || 0,
          total_units: condominium.total_units || 0,
          base_price: condominium.base_price || 199,
          price_per_unit: condominium.price_per_unit || 1.50,
          addon_premium_ads: condominium.addon_premium_ads || false,
          addon_white_label: condominium.addon_white_label || false,
          addon_advanced_analytics: condominium.addon_advanced_analytics || false,
          addon_priority_support: condominium.addon_priority_support || false,
          addon_premium_ads_price: condominium.addon_premium_ads_price || 50,
          addon_white_label_price: condominium.addon_white_label_price || 300,
          addon_advanced_analytics_price: condominium.addon_advanced_analytics_price || 199,
          addon_priority_support_price: condominium.addon_priority_support_price || 299,
          calculated_monthly_total: condominium.calculated_monthly_total || 0
        })
    }
  }, [condominium, mode])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Property name is required'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }

    if (formData.total_units < 0) {
      newErrors.total_units = 'Number of units cannot be negative'
    } else if (formData.total_units === 0) {
      newErrors.total_units = 'Number of units is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const url = mode === 'create' ? '/api/condominiums' : `/api/condominiums/${condominium?.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save condominium')
      }

      toast({
        title: "Success!",
        description: `Condominium ${mode === 'create' ? 'created' : 'updated'} successfully.`,
      })

      onSuccess()
    } catch (error) {
      console.error('Error saving condominium:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to save condominium',
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Helper functions
  const getSubscriptionTier = () => {
    if (formData.addon_priority_support) return 'Enterprise'
    if (formData.addon_advanced_analytics || formData.addon_white_label) return 'Professional'
    if (formData.addon_premium_ads) return 'Standard'
    return 'Basic'
  }

  const getActiveAddons = () => {
    const addons = []
    if (formData.addon_premium_ads) {
      addons.push({ name: 'Premium Ads', price: formData.addon_premium_ads_price })
    }
    if (formData.addon_white_label) {
      addons.push({ name: 'White-Label Branding', price: formData.addon_white_label_price })
    }
    if (formData.addon_advanced_analytics) {
      addons.push({ name: 'Advanced Analytics', price: formData.addon_advanced_analytics_price })
    }
    if (formData.addon_priority_support) {
      addons.push({ name: 'Priority Support', price: formData.addon_priority_support_price })
    }
    return addons
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
            <h2 className="text-xl font-semibold">
              {mode === 'create' ? 'Add New Property' : 'Edit Property'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {mode === 'create' 
                ? 'Create a new property and configure its pricing' 
                : 'Update property information and pricing'
              }
            </p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onCancel}
          className="hover:bg-destructive/10 hover:text-destructive border border-transparent hover:border-destructive/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Separator />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card className="border-2 border-border/50 hover:border-primary/20 transition-colors">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Property Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter property name..."
                  className={cn(
                    "border-2 transition-colors focus:border-primary",
                    errors.name ? 'border-destructive' : 'border-border hover:border-primary/50'
                  )}
                />
                {errors.name && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">
                  Property Type
                </Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger className="border-2 hover:border-primary/50 focus:border-primary transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONDOMINIUM_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address" className="text-sm font-medium">
                  Address *
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter full address..."
                  className={cn(
                    "border-2 transition-colors focus:border-primary",
                    errors.address ? 'border-destructive' : 'border-border hover:border-primary/50'
                  )}
                />
                {errors.address && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.address}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">
                  City *
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Enter city..."
                  className={cn(
                    "border-2 transition-colors focus:border-primary",
                    errors.city ? 'border-destructive' : 'border-border hover:border-primary/50'
                  )}
                />
                {errors.city && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.city}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="postal_code" className="text-sm font-medium">
                  Postal Code
                </Label>
                <Input
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, postal_code: e.target.value }))}
                  placeholder="12345"
                  className="border-2 border-border hover:border-primary/50 focus:border-primary transition-colors"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Calculator */}
        <Card className="border-2 border-border/50 hover:border-primary/20 transition-colors">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing & Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PricingCalculator
              totalUnits={formData.total_units}
              onUnitsChange={(units) => setFormData(prev => ({ 
                ...prev, 
                total_units: units,
                monthly_revenue: 199 + (units * 1.50) + 
                  (prev.addon_premium_ads ? prev.addon_premium_ads_price : 0) +
                  (prev.addon_white_label ? prev.addon_white_label_price : 0) +
                  (prev.addon_advanced_analytics ? prev.addon_advanced_analytics_price : 0) +
                  (prev.addon_priority_support ? prev.addon_priority_support_price : 0)
              }))}
              addons={{
                premiumAds: formData.addon_premium_ads,
                whiteLabel: formData.addon_white_label,
                advancedAnalytics: formData.addon_advanced_analytics,
                prioritySupport: formData.addon_priority_support
              }}
              onAddonChange={(addon, value) => {
                const addonKey = `addon_${addon}` as keyof typeof formData
                setFormData(prev => ({
                  ...prev,
                  [addonKey]: value,
                  monthly_revenue: prev.monthly_revenue + (value ? 
                    (addon === 'premiumAds' ? prev.addon_premium_ads_price :
                     addon === 'whiteLabel' ? prev.addon_white_label_price :
                     addon === 'advancedAnalytics' ? prev.addon_advanced_analytics_price :
                     prev.addon_priority_support_price) : 
                    -(addon === 'premiumAds' ? prev.addon_premium_ads_price :
                      addon === 'whiteLabel' ? prev.addon_white_label_price :
                      addon === 'advancedAnalytics' ? prev.addon_advanced_analytics_price :
                      prev.addon_priority_support_price))
                }))
              }}
            />
          </CardContent>
        </Card>

        {/* Pricing Summary */}
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-background rounded-lg border border-border/50">
                <div className="text-2xl font-bold text-primary">
                  RM{formData.monthly_revenue.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Monthly Cost</div>
              </div>
              
              <div className="text-center p-4 bg-background rounded-lg border border-border/50">
                <div className="text-lg font-semibold">
                  {formData.total_units} Units
                </div>
                <div className="text-sm text-muted-foreground">Total Capacity</div>
              </div>
              
              <div className="text-center p-4 bg-background rounded-lg border border-border/50">
                <div className="text-lg font-semibold">
                  {getSubscriptionTier()}
                </div>
                <div className="text-sm text-muted-foreground">Service Tier</div>
              </div>
            </div>

            {getActiveAddons().length > 0 && (
              <div className="mt-6 p-4 bg-background rounded-lg border border-border/50">
                <h4 className="font-medium mb-3 text-primary">Active Add-ons</h4>
                <div className="flex flex-wrap gap-2">
                  {getActiveAddons().map((addon, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {addon.name} (+RM{addon.price}/mo)
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="border-2 hover:border-destructive/50 hover:text-destructive"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="border-2 border-primary hover:border-primary/80 bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {mode === 'create' ? 'Create Property' : 'Update Property'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
