"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/placeholder.svg?height=32&width=32" alt="Logo" width={32} height={32} className="rounded" />
            <span className="text-xl font-bold">MyCaseNote</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary">
              How it Works
            </Link>
            <Link href="#login" className="text-sm font-medium hover:text-primary">
              Login
            </Link>
            <Button asChild>
              <Link href="/app">Get Started</Link>
            </Button>
          </nav>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>

          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 bg-background md:hidden">
              <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image
                    src="/placeholder.svg?height=32&width=32"
                    alt="Logo"
                    width={32}
                    height={32}
                    className="rounded"
                  />
                  <span className="text-xl font-bold">MyCaseNote</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-6 w-6" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>
              <nav className="container grid gap-6 py-6">
                <Link
                  href="#features"
                  className="text-lg font-medium hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link
                  href="#how-it-works"
                  className="text-lg font-medium hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How it Works
                </Link>
                <Link
                  href="#login"
                  className="text-lg font-medium hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Button className="w-full" onClick={() => setMobileMenuOpen(false)} asChild>
                  <Link href="/app">Get Started</Link>
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="container flex-1 py-12 md:py-24 lg:py-32 mx-auto max-w-7xl px-4">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                MyCaseNote: Up-to-date Resources for Case Managers
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-[700px] mb-8">
                Find reliable, current social service resources and share real-time updates with your network. Never
                waste time on outdated information again.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="gap-2" asChild>
                  <Link href="/app">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative h-[350px] lg:h-[500px] rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="Dashboard Preview"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full bg-muted/50">
          <div className="container py-12 md:py-24 lg:py-32 mx-auto max-w-7xl px-4">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Built for Case Managers</h2>
              <p className="text-muted-foreground text-lg mx-auto max-w-[700px]">
                Tools designed specifically to help you find and share reliable resource information.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Real-time Resource Updates",
                  description:
                    "See current availability status and share updates with other case managers in your network.",
                  icon: "/placeholder.svg?height=48&width=48",
                },
                {
                  title: "Location-based Search",
                  description: "Find resources near your clients with zipcode filtering and distance-based results.",
                  icon: "/placeholder.svg?height=48&width=48",
                },
                {
                  title: "Resource Categories",
                  description: "Quickly filter by housing, food, healthcare, and other essential service categories.",
                  icon: "/placeholder.svg?height=48&width=48",
                },
                {
                  title: "Case Manager Notes",
                  description: "Leave notes and updates about resources for other case managers to reference.",
                  icon: "/placeholder.svg?height=48&width=48",
                },
                {
                  title: "Mobile Friendly",
                  description: "Access resource information from anywhere, perfect for fieldwork and client meetings.",
                  icon: "/placeholder.svg?height=48&width=48",
                },
                {
                  title: "Simple Verification",
                  description: "Easily verify and update resource information to keep the database current and reliable.",
                  icon: "/placeholder.svg?height=48&width=48",
                },
              ].map((feature, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Image src={feature.icon || "/placeholder.svg"} alt="" width={48} height={48} className="rounded" />
                      <CardTitle>{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full">
          <div className="container py-12 md:py-24 lg:py-32 mx-auto max-w-7xl px-4">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="text-muted-foreground text-lg mx-auto max-w-[700px]">
                Get started in minutes with our simple three-step process.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Create an Account",
                  description: "Sign up for free and set up your profile in just a few clicks.",
                },
                {
                  step: "2",
                  title: "Configure Your Workspace",
                  description: "Customize your dashboard and settings to match your workflow.",
                },
                {
                  step: "3",
                  title: "Start Using the Platform",
                  description: "Invite your team and begin collaborating right away.",
                },
              ].map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center space-y-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Login/Signup Section */}
        <section id="login" className="w-full bg-muted/50">
          <div className="container py-12 md:py-24 lg:py-32 mx-auto max-w-7xl px-4">
            <div className="max-w-md mx-auto">
              <div className="text-center space-y-4 mb-8">
                <h2 className="text-3xl font-bold tracking-tighter">Access Your Account</h2>
                <p className="text-muted-foreground">Log in to your account or create a new one to get started.</p>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="login">Login</TabsTrigger>
                      <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="name@example.com" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Password</Label>
                          <Link href="#" className="text-sm text-primary hover:underline">
                            Forgot password?
                          </Link>
                        </div>
                        <Input id="password" type="password" />
                      </div>
                      <Button className="w-full" asChild>
                        <Link href="/app">Login</Link>
                      </Button>
                    </TabsContent>

                    <TabsContent value="signup" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name">Full Name</Label>
                        <Input id="signup-name" placeholder="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input id="signup-email" type="email" placeholder="name@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input id="signup-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm">Confirm Password</Label>
                        <Input id="signup-confirm" type="password" />
                      </div>
                      <Button className="w-full" asChild>
                        <Link href="/app">Create Account</Link>
                      </Button>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full">
          <div className="container py-12 md:py-24 lg:py-32 mx-auto max-w-7xl px-4">
            <div className="rounded-lg bg-primary text-primary-foreground p-8 md:p-12 lg:p-16 text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Find Better Resources?
              </h2>
              <p className="text-lg mx-auto max-w-[700px] text-primary-foreground/90">
                Join other case managers who are sharing reliable, up-to-date resource information to better serve their
                clients.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="gap-2" asChild>
                  <Link href="/app">
                    Create Account <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Image src="/placeholder.svg?height=32&width=32" alt="Logo" width={32} height={32} className="rounded" />
                <span className="text-xl font-bold">MyCaseNote</span>
              </div>
              <p className="text-muted-foreground">
                Simplifying workflows and boosting productivity for teams of all sizes.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} MyCaseNote. All rights reserved.</p>
              <div className="flex gap-4">
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

