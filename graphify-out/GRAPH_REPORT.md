# Graph Report - .  (2026-06-22)

## Corpus Check
- Corpus is ~15,474 words - fits in a single context window. You may not need a graph.

## Summary
- 94 nodes · 121 edges · 13 communities (10 shown, 3 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

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

## God Nodes (most connected - your core abstractions)
1. `getSortedPostsData()` - 7 edges
2. `fetchGitHubRepos()` - 6 edges
3. `RepoData` - 5 edges
4. `SectionReveal()` - 4 edges
5. `db` - 4 edges
6. `ProjectDetailPage()` - 3 edges
7. `fetchRepoReadme()` - 3 edges
8. `getPostData()` - 3 edges
9. `GET()` - 2 edges
10. `GET()` - 2 edges

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

## Communities (13 total, 3 thin omitted)

### Community 0 - "Home Page & Showcase"
Cohesion: 0.16
Nodes (10): NAV_ITEMS, Testimonial, TIMELINE_ITEMS, InteractiveTerminal(), LogLine, ProjectCard(), ProjectCardProps, SectionReveal() (+2 more)

### Community 1 - "Blog & Markdown Engine"
Cohesion: 0.20
Nodes (10): sitemap(), GET(), BlogPost, getPostData(), getSortedPostsData(), postsDirectory, PRESET_POSTS, BlogPostPage() (+2 more)

### Community 2 - "GitHub Integration"
Cohesion: 0.27
Nodes (9): GET(), FALLBACK_PROJECTS, fetchGitHubRepos(), fetchRepoReadme(), GitHubRepoResponse, headers, ProjectDetailPage(), generateStaticParams() (+1 more)

### Community 3 - "Admin Dashboard & Supabase"
Cohesion: 0.28
Nodes (4): Contact, NewTestimonial, Testimonial, db

### Community 4 - "Root Layout & Global Scroll"
Cohesion: 0.25
Nodes (4): metadata, syne, viewport, LenisScroll()

### Community 5 - "Interactive Resume Page"
Cohesion: 0.29
Nodes (5): CERTIFICATIONS, EDUCATION, EXPERIENCE, PROJECTS, SKILLS

### Community 6 - "Interactive Skills Sphere"
Cohesion: 0.33
Nodes (3): Skill, SKILL_SPHERES, SkillSphere

## Knowledge Gaps
- **30 isolated node(s):** `NewTestimonial`, `Testimonial`, `Contact`, `PageProps`, `syne` (+25 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `db` connect `Admin Dashboard & Supabase` to `Home Page & Showcase`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `RepoData` connect `Home Page & Showcase` to `GitHub Integration`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `fetchGitHubRepos()` (e.g. with `ProjectDetailPage()` and `generateStaticParams()`) actually correct?**
  _`fetchGitHubRepos()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `NewTestimonial`, `Testimonial`, `Contact` to the rest of the system?**
  _30 weakly-connected nodes found - possible documentation gaps or missing edges._