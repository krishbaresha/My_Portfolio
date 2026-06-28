import NavBar from '@/components/NavBar';
import HeroSkeleton from '@/components/HeroSkeleton';
import BentoSkeleton from '@/components/BentoSkeleton';
import TestimonialsSkeleton from '@/components/TestimonialsSkeleton';

export default function HomePageSkeleton() {
  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden" aria-busy="true" aria-label="Loading page">
      <div className="mesh-background" aria-hidden="true">
        <div className="mesh-blob mesh-blob-a" />
        <div className="mesh-blob mesh-blob-b" />
        <div className="mesh-blob mesh-blob-c" />
      </div>

      <NavBar />

      <section className="hero-shell relative flex flex-col items-center justify-center px-6 pt-24 pb-16">
        <div className="relative z-10 w-full max-w-4xl mx-auto min-h-[420px] sm:min-h-[480px] md:min-h-[520px] flex flex-col items-center justify-center">
          <HeroSkeleton />
        </div>
      </section>

      <BentoSkeleton />

      <section className="relative z-10 py-24 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-6">
              <div className="skeleton h-3 w-16 rounded-full" />
              <div className="skeleton h-10 w-full max-w-md rounded-xl" />
              <div className="skeleton h-4 w-full rounded-full" />
              <div className="skeleton h-4 w-5/6 rounded-full" />
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton h-20 rounded-xl" />
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div className="skeleton h-3 w-24 rounded-full" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton h-28 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <div className="skeleton h-3 w-16 mx-auto rounded-full" />
            <div className="skeleton h-10 w-72 mx-auto rounded-xl" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="skeleton h-24 rounded-xl" />
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSkeleton />

      <section className="relative z-10 py-24 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl border border-border p-8 space-y-6">
            <div className="skeleton h-8 w-48 rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="skeleton h-11 rounded-xl" />
              <div className="skeleton h-11 rounded-xl" />
            </div>
            <div className="skeleton h-32 rounded-xl" />
            <div className="skeleton h-11 w-36 rounded-xl" />
          </div>
        </div>
      </section>
    </main>
  );
}
