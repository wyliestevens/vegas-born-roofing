import Image from 'next/image';
import Link from 'next/link';
import ReviewsCarousel from '@/components/ReviewsCarousel';
import FAQ from '@/components/FAQ';

const services = [
  {
    title: 'Commercial Roofing',
    description:
      'We work with general contractors, property managers, and business owners across Las Vegas delivering reliable roofing systems built to last. Our commercial services include TPO, PVC, EPDM, re-roofs, preventative maintenance, emergency repairs, coatings, and metal/modified bitumen roofing.',
    image: '/images/commercial-roofing.jpg',
    alt: 'Commercial roofing project by Vegas Born Roofing in Las Vegas',
  },
  {
    title: 'Sheet Metal Division',
    description:
      'Our in-house sheet metal division allows us to fabricate custom metal components on both commercial and residential roofing projects. This gives us full control over quality, precision, and turnaround times on every job.',
    image: '/images/sheet-metal.jpeg',
    alt: 'Custom sheet metal fabrication for roofing in Las Vegas',
  },
  {
    title: 'Residential Services',
    description:
      'Our residential team provides everything from roof repairs and leak detection to full re-roof installations. Whether you need a quick fix or a complete roof replacement, we deliver quality workmanship you can trust.',
    image: '/images/residential.jpg',
    alt: 'Residential roof installation by Vegas Born Roofing',
  },
  {
    title: 'Property Management Services',
    description:
      'We help property managers and building owners stay ahead of costly repairs with scheduled inspections and maintenance programs. Our team keeps your properties protected year-round across the Las Vegas Valley.',
    image: '/images/tile-property.jpg',
    alt: 'Property management roofing services in Las Vegas',
  },
];

export default function Home() {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: s.title,
        description: s.description,
        provider: { '@type': 'RoofingContractor', name: 'Vegas Born Roofing LLC' },
        areaServed: { '@type': 'City', name: 'Las Vegas' },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Hero */}
      <section className="relative bg-[#111827] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bg.png"
            alt="Las Vegas commercial roofing skyline"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111827] via-[#111827]/80 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-28 md:py-40">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Commercial &amp; Residential{' '}
              <span className="text-[#d4a843]">Roofing Experts</span>{' '}
              Serving Las Vegas &amp; Nearby Areas
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              Licensed in Nevada, Utah &amp; Arizona. Trusted by general contractors, property managers,
              and homeowners since 2018.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="tel:7028762630"
                className="inline-flex items-center bg-[#b91c1c] text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-[#991b1b] transition-colors shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call (702) 876-2630
              </a>
              <Link
                href="/free-quote"
                className="inline-flex items-center bg-[#d4a843] text-[#111827] px-8 py-4 rounded-lg text-lg font-bold hover:bg-[#c49a3a] transition-colors shadow-lg"
              >
                Get a Free Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-white py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-[#b91c1c]">Since 2018</p>
              <p className="text-sm text-gray-600 mt-1">Established Business</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#b91c1c]">3 States</p>
              <p className="text-sm text-gray-600 mt-1">NV, UT &amp; AZ Licensed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#b91c1c]">100+ Years</p>
              <p className="text-sm text-gray-600 mt-1">Combined Experience</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#b91c1c]">5-Star</p>
              <p className="text-sm text-gray-600 mt-1">Customer Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white" id="services">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Roofing Services
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              From small residential repairs to large-scale commercial projects, we deliver quality
              workmanship on every job.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <h3 className="absolute bottom-4 left-6 text-2xl font-bold text-white">
                    {service.title}
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Commitment</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                We take pride in doing things the right way. From the first call to the final
                walkthrough, our focus is on quality workmanship, clear communication, and dependable
                service you can count on.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Proudly serving Las Vegas, Henderson, Summerlin, North Las Vegas, Boulder City,
                Pahrump, Mesquite, Laughlin, and surrounding areas.
              </p>
              <Link
                href="/meet-the-team"
                className="inline-flex items-center text-[#b91c1c] font-semibold hover:text-[#991b1b] transition-colors text-lg"
              >
                Meet Our Team
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Team</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Our team is made up of experienced roofing professionals who know how to get the job
                done right. With over 100 combined years in the industry, we bring deep expertise to
                every project — commercial or residential.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Led by owner Jodd Friesz, who has been in the roofing industry since 1995, our crew
                values communication, teamwork, and accountability on every job site.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scrolling Reviews */}
      <ReviewsCarousel />

      {/* CTA */}
      <section className="py-20 bg-[#b91c1c]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready for a Free Roofing Estimate?
          </h2>
          <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
            Whether it&apos;s a small repair or a full commercial re-roof, we&apos;re here to help. Get your
            free quote today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:7028762630"
              className="bg-white text-[#b91c1c] px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Call (702) 876-2630
            </a>
            <Link
              href="/free-quote"
              className="bg-[#111827] text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-800 transition-colors"
            >
              Request a Quote Online
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ for AEO */}
      <FAQ />
    </>
  );
}
