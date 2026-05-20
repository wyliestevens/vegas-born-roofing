import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Contact Vegas Born Roofing LLC at (702) 876-2630. Located at 4205 W Tompkins Ave, Suite 6, Las Vegas, NV 89103. Open Monday-Friday 7:30 AM - 4:00 PM.',
  openGraph: {
    title: 'Contact Vegas Born Roofing | Las Vegas, NV',
    description: 'Call (702) 876-2630 or visit us at 4205 W Tompkins Ave, Suite 6, Las Vegas, NV 89103.',
  },
};

export default function Contact() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#111827] py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get in touch with our team. We&apos;re here to help with all your roofing needs.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
                <div className="space-y-6">
                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#b91c1c] rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Phone</h3>
                      <a href="tel:7028762630" className="text-[#b91c1c] text-lg font-bold hover:text-[#991b1b] transition-colors">
                        (702) 876-2630
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#b91c1c] rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Address</h3>
                      <p className="text-gray-600">4205 W Tompkins Ave, Suite 6</p>
                      <p className="text-gray-600">Las Vegas, NV 89103</p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#b91c1c] rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Business Hours</h3>
                      <p className="text-gray-600">Monday – Friday: 7:30 AM – 4:00 PM</p>
                      <p className="text-gray-600">Saturday – Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service areas */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3">Service Areas</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Las Vegas, Henderson, Summerlin, North Las Vegas, Boulder City, Pahrump,
                  Mesquite, Laughlin, and surrounding areas throughout Southern Nevada.
                </p>
              </div>

              {/* Licenses */}
              <div className="bg-[#111827] rounded-xl p-6 text-white">
                <h3 className="font-bold mb-3">Licensed &amp; Insured</h3>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>Nevada License #0084099</li>
                  <li>Utah License #12307984-5501</li>
                  <li>Arizona License #350069</li>
                </ul>
              </div>
            </div>

            {/* Contact form */}
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
              <p className="text-gray-600 mb-6">
                We&apos;ll respond within one business day.
              </p>
              <form className="space-y-5">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-semibold text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent outline-none transition"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-semibold text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent outline-none transition"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="contact-phone"
                    name="phone"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent outline-none transition"
                    placeholder="(702) 555-0123"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-sm font-semibold text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent outline-none transition resize-vertical"
                    placeholder="How can we help you?"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#b91c1c] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#991b1b] transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <iframe
            title="Vegas Born Roofing LLC location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3224.1!2d-115.19639!3d36.10406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s4205+W+Tompkins+Ave+Suite+6+Las+Vegas+NV+89103!5e0!3m2!1sen!2sus!4v1"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
          />
        </div>
      </section>
    </>
  );
}
