import Link from 'next/link';
import { ArrowLeft, GitBranch, ExternalLink, Calendar, GitCommit, Star, Code } from 'lucide-react';
import { fetchGitHubRepos, fetchRepoReadme } from '@/lib/github';
import { marked } from 'marked';

// Define Next.js 15 compliant props
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
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
      <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center font-sans">
        <h1 className="text-2xl font-bold mb-4">Case Study Not Found</h1>
        <Link href="/" className="px-4 py-2 bg-white/5 border border-white/5 hover:bg-white/10 rounded-xl text-xs uppercase tracking-wider text-zinc-300">
          Return to Portfolio
        </Link>
      </div>
    );
  }

  // Fetch and parse README
  const rawReadme = await fetchRepoReadme(project.name);
  const parsedReadmeHtml = await marked.parse(rawReadme);

  return (
    <main className="min-h-screen bg-[#030303] text-foreground font-sans relative py-32 px-6">
      {/* Light glow spotlight lamp */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-12">
        {/* Back Link */}
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-zinc-500 hover:text-white transition-colors uppercase clickable"
        >
          <ArrowLeft className="w-4 h-4" /> Back to projects
        </Link>

        {/* Hero Meta */}
        <div className="space-y-4">
          <span className="text-xs font-bold tracking-[0.2em] text-accent-purple uppercase">
            Case Study
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white uppercase">
            {project.name}
          </h1>
          <p className="text-md md:text-xl text-zinc-400 font-light max-w-3xl leading-relaxed">
            {project.description || 'Dynamic repository showcasing clean software architectures and fluid interfaces.'}
          </p>
        </div>

        {/* Action Links */}
        <div className="flex items-center gap-4 border-b border-white/5 pb-8">
          <Link
            href={project.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 clickable"
          >
            <GitBranch className="w-4 h-4" /> GitHub Repository
          </Link>
          {project.homepage && (
            <Link
              href={project.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 clickable"
            >
              <ExternalLink className="w-4 h-4" /> Live Demonstration
            </Link>
          )}
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main README / Description */}
          <div className="lg:col-span-8 space-y-8">
            <div className="rounded-2xl glass-panel p-8">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-6 pb-2 border-b border-white/5">
                Project Documentation
              </h2>
              {/* Rendered HTML */}
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: parsedReadmeHtml }}
              />
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="lg:col-span-4 space-y-6">
            {/* Project Specs Card */}
            <div className="rounded-2xl glass-panel p-6 space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-white/5">
                Technical Specifications
              </h3>
              
              <div className="space-y-4 text-xs">
                {/* Stars */}
                <div className="flex justify-between items-center">
                  <div className="text-zinc-500 flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-zinc-500" />
                    <span>GitHub Stars</span>
                  </div>
                  <span className="font-mono text-white">{project.stars}</span>
                </div>

                {/* Commits */}
                <div className="flex justify-between items-center">
                  <div className="text-zinc-500 flex items-center gap-1.5">
                    <GitCommit className="w-4 h-4 text-zinc-500" />
                    <span>Commits Count</span>
                  </div>
                  <span className="font-mono text-white">{project.commits_count}</span>
                </div>

                {/* Date */}
                <div className="flex justify-between items-center">
                  <div className="text-zinc-500 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-zinc-500" />
                    <span>Last Updated</span>
                  </div>
                  <span className="text-zinc-300">
                    {new Date(project.updated_at).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                {/* Languages */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="text-zinc-500 flex items-center gap-1.5 mb-1">
                    <Code className="w-4 h-4 text-zinc-500" />
                    <span>Languages Breakdown</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {project.languages.map((lang) => (
                      <span
                        key={lang}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/5 text-zinc-300"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Architecture Summary Card */}
            <div className="rounded-2xl glass-panel p-6 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                System Architecture
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                {project.architecture}
              </p>
            </div>

            {/* Key Deliverables Card */}
            <div className="rounded-2xl glass-panel p-6 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-white/5">
                Key Features & Deliverables
              </h4>
              <ul className="space-y-2 text-xs text-zinc-400 font-light leading-relaxed">
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
export const revalidate = 3600; // Revalidate every hour
