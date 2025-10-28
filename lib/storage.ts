export interface Spot {
  id: string
  category: string
  name: string
  type: string
  city: string // 城市（如：杭州）
  district: string // 区域（如：西湖区）
  location: string // 具体位置（非必填）
  averagePrice: string // 人均消费（非必填）
  review: string
  image: string
  createdAt: string
}

// API-based storage functions for server-side persistence

// Get spots from server
export async function getSpots(): Promise<Spot[]> {
  try {
    const response = await fetch("/api/spots")
    if (!response.ok) return []
    const data = await response.json()
    return data.spots || []
  } catch (error) {
    console.error("Error loading spots:", error)
    return []
  }
}

// Add a new spot via API
export async function addSpot(spotData: Omit<Spot, "id" | "createdAt">): Promise<Spot | null> {
  try {
    const response = await fetch("/api/spots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(spotData),
    })

    if (!response.ok) {
      throw new Error("Failed to add spot")
    }

    const data = await response.json()
    return data.spot
  } catch (error) {
    console.error("Error adding spot:", error)
    return null
  }
}

// Get categories from server
export async function getCategories(): Promise<string[]> {
  try {
    const response = await fetch("/api/categories")
    if (!response.ok) return []
    const data = await response.json()
    return data.categories || []
  } catch (error) {
    console.error("Error loading categories:", error)
    return []
  }
}

// Add a new category via API
export async function addCategory(category: string): Promise<boolean> {
  try {
    const response = await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category }),
    })

    return response.ok
  } catch (error) {
    console.error("Error adding category:", error)
    return false
  }
}

// Get areas from server
export async function getAreas(): Promise<string[]> {
  try {
    const response = await fetch("/api/areas")
    if (!response.ok) return []
    const data = await response.json()
    return data.areas || []
  } catch (error) {
    console.error("Error loading areas:", error)
    return []
  }
}

// Add a new area via API
export async function addArea(area: string): Promise<boolean> {
  try {
    const response = await fetch("/api/areas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ area }),
    })

    return response.ok
  } catch (error) {
    console.error("Error adding area:", error)
    return false
  }
}
