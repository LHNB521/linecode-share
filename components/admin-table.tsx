"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Pencil, Trash2, LogOut } from "lucide-react"
import Image from "next/image"
import type { Spot } from "@/lib/storage"
import { EditSpotDialog } from "@/components/edit-spot-dialog"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"

interface AdminTableProps {
  onLogout: () => void
}

export function AdminTable({ onLogout }: AdminTableProps) {
  const [spots, setSpots] = useState<Spot[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSpot, setEditingSpot] = useState<Spot | null>(null)
  const [deletingSpot, setDeletingSpot] = useState<Spot | null>(null)

  const loadSpots = async () => {
    try {
      const response = await fetch("/api/spots")
      if (response.ok) {
        const data = await response.json()
        setSpots(data.spots || [])
      }
    } catch (error) {
      console.error("Error loading spots:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSpots()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/spots/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await loadSpots()
        setDeletingSpot(null)
      }
    } catch (error) {
      console.error("Error deleting spot:", error)
    }
  }

  const handleUpdate = async () => {
    await loadSpots()
    setEditingSpot(null)
  }

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">加载中...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">管理后台</h1>
          <p className="text-muted-foreground mt-1">管理所有分享内容</p>
        </div>
        <Button variant="outline" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          退出登录
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">共 {spots.length} 条记录</div>

      {spots.length === 0 ? (
        <div className="border rounded-lg p-12">
          <div className="text-center text-muted-foreground">
            <p className="text-lg">暂无数据</p>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg">
          <div className="overflow-x-auto">
            <Table className="min-w-[1000px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">图片</TableHead>
                  <TableHead className="min-w-[120px]">名称</TableHead>
                  <TableHead className="min-w-[80px]">分类</TableHead>
                  <TableHead className="min-w-[100px]">类型</TableHead>
                  <TableHead className="min-w-[120px]">区域</TableHead>
                  <TableHead className="min-w-[100px]">人均消费</TableHead>
                  <TableHead className="min-w-[200px]">评价</TableHead>
                  <TableHead className="min-w-[100px]">日期</TableHead>
                  <TableHead className="w-[120px] text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {spots.map((spot) => (
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
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setEditingSpot(spot)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeletingSpot(spot)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {editingSpot && (
        <EditSpotDialog spot={editingSpot} onClose={() => setEditingSpot(null)} onUpdate={handleUpdate} />
      )}

      {deletingSpot && (
        <DeleteConfirmDialog
          spot={deletingSpot}
          onClose={() => setDeletingSpot(null)}
          onConfirm={() => handleDelete(deletingSpot.id)}
        />
      )}
    </div>
  )
}
