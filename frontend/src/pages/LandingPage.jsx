import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Menu, X, ArrowUpRight, Phone, MessageCircle, ArrowRight, Star,
  ShieldCheck, Sparkles, IndianRupee, Clock, Users, Palette,
  ChevronDown, MapPin, Mail, Instagram, Facebook, Youtube, ArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { api } from "@/lib/apiClient";
import { useLenis, MaskedLines } from "@/components/site/luxury";
import StepInside from "@/components/site/StepInside";

/* ---------------------- Content ---------------------- */
const CONTACT = {
  phone: "+91 98XXX XXXXX",
  whatsapp: "919000000000",
  email: "hello@sujacontera.com",
  city: "Hyderabad, India",
};

const HERO_IMG = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80";

const SERVICES = [
  { title: "Apartment Interiors", tag: "Turnkey", img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=80" },
  { title: "Villa Interiors", tag: "Signature", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80" },
  { title: "Independent Homes", tag: "Bespoke", img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=80" },
];

const PROPERTY_TYPES = [
  { title: "Apartment Interiors", tag: "Turnkey", desc: "Full-home interiors for flats and condos, engineered for compact luxury and zero wasted space.", img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=80" },
  { title: "Villa Interiors", tag: "Signature", desc: "Statement interiors for standalone villas — layered materials, generous scale, quiet grandeur.", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80" },
  { title: "Independent Homes", tag: "Bespoke", desc: "Ground-up, fully bespoke interiors for independent houses — designed around how your family lives.", img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=80" },
];

const PROJECTS = [
  { title: "Prestige Sunrise Villa", city: "Hyderabad", cat: "Villa", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80", h: "tall" },
  { title: "Aparna Sarovar Grande", city: "Kompally", cat: "Apartment", img: "https://images.unsplash.com/photo-1616137466211-f939a420be84?auto=format&fit=crop&w=1400&q=80", h: "short" },
  { title: "The Marble House", city: "Jubilee Hills", cat: "Independent", img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80", h: "tall" },
  { title: "Walnut Kitchen Suite", city: "Gachibowli", cat: "Kitchen", img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80", h: "short" },
  { title: "Ivory Master Bedroom", city: "Banjara Hills", cat: "Apartment", img: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1400&q=80", h: "short" },
  { title: "The Studio Loft", city: "Hitec City", cat: "Apartment", img: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1400&q=80", h: "tall" },
];

const STYLES = [
  { name: "Minimal", img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80" },
  { name: "Modern", img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80" },
  { name: "Luxury", img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80" },
  { name: "Contemporary", img: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=900&q=80" },
  { name: "Scandinavian", img: "https://images.unsplash.com/photo-1724582586413-6b69e1c94a17?auto=format&fit=crop&w=900&q=80" },
  { name: "Industrial", img: "https://images.unsplash.com/photo-1628512743826-2c28a508ad5e?auto=format&fit=crop&w=900&q=80" },
  { name: "Traditional", img: "https://images.unsplash.com/photo-1776090147407-f2308b4092cb?auto=format&fit=crop&w=900&q=80" },
];

const TESTIMONIALS = [
  { name: "Aditi & Rohan Verma", role: "Villa Owners, Jubilee Hills", quote: "Suja Contera turned a blueprint into a home we never want to leave. Every detail — the walnut grain, the marble edges, the way light falls at dusk — feels considered.", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80" },
  { name: "Karthik Reddy", role: "3BHK, Gachibowli", quote: "Delivered two weeks ahead of schedule, on budget, and the finish quality is genuinely on par with 5-star hotels. Their design team is unusually patient.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" },
  { name: "Meera Iyer", role: "Independent Home, Banjara", quote: "The modular kitchen alone changed how our family lives. Warm, quiet, and the storage — extraordinary. Worth every rupee.", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80" },
];

const PROCESS = [
  { n: "01", t: "Consultation", d: "Understand your life, your rituals, your aesthetic — over a warm coffee." },
  { n: "02", t: "Site Visit", d: "Precise measurements, structural assessment, natural-light mapping." },
  { n: "03", t: "3D Design", d: "Photorealistic walkthroughs. Iterate until every corner feels right." },
  { n: "04", t: "Material Selection", d: "Curated walnut, marble, brass and fabrics — sourced with intent." },
  { n: "05", t: "Execution", d: "In-house craftsmen. Weekly milestones. Transparent daily updates." },
  { n: "06", t: "Handover", d: "White-glove finish, styled and photographed. Ready to live in." },
];

const FAQS = [
  { q: "How long does a full-home interior project take?", a: "A 3BHK apartment typically completes in 45–60 working days after design sign-off. Villas range from 90 to 120 days depending on scope and material lead times." },
  { q: "Do you offer transparent pricing?", a: "Yes. Every quotation is itemised — material, labour, finishes and GST are broken out separately. No hidden charges, ever." },
  { q: "Which cities do you serve?", a: "Currently Hyderabad, Bengaluru and Vijayawada with hand-picked project teams. Others considered case-by-case." },
  { q: "Do you handle just the kitchen or wardrobe?", a: "Absolutely — modular kitchens, wardrobes, TV units, false ceilings and renovation-only mandates are welcome." },
  { q: "What warranty do you provide?", a: "10 years on modular carcass, 5 years on hardware, and 1 year comprehensive service on all civil and finishing work." },
];

/* ---------------------- UI helpers ---------------------- */
function useCountUp(target, inView, duration = 1600) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf; const start = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);
  return n;
}

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-80px" }, transition: { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] } };

/* ---------------------- Sections ---------------------- */
function Logo({ light = false }) {
  return (
    <div className="flex items-center gap-3" data-testid="brand-logo">
      <div className={`w-9 h-9 rounded-full grid place-items-center ${light ? "bg-brand-accent/20 border border-brand-accent/50" : "bg-brand-primary/5 border border-brand-primary/20"}`}>
        <span className={`font-display text-lg ${light ? "text-brand-accent" : "text-brand-primary"}`}>S</span>
      </div>
      <div className="leading-tight">
        <div className={`font-display text-lg tracking-wide ${light ? "text-brand-bg" : "text-brand-primary"}`}>Suja Contera</div>
        <div className={`text-[10px] tracking-[0.3em] uppercase ${light ? "text-brand-accent" : "text-brand-secondary"}`}>Construction · Interiors</div>
      </div>
    </div>
  );
}

function Navbar({ onBook }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on(); window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);
  const links = [["Services", "services"], ["Projects", "projects"], ["Process", "process"], ["Stories", "testimonials"], ["Contact", "book"]];
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "backdrop-blur-xl bg-[#FAF8F5]/85 border-b border-brand-primary/10 py-3" : "py-6"}`} data-testid="site-navbar">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3" data-testid="nav-home"><Logo light={!scrolled} /></a>
        <nav className="hidden md:flex items-center gap-9">
          {links.map(([l, id]) => (
            <a key={id} href={`#${id}`} data-testid={`nav-${id}`} className={`text-sm tracking-wide transition-colors duration-300 ${scrolled ? "text-brand-primary hover:text-brand-accent" : "text-brand-bg/85 hover:text-brand-accent"}`}>{l}</a>
          ))}
        </nav>
        <div className="hidden md:block">
          <Button onClick={onBook} data-testid="nav-book-btn" className="rounded-full bg-brand-primary text-brand-bg hover:bg-brand-secondary px-6 h-11">
            Book Consultation <ArrowUpRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} data-testid="nav-mobile-toggle" aria-label="Menu">
          {open ? <X className={scrolled ? "text-brand-primary" : "text-brand-bg"} /> : <Menu className={scrolled ? "text-brand-primary" : "text-brand-bg"} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="md:hidden bg-brand-bg border-t border-brand-primary/10">
            <div className="px-6 py-4 flex flex-col gap-4">
              {links.map(([l, id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="text-brand-primary py-2 text-sm">{l}</a>)}
              <Button onClick={() => { setOpen(false); onBook(); }} className="rounded-full bg-brand-primary text-brand-bg">Book Consultation</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero({ onBook }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  return (
    <section id="top" ref={ref} className="relative min-h-screen overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <img src={HERO_IMG} alt="Luxury villa interior" className="w-full h-full object-cover animate-slow-zoom" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/70 via-brand-primary/50 to-brand-primary/85" />
      </motion.div>

      {/* Floating gold particles */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="absolute rounded-full bg-brand-accent/30 animate-float-up"
            style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 90}%`, width: `${4 + (i % 3) * 3}px`, height: `${4 + (i % 3) * 3}px`, animationDelay: `${i * 0.6}s`, animationDuration: `${5 + (i % 4)}s` }} />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-40 pb-24 min-h-screen flex flex-col justify-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="max-w-3xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-px bg-brand-accent" />
            <span className="eyebrow text-brand-accent">EST · Est. 2014</span>
          </div>
          <h1 className="font-display text-brand-bg font-light text-5xl sm:text-6xl md:text-7xl lg:text-[92px] leading-[1.02] tracking-tight text-balance" data-testid="hero-headline">
            <MaskedLines delay={0.15}>
{`Designing spaces
that feel
like home.`}
            </MaskedLines>
          </h1>
          <p className="mt-8 max-w-xl text-brand-bg/80 text-lg md:text-xl leading-relaxed">
            Premium turnkey interiors for apartments, villas &amp; independent homes — considered, quiet, and unmistakably yours.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Button onClick={onBook} data-testid="hero-book-btn" className="rounded-full bg-brand-accent text-brand-primary hover:bg-brand-accent/90 h-14 px-8 text-base font-medium group">
              Book Free Consultation <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            <a href="#projects" data-testid="hero-portfolio-btn" className="inline-flex items-center gap-2 text-brand-bg/90 hover:text-brand-accent border-b border-brand-bg/40 hover:border-brand-accent pb-1 pt-1 text-sm tracking-wide transition-colors">
              View Portfolio <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-4 text-brand-bg/75">
            <div className="flex items-center gap-2"><div className="flex gap-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-brand-accent text-brand-accent" />)}</div><span className="text-sm">4.9 · 240+ Google reviews</span></div>
            <div className="h-4 w-px bg-brand-bg/25" />
            <div className="text-sm tracking-wide">500+ Homes Designed</div>
            <div className="h-4 w-px bg-brand-bg/25" />
            <div className="text-sm tracking-wide">10-Year Warranty</div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-brand-bg/60">
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-brand-accent to-transparent" />
      </div>
    </section>
  );
}

function WhyChoose() {
  const items = [
    { i: Sparkles, t: "End-to-End Craft", d: "From first sketch to final styling — one accountable team, one signature standard." },
    { i: Palette, t: "Bespoke Design", d: "No template rooms. Every home is drawn from scratch around the people inside it." },
    { i: ShieldCheck, t: "Premium Materials", d: "Solid walnut, Italian marble, brass hardware — sourced without shortcut." },
    { i: IndianRupee, t: "Transparent Pricing", d: "Itemised quotations. No mid-project surprises. What we quote is what you pay." },
    { i: Clock, t: "On-Time Handover", d: "45-day committed timelines with weekly milestone reviews and daily updates." },
    { i: Users, t: "Senior Designers", d: "Every project is led by an architect with a minimum of eight years on the floor." },
  ];
  return (
    <section id="why" className="relative marble-surface py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div {...fadeUp} className="max-w-2xl mb-16 md:mb-24">
          <div className="eyebrow mb-5">Why Suja Contera</div>
          <h2 className="font-display font-light text-4xl md:text-5xl text-brand-primary leading-tight tracking-tight">
            The quiet difference between a house<br /><em className="italic text-brand-secondary">and a home worth returning to.</em>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {items.map(({ i: Icon, t, d }, idx) => (
            <motion.div key={t} {...fadeUp} transition={{ ...fadeUp.transition, delay: idx * 0.08 }}
              className="group bg-brand-card rounded-[24px] p-8 md:p-10 border border-brand-primary/5 shadow-[0_4px_24px_rgba(44,33,26,0.04)] hover:shadow-[0_20px_50px_rgba(44,33,26,0.10)] transition-shadow duration-500"
              data-testid={`why-card-${idx}`}>
              <div className="w-12 h-12 rounded-full bg-brand-accent/10 grid place-items-center mb-6 group-hover:bg-brand-accent/20 transition-colors">
                <Icon className="w-5 h-5 text-brand-accent" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl text-brand-primary mb-3">{t}</h3>
              <p className="text-brand-primary/70 leading-relaxed">{d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="py-24 md:py-32 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div {...fadeUp} className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="eyebrow mb-5">Our Craft</div>
            <h2 className="font-display font-light text-4xl md:text-5xl text-brand-primary leading-tight tracking-tight">
              Turnkey interiors, <em className="italic text-brand-secondary">rendered in full.</em>
            </h2>
          </div>
          <p className="text-brand-primary/60 max-w-sm">Three home types. One studio. One accountable senior designer per project.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {SERVICES.map((s, idx) => (
            <motion.a key={s.title} href="#book" {...fadeUp} transition={{ ...fadeUp.transition, delay: (idx % 3) * 0.06 }}
              className="group relative overflow-hidden rounded-[20px] aspect-[3/4] bg-brand-primary block"
              data-testid={`service-card-${idx}`}>
              <img src={s.img} alt={s.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-primary via-brand-primary/40 to-transparent" />
              <div className="absolute inset-0 border border-transparent group-hover:border-brand-accent/60 transition-colors duration-500 rounded-[20px]" />
              <div className="absolute top-5 left-5">
                <span className="eyebrow text-brand-accent">{s.tag}</span>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-brand-bg">
                <h3 className="font-display text-2xl leading-tight">{s.title}</h3>
                <ArrowUpRight className="w-5 h-5 text-brand-accent transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const cats = ["All", "Villa", "Apartment", "Independent", "Kitchen"];
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? PROJECTS : PROJECTS.filter(p => p.cat === active);
  return (
    <section id="projects" className="py-24 md:py-32 walnut-surface relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div {...fadeUp} className="mb-12 md:mb-16">
          <div className="eyebrow mb-5">Featured Work</div>
          <h2 className="font-display font-light text-4xl md:text-5xl text-brand-bg leading-tight tracking-tight max-w-3xl">
            A portfolio built on <em className="italic text-brand-accent">restraint.</em>
          </h2>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-10">
          {cats.map(c => (
            <button key={c} onClick={() => setActive(c)} data-testid={`filter-${c.toLowerCase()}`}
              className={`px-5 py-2 rounded-full text-sm tracking-wide transition-all duration-300 ${active === c ? "bg-brand-accent text-brand-primary" : "border border-brand-bg/25 text-brand-bg/80 hover:border-brand-accent hover:text-brand-accent"}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filtered.map((p, idx) => (
            <motion.div key={p.title} {...fadeUp} transition={{ ...fadeUp.transition, delay: (idx % 3) * 0.06 }}
              className={`group relative overflow-hidden rounded-[18px] break-inside-avoid ${p.h === "tall" ? "aspect-[3/4]" : "aspect-[4/3]"}`}
              data-testid={`project-card-${idx}`}>
              <img src={p.img} alt={p.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/95 via-brand-primary/20 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-x-6 bottom-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <div className="eyebrow text-brand-accent mb-2">{p.cat}</div>
                <div className="font-display text-brand-bg text-xl md:text-2xl">{p.title}</div>
                <div className="text-brand-bg/70 text-sm mt-1">{p.city}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section id="process" className="py-24 md:py-32 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div {...fadeUp} className="mb-16 max-w-2xl">
          <div className="eyebrow mb-5">The Studio Process</div>
          <h2 className="font-display font-light text-4xl md:text-5xl text-brand-primary leading-tight">
            Six weeks. Six steps. <em className="italic text-brand-secondary">Zero surprises.</em>
          </h2>
        </motion.div>
        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-accent/0 via-brand-accent/40 to-brand-accent/0" />
          <div className="space-y-10 md:space-y-16">
            {PROCESS.map((s, idx) => (
              <motion.div key={s.n} {...fadeUp} className={`md:grid md:grid-cols-2 md:gap-16 items-center ${idx % 2 ? "md:direction-rtl" : ""}`}>
                <div className={idx % 2 ? "md:order-2 md:text-left md:pl-16" : "md:text-right md:pr-16"}>
                  <div className="font-display text-6xl md:text-7xl text-brand-accent/80 font-light mb-3">{s.n}</div>
                  <h3 className="font-display text-2xl md:text-3xl text-brand-primary mb-2">{s.t}</h3>
                  <p className="text-brand-primary/65 max-w-md md:inline-block">{s.d}</p>
                </div>
                <div className={idx % 2 ? "md:order-1" : ""}>
                  <div className="hidden md:block h-px w-full bg-gradient-to-r from-transparent via-brand-accent/30 to-transparent" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatItem({ target, suf, label, inView, i }) {
  const n = useCountUp(target, inView);
  return (
    <div className="text-center md:text-left" data-testid={`stat-${i}`}>
      <div className="font-display text-5xl md:text-6xl lg:text-7xl text-brand-accent font-light leading-none">
        {n}{suf}
      </div>
      <div className="hairline my-4 md:my-5 max-w-[100px] mx-auto md:mx-0" />
      <div className="text-brand-bg/75 text-sm tracking-wider uppercase">{label}</div>
    </div>
  );
}

function Stats() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const items = [
    { n: 500, suf: "+", l: "Homes Designed" },
    { n: 10, suf: "+", l: "Years of Craft" },
    { n: 98, suf: "%", l: "Client Satisfaction" },
    { n: 100, suf: "%", l: "Premium Finish" },
  ];
  return (
    <section ref={ref} className="walnut-surface py-24 md:py-28 relative overflow-hidden">
      <div className="grain absolute inset-0" />
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-14">
          {items.map((s, i) => (
            <StatItem key={s.l} target={s.n} suf={s.suf} label={s.l} inView={inView} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Styles() {
  return (
    <section className="py-24 md:py-32 marble-surface">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div {...fadeUp} className="mb-16 max-w-2xl">
          <div className="eyebrow mb-5">Aesthetics</div>
          <h2 className="font-display font-light text-4xl md:text-5xl text-brand-primary leading-tight">
            Seven interior languages, <em className="italic text-brand-secondary">one studio to speak them.</em>
          </h2>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {STYLES.map((s, i) => (
            <motion.div key={s.name} {...fadeUp} transition={{ ...fadeUp.transition, delay: (i % 4) * 0.05 }}
              className="group relative overflow-hidden rounded-[18px] aspect-[4/5] tilt-card cursor-pointer"
              data-testid={`style-${i}`}>
              <img src={s.img} alt={s.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/90 via-brand-primary/20 to-transparent" />
              <div className="absolute bottom-5 left-5">
                <div className="font-display text-xl text-brand-bg">{s.name}</div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-brand-accent mt-1">Explore</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="testimonials" className="py-24 md:py-32 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div {...fadeUp} className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="eyebrow mb-5">Stories from our homes</div>
            <h2 className="font-display font-light text-4xl md:text-5xl text-brand-primary leading-tight">
              Told by the people who <em className="italic text-brand-secondary">live inside them.</em>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 fill-brand-accent text-brand-accent" />)}</div>
            <span className="text-brand-primary/70 text-sm">4.9 on Google · 240+ reviews</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={t.name} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.1 }}
              className="bg-brand-card rounded-[24px] p-8 md:p-10 border border-brand-primary/5 shadow-[0_6px_28px_rgba(44,33,26,0.05)]"
              data-testid={`testimonial-${i}`}>
              <div className="flex gap-1 mb-6">{Array.from({ length: 5 }).map((_, k) => <Star key={k} className="w-4 h-4 fill-brand-accent text-brand-accent" />)}</div>
              <p className="font-serifAlt text-xl md:text-[22px] text-brand-primary/90 leading-relaxed italic mb-8">"{t.quote}"</p>
              <div className="flex items-center gap-4 pt-6 border-t border-brand-primary/10">
                <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="font-medium text-brand-primary">{t.name}</div>
                  <div className="text-xs text-brand-secondary tracking-wide">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="py-24 md:py-32 bg-brand-bg">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div {...fadeUp} className="mb-14 text-center">
          <div className="eyebrow mb-5">Frequently Asked</div>
          <h2 className="font-display font-light text-4xl md:text-5xl text-brand-primary leading-tight">
            Answered, <em className="italic text-brand-secondary">plainly.</em>
          </h2>
        </motion.div>
        <Accordion type="single" collapsible className="w-full" data-testid="faq-accordion">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`i-${i}`} className="border-b border-brand-primary/10 py-2">
              <AccordionTrigger className="text-left font-display text-lg md:text-xl text-brand-primary hover:no-underline hover:text-brand-accent transition-colors" data-testid={`faq-q-${i}`}>
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-brand-primary/70 leading-relaxed text-base pb-6">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function BookingSection({ formRef }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", property_type: "", location: "", budget: "", message: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handler = (e) => {
      const mat = e.detail?.material;
      if (!mat) return;
      setForm(f => ({ ...f, message: `I'd love to explore using ${mat} in my home. Please share more on availability and finishes.` }));
      setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth" }), 120);
    };
    window.addEventListener("prefill-enquiry", handler);
    return () => window.removeEventListener("prefill-enquiry", handler);
  }, [formRef]);

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Please enter your full name.";
    if (!/^[+\d\s-]{7,20}$/.test(form.phone)) e.phone = "Enter a valid phone number.";
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.property_type) e.property_type = "Select a property type.";
    if (form.location.trim().length < 2) e.location = "Enter your city.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post("/leads", {
        ...form,
        email: form.email || undefined,
        budget: form.budget || undefined,
        message: form.message || undefined,
      });
      toast.success("Thank you. Our senior designer will call you within 24 hours.");
      setForm({ name: "", phone: "", email: "", property_type: "", location: "", budget: "", message: "" });
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg = Array.isArray(detail) ? detail.map(d => d.msg).join(", ") : (typeof detail === "string" ? detail : "Something went wrong. Please try again.");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="book" ref={formRef} className="py-24 md:py-32 walnut-surface relative overflow-hidden">
      <div className="grain absolute inset-0" />
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20 items-start">
          <div className="lg:col-span-2">
            <div className="eyebrow mb-5">Consultation</div>
            <h2 className="font-display font-light text-4xl md:text-5xl text-brand-bg leading-tight mb-8">
              Let's design your <em className="italic text-brand-accent">dream home.</em>
            </h2>
            <p className="text-brand-bg/70 leading-relaxed mb-10 max-w-md">
              Share a few details and a senior designer will personally reach out within 24 hours with an initial concept and a transparent budget range — complimentary, no obligations.
            </p>
            <div className="space-y-5 text-brand-bg/85">
              <a href={`tel:${CONTACT.phone.replace(/\s/g,"")}`} className="flex items-center gap-4 group" data-testid="contact-call">
                <div className="w-11 h-11 rounded-full border border-brand-accent/40 grid place-items-center group-hover:bg-brand-accent group-hover:text-brand-primary transition-colors"><Phone className="w-4 h-4" /></div>
                <div><div className="text-xs uppercase tracking-widest text-brand-accent">Call</div><div className="font-medium">{CONTACT.phone}</div></div>
              </a>
              <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 group" data-testid="contact-whatsapp">
                <div className="w-11 h-11 rounded-full border border-brand-accent/40 grid place-items-center group-hover:bg-brand-accent group-hover:text-brand-primary transition-colors"><MessageCircle className="w-4 h-4" /></div>
                <div><div className="text-xs uppercase tracking-widest text-brand-accent">WhatsApp</div><div className="font-medium">{CONTACT.phone}</div></div>
              </a>
              <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-4 group" data-testid="contact-email">
                <div className="w-11 h-11 rounded-full border border-brand-accent/40 grid place-items-center group-hover:bg-brand-accent group-hover:text-brand-primary transition-colors"><Mail className="w-4 h-4" /></div>
                <div><div className="text-xs uppercase tracking-widest text-brand-accent">Email</div><div className="font-medium">{CONTACT.email}</div></div>
              </a>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full border border-brand-accent/40 grid place-items-center"><MapPin className="w-4 h-4" /></div>
                <div><div className="text-xs uppercase tracking-widest text-brand-accent">Studio</div><div className="font-medium">{CONTACT.city}</div></div>
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="lg:col-span-3 bg-brand-card rounded-[24px] p-8 md:p-12 border border-brand-accent/10 shadow-[0_20px_60px_rgba(0,0,0,0.25)]" data-testid="booking-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FieldInput label="Full Name*" testid="input-name" value={form.name} onChange={v => setForm({...form, name: v})} error={errors.name} />
              <FieldInput label="Phone Number*" testid="input-phone" value={form.phone} onChange={v => setForm({...form, phone: v})} error={errors.phone} type="tel" />
              <FieldInput label="Email (optional)" testid="input-email" value={form.email} onChange={v => setForm({...form, email: v})} error={errors.email} type="email" />
              <div>
                <Label className="text-xs uppercase tracking-widest text-brand-secondary">Property Type*</Label>
                <Select value={form.property_type} onValueChange={v => setForm({...form, property_type: v})}>
                  <SelectTrigger className="mt-2 rounded-none border-0 border-b border-brand-primary/20 bg-transparent focus:border-brand-accent focus:ring-0 px-0 h-11" data-testid="input-property-type">
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Apartment","Villa","Independent House","Commercial"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.property_type && <p className="mt-1 text-xs text-red-600">{errors.property_type}</p>}
              </div>
              <FieldInput label="Location / City*" testid="input-location" value={form.location} onChange={v => setForm({...form, location: v})} error={errors.location} />
              <FieldInput label="Budget (optional)" testid="input-budget" value={form.budget} onChange={v => setForm({...form, budget: v})} placeholder="e.g. ₹15 – 25 Lakhs" />
              <div className="md:col-span-2">
                <Label className="text-xs uppercase tracking-widest text-brand-secondary">Project Details</Label>
                <Textarea rows={4} value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Tell us about your home, timeline, and what feeling you want to walk into."
                  className="mt-2 rounded-none border-0 border-b border-brand-primary/20 bg-transparent focus-visible:ring-0 focus:border-brand-accent px-0 resize-none" data-testid="input-message" />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="mt-10 rounded-full bg-brand-primary text-brand-bg hover:bg-brand-secondary h-13 px-8 py-4 w-full md:w-auto" data-testid="booking-submit">
              {loading ? "Sending…" : "Request Consultation"} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <p className="mt-4 text-xs text-brand-primary/50">By submitting, you agree to be contacted by our design team. We never share your details.</p>
          </form>
        </div>
      </div>
    </section>
  );
}

function FieldInput({ label, value, onChange, error, testid, type = "text", placeholder }) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-widest text-brand-secondary">{label}</Label>
      <Input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || "—"}
        className="mt-2 rounded-none border-0 border-b border-brand-primary/20 bg-transparent focus-visible:ring-0 focus:border-brand-accent px-0 h-11 text-brand-primary"
        data-testid={testid} />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-brand-primary text-brand-bg pt-20 pb-8 relative overflow-hidden">
      <div className="grain absolute inset-0" />
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div>
            <Logo light />
            <p className="mt-6 text-brand-bg/60 text-sm leading-relaxed">Premium interior design studio crafting apartments, villas & independent homes across India since 2014.</p>
          </div>
          <FooterCol title="Studio" items={[["Services","#services"],["Projects","#projects"],["Process","#process"],["Stories","#testimonials"]]} />
          <FooterCol title="Services" items={[["Apartments","#services"],["Villas","#services"],["Modular Kitchens","#services"],["Renovation","#services"]]} />
          <div>
            <div className="eyebrow mb-5">Reach Us</div>
            <ul className="space-y-3 text-brand-bg/70 text-sm">
              <li>{CONTACT.city}</li>
              <li><a href={`tel:${CONTACT.phone}`}>{CONTACT.phone}</a></li>
              <li><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
            </ul>
            <div className="flex gap-3 mt-6">
              {[Instagram, Facebook, Youtube].map((I, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full border border-brand-bg/20 grid place-items-center hover:bg-brand-accent hover:text-brand-primary hover:border-brand-accent transition-colors"><I className="w-4 h-4" /></a>
              ))}
            </div>
          </div>
        </div>
        <div className="hairline mb-6" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between text-brand-bg/50 text-xs gap-3">
          <div>© {new Date().getFullYear()} Suja Contera. Construction & Interiors. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="/admin/login" data-testid="footer-admin-link" className="hover:text-brand-accent">Studio Login</a>
            <a href="#" className="hover:text-brand-accent">Privacy</a>
            <a href="#" className="hover:text-brand-accent">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <div className="eyebrow mb-5">{title}</div>
      <ul className="space-y-3 text-brand-bg/70 text-sm">
        {items.map(([l, h]) => <li key={l}><a href={h} className="hover:text-brand-accent transition-colors">{l}</a></li>)}
      </ul>
    </div>
  );
}

function Marquee() {
  const words = ["Walnut", "Italian Marble", "Brass Detail", "Turnkey Craft", "Hand-drawn", "Bespoke", "Since 2014", "Warm Modernism"];
  const row = [...words, ...words, ...words];
  return (
    <section className="bg-brand-primary py-10 md:py-14 border-y border-brand-accent/15 overflow-hidden relative">
      <div className="flex whitespace-nowrap gap-14 md:gap-20 animate-[marquee_38s_linear_infinite]">
        {row.map((w, i) => (
          <span key={i} className="font-display italic text-brand-bg/85 text-3xl md:text-5xl lg:text-6xl font-light tracking-tight inline-flex items-center gap-14 md:gap-20">
            {w}
            <span className="w-2 h-2 rounded-full bg-brand-accent inline-block" />
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-33.333%) } }`}</style>
    </section>
  );
}

function Manifesto() {
  const chapters = [
    { n: "Ch. 01", t: "We design for how people actually live.", d: "Not for magazines. Not for algorithms. For the coffee at 6am, the friends over on Fridays, and the quiet Sundays no one photographs." },
    { n: "Ch. 02", t: "Every material earns its place.", d: "Solid walnut, honed marble, patinated brass — each chosen for how it ages, not just how it looks the day we hand over the keys." },
    { n: "Ch. 03", t: "Restraint is a signature.", d: "The best rooms remove three things for every one they add. We edit ruthlessly so your home can breathe." },
  ];
  return (
    <section className="py-28 md:py-40 marble-surface">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div {...fadeUp} className="mb-16 md:mb-24 max-w-xl">
          <div className="eyebrow mb-5">The Studio Manifesto</div>
          <h2 className="font-display font-light text-4xl md:text-5xl text-brand-primary leading-tight">Three beliefs we <em className="italic text-brand-secondary">refuse to compromise on.</em></h2>
        </motion.div>
        <div className="space-y-16 md:space-y-24">
          {chapters.map((c, i) => (
            <motion.div key={c.n} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.1 }} className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-baseline border-t border-brand-primary/10 pt-10 md:pt-14">
              <div className="md:col-span-3">
                <div className="font-display text-xl text-brand-accent">{c.n}</div>
              </div>
              <div className="md:col-span-9">
                <h3 className="font-display text-3xl md:text-5xl text-brand-primary leading-[1.1] tracking-tight mb-6">{c.t}</h3>
                <p className="font-serifAlt text-lg md:text-xl text-brand-primary/70 leading-relaxed italic max-w-2xl">"{c.d}"</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PropertyTypes() {
  return (
    <section className="py-24 md:py-32 walnut-surface relative overflow-hidden" data-testid="property-types-section">
      <div className="grain absolute inset-0" />
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div {...fadeUp} className="mb-12 md:mb-16 max-w-2xl">
          <div className="eyebrow mb-5 text-brand-accent">What We Build</div>
          <h2 className="font-display font-light text-4xl md:text-5xl text-brand-bg leading-tight">
            Every home, <em className="italic text-brand-accent">one signature standard.</em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {PROPERTY_TYPES.map((p, idx) => (
            <motion.a key={p.title} href="#book" {...fadeUp} transition={{ ...fadeUp.transition, delay: idx * 0.1 }}
              className="group relative overflow-hidden rounded-[24px] aspect-[3/4] block"
              data-testid={`property-type-card-${idx}`}>
              <img src={p.img} alt={p.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-primary via-brand-primary/50 to-brand-primary/10" />
              <div className="absolute inset-0 border border-transparent group-hover:border-brand-accent/60 transition-colors duration-500 rounded-[24px]" />
              <div className="absolute top-6 left-6">
                <span className="eyebrow text-brand-accent">{p.tag}</span>
              </div>
              <div className="absolute bottom-7 left-7 right-7 text-brand-bg">
                <h3 className="font-display text-2xl md:text-3xl leading-tight mb-2">{p.title}</h3>
                <p className="text-brand-bg/75 text-sm leading-relaxed mb-4">{p.desc}</p>
                <span className="inline-flex items-center gap-2 text-sm tracking-wide text-brand-accent group-hover:gap-3 transition-all">
                  Enquire <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

function FloatingActions({ onBook }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {show && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} data-testid="back-to-top"
          className="w-12 h-12 rounded-full bg-brand-primary/90 backdrop-blur border border-brand-accent/30 text-brand-bg grid place-items-center hover:bg-brand-accent hover:text-brand-primary transition-colors shadow-lg">
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
      <a href={`https://wa.me/${CONTACT.whatsapp}?text=Hello%20Suja%20Contera%2C%20I%27d%20like%20to%20book%20a%20consultation.`}
        target="_blank" rel="noreferrer" data-testid="whatsapp-float"
        className="w-14 h-14 rounded-full bg-[#25D366] text-white grid place-items-center shadow-xl hover:scale-105 transition-transform">
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
}

/* ---------------------- Page ---------------------- */
export default function LandingPage() {
  useLenis();
  const formRef = useRef(null);
  const onBook = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <Navbar onBook={onBook} />
      <Hero onBook={onBook} />
      <Marquee />
      <Manifesto />
      <WhyChoose />
      <Services />
      <Projects />
      <StepInside />
      <PropertyTypes />
      <Process />
      <Stats />
      <Styles />
      <Testimonials />
      <FAQ />
      <BookingSection formRef={formRef} />
      <Footer />
      <FloatingActions onBook={onBook} />
    </div>
  );
}
