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
          src="/images/friends-colony.jpg"  // 🔹 Replace with your image
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
          <strong>Friends Colony Phase-1</strong> is a well-organized residential pocket that balances 
          <strong> community living</strong> with <strong>easy connectivity</strong>. 
          Plots are laid out along clear streets with good access to main roads and public transport. 
          The area is ideal for families who value <strong>quick commutes</strong> and nearby conveniences — 
          markets, clinics, and schools are all within easy reach. 
          Because the layout is <strong>clean and construction-ready</strong>, many buyers can begin building right away, 
          making it a favourite for those who want a <strong>faster move-in timeline</strong>.
        </p>

        <h3 className="font-bold text-lg mt-8 mb-2">What you get – travel &amp; access</h3>
        <p><strong>Nearest major expressway:</strong> ~5 minutes to Delhi–Dehradun Expressway.</p>
        <p><strong>Dehradun ISBT / central bus hub:</strong> ~25–30 minutes.</p>
        <p><strong>Dehradun Railway Station:</strong> ~25 minutes.</p>
        <p><strong>Jolly Grant Airport:</strong> ~35 minutes.</p>
        <p><strong>Hospitals / clinics:</strong> Local clinics &amp; multi-speciality hospitals ~10 minutes.</p>
        <p><strong>Schools &amp; coaching centres:</strong> Established schools and coaching institutes ~10–20 minutes.</p>

        <h3 className="font-bold text-lg mt-8 mb-2">Lifestyle &amp; Convenience</h3>
        <p>
          <strong>Friends Colony</strong> is designed for families who value <strong>neighbourhood warmth</strong> and 
          <strong> practical mobility</strong>. 
          The community promotes <strong>social living</strong> — with <strong>street-side trees</strong>, 
          <strong> safe play areas</strong>, and <strong>neighbours who invest in long-term homes</strong>.
        </p>

        <h3 className="font-bold text-lg mt-8 mb-2">Investment rationale</h3>
        <p>
          Because plots are <strong>ready for immediate construction</strong>, buyers can start development quickly — 
          speeding up <strong>utility connections</strong> and improving <strong>rental/resale potential</strong> 
          for <strong>short-to-medium-term investors</strong>.
        </p>

        <h3 className="font-bold text-lg mt-8 mb-2">Assurance</h3>
        <p>
          Complete <strong>verification pack</strong> available on request with <strong>title search</strong>, 
          <strong> layout approval</strong>, and a <strong>step-by-step registration guide</strong>.
        </p>

        {/* Photo Gallery */}
        <h3 className="font-bold text-lg mt-8 mb-4">Photo Gallery</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <img src="/images/gallery/A_1760474592657.jpg" alt="Friends Colony View 1" className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
        <img src="/images/gallery/B_1760474592655.jpg" alt="Friends Colony View 2" className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
        <img src="/images/gallery/C_1760474592656.jpg" alt="Friends Colony View 3" className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
        <img src="/images/gallery/D_1760474592654.jpg" alt="Friends Colony View 4" className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
        <img src="/images/gallery/E_1760474592651.jpg" alt="Friends Colony View 5" className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
        <img src="/images/gallery/F_1760474592653.jpg" alt="Friends Colony View 6" className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
      </div>
    </main>
  );
}
