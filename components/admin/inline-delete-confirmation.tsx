"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  AlertTriangle, 
  X, 
  Trash2, 
  Loader2,
  Building2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

interface Condominium {
  id: string
  name: string
  type: string
  address: string
  city: string
  monthly_revenue: number
  total_units: number
}

interface InlineDeleteConfirmationProps {
  condominium: Condominium
  onConfirm: () => void
  onCancel: () => void
}

export function InlineDeleteConfirmation({ 
  condominium, 
  onConfirm, 
  onCancel 
}: InlineDeleteConfirmationProps) {
  const [confirmText, setConfirmText] = useState('')
  const [loading, setLoading] = useState(false)
  
  const expectedText = condominium.name
  const isConfirmed = confirmText === expectedText

  const handleDelete = async () => {
    if (!isConfirmed) {
      toast({
        title: "Confirmation Required",
        description: "Please type the property name exactly as shown to confirm deletion.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch(`/api/condominiums/${condominium.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete condominium')
      }

      toast({
        title: "Success!",
        description: "Property deleted successfully.",
      })

      onConfirm()
    } catch (error) {
      console.error('Error deleting condominium:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to delete property',
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-destructive/10 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-destructive">Delete Property</h2>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone
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

      {/* Warning Card */}
      <Card className="border-2 border-destructive/20 bg-destructive/5">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Warning: Permanent Deletion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">You are about to permanently delete:</p>
            <div className="p-3 bg-background rounded-lg border border-border/50">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{condominium.name}</span>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                {condominium.type.charAt(0).toUpperCase() + condominium.type.slice(1)} • {condominium.city}
              </p>
              <p className="text-sm text-muted-foreground ml-6">
                {condominium.total_units} units • RM{condominium.monthly_revenue.toLocaleString()}/month
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-destructive">
              This will permanently remove:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• All property data and configuration</li>
              <li>• Pricing and subscription information</li>
              <li>• Associated user accounts and permissions</li>
              <li>• All historical data and analytics</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Input */}
      <Card className="border-2 border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Confirm Deletion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="confirm-text" className="text-sm font-medium">
              Type <span className="font-bold text-destructive">{expectedText}</span> to confirm:
            </Label>
            <Input
              id="confirm-text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={`Type "${expectedText}" here...`}
              className={cn(
                "border-2 transition-colors focus:border-destructive",
                isConfirmed ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'border-border hover:border-destructive/50'
              )}
            />
            {isConfirmed && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                ✓ Confirmation text matches
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="border-2 hover:border-primary/50 hover:text-primary"
        >
          Cancel
        </Button>
        <Button 
          type="button" 
          variant="destructive"
          onClick={handleDelete}
          disabled={!isConfirmed || loading}
          className="border-2 border-destructive hover:border-destructive/80"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Property
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
