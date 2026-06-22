'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Award,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';

// Import custom components
import ScrollyCanvas from '@/components/ScrollyCanvas';
import Overlay from '@/components/Overlay';
import Projects from '@/components/Projects';
import ContactForm from '@/components/ContactForm';
import ChatBot from '@/components/ChatBot';
import InteractiveTerminal from '@/components/InteractiveTerminal';
import InteractiveSkills from '@/components/InteractiveSkills';
import SectionReveal from '@/components/SectionReveal';
import { RepoData } from '@/lib/github';
import { db } from '@/lib/supabase';

gsap.registerPlugin(ScrollTrigger);

// Navigation Items
const NAV_ITEMS = [
  { name: 'Projects', href: '#projects' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Blog', href: '/blog' },
  { name: 'Resume', href: '/resume' },
];

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  avatar_url?: string;
  rating: number;
}

// ── Timeline data ──────────────────────────────────────────────────────────────
const TIMELINE_ITEMS = [
  {
    year: '2025 - Present',
    title: 'AI Engineer & Tech Lead',
    company: 'Creative Tech Lab',
    description: 'Architecting browser automation agents, local LLM RAG pipelines, and high-performance immersive WebGL user interfaces.',
    type: 'work'
  },
  {
    year: '2024 - 2025',
    title: 'Full Stack Engineer & AI Specialist',
    company: 'SaaS Automation Hub',
    description: 'Integrated OpenAI/Gemini models, optimized vector database latency, and developed core Next.js web portals.',
    type: 'work'
  },
  {
    year: '2023 - 2024',
    title: 'Creative Frontend Developer',
    company: 'Self-employed',
    description: 'Crafted award-nominated user interfaces using WebGL, GLSL shaders, GSAP timelines, and Framer Motion.',
    type: 'work'
  },
  {
    year: '2026 - 2030',
    title: 'B.S. in Computer Science',
    company: 'University Of Sindh, Jamshoro',
    description: 'Will Specialize in AI & ML, and Web Development.',
    type: 'education'
  }
];

