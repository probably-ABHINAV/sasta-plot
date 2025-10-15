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
    title: "Land Near Highways: Buy Today, Profit Tomorrow!",
    slug: "zams-gardenia-real-estate-mistakes",
    created_at: "2025-10-08",
    content: `
      <p><strong>Introduction:</strong></p>
     <p>Real estate investment in India is no longer just about buying a home-it has become a long-term source of financial security. Especially when it comes to land located near highways, investors see it as a golden opportunity. The reasons are clear: better connectivity, rapid development, and strong price appreciation in the future. In this article, we’ll explore in detail why investing in land near highways is a smart and safe decision.</p>
     <p><strong>1. Locations That Invite Development</strong></p>
     <p>Land near highways is always well-connected to transport and infrastructure. Areas along national and state highways develop quickly because both the government and private companies prioritize such locations. Shopping complexes, hospitals, schools, and industrial parks emerge faster, pushing up property values.Additionally, basic amenities like road lighting, drainage, water supply, and electricity infrastructure are developed swiftly in these regions, making them even more attractive. This is why highway-adjacent land has become a safe and profitable option for investors</p>
     <p><strong>2. Returns Powered by Connectivity</strong></p>
     <p>Better connectivity is the biggest advantage of highway-connected areas. Such locations get access to roads, railways, and airports more quickly. This connectivity transforms the area into a hub in just a few years. The result? Land prices rise rapidly, offering great returns in a short span.Furthermore, once connected to a highway, areas benefit from public transport, trucking routes, and logistics networks-boosting commercial activity. This leads to a spike in both demand and rates of properties.</p>
     <p><strong>3. Rapid Increase in Rental Demand</strong></p>
     <p>When an area gets connected to a highway, both residential and commercial activities expand. This directly increases rental demand. Land or homes you invest in start generating regular rental income.In such locations, the demand for offices, warehouses, shops, and small flats surges. Hence, investors here don't just buy land-they secure a steady source of rental income. Some investors even build hostels or guesthouses on plots in these areas to earn a monthly income.</p>
     <p><strong>4. A Future-Proof Investment</strong></p>
     <p>The biggest advantage of investing in land near highways is the guarantee of development. Whether it’s a new bypass, industrial corridor, or smart city project-areas near highways are often at the center of development. As a result, such investments are protected from future economic fluctuations.Sometimes, the government converts these regions into SEZs (Special Economic Zones) or smart towns, which causes property values to multiply. An investment made once continues to offer secure and growing returns for years to come.</p>
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
