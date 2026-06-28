export default function TestimonialsSkeleton() {
  return (
    <section className="relative z-10 py-24 border-t border-foreground/8">
      <div className="max-w-6xl mx-auto px-6 mb-12 space-y-3">
        <div className="skeleton h-3 w-28 rounded-full" />
        <div className="skeleton h-10 w-72 rounded-xl" />
      </div>
      <div className="flex gap-6 px-6 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-[340px] shrink-0 skeleton rounded-2xl" style={{ height: '180px' }} />
        ))}
      </div>
    </section>
  );
}
