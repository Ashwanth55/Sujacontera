import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, ArrowRight, MousePointer2, Plus, MapPin } from "lucide-react";

const EXTERIOR = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=85";

// Reusable material sourcing stories
const MAT = {
  walnut: {
    label: "Walnut",
    material: "American Black Walnut",
    origin: "Appalachian Foothills, USA",
    swatch: "#5C4033",
    story: "Slow-grown hardwood, hand-selected board by board for grain continuity, then finished in hardwax oil that deepens in tone across decades.",
  },
  marble: {
    label: "Marble",
    material: "Statuario Marble",
    origin: "Carrara, Italy",
    swatch: "#EDEAE3",
    story: "Quarried from the Apuan Alps. Chosen for its warm white field and soft grey veining — honed rather than polished for a matte, tactile calm.",
  },
  brass: {
    label: "Brass",
    material: "Unlacquered Brass",
    origin: "Jaipur Foundry, India",
    swatch: "#C8A96A",
    story: "Sand-cast and hand-brushed, then left raw to develop a living patina that warms with every touch and softens with time.",
  },
};

const ROOMS = [
  {
    name: "The Foyer",
    img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2400&q=85",
    note: "Honed marble underfoot. Brass detail. First impression, considered.",
    materials: [
      { ...MAT.marble, x: 40, y: 82 },
      { ...MAT.brass, x: 70, y: 44 },
    ],
  },
  {
    name: "The Living Room",
    img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2400&q=85",
    note: "Walnut millwork, ivory linen, sculpted brass. A room that ages beautifully.",
    materials: [
      { ...MAT.walnut, x: 24, y: 56 },
      { ...MAT.brass, x: 74, y: 52 },
      { ...MAT.marble, x: 50, y: 74 },
    ],
  },
  {
    name: "The Kitchen",
    img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=2400&q=85",
    note: "Bookmatched veneer, honed Statuario, silent hardware. Quiet luxury.",
    materials: [
      { ...MAT.walnut, material: "Bookmatched Walnut Veneer", x: 28, y: 62 },
      { ...MAT.marble, x: 62, y: 46 },
      { ...MAT.brass, x: 46, y: 72 },
    ],
  },
  {
    name: "The Master Suite",
    img: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=2400&q=85",
    note: "Warm wash of light. Handmade textiles. Made for slow mornings.",
    materials: [
      { ...MAT.walnut, x: 30, y: 64 },
      { ...MAT.brass, x: 72, y: 40 },
    ],
  },
  {
    name: "The Study",
    img: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=2400&q=85",
    note: "Full-height walnut library. Vintage rug. Solitude, engineered.",
    materials: [
      { ...MAT.walnut, material: "Full-Height Walnut Joinery", x: 36, y: 46 },
      { ...MAT.brass, x: 66, y: 56 },
    ],
  },
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
  const [activeMat, setActiveMat] = useState(null);

  // Reset the open material whenever the room changes
  useEffect(() => { setActiveMat(null); }, [i]);

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

      {/* Material hotspots — appear after the zoom settles */}
      {room.materials?.map((mat, k) => (
        <motion.button
          key={`${i}-${k}`}
          onClick={() => setActiveMat(activeMat?.label === mat.label && activeMat?._k === k ? null : { ...mat, _k: k })}
          data-testid={`material-hotspot-${i}-${k}`}
          aria-label={`Explore ${mat.material}`}
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${mat.x}%`, top: `${mat.y}%` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.3 + k * 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.15 }}
        >
          <span className="relative flex w-7 h-7 md:w-8 md:h-8">
            <span className="absolute inset-0 rounded-full bg-brand-accent/40 animate-ping" />
            <span
              className={`relative m-auto w-full h-full rounded-full grid place-items-center border transition-colors duration-300 shadow-[0_6px_20px_rgba(0,0,0,0.45)] ${
                activeMat?._k === k ? "bg-brand-accent border-brand-accent" : "bg-brand-bg/90 border-brand-bg/60 hover:bg-brand-accent"
              }`}
            >
              <Plus className={`w-3.5 h-3.5 transition-transform duration-300 ${activeMat?._k === k ? "rotate-45 text-brand-primary" : "text-brand-primary"}`} strokeWidth={2.2} />
            </span>
          </span>
        </motion.button>
      ))}

      {/* Material sourcing card */}
      <AnimatePresence mode="wait">
        {activeMat && (
          <motion.div
            key={`card-${activeMat._k}`}
            initial={{ opacity: 0, x: 30, y: "-50%" }}
            animate={{ opacity: 1, x: 0, y: "-50%" }}
            exit={{ opacity: 0, x: 30, y: "-50%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-30 top-1/2 right-4 md:right-10 w-[86vw] max-w-[320px] rounded-[20px] overflow-hidden backdrop-blur-xl bg-brand-primary/60 border border-brand-bg/20 shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
            data-testid="material-card"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <span
                  className="w-11 h-11 rounded-full border border-brand-bg/30 shrink-0 shadow-inner"
                  style={{ background: activeMat.swatch }}
                  data-testid="material-swatch"
                />
                <div>
                  <div className="text-[10px] tracking-[0.3em] uppercase text-brand-accent">{activeMat.label}</div>
                  <div className="font-display text-lg text-brand-bg leading-tight">{activeMat.material}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-brand-bg/70 text-xs mb-4">
                <MapPin className="w-3.5 h-3.5 text-brand-accent" strokeWidth={1.8} />
                <span className="tracking-wide">{activeMat.origin}</span>
              </div>

              <div className="h-px w-full bg-brand-bg/15 mb-4" />

              <p className="font-serifAlt italic text-brand-bg/85 text-sm leading-relaxed">
                {activeMat.story}
              </p>

              <button
                onClick={() => setActiveMat(null)}
                data-testid="material-card-close"
                className="mt-5 text-[10px] tracking-[0.3em] uppercase text-brand-bg/60 hover:text-brand-accent transition-colors"
              >
                Close ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Hint pill */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.5 }}
        className="absolute top-24 md:top-28 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
      >
        <span className="text-brand-bg/80 text-[10px] tracking-[0.3em] uppercase bg-brand-primary/40 backdrop-blur px-4 py-1.5 rounded-full border border-brand-bg/10">
          Tap the dots to explore materials
        </span>
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
