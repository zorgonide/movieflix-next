export default function Loading() {
  return (
    <main className="container mx-auto p-8">
      <div className="mb-6 h-9 w-1/3 animate-pulse rounded-md bg-slate-700"></div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="aspect-[2/3] w-full animate-pulse rounded-lg bg-slate-800"></div>
            <div className="h-5 w-3/4 animate-pulse rounded-md bg-slate-800"></div>
          </div>
        ))}
      </div>
    </main>
  );
}
