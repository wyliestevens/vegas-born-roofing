import Link from 'next/link';

const serviceAreas = [
  'Las Vegas', 'Henderson', 'Summerlin', 'North Las Vegas',
  'Boulder City', 'Pahrump', 'Mesquite', 'Laughlin',
];

export default function Footer() {
  return (
    <footer className="bg-[#111827] text-gray-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Company info */}
        <div>
          <h3 className="text-white text-lg font-bold mb-4">Vegas Born Roofing LLC</h3>
          <address className="not-italic space-y-2 text-sm">
            <p>4205 W Tompkins Ave, Suite 6</p>
            <p>Las Vegas, NV 89103</p>
            <p className="mt-3">
              <a href="tel:7028762630" className="text-[#d4a843] hover:text-white font-semibold transition-colors">
                (702) 876-2630
              </a>
            </p>
          </address>
          <div className="mt-4 text-sm">
            <p className="font-semibold text-white mb-1">Hours</p>
            <p>Mon–Fri: 7:30 AM – 4:00 PM</p>
            <p>Sat–Sun: Closed</p>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-[#d4a843] transition-colors">Home</Link></li>
            <li><Link href="/meet-the-team" className="hover:text-[#d4a843] transition-colors">Meet the Team</Link></li>
            <li><Link href="/gallery" className="hover:text-[#d4a843] transition-colors">Gallery</Link></li>
            <li><Link href="/free-quote" className="hover:text-[#d4a843] transition-colors">Free Quote</Link></li>
            <li><Link href="/contact" className="hover:text-[#d4a843] transition-colors">Contact</Link></li>
            <li><Link href="/employment" className="hover:text-[#d4a843] transition-colors">Employment</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-white text-lg font-bold mb-4">Our Services</h3>
          <ul className="space-y-2 text-sm">
            <li>Commercial Roofing</li>
            <li>Residential Roofing</li>
            <li>Sheet Metal Fabrication</li>
            <li>Property Management Services</li>
            <li>Roof Coatings</li>
            <li>Emergency Roof Repairs</li>
            <li>Preventative Maintenance</li>
            <li>Roof Inspections</li>
          </ul>
        </div>

        {/* Service areas */}
        <div>
          <h3 className="text-white text-lg font-bold mb-4">Service Areas</h3>
          <ul className="space-y-2 text-sm">
            {serviceAreas.map((area) => (
              <li key={area}>{area}</li>
            ))}
            <li className="text-[#d4a843]">& Surrounding Areas</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-wrap justify-between items-center gap-4 text-sm">
          <p>&copy; {new Date().getFullYear()} Vegas Born Roofing LLC. All Rights Reserved.</p>
          <p className="text-gray-400">Licensed in Nevada, Utah &amp; Arizona</p>
        </div>
      </div>
    </footer>
  );
}
