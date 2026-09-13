# Suja Contera — Construction & Interiors

## Problem
Luxury landing page for an Indian interior design studio (apartments/villas/homes) with a Book Free Consultation form, backend to receive leads, protected /admin dashboard, and Resend email notifications. Design must feel like a ₹5Cr luxury home — Playfair Display headings, walnut/gold palette, cinematic imagery, subtle animations. No heavy 3D per user preference.

## Architecture
- Frontend: React (CRA + craco) + Tailwind + Framer Motion + Shadcn UI + Sonner
- Backend: FastAPI + MongoDB (motor) + JWT auth + Resend email (graceful fallback if key missing)
- Routes: `/` (landing), `/admin/login`, `/admin`

## Implemented (Dec 2025)
- Cinematic hero (parallax, slow-zoom villa image, gold particles, trust badges)
- Why Choose Us (6 cards) · Services grid (8 cards) · Projects masonry (filters)
- Design Process timeline · Animated Stats · Interior Styles · Testimonials · FAQ
- Consultation booking form → POST /api/leads (saves to Mongo + fires Resend emails)
- Admin login (JWT, seeded from ADMIN_EMAIL/ADMIN_PASSWORD env)
- Admin dashboard: stats cards, search, status filter, details drawer, status update, notes, CSV export, delete, click-to-call, WhatsApp deep-link
- Resend integration: business notification + customer confirmation — now LIVE via Emergent-managed email proxy (Jul 2026). No API key needed; sends from platform-verified domain. Owner inbox: Sujacontera@gmail.com (OWNER_EMAIL), from_name "Suja Contera", customer email set as Reply-To on the lead notification. Guardrail gate (_assert_safe_email) enforced on every send.
- "Step Inside" 3D zoom-through portal (5 rooms) with cinematic scale/blur transitions
- Material hotspots (Jul 2026): clickable +/dots inside each room revealing walnut/marble/brass with material name, origin, and sourcing story in a glass card (StepInside.jsx)
- "Enquire about this finish" (Jul 2026): material card button closes portal, scrolls to booking form, and pre-fills the message with the chosen material (CustomEvent "prefill-enquiry" → BookingSection listener)
- Cinematic exterior video (Jul 2026): "Step Inside" entrance card is now a looping muted twilight-home video (self-hosted WebM + MP4 fallback in /public, Unsplash still as poster) — StepInside.jsx
- Homepage restructure (Feb 2026): Removed the "Before/After" drag-reveal section; replaced it with a new "What We Build" section (`PropertyTypes` component) showing only 3 property-type cards — Apartment Interiors, Villa Interiors, Independent Homes — each with a description and "Enquire" CTA linking to the booking form. Services grid ("Our Craft") trimmed from 8 cards to the same 3 property types (Apartment/Villa/Independent Homes); copy updated from "Eight disciplines" to "Three home types" and grid changed to a 3-column layout.
- Cinematic hero journey (Jun 2026): Rebuilt `Hero.jsx` into an auto-playing, continuously looping visual story — a house transforms into a luxury villa, then the camera glides room-by-room (Living Room → Kitchen → Master Suite). Each scene crossfades (1.3s) with a slow Ken Burns zoom (~2.8s per scene, medium pace). Stock imagery (Unsplash), preloaded for a seamless loop. A "now touring" indicator (eyebrow + serif room label + vertical gold progress rail on desktop, horizontal dots on mobile) tracks the journey. Headline/CTAs/trust bar remain fixed overlay. Respects prefers-reduced-motion (static first frame). Scene layer uses overflow:hidden so the zoom never creates horizontal scroll. Verified desktop (1920) + mobile (390): captions cycle, no h-scroll.
- Official brand identity applied site-wide (Feb 2026): Sourced brand guide PDF (logo lockup, monogram, color palette). Extracted 4 logo assets to `/app/frontend/public/images/` — `suja-mark-dark.png` / `suja-mark-light.png` (monogram only, for navbar/footer) and `suja-logo-dark.png` / `suja-logo-light.png` (full lockup with wordmark, unused but kept for future use). `Logo` component in `LandingPage.jsx` now renders the real monogram image (dark on light surfaces, light on dark surfaces) instead of a placeholder "S" circle. Palette updated to the brand-guide hex values across `tailwind.config.js`, `index.css`, and `hero.css`: primary `#2C211A`→`#311b14`, secondary `#5C4033`→`#45312b`, bg/paper `#FAF8F5`/`#faf8f5`→`#e6e6df`, text→`#311b14`. Gold accent (`#C8A96A`) kept unchanged (not specified in brand guide). Material swatch colors in `StepInside.jsx` (walnut/marble/brass) intentionally left as-is — they represent real material colors, not brand palette. Fonts (Amandine/Futura PT) are commercial/non-web-licensed; kept existing Playfair Display/Inter which already match the brand's calligraphic-serif + clean-sans aesthetic.
- Marquee copy swap (Feb 2026): The scrolling ticker directly below the hero (`Marquee` component) changed from material buzzwords ("Walnut", "Italian Marble", "Brass Detail", etc.) to stat labels: "Homes Designed", "Years of Craft", "Client Satisfaction", "Premium Finish".

## Credentials
Admin: `admin@sujacontera.com` / `Admin@123`

## Backlog / Next
- Real project photos & Google Maps embed
- Blog / Journal section
- WhatsApp Business API webhook
