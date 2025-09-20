"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  QrCode,
  MessageCircle,
  Shield,
  Smartphone,
  Monitor,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Scan,
  Bell,
  ArrowRight,
  Building2,
  Wifi,
  Eye,
  EyeOff,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler"
// Removed auth dependencies for public demo page

// Mock data for demo
const mockResidents = [
  { id: 1, name: "Sarah Chen", unit: "12-A", avatar: "SC" },
  { id: 2, name: "Ahmad Rahman", unit: "15-B", avatar: "AR" },
  { id: 3, name: "Lisa Wong", unit: "8-C", avatar: "LW" },
]

const mockVisitors = [
  { id: 1, name: "John Doe", purpose: "Delivery", resident: "Sarah Chen", status: "pending", time: "2 min ago" },
  { id: 2, name: "Maria Garcia", purpose: "Visit", resident: "Ahmad Rahman", status: "approved", time: "5 min ago" },
  { id: 3, name: "David Kim", purpose: "Maintenance", resident: "Lisa Wong", status: "pending", time: "1 min ago" },
]

const mockMessages = [
  { id: 1, sender: "Sarah Chen", message: "Pool maintenance scheduled for tomorrow", time: "10 min ago" },
  { id: 2, sender: "Ahmad Rahman", message: "Anyone interested in carpooling to KLCC?", time: "15 min ago" },
  { id: 3, sender: "Lisa Wong", message: "Lost cat found near the lobby", time: "20 min ago" },
]

// WebSocket simulation
class DemoWebSocket {
  private listeners: Map<string, Function[]> = new Map()
  private interval: NodeJS.Timeout | null = null

  connect() {
    // Simulate connection
    this.interval = setInterval(() => {
      this.simulateRandomEvent()
    }, 3000)
  }

  disconnect() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  emit(event: string, data: any) {
    const callbacks = this.listeners.get(event) || []
    callbacks.forEach(callback => callback(data))
  }

  private simulateRandomEvent() {
    const events = [
      { type: 'visitor_request', data: { name: "New Visitor", purpose: "Delivery", resident: "Sarah Chen" } },
      { type: 'message', data: { sender: "Ahmad Rahman", message: "New community announcement" } },
      { type: 'approval', data: { visitor: "John Doe", status: "approved" } },
    ]
    
    const randomEvent = events[Math.floor(Math.random() * events.length)]
    this.emit(randomEvent.type, randomEvent.data)
  }
}

