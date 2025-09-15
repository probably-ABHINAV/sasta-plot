
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { SiteHeader } from "@/components/navigation/site-header"
import { SiteFooter } from "@/components/navigation/footer"
import { MapPin, TrendingUp, Car, Hospital, GraduationCap, ShoppingBag, TreePine, Mountain, Star } from "lucide-react"

const locationData = [
  {
    name: "Dehradun Outskirts",
    description: "Perfect blend of city convenience and serene environment with excellent growth potential",
    plotsAvailable: "30+ Plots",
    priceRange: "₹15-45 Lakhs",
    image: "/images/dehradun-outskirts-plots.jpg",
    growth: "+35%",
    connectivity: "Excellent",
    amenities: ["Schools", "Hospitals", "Markets", "Transport"],
    detailedInfo: {
      overview: "Dehradun outskirts represent the perfect investment opportunity combining urban amenities with peaceful suburban living. The area has seen significant infrastructure development and offers excellent connectivity to major city centers.",
      keyHighlights: [
        "Rapid urbanization and infrastructure growth",
        "Proximity to Jolly Grant Airport (15 minutes)",
        "Direct highway connectivity",
        "Upcoming metro corridor development",
        "Government policy support for planned development"
      ],
      demographics: {
        population: "Growing rapidly - 25% increase in last 5 years",
        literacy: "92% literacy rate",
        employment: "IT hub development creating job opportunities"
      },
      investmentPotential: {
        appreciation: "25-35% annual growth expected",
        rental: "₹8,000-15,000 per month for built homes",
        infrastructure: "₹5000 crore investment planned in next 3 years"
      }
    }
  },
  {
    name: "Rishikesh Region",
    description: "Spiritual setting with growing infrastructure and tourism development",
    plotsAvailable: "20+ Plots",
    priceRange: "₹20-50 Lakhs",
    image: "/images/rishikesh-valley-plots-land.jpg",
    growth: "+42%",
    connectivity: "Good",
    amenities: ["Yoga Centers", "Ashrams", "River Access", "Tourism"],
    detailedInfo: {
      overview: "Rishikesh region offers unique investment opportunities in the spiritual tourism capital of India. With growing infrastructure and international recognition, property values are appreciating rapidly.",
      keyHighlights: [
        "UNESCO World Heritage site proximity",
        "International yoga and wellness tourism",
        "Ganga Aarti and spiritual significance",
        "Adventure sports hub development",
        "Luxury hotel and resort investments"
      ],
      demographics: {
        population: "Tourist influx of 2+ million annually",
        literacy: "89% literacy rate",
        employment: "Tourism and wellness industry jobs"
      },
      investmentPotential: {
        appreciation: "35-45% annual growth in prime areas",
        rental: "₹12,000-25,000 per month for hospitality",
        infrastructure: "Char Dham road development boosting connectivity"
      }
    }
  },
  {
    name: "Nainital Area",
    description: "Lake views and mountain tranquility with premium tourism appeal",
    plotsAvailable: "15+ Plots",
    priceRange: "₹25-60 Lakhs",
    image: "/images/nainital-lake-plots-area.jpg",
    growth: "+38%",
    connectivity: "Good",
    amenities: ["Lake View", "Hill Station", "Cool Climate", "Tourism Hub"],
    detailedInfo: {
      overview: "Nainital area represents premium hill station investment with consistent tourism demand and excellent appreciation potential. The lake proximity and mountain views make it highly desirable.",
      keyHighlights: [
        "Naini Lake proximity and scenic beauty",
        "Year-round pleasant climate",
        "Established tourism infrastructure",
        "Premium resort and hotel development",
        "Strong rental income potential"
      ],
      demographics: {
        population: "Tourist season brings 500K+ visitors",
        literacy: "94% literacy rate - highest in region",
        employment: "Tourism, education, and services"
      },
      investmentPotential: {
        appreciation: "30-40% annual growth for lake-view properties",
        rental: "₹15,000-30,000 per month in peak season",
        infrastructure: "All-weather road connectivity improvements"
      }
    }
  },
  {
    name: "Mussoorie Hills",
    description: "Premium mountain locations with scenic beauty and luxury appeal",
    plotsAvailable: "25+ Plots",
    priceRange: "₹30-80 Lakhs",
    image: "/images/mussoorie-hills-plots-available.jpg",
    growth: "+45%",
    connectivity: "Moderate",
    amenities: ["Mountain View", "Fresh Air", "Tourist Spot", "Premium Location"],
    detailedInfo: {
      overview: "Mussoorie hills offer the most premium investment opportunity in Uttarakhand with luxury tourism appeal and consistently high property appreciation rates.",
      keyHighlights: [
        "Queen of Hills - premium destination status",
        "Himalayan range panoramic views",
        "Colonial architecture heritage",
        "Luxury resort and villa developments",
        "International tourist destination"
      ],
      demographics: {
        population: "Elite residential community",
        literacy: "96% literacy rate",
        employment: "Premium tourism and hospitality"
      },
      investmentPotential: {
        appreciation: "40-50% annual growth for premium plots",
        rental: "₹20,000-50,000 per month for luxury properties",
        infrastructure: "Cable car and modern transport development"
      }
    }
  }
]

