"use client"

import { useState, useEffect } from "react"
import type { Spot } from "@/lib/storage"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

interface SpotsListProps {
  spots: Spot[]
}

export function SpotsList({ spots }: SpotsListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [currentIndex, setCurrentIndex] = useState(0)

  const categories = Array.from(new Set(spots.map((s) => s.category)))
  const filteredSpots = selectedCategory === "all" ? spots : spots.filter((s) => s.category === selectedCategory)

  useEffect(() => {
    if (filteredSpots.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredSpots.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [filteredSpots.length])

  const displaySpots = filteredSpots.slice(currentIndex, currentIndex + 3)
  if (displaySpots.length < 3 && filteredSpots.length >= 3) {
    displaySpots.push(...filteredSpots.slice(0, 3 - displaySpots.length))
  }

  return (
    <div className="h-full bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-lg border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)] p-4 flex flex-col">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-cyan-400 mb-3">分享列表</h2>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-white">
            <SelectValue placeholder="全部分类" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-cyan-500/30">
            <SelectItem value="all">全部分类</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/50 scrollbar-track-slate-800/30">
        {displaySpots.map((spot, idx) => (
          <div
            key={`${spot.id}-${idx}`}
            className="bg-slate-800/30 rounded-lg p-3 border border-cyan-500/20 hover:border-cyan-500/50 transition-all animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            <div className="flex gap-3">
              {spot.image && (
                <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                  <Image src={spot.image || "/placeholder.svg"} alt={spot.name} fill className="object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-cyan-300 truncate">{spot.name}</h3>
                <p className="text-xs text-gray-400 truncate">
                  {spot.district} · {spot.category}
                </p>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{spot.review}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 text-center text-xs text-gray-500">
        {filteredSpots.length > 0 ? `共 ${filteredSpots.length} 条分享` : "暂无分享"}
      </div>
    </div>
  )
}
