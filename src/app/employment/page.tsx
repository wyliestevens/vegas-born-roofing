import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Employment',
  description:
    'Join the Vegas Born Roofing team. We are hiring experienced roofing professionals in Las Vegas, NV. Apply today for career opportunities in commercial and residential roofing.',
  openGraph: {
    title: 'Careers at Vegas Born Roofing | Apply Today',
    description: 'Join our growing team of roofing professionals in Las Vegas.',
  },
};

export default function Employment() {
  const jobPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: 'Roofing Professional',
    description:
      'Vegas Born Roofing is searching for talented roofing professionals to join our team. We are a family-oriented company looking for career-oriented individuals.',
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Vegas Born Roofing LLC',
      sameAs: 'https://vegasbornroofing.com',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '4205 W Tompkins Ave, Suite 6',
        addressLocality: 'Las Vegas',
        addressRegion: 'NV',
        postalCode: '89103',
        addressCountry: 'US',
      },
    },
    employmentType: 'FULL_TIME',
    jobLocationType: 'TELECOMMUTE',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
      />

      {/* Hero */}
      <section className="bg-[#111827] py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Join Our Team</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Vegas Born Roofing is rapidly growing and searching for our next talented member to join
            our team.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Work With Us?</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  We&apos;re a family-oriented company looking for career-oriented individuals who aren&apos;t
                  afraid of a challenge. At Vegas Born Roofing, you&apos;ll join a team that values hard
                  work, integrity, and taking care of each other.
                </p>
                <ul className="space-y-4">
                  {[
                    'Competitive pay and benefits',
                    'Steady, year-round work in Las Vegas',
                    'Growth opportunities — many of our managers started in the field',
                    'Family-oriented company culture',
                    'Work on diverse projects: commercial, residential, sheet metal',
                    'In-house training and development',
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
                <h3 className="text-xl font-bold mb-3">Have Questions?</h3>
                <p className="text-gray-400 mb-4">
                  Call us to learn more about current openings and career opportunities.
                </p>
                <a
                  href="tel:7028762630"
                  className="inline-flex items-center text-[#d4a843] text-2xl font-bold hover:text-white transition-colors"
                >
                  (702) 876-2630
                </a>
                <div className="mt-4 text-sm text-gray-400">
                  <p>Mon–Fri: 7:30 AM – 4:00 PM</p>
                </div>
              </div>
            </div>

            {/* Application form */}
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Apply Now</h2>
              <p className="text-gray-600 mb-6">
                Submit your application and we&apos;ll be in touch.
              </p>
              <form className="space-y-5">
                <div>
                  <label htmlFor="emp-name" className="block text-sm font-semibold text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="emp-name"
                    name="name"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent outline-none transition"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="emp-phone" className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    id="emp-phone"
                    name="phone"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent outline-none transition"
                    placeholder="(702) 555-0123"
                  />
                </div>
                <div>
                  <label htmlFor="emp-email" className="block text-sm font-semibold text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="emp-email"
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent outline-none transition"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="emp-position" className="block text-sm font-semibold text-gray-700 mb-1">
                    Position of Interest
                  </label>
                  <select
                    id="emp-position"
                    name="position"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent outline-none transition bg-white"
                  >
                    <option value="">Select a position</option>
                    <option value="installer">Roofing Installer</option>
                    <option value="foreman">Roofing Foreman</option>
                    <option value="sheet-metal">Sheet Metal Technician</option>
                    <option value="estimator">Estimator</option>
                    <option value="project-manager">Project Manager</option>
                    <option value="admin">Administrative</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="emp-experience" className="block text-sm font-semibold text-gray-700 mb-1">
                    Years of Experience
                  </label>
                  <select
                    id="emp-experience"
                    name="experience"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent outline-none transition bg-white"
                  >
                    <option value="">Select experience level</option>
                    <option value="0-1">0–1 years</option>
                    <option value="2-5">2–5 years</option>
                    <option value="5-10">5–10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="emp-resume" className="block text-sm font-semibold text-gray-700 mb-1">
                    Attach Resume
                  </label>
                  <input
                    type="file"
                    id="emp-resume"
                    name="resume"
                    accept=".pdf,.doc,.docx"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent outline-none transition bg-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#b91c1c] file:text-white hover:file:bg-[#991b1b]"
                  />
                </div>
                <div>
                  <label htmlFor="emp-message" className="block text-sm font-semibold text-gray-700 mb-1">
                    Additional Information
                  </label>
                  <textarea
                    id="emp-message"
                    name="message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent outline-none transition resize-vertical"
                    placeholder="Tell us about yourself and why you'd be a great fit..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#b91c1c] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#991b1b] transition-colors"
                >
                  Submit Application
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
