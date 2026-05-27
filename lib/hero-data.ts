export interface HeroImage {
  id: string
  url: string
  title: string
  description: string
  uploadedBy?: string
}

// Initial hero images data
const initialHeroImages: HeroImage[] = [
  {
    id: "1",
    url: "/modern-luxury-living-room.png",
    title: "Find Your Dream Property with PropFinder",
    description: "Browse thousands of verified properties and find your perfect home today.",
    uploadedBy: "system",
  },
  {
    id: "2",
    url: "/luxury-apartment-interior.png",
    title: "Verified Properties Only",
    description: "Every listing is manually verified by our team for authenticity and quality.",
    uploadedBy: "system",
  },
  {
    id: "3",
    url: "/modern-apartment-bedroom.png",
    title: "Direct Connection",
    description: "Connect directly with property managers for the best deals and transparency.",
    uploadedBy: "system",
  },
]

let heroImages: HeroImage[] = []

// Initialize hero images from localStorage
export function initializeHeroImages() {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("hero_images")
    if (stored) {
      try {
        heroImages = JSON.parse(stored)
      } catch (error) {
        console.error("[v0] Failed to parse hero images from localStorage:", error)
        heroImages = [...initialHeroImages]
        localStorage.setItem("hero_images", JSON.stringify(heroImages))
      }
    } else {
      heroImages = [...initialHeroImages]
      localStorage.setItem("hero_images", JSON.stringify(heroImages))
    }
  } else {
    heroImages = [...initialHeroImages]
  }
}

// Initialize on module load
initializeHeroImages()

function saveHeroImages() {
  if (typeof window !== "undefined") {
    localStorage.setItem("hero_images", JSON.stringify(heroImages))
  }
}

export function getHeroImages(): HeroImage[] {
  return heroImages
}

export function addHeroImage(image: Omit<HeroImage, "id">): HeroImage {
  const newImage: HeroImage = {
    ...image,
    id: Date.now().toString(),
  }
  heroImages.push(newImage)
  saveHeroImages()
  return newImage
}

export function deleteHeroImage(id: string): boolean {
  const index = heroImages.findIndex((img) => img.id === id)
  if (index !== -1) {
    heroImages.splice(index, 1)
    saveHeroImages()
    return true
  }
  return false
}

export function updateHeroImage(id: string, updates: Partial<Omit<HeroImage, "id">>): boolean {
  const hero = heroImages.find((img) => img.id === id)
  if (hero) {
    Object.assign(hero, updates)
    saveHeroImages()
    return true
  }
  return false
}
