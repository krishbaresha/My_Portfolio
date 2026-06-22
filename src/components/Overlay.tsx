'use client';

// ── BUG FIX #3 ────────────────────────────────────────────────────────────────
// Previous version computed `totalHeight` synchronously on mount,
// before layout was committed. GSAP timelines then attached at px=0.
// Fix: use ScrollTrigger percentage syntax ("top+=30%") so positions
// are computed lazily by ScrollTrigger.refresh(), not by JS pixel math.

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface OverlayProps {
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export default function Overlay({ containerRef }: OverlayProps) {
  const sec1Ref = useRef<HTMLDivElement>(null);
  const sec2Ref = useRef<HTMLDivElement>(null);
  const sec3Ref = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const triggerEl = containerRef?.current;
    if (!triggerEl) return;

    // All GSAP work lives inside a context for clean cleanup
    const ctx = gsap.context(() => {

      // ── Common ScrollTrigger config ──────────────────────────────────────
      const base = {
        trigger: triggerEl,
        start  : 'top top',
        end    : '+=3000',
        scrub  : 1,
      };

      // Initial state: all sections invisible, shifted down
      gsap.set([sec1Ref.current, sec2Ref.current, sec3Ref.current], {
        opacity: 0,
        y: 50,
      });

      // ── Section 1: 0 – 22% of scroll ─────────────────────────────────────
      // Enter  0→6%:   fade in + slide up
      // Hold   6→16%:  full opacity
      // Exit  16→23%:  fade out + slide up
      const tl1 = gsap.timeline({ scrollTrigger: { ...base } });
      tl1
        .to(sec1Ref.current, { opacity: 1, y: 0, ease: 'power2.out',  duration: 0.06 },   0)
        .to(sec1Ref.current, { opacity: 1, y: 0, ease: 'none',        duration: 0.10 },   0.06)
        .to(sec1Ref.current, { opacity: 0, y: -50, ease: 'power2.in', duration: 0.07 },   0.16);

      // ── Section 2: 28 – 54% of scroll ────────────────────────────────────
      const tl2 = gsap.timeline({ scrollTrigger: { ...base } });
      tl2
        .to(sec2Ref.current, { opacity: 1, y: 0, ease: 'power2.out',  duration: 0.06 }, 0.28)
        .to(sec2Ref.current, { opacity: 1, y: 0, ease: 'none',        duration: 0.14 }, 0.34)
        .to(sec2Ref.current, { opacity: 0, y: -50, ease: 'power2.in', duration: 0.06 }, 0.48);

      // ── Section 3: 56 – 86% of scroll ────────────────────────────────────
      const tl3 = gsap.timeline({ scrollTrigger: { ...base } });
      tl3
        .to(sec3Ref.current, { opacity: 1, y: 0, ease: 'power2.out',  duration: 0.06 }, 0.56)
        .to(sec3Ref.current, { opacity: 1, y: 0, ease: 'none',        duration: 0.16 }, 0.62)
        .to(sec3Ref.current, { opacity: 0, y: -50, ease: 'power2.in', duration: 0.06 }, 0.78);

    }, rootRef); // scope to rootRef so GSAP selectors are contained

    // Refresh so ScrollTrigger re-measures after layout stabilises
    const t = setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      clearTimeout(t);
      ctx.revert(); // kills all ScrollTriggers + tweens in context
    };
  }, [containerRef]);

  return (
    <div
      ref={rootRef}
      className="relative w-full h-full font-sans select-none pointer-events-none"
    >
      {/* ── Section 1: Centre – Intro ─────────────────────────────────── */}
      <div
        ref={sec1Ref}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
      >
        <p className="text-[10px] md:text-xs font-bold tracking-[0.32em] text-accent-purple uppercase mb-5">
          Creative Developer · AI Engineer
        </p>
        <h1 className="text-5xl md:text-[7rem] font-black tracking-tighter text-[#ffffff] uppercase leading-none drop-shadow-[0_0_80px_rgba(139,92,246,0.3)]">
          KRISH<br className="hidden md:block" /> BARESHA
        </h1>
        <p className="text-xs md:text-sm font-light text-[#95979d] tracking-[0.2em] uppercase mt-6">
          Scroll to explore
        </p>
        {/* Scroll cue */}
        <div className="mt-10 flex flex-col items-center gap-2">
          <div className="w-px h-16 bg-gradient-to-b from-[#e4ded7]/40 to-transparent" />
          <div className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-pulse" />
        </div>
      </div>

      {/* ── Section 2: Left – Core Focus ─────────────────────────────── */}
      <div
        ref={sec2Ref}
        className="absolute inset-0 flex flex-col justify-center items-start px-8 md:px-24"
      >
        <div className="max-w-xl">
          <span className="text-[10px] font-bold tracking-[0.28em] text-accent-purple uppercase mb-4 block">
            Core Focus
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-[#ffffff] uppercase leading-tight">
            I BUILD<br />HIGH-END<br />DIGITAL<br />EXPERIENCES.
          </h2>
          <p className="text-[#e4ded7] font-light text-sm md:text-base mt-5 leading-relaxed max-w-sm">
            Low-latency agent systems, WebGL rendering loops, and pixel-perfect
            animations — crafted to impress recruiters and clients alike.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {['Next.js 15', 'GSAP', 'Three.js', 'AI Agents', 'Supabase'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full border border-[rgba(228,222,216,0.15)] bg-white/[0.04] text-[#e4ded7] text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section 3: Right – Philosophy ────────────────────────────── */}
      <div
        ref={sec3Ref}
        className="absolute inset-0 flex flex-col justify-center items-end px-8 md:px-24"
      >
        <div className="max-w-xl text-right">
          <span className="text-[10px] font-bold tracking-[0.28em] text-accent-blue uppercase mb-4 block">
            Philosophy
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-[#ffffff] uppercase leading-tight">
            BRIDGING<br />DESIGN<br />AND<br />ENGINEERING.
          </h2>
          <p className="text-[#e4ded7] font-light text-sm md:text-base mt-5 leading-relaxed max-w-sm ml-auto">
            Fluid micro-animations that make digital interfaces feel responsive,
            premium, and alive — every interaction considered.
          </p>
          {/* Stats */}
          <div className="flex justify-end gap-8 mt-8">
            {[
              { label: 'Projects',  value: '12+' },
              { label: 'Commits',   value: '290+' },
              { label: 'Stars',     value: '83+' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black text-[#ffffff]">{s.value}</div>
                <div className="text-[10px] text-[#95979d] uppercase tracking-widest mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
