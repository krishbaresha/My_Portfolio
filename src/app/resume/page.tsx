'use client';

import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  GitBranch,
  Link2,
  Mail,
  MapPin,
  Calendar,
  Code2,
  Cpu,
  CloudSun,
  Sparkles,
  Award,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

const SKILLS = {
  frontend: ['Next.js 15', 'React', 'TypeScript', 'TailwindCSS', 'GSAP', 'Framer Motion', 'Three.js', 'WebGL/GLSL'],
  backend: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Supabase', 'REST APIs', 'Redis'],
  ai: ['OpenAI API', 'Gemini API', 'LangChain', 'pgvector', 'RAG Pipelines', 'Agentic Automation', 'Prompt Engineering'],
  cloud: ['AWS (EC2, S3, Lambda)', 'Vercel', 'Docker', 'CI/CD Pipelines', 'Supabase'],
};

const EXPERIENCE = [
  {
    role: 'Senior AI Engineer & Tech Lead',
    company: 'Creative Tech Lab',
    period: 'Jan 2025 – Present',
    location: 'Remote',
    bullets: [
      'Architected multi-agent browser automation frameworks using Puppeteer, reducing manual QA effort by 70%.',
      'Built RAG pipelines with pgvector cosine-similarity search, achieving sub-200ms document retrieval.',
      'Designed WebGL + Three.js dashboards with custom GLSL displacement shaders, reaching 98 Lighthouse scores.',
      'Led a 4-member engineering team, establishing CI/CD standards on Vercel and AWS.',
    ],
  },
  {
    role: 'Creative Frontend Developer',
    company: 'Digital Interaction Agency',
    period: 'Jul 2023 – Feb 2024',
    location: 'Karachi, Pakistan',
    bullets: [
      'Delivered award-nominated landing pages for enterprise clients using GSAP ScrollTrigger and Framer Motion.',
      'Built custom React component libraries (20+ components), decreasing development time by 40%.',
      'Implemented responsive WebGL particle systems achieving 60fps on mobile devices.',
    ],
  },
];

const EDUCATION = [
  {
    degree: 'B.S. in Computer Science',
    institution: 'University Of Sindh',
    period: '2026 – 2030',
    notes: 'Specialization in AI/ML and Software Engineering.',
  },
];

const CERTIFICATIONS = [
  { name: 'HEC Generative AI Training', issuer: 'HEC', year: '2026' },
];

const PROJECTS = [
  {
    name: 'Electro-Track',
    description: 'SaaS platform to manage electricity theft and billing for residential areas.',
    tech: 'Next.js 15, TypeScript, TailwindCSS',
    url: 'https://github.com/krishbaresha/electrotrack-saas',
  },
  {
    name: 'Invoice-ERP-System',
    description: 'Invoice and inventory management system for small businesses.',
    tech: 'Node.js, Express, PostgreSQL, React, TailwindCSS',
    url: 'https://github.com/krishbaresha/Invoice-ERP-System',
  },
  {
    name: 'Mehfooz AI',
    description: 'AI-powered app to send alerts to your loved ones in case of danger. You can also share your live location with your loved ones.',
    tech: 'FastAPI, Supabase, TailwindCSS',
    url: 'https://github.com/krishbaresha/MehfoozAI',
  },
];

