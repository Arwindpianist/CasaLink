"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Calculator, DollarSign, Building, Plus } from "lucide-react"

interface PricingCalculatorProps {
  totalUnits: number
  onUnitsChange: (units: number) => void
  addons: {
    premiumAds: boolean
    whiteLabel: boolean
    advancedAnalytics: boolean
    prioritySupport: boolean
  }
  onAddonChange: (addon: string, value: boolean) => void
  className?: string
}

const ADDON_PRICES = {
  premiumAds: 50,
  whiteLabel: 300,
  advancedAnalytics: 199,
  prioritySupport: 299
}

const ADDON_DETAILS = {
  premiumAds: {
    name: "Premium Ads",
    description: "Community board advertising",
    price: 50
  },
  whiteLabel: {
    name: "White-Label Branding",
    description: "Custom branding & identity",
    price: 300
  },
  advancedAnalytics: {
    name: "Advanced Analytics",
    description: "Detailed insights & reporting",
    price: 199
  },
  prioritySupport: {
    name: "Priority Support",
    description: "Enterprise support SLA",
    price: 299
  }
}

export function PricingCalculator({
  totalUnits,
  onUnitsChange,
  addons,
  onAddonChange,
  className = ""
}: PricingCalculatorProps) {
  const [units, setUnits] = useState(totalUnits.toString())

  useEffect(() => {
    setUnits(totalUnits.toString())
  }, [totalUnits])

  const handleUnitsChange = (value: string) => {
    const numValue = parseInt(value) || 0
    setUnits(value)
    onUnitsChange(numValue)
  }

  // Calculate pricing based on formula: RM199 + (RM1.50 × units) + add-ons
  const basePrice = 199
  const pricePerUnit = 1.50
  const unitsCost = totalUnits * pricePerUnit
  const addonsCost = Object.entries(addons).reduce((total, [key, enabled]) => {
    return enabled ? total + ADDON_PRICES[key as keyof typeof ADDON_PRICES] : total
  }, 0)
  
  const totalMonthlyCost = basePrice + unitsCost + addonsCost

  // Calculate discount for larger properties
  const getDiscountText = () => {
    if (totalUnits >= 500) return "20% discount for 500+ units"
    if (totalUnits >= 200) return "15% discount for 200+ units"
    if (totalUnits >= 100) return "10% discount for 100+ units"
    return null
  }

  const discount = totalUnits >= 100 ? Math.min(20, Math.floor(totalUnits / 50) * 2) : 0
  const discountedTotal = totalMonthlyCost * (1 - discount / 100)

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5" />
          Pricing Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pricing Formula Display */}
        <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="text-sm text-muted-foreground mb-2">Pricing Formula</div>
          <div className="text-lg font-semibold">
            RM{basePrice} + (RM{pricePerUnit} × units) + add-ons
          </div>
        </div>

        {/* Units Input */}
        <div className="space-y-2">
          <Label htmlFor="units" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Number of Units/Rooms
          </Label>
          <Input
            id="units"
            type="number"
            value={units}
            onChange={(e) => handleUnitsChange(e.target.value)}
            min="1"
            max="2000"
            placeholder="Enter number of units..."
          />
          <div className="text-xs text-muted-foreground">
            For condos, apartments, hotels, offices, or shops
          </div>
        </div>

        {/* Add-ons Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <Label className="text-sm font-medium">Optional Enhancements</Label>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(ADDON_DETAILS).map(([key, addon]) => (
              <div key={key} className="flex items-center space-x-3 p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={key}
                  checked={addons[key as keyof typeof addons]}
                  onCheckedChange={(checked) => onAddonChange(key, !!checked)}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={key} className="text-sm font-medium cursor-pointer">
                      {addon.name}
                    </Label>
                    <Badge variant="secondary" className="text-xs">
                      RM{addon.price}/mo
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {addon.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3">
          <div className="text-sm font-medium">Price Breakdown</div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Base fee</span>
              <span>RM{basePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Units ({totalUnits} × RM{pricePerUnit})</span>
              <span>RM{unitsCost.toFixed(2)}</span>
            </div>
            {addonsCost > 0 && (
              <div className="flex justify-between">
                <span>Add-ons</span>
                <span>RM{addonsCost.toFixed(2)}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({discount}%)</span>
                <span>-RM{(totalMonthlyCost - discountedTotal).toFixed(2)}</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total Monthly Cost</span>
              <span className="text-primary">RM{discountedTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Final Price Display */}
        <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
          <div className="text-3xl font-bold text-primary mb-2">
            RM{discountedTotal.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground mb-3">per month</div>
          
          {getDiscountText() && (
            <div className="text-sm text-green-600 font-medium">
              {getDiscountText()}
            </div>
          )}
        </div>

        {/* Comparison */}
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">vs Traditional Systems</div>
          <div className="text-lg font-semibold text-green-600">
            Save {Math.round(((2000 - discountedTotal) / 2000) * 100)}%
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
