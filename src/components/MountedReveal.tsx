'use client';

import { useEffect, useState } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface MountedRevealProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  /** Duration of the opacity fade-in once mounted (seconds) */
  duration?: number;
  /** Optional skeleton shown until mount — occupies the same grid cell */
  skeleton?: React.ReactNode;
}

/**
 * Prevents FOUC by keeping content at opacity 0 until the client has mounted,
 * then fading in. When `skeleton` is provided, both layers share a grid stack
 * so reserved dimensions never collapse.
 */
export default function MountedReveal({
  children,
  skeleton,
  duration = 0.4,
  className,
  ...props
}: MountedRevealProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (skeleton) {
    return (
      <div className={`hero-content-stack ${className ?? ''}`}>
        <div aria-hidden={mounted} className={mounted ? 'invisible' : undefined}>
          {skeleton}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
          {...props}
        >
          {children}
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: mounted ? 1 : 0 }}
      transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
