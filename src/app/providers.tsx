'use client';

import { ThemeProvider } from 'next-themes';
import CustomCursor from '@/components/CustomCursor';
import PageTransition from '@/components/PageTransition';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      enableColorScheme
      storageKey="portfolio-theme"
      disableTransitionOnChange
    >
      <CustomCursor />
      <PageTransition>{children}</PageTransition>
    </ThemeProvider>
  );
}
