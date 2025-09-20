"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ProfileRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to main resident page with profile tab
    router.replace('/resident?tab=profile')
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground mb-2">Redirecting...</h2>
        <p className="text-muted-foreground">Taking you to your profile</p>
      </div>
    </div>
  )
}