
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast, toast } from "@/hooks/use-toast"
import Image from "next/image"
import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/navigation/site-header"
import { SiteFooter } from "@/components/navigation/footer"
import { 
  MapPin, 
  Phone, 
  Calendar,
  Star,
  CheckCircle,
  Heart,
  Share2,
  Filter,
  Search,
  Play,
  Users,
  Building,
  Zap,
  Car,
  Wifi,
  Shield,
  TreePine,
  Hospital,
  GraduationCap
} from "lucide-react"

// Enhanced plot data with detailed descriptions
const plotData = [
  {
    id: 1,
    title: "Bajrang Vatika Premium",
    location: "Badripur, Dehradun",
    size: "1200-2400 sq ft",
    type: "Residential Project",
    price: "₹25-45 Lakhs",
    pricePerSqFt: "₹2,083 - ₹1,875",
    features: ["24x7 Security", "Wide Roads", "Ready Facilities", "Premium Location"],
    images: ["/images/bajrang-vatika-premium.jpg", "/images/bajrang-vatika-premium.jpg"],
    rating: 4.8,
    reviews: 156,
    available: 12,
    isPopular: true,
    amenities: ["Water Supply", "Electricity", "Road Access", "Legal Documents"],
    description: "Bajrang Vatika Premium offers an exceptional residential experience in the heart of Badripur, Dehradun. This premium project features spacious plots ranging from 1200 to 2400 sq ft, perfect for building your dream home. The location provides excellent connectivity to major city centers while maintaining the tranquility of suburban living.",
    detailedFeatures: {
      infrastructure: [
        "40-foot wide main roads with proper drainage system",
        "Underground electricity cables for aesthetic appeal",
        "24x7 water supply with backup systems",
        "Street lighting with solar panel integration",
        "Sewage treatment plant for environmental sustainability"
      ],
      connectivity: [
        "5 minutes from Dehradun-Rishikesh Highway",
        "15 minutes to Jolly Grant Airport",
        "20 minutes to Railway Station",
        "Direct bus connectivity to city center",
        "Proximity to upcoming metro corridor"
      ],
      nearbyFacilities: [
        "Government Hospital - 2 km",
        "Private Schools - 1.5 km",
        "Shopping Complex - 3 km",
        "Banks & ATMs - 1 km",
        "Restaurants & Cafes - 2 km"
      ],
      legalCompliance: [
        "Approved by Uttarakhand Urban Planning Department",
        "Clear land titles with no disputes",
        "Environmental clearance obtained",
        "All NOCs from relevant authorities",
        "Ready for immediate registration"
      ]
    },
    masterPlan: {
      totalArea: "50 acres",
      plotsAvailable: "200+ plots",
      openSpaces: "60% green coverage",
      infrastructure: "40% built-up area"
    },
    investmentHighlights: [
      "Expected 25-30% annual appreciation",
      "Prime location with upcoming infrastructure",
      "Limited availability - only 12 plots left",
      "Easy EMI options available",
      "Buy-back guarantee after 5 years"
    ]
  },
  {
    id: 2,
    title: "Nature Green Valley Phase 5",
    location: "Ganeshpur, Dehradun",
    size: "1000-1800 sq ft",
    type: "Residential Project",
    price: "₹18-32 Lakhs",
    pricePerSqFt: "₹1,800 - ₹1,778",
    features: ["Green Parks", "Children's Play Area", "Near Schools & Hospitals", "Clean Air"],
    images: ["/images/nature-green-valley-phase5.jpg", "/images/nature-green-valley-phase5.jpg"],
    rating: 4.7,
    reviews: 89,
    available: 8,
    isPopular: false,
    amenities: ["Playground", "Garden", "Security", "Paved Roads"],
    description: "Nature Green Valley Phase 5 is a thoughtfully planned residential project in Ganeshpur, designed for families who value nature and community living. With abundant green spaces and modern amenities, this project offers the perfect blend of urban convenience and natural serenity.",
    detailedFeatures: {
      infrastructure: [
        "30-foot main roads with landscaped sidewalks",
        "Central park with jogging track",
        "Children's playground with modern equipment",
        "Community center for social gatherings",
        "Rainwater harvesting system"
      ],
      connectivity: [
        "8 minutes to National Highway",
        "25 minutes to city center",
        "Direct auto-rickshaw connectivity",
        "Nearby bus stops for public transport",
        "Well-connected road network"
      ],
      nearbyFacilities: [
        "Primary School - 800m",
        "Healthcare Center - 1.2 km",
        "Local Market - 1 km",
        "Temple - 500m",
        "Post Office - 1.5 km"
      ],
      legalCompliance: [
        "Approved residential layout",
        "Clear property documents",
        "Municipality approved water connection",
        "Electricity board approvals",
        "Environmental impact assessment completed"
      ]
    },
    masterPlan: {
      totalArea: "35 acres",
      plotsAvailable: "150+ plots",
      openSpaces: "70% green coverage",
      infrastructure: "30% built-up area"
    },
    investmentHighlights: [
      "Affordable pricing with high potential",
      "Eco-friendly development approach",
      "Community-focused living",
      "Flexible payment plans",
      "Strong resale value prospects"
    ]
  },
  {
    id: 3,
    title: "Friend's Colony Phase 1",
    location: "Dehradun",
    size: "800-1500 sq ft",
    type: "Residential Project",
    price: "₹15-28 Lakhs",
    pricePerSqFt: "₹1,875 - ₹1,867",
    features: ["Smart Investment", "Excellent Connectivity", "Premium Community", "Limited Plots"],
    images: ["/images/friends-colony-phase1.jpg", "/images/friends-colony-phase1.jpg"],
    rating: 4.6,
    reviews: 67,
    available: 5,
    isPopular: false,
    amenities: ["Community Hall", "Street Lights", "Drainage", "Bus Stop Nearby"],
    description: "Friend's Colony Phase 1 represents smart urban living in Dehradun with excellent connectivity and modern infrastructure. This established community offers a perfect investment opportunity with proven track record and strong appreciation potential.",
    detailedFeatures: {
      infrastructure: [
        "25-foot internal roads with proper grading",
        "Community hall for events and gatherings",
        "LED street lighting throughout",
        "Proper stormwater drainage system",
        "Boundary wall with security gates"
      ],
      connectivity: [
        "Direct access to main road",
        "10 minutes to Clock Tower",
        "15 minutes to ISBT",
        "Easy access to Mussoorie road",
        "Multiple transportation options"
      ],
      nearbyFacilities: [
        "Convent School - 1 km",
        "District Hospital - 2 km",
        "Paltan Bazaar - 3 km",
        "Police Station - 1.5 km",
        "Fire Station - 2 km"
      ],
      legalCompliance: [
        "Municipal corporation approved",
        "All utility connections ready",
        "Clear land records",
        "No legal disputes",
        "Ready for construction"
      ]
    },
    masterPlan: {
      totalArea: "25 acres",
      plotsAvailable: "100+ plots",
      openSpaces: "40% green coverage",
      infrastructure: "60% developed area"
    },
    investmentHighlights: [
      "Established community with proven growth",
      "Central location advantage",
      "Strong rental potential",
      "Immediate possession available",
      "High liquidity investment"
    ]
  }
]

