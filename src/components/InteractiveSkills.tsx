'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Cpu, Sparkles, CloudSun, ChevronRight } from 'lucide-react';
import SectionReveal from './SectionReveal';

interface Skill {
  name: string;
  level: number;
}

interface SkillSphere {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  glowClass: string;
  bgIcon: string;
  description: string;
  skills: Skill[];
  codeSnippet: string;
}

const SKILL_SPHERES: SkillSphere[] = [
  {
    title: 'Frontend Core',
    icon: Code2,
    colorClass: 'text-purple-400',
    glowClass: 'from-purple-500/10 to-transparent',
    bgIcon: 'bg-purple-500/10',
    description: 'Architecting interfaces that feel fluid, responsive, and visually tactile.',
    skills: [
      { name: 'Next.js 15 & React 19', level: 95 },
      { name: 'TypeScript', level: 90 },
      { name: 'Tailwind CSS', level: 95 },
      { name: 'GSAP & Motion', level: 88 },
    ],
    codeSnippet: `// Immersive Framer Motion Hook
const scale = useTransform(scrollY, [0, 300], [1, 0.95]);
const opacity = useTransform(scrollY, [0, 200], [1, 0]);

return (
  <motion.div style={{ scale, opacity }} className="tactile-card">
    <WebGLCanvas shaders={glslSource} />
  </motion.div>
);`,
  },
  {
    title: 'Backend Systems',
    icon: Cpu,
    colorClass: 'text-blue-400',
    glowClass: 'from-blue-500/10 to-transparent',
    bgIcon: 'bg-blue-500/10',
    description: 'Designing low-latency request-response frameworks and robust server logic.',
    skills: [
      { name: 'Node.js & Express', level: 92 },
      { name: 'PostgreSQL & pgvector', level: 88 },
      { name: 'REST & GraphQL APIs', level: 90 },
      { name: 'Redis Caching', level: 80 },
    ],
    codeSnippet: `// High Performance Endpoint Caching
app.get('/api/projects', async (req, res) => {
  const cached = await redis.get('projects:data');
  if (cached) return res.json(JSON.parse(cached));

  const data = await db.select().from(projects);
  await redis.setex('projects:data', 3600, JSON.stringify(data));
  return res.json(data);
});`,
  },
  {
    title: 'Artificial Intel',
    icon: Sparkles,
    colorClass: 'text-pink-400',
    glowClass: 'from-pink-500/10 to-transparent',
    bgIcon: 'bg-pink-500/10',
    description: 'Engineering intelligent vector indexes and autonomous task agent engines.',
    skills: [
      { name: 'OpenAI & Gemini APIs', level: 95 },
      { name: 'LangChain Orchestrator', level: 85 },
      { name: 'PGVector Embeddings', level: 90 },
      { name: 'Agentic Tools (ADK)', level: 88 },
    ],
    codeSnippet: `// Sliding Window RAG Pipeline
const embeddings = new OpenAIEmbeddings();
const vectorStore = new SupabaseVectorStore(embeddings, {
  client: supabaseClient,
  tableName: 'documents_embeddings',
});

const chain = RunnableSequence.from([
  { context: vectorStore.asRetriever(4), question: new RunnablePassthrough() },
  promptTemplate,
  model,
  new StringOutputParser(),
]);`,
  },
  {
    title: 'Cloud Infrastructure',
    icon: CloudSun,
    colorClass: 'text-yellow-400',
    glowClass: 'from-yellow-500/10 to-transparent',
    bgIcon: 'bg-yellow-500/10',
    description: 'Provisioning scalable cloud environments and serverless edge databases.',
    skills: [
      { name: 'Amazon Web Services', level: 80 },
      { name: 'Supabase Database', level: 95 },
      { name: 'Vercel Deployment', level: 98 },
      { name: 'Docker Containerization', level: 85 },
    ],
    codeSnippet: `# Multi-Stage Dockerfile Optimization
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
CMD ["node", "server.js"]`,
  },
];

// ── SkillProgressBar ─────────────────────────────────────────────────────────
// Progress bar that animates only when it enters the viewport (whileInView).
// Uses width on an inner div — GPU-accelerated via will-change.
function SkillProgressBar({
  skill,
  colorClass,
  isVisible,
}: {
  skill: Skill;
  colorClass: string;
  isVisible: boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px] text-zinc-300">
        <span className="flex items-center gap-1">
          <ChevronRight className={`w-3 h-3 ${colorClass}`} />
          {skill.name}
        </span>
        <span className="font-mono text-[10px] text-zinc-500">{skill.level}%</span>
      </div>
      {/* Animated Progress Bar — viewport-gated via whileInView */}
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: isVisible ? `${skill.level}%` : '5%' }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="h-full bg-gradient-to-r from-accent-purple to-accent-blue rounded-full"
          style={{ willChange: 'width' }}
        />
      </div>
    </div>
  );
}

export default function InteractiveSkills() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="space-y-12">
      {/* 4 Cards Grid — stagger-revealed as section enters viewport */}
      <SectionReveal stagger={0.1} start="top 88%">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SKILL_SPHERES.map((sphere, idx) => {
            const Icon = sphere.icon;
            const isActive = activeTab === idx;
            const isVisible = isActive || hoveredIdx === idx;

            return (
              <motion.div
                key={sphere.title}
                onClick={() => setActiveTab(idx)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                whileHover={{ y: -4 }}
                className={`reveal-item relative rounded-2xl glass-panel p-6 space-y-6 overflow-hidden cursor-pointer clickable transition-all duration-300 ${
                  isActive ? 'border-accent-purple bg-white/[0.03]' : 'border-white/5 hover:border-white/10'
                }`}
              >
                {/* Glow backdrop on hover or active */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${sphere.glowClass} transition-opacity duration-300 ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                <div className={`w-12 h-12 rounded-xl ${sphere.bgIcon} flex items-center justify-center ${sphere.colorClass}`}>
                  <Icon className="w-6 h-6 animate-pulse" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white flex items-center justify-between">
                    {sphere.title}
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-accent-purple" />}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light">
                    {sphere.description}
                  </p>
                </div>

                {/* Progress items — viewport-gated, not time-based */}
                <div className="space-y-3 pt-2">
                  {sphere.skills.map((skill) => (
                    <SkillProgressBar
                      key={skill.name}
                      skill={skill}
                      colorClass={sphere.colorClass}
                      isVisible={isVisible}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </SectionReveal>

      {/* Code Inspector Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl glass-panel border border-white/5 bg-black/60 backdrop-blur-xl p-6 font-mono text-xs overflow-hidden relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4 text-zinc-500 text-[10px] font-semibold uppercase tracking-wider select-none">
            <span>{SKILL_SPHERES[activeTab].title} Core Routine Preview</span>
            <span className="text-accent-purple">Active Snippet</span>
          </div>

          {/* Snippet Block */}
          <pre className="text-zinc-300 overflow-x-auto leading-relaxed p-4 rounded-xl bg-black/50 border border-white/5 no-scrollbar max-h-60">
            <code>{SKILL_SPHERES[activeTab].codeSnippet}</code>
          </pre>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
