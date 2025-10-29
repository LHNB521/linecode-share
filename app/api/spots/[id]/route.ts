import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import type { Spot } from "@/lib/storage"

const DATA_DIR = path.join(process.cwd(), "data")
const SPOTS_FILE = path.join(DATA_DIR, "spots.json")
const IMAGES_DIR = path.join(DATA_DIR, "images")

async function readSpots(): Promise<Spot[]> {
  try {
    const data = await fs.readFile(SPOTS_FILE, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

async function writeSpots(spots: Spot[]): Promise<void> {
  await fs.writeFile(SPOTS_FILE, JSON.stringify(spots, null, 2), "utf-8")
}

async function saveImage(base64Data: string, spotId: string): Promise<string> {
  if (!base64Data || !base64Data.startsWith("data:image")) {
    return ""
  }

  try {
    const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/)
    if (!matches) return ""

    const [, format, data] = matches
    const filename = `${spotId}.${format}`
    const filepath = path.join(IMAGES_DIR, filename)

    await fs.writeFile(filepath, Buffer.from(data, "base64"))
    return `/api/images/${filename}`
  } catch (error) {
    console.error("Error saving image:", error)
    return ""
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    console.log("[v0] DELETE request for spot ID:", id)

    const spots = await readSpots()
    console.log("[v0] Total spots:", spots.length)
    console.log(
      "[v0] Spot IDs:",
      spots.map((s) => s.id),
    )

    const spotIndex = spots.findIndex((s) => s.id === id)
    console.log("[v0] Found spot at index:", spotIndex)

    if (spotIndex === -1) {
      return NextResponse.json({ error: "Spot not found" }, { status: 404 })
    }

    // Remove the spot
    spots.splice(spotIndex, 1)
    await writeSpots(spots)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting spot:", error)
    return NextResponse.json({ error: "Failed to delete spot" }, { status: 500 })
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    console.log("[v0] PUT request for spot ID:", id)

    const body = await request.json()
    const spots = await readSpots()
    console.log("[v0] Total spots:", spots.length)
    console.log(
      "[v0] Spot IDs:",
      spots.map((s) => s.id),
    )

    const spotIndex = spots.findIndex((s) => s.id === id)
    console.log("[v0] Found spot at index:", spotIndex)

    if (spotIndex === -1) {
      return NextResponse.json({ error: "Spot not found" }, { status: 404 })
    }

    const existingSpot = spots[spotIndex]

    // Handle image update
    let imageUrl = existingSpot.image
    if (body.image && body.image.startsWith("data:image")) {
      imageUrl = await saveImage(body.image, id)
    } else if (body.image) {
      imageUrl = body.image
    }

    // Update the spot
    spots[spotIndex] = {
      ...existingSpot,
      category: body.category,
      name: body.name,
      type: body.type || "",
      city: body.city,
      district: body.district,
      location: body.location || "",
      averagePrice: body.averagePrice || "",
      review: body.review,
      image: imageUrl,
    }

    await writeSpots(spots)

    return NextResponse.json({ spot: spots[spotIndex] })
  } catch (error) {
    console.error("Error updating spot:", error)
    return NextResponse.json({ error: "Failed to update spot" }, { status: 500 })
  }
}
