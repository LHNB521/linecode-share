import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import type { Spot } from "@/lib/storage"

const DATA_DIR = path.join(process.cwd(), "data")
const SPOTS_FILE = path.join(DATA_DIR, "spots.json")
const IMAGES_DIR = path.join(DATA_DIR, "images")

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.mkdir(IMAGES_DIR, { recursive: true })
  } catch (error) {
    console.error("Error creating data directory:", error)
  }
}

// Read spots from file
async function readSpots(): Promise<Spot[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(SPOTS_FILE, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    // File doesn't exist yet, return empty array
    return []
  }
}

// Write spots to file
async function writeSpots(spots: Spot[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(SPOTS_FILE, JSON.stringify(spots, null, 2), "utf-8")
}

// Save base64 image to file
async function saveImage(base64Data: string, spotId: string): Promise<string> {
  if (!base64Data || !base64Data.startsWith("data:image")) {
    return ""
  }

  try {
    await ensureDataDir()

    // Extract image format and data
    const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/)
    if (!matches) return ""

    const [, format, data] = matches
    const filename = `${spotId}.${format}`
    const filepath = path.join(IMAGES_DIR, filename)

    // Save image file
    await fs.writeFile(filepath, Buffer.from(data, "base64"))

    // Return relative path for serving
    return `/api/images/${filename}`
  } catch (error) {
    console.error("Error saving image:", error)
    return ""
  }
}

// GET - Retrieve all spots
export async function GET() {
  try {
    const spots = await readSpots()
    return NextResponse.json({ spots })
  } catch (error) {
    console.error("Error reading spots:", error)
    return NextResponse.json({ error: "Failed to read spots" }, { status: 500 })
  }
}

// POST - Add a new spot
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { category, name, type, city, district, location, averagePrice, review, image } = body

    // Validate required fields
    if (!category || !name || !city || !district || !review) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new spot
    const newSpot: Spot = {
      id: Date.now().toString(),
      category,
      name,
      type: type || "",
      city,
      district,
      location: location || "",
      averagePrice: averagePrice || "",
      review,
      image: "",
      createdAt: new Date().toISOString(),
    }

    // Save image if provided
    if (image) {
      newSpot.image = await saveImage(image, newSpot.id)
    }

    // Read existing spots and add new one
    const spots = await readSpots()
    spots.unshift(newSpot)
    await writeSpots(spots)

    return NextResponse.json({ spot: newSpot })
  } catch (error) {
    console.error("Error adding spot:", error)
    return NextResponse.json({ error: "Failed to add spot" }, { status: 500 })
  }
}
