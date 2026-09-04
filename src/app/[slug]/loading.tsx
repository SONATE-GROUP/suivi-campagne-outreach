export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-5xl animate-pulse flex-col gap-7">
      <div className="h-7 w-52 rounded bg-ink-card" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-ink-card" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-64 rounded-xl bg-ink-card" />
        <div className="h-64 rounded-xl bg-ink-card" />
      </div>
      <div className="h-56 rounded-xl bg-ink-card" />
    </div>
  );
}
