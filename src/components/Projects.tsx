'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, GitBranch, ExternalLink, Star } from 'lucide-react';
import SectionReveal from './SectionReveal';
import { RepoData } from '@/lib/github';
import { db } from '@/lib/supabase';

export default function Projects() {
  const [repos, setRepos] = useState<RepoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    async function loadProjects() {
      try {
        const [githubRes, settings] = await Promise.all([
          fetch('/api/github').then((res) => res.json()),
          db.getProjectSettings ? db.getProjectSettings() : Promise.resolve({})
        ]);

        if (Array.isArray(githubRes)) {
          let filtered = githubRes.map(repo => {
            const setting = settings[repo.name] || {
              visible: ['neuro-flow', 'aurora-canvas', 'synapse-rag'].includes(repo.name.toLowerCase()),
              customThumbnail: ''
            };
            return {
              ...repo,
              visible: setting.visible,
              thumbnail: setting.customThumbnail || repo.thumbnail,
              customDescription: setting.customDescription,
              customWebsite: setting.customWebsite,
              certificateLink: setting.certificateLink
            };
          }).filter(repo => repo.visible);

          // Fallback to defaults if no visibility flags are checked
          if (filtered.length === 0) {
            filtered = githubRes
              .filter(repo => ['neuro-flow', 'aurora-canvas', 'synapse-rag'].includes(repo.name.toLowerCase()))
              .map(repo => {
                const setting = settings[repo.name] || {};
                return {
                  ...repo,
                  thumbnail: setting.customThumbnail || repo.thumbnail,
                  customDescription: setting.customDescription,
                  customWebsite: setting.customWebsite,
                  certificateLink: setting.certificateLink
                };
              });
          }

          setRepos(filtered);
        }
      } catch (err) {
        console.error('Error fetching repositories:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  const nextSlide = () => {
    if (repos.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % repos.length);
  };

  const prevSlide = () => {
    if (repos.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + repos.length) % repos.length);
  };

  return (
    <section id="projects" className="relative z-[100] py-32 px-6 bg-[#000000] font-sans overflow-hidden">
      {/* Blurred background image that transitions smoothly */}
      {repos.length > 0 && (
        <div className="absolute inset-0 z-0 pointer-events-none transition-all duration-1000 ease-in-out opacity-20 blur-[120px] scale-110">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={repos[activeIndex].thumbnail}
            alt="Blur Background"
            className="w-full h-full object-cover transition-opacity duration-1000"
          />
          <div className="absolute inset-0 bg-[#000000] opacity-80" />
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* Section Header */}
        <SectionReveal start="top 90%">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 reveal-item">
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-accent-purple uppercase">
                Selected Work
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mt-2 uppercase">
                Case Studies
              </h2>
            </div>
            <p className="text-zinc-500 max-w-sm text-sm font-light leading-relaxed">
              An interactive, immersive showcase of selected systems and interfaces, customizable via the admin panel.
            </p>
          </div>
        </SectionReveal>

        {/* Carousel Slider */}
        {loading ? (
          <div className="h-[460px] rounded-2xl bg-white/5 border border-white/5 animate-pulse flex items-center justify-center">
            <span className="text-zinc-500 text-sm">Loading Project Canvas...</span>
          </div>
        ) : repos.length === 0 ? (
          <div className="h-[460px] rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
            <span className="text-zinc-500 text-sm">No visible projects found.</span>
          </div>
        ) : (
          <div className="relative">
            {/* Slider Cards Container */}
            <div className="flex flex-col lg:flex-row gap-12 items-center min-h-[480px]">
              
              {/* Left Column: Interactive Card Showcase */}
              <div className="w-full lg:w-1/2 flex justify-center relative h-[300px] sm:h-[380px] lg:h-[400px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 0.95, x: -30 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95, x: 30 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full relative rounded-2xl overflow-hidden group border border-white/10 contact-card shadow-2xl"
                  >
                    {/* Image cover */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={repos[activeIndex].thumbnail}
                      alt={repos[activeIndex].name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    
                    {/* Floating Stars */}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <div className="px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider bg-black/60 border border-white/10 text-yellow-400 flex items-center gap-1.5 backdrop-blur-md">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {repos[activeIndex].stars}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Column: Dynamic Project Info and Controls */}
              <div className="w-full lg:w-1/2 space-y-6 flex flex-col justify-between h-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6"
                  >
                    {/* Index Indicator */}
                    <div className="text-[10px] font-mono tracking-widest text-accent-purple uppercase font-bold">
                      Project {activeIndex + 1} of {repos.length}
                    </div>

                    {/* Project Title */}
                    <h3 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight leading-none hover:text-accent-purple transition-colors">
                      {repos[activeIndex].name}
                    </h3>

                    {/* Project Description */}
                    <p className="text-zinc-300 font-light text-sm sm:text-base leading-relaxed">
                      {repos[activeIndex].customDescription || repos[activeIndex].description || 'High-fidelity project demonstrating full stack integration and interactive performance.'}
                    </p>

                    {/* Tech Stack Tags */}
                    <div className="flex flex-wrap gap-2">
                      {repos[activeIndex].topics.slice(0, 5).map((topic) => (
                        <span
                          key={topic}
                          className="px-2.5 py-1 rounded-md text-[10px] font-mono bg-white/5 border border-white/5 text-zinc-300"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>

                    {/* Project Architecture */}
                    {repos[activeIndex].architecture && (
                      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-1">
                        <span className="text-[9px] font-bold text-accent-blue uppercase tracking-widest block">Architecture</span>
                        <p className="text-xs text-zinc-400 font-light leading-relaxed">{repos[activeIndex].architecture}</p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Footer Controls & Navigation */}
                <div className="flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-6 mt-4">
                  {/* Left: Project Links */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <a
                      href={repos[activeIndex].html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-zinc-400 hover:text-white transition-all flex items-center justify-center clickable"
                      aria-label="GitHub Repository"
                    >
                      <GitBranch className="w-5 h-5" />
                    </a>

                    {(repos[activeIndex].customWebsite || repos[activeIndex].homepage) && (
                      <a
                        href={repos[activeIndex].customWebsite || repos[activeIndex].homepage || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-zinc-400 hover:text-white transition-all flex items-center justify-center clickable"
                        aria-label="Live Demonstration"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}

                    {repos[activeIndex].certificateLink && (
                      <a
                        href={repos[activeIndex].certificateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 hover:from-yellow-500/40 hover:to-orange-500/40 text-yellow-500 hover:text-yellow-400 transition-all flex items-center justify-center clickable"
                        aria-label="View Certificate or Award"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
                      </a>
                    )}

                    <a
                      href={`/projects/${repos[activeIndex].name.toLowerCase()}`}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue text-white text-xs font-bold tracking-wider uppercase transition-all hover:brightness-110 flex items-center gap-1.5 clickable"
                    >
                      Explore Case Study <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Right: Slide Controls (Arrows) */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={prevSlide}
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-white transition-all flex items-center justify-center cursor-pointer clickable active:scale-95"
                      aria-label="Previous Project"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-white transition-all flex items-center justify-center cursor-pointer clickable active:scale-95"
                      aria-label="Next Project"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Bullet Indicators */}
                <div className="flex items-center gap-2 mt-4">
                  {repos.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-350 cursor-pointer clickable ${
                        idx === activeIndex
                          ? 'w-8 bg-accent-purple'
                          : 'w-2 bg-white/20 hover:bg-white/40'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
