'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, label, nav a, .clickable, [data-cursor="pointer"]';

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest(INTERACTIVE_SELECTOR));
}

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const outerX = useSpring(mouseX, { damping: 28, stiffness: 180, mass: 0.8 });
  const outerY = useSpring(mouseY, { damping: 28, stiffness: 180, mass: 0.8 });

  const dotX = useSpring(mouseX, { damping: 40, stiffness: 500, mass: 0.1 });
  const dotY = useSpring(mouseY, { damping: 40, stiffness: 500, mass: 0.1 });

  const outerTranslateX = useTransform(outerX, (val) => val - 16);
  const outerTranslateY = useTransform(outerY, (val) => val - 16);
  const dotTranslateX = useTransform(dotX, (val) => val - 5);
  const dotTranslateY = useTransform(dotY, (val) => val - 5);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const finePointer = window.matchMedia('(pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!finePointer.matches || reducedMotion.matches) return;

    setIsVisible(true);
    document.body.classList.add('custom-cursor-active');

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      setIsHovered(isInteractiveTarget(e.target));
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsHovered(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.body.classList.remove('custom-cursor-active');
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/30 pointer-events-none z-[10000] mix-blend-difference hidden md:block"
        style={{
          x: outerTranslateX,
          y: outerTranslateY,
          backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0)',
        }}
        animate={{ scale: isClicked ? 0.75 : isHovered ? 2.2 : 1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      />

      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-white rounded-full pointer-events-none z-[10000] mix-blend-difference hidden md:block"
        style={{ x: dotTranslateX, y: dotTranslateY }}
        animate={{ scale: isClicked ? 1.4 : isHovered ? 0.4 : 1 }}
        transition={{ type: 'spring', stiffness: 450, damping: 20 }}
      />
    </>
  );
}
