"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  QrCode,
  MessageCircle,
  Megaphone,
  Shield,
  BarChart3,
  Smartphone,
  Users,
  CheckCircle,
  Star,
  ArrowRight,
  Building2,
  Wifi,
  DollarSign,
  Scan,
  Bell,
  Clock,
  TrendingUp,
} from "lucide-react"
import { motion } from "framer-motion"
import { WordRotate } from "@/components/magicui/word-rotate"
import { MagicCard } from "@/components/magicui/magic-card"
import { useTheme } from "next-themes"
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler"

function CostCalculator() {
  const { theme } = useTheme()
  const [units, setUnits] = React.useState(200)
  const [calculatedPrice, setCalculatedPrice] = React.useState(499)

  const calculatePrice = (unitCount: number) => {
    const baseFee = 199
    const perUnitRate = 1.50
    let total = baseFee + (unitCount * perUnitRate)
    
    // Volume discounts
    if (unitCount > 500) total *= 0.9 // 10% discount
    if (unitCount > 1000) total *= 0.85 // 15% discount
    
    return Math.round(total)
  }

  const handleUnitsChange = (value: string) => {
    const unitCount = parseInt(value) || 0
    setUnits(unitCount)
    setCalculatedPrice(calculatePrice(unitCount))
  }

  const getDiscountText = () => {
    if (units > 1000) return "15% volume discount"
    if (units > 500) return "10% volume discount"
    return null
  }

  return (
    <div className="relative max-w-md w-full">
      <Card className="p-0 w-full shadow-none border border-border/50 relative z-10 bg-background/95 backdrop-blur-sm">
        <CardHeader className="border-b border-border/50 p-6">
          <CardTitle className="warm-text-primary text-xl">Calculate Your Monthly Cost</CardTitle>
          <CardDescription className="warm-text-secondary text-sm">
            Use our transparent pricing formula to estimate your monthly cost
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6">
            {/* Pricing Formula Display */}
            <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="text-sm warm-text-secondary mb-2">Pricing Formula</div>
              <div className="text-lg font-semibold warm-text-primary">
                RM199 + (RM1.50 × units)
              </div>
            </div>

            {/* Input Section */}
            <div className="grid gap-3">
              <Label htmlFor="units" className="warm-text-primary text-sm font-medium">
                Number of Units/Rooms
              </Label>
              <Input 
                id="units" 
                type="number" 
                placeholder="Enter number of units..." 
                value={units}
                onChange={(e) => handleUnitsChange(e.target.value)}
                min="1"
                max="2000"
                className="warm-hover"
              />
              <div className="text-xs warm-text-secondary">
                For condos, apartments, hotels, offices, or shops
              </div>
            </div>

            {/* Price Display */}
            <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
              <div className="text-4xl font-bold warm-text-primary mb-2">
                RM{calculatedPrice.toLocaleString()}
              </div>
              <div className="text-sm warm-text-secondary mb-3">per month</div>
              
              {/* Breakdown */}
              <div className="text-xs warm-text-secondary space-y-1">
                <div>RM199 base fee + RM{(units * 1.50).toFixed(2)} units</div>
                {getDiscountText() && (
                  <div className="text-green-600 font-medium">{getDiscountText()}</div>
                )}
              </div>
            </div>

            {/* Comparison */}
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-sm warm-text-secondary mb-1">vs Traditional Systems</div>
              <div className="text-lg font-semibold text-green-600">
                Save {Math.round(((2000 - calculatedPrice) / 2000) * 100)}%
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-6 border-t border-border/50">
          <Button className="w-full warm-button" asChild>
            <a href="https://forms.zohopublic.com/arwinarwind1/form/FreeTrialRequest/formperma/m5kv-J7Xef4Cftd0DUtmptNpg040nGDm-496ngM4_4A" target="_blank" rel="noopener noreferrer">
              Get Started Today
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function LandingPage() {
  const propertyTypes = [
    "Condo,",
    "Apartment,", 
    "Hotel,",
    "Shop,",
    "Office,",
    "Building,",
    "Complex,"
  ]

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 warm-card/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <img 
                  src="/casalink-favicon/favicon-32x32.png" 
                  alt="CasaLink Logo" 
                  className="h-8 w-8"
                />
                <span className="text-xl font-bold warm-text-primary font-premium">CasaLink</span>
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="hidden sm:inline-flex" asChild>
                <a href="#features">Features</a>
              </Button>
              <Button variant="ghost" className="hidden sm:inline-flex" asChild>
                <a href="#pricing">Pricing</a>
              </Button>
              <Button variant="outline" className="warm-hover hidden sm:inline-flex" asChild>
                <a href="/demo">Try Demo</a>
              </Button>
              <Button className="warm-button hidden sm:inline-flex" asChild>
                <a href="https://forms.zohopublic.com/arwinarwind1/form/FreeTrialRequest/formperma/m5kv-J7Xef4Cftd0DUtmptNpg040nGDm-496ngM4_4A" target="_blank" rel="noopener noreferrer">
                  Request Access
                </a>
              </Button>
              <AnimatedThemeToggler />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div {...fadeInUp}>
              <Badge variant="secondary" className="mb-4">
                No Extra Hardware Required
              </Badge>
              <h1 className="hero-title warm-text-primary mb-6 text-balance">
                Your{" "}
                <WordRotate 
                  words={propertyTypes}
                  className="text-secondary"
                  duration={2500}
                />
                {" "}<span className="text-primary">Reimagined</span>
              </h1>
              <p className="hero-subtitle warm-text-secondary mb-8 text-pretty">
                Watch how a simple QR scan transforms visitor management, community connection, and daily operations for any
                property type.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8 warm-button" asChild>
                  <a href="/demo">
                    See It In Action
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent warm-hover" asChild>
                  <a href="https://forms.zohopublic.com/arwinarwind1/form/FreeTrialRequest/formperma/m5kv-J7Xef4Cftd0DUtmptNpg040nGDm-496ngM4_4A" target="_blank" rel="noopener noreferrer">
                    Request Access
                  </a>
                </Button>
              </div>
            </motion.div>

            {/* Right Interactive Demo */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Phone Mockup */}
              <div className="relative mx-auto w-80 h-[600px] bg-gradient-to-b from-black to-gray-900 rounded-[3rem] p-2 shadow-2xl border-4 border-primary">
                <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden relative">
                  {/* Phone Screen Content */}
                  <div className="p-6 h-full flex flex-col">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center mb-6 text-sm text-muted-foreground">
                      <span>9:41</span>
                      <div className="flex space-x-1">
                        <div className="w-4 h-2 bg-primary rounded-sm"></div>
                        <div className="w-4 h-2 bg-primary rounded-sm"></div>
                        <div className="w-4 h-2 bg-muted rounded-sm"></div>
                      </div>
                    </div>

                    {/* App Header */}
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-xl font-bold text-foreground">Welcome back, Sarah</h2>
                        <p className="text-sm text-muted-foreground">Pavilion Residences, Unit 12-A</p>
                      </div>
                      <div className="relative">
                        <Bell className="h-6 w-6 text-muted-foreground" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <motion.div
                        className="bg-primary/10 rounded-2xl p-4 cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <QrCode className="h-8 w-8 text-primary mb-2" />
                        <p className="text-sm font-medium text-foreground">Create QR</p>
                        <p className="text-xs text-muted-foreground">For visitors</p>
                      </motion.div>
                      <motion.div
                        className="bg-secondary/10 rounded-2xl p-4 cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <MessageCircle className="h-8 w-8 text-secondary mb-2" />
                        <p className="text-sm font-medium text-foreground">Community</p>
                        <p className="text-xs text-muted-foreground">3 new messages</p>
                      </motion.div>
                    </div>

                    {/* Recent Activity */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
                      <div className="space-y-3">
                        <motion.div
                          className="flex items-center space-x-3 p-3 bg-muted/30 rounded-xl"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1 }}
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">Visitor approved</p>
                            <p className="text-xs text-muted-foreground">John Doe • 2 min ago</p>
                          </div>
                        </motion.div>
                        <motion.div
                          className="flex items-center space-x-3 p-3 bg-muted/30 rounded-xl"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.2 }}
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">Pool booking confirmed</p>
                            <p className="text-xs text-muted-foreground">Tomorrow 3:00 PM</p>
                          </div>
                        </motion.div>
                        <motion.div
                          className="flex items-center space-x-3 p-3 bg-muted/30 rounded-xl"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.4 }}
                        >
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">New announcement</p>
                            <p className="text-xs text-muted-foreground">Maintenance notice</p>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -left-4 bg-primary/20 backdrop-blur-sm rounded-2xl p-4 border border-primary/20"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                <Scan className="h-6 w-6 text-primary" />
              </motion.div>

              <motion.div
                className="absolute top-20 -right-8 bg-secondary/20 backdrop-blur-sm rounded-2xl p-4 border border-secondary/20"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
              >
                <Clock className="h-6 w-6 text-secondary" />
              </motion.div>

              <motion.div
                className="absolute -bottom-8 left-8 bg-green-500/20 backdrop-blur-sm rounded-2xl p-4 border border-green-500/20"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
              >
                <CheckCircle className="h-6 w-6 text-green-500" />
              </motion.div>
            </motion.div>
          </div>

          {/* Stats Bar */}
          <motion.div
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div>
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Condominiums Trust Us</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Happy Residents</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">1M+</div>
              <div className="text-muted-foreground">QR Codes Generated</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="dashboard-title warm-text-primary mb-4">Everything You Need in One Platform</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Designed for modern condominiums with features that bring communities together
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            {[
              {
                icon: QrCode,
                title: "Visitor & Amenities Access",
                description:
                  "Generate QR codes for visitors and amenity bookings. No more paper logs or physical keys.",
                color: "text-primary",
              },
              {
                icon: MessageCircle,
                title: "Resident Chat",
                description:
                  "Connect with neighbors, organize events, and build a stronger community through real-time messaging.",
                color: "text-secondary",
              },
              {
                icon: Megaphone,
                title: "Community Board",
                description: "Stay updated with announcements, events, and browse the resident marketplace.",
                color: "text-primary",
              },
              {
                icon: Shield,
                title: "Management Dashboard",
                description:
                  "Powerful tools for security staff and property managers to oversee operations efficiently.",
                color: "text-secondary",
              },
              {
                icon: BarChart3,
                title: "SaaS Owner Dashboard",
                description: "Global analytics, system monitoring, and support tools for platform administrators.",
                color: "text-primary",
              },
              {
                icon: Smartphone,
                title: "Mobile-First Design",
                description: "Optimized for smartphones and tablets with responsive design that works everywhere.",
                color: "text-secondary",
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <feature.icon className={`h-12 w-12 ${feature.color} mb-4`} />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="dashboard-title warm-text-primary mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, secure, and efficient visitor management in four easy steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Resident Creates QR",
                description: "Generate a secure QR code for visitors or amenity access through the mobile app",
                icon: QrCode,
              },
              {
                step: "2",
                title: "Visitor Shows QR",
                description: "Visitor presents the QR code at the security checkpoint or amenity entrance",
                icon: Smartphone,
              },
              {
                step: "3",
                title: "Security Scans & Approves",
                description: "Security staff scans the code and approves or denies access instantly",
                icon: Shield,
              },
              {
                step: "4",
                title: "Everyone Gets Notified",
                description: "Automatic notifications keep residents and management informed of all activities",
                icon: CheckCircle,
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold text-sm">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="dashboard-title warm-text-primary mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for the modern world with features that matter
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Wifi,
                title: "No Extra Hardware",
                description:
                  "Works with existing smartphones and laptops. No need for expensive hardware installations or maintenance.",
                benefits: ["Use existing devices", "No installation costs", "Instant setup"],
              },
              {
                icon: DollarSign,
                title: "Lower Cost",
                description: "Significantly more affordable than traditional access control systems with faster ROI.",
                benefits: ["Competitive pricing", "No hardware costs", "Quick implementation"],
              },
              {
                icon: Users,
                title: "Friendlier UX",
                description:
                  "Intuitive interface designed for all age groups with a focus on user experience and accessibility.",
                benefits: ["Easy to use", "Mobile-optimized", "Accessible design"],
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full">
                  <CardHeader>
                    <feature.icon className="h-12 w-12 text-primary mb-4" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="dashboard-title warm-text-primary mb-4">Fair, Scalable Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Pay only for what you need. Our hybrid model ensures fair pricing for properties of all sizes
            </p>
          </motion.div>

          {/* Simple Pricing Formula */}
          <motion.div className="max-w-3xl mx-auto mb-16" {...fadeInUp}>
            <div className="text-center">
              <h3 className="text-2xl font-bold warm-text-primary mb-4">Simple Pricing Formula</h3>
              <p className="text-muted-foreground mb-8">One transparent pricing model for all property types</p>
              
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-border">
                <div className="text-4xl font-bold warm-text-primary mb-2">RM199 + RM1.50 per unit</div>
                <div className="text-muted-foreground mb-6">per month • Volume discounts for 500+ units</div>
                
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary mb-1">50 units</div>
                    <div className="text-lg warm-text-primary">RM274/month</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary mb-1">200 units</div>
                    <div className="text-lg warm-text-primary">RM499/month</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary mb-1">500 units</div>
                    <div className="text-lg warm-text-primary">RM854/month</div>
                    <div className="text-xs text-green-600">+ 10% discount</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Cost Calculator */}
          <motion.div className="max-w-md mx-auto mb-16" {...fadeInUp}>
            <CostCalculator />
          </motion.div>

          {/* Property Types */}
          <motion.div className="max-w-5xl mx-auto mb-16" {...fadeInUp}>
            <div className="text-center mb-12">
              <h3 className="text-xl font-bold warm-text-primary mb-4">Works for All Property Types</h3>
              <p className="text-muted-foreground">From boutique condos to major property groups</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Building2,
                  type: "Condominiums",
                  description: "Perfect for residential developments",
                  example: "200 units → RM499/month",
                },
                {
                  icon: Users,
                  type: "Hotels & Resorts",
                  description: "Ideal for hospitality management",
                  example: "100 rooms → RM349/month",
                },
                {
                  icon: DollarSign,
                  type: "Commercial Buildings",
                  description: "Great for office complexes",
                  example: "50 offices → RM274/month",
                },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div key={index} variants={fadeInUp} transition={{ delay: index * 0.1 }}>
                    <div className="text-center p-6 rounded-xl warm-hover border border-border">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <h4 className="text-lg font-semibold warm-text-primary mb-2">{item.type}</h4>
                      <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                      <div className="text-sm font-medium text-primary">{item.example}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* What's Included */}
          <motion.div className="max-w-4xl mx-auto mb-16" {...fadeInUp}>
            <div className="text-center mb-12">
              <h3 className="text-xl font-bold warm-text-primary mb-4">Everything You Need, Included</h3>
              <p className="text-muted-foreground">Complete property management solution with no hidden costs</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {[
                  "QR Code Visitor Management",
                  "Mobile App for Residents", 
                  "Community Chat & Announcements",
                  "Amenity Booking System",
                  "Security Dashboard",
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="warm-text-primary">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {[
                  "Analytics & Reports",
                  "Email Support",
                  "Data Backup & Security",
                  "Regular Updates",
                  "Multi-Property Management",
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="warm-text-primary">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Optional Enhancements */}
          <motion.div className="max-w-3xl mx-auto" {...fadeInUp}>
            <div className="text-center mb-12">
              <h3 className="text-xl font-bold warm-text-primary mb-4">Optional Enhancements</h3>
              <p className="text-muted-foreground">Add premium features as your needs grow</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  name: "Premium Ads",
                  price: "RM50-200/month",
                  description: "Community board advertising",
                },
                {
                  name: "White-Label Branding", 
                  price: "RM300-500/month",
                  description: "Custom branding & identity",
                },
                {
                  name: "Advanced Analytics",
                  price: "RM199/month", 
                  description: "Detailed insights & reporting",
                },
                {
                  name: "Priority Support",
                  price: "RM299/month",
                  description: "Enterprise support SLA",
                },
              ].map((addon, index) => (
                <motion.div key={index} variants={fadeInUp} transition={{ delay: index * 0.1 }}>
                  <div className="p-6 rounded-xl warm-hover border border-border">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold warm-text-primary">{addon.name}</h4>
                      <div className="font-bold text-primary text-sm">{addon.price}</div>
                    </div>
                    <p className="text-sm text-muted-foreground">{addon.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose CasaLink */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="dashboard-title warm-text-primary mb-4">Why Choose CasaLink?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Modern, affordable, and scalable property management
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {[
                {
                  icon: DollarSign,
                  title: "60-75% Cost Savings",
                  description: "RM199-999/month vs RM2,000+ for traditional systems",
                },
                {
                  icon: Shield,
                  title: "No Hardware Required",
                  description: "Device-based system eliminates expensive kiosks",
                },
                {
                  icon: TrendingUp,
                  title: "Scales with Your Growth",
                  description: "Pay only for units you manage, with volume discounts",
                },
                {
                  icon: Users,
                  title: "Multi-Property Ready",
                  description: "Perfect for condos, hotels, offices, and shops",
                },
              ].map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div key={index} variants={fadeInUp} transition={{ delay: index * 0.1 }}>
                    <div className="text-center p-6 rounded-xl warm-hover border border-border">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <h4 className="text-lg font-semibold warm-text-primary mb-2">{benefit.title}</h4>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="dashboard-title warm-text-primary mb-4">What Our Customers Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Trusted by condominiums across Malaysia</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Resident, Pavilion Residences",
                content:
                  "The QR code system has made visitor management so much easier. No more waiting for security to manually log visitors!",
                rating: 5,
              },
              {
                name: "Ahmad Rahman",
                role: "Property Manager, KLCC Suites",
                content:
                  "Our security team loves the dashboard. Everything is organized and we can track all activities in real-time.",
                rating: 5,
              },
              {
                name: "Lisa Wong",
                role: "Resident, Mont Kiara Heights",
                content:
                  "The community chat feature has really brought our neighbors together. We organize events and share updates easily.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Ready to Transform Your Condominium?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of condominiums already using our platform to create better communities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8" asChild>
                <a href="https://forms.zohopublic.com/arwinarwind1/form/FreeTrialRequest/formperma/m5kv-J7Xef4Cftd0DUtmptNpg040nGDm-496ngM4_4A" target="_blank" rel="noopener noreferrer">
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
                <a href="/demo">Schedule Demo</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src="/casalink-favicon/favicon-32x32.png" 
                  alt="CasaLink Logo" 
                  className="h-8 w-8"
                />
                <span className="text-xl font-bold text-foreground font-premium">CasaLink</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Making condominium management smarter, friendlier, and more efficient.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#features" className="hover:text-primary transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-primary transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="/demo" className="hover:text-primary transition-colors">
                    Demo
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="mailto:support@casalink.com" className="hover:text-primary transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="mailto:contact@casalink.com" className="hover:text-primary transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="https://status.casalink.com" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                    Status
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="/about" className="hover:text-primary transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="hover:text-primary transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-primary transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 CasaLink - Condominium Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
