"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { Property } from "@/lib/property-data"
import { MapPin, Maximize2, Home } from "lucide-react"
import Link from "next/link"

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (property.images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [property.images.length])

  return (
    <Link href={`/property/${property.id}`}>
      <Card className="overflow-hidden border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 cursor-pointer group bg-card/50 backdrop-blur-sm">
        <div className="relative h-64 bg-muted overflow-hidden">
          <img
            src={property.images[currentImageIndex] || "/placeholder.svg"}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-end">
            <p className="text-white font-bold text-xl drop-shadow-md">
              ₹{property.price.toLocaleString("en-IN")}
              <span className="text-xs font-normal opacity-90 ml-1">/month</span>
            </p>
            {property.images.length > 1 && (
              <div className="flex gap-1.5">
                {property.images.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentImageIndex ? "bg-white w-5" : "bg-white/40 w-1.5"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-1.5">
            <h3 className="font-bold text-xl line-clamp-1 group-hover:text-primary transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <div className="p-1 bg-secondary rounded-md">
                <MapPin className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-sm font-medium line-clamp-1">{property.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 py-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Configuration
              </span>
              <div className="flex items-center gap-1.5 font-semibold text-sm">
                <Home className="h-4 w-4 text-primary/70" />
                {property.bhk}
              </div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Total Area</span>
              <div className="flex items-center gap-1.5 font-semibold text-sm">
                <Maximize2 className="h-4 w-4 text-primary/70" />
                {property.area} sq.ft
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border/50">
            <span className="text-xs font-bold text-primary/80 group-hover:underline transition-all">
              View Details →
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
