"use client"

import { ShineBorderCard } from "@/components/magicui/shine-border-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestMagicPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-4xl font-bold mb-8">Magic Card Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ShineBorderCard>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Test Card 1</h3>
            <p className="text-muted-foreground">Watch the golden shine border animation!</p>
          </CardContent>
        </ShineBorderCard>

        <ShineBorderCard>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Test Card 2</h3>
            <p className="text-muted-foreground">Continuous animated border effect.</p>
          </CardContent>
        </ShineBorderCard>

        <ShineBorderCard>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Test Card 3</h3>
            <p className="text-muted-foreground">Golden gradient shine animation.</p>
          </CardContent>
        </ShineBorderCard>
      </div>
    </div>
  )
}
