'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from './Icons';

const SOCIAL_LINKS = [
  { href: 'https://github.com/krishbaresha', label: 'GitHub', icon: GithubIcon },
  { href: 'https://www.linkedin.com/in/krish-baresha/', label: 'LinkedIn', icon: LinkedinIcon },
  { href: 'https://twitter.com/krishbaresha', label: 'Twitter', icon: TwitterIcon },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden"
      aria-label="Hero section"
    >
      {/* Centered content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto text-center space-y-8"
      >
        {/* Status badge */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 liquid-glass rounded-full text-xs font-medium tracking-wide text-foreground/70 border border-amber-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
            Available for freelance work · Based in Pakistan
          </div>
        </motion.div>

        {/* Main heading with chromatic aberration */}
        <motion.div variants={itemVariants}>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-700 leading-none tracking-tighter text-foreground">
            <span
              className="text-chroma block"
              data-text="AI Engineer"
              aria-hidden="true"
            />
            <span className="sr-only">AI Engineer</span>
            <span
              className="text-chroma block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"
              data-text="& Designer."
              aria-hidden="true"
            />
            <span className="sr-only">& Designer.</span>
          </h1>
        </motion.div>

        {/* Sub-heading */}
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-foreground/60 max-w-2xl mx-auto font-light leading-relaxed"
        >
          I build high-performance SaaS products, autonomous AI agents, and
          pixel-perfect interfaces that feel as good as they look.
        </motion.p>

        {/* CTA row */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            id="hero-cta-projects"
            href="#projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-semibold text-sm tracking-wide transition-all duration-200 shadow-xl shadow-amber-500/25 hover:shadow-amber-400/35 cursor-pointer group"
          >
            View Work
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            id="hero-cta-contact"
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl liquid-glass liquid-glass-hover text-foreground font-medium text-sm tracking-wide cursor-pointer"
          >
            Get in touch
          </Link>
        </motion.div>

        {/* Social row */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-3"
        >
          {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-xl liquid-glass liquid-glass-hover flex items-center justify-center text-foreground/50 hover:text-foreground transition-colors cursor-pointer"
            >
              <Icon className="w-4 h-4" />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="text-[10px] tracking-widest text-foreground/30 uppercase">scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-foreground/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}
