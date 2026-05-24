import { useState, useEffect, useCallback } from "react"
import { Header } from "./components/Header"
import { DateTabs } from "./components/DateTabs"
import { MasonryGrid } from "./components/MasonryGrid"
import { LoadingSkeleton } from "./components/Skeleton"
import { EmptyState } from "./components/EmptyState"
import { getDateLabels } from "./lib/mock-data"
import { getCasesForDate, formatDate } from "./lib/api"
import type { DesignCase } from "./lib/mock-data"

function App() {
  const [selectedDaysAgo, setSelectedDaysAgo] = useState(0);
  const [cases, setCases] = useState<DesignCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(formatDate(0) + " 00:00");

  const dateLabels = getDateLabels();

  const loadCases = useCallback(async (daysAgo: number) => {
    setLoading(true);
    const result = await getCasesForDate(daysAgo);
    setCases(result.cases);
    setLastUpdated(result.lastUpdated);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadCases(selectedDaysAgo);
  }, [selectedDaysAgo, loadCases]);

  const handleSelectDate = (daysAgo: number) => {
    if (daysAgo !== selectedDaysAgo) {
      setSelectedDaysAgo(daysAgo);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header lastUpdated={lastUpdated} />

      <DateTabs
        tabs={dateLabels}
        selected={selectedDaysAgo}
        onSelect={handleSelectDate}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6">
        {loading ? (
          <LoadingSkeleton />
        ) : cases.length > 0 ? (
          <MasonryGrid cases={cases} />
        ) : (
          <EmptyState />
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 py-12 mt-8 border-t border-border/50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground/50">
          <p>
            数据来源:
            <a href="https://www.gooood.cn" target="_blank" rel="noopener noreferrer" className="ml-1 hover:text-muted-foreground transition-colors">古德建筑网</a>
            <span className="mx-1.5">·</span>
            <a href="https://www.archdaily.cn" target="_blank" rel="noopener noreferrer" className="hover:text-muted-foreground transition-colors">ArchDaily</a>
          </p>
          <p>每日 00:00 自动更新</p>
        </div>
      </footer>
    </div>
  );
}

export default App
