import { Metadata } from 'next'
import { Card, CardContent } from "@/components/ui/card"
import { HelpCircle, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: 'Frequently Asked Questions - Sasta Plots',
  description: 'Find answers to common questions about our affordable residential and commercial plots, documentation, payment options, and more.',
  keywords: ['FAQ', 'questions', 'plots', 'real estate', 'documentation', 'payment'],
}

const faqs = [
  {
    question: "What is Sasta Plots and what makes it different?",
    answer: "Sasta Plots is a real estate service offering verified residential and commercial plots at affordable rates. What sets us apart is our commitment to transparency - clean title documents, no hidden charges, flexible payment plans - plus properties in prime locations with ready infrastructure."
  },
  {
    question: "How are the plots verified? Are the documents legal and clean?",
    answer: "Yes. Every plot listed with us has been legally vetted. We verify title deeds and other key documentation to ensure you get a plot with \"clear title\" and no legal encumbrances."
  },
  {
    question: "What does \"ready infrastructure\" mean?",
    answer: "\"Ready infrastructure\" means that basic amenities and connectivity-such as roads, electricity, water supply (as relevant)-are already available or are very close to being available in the plot location. This helps avoid delays and added expenses when you want to develop the land."
  },
  {
    question: "Can I see the plot before buying? How does site inspection work?",
    answer: "Absolutely. You can schedule a site visit with one of our experts. During the visit, you can inspect the plot physically, check surrounding infrastructure, and go through the documentation in person to ensure everything matches."
  },
  {
    question: "What are the payment options? Do you offer installments?",
    answer: "Yes, we offer flexible payment options. You can pay in full, or choose installment plans (subject to plot size, location, and price). The goal is to make plot ownership affordable without putting undue strain on budgets."
  },
  {
    question: "Are there any hidden charges I should be aware of?",
    answer: "No. We pride ourselves on transparency. Our pricing includes what is disclosed; there are no surprise fees or hidden charges. Everything related to the plot sale and transfer will be made clear up front."
  },
  {
    question: "How long does the process take - from selecting a plot to getting the legal ownership?",
    answer: "The timeline depends on several factors: the location of the plot, the speed of legal approval/clearances, and how quickly payments and documentation are completed. However, since our plots are already verified and documents are ready for transfer, the process tends to be faster than with many unverified offers. (If you like, we can give you an estimate for a specific plot you're interested in.)"
  },
  {
    question: "What kind of locations do you offer? Are the plots near good connectivity?",
    answer: "Yes. We ensure plots are in prime or upcoming areas with good connectivity-roads, transport links, and basic amenities. Our listings include residential and commercial plots in locations chosen for future growth and convenience."
  },
  {
    question: "Is buying a plot a good investment compared to flats or apartments?",
    answer: "Yes. Unlike apartments, which depreciate over time due to wear and tear, land typically appreciates in value. Buying a plot gives you the freedom to build as you wish, and it's often seen as a long-term, secure investment."
  },
  {
    question: "Do you help with registration and legal paperwork?",
    answer: "Absolutely. Our team assists you through the entire registration process, ensuring that ownership is legally transferred to you. From agreement drafting to final registry, we'll guide you step by step."
  },
  {
    question: "Can NRIs (Non-Resident Indians) also buy plots?",
    answer: "Yes, NRIs are welcome to invest in plots through us. We provide complete support with documentation, legal compliance, and remote assistance, making the process hassle-free."
  },
  {
    question: "Are your plots approved by local authorities?",
    answer: "Yes. All our plots are either approved or under approval from the respective local development authorities. This ensures the land is safe, legal, and ready for construction."
  },
  {
    question: "Do you offer plots for both residential and commercial use?",
    answer: "Yes. We deal in both residential plots (for homes, farmhouses, villas) and commercial plots (for shops, offices, small developments), depending on your investment goals."
  },
  {
    question: "How can I be sure the price you offer is fair?",
    answer: "We believe in transparent and competitive pricing. Our prices are benchmarked against market rates, and we ensure that you're getting genuine value—without inflated costs or hidden markups."
  },
  {
    question: "Do you provide any after-sale support once I purchase a plot?",
    answer: "Yes. Our relationship doesn't end at the sale. We remain available for guidance on construction, resale, or even investment advice for future opportunities."
  }
]

export default function FAQPage() {
  return (
    <div className="flex-1 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-red-50 py-20">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_24%,rgba(251,146,60,.03)_25%,rgba(251,146,60,.03)_26%,transparent_27%,transparent_74%,rgba(251,146,60,.03)_75%,rgba(251,146,60,.03)_76%,transparent_77%,transparent)] bg-[length:30px_30px]"></div>
        
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-800 ring-1 ring-orange-200 mb-8">
            <HelpCircle className="h-4 w-4" />
            Your Questions Answered
          </div>
          
          <h1 className="text-4xl font-black tracking-tight lg:text-6xl mb-6">
            <span className="text-gray-900">Frequently Asked</span>
            <br />
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Find answers to the most common questions about our verified plots, 
            documentation process, and investment opportunities.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border">
                <CardContent className="p-8">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 space-y-4">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white">
              <CheckCircle className="h-4 w-4" />
              Still Have Questions?
            </div>
            
            <h2 className="text-3xl font-bold text-white lg:text-4xl">
              We're Here to Help!
            </h2>
            
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our team is ready to assist you 
              with personalized guidance for your land investment journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-white text-orange-600 px-8 py-4 text-lg font-bold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
              >
                Contact Our Experts
              </a>
              <a
                href="/plots"
                className="inline-flex items-center justify-center rounded-xl border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-bold transform hover:scale-105 transition-all duration-300"
              >
                Browse Available Plots
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}