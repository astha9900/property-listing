# 🏠 Property Listing Platform — Real Estate Discovery App

A modern full-stack real estate platform where users can browse, search, and filter property listings with rich details, images, and location data. Built with Next.js, Tailwind CSS, and React.

## 🌐 Live Demo

**[property-listing-lemon-two.vercel.app](https://property-listing-lemon-two.vercel.app/)**

## 🎯 What It Does

Finding the right property is overwhelming when listings are scattered across multiple sites. This platform centralises property discovery with powerful filters, detailed property pages, and a clean UI that makes the search experience fast and enjoyable.

## ✨ Features

### For Property Seekers
- **Browse Listings** — View properties with photos, price, location, and key specs
- **Advanced Filters** — Filter by property type, price range, bedrooms, bathrooms, and amenities
- **Search by Location** — Find properties in specific cities or neighbourhoods
- **Property Detail Pages** — Full image gallery, description, amenities list, and map view
- **Wishlist / Save Properties** — Bookmark favourite listings to revisit
- **Pagination** — Navigate large listing catalogs smoothly

### For Property Owners / Agents
- **List a Property** — Submit new property listings with photos and details
- **Manage Listings** — Edit or remove your own listings
- **Contact Integration** — Receive enquiries directly from listing pages

## 🛠️ Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS, shadcn/ui, Radix UI |
| State & Data | React Context, React Hook Form |
| Validation | Zod |
| Animations | Framer Motion |
| Date Handling | date-fns |
| Charts | Recharts |
| Deployment | Vercel |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+

### Installation

```bash
# Clone the repo
git clone https://github.com/astha9900/property-listing.git
cd property-listing

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
property-listing/
├── app/
│   ├── page.tsx            # Homepage with featured listings
│   ├── listings/           # All properties listing page
│   ├── listings/[id]/      # Individual property detail page
│   ├── search/             # Search results page
│   └── api/                # API route handlers
│
├── components/
│   ├── ui/                 # Base UI components (shadcn/ui)
│   ├── property/           # PropertyCard, PropertyGrid, Gallery
│   ├── filters/            # Search bar, filter panel, range sliders
│   └── layout/             # Navbar, Footer
│
├── contexts/               # Global state (wishlist, filters)
├── hooks/                  # Custom React hooks
├── lib/                    # Data utilities, helpers
└── styles/                 # Global styles
```

## 🔍 Filter Options

| Filter | Options |
|--------|---------|
| Property Type | Apartment, House, Villa, Studio, Commercial |
| Price Range | Slider from min to max |
| Bedrooms | 1, 2, 3, 4, 5+ |
| Bathrooms | 1, 2, 3+ |
| Amenities | Parking, Pool, Gym, Pet-friendly, Furnished |
| Location | City or neighbourhood search |

## 🔮 Future Improvements

- Map-based property search (Mapbox / Google Maps)
- Virtual property tours
- Mortgage calculator
- Agent profiles and direct chat
- Email alerts for new listings matching saved searches

## 📄 License

MIT © [Astha Bharti](https://github.com/astha9900)
