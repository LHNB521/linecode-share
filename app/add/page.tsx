import { AddSpotForm } from "@/components/add-spot-form"
import { Header } from "@/components/header"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AddPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              返回首页
            </Button>
          </Link>
        </div>

        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-balance">添加新分享</h1>
            <p className="mt-2 text-muted-foreground">记录你的美好体验，分享给更多人</p>
          </div>

          <AddSpotForm />
        </div>
      </main>
    </div>
  )
}
