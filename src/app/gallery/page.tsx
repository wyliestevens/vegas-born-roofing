import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'View photos of completed roofing projects by Vegas Born Roofing LLC in Las Vegas, Henderson, and Summerlin. Commercial roofing, sheet metal fabrication, and roof coating projects.',
  openGraph: {
    title: 'Project Gallery | Vegas Born Roofing',
    description: 'See our completed commercial and residential roofing projects across Las Vegas.',
  },
};

const galleryImages = [
  { src: '/images/commercial-roofing.jpg', alt: 'Commercial roofing project in Las Vegas by Vegas Born Roofing', caption: 'Commercial Roofing Project' },
  { src: '/images/metal-3.jpeg', alt: 'Sheet metal roofing fabrication and installation in Las Vegas', caption: 'Sheet Metal Installation' },
  { src: '/images/metal-4.jpeg', alt: 'Custom metal roofing component fabricated by Vegas Born Roofing', caption: 'Custom Metal Fabrication' },
  { src: '/images/metal-5.jpeg', alt: 'Metal roofing project completed in Las Vegas Nevada', caption: 'Metal Roofing Project' },
  { src: '/images/metal-6.jpeg', alt: 'Commercial metal roof installation by Vegas Born Roofing team', caption: 'Commercial Metal Roof' },
  { src: '/images/roof-coating-1.jpeg', alt: 'Roof coating application on commercial building in Las Vegas', caption: 'Roof Coating Application' },
  { src: '/images/roof-coating-2.jpeg', alt: 'Professional roof coating project completed in Las Vegas NV', caption: 'Completed Roof Coating' },
  { src: '/images/residential.jpg', alt: 'Residential roof installation in Las Vegas by Vegas Born Roofing', caption: 'Residential Installation' },
  { src: '/images/tile-property.jpg', alt: 'Tile roof maintenance for property management in Las Vegas', caption: 'Tile Roof Maintenance' },
  { src: '/images/sheet-metal.jpeg', alt: 'Sheet metal division project by Vegas Born Roofing LLC', caption: 'Sheet Metal Division' },
];

export default function Gallery() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#111827] py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Roofing Excellence in Action
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Browse photos from our commercial and residential roofing projects across the Las Vegas Valley
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow bg-gray-100"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-white font-semibold text-sm">{img.caption}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Want to See Results Like These?
          </h2>
          <p className="text-gray-600 mb-8">
            Contact us for a free estimate on your next roofing project.
          </p>
          <a
            href="tel:7028762630"
            className="inline-flex items-center bg-[#b91c1c] text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-[#991b1b] transition-colors"
          >
            Call (702) 876-2630
          </a>
        </div>
      </section>
    </>
  );
}
