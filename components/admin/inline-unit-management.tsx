"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
  Building2,
  Users,
  Settings,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Grid3X3,
  UserPlus,
  UserMinus,
  Eye,
  EyeOff,
  Check,
  X,
  ArrowLeft,
  ArrowRight,
  Save,
  RefreshCw,
  Calendar,
  User
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface PropertyConfiguration {
  id: string
  condo_id: string
  blocks: number
  floors_per_block: number
  units_per_floor: number
  unit_types: Record<string, string>
  naming_scheme: Record<string, any>
  excluded_units: string[]
  created_at: string
}

interface Unit {
  id: string
  condo_id: string
  unit_number: string
  floor_number: number
  block_number?: string
  unit_type: string
  status: string
  excluded: boolean
  resident_emails: string[]
  notes?: string
  created_at: string
}

interface PropertyManager {
  id: string
  condo_id: string
  user_id: string
  role: string
  permissions: Record<string, any>
  is_active: boolean
  assigned_at: string
  user: {
    id: string
    name: string
    email: string
    phone?: string
  }
}

interface Condominium {
  id: string
  name: string
  address: string
  city?: string
  state?: string
  type: string
  status: string
  created_at: string
}

interface InlineUnitManagementProps {
  condominiums: Condominium[]
  onRefresh: () => void
}

