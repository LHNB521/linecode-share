"use client"

import { useState } from "react"
import type { Spot } from "@/lib/storage"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import Image from "next/image"

interface LuckyGameProps {
  spots: Spot[]
}

const funnyMessages = [
  "命运的齿轮开始转动了！",
  "让我康康今天去哪里浪~",
  "闭上眼睛，跟着感觉走！",
  "这个选择，绝了！",
  "恭喜你，抽中了快乐！",
  "就决定是你了！",
  "今天就去这里吧，不许反悔哦~",
  "缘分让我们相遇在这里！",
]

export function LuckyGame({ spots }: LuckyGameProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<Spot | null>(null)
  const [message, setMessage] = useState("")

  const categories = Array.from(new Set(spots.map((s) => s.category)))

  const handleSpin = () => {
    const filteredSpots = selectedCategory === "all" ? spots : spots.filter((s) => s.category === selectedCategory)

    if (filteredSpots.length === 0) {
      setMessage("该分类下还没有分享哦~")
      return
    }

    setIsSpinning(true)
    setResult(null)
    setMessage("")

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * filteredSpots.length)
      const randomSpot = filteredSpots[randomIndex]
      const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)]

      setResult(randomSpot)
      setMessage(randomMessage)
      setIsSpinning(false)
    }, 2000)
  }

  return (
    <div className="h-full bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-lg border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)] p-4 flex flex-col">
      <h2 className="text-xl font-bold text-cyan-400 mb-4">幸运抽奖</h2>

      <div className="space-y-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-white">
            <SelectValue placeholder="全部分类" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-cyan-500/30">
            <SelectItem value="all">全部分类</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={handleSpin}
          disabled={isSpinning}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-6 text-lg"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          {isSpinning ? "抽奖中..." : "开始抽奖"}
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center my-6">
        {isSpinning ? (
          <div className="relative w-48 h-48">
            <div className="absolute inset-0 rounded-full border-8 border-cyan-500/30 animate-spin">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.8)]" />
            </div>
            <div className="absolute inset-4 rounded-full border-8 border-blue-500/30 animate-spin animation-delay-500">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-400 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.8)]" />
            </div>
            <div className="absolute inset-8 rounded-full border-8 border-purple-500/30 animate-spin animation-delay-1000">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-purple-400 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.8)]" />
            </div>
          </div>
        ) : result ? (
          <div className="text-center animate-in zoom-in duration-500">
            {result.image && (
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                <Image src={result.image || "/placeholder.svg"} alt={result.name} fill className="object-cover" />
              </div>
            )}
            <h3 className="text-2xl font-bold text-cyan-300 mb-2">{result.name}</h3>
            <p className="text-gray-400 text-sm mb-1">
              {result.district} · {result.category}
            </p>
            {result.averagePrice && <p className="text-yellow-400 text-sm mb-2">💰 {result.averagePrice}</p>}
            <p className="text-gray-500 text-xs line-clamp-3">{result.review}</p>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-cyan-500/30" />
            <p>选择分类后点击按钮</p>
            <p className="text-sm">开始你的幸运之旅</p>
          </div>
        )}
      </div>

      {message && (
        <div className="text-center p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <p className="text-cyan-300 font-medium">{message}</p>
        </div>
      )}
    </div>
  )
}
