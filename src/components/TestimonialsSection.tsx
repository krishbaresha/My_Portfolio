import { db } from '@/lib/supabase';
import SectionReveal, { RevealItem } from '@/components/SectionReveal';

export default async function TestimonialsSection() {
  const testimonials = await db.getTestimonials();
  if (testimonials.length === 0) return null;

  return (
    <section className="relative z-10 py-24 bg-foreground/[0.02] border-t border-foreground/8 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <SectionReveal>
          <RevealItem>
            <span className="text-xs font-semibold tracking-[0.2em] text-amber-500 uppercase">
              Endorsements
            </span>
          </RevealItem>
          <RevealItem>
            <h2 className="text-4xl font-heading font-700 text-foreground mt-2 tracking-tight">
              What clients say
            </h2>
          </RevealItem>
        </SectionReveal>
      </div>

      <div
        className="flex w-[200vw] gap-6 hover:[animation-play-state:paused]"
        style={{ animation: 'marquee 40s linear infinite' }}
      >
        <div className="flex gap-6 justify-around w-full">
          {[...testimonials, ...testimonials].map((t, idx) => (
            <div
              key={idx}
              className="w-[340px] inline-block shrink-0 liquid-glass p-6 rounded-2xl"
              style={{ whiteSpace: 'normal' }}
            >
              <p className="text-sm text-foreground/60 font-light leading-relaxed mb-6">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                {t.avatar_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={t.avatar_url}
                    alt={t.name}
                    className="w-9 h-9 rounded-full object-cover border border-foreground/10"
                  />
                )}
                <div>
                  <div className="text-sm font-semibold text-foreground">{t.name}</div>
                  <div className="text-[10px] text-foreground/40 tracking-wider uppercase">
                    {t.role} @ {t.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
