import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  coverImage: string;
  content: string;
  readTime: string;
}

const postsDirectory = path.join(process.cwd(), 'content/posts');

// Premium pre-baked articles in case no file is written yet
const PRESET_POSTS: BlogPost[] = [
  {
    slug: 'engineering-fluid-visuals-webgl',
    title: 'Engineering Fluid WebGL Visuals with Shaders and GSAP',
    description: 'A deep-dive into constructing performance-optimized vertex displacement shaders, syncing GLSL timelines with custom smooth scrolling gestures.',
    date: '2026-06-15',
    category: 'Creative Dev',
    tags: ['WebGL', 'Three.js', 'GSAP', 'GLSL'],
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    readTime: '6 min read',
    content: `
# Engineering Fluid WebGL Visuals with Shaders and GSAP

WebGL offers creative developers an unmatched canvas to design immersive visual experiences. However, rendering millions of interactive elements at 60fps requires structured calculations directly on the GPU.

## Why Shaders?

Standard DOM animations hit layout bounds, while Canvas 2D is limited by CPU-bound loops. Shaders run in parallel on the GPU. By writing custom **GLSL Vertex and Fragment shaders**, we calculate vertex offsets per frame based on variables like mouse coordinates or scroll scrub values.

\`\`\`glsl
// Custom Vertex Shader snippet calculating displacement
uniform float uTime;
uniform vec2 uMouse;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 newPosition = position;
  float dist = distance(uv, uMouse);
  newPosition.z += sin(newPosition.x * 10.0 + uTime) * 0.1 * (1.0 - dist);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
\`\`\`

## Binding GSAP ScrollTrigger to Uniforms

To sync WebGL visual speeds with page scrolling, we map Lenis coordinates to custom uniform values and scrub them using GSAP:

\`\`\`javascript
gsap.to(material.uniforms.uScrollSpeed, {
  value: speed,
  scrollTrigger: {
    trigger: '#viewport-section',
    start: 'top top',
    end: 'bottom bottom',
    scrub: true
  }
});
\`\`\`

By managing memory buffers properly, disposing textures on unmount, and using instanced meshes, we achieve premium Awwwards-tier visual designs while keeping Lighthouse performance above 95.
`
  },
  {
    slug: 'architecting-autonomous-agentic-rag',
    title: 'Architecting Autonomous Agents: RAG and pgvector Pipelines',
    description: 'How to structure multi-agent browser systems that can self-correct, parse document vectors, and coordinate tool invocation loops.',
    date: '2026-05-28',
    category: 'Artificial Intelligence',
    tags: ['Agentic AI', 'RAG', 'pgvector', 'Next.js'],
    coverImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
    readTime: '8 min read',
    content: `
# Architecting Autonomous Agents: RAG and pgvector Pipelines

Agentic AI represents a shift from static prompt templates to dynamic, self-directed systems. Instead of generating a single output, agents iterate through action loops: **Reasoning, Action, Observation, and Correction**.

## The PGVector Search Pipeline

To feed relevant context into the agent's reasoning loop, we store project document chunks as high-dimensional vector embeddings inside PostgreSQL using the **pgvector** extension. 

\`\`\`sql
-- Performing cosine distance similarity search
SELECT content, 1 - (embedding <=> :query_embedding) AS similarity
FROM documents
WHERE 1 - (embedding <=> :query_embedding) > 0.8
ORDER BY similarity DESC
LIMIT 5;
\`\`\`

## Designing Self-Correcting loops

When an agent encounters a system or browser automation failure (e.g., a missing selector during a scrape action), standard integrations fail. By supplying the agent with a **self-healing script tool**, it reads its own stack trace, refactors its selector target list, and attempts execution again.

This feedback loop minimizes human supervision, creating fully autonomous tools.
`
  }
];

export function getSortedPostsData(): BlogPost[] {
  // Try to read content/posts if it exists
  try {
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true });
      return PRESET_POSTS;
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
      .filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
      .map((fileName) => {
        const slug = fileName.replace(/\.mdx?$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        const { data, content } = matter(fileContents);

        return {
          slug,
          title: data.title || 'Untitled Post',
          description: data.description || '',
          date: data.date || new Date().toISOString().split('T')[0],
          category: data.category || 'General',
          tags: data.tags || [],
          coverImage: data.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
          readTime: data.readTime || '3 min read',
          content,
        } as BlogPost;
      });

    // Sort posts by date
    const sorted = allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
    return sorted.length > 0 ? sorted : PRESET_POSTS;
  } catch (err) {
    console.error('Error reading markdown files, returning preset posts:', err);
    return PRESET_POSTS;
  }
}

export function getPostData(slug: string): BlogPost | null {
  try {
    // Try reading from file first
    const fullPathMd = path.join(postsDirectory, `${slug}.md`);
    const fullPathMdx = path.join(postsDirectory, `${slug}.mdx`);

    let fileContents = '';
    let filePath = '';

    if (fs.existsSync(fullPathMd)) {
      filePath = fullPathMd;
    } else if (fs.existsSync(fullPathMdx)) {
      filePath = fullPathMdx;
    }

    if (filePath) {
      fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      return {
        slug,
        title: data.title || 'Untitled Post',
        description: data.description || '',
        date: data.date || '',
        category: data.category || 'General',
        tags: data.tags || [],
        coverImage: data.coverImage || '',
        readTime: data.readTime || '3 min read',
        content,
      };
    }

    // Fall back to preset posts
    const preset = PRESET_POSTS.find((p) => p.slug === slug);
    return preset || null;
  } catch (err) {
    console.error(`Error reading markdown for slug ${slug}:`, err);
    const preset = PRESET_POSTS.find((p) => p.slug === slug);
    return preset || null;
  }
}
