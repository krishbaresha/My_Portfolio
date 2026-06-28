import type { Metadata, Viewport } from "next";
import { Archivo, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Krish Baresha | AI Engineer & Creative Technologist",
  description:
    "Portfolio of Krish Baresha. Senior Full Stack Engineer & AI Developer building ultra-premium web experiences, autonomous AI agents, and high-performance interfaces.",
  metadataBase: new URL("https://krishbaresha.com"),
  keywords: [
    "AI Engineer",
    "Creative Developer",
    "Next.js",
    "Bento Grid",
    "Framer Motion",
    "Agentic AI",
    "TypeScript",
    "Liquid Glass",
  ],
  authors: [{ name: "Krish Baresha", url: "https://github.com/krishbaresha" }],
  openGraph: {
    title: "Krish Baresha | AI Engineer & Creative Technologist",
    description:
      "Creative developer portfolio. Agentic workflows and high-fidelity interfaces.",
    url: "https://krishbaresha.com",
    siteName: "Krish Baresha Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Krish Baresha Creative Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Krish Baresha | AI Engineer & Creative Technologist",
    description:
      "Creative developer portfolio. Agentic workflows and high-fidelity interfaces.",
    creator: "@krishbaresha",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0C0A09" },
    { media: "(prefers-color-scheme: light)", color: "#FAFAF9" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivo.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('portfolio-theme');var d=document.documentElement;if(t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches))d.classList.add('dark');else d.classList.remove('dark')}catch(e){}})();`,
          }}
        />
      </head>
      <body className="font-body bg-background text-foreground antialiased selection:bg-accent-gold/20 selection:text-foreground">
        {/* Tactile Noise Texture */}
        <div className="noise-overlay" aria-hidden="true" />

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
