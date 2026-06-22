'use client';

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// ─── Types ────────────────────────────────────────────────────────────────────
interface ScrollyCanvasProps {
  children?: React.ReactNode;
}

// Total frames in /public/sequence/
const FRAME_COUNT = 160;
const FRAME_PATH = (i: number) =>
  `/sequence/frame_${i.toString().padStart(3, '0')}_delay-0.05s.png`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function ScrollyCanvas({ children }: ScrollyCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const fadeRef      = useRef<HTMLDivElement>(null);   // black exit-fade overlay
  const imagesRef    = useRef<HTMLImageElement[]>([]);
  const progressRef  = useRef(0);                      // current scroll progress

  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded,     setIsLoaded]     = useState(false);

  // ─── draw helper ─────────────────────────────────────────────────────────
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const images = imagesRef.current;
    if (!canvas || images.length === 0) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const clamped = Math.max(0, Math.min(Math.round(index), images.length - 1));
    const img = images[clamped];
    // Skip silently if the image hasn't decoded yet
    if (!img || img.naturalWidth === 0) return;

    // object-fit: cover math
    const cr = canvas.width  / canvas.height;
    const ir = img.naturalWidth / img.naturalHeight;
    let dw = canvas.width, dh = canvas.height, dx = 0, dy = 0;
    if (cr > ir) { dh = canvas.width  / ir; dy = (canvas.height - dh) / 2; }
    else          { dw = canvas.height * ir; dx = (canvas.width  - dw) / 2; }

    ctx.drawImage(img, dx, dy, dw, dh);
  }, []);

  // ─── size canvas (called immediately + on resize) ────────────────────────
  const sizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    // Redraw whatever frame we're on so resize isn't jarring
    drawFrame(Math.round(progressRef.current * (FRAME_COUNT - 1)));
  }, [drawFrame]);

  // ─── preload ─────────────────────────────────────────────────────────────
  useEffect(() => {
    // Size canvas immediately so it occupies space before images arrive
    sizeCanvas();

    const loadedImages: HTMLImageElement[] = new Array(FRAME_COUNT);
    let settled = 0;

    const onSettled = () => () => {
      settled++;
      setLoadProgress(Math.round((settled / FRAME_COUNT) * 100));

      if (settled === FRAME_COUNT) {
        imagesRef.current = loadedImages;

        // ── BUG FIX #1 ──────────────────────────────────────────────────
        // Draw frame 0 RIGHT NOW so the canvas is never black.
        // Do this BEFORE the setTimeout so there is zero black frame.
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width  = window.innerWidth;
          canvas.height = window.innerHeight;
        }
        drawFrame(0);

        setTimeout(() => setIsLoaded(true), 400);
      }
    };

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img     = new Image();
      img.src       = FRAME_PATH(i);
      img.onload    = onSettled();
      img.onerror   = onSettled(); // keep counter moving even on 404
      loadedImages[i] = img;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── GSAP ScrollTrigger setup ─────────────────────────────────────────────
  useEffect(() => {
    if (!isLoaded) return;

    const canvas    = canvasRef.current;
    const container = containerRef.current;
    const fadeEl    = fadeRef.current;
    if (!canvas || !container) return;

    // Correct sizing after hydration
    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);

    // ── NO duplicate lenis.raf() here ─────────────────────────
    // LenisScroll.tsx already runs lenis through gsap.ticker.
    const lenis = (window as unknown as { lenis?: Lenis }).lenis;
    if (lenis && !(lenis as unknown as { _stBridge?: boolean })._stBridge) {
      lenis.on('scroll', ScrollTrigger.update);
      (lenis as unknown as { _stBridge?: boolean })._stBridge = true;
    }

    // ── Main frame-scrub trigger ──────────────────────────────────────────
    const frameObj = { frame: 0 };

    const ctx = gsap.context(() => {
      // Pinning + Frame scrubbing timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          id     : 'scrolly-canvas',
          trigger: container,
          start  : 'top top',
          end    : '+=3000',
          pin    : true,
          scrub  : 1,
          anticipatePin: 1,
          onUpdate(self) {
            progressRef.current = self.progress;
            drawFrame(Math.round(self.progress * (FRAME_COUNT - 1)));
          },
        },
      });

      // Exit-fade overlay: fade from opacity 0 to 1 in the last 10% of scroll
      if (fadeEl) {
        tl.to({}, { duration: 0.9 })
          .to(fadeEl, {
            opacity: 1,
            ease: 'power1.in',
            duration: 0.1,
          });
      }
    });

    // Refresh after a short paint-settle to fix position calculations
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200);

    return () => {
      clearTimeout(refreshTimer);
      window.removeEventListener('resize', sizeCanvas);
      ctx.revert(); // kills all ScrollTriggers created inside context
    };
  }, [isLoaded, drawFrame, sizeCanvas]);

  // ──────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Loading Screen ─────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 bg-[#000000] z-[999] flex flex-col items-center justify-center font-sans pointer-events-none transition-opacity duration-700"
        style={{ opacity: isLoaded ? 0 : 1, pointerEvents: isLoaded ? 'none' : 'all' }}
        aria-hidden={isLoaded}
      >
        <div className="relative flex flex-col items-center">
          {/* Ambient glow */}
          <div className="absolute w-72 h-72 bg-accent-purple/10 rounded-full blur-3xl" />

          {/* Spinner */}
          <div className="w-16 h-16 border-t-2 border-r-2 border-accent-purple rounded-full animate-spin mb-8 relative z-10" />

          <div className="text-xs font-bold tracking-[0.22em] text-white/40 uppercase mb-2 relative z-10">
            Loading Sequence
          </div>
          <div className="text-5xl font-black tracking-tight text-white tabular-nums relative z-10">
            {loadProgress}%
          </div>

          {/* Progress bar */}
          <div className="w-56 h-[2px] bg-white/10 rounded-full overflow-hidden mt-6 relative z-10">
            <div
              className="h-full bg-gradient-to-r from-accent-purple to-accent-blue rounded-full transition-all duration-100 ease-out"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Scrollytelling Container ────────────────────────────────────── */}
      <section
        ref={containerRef}
        className="hero relative w-full min-h-screen overflow-visible"
        id="scrolly-container"
        style={{ minHeight: '100vh', width: '100%' }}
      >
        {/* Canvas: z-index 1 as requested */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block z-[1]"
          style={{ willChange: 'contents' }}
        />

        {/* Exit-fade overlay */}
        <div
          ref={fadeRef}
          className="absolute inset-0 bg-[#000000] pointer-events-none z-[2]"
          style={{ opacity: 0 }}
        />

        {/* Vignette overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030303]/60 via-transparent to-transparent pointer-events-none z-[3]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,transparent_30%,#030303_100%)] pointer-events-none z-[3]" />

        {/* Overlay text content: z-index 100 as requested */}
        {isLoaded && (
          <div className="relative w-full h-full min-h-screen z-[100] pointer-events-none">
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(
                  child as React.ReactElement<{
                    containerRef?: React.RefObject<HTMLDivElement | null>;
                  }>,
                  { containerRef: containerRef as React.RefObject<HTMLDivElement | null> }
                );
              }
              return child;
            })}
          </div>
        )}
      </section>
    </>
  );
}
