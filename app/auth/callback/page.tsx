"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Processing your signup...')

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get the temp token from URL params
        const tempToken = searchParams.get('temp_token')
        
        if (!tempToken) {
          throw new Error('Missing temporary token')
        }

        // Call the callback API to complete the signup
        const response = await fetch('/api/auth/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ temp_token: tempToken })
        })

        const data = await response.json()

        if (response.ok && data.success) {
          setStatus('success')
          setMessage('Account created successfully! Redirecting to your dashboard...')
          
          toast({
            title: "Welcome to CasaLink!",
            description: "Your account has been created successfully."
          })

          // Redirect to resident dashboard
          setTimeout(() => {
            router.push('/resident')
          }, 2000)
        } else {
          throw new Error(data.error || 'Failed to complete signup')
        }
      } catch (error) {
        console.error('Callback error:', error)
        setStatus('error')
        setMessage(error instanceof Error ? error.message : 'Failed to complete signup')
        
        toast({
          title: "Signup Failed",
          description: error instanceof Error ? error.message : "Failed to complete signup",
          variant: "destructive"
        })
      }
    }

    processCallback()
  }, [router, searchParams])

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-600" />
      case 'error':
        return <XCircle className="h-12 w-12 text-red-600" />
    }
  }

  const getTitle = () => {
    switch (status) {
      case 'loading':
        return 'Processing Signup'
      case 'success':
        return 'Welcome to CasaLink!'
      case 'error':
        return 'Signup Failed'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="flex flex-col items-center space-y-4">
            {getIcon()}
            <h2 className="text-2xl font-bold text-center">{getTitle()}</h2>
            <p className="text-center text-muted-foreground">{message}</p>
            
            {status === 'error' && (
              <Button onClick={() => router.push('/login')}>
                Go to Login
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
