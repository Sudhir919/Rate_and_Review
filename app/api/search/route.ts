import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const category = searchParams.get("category")
    const minRating = searchParams.get("minRating")
    const sortBy = searchParams.get("sortBy") || "name"

    const whereConditions = []
    const queryParams = []

    if (query) {
      whereConditions.push(
        `(p.name ILIKE $${queryParams.length + 1} OR p.description ILIKE $${queryParams.length + 1})`,
      )
      queryParams.push(`%${query}%`)
    }

    if (category && category !== "all") {
      whereConditions.push(`p.category = $${queryParams.length + 1}`)
      queryParams.push(category)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

    let orderClause = "ORDER BY p.name ASC"
    if (sortBy === "rating") {
      orderClause = "ORDER BY average_rating DESC, p.name ASC"
    } else if (sortBy === "price_low") {
      orderClause = "ORDER BY p.price ASC"
    } else if (sortBy === "price_high") {
      orderClause = "ORDER BY p.price DESC"
    } else if (sortBy === "newest") {
      orderClause = "ORDER BY p.created_at DESC"
    }

    const products = await sql`
      SELECT 
        p.*,
        COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0)::float as average_rating,
        COUNT(r.id)::int as total_reviews
      FROM products p
      LEFT JOIN reviews r ON p.id = r.product_id
      ${whereClause ? sql.unsafe(whereClause) : sql``}
      GROUP BY p.id
      ${minRating ? sql`HAVING COALESCE(AVG(r.rating), 0) >= ${Number.parseFloat(minRating)}` : sql``}
      ${sql.unsafe(orderClause)}
    `

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error searching products:", error)
    return NextResponse.json({ error: "Failed to search products" }, { status: 500 })
  }
}