export default function ResumePage() {
  const handlePrint = () => window.print();

  return (
    <>
      {/* Print-specific CSS overrides */}
      <style jsx global>{`
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-bg-white {
            background: #ffffff !important;
          }
          .print-text-black {
            color: #111111 !important;
          }
          .print-border-gray {
            border-color: #e4e4e7 !important;
          }
          .print-text-muted {
            color: #52525b !important;
          }
          .glass-panel {
            background: #f4f4f5 !important;
            backdrop-filter: none !important;
            border-color: #e4e4e7 !important;
          }
          main {
            background: #ffffff !important;
          }
        }
      `}</style>

      <main className="min-h-screen bg-background font-body py-24 px-6 relative print-bg-white">
        {/* Decorative glows — screen only */}
        <div className="no-print absolute top-0 left-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl pointer-events-none" />
        <div className="no-print absolute bottom-0 right-1/4 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl pointer-events-none" />

        {/* Action Bar — screen only */}
        <div className="no-print max-w-4xl mx-auto flex items-center justify-between mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-foreground/50 hover:text-foreground transition-colors uppercase"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </Link>

          <motion.button
            onClick={handlePrint}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-accent-purple to-accent-blue text-white text-xs font-semibold uppercase tracking-wider shadow-lg shadow-purple-500/20 hover:brightness-110 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download / Print PDF
          </motion.button>
        </div>

        {/* ===== RESUME DOCUMENT ===== */}
        <div className="max-w-4xl mx-auto rounded-3xl glass-panel p-10 md:p-14 space-y-10 print-bg-white print-border-gray">

          {/* — Header — */}
          <header className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-8 border-b border-foreground/10 print-border-gray">
            <div className="space-y-2">
              <h1 className="text-4xl font-black tracking-tight text-foreground print-text-black uppercase">
                Krish Baresha
              </h1>
              <p className="text-base font-medium text-accent-purple tracking-wide">
                AI Engineer · Full Stack Developer · Creative Technologist
              </p>
              <p className="text-sm text-foreground/60 font-light max-w-xl leading-relaxed print-text-muted">
                Building high-performance interactive interfaces, autonomous AI agent pipelines, and enterprise-grade cloud architectures. Obsessed with design-engineering excellence.
              </p>
            </div>

            <div className="shrink-0 space-y-2 text-xs text-foreground/50 print-text-muted">
              <a href="mailto:krishbaresha@gmail.com" className="flex items-center gap-2 hover:text-foreground transition-colors">
                <Mail className="w-3.5 h-3.5" /> krishbaresha@gmail.com
              </a>
              <a href="https://github.com/krishbaresha" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-foreground transition-colors">
                <GitBranch className="w-3.5 h-3.5" /> github.com/krishbaresha
              </a>
              <a href="https://linkedin.com/in/krishbaresha" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-foreground transition-colors">
                <Link2 className="w-3.5 h-3.5" /> linkedin.com/in/krishbaresha
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> Hyderabad, Sindh, Pakistan
              </div>
            </div>
          </header>

          {/* — Skills Grid — */}
          <section className="space-y-5">
            <h2 className="text-xs font-black tracking-[0.2em] text-accent-purple uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Technical Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Frontend & Motion', icon: Code2, items: SKILLS.frontend },
                { label: 'Backend & Databases', icon: Cpu, items: SKILLS.backend },
                { label: 'AI & Machine Learning', icon: Sparkles, items: SKILLS.ai },
                { label: 'Cloud & DevOps', icon: CloudSun, items: SKILLS.cloud },
              ].map(({ label, icon: Icon, items }) => (
                <div key={label} className="rounded-xl bg-foreground/5 border border-foreground/10 p-4 space-y-3 print-border-gray print-bg-white">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground print-text-black uppercase tracking-wider">
                    <Icon className="w-3.5 h-3.5 text-accent-purple" />
                    {label}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-foreground/5 border border-foreground/10 text-foreground/70 print-text-muted print-border-gray"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* — Work Experience — */}
          <section className="space-y-8">
            <h2 className="text-xs font-black tracking-[0.2em] text-accent-purple uppercase flex items-center gap-2">
              <Cpu className="w-4 h-4" /> Work Experience
            </h2>
            {EXPERIENCE.map((exp, idx) => (
              <div key={idx} className="space-y-3 pb-6 border-b border-foreground/10 print-border-gray last:border-0 last:pb-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                  <div>
                    <h3 className="text-base font-bold text-foreground print-text-black">{exp.role}</h3>
                    <p className="text-sm font-semibold text-accent-purple">{exp.company}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-foreground/50 print-text-muted flex items-center gap-1 sm:justify-end">
                      <Calendar className="w-3 h-3" /> {exp.period}
                    </div>
                    <div className="text-xs text-foreground/40 flex items-center gap-1 sm:justify-end mt-0.5">
                      <MapPin className="w-3 h-3" /> {exp.location}
                    </div>
                  </div>
                </div>
                <ul className="space-y-2">
                  {exp.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="text-xs text-foreground/60 font-light leading-relaxed flex gap-2 print-text-muted">
                      <span className="text-accent-purple font-bold mt-0.5 shrink-0">▸</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* — Key Projects — */}
          <section className="space-y-5">
            <h2 className="text-xs font-black tracking-[0.2em] text-accent-purple uppercase flex items-center gap-2">
              <Code2 className="w-4 h-4" /> Key Projects
            </h2>
            <div className="space-y-4">
              {PROJECTS.map((proj, idx) => (
                <div key={idx} className="rounded-xl bg-foreground/5 border border-foreground/10 p-4 space-y-2 print-border-gray print-bg-white">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-foreground print-text-black">{proj.name}</h3>
                    <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-foreground/50 hover:text-foreground transition-colors no-print">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <p className="text-xs text-foreground/60 font-light leading-relaxed print-text-muted">{proj.description}</p>
                  <p className="text-[10px] font-mono text-foreground/50 print-text-muted">{proj.tech}</p>
                </div>
              ))}
            </div>
          </section>

          {/* — Education — */}
          <section className="space-y-5">
            <h2 className="text-xs font-black tracking-[0.2em] text-accent-purple uppercase flex items-center gap-2">
              <Award className="w-4 h-4" /> Education
            </h2>
            {EDUCATION.map((edu, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 pb-4 border-b border-foreground/10 print-border-gray last:border-0">
                <div>
                  <h3 className="text-base font-bold text-foreground print-text-black">{edu.degree}</h3>
                  <p className="text-sm font-semibold text-accent-purple">{edu.institution}</p>
                  <p className="text-xs text-foreground/60 font-light mt-1 print-text-muted">{edu.notes}</p>
                </div>
                <div className="shrink-0 text-right space-y-1">
                  <p className="text-xs text-foreground/50 print-text-muted">{edu.period}</p>
                </div>
              </div>
            ))}
          </section>

          {/* — Certifications — */}
          <section className="space-y-5">
            <h2 className="text-xs font-black tracking-[0.2em] text-accent-purple uppercase flex items-center gap-2">
              <Award className="w-4 h-4" /> Certifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {CERTIFICATIONS.map((cert, idx) => (
                <div key={idx} className="rounded-xl bg-foreground/5 border border-foreground/10 p-4 space-y-1 print-border-gray print-bg-white">
                  <p className="text-xs font-bold text-foreground print-text-black">{cert.name}</p>
                  <p className="text-[10px] text-foreground/50 print-text-muted">{cert.issuer} · {cert.year}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Footer note */}
          <div className="pt-6 border-t border-foreground/10 print-border-gray text-center">
            <p className="text-xs text-foreground/40 print-text-muted">
              Portfolio: <span className="text-foreground print-text-black font-mono">krishbaresha.com</span> ·
              GitHub: <span className="text-foreground print-text-black font-mono">github.com/krishbaresha</span>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
