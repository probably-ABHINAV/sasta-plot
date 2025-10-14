import React from "react";

export const metadata = { 
  title: "Zams Gardenia (Bihta–Greater Patna corridor)" 
};

export default function Page() { 
  return ( 
    <main className="max-w-4xl mx-auto py-12 px-6"> 
      {/* Project Image */}
      <div className="mb-8">
        <img 
          src="/images/plots/plot-1.png"
          alt="Zams Gardenia Bihta Greater Patna Corridor"
          className="w-full h-64 object-cover rounded-2xl shadow-md"
        />
      </div>

      {/* Project Title */}
      <h1 className="text-3xl font-bold mb-2">
        Zams Gardenia (Bihta–Greater Patna corridor)
      </h1> 

      {/* Property Details */}
      <p className="text-sm text-gray-600 mb-4">
        700–2000 sq.ft • Ownership: Freehold • Price: ₹16500 Per sq/feet onwards • Status: Planned &amp; Developing
      </p>

      {/* Location Button */}
      <div className="mb-6">
        <a 
          href="https://www.google.com/maps?q=25.5941,85.1376"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          View Location on Map
        </a>
      </div> 

      <div className="prose"> 
        {/* Overview */}
        <p>
          <strong>Zams Gardenia</strong> is a contemporary, planned layout that focuses on 
          <strong> neat streets</strong>, <strong>efficient drainage</strong>, and a <strong>modern aesthetic</strong>. 
          The layout is designed to be <strong>organized</strong> and <strong>visually appealing</strong>, with clear plot demarcations 
          and infrastructure considered from the start. 
          This area is seeing growing interest from <strong>homebuyers</strong> and <strong>small developers</strong>, 
          offering strong potential for future price appreciation. 
          If you're planning a <strong>modern build</strong> or seeking an <strong>investment opportunity</strong> 
          that appreciates as the locality develops, Zams Gardenia is an excellent choice.
        </p> 

        {/* Travel & Access */}
        <h3 className="font-bold text-lg mt-8 mb-2">What you get – travel &amp; access</h3>
        <p><strong>Bihta Railway Station / local stop:</strong> ~5 minutes.</p> 
        <p><strong>Patna Junction (central rail hub):</strong> ~35 minutes.</p> 
        <p><strong>Jay Prakash Narayan (Patna) Airport (PAT):</strong> ~25 minutes.</p> 
        <p><strong>Hospitals / healthcare:</strong> Netaji Subhas Medical College &amp; Hospital, ESIC &amp; other private hospitals ~10 minutes.</p> 
        <p><strong>Schools &amp; colleges:</strong> Bihta and Greater Patna host multiple primary/secondary schools and coaching centres within ~10 minutes.</p> 
        <p><strong>Retail &amp; daily needs:</strong> Local markets and Patna retail hubs reachable in ~25 minutes.</p> 

        {/* Lifestyle & Convenience */}
        <h3 className="font-bold text-lg mt-8 mb-2">Lifestyle &amp; Convenience</h3>
        <p>
          <strong>Zams Gardenia</strong> attracts buyers seeking a <strong>curated neighbourhood</strong> — 
          think <strong>well-spaced plots</strong>, <strong>elegant streetscapes</strong>, and a 
          <strong>community image</strong> that promotes <strong>high-quality living</strong> 
          and <strong>bespoke design</strong>.
        </p> 

        {/* Investment Rationale */}
        <h3 className="font-bold text-lg mt-8 mb-2">Investment rationale</h3>
        <p>
          As a <strong>planned development</strong> in a rising pocket, 
          <strong>Zams Gardenia</strong> is positioned for stronger appreciation compared with ad-hoc layouts. 
          It's ideal for buyers targeting <strong>long-term capital growth</strong> and for developers seeking 
          <strong>premium plot inventory</strong> in a growing corridor.
        </p> 

        {/* Assurance */}
        <h3 className="font-bold text-lg mt-8 mb-2">Assurance</h3>
        <p>
          We provide a <strong>comprehensive documentation pack</strong> — 
          including <strong>layout approvals</strong>, <strong>title clearance summaries</strong>, 
          and a <strong>market-comparison note</strong> to help discerning buyers 
          evaluate the project's <strong>long-term upside</strong>.
        </p>

        {/* Photo Gallery */}
        <h3 className="font-bold text-lg mt-8 mb-4">Photo Gallery</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <img src="/images/gallery/A_1760474592657.jpg" alt="Zams Gardenia View 1" className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
        <img src="/images/gallery/B_1760474592655.jpg" alt="Zams Gardenia View 2" className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
        <img src="/images/gallery/C_1760474592656.jpg" alt="Zams Gardenia View 3" className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
        <img src="/images/gallery/D_1760474592654.jpg" alt="Zams Gardenia View 4" className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
        <img src="/images/gallery/E_1760474592651.jpg" alt="Zams Gardenia View 5" className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
        <img src="/images/gallery/F_1760474592653.jpg" alt="Zams Gardenia View 6" className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
      </div>
    </main> 
  ); 
}
