import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vegasbornroofing.com"),
  title: {
    default: "Vegas Born Roofing | Commercial & Residential Roofing in Las Vegas, NV",
    template: "%s | Vegas Born Roofing",
  },
  description:
    "Licensed roofing contractor serving Las Vegas, Henderson, Summerlin & surrounding areas. Commercial roofing, residential repairs, sheet metal fabrication, and property management services. NV #0084099. Call (702) 876-2630.",
  keywords: [
    "Las Vegas roofing contractor",
    "commercial roofing Las Vegas",
    "residential roofing Las Vegas",
    "roof repair Henderson NV",
    "sheet metal roofing Nevada",
    "TPO roofing Las Vegas",
    "roof coating Las Vegas",
    "property management roofing",
    "emergency roof repair Las Vegas",
    "Summerlin roofing company",
    "North Las Vegas roofer",
    "Boulder City roof repair",
    "licensed roofer Nevada",
    "Vegas Born Roofing",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Vegas Born Roofing LLC",
    title: "Vegas Born Roofing | Commercial & Residential Roofing Experts in Las Vegas",
    description:
      "Licensed roofing contractor serving Las Vegas & surrounding areas since 2018. Commercial, residential, sheet metal, and property management roofing services. Call (702) 876-2630.",
    images: [{ url: "/images/commercial-roofing.jpg", width: 1920, height: 1559, alt: "Vegas Born Roofing commercial project" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vegas Born Roofing | Las Vegas Roofing Experts",
    description: "Licensed commercial & residential roofing in Las Vegas, NV. Call (702) 876-2630.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: { canonical: "https://vegasbornroofing.com" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    name: "Vegas Born Roofing LLC",
    image: "https://vegasbornroofing.com/images/logo.png",
    url: "https://vegasbornroofing.com",
    telephone: "+1-702-876-2630",
    address: {
      "@type": "PostalAddress",
      streetAddress: "4205 W Tompkins Ave, Suite 6",
      addressLocality: "Las Vegas",
      addressRegion: "NV",
      postalCode: "89103",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 36.10406,
      longitude: -115.19639,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:30",
        closes: "16:00",
      },
    ],
    areaServed: [
      { "@type": "City", name: "Las Vegas" },
      { "@type": "City", name: "Henderson" },
      { "@type": "City", name: "Summerlin" },
      { "@type": "City", name: "North Las Vegas" },
      { "@type": "City", name: "Boulder City" },
      { "@type": "City", name: "Pahrump" },
      { "@type": "City", name: "Mesquite" },
      { "@type": "City", name: "Laughlin" },
    ],
    priceRange: "$$",
    foundingDate: "2018",
    numberOfEmployees: { "@type": "QuantitativeValue", minValue: 10, maxValue: 50 },
    slogan: "Commercial & Residential Roofing Experts Serving Las Vegas & Nearby Areas",
    hasCredential: [
      { "@type": "EducationalOccupationalCredential", credentialCategory: "license", name: "Nevada Contractor License #0084099" },
      { "@type": "EducationalOccupationalCredential", credentialCategory: "license", name: "Utah License #12307984-5501" },
      { "@type": "EducationalOccupationalCredential", credentialCategory: "license", name: "Arizona License #350069" },
    ],
    sameAs: [],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "48",
      bestRating: "5",
      worstRating: "1",
    },
  };

  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <script
          src="https://widgets.leadconnectorhq.com/loader.js"
          data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
          data-widget-id="6a0dc733e1a8663249bb724c"
          async
        />
      </body>
    </html>
  );
}
