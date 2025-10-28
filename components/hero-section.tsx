import { Button } from "@/components/ui/button"
// import { Sparkles, Upload, Play, ChevronDown } from "path-to-icons" // Import necessary icons

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-teal-950 dark:via-cyan-950 dark:to-blue-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-400/20 dark:bg-teal-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/20 dark:bg-cyan-500/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 dark:bg-teal-900/50 border border-teal-200 dark:border-teal-800">
            {/* <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" /> */}
            <span className="text-sm font-medium text-teal-700 dark:text-teal-300">Share Smarter, Not Harder</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">
            <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 dark:from-teal-400 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
              Share Anything
            </span>
            <br />
            <span className="text-foreground">Instantly & Securely</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Drop your files, generate a link, and share with anyone. No sign-ups, no hassle, just pure simplicity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
            >
              {/* <Upload className="w-5 h-5 mr-2" /> */}
              Start Sharing
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
              {/* <Play className="w-5 h-5 mr-2" /> */}
              Watch Demo
            </Button>
          </div>

          <div className="flex flex-wrap gap-6 justify-center pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-teal-500" />
              <span>10M+ Files Shared</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500" />
              <span>256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>No Size Limits</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        {/* <ChevronDown className="w-6 h-6 text-muted-foreground" /> */}
      </div>
    </section>
  )
}
