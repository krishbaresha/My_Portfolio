/**
 * BentoSkeleton — shimmer placeholder grid shown while project data loads.
 * Dimensions match BentoGrid card minHeights (360px large / 240px standard).
 */
export default function BentoSkeleton() {
  return (
    <section id="projects" className="relative z-10 py-24 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header skeleton — matches BentoGrid header flex layout */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 min-h-[7.5rem]">
          <div className="flex flex-col gap-3 max-w-lg min-w-0">
            <div className="skeleton h-3 w-24 rounded-full shrink-0" />
            <div className="skeleton h-10 w-64 max-w-full rounded-xl shrink-0" />
            <div className="skeleton h-4 w-80 max-w-full rounded-full shrink-0" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap p-1 rounded-xl border border-border bg-surface/50 shrink-0">
            {[80, 60, 72, 68, 56].map((w, i) => (
              <div key={i} className="skeleton h-8 rounded-full shrink-0" style={{ width: `${w}px` }} />
            ))}
          </div>
        </div>

        {/* Bento grid skeleton — fixed heights match BentoCard minHeight */}
        <div className="bento-grid">
          <div className="bento-lg skeleton min-h-[360px] h-[360px]" />
          <div className="bento-md skeleton min-h-[360px] h-[360px]" />
          <div className="bento-sm skeleton min-h-[240px] h-[240px]" />
          <div className="bento-sm skeleton min-h-[240px] h-[240px]" />
          <div className="bento-sm skeleton min-h-[240px] h-[240px]" />
          <div className="bento-md skeleton min-h-[240px] h-[240px]" />
          <div className="bento-md skeleton min-h-[240px] h-[240px]" />
        </div>
      </div>
    </section>
  );
}
