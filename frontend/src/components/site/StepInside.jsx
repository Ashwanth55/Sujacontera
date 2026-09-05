import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, ArrowRight, MousePointer2 } from "lucide-react";

const EXTERIOR = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=85";

const ROOMS = [
  { name: "The Foyer",       img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2400&q=85", note: "Honed marble underfoot. Brass detail. First impression, considered." },
  { name: "The Living Room", img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2400&q=85", note: "Walnut millwork, ivory linen, sculpted brass. A room that ages beautifully." },
  { name: "The Kitchen",     img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=2400&q=85", note: "Bookmatched veneer, honed Statuario, silent hardware. Quiet luxury." },
  { name: "The Master Suite",img: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=2400&q=85", note: "Warm wash of light. Handmade textiles. Made for slow mornings." },
  { name: "The Study",       img: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=2400&q=85", note: "Full-height walnut library. Vintage rug. Solitude, engineered." },
];

export default function StepInside() {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);

  return (
    <section className="py-24 md:py-32 bg-brand-bg overflow-hidden" data-testid="step-inside-section">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8 }} className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="eyebrow mb-5">Immersive Walkthrough</div>
            <h2 className="font-display font-light text-4xl md:text-5xl text-brand-primary leading-tight">
              Click the door. <em className="italic text-brand-secondary">Step inside.</em>
            </h2>
          </div>
          <p className="text-brand-primary/60 max-w-sm">A cinematic passage through a completed home — foyer to study, in five moments.</p>
        </motion.div>

        {/* Exterior card — click to enter */}
        <motion.button
          onClick={() => { setI(0); setOpen(true); }}
          data-testid="enter-house-btn"
          className="group relative w-full aspect-[16/9] rounded-[24px] overflow-hidden bg-brand-primary block cursor-pointer"
          whileHover={{ scale: 1.005 }}
          transition={{ duration: 0.4 }}
        >
          <img src={EXTERIOR} alt="Villa exterior" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/70 via-transparent to-brand-primary/30" />

          {/* Door hotspot */}
          <div className="absolute left-1/2 top-[62%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <span className="relative flex w-16 h-16 md:w-20 md:h-20">
              <span className="absolute inset-0 rounded-full bg-brand-accent/40 animate-ping" />
              <span className="relative m-auto w-full h-full rounded-full bg-brand-accent/95 grid place-items-center shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                <MousePointer2 className="w-6 h-6 text-brand-primary" strokeWidth={1.8} />
              </span>
            </span>
            <span className="mt-4 text-brand-bg text-[11px] tracking-[0.35em] uppercase bg-brand-primary/50 backdrop-blur px-3 py-1 rounded-full">Enter</span>
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div className="text-brand-bg">
              <div className="eyebrow mb-1">The Marble House · Jubilee Hills</div>
              <div className="font-display text-2xl md:text-3xl">A 5,400 sqft walkthrough</div>
            </div>
            <div className="hidden md:block text-brand-bg/60 text-xs tracking-widest uppercase">5 rooms →</div>
          </div>
        </motion.button>
      </div>

      {/* Fullscreen portal */}
      <AnimatePresence>
        {open && <PortalView i={i} setI={setI} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </section>
  );
}

function PortalView({ i, setI, onClose }) {
  const room = ROOMS[i];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[100] bg-brand-primary"
      style={{ perspective: 1400 }}
      data-testid="house-portal"
    >
      {/* Cinematic zoom-through: image starts scaled way up, settles to 1 */}
      <motion.div
        key={i}
        initial={{ scale: 8, opacity: 0, filter: "blur(24px)" }}
        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
        exit={{ scale: 1.15, opacity: 0, filter: "blur(6px)" }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        <img src={room.img} alt={room.name} className="w-full h-full object-cover" draggable={false} />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/70 via-transparent to-brand-primary/40" />
      </motion.div>

      {/* Top bar */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9, duration: 0.5 }} className="absolute top-0 inset-x-0 p-6 md:p-8 flex items-center justify-between z-10">
        <div className="text-brand-bg">
          <div className="text-[10px] tracking-[0.3em] uppercase text-brand-accent">Room {String(i + 1).padStart(2, "0")} / 05</div>
          <div className="font-display text-xl md:text-2xl mt-1">{room.name}</div>
        </div>
        <button onClick={onClose} data-testid="portal-close" className="w-11 h-11 rounded-full bg-brand-bg/10 border border-brand-bg/20 backdrop-blur text-brand-bg grid place-items-center hover:bg-brand-accent hover:text-brand-primary hover:border-brand-accent transition-colors">
          <X className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Bottom description + nav */}
      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.0, duration: 0.6 }} className="absolute bottom-0 inset-x-0 p-6 md:p-10 z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <p className="font-serifAlt italic text-brand-bg/90 text-xl md:text-2xl max-w-2xl leading-relaxed">"{room.note}"</p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setI((i - 1 + ROOMS.length) % ROOMS.length)}
              data-testid="portal-prev"
              className="w-11 h-11 rounded-full border border-brand-bg/30 text-brand-bg grid place-items-center hover:bg-brand-accent hover:text-brand-primary hover:border-brand-accent transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1.5">
              {ROOMS.map((_, k) => (
                <button key={k} onClick={() => setI(k)} data-testid={`portal-dot-${k}`}
                  className={`h-1.5 rounded-full transition-all duration-500 ${k === i ? "w-10 bg-brand-accent" : "w-1.5 bg-brand-bg/40 hover:bg-brand-bg/70"}`} />
              ))}
            </div>
            <button
              onClick={() => setI((i + 1) % ROOMS.length)}
              data-testid="portal-next"
              className="w-11 h-11 rounded-full bg-brand-accent text-brand-primary grid place-items-center hover:bg-brand-bg transition-colors">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