export default function LocationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-green-600/20 via-blue-400/10 to-purple-600/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-bold text-5xl md:text-6xl mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Prime Locations Across Uttarakhand
          </h1>
          <p className="text-gray-600 text-xl max-w-4xl mx-auto leading-relaxed mb-8">
            From bustling Dehradun outskirts to serene Himalayan foothills, discover locations that combine natural beauty with modern connectivity and exceptional growth potential.
          </p>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {locationData.map((location, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white border-0 shadow-lg"
              >
                <div className="relative overflow-hidden h-80">
                  <Image
                    src={location.image}
                    alt={location.name}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  <div className="absolute bottom-6 left-6 text-white">
                    <Badge className="bg-green-500/90 mb-3 text-sm px-3 py-1">{location.plotsAvailable}</Badge>
                    <h2 className="font-bold text-3xl mb-2">{location.name}</h2>
                    <p className="text-lg opacity-90 max-w-md">{location.description}</p>
                  </div>

                  <div className="absolute top-6 right-6 flex flex-col gap-2">
                    <Badge className="bg-white/95 text-green-600 font-bold text-sm px-3 py-1">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      {location.growth}
                    </Badge>
                    <Badge className="bg-white/95 text-blue-600 font-bold text-sm px-3 py-1">
                      {location.priceRange}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">{location.connectivity}</div>
                      <div className="text-sm text-gray-600">Connectivity</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-xl font-bold text-green-600">{location.growth}</div>
                      <div className="text-sm text-gray-600">Annual Growth</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-xl mb-4">Location Overview</h3>
                    <p className="text-gray-700 leading-relaxed">{location.detailedInfo.overview}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      Key Highlights
                    </h4>
                    <ul className="space-y-2">
                      {location.detailedInfo.keyHighlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <h5 className="font-semibold text-purple-600 mb-2">Demographics</h5>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>{location.detailedInfo.demographics.literacy}</div>
                        <div className="font-medium">{location.detailedInfo.demographics.employment}</div>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <h5 className="font-semibold text-orange-600 mb-2">Investment</h5>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>{location.detailedInfo.investmentPotential.appreciation}</div>
                        <div className="font-medium">Growth Expected</div>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-teal-50 rounded-lg">
                      <h5 className="font-semibold text-teal-600 mb-2">Rental Yield</h5>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>{location.detailedInfo.investmentPotential.rental}</div>
                        <div className="font-medium">Monthly Rental</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">Key Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {location.amenities.map((amenity, idx) => (
                        <Badge key={idx} variant="outline" className="text-sm px-3 py-1">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-lg py-3"
                      onClick={() => window.open('https://wa.me/917870231314?text=Hi, I want to know more about plots in ' + location.name, '_blank')}
                    >
                      <MapPin className="mr-2 h-5 w-5" />
                      Explore {location.name} Plots
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 py-3"
                      onClick={() => window.open('tel:+917870231314', '_self')}
                    >
                      Schedule Site Visit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
