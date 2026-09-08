import { Loader2 } from "lucide-react";

export default function EventDetailLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
      <div className="flex items-center gap-2 rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-16" role="status" aria-live="polite">
        <Loader2 className="size-5 animate-spin text-orange-700" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">Memuat event...</p>
      </div>
    </div>
  );
}