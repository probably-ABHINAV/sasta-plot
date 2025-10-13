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
      </div>
    </main>
  );
}
