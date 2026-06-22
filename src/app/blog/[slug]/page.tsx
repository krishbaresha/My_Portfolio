import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { getPostData, getSortedPostsData } from '@/lib/markdown';
import { marked } from 'marked';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostData(slug);

  if (!post) {
    notFound();
  }

  const htmlContent = await marked.parse(post.content);

  return (
    <main className="min-h-screen bg-[#030303] text-foreground font-sans relative py-32 px-6">
      {/* Backdrop glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-accent-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto space-y-12">
        {/* Back */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-zinc-500 hover:text-white transition-colors uppercase"
        >
          <ArrowLeft className="w-4 h-4" /> All Articles
        </Link>

        {/* Article Header */}
        <div className="space-y-6">
          <span className="text-xs font-bold tracking-[0.2em] text-accent-purple uppercase">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            {post.title}
          </h1>
          <p className="text-md text-zinc-400 font-light leading-relaxed">
            {post.description}
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-500 pt-2 border-t border-white/5 pb-6">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-3.5 h-3.5" />
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[10px] font-mono rounded bg-white/5 border border-white/5 text-zinc-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Cover Image */}
          <div className="w-full h-72 md:h-96 rounded-2xl overflow-hidden border border-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Article Body */}
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Bottom Nav */}
        <div className="pt-12 border-t border-white/5">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-zinc-500 hover:text-white transition-colors uppercase"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Articles
          </Link>
        </div>
      </div>
    </main>
  );
}
