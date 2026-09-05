import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

/* Smooth momentum scrolling with Lenis */
export function useLenis() {
  useEffect(() => {
    let lenis;
    let raf;
    (async () => {
      const Lenis = (await import("lenis")).default;
      lenis = new Lenis({ duration: 1.4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, wheelMultiplier: 1 });
      const loop = (time) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    })();
    return () => { cancelAnimationFrame(raf); if (lenis) lenis.destroy(); };
  }, []);
}

/* Masked line reveal — split children into lines and reveal each with a mask */
export function MaskedLines({ children, delay = 0, className = "" }) {
  const lines = String(children).split("\n");
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block will-change-transform"
            initial={{ y: "115%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1.1, delay: delay + i * 0.14, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* Before / After horizontal drag slider */
export function BeforeAfter({ before, after, label }) {
  const containerRef = useRef(null);
  const x = useMotionValue(50);
  const [dragging, setDragging] = useState(false);
  const clipRight = useTransform(x, (v) => `inset(0 ${100 - v}% 0 0)`);
  const leftPct = useTransform(x, (v) => `${v}%`);

  const move = (clientX) => {
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100));
    x.set(pct);
  };
  const onMouseDown = () => setDragging(true);
  const onMouseUp = () => setDragging(false);
  useEffect(() => {
    const mm = (e) => dragging && move(e.clientX);
    const mu = () => setDragging(false);
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", mu);
    return () => { window.removeEventListener("mousemove", mm); window.removeEventListener("mouseup", mu); };
  }, [dragging]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[16/10] rounded-[18px] overflow-hidden select-none cursor-ew-resize bg-brand-primary"
      onMouseDown={(e) => { onMouseDown(); move(e.clientX); }}
      onTouchStart={(e) => move(e.touches[0].clientX)}
      onTouchMove={(e) => move(e.touches[0].clientX)}
      data-testid={`ba-${label?.toLowerCase()}`}
    >
      <img src={after} alt="After" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      <motion.img src={before} alt="Before" style={{ clipPath: clipRight }} className="absolute inset-0 w-full h-full object-cover grayscale-[0.35]" draggable={false} />

      {/* Labels */}
      <div className="absolute top-5 left-5 eyebrow text-brand-bg/95 bg-brand-primary/50 backdrop-blur px-3 py-1 rounded-full">Before</div>
      <div className="absolute top-5 right-5 eyebrow text-brand-primary bg-brand-accent px-3 py-1 rounded-full">After</div>

      {/* Divider */}
      <motion.div style={{ left: leftPct }} className="absolute top-0 bottom-0 w-px bg-brand-accent -translate-x-1/2 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-brand-accent grid place-items-center shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
          <div className="flex gap-1">
            <span className="w-1 h-4 bg-brand-primary rounded-full" />
            <span className="w-1 h-4 bg-brand-primary rounded-full" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
