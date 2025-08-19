import { Bot } from "lucide-react"

export function SidebarHeader() {
  return (
    <div className="flex items-center gap-3 px-2 py-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
        <Bot className="h-6 w-6 text-primary-foreground" />
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-semibold text-foreground">DecisionMaker</span>
        <span className="text-xs text-muted-foreground">Aide à la décision</span>
      </div>
    </div>
  )
}
