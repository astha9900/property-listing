export type PropertyStatus = "pending" | "approved" | "rejected"

export interface Property {
  id: string
  title: string
  location: string
  price: number
  bhk: string
  area: number
  description: string
  images: string[]
  status: PropertyStatus
  managerId: string
  amenities?: string[]
}

// Initial dummy data
const initialProperties: Property[] = [
  {
    id: "1",
    title: "Luxury 3BHK Apartment in Bandra",
    location: "Mumbai, Bandra West",
    price: 85000,
    bhk: "3BHK",
    area: 2100,
    description:
      "Beautiful apartment with sea view, modern amenities, fully furnished. Located in prime Bandra location with easy access to restaurants, malls, and transport.",
    images: ["/luxury-apartment-interior.png", "/luxury-apartment-kitchen.png", "/contemporary-bedroom.jpg"],
    status: "approved",
    managerId: "manager@test.com",
    amenities: ["Parking", "Gym", "Swimming Pool", "Security", "Power Backup"],
  },
  {
    id: "2",
    title: "Modern 2BHK with Garden View",
    location: "Bangalore, Koramangala",
    price: 45000,
    bhk: "2BHK",
    area: 1200,
    description:
      "Contemporary 2BHK apartment with modern kitchen, spacious living area. Close to cafes, tech parks, and shopping centers.",
    images: ["/modern-apartment-bedroom.png", "/modern-kitchen.png", "/modern-luxury-living-room.png"],
    status: "approved",
    managerId: "manager@test.com",
    amenities: ["Gym", "Parking", "WiFi", "Community Room"],
  },
  {
    id: "3",
    title: "Premium Studio Apartment",
    location: "Delhi, Connaught Place",
    price: 35000,
    bhk: "1BHK",
    area: 650,
    description:
      "Cozy studio apartment in the heart of the city. Perfect for professionals, close to office complexes and entertainment.",
    images: ["/cozy-studio-apartment.png", "/apartment-balcony-sea-view.jpg"],
    status: "approved",
    managerId: "manager@test.com",
    amenities: ["Parking", "Security", "Internet"],
  },
  {
    id: "4",
    title: "Luxury Villa with Private Garden",
    location: "Pune, Baner Road",
    price: 120000,
    bhk: "4BHK",
    area: 3500,
    description:
      "Spacious villa with private garden, home theater, modern architecture. Perfect for families seeking luxury and privacy.",
    images: ["/luxury-villa-exterior.png", "/luxurious-villa-living-room.png", "/lush-villa-garden.png"],
    status: "approved",
    managerId: "manager@test.com",
    amenities: ["Private Garden", "Garage", "Home Theater", "Study Room", "Modern Kitchen"],
  },
  {
    id: "5",
    title: "Compact Kitchen Premium Apartment",
    location: "Hyderabad, Kondapur",
    price: 38000,
    bhk: "2BHK",
    area: 900,
    description: "Well-designed 2BHK with smart spaces. Located near IT companies and shopping malls.",
    images: ["/compact-kitchen.jpg", "/luxury-bedroom.png"],
    status: "approved",
    managerId: "manager@test.com",
    amenities: ["Parking", "Gym", "Security"],
  },
  {
    id: "6",
    title: "Sky Lounge View Highrise",
    location: "Mumbai, Powai",
    price: 95000,
    bhk: "3BHK",
    area: 2200,
    description: "Premium highrise apartment with stunning sky lounge views. Equipped with all modern amenities.",
    images: ["/sky-lounge-view.jpg", "/premium-highrise-apartment.jpg"],
    status: "approved",
    managerId: "manager@test.com",
    amenities: ["Sky Lounge", "Gym", "Swimming Pool", "Parking", "Concierge"],
  },
  {
    id: "7",
    title: "Beachside 2BHK Paradise",
    location: "Goa, Candolim",
    price: 55000,
    bhk: "2BHK",
    area: 1100,
    description:
      "Wake up to the sound of waves in this beautiful beachside property. Fully furnished with sea-facing balcony.",
    images: ["/apartment-balcony-sea-view.jpg", "/modern-luxury-living-room.png"],
    status: "pending",
    managerId: "manager@test.com",
    amenities: ["Beach Access", "Parking", "Security", "Swimming Pool"],
  },
  {
    id: "8",
    title: "Smart Home 3BHK with Automation",
    location: "Bangalore, Whitefield",
    price: 68000,
    bhk: "3BHK",
    area: 1800,
    description:
      "Experience the future with this fully automated smart home. Voice-controlled lights, temperature, and security systems.",
    images: ["/modern-apartment-bedroom.png", "/luxury-apartment-kitchen.png"],
    status: "pending",
    managerId: "manager@test.com",
    amenities: ["Smart Home Automation", "Gym", "Parking", "Security", "Power Backup"],
  },
  {
    id: "9",
    title: "Penthouse with Rooftop Garden",
    location: "Delhi, Vasant Kunj",
    price: 150000,
    bhk: "4BHK",
    area: 4000,
    description:
      "Luxurious penthouse with private rooftop garden and panoramic city views. Premium finishes throughout.",
    images: ["/luxurious-villa-living-room.png", "/lush-villa-garden.png"],
    status: "pending",
    managerId: "manager@test.com",
    amenities: ["Rooftop Garden", "Private Elevator", "Jacuzzi", "Home Theater", "Modular Kitchen"],
  },
  {
    id: "10",
    title: "Budget-Friendly 1BHK",
    location: "Pune, Kothrud",
    price: 18000,
    bhk: "1BHK",
    area: 500,
    description:
      "Affordable yet comfortable living space. No proper maintenance, limited amenities, and basic furnishing.",
    images: ["/cozy-studio-apartment.png"],
    status: "rejected",
    managerId: "manager@test.com",
    amenities: ["Parking"],
  },
  {
    id: "11",
    title: "Old Heritage Bungalow",
    location: "Mumbai, Colaba",
    price: 200000,
    bhk: "5BHK",
    area: 5000,
    description: "Historic property with structural issues. Requires extensive renovation and modernization.",
    images: ["/luxury-villa-exterior.png"],
    status: "rejected",
    managerId: "manager@test.com",
    amenities: ["Large Garden", "Heritage Structure"],
  },
]

