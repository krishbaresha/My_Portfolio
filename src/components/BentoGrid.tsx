'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, ArrowUpRight, Star, Layers, Target, TrendingUp } from 'lucide-react';
import { GithubIcon } from './Icons';
import { IMAGE_SIZES, PRIORITY_IMAGE_COUNT } from '@/lib/assets';
import type { Project } from '@/lib/supabase';

const BENTO_SIZES = [
  'bento-lg',
  'bento-md',
  'bento-sm',
  'bento-sm',
  'bento-sm',
  'bento-md',
  'bento-md',
  'bento-sm',
  'bento-sm',
  'bento-sm',
];

const FILTERS = ['All', 'AI', 'WebGL', 'Full Stack', 'SaaS'] as const;

function getBentoSize(idx: number) {
  return BENTO_SIZES[idx % BENTO_SIZES.length];
}

function matchesFilter(project: Project, filter: string) {
  if (filter === 'All') return true;
  return project.category?.toLowerCase() === filter.toLowerCase();
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface/80 px-2.5 py-1.5 min-w-0">
      <div className="text-[10px] uppercase tracking-wider text-foreground/40 truncate">{label}</div>
      <div className="text-sm font-semibold text-foreground tabular-nums truncate">{value}</div>
    </div>
  );
}

function BentoCard({
  project,
  size,
  priority,
  index,
}: {
  project: Project;
  size: string;
  priority: boolean;
  index: number;
}) {
  const isLarge = size === 'bento-lg' || size === 'bento-xl';
  const metrics = project.impact_metrics?.slice(0, isLarge ? 3 : 2) ?? [];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className={`${size} group relative overflow-hidden rounded-2xl border border-border bg-surface/60 backdrop-blur-sm hover:border-foreground/20 hover:bg-surface transition-colors duration-300 contain-[layout_style]`}
      style={{ minHeight: isLarge ? '360px' : '240px', height: isLarge ? '360px' : '240px' }}
    >
      {project.thumbnail ? (
        <div className="absolute inset-0">
          <Image
            src={project.thumbnail}
            alt=""
            fill
            sizes={isLarge ? IMAGE_SIZES.bentoFeatured : IMAGE_SIZES.bentoStandard}
            className="object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-500"
            priority={priority}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
        </div>
      ) : (
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(circle at 20% 20%, var(--mesh-color-a), transparent 50%), radial-gradient(circle at 80% 80%, var(--mesh-color-b), transparent 50%)',
          }}
        />
      )}

      <div className="relative z-10 h-full min-h-0 flex flex-col p-5 gap-3 overflow-hidden">
        <div className="flex items-start justify-between gap-2 shrink-0">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            {project.featured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-foreground text-background text-[10px] font-semibold uppercase tracking-wider">
                <Star className="w-2.5 h-2.5 fill-current" />
                Featured
              </span>
            )}
            <span className="px-2 py-0.5 rounded-md border border-border text-[10px] font-medium text-foreground/50 uppercase tracking-wider">
              {project.category}
            </span>
          </div>
          <Link
            href={`/projects/${project.slug}`}
            className="shrink-0 w-8 h-8 rounded-lg border border-border flex items-center justify-center text-foreground/40 hover:text-foreground hover:border-foreground/30 transition-colors"
            aria-label={`Open ${project.title} case study`}
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex-1 space-y-3 min-h-0">
          <h3 className={`font-heading font-700 text-foreground leading-tight tracking-tight ${isLarge ? 'text-2xl' : 'text-lg'}`}>
            {project.title}
          </h3>

          {project.technical_challenge && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-foreground/40">
                <Target className="w-3 h-3" />
                Challenge
              </div>
              <p className={`text-foreground/70 leading-relaxed ${isLarge ? 'text-sm line-clamp-3' : 'text-xs line-clamp-2'}`}>
                {project.technical_challenge}
              </p>
            </div>
          )}

          {isLarge && project.architecture && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-foreground/40">
                <Layers className="w-3 h-3" />
                Architecture
              </div>
              <p className="text-xs text-foreground/60 font-mono leading-relaxed line-clamp-2">
                {project.architecture}
              </p>
            </div>
          )}
        </div>

        {metrics.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-foreground/40">
              <TrendingUp className="w-3 h-3" />
              Impact
            </div>
            <div className={`grid gap-2 ${isLarge ? 'grid-cols-3' : 'grid-cols-2'}`}>
              {metrics.map((m) => (
                <MetricPill key={`${m.label}-${m.value}`} label={m.label} value={m.value} />
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.tech_stack.slice(0, isLarge ? 4 : 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-md text-[10px] font-medium border border-border text-foreground/50"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-foreground/50 hover:text-foreground transition-colors"
            >
              <GithubIcon className="w-3.5 h-3.5" />
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Live demo"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-foreground/50 hover:text-foreground transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function BentoGrid({ projects }: { projects: Project[] }) {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filtered = useMemo(
    () => projects.filter((p) => matchesFilter(p, activeFilter)),
    [projects, activeFilter]
  );

  return (
    <section id="projects" className="relative z-10 py-24 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 min-h-[7.5rem]"
        >
          <div className="space-y-3 max-w-lg min-w-0">
            <p className="text-xs font-medium tracking-widest text-foreground/40 uppercase">
              Work
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-700 text-foreground tracking-tight">
              Engineering outcomes, not screenshots.
            </h2>
            <p className="text-sm text-foreground/50 leading-relaxed">
              Each card documents the problem solved, the system design, and measurable business impact.
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap p-1 rounded-xl border border-border bg-surface/50" role="tablist">
            {FILTERS.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={activeFilter === f}
                onClick={() => setActiveFilter(f)}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeFilter === f
                    ? 'text-background'
                    : 'text-foreground/50 hover:text-foreground'
                }`}
              >
                {activeFilter === f && (
                  <motion.span
                    layoutId="bento-filter"
                    className="absolute inset-0 rounded-lg bg-foreground"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
                  />
                )}
                <span className="relative z-10">{f}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <LayoutGroup>
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              <motion.div layout className="bento-grid">
                {filtered.map((project, idx) => (
                  <BentoCard
                    key={project.id}
                    project={project}
                    size={getBentoSize(idx)}
                    priority={idx < PRIORITY_IMAGE_COUNT}
                    index={idx}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-40 rounded-2xl border border-dashed border-border"
              >
                <p className="text-foreground/40 text-sm">No projects in &ldquo;{activeFilter}&rdquo;</p>
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </section>
  );
}
