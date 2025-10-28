import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json")
const DEFAULT_CATEGORIES = ["爬山", "餐厅", "游玩"]

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    console.error("Error creating data directory:", error)
  }
}

async function readCategories(): Promise<string[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(CATEGORIES_FILE, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    // File doesn't exist, return defaults
    await writeCategories(DEFAULT_CATEGORIES)
    return DEFAULT_CATEGORIES
  }
}

async function writeCategories(categories: string[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(CATEGORIES_FILE, JSON.stringify(categories, null, 2), "utf-8")
}

export async function GET() {
  try {
    const categories = await readCategories()
    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Error reading categories:", error)
    return NextResponse.json({ error: "Failed to read categories" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { category } = await request.json()

    if (!category || typeof category !== "string") {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 })
    }

    const categories = await readCategories()

    if (!categories.includes(category)) {
      categories.push(category)
      await writeCategories(categories)
    }

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Error adding category:", error)
    return NextResponse.json({ error: "Failed to add category" }, { status: 500 })
  }
}
