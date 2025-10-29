"use client"

import { useEffect, useRef } from "react"
import type { Spot } from "@/lib/storage"
import * as echarts from "echarts"

interface DataChartsProps {
  spots: Spot[]
}

export function DataCharts({ spots }: DataChartsProps) {
  const categoryChartRef = useRef<HTMLDivElement>(null)
  const pieChartRef = useRef<HTMLDivElement>(null)
  const districtChartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!categoryChartRef.current || !pieChartRef.current || !districtChartRef.current) return

    // 分类柱状图
    const categoryChart = echarts.init(categoryChartRef.current)
    const categoryCount: Record<string, number> = {}
    spots.forEach((spot) => {
      categoryCount[spot.category] = (categoryCount[spot.category] || 0) + 1
    })

    categoryChart.setOption({
      backgroundColor: "transparent",
      title: {
        text: "分类统计",
        textStyle: { color: "#22d3ee", fontSize: 16 },
      },
      grid: { left: "15%", right: "10%", bottom: "15%", top: "20%" },
      xAxis: {
        type: "category",
        data: Object.keys(categoryCount),
        axisLine: { lineStyle: { color: "#06b6d4" } },
        axisLabel: { color: "#94a3b8", fontSize: 11 },
      },
      yAxis: {
        type: "value",
        axisLine: { lineStyle: { color: "#06b6d4" } },
        axisLabel: { color: "#94a3b8" },
        splitLine: { lineStyle: { color: "#334155", type: "dashed" } },
      },
      series: [
        {
          data: Object.values(categoryCount),
          type: "bar",
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#06b6d4" },
              { offset: 1, color: "#3b82f6" },
            ]),
            borderRadius: [4, 4, 0, 0],
          },
        },
      ],
    })

    // 分类饼状图
    const pieChart = echarts.init(pieChartRef.current)
    const pieData = Object.entries(categoryCount).map(([name, value]) => ({ name, value }))

    pieChart.setOption({
      backgroundColor: "transparent",
      title: {
        text: "分类占比",
        textStyle: { color: "#22d3ee", fontSize: 16 },
      },
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        borderColor: "#06b6d4",
        textStyle: { color: "#fff" },
      },
      legend: {
        orient: "vertical",
        right: "10%",
        top: "center",
        textStyle: { color: "#94a3b8" },
      },
      series: [
        {
          type: "pie",
          radius: ["40%", "70%"],
          center: ["35%", "50%"],
          data: pieData,
          itemStyle: {
            borderRadius: 8,
            borderColor: "#0a0e27",
            borderWidth: 2,
          },
          label: {
            color: "#94a3b8",
            fontSize: 12,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(6, 182, 212, 0.5)",
            },
          },
        },
      ],
      color: ["#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"],
    })

    // 区域分布图
    const districtChart = echarts.init(districtChartRef.current)
    const districtCount: Record<string, number> = {}
    spots.forEach((spot) => {
      districtCount[spot.district] = (districtCount[spot.district] || 0) + 1
    })

    districtChart.setOption({
      backgroundColor: "transparent",
      title: {
        text: "区域分布",
        textStyle: { color: "#22d3ee", fontSize: 16 },
      },
      grid: { left: "15%", right: "10%", bottom: "15%", top: "20%" },
      xAxis: {
        type: "value",
        axisLine: { lineStyle: { color: "#06b6d4" } },
        axisLabel: { color: "#94a3b8" },
        splitLine: { lineStyle: { color: "#334155", type: "dashed" } },
      },
      yAxis: {
        type: "category",
        data: Object.keys(districtCount),
        axisLine: { lineStyle: { color: "#06b6d4" } },
        axisLabel: { color: "#94a3b8", fontSize: 11 },
      },
      series: [
        {
          data: Object.values(districtCount),
          type: "bar",
          itemStyle: {
            color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
              { offset: 0, color: "#8b5cf6" },
              { offset: 1, color: "#ec4899" },
            ]),
            borderRadius: [0, 4, 4, 0],
          },
        },
      ],
    })

    const handleResize = () => {
      categoryChart.resize()
      pieChart.resize()
      districtChart.resize()
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      categoryChart.dispose()
      pieChart.dispose()
      districtChart.dispose()
    }
  }, [spots])

  return (
    <div className="h-full space-y-4">
      <div className="h-[calc(33.333%-0.67rem)] bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-lg border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)] p-4">
        <div ref={categoryChartRef} className="w-full h-full" />
      </div>
      <div className="h-[calc(33.333%-0.67rem)] bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-lg border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)] p-4">
        <div ref={pieChartRef} className="w-full h-full" />
      </div>
      <div className="h-[calc(33.333%-0.67rem)] bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-lg border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)] p-4">
        <div ref={districtChartRef} className="w-full h-full" />
      </div>
    </div>
  )
}
