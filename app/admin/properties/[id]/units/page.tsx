"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import { UnitManagementTabs } from "@/components/admin/unit-management/unit-management-tabs"
import { toast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

interface Property {
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
  total_units?: number
}

export default function PropertyUnitsPage() {
  const params = useParams()
  const router = useRouter()
  const propertyId = params.id as string
  
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (propertyId) {
      loadProperty()
    }
  }, [propertyId])

  const loadProperty = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/condominiums/${propertyId}`)
      if (!response.ok) {
        throw new Error('Failed to load property')
      }
      
      const data = await response.json()
      setProperty(data.condominium)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load property",
        variant: "destructive"
      })
      router.push('/admin')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    await loadProperty()
    toast({
      title: "Refreshed",
      description: "Property data has been refreshed."
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Property Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The property you're looking for doesn't exist or you don't have access to it.
              </p>
              <Button onClick={() => router.push('/admin')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/admin?tab=units')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Unit Management
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{property.name}</h1>
            <p className="text-muted-foreground">
              {property.address}, {property.city}{property.state && `, ${property.state}`}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </motion.div>

      {/* Unit Management Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <UnitManagementTabs
          condoId={property.id}
          condoName={property.name}
        />
      </motion.div>
    </div>
  )
}
