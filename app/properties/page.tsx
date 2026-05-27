"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { PropertyCard } from "@/components/property-card"
import { PropertyFilters } from "@/components/property-filters"
import { getApprovedProperties } from "@/lib/property-data"
import type { Property } from "@/lib/property-data"
import { Building2 } from "lucide-react"

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [locationFilter, setLocationFilter] = useState("")
  const [priceFilter, setPriceFilter] = useState("all")

  useEffect(() => {
    const loadProperties = () => {
      setProperties(getApprovedProperties())
    }
    loadProperties()
  }, [])

  const filteredProperties = properties.filter((property) => {
    const matchesLocation = property.location.toLowerCase().includes(locationFilter.toLowerCase())

    let matchesPrice = true
    if (priceFilter !== "all") {
      if (priceFilter === "0-20000") {
        matchesPrice = property.price < 20000
      } else if (priceFilter === "20000-50000") {
        matchesPrice = property.price >= 20000 && property.price < 50000
      } else if (priceFilter === "50000-100000") {
        matchesPrice = property.price >= 50000 && property.price < 100000
      } else if (priceFilter === "100000+") {
        matchesPrice = property.price >= 100000
      }
    }

    return matchesLocation && matchesPrice
  })

  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8 space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Browse Properties</h1>
            <p className="text-muted-foreground leading-relaxed">
              Find your perfect property from our verified listings
            </p>
          </div>

          <PropertyFilters
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            priceFilter={priceFilter}
            setPriceFilter={setPriceFilter}
          />

          {filteredProperties.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center bg-muted rounded-full p-6 mb-4">
                <Building2 className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No properties found</h3>
              <p className="text-muted-foreground">Try adjusting your filters to see more results</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{filteredProperties.length}</span> properties
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
