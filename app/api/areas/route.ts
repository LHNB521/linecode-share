import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const AREAS_FILE = path.join(DATA_DIR, "areas.json")
const DEFAULT_AREAS = ["北京", "上海", "广州", "深圳", "杭州", "成都"]

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    console.error("Error creating data directory:", error)
  }
}

async function readAreas(): Promise<string[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(AREAS_FILE, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    // File doesn't exist, return defaults
    await writeAreas(DEFAULT_AREAS)
    return DEFAULT_AREAS
  }
}

async function writeAreas(areas: string[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(AREAS_FILE, JSON.stringify(areas, null, 2), "utf-8")
}

export async function GET() {
  try {
    const areas = await readAreas()
    return NextResponse.json({ areas })
  } catch (error) {
    console.error("Error reading areas:", error)
    return NextResponse.json({ error: "Failed to read areas" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { area } = await request.json()

    if (!area || typeof area !== "string") {
      return NextResponse.json({ error: "Invalid area" }, { status: 400 })
    }

    const areas = await readAreas()

    if (!areas.includes(area)) {
      areas.push(area)
      await writeAreas(areas)
    }

    return NextResponse.json({ areas })
  } catch (error) {
    console.error("Error adding area:", error)
    return NextResponse.json({ error: "Failed to add area" }, { status: 500 })
  }
}
