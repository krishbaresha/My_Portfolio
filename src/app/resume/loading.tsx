export default function ResumeLoading() {
  return (
    <main className="min-h-screen bg-background font-body py-24 px-6" aria-busy="true" aria-label="Loading resume">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <div className="skeleton h-4 w-40 rounded-full" />
          <div className="skeleton h-10 w-44 rounded-full" />
        </div>

        <div className="rounded-3xl border border-border p-10 md:p-14 space-y-10">
          <div className="flex flex-col md:flex-row justify-between gap-6 pb-8 border-b border-border">
            <div className="space-y-3 flex-1">
              <div className="skeleton h-10 w-64 rounded-xl" />
              <div className="skeleton h-4 w-80 max-w-full rounded-full" />
              <div className="skeleton h-4 w-full rounded-full" />
              <div className="skeleton h-4 w-5/6 rounded-full" />
            </div>
            <div className="skeleton h-24 w-24 rounded-2xl shrink-0" />
          </div>

          <div className="space-y-4">
            <div className="skeleton h-3 w-20 rounded-full" />
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton h-28 rounded-xl" />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="skeleton h-3 w-28 rounded-full" />
            {[1, 2].map((i) => (
              <div key={i} className="skeleton h-36 rounded-xl" />
            ))}
          </div>

          <div className="space-y-4">
            <div className="skeleton h-3 w-24 rounded-full" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-24 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
