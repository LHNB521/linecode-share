import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const IMAGES_DIR = path.join(process.cwd(), "data", "images")

export async function GET(request: Request, { params }: { params: Promise<{ filename: string }> }) {
  try {
    const { filename } = await params
    const filepath = path.join(IMAGES_DIR, filename)

    // Read image file
    const imageBuffer = await fs.readFile(filepath)

    // Determine content type based on file extension
    const ext = path.extname(filename).toLowerCase()
    const contentType = ext === ".png" ? "image/png" : ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/webp"

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Error serving image:", error)
    return NextResponse.json({ error: "Image not found" }, { status: 404 })
  }
}
