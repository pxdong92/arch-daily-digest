import { cn } from "@/lib/utils"

interface SourceTagProps {
  source: "gooood" | "archdaily";
  className?: string;
}

export function SourceTag({ source, className }: SourceTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium tracking-wide",
        source === "gooood"
          ? "bg-gooood-light text-gooood"
          : "bg-archdaily-light text-archdaily",
        className
      )}
    >
      {source === "gooood" ? "古德建筑" : "ArchDaily"}
    </span>
  );
}
