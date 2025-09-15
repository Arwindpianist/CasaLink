"use client"

import { Skeleton } from "@/components/ui/skeleton"

interface AdminLoadingLayoutProps {
  children: React.ReactNode
}

export function AdminLoadingLayout({ children }: AdminLoadingLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar Skeleton */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow pt-5 bg-card overflow-y-auto border-r">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="h-8 w-8 bg-muted animate-pulse rounded" />
            <div className="ml-3 h-6 w-24 bg-muted animate-pulse rounded" />
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 bg-muted animate-pulse rounded mx-2" />
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {children}
      </div>
    </div>
  )
}
