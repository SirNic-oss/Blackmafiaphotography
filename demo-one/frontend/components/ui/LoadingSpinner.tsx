interface LoadingSpinnerProps {
  label?: string;
}

export default function LoadingSpinner({
  label = "Loading…",
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white"
        aria-hidden
      />
      <p className="text-zinc-400 text-sm">{label}</p>
    </div>
  );
}
