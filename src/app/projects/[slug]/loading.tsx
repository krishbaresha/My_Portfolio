export default function ProjectDetailLoading() {
  return (
    <main className="min-h-screen bg-background text-foreground font-body py-28 px-6" aria-busy="true" aria-label="Loading project">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="skeleton h-4 w-28 rounded-full" />
        <div className="skeleton aspect-[16/9] w-full rounded-2xl" />

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="skeleton h-6 w-20 rounded-md" />
            <div className="skeleton h-6 w-20 rounded-md" />
          </div>
          <div className="skeleton h-12 w-full max-w-xl rounded-xl" />
          <div className="skeleton h-4 w-full rounded-full" />
          <div className="skeleton h-4 w-4/5 rounded-full" />
        </div>

        <div className="flex gap-3">
          <div className="skeleton h-10 w-28 rounded-lg" />
          <div className="skeleton h-10 w-32 rounded-lg" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="skeleton h-40 rounded-2xl" />
          <div className="skeleton h-40 rounded-2xl" />
        </div>

        <div className="skeleton h-48 rounded-2xl" />

        <div className="flex flex-wrap gap-2">
          {[72, 64, 80, 56, 68].map((w) => (
            <div key={w} className="skeleton h-8 rounded-lg" style={{ width: `${w}px` }} />
          ))}
        </div>
      </div>
    </main>
  );
}
