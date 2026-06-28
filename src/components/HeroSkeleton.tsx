/**
 * HeroSkeleton — placeholder that mirrors HeroSection dimensions to prevent CLS.
 * Shown until MountedReveal confirms client mount.
 */
export default function HeroSkeleton() {
  return (
    <div
      className="flex flex-col items-center justify-center text-center space-y-8 w-full max-w-4xl mx-auto px-6"
      aria-hidden="true"
    >
      {/* Status badge */}
      <div className="skeleton h-9 w-72 max-w-full rounded-full" />

      {/* Heading — two lines matching text-5xl → text-8xl scale */}
      <div className="w-full space-y-3">
        <div className="skeleton h-12 sm:h-14 md:h-16 lg:h-20 w-full max-w-md mx-auto rounded-xl" />
        <div className="skeleton h-12 sm:h-14 md:h-16 lg:h-20 w-full max-w-sm mx-auto rounded-xl" />
      </div>

      {/* Sub-heading */}
      <div className="w-full max-w-2xl mx-auto space-y-2">
        <div className="skeleton h-4 w-full rounded-full" />
        <div className="skeleton h-4 w-5/6 mx-auto rounded-full" />
      </div>

      {/* CTA row */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="skeleton h-11 w-32 rounded-xl" />
        <div className="skeleton h-11 w-32 rounded-xl" />
      </div>

      {/* Social row */}
      <div className="flex items-center justify-center gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton w-10 h-10 rounded-xl shrink-0" />
        ))}
      </div>
    </div>
  );
}
