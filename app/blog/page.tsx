"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const staticPosts = [
  {
    id: "1",
    title: "Why Greater Dehradun is the Smart Investment Choice in 2025",
    slug: "greater-dehradun-investment-2025",
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
    id: "2",
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
    id: "3",
    title: "Greater Dehradun क्यों बन रहा है Investors का नया पसंदीदा इलाका?",
    slug: "greater-dehradun-hindi-2025",
    created_at: "2025-10-08",
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
    id: "4",
    title: "रियल एस्टेट में आम गलतियाँ और ज़ैम्स गार्डेनिया का समाधान",
    slug: "zams-gardenia-hindi",
    created_at: "2025-10-08",
    excerpt:
      "अधिकतर निवेशक गलत लोकेशन, बिना लीगल चेक या शॉर्ट-टर्म प्रॉफिट की उम्मीद करके गलती करते हैं। ज़ैम्स गार्डेनिया इन सबका समाधान देता है...",
    content: `
      <p>रियल एस्टेट निवेशक अक्सर ये गलतियाँ करते हैं:</p>
      <ul>
        <li>गलत लोकेशन चुनना</li>
        <li>RERA या रजिस्ट्री जैसे कानूनी क्लियरेंस को नज़रअंदाज़ करना</li>
        <li>जल्दी मुनाफा चाहना</li>
      </ul>
      <p><strong>ज़ैम्स गार्डेनिया</strong> इन समस्याओं का हल देता है:</p>
      <ul>
        <li>IIT पटना और बिहटा एयरपोर्ट के पास प्राइम लोकेशन</li>
        <li>NH-139 और रेल/एयर कनेक्टिविटी</li>
        <li>RERA अप्रूव्ड और R-Zone क्लासिफाइड</li>
        <li>बेसिक सुविधाएँ: सड़क, पानी, बिजली, सीवर</li>
        <li>EMI और बैंक लोन की सुविधा</li>
      </ul>
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
