'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function LenisScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    // Expose globally so ScrollyCanvas can attach listeners
    (window as unknown as Record<string, unknown>).lenis = lenis;

    // ─── Official Lenis ↔ GSAP ScrollTrigger bridge ───────────────────────
    // Every time Lenis scrolls, update ScrollTrigger's notion of scroll pos.
    lenis.on('scroll', ScrollTrigger.update);

    // Run Lenis through GSAP's ticker so they share ONE RAF loop.
    // This is the ONLY place lenis.raf() is called — never duplicate this.
    gsap.ticker.add((time: number) => {
      lenis.raf(time * 1000);
    });

    // Prevent GSAP from adding artificial lag that fights Lenis easing
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
      (window as unknown as Record<string, unknown>).lenis = undefined;
    };
  }, []);

  return null;
}
