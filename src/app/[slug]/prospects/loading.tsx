export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-6xl animate-pulse flex-col gap-6">
      <div className="h-7 w-40 rounded bg-ink-card" />
      <div className="h-10 rounded-lg bg-ink-card" />
      <div className="flex flex-col gap-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-11 rounded-lg bg-ink-card" />
        ))}
      </div>
    </div>
  );
}
