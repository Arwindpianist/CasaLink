"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
  Layers, 
  Hash, 
  Settings, 
  CheckCircle,
  Info,
  ArrowRight,
  ArrowLeft
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  PropertyConfiguration, 
  UnitGenerationRequest,
  MALAYSIAN_NAMING_SCHEMES,
  MalaysianNamingScheme,
  UNIT_TYPES,
  UnitType,
  NamingScheme
} from "@/lib/types/unit-management"

interface UnitQuestionnaireProps {
  open: boolean
  condoId: string
  condoName: string
  onClose: () => void
  onComplete: (config: PropertyConfiguration) => void
  existingConfig?: PropertyConfiguration | null
}

interface QuestionnaireStep {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const QUESTIONNAIRE_STEPS: QuestionnaireStep[] = [
  {
    id: "structure",
    title: "Property Structure",
    description: "Define the basic structure of your property",
    icon: Building2
  },
  {
    id: "units",
    title: "Unit Configuration",
    description: "Configure unit types and distribution",
    icon: Layers
  },
  {
    id: "naming",
    title: "Naming Scheme",
    description: "Choose how units will be named",
    icon: Hash
  },
  {
    id: "review",
    title: "Review & Generate",
    description: "Review your configuration and generate units",
    icon: CheckCircle
  }
]

export function UnitQuestionnaire({ 
  open, 
  condoId, 
  condoName, 
  onClose, 
  onComplete,
  existingConfig 
}: UnitQuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  
  // Form state
  const [config, setConfig] = useState<UnitGenerationRequest>({
    condo_id: condoId,
    blocks: 1,
    floors_per_block: 10,
    units_per_floor: 4,
    unit_types: {
      residential: true,
      commercial: false,
      parking: false,
      storage: false
    },
    naming_scheme: MALAYSIAN_NAMING_SCHEMES.standard,
    excluded_units: [],
    special_floors: {
      penthouse: [],
      mechanical: [],
      parking: []
    }
  })

  // Load existing configuration if provided
  useEffect(() => {
    if (existingConfig && open) {
      setConfig({
        condo_id: existingConfig.condo_id,
        blocks: existingConfig.blocks,
        floors_per_block: existingConfig.floors_per_block,
        units_per_floor: existingConfig.units_per_floor,
        unit_types: existingConfig.unit_types,
        naming_scheme: existingConfig.naming_scheme,
        excluded_units: existingConfig.excluded_units,
        special_floors: existingConfig.special_floors
      })
    }
  }, [existingConfig, open])

  const updateConfig = (updates: Partial<UnitGenerationRequest>) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }

  const updateNamingScheme = (schemeType: MalaysianNamingScheme) => {
    updateConfig({
      naming_scheme: MALAYSIAN_NAMING_SCHEMES[schemeType]
    })
  }

  const updateUnitType = (type: UnitType, enabled: boolean) => {
    updateConfig({
      unit_types: {
        ...config.unit_types,
        [type]: enabled
      }
    })
  }

