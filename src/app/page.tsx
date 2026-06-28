/**
 * Home Page — React Server Component
 *
 * Architecture:
 *   RSC shell (static sections) + Suspense boundaries for dynamic islands.
 *   Projects and testimonials stream independently with skeleton fallbacks.
 *   No heavy scroll animations — Framer Motion entrance only in client children.
 */

import { Suspense } from 'react';
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

const STATS = [
  { value: '12+', label: 'Projects' },
  { value: '94%', label: 'Avg. success rate' },
  { value: '<1s', label: 'Target LCP' },
];

async function ProjectsSection() {
  const projects = await getProjects();
  return <BentoGrid projects={projects} />;
}

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">
      <div className="mesh-background" aria-hidden="true">
        <div className="mesh-blob mesh-blob-a" />
        <div className="mesh-blob mesh-blob-b" />
        <div className="mesh-blob mesh-blob-c" />
      </div>

      <NavBar />
      <HeroSection />

      <Suspense fallback={<BentoSkeleton />}>
        <ProjectsSection />
      </Suspense>

      <section id="about" className="relative z-10 py-24 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <SectionReveal stagger={0.08}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div className="space-y-6">
                <RevealItem>
                  <p className="text-xs font-medium tracking-widest text-foreground/40 uppercase">About</p>
                </RevealItem>
                <RevealItem>
                  <h2 className="text-3xl md:text-4xl font-heading font-700 text-foreground leading-tight tracking-tight">
                    Systems engineer with a product design sensibility.
                  </h2>
                </RevealItem>
                <RevealItem>
                  <p className="text-foreground/60 font-light leading-relaxed">
                    I build SaaS-grade interfaces backed by measurable performance budgets. Every project ships with
                    clear architecture decisions and business metrics — not vanity demos.
                  </p>
                </RevealItem>
                <RevealItem>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {STATS.map((s) => (
                      <div key={s.label} className="rounded-xl border border-border bg-surface/50 p-4 text-center">
                        <div className="text-xl font-heading font-700 text-foreground tabular-nums">{s.value}</div>
                        <div className="text-[10px] text-foreground/40 uppercase tracking-wider mt-1">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </RevealItem>
              </div>

              <div className="space-y-6" id="experience">
                <RevealItem>
                  <p className="text-xs font-medium tracking-widest text-foreground/40 uppercase">Experience</p>
                </RevealItem>
                <div className="space-y-3">
                  {TIMELINE_ITEMS.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <RevealItem key={idx}>
                        <div className="rounded-xl border border-border bg-surface/50 p-5 flex gap-4 items-start hover:border-foreground/20 transition-colors">
                          <div className="shrink-0 w-9 h-9 rounded-lg border border-border flex items-center justify-center text-foreground/60">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-mono text-foreground/40">{item.year}</span>
                            <h4 className="text-sm font-heading font-600 text-foreground mt-1">{item.title}</h4>
                            <span className="text-xs text-foreground/40">{item.company}</span>
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

      <section id="skills" className="relative z-10 py-24 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto space-y-16">
          <SectionReveal>
            <div className="text-center space-y-3 max-w-xl mx-auto">
              <RevealItem>
                <p className="text-xs font-medium tracking-widest text-foreground/40 uppercase">Stack</p>
              </RevealItem>
              <RevealItem>
                <h2 className="text-3xl md:text-4xl font-heading font-700 text-foreground tracking-tight">
                  Technical capabilities
                </h2>
              </RevealItem>
            </div>
          </SectionReveal>
          <InteractiveSkills />
        </div>
      </section>

      <Suspense fallback={<TestimonialsSkeleton />}>
        <TestimonialsSection />
      </Suspense>

      <section id="contact" className="relative z-10 py-24 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <SectionReveal>
            <RevealItem>
              <ContactForm />
            </RevealItem>
          </SectionReveal>
        </div>
      </section>

      <footer className="relative z-10 border-t border-border py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-foreground/40 text-xs">
          <div className="flex items-center gap-2">
            <GitBranch className="w-3.5 h-3.5" />
            <span className="font-heading font-600 text-foreground/60">Krish Baresha</span>
            <span>© {new Date().getFullYear()}</span>
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
