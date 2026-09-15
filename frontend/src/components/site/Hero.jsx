import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./hero.css";

const img = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=2400&q=85`;

// The cinematic journey: a house becomes a luxury villa, then we glide inside room by room.
const SCENES = [
  { key: "house", eyebrow: "It begins", label: "A house", img: img("1706164971309-fb4785fe6ceb"), pos: "center 60%" },
  { key: "villa", eyebrow: "Reimagined", label: "The Villa", img: img("1762811054950-b74e0a055c80"), pos: "center 55%" },
  { key: "living", eyebrow: "Step inside", label: "The Living Room", img: img("1704040686510-b747ff423ebb"), pos: "center 50%" },
  { key: "kitchen", eyebrow: "Room by room", label: "The Kitchen", img: img("1611095210561-67f0832b1ca3"), pos: "center 55%" },
  { key: "suite", eyebrow: "Made for living", label: "The Master Suite", img: img("1758448755969-8791367cf5c5"), pos: "center 50%" },
];

const SCENE_MS = 2800; // medium pace

export const Hero = ({ onBook }) => {
  const reducedMotion = useReducedMotion();
  const [scene, setScene] = useState(0);

  // Preload every frame so the loop stays seamless.
  useEffect(() => {
    SCENES.forEach((s) => { const i = new Image(); i.src = s.img; });
  }, []);

  // Auto-play, looping continuously.
  useEffect(() => {
    if (reducedMotion) return;
    const t = setInterval(() => setScene((s) => (s + 1) % SCENES.length), SCENE_MS);
    return () => clearInterval(t);
  }, [reducedMotion]);

  const active = SCENES[scene];

  const reveal = (delay) => ({
    initial: reducedMotion ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: [0.2, 0.8, 0.2, 1] },
  });

  return (
    <section id="top" className="interior-hero" data-testid="hero-section" aria-labelledby="hero-title">
      <div className="interior-hero__scene" aria-hidden="true">
        <AnimatePresence>
          <motion.div
            key={active.key}
            className="interior-hero__frame"
            data-testid={`hero-scene-${scene}`}
            initial={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.0 }}
            animate={{ opacity: 1, scale: reducedMotion ? 1 : 1.14 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{
              opacity: { duration: 1.3, ease: "easeInOut" },
              scale: { duration: SCENE_MS / 1000 + 1.3, ease: "linear" },
            }}
          >
            <img
              src={active.img}
              alt=""
              className="interior-hero__image"
              style={{ objectPosition: active.pos }}
              fetchPriority="high"
            />
          </motion.div>
        </AnimatePresence>
        <div className="interior-hero__shade" />
      </div>

      <div className="interior-hero__inner max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="interior-hero__main">
          <motion.div {...reveal(0.1)} className="interior-hero__signature" data-testid="hero-studio-label">
            <span aria-hidden="true" /> Suja Contera · Interior Design
          </motion.div>
          <motion.h1 {...reveal(0.2)} id="hero-title" className="font-display text-4xl sm:text-5xl lg:text-6xl" data-testid="hero-headline">
            From Foundation<br />
            <em>to Finish.</em>
          </motion.h1>
          <motion.p {...reveal(0.3)} className="interior-hero__description" data-testid="hero-description">
            Exceptional construction and bespoke interiors, thoughtfully designed and expertly executed.
          </motion.p>
          <motion.p {...reveal(0.35)} className="interior-hero__homes" data-testid="hero-property-types">
            Apartments <span aria-hidden="true">/</span> Villas <span aria-hidden="true">/</span> Independent homes
          </motion.p>
          <motion.div {...reveal(0.4)} className="interior-hero__actions">
            <Button onClick={onBook} data-testid="hero-book-btn" className="interior-hero__book group rounded-full">
              Book Free Consultation <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <a href="#projects" data-testid="hero-portfolio-btn" className="interior-hero__portfolio group">
              View Portfolio <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </div>

        <motion.div {...reveal(0.5)} className="interior-hero__footer" data-testid="hero-trust-signals">
          <div data-testid="hero-stat-homes"><strong>100+</strong> Homes</div>
          <div data-testid="hero-stat-experience"><strong>10+</strong> Years of Experience</div>
          <div data-testid="hero-stat-satisfaction"><strong>98%</strong> Client Satisfaction</div>
          <div data-testid="hero-stat-finish"><strong>100%</strong> Premium Finish</div>
        </motion.div>
      </div>

      {/* Cinematic "now touring" indicator */}
      <div className="interior-hero__journey" data-testid="hero-journey">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.key}
            className="interior-hero__journey-caption"
            data-testid="hero-journey-caption"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <span className="interior-hero__journey-eyebrow">{active.eyebrow}</span>
            <span className="interior-hero__journey-label">{active.label}</span>
          </motion.div>
        </AnimatePresence>
        <div className="interior-hero__journey-dots" data-testid="hero-journey-dots">
          {SCENES.map((s, idx) => (
            <span key={s.key} data-testid={`hero-journey-dot-${idx}`} className={idx === scene ? "is-active" : ""} />
          ))}
        </div>
      </div>
    </section>
  );
};
