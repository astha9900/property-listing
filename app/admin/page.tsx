"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PropertyStatusBadge } from "@/components/property-status-badge"
import { getProperties, updatePropertyStatus } from "@/lib/property-data"
import { getHeroImages, addHeroImage, deleteHeroImage, updateHeroImage, type HeroImage } from "@/lib/hero-data"
import type { Property } from "@/lib/property-data"
import { Building2, CheckCircle, XCircle, ImageIcon, Plus, Trash2, Upload, Edit2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type ViewMode = "all" | "pending" | "approved" | "rejected"

export default function AdminPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [allProperties, setAllProperties] = useState<Property[]>([])
  const [heroImages, setHeroImages] = useState<HeroImage[]>([])
  const [newHeroImage, setNewHeroImage] = useState({ url: "", title: "", description: "" })
  const [editingHero, setEditingHero] = useState<HeroImage | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("pending")

  const loadProperties = () => {
    setAllProperties(getProperties())
  }

  const loadHeroImages = () => {
    setHeroImages(getHeroImages())
  }

  useEffect(() => {
    loadProperties()
    loadHeroImages()
  }, [])

  const handleApprove = (id: string, title: string) => {
    updatePropertyStatus(id, "approved")
    loadProperties()
    toast({
      title: "Property approved",
      description: `${title} has been approved and is now visible to users.`,
    })
  }

  const handleReject = (id: string, title: string) => {
    updatePropertyStatus(id, "rejected")
    loadProperties()
    toast({
      title: "Property rejected",
      description: `${title} has been rejected.`,
      variant: "destructive",
    })
  }

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (isEdit && editingHero) {
          setEditingHero({ ...editingHero, url: reader.result as string })
        } else {
          setNewHeroImage({ ...newHeroImage, url: reader.result as string })
        }
      }
      reader.readAsDataURL(file)
      toast({
        title: "Image uploaded",
        description: "Image has been converted to base64 for preview.",
      })
    }
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
      uploadedBy: user?.email || "admin",
    })
    setNewHeroImage({ url: "", title: "", description: "" })
    loadHeroImages()
    toast({
      title: "Hero image added",
      description: "The new hero image has been added to the carousel.",
    })
  }

  const handleUpdateHeroImage = () => {
    if (!editingHero || !editingHero.url || !editingHero.title || !editingHero.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields for the hero image.",
        variant: "destructive",
      })
      return
    }

    updateHeroImage(editingHero.id, {
      url: editingHero.url,
      title: editingHero.title,
      description: editingHero.description,
    })
    setEditingHero(null)
    loadHeroImages()
    toast({
      title: "Hero image updated",
      description: "The hero image has been updated successfully.",
    })
  }

  const handleDeleteHeroImage = (id: string, title: string) => {
    deleteHeroImage(id)
    loadHeroImages()
    toast({
      title: "Hero image removed",
      description: `${title} has been removed from the carousel.`,
    })
  }

  const stats = {
    total: allProperties.length,
    pending: allProperties.filter((p) => p.status === "pending").length,
    approved: allProperties.filter((p) => p.status === "approved").length,
    rejected: allProperties.filter((p) => p.status === "rejected").length,
  }

  const getFilteredProperties = () => {
    if (viewMode === "all") return allProperties
    return allProperties.filter((p) => p.status === viewMode)
  }

  const filteredProperties = getFilteredProperties()

  const renderPropertyCard = (property: Property, showActions = true) => (
    <Card key={property.id} className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-6">
        <div className="flex gap-6">
          <img
            src={property.images[0] || "/placeholder.svg"}
            alt={property.title}
            className="w-48 h-48 object-cover rounded-lg flex-shrink-0"
          />
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-xl">{property.title}</h3>
                <p className="text-muted-foreground">{property.location}</p>
              </div>
              <PropertyStatusBadge status={property.status} />
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{property.bhk}</span>
              <span>•</span>
              <span>{property.area} sq.ft</span>
              <span>•</span>
              <span className="font-semibold text-foreground text-lg">
                ₹{property.price.toLocaleString("en-IN")}/month
              </span>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{property.description}</p>

            {property.amenities && property.amenities.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-muted-foreground">Amenities:</span>
                {property.amenities.map((amenity, index) => (
                  <span key={index} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                    {amenity}
                  </span>
                ))}
              </div>
            )}

            {showActions && (
              <div className="flex items-center gap-3 pt-2">
                {property.status === "pending" && (
                  <>
                    <Button
                      onClick={() => handleApprove(property.id, property.title)}
                      className="flex-1 bg-success hover:bg-success/90 text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(property.id, property.title)}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                {property.status === "rejected" && (
                  <Button
                    onClick={() => handleApprove(property.id, property.title)}
                    className="flex-1 bg-success hover:bg-success/90 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Reconsider & Approve
                  </Button>
                )}
                {property.status === "approved" && (
                  <Button
                    onClick={() => handleReject(property.id, property.title)}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Property
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8 space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground leading-relaxed">
              Review and manage property submissions and hero images
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card
              className={`bg-transparent cursor-pointer transition-all hover:shadow-lg ${viewMode === "all" ? "ring-2 ring-primary" : ""}`}
              onClick={() => setViewMode("all")}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Properties</p>
                    <p className="text-3xl font-bold mt-1">{stats.total}</p>
                  </div>
                  <div className="bg-primary/10 text-primary p-3 rounded-lg">
                    <Building2 className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`bg-transparent border-warning cursor-pointer transition-all hover:shadow-lg ${viewMode === "pending" ? "ring-2 ring-warning" : ""}`}
              onClick={() => setViewMode("pending")}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-3xl font-bold mt-1">{stats.pending}</p>
                  </div>
                  <div className="bg-warning/10 text-warning p-3 rounded-lg">
                    <Building2 className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`bg-transparent border-success cursor-pointer transition-all hover:shadow-lg ${viewMode === "approved" ? "ring-2 ring-success" : ""}`}
              onClick={() => setViewMode("approved")}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Approved</p>
                    <p className="text-3xl font-bold mt-1">{stats.approved}</p>
                  </div>
                  <div className="bg-success/10 text-success p-3 rounded-lg">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`bg-transparent border-destructive cursor-pointer transition-all hover:shadow-lg ${viewMode === "rejected" ? "ring-2 ring-destructive" : ""}`}
              onClick={() => setViewMode("rejected")}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Rejected</p>
                    <p className="text-3xl font-bold mt-1">{stats.rejected}</p>
                  </div>
                  <div className="bg-destructive/10 text-destructive p-3 rounded-lg">
                    <XCircle className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <ImageIcon className="h-6 w-6" />
              Hero Image Management
            </h2>

            <Card className="mb-6">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-lg">Add New Hero Image</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
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
                    <Input
                      id="heroDescription"
                      placeholder="Brief description or tagline"
                      value={newHeroImage.description}
                      onChange={(e) => setNewHeroImage({ ...newHeroImage, description: e.target.value })}
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
                <Button onClick={handleAddHeroImage} className="w-full md:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Hero Image
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {heroImages.map((hero) => (
                <Card key={hero.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="relative h-48 bg-muted">
                    <img src={hero.url || "/placeholder.svg"} alt={hero.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h4 className="font-semibold text-sm line-clamp-1">{hero.title}</h4>
                      <p className="text-xs text-white/80 line-clamp-1">{hero.description}</p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">By {hero.uploadedBy}</span>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => setEditingHero(hero)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Hero Image</DialogTitle>
                              <DialogDescription>Update the hero image details</DialogDescription>
                            </DialogHeader>
                            {editingHero && (
                              <div className="space-y-4 mt-4">
                                <div className="space-y-2">
                                  <Label htmlFor="editHeroUrl">Image URL or Upload</Label>
                                  <div className="flex gap-2">
                                    <Input
                                      id="editHeroUrl"
                                      placeholder="https://example.com/image.jpg"
                                      value={editingHero.url}
                                      onChange={(e) => setEditingHero({ ...editingHero, url: e.target.value })}
                                      className="flex-1"
                                    />
                                    <Label
                                      htmlFor="editHeroFileUpload"
                                      className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
                                    >
                                      <Upload className="h-4 w-4" />
                                      Upload
                                    </Label>
                                    <Input
                                      id="editHeroFileUpload"
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => handleHeroImageUpload(e, true)}
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="editHeroTitle">Title</Label>
                                  <Input
                                    id="editHeroTitle"
                                    value={editingHero.title}
                                    onChange={(e) => setEditingHero({ ...editingHero, title: e.target.value })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="editHeroDescription">Description</Label>
                                  <Textarea
                                    id="editHeroDescription"
                                    value={editingHero.description}
                                    onChange={(e) => setEditingHero({ ...editingHero, description: e.target.value })}
                                    rows={3}
                                  />
                                </div>
                                {editingHero.url && (
                                  <div className="space-y-2">
                                    <Label>Preview</Label>
                                    <div className="relative h-48 rounded-lg overflow-hidden border border-border">
                                      <img
                                        src={editingHero.url || "/placeholder.svg"}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  </div>
                                )}
                                <Button onClick={handleUpdateHeroImage} className="w-full">
                                  Update Hero Image
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteHeroImage(hero.id, hero.title)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              {viewMode === "all" && "All Properties"}
              {viewMode === "pending" && "Pending Approvals"}
              {viewMode === "approved" && "Approved Properties"}
              {viewMode === "rejected" && "Rejected Properties"}
            </h2>

            {filteredProperties.length === 0 ? (
              <Card className="p-12 text-center border-dashed">
                <div className="inline-flex items-center justify-center bg-muted rounded-full p-6 mb-4">
                  <Building2 className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No {viewMode} properties</h3>
                <p className="text-muted-foreground">
                  {viewMode === "pending" && "All properties have been reviewed"}
                  {viewMode === "approved" && "No properties have been approved yet"}
                  {viewMode === "rejected" && "No properties have been rejected yet"}
                  {viewMode === "all" && "No properties in the system"}
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredProperties.map((property) => renderPropertyCard(property))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
