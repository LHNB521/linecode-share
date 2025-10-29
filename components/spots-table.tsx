"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Search } from "lucide-react"
import Image from "next/image"
import type { Spot } from "@/lib/storage"

export function SpotsTable() {
  const [spots, setSpots] = useState<Spot[]>([])
  const [filteredSpots, setFilteredSpots] = useState<Spot[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSpots() {
      try {
        const response = await fetch("/api/spots")
        if (response.ok) {
          const data = await response.json()
          setSpots(data.spots || [])
          setFilteredSpots(data.spots || [])

          // Extract unique categories
          const uniqueCategories = Array.from(new Set((data.spots || []).map((spot: Spot) => spot.category)))
          setCategories(uniqueCategories)
        }
      } catch (error) {
        console.error("Error loading spots:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSpots()
  }, [])

  useEffect(() => {
    let filtered = spots

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((spot) => spot.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (spot) =>
          spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          spot.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          spot.district?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          spot.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          spot.review.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredSpots(filtered)
  }, [selectedCategory, searchQuery, spots])

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">加载中...</div>
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索名称、区域或评价..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部分类</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">共找到 {filteredSpots.length} 个分享</div>

      {/* Table */}
      {filteredSpots.length === 0 ? (
        <div className="border rounded-lg p-12">
          <div className="text-center text-muted-foreground">
            <p className="text-lg mb-2">暂无分享内容</p>
            <p className="text-sm">点击右上角"添加分享"按钮开始记录你的美好时光</p>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-280px)] scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            <Table className="min-w-[800px]">
              <TableHeader className="sticky top-0 bg-background z-10 shadow-sm border-b">
                <TableRow>
                  <TableHead className="w-[80px] bg-background">图片</TableHead>
                  <TableHead className="min-w-[120px] bg-background">名称</TableHead>
                  <TableHead className="min-w-[80px] bg-background">分类</TableHead>
                  <TableHead className="min-w-[100px] bg-background">类型</TableHead>
                  <TableHead className="min-w-[120px] bg-background">区域</TableHead>
                  <TableHead className="min-w-[100px] bg-background">人均消费</TableHead>
                  <TableHead className="min-w-[200px] bg-background">评价</TableHead>
                  <TableHead className="min-w-[100px] bg-background">日期</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSpots.map((spot) => (
                  <TableRow key={spot.id}>
                    <TableCell>
                      {spot.image ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded border hover:opacity-80 transition-opacity">
                              <Image
                                src={spot.image || "/placeholder.svg"}
                                alt={spot.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                              <Image
                                src={spot.image || "/placeholder.svg"}
                                alt={spot.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <div className="h-16 w-16 rounded border bg-muted flex items-center justify-center text-xs text-muted-foreground">
                          无图片
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{spot.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{spot.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {spot.type ? (
                        <Badge variant="outline">{spot.type}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          {spot.city} · {spot.district}
                        </div>
                        {spot.location && <div className="text-xs text-muted-foreground">{spot.location}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      {spot.averagePrice ? (
                        <span className="text-sm">{spot.averagePrice}</span>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <p className="text-sm text-muted-foreground line-clamp-2">{spot.review}</p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(spot.createdAt).toLocaleDateString("zh-CN")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}
