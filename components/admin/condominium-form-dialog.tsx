"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { Building2, MapPin, DollarSign, Settings } from "lucide-react"
import { PricingCalculator } from "./pricing-calculator"

interface Condominium {
  id: string
  name: string
  type: string
  address: string
  city?: string
  state?: string
  country: string
  postal_code?: string
  subscription_plan: string
  monthly_revenue: number
  status: string
  settings: Record<string, any>
  created_at: string
  updated_at: string
  // New pricing fields
  total_units?: number
  base_price?: number
  price_per_unit?: number
  addon_premium_ads?: boolean
  addon_white_label?: boolean
  addon_advanced_analytics?: boolean
  addon_priority_support?: boolean
  addon_premium_ads_price?: number
  addon_white_label_price?: number
  addon_advanced_analytics_price?: number
  addon_priority_support_price?: number
  calculated_monthly_total?: number
}

interface CondominiumFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  condominium?: Condominium | null
  onSuccess: () => void
}

const CONDOMINIUM_TYPES = [
  { value: 'condo', label: 'Condominium' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'office', label: 'Office Building' }
]

export function CondominiumFormDialog({ 
  open, 
  onOpenChange, 
  condominium, 
  onSuccess 
}: CondominiumFormDialogProps) {
  
  // Helper function to determine subscription tier based on add-ons
  const getSubscriptionTier = () => {
    if (formData.addon_priority_support) return 'Enterprise'
    if (formData.addon_advanced_analytics || formData.addon_white_label) return 'Professional'
    if (formData.addon_premium_ads) return 'Standard'
    return 'Basic'
  }

  // Helper function to get active add-ons
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
  const [formData, setFormData] = useState({
    name: '',
    type: 'condo',
    address: '',
    city: '',
    state: '',
    country: 'Malaysia',
    postal_code: '',
    monthly_revenue: 0,
    // New pricing fields
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

  // Reset form when dialog opens/closes or condominium changes
  useEffect(() => {
    if (open) {
      if (condominium) {
        setFormData({
          name: condominium.name || '',
          type: condominium.type || 'condo',
          address: condominium.address || '',
          city: condominium.city || '',
          state: condominium.state || '',
          country: condominium.country || 'Malaysia',
          postal_code: condominium.postal_code || '',
          monthly_revenue: condominium.monthly_revenue || 0,
          // New pricing fields
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
      } else {
        setFormData({
          name: '',
          type: 'condo',
          address: '',
          city: '',
          state: '',
          country: 'Malaysia',
          postal_code: '',
          monthly_revenue: 0,
          // New pricing fields with defaults
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
      }
    }
  }, [open, condominium])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    } else if (formData.address.trim().length < 5) {
      newErrors.address = 'Address must be at least 5 characters'
    }

    if (formData.city && formData.city.length < 2) {
      newErrors.city = 'City must be at least 2 characters'
    }

    if (formData.postal_code && !/^\d{5}$/.test(formData.postal_code)) {
      newErrors.postal_code = 'Postal code must be 5 digits'
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
      const url = condominium 
        ? `/api/condominiums/${condominium.id}`
        : '/api/condominiums'
      
      const method = condominium ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save condominium')
      }

      const result = await response.json()
      
      toast({
        title: condominium ? "Condominium updated" : "Condominium created",
        description: condominium 
          ? `Successfully updated ${result.condominium.name}`
          : `Successfully created ${result.condominium.name}`,
      })

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save condominium",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {condominium ? 'Edit Condominium' : 'Add New Condominium'}
          </DialogTitle>
          <DialogDescription>
            {condominium 
              ? 'Update the condominium information and settings.'
              : 'Create a new condominium with basic information and subscription plan.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Pavilion Residences"
                    required
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
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

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Full address including street, building name, etc."
                    required
                    rows={3}
                    className={errors.address ? 'border-red-500' : ''}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500">{errors.address}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Location Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="e.g., Kuala Lumpur"
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && (
                    <p className="text-sm text-red-500">{errors.city}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="e.g., Federal Territory"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    placeholder="e.g., Malaysia"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input
                    id="postal_code"
                    value={formData.postal_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, postal_code: e.target.value }))}
                    placeholder="e.g., 50450"
                    className={errors.postal_code ? 'border-red-500' : ''}
                  />
                  {errors.postal_code && (
                    <p className="text-sm text-red-500">{errors.postal_code}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Pricing Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    RM{formData.monthly_revenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Monthly Cost</div>
                </div>
                
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-lg font-semibold">
                    {formData.total_units} Units
                  </div>
                  <div className="text-sm text-muted-foreground">Total Capacity</div>
                </div>
                
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-lg font-semibold">
                    {getSubscriptionTier()}
                  </div>
                  <div className="text-sm text-muted-foreground">Service Tier</div>
                </div>
              </div>

              {/* Active Add-ons */}
              {getActiveAddons().length > 0 && (
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
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

          {/* Pricing Calculator */}
          <PricingCalculator
            totalUnits={formData.total_units}
            onUnitsChange={(units) => setFormData(prev => ({ 
              ...prev, 
              total_units: units,
              monthly_revenue: prev.base_price + (prev.price_per_unit * units) + 
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
              const addonKey = addon === 'premiumAds' ? 'addon_premium_ads' :
                             addon === 'whiteLabel' ? 'addon_white_label' :
                             addon === 'advancedAnalytics' ? 'addon_advanced_analytics' :
                             'addon_priority_support'
              
              setFormData(prev => {
                const newData = { ...prev, [addonKey]: value }
                // Recalculate monthly revenue
                const addonsCost = 
                  (newData.addon_premium_ads ? newData.addon_premium_ads_price : 0) +
                  (newData.addon_white_label ? newData.addon_white_label_price : 0) +
                  (newData.addon_advanced_analytics ? newData.addon_advanced_analytics_price : 0) +
                  (newData.addon_priority_support ? newData.addon_priority_support_price : 0)
                
                newData.monthly_revenue = newData.base_price + (newData.price_per_unit * newData.total_units) + addonsCost
                return newData
              })
            }}
            className="w-full"
          />

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (condominium ? 'Update' : 'Create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
