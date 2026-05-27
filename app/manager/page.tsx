"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "../../contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PropertyStatusBadge } from "@/components/property-status-badge"
import { addProperty, getPropertiesByManager } from "@/lib/property-data"
import { getHeroImages, addHeroImage, deleteHeroImage, type HeroImage } from "@/lib/hero-data"
import type { Property } from "@/lib/property-data"
import { Building2, Plus, ListChecks, ImageIcon, Trash2, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function ManagerPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [properties, setProperties] = useState<Property[]>([])
  const [heroImages, setHeroImages] = useState<HeroImage[]>([])
  const [propertyDialogOpen, setPropertyDialogOpen] = useState(false)
  const [showHeroForm, setShowHeroForm] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    bhk: "",
    area: "",
    description: "",
    images: "",
    amenities: "",
  })

  const [newHeroImage, setNewHeroImage] = useState({ url: "", title: "", description: "" })

  const loadHeroImages = () => {
    setHeroImages(getHeroImages())
  }

  useEffect(() => {
    if (user?.email) {
      setProperties(getPropertiesByManager(user.email))
    }
    loadHeroImages()
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewHeroImage({ ...newHeroImage, url: reader.result as string })
      }
      reader.readAsDataURL(file)
      toast({
        title: "Image uploaded",
        description: "Image has been converted to base64 for preview.",
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.email) return

    const imageUrls = formData.images
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url.length > 0)

    const amenitiesList = formData.amenities
      .split(",")
      .map((amenity) => amenity.trim())
      .filter((amenity) => amenity.length > 0)

    const newProperty = addProperty({
      title: formData.title,
      location: formData.location,
      price: Number.parseFloat(formData.price),
      bhk: formData.bhk,
      area: Number.parseFloat(formData.area),
      description: formData.description,
      images: imageUrls,
      status: "pending",
      managerId: user.email,
      amenities: amenitiesList,
    })

    setProperties(getPropertiesByManager(user.email))

    toast({
      title: "Property submitted!",
      description: "Your property has been submitted for admin approval.",
    })

    setFormData({
      title: "",
      location: "",
      price: "",
      bhk: "",
      area: "",
      description: "",
      images: "",
      amenities: "",
    })

    setPropertyDialogOpen(false)
  }

  const handleAddHeroImage = () => {
    if (!newHeroImage.url || !newHeroImage.title || !newHeroImage.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields for the hero image.",
        variant: "destructive",
      })
      return
    }

    addHeroImage({
      ...newHeroImage,
      uploadedBy: user?.email || "manager",
    })
    setNewHeroImage({ url: "", title: "", description: "" })
    loadHeroImages()
    toast({
      title: "Hero image added",
      description: "The new hero image has been added to the carousel.",
    })
    setShowHeroForm(false)
  }

  const handleDeleteHeroImage = (id: string, title: string) => {
    deleteHeroImage(id)
    loadHeroImages()
    toast({
      title: "Hero image removed",
      description: `${title} has been removed from the carousel.`,
    })
  }

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Manager Dashboard</h1>
              <p className="text-muted-foreground leading-relaxed">
                List and manage your property submissions and hero images
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setShowHeroForm(!showHeroForm)} variant="outline">
                <ImageIcon className="h-5 w-5 mr-2" />
                {showHeroForm ? "Cancel" : "Add Hero"}
              </Button>
              <Dialog open={propertyDialogOpen} onOpenChange={setPropertyDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Property
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                      <Building2 className="h-6 w-6" />
                      Add New Property
                    </DialogTitle>
                    <DialogDescription>Fill in the details to list a new property for approval</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Property Title</Label>
                        <Input
                          id="title"
                          name="title"
                          placeholder="e.g., Luxury 3BHK Apartment"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          placeholder="e.g., Mumbai, Bandra West"
                          value={formData.location}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Monthly Rent (₹)</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          placeholder="e.g., 50000"
                          value={formData.price}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bhk">BHK</Label>
                        <Input
                          id="bhk"
                          name="bhk"
                          placeholder="e.g., 3BHK"
                          value={formData.bhk}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="area">Area (sq.ft)</Label>
                        <Input
                          id="area"
                          name="area"
                          type="number"
                          placeholder="e.g., 1500"
                          value={formData.area}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe the property, its features, and nearby amenities..."
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        required
                        className="resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="images">Image URLs (comma separated)</Label>
                      <Textarea
                        id="images"
                        name="images"
                        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                        value={formData.images}
                        onChange={handleInputChange}
                        rows={3}
                        required
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground">Enter image URLs separated by commas</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amenities">Amenities (comma separated)</Label>
                      <Input
                        id="amenities"
                        name="amenities"
                        placeholder="Parking, Gym, Swimming Pool, Security"
                        value={formData.amenities}
                        onChange={handleInputChange}
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      Submit Property for Approval
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {showHeroForm && (
            <Card className="shadow-lg border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Add Hero Image
                </CardTitle>
                <CardDescription>Add a new image to the homepage carousel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="heroUrl">Image URL or Upload</Label>
                    <div className="flex gap-2">
                      <Input
                        id="heroUrl"
                        placeholder="https://example.com/image.jpg or /image.png"
                        value={newHeroImage.url}
                        onChange={(e) => setNewHeroImage({ ...newHeroImage, url: e.target.value })}
                        className="flex-1"
                      />
                      <Label
                        htmlFor="heroFileUpload"
                        className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
                      >
                        <Upload className="h-4 w-4" />
                        Upload
                      </Label>
                      <Input
                        id="heroFileUpload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleHeroImageUpload}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Enter URL or upload an image file</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heroTitle">Title</Label>
                    <Input
                      id="heroTitle"
                      placeholder="Catchy headline for the hero"
                      value={newHeroImage.title}
                      onChange={(e) => setNewHeroImage({ ...newHeroImage, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heroDescription">Description</Label>
                    <Textarea
                      id="heroDescription"
                      placeholder="Brief description or tagline"
                      value={newHeroImage.description}
                      onChange={(e) => setNewHeroImage({ ...newHeroImage, description: e.target.value })}
                      rows={2}
                    />
                  </div>
                </div>
                {newHeroImage.url && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="relative h-48 rounded-lg overflow-hidden border border-border">
                      <img
                        src={newHeroImage.url || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg"
                        }}
                      />
                    </div>
                  </div>
                )}
                <Button onClick={handleAddHeroImage} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Hero Image
                </Button>
              </CardContent>
            </Card>
          )}

          {heroImages.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Hero Images
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {heroImages.map((hero) => (
                  <Card key={hero.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="relative h-48 bg-muted">
                      <img
                        src={hero.url || "/placeholder.svg"}
                        alt={hero.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h4 className="font-semibold text-sm line-clamp-1">{hero.title}</h4>
                        <p className="text-xs text-white/80 line-clamp-1">{hero.description}</p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">By {hero.uploadedBy}</span>
                        {hero.uploadedBy === user?.email && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteHeroImage(hero.id, hero.title)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-4">
              <ListChecks className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-2xl font-semibold">Your Properties</h2>
            </div>

            {properties.length === 0 ? (
              <Card className="p-12 text-center border-dashed">
                <div className="inline-flex items-center justify-center bg-muted rounded-full p-6 mb-4">
                  <Building2 className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No properties yet</h3>
                <p className="text-muted-foreground mb-6">Start by adding your first property listing</p>
                <Button onClick={() => setPropertyDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {properties.map((property) => (
                  <Card key={property.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <img
                          src={property.images[0] || "/placeholder.svg"}
                          alt={property.title}
                          className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-lg">{property.title}</h3>
                              <p className="text-muted-foreground text-sm">{property.location}</p>
                            </div>
                            <PropertyStatusBadge status={property.status} />
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{property.bhk}</span>
                            <span>•</span>
                            <span>{property.area} sq.ft</span>
                            <span>•</span>
                            <span className="font-semibold text-foreground">
                              ₹{property.price.toLocaleString("en-IN")}/month
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {property.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