// ── TimelineSection ────────────────────────────────────────────────────────────
// Scroll-linked vertical progress line via GSAP ScrollTrigger (viewport-gated,
// not scrubbed — no conflict with hero scrolly-canvas trigger).
function TimelineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const line = lineRef.current;
    if (!container || !line) return;

    // Respect reduced-motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      line.style.setProperty('--timeline-progress', '100%');
      nodeRefs.current.forEach((node) => node?.classList.add('active'));
      return;
    }

    const ctx = gsap.context(() => {
      // Animate the CSS custom property --timeline-progress from 0% → 100%
      // as the timeline section scrolls through the viewport.
      // Uses a plain object tween + onUpdate to set the CSS var.
      const progress = { value: 0 };
      gsap.to(progress, {
        value: 100,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 1.5,
          once: false, // allow re-scrub as user scrolls up/down
          onUpdate(self) {
            // Set the CSS variable driving the ::after height
            line.style.setProperty('--timeline-progress', `${self.progress * 100}%`);

            // Activate nodes sequentially as scroll progresses
            const nodeCount = nodeRefs.current.length;
            nodeRefs.current.forEach((node, idx) => {
              if (!node) return;
              const threshold = (idx / nodeCount);
              if (self.progress >= threshold) {
                node.classList.add('active');
              } else {
                node.classList.remove('active');
              }
            });
          },
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="lg:col-span-6 space-y-8">
      <h3 className="reveal-item text-lg font-bold text-white tracking-wider uppercase mb-6 flex items-center gap-2">
        <Award className="w-5 h-5 text-accent-purple" />
        Career Roadmap
      </h3>
      <div className="relative pl-6 space-y-12">
        {/* Scroll-linked vertical progress line */}
        <div
          ref={lineRef}
          className="timeline-line"
          aria-hidden="true"
        />

        {TIMELINE_ITEMS.map((item, idx) => (
          <div key={idx} className="reveal-item relative">
            {/* Node dot — activates via JS class toggle */}
            <div
              ref={(el) => { nodeRefs.current[idx] = el; }}
              className="timeline-node"
              aria-hidden="true"
            >
              <div className="node-dot" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-wider bg-white/5 border border-white/5 text-accent-purple px-2 py-0.5 rounded-full">
                {item.year}
              </span>
              <h4 className="text-md font-bold text-white mt-2 leading-tight">{item.title}</h4>
              <span className="text-xs text-zinc-500 font-medium">{item.company}</span>
              <p className="text-xs text-zinc-400 font-light leading-relaxed mt-2">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [repos, setRepos] = useState<RepoData[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load dynamic data
  useEffect(() => {
    // Mouse movement light beam tracker
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Fetch GitHub Repos
    fetch('/api/github')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRepos(data);
      })
      .catch((err) => console.error('Error fetching repositories:', err));

    // Fetch Testimonials
    db.getTestimonials().then((data) => setTestimonials(data));

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Compute Achievements stats
  const totalStars = repos.reduce((acc, repo) => acc + repo.stars, 0);
  const totalCommits = repos.reduce((acc, repo) => acc + (repo.commits_count || 0), 0);
  const projectsBuilt = repos.length > 0 ? repos.length : 12;

  return (
    <main className="relative min-h-screen bg-[#000000] overflow-x-hidden select-none">
      {/* Layer 0: Light glow spotlight lamp following cursor */}
      <div className="pointer-events-none fixed inset-0 z-[0] radial-spotlight" />

      {/* Layer 4b: Floating Header — z-[1000] */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] p-4 font-sans">
        <div className="max-w-5xl mx-auto rounded-full glass-panel px-6 py-3 flex items-center justify-between border-[rgba(228,222,216,0.08)] bg-black/50 backdrop-blur-xl">
          <Link href="#" className="text-sm font-bold tracking-widest text-white flex items-center gap-1.5 uppercase clickable">
            <Sparkles className="w-4 h-4 text-accent-purple animate-pulse" />
            Krish Baresha
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-xs tracking-wider text-zinc-400 hover:text-white transition-colors uppercase clickable"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <Link
            href="#contact"
            className="hidden md:inline-flex px-4 py-1.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-colors uppercase clickable"
          >
            Hire Me
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-zinc-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown — z-[50] inside the nav (nav itself is z-[1000]) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-18 left-4 right-4 rounded-2xl glass-panel p-6 border-white/5 bg-black/90 backdrop-blur-lg flex flex-col gap-4 md:hidden z-50"
            >
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm tracking-wider text-zinc-300 hover:text-white transition-colors uppercase py-1"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 w-full py-2.5 rounded-xl bg-white text-black text-center text-xs font-bold hover:bg-zinc-200 transition-colors uppercase"
              >
                Hire Me
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* SCENE 1 + 2 + 3: Cinematic Scrollytelling (hero) */}
      <ScrollyCanvas>
        <Overlay />
      </ScrollyCanvas>

      {/* SCENE 4 — Projects Work Grid ─────────────────────────────────────── */}
      <Projects />

      {/* SCENE 5 — About storytelling section ────────────────────────────── */}
      <section
        id="about"
        className="relative z-[100] py-32 px-6 bg-black/20 border-t border-[rgba(228,222,216,0.08)] font-sans"
      >
        <div className="max-w-5xl mx-auto space-y-24">
          <SectionReveal stagger={0.09} start="top 80%">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              
              {/* Journey description */}
              <div className="lg:col-span-6 space-y-6">
                <span className="reveal-item text-xs font-bold tracking-[0.2em] text-accent-purple uppercase">
                  The Story
                </span>
                <h2 className="reveal-item text-4xl font-extrabold tracking-tight text-white leading-tight">
                  DEVELOPER WHO THINKS IN PIXELS AND SYSTEM RUNTIMES.
                </h2>
                <p className="reveal-item text-zinc-400 font-light leading-relaxed">
                  My engineering journey is driven by an obsession with interactive digital craftsmanship. I design UI pipelines that feel physically responsive, while coordinating low-latency backend architectures.
                </p>
                <p className="reveal-item text-zinc-400 font-light leading-relaxed">
                  As AI shifts from raw LLM prompts to self-healing agentic actions, I bridge the gap by deploying vector indices, pgvector retrieval routes, and robust Puppeteer validation runners.
                </p>
                
                {/* Quick counter cards */}
                <div className="grid grid-cols-3 gap-4 pt-6">
                  <div className="reveal-item p-4 rounded-xl bg-white/[0.03] border border-[rgba(228,222,216,0.08)] text-center">
                    <div className="text-2xl font-bold text-[#ffffff] uppercase">{projectsBuilt}</div>
                    <div className="text-[10px] text-[#95979d] uppercase tracking-wider mt-1">Projects</div>
                  </div>
                  <div className="reveal-item p-4 rounded-xl bg-white/[0.03] border border-[rgba(228,222,216,0.08)] text-center">
                    <div className="text-2xl font-bold text-[#ffffff] uppercase">{totalStars > 0 ? totalStars : '83'}</div>
                    <div className="text-[10px] text-[#95979d] uppercase tracking-wider mt-1">Stars</div>
                  </div>
                  <div className="reveal-item p-4 rounded-xl bg-white/[0.03] border border-[rgba(228,222,216,0.08)] text-center">
                    <div className="text-2xl font-bold text-[#ffffff] uppercase">{totalCommits > 0 ? totalCommits : '290'}+</div>
                    <div className="text-[10px] text-[#95979d] uppercase tracking-wider mt-1">Commits</div>
                  </div>
                </div>
              </div>

              {/* Timeline roadmap — has its own GSAP scroll driver */}
              <TimelineSection />
            </div>
          </SectionReveal>

          {/* Interactive Shell / Terminal */}
          <SectionReveal start="top 85%">
            <div className="max-w-3xl mx-auto space-y-6 pt-8 border-t border-white/5">
              <div className="text-center space-y-2">
                <span className="reveal-item text-xs font-bold tracking-[0.2em] text-accent-purple uppercase">
                  Interactive Shell
                </span>
                <h3 className="reveal-item text-2xl font-extrabold text-white uppercase tracking-wider">
                  Developer Shell Workspace
                </h3>
                <p className="reveal-item text-zinc-500 text-xs font-light max-w-md mx-auto">
                  Interact directly with my background environment by submitting standard command directives.
                </p>
              </div>
              <div className="reveal-item">
                <InteractiveTerminal />
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* SCENE 6 — Skills Showcase section ───────────────────────────────── */}
      <section
        id="skills"
        className="relative z-[100] py-32 px-6 bg-[#000000] border-t border-[rgba(228,222,216,0.08)] font-sans"
      >
        <div className="max-w-6xl mx-auto space-y-16">
          <SectionReveal start="top 85%">
            <div className="text-center space-y-4">
              <span className="reveal-item text-xs font-bold tracking-[0.2em] text-accent-purple uppercase">
                Capability
              </span>
              <h2 className="reveal-item text-4xl md:text-5xl font-extrabold tracking-tight text-white uppercase">
                FUTURISTIC SKILL SPHERE
              </h2>
              <p className="reveal-item text-zinc-500 max-w-lg mx-auto text-sm font-light">
                Structured capabilities crossing high-performance creative UI systems, neural agents, and database runtimes.
              </p>
            </div>
          </SectionReveal>

          <InteractiveSkills />
        </div>
      </section>

      {/* Testimonials infinite scrolling */}
      {testimonials.length > 0 && (
        <section className="relative z-[100] py-32 bg-black/20 border-t border-white/5 overflow-hidden font-sans">
          <SectionReveal start="top 90%">
            <div className="max-w-6xl mx-auto px-6 mb-12">
              <span className="reveal-item text-xs font-bold tracking-[0.2em] text-accent-purple uppercase">
                Endorsements
              </span>
              <h2 className="reveal-item text-4xl font-extrabold tracking-tight text-white mt-2">
                CLIENT TESTIMONIALS
              </h2>
            </div>
          </SectionReveal>

          {/* Marquee Container — CSS animation, no JS scroll conflict */}
          <div className="flex w-[200vw] gap-6 animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused] whitespace-nowrap">
            <div className="flex gap-6 justify-around w-full">
              {testimonials.concat(testimonials).map((t, idx) => (
                <div 
                  key={idx} 
                  className="w-[350px] inline-block shrink-0 rounded-2xl glass-panel p-6 whitespace-normal border-white/5"
                >
                  <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={t.avatar_url} 
                      alt={t.name} 
                      className="w-10 h-10 rounded-full object-cover border border-white/10"
                    />
                    <div>
                      <div className="text-sm font-bold text-white">{t.name}</div>
                      <div className="text-[10px] text-zinc-500 font-semibold tracking-wider uppercase">
                        {t.role} @ {t.company}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <style jsx global>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
        </section>
      )}

      {/* SCENE 7 — Contact Section ───────────────────────────────────────── */}
      <section
        id="contact"
        className="relative z-[100] py-32 px-6 bg-[#000000] border-t border-[rgba(228,222,216,0.08)] font-sans"
      >
        <div className="max-w-6xl mx-auto">
          <SectionReveal start="top 85%">
            <div className="reveal-item">
              <ContactForm />
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Bottom Footer */}
      <footer className="relative z-[100] border-t border-[rgba(228,222,216,0.08)] bg-black/80 py-12 px-6 text-[#95979d] font-sans text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white uppercase tracking-wider">Krish Baresha</span>
            <span>&copy; {new Date().getFullYear()} All Rights Reserved.</span>
          </div>

        </div>
      </footer>

      {/* Layer 5b: Floating ChatBot Panel */}
      <ChatBot />
    </main>
  );
}