export default function PlotsPage() {
  const { toast } = useToast()
  const [selectedFilter, setSelectedFilter] = useState("All Plots")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPlot, setSelectedPlot] = useState<any>(null)
  const [favorites, setFavorites] = useState<number[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState<{[key: number]: number}>({})

  // Filter plots based on search and filter
  const filteredPlots = plotData.filter(plot => {
    const matchesSearch = plot.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plot.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilter === "All Plots" || 
                         (selectedFilter === "Popular" && plot.isPopular) ||
                         plot.type.includes(selectedFilter)
    return matchesSearch && matchesFilter
  })

  // Toggle favorites
  const toggleFavorite = (plotId: number) => {
    setFavorites(prev => 
      prev.includes(plotId) 
        ? prev.filter(id => id !== plotId)
        : [...prev, plotId]
    )
    toast({
      title: favorites.includes(plotId) ? "Removed from favorites" : "Added to favorites",
      description: "Your favorite plots are saved for quick access."
    })
  }

  // Share plot
  const sharePlot = (plot: any) => {
    if (navigator.share) {
      navigator.share({
        title: plot.title,
        text: `Check out this amazing plot: ${plot.title} in ${plot.location}`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(`${plot.title} - ${plot.location} - ${window.location.href}`)
      toast({
        title: "Link copied!",
        description: "Plot details copied to clipboard."
      })
    }
  }

  // Auto-rotate plot images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => {
        const newIndex = { ...prev }
        plotData.forEach(plot => {
          newIndex[plot.id] = ((prev[plot.id] || 0) + 1) % plot.images.length
        })
        return newIndex
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-blue-600/20 via-blue-400/10 to-purple-600/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-bold text-5xl md:text-6xl mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Premium Residential Plots
          </h1>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            Discover handpicked plots in Uttarakhand's most beautiful locations. Each property offers excellent connectivity, utility access, and guaranteed legal clarity.
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search plots by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 text-lg border-2 focus:border-blue-500 rounded-xl"
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              {["All Plots", "Popular", "Residential", "Investment"].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  onClick={() => setSelectedFilter(filter)}
                  className="px-6 py-2 rounded-full transition-all duration-300 hover:scale-105"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  {filter}
                </Button>
              ))}
            </div>
          </div>

          {/* Plots Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlots.map((plot) => (
              <Card
                key={plot.id}
                className="group hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white border-0 shadow-lg hover:transform hover:scale-105"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={plot.images[currentImageIndex[plot.id] || 0]}
                    alt={plot.title}
                    width={500}
                    height={350}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setSelectedPlot(plot)}
                      className="bg-white/90 hover:bg-white"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Quick View
                    </Button>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <Badge className="bg-blue-500 shadow-lg">{plot.type}</Badge>
                    {plot.isPopular && (
                      <Badge className="bg-orange-500 shadow-lg">Popular</Badge>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => toggleFavorite(plot.id)}
                      className="w-10 h-10 rounded-full p-0 bg-white/90 hover:bg-white"
                    >
                      <Heart className={`h-4 w-4 ${favorites.includes(plot.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => sharePlot(plot)}
                      className="w-10 h-10 rounded-full p-0 bg-white/90 hover:bg-white"
                    >
                      <Share2 className="h-4 w-4 text-gray-600" />
                    </Button>
                  </div>

                  {/* Availability indicator */}
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="secondary" className="bg-white/90">
                      <Users className="mr-1 h-3 w-3" />
                      {plot.available} plots left
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                      {plot.title}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{plot.rating}</span>
                      <span className="text-xs text-gray-500">({plot.reviews})</span>
                    </div>
                  </div>
                  <CardDescription className="flex items-center gap-2 text-base">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    {plot.location}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Plot Size</span>
                      <div className="font-semibold">{plot.size}</div>
                      <div className="text-xs text-gray-500">{plot.pricePerSqFt}/sq ft</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm text-gray-600">Price Range</span>
                      <div className="font-semibold text-blue-600">{plot.price}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-600 uppercase tracking-wide">
                      Key Features
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {plot.features.slice(0, 3).map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {plot.features.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{plot.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="flex-1 bg-blue-500 hover:bg-blue-600 shadow-lg">
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-2xl">{plot.title}</DialogTitle>
                          <DialogDescription className="flex items-center gap-2 text-lg">
                            <MapPin className="h-5 w-5 text-blue-500" />
                            {plot.location}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-4">
                            {plot.images.map((image, idx) => (
                              <Image
                                key={idx}
                                src={image}
                                alt={`${plot.title} view ${idx + 1}`}
                                width={400}
                                height={250}
                                className="w-full h-48 object-cover rounded-lg"
                              />
                            ))}
                          </div>

                          <div className="grid md:grid-cols-3 gap-6">
                            <div className="p-4 bg-blue-50 rounded-lg text-center">
                              <div className="text-2xl font-bold text-blue-600">{plot.price}</div>
                              <div className="text-sm text-gray-600">Price Range</div>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg text-center">
                              <div className="text-2xl font-bold text-green-600">{plot.size}</div>
                              <div className="text-sm text-gray-600">Plot Size</div>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-lg text-center">
                              <div className="text-2xl font-bold text-orange-600">{plot.available}</div>
                              <div className="text-sm text-gray-600">Available Plots</div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xl font-bold mb-3">Project Description</h3>
                            <p className="text-gray-700 leading-relaxed">{plot.description}</p>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                                <Building className="h-5 w-5 text-blue-500" />
                                Infrastructure
                              </h4>
                              <ul className="space-y-2">
                                {plot.detailedFeatures.infrastructure.map((item, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                                <Car className="h-5 w-5 text-green-500" />
                                Connectivity
                              </h4>
                              <ul className="space-y-2">
                                {plot.detailedFeatures.connectivity.map((item, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-purple-500" />
                                Nearby Facilities
                              </h4>
                              <ul className="space-y-2">
                                {plot.detailedFeatures.nearbyFacilities.map((item, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                                <Shield className="h-5 w-5 text-red-500" />
                                Legal Compliance
                              </h4>
                              <ul className="space-y-2">
                                {plot.detailedFeatures.legalCompliance.map((item, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                              <Zap className="h-5 w-5 text-yellow-500" />
                              Investment Highlights
                            </h4>
                            <div className="grid md:grid-cols-2 gap-3">
                              {plot.investmentHighlights.map((highlight, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                  {highlight}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="grid md:grid-cols-4 gap-4 text-center">
                            <div className="p-3 bg-gray-50 rounded">
                              <div className="font-bold">{plot.masterPlan.totalArea}</div>
                              <div className="text-sm text-gray-600">Total Area</div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded">
                              <div className="font-bold">{plot.masterPlan.plotsAvailable}</div>
                              <div className="text-sm text-gray-600">Total Plots</div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded">
                              <div className="font-bold">{plot.masterPlan.openSpaces}</div>
                              <div className="text-sm text-gray-600">Green Coverage</div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded">
                              <div className="font-bold">{plot.masterPlan.infrastructure}</div>
                              <div className="text-sm text-gray-600">Infrastructure</div>
                            </div>
                          </div>

                          <div className="flex gap-4 pt-4">
                            <Button className="flex-1 bg-green-500 hover:bg-green-600" onClick={() => window.open('tel:+917870231314', '_self')}>
                              <Phone className="mr-2 h-4 w-4" />
                              Call Now
                            </Button>
                            <Button className="flex-1" onClick={() => window.open('https://wa.me/917870231314?text=Hi, I am interested in ' + plot.title, '_blank')}>
                              <Calendar className="mr-2 h-4 w-4" />
                              Schedule Visit
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="outline" 
                      className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50"
                      onClick={() => window.open('tel:+917870231314', '_self')}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Contact Us
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
