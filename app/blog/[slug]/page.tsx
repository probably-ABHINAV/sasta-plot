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
      <p>उत्तराखंड की राजधानी देहरादून सिर्फ अपने स्कूल, कॉलेज और प्राकृतिक सुंदरता के लिए नहीं जानी जाती, बल्कि अब यह एक नई दिशा में तेज़ी से आगे बढ़ रही है - 'ग्रेटर देहरादून' के रूप में। जहां एक ओर पुराने देहरादून में जगह की कमी और महंगाई बढ़ रही है, वहीं ग्रेटर देहरादून निवेशकों के लिए नई उम्मीद लेकर आया है। किफायती जमीन, बेहतरीन कनेक्टिविटी और ग्रीन लाइफस्टाइल के कारण यह क्षेत्र तेजी से निवेशकों का फेवरेट बनता जा रहा है। आइए, विस्तार से जानते हैं उन कारणों को जिनकी वजह से ग्रेटर देहरादून 2025 में निवेश की सबसे आकर्षक जगह बन चुका है।</p>
      <ul>
        <li>1. दिल्ली–देहरादून इकोनॉमिक कॉरिडोर: रफ्तार और रियल एस्टेट का संगम</li>
        <li>भारत सरकार का महत्वाकांक्षी प्रोजेक्ट दिल्ली–देहरादून इकोनॉमिक कॉरिडोर, इस क्षेत्र की किस्मत बदलने वाला है। यह हाइवे दिल्ली से देहरादून की यात्रा को महज 2.5 घंटे में पूरा करेगा। इसके साथ ही कॉरिडोर के आस-पास के इलाकों में जमीन की कीमतें तेजी से बढ़ रही हैं। खासकर हर्रावाला, भानियावाला और डोईवाला जैसे क्षेत्र, जो पहले शांत और ग्रामीण कहे जाते थे, अब इंफ्रास्ट्रक्चर और ट्रैफिक के लिहाज से शहर के बराबर हो गए हैं। निवेशक अब इन क्षेत्रों को लॉन्ग टर्म रिटर्न के हिसाब से देख रहे हैं।</li>
        <li>2. अफोर्डेबल प्लॉट्स और लॉन्ग टर्म रिटर्न का बेहतर संतुलन</li>
        <li>ग्रेटर देहरादून में आज भी ₹6000–₹9000 प्रति गज की दर पर रेजिडेंशियल प्लॉट मिलना संभव है, जो किसी भी नए निवेशक के लिए बड़ा अवसर है। जब हम इसकी तुलना पुराने देहरादून से करते हैं, जहां रेट ₹15000–₹25000 प्रति गज तक पहुंच चुके हैं, तो ग्रेटर देहरादून में निवेश करना ज्यादा व्यावहारिक और फायदे का सौदा लगता है। विशेषज्ञों की मानें तो अगले 3–5 वर्षों में यहां की जमीन की कीमतें 2 गुना से अधिक हो सकती हैं।</li>
      </ul>
      <p>For investors, this region offers <em>affordable entry + long-term appreciation</em>.</p>
    `
  },
  {
    id: "2",
    title: "Common Real Estate Mistakes & How Zam’s Gardenia Solves Them",
    slug: "zams-gardenia-real-estate-mistakes",
    created_at: "2025-10-08",
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
