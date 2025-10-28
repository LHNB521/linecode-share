import { NextResponse } from "next/server"

const ADMIN_PASSWORD = "admin123"

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 })
  } catch (error) {
    console.error("Error in admin login:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
