import { SpotsTable } from "@/components/spots-table"
import { Header } from "@/components/header"
import { WelcomeDialog } from "@/components/welcome-dialog"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart3 } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-end">
          <Link href="/dashboard">
            <Button className="gap-2">
              <BarChart3 className="h-4 w-4" />
              数据大屏
            </Button>
          </Link>
        </div>
        <SpotsTable />
      </main>
      <WelcomeDialog />
    </div>
  )
}
