'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface SectionRevealProps {
  children: React.ReactNode;
  /** Delay before starting the reveal (seconds) */
  delay?: number;
  /** Amount of element that must be in view before triggering (0–1) */
  amount?: number;
  /** Stagger delay between child .reveal-item elements (seconds) */
  stagger?: number;
}

const containerVariants = (stagger: number) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: 0,
    },
  },
});

const childVariants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function SectionReveal({
  children,
  delay = 0,
  amount = 0.2,
  stagger = 0.1,
}: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });

  return (
    <motion.div
      ref={ref}
      variants={containerVariants(stagger)}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ delayChildren: delay }}
    >
      {/* Wrap each .reveal-item child in a motion.div automatically */}
      {children}
    </motion.div>
  );
}

/**
 * Use this as a direct motion wrapper for individual items inside SectionReveal.
 * <RevealItem>...</RevealItem>
 */
export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={childVariants} className={className}>
      {children}
    </motion.div>
  );
}
