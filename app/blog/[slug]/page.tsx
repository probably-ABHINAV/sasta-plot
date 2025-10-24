"use client"

import { useParams, notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// ✅ Full content for each blog
const staticPosts = [
  {
    id: "1",
    title: "Why Greater Dehradun is the Smart Investment Choice in 2025",
    slug: "greater-dehradun-investment-2025",
    created_at: "2025-10-08",
    content: `
      <p>Dehradun, the capital of Uttarakhand, is not only known for its schools, colleges and natural beauty, but now it is moving rapidly in a new direction - as 'Greater Dehradun'. While on one hand there is a shortage of space and rising inflation in old Dehradun, Greater Dehradun has brought new hope for investors. Due to affordable land, excellent connectivity and green lifestyle, this area is fast becoming a favorite of investors. Let us know in detail the reasons why Greater Dehradun has become the most attractive place to invest in 2025.</p>
        <p> <strong>1. Delhi-Dehradun Economic Corridor:</strong> A confluence of speed and real estate</p>
        <p>The ambitious project of the Government of India, Delhi-Dehradun Economic Corridor, is going to change the fate of this region. This highway will complete the journey from Delhi to Dehradun in just 2.5 hours. Along with this, land prices are increasing rapidly in the areas around the corridor. Especially areas like Harrawala, Bhaniawala and Doiwala, which were earlier considered quiet and rural, have now become at par with the city in terms of infrastructure and traffic. Investors are now looking at these areas for long term returns.</p>
        <p><strong>2. Better balance of affordable plots and long term returns</strong></p>
        <p>It is still possible to get residential plots at the rate of ₹6000–₹9000 per yard in Greater Dehradun, which is a big opportunity for any new investor. When we compare it with old Dehradun, where rates have reached ₹15000–₹25000 per yard, investing in Greater Dehradun seems more practical and profitable. According to experts, land prices here can increase more than 2 times in the next 3–5 years.</p>
        <p><strong>3. Nature and highway connectivity:</strong> </p>
        <p> A unique combination of peace and convenience . The specialty of Greater Dehradun is its dual character - on one hand it is surrounded by natural beauty and mountains, and on the other hand it is directly connected to the National Highway. This connectivity makes it suitable for all kinds of investments. People now want to build houses away from the crowd, in a calm and green environment, where the necessary facilities are also easily available. Greater Dehradun offers all this together.</p>
        <p><strong>4. Impact of Smart City Scheme and Master Plan</strong> </p>
        <p>Dehradun has been included in the Smart City Mission, which has also promoted planning and development in Greater Dehradun. Here, facilities like plotting, roads, drainage and electricity are being controlled and streamlined by MDDA. The zones under Master Plan 2041 are now more clear and transparent, which has reduced the risk of investing in the wrong location.</p>
        <p><strong>5. R2 Zoning: Ideal for residential construction</strong></p>
        <p>R2 Zoning means a zone that is specifically reserved for residential construction. Major areas of Greater Dehradun like Bhaniyawala, Harrawala, Badripur, Doiwala and Bajrang Vatika are now included in this zone. This means that now you can legally build your house, guesthouse, hostel or villa there. This has further increased the value of these areas.</p>

      <p>For investors, this region offers <em>affordable entry + long-term appreciation</em>.</p>
    `
  },
  {
    id: "2",
    title: "Common Real Estate Mistakes & How Zam’s Gardenia Solves Them",
    slug: "zams-gardenia-real-estate-mistakes",
    created_at: "2025-10-08",
    content: `
      <p><strong>Conclusion – Why Zam's Gardenia Is a Safe and Smart Decision?</strong></p>
      <ul>
        <li>Real estate investment is still seen as a secure and long-term profitable option in India. But this investment only proves beneficial when done with proper information and strategy. Otherwise, it can turn into a loss that not only drains your savings but also causes mental stress. In this article, we will understand in detail how one wrong decision in real estate can turn into a big financial loss.</li>
        <li><strong>1. Choosing the Wrong Location:</strong></li>
        <li>Location is the heart of real estate. Selecting the right location can increase your property's value year after year, while a poor location can block your money for years. Often, people get tempted by low prices and buy plots in areas where there is no road, water, electricity, or future planning.Such areas lack livability and rental opportunities. This leads to inactive investments and frozen capital. Therefore, while selecting a location, always examine surrounding infrastructure, connectivity, and future development plans.</li>
        <li><strong>2. Ignoring Legal Clearance:</strong></li>
        <li>Legal clearance is the most important aspect of real estate. If you've invested in a disputed property or a layout that isn't approved, you may face legal troubles and financial losses in the future.</li>
        <li>While buying property, it's essential to thoroughly check RERA certification, mutation, NOC, land ownership, and zone classification. It should also be verified whether the land falls under a residential zone. Sometimes buyers are given possession without proper registration, leading to huge losses later.</li>
        <li><strong>3. Investing at the Wrong Time:</strong></li>
        <li>Market timing is very important in real estate. Many people invest at market highs when prices are already at their peak. Properties bought at such times may not yield any significant returns for years.</li>
        <li>In contrast, if you invest in early development phases when infrastructure is just starting to come up, you can earn greater profits at lower prices. Smart investors always look at developing areas and upcoming government projects before deciding.</li>
        <li><strong>4. Ignoring Basic Amenities:</strong></li>
        <li>Cheap land doesn’t always mean good investment. If there’s no electricity, water, roads, or drainage, the land may be unfit for construction. Many people buy plots in areas without bus stops, hospitals, or schools nearby. This makes living or renting the property difficult. Always visit the site and check for essential amenities before investing.</li>
        
      </ul>
      <p>It’s a <em>safe, smart, and future-proof project</em> for investors.</p>
    `
  },
  {
    id: "3",
    title: "ग्रेटर देहरादून: 2025 में निवेश का सुनहरा मौका",
    slug: "greater-dehradun-hindi-2025",
    created_at: "2025-10-08",
    content: `
      <p>ग्रेटर देहरादून 2025 में रियल एस्टेट निवेश के लिए सबसे बेहतरीन स्थानों में से एक बन रहा है।</p>
      <ul>
        <li>प्लॉट रेट ₹6000–₹9000 प्रति गज</li>
        <li>AIIMS ऋषिकेश, जॉलीग्रांट एयरपोर्ट और दून यूनिवर्सिटी नज़दीक</li>
        <li>R2 ज़ोनिंग से वैध आवासीय निर्माण की अनुमति</li>
        <li>मेट्रो लाइट और पर्यटन विकास से भविष्य में भारी ग्रोथ</li>
      </ul>
      <p>यह इलाका निवेशकों को <strong>सस्ती एंट्री और लंबी अवधि का रिटर्न</strong> देता है।</p>
    `
  },
  {
    id: "4",
    title: "रियल एस्टेट में आम गलतियाँ और ज़ैम्स गार्डेनिया का समाधान",
    slug: "zams-gardenia-hindi",
    created_at: "2025-10-08",
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

export default function BlogPostPage() {
  const { slug } = useParams()
  const post = staticPosts.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{post.title}</CardTitle>
          <Badge variant="secondary">
            {new Date(post.created_at).toLocaleDateString("hi-IN")}
          </Badge>
        </CardHeader>
        <CardContent>
          {/* ✅ full blog content now renders */}
          <div
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </CardContent>
      </Card>
    </main>
  )
}
