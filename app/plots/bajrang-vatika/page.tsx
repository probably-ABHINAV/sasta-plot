import React from "react";

export const metadata = { 
  title: "Bajrang Vatika - The Private Retreat" 
};

export default function Page() { 
  return ( 
    <main className="max-w-4xl mx-auto py-12 px-6">
      {/* Project Image */}
      <div className="mb-8">
        <img
          src="/images/gallery/C_1760476152261.jpg"  // 🔹 Replace with your image
          alt="Bajrang Vatika - The Private Retreat"
          className="w-full h-64 object-cover rounded-2xl shadow-md"
        />
      </div>

      {/* Title & Details */}
      <h1 className="text-3xl font-bold mb-2">Bajrang Vatika - The Private Retreat</h1> 
      <p className="text-sm text-gray-600 mb-4">
        1200–2400 sq.yd • Ownership: Freehold • Price: ₹16800 Per sq/yard onwards • Status: Ready-to-develop
      </p>

      {/* Location Button */}
      <div className="mb-6">
        <a 
          href="https://www.google.com/maps/@30.402437,77.750105,16z?hl=en&entry=ttu&g_ep=EgoyMDI1MDkxNy4wIKXMDSoASAFQAw%3D%3D"
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

      {/* Description */}
      <div className="prose">
        <p>
          Bajrang Vatika positions itself as Uttarakhand’s first <strong>Hanuman-themed</strong> plotted development, blending spiritual design elements with practical, <strong>ready-to-build plots</strong>. The layout emphasizes <strong>Vastu compatibility</strong>, green open spaces and a focal <strong>temple</strong> that shapes the community identity. Located on a high-growth corridor near the <strong>Shimla Bypass</strong>, the project is marketed for families seeking a <strong>peaceful residential</strong> setting as well as investors who value proximity to Dehradun’s educational and medical hubs. The developer highlights immediate usability, secure gated living and straightforward road access to neighbouring towns and the city.
        </p>

        <h3 className="font-bold text-lg mt-8 mb-2">What you get – travel &amp; access</h3>
        <p><strong>Located near the Shimla Bypass Road (prime growth corridor).</strong></p>
        <p><strong>Dehradun ISBT (Inter-State Bus Terminal):</strong> ~25 minutes.</p>
        <p><strong>Paonta Sahib and quick access to Chimera regional corridors</strong> ~20 minutes.</p>
        <p><strong>Jolly Grant Airport (Dehradun):</strong> ~30 minutes.</p>
        <p><strong>Hospitals / healthcare:</strong> Kailash Hospital, Graphic Era Hospital ~ 10 minutes.</p>
        <p><strong>Schools &amp; colleges:</strong> Doon Global School, Shubharti Medical College ~ 15 minutes.</p>

        <h3 className="font-bold text-lg mt-8 mb-2">Who this suits</h3>
        <p>
          Bajrang Vatika is well suited to buyers who want a serene, spiritually themed neighbourhood close to Dehradun’s conveniences  - particularly families seeking weekend or year-round homes, retirees who value calm surroundings, and investors looking for plotted land in a corridor that’s attracting new residential demand. The project’s ready-to-move plots and proximity to major road links also appeal to buyers who want to start construction quickly. 
        </p>

        <h3 className="font-bold text-lg mt-8 mb-2">Investment rationale</h3>
        <p>
          With <strong>limited supply</strong> and <strong>improving local infrastructure</strong>, 
          Bajrang Vatika offers <strong>steady appreciation potential</strong> for 
          <strong> conservative investors</strong> seeking <strong>low-volatility land parcels</strong>.
        </p>

        <h3 className="font-bold text-lg mt-8 mb-2">Amenities & Infrastructure</h3>
      
         <p><strong>Hanuman-themed centerpiece with an on-site temple</strong>  - the project is promoted as a spiritually inspired community.</p>
         <p><strong>Gated township with main entrance gate and perimeter boundary wall.</strong></p>
         <p><strong>24×7 security and CCTV surveillance; guard room at the entrance.</strong></p>
         <p><strong>Wide internal roads (30 ft / 40 ft arterial roads reported in listings) for easy movement and construction access.</strong></p>
         <p><strong>Provision for water and electricity connections and street lighting.</strong></p>
        

        {/* Photo Gallery */}
        <h3 className="font-bold text-lg mt-8 mb-4">Photo Gallery</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <img src="/images/gallery/A_1760476152262.jpg" alt="Bajrang Vatika View 1" className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
        <img src="/images/gallery/B_1760476152260.jpg" alt="Bajrang Vatika View 2" className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
        <img src="/images/gallery/C_1760476152261.jpg" alt="Bajrang Vatika View 3" className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
        <img src="/images/gallery/D_1760476152258.jpg" alt="Bajrang Vatika View 4" className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
        <img src="/images/gallery/E_1760476152255.jpg" alt="Bajrang Vatika View 5" className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
        <img src="/images/gallery/F_1760476152257.jpg" alt="Bajrang Vatika View 6" className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
      </div>
    </main>
  );
}
