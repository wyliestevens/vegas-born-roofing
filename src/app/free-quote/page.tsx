import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Free Quote',
  description:
    'Request a free roofing estimate from Vegas Born Roofing LLC. We serve Las Vegas, Henderson, Summerlin, North Las Vegas, Boulder City, and surrounding areas. Call (702) 876-2630.',
  openGraph: {
    title: 'Get a Free Roofing Quote | Vegas Born Roofing',
    description: 'Schedule a free roofing estimate today. Licensed in NV, UT & AZ.',
  },
};

export default function FreeQuote() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#111827] py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Get a Free Quote</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            We proudly serve Las Vegas, Henderson, Summerlin, North Las Vegas, Boulder City, Pahrump,
            Mesquite, Laughlin, and surrounding areas.
          </p>
        </div>
      </section>

      {/* Form section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Schedule a Quote Today</h2>
              <p className="text-gray-600 mb-6">
                Fill out the form below and we&apos;ll get back to you within one business day.
              </p>
              <form className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent outline-none transition"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent outline-none transition"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent outline-none transition"
                    placeholder="(702) 555-0123"
                  />
                </div>
                <div>
                  <label htmlFor="property-type" className="block text-sm font-semibold text-gray-700 mb-1">
                    Property Type
                  </label>
                  <select
                    id="property-type"
                    name="property-type"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent outline-none transition bg-white"
                  >
                    <option value="">Select property type</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="property-management">Property Management</option>
                    <option value="hoa">HOA Community</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="service" className="block text-sm font-semibold text-gray-700 mb-1">
                    Service Needed
                  </label>
                  <select
                    id="service"
                    name="service"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent outline-none transition bg-white"
                  >
                    <option value="">Select a service</option>
                    <option value="new-roof">New Roof Installation</option>
                    <option value="re-roof">Re-Roof</option>
                    <option value="repair">Roof Repair</option>
                    <option value="inspection">Roof Inspection</option>
                    <option value="coating">Roof Coating</option>
                    <option value="sheet-metal">Sheet Metal</option>
                    <option value="maintenance">Maintenance Program</option>
                    <option value="emergency">Emergency Repair</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1">
                    Project Details
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent outline-none transition resize-vertical"
                    placeholder="Tell us about your roofing project..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#b91c1c] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#991b1b] transition-colors"
                >
                  Request Free Quote
                </button>
              </form>
            </div>

            {/* Info sidebar */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Vegas Born Roofing?</h2>
                <ul className="space-y-4">
                  {[
                    'Free, no-obligation estimates',
                    'Licensed in NV, UT & AZ',
                    'Over 100 years combined experience',
                    'In-house sheet metal division',
                    'Commercial & residential expertise',
                    'Same-day emergency response',
                    'Property management programs available',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[#b91c1c] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#111827] rounded-xl p-8 text-white">
                <h3 className="text-xl font-bold mb-3">Prefer to Call?</h3>
                <p className="text-gray-400 mb-4">
                  Speak directly with our team during business hours.
                </p>
                <a
                  href="tel:7028762630"
                  className="inline-flex items-center text-[#d4a843] text-2xl font-bold hover:text-white transition-colors"
                >
                  (702) 876-2630
                </a>
                <div className="mt-4 text-sm text-gray-400">
                  <p>Mon–Fri: 7:30 AM – 4:00 PM</p>
                  <p>Sat–Sun: Closed</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Service Areas</h3>
                <p className="text-gray-600">
                  Las Vegas, Henderson, Summerlin, North Las Vegas, Boulder City, Pahrump,
                  Mesquite, Laughlin, and surrounding areas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
