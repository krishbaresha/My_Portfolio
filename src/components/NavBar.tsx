'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import AnimatedLink from './AnimatedLink';

const NAV_ITEMS = [
  { name: 'Projects', href: '#projects' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
];

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  // Increase glass opacity as user scrolls
  const navOpacity = useTransform(scrollY, [0, 80], [0.6, 0.92]);
  const navBlur = useTransform(scrollY, [0, 80], [12, 24]);

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] px-4 pt-4 font-body">
      <motion.div
        style={{ opacity: 1 }}
        className="max-w-5xl mx-auto"
      >
        <motion.nav
          style={{ backdropFilter: `blur(${navBlur}px) saturate(180%)` }}
          className="liquid-glass flex items-center justify-between px-5 py-3 rounded-2xl"
        >
          {/* Logo */}
          <AnimatedLink
            href="/"
            className="flex items-center gap-2 group"
            aria-label="Krish Baresha — home"
            hoverScale={1.03}
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-heading font-700 tracking-tight text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Krish Baresha
            </span>
          </AnimatedLink>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <AnimatedLink
                key={item.name}
                href={item.href}
                className="px-3 py-1.5 text-xs font-medium tracking-wide text-foreground/60 hover:text-foreground rounded-lg hover:bg-foreground/5 transition-colors duration-200"
                hoverScale={1.05}
                tapScale={0.95}
              >
                {item.name}
              </AnimatedLink>
            ))}
          </nav>

          {/* Right: CTA + theme + mobile toggle */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <AnimatedLink
              href="#contact"
              id="nav-hire-me"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-xs font-semibold tracking-wide transition-colors duration-200 shadow-lg shadow-amber-500/25 hover:shadow-amber-400/30 cursor-pointer"
              hoverScale={1.04}
              tapScale={0.96}
            >
              Hire Me
            </AnimatedLink>

            {/* Mobile hamburger */}
            <motion.button
              id="mobile-nav-toggle"
              onClick={() => setMobileOpen((o) => !o)}
              whileTap={{ scale: 0.9 }}
              className="md:hidden w-9 h-9 rounded-xl liquid-glass flex items-center justify-center text-foreground/70 cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mobileOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.nav>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-nav-menu"
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="mt-2 liquid-glass rounded-2xl p-4 flex flex-col gap-1 md:hidden"
            >
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                >
                  <AnimatedLink
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2.5 text-sm font-medium text-foreground/70 hover:text-foreground rounded-xl hover:bg-foreground/5 transition-colors"
                    hoverScale={1.02}
                    tapScale={0.98}
                  >
                    {item.name}
                  </AnimatedLink>
                </motion.div>
              ))}
              <div className="h-px bg-foreground/8 my-1" />
              <AnimatedLink
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="mt-1 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-center text-sm font-semibold transition-colors"
                hoverScale={1.02}
                tapScale={0.98}
              >
                Hire Me
              </AnimatedLink>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}
