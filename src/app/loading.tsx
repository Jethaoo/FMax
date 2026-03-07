export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 w-56 rounded bg-white/10" />
      <div className="h-48 rounded-xl bg-white/10" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-28 rounded-xl bg-white/10" />
        <div className="h-28 rounded-xl bg-white/10" />
        <div className="h-28 rounded-xl bg-white/10" />
      </div>
    </div>
  );
}

