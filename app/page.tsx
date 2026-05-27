"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { PropertyCard } from "@/components/property-card"
import { getApprovedProperties, type Property } from "@/lib/property-data"
import { HeroCarousel } from "@/components/hero-carousel"
import { PropertyFilters } from "@/components/property-filters"

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  // <CHANGE> Add state for filters
  const [locationFilter, setLocationFilter] = useState("")
  const [priceFilter, setPriceFilter] = useState("all")

  useEffect(() => {
    const approved = getApprovedProperties()
    setProperties(approved)
    setFilteredProperties(approved)
  }, [])

  // <CHANGE> Implement filter logic with state updates
  useEffect(() => {
    let result = [...properties]

    if (locationFilter) {
      result = result.filter((p) => p.location.toLowerCase().includes(locationFilter.toLowerCase()))
    }

    if (priceFilter !== "all") {
      if (priceFilter === "100000+") {
        result = result.filter((p) => p.price >= 100000)
      } else {
        const [min, max] = priceFilter.split("-").map(Number)
        result = result.filter((p) => p.price >= min && p.price <= max)
      }
    }

    setFilteredProperties(result)
  }, [locationFilter, priceFilter, properties])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pb-16">
        <HeroCarousel />

        <div id="properties-section" className="container mx-auto px-4 mt-16 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-3">
              <h2 className="text-4xl font-extrabold tracking-tight text-foreground">
                Browse{" "}
                <span className="text-primary underline decoration-accent/30 underline-offset-8">Properties</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl">Find your perfect property from our collection</p>
            </div>
            <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold border border-primary/20">
              {filteredProperties.length} Properties Found
            </div>
          </div>

          {/* <CHANGE> Wrap filters and grid in proper container to prevent overflow */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <PropertyFilters
                  locationFilter={locationFilter}
                  setLocationFilter={setLocationFilter}
                  priceFilter={priceFilter}
                  setPriceFilter={setPriceFilter}
                />
              </div>
            </div>

            <div className="lg:col-span-3">
              {filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              ) : (
                <div className="bg-card rounded-2xl border border-dashed border-border p-12 text-center">
                  <p className="text-muted-foreground">No properties found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
