"use client"

import { cn } from "@/lib/utils"
import { ShineBorder } from "./shine-border"
import { Card } from "@/components/ui/card"

interface ShineBorderCardProps {
  children: React.ReactNode
  className?: string
  duration?: number
  shineColor?: string | string[]
  borderWidth?: number
  style?: React.CSSProperties
}

export const ShineBorderCard = ({
  children,
  className,
  duration = 14,
  shineColor = "#000000",
  borderWidth = 1,
  style,
}: ShineBorderCardProps) => {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <ShineBorder 
        duration={duration}
        shineColor={shineColor}
        borderWidth={borderWidth}
        style={style}
      />
      {children}
    </Card>
  )
}
