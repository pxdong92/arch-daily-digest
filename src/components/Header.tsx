import { Clock } from "lucide-react"

interface HeaderProps {
  lastUpdated: string;
}

export function Header({ lastUpdated }: HeaderProps) {
  return (
    <header className="pt-10 pb-6 px-4 sm:pt-14 sm:pb-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          建筑灵感日报
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          每日精选全球建筑设计案例
        </p>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground/60">
          <Clock className="h-3 w-3" />
          <span>数据更新于 {lastUpdated}</span>
        </div>
      </div>
    </header>
  );
}
