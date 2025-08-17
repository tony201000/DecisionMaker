"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface WithSidebarProps {
  children: React.ReactNode
  sidebarContent: React.ReactNode
}

export function WithSidebar({ children, sidebarContent }: WithSidebarProps) {
  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-border bg-card">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Sidebar & Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Ouvrir le menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="p-0 w-72"
            >
              {sidebarContent}
            </SheetContent>
          </Sheet>
          <span className="text-xl font-bold">DecisionMaker</span>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
