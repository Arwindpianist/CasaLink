"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Building2, Mail, User, Lock, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface SignupLinkData {
  condo_id: string
  unit_id?: string
  resident_email: string
  condominiums: {
    name: string
    address: string
  }
  units?: {
    unit_number: string
    floor_number: number
  }
}

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(true)
  const [signupData, setSignupData] = useState<SignupLinkData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [signupSuccess, setSignupSuccess] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  // Validate signup link on component mount
  useEffect(() => {
    if (!token) {
      setError('Invalid signup link. Please contact your property management.')
      setValidating(false)
      return
    }

    validateSignupLink()
  }, [token])

  const validateSignupLink = async () => {
    try {
      const response = await fetch(`/api/signup-links/validate?token=${token}`)
      const data = await response.json()

      if (response.ok && data.success) {
        setSignupData(data.signup_link)
        setFormData(prev => ({
          ...prev,
          email: data.signup_link.resident_email
        }))
      } else {
        setError(data.error || 'Invalid or expired signup link')
      }
    } catch (error) {
      console.error('Error validating signup link:', error)
      setError('Failed to validate signup link. Please try again.')
    } finally {
      setValidating(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast({
        title: "Validation Error",
        description: "First name is required",
        variant: "destructive"
      })
      return false
    }

    if (!formData.lastName.trim()) {
      toast({
        title: "Validation Error",
        description: "Last name is required",
        variant: "destructive"
      })
      return false
    }

    if (!formData.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Email is required",
        variant: "destructive"
      })
      return false
    }

    if (formData.password.length < 8) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      })
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match",
        variant: "destructive"
      })
      return false
    }

    return true
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      // First, create user with Clerk
      const clerkResponse = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          token: token
        })
      })

      const clerkData = await clerkResponse.json()

      if (!clerkResponse.ok) {
        throw new Error(clerkData.error || 'Failed to create account')
      }

      // If successful, redirect to resident dashboard
      setSignupSuccess(true)
      toast({
        title: "Account Created Successfully",
        description: "Welcome to CasaLink! Redirecting to your dashboard..."
      })

      // Redirect after a short delay
      setTimeout(() => {
        router.push('/resident')
      }, 2000)

    } catch (error) {
      console.error('Signup error:', error)
      toast({
        title: "Signup Failed",
        description: error instanceof Error ? error.message : "Failed to create account. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Validating signup link...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-6 w-6" />
              Invalid Signup Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Please contact your property management for a new signup link.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (signupSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
              <h2 className="text-2xl font-bold text-green-600">Welcome to CasaLink!</h2>
              <p className="text-center text-muted-foreground">
                Your account has been created successfully. You'll be redirected to your dashboard shortly.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            Join CasaLink
          </CardTitle>
          <CardDescription>
            Create your resident account for {signupData?.condominiums.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Property Information */}
          {signupData && (
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-4 w-4 text-primary" />
                <span className="font-medium">{signupData.condominiums.name}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {signupData.condominiums.address}
              </p>
              {signupData.units && (
                <p className="text-sm text-muted-foreground">
                  Unit: {signupData.units.unit_number} (Floor {signupData.units.floor_number})
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This email was provided by your property management
              </p>
            </div>

            <Separator />

            {/* Password Fields */}
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a secure password"
                required
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
