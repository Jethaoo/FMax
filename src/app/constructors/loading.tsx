export default function ConstructorsLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 w-72 rounded bg-white/10" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-60 rounded-xl bg-white/10" />
        <div className="h-60 rounded-xl bg-white/10" />
      </div>
    </div>
  );
}

