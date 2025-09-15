
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SiteHeader } from "@/components/navigation/site-header"
import { SiteFooter } from "@/components/navigation/footer"
import { toast } from "@/hooks/use-toast"
import { useState } from "react"
import { Calculator, TrendingUp, Zap, DollarSign, Home, Calendar } from "lucide-react"

const locationData = [
  { name: "Dehradun Outskirts", baseRate: 1500, growthRate: 0.25 },
  { name: "Rishikesh Region", baseRate: 2000, growthRate: 0.30 },
  { name: "Nainital Area", baseRate: 2500, growthRate: 0.28 },
  { name: "Mussoorie Hills", baseRate: 3000, growthRate: 0.35 }
]

export default function CalculatorPage() {
  const [calculatorData, setCalculatorData] = useState({
    plotSize: "",
    location: "",
    timeline: "5",
    investmentType: "plot",
    plotValue: 0,
    expectedGrowth: 0,
    constructionCost: 0,
    totalInvestment: 0,
    potentialReturn: 0,
    annualGrowthRate: 0
  })

  const calculateInvestment = () => {
    if (!calculatorData.plotSize || !calculatorData.location) {
      toast({
        title: "Please fill all required fields",
        description: "Plot size and location are required for calculation.",
        variant: "destructive"
      })
      return
    }

    const size = parseInt(calculatorData.plotSize)
    const selectedLocation = locationData.find(loc => loc.name === calculatorData.location)
    
    if (!selectedLocation) {
      toast({
        title: "Invalid location selected",
        description: "Please select a valid location.",
        variant: "destructive"
      })
      return
    }

    const baseRate = selectedLocation.baseRate
    const growthRate = selectedLocation.growthRate
    
    const plotValue = size * baseRate
    const years = parseInt(calculatorData.timeline)
    const expectedGrowth = plotValue * Math.pow(1 + growthRate, years)
    const constructionCost = calculatorData.investmentType === "home" ? size * 1800 : 0
    const totalInvestment = plotValue + constructionCost
    const potentialReturn = expectedGrowth + constructionCost
    const annualGrowthRate = ((expectedGrowth / plotValue) ** (1/years) - 1) * 100

    setCalculatorData(prev => ({
      ...prev,
      plotValue,
      expectedGrowth,
      constructionCost,
      totalInvestment,
      potentialReturn,
      annualGrowthRate
    }))

    toast({
      title: "Investment calculated successfully!",
      description: `Your ${calculatorData.investmentType} could be worth ₹${(expectedGrowth/100000).toFixed(1)} Lakhs in ${years} years.`
    })
  }

  const resetCalculator = () => {
    setCalculatorData({
      plotSize: "",
      location: "",
      timeline: "5",
      investmentType: "plot",
      plotValue: 0,
      expectedGrowth: 0,
      constructionCost: 0,
      totalInvestment: 0,
      potentialReturn: 0,
      annualGrowthRate: 0
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-blue-600/20 via-purple-400/10 to-green-600/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-bold text-5xl md:text-6xl mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Smart Investment Calculator
          </h1>
          <p className="text-gray-600 text-xl max-w-4xl mx-auto leading-relaxed mb-8">
            Calculate your potential returns and make informed investment decisions with our advanced property investment calculator.
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-2xl border-0">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Input Section */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                      <Calculator className="h-6 w-6 text-blue-500" />
                      Investment Details
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <Label className="text-lg font-medium mb-3 block">Plot Size (sq ft) *</Label>
                        <Input
                          type="number"
                          placeholder="Enter plot size (e.g., 1200)"
                          value={calculatorData.plotSize}
                          onChange={(e) => setCalculatorData(prev => ({ ...prev, plotSize: e.target.value }))}
                          className="text-lg p-4 border-2 focus:border-blue-500 rounded-xl"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-lg font-medium mb-3 block">Location *</Label>
                        <Select
                          value={calculatorData.location}
                          onValueChange={(value) => setCalculatorData(prev => ({ ...prev, location: value }))}
                        >
                          <SelectTrigger className="text-lg p-4 border-2 focus:border-blue-500 rounded-xl">
                            <SelectValue placeholder="Select Location" />
                          </SelectTrigger>
                          <SelectContent>
                            {locationData.map((location) => (
                              <SelectItem key={location.name} value={location.name}>
                                {location.name} (₹{location.baseRate}/sq ft)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-lg font-medium mb-3 block">Investment Type</Label>
                        <Select
                          value={calculatorData.investmentType}
                          onValueChange={(value) => setCalculatorData(prev => ({ ...prev, investmentType: value }))}
                        >
                          <SelectTrigger className="text-lg p-4 border-2 focus:border-blue-500 rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="plot">Plot Only</SelectItem>
                            <SelectItem value="home">Plot + Construction</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-lg font-medium mb-3 block">Investment Timeline</Label>
                        <Select
                          value={calculatorData.timeline}
                          onValueChange={(value) => setCalculatorData(prev => ({ ...prev, timeline: value }))}
                        >
                          <SelectTrigger className="text-lg p-4 border-2 focus:border-blue-500 rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2">2 Years</SelectItem>
                            <SelectItem value="5">5 Years</SelectItem>
                            <SelectItem value="10">10 Years</SelectItem>
                            <SelectItem value="15">15 Years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex gap-4">
                        <Button 
                          onClick={calculateInvestment}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        >
                          <Calculator className="mr-2 h-5 w-5" />
                          Calculate Returns
                        </Button>
                        <Button 
                          onClick={resetCalculator}
                          variant="outline"
                          className="px-6 py-4 rounded-xl border-2 border-gray-300 hover:bg-gray-50"
                        >
                          Reset
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Results Section */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                      <TrendingUp className="h-6 w-6 text-green-500" />
                      Projected Returns
                    </h3>
                    <div className="space-y-6">
                      <Card className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                        <div className="text-center">
                          <div className="text-sm opacity-90 mb-2 flex items-center justify-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Current Plot Value
                          </div>
                          <div className="text-3xl font-bold">
                            ₹{calculatorData.plotValue ? (calculatorData.plotValue/100000).toFixed(1) : '0'} Lakhs
                          </div>
                          {calculatorData.plotValue > 0 && (
                            <div className="text-sm opacity-80 mt-1">
                              ₹{Math.round(calculatorData.plotValue/parseInt(calculatorData.plotSize || "1"))}/sq ft
                            </div>
                          )}
                        </div>
                      </Card>
                      
                      {calculatorData.constructionCost > 0 && (
                        <Card className="p-6 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                          <div className="text-center">
                            <div className="text-sm opacity-90 mb-2 flex items-center justify-center gap-2">
                              <Home className="h-4 w-4" />
                              Construction Cost
                            </div>
                            <div className="text-3xl font-bold">
                              ₹{calculatorData.constructionCost ? (calculatorData.constructionCost/100000).toFixed(1) : '0'} Lakhs
                            </div>
                            <div className="text-sm opacity-80 mt-1">₹1,800 per sq ft</div>
                          </div>
                        </Card>
                      )}

                      <Card className="p-6 bg-gradient-to-r from-green-500 to-blue-500 text-white border-0">
                        <div className="text-center">
                          <div className="text-sm opacity-90 mb-2 flex items-center justify-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Expected Value in {calculatorData.timeline} Years
                          </div>
                          <div className="text-3xl font-bold">
                            ₹{calculatorData.expectedGrowth ? (calculatorData.expectedGrowth/100000).toFixed(1) : '0'} Lakhs
                          </div>
                          {calculatorData.annualGrowthRate > 0 && (
                            <div className="text-sm opacity-90 mt-2">
                              {calculatorData.annualGrowthRate.toFixed(1)}% Annual Growth
                            </div>
                          )}
                        </div>
                      </Card>

                      {calculatorData.expectedGrowth > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                          <div className="flex items-center gap-2 text-yellow-800 mb-3">
                            <Zap className="h-5 w-5" />
                            <span className="font-semibold">Investment Summary</span>
                          </div>
                          <div className="space-y-2 text-sm text-yellow-700">
                            <div className="flex justify-between">
                              <span>Total Investment:</span>
                              <span className="font-medium">₹{(calculatorData.totalInvestment/100000).toFixed(1)} Lakhs</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Projected Value:</span>
                              <span className="font-medium">₹{(calculatorData.potentialReturn/100000).toFixed(1)} Lakhs</span>
                            </div>
                            <div className="flex justify-between border-t border-yellow-300 pt-2 mt-2">
                              <span className="font-semibold">Net Gain:</span>
                              <span className="font-bold text-green-700">
                                ₹{((calculatorData.potentialReturn - calculatorData.totalInvestment)/100000).toFixed(1)} Lakhs
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-bold text-4xl mb-6">Ready to Start Your Investment Journey?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Our investment experts are here to help you make the right decision based on your calculations.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 text-xl px-8 py-4 shadow-xl"
              onClick={() => window.open('tel:+917870231314', '_self')}
            >
              Speak to Expert
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 text-xl px-8 py-4"
              onClick={() => window.open('https://wa.me/917870231314?text=Hi, I used the investment calculator and would like to discuss investment options', '_blank')}
            >
              WhatsApp Us
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
