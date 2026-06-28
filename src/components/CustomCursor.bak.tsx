'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Single source of truth for mouse position (center coordinates)
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Outer ring trail (smooth spring)
  const outerX = useSpring(mouseX, { damping: 30, stiffness: 220, mass: 0.6 });
  const outerY = useSpring(mouseY, { damping: 30, stiffness: 220, mass: 0.6 });

  // Inner dot (ultra-fast spring with minimal mass for zero clicking delay)
  const dotX = useSpring(mouseX, { damping: 50, stiffness: 600, mass: 0.08 });
  const dotY = useSpring(mouseY, { damping: 50, stiffness: 600, mass: 0.08 });

  // Offset calculations so elements are centered exactly on the cursor
  const outerTranslateX = useTransform(outerX, (val) => val - 16);
  const outerTranslateY = useTransform(outerY, (val) => val - 16);
  const dotTranslateX = useTransform(dotX, (val) => val - 5);
  const dotTranslateY = useTransform(dotY, (val) => val - 5);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) return;

    setIsVisible(true);
    document.body.classList.add('custom-cursor-active');

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.classList.contains('clickable')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('custom-cursor-active');
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer ring spotlight */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/30 pointer-events-none z-[10000] mix-blend-difference hidden md:block"
        style={{
          x: outerTranslateX,
          y: outerTranslateY,
          scale: isClicked ? 0.75 : (isHovered ? 2.2 : 1),
          backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0)',
        }}
        animate={{
          scale: isClicked ? 0.75 : (isHovered ? 2.2 : 1),
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      />

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-white rounded-full pointer-events-none z-[10000] mix-blend-difference hidden md:block"
        style={{
          x: dotTranslateX,
          y: dotTranslateY,
          scale: isClicked ? 1.4 : (isHovered ? 0.4 : 1),
        }}
        animate={{
          scale: isClicked ? 1.4 : (isHovered ? 0.4 : 1),
        }}
        transition={{ type: 'spring', stiffness: 450, damping: 20 }}
      />
    </>
  );
}
