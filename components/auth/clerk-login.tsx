"use client"

import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ClerkLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Welcome to CasaLink
          </CardTitle>
          <CardDescription className="text-gray-600">
            Sign in to access your condominium management portal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignedOut>
            <div className="space-y-3">
              <SignInButton mode="modal">
                <Button className="w-full" size="lg">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="outline" className="w-full" size="lg">
                  Create Account
                </Button>
              </SignUpButton>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                You are signed in!
              </p>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-12 h-12"
                  }
                }}
              />
            </div>
          </SignedIn>
        </CardContent>
      </Card>
    </div>
  )
}

export function ClerkAuthButtons() {
  return (
    <div className="flex items-center gap-2">
      <SignedOut>
        <SignInButton mode="modal">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button size="sm">
            Sign Up
          </Button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "w-8 h-8"
            }
          }}
        />
      </SignedIn>
    </div>
  )
}
