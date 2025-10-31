"use client"

import { useParams, notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// ✅ Full content for each blog
const staticPosts = [
  {
  id: "1",
  title: "Top Reasons to Invest in Residential Plots Near Dehradun",
  slug: "residential-plot-investment-dehradun-2025",
  created_at: "2025-10-31",
  content: `
    <p><strong>Top Reasons to Invest in Residential Plots Near Dehradun</strong></p>
    <p>Buying a residential plot near Dehradun has become one of the most promising investment choices in North India. Known for its strategic location between the plains and the hills, Dehradun offers a balanced lifestyle - modern amenities blended with natural beauty. The rising infrastructure, educational institutions, and employment opportunities make it a sought-after destination for both end-users and long-term investors looking to secure their future in a peaceful environment.</p>
    <p>Infrastructure growth is a key reason behind the rising demand. With ongoing projects like the Delhi-Dehradun Expressway and improved connectivity to Rishikesh, Mussoorie, and Haridwar, accessibility is better than ever. Residential plots around areas like Doiwala, Premnagar, and Sahastradhara Road are witnessing rapid appreciation due to this development. For those seeking to build a home or invest early in a developing region, Dehradun’s periphery offers excellent value with future-ready potential.</p>
    <p>Another advantage is flexibility. Buying a plot gives you full control over design, construction pace, and lifestyle preferences unlike pre-built properties. It also allows for multi-purpose use such as building rental units, vacation homes, or even small resorts. This adaptability makes land ownership a more versatile and often more rewarding asset class in the long run, especially in regions seeing consistent urban growth like Dehradun.</p>
    <p>Buyers should still prioritize due diligence. Always verify land titles, mutation records, and zoning regulations before purchase. Partnering with a reliable property consultant can help navigate the verification process and ensure you buy in a legally clear and safe zone. Dehradun’s expanding outskirts include both private and government-approved layouts, so confirm authenticity before finalizing any deal.</p>
    <p><strong>How Property in Sastaplots Helps You Choose Right</strong></p>
    <p>For investors and families exploring options near Dehradun, <strong>Sastaplots</strong> offers an organized platform to compare verified plots, understand market trends, and connect with local experts. Their focus on transparency and region-specific insights helps you find the right property that matches your goals. Whether you’re looking for a scenic plot to build your dream home or a long-term asset for steady appreciation, Sastaplots makes your buying journey simpler, safer, and smarter.</p>
  `
 },
  {
    id: "2",
    title: "Why Buying a Plot in Uttarakhand Is a Smart Long-Term Move",
    slug: "greater-dehradun-investment-2025",
    created_at: "2025-10-29",
    content: `
      <p><strong>Why Buying a Plot in Uttarakhand Is a Smart Long-Term Move</strong></p>
      <p>Investing in land is as much about lifestyle as it is about long-term value. Uttarakhand - with its dramatic Himalayan backdrop, clean air, and growing tourism and wellness economy - offers a rare combination: scenic living plus steady demand from holiday-home buyers, retirees, and eco-tourism developers. For buyers who want a tangible asset that can be used, enjoyed, and passed down, a well-chosen plot in Uttarakhand delivers both emotional satisfaction and financial resilience.</p>
      <p>Location matters more than ever. Proximity to good roads, reliable utilities, and nearby town centers determines usability and resale potential. Many parts of Uttarakhand provide easy access to major highways, railway nodes and regional airports, while still offering the peace of hill living. Areas close to pilgrimage routes, hill stations, and national parks tend to attract consistent interest from holidaymakers and second-home buyers, supporting rental incomes and future appreciation.</p>
      <p>Regulatory clarity and proper due diligence are crucial when buying land in hill regions. Verify title documents, check land-use zoning, confirm clearances (where required), and ensure there are no encumbrances. Because hillside plots can present unique construction and drainage challenges, engage a local surveyor or civil engineer early-this avoids unexpected costs and ensures the plot is suitable for your intended use.</p>
      <p>Sustainability is an advantage in Uttarakhand. Buyers who prioritize environmentally sensitive building practices will find plenty of scope for low-impact homes, rainwater harvesting, and solar energy-features that not only reduce lifetime costs but also increase market appeal. In short, a plot in Uttarakhand can be both an emotionally rewarding retreat and a durable, appreciating asset-if chosen and managed with care.</p>
      <p><strong>Why SastaPlots Makes This Easier</strong></p>
      <p> If you’re exploring plots in Uttarakhand, SastaPlots offers curated listings and local support that speed up your search and reduce risk. Their platform consolidates verified plots, basic due-diligence summaries, and contact options for local experts-helping you move from discovery to decision smoothly. For buyers who believe property in Uttarakhand is best for buying plots, SastaPlots is a practical first stop: browse listings, compare locations, and connect with sellers and advisors who understand hill-property specifics.</p>
    `
  },
  {
    id: "3",
    title: "Why Greater Dehradun is the Smart Investment Choice in 2026",
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
    id: "4",
    title: "Common Real Estate Mistakes & How Zam’s Gardenia Solves Them",
    slug: "zams-gardenia-real-estate-mistakes",
    created_at: "2025-10-24",
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
    id: "5",
    title: "How to Choose the Right Location for Your Plot Investment",
    slug: "greater-dehradun-hindi-2025",
    created_at: "2025-10-27",
    content: `
      <h4>1. Introduction: Why Location Is the Heart of Real Estate</h4>
      <p>In real estate, there’s one golden rule that never changes - location decides everything. Whether you’re buying a residential plot for personal use or an investment, the value of your property largely depends on where it is situated. A well-chosen location can double or even triple your returns over time, while a poor one can leave you struggling to resell. Choosing the right area involves more than just picking a city or town - it means understanding the growth potential, connectivity, and surrounding development. Let’s explore what truly makes a location ideal for a profitable plot purchase.</p>
      <h4>2. Connectivity and Access to Infrastructure</h4>
      <p>One of the first things to check when selecting a plot is how well-connected the area is. Good roads, public transportation, and proximity to major highways make daily commuting convenient and attract future buyers or tenants. Plots located near metro routes, railway stations, or airports appreciate faster because they are accessible to everyone. Infrastructure projects such as flyovers, bypass roads, and bridges directly influence real estate value. Before investing, check government master plans and proposed infrastructure projects - they reveal whether the area is likely to see rapid development or remain stagnant. Better connectivity means higher demand and better future resale value.</p>
      <h4>3. Proximity to Amenities and Daily Conveniences</h4>
      <p>No one wants to live far from basic necessities. A perfect location is one that is close to schools, hospitals, shopping centers, and workplaces. Families prefer neighborhoods that offer a comfortable lifestyle without the need to travel far for everyday needs. When evaluating a plot, explore nearby facilities - even future ones, like planned malls or schools - as they indicate the area’s growth potential. Plots situated within 10–15 minutes of essential amenities not only provide convenience but also attract higher resale and rental values. Always remember: lifestyle convenience directly converts into property value appreciation.</p>
      <h4>4. Safety, Surroundings, and Environment</h4>
      <p>A good location isn’t just about accessibility; it’s also about safety and living quality. Before investing, spend time visiting the locality at different hours of the day. Notice how clean, peaceful, and well-maintained the surroundings are. Avoid areas that seem isolated or have a poor reputation. A secure neighborhood with active community life, proper street lighting, and green open spaces is always in higher demand. Also, check for environmental conditions - avoid plots near factories, drainage lines, or flood-prone zones. A peaceful, safe, and eco-friendly environment ensures long-term comfort and better appreciation.</p>
      <h4>5. Future Growth Potential and Development Plans</h4>
      <p>The best locations are not always the most expensive ones - they’re the ones about to grow. Areas close to upcoming IT hubs, industrial corridors, or smart city zones often experience a surge in property prices within a few years. Check government notifications, infrastructure proposals, and private projects planned in the area. Land near universities, airports, or commercial zones can deliver exceptional returns if bought early. A strategic buyer focuses on future prospects, not just the current situation. Investing in a developing location means you’re purchasing tomorrow’s prime property at today’s price.</p>
      <p>यह इलाका निवेशकों को <strong>सस्ती एंट्री और लंबी अवधि का रिटर्न</strong> देता है।</p>
    `
  },
  {
    id: "6",
    title: "Greater Dehradun क्यों बन रहा है Investors का नया पसंदीदा इलाका?",
    slug: "greater-dehradun-hindi-2026",
    created_at: "2025-10-24",
    content: `
      <p>उत्तराखंड की राजधानी देहरादून सिर्फ अपने स्कूल, कॉलेज और प्राकृतिक सुंदरता के लिए नहीं जानी जाती, बल्कि अब यह एक नई दिशा में तेज़ी से आगे बढ़ रही है - 'ग्रेटर देहरादून' के रूप में। जहां एक ओर पुराने देहरादून में जगह की कमी और महंगाई बढ़ रही है, वहीं ग्रेटर देहरादून निवेशकों के लिए नई उम्मीद लेकर आया है। किफायती जमीन, बेहतरीन कनेक्टिविटी और ग्रीन लाइफस्टाइल के कारण यह क्षेत्र तेजी से निवेशकों का फेवरेट बनता जा रहा है। आइए, विस्तार से जानते हैं उन कारणों को जिनकी वजह से ग्रेटर देहरादून 2025 में निवेश की सबसे आकर्षक जगह बन चुका है।</p>
      <p><strong>1. दिल्ली–देहरादून इकोनॉमिक कॉरिडोर: रफ्तार और रियल एस्टेट का संगम</strong></p>
      <p>भारत सरकार का महत्वाकांक्षी प्रोजेक्ट दिल्ली–देहरादून इकोनॉमिक कॉरिडोर, इस क्षेत्र की किस्मत बदलने वाला है। यह हाइवे दिल्ली से देहरादून की यात्रा को महज 2.5 घंटे में पूरा करेगा। इसके साथ ही कॉरिडोर के आस-पास के इलाकों में जमीन की कीमतें तेजी से बढ़ रही हैं। खासकर हर्रावाला, भानियावाला और डोईवाला जैसे क्षेत्र, जो पहले शांत और ग्रामीण कहे जाते थे, अब इंफ्रास्ट्रक्चर और ट्रैफिक के लिहाज से शहर के बराबर हो गए हैं। निवेशक अब इन क्षेत्रों को लॉन्ग टर्म रिटर्न के हिसाब से देख रहे हैं।</p>
      <p><strong>2. अफोर्डेबल प्लॉट्स और लॉन्ग टर्म रिटर्न का बेहतर संतुलन</strong></p>
      <p>ग्रेटर देहरादून में आज भी ₹16500 प्रति गज की दर पर रेजिडेंशियल प्लॉट मिलना संभव है, जो किसी भी नए निवेशक के लिए बड़ा अवसर है। जब हम इसकी तुलना पुराने देहरादून से करते हैं, जहां रेट ₹15000–₹25000 प्रति गज तक पहुंच चुके हैं, तो ग्रेटर देहरादून में निवेश करना ज्यादा व्यावहारिक और फायदे का सौदा लगता है। विशेषज्ञों की मानें तो अगले 3–5 वर्षों में यहां की जमीन की कीमतें 2 गुना से अधिक हो सकती हैं।</p>
      <p><strong>3. प्रकृति और हाईवे कनेक्टिविटी: शांति और सुविधा का अनूठा मेल</strong></p>
      <p>ग्रेटर देहरादून की खासियत इसकी डुअल कैरेक्टर है - एक ओर यह प्राकृतिक सौंदर्य और पहाड़ों से घिरा है, तो दूसरी ओर यह नेशनल हाइवे से सीधे जुड़ा हुआ है। यह कनेक्टिविटी इसे हर तरह के इन्वेस्टमेंट के लिए उपयुक्त बनाती है। लोग अब भीड़भाड़ से दूर, शांत और हरियाली वाले वातावरण में घर बनाना चाहते हैं, जहां से जरूरी सुविधाएं भी आसानी से मिल जाएं। ग्रेटर देहरादून यही सब कुछ एक साथ देता है।</p>
      <p><strong>4. स्मार्ट सिटी योजना और मास्टर प्लान का असर</strong></p>
      <p>देहरादून को स्मार्ट सिटी मिशन में शामिल किया गया है, जिससे ग्रेटर देहरादून में भी प्लानिंग और डेवलपमेंट को बढ़ावा मिला है। यहां पर MDDA के द्वारा प्लॉटिंग, सड़क, ड्रेनेज और बिजली जैसी सुविधाओं को नियंत्रित और सुव्यवस्थित किया जा रहा है। मास्टर प्लान 2041 के तहत आने वाले ज़ोन अब ज़्यादा स्पष्ट और पारदर्शी हैं, जिससे गलत लोकेशन में निवेश का खतरा कम हो गया है।</p>
      
      <p>यह इलाका निवेशकों को <strong>सस्ती एंट्री और लंबी अवधि का रिटर्न</strong> देता है।</p>
    `
  },
  {
    id: "7",
    title: "हाइवे के पास की ज़मीन: आज खरीदो, कल मुनाफा कमाओ!",
    slug: "zams-gardenia-hindi",
    created_at: "2025-10-24",
    content: `
      <p><strong>1. लोकेशन जो विकास को बुलाए</strong></p>
      <p>हाइवे के पास की ज़मीन हमेशा बेहतर ट्रांसपोर्ट और इन्फ्रास्ट्रक्चर से जुड़ी होती है। नेशनल और स्टेट हाइवे के किनारे बसे क्षेत्र तेजी से विकसित होते हैं क्योंकि सरकार और प्राइवेट कंपनियां ऐसी जगहों को प्राथमिकता देती हैं। यहां शॉपिंग कॉम्प्लेक्स, हॉस्पिटल, स्कूल, और इंडस्ट्रियल पार्क जल्दी आते हैं जिससे प्रॉपर्टी की कीमतों में उछाल आता है।</p>
      <p>साथ ही, इन लोकेशनों में बुनियादी सुविधाएं जैसे रोड लाइटिंग, जल निकासी, वॉटर सप्लाई, और बिजली व्यवस्था तेजी से विकसित होती हैं, जो इन इलाकों को और आकर्षक बनाते हैं। यही कारण है कि हाइवे के पास की ज़मीन निवेशकों के लिए एक सुरक्षित और लाभदायक विकल्प बन चुकी है।</p>
      <p><strong>2. कनेक्टिविटी से बढ़ता है रिटर्न</strong></p>
      <p>बेहतर कनेक्टिविटी निवेश का सबसे बड़ा फायदा है। हाइवे से जुड़े इलाके रोड, रेलवे और एयरपोर्ट से जल्दी कनेक्ट हो जाते हैं। यह कनेक्टिविटी आने वाले वर्षों में उस इलाके को हब में बदल देती है। नतीजा? ज़मीन की कीमतें तेजी से बढ़ती हैं और आप कम समय में अच्छा रिटर्न पा सकते हैं। इसके अलावा, जब कोई क्षेत्र हाईवे से कनेक्ट हो जाता है तो वहां पब्लिक ट्रांसपोर्टेशन, ट्रकिंग रूट्स, और लॉजिस्टिक नेटवर्क भी विकसित होता है, जिससे कमर्शियल एक्टिविटी और बढ़ती है। इससे प्रॉपर्टी की डिमांड और रेट दोनों ही तेज़ी से ऊपर जाते हैं।</p>
      <p><strong>3. तेजी से होती है रेंटल डिमांड</strong></p>
      <p>जब कोई इलाका हाइवे से जुड़ जाता है, वहां वाणिज्यिक और आवासीय गतिविधियां बढ़ जाती हैं। इससे रेंटल डिमांड बढ़ती है। आपके द्वारा खरीदी गई ज़मीन या घर आपको नियमित किराया देने लगता है। वास्तव में, ऐसी जगहों पर ऑफिस, वेयरहाउस, दुकानें और छोटे फ्लैट्स की मांग बढ़ जाती है। यही वजह है कि निवेशक यहां केवल जमीन नहीं, बल्कि रेंटल इनकम का पक्का ज़रिया भी खरीदते हैं। कई इन्वेस्टर्स ऐसे इलाकों में प्लॉट लेकर हॉस्टल या गेस्ट हाउस बना कर महीने की नियमित आय भी प्राप्त करते हैं।</p>
      <p><strong>4. फ्यूचर प्रूफ इन्वेस्टमेंट</strong></p>
      <p>हाइवे के पास की ज़मीन में निवेश करने का सबसे बड़ा फायदा होता है-विकास की गारंटी। चाहे वह कोई नया बायपास हो, औद्योगिक कॉरिडोर या स्मार्ट सिटी प्रोजेक्ट, हाइवे से जुड़े इलाकों को ही विकास का प्राथमिक केंद्र माना जाता है। इस कारण, यह इन्वेस्टमेंट भविष्य में किसी भी आर्थिक उतार-चढ़ाव से सुरक्षित रहता है। कई बार सरकारें ऐसे क्षेत्रों को SEZ (Special Economic Zone) या स्मार्ट टाउन में बदलने का फैसला भी लेती हैं, जिससे प्रॉपर्टी की वैल्यू कई गुना बढ़ जाती है। ऐसे में एक बार किया गया निवेश लंबे समय तक आपको सुरक्षित और बढ़ता हुआ रिटर्न देता है।</p>
     
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
