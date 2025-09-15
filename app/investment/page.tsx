
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/components/navigation/site-header"
import { SiteFooter } from "@/components/navigation/footer"
import { TrendingUp, Shield, Award, Calculator, PieChart, BarChart3, Target, Zap } from "lucide-react"

const investmentReasons = [
  {
    icon: TrendingUp,
    title: "High Appreciation Potential",
    description: "Uttarakhand properties have shown consistent 25-45% annual growth",
    details: [
      "Historical data shows steady price increase",
      "Government infrastructure investments",
      "Growing tourism and IT sector",
      "Limited land availability in prime areas"
    ]
  },
  {
    icon: Shield,
    title: "Legal Security",
    description: "All properties with clear titles and proper documentation",
    details: [
      "RERA approved projects where applicable",
      "Clear land records and ownership",
      "All NOCs from relevant authorities",
      "Legal due diligence completed"
    ]
  },
  {
    icon: Target,
    title: "Strategic Location",
    description: "Properties in high-growth corridors with excellent connectivity",
    details: [
      "Close to major highways and airports",
      "Upcoming infrastructure developments",
      "Educational and healthcare facilities nearby",
      "Tourism and business hubs proximity"
    ]
  },
  {
    icon: Zap,
    title: "Multiple Exit Options",
    description: "Flexible investment with various monetization strategies",
    details: [
      "Build your dream home",
      "Sell for capital appreciation",
      "Develop and rent for steady income",
      "Land banking for future generations"
    ]
  }
]

const marketAnalysis = {
  uttarakhandGrowth: [
    { year: "2020", growth: 15 },
    { year: "2021", growth: 22 },
    { year: "2022", growth: 28 },
    { year: "2023", growth: 35 },
    { year: "2024", growth: 42 }
  ],
  comparisonData: [
    { location: "Uttarakhand Hills", growth: 35, investment: "₹25L", returns: "₹45L" },
    { location: "Gurgaon", growth: 12, investment: "₹50L", returns: "₹58L" },
    { location: "Pune", growth: 18, investment: "₹40L", returns: "₹50L" },
    { location: "Bangalore", growth: 15, investment: "₹60L", returns: "₹72L" }
  ]
}

export default function InvestmentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-purple-600/20 via-blue-400/10 to-green-600/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-bold text-5xl md:text-6xl mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Why Invest in Uttarakhand?
          </h1>
          <p className="text-gray-600 text-xl max-w-4xl mx-auto leading-relaxed mb-8">
            Discover the compelling reasons why Uttarakhand real estate offers exceptional investment opportunities with high returns, legal security, and strategic growth potential.
          </p>
        </div>
      </section>

      {/* Investment Reasons */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-4xl mb-6">Key Investment Advantages</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Four compelling reasons why smart investors choose Uttarakhand properties
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {investmentReasons.map((reason, index) => (
              <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <reason.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-2xl mb-3">{reason.title}</h3>
                    <p className="text-gray-600 text-lg mb-4">{reason.description}</p>
                    <ul className="space-y-2">
                      {reason.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Market Analysis */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-4xl mb-6">Market Performance Analysis</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Data-driven insights showing consistent growth and superior returns
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Growth Chart */}
            <Card className="p-8 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <BarChart3 className="h-6 w-6 text-green-500" />
                  Uttarakhand Property Growth
                </CardTitle>
                <CardDescription className="text-lg">
                  Year-over-year appreciation rates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {marketAnalysis.uttarakhandGrowth.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium text-lg">{data.year}</span>
                    <div className="flex items-center gap-3 flex-1 ml-6">
                      <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
                        <div 
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-1000"
                          style={{ width: `${(data.growth / 50) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-xl text-green-600">{data.growth}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Comparison Table */}
            <Card className="p-8 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <PieChart className="h-6 w-6 text-purple-500" />
                  Investment Comparison
                </CardTitle>
                <CardDescription className="text-lg">
                  5-year investment returns comparison
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketAnalysis.comparisonData.map((data, index) => (
                    <div key={index} className={`p-4 rounded-lg ${index === 0 ? 'bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-300' : 'bg-gray-50'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-lg">{data.location}</span>
                        <Badge className={index === 0 ? "bg-purple-500" : "bg-gray-500"}>
                          {data.growth}% Growth
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Investment:</span>
                          <div className="font-semibold">{data.investment}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">5-Year Returns:</span>
                          <div className="font-semibold text-green-600">{data.returns}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Investment Calculator CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-bold text-4xl mb-6">Ready to Calculate Your Returns?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Use our advanced investment calculator to see potential returns based on your investment amount, timeline, and location preferences.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 text-xl px-8 py-4 shadow-xl"
              onClick={() => window.location.href = '/calculator'}
            >
              <Calculator className="mr-2 h-6 w-6" />
              Investment Calculator
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 text-xl px-8 py-4"
              onClick={() => window.open('tel:+917870231314', '_self')}
            >
              Speak to Investment Expert
            </Button>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-4xl mb-6">Success Stories</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Real investors, real returns - see how our clients have benefited
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Rajesh Kumar",
                location: "Delhi",
                investment: "₹20 Lakhs",
                returns: "₹38 Lakhs",
                timeline: "3 years",
                story: "Bought a plot in Dehradun outskirts, now it's worth almost double!"
              },
              {
                name: "Priya Sharma",
                location: "Mumbai",
                investment: "₹35 Lakhs",
                returns: "₹58 Lakhs",
                timeline: "4 years",
                story: "Built a beautiful weekend home, property value increased significantly."
              },
              {
                name: "Amit Patel",
                location: "Pune",
                investment: "₹15 Lakhs",
                returns: "₹32 Lakhs",
                timeline: "5 years",
                story: "Small investment in Rishikesh area, excellent returns for retirement."
              }
            ].map((story, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{story.name}</CardTitle>
                  <CardDescription>{story.location}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-blue-50 rounded">
                      <div className="font-bold text-blue-600">{story.investment}</div>
                      <div className="text-xs text-gray-600">Invested</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded">
                      <div className="font-bold text-green-600">{story.returns}</div>
                      <div className="text-xs text-gray-600">Current Value</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <Badge className="bg-purple-500 mb-3">{story.timeline}</Badge>
                    <p className="text-sm text-gray-600 italic">"{story.story}"</p>
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
