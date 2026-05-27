"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getHeroImages, type HeroImage } from "@/lib/hero-data"

export function HeroCarousel() {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const images = getHeroImages()
    setHeroImages(images)
  }, [])

  useEffect(() => {
    if (heroImages.length === 0) return

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroImages.length])

  const next = () => setCurrent((prev) => (prev + 1) % heroImages.length)
  const prev = () => setCurrent((prev) => (prev - 1 + heroImages.length) % heroImages.length)

  const scrollToProperties = () => {
    const propertiesSection = document.getElementById("properties-section")
    if (propertiesSection) {
      propertiesSection.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  if (heroImages.length === 0) {
    return null
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-muted group/carousel">
      {heroImages.map((img, idx) => (
        <div
          key={img.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            idx === current ? "opacity-100 scale-100 z-10" : "opacity-0 scale-110 z-0"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10" />
          <img src={img.url || "/placeholder.svg"} alt={img.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 z-20 container mx-auto px-4 flex flex-col items-start justify-center text-left">
            <div className="max-w-3xl space-y-6">
              <div
                className={`transition-all duration-700 delay-300 ${idx === current ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
              >
                <Badge className="bg-accent text-accent-foreground mb-6 px-4 py-1.5 text-sm font-bold rounded-full border-none shadow-lg">
                  New Exclusive Listings
                </Badge>
                <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] text-balance drop-shadow-2xl">
                  {img.title}
                </h1>
              </div>
              <p
                className={`text-xl md:text-2xl text-white/90 max-w-xl text-pretty drop-shadow-lg transition-all duration-700 delay-500 ${idx === current ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
              >
                {img.description}
              </p>
              <div
                className={`flex flex-wrap gap-4 pt-4 transition-all duration-700 delay-700 ${idx === current ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
              >
                <Button
                  size="lg"
                  onClick={scrollToProperties}
                  className="rounded-full px-10 h-14 text-lg font-bold shadow-xl hover:scale-105 transition-transform"
                >
                  Explore Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {heroImages.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === current ? "bg-white w-8" : "bg-white/50 w-2 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
