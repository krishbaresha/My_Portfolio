# Graph Report - .  (2026-06-28)

## Corpus Check
- Large corpus: 233 files · ~1,195,949 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 90 nodes · 65 edges · 33 communities (5 shown, 28 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0 (Core Modules)|Community 0 (Core Modules)]]
- [[_COMMUNITY_Database & Utilities|Database & Utilities]]
- [[_COMMUNITY_Community 2 (Core Modules)|Community 2 (Core Modules)]]
- [[_COMMUNITY_Community 3 (Core Modules)|Community 3 (Core Modules)]]
- [[_COMMUNITY_Community 4 (Core Modules)|Community 4 (Core Modules)]]
- [[_COMMUNITY_Community 5 (Core Modules)|Community 5 (Core Modules)]]
- [[_COMMUNITY_Community 6 (Core Modules)|Community 6 (Core Modules)]]
- [[_COMMUNITY_Community 7 (Core Modules)|Community 7 (Core Modules)]]
- [[_COMMUNITY_Community 8 (Core Modules)|Community 8 (Core Modules)]]
- [[_COMMUNITY_Community 9 (Core Modules)|Community 9 (Core Modules)]]
- [[_COMMUNITY_API Routes & Integrations|API Routes & Integrations]]
- [[_COMMUNITY_API Routes & Integrations|API Routes & Integrations]]
- [[_COMMUNITY_UI Components & Layout|UI Components & Layout]]
- [[_COMMUNITY_UI Components & Layout|UI Components & Layout]]
- [[_COMMUNITY_UI Components & Layout|UI Components & Layout]]
- [[_COMMUNITY_UI Components & Layout|UI Components & Layout]]
- [[_COMMUNITY_UI Components & Layout|UI Components & Layout]]
- [[_COMMUNITY_UI Components & Layout|UI Components & Layout]]
- [[_COMMUNITY_API Routes & Integrations|API Routes & Integrations]]
- [[_COMMUNITY_API Routes & Integrations|API Routes & Integrations]]
- [[_COMMUNITY_API Routes & Integrations|API Routes & Integrations]]
- [[_COMMUNITY_Database & Utilities|Database & Utilities]]
- [[_COMMUNITY_Database & Utilities|Database & Utilities]]
- [[_COMMUNITY_Database & Utilities|Database & Utilities]]
- [[_COMMUNITY_Database & Utilities|Database & Utilities]]
- [[_COMMUNITY_Database & Utilities|Database & Utilities]]
- [[_COMMUNITY_Database & Utilities|Database & Utilities]]
- [[_COMMUNITY_Database & Utilities|Database & Utilities]]
- [[_COMMUNITY_Database & Utilities|Database & Utilities]]
- [[_COMMUNITY_Database & Utilities|Database & Utilities]]
- [[_COMMUNITY_Database & Utilities|Database & Utilities]]
- [[_COMMUNITY_Blog Content & Templates|Blog Content & Templates]]
- [[_COMMUNITY_Community 32 (Core Modules)|Community 32 (Core Modules)]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `scripts` - 5 edges
3. `generate_content()` - 4 edges
4. `_generate_project_description()` - 4 edges
5. `_generate_project_cover()` - 4 edges
6. `main()` - 4 edges
7. `_fetch_github_repo_data()` - 3 edges
8. `paths` - 2 edges
9. `private` - 1 edges
10. `dev` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (33 total, 28 thin omitted)

### Community 0 - "Community 0 (Core Modules)"
Cohesion: 0.12
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 1 - "Database & Utilities"
Cohesion: 0.14
Nodes (14): dependencies, canvas-confetti, framer-motion, gray-matter, gsap, @gsap/react, lenis, lucide-react (+6 more)

### Community 2 - "Community 2 (Core Modules)"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/canvas-confetti, @types/node, @types/react (+2 more)

### Community 3 - "Community 3 (Core Modules)"
Cohesion: 0.31
Nodes (9): _fetch_github_repo_data(), generate_content(), _generate_project_cover(), _generate_project_description(), main(), Uses the high-level generate_content function to write a portfolio description., Generates an aesthetic SVG cover image using nano-banana-pro-preview based on th, Private function to fetch a repository's metadata and its README using the GitHu (+1 more)

### Community 4 - "Community 4 (Core Modules)"
Cohesion: 0.22
Nodes (8): name, private, scripts, build, dev, lint, start, version

## Knowledge Gaps
- **73 isolated node(s):** `name`, `version`, `private`, `dev`, `build` (+68 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Database & Utilities` to `Community 4 (Core Modules)`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Community 2 (Core Modules)` to `Community 4 (Core Modules)`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Why does `compilerOptions` connect `Community 0 (Core Modules)` to `Community 5 (Core Modules)`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _77 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0 (Core Modules)` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `Database & Utilities` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._