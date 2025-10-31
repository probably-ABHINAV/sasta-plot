"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const staticPosts = [
  {
    id: "1",
    title: "Top Reasons to Invest in Residential Plots Near Dehradun",
    slug: "residential-plot-investment-dehradun-2025",
    created_at: "2025-10-31",
    excerpt:
      "Top Reasons to Invest in Residential Plots Near Dehradun",
    content: `
      <p>How Property in Uttarakhand Helps You Choose Right</p>
      
      <p>For investors, this region offers <em>affordable entry + long-term appreciation</em>.</p>
    `
  },
  {
    id: "2",
    title: "Why Buying a Plot in Uttarakhand Is a Smart Long-Term Move",
    slug: "greater-dehradun-investment-2025",
    created_at: "2025-10-29",
    excerpt:
      "Investing in land is as much about lifestyle as it is about long-term value. Uttarakhand - with its dramatic Himalayan backdrop, clean air, and growing tourism and wellness economy - offers a rare combination: scenic living plus steady demand from holiday-home buyers, retirees, and eco-tourism developers. For buyers who want a tangible asset that can be used, enjoyed, and passed down, a well-chosen plot in Uttarakhand delivers both emotional satisfaction and financial resilience.",
    content: `
      <p>Location matters more than ever. Proximity to good roads, reliable utilities, and nearby town centers determines usability and resale potential. Many parts of Uttarakhand provide easy access to major highways, railway nodes and regional airports, while still offering the peace of hill living. Areas close to pilgrimage routes, hill stations, and national parks tend to attract consistent interest from holidaymakers and second-home buyers, supporting rental incomes and future appreciation.</p>
      
      <p>For investors, this region offers <em>affordable entry + long-term appreciation</em>.</p>
    `
  },
  {
    id: "3",
    title: "Why Greater Dehradun is the Smart Investment Choice in 2025",
    slug: "greater-dehradun-investment-2026",
    created_at: "2025-10-08",
    excerpt:
      "Greater Dehradun is emerging as a prime real estate hub due to the Delhi–Dehradun Economic Corridor, affordable plots, R2 zoning, and upcoming Smart City developments...",
    content: `
      <p>Greater Dehradun is emerging as one of the most promising real estate destinations in Uttarakhand. With the <strong>Delhi–Dehradun Economic Corridor</strong>, land prices are appreciating quickly while still being affordable compared to old Dehradun.</p>
      <ul>
        <li>Plots at ₹6000–₹9000 per गज (vs. ₹15000–₹25000 in old city)</li>
        <li>Located near AIIMS Rishikesh, Jolly Grant Airport, Doon University</li>
        <li>R2 Zoning allows legal residential construction</li>
        <li>Upcoming Metro Lite, tourism, and wellness growth by 2030</li>
      </ul>
      <p>For investors, this region offers <em>affordable entry + long-term appreciation</em>.</p>
    `
  },
  {
    id: "4",
    title: "Common Real Estate Mistakes & How Zam’s Gardenia Solves Them",
    slug: "zams-gardenia-real-estate-mistakes",
    created_at: "2025-10-08",
    excerpt:
      "Most investors make mistakes like wrong location, ignoring legal checks, or expecting short-term returns. Zam’s Gardenia fixes these with location near IIT Patna, Bihta Airport, RERA certification, and easy EMIs...",
    content: `
      <p>Real estate investments fail when buyers:</p>
      <ul>
        <li>Pick wrong locations with low ROI</li>
        <li>Ignore legal clearance (RERA, NOC, registry)</li>
        <li>Expect quick profits instead of 5–10 years</li>
      </ul>
      <p><strong>Zam’s Gardenia</strong> addresses these risks with:</p>
      <ul>
        <li>Prime location near IIT Patna & Bihta Airport</li>
        <li>NH-139 connectivity, rail & air links</li>
        <li>RERA certified, R-Zone classified plots</li>
        <li>Basic amenities: roads, sewer, electricity, water</li>
        <li>Financial ease: EMIs & bank loan support</li>
      </ul>
      <p>It’s a <em>safe, smart, and future-proof project</em> for investors.</p>
    `
  },
  {
    id: "5",
    title: "How to Choose the Right Location for Your Plot Investment",
    slug: "greater-dehradun-hindi-2025",
    created_at: "2025-10-27",
    excerpt:
      "Introduction: Why Location Is the Heart of Real Estate",
    content: `
      <p>ग्रेटर देहरादून 2025 में रियल एस्टेट निवेश के लिए सबसे बेहतरीन स्थानों में से एक बन रहा है।</p>
      <ul>
        <li>अफोर्डेबल प्लॉट्स और लॉन्ग टर्म रिटर्न का बेहतर संतुलन</li>
        <li>प्रकृति और हाईवे कनेक्टिविटी: शांति और सुविधा का अनूठा मेल</li>
        <li>स्मार्ट सिटी योजना और मास्टर प्लान का असर</li>
        <li>R2 ज़ोनिंग: रेजिडेंशियल निर्माण के लिए आदर्श</li>
      </ul>
      <p>यह इलाका निवेशकों को <strong>सस्ती एंट्री और लंबी अवधि का रिटर्न</strong> देता है।</p>
    `
  },
  {
    id: "6",
    title: "Greater Dehradun क्यों बन रहा है Investors का नया पसंदीदा इलाका?",
    slug: "greater-dehradun-hindi-2026",
    created_at: "2025-10-25",
    excerpt:
      "दिल्ली–देहरादून इकोनॉमिक कॉरिडोर: रफ्तार और रियल एस्टेट का संगम",
    content: `
      <p>ग्रेटर देहरादून 2025 में रियल एस्टेट निवेश के लिए सबसे बेहतरीन स्थानों में से एक बन रहा है।</p>
      <ul>
        <li>अफोर्डेबल प्लॉट्स और लॉन्ग टर्म रिटर्न का बेहतर संतुलन</li>
        <li>प्रकृति और हाईवे कनेक्टिविटी: शांति और सुविधा का अनूठा मेल</li>
        <li>स्मार्ट सिटी योजना और मास्टर प्लान का असर</li>
        <li>R2 ज़ोनिंग: रेजिडेंशियल निर्माण के लिए आदर्श</li>
      </ul>
      <p>यह इलाका निवेशकों को <strong>सस्ती एंट्री और लंबी अवधि का रिटर्न</strong> देता है।</p>
    `
  },
  {
    id: "7",
    title: "हाइवे के पास की ज़मीन: आज खरीदो, कल मुनाफा कमाओ!",
    slug: "zams-gardenia-hindi",
    created_at: "2025-10-23",
    excerpt:
      "फ्यूचर प्रूफ इन्वेस्टमेंट",
    content: `
      <p> हाइवे से सटी ज़मीन, भविष्य की जीत की गारंटी</p>
      <ul>
        <li>लोकेशन जो विकास को बुलाए</li>
        <li> कनेक्टिविटी से बढ़ता है रिटर्न</li>
        <li> तेजी से होती है रेंटल डिमांड</li>
        <li>फ्यूचर प्रूफ इन्वेस्टमेंट</li>
      </ul>
      <p><strong>ज़ैम्स गार्डेनिया</strong> इन समस्याओं का हल देता है:</p>
  
      <p>यह एक <em>सुरक्षित और भविष्य-दृष्टि वाला निवेश विकल्प</em> है।</p>
    `
  }
]

export default function BlogPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <h1 className="font-heading text-3xl font-semibold md:text-4xl">Insights & Guides</h1>
      <p className="mt-2 max-w-prose text-muted-foreground">
        Buying tips, location spotlights, and legal checklists to help you make confident decisions.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {staticPosts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {new Date(post.created_at).toLocaleDateString("hi-IN")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="mt-4">
                  <span className="text-sm text-primary hover:underline">
                    Read more →
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  )
}