// Resident Phone Mockup Component
function ResidentPhoneMockup({ isActive, onQRGenerated, onMessageSend }: {
  isActive: boolean
  onQRGenerated: (qrData: any) => void
  onMessageSend: (message: string) => void
}) {
  const [currentView, setCurrentView] = useState<'home' | 'qr' | 'chat'>('home')
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState(mockMessages)
  const [visitorForm, setVisitorForm] = useState({
    name: '',
    purpose: '',
    phone: '',
    expectedTime: ''
  })

  const generateQR = () => {
    if (!visitorForm.name || !visitorForm.purpose) return
    
    const qrData = {
      id: Date.now(),
      visitorName: visitorForm.name,
      purpose: visitorForm.purpose,
      phone: visitorForm.phone,
      expectedTime: visitorForm.expectedTime,
      resident: "Sarah Chen",
      unit: "12-A",
      timestamp: new Date().toISOString(),
      status: 'pending'
    }
    
    const qrString = `CasaLink:${JSON.stringify(qrData)}`
    setQrCode(qrString)
    onQRGenerated(qrData)
  }

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "You",
        message: message,
        time: "now"
      }
      setMessages([newMessage, ...messages])
      onMessageSend(message)
      setMessage('')
    }
  }

  return (
    <div className="relative mx-auto w-72 sm:w-80 h-[540px] sm:h-[600px] bg-gradient-to-b from-black to-gray-900 rounded-[2.5rem] sm:rounded-[3rem] p-1.5 sm:p-2 shadow-2xl border-2 sm:border-4 border-primary">
      <div className="w-full h-full bg-background rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden relative">
        {/* Phone Screen Content */}
        <div className="p-4 sm:p-6 h-full flex flex-col">
          {/* Status Bar */}
          <div className="flex justify-between items-center mb-4 sm:mb-6 text-sm text-muted-foreground">
            <span>9:41</span>
            <div className="flex space-x-1">
              <div className="w-4 h-2 bg-primary rounded-sm"></div>
              <div className="w-4 h-2 bg-primary rounded-sm"></div>
              <div className="w-4 h-2 bg-muted rounded-sm"></div>
            </div>
          </div>

          {/* App Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-foreground">Welcome back, Sarah</h2>
              <p className="text-sm text-muted-foreground">Pavilion Residences, Unit 12-A</p>
            </div>
            <div className="relative">
              <Bell className="h-6 w-6 text-muted-foreground" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 sm:space-x-2 mb-4 sm:mb-6">
            <Button
              variant={currentView === 'home' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentView('home')}
              className="flex-1 text-xs sm:text-sm"
            >
              Home
            </Button>
            <Button
              variant={currentView === 'qr' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentView('qr')}
              className="flex-1 text-xs sm:text-sm"
            >
              QR Code
            </Button>
            <Button
              variant={currentView === 'chat' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentView('chat')}
              className="flex-1 text-xs sm:text-sm"
            >
              Chat
            </Button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {currentView === 'home' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    className="bg-primary/10 rounded-2xl p-4 cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentView('qr')}
                  >
                    <QrCode className="h-8 w-8 text-primary mb-2" />
                    <p className="text-sm font-medium text-foreground">Create QR</p>
                    <p className="text-xs text-muted-foreground">For visitors</p>
                  </motion.div>
                  <motion.div
                    className="bg-secondary/10 rounded-2xl p-4 cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentView('chat')}
                  >
                    <MessageCircle className="h-8 w-8 text-secondary mb-2" />
                    <p className="text-sm font-medium text-foreground">Community</p>
                    <p className="text-xs text-muted-foreground">3 new messages</p>
                  </motion.div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {mockVisitors.slice(0, 3).map((visitor, index) => (
                      <motion.div
                        key={visitor.id}
                        className="flex items-center space-x-3 p-3 bg-muted/30 rounded-xl"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          visitor.status === 'approved' ? 'bg-green-500' : 'bg-orange-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{visitor.name}</p>
                          <p className="text-xs text-muted-foreground">{visitor.purpose} • {visitor.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentView === 'qr' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Generate Visitor QR Code</h3>
                  <p className="text-sm text-muted-foreground">Create a secure QR code for your visitor</p>
                </div>

                {qrCode ? (
                  <div className="text-center space-y-4">
                    <div className="w-48 h-48 bg-white rounded-lg mx-auto flex items-center justify-center border-2 border-primary">
                      <QrCode className="h-32 w-32 text-primary" />
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm font-medium text-foreground mb-2">Visitor Details:</p>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p><strong>Name:</strong> {visitorForm.name}</p>
                        <p><strong>Purpose:</strong> {visitorForm.purpose}</p>
                        <p><strong>Phone:</strong> {visitorForm.phone || 'Not provided'}</p>
                        <p><strong>Expected:</strong> {visitorForm.expectedTime || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Button onClick={() => setQrCode(null)} variant="outline" size="sm" className="w-full">
                        Generate New QR
                      </Button>
                      <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                        Share QR to Visitor
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="visitorName" className="text-sm font-medium text-foreground">Visitor Name *</Label>
                        <Input
                          id="visitorName"
                          placeholder="Enter visitor name"
                          value={visitorForm.name}
                          onChange={(e) => setVisitorForm(prev => ({ ...prev, name: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="purpose" className="text-sm font-medium text-foreground">Purpose *</Label>
                        <Input
                          id="purpose"
                          placeholder="e.g., Delivery, Visit, Maintenance"
                          value={visitorForm.purpose}
                          onChange={(e) => setVisitorForm(prev => ({ ...prev, purpose: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium text-foreground">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder="Optional"
                          value={visitorForm.phone}
                          onChange={(e) => setVisitorForm(prev => ({ ...prev, phone: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="expectedTime" className="text-sm font-medium text-foreground">Expected Time</Label>
                        <Input
                          id="expectedTime"
                          placeholder="e.g., 2:00 PM"
                          value={visitorForm.expectedTime}
                          onChange={(e) => setVisitorForm(prev => ({ ...prev, expectedTime: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={generateQR} 
                      className="w-full"
                      disabled={!visitorForm.name || !visitorForm.purpose}
                    >
                      Generate QR Code
                    </Button>
                  </div>
                )}
              </div>
            )}

            {currentView === 'chat' && (
              <div className="space-y-4">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {messages.map((msg) => (
                    <div key={msg.id} className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-medium text-foreground">{msg.sender}</span>
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{msg.message}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button onClick={sendMessage} size="sm">
                    Send
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Visitor Phone Mockup Component
function VisitorPhoneMockup({ isActive, qrData, onQRScanned }: {
  isActive: boolean
  qrData: any | null
  onQRScanned: (qrData: any) => void
}) {
  const [currentView, setCurrentView] = useState<'home' | 'qr'>('home')

  const handleQRScan = () => {
    if (qrData) {
      onQRScanned(qrData)
    }
  }

  return (
    <div className="relative mx-auto w-72 sm:w-80 h-[540px] sm:h-[600px] bg-gradient-to-b from-black to-gray-900 rounded-[2.5rem] sm:rounded-[3rem] p-1.5 sm:p-2 shadow-2xl border-2 sm:border-4 border-secondary">
      <div className="w-full h-full bg-background rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden relative">
        {/* Phone Screen Content */}
        <div className="p-4 sm:p-6 h-full flex flex-col">
          {/* Status Bar */}
          <div className="flex justify-between items-center mb-4 sm:mb-6 text-sm text-muted-foreground">
            <span>9:41</span>
            <div className="flex space-x-1">
              <div className="w-4 h-2 bg-secondary rounded-sm"></div>
              <div className="w-4 h-2 bg-secondary rounded-sm"></div>
              <div className="w-4 h-2 bg-muted rounded-sm"></div>
            </div>
          </div>

          {/* App Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-foreground">Visitor Access</h2>
              <p className="text-sm text-muted-foreground">Pavilion Residences</p>
            </div>
            <div className="relative">
              <Scan className="h-6 w-6 text-secondary" />
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 sm:space-x-2 mb-4 sm:mb-6">
            <Button
              variant={currentView === 'home' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentView('home')}
              className="flex-1 text-xs sm:text-sm"
            >
              Home
            </Button>
            <Button
              variant={currentView === 'qr' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentView('qr')}
              className="flex-1 text-xs sm:text-sm"
            >
              QR Code
            </Button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {currentView === 'home' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-secondary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Welcome to Pavilion Residences</h3>
                  <p className="text-sm text-muted-foreground">Present your QR code to security for access</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Instructions:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Go to QR Code tab</li>
                      <li>• Show QR to security guard</li>
                      <li>• Wait for approval</li>
                      <li>• Proceed to your destination</li>
                    </ul>
                  </div>

                  {qrData ? (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-800">QR Code Received</span>
                      </div>
                      <p className="text-sm text-green-700">
                        You have a QR code from {qrData.resident} for {qrData.purpose}
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                        <span className="font-medium text-orange-800">No QR Code</span>
                      </div>
                      <p className="text-sm text-orange-700">
                        Ask the resident to share their QR code with you
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentView === 'qr' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Your QR Code</h3>
                  <p className="text-sm text-muted-foreground">Show this to security</p>
                </div>

                {qrData ? (
                  <div className="text-center space-y-4">
                    <div className="w-48 h-48 bg-white rounded-lg mx-auto flex items-center justify-center border-2 border-secondary">
                      <QrCode className="h-32 w-32 text-secondary" />
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm font-medium text-foreground mb-2">Visit Details:</p>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p><strong>Name:</strong> {qrData.visitorName}</p>
                        <p><strong>Purpose:</strong> {qrData.purpose}</p>
                        <p><strong>Resident:</strong> {qrData.resident}</p>
                        <p><strong>Unit:</strong> {qrData.unit}</p>
                      </div>
                    </div>
                    <Button onClick={handleQRScan} className="w-full bg-green-600 hover:bg-green-700">
                      Present QR to Security
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-48 h-48 bg-muted/30 rounded-lg mx-auto flex items-center justify-center">
                      <QrCode className="h-16 w-16 text-muted-foreground" />
                    </div>
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-orange-800">
                        No QR code available. Please ask the resident to share their QR code with you.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Desktop Security Dashboard Component
function DesktopMockup({ isActive, onVisitorApproval, onMessageReceived, scannedQR }: {
  isActive: boolean
  onVisitorApproval: (visitorId: number, approved: boolean) => void
  onMessageReceived: (message: string) => void
  scannedQR: any | null
}) {
  const [visitors, setVisitors] = useState(mockVisitors)
  const [selectedVisitor, setSelectedVisitor] = useState<number | null>(null)
  const [messages, setMessages] = useState(mockMessages)
  const [showQRScanner, setShowQRScanner] = useState(false)

  const handleApproval = (visitorId: number, approved: boolean) => {
    setVisitors(prev => prev.map(v => 
      v.id === visitorId ? { ...v, status: approved ? 'approved' : 'rejected' } : v
    ))
    onVisitorApproval(visitorId, approved)
  }

  const handleQRScan = (qrData: any) => {
    const newVisitor = {
      id: qrData.id,
      name: qrData.visitorName,
      purpose: qrData.purpose,
      resident: qrData.resident,
      status: 'pending' as const,
      time: 'now'
    }
    setVisitors(prev => [newVisitor, ...prev])
    setShowQRScanner(false)
  }

  useEffect(() => {
    if (scannedQR) {
      handleQRScan(scannedQR)
    }
  }, [scannedQR])

  useEffect(() => {
    if (onMessageReceived && typeof onMessageReceived === 'function') {
      setMessages(prev => [{
        id: prev.length + 1,
        sender: "System",
        message: "New message received from resident",
        time: "now"
      }, ...prev])
    }
  }, [onMessageReceived])

  return (
    <div className="w-full max-w-6xl mx-auto bg-background rounded-xl sm:rounded-2xl shadow-2xl border border-border overflow-hidden">
      {/* Desktop Header */}
      <div className="bg-primary text-primary-foreground p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8" />
            <div>
              <h1 className="text-lg sm:text-2xl font-bold">Security Dashboard</h1>
              <p className="text-primary-foreground/80 text-sm sm:text-base">Pavilion Residences Management</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowQRScanner(!showQRScanner)}
              className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 text-xs sm:text-sm"
            >
              <Scan className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">QR Scanner</span>
              <span className="sm:hidden">Scanner</span>
            </Button>
            <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground text-xs">
              <Wifi className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Live Demo</span>
              <span className="sm:hidden">Live</span>
            </Badge>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs sm:text-sm">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg p-4 sm:p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">QR Code Scanner</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowQRScanner(false)}>
                <EyeOff className="h-4 w-4" />
              </Button>
            </div>
            <div className="w-full h-48 sm:h-64 bg-muted/30 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <Scan className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-muted-foreground">Point camera at QR code</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                In a real app, this would use the device camera to scan QR codes
              </p>
              <Button onClick={() => setShowQRScanner(false)} className="w-full text-sm">
                Close Scanner
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Visitor Management */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Visitor Requests</span>
                </CardTitle>
                <CardDescription>Manage incoming visitor requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {visitors.map((visitor) => (
                    <motion.div
                      key={visitor.id}
                      className={`p-4 rounded-lg border ${
                        visitor.status === 'pending' ? 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950' :
                        visitor.status === 'approved' ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950' :
                        'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-foreground">{visitor.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Visiting {visitor.resident} • {visitor.purpose}
                          </p>
                        </div>
                        <Badge variant={
                          visitor.status === 'pending' ? 'secondary' :
                          visitor.status === 'approved' ? 'default' : 'destructive'
                        }>
                          {visitor.status}
                        </Badge>
                      </div>
                      
                      {visitor.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproval(visitor.id, true)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleApproval(visitor.id, false)}
                          >
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Feed */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Activity Feed</span>
                </CardTitle>
                <CardDescription>Real-time updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {messages.slice(0, 5).map((msg) => (
                    <div key={msg.id} className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-medium text-foreground">{msg.sender}</span>
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{msg.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Today's Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Visitors</span>
                    <span className="font-semibold text-foreground">{visitors.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Approved</span>
                    <span className="font-semibold text-green-600">
                      {visitors.filter(v => v.status === 'approved').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pending</span>
                    <span className="font-semibold text-orange-600">
                      {visitors.filter(v => v.status === 'pending').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DemoPage() {
  // Mock user for demo purposes
  const user = { role: 'demo', name: 'Demo User' }
  const [activeView, setActiveView] = useState<'resident' | 'visitor' | 'desktop'>('resident')
  const [ws, setWs] = useState<DemoWebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [demoEvents, setDemoEvents] = useState<string[]>([])
  const [sharedQRData, setSharedQRData] = useState<any | null>(null)
  const [scannedQR, setScannedQR] = useState<any | null>(null)

  useEffect(() => {
    const websocket = new DemoWebSocket()
    websocket.connect()
    setIsConnected(true)
    setWs(websocket)

    websocket.on('visitor_request', (data: any) => {
      setDemoEvents(prev => [...prev, `New visitor request: ${data.name}`])
    })

    websocket.on('message', (data: any) => {
      setDemoEvents(prev => [...prev, `New message: ${data.message}`])
    })

    websocket.on('approval', (data: any) => {
      setDemoEvents(prev => [...prev, `Visitor ${data.visitor} ${data.status}`])
    })

    return () => {
      websocket.disconnect()
      setIsConnected(false)
    }
  }, [])

  const handleQRGenerated = (qrData: any) => {
    setSharedQRData(qrData)
    setDemoEvents(prev => [...prev, `QR Code generated for ${qrData.visitorName}`])
  }

  const handleQRScanned = (qrData: any) => {
    setScannedQR(qrData)
    setDemoEvents(prev => [...prev, `QR Code scanned by security: ${qrData.visitorName}`])
  }

  const handleMessageSend = (message: string) => {
    if (ws) {
      ws.emit('message', { sender: "Sarah Chen", message })
      setDemoEvents(prev => [...prev, `Message sent: ${message}`])
    }
  }

  const handleVisitorApproval = (visitorId: number, approved: boolean) => {
    if (ws) {
      ws.emit('approval', { visitor: "Visitor", status: approved ? 'approved' : 'rejected' })
      setDemoEvents(prev => [...prev, `Visitor ${approved ? 'approved' : 'rejected'}`])
    }
  }

  return (
    <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14 sm:h-16">
              <div className="flex items-center space-x-2">
                <img 
                  src="/casalink-favicon/favicon-32x32.png" 
                  alt="CasaLink Logo" 
                  className="h-6 w-6 sm:h-8 sm:w-8"
                />
                <span className="text-lg sm:text-xl font-bold text-primary font-premium">CasaLink Demo</span>
                {user && (
                  <Badge variant="outline" className="text-xs">
                    {user.role}
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Badge variant={isConnected ? "default" : "secondary"} className="text-xs">
                  <Wifi className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{isConnected ? "Connected" : "Disconnected"}</span>
                  <span className="sm:hidden">{isConnected ? "On" : "Off"}</span>
                </Badge>
                <AnimatedThemeToggler />
                {/* Removed UserProfile for public demo */}
              </div>
            </div>
          </div>
        </nav>

      {/* Demo Header */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Interactive Demo
            </h1>
            <p className="text-sm sm:text-base lg:text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
              Experience CasaLink in action with real-time WebSocket communication between mobile and desktop views
            </p>
            
            {/* Mobile-friendly view switcher */}
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mb-6">
              <Button
                variant={activeView === 'resident' ? 'default' : 'outline'}
                onClick={() => setActiveView('resident')}
                className="flex items-center justify-center space-x-2 text-sm sm:text-base"
                size="sm"
              >
                <Smartphone className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Resident Phone</span>
                <span className="sm:hidden">Resident</span>
              </Button>
              <Button
                variant={activeView === 'visitor' ? 'default' : 'outline'}
                onClick={() => setActiveView('visitor')}
                className="flex items-center justify-center space-x-2 text-sm sm:text-base"
                size="sm"
              >
                <Smartphone className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Visitor Phone</span>
                <span className="sm:hidden">Visitor</span>
              </Button>
              <Button
                variant={activeView === 'desktop' ? 'default' : 'outline'}
                onClick={() => setActiveView('desktop')}
                className="flex items-center justify-center space-x-2 text-sm sm:text-base"
                size="sm"
              >
                <Monitor className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Security Dashboard</span>
                <span className="sm:hidden">Security</span>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo Views */}
      <section className="py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <AnimatePresence mode="wait">
            {activeView === 'resident' ? (
              <motion.div
                key="resident"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center"
              >
                <ResidentPhoneMockup
                  isActive={activeView === 'resident'}
                  onQRGenerated={handleQRGenerated}
                  onMessageSend={handleMessageSend}
                />
              </motion.div>
            ) : activeView === 'visitor' ? (
              <motion.div
                key="visitor"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center"
              >
                <VisitorPhoneMockup
                  isActive={activeView === 'visitor'}
                  qrData={sharedQRData}
                  onQRScanned={handleQRScanned}
                />
              </motion.div>
            ) : (
              <motion.div
                key="desktop"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <DesktopMockup
                  isActive={activeView === 'desktop'}
                  onVisitorApproval={handleVisitorApproval}
                  onMessageReceived={handleMessageSend}
                  scannedQR={scannedQR}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Demo Events Log */}
      <section className="py-4 sm:py-8 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Demo Events Log</span>
              </CardTitle>
              <CardDescription className="text-sm">Real-time WebSocket events</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto">
                {demoEvents.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No events yet. Interact with the demo to see real-time updates!
                  </p>
                ) : (
                  demoEvents.map((event, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-3 p-3 bg-background rounded-lg border"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm text-foreground">{event}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {new Date().toLocaleTimeString()}
                      </span>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Instructions */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5" />
                  <span>Resident Phone</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Fill visitor details form</li>
                  <li>• Generate QR codes</li>
                  <li>• Share QR with visitor</li>
                  <li>• Send community messages</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5" />
                  <span>Visitor Phone</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Receive QR from resident</li>
                  <li>• View visit details</li>
                  <li>• Present QR to security</li>
                  <li>• Wait for approval</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Monitor className="h-5 w-5" />
                  <span>Security Dashboard</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Scan visitor QR codes</li>
                  <li>• Approve/reject requests</li>
                  <li>• Monitor activity feed</li>
                  <li>• View daily statistics</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
