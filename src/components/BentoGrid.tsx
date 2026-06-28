'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, ArrowRight, Star } from 'lucide-react';
import { GithubIcon } from './Icons';
import type { Project } from '@/lib/supabase';

// ─── Bento size map — gives each card position a responsive span class ────────
const BENTO_SIZES = [
  'bento-lg',   // 0 — big featured card
  'bento-md',   // 1 — medium
  'bento-sm',   // 2
  'bento-sm',   // 3
  'bento-sm',   // 4
  'bento-md',   // 5
  'bento-md',   // 6
  'bento-sm',   // 7
  'bento-sm',   // 8
  'bento-sm',   // 9
];

function getBentoSize(idx: number) {
  return BENTO_SIZES[idx % BENTO_SIZES.length];
}

// ─── Filter categories ────────────────────────────────────────────────────────
const FILTERS = ['All', 'AI', 'WebGL', 'Full Stack', 'SaaS'];

function matchesFilter(project: Project, filter: string) {
  if (filter === 'All') return true;
  const haystack = [...project.tech_stack, project.title, project.description ?? '']
    .join(' ')
    .toLowerCase();
  return haystack.includes(filter.toLowerCase());
}

// ─── Individual Bento Card ────────────────────────────────────────────────────
function BentoCard({
  project,
  size,
  priority,
}: {
  project: Project;
  size: string;
  priority: boolean;
}) {
  const isLarge = size === 'bento-lg' || size === 'bento-xl';

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`${size} liquid-glass iridescent-glow group relative overflow-hidden cursor-pointer`}
      style={{ minHeight: isLarge ? '320px' : '220px' }}
    >
      {/* Thumbnail */}
      {project.thumbnail && (
        <div className="absolute inset-0">
          <Image
            src={project.thumbnail}
            alt={`${project.title} project thumbnail`}
            fill
            sizes={isLarge ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            priority={priority}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        </div>
      )}

      {/* Liquid glass tint on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-amber-500/5 via-purple-500/5 to-blue-500/5" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-5 gap-3">
        {/* Featured badge */}
        {project.featured && (
          <div className="self-start inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-semibold tracking-wider uppercase">
            <Star className="w-2.5 h-2.5 fill-amber-400" />
            Featured
          </div>
        )}

        {/* Title */}
        <h3 className={`font-heading font-700 text-white leading-tight ${isLarge ? 'text-2xl' : 'text-lg'}`}>
          {project.title}
        </h3>

        {/* Description — only on larger cards */}
        {isLarge && project.description && (
          <p className="text-white/70 text-sm font-light leading-relaxed line-clamp-2">
            {project.description}
          </p>
        )}

        {/* Tech stack tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tech_stack.slice(0, isLarge ? 5 : 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/10 border border-white/10 text-white/70 backdrop-blur-sm"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links row */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} GitHub repository`}
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-lg liquid-glass flex items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              <GithubIcon className="w-3.5 h-3.5" />
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} live demo`}
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-lg liquid-glass flex items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <Link
            href={`/projects/${project.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="ml-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/90 hover:bg-amber-400 text-white text-xs font-semibold transition-colors"
          >
            Case Study <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

// ─── BentoGrid ────────────────────────────────────────────────────────────────
export default function BentoGrid({ projects }: { projects: Project[] }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = useMemo(
    () => projects.filter((p) => matchesFilter(p, activeFilter)),
    [projects, activeFilter]
  );

  return (
    <section id="projects" className="relative z-10 py-24 px-6">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold tracking-[0.2em] text-amber-500 uppercase">
              Selected Work
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-700 text-foreground tracking-tight">
              Projects
            </h2>
            <p className="text-foreground/50 text-sm font-light max-w-sm leading-relaxed">
              A curated showcase of systems, interfaces, and AI-powered experiences.
            </p>
          </div>

          {/* Filter tabs */}
          <div
            className="flex items-center gap-2 flex-wrap"
            role="tablist"
            aria-label="Project filter"
          >
            {FILTERS.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={activeFilter === f}
                onClick={() => setActiveFilter(f)}
                className={`relative px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  activeFilter === f
                    ? 'text-white'
                    : 'text-foreground/50 hover:text-foreground liquid-glass'
                }`}
              >
                {activeFilter === f && (
                  <motion.span
                    layoutId="active-filter"
                    className="absolute inset-0 rounded-full bg-amber-500"
                    transition={{ type: 'spring', bounce: 0.25, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{f}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid */}
        <LayoutGroup>
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              <motion.div layout className="bento-grid">
                {filtered.map((project, idx) => (
                  <BentoCard
                    key={project.id}
                    project={project}
                    size={getBentoSize(idx)}
                    priority={idx < 2}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-40 liquid-glass rounded-2xl"
              >
                <p className="text-foreground/40 text-sm">No projects found for &ldquo;{activeFilter}&rdquo;</p>
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </section>
  );
}
