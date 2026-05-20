'use client';

import { useState } from 'react';

const faqs = [
  {
    q: 'What areas does Vegas Born Roofing serve?',
    a: 'We serve Las Vegas, Henderson, Summerlin, North Las Vegas, Boulder City, Pahrump, Mesquite, Laughlin, and all surrounding areas in Southern Nevada.',
  },
  {
    q: 'Is Vegas Born Roofing licensed and insured?',
    a: 'Yes. We are fully licensed in three states — Nevada (#0084099), Utah (#12307984-5501), and Arizona (#350069). We carry full liability insurance and workers\' compensation coverage.',
  },
  {
    q: 'What types of commercial roofing systems do you install?',
    a: 'We install and service TPO, PVC, EPDM, modified bitumen, metal roofing, and roof coating systems. Our team handles everything from new construction to full re-roofs and emergency repairs on commercial buildings.',
  },
  {
    q: 'Do you offer free roof inspections or estimates?',
    a: 'Yes. We provide free estimates for all residential and commercial roofing projects. Contact us at (702) 876-2630 or use our online quote form to schedule yours.',
  },
  {
    q: 'How long has Vegas Born Roofing been in business?',
    a: 'Vegas Born Roofing was founded in 2018. Our owner, Jodd Friesz, has been in the roofing industry since 1995, and our team brings over 100 combined years of roofing experience.',
  },
  {
    q: 'Do you work with property managers and HOAs?',
    a: 'Absolutely. We have a dedicated property management services division that handles scheduled inspections, maintenance programs, and repairs for property managers, building owners, and HOA communities across the Las Vegas Valley.',
  },
  {
    q: 'What should I do if I have an emergency roof leak?',
    a: 'Call us immediately at (702) 876-2630. We offer emergency roof repair services and will get a crew out as quickly as possible to stop the leak and prevent further damage to your property.',
  },
  {
    q: 'Do you have an in-house sheet metal team?',
    a: 'Yes. Our in-house sheet metal division fabricates custom metal components for both commercial and residential roofing projects, giving us full control over quality and turnaround times.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  return (
    <section className="py-20 bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-lg">
            Everything you need to know about our roofing services in Las Vegas
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
                aria-expanded={openIndex === i}
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                <svg
                  className={`w-5 h-5 flex-shrink-0 text-[#b91c1c] transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`faq-answer ${openIndex === i ? 'open' : ''}`}>
                <p className="px-6 pb-5 text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
