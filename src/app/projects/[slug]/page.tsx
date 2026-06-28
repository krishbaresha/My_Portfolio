import Link from 'next/link';
import { ArrowLeft, GitBranch, ExternalLink, Calendar, GitCommit, Star, Code } from 'lucide-react';
import { fetchGitHubRepos, fetchRepoReadme } from '@/lib/github';
import { marked } from 'marked';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const repos = await fetchGitHubRepos();
  return repos.map((repo) => ({
    slug: repo.name.toLowerCase(),
  }));
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const repos = await fetchGitHubRepos();
  const project = repos.find((r) => r.name.toLowerCase() === slug);

  if (!project) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center font-body">
        <h1 className="text-2xl font-bold mb-4">Case Study Not Found</h1>
        <Link
          href="/"
          className="px-4 py-2 liquid-glass hover:bg-foreground/10 rounded-xl text-xs uppercase tracking-wider text-foreground/70"
        >
          Return to Portfolio
        </Link>
      </div>
    );
  }

  const rawReadme = await fetchRepoReadme(project.name);
  const parsedReadmeHtml = await marked.parse(rawReadme);

  const chipClass =
    'px-2 py-0.5 rounded text-[10px] font-mono bg-foreground/5 border border-foreground/10 text-foreground/70';

  return (
    <main className="min-h-screen bg-background text-foreground font-body relative py-32 px-6">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-12">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-foreground/50 hover:text-foreground transition-colors uppercase"
        >
          <ArrowLeft className="w-4 h-4" /> Back to projects
        </Link>

        <div className="space-y-4">
          <span className="text-xs font-bold tracking-[0.2em] text-accent-purple uppercase">
            Case Study
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground uppercase">
            {project.name}
          </h1>
          <p className="text-md md:text-xl text-foreground/60 font-light max-w-3xl leading-relaxed">
            {project.description || 'Dynamic repository showcasing clean software architectures and fluid interfaces.'}
          </p>
        </div>

        <div className="flex items-center gap-4 border-b border-foreground/10 pb-8">
          <Link
            href={project.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl liquid-glass hover:bg-foreground/10 text-foreground text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <GitBranch className="w-4 h-4" /> GitHub Repository
          </Link>
          {project.homepage && (
            <Link
              href={project.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" /> Live Demonstration
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-8">
            <div className="rounded-2xl glass-panel p-8">
              <h2 className="text-xl font-bold text-foreground uppercase tracking-wider mb-6 pb-2 border-b border-foreground/10">
                Project Documentation
              </h2>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: parsedReadmeHtml }}
              />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl glass-panel p-6 space-y-6">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider pb-3 border-b border-foreground/10">
                Technical Specifications
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center">
                  <div className="text-foreground/50 flex items-center gap-1.5">
                    <Star className="w-4 h-4" />
                    <span>GitHub Stars</span>
                  </div>
                  <span className="font-mono text-foreground">{project.stars}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-foreground/50 flex items-center gap-1.5">
                    <GitCommit className="w-4 h-4" />
                    <span>Commits Count</span>
                  </div>
                  <span className="font-mono text-foreground">{project.commits_count}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-foreground/50 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>Last Updated</span>
                  </div>
                  <span className="text-foreground/70">
                    {new Date(project.updated_at).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-foreground/10">
                  <div className="text-foreground/50 flex items-center gap-1.5 mb-1">
                    <Code className="w-4 h-4" />
                    <span>Languages Breakdown</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {project.languages.map((lang) => (
                      <span key={lang} className={chipClass}>
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl glass-panel p-6 space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                System Architecture
              </h4>
              <p className="text-xs text-foreground/60 leading-relaxed font-light">
                {project.architecture}
              </p>
            </div>

            <div className="rounded-2xl glass-panel p-6 space-y-4">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider pb-2 border-b border-foreground/10">
                Key Features & Deliverables
              </h4>
              <ul className="space-y-2 text-xs text-foreground/60 font-light leading-relaxed">
                {project.features?.map((f, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-accent-purple font-bold">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export const dynamic = 'force-dynamic';
export const revalidate = 3600;
