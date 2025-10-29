import { SpotsTable } from "@/components/spots-table"
import { Header } from "@/components/header"
import { WelcomeDialog } from "@/components/welcome-dialog"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <SpotsTable />
      </main>
      <WelcomeDialog />
    </div>
  )
}
