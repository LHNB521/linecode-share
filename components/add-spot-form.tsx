"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Upload, Plus } from "lucide-react"
import { addSpot, getCategories, addCategory } from "@/lib/storage"
import { CITIES, DISTRICTS } from "@/lib/districts"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

const THANK_YOU_MESSAGES = [
  "感谢你的精彩分享！你的体验将帮助更多人发现美好！",
  "太棒了！你的分享让这个世界更加精彩！",
  "谢谢你的用心记录！期待你的下一次分享！",
  "你的分享真是太有价值了！继续加油！",
  "感谢分享！你的足迹将成为他人的向导！",
  "真棒！你的每一次分享都在传递美好！",
  "谢谢你！因为有你的分享，世界更加丰富多彩！",
]

export function AddSpotForm() {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    category: "",
    name: "",
    type: "",
    city: "杭州", // 默认选择杭州
    district: "",
    location: "", // 具体位置（非必填）
    averagePrice: "", // 人均消费（非必填）
    review: "",
  })

  const [imagePreview, setImagePreview] = useState<string>("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const availableDistricts = DISTRICTS[formData.city] || []

  useEffect(() => {
    async function loadData() {
      const loadedCategories = await getCategories()
      setCategories(loadedCategories)
    }
    loadData()
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview("")
    setImageFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      const success = await addCategory(newCategory.trim())
      if (success) {
        const updatedCategories = await getCategories()
        setCategories(updatedCategories)
        setFormData({ ...formData, category: newCategory.trim() })
        setNewCategory("")
        setShowNewCategory(false)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.category || !formData.name || !formData.city || !formData.district || !formData.review) {
      toast({
        title: "请填写必填项",
        description: "分类、名称、城市、区域和评价为必填项",
        variant: "destructive",
      })
      return
    }

    if (formData.review.length > 100) {
      toast({
        title: "评价过长",
        description: "评价不能超过100字",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await addSpot({
        ...formData,
        image: imagePreview,
      })

      if (result) {
        const randomMessage = THANK_YOU_MESSAGES[Math.floor(Math.random() * THANK_YOU_MESSAGES.length)]

        toast({
          title: "保存成功！",
          description: randomMessage,
        })

        // Redirect after a short delay to let user see the message
        setTimeout(() => {
          router.push("/")
        }, 1500)
      } else {
        throw new Error("Failed to add spot")
      }
    } catch (error) {
      toast({
        title: "添加失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>分享详情</CardTitle>
        <CardDescription>填写以下信息来添加你的分享</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">
              分类 <span className="text-destructive">*</span>
            </Label>
            {showNewCategory ? (
              <div className="flex gap-2">
                <Input
                  placeholder="输入新分类"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddCategory} className="shrink-0">
                  添加
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowNewCategory(false)} className="shrink-0">
                  取消
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="category" className="flex-1">
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowNewCategory(true)}
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              名称 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="例如：黄山风景区"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">类型</Label>
            <Input
              id="type"
              placeholder="例如：自然风光、川菜、主题乐园"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">
                城市 <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.city}
                onValueChange={(value) => setFormData({ ...formData, city: value, district: "" })}
              >
                <SelectTrigger id="city">
                  <SelectValue placeholder="选择城市" />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* District */}
            <div className="space-y-2">
              <Label htmlFor="district">
                区域 <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.district}
                onValueChange={(value) => setFormData({ ...formData, district: value })}
              >
                <SelectTrigger id="district">
                  <SelectValue placeholder="选择区域" />
                </SelectTrigger>
                <SelectContent>
                  {availableDistricts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">具体位置</Label>
            <Input
              id="location"
              placeholder="例如：西湖景区断桥残雪"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          {/* Average Price */}
          <div className="space-y-2">
            <Label htmlFor="averagePrice">人均消费</Label>
            <Input
              id="averagePrice"
              placeholder="例如：50-100元 或 免费"
              value={formData.averagePrice}
              onChange={(e) => setFormData({ ...formData, averagePrice: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">可以填写一个范围，如：50-100元</p>
          </div>

          {/* Review */}
          <div className="space-y-2">
            <Label htmlFor="review">
              评价 <span className="text-destructive">*</span>
              <span className="ml-2 text-xs text-muted-foreground">({formData.review.length}/100)</span>
            </Label>
            <Textarea
              id="review"
              placeholder="分享你的体验和感受..."
              value={formData.review}
              onChange={(e) => setFormData({ ...formData, review: e.target.value })}
              maxLength={100}
              rows={4}
              required
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>图片分享</Label>
            {imagePreview ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
                <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 hover:bg-muted transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">点击上传图片</p>
                <p className="text-xs text-muted-foreground mt-1">支持 JPG、PNG 格式</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "保存中..." : "保存分享"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/")} disabled={isSubmitting}>
              取消
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
