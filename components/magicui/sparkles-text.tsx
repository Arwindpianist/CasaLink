"use client"

import { motion, useAnimation } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface SparklesTextProps {
  children: string
  className?: string
  sparklesCount?: number
  colors?: {
    first: string
    second: string
  }
}

export const SparklesText = ({
  children,
  className,
  sparklesCount = 10,
  colors = {
    first: "#F7CE5B",
    second: "#D4AF37",
  },
}: SparklesTextProps) => {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([])
  const textRef = useRef<HTMLSpanElement>(null)
  const controls = useAnimation()

  useEffect(() => {
    const generateSparkles = () => {
      if (!textRef.current) return

      const rect = textRef.current.getBoundingClientRect()
      const newSparkles = Array.from({ length: sparklesCount }, (_, i) => ({
        id: i,
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
      }))

      setSparkles(newSparkles)
    }

    generateSparkles()
    const interval = setInterval(generateSparkles, 2000)

    return () => clearInterval(interval)
  }, [sparklesCount])

  useEffect(() => {
    controls.start({
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
      },
    })
  }, [controls])

  return (
    <span className={cn("relative inline-block", className)} ref={textRef}>
      {children}
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute pointer-events-none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            x: [sparkle.x, sparkle.x + (Math.random() - 0.5) * 20],
            y: [sparkle.y, sparkle.y + (Math.random() - 0.5) * 20],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
          style={{
            left: sparkle.x,
            top: sparkle.y,
            width: "4px",
            height: "4px",
            background: `linear-gradient(45deg, ${colors.first}, ${colors.second})`,
            borderRadius: "50%",
            boxShadow: `0 0 6px ${colors.first}`,
          }}
        />
      ))}
    </span>
  )
}
