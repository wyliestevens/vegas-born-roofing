# Vegas Born Roofing Website

## Project Overview
- **Client:** Vegas Born Roofing LLC (Rich Friesz)
- **Type:** Website clone/rebuild — massively improved version of vegasbornroofing.com
- **Stack:** Next.js 16, TypeScript, Tailwind CSS v4, NextAuth.js v4
- **Repo:** https://github.com/wyliestevens/vegas-born-roofing
- **Deployment:** Vercel (pending)
- **Path:** /Users/wylie/Claude/vegas-born-roofing/

## Business Details
- **Company:** Vegas Born Roofing LLC
- **Phone:** (702) 876-2630
- **Address:** 4205 W Tompkins Ave, Suite 6, Las Vegas, NV 89103
- **Hours:** Mon-Fri 7:30 AM – 4:00 PM
- **Licenses:** NV #0084099, UT #12307984-5501, AZ #350069
- **Founded:** 2018
- **Owner:** Jodd Friesz

## Pages Built
1. **Home** — Hero, trust badges, 4 service cards, commitment section, scrolling reviews carousel, CTA, FAQ section (AEO)
2. **Meet the Team** — 11 team members with bios, owner spotlight, memorial for Joey Williams
3. **Gallery** — 10 project photos in responsive grid with hover effects
4. **Free Quote** — Enhanced form (property type, service type, project details), sidebar with benefits
5. **Contact** — Contact info cards, form, Google Maps embed, service areas, license info
6. **Employment** — Job application form with position selector, experience level, resume upload

## Admin System (/admin)
- **Login:** /admin/login
- **Users:**
  - rich@vegasbornroofing.com (Password — must change on first login)
  - wylie@aipeakbiz.com (Password — must change on first login)
- **Features:**
  - Dashboard with admin tools and quick stats
  - AI Content Builder (Claude Sonnet) for generating page content
  - Forced password change on first login
  - JWT-based session management
- **Auth:** NextAuth.js v4 with credentials provider, bcryptjs password hashing
- **User data:** data/users.json (NOTE: won't persist on Vercel's read-only filesystem — needs migration to Vercel KV for production)

## SEO & AI Search Optimization
- **Schema markup:** RoofingContractor (LocalBusiness), Service ItemList, FAQPage, JobPosting, Person
- **Meta tags:** Full Open Graph, Twitter cards, canonical URLs
- **Sitemap:** Auto-generated at /sitemap.xml
- **Robots:** /robots.txt blocks /admin/ and /api/
- **AEO:** FAQ section with 8 conversational Q&As for AI search engine citations
- **Image alt text:** Descriptive, keyword-rich alt text on all images

## Environment Variables (.env)
- `ANTHROPIC_API_KEY` — Claude API key for AI builder (Sonnet)
- `NEXTAUTH_SECRET` — JWT signing secret
- `NEXTAUTH_URL` — Base URL (http://localhost:3000 for dev)

## All Images (from original site)
- logo.png, hero-bg.png, commercial-roofing.jpg, sheet-metal.jpeg
- residential.jpg, tile-property.jpg, team-jodd.png
- metal-3.jpeg, metal-4.jpeg, metal-5.jpeg, metal-6.jpeg
- roof-coating-1.jpeg, roof-coating-2.jpeg

## What Was Done (2026-05-20)
- Scraped entire vegasbornroofing.com site (all 7 pages)
- Downloaded all 13 images from original site
- Built complete Next.js 16 site with 6 public pages
- Eliminated Reviews page — moved to scrolling reviews carousel on homepage
- Added comprehensive SEO: 5 schema types, FAQ for AEO, sitemap, robots.txt
- Built admin dashboard with NextAuth login, forced password change, AI content builder
- Created two admin users with "Password" as default (must change on first login)
- Created .env file for Anthropic API key
- Pushed to GitHub: wyliestevens/vegas-born-roofing

## What's Next
- Deploy to Vercel
- Set environment variables in Vercel (ANTHROPIC_API_KEY, NEXTAUTH_SECRET, NEXTAUTH_URL)
- Migrate user data from JSON file to Vercel KV for persistence
- Connect custom domain if needed
- Add Google Analytics / Tag Manager
- Consider adding Vercel Blob for image management in admin
