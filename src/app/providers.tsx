'use client';

import { ThemeProvider } from 'next-themes';

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
      {children}
    </ThemeProvider>
  );
}
