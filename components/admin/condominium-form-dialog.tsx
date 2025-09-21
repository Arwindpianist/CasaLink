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
}

interface CondominiumFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  condominium?: Condominium | null
  onSuccess: () => void
}

const SUBSCRIPTION_PLANS = [
  { value: 'basic', label: 'Basic', price: 0, features: ['Basic features', 'Up to 50 units'] },
  { value: 'professional', label: 'Professional', price: 99, features: ['Advanced features', 'Up to 200 units', 'Analytics'] },
  { value: 'enterprise', label: 'Enterprise', price: 299, features: ['All features', 'Unlimited units', 'Priority support', 'Custom integrations'] }
]

const CONDOMINIUM_TYPES = [
  { value: 'condo', label: 'Condominium' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'office', label: 'Office Building' }
]

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
  { value: 'trial', label: 'Trial', color: 'bg-blue-100 text-blue-800' },
  { value: 'suspended', label: 'Suspended', color: 'bg-red-100 text-red-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-gray-100 text-gray-800' }
]

export function CondominiumFormDialog({ 
  open, 
  onOpenChange, 
  condominium, 
  onSuccess 
}: CondominiumFormDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'condo',
    address: '',
    city: '',
    state: '',
    country: 'Malaysia',
    postal_code: '',
    subscription_plan: 'basic',
    monthly_revenue: 0,
    status: 'active'
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
          subscription_plan: condominium.subscription_plan || 'basic',
          monthly_revenue: condominium.monthly_revenue || 0,
          status: condominium.status || 'active'
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
          subscription_plan: 'basic',
          monthly_revenue: 0,
          status: 'active'
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

    if (formData.monthly_revenue < 0) {
      newErrors.monthly_revenue = 'Monthly revenue cannot be negative'
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

  const selectedPlan = SUBSCRIPTION_PLANS.find(plan => plan.value === formData.subscription_plan)

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

          {/* Subscription & Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Subscription & Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subscription_plan">Subscription Plan</Label>
                  <Select 
                    value={formData.subscription_plan} 
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      subscription_plan: value,
                      monthly_revenue: SUBSCRIPTION_PLANS.find(p => p.value === value)?.price || 0
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBSCRIPTION_PLANS.map((plan) => (
                        <SelectItem key={plan.value} value={plan.value}>
                          <div className="flex items-center justify-between w-full">
                            <span>{plan.label}</span>
                            <span className="text-muted-foreground">RM{plan.price}/mo</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthly_revenue">Monthly Revenue (RM)</Label>
                  <Input
                    id="monthly_revenue"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.monthly_revenue}
                    onChange={(e) => setFormData(prev => ({ ...prev, monthly_revenue: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                    className={errors.monthly_revenue ? 'border-red-500' : ''}
                  />
                  {errors.monthly_revenue && (
                    <p className="text-sm text-red-500">{errors.monthly_revenue}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          <div className="flex items-center gap-2">
                            <Badge className={status.color}>{status.label}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Plan Details */}
              {selectedPlan && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">{selectedPlan.label} Plan</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    RM{selectedPlan.price}/month
                  </p>
                  <ul className="text-sm space-y-1">
                    {selectedPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

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
