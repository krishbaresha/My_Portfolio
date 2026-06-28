'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 120;
const PRIORITY_FRAMES = 12;
const BATCH_SIZE = 10;

function frameSources(index: number): string[] {
  const pad = index.toString().padStart(3, '0');
  return [
    `/sequence-webp/frame_${pad}.webp`,
    `/sequence/frame_${pad}_delay-0.067s.png`,
  ];
}

function loadImage(sources: string[]): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    let i = 0;

    const tryNext = () => {
      if (i >= sources.length) {
        resolve(null);
        return;
      }
      img.src = sources[i++];
    };

    img.onload = () => resolve(img);
    img.onerror = tryNext;
    tryNext();
  });
}

export default function ScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(Array(FRAME_COUNT).fill(null));
  const [available, setAvailable] = useState<boolean | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const updateProgress = useCallback((loaded: number) => {
    setLoadProgress(Math.round((loaded / FRAME_COUNT) * 100));
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const probe = await loadImage(frameSources(0));
      if (cancelled) return;

      if (!probe) {
        setAvailable(false);
        return;
      }

      setAvailable(true);
      imagesRef.current[0] = probe;
      updateProgress(1);

      const priorityEnd = Math.min(PRIORITY_FRAMES, FRAME_COUNT);
      for (let i = 1; i < priorityEnd; i++) {
        if (cancelled) return;
        const img = await loadImage(frameSources(i));
        if (img) imagesRef.current[i] = img;
        updateProgress(imagesRef.current.filter(Boolean).length);
      }

      if (!cancelled) setIsReady(true);

      for (let start = priorityEnd; start < FRAME_COUNT; start += BATCH_SIZE) {
        if (cancelled) return;

        const batch = Array.from(
          { length: Math.min(BATCH_SIZE, FRAME_COUNT - start) },
          (_, j) => start + j
        );

        await new Promise<void>((resolve) => {
          const schedule =
            typeof window.requestIdleCallback === 'function'
              ? (cb: () => void) => window.requestIdleCallback(cb)
              : (cb: () => void) => window.setTimeout(cb, 16);
          schedule(async () => {
            for (const idx of batch) {
              if (cancelled) return;
              if (!imagesRef.current[idx]) {
                const img = await loadImage(frameSources(idx));
                if (img) imagesRef.current[idx] = img;
                updateProgress(imagesRef.current.filter(Boolean).length);
              }
            }
            resolve();
          });
        });
      }
    }

    init();
    return () => { cancelled = true; };
  }, [updateProgress]);

  useGSAP(
    () => {
      if (!isReady || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      const state = { frame: 0 };

      const render = () => {
        const img = imagesRef.current[Math.round(state.frame)];
        if (!img?.complete) return;

        context.clearRect(0, 0, canvas.width, canvas.height);

        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        let drawWidth = canvas.width;
        let drawHeight = canvas.height;
        let drawX = 0;
        let drawY = 0;

        if (canvasRatio > imgRatio) {
          drawHeight = canvas.width / imgRatio;
          drawY = (canvas.height - drawHeight) / 2;
        } else {
          drawWidth = canvas.height * imgRatio;
          drawX = (canvas.width - drawWidth) / 2;
        }

        context.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      };

      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        render();
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      gsap.to(state, {
        frame: FRAME_COUNT - 1,
        snap: 'frame',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          onUpdate: render,
        },
      });

      return () => window.removeEventListener('resize', resizeCanvas);
    },
    { dependencies: [isReady], scope: containerRef }
  );

  if (available === false) return null;

  return (
    <>
      {!isReady && (
        <div className="fixed inset-0 bg-background z-[999] flex flex-col items-center justify-center font-body">
          <div className="relative flex flex-col items-center">
            <div className="absolute w-72 h-72 bg-accent-purple/10 rounded-full blur-3xl" />
            <div className="w-16 h-16 border-t-2 border-r-2 border-accent-purple rounded-full animate-spin mb-8" />
            <div className="text-sm font-semibold tracking-[0.2em] text-foreground/50 uppercase mb-2">
              Initializing Experience
            </div>
            <div className="text-4xl font-light tracking-wider text-foreground">
              {loadProgress}%
            </div>
            <div className="w-48 h-[2px] bg-foreground/10 rounded-full overflow-hidden mt-6">
              <div
                className="h-full bg-gradient-to-r from-accent-purple to-accent-blue transition-all duration-300 ease-out"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <div ref={containerRef} className="relative w-full h-[300vh] bg-transparent" id="scroll-sequence">
        <div className="sticky top-0 w-full h-screen overflow-hidden pointer-events-none z-0 bg-background">
          <canvas ref={canvasRef} className="w-full h-full block" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
        </div>
      </div>
    </>
  );
}