  const nextStep = () => {
    if (currentStep < QUESTIONNAIRE_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      // Create property configuration
      const response = await fetch('/api/properties/configurations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })

      if (!response.ok) {
        throw new Error('Failed to save configuration')
      }

      const savedConfig = await response.json()
      
      toast({
        title: "Configuration Saved",
        description: "Property configuration has been saved successfully."
      })

      onComplete(savedConfig.configuration)
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save configuration",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const renderStructureStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Blocks/Towers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="blocks">Number of Blocks</Label>
              <Input
                id="blocks"
                type="number"
                min="1"
                max="10"
                value={config.blocks}
                onChange={(e) => updateConfig({ blocks: parseInt(e.target.value) || 1 })}
                className="text-center text-lg font-semibold"
              />
              <p className="text-sm text-muted-foreground">
                Separate buildings or towers
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Floors per Block
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="floors">Floors per Block</Label>
              <Input
                id="floors"
                type="number"
                min="1"
                max="50"
                value={config.floors_per_block}
                onChange={(e) => updateConfig({ floors_per_block: parseInt(e.target.value) || 1 })}
                className="text-center text-lg font-semibold"
              />
              <p className="text-sm text-muted-foreground">
                Including ground floor
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Units per Floor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="units">Units per Floor</Label>
              <Input
                id="units"
                type="number"
                min="1"
                max="20"
                value={config.units_per_floor}
                onChange={(e) => updateConfig({ units_per_floor: parseInt(e.target.value) || 1 })}
                className="text-center text-lg font-semibold"
              />
              <p className="text-sm text-muted-foreground">
                Average units per floor
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Total Units Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {config.blocks * config.floors_per_block * config.units_per_floor}
            </div>
            <p className="text-muted-foreground">
              Total units will be generated across {config.blocks} block{config.blocks > 1 ? 's' : ''}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderUnitsStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(UNIT_TYPES).map(([type, typeConfig]) => (
          <Card key={type} className={config.unit_types[type as UnitType] ? "ring-2 ring-primary" : ""}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg capitalize">{typeConfig.label}</CardTitle>
                <Switch
                  checked={config.unit_types[type as UnitType] || false}
                  onCheckedChange={(checked) => updateUnitType(type as UnitType, checked)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {typeConfig.description}
              </p>
              {config.unit_types[type as UnitType] && (
                <Badge variant="secondary" className="mt-2">
                  Enabled
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Special Floors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Penthouse Floors</Label>
              <Input
                placeholder="e.g., 20,21,22"
                value={config.special_floors?.penthouse?.join(',') || ''}
                onChange={(e) => updateConfig({
                  special_floors: {
                    ...config.special_floors,
                    penthouse: e.target.value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n))
                  }
                })}
              />
            </div>
            <div>
              <Label>Mechanical Floors</Label>
              <Input
                placeholder="e.g., 1,2"
                value={config.special_floors?.mechanical?.join(',') || ''}
                onChange={(e) => updateConfig({
                  special_floors: {
                    ...config.special_floors,
                    mechanical: e.target.value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n))
                  }
                })}
              />
            </div>
            <div>
              <Label>Parking Floors</Label>
              <Input
                placeholder="e.g., B1,B2,B3"
                value={config.special_floors?.parking?.join(',') || ''}
                onChange={(e) => updateConfig({
                  special_floors: {
                    ...config.special_floors,
                    parking: e.target.value.split(',').map(n => n.trim()).filter(n => n)
                  }
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderNamingStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(MALAYSIAN_NAMING_SCHEMES).map(([key, scheme]) => (
          <Card 
            key={key} 
            className={`cursor-pointer transition-all ${
              config.naming_scheme.type === scheme.type ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"
            }`}
            onClick={() => updateNamingScheme(key as MalaysianNamingScheme)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg capitalize">{key} Scheme</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="outline" className="font-mono">
                  {scheme.format}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {key === 'standard' && 'A-01-01, A-01-02, etc.'}
                  {key === 'tower' && 'Tower 1-01-01, Tower 1-01-02, etc.'}
                  {key === 'apartment' && 'A0101, A0102, etc.'}
                  {key === 'commercial' && 'Level-01, Level-02, etc.'}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preview Unit Numbers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2 text-sm font-mono">
            {Array.from({ length: Math.min(8, config.units_per_floor) }, (_, i) => {
              const unitNum = i + 1
              const floorNum = 1
              const blockNum = 1
              
              let unitNumber = ''
              if (config.naming_scheme.type === 'tower') {
                unitNumber = `Tower ${blockNum}-${floorNum.toString().padStart(2, '0')}-${unitNum.toString().padStart(2, '0')}`
              } else if (config.naming_scheme.type === 'block') {
                unitNumber = `Block ${blockNum}-${floorNum.toString().padStart(2, '0')}-${unitNum.toString().padStart(2, '0')}`
              } else {
                unitNumber = `${String.fromCharCode(64 + blockNum)}${floorNum.toString().padStart(2, '0')}${unitNum.toString().padStart(2, '0')}`
              }
              
              return (
                <div key={i} className="p-2 bg-muted rounded text-center">
                  {unitNumber}
                </div>
              )
            })}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Example unit numbers for Block A, Floor 1
          </p>
        </CardContent>
      </Card>
    </div>
  )

  const renderReviewStep = () => {
    const totalUnits = config.blocks * config.floors_per_block * config.units_per_floor
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuration Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Property Structure</Label>
                <p className="text-sm text-muted-foreground">
                  {config.blocks} block{config.blocks > 1 ? 's' : ''} × {config.floors_per_block} floors × {config.units_per_floor} units/floor
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Total Units</Label>
                <p className="text-sm text-muted-foreground font-semibold">{totalUnits}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Unit Types</Label>
                <div className="flex gap-1 mt-1">
                  {Object.entries(config.unit_types)
                    .filter(([_, enabled]) => enabled)
                    .map(([type, _]) => (
                      <Badge key={type} variant="secondary" className="text-xs">
                        {UNIT_TYPES[type as UnitType].label}
                      </Badge>
                    ))}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Naming Scheme</Label>
                <p className="text-sm text-muted-foreground font-mono">
                  {config.naming_scheme.format}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Save property configuration</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Generate {totalUnits} units automatically</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Configure unit exclusions (optional)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Assign managers and security staff</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderStructureStep()
      case 1:
        return renderUnitsStep()
      case 2:
        return renderNamingStep()
      case 3:
        return renderReviewStep()
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Unit Configuration for {condoName}
          </DialogTitle>
          <DialogDescription>
            Configure your property structure and unit naming scheme
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6">
          {QUESTIONNAIRE_STEPS.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStep
            const isCompleted = index < currentStep
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all
                  ${isActive ? 'border-primary bg-primary text-primary-foreground' : ''}
                  ${isCompleted ? 'border-green-500 bg-green-500 text-white' : ''}
                  ${!isActive && !isCompleted ? 'border-muted-foreground/30' : ''}
                `}>
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <div className="ml-2 hidden sm:block">
                  <p className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                {index < QUESTIONNAIRE_STEPS.length - 1 && (
                  <div className="mx-4 w-8 h-px bg-border" />
                )}
              </div>
            )
          })}
        </div>

        <Separator />

        {/* Step Content */}
        <div className="py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        <Separator />

        {/* Navigation */}
        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {currentStep === QUESTIONNAIRE_STEPS.length - 1 ? (
              <Button onClick={handleComplete} disabled={loading}>
                {loading ? "Saving..." : "Save Configuration"}
              </Button>
            ) : (
              <Button onClick={nextStep}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
