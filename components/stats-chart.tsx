"use client"

import { useEffect, useRef } from "react"
import type { Spot } from "@/lib/storage"
import * as echarts from "echarts"

interface StatsChartProps {
  spots: Spot[]
}

export function StatsChart({ spots }: StatsChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current) return

    const chart = echarts.init(chartRef.current)

    // 统计各分类数量
    const categoryCount: Record<string, number> = {}
    spots.forEach((spot) => {
      categoryCount[spot.category] = (categoryCount[spot.category] || 0) + 1
    })

    const categories = Object.keys(categoryCount)
    const values = Object.values(categoryCount)

    const option = {
      backgroundColor: "transparent",
      title: {
        text: "分类统计",
        textStyle: {
          color: "#22d3ee",
          fontSize: 16,
        },
      },
      grid: {
        left: "10%",
        right: "10%",
        bottom: "15%",
        top: "20%",
      },
      xAxis: {
        type: "category",
        data: categories,
        axisLine: {
          lineStyle: {
            color: "#06b6d4",
          },
        },
        axisLabel: {
          color: "#94a3b8",
          fontSize: 11,
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            color: "#06b6d4",
          },
        },
        axisLabel: {
          color: "#94a3b8",
        },
        splitLine: {
          lineStyle: {
            color: "#334155",
            type: "dashed",
          },
        },
      },
      series: [
        {
          data: values,
          type: "bar",
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#06b6d4" },
              { offset: 1, color: "#3b82f6" },
            ]),
            borderRadius: [4, 4, 0, 0],
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#22d3ee" },
                { offset: 1, color: "#60a5fa" },
              ]),
            },
          },
        },
      ],
    }

    chart.setOption(option)

    const handleResize = () => chart.resize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      chart.dispose()
    }
  }, [spots])

  return (
    <div className="h-full bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-lg border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)] p-4">
      <div ref={chartRef} className="w-full h-full" />
    </div>
  )
}
