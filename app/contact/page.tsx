
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SiteHeader } from "@/components/navigation/site-header"
import { SiteFooter } from "@/components/navigation/footer"
import { toast } from "@/hooks/use-toast"
import { useState } from "react"
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare,
  Calendar,
  CheckCircle,
  Headphones,
  Navigation
} from "lucide-react"

export default function ContactPage() {
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    plotInterest: "",
    budget: "",
    message: "",
    preferredContact: "phone"
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitContactForm = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!contactForm.name || !contactForm.phone) {
      toast({
        title: "Please fill required fields",
        description: "Name and phone number are required.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent successfully!",
        description: "Our team will contact you within 24 hours."
      })

      setContactForm({
        name: "",
        phone: "",
        email: "",
        subject: "",
        plotInterest: "",
        budget: "",
        message: "",
        preferredContact: "phone"
      })
      setIsSubmitting(false)
    }, 1000)
  }

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone / WhatsApp",
      description: "Call or message us anytime",
      action: "+91 7870231314",
      href: "tel:+917870231314",
      color: "from-green-500 to-blue-500",
      available: "24/7 Available"
    },
    {
      icon: Mail,
      title: "Email",
      description: "Send us your queries",
      action: "info@propertyinuttarakhand.com",
      href: "mailto:info@propertyinuttarakhand.com",
      color: "from-blue-500 to-purple-500",
      available: "Response within 6 hours"
    },
    {
      icon: MapPin,
      title: "Office Locations",
      description: "Visit our offices",
      action: "Badripur & Ganeshpur, Dehradun",
      href: "#",
      color: "from-purple-500 to-pink-500",
      available: "Mon-Sat 9AM-7PM"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with our experts",
      action: "Start WhatsApp Chat",
      href: "https://wa.me/917870231314?text=Hi, I need information about plots in Uttarakhand",
      color: "from-orange-500 to-red-500",
      available: "Instant Response"
    }
  ]

  const officeHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 7:00 PM" },
    { day: "Saturday", hours: "9:00 AM - 6:00 PM" },
    { day: "Sunday", hours: "10:00 AM - 4:00 PM" },
    { day: "Emergency", hours: "24/7 Available" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-blue-600/20 via-green-400/10 to-purple-600/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-bold text-5xl md:text-6xl mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-gray-600 text-xl max-w-4xl mx-auto leading-relaxed mb-8">
            Ready to start your property investment journey? Our experienced team is here to help you find the perfect plot in Uttarakhand's beautiful hill stations.
          </p>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-4xl mb-6">Multiple Ways to Reach Us</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Choose your preferred method of communication and get instant assistance from our property experts
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 border-0 shadow-lg text-center">
                <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <method.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">{method.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                <Button
                  className="w-full mb-3"
                  onClick={() => window.open(method.href, method.href.startsWith('tel:') || method.href.startsWith('mailto:') ? '_self' : '_blank')}
                >
                  {method.action}
                </Button>
                <div className="text-xs text-green-600 font-medium">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {method.available}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="p-8 bg-white shadow-2xl border-0">
                <CardHeader className="px-0">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Send className="h-6 w-6 text-blue-500" />
                    Send Us a Message
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Fill out the form below and we'll get back to you within 24 hours
                  </CardDescription>
                </CardHeader>
                
                <form onSubmit={submitContactForm} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Full Name *</Label>
                      <Input
                        placeholder="Enter your full name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                        className="p-3 border-2 focus:border-blue-500 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Phone Number *</Label>
                      <Input
                        placeholder="Your phone number"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="p-3 border-2 focus:border-blue-500 rounded-lg"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Email Address</Label>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      className="p-3 border-2 focus:border-blue-500 rounded-lg"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Subject</Label>
                    <Select
                      value={contactForm.subject}
                      onValueChange={(value) => setContactForm(prev => ({ ...prev, subject: value }))}
                    >
                      <SelectTrigger className="p-3 border-2 focus:border-blue-500 rounded-lg">
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plot-inquiry">Plot Inquiry</SelectItem>
                        <SelectItem value="site-visit">Site Visit Request</SelectItem>
                        <SelectItem value="investment-advice">Investment Advice</SelectItem>
                        <SelectItem value="documentation">Documentation Help</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Location Interest</Label>
                      <Select
                        value={contactForm.plotInterest}
                        onValueChange={(value) => setContactForm(prev => ({ ...prev, plotInterest: value }))}
                      >
                        <SelectTrigger className="p-3 border-2 focus:border-blue-500 rounded-lg">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dehradun-outskirts">Dehradun Outskirts</SelectItem>
                          <SelectItem value="rishikesh-region">Rishikesh Region</SelectItem>
                          <SelectItem value="nainital-area">Nainital Area</SelectItem>
                          <SelectItem value="mussoorie-hills">Mussoorie Hills</SelectItem>
                          <SelectItem value="not-decided">Not Decided Yet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Budget Range</Label>
                      <Select
                        value={contactForm.budget}
                        onValueChange={(value) => setContactForm(prev => ({ ...prev, budget: value }))}
                      >
                        <SelectTrigger className="p-3 border-2 focus:border-blue-500 rounded-lg">
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15-25">₹15-25 Lakhs</SelectItem>
                          <SelectItem value="25-40">₹25-40 Lakhs</SelectItem>
                          <SelectItem value="40-60">₹40-60 Lakhs</SelectItem>
                          <SelectItem value="60-80">₹60-80 Lakhs</SelectItem>
                          <SelectItem value="80-plus">₹80+ Lakhs</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Preferred Contact Method</Label>
                    <Select
                      value={contactForm.preferredContact}
                      onValueChange={(value) => setContactForm(prev => ({ ...prev, preferredContact: value }))}
                    >
                      <SelectTrigger className="p-3 border-2 focus:border-blue-500 rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="phone">Phone Call</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Message</Label>
                    <Textarea
                      placeholder="Tell us about your requirements, preferred location, timeline, or any questions you have..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      className="p-3 border-2 focus:border-blue-500 rounded-lg min-h-[120px]"
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-lg py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <>Sending Message...</>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </Card>

              {/* Contact Information */}
              <div className="space-y-8">
                {/* Office Hours */}
                <Card className="p-6 border-0 shadow-lg">
                  <CardHeader className="px-0">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Clock className="h-5 w-5 text-blue-500" />
                      Office Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-0">
                    <div className="space-y-3">
                      {officeHours.map((schedule, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                          <span className="font-medium">{schedule.day}</span>
                          <span className="text-gray-600">{schedule.hours}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="p-6 bg-gradient-to-r from-blue-500 to-green-500 text-white border-0">
                  <CardHeader className="px-0">
                    <CardTitle className="text-xl">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="px-0">
                    <div className="space-y-3">
                      <Button 
                        className="w-full bg-white/20 hover:bg-white/30 border-0"
                        onClick={() => window.open('https://wa.me/917870231314?text=Hi, I would like to schedule a site visit for plots in Uttarakhand', '_blank')}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule Site Visit via WhatsApp
                      </Button>
                      <Button 
                        className="w-full bg-white/20 hover:bg-white/30 border-0"
                        onClick={() => window.location.href = '/calculator'}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Calculate Investment Returns
                      </Button>
                      <Button 
                        className="w-full bg-white/20 hover:bg-white/30 border-0"
                        onClick={() => window.location.href = '/plots'}
                      >
                        <Navigation className="mr-2 h-4 w-4" />
                        Browse Available Plots
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency Contact */}
                <Card className="p-6 bg-red-50 border-red-200 border-2">
                  <CardHeader className="px-0">
                    <CardTitle className="flex items-center gap-2 text-xl text-red-700">
                      <Headphones className="h-5 w-5" />
                      Emergency Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-0">
                    <p className="text-red-600 mb-4">
                      For urgent property matters or site visit emergencies, contact us directly:
                    </p>
                    <Button 
                      className="w-full bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => window.open('tel:+917870231314', '_self')}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Emergency Hotline: +91 7870231314
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-4xl mb-6">Frequently Asked Questions</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Quick answers to common questions about our properties and services
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {[
              {
                question: "How do I schedule a site visit?",
                answer: "You can schedule a site visit by calling us, sending a WhatsApp message, or filling out the contact form. We arrange visits within 48 hours."
              },
              {
                question: "Are all properties legally verified?",
                answer: "Yes, all our properties have clear titles and complete legal documentation. We ensure 100% legal clarity before listing any property."
              },
              {
                question: "What is the typical appreciation rate?",
                answer: "Our properties have shown consistent 25-45% annual appreciation based on location and market conditions. Historical data available on request."
              },
              {
                question: "Do you provide financing assistance?",
                answer: "Yes, we have partnerships with leading banks and financial institutions to help you with plot financing and home loans."
              },
              {
                question: "What are the maintenance charges?",
                answer: "Maintenance charges vary by project but typically range from ₹2-5 per sq ft per month for developed projects with amenities."
              },
              {
                question: "Can I visit the office on weekends?",
                answer: "Yes, our offices are open on Saturdays and Sundays with limited hours. Please call ahead to confirm availability."
              }
            ].map((faq, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300">
                <h3 className="font-bold text-lg mb-3 text-blue-600">{faq.question}</h3>
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
