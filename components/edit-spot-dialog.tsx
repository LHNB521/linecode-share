"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Spot } from "@/lib/storage"
import { HANGZHOU_DISTRICTS } from "@/lib/districts"
import Image from "next/image"
import { X } from "lucide-react"

interface EditSpotDialogProps {
  spot: Spot
  onClose: () => void
  onUpdate: () => void
}

export function EditSpotDialog({ spot, onClose, onUpdate }: EditSpotDialogProps) {
  const [formData, setFormData] = useState({
    category: spot.category,
    name: spot.name,
    type: spot.type,
    city: spot.city,
    district: spot.district,
    location: spot.location,
    averagePrice: spot.averagePrice,
    review: spot.review,
    image: spot.image,
  })
  const [categories, setCategories] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>(spot.image)

  useEffect(() => {
    async function loadCategories() {
      const response = await fetch("/api/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    }
    loadCategories()
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        setFormData((prev) => ({ ...prev, image: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/spots/${spot.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error("Error updating spot:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>编辑分享</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">分类 *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">名称 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">类型</Label>
              <Input
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                placeholder="如：川菜、湘菜等"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">城市 *</Label>
              <Input id="city" value={formData.city} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">区域 *</Label>
              <Select
                value={formData.district}
                onValueChange={(value) => setFormData({ ...formData, district: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HANGZHOU_DISTRICTS.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">具体位置</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="如：西湖文化广场"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="averagePrice">人均消费</Label>
              <Input
                id="averagePrice"
                value={formData.averagePrice}
                onChange={(e) => setFormData({ ...formData, averagePrice: e.target.value })}
                placeholder="如：50-100元"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="review">评价 *</Label>
            <Textarea
              id="review"
              value={formData.review}
              onChange={(e) => setFormData({ ...formData, review: e.target.value })}
              placeholder="分享你的体验..."
              rows={4}
              maxLength={100}
              required
            />
            <p className="text-xs text-muted-foreground">{formData.review.length}/100</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">图片</Label>
            {imagePreview && (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                <Image src={imagePreview || "/placeholder.svg"} alt="预览" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview("")
                    setFormData({ ...formData, image: "" })
                  }}
                  className="absolute top-1 right-1 p-1 bg-background/80 rounded-full hover:bg-background"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "保存中..." : "保存"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
