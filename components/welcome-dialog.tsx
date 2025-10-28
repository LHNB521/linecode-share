"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const WELCOME_MESSAGES = [
  "欢迎来到生活分享平台！记录你探店、爬山、游玩的每一个精彩瞬间，让美好被更多人看见！",
  "发现生活中的美好时刻！分享你的探店体验、登山足迹和游玩乐趣，一起创造回忆！",
  "你好！这里是你的生活记录本。无论是美食探店、户外爬山还是城市游玩，都值得被记录和分享！",
  "开启你的分享之旅！把那些令你心动的餐厅、震撼的山景、有趣的游玩地点分享给大家吧！",
  "欢迎加入我们！用镜头和文字记录生活，分享你的探店心得、登山经历和游玩攻略！",
]

export function WelcomeDialog() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem("hasVisited")

    if (!hasVisited) {
      // First time visitor - show welcome message
      const randomMessage = WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)]
      setMessage(randomMessage)
      setOpen(true)

      // Mark as visited
      localStorage.setItem("hasVisited", "true")
    }
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">欢迎来到生活分享平台</DialogTitle>
          <DialogDescription className="text-base pt-4 leading-relaxed">{message}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end pt-4">
          <Button onClick={() => setOpen(false)}>开始探索</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
