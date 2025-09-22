"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { 
  Users, 
  Mail, 
  Plus, 
  Trash2,
  CheckCircle,
  AlertCircle,
  Search,
  Upload,
  Download,
  Copy,
  Send
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Unit, 
  UnitResident,
  ResidentLinkingRequest 
} from "@/lib/types/unit-management"

interface ResidentEmailLinkingProps {
  condoId: string
  condoName: string
  units: Unit[]
  onResidentsUpdate: (unitId: string, residents: UnitResident[]) => void
}

export function ResidentEmailLinking({
  condoId,
  condoName,
  units,
  onResidentsUpdate
}: ResidentEmailLinkingProps) {
  const [loading, setLoading] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
  const [residents, setResidents] = useState<UnitResident[]>([])
  const [bulkLinkDialog, setBulkLinkDialog] = useState(false)
  const [emailList, setEmailList] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  // Load residents for selected unit
  useEffect(() => {
    if (selectedUnit) {
      loadUnitResidents(selectedUnit.id)
    }
  }, [selectedUnit])

  const loadUnitResidents = async (unitId: string) => {
    try {
      const response = await fetch(`/api/units/${unitId}/residents`)
      if (!response.ok) throw new Error('Failed to load residents')
      
      const data = await response.json()
      setResidents(data.residents || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load unit residents",
        variant: "destructive"
      })
    }
  }

  const handleAddResident = async (email: string, name?: string, phone?: string) => {
    if (!selectedUnit) return

    setLoading(true)
    try {
      const request: ResidentLinkingRequest = {
        unit_id: selectedUnit.id,
        emails: [email],
        primary_email: email
      }

      const response = await fetch(`/api/units/${selectedUnit.id}/residents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          phone,
          is_primary: residents.length === 0
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add resident')
      }

      const data = await response.json()
      
      // Update local state
      const newResidents = [...residents, data.resident]
      setResidents(newResidents)
      onResidentsUpdate(selectedUnit.id, newResidents)
      
      toast({
        title: "Resident Added",
        description: `${email} has been linked to unit ${selectedUnit.unit_number}.`
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add resident",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveResident = async (residentId: string) => {
    if (!selectedUnit) return

    setLoading(true)
    try {
      const response = await fetch(`/api/units/${selectedUnit.id}/residents/${residentId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to remove resident')
      }

      // Update local state
      const newResidents = residents.filter(r => r.id !== residentId)
      setResidents(newResidents)
      onResidentsUpdate(selectedUnit.id, newResidents)
      
      toast({
        title: "Resident Removed",
        description: "Resident has been removed from this unit."
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove resident",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBulkLink = async () => {
    if (!selectedUnit || !emailList.trim()) return

    const emails = emailList
      .split('\n')
      .map(email => email.trim())
      .filter(email => email && email.includes('@'))

    if (emails.length === 0) {
      toast({
        title: "Error",
        description: "Please enter valid email addresses",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/units/${selectedUnit.id}/residents/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emails,
          primary_email: emails[0] // First email is primary
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to bulk link residents')
      }

      const data = await response.json()
      
      // Update local state
      const newResidents = [...residents, ...data.residents]
      setResidents(newResidents)
      onResidentsUpdate(selectedUnit.id, newResidents)
      
      toast({
        title: "Residents Added",
        description: `${emails.length} residents have been linked to unit ${selectedUnit.unit_number}.`
      })

      // Reset form
      setEmailList("")
      setBulkLinkDialog(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to bulk link residents",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSetPrimary = async (residentId: string) => {
    if (!selectedUnit) return

    setLoading(true)
    try {
      const response = await fetch(`/api/units/${selectedUnit.id}/residents/${residentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_primary: true })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to set primary resident')
      }

      // Update local state
      const newResidents = residents.map(r => ({
        ...r,
        is_primary: r.id === residentId
      }))
      setResidents(newResidents)
      onResidentsUpdate(selectedUnit.id, newResidents)
      
      toast({
        title: "Primary Resident Updated",
        description: "Primary resident has been updated."
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update primary resident",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredUnits = units.filter(unit =>
    unit.unit_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.block_number?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (resident: UnitResident) => {
    if (!resident.is_active) return "bg-red-100 text-red-800 border-red-300"
    if (resident.accepted_at) return "bg-green-100 text-green-800 border-green-300"
    if (resident.invited_at) return "bg-orange-100 text-orange-800 border-orange-300"
    return "bg-gray-100 text-gray-800 border-gray-300"
  }

  const getStatusText = (resident: UnitResident) => {
    if (!resident.is_active) return "Inactive"
    if (resident.accepted_at) return "Active"
    if (resident.invited_at) return "Pending"
    return "Unknown"
  }

  return (
    <div className="space-y-6">
      {/* Unit Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Resident Email Linking - {condoName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search units..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
              {filteredUnits.map((unit) => (
                <motion.div
                  key={unit.id}
                  className={`
                    p-3 border rounded-lg cursor-pointer transition-all hover:bg-muted/50
                    ${selectedUnit?.id === unit.id ? 'ring-2 ring-primary bg-primary/5' : ''}
                  `}
                  onClick={() => setSelectedUnit(unit)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono font-semibold">{unit.unit_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {unit.block_number} • {unit.unit_type}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">
                        {unit.resident_emails.length} resident{unit.resident_emails.length !== 1 ? 's' : ''}
                      </Badge>
                      {unit.excluded && (
                        <Badge variant="destructive" className="text-xs">
                          Excluded
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resident Management for Selected Unit */}
      {selectedUnit && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Residents - {selectedUnit.unit_number}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBulkLinkDialog(true)}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Bulk Add
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const email = prompt("Enter email address:")
                    const name = prompt("Enter name (optional):")
                    const phone = prompt("Enter phone (optional):")
                    if (email) {
                      handleAddResident(email, name || undefined, phone || undefined)
                    }
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Resident
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {residents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No residents linked to this unit</p>
                <p className="text-sm">Add residents to enable resident portal access</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resident</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {residents.map((resident) => (
                    <TableRow key={resident.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {resident.name?.charAt(0) || resident.email.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {resident.name || 'No name provided'}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{resident.email}</span>
                          {resident.is_primary && (
                            <Badge variant="secondary" className="text-xs">
                              Primary
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{resident.phone || '-'}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(resident)}>
                          {getStatusText(resident)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {resident.is_primary ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-green-600">Primary</span>
                            </>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSetPrimary(resident.id)}
                              disabled={loading}
                            >
                              Set Primary
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(resident.email)
                              toast({
                                title: "Copied",
                                description: "Email address copied to clipboard"
                              })
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm('Are you sure you want to remove this resident?')) {
                                handleRemoveResident(resident.id)
                              }
                            }}
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Bulk Link Dialog */}
      <Dialog open={bulkLinkDialog} onOpenChange={setBulkLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Add Residents</DialogTitle>
            <DialogDescription>
              Add multiple residents to unit {selectedUnit?.unit_number}. Enter one email per line.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="emails">Email Addresses</Label>
              <Textarea
                id="emails"
                placeholder="resident1@example.com&#10;resident2@example.com&#10;resident3@example.com"
                value={emailList}
                onChange={(e) => setEmailList(e.target.value)}
                rows={6}
                className="font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Enter one email address per line. The first email will be set as primary.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkLinkDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkLink} disabled={loading || !emailList.trim()}>
              {loading ? "Adding..." : "Add Residents"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
