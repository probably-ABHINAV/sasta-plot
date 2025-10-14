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
          src="/images/bajrang-vatika.jpg"  // 🔹 Replace with your image
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
          <strong>Bajrang Vatika</strong> is a calm, family-friendly residential layout designed for buyers 
          who want <strong>everyday convenience</strong> without the city rush. 
          The roads are <strong>motorable and well-defined</strong>, plot boundaries are clear, and basic utilities 
          are accessible — making it easy to plan and build. 
          The neighbourhood includes <strong>local shops</strong>, <strong>primary schools</strong>, and 
          <strong> public transport</strong> nearby, so daily needs are easy to meet. 
          With infrastructure improving, buyers can expect <strong>steady appreciation</strong> over time.
        </p>

        <h3 className="font-bold text-lg mt-8 mb-2">What you get – travel &amp; access</h3>
        <p><strong>Dehradun ISBT (Inter-State Bus Terminal):</strong> ~15 minutes.</p>
        <p><strong>Dehradun Railway Station:</strong> ~20 minutes.</p>
        <p><strong>Jolly Grant Airport (Dehradun):</strong> ~30 minutes.</p>
        <p><strong>Hospitals / healthcare:</strong> Kailash Hospital, Graphic Era Hospital ~5–20 minutes.</p>
        <p><strong>Schools &amp; colleges:</strong> Doon Global School, Shubharti Medical College ~5–20 minutes.</p>

        <h3 className="font-bold text-lg mt-8 mb-2">Lifestyle &amp; Convenience</h3>
        <p>
          <strong>Bajrang Vatika</strong> suits buyers who want to escape traffic while retaining access to essential services. 
          <strong>Morning walks</strong>, <strong>private gardens</strong>, and <strong>personal landscaping</strong> 
          define the lifestyle here. Proximity to schools, markets, and easy bus access make daily life effortless.
        </p>

        <h3 className="font-bold text-lg mt-8 mb-2">Investment rationale</h3>
        <p>
          With <strong>limited supply</strong> and <strong>improving local infrastructure</strong>, 
          Bajrang Vatika offers <strong>steady appreciation potential</strong> for 
          <strong> conservative investors</strong> seeking <strong>low-volatility land parcels</strong>.
        </p>

        <h3 className="font-bold text-lg mt-8 mb-2">Assurance</h3>
        <p>
          Every plot is sold with a <strong>verified title pack</strong>; 
          we assist with <strong>registration</strong>, <strong>transfer</strong>, and 
          <strong> construction-permission guidance</strong>.
        </p>

        {/* Photo Gallery */}
        <h3 className="font-bold text-lg mt-8 mb-4">Photo Gallery</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <img src="/images/gallery/A_1760474592657.jpg" alt="Bajrang Vatika View 1" className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
        <img src="/images/gallery/B_1760474592655.jpg" alt="Bajrang Vatika View 2" className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
        <img src="/images/gallery/C_1760474592656.jpg" alt="Bajrang Vatika View 3" className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
        <img src="/images/gallery/D_1760474592654.jpg" alt="Bajrang Vatika View 4" className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
        <img src="/images/gallery/E_1760474592651.jpg" alt="Bajrang Vatika View 5" className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
        <img src="/images/gallery/F_1760474592653.jpg" alt="Bajrang Vatika View 6" className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
      </div>
    </main>
  );
}
