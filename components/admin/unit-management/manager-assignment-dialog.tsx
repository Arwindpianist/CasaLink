"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  UserPlus, 
  Mail, 
  Shield, 
  Settings, 
  Trash2,
  CheckCircle,
  AlertCircle,
  Search,
  Filter
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  PropertyManager, 
  ManagerAssignmentRequest 
} from "@/lib/types/unit-management"

interface ManagerAssignmentDialogProps {
  open: boolean
  condoId: string
  condoName: string
  onClose: () => void
  onManagersUpdate: (managers: PropertyManager[]) => void
  existingManagers?: PropertyManager[]
}

interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar_url?: string
  role: string
  is_active: boolean
}

export function ManagerAssignmentDialog({
  open,
  condoId,
  condoName,
  onClose,
  onManagersUpdate,
  existingManagers = []
}: ManagerAssignmentDialogProps) {
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [availableUsers, setAvailableUsers] = useState<User[]>([])
  const [managers, setManagers] = useState<PropertyManager[]>(existingManagers)

  // New manager form
  const [newManagerEmail, setNewManagerEmail] = useState("")
  const [newManagerRole, setNewManagerRole] = useState<"manager" | "security" | "admin">("manager")
  const [newManagerPermissions, setNewManagerPermissions] = useState({
    manage_units: false,
    manage_residents: false,
    manage_visitors: true,
    view_analytics: false,
    manage_settings: false
  })

  // Load available users when dialog opens
  useEffect(() => {
    if (open) {
      loadAvailableUsers()
      loadExistingManagers()
    }
  }, [open, condoId])

  const loadAvailableUsers = async () => {
    try {
      const response = await fetch(`/api/users?condo_id=${condoId}`)
      if (!response.ok) throw new Error('Failed to load users')
      
      const data = await response.json()
      // Filter out users who are already managers
      const managerUserIds = managers.map(m => m.user_id)
      const available = data.users.filter((user: User) => 
        !managerUserIds.includes(user.id) && 
        user.role !== 'resident' &&
        user.role !== 'visitor'
      )
      setAvailableUsers(available)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load available users",
        variant: "destructive"
      })
    }
  }

  const loadExistingManagers = async () => {
    try {
      const response = await fetch(`/api/properties/${condoId}/managers`)
      if (!response.ok) throw new Error('Failed to load managers')
      
      const data = await response.json()
      setManagers(data.managers || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load existing managers",
        variant: "destructive"
      })
    }
  }

  const handleAssignExistingUser = async (user: User) => {
    setLoading(true)
    try {
      const assignmentRequest: ManagerAssignmentRequest = {
        condo_id: condoId,
        user_email: user.email,
        role: newManagerRole,
        permissions: newManagerPermissions
      }

      const response = await fetch(`/api/properties/${condoId}/managers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignmentRequest)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to assign manager')
      }

      const data = await response.json()
      
      // Update local state
      setManagers(prev => [...prev, data.manager])
      setAvailableUsers(prev => prev.filter(u => u.id !== user.id))
      
      toast({
        title: "Manager Assigned",
        description: `${user.name} has been assigned as ${newManagerRole}.`
      })

      // Reset form
      setNewManagerRole("manager")
      setNewManagerPermissions({
        manage_units: false,
        manage_residents: false,
        manage_visitors: true,
        view_analytics: false,
        manage_settings: false
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to assign manager",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInviteNewManager = async () => {
    if (!newManagerEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const assignmentRequest: ManagerAssignmentRequest = {
        condo_id: condoId,
        user_email: newManagerEmail.trim(),
        role: newManagerRole,
        permissions: newManagerPermissions
      }

      const response = await fetch(`/api/properties/${condoId}/managers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignmentRequest)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to invite manager')
      }

      const data = await response.json()
      
      // Update local state
      setManagers(prev => [...prev, data.manager])
      
      toast({
        title: "Invitation Sent",
        description: `Invitation sent to ${newManagerEmail}`
      })

      // Reset form
      setNewManagerEmail("")
      setNewManagerRole("manager")
      setNewManagerPermissions({
        manage_units: false,
        manage_residents: false,
        manage_visitors: true,
        view_analytics: false,
        manage_settings: false
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send invitation",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveManager = async (managerId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/properties/${condoId}/managers/${managerId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to remove manager')
      }

      // Update local state
      const removedManager = managers.find(m => m.id === managerId)
      setManagers(prev => prev.filter(m => m.id !== managerId))
      
      // Add user back to available users if they exist in the system
      if (removedManager?.user) {
        setAvailableUsers(prev => [...prev, removedManager.user!])
      }
      
      toast({
        title: "Manager Removed",
        description: "Manager has been removed from this property."
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove manager",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const updateManagerPermissions = async (managerId: string, permissions: any) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/properties/${condoId}/managers/${managerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update permissions')
      }

      const data = await response.json()
      
      // Update local state
      setManagers(prev => prev.map(m => 
        m.id === managerId ? { ...m, permissions: data.manager.permissions } : m
      ))
      
      toast({
        title: "Permissions Updated",
        description: "Manager permissions have been updated."
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update permissions",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredAvailableUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-300'
      case 'manager': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'security': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Manager Assignment - {condoName}
          </DialogTitle>
          <DialogDescription>
            Assign managers and security staff to this property
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assign Existing Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Assign Existing Users
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                <AnimatePresence>
                  {filteredAvailableUsers.map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <Badge variant="outline" className="text-xs">
                            {user.role}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAssignExistingUser(user)}
                        disabled={loading}
                      >
                        Assign
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* Invite New Manager */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Invite New Manager
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="manager@example.com"
                  value={newManagerEmail}
                  onChange={(e) => setNewManagerEmail(e.target.value)}
                />
              </div>

              <div>
                <Label>Role</Label>
                <Select value={newManagerRole} onValueChange={(value: any) => setNewManagerRole(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Permissions</Label>
                <div className="space-y-2 mt-2">
                  {Object.entries(newManagerPermissions).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label htmlFor={key} className="text-sm capitalize">
                        {key.replace('_', ' ')}
                      </Label>
                      <Switch
                        id={key}
                        checked={value}
                        onCheckedChange={(checked) => 
                          setNewManagerPermissions(prev => ({ ...prev, [key]: checked }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleInviteNewManager}
                disabled={loading || !newManagerEmail.trim()}
                className="w-full"
              >
                {loading ? "Sending..." : "Send Invitation"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Current Managers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Current Managers ({managers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {managers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No managers assigned to this property</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Manager</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {managers.map((manager) => (
                    <TableRow key={manager.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={manager.user?.avatar_url} />
                            <AvatarFallback>
                              {manager.user?.name?.charAt(0) || 'M'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {manager.user?.name || 'Pending Invitation'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {manager.user?.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(manager.role)}>
                          {manager.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(manager.permissions)
                            .filter(([_, enabled]) => enabled)
                            .map(([key, _]) => (
                              <Badge key={key} variant="outline" className="text-xs">
                                {key.replace('_', ' ')}
                              </Badge>
                            ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {manager.is_active ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-green-600">Active</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-4 w-4 text-orange-500" />
                              <span className="text-sm text-orange-600">Pending</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // Open permissions dialog
                              const newPermissions = { ...manager.permissions }
                              const updated = prompt(
                                "Update permissions (JSON format):",
                                JSON.stringify(newPermissions, null, 2)
                              )
                              if (updated) {
                                try {
                                  const parsed = JSON.parse(updated)
                                  updateManagerPermissions(manager.id, parsed)
                                } catch (e) {
                                  toast({
                                    title: "Error",
                                    description: "Invalid JSON format",
                                    variant: "destructive"
                                  })
                                }
                              }
                            }}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveManager(manager.id)}
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

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => {
            onManagersUpdate(managers)
            onClose()
          }}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
