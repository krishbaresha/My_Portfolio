/**
 * BentoSkeleton — shimmer placeholder grid shown while project data loads.
 * Matches the layout structure of BentoGrid to prevent CLS.
 */
export default function BentoSkeleton() {
  return (
    <section className="relative z-10 py-24 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header skeleton */}
        <div className="flex flex-col gap-3">
          <div className="skeleton h-3 w-24 rounded-full" />
          <div className="skeleton h-10 w-64 rounded-xl" />
          <div className="skeleton h-4 w-80 rounded-full" />
        </div>

        {/* Filter tab skeleton */}
        <div className="flex gap-2">
          {[80, 60, 72, 68].map((w, i) => (
            <div key={i} className={`skeleton h-8 rounded-full`} style={{ width: `${w}px` }} />
          ))}
        </div>

        {/* Bento grid skeleton */}
        <div className="bento-grid">
          {/* Large featured card */}
          <div className="bento-lg skeleton" style={{ height: '320px' }} />
          {/* Medium card */}
          <div className="bento-md skeleton" style={{ height: '320px' }} />
          {/* Three smaller cards */}
          <div className="bento-sm skeleton" style={{ height: '220px' }} />
          <div className="bento-sm skeleton" style={{ height: '220px' }} />
          <div className="bento-sm skeleton" style={{ height: '220px' }} />
          <div className="bento-md skeleton" style={{ height: '220px' }} />
          <div className="bento-md skeleton" style={{ height: '220px' }} />
        </div>
      </div>
    </section>
  );
}
