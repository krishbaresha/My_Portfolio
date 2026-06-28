# Graph Report - My_Portfolio  (2026-06-28)

## Corpus Check
- 69 files · ~1,196,651 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 362 nodes · 374 edges · 49 communities (32 shown, 17 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `61353a54`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Home Page & Showcase|Home Page & Showcase]]
- [[_COMMUNITY_Blog & Markdown Engine|Blog & Markdown Engine]]
- [[_COMMUNITY_GitHub Integration|GitHub Integration]]
- [[_COMMUNITY_Admin Dashboard & Supabase|Admin Dashboard & Supabase]]
- [[_COMMUNITY_Root Layout & Global Scroll|Root Layout & Global Scroll]]
- [[_COMMUNITY_Interactive Resume Page|Interactive Resume Page]]
- [[_COMMUNITY_Interactive Skills Sphere|Interactive Skills Sphere]]
- [[_COMMUNITY_ChatBot Component|ChatBot Component]]
- [[_COMMUNITY_3D Scrolly Canvas|3D Scrolly Canvas]]
- [[_COMMUNITY_Overlay Component|Overlay Component]]
- [[_COMMUNITY_Scroll Sequence Animation|Scroll Sequence Animation]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `What You Must Do When Invoked` - 11 edges
3. `/graphify` - 11 edges
4. `What You Must Do When Invoked` - 11 edges
5. `/graphify` - 10 edges
6. `graphify reference: extra exports and benchmark` - 8 edges
7. `graphify reference: extra exports and benchmark` - 8 edges
8. `getSortedPostsData()` - 7 edges
9. `Project Title` - 7 edges
10. `Portfolio Information Template` - 7 edges

## Surprising Connections (you probably didn't know these)
- `generateStaticParams()` --calls--> `getSortedPostsData()`  [INFERRED]
  src/app/blog/[slug]/page.tsx → src/lib/markdown.ts
- `generateStaticParams()` --calls--> `fetchGitHubRepos()`  [INFERRED]
  src/app/projects/[slug]/page.tsx → src/lib/github.ts
- `GET()` --calls--> `getSortedPostsData()`  [EXTRACTED]
  src/app/api/blog/route.ts → src/lib/markdown.ts
- `GET()` --calls--> `fetchGitHubRepos()`  [EXTRACTED]
  src/app/api/github/route.ts → src/lib/github.ts
- `BlogPostPage()` --calls--> `getPostData()`  [INFERRED]
  src/app/blog/[slug]/page.tsx → src/lib/markdown.ts

## Import Cycles
- None detected.

## Communities (49 total, 17 thin omitted)

### Community 0 - "Home Page & Showcase"
Cohesion: 0.11
Nodes (12): STATS, TIMELINE_ITEMS, Message, PRESETS, CATEGORIES, Category, SKILL_CATEGORIES, childVariants (+4 more)

### Community 1 - "Blog & Markdown Engine"
Cohesion: 0.20
Nodes (10): sitemap(), GET(), BlogPost, getPostData(), getSortedPostsData(), postsDirectory, PRESET_POSTS, BlogPostPage() (+2 more)

### Community 2 - "GitHub Integration"
Cohesion: 0.20
Nodes (11): ProjectCardProps, GET(), FALLBACK_PROJECTS, fetchGitHubRepos(), fetchRepoReadme(), GitHubRepoResponse, headers, RepoData (+3 more)

### Community 3 - "Admin Dashboard & Supabase"
Cohesion: 0.08
Nodes (20): Contact, EMPTY_PROJECT, NewTestimonial, Home(), BENTO_SIZES, FILTERS, containerVariants, itemVariants (+12 more)

### Community 4 - "Root Layout & Global Scroll"
Cohesion: 0.29
Nodes (5): archivo, metadata, spaceGrotesk, viewport, Providers()

### Community 5 - "Interactive Resume Page"
Cohesion: 0.29
Nodes (5): CERTIFICATIONS, EDUCATION, EXPERIENCE, PROJECTS, SKILLS

### Community 6 - "Interactive Skills Sphere"
Cohesion: 0.08
Nodes (25): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+17 more)

### Community 7 - "ChatBot Component"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 8 - "3D Scrolly Canvas"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 9 - "Overlay Component"
Cohesion: 0.11
Nodes (18): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/canvas-confetti, @types/node, @types/react (+10 more)

### Community 12 - "Scroll Sequence Animation"
Cohesion: 0.14
Nodes (14): dependencies, canvas-confetti, framer-motion, gray-matter, gsap, @gsap/react, lenis, lucide-react (+6 more)

### Community 13 - "Community 13"
Cohesion: 0.15
Nodes (12): 1. Personal Information, 2. Social Media & Professional Links, 3. Tech Stack & Skills, 4. Projects, 5. Experience & Education, 6. Preferences & Custom Styling, Education:, Experience: (+4 more)

### Community 14 - "Community 14"
Cohesion: 0.31
Nodes (9): _fetch_github_repo_data(), generate_content(), _generate_project_cover(), _generate_project_description(), main(), Uses the high-level generate_content function to write a portfolio description., Generates an aesthetic SVG cover image using nano-banana-pro-preview based on th, Private function to fetch a repository's metadata and its README using the GitHu (+1 more)

### Community 15 - "Community 15"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 16 - "Community 16"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 17 - "Community 17"
Cohesion: 0.22
Nodes (8): Part 1: Free Hosting with Vercel, Part 2: Configuring Custom Domain `krishbaresha.tech`, Part 3: Continuous Integration (CI/CD), Production Deployment Guide: Vercel & Custom Domain, Step 1: Add Domain to Vercel, Step 2: Configure DNS Settings at Your Domain Registrar, Step 3: Wait for DNS Propagation & SSL Verification, Steps to Deploy:

### Community 18 - "Community 18"
Cohesion: 0.25
Nodes (7): Contributing, Features, Installation, License, Project Title, Table of Contents, Usage

### Community 19 - "Community 19"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 20 - "Community 20"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 22 - "Community 22"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 23 - "Community 23"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 24 - "Community 24"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 25 - "Community 25"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 26 - "Community 26"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 27 - "Community 27"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

## Knowledge Gaps
- **193 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+188 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Scroll Sequence Animation` to `Overlay Component`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _197 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Home Page & Showcase` be split into smaller, more focused modules?**
  _Cohesion score 0.11462450592885376 - nodes in this community are weakly interconnected._
- **Should `Admin Dashboard & Supabase` be split into smaller, more focused modules?**
  _Cohesion score 0.07777777777777778 - nodes in this community are weakly interconnected._
- **Should `Interactive Skills Sphere` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `ChatBot Component` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `3D Scrolly Canvas` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._