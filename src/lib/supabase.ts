import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isDummy =
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseUrl.includes('dummy-supabase-url') ||
  supabaseAnonKey.includes('dummy');

export const supabase = !isDummy ? createClient(supabaseUrl, supabaseAnonKey) : null;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  tech_stack: string[];
  github_url: string | null;
  live_url: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type ProjectUpsert = Omit<Project, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
};

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  avatar_url?: string;
  rating: number;
}

// ─── Fallback projects (shown when Supabase is unavailable) ──────────────────

const FALLBACK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Neuro Flow',
    slug: 'neuro-flow',
    description: 'Autonomous multi-agent system executing visual web tasks and complex workflows with real-time UI tracking.',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    tech_stack: ['Next.js', 'TypeScript', 'Puppeteer', 'Vector DB', 'AI'],
    github_url: 'https://github.com/krishbaresha/neuro-flow',
    live_url: 'https://neuro-flow.vercel.app',
    featured: true,
    sort_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Aurora Canvas',
    slug: 'aurora-canvas',
    description: 'High-performance WebGL creative dashboard representing system metrics through reactive flow fields.',
    thumbnail: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800',
    tech_stack: ['Three.js', 'WebGL', 'GSAP', 'React Three Fiber', 'GLSL'],
    github_url: 'https://github.com/krishbaresha/aurora-canvas',
    live_url: 'https://aurora-canvas.vercel.app',
    featured: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Synapse RAG',
    slug: 'synapse-rag',
    description: 'Local vector search and RAG engine optimized for real-time document intelligence and semantic queries.',
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
    tech_stack: ['AI', 'pgvector', 'PostgreSQL', 'Gemini API', 'Python'],
    github_url: 'https://github.com/krishbaresha/synapse-rag',
    live_url: 'https://synapse-rag.vercel.app',
    featured: false,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Dashboard Forge',
    slug: 'dashboard-forge',
    description: 'SaaS analytics dashboard with real-time charts, user segmentation, and webhook event pipelines.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    tech_stack: ['Next.js', 'Supabase', 'Recharts', 'TypeScript', 'Tailwind'],
    github_url: 'https://github.com/krishbaresha/dashboard-forge',
    live_url: null,
    featured: false,
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Prompt Forge',
    slug: 'prompt-forge',
    description: 'AI prompt engineering studio with chain-of-thought debugging, version history, and model comparison.',
    thumbnail: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800',
    tech_stack: ['React', 'OpenAI', 'Anthropic', 'LangChain', 'Node.js'],
    github_url: 'https://github.com/krishbaresha/prompt-forge',
    live_url: null,
    featured: false,
    sort_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Motion Studio',
    slug: 'motion-studio',
    description: 'Visual animation composer for creating Framer Motion sequences with live code preview and export.',
    thumbnail: 'https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=800',
    tech_stack: ['React', 'Framer Motion', 'Monaco Editor', 'TypeScript'],
    github_url: 'https://github.com/krishbaresha/motion-studio',
    live_url: null,
    featured: false,
    sort_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// ─── Database helpers ─────────────────────────────────────────────────────────

export const db = {
  // ── Projects (new Supabase table) ────────────────────────────────────────────

  async getProjects(): Promise<Project[]> {
    if (!supabase) return FALLBACK_PROJECTS;
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) {
      console.error('Error fetching projects:', error);
      return FALLBACK_PROJECTS;
    }
    return (data as Project[]) || FALLBACK_PROJECTS;
  },

  async upsertProject(project: ProjectUpsert): Promise<{ data: Project | null; error: unknown }> {
    if (!supabase) return { data: null, error: 'Supabase not configured' };
    const payload = {
      ...project,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from('projects')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();
    return { data: data as Project | null, error };
  },

  async deleteProject(id: string): Promise<{ error: unknown }> {
    if (!supabase) return { error: 'Supabase not configured' };
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    return { error };
  },

  // ── Testimonials ─────────────────────────────────────────────────────────────

  async getTestimonials(): Promise<Testimonial[]> {
    if (!supabase) {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('portfolio_testimonials');
        if (stored) return JSON.parse(stored);
      }
      return [
        {
          id: '1',
          name: 'Sarah Chen',
          role: 'VP of Product',
          company: 'Linear',
          text: 'Krish has an exceptional ability to bridge AI engineering with high-fidelity visual design. His work on our interactive tools exceeded all performance expectations.',
          avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
          rating: 5,
        },
        {
          id: '2',
          name: 'Marc Hemeon',
          role: 'Creative Director',
          company: 'Framer',
          text: 'Krish is a rare talent — an elite developer who thinks like a designer. The animations and attention to detail on our interface were top-tier.',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          rating: 5,
        },
        {
          id: '3',
          name: 'Aris Kouroudis',
          role: 'Technical Recruiter',
          company: 'Stripe',
          text: "We were blown away by Krish's dynamic project showcase. He is a full-stack engineer who builds experiences, not just screens.",
          avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
          rating: 5,
        },
      ];
    }
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { console.error('Error fetching testimonials:', error); return []; }
    return data || [];
  },

  async addTestimonial(testimonial: {
    name: string; role: string; company: string; text: string; rating: number; avatar_url?: string;
  }): Promise<{ data: Testimonial | null; error: unknown }> {
    if (!supabase) {
      const current = await this.getTestimonials();
      const newT: Testimonial = {
        ...testimonial,
        id: Math.random().toString(36).substr(2, 9),
        avatar_url: testimonial.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('portfolio_testimonials', JSON.stringify([newT, ...current]));
      }
      return { data: newT, error: null };
    }
    const { data, error } = await supabase
      .from('testimonials')
      .insert([testimonial])
      .select()
      .single();
    return { data: data as Testimonial | null, error };
  },

  // ── Contacts ──────────────────────────────────────────────────────────────────

  async submitContact(contact: {
    name: string; email: string; company: string; budget: string; message: string;
  }): Promise<{ data: unknown; error: unknown }> {
    if (!supabase) {
      if (typeof window !== 'undefined') {
        const key = 'portfolio_contacts';
        const current = JSON.parse(localStorage.getItem(key) || '[]');
        localStorage.setItem(
          key,
          JSON.stringify([{ ...contact, id: Math.random().toString(36).substr(2, 9), created_at: new Date().toISOString() }, ...current])
        );
      }
      return { data: contact, error: null };
    }
    const { data, error } = await supabase.from('contacts').insert([contact]).select().single();
    return { data, error };
  },

  async getContacts() {
    if (!supabase) {
      if (typeof window !== 'undefined') return JSON.parse(localStorage.getItem('portfolio_contacts') || '[]');
      return [];
    }
    const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
    if (error) { console.error('Error fetching contacts:', error); return []; }
    return data || [];
  },
};
