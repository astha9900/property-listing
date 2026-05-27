"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface PropertyFiltersProps {
  locationFilter: string
  setLocationFilter: (value: string) => void
  priceFilter: string
  setPriceFilter: (value: string) => void
}

export function PropertyFilters({
  locationFilter,
  setLocationFilter,
  priceFilter,
  setPriceFilter,
}: PropertyFiltersProps) {
  return (
    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
      <h3 className="font-semibold text-lg mb-4">Filter Properties</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="Search by location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price Range</Label>
          <Select value={priceFilter} onValueChange={setPriceFilter}>
            <SelectTrigger id="price" className="w-full">
              <SelectValue placeholder="Select price range" />
            </SelectTrigger>
            <SelectContent className="w-full max-w-[calc(100vw-2rem)]" position="popper" sideOffset={5}>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="0-20000">Under ₹20,000</SelectItem>
              <SelectItem value="20000-50000">₹20,000 - ₹50,000</SelectItem>
              <SelectItem value="50000-100000">₹50,000 - ₹1,00,000</SelectItem>
              <SelectItem value="100000+">Above ₹1,00,000</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
