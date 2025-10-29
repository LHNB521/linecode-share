"use client"

import { useState, useEffect } from "react"
import type { Spot } from "@/lib/storage"
import Image from "next/image"

interface SpotsListProps {
  spots: Spot[]
}

export function SpotsList({ spots }: SpotsListProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (spots.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % spots.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [spots.length])

  const displaySpots = []
  for (let i = 0; i < 5; i++) {
    if (spots.length > 0) {
      displaySpots.push(spots[(currentIndex + i) % spots.length])
    }
  }

  return (
    <div className="h-full bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-lg border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)] p-4 flex flex-col">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-cyan-400">分享列表</h2>
      </div>

      <div className="flex-1 space-y-3 overflow-hidden">
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
        {spots.length > 0 ? `共 ${spots.length} 条分享` : "暂无分享"}
      </div>
    </div>
  )
}