export function InlineUnitManagement({ condominiums, onRefresh }: InlineUnitManagementProps) {
  const [selectedProperty, setSelectedProperty] = useState<Condominium | null>(null)
  const [configurations, setConfigurations] = useState<PropertyConfiguration[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [managers, setManagers] = useState<PropertyManager[]>([])
  const [loading, setLoading] = useState(false)
  const [activeStep, setActiveStep] = useState<'overview' | 'configure' | 'units' | 'managers' | 'residents'>('overview')

  // Configuration form state
  const [configForm, setConfigForm] = useState({
    blocks: 1,
    floors_per_block: 10,
    units_per_floor: 4,
    naming_scheme: {
      block_prefix: '',
      floor_prefix: '',
      unit_prefix: '',
      block_format: '##',
      floor_format: '##',
      unit_format: '##',
      start_floor: 1,
      start_unit: 1
    },
    unit_types: {} as Record<string, string>,
    excluded_units: [] as string[]
  })

  // Manager assignment state
  const [managerForm, setManagerForm] = useState({
    email: '',
    role: 'manager',
    permissions: {}
  })

  // Resident linking state
  const [residentForm, setResidentForm] = useState({
    unit_id: '',
    emails: [] as string[],
    new_email: ''
  })

  // Load data when property is selected
  useEffect(() => {
    if (selectedProperty) {
      loadPropertyData(selectedProperty.id)
    }
  }, [selectedProperty])

  const loadPropertyData = async (propertyId: string) => {
    setLoading(true)
    try {
      const [configRes, unitsRes, managersRes] = await Promise.all([
        fetch(`/api/properties/configurations?property_id=${propertyId}`),
        fetch(`/api/properties/${propertyId}/units`),
        fetch(`/api/properties/${propertyId}/managers`)
      ])

      if (configRes.ok) {
        const configData = await configRes.json()
        setConfigurations(configData.configurations || [])
        
        // Load existing configuration into form
        if (configData.configurations?.length > 0) {
          const config = configData.configurations[0]
          setConfigForm({
            blocks: config.blocks,
            floors_per_block: config.floors_per_block,
            units_per_floor: config.units_per_floor,
            naming_scheme: config.naming_scheme,
            unit_types: config.unit_types,
            excluded_units: config.excluded_units
          })
        }
      }

      if (unitsRes.ok) {
        const unitsData = await unitsRes.json()
        setUnits(unitsData.units || [])
      }

      if (managersRes.ok) {
        const managersData = await managersRes.json()
        setManagers(managersData.managers || [])
      }
    } catch (error) {
      console.error('Failed to load property data:', error)
      toast({
        title: "Error",
        description: "Failed to load property data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveConfiguration = async () => {
    if (!selectedProperty) return

    setLoading(true)
    try {
      const response = await fetch('/api/properties/configurations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          condo_id: selectedProperty.id,
          ...configForm
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Property configuration saved successfully"
        })
        await loadPropertyData(selectedProperty.id)
        setActiveStep('units')
      } else {
        throw new Error('Failed to save configuration')
      }
    } catch (error) {
      console.error('Failed to save configuration:', error)
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateUnits = async () => {
    if (!selectedProperty) return

    setLoading(true)
    try {
      const response = await fetch(`/api/properties/${selectedProperty.id}/units`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          configuration: configForm
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Units generated successfully"
        })
        await loadPropertyData(selectedProperty.id)
      } else {
        throw new Error('Failed to generate units')
      }
    } catch (error) {
      console.error('Failed to generate units:', error)
      toast({
        title: "Error",
        description: "Failed to generate units",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAssignManager = async () => {
    if (!selectedProperty || !managerForm.email) return

    setLoading(true)
    try {
      const response = await fetch(`/api/properties/${selectedProperty.id}/managers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: managerForm.email,
          role: managerForm.role,
          permissions: managerForm.permissions
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Manager assigned successfully"
        })
        setManagerForm({ email: '', role: 'manager', permissions: {} })
        await loadPropertyData(selectedProperty.id)
      } else {
        throw new Error('Failed to assign manager')
      }
    } catch (error) {
      console.error('Failed to assign manager:', error)
      toast({
        title: "Error",
        description: "Failed to assign manager",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLinkResidents = async (unitId: string, emails: string[]) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/units/${unitId}/residents/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Residents linked successfully"
        })
        await loadPropertyData(selectedProperty!.id)
      } else {
        throw new Error('Failed to link residents')
      }
    } catch (error) {
      console.error('Failed to link residents:', error)
      toast({
        title: "Error",
        description: "Failed to link residents",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleUnitExclusion = (unitId: string) => {
    setUnits(prev => prev.map(unit => 
      unit.id === unitId ? { ...unit, excluded: !unit.excluded } : unit
    ))
  }

  const addResidentEmail = () => {
    if (residentForm.new_email && !residentForm.emails.includes(residentForm.new_email)) {
      setResidentForm(prev => ({
        ...prev,
        emails: [...prev.emails, prev.new_email],
        new_email: ''
      }))
    }
  }

  const removeResidentEmail = (email: string) => {
    setResidentForm(prev => ({
      ...prev,
      emails: prev.emails.filter(e => e !== email)
    }))
  }

  if (!selectedProperty) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Unit Management</h1>
          <p className="text-foreground">Select a property to manage its units, assign managers, and link residents</p>
        </div>

        {/* Properties List */}
        <Card className="warm-card border border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Select Property
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Choose a property to configure units and manage residents
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 w-[200px] bg-muted animate-pulse rounded" />
                      <div className="h-4 w-[160px] bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : condominiums.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Properties Found</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by adding your first property to the platform.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {condominiums.map((condo, index) => (
                  <motion.div
                    key={condo.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedProperty(condo)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">{condo.name}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <MapPin className="h-4 w-4 text-foreground" />
                              <p className="text-sm text-foreground">{condo.address}</p>
                            </div>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-foreground">
                              <span>{units.length} units</span>
                              <span>•</span>
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                Joined {new Date(condo.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={units.length > 0 ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {units.length > 0 ? "Configured" : "Not Configured"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedProperty(condo)
                        }}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedProperty(null)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{selectedProperty.name}</h1>
            <p className="text-foreground">Unit Management & Configuration</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => loadPropertyData(selectedProperty.id)}
          disabled={loading}
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeStep} onValueChange={(value) => setActiveStep(value as any)}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="configure">Configure</TabsTrigger>
          <TabsTrigger value="units">Units</TabsTrigger>
          <TabsTrigger value="managers">Managers</TabsTrigger>
          <TabsTrigger value="residents">Residents</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Total Units</p>
                    <p className="text-2xl font-bold text-foreground">{units.length}</p>
                  </div>
                  <Grid3X3 className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Active Units</p>
                    <p className="text-2xl font-bold text-foreground">
                      {units.filter(u => !u.excluded).length}
                    </p>
                  </div>
                  <Check className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Managers</p>
                    <p className="text-2xl font-bold text-foreground">{managers.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Configured</p>
                    <p className="text-2xl font-bold text-foreground">
                      {configurations.length > 0 ? "Yes" : "No"}
                    </p>
                  </div>
                  <Settings className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common unit management tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => setActiveStep('configure')}
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <Settings className="h-6 w-6" />
                  <span>Configure Property</span>
                </Button>
                <Button
                  onClick={() => setActiveStep('units')}
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <Grid3X3 className="h-6 w-6" />
                  <span>Manage Units</span>
                </Button>
                <Button
                  onClick={() => setActiveStep('managers')}
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <UserPlus className="h-6 w-6" />
                  <span>Assign Managers</span>
                </Button>
                <Button
                  onClick={() => setActiveStep('residents')}
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <Mail className="h-6 w-6" />
                  <span>Link Residents</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configure Tab */}
        <TabsContent value="configure" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Configuration</CardTitle>
              <CardDescription>Set up the property structure and naming scheme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="blocks">Number of Blocks</Label>
                  <Input
                    id="blocks"
                    type="number"
                    min="1"
                    value={configForm.blocks}
                    onChange={(e) => setConfigForm(prev => ({ ...prev, blocks: parseInt(e.target.value) || 1 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="floors">Floors per Block</Label>
                  <Input
                    id="floors"
                    type="number"
                    min="1"
                    value={configForm.floors_per_block}
                    onChange={(e) => setConfigForm(prev => ({ ...prev, floors_per_block: parseInt(e.target.value) || 1 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="units">Units per Floor</Label>
                  <Input
                    id="units"
                    type="number"
                    min="1"
                    value={configForm.units_per_floor}
                    onChange={(e) => setConfigForm(prev => ({ ...prev, units_per_floor: parseInt(e.target.value) || 1 }))}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Naming Scheme</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="block_prefix">Block Prefix</Label>
                    <Input
                      id="block_prefix"
                      placeholder="e.g., Tower, Block"
                      value={configForm.naming_scheme.block_prefix}
                      onChange={(e) => setConfigForm(prev => ({
                        ...prev,
                        naming_scheme: { ...prev.naming_scheme, block_prefix: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="floor_prefix">Floor Prefix</Label>
                    <Input
                      id="floor_prefix"
                      placeholder="e.g., Floor, Level"
                      value={configForm.naming_scheme.floor_prefix}
                      onChange={(e) => setConfigForm(prev => ({
                        ...prev,
                        naming_scheme: { ...prev.naming_scheme, floor_prefix: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit_prefix">Unit Prefix</Label>
                    <Input
                      id="unit_prefix"
                      placeholder="e.g., Unit, Apt"
                      value={configForm.naming_scheme.unit_prefix}
                      onChange={(e) => setConfigForm(prev => ({
                        ...prev,
                        naming_scheme: { ...prev.naming_scheme, unit_prefix: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="start_floor">Starting Floor</Label>
                    <Input
                      id="start_floor"
                      type="number"
                      min="1"
                      value={configForm.naming_scheme.start_floor}
                      onChange={(e) => setConfigForm(prev => ({
                        ...prev,
                        naming_scheme: { ...prev.naming_scheme, start_floor: parseInt(e.target.value) || 1 }
                      }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setActiveStep('overview')}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveConfiguration}
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Configuration
                </Button>
                <Button
                  onClick={handleGenerateUnits}
                  disabled={loading || configurations.length === 0}
                >
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  Generate Units
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Units Tab */}
        <TabsContent value="units" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Unit Management</CardTitle>
              <CardDescription>Manage individual units and their properties</CardDescription>
            </CardHeader>
            <CardContent>
              {units.length === 0 ? (
                <div className="text-center py-8">
                  <Grid3X3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Units Found</h3>
                  <p className="text-muted-foreground mb-4">
                    Generate units first by configuring the property structure.
                  </p>
                  <Button onClick={() => setActiveStep('configure')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Property
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline">
                        Total: {units.length}
                      </Badge>
                      <Badge variant="outline">
                        Active: {units.filter(u => !u.excluded).length}
                      </Badge>
                      <Badge variant="outline">
                        Excluded: {units.filter(u => u.excluded).length}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {units.map((unit) => (
                      <motion.div
                        key={unit.id}
                        className={cn(
                          "p-4 border rounded-lg cursor-pointer transition-all",
                          unit.excluded 
                            ? "bg-muted/50 border-dashed opacity-60" 
                            : "hover:bg-muted/50 hover:shadow-sm"
                        )}
                        onClick={() => toggleUnitExclusion(unit.id)}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-sm">{unit.unit_number}</h3>
                          {unit.excluded ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <p>Floor: {unit.floor_number}</p>
                          {unit.block_number && <p>Block: {unit.block_number}</p>}
                          <p>Type: {unit.unit_type}</p>
                          <p>Status: {unit.status}</p>
                          {unit.resident_emails.length > 0 && (
                            <p>Residents: {unit.resident_emails.length}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Managers Tab */}
        <TabsContent value="managers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Managers</CardTitle>
              <CardDescription>Assign managers and security personnel to this property</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add Manager Form */}
              <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                <h3 className="font-semibold">Assign New Manager</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="manager_email">Email Address</Label>
                    <Input
                      id="manager_email"
                      type="email"
                      placeholder="manager@example.com"
                      value={managerForm.email}
                      onChange={(e) => setManagerForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manager_role">Role</Label>
                    <Select
                      value={managerForm.role}
                      onValueChange={(value) => setManagerForm(prev => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  onClick={handleAssignManager}
                  disabled={loading || !managerForm.email}
                  className="w-full"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Assign Manager
                </Button>
              </div>

              {/* Existing Managers */}
              <div className="space-y-4">
                <h3 className="font-semibold">Current Managers</h3>
                {managers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No managers assigned yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {managers.map((manager) => (
                      <div
                        key={manager.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{manager.user.name}</h4>
                            <p className="text-sm text-muted-foreground">{manager.user.email}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {manager.role}
                              </Badge>
                              <Badge
                                variant={manager.is_active ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {manager.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Residents Tab */}
        <TabsContent value="residents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resident Management</CardTitle>
              <CardDescription>Link resident email addresses to units</CardDescription>
            </CardHeader>
            <CardContent>
              {units.length === 0 ? (
                <div className="text-center py-8">
                  <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Units Available</h3>
                  <p className="text-muted-foreground mb-4">
                    Generate units first to link residents.
                  </p>
                  <Button onClick={() => setActiveStep('units')}>
                    <Grid3X3 className="h-4 w-4 mr-2" />
                    Manage Units
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {units.filter(u => !u.excluded).map((unit) => (
                    <div key={unit.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{unit.unit_number}</h3>
                          <p className="text-sm text-muted-foreground">
                            Floor {unit.floor_number} • {unit.unit_type}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {unit.resident_emails.length} residents
                        </Badge>
                      </div>

                      {/* Current Residents */}
                      {unit.resident_emails.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-2">Current Residents:</h4>
                          <div className="flex flex-wrap gap-2">
                            {unit.resident_emails.map((email, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {email}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Add Resident Form */}
                      <div className="space-y-3">
                        <div className="flex space-x-2">
                          <Input
                            placeholder="resident@example.com"
                            value={residentForm.new_email}
                            onChange={(e) => setResidentForm(prev => ({ ...prev, new_email: e.target.value }))}
                            onKeyPress={(e) => e.key === 'Enter' && addResidentEmail()}
                          />
                          <Button
                            onClick={addResidentEmail}
                            disabled={!residentForm.new_email}
                            size="sm"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {residentForm.emails.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-2">
                              {residentForm.emails.map((email, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {email}
                                  <button
                                    onClick={() => removeResidentEmail(email)}
                                    className="ml-1 hover:text-destructive"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                            <Button
                              onClick={() => handleLinkResidents(unit.id, residentForm.emails)}
                              disabled={loading || residentForm.emails.length === 0}
                              size="sm"
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              Link Residents
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
