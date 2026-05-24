import { cn } from "@/lib/utils"

interface DateTab {
  label: string;
  sublabel: string;
  daysAgo: number;
}

interface DateTabsProps {
  tabs: DateTab[];
  selected: number;
  onSelect: (daysAgo: number) => void;
}

export function DateTabs({ tabs, selected, onSelect }: DateTabsProps) {
  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50 -mx-4 px-4 sm:-mx-6 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <nav className="flex gap-1 overflow-x-auto scrollbar-hide py-3" aria-label="日期选择">
          {tabs.map((tab) => (
            <button
              key={tab.daysAgo}
              onClick={() => onSelect(tab.daysAgo)}
              className={cn(
                "relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-250 ease-smooth",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                selected === tab.daysAgo
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <span>{tab.label}</span>
              {tab.sublabel && (
                <span className={cn(
                  "ml-1.5 text-xs",
                  selected === tab.daysAgo ? "text-background/60" : "text-muted-foreground/50"
                )}>
                  {tab.sublabel}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
