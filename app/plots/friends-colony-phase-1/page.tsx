import React from "react";

export const metadata = { 
  title: "Friends Colony Phase-1" 
};

export default function Page() { 
  return ( 
    <main className="max-w-4xl mx-auto py-12 px-6">
      {/* Project Image */}
      <div className="mb-8">
        <img
          src="/images/gallery/WhatsApp Image 2025-10-13 at 23.57.02_e87110ff.jpg"  // 🔹 Replace with your image
          alt="Friends Colony Phase-1"
          className="w-full h-64 object-cover rounded-2xl shadow-md"
        />
      </div>

      {/* Title & Details */}
      <h1 className="text-3xl font-bold mb-2">Friends Colony Phase-1</h1> 
      <p className="text-sm text-gray-600 mb-4">
        1000–2000 sq.yd • Ownership: Freehold • Price: ₹16800 Per sq/yard onwards • Status: Construction-ready
      </p>

      {/* Location Button */}
      <div className="mb-6">
        <a 
          href="https://goo.gl/maps/eVZJvUNkMXLGmDKe8"
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
          <strong>Friends Colony Phase-1</strong> is presented as an affordable, <strong>ready-to-build</strong> plotting project positioned to benefit from major highway-driven growth in the Dehradun region. The developer markets it as a practical choice for those seeking weekend homes, retirement living, or <strong>long-term investment</strong> offering easy <strong>highway access</strong> while remaining close to essential services. <strong>Plots</strong> are laid out to simplify house design and construction, and the community plan focuses on a <strong>peaceful residential environment</strong> with green open spaces and basic civic utilities.
        </p>

        <h3 className="font-bold text-lg mt-8 mb-2">What you get – travel &amp; access</h3>
        <p><strong>Located on the Delhi–Dehradun Highway</strong>NH-307 (Delhi–Dehradun Expressway corridor).  </p>
        <p><strong>Dehradun ISBT / central bus hub:</strong> ~20 minutes.</p>
        <p><strong>Well connected for weekend travel to Delh</strong> ~ 3 Hours</p>
        <p><strong>Jolly Grant Airport:</strong> ~35 minutes.</p>
        <p><strong>Hospitals </strong> Multi-speciality hospitals ~10 minutes.</p>
        <p><strong>Schools &amp; coaching centres:</strong> Established schools and coaching institutes ~10 minutes.</p>

        <h3 className="font-bold text-lg mt-8 mb-2">Lifestyle &amp; Convenience</h3>
        <p>
          <strong>Friends Colony</strong> is designed for families who value <strong>neighbourhood warmth</strong> and 
          <strong> practical mobility</strong>. 
          The community promotes <strong>social living</strong> — with <strong>street-side trees</strong>, 
          <strong> safe play areas</strong>, and <strong>neighbours who invest in long-term homes</strong>.
        </p>

        <h3 className="font-bold text-lg mt-8 mb-2">Investment rationale</h3>
        <p>
          Because plots are <strong>ready for immediate construction</strong>, buyers can start development quickly 
          speeding up <strong>utility connections</strong> and improving <strong>rental/resale potential</strong> 
          for <strong>short-to-medium-term investors</strong>.
        </p>

        <h3 className="font-bold text-lg mt-8 mb-2">Amenities & Infrastructure </h3>
        <p><strong>Gated community with controlled entry and an emphasis on resident security.</strong></p>
          <p><strong>Wide, well-laid internal roads and clearly planned plots for easy construction.</strong></p>
          <p><strong>Landscaped parks, green spaces and children’s play areas for community recreation.</strong></p>
          <p><strong>Street lighting and provision for civic conveniences to ensure a safe, usable neighbourhood after dusk.</strong></p>
          <p><strong>Civic infrastructure planning including drainage and sewage provisions (planned to avoid waterlogging)</strong></p>

        {/* Photo Gallery */}
        <h3 className="font-bold text-lg mt-8 mb-4">Photo Gallery</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <img src="/images/gallery/WhatsApp Image 2025-10-13 at 23.57.02_0cf5591a.jpg" alt="Friends Colony View 1" className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
        <img src="/images/gallery/WhatsApp Image 2025-10-13 at 23.57.02_e87110ff.jpg" alt="Friends Colony View 2" className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
        <img src="/images/gallery/WhatsApp Image 2025-10-13 at 23.57.03_02316e06.jpg" alt="Friends Colony View 3" className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
        <img src="/images/gallery/WhatsApp Image 2025-10-13 at 23.57.03_4315efdb.jpg" alt="Friends Colony View 4" className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
        <img src="/images/gallery/WhatsApp Image 2025-10-13 at 23.57.03_a5777e2d.jpg" alt="Friends Colony View 5" className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
        <img src="/images/gallery/WhatsApp Image 2025-10-13 at 23.57.03_af26fc11.jpg" alt="Friends Colony View 6" className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
      </div>
    </main>
  );
}
