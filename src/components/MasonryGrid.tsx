import type { DesignCase } from "@/lib/mock-data"
import { CaseCard } from "./CaseCard"

interface MasonryGridProps {
  cases: DesignCase[];
}

export function MasonryGrid({ cases }: MasonryGridProps) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 py-6">
      {cases.map((item, index) => (
        <CaseCard key={item.id} item={item} index={index} />
      ))}
    </div>
  );
}
