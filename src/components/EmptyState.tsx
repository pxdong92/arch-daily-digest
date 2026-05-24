import { Inbox } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-5">
        <Inbox className="h-8 w-8 text-muted-foreground/40" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-1.5">
        今日数据正在收集中
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        每天 00:00 自动更新，请稍后再来查看
      </p>
    </div>
  );
}
