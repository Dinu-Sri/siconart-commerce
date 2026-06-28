import { Eye } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-foreground/20 bg-surface">
        <Eye className="h-6 w-6" />
      </span>
      <span className="leading-none">
        <span className="block text-lg font-black tracking-tight">Sicon Art</span>
        <span className="block pt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Chinese brushes
        </span>
      </span>
    </div>
  );
}
