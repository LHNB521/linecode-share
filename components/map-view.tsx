"use client"

import { useEffect, useRef } from "react"
import type { Spot } from "@/lib/storage"
import * as echarts from "echarts"

interface MapViewProps {
  spots: Spot[]
}

// 杭州各区的大致坐标
const districtCoords: Record<string, [number, number]> = {
  西湖区: [120.13, 30.26],
  上城区: [120.17, 30.25],
  拱墅区: [120.15, 30.32],
  余杭区: [120.3, 30.42],
  临平区: [120.3, 30.42],
  钱塘区: [120.52, 30.35],
  萧山区: [120.27, 30.18],
  滨江区: [120.21, 30.21],
  富阳区: [119.96, 30.05],
  临安区: [119.72, 30.23],
  桐庐县: [119.69, 29.79],
  淳安县: [119.04, 29.61],
  建德市: [119.28, 29.48],
}

export function MapView({ spots }: MapViewProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current) return

    const chart = echarts.init(chartRef.current)

    // 统计各区域的分享数量
    const districtData: Record<string, { value: number; spots: Spot[] }> = {}
    spots.forEach((spot) => {
      if (!districtData[spot.district]) {
        districtData[spot.district] = { value: 0, spots: [] }
      }
      districtData[spot.district].value++
      districtData[spot.district].spots.push(spot)
    })

    // 生成散点数据
    const scatterData = Object.entries(districtData).map(([district, data]) => {
      const coord = districtCoords[district] || [120.15, 30.25]
      return {
        name: district,
        value: [...coord, data.value],
        spots: data.spots,
      }
    })

    const option = {
      backgroundColor: "transparent",
      title: {
        text: "杭州分享地图",
        textStyle: {
          color: "#22d3ee",
          fontSize: 18,
        },
        left: "center",
        top: 10,
      },
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        borderColor: "#06b6d4",
        textStyle: {
          color: "#fff",
        },
        formatter: (params: any) => {
          if (params.componentSubType === "scatter") {
            const spots = params.data.spots || []
            const spotsList = spots
              .slice(0, 3)
              .map((s: Spot) => `• ${s.name}`)
              .join("<br/>")
            return `
              <div style="padding: 5px;">
                <strong style="color: #22d3ee;">${params.name}</strong><br/>
                分享数量: ${params.value[2]}<br/>
                <div style="margin-top: 5px; font-size: 12px;">
                  ${spotsList}
                  ${spots.length > 3 ? `<br/>...等${spots.length}个地点` : ""}
                </div>
              </div>
            `
          }
          return params.name
        },
      },
      geo: {
        map: "hangzhou",
        roam: true,
        center: [120.15, 30.25],
        zoom: 1.2,
        itemStyle: {
          areaColor: "#1e293b",
          borderColor: "#334155",
        },
        emphasis: {
          itemStyle: {
            areaColor: "#334155",
          },
        },
        label: {
          show: true,
          color: "#64748b",
          fontSize: 10,
        },
      },
      series: [
        {
          type: "scatter",
          coordinateSystem: "geo",
          data: scatterData,
          symbolSize: (val: number[]) => Math.max(15, Math.min(val[2] * 8, 50)),
          itemStyle: {
            color: "#06b6d4",
            shadowBlur: 10,
            shadowColor: "rgba(6, 182, 212, 0.5)",
          },
          emphasis: {
            itemStyle: {
              color: "#22d3ee",
              shadowBlur: 20,
              shadowColor: "rgba(34, 211, 238, 0.8)",
            },
          },
          label: {
            show: true,
            formatter: "{b}",
            position: "top",
            color: "#22d3ee",
            fontSize: 11,
          },
        },
        {
          type: "effectScatter",
          coordinateSystem: "geo",
          data: scatterData.slice(0, 3),
          symbolSize: (val: number[]) => Math.max(15, Math.min(val[2] * 8, 50)),
          rippleEffect: {
            brushType: "stroke",
            scale: 3,
            period: 4,
          },
          itemStyle: {
            color: "#06b6d4",
            shadowBlur: 10,
            shadowColor: "#06b6d4",
          },
        },
      ],
    }

    // 注册简化的杭州地图
    echarts.registerMap("hangzhou", {
      type: "FeatureCollection",
      features: Object.entries(districtCoords).map(([name, coord]) => ({
        type: "Feature",
        properties: { name },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [coord[0] - 0.05, coord[1] - 0.05],
              [coord[0] + 0.05, coord[1] - 0.05],
              [coord[0] + 0.05, coord[1] + 0.05],
              [coord[0] - 0.05, coord[1] + 0.05],
              [coord[0] - 0.05, coord[1] - 0.05],
            ],
          ],
        },
      })),
    })

    chart.setOption(option)

    const handleResize = () => chart.resize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      chart.dispose()
    }
  }, [spots])

  return (
    <div className="h-full bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-lg border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
      <div ref={chartRef} className="w-full h-full" />
    </div>
  )
}
