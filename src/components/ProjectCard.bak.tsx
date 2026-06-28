'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, ExternalLink, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { RepoData } from '@/lib/github';

interface ProjectCardProps {
  project: RepoData;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    // Map bounds to degree rotation limits (-10 to 10 deg)
    const factor = 10;
    const rX = -(y / (box.height / 2)) * factor;
    const rY = (x / (box.width / 2)) * factor;
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
      }}
      animate={{
        rotateX,
        rotateY,
        scale: rotateX !== 0 ? 1.02 : 1,
      }}
      className="group relative rounded-2xl glass-panel p-6 flex flex-col justify-between overflow-hidden glass-panel-hover"
    >
      {/* Spotlight hover background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 to-accent-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Top Graphic/Thumbnail */}
      <div className="relative w-full h-48 rounded-xl overflow-hidden mb-6 bg-zinc-950 border border-white/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.thumbnail}
          alt={project.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
        
        {/* Quick stats floating */}
        <div className="absolute top-3 right-3 flex items-center gap-3">
          <div className="px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wider bg-black/60 border border-white/5 text-white flex items-center gap-1 backdrop-blur-md">
            <span>★</span> {project.stars}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Project Title */}
          <h3 className="text-xl font-bold tracking-tight text-white mb-2 flex items-center gap-2 group-hover:text-accent-purple transition-colors">
            {project.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
            {project.description || 'Creative application utilizing high-performance server routines and user interfaces.'}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {project.topics.slice(0, 4).map((topic) => (
              <span
                key={topic}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/5 text-zinc-300"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
          <div className="flex items-center gap-4">
            {/* Github Link */}
            <Link
              href={project.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-white transition-colors"
              aria-label="GitHub Repository"
            >
              <GitBranch className="w-5 h-5" />
            </Link>

            {/* Live Demo Link */}
            {project.homepage && (
              <Link
                href={project.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-white transition-colors"
                aria-label="Live Demonstration"
              >
                <ExternalLink className="w-5 h-5" />
              </Link>
            )}
          </div>

          {/* Case study internal link */}
          <Link
            href={`/projects/${project.name.toLowerCase()}`}
            className="text-xs font-semibold tracking-wider text-accent-purple hover:text-white flex items-center gap-1.5 transition-colors uppercase clickable"
          >
            Case Study <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
