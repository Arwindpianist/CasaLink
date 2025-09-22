"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { 
  Settings, 
  Grid3X3, 
  Users, 
  Mail,
  Building2,
  Plus,
  RefreshCw,
  AlertCircle
} from "lucide-react"
import { motion } from "framer-motion"
import { UnitQuestionnaire } from "./unit-questionnaire"
import { UnitGridVisualization } from "./unit-grid-visualization"
import { ManagerAssignmentDialog } from "./manager-assignment-dialog"
import { ResidentEmailLinking } from "./resident-email-linking"
import { 
  PropertyConfiguration, 
  Unit, 
  PropertyManager 
} from "@/lib/types/unit-management"

interface UnitManagementTabsProps {
  condoId: string
  condoName: string
}

export function UnitManagementTabs({
  condoId,
  condoName
}: UnitManagementTabsProps) {
  const [activeTab, setActiveTab] = useState("configuration")
  const [loading, setLoading] = useState(false)
  const [configuration, setConfiguration] = useState<PropertyConfiguration | null>(null)
  const [units, setUnits] = useState<Unit[]>([])
  const [managers, setManagers] = useState<PropertyManager[]>([])
  
  // Dialog states
  const [questionnaireOpen, setQuestionnaireOpen] = useState(false)
  const [managerDialogOpen, setManagerDialogOpen] = useState(false)

  // Load initial data
  useEffect(() => {
    loadConfiguration()
    loadUnits()
    loadManagers()
  }, [condoId])

  const loadConfiguration = async () => {
    try {
      const response = await fetch(`/api/properties/configurations?condo_id=${condoId}`)
      if (!response.ok) throw new Error('Failed to load configuration')
      
      const data = await response.json()
      setConfiguration(data.configurations?.[0] || null)
    } catch (error) {
      console.error('Failed to load configuration:', error)
    }
  }

  const loadUnits = async () => {
    try {
      const response = await fetch(`/api/properties/${condoId}/units`)
      if (!response.ok) throw new Error('Failed to load units')
      
      const data = await response.json()
      setUnits(data.units || [])
    } catch (error) {
      console.error('Failed to load units:', error)
    }
  }

  const loadManagers = async () => {
    try {
      const response = await fetch(`/api/properties/${condoId}/managers`)
      if (!response.ok) throw new Error('Failed to load managers')
      
      const data = await response.json()
      setManagers(data.managers || [])
    } catch (error) {
      console.error('Failed to load managers:', error)
    }
  }

  const handleConfigurationComplete = async (newConfig: PropertyConfiguration) => {
    setConfiguration(newConfig)
    
    // Generate units from configuration
    setLoading(true)
    try {
      const response = await fetch(`/api/properties/${condoId}/units`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configuration_id: newConfig.id })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate units')
      }

      const data = await response.json()
      
      toast({
        title: "Units Generated",
        description: `${data.units_created} units have been created successfully.`
      })

      // Reload units
      await loadUnits()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate units",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUnitsUpdate = (updatedUnits: Unit[]) => {
    setUnits(updatedUnits)
  }

  const handleBulkExclude = async (unitNumbers: string[]) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/properties/${condoId}/units`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bulk_action: {
            action: 'exclude',
            unit_numbers: unitNumbers
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to exclude units')
      }

      toast({
        title: "Units Excluded",
        description: `${unitNumbers.length} units have been excluded.`
      })

      // Reload units
      await loadUnits()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to exclude units",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBulkInclude = async (unitNumbers: string[]) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/properties/${condoId}/units`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bulk_action: {
            action: 'include',
            unit_numbers: unitNumbers
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to include units')
      }

      toast({
        title: "Units Included",
        description: `${unitNumbers.length} units have been included.`
      })

      // Reload units
      await loadUnits()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to include units",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleManagersUpdate = (updatedManagers: PropertyManager[]) => {
    setManagers(updatedManagers)
  }

  const handleResidentsUpdate = (unitId: string, residents: any[]) => {
    // Update the units state to reflect resident changes
    setUnits(prev => prev.map(unit => 
      unit.id === unitId 
        ? { ...unit, resident_emails: residents.map(r => r.email) }
        : unit
    ))
  }

  const refreshAll = async () => {
    setLoading(true)
    try {
      await Promise.all([
        loadConfiguration(),
        loadUnits(),
        loadManagers()
      ])
      
      toast({
        title: "Data Refreshed",
        description: "All data has been refreshed successfully."
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusStats = () => {
    const total = units.length
    const excluded = units.filter(u => u.excluded).length
    const occupied = units.filter(u => u.status === 'occupied').length
    const vacant = units.filter(u => u.status === 'vacant').length
    const withResidents = units.filter(u => u.resident_emails.length > 0).length

    return { total, excluded, occupied, vacant, withResidents }
  }

  const stats = getStatusStats()

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Unit Management - {condoName}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Configure units, assign managers, and link residents
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={refreshAll}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              {!configuration && (
                <Button onClick={() => setQuestionnaireOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Configure Units
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Units</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.occupied}</div>
              <div className="text-sm text-muted-foreground">Occupied</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.vacant}</div>
              <div className="text-sm text-muted-foreground">Vacant</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.excluded}</div>
              <div className="text-sm text-muted-foreground">Excluded</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.withResidents}</div>
              <div className="text-sm text-muted-foreground">With Residents</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Status */}
      {!configuration && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-800">Configuration Required</p>
                <p className="text-sm text-orange-700">
                  This property needs to be configured before you can manage units.
                </p>
              </div>
              <Button 
                onClick={() => setQuestionnaireOpen(true)}
                className="ml-auto"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configure Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Tabs */}
      {configuration && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="configuration" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="units" className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              Units
            </TabsTrigger>
            <TabsTrigger value="managers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Managers
            </TabsTrigger>
            <TabsTrigger value="residents" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Residents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="configuration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Property Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">{configuration.blocks}</div>
                    <div className="text-sm text-muted-foreground">Blocks</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">{configuration.floors_per_block}</div>
                    <div className="text-sm text-muted-foreground">Floors per Block</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">{configuration.units_per_floor}</div>
                    <div className="text-sm text-muted-foreground">Units per Floor</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {configuration.naming_scheme.type} scheme
                  </Badge>
                  <Badge variant="outline">
                    {configuration.naming_scheme.format}
                  </Badge>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setQuestionnaireOpen(true)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Configuration
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="units" className="space-y-6">
            <UnitGridVisualization
              condoId={condoId}
              condoName={condoName}
              configuration={configuration}
              units={units}
              onUnitsUpdate={handleUnitsUpdate}
              onBulkExclude={handleBulkExclude}
              onBulkInclude={handleBulkInclude}
            />
          </TabsContent>

          <TabsContent value="managers" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Property Managers ({managers.length})
                  </CardTitle>
                  <Button onClick={() => setManagerDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Assign Manager
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {managers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No managers assigned to this property</p>
                    <p className="text-sm">Assign managers to enable property management features</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {managers.map((manager) => (
                      <Card key={manager.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <p className="font-medium">
                                {manager.user?.name || 'Pending Invitation'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {manager.user?.email}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline">{manager.role}</Badge>
                                <Badge variant={manager.is_active ? "default" : "secondary"}>
                                  {manager.is_active ? 'Active' : 'Pending'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="residents" className="space-y-6">
            <ResidentEmailLinking
              condoId={condoId}
              condoName={condoName}
              units={units}
              onResidentsUpdate={handleResidentsUpdate}
            />
          </TabsContent>
        </Tabs>
      )}

      {/* Dialogs */}
      <UnitQuestionnaire
        open={questionnaireOpen}
        condoId={condoId}
        condoName={condoName}
        onClose={() => setQuestionnaireOpen(false)}
        onComplete={handleConfigurationComplete}
        existingConfig={configuration}
      />

      <ManagerAssignmentDialog
        open={managerDialogOpen}
        condoId={condoId}
        condoName={condoName}
        onClose={() => setManagerDialogOpen(false)}
        onManagersUpdate={handleManagersUpdate}
        existingManagers={managers}
      />
    </div>
  )
}
