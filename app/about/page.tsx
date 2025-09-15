
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { SiteHeader } from "@/components/navigation/site-header"
import { SiteFooter } from "@/components/navigation/footer"
import { 
  Award, 
  Users, 
  Shield, 
  TrendingUp, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Star,
  Phone,
  Mail,
  Heart,
  Target,
  Zap,
  Building
} from "lucide-react"

const teamMembers = [
  {
    name: "Rajesh Kumar",
    position: "Founder & CEO",
    experience: "15+ Years",
    expertise: "Property Development & Investment",
    description: "Leading property developer in Uttarakhand with deep knowledge of hill station markets."
  },
  {
    name: "Priya Sharma", 
    position: "Head of Sales",
    experience: "10+ Years",
    expertise: "Customer Relations & Sales",
    description: "Expert in helping families find their perfect plot with personalized guidance."
  },
  {
    name: "Amit Patel",
    position: "Legal Advisor",
    experience: "12+ Years", 
    expertise: "Property Law & Documentation",
    description: "Ensures all properties have clear titles and legal compliance."
  }
]

const achievements = [
  {
    icon: Users,
    number: "5000+",
    label: "Happy Customers",
    description: "Families who found their dream plots"
  },
  {
    icon: Building,
    number: "50+",
    label: "Premium Projects",
    description: "Across Uttarakhand's best locations"
  },
  {
    icon: Shield,
    number: "100%",
    label: "Legal Clarity",
    description: "All properties with clear titles"
  },
  {
    icon: Star,
    number: "4.8",
    label: "Customer Rating",
    description: "Based on verified reviews"
  }
]

const values = [
  {
    icon: Shield,
    title: "Transparency",
    description: "Complete transparency in all our dealings with clear documentation and honest pricing."
  },
  {
    icon: Heart,
    title: "Customer First",
    description: "Your satisfaction is our priority. We guide you through every step of your investment journey."
  },
  {
    icon: Target,
    title: "Quality Locations",
    description: "We handpick only the best locations with excellent growth potential and connectivity."
  },
  {
    icon: Zap,
    title: "Quick Service",
    description: "Fast processing, quick approvals, and efficient customer service for all your needs."
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-blue-600/20 via-green-400/10 to-purple-600/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-bold text-5xl md:text-6xl mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            About Property in Uttarakhand
          </h1>
          <p className="text-gray-600 text-xl max-w-4xl mx-auto leading-relaxed mb-8">
            Your trusted partner for premium land plots in Uttarakhand's most beautiful hill stations. 
            With over 15 years of experience, we specialize in legal clarity, prime locations, and exceptional growth potential.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-bold text-4xl mb-6 text-gray-800">Our Story</h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p className="text-lg">
                    Founded in 2008, Property in Uttarakhand began with a simple vision: to help people find their perfect piece of paradise in the beautiful hill stations of Uttarakhand. What started as a small family business has grown into one of the region's most trusted property developers.
                  </p>
                  <p>
                    Over the years, we've helped thousands of families realize their dreams of owning premium plots in locations like Dehradun, Rishikesh, Nainital, and Mussoorie. Our commitment to transparency, legal clarity, and customer satisfaction has made us the go-to choice for property investment in Uttarakhand.
                  </p>
                  <p>
                    Today, we continue to uphold our founding principles while embracing modern technology and sustainable development practices to create value for our customers and the communities we serve.
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Badge className="bg-blue-500 text-white px-4 py-2 text-sm">Est. 2008</Badge>
                  <Badge className="bg-green-500 text-white px-4 py-2 text-sm">15+ Years Experience</Badge>
                  <Badge className="bg-purple-500 text-white px-4 py-2 text-sm">5000+ Happy Customers</Badge>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="/images/dehradun-outskirts-plots.jpg"
                  alt="Our Journey"
                  width={600}
                  height={400}
                  className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                  <div className="text-3xl font-bold text-blue-600">15+</div>
                  <div className="text-sm text-gray-600">Years of Excellence</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-4xl mb-6">Our Core Values</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              The principles that guide everything we do and shape our relationships with customers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-4xl mb-6">Our Achievements</h2>
            <p className="text-blue-100 text-lg max-w-3xl mx-auto">
              Milestones that reflect our commitment to excellence and customer satisfaction
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <Card key={index} className="text-center p-8 bg-white/10 backdrop-blur-sm border-0 hover:bg-white/20 transition-all duration-300">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <achievement.icon className="h-10 w-10 text-white" />
                </div>
                <div className="text-4xl font-bold mb-2">{achievement.number}</div>
                <div className="text-xl font-semibold mb-2">{achievement.label}</div>
                <p className="text-blue-100 text-sm">{achievement.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-4xl mb-6">Meet Our Team</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Experienced professionals dedicated to helping you find your perfect property investment
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">{member.name}</h3>
                <Badge className="bg-blue-500 mb-3">{member.position}</Badge>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="h-4 w-4" />
                    {member.experience}
                  </div>
                  <div className="font-medium text-blue-600">{member.expertise}</div>
                </div>
                <p className="text-gray-700 leading-relaxed">{member.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-4xl mb-6">Why Choose Us?</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              What sets us apart as Uttarakhand's trusted property developer
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Legal Guarantee",
                description: "100% legal clarity with clear titles and proper documentation. All our properties are verified and dispute-free."
              },
              {
                icon: MapPin,
                title: "Prime Locations",
                description: "Handpicked locations in Uttarakhand's most beautiful and fast-growing areas with excellent connectivity."
              },
              {
                icon: TrendingUp,
                title: "High Returns",
                description: "Proven track record of 25-45% annual appreciation in property values across our projects."
              },
              {
                icon: Users,
                title: "Customer Support",
                description: "Dedicated customer support team available 24/7 to assist you throughout your investment journey."
              },
              {
                icon: Award,
                title: "Industry Recognition",
                description: "Award-winning developer recognized for excellence in customer service and project delivery."
              },
              {
                icon: CheckCircle,
                title: "Proven Track Record",
                description: "15+ years of successful project delivery with thousands of satisfied customers across India."
              }
            ].map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-bold text-4xl mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Get in touch with our experienced team to find your perfect plot in Uttarakhand's beautiful hill stations.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-green-600 hover:bg-gray-100 text-xl px-8 py-4 shadow-xl"
              onClick={() => window.open('tel:+917870231314', '_self')}
            >
              <Phone className="mr-2 h-6 w-6" />
              Call Us Now
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 text-xl px-8 py-4"
              onClick={() => window.open('mailto:info@propertyinuttarakhand.com', '_self')}
            >
              <Mail className="mr-2 h-6 w-6" />
              Email Us
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
