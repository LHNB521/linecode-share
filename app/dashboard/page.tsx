"use client"

import { useEffect, useState } from "react"
import { getSpots, type Spot } from "@/lib/storage"
import { SpotsList } from "@/components/spots-list-scroll"
import { StatsChart } from "@/components/stats-chart"
import { MapView } from "@/components/map-view"
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
    <div className="min-h-screen bg-[#0a0e27] text-white overflow-hidden">
      {/* 返回按钮 */}
      <Link
        href="/"
        className="absolute top-4 left-4 z-50 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>返回首页</span>
      </Link>

      {/* 标题 */}
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          生活分享数据大屏
        </h1>
      </div>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-4 pb-4 h-[calc(100vh-120px)]">
        {/* 左侧栏 */}
        <div className="lg:col-span-3 space-y-4 flex flex-col">
          {/* 分享列表 */}
          <div className="flex-1 min-h-0">
            <SpotsList spots={spots} />
          </div>

          {/* 统计图表 */}
          <div className="h-[300px]">
            <StatsChart spots={spots} />
          </div>
        </div>

        {/* 中间地图 */}
        <div className="lg:col-span-6">
          <MapView spots={spots} />
        </div>

        {/* 右侧游戏 */}
        <div className="lg:col-span-3">
          <LuckyGame spots={spots} />
        </div>
      </div>
    </div>
  )
}
