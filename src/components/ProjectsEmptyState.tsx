'use client';

import { motion } from 'framer-motion';
import { Layers, Sparkles } from 'lucide-react';

interface ProjectsEmptyStateProps {
  /** No projects in database vs. no matches for active filter */
  variant: 'empty' | 'filtered';
  filterLabel?: string;
}

export default function ProjectsEmptyState({ variant, filterLabel }: ProjectsEmptyStateProps) {
  const isFiltered = variant === 'filtered';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bento-grid min-h-[400px]"
    >
      <div
        className="bento-full relative flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-border bg-surface/40 px-6 py-16 text-center min-h-[400px] contain-[layout_style]"
        role="status"
        aria-live="polite"
      >
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface/80 text-foreground/50"
          aria-hidden="true"
        >
          {isFiltered ? <Layers className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
        </div>

        {isFiltered ? (
          <>
            <div className="space-y-2 max-w-md">
              <h3 className="text-lg font-heading font-600 text-foreground tracking-tight">
                No projects in &ldquo;{filterLabel}&rdquo;
              </h3>
              <p className="text-sm text-foreground/50 leading-relaxed">
                Try another category or view all work to see the full portfolio.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2 max-w-lg">
              <h3 className="text-xl md:text-2xl font-heading font-700 text-foreground tracking-tight">
                New work in progress
              </h3>
              <p className="text-sm md:text-base text-foreground/55 leading-relaxed font-light">
                Currently iterating on new engineering challenges. Stay tuned.
              </p>
            </div>
            <p className="text-xs text-foreground/35 tracking-wide uppercase">
              Case studies will appear here as they ship
            </p>
          </>
        )}

        {/* Subtle placeholder grid lines — preserves bento visual rhythm */}
        <div
          className="pointer-events-none absolute inset-4 grid grid-cols-3 grid-rows-2 gap-3 opacity-[0.04] dark:opacity-[0.06]"
          aria-hidden="true"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-foreground" />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
