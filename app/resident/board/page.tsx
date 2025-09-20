"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function BoardRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to main resident page with board tab
    router.replace('/resident?tab=board')
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground mb-2">Redirecting...</h2>
        <p className="text-muted-foreground">Taking you to the community board</p>
      </div>
    </div>
  )
}