"use client"

import { Mountain, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Mountain className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold text-foreground">生活分享</span>
        </Link>

        <div className="flex gap-3">
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2 bg-transparent">
              <span className="hidden sm:inline">数据大屏</span>
              <span className="sm:hidden">大屏</span>
            </Button>
          </Link>
          <Link href="/add">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">添加分享</span>
              <span className="sm:hidden">添加</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
