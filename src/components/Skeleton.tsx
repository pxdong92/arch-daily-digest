import { cn } from "@/lib/utils"

export function LoadingSkeleton() {
  const heights = ["h-72", "h-56", "h-64", "h-80", "h-60", "h-72", "h-56", "h-68", "h-76", "h-52"];

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 py-6">
      {heights.map((h, i) => (
        <div key={i} className="break-inside-avoid mb-4">
          <div className="bg-card rounded-lg overflow-hidden">
            <div className={cn(h, "bg-muted animate-pulse-subtle")} />
            <div className="p-4 space-y-2.5">
              <div className="h-4 bg-muted rounded-md animate-pulse-subtle w-4/5" />
              <div className="h-3.5 bg-muted rounded-md animate-pulse-subtle w-3/5" />
              <div className="h-3 bg-muted rounded-md animate-pulse-subtle w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