// In-memory storage (will be replaced with localStorage for persistence)
let properties: Property[] = []
let propertyId = 0

// Initialize with dummy data
export function initializeProperties() {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("properties")
    if (stored) {
      try {
        properties = JSON.parse(stored)
        // Find max ID
        propertyId = Math.max(...properties.map((p) => Number.parseInt(p.id)), 0)
      } catch (error) {
        console.error("Failed to load properties from localStorage:", error)
        properties = JSON.parse(JSON.stringify(initialProperties))
        localStorage.setItem("properties", JSON.stringify(properties))
      }
    } else {
      properties = JSON.parse(JSON.stringify(initialProperties))
      localStorage.setItem("properties", JSON.stringify(properties))
    }
  } else {
    properties = JSON.parse(JSON.stringify(initialProperties))
  }
}

// Initialize on module load
initializeProperties()

function saveProperties() {
  if (typeof window !== "undefined") {
    localStorage.setItem("properties", JSON.stringify(properties))
  }
}

export function getProperties(): Property[] {
  return properties
}

export function getApprovedProperties(): Property[] {
  return properties.filter((p) => p.status === "approved")
}

export function getPendingProperties(): Property[] {
  return properties.filter((p) => p.status === "pending")
}

export function getRejectedProperties(): Property[] {
  return properties.filter((p) => p.status === "rejected")
}

export function getPropertiesByManager(managerId: string): Property[] {
  return properties.filter((p) => p.managerId === managerId)
}

export function getPropertyById(id: string): Property | undefined {
  return properties.find((p) => p.id === id)
}

export function addProperty(property: Omit<Property, "id">): Property {
  propertyId++
  const newProperty: Property = {
    ...property,
    id: propertyId.toString(),
  }
  properties.push(newProperty)
  saveProperties()
  return newProperty
}

export function updatePropertyStatus(id: string, status: PropertyStatus): boolean {
  const property = properties.find((p) => p.id === id)
  if (property) {
    property.status = status
    saveProperties()
    return true
  }
  return false
}

export function deleteProperty(id: string): boolean {
  const index = properties.findIndex((p) => p.id === id)
  if (index !== -1) {
    properties.splice(index, 1)
    saveProperties()
    return true
  }
  return false
}
