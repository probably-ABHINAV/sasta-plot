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
      </div>
    </main>
  );
}
