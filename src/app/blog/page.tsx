'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Calendar, Clock, ChevronRight } from 'lucide-react';
import { BlogPost } from '@/lib/markdown';

export default function BlogArchivePage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  useEffect(() => {
    // We can't run fs direct on client page.tsx, so we fetch posts via inline load or simple client simulation
    // For simplicity, we can fetch from an internal client-side loader or mock values.
    // Let's call a server action or fetch local API.
    // To make it simple and reliable, let's create a server route or inline preset values.
    // Wait! Let's fetch from `/api/blog` or create an inline client wrapper. Let's make an API route or query direct!
    // Since Next.js 15 supports Server Components, we can write a page component that is a Server Component,
    // OR fetch from an API route. Let's write a Server Component or simple API route.
    // Wait! A client component page fetching from `/api/blog` is very clean and allows instant interactive client filtering.
    // Let's fetch from `/api/blog`.
    fetch('/api/blog')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPosts(data);
      });
  }, []);

  const categories = ['All', ...Array.from(new Set(posts.map((p) => p.category)))];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-[#030303] text-foreground font-sans relative py-32 px-6">
      {/* Background spotlights */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-12">
        {/* Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-zinc-500 hover:text-white transition-colors uppercase clickable"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Portfolio
        </Link>

        {/* Head */}
        <div className="space-y-4">
          <span className="text-xs font-bold tracking-[0.2em] text-accent-purple uppercase">
            Articles & Insights
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white uppercase">
            WRITTEN BY KRISH
          </h1>
          <p className="text-md md:text-xl text-zinc-400 font-light max-w-2xl leading-relaxed">
            Exploring system architectures, fluid shader interfaces, and modern RAG agent implementations.
          </p>
        </div>

        {/* Search & Filtering Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-8 pt-4">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-black'
                    : 'bg-white/5 border border-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search posts or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/5 focus:border-accent-purple focus:bg-white/10 focus:outline-none transition-all rounded-full pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-600"
            />
          </div>
        </div>

        {/* Post Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 text-zinc-500 text-sm font-light">
            No articles found matching your query.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-2xl glass-panel p-6 flex flex-col justify-between overflow-hidden glass-panel-hover"
              >
                <div>
                  {/* Cover */}
                  <div className="relative w-full h-48 rounded-xl overflow-hidden mb-6 bg-zinc-950 border border-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] font-bold tracking-wider text-accent-purple uppercase">
                      {post.category}
                    </span>
                    <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-accent-purple transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-sm text-zinc-400 font-light leading-relaxed line-clamp-3">
                      {post.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-6 text-zinc-500 text-[11px] font-light">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                  </div>
                  <span className="text-accent-purple font-semibold tracking-wider uppercase group-hover:text-white flex items-center gap-1 transition-colors">
                    Read Article <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
