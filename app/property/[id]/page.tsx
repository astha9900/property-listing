"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ImageCarousel } from "@/components/image-carousel"
import { getPropertyById } from "@/lib/property-data"
import type { Property } from "@/lib/property-data"
import { MapPin, Maximize2, Home, ArrowLeft, CheckCircle, Lock } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export default function PropertyDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [property, setProperty] = useState<Property | null>(null)
  // <CHANGE> Add state to show login prompt when user tries to interact
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  useEffect(() => {
    const id = params.id as string
    const foundProperty = getPropertyById(id)
    setProperty(foundProperty || null)
  }, [params.id])

  // <CHANGE> Handler for interaction buttons that require auth
  const handleInteraction = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true)
    } else {
      // Handle the actual interaction (contact owner, schedule visit, etc.)
      alert("Feature coming soon!")
    }
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Property not found</h1>
          <Button onClick={() => router.back()}>Go Back</Button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Properties
        </Button>

        {/* <CHANGE> Login prompt modal overlay */}
        {showLoginPrompt && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full shadow-2xl">
              <CardContent className="p-8 text-center space-y-6">
                <div className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full p-4 mb-2">
                  <Lock className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Login Required</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Please sign in or create an account to contact property owners and schedule visits.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <Link href="/login" className="w-full">
                    <Button size="lg" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" className="w-full">
                    <Button size="lg" variant="outline" className="w-full bg-transparent">
                      Create Account
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="ghost"
                    onClick={() => setShowLoginPrompt(false)}
                    className="w-full"
                  >
                    Continue Browsing
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ImageCarousel images={property.images} title={property.title} />

            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-balance">{property.title}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span className="text-lg">{property.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1 text-sm bg-transparent">
                  <Home className="h-4 w-4" />
                  {property.bhk}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1 text-sm bg-transparent">
                  <Maximize2 className="h-4 w-4" />
                  {property.area} sq.ft
                </Badge>
              </div>

              <Card className="bg-transparent">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-3">Description</h2>
                  <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                </CardContent>
              </Card>

              {property.amenities && property.amenities.length > 0 && (
                <Card className="bg-transparent">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg border-2">
              <CardContent className="p-6 space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Monthly Rent</p>
                  <p className="text-4xl font-bold text-primary">₹{property.price.toLocaleString("en-IN")}</p>
                </div>

                <div className="space-y-3 py-4 border-y border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Property Type</span>
                    <span className="font-medium">{property.bhk} Apartment</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Area</span>
                    <span className="font-medium">{property.area} sq.ft</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge className="bg-success text-white capitalize">{property.status}</Badge>
                  </div>
                </div>

                {/* <CHANGE> Buttons now trigger login prompt if not authenticated */}
                <Button className="w-full" size="lg" onClick={handleInteraction}>
                  {isAuthenticated ? "Contact Owner" : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Login to Contact
                    </>
                  )}
                </Button>
                <Button variant="outline" className="w-full bg-transparent" size="lg" onClick={handleInteraction}>
                  {isAuthenticated ? "Schedule Visit" : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Login to Schedule
                    </>
                  )}
                </Button>

                <div className="bg-secondary/30 rounded-lg p-4 text-sm text-muted-foreground">
                  <p className="leading-relaxed">
                    This property has been verified by our team. {!isAuthenticated && "Sign in to"} contact the owner and schedule a visit.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
