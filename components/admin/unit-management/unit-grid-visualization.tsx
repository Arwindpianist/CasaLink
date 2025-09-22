"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { 
  Building2, 
  Search, 
  Filter, 
  Eye, 
  EyeOff,
  Users,
  Home,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  Grid3X3,
  List,
  Download,
  Upload,
  RefreshCw
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Unit, 
  UnitGridData, 
  UnitGridCell,
  PropertyConfiguration 
} from "@/lib/types/unit-management"

interface UnitGridVisualizationProps {
  condoId: string
  condoName: string
  configuration: PropertyConfiguration
  units: Unit[]
  onUnitsUpdate: (updatedUnits: Unit[]) => void
  onBulkExclude: (unitNumbers: string[]) => void
  onBulkInclude: (unitNumbers: string[]) => void
}

interface GridViewMode {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const GRID_VIEW_MODES: GridViewMode[] = [
  { id: "grid", label: "Grid View", icon: Grid3X3 },
  { id: "list", label: "List View", icon: List }
]

const UNIT_STATUS_COLORS = {
  occupied: "bg-green-100 border-green-300 text-green-800",
  vacant: "bg-blue-100 border-blue-300 text-blue-800",
  maintenance: "bg-orange-100 border-orange-300 text-orange-800",
  excluded: "bg-red-100 border-red-300 text-red-800"
}

const UNIT_TYPE_COLORS = {
  residential: "bg-blue-50 border-blue-200",
  commercial: "bg-purple-50 border-purple-200",
  parking: "bg-gray-50 border-gray-200",
  storage: "bg-yellow-50 border-yellow-200"
}

export function UnitGridVisualization({
  condoId,
  condoName,
  configuration,
  units,
  onUnitsUpdate,
  onBulkExclude,
  onBulkInclude
}: UnitGridVisualizationProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedUnits, setSelectedUnits] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [showExcluded, setShowExcluded] = useState(false)
  const [bulkExcludeDialog, setBulkExcludeDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  // Process units into grid data
  const gridData = useMemo((): UnitGridData => {
    const blocks: { [blockName: string]: { floors: { [floorNumber: string]: UnitGridCell[] } } } = {}
    let totalUnits = 0
    let excludedUnits = 0
    let occupiedUnits = 0
    let vacantUnits = 0

    // Initialize grid structure based on configuration
    for (let blockIdx = 1; blockIdx <= configuration.blocks; blockIdx++) {
      const blockName = configuration.naming_scheme.type === 'tower' 
        ? `Tower ${blockIdx}` 
        : configuration.naming_scheme.type === 'block'
        ? `Block ${blockIdx}`
        : String.fromCharCode(64 + blockIdx)

      blocks[blockName] = { floors: {} }

      for (let floorIdx = 1; floorIdx <= configuration.floors_per_block; floorIdx++) {
        const floorKey = floorIdx.toString()
        blocks[blockName].floors[floorKey] = []

        for (let unitIdx = 1; unitIdx <= configuration.units_per_floor; unitIdx++) {
          totalUnits++

          // Find existing unit data
          const existingUnit = units.find(u => {
            if (u.block_number === blockName && u.floor_number === floorIdx) {
              return u.unit_number.includes(unitIdx.toString().padStart(2, '0'))
            }
            return false
          })

          const unitCell: UnitGridCell = {
            unit_number: existingUnit?.unit_number || `${blockName}-${floorIdx.toString().padStart(2, '0')}-${unitIdx.toString().padStart(2, '0')}`,
            block_number: blockName,
            floor_number: floorIdx,
            unit_type: existingUnit?.unit_type || 'residential',
            excluded: existingUnit?.excluded || false,
            status: existingUnit?.status || 'vacant',
            resident_count: existingUnit?.resident_emails?.length || 0,
            has_residents: (existingUnit?.resident_emails?.length || 0) > 0
          }

          blocks[blockName].floors[floorKey].push(unitCell)

          if (unitCell.excluded) excludedUnits++
          if (unitCell.status === 'occupied') occupiedUnits++
          if (unitCell.status === 'vacant') vacantUnits++
        }
      }
    }

    return {
      blocks,
      total_units: totalUnits,
      excluded_units: excludedUnits,
      occupied_units: occupiedUnits,
      vacant_units: vacantUnits
    }
  }, [configuration, units])

  // Filter units based on search and filters
  const filteredUnits = useMemo(() => {
    let filtered = units

    if (searchTerm) {
      filtered = filtered.filter(unit => 
        unit.unit_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.block_number?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(unit => unit.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(unit => unit.unit_type === typeFilter)
    }

    if (!showExcluded) {
      filtered = filtered.filter(unit => !unit.excluded)
    }

    return filtered
  }, [units, searchTerm, statusFilter, typeFilter, showExcluded])

  const handleUnitToggle = async (unitNumber: string) => {
    const unit = units.find(u => u.unit_number === unitNumber)
    if (!unit) return

    setLoading(true)
    try {
      const updatedUnits = units.map(u => 
        u.unit_number === unitNumber 
          ? { ...u, excluded: !u.excluded }
          : u
      )

      // Update via API
      const response = await fetch(`/api/properties/${condoId}/units/${unit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ excluded: !unit.excluded })
      })

      if (!response.ok) {
        throw new Error('Failed to update unit')
      }

      onUnitsUpdate(updatedUnits)
      
      toast({
        title: "Unit Updated",
        description: `Unit ${unitNumber} has been ${unit.excluded ? 'included' : 'excluded'}.`
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update unit",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBulkToggle = async (exclude: boolean) => {
    if (selectedUnits.size === 0) return

    setLoading(true)
    try {
      const unitNumbers = Array.from(selectedUnits)
      
      if (exclude) {
        onBulkExclude(unitNumbers)
      } else {
        onBulkInclude(unitNumbers)
      }

      setSelectedUnits(new Set())
      setBulkExcludeDialog(false)
      
      toast({
        title: "Bulk Update Complete",
        description: `${unitNumbers.length} units have been ${exclude ? 'excluded' : 'included'}.`
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update units",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const renderUnitCell = (unit: UnitGridCell) => {
    const isSelected = selectedUnits.has(unit.unit_number)
    const statusColor = unit.excluded 
      ? UNIT_STATUS_COLORS.excluded 
      : UNIT_STATUS_COLORS[unit.status as keyof typeof UNIT_STATUS_COLORS]
    const typeColor = UNIT_TYPE_COLORS[unit.unit_type as keyof typeof UNIT_TYPE_COLORS]

    return (
      <motion.div
        key={unit.unit_number}
        className={`
          relative p-2 rounded-lg border-2 cursor-pointer transition-all
          ${statusColor} ${typeColor}
          ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
          ${unit.excluded ? 'opacity-60' : ''}
          hover:shadow-md hover:scale-105
        `}
        onClick={() => {
          if (selectedUnits.has(unit.unit_number)) {
            setSelectedUnits(prev => {
              const newSet = new Set(prev)
              newSet.delete(unit.unit_number)
              return newSet
            })
          } else {
            setSelectedUnits(prev => new Set([...prev, unit.unit_number]))
          }
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="text-center">
          <div className="text-xs font-mono font-semibold mb-1">
            {unit.unit_number}
          </div>
          <div className="flex items-center justify-center gap-1">
            {unit.has_residents && (
              <Users className="h-3 w-3 text-blue-600" />
            )}
            {unit.excluded && (
              <XCircle className="h-3 w-3 text-red-600" />
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  const renderGridView = () => (
    <div className="space-y-6">
      {Object.entries(gridData.blocks).map(([blockName, blockData]) => (
        <Card key={blockName}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {blockName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(blockData.floors)
                .sort(([a], [b]) => parseInt(b) - parseInt(a)) // Sort floors descending
                .map(([floorNumber, floorUnits]) => (
                <div key={floorNumber}>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="font-mono">
                      Floor {floorNumber}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {floorUnits.length} units
                    </span>
                  </div>
                  <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                    {floorUnits.map(renderUnitCell)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderListView = () => (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {filteredUnits.map((unit) => (
            <motion.div
              key={unit.id}
              className={`
                p-4 flex items-center justify-between hover:bg-muted/50 transition-colors
                ${unit.excluded ? 'opacity-60' : ''}
              `}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedUnits.has(unit.unit_number)}
                    onChange={() => {
                      if (selectedUnits.has(unit.unit_number)) {
                        setSelectedUnits(prev => {
                          const newSet = new Set(prev)
                          newSet.delete(unit.unit_number)
                          return newSet
                        })
                      } else {
                        setSelectedUnits(prev => new Set([...prev, unit.unit_number]))
                      }
                    }}
                    className="rounded"
                  />
                  <span className="font-mono font-semibold">{unit.unit_number}</span>
                </div>
                <Badge variant="outline">{unit.unit_type}</Badge>
                <Badge variant={unit.status === 'occupied' ? 'default' : 'secondary'}>
                  {unit.status}
                </Badge>
                {unit.resident_emails.length > 0 && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {unit.resident_emails.length}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleUnitToggle(unit.unit_number)}
                  disabled={loading}
                >
                  {unit.excluded ? (
                    <>
                      <Eye className="h-4 w-4 mr-1" />
                      Include
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4 mr-1" />
                      Exclude
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Grid3X3 className="h-5 w-5" />
              Unit Grid - {condoName}
            </CardTitle>
            <div className="flex items-center gap-2">
              {GRID_VIEW_MODES.map((mode) => {
                const Icon = mode.icon
                return (
                  <Button
                    key={mode.id}
                    variant={viewMode === mode.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode(mode.id as "grid" | "list")}
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {mode.label}
                  </Button>
                )
              })}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{gridData.total_units}</div>
              <div className="text-sm text-muted-foreground">Total Units</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{gridData.occupied_units}</div>
              <div className="text-sm text-muted-foreground">Occupied</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{gridData.vacant_units}</div>
              <div className="text-sm text-muted-foreground">Vacant</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{gridData.excluded_units}</div>
              <div className="text-sm text-muted-foreground">Excluded</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search Units</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by unit number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <Label>Status Filter</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="vacant">Vacant</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Type Filter</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="parking">Parking</SelectItem>
                  <SelectItem value="storage">Storage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-excluded"
                checked={showExcluded}
                onCheckedChange={setShowExcluded}
              />
              <Label htmlFor="show-excluded">Show Excluded</Label>
            </div>
          </div>

          {selectedUnits.size > 0 && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {selectedUnits.size} units selected
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedUnits(new Set())}
                  >
                    Clear Selection
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkToggle(false)}
                    disabled={loading}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Include Selected
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkToggle(true)}
                    disabled={loading}
                  >
                    <EyeOff className="h-4 w-4 mr-1" />
                    Exclude Selected
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grid/List View */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === "grid" ? renderGridView() : renderListView()}
        </motion.div>
      </AnimatePresence>

      {/* Bulk Exclude Dialog */}
      <Dialog open={bulkExcludeDialog} onOpenChange={setBulkExcludeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Bulk Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to exclude {selectedUnits.size} selected units?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkExcludeDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => handleBulkToggle(true)}
              disabled={loading}
            >
              {loading ? "Processing..." : "Exclude Units"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
