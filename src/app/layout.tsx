import type { Metadata, Viewport } from "next";
import { Syne } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import LenisScroll from "@/components/LenisScroll";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Krish Baresha | AI Engineer & Creative Technologist",
  description: "Portfolio of Krish Baresha. Senior Full Stack Engineer & AI Developer building ultra-premium web experiences, autonomous AI agents, and WebGL visualizations.",
  metadataBase: new URL("https://krishbaresha.com"),
  keywords: ["AI Engineer", "Creative Developer", "Next.js", "WebGL", "Three.js", "GSAP", "Agentic AI", "TypeScript", "Linear Design"],
  authors: [{ name: "Krish Baresha", url: "https://github.com/krishbaresha" }],
  openGraph: {
    title: "Krish Baresha | AI Engineer & Creative Technologist",
    description: "Creative developer portfolio. Custom WebGL shaders, Agentic workflows, and high-fidelity interfaces.",
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
    description: "Creative developer portfolio. Custom WebGL shaders, Agentic workflows, and high-fidelity interfaces.",
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
  themeColor: "#030303",
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
      className={`${syne.variable} antialiased`}
    >
      <body className="font-sans bg-background text-foreground antialiased selection:bg-accent-glow selection:text-white">
        {/* Tactile Noise Texture */}
        <div className="noise-overlay" />
        
        {/* Smooth Lenis Scroll Handler */}
        <LenisScroll />

        {/* Apple-style Mouse Spotlight cursor */}
        <CustomCursor />
        
        {children}
      </body>
    </html>
  );
}
