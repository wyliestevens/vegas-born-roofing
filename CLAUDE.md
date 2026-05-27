# Vegas Born Roofing Website

## Project Overview
- **Client:** Vegas Born Roofing LLC (Rich Friesz)
- **Type:** Website clone/rebuild — massively improved version of vegasbornroofing.com
- **Stack:** Next.js 16, TypeScript, Tailwind CSS v4
- **Repo:** https://github.com/wyliestevens/vegas-born-roofing
- **Path:** /Users/wylie/Claude/vegas-born-roofing/

## Deployment
- **Vercel URL:** vegas-born-roofing.vercel.app
- **Vercel Project ID:** prj_hWR5I1kn65mM3EACpOW6AZsfo8Oy
- **Auto-deploys:** Connected to GitHub, deploys on push to main

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

## Admin System (/admin) — REBUILT 2026-05-27
Complete admin dashboard based on Lee Clark reference implementation. Custom JWT auth (no NextAuth).

### Auth
- **Cookie:** `vbr_admin` (JWT, 7-day expiry)
- **Auth lib:** `src/lib/auth.ts` (jose JWT, bcryptjs passwords, GitHub-backed credentials)
- **Middleware:** `src/middleware.ts` (protects /admin/* and /api/admin/*, enforces password change)
- **Credentials:** `data/admin/credentials.json` (stored in GitHub via API)

### Admin Users
- `wylie@aipeakbiz.com` — Wylie Stevens — super_admin — no forced password change
- `rich@vegasbornroofing.com` — Rich Friesz — owner — must change password
- `jodd@vegasbornroofing.com` — Jodd Friesz — owner — must change password
- Default password for all: "Password"

### Admin Pages (20 routes)
- **Dashboard** — Content stats, quick actions
- **AI Chat** — Claude Sonnet with tool loop for content management
- **Blog** — List, create, edit posts (draft/published)
- **Team** — Manage team members
- **Testimonials** — List, create with ratings/source/featured
- **Projects** — Roofing project portfolio
- **Services** — Roofing services management
- **Site Settings** — Phone, email, address, licenses, social links
- **Media Library** — Drag-drop upload, grid display, copy URL, delete
- **Users** — Add/remove admin users (owners and super_admin only)
- **History** — Git commit history with restore capability
- **Deployments** — Vercel deployment status, redeploy, rollback
- **Account** — View account info, change password
- **Login** — Email/password login
- **Change Password** — Forced on first login

### Content Storage
All content stored as JSON in `data/content/` directory, managed via GitHub API:
- `blog-posts.json`, `testimonials.json`, `projects.json`
- `team.json`, `services.json`, `site-settings.json`

### API Routes (14 endpoints)
- `/api/admin/login`, `/api/admin/logout`, `/api/admin/account`
- `/api/admin/blog`, `/api/admin/testimonials`, `/api/admin/projects`
- `/api/admin/team`, `/api/admin/services`, `/api/admin/site-settings`
- `/api/admin/images`, `/api/admin/upload`
- `/api/admin/users`, `/api/admin/history`, `/api/admin/deployments`

## SEO & AI Search Optimization
- **Schema markup:** RoofingContractor (LocalBusiness), Service ItemList, FAQPage, JobPosting, Person
- **Meta tags:** Full Open Graph, Twitter cards, canonical URLs
- **Sitemap:** Auto-generated at /sitemap.xml
- **Robots:** /robots.txt blocks /admin/ and /api/
- **AEO:** FAQ section with 8 conversational Q&As for AI search engine citations

## Environment Variables (.env)
- `ANTHROPIC_API_KEY` — Claude API key for AI Chat
- `ADMIN_JWT_SECRET` — JWT signing secret for admin auth
- `GITHUB_TOKEN` — GitHub personal access token for content management
- `GITHUB_OWNER` — GitHub repo owner (wyliestevens)
- `GITHUB_REPO` — GitHub repo name (vegas-born-roofing)
- `VERCEL_TOKEN` — Vercel API token (for deployments page)
- `VERCEL_PROJECT_ID` — Vercel project ID (for deployments page)

## GHL Integration
- Chat widget loaded via next/script in layout
- Hero section AI callback lead form
- Lead form posts to GHL webhook (E.164 phone format)

## What's Next
- Set GITHUB_TOKEN in Vercel env vars for content management to work in production
- Set ANTHROPIC_API_KEY in Vercel for AI Chat
- Connect custom domain if needed
- Add Google Analytics / Tag Manager
- Optionally set VERCEL_TOKEN for deployments page
