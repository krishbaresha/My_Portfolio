'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Skill data ───────────────────────────────────────────────────────────────
const SKILL_CATEGORIES = {
  'AI & ML': [
    { name: 'LangChain', level: 90 },
    { name: 'OpenAI API', level: 95 },
    { name: 'Gemini API', level: 88 },
    { name: 'Vector DBs', level: 85 },
    { name: 'RAG Pipelines', level: 90 },
    { name: 'Puppeteer', level: 85 },
    { name: 'pgvector', level: 80 },
    { name: 'LLM Fine-tuning', level: 75 },
  ],
  Frontend: [
    { name: 'Next.js', level: 98 },
    { name: 'React', level: 97 },
    { name: 'TypeScript', level: 95 },
    { name: 'Tailwind CSS', level: 95 },
    { name: 'Framer Motion', level: 90 },
    { name: 'Three.js / WebGL', level: 80 },
    { name: 'GSAP', level: 85 },
    { name: 'GLSL Shaders', level: 70 },
  ],
  Backend: [
    { name: 'Node.js', level: 88 },
    { name: 'Python', level: 85 },
    { name: 'Supabase', level: 90 },
    { name: 'PostgreSQL', level: 82 },
    { name: 'REST APIs', level: 95 },
    { name: 'Redis', level: 78 },
    { name: 'Docker', level: 75 },
    { name: 'WebSockets', level: 82 },
  ],
  Tools: [
    { name: 'Git & GitHub', level: 95 },
    { name: 'Figma', level: 82 },
    { name: 'Vercel', level: 93 },
    { name: 'Postman', level: 88 },
    { name: 'Linux / CLI', level: 80 },
    { name: 'Notion', level: 90 },
    { name: 'CI/CD', level: 75 },
    { name: 'AWS (basics)', level: 65 },
  ],
} as const;

type Category = keyof typeof SKILL_CATEGORIES;
const CATEGORIES = Object.keys(SKILL_CATEGORIES) as Category[];

// ─── Skill level color ────────────────────────────────────────────────────────
function levelColor(level: number) {
  if (level >= 90) return 'bg-amber-500';
  if (level >= 80) return 'bg-purple-500';
  if (level >= 70) return 'bg-blue-500';
  return 'bg-foreground/30';
}

export default function InteractiveSkills() {
  const [active, setActive] = useState<Category>('Frontend');

  return (
    <div className="space-y-8">
      {/* Category tabs */}
      <div
        className="flex items-center gap-2 flex-wrap"
        role="tablist"
        aria-label="Skill categories"
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={active === cat}
            onClick={() => setActive(cat)}
            className={`relative px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              active === cat ? 'text-white' : 'text-foreground/50 hover:text-foreground liquid-glass'
            }`}
          >
            {active === cat && (
              <motion.span
                layoutId="skill-tab-active"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-blue-500"
                transition={{ type: 'spring', bounce: 0.25, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">{cat}</span>
          </button>
        ))}
      </div>

      {/* Skill cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
          role="tabpanel"
          aria-label={`${active} skills`}
        >
          {SKILL_CATEGORIES[active].map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="liquid-glass liquid-glass-hover p-4 space-y-3 group"
            >
              {/* Skill name */}
              <div className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors leading-tight">
                {skill.name}
              </div>

              {/* Level bar */}
              <div className="space-y-1.5">
                <div className="h-1 rounded-full bg-foreground/8 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${levelColor(skill.level)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 0.8, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                <div className="text-[10px] text-foreground/35 font-mono">{skill.level}%</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
