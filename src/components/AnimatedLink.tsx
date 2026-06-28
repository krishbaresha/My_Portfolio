'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { ComponentProps } from 'react';

type AnimatedLinkProps = ComponentProps<typeof Link> & {
  hoverScale?: number;
  tapScale?: number;
};

export default function AnimatedLink({
  children,
  className,
  hoverScale = 1.02,
  tapScale = 0.97,
  ...props
}: AnimatedLinkProps) {
  const isFullWidth = className?.includes('w-full');

  return (
    <motion.div
      className={isFullWidth ? 'block w-full' : 'inline-flex'}
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: tapScale }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
    >
      <Link {...props} className={className}>
        {children}
      </Link>
    </motion.div>
  );
}
