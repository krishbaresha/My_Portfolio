/**
 * Home Page — React Server Component
 *
 * Data is fetched server-side via getProjects().
 * No useEffect, no useState at the page level.
 * Client-interactivity is delegated to client components.
 */

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import BentoGrid from '@/components/BentoGrid';
import BentoSkeleton from '@/components/BentoSkeleton';
import TestimonialsSection from '@/components/TestimonialsSection';
import TestimonialsSkeleton from '@/components/TestimonialsSkeleton';
import InteractiveSkills from '@/components/InteractiveSkills';
import ContactForm from '@/components/ContactForm';
import SectionReveal, { RevealItem } from '@/components/SectionReveal';
import { getProjects } from '@/lib/projects';
import { Award, Sparkles, GitBranch, Code2, Brain } from 'lucide-react';

const ScrollSequence = dynamic(() => import('@/components/ScrollSequence'), {
  ssr: false,
  loading: () => null,
});

// ─── Timeline data ────────────────────────────────────────────────────────────
const TIMELINE_ITEMS = [
  {
    year: '2025 — Present',
    title: 'AI Engineer & Tech Lead',
    company: 'Creative Tech Lab',
    description:
      'Architecting browser automation agents, local LLM RAG pipelines, and high-performance immersive interfaces.',
    icon: Brain,
  },
  {
    year: '2024 — 2025',
    title: 'Full Stack Engineer & AI Specialist',
    company: 'SaaS Automation Hub',
    description:
      'Integrated OpenAI/Gemini models, optimized vector database latency, and developed core Next.js web portals.',
    icon: Code2,
  },
  {
    year: '2023 — 2024',
    title: 'Creative Frontend Developer',
    company: 'Self-employed',
    description:
      'Crafted award-nominated user interfaces using WebGL, GLSL shaders, GSAP timelines, and Framer Motion.',
    icon: Sparkles,
  },
  {
    year: '2026 — 2030',
    title: 'B.S. in Computer Science',
    company: 'University Of Sindh, Jamshoro',
    description: 'Specializing in AI & ML, and Full Stack Web Development.',
    icon: Award,
  },
];

// ─── Stats ────────────────────────────────────────────────────────────────────
const STATS = [
  { value: '12+', label: 'Projects' },
  { value: '83', label: 'GitHub Stars' },
  { value: '290+', label: 'Commits' },
];

// ─── Testimonials section (async, streamed) ──────────────────────────────────

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function Home() {
  const projects = await getProjects();

  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">

      {/* Animated mesh background */}
      <div className="mesh-background" aria-hidden="true">
        <div className="mesh-blob mesh-blob-a" />
        <div className="mesh-blob mesh-blob-b" />
        <div className="mesh-blob mesh-blob-c" />
      </div>

      {/* Floating NavBar */}
      <NavBar />

      {/* ── Hero ── */}
      <HeroSection />

      {/* ── Scroll sequence (hidden if frames missing) ── */}
      <ScrollSequence />

      {/* ── Projects Bento Grid ── */}
      <Suspense fallback={<BentoSkeleton />}>
        <BentoGrid projects={projects} />
      </Suspense>

      {/* ── About Section ── */}
      <section
        id="about"
        className="relative z-10 py-24 px-6 border-t border-foreground/8"
      >
        <div className="max-w-5xl mx-auto">
          <SectionReveal stagger={0.08}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

              {/* Left — story */}
              <div className="space-y-6">
                <RevealItem>
                  <span className="text-xs font-semibold tracking-[0.2em] text-amber-500 uppercase">
                    The Story
                  </span>
                </RevealItem>
                <RevealItem>
                  <h2 className="text-4xl md:text-5xl font-heading font-700 text-foreground leading-tight tracking-tight">
                    Developer who thinks in pixels and system runtimes.
                  </h2>
                </RevealItem>
                <RevealItem>
                  <p className="text-foreground/60 font-light leading-relaxed">
                    My engineering journey is driven by an obsession with interactive digital craftsmanship. I design UI pipelines that feel physically responsive, while coordinating low-latency backend architectures.
                  </p>
                </RevealItem>
                <RevealItem>
                  <p className="text-foreground/60 font-light leading-relaxed">
                    As AI shifts from raw LLM prompts to self-healing agentic actions, I bridge the gap by deploying vector indices, pgvector retrieval routes, and robust automation runners.
                  </p>
                </RevealItem>

                {/* Stats */}
                <RevealItem>
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    {STATS.map((s) => (
                      <div
                        key={s.label}
                        className="liquid-glass p-4 text-center rounded-2xl"
                      >
                        <div className="text-2xl font-heading font-700 text-foreground">
                          {s.value}
                        </div>
                        <div className="text-[10px] text-foreground/40 uppercase tracking-wider mt-1">
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </RevealItem>
              </div>

              {/* Right — timeline */}
              <div className="space-y-6" id="experience">
                <RevealItem>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-semibold tracking-[0.2em] text-amber-500 uppercase">
                      Career Roadmap
                    </span>
                  </div>
                </RevealItem>

                <div className="space-y-4">
                  {TIMELINE_ITEMS.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <RevealItem key={idx}>
                        <div className="liquid-glass liquid-glass-hover p-5 rounded-2xl flex gap-4 items-start">
                          <div className="shrink-0 w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mt-0.5">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-mono tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                              {item.year}
                            </span>
                            <h4 className="text-sm font-heading font-600 text-foreground mt-2 leading-tight">
                              {item.title}
                            </h4>
                            <span className="text-xs text-foreground/40 font-medium">
                              {item.company}
                            </span>
                            <p className="text-xs text-foreground/50 font-light leading-relaxed mt-1.5">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </RevealItem>
                    );
                  })}
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── Skills Section ── */}
      <section
        id="skills"
        className="relative z-10 py-24 px-6 border-t border-foreground/8"
      >
        <div className="max-w-6xl mx-auto space-y-16">
          <SectionReveal>
            <div className="text-center space-y-4 max-w-xl mx-auto">
              <RevealItem>
                <span className="text-xs font-semibold tracking-[0.2em] text-amber-500 uppercase">
                  Capabilities
                </span>
              </RevealItem>
              <RevealItem>
                <h2 className="text-4xl md:text-5xl font-heading font-700 text-foreground tracking-tight">
                  Technical Skills
                </h2>
              </RevealItem>
              <RevealItem>
                <p className="text-foreground/50 text-sm font-light leading-relaxed">
                  Structured capabilities spanning high-performance creative UI systems, neural agents, and database runtimes.
                </p>
              </RevealItem>
            </div>
          </SectionReveal>

          <InteractiveSkills />
        </div>
      </section>

      {/* ── Testimonials ── */}
      <Suspense fallback={<TestimonialsSkeleton />}>
        <TestimonialsSection />
      </Suspense>

      {/* ── Contact Section ── */}
      <section
        id="contact"
        className="relative z-10 py-24 px-6 border-t border-foreground/8"
      >
        <div className="max-w-6xl mx-auto">
          <SectionReveal>
            <RevealItem>
              <ContactForm />
            </RevealItem>
          </SectionReveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-foreground/8 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-foreground/40 text-xs">
          <div className="flex items-center gap-2">
            <GitBranch className="w-3.5 h-3.5" />
            <span className="font-heading font-600 text-foreground/60">Krish Baresha</span>
            <span>© {new Date().getFullYear()} — All Rights Reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/krishbaresha" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              GitHub
            </a>
            <a href="https://linkedin.com/in/krishbaresha" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              LinkedIn
            </a>
            <a href="mailto:krishbareshaworking@gmail.com" className="hover:text-foreground transition-colors">
              Email
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
