# Production Deployment Guide: Vercel & Custom Domain

This document provides step-by-step instructions on deploying the portfolio for free using **Vercel** and linking your custom domain **`krishbaresha.tech`**.

---

## Part 1: Free Hosting with Vercel

Vercel is the creator of Next.js and provides the best serverless hosting platform for Next.js applications. It is 100% free for personal use (Hobby plan), includes global edge network caching, automated SSL, and instant CI/CD on git pushes.

### Steps to Deploy:

1. **Sign Up / Log In to Vercel**:
   Go to [vercel.com](https://vercel.com) and log in using your **GitHub account**.

2. **Import Your Repository**:
   - Click on the **"New Project"** button in your Vercel Dashboard.
   - Under "Import Git Repository", find and select your `My_Portfolio` repository.
   - Click **"Import"**.

3. **Configure Project Settings**:
   - **Framework Preset**: Vercel will automatically detect **Next.js**. Keep it as default.
   - **Root Directory**: `./` (default).
   - **Build & Development Settings**: Vercel will auto-configure `npm run build` and `next export`/`next start`. Leave these as default.

4. **Set Up Environment Variables**:
   Expand the **"Environment Variables"** dropdown and add the keys from your local `.env.local` file:
   - `GITHUB_USERNAME` = `krishbaresha`
   - `GITHUB_TOKEN` = `your_github_personal_access_token` (used to pull repo stats and commit counts)
   - `ADMIN_PASSCODE` = `your_admin_passcode` (used for the admin interface)
   - `AI_PROVIDER` = `GEMINI` (or your preferred AI model provider)
   - `GEMINI_API_KEY` = `your_gemini_api_key` (if using the built-in AI chatbot)
   - `NEXT_PUBLIC_SUPABASE_URL` = `your_supabase_url` (optional, falls back to local storage if not configured)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your_supabase_anon_key` (optional)

5. **Deploy**:
   Click the **"Deploy"** button. Vercel will clone, build, and deploy your site in less than 2 minutes. Once complete, you will receive a free public domain (e.g., `my-portfolio-three.vercel.app`).

---

## Part 2: Configuring Custom Domain `krishbaresha.tech`

Once deployed, you can easily point your custom domain `krishbaresha.tech` to your Vercel site for free.

### Step 1: Add Domain to Vercel
1. In your Vercel project dashboard, navigate to **Settings** -> **Domains**.
2. Type **`krishbaresha.tech`** in the text box and click **Add**.
3. Vercel will prompt you to select whether you want to redirect `www.krishbaresha.tech` to `krishbaresha.tech` (recommended) or keep them separate. Select **"Redirect to krishbaresha.tech"** and click **Add**.

### Step 2: Configure DNS Settings at Your Domain Registrar
Log in to the registrar where you purchased `krishbaresha.tech` (e.g., GoDaddy, Namecheap, Hostinger, etc.) and open the **DNS Management / DNS Zone Editor** page.

Add the following DNS records:

| Record Type | Host/Name | Value/Points To | TTL | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` | `76.76.21.21` | Automatic / 3600 | Points your apex domain `krishbaresha.tech` to Vercel. |
| **CNAME** | `www` | `cname.vercel-dns.com.` | Automatic / 3600 | Points the `www` subdomain to Vercel's DNS router. |

> [!NOTE]
> If there are existing `A` records for `@` or `CNAME` records for `www`, edit them or delete them to avoid conflicts.

### Step 3: Wait for DNS Propagation & SSL Verification
- After adding the DNS records, return to Vercel's Domains page.
- Vercel will automatically check the records. Propagation usually takes anywhere from 5 minutes to a few hours depending on your registrar.
- Once DNS is resolved, Vercel will automatically issue a free Let's Encrypt SSL certificate and secure your site with HTTPS (`https://krishbaresha.tech`).

---

## Part 3: Continuous Integration (CI/CD)

Whenever you commit and push new code to the `main` branch of your GitHub repository:
1. GitHub will notify Vercel via webhook.
2. Vercel will trigger a **Preview/Production Build** automatically.
3. Your live site will be updated zero-downtime once the build succeeds.
