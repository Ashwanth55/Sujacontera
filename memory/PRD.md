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
- Resend integration: business notification + customer confirmation (mocked to console when RESEND_API_KEY empty)
- "Step Inside" 3D zoom-through portal (5 rooms) with cinematic scale/blur transitions
- Material hotspots (Jul 2026): clickable +/dots inside each room revealing walnut/marble/brass with material name, origin, and sourcing story in a glass card (StepInside.jsx)

## Credentials
Admin: `admin@sujacontera.com` / `Admin@123`

## Backlog / Next
- Add real Resend API key + verified sender domain (currently mocked)
- Real project photos & Google Maps embed
- Blog / Journal section
- WhatsApp Business API webhook
