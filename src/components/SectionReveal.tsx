'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SectionRevealProps {
  children: ReactNode;
  /**
   * CSS selector (scoped to this component's root) to stagger.
   * Defaults to '.reveal-item'
   */
  selector?: string;
  /**
   * Delay between each staggered item (seconds).
   * Defaults to 0.08
   */
  stagger?: number;
  /**
   * Y travel distance in px. Defaults to 40.
   * Reduced to 20 on mobile via CSS; JS reads computed transform.
   */
  yOffset?: number;
  /**
   * GSAP easing. Defaults to 'power3.out'
   */
  ease?: string;
  /**
   * ScrollTrigger start. Defaults to 'top 85%'
   */
  start?: string;
  className?: string;
}

/**
 * SectionReveal
 * ─────────────────────────────────────────────────────────────────
 * Wraps children with a GSAP ScrollTrigger viewport-gated reveal.
 *
 * RULES (enforced):
 * - Fires ONCE when section enters viewport (once: true equivalent)
 * - Uses ONLY translate3d + opacity (GPU-safe — no layout recalc)
 * - Checks `prefers-reduced-motion` and skips animation if set
 * - Does NOT create a scrub — no conflict with hero scrolly-canvas
 * ─────────────────────────────────────────────────────────────────
 */
export default function SectionReveal({
  children,
  selector = '.reveal-item',
  stagger = 0.08,
  yOffset = 40,
  ease = 'power3.out',
  start = 'top 85%',
  className,
}: SectionRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Respect reduced-motion preference — jump to final state immediately
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      const items = root.querySelectorAll(selector);
      items.forEach((el) => {
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'none';
      });
      return;
    }

    // Reduce travel distance on mobile
    const isMobile = window.innerWidth < 768;
    const travelY = isMobile ? Math.round(yOffset / 2) : yOffset;

    const items = root.querySelectorAll(selector);
    if (items.length === 0) return;

    // Set initial hidden state (these elements have .reveal-item CSS class
    // with opacity:0 + translate3d already set, but we set imperatively
    // here too so GSAP's from() tween starts correctly)
    gsap.set(items, {
      opacity: 0,
      y: travelY,
      force3D: true,
    });

    const ctx = gsap.context(() => {
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease,
        stagger,
        force3D: true,
        clearProps: 'transform', // release GPU layer after animation
        scrollTrigger: {
          trigger: root,
          start,
          once: true, // ← never re-fires; no conflict with hero trigger
          toggleActions: 'play none none none',
        },
      });
    }, root);

    return () => ctx.revert();
  }, [selector, stagger, yOffset, ease, start]);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
