import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ExternalLink, Layers, Target, TrendingUp } from 'lucide-react';
import { getProjectBySlug, getProjects } from '@/lib/projects';
import { GithubIcon } from '@/components/Icons';
import { IMAGE_SIZES } from '@/lib/assets';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center font-body">
        <h1 className="text-2xl font-bold mb-4">Case study not found</h1>
        <Link href="/#projects" className="text-sm text-foreground/50 hover:text-foreground transition-colors">
          ← Back to projects
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground font-body py-28 px-6">
      <div className="max-w-4xl mx-auto space-y-10">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-xs font-medium text-foreground/40 hover:text-foreground transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" /> Projects
        </Link>

        {project.thumbnail && (
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-border">
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              sizes={IMAGE_SIZES.detailHero}
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded-md border border-border text-[10px] font-medium uppercase tracking-wider text-foreground/50">
              {project.category}
            </span>
            {project.featured && (
              <span className="px-2 py-0.5 rounded-md bg-foreground text-background text-[10px] font-semibold uppercase tracking-wider">
                Featured
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-700 tracking-tight">{project.title}</h1>
          {project.description && (
            <p className="text-lg text-foreground/60 font-light leading-relaxed max-w-2xl">{project.description}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-xs font-semibold uppercase tracking-wider hover:border-foreground/30 transition-colors"
            >
              <GithubIcon className="w-4 h-4" /> Source
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-xs font-semibold uppercase tracking-wider"
            >
              <ExternalLink className="w-4 h-4" /> Live demo
            </a>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {project.technical_challenge && (
            <div className="rounded-2xl border border-border bg-surface/50 p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground/40">
                <Target className="w-4 h-4" /> Technical challenge
              </div>
              <p className="text-sm text-foreground/70 leading-relaxed">{project.technical_challenge}</p>
            </div>
          )}
          {project.architecture && (
            <div className="rounded-2xl border border-border bg-surface/50 p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground/40">
                <Layers className="w-4 h-4" /> Architecture
              </div>
              <p className="text-sm font-mono text-foreground/70 leading-relaxed">{project.architecture}</p>
            </div>
          )}
        </div>

        {project.impact_metrics?.length > 0 && (
          <div className="rounded-2xl border border-border bg-surface/50 p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground/40">
              <TrendingUp className="w-4 h-4" /> Business impact
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {project.impact_metrics.map((m) => (
                <div key={`${m.label}-${m.value}`} className="rounded-xl border border-border p-4">
                  <div className="text-[10px] uppercase tracking-wider text-foreground/40">{m.label}</div>
                  <div className="text-2xl font-heading font-700 tabular-nums mt-1">{m.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.map((tech) => (
              <span key={tech} className="px-3 py-1 rounded-lg border border-border text-xs text-foreground/60">
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export const revalidate = 60;
