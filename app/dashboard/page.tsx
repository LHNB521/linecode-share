"use client"

import { useEffect, useState } from "react"
import { getSpots, type Spot } from "@/lib/storage"
import { SpotsList } from "@/components/spots-list-scroll"
import { DataCharts } from "@/components/data-charts"
import { LuckyGame } from "@/components/lucky-game"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function DashboardPage() {
  const [spots, setSpots] = useState<Spot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSpots()
  }, [])

  const loadSpots = async () => {
    const data = await getSpots()
    setSpots(data)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
        <div className="text-cyan-400 text-xl">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white overflow-auto">
      <Link
        href="/"
        className="fixed top-4 left-4 z-50 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors bg-slate-900/80 px-3 py-2 rounded-lg backdrop-blur-sm"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="hidden sm:inline">返回首页</span>
      </Link>

      <div className="text-center py-4 sm:py-6">
        <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent px-4">
          生活分享数据大屏
        </h1>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 px-4 pb-4">
        <div className="lg:col-span-3 h-[500px] lg:h-[calc(100vh-140px)]">
          <SpotsList spots={spots} />
        </div>

        <div className="lg:col-span-6 h-auto lg:h-[calc(100vh-140px)]">
          <DataCharts spots={spots} />
        </div>

        {/* 右侧游戏 */}
        <div className="lg:col-span-3 h-[600px] lg:h-[calc(100vh-140px)]">
          <LuckyGame spots={spots} />
        </div>
      </div>
    </div>
  )
}
