"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/hooks/use-toast"
import { AlertTriangle, Trash2 } from "lucide-react"

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

interface CondominiumDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  condominium: Condominium | null
  onSuccess: () => void
}

export function CondominiumDeleteDialog({ 
  open, 
  onOpenChange, 
  condominium,
  onSuccess 
}: CondominiumDeleteDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!condominium) return

    setLoading(true)
    try {
      const response = await fetch(`/api/condominiums/${condominium.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete condominium')
      }

      const result = await response.json()
      
      toast({
        title: "Condominium deleted",
        description: result.message,
      })

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete condominium",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!condominium) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Delete Condominium
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the condominium and all associated data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Warning:</strong> Deleting "{condominium.name}" will permanently remove:
              <ul className="mt-2 ml-4 list-disc space-y-1">
                <li>All user accounts and profiles</li>
                <li>All units and resident assignments</li>
                <li>All visitor records and QR codes</li>
                <li>All amenity bookings and reservations</li>
                <li>All chat messages and community posts</li>
                <li>All access logs and analytics data</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Condominium Details</h4>
            <div className="text-sm space-y-1 text-muted-foreground">
              <p><strong>Name:</strong> {condominium.name}</p>
              <p><strong>Type:</strong> {condominium.type}</p>
              <p><strong>Address:</strong> {condominium.address}</p>
              <p><strong>Plan:</strong> {condominium.subscription_plan}</p>
              <p><strong>Revenue:</strong> RM{condominium.monthly_revenue}/month</p>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> If there are active users associated with this condominium, 
              the deletion will be prevented to protect data integrity.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Condominium'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
