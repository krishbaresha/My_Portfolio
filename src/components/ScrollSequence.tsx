'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const frameCount = 120;

  // Preload Images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    const onLoad = () => {
      loadedCount++;
      const progress = Math.round((loadedCount / frameCount) * 100);
      setLoadProgress(progress);
      if (loadedCount === frameCount) {
        setImages(loadedImages);
        setTimeout(() => setIsLoaded(true), 600); // Smooth exit delay
      }
    };

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      const padNum = i.toString().padStart(3, '0');
      img.src = `/sequence/frame_${padNum}_delay-0.067s.png`;
      img.onload = onLoad;
      img.onerror = onLoad; // Keep moving even if an image fails to load
      loadedImages.push(img);
    }
  }, []);

  // GSAP Scroll animation setup
  useGSAP(
    () => {
      if (!isLoaded || images.length === 0 || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      const airpods = { frame: 0 };

      // Helper to render a frame on canvas
      const render = () => {
        const img = images[airpods.frame];
        if (!img) return;

        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Aspect ratio calculations (cover behavior)
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

      // Set initial dimensions
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        render();
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      // Scrub timeline
      gsap.to(airpods, {
        frame: frameCount - 1,
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

      return () => {
        window.removeEventListener('resize', resizeCanvas);
      };
    },
    { dependencies: [isLoaded, images], scope: containerRef }
  );

  return (
    <>
      {/* Premium Loader Overlay */}
      {!isLoaded && (
        <div className="fixed inset-0 bg-[#030303] z-[999] flex flex-col items-center justify-center font-sans">
          <div className="relative flex flex-col items-center">
            {/* Soft backdrop glow */}
            <div className="absolute w-72 h-72 bg-accent-purple/10 rounded-full blur-3xl" />
            
            {/* Spinning orbital */}
            <div className="w-16 h-16 border-t-2 border-r-2 border-accent-purple rounded-full animate-spin mb-8" />
            
            {/* Title / Info */}
            <div className="text-sm font-semibold tracking-[0.2em] text-white/50 uppercase mb-2">
              Initializing Experience
            </div>
            
            {/* Percentage counter */}
            <div className="text-4xl font-light tracking-wider text-white">
              {loadProgress}%
            </div>

            {/* Load bar */}
            <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden mt-6">
              <div 
                className="h-full bg-gradient-to-r from-accent-purple to-accent-blue transition-all duration-300 ease-out"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Scroll Trigger Container */}
      <div 
        ref={containerRef} 
        className="relative w-full h-[300vh] bg-transparent"
        id="scroll-sequence"
      >
        {/* Sticky Canvas viewport */}
        <div className="sticky top-0 w-full h-screen overflow-hidden pointer-events-none z-0 bg-[#030303]">
          <canvas ref={canvasRef} className="w-full h-full block" />
          
          {/* Subtle vignette/luxury overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#030303]/40 via-transparent to-[#030303]" />
          <div className="absolute inset-0 bg-radial-gradient(ellipse at center, transparent 30%, #030303 95%)" />
        </div>
      </div>
    </>
  );
}
