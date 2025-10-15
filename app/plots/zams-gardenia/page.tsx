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
          <strong>Zams Gardenia</strong> is promoted as an affordable plotted development in <strong>Bihta</strong> aimed at buyers who want a ready-to-build plot within Greater Patna’s <strong>rapidly expanding suburban belt</strong>. The project’s marketing and local listings emphasise practical infrastructure  - gated layout, street lighting and security  - to deliver a neighbourhood that supports quick construction and secure ownership. Many advertisements and listing pages position Zams Gardenia as an <strong>investment-friendly</strong> option because of Bihta’s growth trajectory and emerging institutional <strong>connectivity</strong>. Prospective buyers should verify the latest layout, approvals and possession status directly with the sastaplots.  
        </p> 

        {/* Travel & Access */}
        <h3 className="font-bold text-lg mt-8 mb-2">What you get – travel &amp; access</h3>
        <p><strong>Bihta Railway Station / local stop:</strong> ~5 minutes.</p> 
        <p><strong>Patna Junction (central rail hub):</strong> ~35 minutes.</p> 
        <p><strong>Jay Prakash Narayan (Patna) Airport (PAT):</strong> ~25 minutes.</p> 
        <p><strong>Hospitals / healthcare:</strong> Netaji Subhas Medical College &amp; Hospital, ESIC &amp; other private hospitals ~10 minutes.</p> 
        <p><strong>Schools &amp; colleges:</strong> Bihta and Greater Patna host multiple primary/secondary schools and Marketed as near IIT Patna / educational hubs and other regional nodes within ~10 minutes.</p> 
        <p> Positioned for easy weekend and daily travel to Patna and nearby towns as Bihta develops into a residential & institutional hub.</p> 

        {/* Lifestyle & Convenience */}
        <h3 className="font-bold text-lg mt-8 mb-2">Who this suits</h3>
        <p>
          Zams Gardenia is a fit for first-time plot buyers and small-family homebuilders seeking affordable land close to Patna, investors looking for growth potential in Bihta, and buyers who prefer plots that allow early construction. It’s also attractive to those wanting proximity to educational/industrial hubs being developed in the Bihta corridor. As with any plot purchase, buyers who need bank finance or verified paperwork should request the latest documents and loan eligibility details.  
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
        <h3 className="font-bold text-lg mt-8 mb-2">Amenities & Infrastructure </h3>
        <p><strong>Gated community with compound walls and a defined entrance</strong></p>
        <p><strong>24×7 security / CCTV and provision for street lighting to ensure safe day and night</strong></p>
        <p><strong>Blacktop / pucca internal roads and clear plot demarcation for easy construction access.</strong></p>
        <p><strong>Planned drainage system / rainwater management and basic civic provisions as listed in promotional materials.  </strong></p>
        <p><strong>Parks / landscaped open areas and community spaces for recreation</strong></p>
      </div>
    </main> 
  ); 
}
