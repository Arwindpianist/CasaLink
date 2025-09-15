'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [isAnimating, setIsAnimating] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setIsAnimating(true)
    setTheme(theme === 'light' ? 'dark' : 'light')
    
    // Reset animation state after transition completes
    setTimeout(() => {
      setIsAnimating(false)
    }, 1000)
  }

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="warm-hover">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button 
      variant="outline" 
      size="icon" 
      className={`warm-hover transition-all duration-200 ${isAnimating ? 'scale-95' : 'scale-100'}`}
      onClick={toggleTheme}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-1000 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-1000 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
