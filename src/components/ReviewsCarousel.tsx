'use client';

const reviews = [
  {
    name: 'Mike R.',
    rating: 5,
    text: 'Vegas Born Roofing did an outstanding job on our commercial flat roof. Jodd and his team were professional from the estimate to the final walkthrough. Highly recommend for any business in Las Vegas.',
  },
  {
    name: 'Sarah T.',
    rating: 5,
    text: 'We had a major leak after a storm and they came out the same day. Tommy was honest about what we needed — no upselling. Fair price and excellent work. Our go-to roofer from now on.',
  },
  {
    name: 'David L.',
    rating: 5,
    text: 'As a property manager with 40+ units in Henderson, I need reliable roofing contractors. Vegas Born has handled all our maintenance and re-roofs for the past three years. Always on time, always on budget.',
  },
  {
    name: 'Jennifer K.',
    rating: 5,
    text: 'They replaced our tile roof in Summerlin and it looks incredible. The crew was respectful of our property and cleaned up everything when they were done. Five stars all the way.',
  },
  {
    name: 'Carlos M.',
    rating: 5,
    text: 'Best roofing company in Las Vegas. Period. We\'ve used them for two commercial buildings now. Their sheet metal work is top notch and their pricing is competitive.',
  },
  {
    name: 'Lisa W.',
    rating: 5,
    text: 'Got quotes from four different roofers. Vegas Born was the most thorough in their inspection and the most transparent about pricing. Roof coating job turned out perfect.',
  },
  {
    name: 'Robert H.',
    rating: 5,
    text: 'Jodd and his team re-roofed our entire HOA community in North Las Vegas. Every building was done on schedule. Communication was excellent throughout the project.',
  },
  {
    name: 'Amanda P.',
    rating: 5,
    text: 'Had them do a full roof inspection before buying our home in Boulder City. They found issues the home inspector missed. Saved us thousands. Honest and knowledgeable team.',
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1 text-[#d4a843]" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsCarousel() {
  return (
    <section className="bg-[#111827] py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          What Our Customers Say
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Trusted by homeowners, property managers, and general contractors across the Las Vegas Valley
        </p>
      </div>

      <div className="relative">
        <div className="flex animate-scroll-left" style={{ width: 'max-content' }}>
          {/* Double the reviews for seamless loop */}
          {[...reviews, ...reviews].map((review, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[350px] mx-3 bg-[#1f2937] rounded-xl p-6 border border-gray-700"
            >
              <Stars count={review.rating} />
              <p className="text-gray-300 mt-4 mb-4 text-sm leading-relaxed">
                &ldquo;{review.text}&rdquo;
              </p>
              <p className="text-white font-semibold">{review.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
