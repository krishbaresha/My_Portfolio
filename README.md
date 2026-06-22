# Krish Baresha — Portfolio

A cinematic, ultra-premium developer portfolio built with **Next.js 16**, **GSAP**, **Framer Motion**, and **Tailwind CSS v4**. Features scroll-driven canvas animations, an AI chatbot, interactive skills sphere, live GitHub integration, and Supabase-powered contact forms.

🌐 **Live**: [krishbaresha.tech](https://krishbaresha.tech)

---

## ✨ Features

- **Cinematic Hero**: 160-frame scroll-scrubbed canvas animation with GSAP ScrollTrigger
- **AI Chatbot**: Gemini/Grok-powered assistant trained on portfolio context
- **GitHub Integration**: Live repo stats, commit counts, and project cards
- **Interactive Skills**: Animated progress bars with code snippet inspector
- **Interactive Terminal**: Browser shell with portfolio commands
- **Contact Form**: Supabase-backed with confetti success state
- **Blog**: Markdown-driven with preset posts fallback
- **Resume Page**: Printable PDF-ready resume
- **Custom Cursor**: Spring-physics cursor with link hover detection
- **Smooth Scroll**: Lenis-powered smooth scrolling with GSAP ScrollTrigger sync
- **Testimonials**: Infinite marquee carousel

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm / pnpm

### Installation

```bash
git clone https://github.com/krishbaresha/My_Portfolio.git
cd My_Portfolio
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
# GitHub
GITHUB_USERNAME=krishbaresha
GITHUB_TOKEN=your_pat_token

# AI Provider (GEMINI or GROK)
AI_PROVIDER=GEMINI
GEMINI_API_KEY=your_gemini_api_key

# Admin
ADMIN_PASSCODE=your_passcode

# Supabase (optional — falls back to localStorage without these)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm run start
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | GSAP + Framer Motion |
| Smooth Scroll | Lenis |
| Database | Supabase (PostgreSQL) |
| AI | Gemini API / Grok |
| Icons | Lucide React |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main portfolio page
│   ├── layout.tsx        # Root layout with fonts & metadata
│   ├── globals.css       # Design system & animations
│   ├── admin/            # Admin panel
│   ├── api/              # GitHub, chat, blog API routes
│   ├── blog/             # Blog listing & articles
│   ├── projects/         # Project case studies
│   └── resume/           # Printable resume page
├── components/
│   ├── ScrollyCanvas.tsx # 160-frame canvas scroll animation
│   ├── Overlay.tsx       # Hero text overlay scenes
│   ├── Projects.tsx      # GitHub projects carousel
│   ├── ChatBot.tsx       # AI assistant chatbot
│   ├── InteractiveSkills.tsx
│   ├── InteractiveTerminal.tsx
│   ├── ContactForm.tsx
│   └── CustomCursor.tsx
└── lib/
    ├── github.ts         # GitHub API client
    ├── supabase.ts       # Supabase client + db helpers
    └── markdown.ts       # Blog markdown parser
```

---

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the complete guide on:
- Free hosting with Vercel
- Custom domain DNS setup for `krishbaresha.tech`
- Environment variable configuration
- Continuous deployment via GitHub

---

## 📄 License

MIT — feel free to use this as inspiration, but please build your own unique design.

---

**Designed & built by [Krish Baresha](https://github.com/krishbaresha)**
