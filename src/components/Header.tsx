'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/meet-the-team', label: 'Meet the Team' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/free-quote', label: 'Free Quote' },
  { href: '/contact', label: 'Contact' },
  { href: '/employment', label: 'Employment' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-[#111827] sticky top-0 z-50 shadow-lg">
      {/* Top bar */}
      <div className="bg-[#b91c1c] text-white text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <span className="font-semibold">Licensed: NV #0084099 | UT #12307984-5501 | AZ #350069</span>
          <a href="tel:7028762630" className="font-bold hover:text-gray-200 transition-colors">
            Call (702) 876-2630
          </a>
        </div>
      </div>

      {/* Main nav */}
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/images/logo.png"
            alt="Vegas Born Roofing LLC - Commercial and Residential Roofing in Las Vegas"
            width={80}
            height={93}
            className="h-16 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#b91c1c] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="tel:7028762630"
            className="ml-3 bg-[#b91c1c] text-white px-5 py-2.5 rounded-md text-sm font-bold hover:bg-[#991b1b] transition-colors"
          >
            (702) 876-2630
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white p-2"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#1f2937] border-t border-gray-700">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-white px-6 py-3 hover:bg-[#b91c1c] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="tel:7028762630"
            className="block text-center bg-[#b91c1c] text-white px-6 py-3 font-bold"
          >
            Call (702) 876-2630
          </a>
        </div>
      )}
    </header>
  );
}
